import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { initiateMap } from '../../public/loc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import {
  updateUserLocationReq,
  updateUserLocationSuccess,
} from 'redux/actions/user';
import { Map, LeafletMouseEvent, DragEndEvent, LatLng, Marker } from 'leaflet';
import { Button } from 'ui-kits/Button';
import { MapContainer } from './Location.styles';
import { Header } from 'ui-kits/Header';
import { Paragraph } from 'ui-kits/Paragraph';
import theme from 'theme';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import axios from 'axios';

const getNameForLocation = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<string> => {
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_KEY;
  let name;
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse.php?key=${ACCESS_TOKEN}&lat=${lat}&lon=${lng}&format=json`,
    );
    name = response.data.display_name;
  } catch {
    name = 'Something went wrong while fetching the Name of the location!';
  }
  return name;
};

// Used LeafletMouseEvent interface with the event of Geocoder on select event.
// This is a fake event.
interface Geocoder {
  on(event: 'select', cb: (event: LeafletMouseEvent) => void): void;
}

function createScriptTag(source: string, cb?: () => void): void {
  const script = document.createElement('script');
  script.src = source;
  if (cb) {
    script.onload = cb;
  }
  const position = document.querySelector('body');
  position?.appendChild(script);
}

const scriptSources = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.3/leaflet.js',
  'https://maps.locationiq.com/v2/libs/leaflet-geocoder/1.9.5/leaflet-geocoder-locationiq.min.js',
];

export const Location = () => {
  const { setShowModal } = useContext(RootContext) as RootContextProps;
  const [popupText, setPopupText] = useState<string>('');
  const [showPopupLoader, setShowPopupLoader] = useState(false);

  const { userLat, userLon } = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const isSignedIn = Boolean(token);
  const dispatch = useDispatch();

  const numOfScripts = scriptSources.length - 1;
  const scriptCBs: { (): void }[] = [];

  const [locIQMap, setLocIQMap] = useState<Map | null>();
  const [locIQMarker, setLocIQMarker] = useState<Marker | null>();
  const [geoCoder, setGeoCoder] = useState<Geocoder | null>();

  const { spaceTen, spaceFive } = theme;

  for (let i = numOfScripts; i >= 0; i--) {
    if (i == numOfScripts) {
      scriptCBs[i] = () =>
        createScriptTag(scriptSources[i], () => {
          const zoom = userLat ? 13 : 2;
          initiateMap(
            userLat ? userLat : 0.0,
            userLon ? userLon : 0.0,
            zoom,
            setLocIQMap,
            setLocIQMarker,
            setGeoCoder,
          );
        });
    } else {
      scriptCBs[i] = () => createScriptTag(scriptSources[i], scriptCBs[i + 1]);
    }
  }

  const handlePopUpTextFetch = async (latlng: { lat: number; lng: number }) => {
    setPopupText('');
    setShowPopupLoader(true);
    const locationName = await getNameForLocation(latlng);
    setPopupText(locationName);
    setShowPopupLoader(false);
  };

  const [currentLoc, setCurrentLoc] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: userLat,
    lng: userLon,
  });

  const [positionIsSelectable, setPositionIsSelectable] = useState<boolean>(false);

  useEffect(() => {
    if (currentLoc.lng !== userLon || currentLoc.lat !== userLat) {
      setCurrentLoc({ lat: userLat, lng: userLon });
      setPositionIsSelectable(true);
    }
    // if (userLat && userLon) {
    handlePopUpTextFetch({
      lat: userLat ? userLat : 0.0,
      lng: userLon ? userLon : 0.0,
    });
    // }
  }, [userLat, userLon]);

  const moveMarker = async (map: Map, marker: Marker, latlng: LatLng) => {
    map.setView(latlng, map.getZoom());
    // @ts-ignore
    marker.setLatLng(latlng, { draggable: true });
    setCurrentLoc(latlng);
    setPositionIsSelectable(true);
    await handlePopUpTextFetch(latlng);
  };

  const handleClick = async (
    event: LeafletMouseEvent,
    locIQMap: Map,
    locIQMarker: Marker,
  ) => {
    const { latlng } = event;
    moveMarker(locIQMap, locIQMarker, latlng);
  };

  const handleAutoCompleteSelection = (
    event: LeafletMouseEvent,
    locIQMap: Map,
    locIQMarker: Marker,
  ) => {
    // @ts-ignore
    setPopupText(event.feature.innerText);
    moveMarker(locIQMap, locIQMarker, event.latlng);
  };

  const handleMarkerDrag = (
    _event: DragEndEvent,
    locIQMap: Map,
    locIQMarker: Marker,
  ) => {
    const position = locIQMarker.getLatLng();
    moveMarker(locIQMap, locIQMarker, position);
  };

  useEffect(() => {
    if (locIQMap && locIQMarker && geoCoder) {
      locIQMap.on('click', (e: LeafletMouseEvent) =>
        handleClick(e, locIQMap, locIQMarker),
      );
      geoCoder.on('select', event => {
        handleAutoCompleteSelection(event, locIQMap, locIQMarker);
      });
      locIQMarker.on('dragend', event => {
        handleMarkerDrag(event, locIQMap, locIQMarker);
      });
    }
  }, [locIQMap, locIQMarker, geoCoder]);

  useEffect(() => {
    if (locIQMarker) {
      const { lat, lng } = locIQMarker.getLatLng() as LatLng;
      if (lat !== 0 && lng !== 0) {
        const n = showPopupLoader ? 'Loading...' : popupText;
        locIQMarker.bindPopup(n).openPopup();
      }
    }
  }, [locIQMarker, currentLoc, showPopupLoader, popupText]);

  const [scriptActivatedOnce, setScriptActivatedOnce] = useState<boolean>(false);
  const activateScripts = scriptCBs[0];
  useEffect(() => {
    // if (userLon && userLat && !scriptActivatedOnce) {
    //   activateScripts();
    //   setScriptActivatedOnce(true);
    // }
    if (!scriptActivatedOnce) {
      activateScripts();
      setScriptActivatedOnce(true);
    }
  }, [userLon, userLat, scriptActivatedOnce]);

  const handleLocationSelection = () => {
    if (isSignedIn) {
      dispatch(
        updateUserLocationReq(
          currentLoc?.lng as number,
          currentLoc?.lat as number,
          setShowModal,
        ),
      );
    } else {
      dispatch(
        updateUserLocationSuccess(
          currentLoc?.lng as number,
          currentLoc?.lat as number,
        ),
      );
      setShowModal(false);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.3/leaflet.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css"
        />
        <link
          rel="stylesheet"
          href="https://maps.locationiq.com/v2/libs/leaflet-geocoder/1.9.5/leaflet-geocoder-locationiq.min.css"
        ></link>
      </Head>
      <Header marginBelow={spaceFive}>Location</Header>
      <Paragraph marginBelow={spaceTen}>
        Select your location to discover books available to swap around you.
      </Paragraph>
      <MapContainer id="map" />
      <Button
        asButtonTag
        onClick={handleLocationSelection}
        disabled={!positionIsSelectable}
      >
        Select
      </Button>
    </>
  );
};
