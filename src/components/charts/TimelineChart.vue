<template>
<v-card>
    <v-card-text>
        <Plotly
            :data="data"
            :layout="layout"
            :display-mode-bar="false"
        />

        <v-row>
            <v-col>
                <charts-group-by-select @change="loadData" />
            </v-col>
            <v-col>
                <timeline-resolution-select @change="loadData" />
            </v-col>
        </v-row>
    </v-card-text>
</v-card>
</template>

<script>
import _ from 'lodash';
import { Plotly } from 'vue-plotly';

import { mapActions } from '@/store';
import ChartsGroupBySelect from '@/components/charts/ChartsGroupBySelect.vue';
import TimelineResolutionSelect from '@/components/charts/TimelineResolutionSelect.vue';

const GROUP_BY_TOPICS = 'topics';

// TODO: Add total docs per day data
// TODO: Fix tick labels
export default {
    name: 'TimelineChart',
    components: {
        ChartsGroupBySelect,
        Plotly,
        TimelineResolutionSelect,
    },

    data() {
        return {
            layout: {
                showlegend: false,
                dragmode: false,
                barmode: 'stack',
                margin: {
                    l: 40,
                    r: 10,
                    t: 15,
                },
            },
            ...this.mapState({
                colorsConcepts: 'common.colorsConcepts',
                documentsTotal: 'search.documentsTotal',
                lang: 'common.lang',
                chartsGroupBy: 'search.chartsGroupBy',
                timelineData: 'search.timelineData',
                colorsTopics: 'common.colorsTopics',
            }),
        };
    },

    mounted() {
        // Load data on start
        if (this.timelineData === null) {
            this.loadData();
        }
    },

    computed: {
        data() {
            if (!this.timelineData) {
                return [];
            }

            const dataByObj = {};
            const colors = this.isGroupByTopic ? this.colorsTopics : this.colorsConcepts;

            this.timelineData.forEach((bucket, index) => {
                const label = new Date(Number(bucket.code));
                const items = this.isGroupByTopic ? bucket.topics : bucket.concepts;

                items.forEach((item) => {
                    const info = this.isGroupByTopic ? item.topic : item.concept;

                    if (!_.has(dataByObj, info.id)) {
                        dataByObj[info.id] = {
                            x: [],
                            y: [],
                            name: info.name[this.lang],
                            type: 'bar',
                            marker: {
                                color: colors[info.id],
                            },
                        };
                    }
                    const data = dataByObj[info.id];
                    data.x.push(label);
                    data.y.push(item.doc_count);
                });
            });
            return Object.values(dataByObj);
        },

        isGroupByTopic() {
            return this.chartsGroupBy === GROUP_BY_TOPICS;
        },
    },

    methods: {
        ...mapActions({
            doSearchOnTimeline: 'search/doSearchOnTimeline',
            doTimelineUpdate: 'search/doTimelineUpdate',
        }),

        loadData() {
            this.doSearchOnTimeline();
            this.doTimelineUpdate();
        },
    },
};
</script>
