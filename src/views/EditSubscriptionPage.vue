<template>
<fragment>
    <top-toolbar>
        <template #search-input>
            <search-input
                keep-search-query
                @change="doSearchOnSubEdit"
            />
        </template>
    </top-toolbar>

    <search-sidebar
        hide-date-from
        hide-date-to
        hide-order-by
        @filter-change="doSearchOnSubEdit"
    />

    <v-content>
        <loading-indicator />
        <error-message />
        <update-subscription-form
            v-if="subscriptionToEdit"
            :subscription="subscriptionToEdit"
            @cancel="onCancel"
        />
        <search-result />
    </v-content>
</fragment>
</template>

<script>
import { mapActions } from '@/store';

import SearchResult from '@/components/search/SearchResult.vue';
import SearchSidebar from '@/components/sidebar/SearchSidebar.vue';
import UpdateSubscriptionForm from '@/components/monitoring/UpdateSubscriptionForm.vue';


export default {
    name: 'EditSubscriptionPage',

    components: {
        SearchResult,
        SearchSidebar,
        UpdateSubscriptionForm,
    },

    data() {
        return this.mapState({
            workspaceId: 'common.workspaceId',
            subscriptionToEdit: 'monitoring.subscriptionToEdit',
        });
    },

    mounted() {
        this.setSubscriptionToEditById(this.$route.params.subscriptionId);
        this.doSearchOnSubEdit();
    },

    methods: {
        ...mapActions({
            doSearchOnSubEdit: 'search/doSearchOnSubEdit',
            setSubscriptionToEditById: 'monitoring/setSubscriptionToEditById',
        }),

        onCancel() {
            this.$router.push({
                name: 'monitoring',
                params: {
                    workspaceId: this.workspaceId,
                },
            });
        },
    },
};
</script>
