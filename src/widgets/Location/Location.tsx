import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { initiateMap, initiateMarker } from '../../userJs/loc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import {
  updateUserLocationReq,
  updateUserLocationSuccess,
} from 'redux/actions/user';
import { Map, LeafletMouseEvent, DragEndEvent, LatLng, Marker } from 'leaflet';
import { Button } from 'ui-kits/Button';
import { MapContainer, Caution } from './Location.styles';
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
  off(event: 'select'): void;
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

function popupCreator(text: string) {
  const popupDiv = document.createElement('div');
  popupDiv.className = 'locationPopup';
  popupDiv.textContent = text;
  return popupDiv;
}

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
  const [locIQMarker, setLocIQMarker] = useState<Marker | null>(null);
  const [geoCoder, setGeoCoder] = useState<Geocoder | null>();

  const { spaceSeven, spaceFive } = theme;

  for (let i = numOfScripts; i >= 0; i--) {
    if (i == numOfScripts) {
      scriptCBs[i] = () =>
        createScriptTag(scriptSources[i], () => {
          const zoom = userLat ? 13 : 7;
          initiateMap(
            userLat ? userLat : 23.8104, // TODO Hardcoding Bangladesh's map for now, This will be changed using user Ip address later
            userLon ? userLon : 90.4064,
            zoom,
            setLocIQMap,
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
    const zoom = locIQMap.getZoom() < 10 ? 10 : locIQMap.getZoom();
    locIQMap.setView(latlng, zoom);
    moveMarker(locIQMap, locIQMarker, latlng);
  };

  const handleAutoCompleteSelection = (
    event: LeafletMouseEvent,
    locIQMap: Map,
    locIQMarker: Marker,
  ) => {
    const { latlng } = event;
    const zoom = locIQMap.getZoom() < 15 ? 15 : locIQMap.getZoom();
    locIQMap.setView(latlng, zoom);
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
    const zoom = locIQMap.getZoom();
    locIQMap.setView(position, zoom);
    moveMarker(locIQMap, locIQMarker, position);
  };

  useEffect(() => {
    if (userLat && userLon && locIQMap && !locIQMarker) {
      const marker = initiateMarker([userLat, userLon]);
      setLocIQMarker(marker);
    }
  }, [userLat, userLon, locIQMap, locIQMarker]);

  useEffect(() => {
    if (locIQMap) {
      locIQMap.on('click', (e: LeafletMouseEvent) => {
        if (!locIQMarker) {
          const { latlng } = e;
          const marker = initiateMarker(latlng);
          handleClick(e, locIQMap, marker);
          setLocIQMarker(marker);
        } else {
          handleClick(e, locIQMap, locIQMarker);
        }
      });
      return () => {
        locIQMap.off('click');
      };
    }
  }, [locIQMap, locIQMarker, geoCoder]);

  useEffect(() => {
    if (locIQMarker && locIQMap) {
      locIQMarker.on('dragend', event => {
        handleMarkerDrag(event, locIQMap, locIQMarker);
      });

      return () => {
        locIQMarker.off('dragend');
      };
    }
  }, [locIQMarker, locIQMap]);

  useEffect(() => {
    if (locIQMap && geoCoder) {
      geoCoder.on('select', event => {
        if (!locIQMarker) {
          const { latlng } = event;
          const marker = initiateMarker(latlng);
          setLocIQMarker(marker);
          handleAutoCompleteSelection(event, locIQMap, marker);
        } else {
          handleAutoCompleteSelection(event, locIQMap, locIQMarker);
        }
      });

      return () => {
        geoCoder.off('select');
      };
    }
  }, [locIQMarker, locIQMap, geoCoder]);

  useEffect(() => {
    if (locIQMarker) {
      const { lat, lng } = locIQMarker.getLatLng() as LatLng;
      if (lat !== 0 && lng !== 0) {
        const n = popupCreator(showPopupLoader ? 'Loading...' : popupText);
        locIQMarker.bindPopup(n).openPopup();
      }
    }
  }, [locIQMarker, currentLoc, showPopupLoader, popupText]);

  const [scriptActivatedOnce, setScriptActivatedOnce] = useState<boolean>(false);
  const activateScripts = scriptCBs[0];
  useEffect(() => {
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

  const hasLocation = Boolean(userLon) && Boolean(userLat);

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
      <Paragraph
        marginBelow={hasLocation ? '0' : spaceSeven}
        fontWeight="regular"
        fontSize="large"
      >
        Select your location to discover books available to swap around you.
      </Paragraph>
      {hasLocation && (
        <Paragraph fontWeight="regular" marginBelow={spaceSeven} fontSize="small">
          <Caution>Important:</Caution> When you change location, all your added
          books are made available in the new location and made unavailable in the
          previous location.
        </Paragraph>
      )}
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
