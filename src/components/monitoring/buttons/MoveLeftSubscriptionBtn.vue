<template>
<v-tooltip bottom>
    <template #activator="{ on }">
        <v-btn
            v-show="isShown"
            icon
            v-on="on"
            @click="moveSubscriptionRight(subscription.id)"
        >
            <v-icon v-if="vertical" small>fa-caret-up</v-icon>
            <v-icon v-else small>fa-caret-left</v-icon>
        </v-btn>
    </template>
    <span>Move Stream to the left</span>
</v-tooltip>
</template>

<script>
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
            return this.subscription.id !== this.order[0];
        },
    },

    methods: {
        ...mapActions({
            moveSubscriptionRight: 'monitoring/moveSubscriptionLeft',
        }),
    },
};
</script>
