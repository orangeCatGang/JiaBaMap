import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUtensils, faSearch, faMapMarkerAlt, faCalendarWeek, faArrowUpFromBracket, faBars, faMagnifyingGlass, faStar, faDollarSign,faCircle, faChevronRight, faChevronDown, faWandMagicSparkles, faBowlFood, faStarHalfStroke, faBookmark, faUser} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { createPinia } from 'pinia';


library.add(faUtensils, faSearch, faMapMarkerAlt, faCalendarWeek, faArrowUpFromBracket, faBars, faMagnifyingGlass, faStar, faDollarSign, faCircle, faChevronRight, faChevronDown, faWandMagicSparkles, faBowlFood, faInstagram, faStarHalfStroke, faBookmark, faUser);


createApp(App)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(createPinia())
    .mount('#app')
