import EventManager from '../tools/EventManager';

const SearchList = {
  el: document.querySelector('#LocalStorage'),
  init() {
    EventManager.addEventListener('METEO::AddLocation', event => this.build(event));
    this.fill();
  },
  build(e) {
    e.preventDefault();
    const city = e.detail;
    let tStorage = [];
    // Remplit le tableau tStorage avec les valeurs du localStorage pour vérifier si la valeur qu'on entre est déjà dans le localStorage
      for (let i = 0; i < localStorage.length - 1; i += 1) {
        tStorage[i] = localStorage.getItem(localStorage.key(i));
      }
      if (!tStorage.includes(city)) {
        localStorage.setItem(localStorage.length-1, city);
        let content = document.createElement('li');
        const text = '<span class="searchlink">' + localStorage.getItem(localStorage.length-2) + '</span><button class="delete">Delete this</button>';
        content.innerHTML = text;
        this.el.querySelector('ul').appendChild(content);
        this.initButtons();
      }
  },
  remove(e) {
    e.preventDefault();
    // Suppresion du stockage
    e.target.classList.add('todelete');
    const buttonList = this.el.querySelectorAll('.delete');
    for (let i = 0; i < buttonList.length; i += 1) {
      if (buttonList[i].className === 'delete todelete') {
        localStorage.removeItem(localStorage.key(i));
      }
    }
    // Suppression de la vue
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);

    delete this;
  },
  search(e) {
    const address = e.target.parentNode.querySelector('.searchlink').innerHTML;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        EventManager.dispatchEvent(new CustomEvent('METEO::SearchLocation', { detail: { lat, lng } }));
      }
    });
  },
  fill() {
    for (let i = 0; i < localStorage.length - 1; i += 1) {
      let content = document.createElement('li');
      const text = '<span class="searchlink">' + localStorage.getItem(localStorage.key(i)) + '</span><button class="delete">Delete this</button>';
      content.innerHTML = text;
      this.el.querySelector('ul').appendChild(content);
    }
    this.initButtons();
  },
  initButtons() {
    let tButtons = this.el.querySelectorAll('.delete');
    for(let i = 0; i < tButtons.length; i += 1) {
      tButtons[i].addEventListener('click', (e) => { this.remove(e); });
    }
    let tSearchButtons = this.el.querySelectorAll('.searchlink');
    for(let i = 0; i < tSearchButtons.length; i += 1) {
      tSearchButtons[i].addEventListener('click', (e) => { this.search(e); });
    }
  },
};

export default SearchList;
