<template>
<v-card>
    <v-card-text>
        <v-row>
            <v-col :cols="4">
                <relations-dimension-choice
                    :value="relationsDimension1Type"
                    @change="onChangeDimensionType1"
                />
            </v-col>

            <v-col :cols="2">
                <v-tooltip left>
                    <template #activator="{ on }">
                        <v-switch
                            :value="labelColors === 'source'"
                            @change="onChangeSourceColors"
                            v-on="on"
                        />
                    </template>
                    <span>Colors from source</span>
                </v-tooltip>
            </v-col>

            <v-col
                :cols="2"
                class="d-flex flex-row-reverse"
            >
                <v-tooltip left>
                    <template #activator="{ on }">
                        <v-switch
                            :value="labelColors === 'target'"
                            @change="onChangeTargetColors"
                            v-on="on"
                        />
                    </template>
                    <span>Colors from target</span>
                </v-tooltip>
            </v-col>

            <v-col :cols="4">
                <relations-dimension-choice
                    :value="relationsDimension2Type"
                    @change="onChangeDimensionType2"
                />
            </v-col>
        </v-row>

        <Plotly
            :data='data'
            :layout='layout'
            :display-mode-bar='false'
            @click="onClick"
        />
    </v-card-text>
</v-card>
</template>

<script>
import tinycolor from 'tinycolor2';
import { Plotly } from 'vue-plotly';

import { mapActions } from '@/store';
import RelationsDimensionChoice from '@/components/charts/RelationsDimensionChoice.vue';
import { getColorsMap } from '@/utils/colors';

export default {
    name: 'RelationsChart',
    components: {
        Plotly,
        RelationsDimensionChoice,
    },

    data() {
        return {
            labelColors: null,
            layout: {
                dragmode: false,
                margin: {
                    l: 10,
                    r: 10,
                    t: 15,
                },
            },
            ...this.mapState({
                colorsConcepts: 'common.colorsConcepts',
                colorsACategories: 'common.colorsACategories',
                colorsCCategories: 'common.colorsCCategories',
                colorsTopics: 'common.colorsTopics',
                lang: 'common.lang',
                relationsDimension1: 'search.relationsDimension1',
                relationsDimension1Type: 'search.relationsDimension1Type',
                relationsDimension2: 'search.relationsDimension2',
                relationsDimension2Type: 'search.relationsDimension2Type',
                relationsLinks: 'search.relationsLinks',
            }),
        };
    },

    mounted() {
        // Load data on start
        if (this.relationsLinks === null) {
            this.loadData();
        }
    },

    computed: {
        data() {
            if (!this.relationsLinks) {
                return [];
            }

            const labels = [];
            const colors = [];

            let dimColors = this.getDimensionColors(this.relationsDimension1Type,
                this.relationsDimension1);
            this.relationsDimension1.forEach((item) => {
                labels.push(_.isString(item.name) ? item.name: item.name[this.lang]);
                colors.push(dimColors[item.id]);
            });

            dimColors = this.getDimensionColors(this.relationsDimension2Type,
                this.relationsDimension2);
            this.relationsDimension2.forEach((item) => {
                labels.push(_.isString(item.name) ? item.name: item.name[this.lang]);
                colors.push(dimColors[item.id]);
            });

            const links = {
                source: [],
                target: [],
                value: [],
                color: [],
            };
            const dim1length = this.relationsDimension1.length;
            this.relationsLinks.forEach((item) => {
                links.source.push(item.source);
                links.target.push(item.target + dim1length);
                links.value.push(item.value);
                let color;
                switch (this.labelColors) {
                case 'source':
                    color = tinycolor(colors[item.source]);
                    color.setAlpha(0.3);
                    break;
                case 'target':
                    color = tinycolor(colors[item.target + dim1length])
                    color.setAlpha(0.3);
                    break;
                default:
                    color = tinycolor('rgba(0, 0, 0, .2)');
                }
                links.color.push(color.toRgbString());
            });

            return [{
                type: 'sankey',
                orientation: 'h',
                node: {
                    pad: 10,
                    thickness: 30,
                    line: {
                        color: 'black',
                        width: 0.5,
                    },
                    label: labels,
                    color: colors,
                },
                link: links,
            }];
        },
    },

    methods: {
        ...mapActions({
            doRelationsUpdate: 'search/doRelationsUpdate',
            setRelationsDimension1Type: 'search/setRelationsDimension1Type',
            setRelationsDimension2Type: 'search/setRelationsDimension2Type',
            setRelationsSelectedLink: 'search/setRelationsSelectedLink',
        }),

        loadData() {
            this.doRelationsUpdate();
        },

        getDimensionColors(dimensionType, dimension) {
            switch (dimensionType.split(':')[0]) {
            case 'topics':
                return this.colorsTopics;
            case 'concept_categories':
                return this.colorsCCategories;
            case 'author_categories':
                return this.colorsACategories;
            case 'authors':
            case 'author_category':
                // TODO: Use global colors for authors
                return getColorsMap(dimension);
            case 'concept_category':
                return this.colorsConcepts;
            default:
                throw new Error('Undefined dimensions');
            }
        },

        onChangeDimensionType1(value) {
            this.setRelationsDimension1Type(value);
            this.loadData();
        },

        onChangeDimensionType2(value) {
            this.setRelationsDimension2Type(value);
            this.loadData();
        },

        onChangeSourceColors(value) {
            if (value) {
                this.labelColors = 'source';
            } else if (this.labelColors === 'source') {
                this.labelColors = null;
            }
        },

        onChangeTargetColors(value) {
            if (value) {
                this.labelColors = 'target';
            } else if (this.labelColors === 'target') {
                this.labelColors = null;
            }
        },

        onClick(event) {
            this.setRelationsSelectedLink(event.points[0].index);
        },
    },
};
</script>
