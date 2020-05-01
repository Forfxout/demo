<template>
<fragment>
    <top-toolbar />
    <dyntopics-sidebar />

    <v-content>
        <loading-indicator />
        <error-message />

        <dyntopics-list />

        <document-selected />
    </v-content>
</fragment>
</template>

<script>
import DocumentSelected from '@/components/document/DocumentSelected.vue';
import DyntopicsList from '@/components/dyntopics/DyntopicsList.vue';
import DyntopicsSidebar from '@/components/sidebar/DyntopicsSidebar.vue';

import { mapActions } from '@/store';

export default {
    name: 'DyntopicsPage',

    components: {
        DocumentSelected,
        DyntopicsList,
        DyntopicsSidebar,
    },

    created() {
        this.loadDyntopics();
    },

    methods: {
        ...mapActions({
            loadDyntopics: 'dyntopics/loadDyntopics',
        }),
    },
};
</script>

<style scoped lang="sass">
.loading-progress
    position: fixed
</style>
