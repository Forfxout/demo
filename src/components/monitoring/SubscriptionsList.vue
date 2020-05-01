<template>
<div
    class="subscriptions-list"
>
    <div
        v-for="sub in subscriptionsOrdered"
        :key="sub.subscription.id"
        class="subscription-column"
    >
        <subscription
            :subscription="sub.subscription"
            :documents="sub.documents"
            :newDocuments="sub.newDocuments"
        />
    </div>

    <div v-if="subscriptions===null" class="pa-2">Loading streams...</div>
    <div v-else-if="subscriptions.length===0" class="pa-2">No streams created</div>
</div>

</template>
<script>
import _ from 'lodash';

import { mapActions } from '@/store';

import Subscription from '@/components/monitoring/Subscription.vue';


export default {
    name: 'SubscriptionsList',

    components: {
        Subscription,
    },

    data() {
        return {
            ...this.mapState({
                subscriptions: 'monitoring.subscriptions',
                order: 'monitoring.subscriptionsOrder',
            }),
        };
    },

    computed: {
        subscriptionsOrdered() {
            // FIXME: Use store selector
            return _.sortBy(
                this.subscriptions || [], sub => _.indexOf(this.order, sub.subscription.id),
            );
        },
    },

    methods: {
        ...mapActions({
            setSelectedDocumentId: 'search/setSelectedDocumentId',
        }),
    },
    created() {
        setTimeout(() => {
            console.log(this.subscriptions)
        },2000)
    }
};
</script>

<style scoped lang="sass">
.paginator-panel
    position: fixed
    width: 100%
    padding-right: $sidebar-width

.subscriptions-list
    width: $subscriptions-panel-width
    height: $subscriptions-panel-height
    display: flex
    flex-flow: row
    overflow-x: scroll
    overflow-y: hidden

.subscription-column
    min-width: $subscription-container-width
    max-width: $subscription-container-width
</style>
