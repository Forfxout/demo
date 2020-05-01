<template>
<v-tooltip bottom>
    <template #activator="{ on }">
        <v-btn
            icon
            v-on="on"
            @click="onClick"
        >
            <v-icon small>fa-pen</v-icon>
        </v-btn>
    </template>
    <span>Edit Stream</span>
</v-tooltip>
</template>

<script>
export default {
    name: 'EditSubscriptionBtn',
    props: ['subscription'],

    data() {
        return this.mapState({
            workspaceId: 'common.workspaceId',
        });
    },

    methods: {
        onClick() {
            this.$router.push({
                name: 'edit-subscription',
                params: {
                    subscriptionId: this.subscription.id,
                    workspaceId: this.workspaceId,
                },
            });
        },
    },
};
</script>
