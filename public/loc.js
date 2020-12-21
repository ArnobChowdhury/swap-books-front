// eslint-disable-next-line
let key = 'pk.cf2d4ca311f0b700ddd1ac21fb730434';

export const initiateMap = (userLat, userLong) => {
  const map = L.map('map', {
    // center: [39.73, -104.99], // Map loads with this location as center
    center: [userLat, userLong],
    zoom: 14,
    scrollWheelZoom: true,
    zoomControl: false,
  });

  L.tileLayer(
    `https://{s}-tiles.locationiq.com/v2/obk/r/{z}/{x}/{y}.png?key=${key}`,
  ).addTo(map);

  L.control
    .zoom({
      position: 'topright',
    })
    .addTo(map);

  L.control
    .geocoder(key, {
      // placeholder: 'Search nearby',
      url: 'https://api.locationiq.com/v1',
      expanded: true,
      panToPoint: true,
      focus: true,
      position: 'topleft',
    })
    .addTo(map);
};
