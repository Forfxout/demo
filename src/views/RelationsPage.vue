<template>
<fragment>
    <top-toolbar>
        <template #search-input>
            <search-input
                keep-search-query
                @change="loadData"
            />
        </template>
    </top-toolbar>

    <search-sidebar @filter-change="loadData" />

    <v-content>
        <loading-indicator />
        <error-message />
        <search-navigation />

        <v-container>
            <v-row no-gutters>
                <v-col>
                    <relations-chart />
                </v-col>
            </v-row>

            <v-row no-gutters>
                <v-col>
                    <relations-documents />
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</fragment>
</template>

<script>
import { mapActions } from '@/store';
import RelationsChart from '@/components/charts/RelationsChart.vue';
import RelationsDocuments from '@/components/charts/RelationsDocuments.vue';
import SearchNavigation from '@/components/search/SearchNavigation.vue';
import SearchSidebar from '@/components/sidebar/SearchSidebar.vue';

export default {
    name: 'RelationsPage',
    components: {
        RelationsChart,
        RelationsDocuments,
        SearchNavigation,
        SearchSidebar,
    },

    methods: {
        ...mapActions({
            doRelationsUpdate: 'search/doRelationsUpdate',
        }),

        loadData() {
            this.doRelationsUpdate();
        },
    },
};
</script>

<style scoped lang="sass">
.container
    height: $search-results-container-height
    width: $search-results-container-width
    overflow-y: scroll

.search-result-container
    height: 600px
</style>
