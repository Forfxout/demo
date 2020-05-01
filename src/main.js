import Vue from 'vue';
import VueMoment from 'vue-moment';
import FlagIcon from 'vue-flag-icon';
import Fragment from 'vue-fragment';

import '@/components/global';
import '@/plugins/redux';
import '@/plugins/leaflet';
import vuetify from '@/plugins/vuetify';
import App from '@/App.vue';
import router from '@/router';

import '@/utils/index';

Vue.config.productionTip = false;

Vue.use(VueMoment);
Vue.use(FlagIcon);
Vue.use(Fragment.Plugin);

new Vue({
    vuetify,
    router,
    render: createElement => createElement(App),
}).$mount('#app');
