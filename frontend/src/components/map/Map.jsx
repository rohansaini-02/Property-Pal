import { MapContainer, TileLayer } from 'react-leaflet'
import './map.scss'
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

function Map({items}){
  // Ensure we fall back to a default location if items array is empty or coordinates are invalid
  const hasSingleItem = items && items.length === 1 && items[0]?.latitude && items[0]?.longitude;
  const centerPosition = hasSingleItem 
    ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] 
    : [20.593684, 78.96288];

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={hasSingleItem ? 7 : 5} 
      scrollWheelZoom={false} 
      className='map'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items && items.map(item => (
        item.latitude && item.longitude && <Pin item={item} key={item.id}/>
      ))}
    </MapContainer>
  )
}

export default Map