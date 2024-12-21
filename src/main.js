import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {   faEllipsis ,faUtensils, faSearch, faMapMarkerAlt, faCalendarWeek, faArrowUpFromBracket, faBars, faMagnifyingGlass, faStar, faDollarSign, faCircle, faChevronRight, faChevronDown, faWandMagicSparkles, faBowlFood,  faStarHalfStroke, faBookmark, faUser, faCamera} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { createPinia } from 'pinia';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

library.add(faEllipsis ,fasThumbsUp ,farThumbsUp, faGoogle, faUtensils, faSearch, faMapMarkerAlt, faCalendarWeek, faArrowUpFromBracket, faBars, faMagnifyingGlass, faStar, faDollarSign, faCircle, faChevronRight, faChevronDown, faWandMagicSparkles, faBowlFood, faInstagram, faStarHalfStroke, faBookmark, faUser, faCamera);

// 配置 SweetAlert2 的默認選項
const options = {
  confirmButtonColor: '#10B981',
  cancelButtonColor: '#EF4444',
};

const app = createApp(App);

app.use(router)
    .use(createPinia())
    .use(VueSweetalert2, options)
    .component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');