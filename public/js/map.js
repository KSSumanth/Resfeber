// const mapboxgl = require("mapbox-gl");
console.log(mapToken);
mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});
// "pk.eyJ1Ijoic3VtYW50aGtzIiwiYSI6ImNseDdpY3o3cjAxNGgyanI0bHhtcmN0eDYifQ.CVYWQuwSIy2_Qx0elMut5Q";
console.log(coordinates);
const marker=new mapboxgl.Marker()
.setLngLat(coordinates)
.addTo(map);