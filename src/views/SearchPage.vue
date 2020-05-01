<template>
<fragment>
    <top-toolbar show-save-btn>
        <template #search-input>
            <search-input
                keep-search-query
                @change="doSearch"
            />
        </template>
    </top-toolbar>

    <search-sidebar @filter-change="doSearch" />

    <v-content>
        <loading-indicator />
        <error-message />
        <search-navigation />
        <create-subscriptions-panel />
        <search-result :show-subs-form="showSubsForm" />
        <document-selected />
    </v-content>
</fragment>
</template>

<script>
import { mapActions } from '@/store';
import CreateSubscriptionsPanel from '@/components/monitoring/CreateSubscriptionsPanel.vue';
import DocumentSelected from '@/components/document/DocumentSelected.vue';
import SearchNavigation from '@/components/search/SearchNavigation.vue';
import SearchResult from '@/components/search/SearchResult.vue';
import SearchSidebar from '@/components/sidebar/SearchSidebar.vue';


export default {
    name: 'SearchPage',

    components: {
        CreateSubscriptionsPanel,
        DocumentSelected,
        SearchNavigation,
        SearchResult,
        SearchSidebar,
    },

    data() {
        return this.mapState({
            documentsTotal: 'search.documentsTotal',
            showSubsForm: 'monitoring.showSubsForm',
        });
    },

    mounted() {
        // Initial search when page is open first time
        if (this.documentsTotal === null) {
            this.doSearch();
        }
    },

    methods: {
        ...mapActions({
            doSearch: 'search/doSearch',
        }),
    },
};
</script>

<style scoped lang="sass">
.loading-progress
    position: fixed
</style>
