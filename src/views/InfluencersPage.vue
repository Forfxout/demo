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
                    <influencers-list />
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</fragment>
</template>

<script>
import { mapActions } from '@/store';
import InfluencersList from '@/components/authors/InfluencersList.vue';
import SearchNavigation from '@/components/search/SearchNavigation.vue';
import SearchSidebar from '@/components/sidebar/SearchSidebar.vue';

export default {
    name: 'InfluencersPage',
    components: {
        InfluencersList,
        SearchNavigation,
        SearchSidebar,
    },

    methods: {
        ...mapActions({
            doInfluencersUpdate: 'search/doInfluencersUpdate',
        }),

        loadData() {
            this.doInfluencersUpdate();
        },
    },
};
</script>

<style scoped lang="sass">
.container
    height: $search-results-container-height
    width: $search-results-container-width
    overflow-y: scroll
</style>
