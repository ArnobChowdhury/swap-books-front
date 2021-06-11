const key = process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_KEY;
let map;

export const initiateMap = (
  userLat,
  userLon,
  zoom,
  attachMapFunc,
  attachGeoCoderFunc,
) => {
  map = L.map('map', {
    center: [userLat, userLon], // MAp loads this location as center
    zoom,
    scrollWheelZoom: true,
    zoomControl: false,
  });

  L.tileLayer(
    `https://{s}-tiles.locationiq.com/v2/obk/r/{z}/{x}/{y}.png?key=${key}`,
  ).addTo(map);

  L.control
    .zoom({
      position: 'bottomright',
    })
    .addTo(map);

  const geocoder = L.control
    .geocoder(key, {
      placeholder: 'Search nearby',
      url: 'https://api.locationiq.com/v1',
      expanded: true,
      panToPoint: true,
      focus: true,
      position: 'topleft',
      markers: false,
    })
    .addTo(map);

  attachMapFunc(map);
  attachGeoCoderFunc(geocoder);
};

export const initiateMarker = latlng => {
  const marker = L.marker(latlng, { draggable: true }).addTo(map);
  return marker;
};
