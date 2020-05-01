import Vue from 'vue';
import reduxStore from '@/lib/reduxStore';

import { actions, store } from '@/store/store';

const options = {
    store,
    actions,
};

Vue.use(reduxStore, options);
