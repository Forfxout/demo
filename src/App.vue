<template>
<v-app>
    <workspace-loading-indicator
        v-if="isWorkspaceLoading"
    />

    <router-view v-else />

    <v-footer
        class="py-0"
        app
        inset
    >
        <v-spacer />
        <div><strong>LinkAlong Sarl</strong> - &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
</v-app>
</template>

<script>
import WorkspaceLoadingIndicator from '@/components/WorkspaceLoadingIndicator.vue';


export default {
    name: 'App',

    components: {
        WorkspaceLoadingIndicator,
    },

    data() {
        return this.mapState({
            isWorkspaceLoaded: 'common.isWorkspaceLoaded',
        });
    },

    computed: {
        isWorkspaceLoading() {
            return !this.isWorkspaceLoaded && this.$route.meta.loadWorkspace;
        },
    },
};
</script>
