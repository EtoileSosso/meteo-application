import EventManager from '../tools/EventManager';
import CallAPI from './callAPI';

const Geo = {
  el: document.querySelector('#ville'),
  init() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => this.getPosition(position));
    } else {
      alert('Service de géolocalisation non disponible sur votre ordinateur');
    }
    EventManager.addEventListener('METEO::SearchLocation', event => this.transmitPosition(event));
  },
  transmitPosition(e) {
    const lat = e.detail.lat;
    const lng = e.detail.lng;
    this.getPlace(lat, lng);
  },
  getPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    this.getPlace(lat, lng);
  },
  getPlace(lat, lng){
    // Trouve la ville et le pays où on est
    let latlng = new google.maps.LatLng(lat, lng);
    new google.maps.Geocoder().geocode({ 'latLng': latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          let country = null, countryCode = null, city = null, cityAlt = null;
          let c, lc, component;
          for (let r = 0, rl = results.length; r < rl; r += 1) {
            const result = results[r];
            if (!city && result.types[0] === 'locality') {
              for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];
                if (component.types[0] === 'locality') {
                  city = component.long_name;
                  break;
                }
              }
            }
            else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
              for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];
                if (component.types[0] === 'administrative_area_level_1') {
                  cityAlt = component.long_name;
                  break;
                }
              }
            }
            else if (!country && result.types[0] === 'country') {
              country = result.address_components[0].long_name;
              countryCode = result.address_components[0].short_name;
            }
            if (city && country) {
              break;
            }
          }
          document.querySelector('#city').innerHTML = city;
          document.querySelector('#country').innerHTML = country;
          // Affiche la map
          const mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.HYBRID,
          };
          const map = new google.maps.Map(document.getElementById('map'), mapOptions);
          // Appelle l'API
          const call = new CallAPI();
          call.callWeather(city, countryCode);
        }
      }
    });
  },
};
export default Geo;
