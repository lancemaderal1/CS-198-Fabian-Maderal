import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { Form, Field, ErrorMessage } from 'vee-validate';

//import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import VueNotificationList from '@dafcoe/vue-notification' 
import '@dafcoe/vue-notification/dist/vue-notification.css'                                         

import VueCryptojs from 'vue-cryptojs'

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(far);
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();

import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

const app = createApp(App);

app.use(router);
app.use(Form, Field, ErrorMessage);
app.use(VueNotificationList);
app.use(VueCryptojs)
app.use(BootstrapVue3)

app.mount("#app");
