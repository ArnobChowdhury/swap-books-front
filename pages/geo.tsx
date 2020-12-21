import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { initiateMap } from '../public/loc';

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

const Geo = () => {
  const [locationAccessGranted, setLocationAccessGranted] = useState(false);
  const [lat, setLat] = useState<number | undefined>();
  const [lon, setLon] = useState<number | undefined>();

  const getDeviceLocErr: PositionErrorCallback = (err: PositionError): void => {
    // TODO: if an error occurs we say, Sorry! we need a to access device location to work.
    // eslint-disable-next-line
    console.log(err);
  };

  const getDeviceLoc = (position: Position): void => {
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);
    setLocationAccessGranted(true);
  };

  useEffect(() => {
    if (process.browser) {
      // eslint-disable-next-line no-console
      navigator.geolocation.getCurrentPosition(getDeviceLoc, getDeviceLocErr);
    }
  }, []);

  const numOfScripts = scriptSources.length - 1;
  const scriptCBs: { (): void }[] = [];

  for (let i = numOfScripts; i >= 0; i--) {
    if (i == numOfScripts) {
      scriptCBs[i] = () =>
        createScriptTag(scriptSources[i], () => initiateMap(lat, lon));
    } else {
      scriptCBs[i] = () => createScriptTag(scriptSources[i], scriptCBs[i + 1]);
    }
  }

  const activateScripts = scriptCBs[0];
  useEffect(() => {
    if (locationAccessGranted) {
      activateScripts();
    }
  }, [locationAccessGranted]);

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
      <div
        style={{
          width: '100vw',
          height: '100vh',
          padding: '50px',
          paddingLeft: '250px',
        }}
      >
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </>
  );
};

export default Geo;
