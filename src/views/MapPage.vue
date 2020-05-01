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
                <v-col class="map-container">
                    <map-panel />
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    sm="4"
                >
                    <top-concepts-list />
                </v-col>
                <v-col
                    cols="12"
                    sm="4"
                >
                    <top-authors-list />
                </v-col>
                <v-col
                    cols="12"
                    sm="4"
                >
                    <top-topics-list />
                </v-col>
            </v-row>

            <v-row no-gutters>
                <v-col>
                    <search-result class="search-result-container" />
                </v-col>
            </v-row>
        </v-container>
        <document-selected />
    </v-content>
</fragment>
</template>

<script>
import { mapActions } from '@/store';
import DocumentSelected from '@/components/document/DocumentSelected.vue';
import MapPanel from '@/components/charts/MapPanel.vue';
import SearchNavigation from '@/components/search/SearchNavigation.vue';
import SearchResult from '@/components/search/SearchResult.vue';
import SearchSidebar from '@/components/sidebar/SearchSidebar.vue';
import TopAuthorsList from '@/components/search/TopAuthorsList.vue';
import TopConceptsList from '@/components/search/TopConceptsList.vue';
import TopTopicsList from '@/components/search/TopTopicsList.vue';

export default {
    name: 'MapPage',
    components: {
        DocumentSelected,
        MapPanel,
        SearchNavigation,
        SearchResult,
        SearchSidebar,
        TopAuthorsList,
        TopConceptsList,
        TopTopicsList,
    },

    methods: {
        ...mapActions({
            doMapUpdate: 'search/doMapUpdate',
            doSearchOnMap: 'search/doSearchOnMap',
        }),

        loadData() {
            // TODO: Do not trigger map loading on order change
            this.doMapUpdate();
            this.doSearchOnMap();
        },
    },
};
</script>

<style scoped lang="sass">
.container
    height: $search-results-container-height
    width: $search-results-container-width
    overflow-y: scroll

.map-container
    height: 450px
    padding-top: 0

.search-result-container
    height: 600px
</style>
