import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {   faUtensils, faSearch, faMapMarkerAlt, faCalendarWeek, faArrowUpFromBracket, faBars, faMagnifyingGlass, faStar, faDollarSign, faCircle, faChevronRight, faChevronDown, faWandMagicSparkles, faBowlFood,  faStarHalfStroke, faBookmark, faUser, faCamera} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { createPinia } from 'pinia';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';

library.add(fasThumbsUp ,farThumbsUp, faGoogle, faUtensils, faSearch, faMapMarkerAlt, faCalendarWeek, faArrowUpFromBracket, faBars, faMagnifyingGlass, faStar, faDollarSign, faCircle, faChevronRight, faChevronDown, faWandMagicSparkles, faBowlFood, faInstagram, faStarHalfStroke, faBookmark, faUser, faCamera);


createApp(App)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(createPinia())
    .mount('#app')
