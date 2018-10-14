import Geo from './components/Map';
import Search from './components/Search';
import VueMeteo from './components/VueMeteo';
import SearchList from './components/SearchList';

import './styles/global.scss';
import './styles/mobile.scss';

// localStorage.clear();
// METEO

const meteo = ((map, search, vuemeteo, searchlist) => {
  map.init();
  search.init();
  vuemeteo.init();
  searchlist.init();
})(Geo, Search, VueMeteo, SearchList);
