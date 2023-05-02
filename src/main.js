import App from './App.vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import router from './router'
import store from './store'
import { createApp } from 'vue'
// Import css framework
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
// Import icons
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'
// Import alerts
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/* add icons to the library */
library.add(fas)


// Setting headers for axios
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Application creation
const mainApp = createApp(App)

// Installing axios
mainApp.use(VueAxios, axios)

// Installing font awesome
mainApp.component('font-awesome-icon', FontAwesomeIcon)

// Installing alerts
mainApp.use(VueSweetalert2);

// Installing the storage
mainApp.use(store)

// Setting up routing
mainApp.use(router)

// Application launch
mainApp.mount('#app')
