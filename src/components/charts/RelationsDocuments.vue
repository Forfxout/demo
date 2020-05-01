<template>
<documents-list
    v-if="documents"
    :documents="documents"
    :documentsTotal="documentsTotal"
    :searchResultId="searchResultId"
    @docSelect="setSelectedDocumentId"
    @loadNextPage="loadRelationsDocsNextPage"
/>
</template>

<script>
import { mapActions } from '@/store';

import DocumentsList from '@/components/general/DocumentsList.vue';

export default {
    name: 'RelationsDocuments',
    components: {
        DocumentsList,
    },

    data() {
        return {
            ...this.mapState({
                documents: 'search.relationsDocuments',
                documentsTotal: 'search.relationsDocumentsTotal',
                // necessary to add to document key because document highlight
                // may change after query change
                searchResultId: 'search.searchResultId',
            }),
        };
    },

    methods: {
        ...mapActions({
            setSelectedDocumentId: 'search/setSelectedDocumentId',
            loadRelationsDocsNextPage: 'search/loadRelationsDocsNextPage',
        }),
    },
};
</script>
