<template>
<v-container
    fluid
    class="container"
>
    <div v-if="dyntopics!==null">
        <div
            v-for="dyntopic of processedDyntopics"
            :key="dyntopic.id"
            class="dyntopic"
        >
            <div class="dyntopic-header">
                <h2
                    class="dyntopic-title"
                    @click="onClickDyntopic(dyntopic.id)"
                >{{ dyntopic.name[lang] }}</h2>
                <div class="dyntopic-sparkline" :title="dyntopic.timelineTitle">
                    <sparkline
                        :value="dyntopic.timelineValues"
                        :domain="dyntopic.domain"
                        line-width="2"
                        fill-color="#DDDDDD"
                    ></sparkline>
                </div>
            </div>

            <div class="secondary--text">
                {{ dyntopic.top_docs.length }} recent documents of total {{ dyntopic.docsCount }}:
            </div>

            <div class="document-group">
                <document
                    v-for="doc of dyntopic.top_docs"
                    v-once
                    :key="doc.id"
                    :doc="doc"
                    :height="documentHeight"
                    @select="setSelectedDocumentId({
                        docId: doc.id,
                        query: '',
                        concepts: [],
                    })"
                    class="document"
                />
            </div>
        </div>
    </div>

    <div v-if="dyntopics===null" class="pa-2">Loading dynamic topics...</div>
    <div v-else-if="dyntopics.length===0" class="pa-2">No dynamic topics for selected dates</div>
</v-container>
</template>

<script>
import * as moment from 'moment';

import Document from '@/components/document/Document.vue';
import Sparkline from '@/components/general/Sparkline.vue';

import { mapActions } from '@/store';

const DOCUMENT_BLOCK_HEIGHT = 200;


export default {
    name: 'DyntopicsList',
    components: {
        Document,
        Sparkline,
    },

    data() {
        return {
            documentHeight: DOCUMENT_BLOCK_HEIGHT,
            ...this.mapState({
                dyntopics: 'dyntopics.dyntopics',
                dateFrom: 'dyntopics.filtersValues.dateFrom',
                dateTo: 'dyntopics.filtersValues.dateTo',
                lang: 'common.lang',
                workspaceId: 'common.workspaceId',
            }),
        };
    },

    computed: {
        processedDyntopics() {
            if (this.dyntopics === null) {
                return null;
            }
            let max = 0;
            const res = this.dyntopics.map((dt) => {
                const start = moment(this.dateFrom);
                const end = moment(this.dateTo);
                const values = [];
                const title = [];
                while (start <= end) {
                    const date = start.format('YYYY-MM-DD');
                    const value = dt.timeline[date] || 0;
                    title.push(`${date}: ${value}`);
                    values.push(value);
                    start.add(1, 'days');
                }
                max = Math.max(max, ...values);
                return Object.assign({}, dt, {
                    timelineValues: values,
                    docsCount: values.reduce((a, b) => a + b, 0),
                    timelineTitle: title.join('\n'),
                });
            });
            res.forEach((dt) => { Object.assign(dt, { domain: [0, max] }); });
            return res;
        },
    },

    methods: {
        ...mapActions({
            setDyntopicQuery: 'dyntopics/setDyntopicQuery',
            setSelectedDocumentId: 'search/setSelectedDocumentId',
        }),

        onClickDyntopic(dyntopicId) {
            this.setDyntopicQuery({ query: `dyntopic:${dyntopicId}` });
            this.$router.push({
                name: 'search',
                params: {
                    workspaceId: this.workspaceId,
                },
            });
        },
    },
};
</script>

<style scoped lang="sass">
.container
    overflow-y: scroll
    height: $dyntopics-container-height
    width: $dyntopics-container-width

.dyntopic
    margin-bottom: 40px

.dyntopic-header
    display: flex
    flex-direction: row

.dyntopic-title
    color: #337ab7
    cursor: pointer
    font-size: 2em

.dyntopic-title:hover
    color: #1565c0
    text-decoration: underline

.dyntopic-sparkline
    width: 172px
    margin-left: 20px

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
