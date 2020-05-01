<template>
<documents-list
    :class="{'search-result': true}"
    :documents="documents"
    :documentsTotal="documentsTotal"
    :searchResultId="searchResultId"
    @docSelect="onDocumentSelect"
    @loadNextPage="loadNextPage"
/>
</template>

<script>
import { mapActions } from '@/store';

import DocumentsList from '@/components/general/DocumentsList.vue';


export default {
    name: 'SearchResult',
    props: {
        showSubsForm: Boolean,
    },
    components: {
        DocumentsList,
    },

    data() {
        return {
            ...this.mapState({
                query: 'search.query',
                queryConcepts: 'search.queryConcepts',
                documents: 'search.documents',
                documentsTotal: 'search.documentsTotal',
                // necessary to add to document key because document highlight
                // may change after query change
                searchResultId: 'search.searchResultId',
            }),
        };
    },

    methods: {
        ...mapActions({
            setSelectedDocumentId: 'search/setSelectedDocumentId',
            loadNextPage: 'search/loadNextPage',
        }),

        onDocumentSelect(docId) {
            this.setSelectedDocumentId({
                docId,
                query: this.query,
                concepts: this.queryConcepts.map(concept => concept.id),
            });
        },
    },
};
</script>

<style scoped lang="sass">
.container
    height: $search-results-container-height
    width: $search-results-container-width
    overflow-y: scroll
</style>
