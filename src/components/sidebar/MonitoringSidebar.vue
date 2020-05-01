<template>
<v-navigation-drawer
    :value="true"
    app
    clipped
    permanent
>
    <v-list
        dense
        expand
    >
        <navigation />
        <v-divider />

        <v-subheader>Streams</v-subheader>
        <v-list-item
            v-for="sub of subscriptionsOrdered"
            :key="sub.subscription.id"
        >
            <v-list-item-title>{{ sub.subscription.name }}</v-list-item-title>

            <v-list-item-action>
                <move-left-subscription-btn
                    :subscription="sub.subscription"
                    vertical
                />
            </v-list-item-action>

            <v-list-item-action class="ml-0">
                <move-right-subscription-btn
                    :subscription="sub.subscription"
                    vertical
                />
            </v-list-item-action>

            <v-list-item-action>
                <edit-subscription-btn
                    :subscription="sub.subscription"
                />
            </v-list-item-action>

            <v-list-item-action>
                <delete-subscription-btn
                    :subscription="sub.subscription"
                />
            </v-list-item-action>
        </v-list-item>

        <v-list-item v-if="subscriptions===null">Loading streams...</v-list-item>
        <v-list-item v-else-if="!subscriptionsOrdered.length">No streams created</v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script>
import _ from 'lodash';

import DeleteSubscriptionBtn from '@/components/monitoring/buttons/DeleteSubscriptionBtn.vue';
import EditSubscriptionBtn from '@/components/monitoring/buttons/EditSubscriptionBtn.vue';
import MoveLeftSubscriptionBtn from '@/components/monitoring/buttons/MoveLeftSubscriptionBtn.vue';
import MoveRightSubscriptionBtn from '@/components/monitoring/buttons/MoveRightSubscriptionBtn.vue';
import Navigation from '@/components/sidebar/Navigation.vue';


export default {
    name: 'MonitoringSidebar',
    components: {
        DeleteSubscriptionBtn,
        EditSubscriptionBtn,
        MoveLeftSubscriptionBtn,
        MoveRightSubscriptionBtn,
        Navigation,
    },

    data() {
        return this.mapState({
            subscriptions: 'monitoring.subscriptions',
            order: 'monitoring.subscriptionsOrder',
        });
    },

    computed: {
        subscriptionsOrdered() {
            // FIXME: Use store selector
            return _.sortBy(
                this.subscriptions || [], sub => _.indexOf(this.order, sub.subscription.id),
            );
        },
    },
};
</script>
