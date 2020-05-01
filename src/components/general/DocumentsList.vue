<template>
<v-container
    fluid
    id="scroll-target"
    ref="docsContainer"
>
    <div
        v-if="documentsTotal"
        class="secondary--text text-right"
    >
        Total results: {{ documentsTotal }}
    </div>
    <virtual-list
        :size="documentHeight"
        :remain="documentsGroupsInViewportCount"
        :bench="parseInt(documentsGroupsInViewportCount * 4)"
        :debounce="10"
        :scrollelement="$refs.docsContainer"
    >
        <div
            v-for="group of groups"
            class="document-group"
            :key="`${searchResultId}_${group.key}`"
        >
            <document
                v-for="doc of group.docs"
                v-once
                :key="`${searchResultId}_${doc.id}`"
                :doc="doc"
                :height="documentHeight"
                @select="$emit('docSelect', doc.id)"
                v-intersect.once.quiet="getIntersectOptions(doc.id)"
                class="document"
            />
        </div>
    </virtual-list>
</v-container>
</template>

<script>
import virtualList from 'vue-virtual-scroll-list';

import Document from '@/components/document/Document.vue';


const DOCUMENT_BLOCK_HEIGHT = 300;
const DOCUMENT_BLOCK_MIN_WIDTH = 300;

export default {
    name: 'DocumentsList',
    props: {
        documents: Array,
        documentsTotal: Number,
        searchResultId: Number,
    },
    components: {
        virtualList,
        Document,
    },

    data() {
        return {
            documentHeight: DOCUMENT_BLOCK_HEIGHT,
            documentsInGroupCount: 1,
            documentsGroupsInViewportCount: 1,
        };
    },

    mounted() {
        this.calculateViewportDimensions();
    },

    created() {
        window.addEventListener('resize', this.calculateViewportDimensions);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.calculateViewportDimensions);
    },

    computed: {
        groups() {
            const keyReducer = (accumulator, doc) => accumulator + doc.id;
            return this.documents.chunk(this.documentsInGroupCount).map(docs => ({
                key: docs.reduce(keyReducer, ''),
                docs,
            }));
        },
    },

    watch: {
        documents() {
            this.calculateViewportDimensions();
        },
    },

    methods: {
        getIntersectOptions(docId) {
            if (docId === this.documents[this.documents.length - 1].id) {
                return {
                    handler: () => this.$emit('loadNextPage'),
                    options: {
                        rootMargin: '1500px',
                    },
                };
            }
            return {};
        },

        calculateViewportDimensions() {
            this.documentsGroupsInViewportCount = this.$refs.docsContainer
                ? this.$refs.docsContainer.clientHeight / DOCUMENT_BLOCK_HEIGHT : 1;
            this.documentsInGroupCount = this.$refs.docsContainer
                ? Math.floor(
                    this.$refs.docsContainer.clientWidth / (DOCUMENT_BLOCK_MIN_WIDTH + 10),
                ) : 1;
        },
    },
};
</script>

<style scoped lang="sass">
.document-group
    display: flex
    flex-flow: row
    width: 100%

.document
    margin: 4px 4px 0 0
    max-width: 500px
    min-width: 300px
    flex-grow: 1
    flex-basis: 0
</style>
