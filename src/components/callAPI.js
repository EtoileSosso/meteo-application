import EventManager from '../tools/EventManager';

class CallAPI {
  constructor() {
    this.el = null;
    this.model = {};
  }
  init(el, data) {
    this.el = el;
    if (data) {
      this.fill(data);
    }
  }
  fill(data) {
    this.model = data;
  }
  callWeather(city, countryCode) {

    // Forecast request

    const requestURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',' + countryCode + '&appid=8361edf9c2b6c78fcf34086ea9138e7b';
    const request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';

    // Weather request

    const weatherRequestURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + countryCode + '&appid=8361edf9c2b6c78fcf34086ea9138e7b';
    const weatherRequest = new XMLHttpRequest();
    weatherRequest.open('GET', weatherRequestURL);
    weatherRequest.responseType = 'json';

    request.send();
    request.onload = () => {
    weatherRequest.send();
      weatherRequest.onload = () => {
        const meteoForecast = request.response;
        const meteoWeather = weatherRequest.response;
        EventManager.dispatchEvent(new CustomEvent('METEO::ApplyDatas', { detail: { meteoForecast, meteoWeather } }));
      }
    };
  }
}

export default CallAPI;
