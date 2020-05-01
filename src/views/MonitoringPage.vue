<template>
<fragment>
    <top-toolbar />
    <monitoring-sidebar />

    <v-content>
        <loading-indicator />
        <error-message />

        <v-container fluid class="py-0">
            <subscriptions-list />
        </v-container>

        <document-selected />
    </v-content>
</fragment>
</template>

<script>
import DocumentSelected from '@/components/document/DocumentSelected.vue';
import MonitoringSidebar from '@/components/sidebar/MonitoringSidebar.vue';
import SubscriptionsList from '@/components/monitoring/SubscriptionsList.vue';


export default {
    name: 'MonitoringPage',

    components: {
        DocumentSelected,
        MonitoringSidebar,
        SubscriptionsList,
    },
};
</script>
