<template>
<v-card
    v-if="doc"
    class="document-details pb-3"
    outlined
>
    <v-card-actions>
        <v-btn
            @click="setSelectedDocumentId({docId: null})"
            icon
        >
            <v-icon>fa-times</v-icon>
        </v-btn>
    </v-card-actions>

    <doc-content :doc="doc" detailed />
</v-card>
</template>

<script>
import { mapActions } from '@/store';

import DocContent from '@/components/document/DocContent.vue';


export default {
    name: 'DocumentSelected',
    components: {
        DocContent,
    },

    data() {
        return this.mapState({
            doc: 'search.selectedDocument',
        });
    },

    methods: {
        ...mapActions({
            setSelectedDocumentId: 'search/setSelectedDocumentId',
        }),
    },
};
</script>

<style scoped lang="sass">
.document-details
    position: fixed
    width: 420px
    right: 0
    top: 0
    bottom: 0
    overflow-y: auto
    padding-top: $header-height
</style>
