<template>
<v-tooltip bottom>
    <template #activator="{ on }">
        <v-btn
            v-show="isShown"
            icon
            v-on="on"
            @click="moveSubscriptionRight(subscription.id)"
        >
            <v-icon v-if="vertical" small>fa-caret-down</v-icon>
            <v-icon v-else small>fa-caret-right</v-icon>
        </v-btn>
    </template>
    <span>Move Stream to the right</span>
</v-tooltip>
</template>

<script>
import _ from 'lodash';

import { mapActions } from '@/store';


export default {
    name: 'MoveRightSubscriptionBtn',
    props: {
        subscription: Object,
        vertical: Boolean,
    },

    data() {
        return this.mapState({
            order: 'monitoring.subscriptionsOrder',
        });
    },

    computed: {
        isShown() {
            return this.subscription.id !== _.last(this.order);
        },
    },

    methods: {
        ...mapActions({
            moveSubscriptionRight: 'monitoring/moveSubscriptionRight',
        }),
    },
};
</script>
