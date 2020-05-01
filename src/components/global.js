import Vue from 'vue';

import ErrorMessage from '@/components/ErrorMessage.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import SearchInput from '@/components/search/SearchInput.vue';
import TopToolbar from '@/components/toolbar/TopToolbar.vue';

Vue.component('error-message', ErrorMessage);
Vue.component('loading-indicator', LoadingIndicator);
Vue.component('search-input', SearchInput);
Vue.component('top-toolbar', TopToolbar);
