import EventManager from '../tools/EventManager';

const VueMeteo = {
  el: document.querySelector('#meteo'),
  leftarrow: null,
  rightarrow: null,
  dayList: null,
  currentPosition: null,
  options: {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  },
  currentDate: null,
  init() {
    this.currentPosition = 0;
    this.leftarrow = this.el.querySelector('#leftarrow');
    this.rightarrow = this.el.querySelector('#rightarrow');
    this.dayList = this.el.querySelectorAll('.day');

    // INITIALIZES THE DATE

    this.currentDate = new Date(new Date().getTime() + this.currentPosition * (24 * 60 * 60 * 1000)).toLocaleDateString('fr-FR', this.options).split(' ', 4);
    this.el.querySelector('#date').innerHTML = '<p>' + this.currentDate[1] + ' ' + this.currentDate[2] + '</p>';

    // FINDS THE TIME AND HIGHLIGHTS IT

    const currentTime = new Date().getHours();
    const highlight = this.el.querySelector('#thisday').querySelectorAll('.hour');
    const highlightTime = Math.floor(currentTime / 3);
    highlight[highlightTime].parentNode.classList.add('currenttime');

    // EVENT LISTERNER
    this.leftarrow.addEventListener('click', (e) => { this.slide(e, -1); });
    this.rightarrow.addEventListener('click', (e) => { this.slide(e, 1); });
    EventManager.addEventListener('METEO::ApplyDatas', event => this.applyMeteo(event));
  },

  // DAYSLIDER

  slide(e, direction) {
    const POSITIONMIN = 0;
    const POSITIONMAX = this.dayList.length - 1;
    if (direction === +1) {
      if (this.currentPosition < POSITIONMAX) {
        this.currentPosition = this.currentPosition + 1;
      }
    }
    else if (direction === -1) {
      if (this.currentPosition > POSITIONMIN) {
        this.currentPosition = this.currentPosition - 1;
      }
    }
    this.el.querySelector('.dem-weeks').style.transform = 'translate3d(calc(' + (-100 * this.currentPosition) + '% / 5),0,0)';

    // FINDS AND DISPLAYS THE CURRENT DATE BASED ON THE SLIDER POSIION
    this.currentDate = new Date(new Date().getTime() + this.currentPosition * (24 * 60 * 60 * 1000)).toLocaleDateString('fr-FR', this.options).split(' ', 4);
    this.el.querySelector('#date').innerHTML = '<p>' + this.currentDate[1] + ' ' + this.currentDate[2] + '</p>';
  },

  applyMeteo(e) {
    const FORECASTDATAS = e.detail.meteoForecast;
    const WEATHERDATAS = e.detail.meteoWeather;
    const tConditions = document.querySelector('.dem-weeks').querySelectorAll('li');
    // Boucle de suppression des li useless
    let toremove = 0;
    let remove = true;
    for (let i = 0; i < tConditions.length; i += 1) {
      if (remove) {
        if (tConditions[i].className !== 'currenttime') {
          toremove += 1;
          tConditions[i].parentNode.removeChild(tConditions[i]);
        }
        else {
          remove = false;
        }
      }
    }
    // Boucle de remplacement des informations
    for (let j = toremove; j < tConditions.length; j += 1) {
      // Affichage des climats
      let climat;
      if (j === toremove) {
        climat = WEATHERDATAS['weather'][0]['main'];
      }
      else {
        climat = FORECASTDATAS['list'][j - toremove - 1]['weather'][0]['main'];
      }
      const icon = tConditions[j]['children'][1];
      switch (climat) {
        case 'Clear':
          icon.innerHTML = '<img class="icon" src="./img/meteo/sun.png" alt="Soleil">';
          break;
        case 'Clouds':
          icon.innerHTML = '<img class="icon" src="./img/meteo/clouds.png" alt="Nuages">';
          break;
        case 'Rain':
          icon.innerHTML = '<img class="icon" src="./img/meteo/rain.png" alt="Pluie">';
          break;
        case 'Thunderstorm':
          icon.innerHTML = '<img class="icon" src="./img/meteo/thunder.png" alt="Orage">';
          break;
        case 'Snow':
          icon.innerHTML = '<img class="icon" src="./img/meteo/snow.png" alt="Neige">';
          break;
        case 'Atmosphere':
          icon.innerHTML = '<img class="icon" src="./img/meteo/mist.png" alt="Brouillard">';
          break;
        case 'Drizzle':
          icon.innerHTML = '<img class="icon" src="./img/meteo/drizzle.png" alt="Précipitation">';
          break;
      }
      // Affichage des températures
      let temperature
      if (j === toremove) {
        temperature = WEATHERDATAS['main']['temp'];
      }
      else {
        temperature = FORECASTDATAS['list'][j - toremove - 1]['main']['temp'];
      }
      tConditions[j].lastChild.innerHTML = Math.round(temperature - 273.15) + '°C'; // conversion en degrés Celsius et affichage
    }
  },
};
export default VueMeteo;
