const key = process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_KEY;
let map;
let marker;

export const initiateMap = (
  userLat,
  userLon,
  zoom,
  attachMapFunc,
  attachMarkerFunc,
  attachGeoCoderFunc,
) => {
  map = L.map('map', {
    // center: [39.73, -104.99], // Map loads with this location as center
    center: [userLat, userLon],
    zoom,
    scrollWheelZoom: true,
    zoomControl: false,
  });

  marker = L.marker([userLat, userLon], { draggable: true }).addTo(map);

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
  attachMarkerFunc(marker);
  attachGeoCoderFunc(geocoder);
};
