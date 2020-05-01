<template>
<v-tooltip bottom>
    <template #activator="{ on }">
        <v-chip
            v-show="counter > 0"
            outlined
            link
            v-on="on"
            @click="onClick"
        >
            <v-avatar left>
                <v-icon
                    small
                    v-if="isPaused"
                >fa-pause</v-icon>
                <v-icon
                    small
                    v-else
                    color="green"
                >fa-circle</v-icon>
            </v-avatar>
            {{ counter }}
        </v-chip>
        <v-btn
            v-show="counter === 0"
            icon
            v-on="on"
            @click="onClick"
        >
            <v-icon
                small
                v-if="isPaused"
            >fa-pause</v-icon>
            <v-icon
                small
                v-else
                color="green"
            >fa-circle</v-icon>
        </v-btn>
    </template>
    <span v-if="isPaused">Paused, {{ counter }} new documents</span>
    <span v-else>Stream is updating automatically, click to pause</span>
</v-tooltip>
</template>

<script>
export default {
    name: 'PauseSubscriptionBtn',
    props: ['isPaused', 'counter'],

    methods: {
        onClick() {
            this.$emit('click');
        },
    },
};
</script>
