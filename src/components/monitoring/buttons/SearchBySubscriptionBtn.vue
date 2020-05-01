<template>
<v-tooltip bottom>
    <template #activator="{ on }">
        <v-btn
            icon
            v-on="on"
            @click="onClick"
        >
            <v-icon small>fa-search</v-icon>
        </v-btn>
    </template>
    <span>Search by Stream</span>
</v-tooltip>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'SearchBySubscriptionBtn',
    props: ['subscription'],

    data() {
        return this.mapState({
            workspaceId: 'common.workspaceId',
        });
    },

    methods: {
        ...mapActions({
            doSearch: 'search/doSearch',
            setSubscriptionQuery: 'monitoring/setSubscriptionQuery',
        }),

        onClick() {
            this.setSubscriptionQuery(this.subscription);
            this.doSearch(); // Redirects to Search page
        },
    },
};
</script>
