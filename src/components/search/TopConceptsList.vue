<template>
<v-card
    :loading="loading"
    tile
>
    <v-card-title>Concepts</v-card-title>

    <v-card-text class="items-list">
        <v-list-item-group
            :value="itemGroupValue"
            @change="onChange"
            multiple
        >
            <v-list-item
                v-for="item in topConcepts"
                :key="item.concept.id"
                :value="item.concept.id"
                dense
                class="text-no-wrap px-0"
            >
                <v-list-item-icon class="mr-3">
                    <v-chip
                        :color="color(item.concept.id)"
                        link
                    >{{ item.doc_count }}</v-chip>
                </v-list-item-icon>

                <v-list-item-content>
                    {{ item.concept.name[lang] }}
                    <v-progress-linear
                        :value="item.doc_count / maxDocCount * 100"
                        :buffer-value="item.doc_count / maxDocCount * 100"
                    />
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-card-text>
</v-card>
</template>

<script>
import _ from 'lodash';

import { mapActions } from '@/store';


export default {
    name: 'TopConceptsList',
    data() {
        return this.mapState({
            loading: 'common.loadingTopConcepts',
            colorsConcepts: 'common.colorsConcepts',
            lang: 'common.lang',
            topConcepts: 'search.topConcepts',
            chartsGroupBy: 'search.chartsGroupBy',
            queryConcepts: 'search.queryConcepts',
        });
    },

    computed: {
        itemGroupValue() {
            return this.queryConcepts.map(item => item.id);
        },

        maxDocCount() {
            return _.maxBy(
                this.topConcepts, item => item.doc_count,
            ).doc_count;
        },
    },

    methods: {
        ...mapActions({
            doMapUpdate: 'search/doMapUpdate',
            doSearchOnMap: 'search/doSearchOnMap',
            setQueryConcepts: 'search/setQueryConcepts',
        }),

        onChange(conceptIds) {
            const value = conceptIds.map(
                cid => this.topConcepts.find(i => i.concept.id === cid).concept,
            );
            this.setQueryConcepts(value);
            this.doMapUpdate();
            this.doSearchOnMap();
        },

        color(conceptId) {
            if (this.chartsGroupBy !== 'topics') {
                return this.colorsConcepts[conceptId];
            }
            return null;
        },
    },
};
</script>

<style scoped lang="sass">
@import '@/styles/fixed_height_items_list.sass'
</style>
