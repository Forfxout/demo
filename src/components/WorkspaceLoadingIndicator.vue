<template>
<fragment>
    <v-app-bar
        app
        clipped-left
        fixed
    >
        <v-skeleton-loader type="chip" class="mx-1" />
        <v-skeleton-loader type="chip" class="mx-1" />
        <v-skeleton-loader type="chip" class="mx-1" />
    </v-app-bar>

    <v-navigation-drawer
        :value="true"
        app
        clipped
        permanent
    >
        <v-skeleton-loader type="list-item" />
        <v-skeleton-loader type="list-item" />
        <v-skeleton-loader type="list-item" />
        <v-skeleton-loader type="list-item" />
        <v-skeleton-loader type="list-item" />
        <v-skeleton-loader type="list-item" />
    </v-navigation-drawer>

    <v-content>
        <v-skeleton-loader type="actions" />
        <v-container fluid>
            <v-row>
                <v-col>
                    <v-skeleton-loader type="article" />
                    <v-skeleton-loader type="article" />
                    <v-skeleton-loader type="article" />
                    <v-skeleton-loader type="article" />
                </v-col>
                <v-col />
            </v-row>
        </v-container>
    </v-content>
</fragment>
</template>

<script>
export default {
    name: 'WorkspaceLoadingIndicator',

    data() {
        return {
            logo: require('@/assets/logo.png'), // eslint-disable-line global-require
        };
    },
};
</script>
