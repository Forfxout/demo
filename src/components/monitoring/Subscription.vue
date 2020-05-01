<template>
<v-card
    class="mx-1"
    tile
>
    <v-card-title>
        <pause-subscription-btn
            :isPaused="isPaused"
            :counter="unreadCounter"
            @click="togglePause"
        />

        {{ subscription.name }}

        <v-spacer />

        <search-by-subscription-btn
            :subscription="subscription"
        />

        <edit-subscription-btn
            :subscription="subscription"
        />

        <delete-subscription-btn
            :subscription="subscription"
        />

        <move-left-subscription-btn
            :subscription="subscription"
        />

        <move-right-subscription-btn
            :subscription="subscription"
        />
    </v-card-title>

    <v-card-text class="container" ref="subContainer">
        <virtual-list
            :size="documentHeight"
            :remain="documentsInViewportCount"
            :bench="parseInt(documentsInViewportCount * 4)"
            :debounce="10"
            :onscroll="handleScroll"
            ref="vScroll"
        >
            <document
                v-for="(doc, index) of documents"
                :key="doc.id"
                :doc="doc"
                :height="documentHeight"
                :animated="shouldDocumentBeAnimated(doc)"
                @select="setSelectedDocumentId({
                    docId: doc.id,
                    query: subscription.user_query.query,
                    concepts: subscription.user_query.concepts.map(concept => concept.id),
                })"
                v-intersect.once.quiet="getIntersectOptions(index)"
            />
        </virtual-list>
    </v-card-text>
</v-card>
</template>

<script>
import virtualList from 'vue-virtual-scroll-list';
import { mapActions } from '@/store';

import DeleteSubscriptionBtn from '@/components/monitoring/buttons/DeleteSubscriptionBtn.vue';
import Document from '@/components/document/Document.vue';
import EditSubscriptionBtn from '@/components/monitoring/buttons/EditSubscriptionBtn.vue';
import MoveLeftSubscriptionBtn from '@/components/monitoring/buttons/MoveLeftSubscriptionBtn.vue';
import MoveRightSubscriptionBtn from '@/components/monitoring/buttons/MoveRightSubscriptionBtn.vue';
import PauseSubscriptionBtn from '@/components/monitoring/buttons/PauseSubscriptionBtn.vue';
import SearchBySubscriptionBtn from '@/components/monitoring/buttons/SearchBySubscriptionBtn.vue';


const DOCUMENT_BLOCK_HEIGHT = 350;


export default {
    name: 'Subscription',
    props: ['subscription', 'documents', 'newDocuments'],

    components: {
        virtualList,
        DeleteSubscriptionBtn,
        Document,
        EditSubscriptionBtn,
        MoveLeftSubscriptionBtn,
        MoveRightSubscriptionBtn,
        PauseSubscriptionBtn,
        SearchBySubscriptionBtn,
    },

    data() {
        return {
            documentHeight: DOCUMENT_BLOCK_HEIGHT,
            documentsInViewportCount: 1,
            scrollOffset: 0,
            isManualPaused: false,
            animatedDocuments: new Set(),
        };
    },

    computed: {
        isPaused: {
            get() {
                return this.isManualPaused || this.scrollOffset > this.documentHeight / 2;
            },
            set(val) {
                this.isManualPaused = val;
                if (!val) {
                    this.scrollTop();
                }
            },
        },
        unreadCounter() {
            return this.newDocuments ? this.newDocuments.length : 0;
        },
    },

    watch: {
        isPaused(value) {
            this.setSubscriptionPaused([this.subscription.id, value]);
        },
        documents(value) {
            // Remove old document ids from the animation cache
            const currentIds = new Set(value.map(doc => doc.id));
            this.animatedDocuments = new Set(
                [...this.animatedDocuments].filter(x => currentIds.has(x)),
            );
        },
    },

    mounted() {
        this.calculateViewportHeight();
    },

    created() {
        window.addEventListener('resize', this.calculateViewportHeight);
        this.animatedDocuments = new Set(this.documents.filter(doc => doc.ws).map(doc => doc.id));
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.calculateViewportHeight);
    },

    methods: {
        ...mapActions({
            loadMoreDocuments: 'monitoring/loadMoreDocuments',
            setSelectedDocumentId: 'search/setSelectedDocumentId',
            setSubscriptionPaused: 'monitoring/setSubscriptionPaused',

        }),

        getIntersectOptions(index) {
            if (index === this.documents.length - 1) {
                return {
                    handler: () => this.loadMoreDocuments(this.subscription.id),
                    options: {
                        rootMargin: '1500px',
                    },
                };
            }
            return {};
        },

        calculateViewportHeight() {
            this.documentsInViewportCount = this.$refs.subContainer
                ? this.$refs.subContainer.clientHeight / DOCUMENT_BLOCK_HEIGHT : 1;
        },

        handleScroll() {
            this.scrollOffset = this.$refs.vScroll.delta.scrollTop;
        },

        scrollTop() {
            this.$refs.vScroll.setScrollTop(0);
        },

        togglePause() {
            this.isPaused = !this.isPaused;
        },

        shouldDocumentBeAnimated(doc) {
            if (doc.ws) {
                if (!this.animatedDocuments.has(doc.id)) {
                    this.animatedDocuments.add(doc.id);
                    return true;
                }
            }
            return false;
        },
    },
};
</script>

<style scoped lang="sass">
.container
    height: $subscription-container-height
    overflow-y: hidden
    // MacOS scrollbar sometimes appear behind the content. This should help
    transform: translateZ(0)
</style>
