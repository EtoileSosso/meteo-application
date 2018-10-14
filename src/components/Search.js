import EventManager from '../tools/EventManager';

const Search = {
  el: document.querySelector('#searchbar'),
  searchbar: null,
  searchbutton: null,
  removebutton: null,
  init() {
    this.searchbar = this.el.querySelector('#myInput');
    this.searchbutton = this.el.querySelector('#searchbutton');
    this.searchbutton.addEventListener('click', (e) => { this.search(e); });
    this.autocomplete();
  },
  // SEARCH
  autocomplete() {
    const options = {
      types: ['(cities)'],
    };
    const input = this.searchbar;
    const autocomplete = new google.maps.places.Autocomplete(input, options);
  },
  search(e) {
    e.preventDefault();
    const address = this.searchbar.value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        EventManager.dispatchEvent(new CustomEvent('METEO::AddLocation', { detail: address }));
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        EventManager.dispatchEvent(new CustomEvent('METEO::SearchLocation', { detail: { lat, lng } }));
      }
    });
  },
};
export default Search;
