<template>
<v-card
    :loading="loading"
    tile
>
    <v-card-title>Topics</v-card-title>

    <v-card-text class="items-list">
        <v-list-item-group
            :value="itemGroupValue"
            @change="onChange"
            multiple
        >
            <v-list-item
                v-for="item in topTopics"
                :key="item.topic.id"
                :value="item.topic.id"
                dense
                class="text-no-wrap px-0"
            >
                <v-list-item-icon class="mr-3">
                    <v-chip
                        :color="color(item.topic.id)"
                        link
                    >{{ item.doc_count }}</v-chip>
                </v-list-item-icon>

                <v-list-item-content>
                    {{ item.topic.name[lang] }}
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
    name: 'TopTopicsList',
    data() {
        return this.mapState({
            loading: 'common.loadingTopTopics',
            lang: 'common.lang',
            chartsGroupBy: 'search.chartsGroupBy',
            queryTopics: 'search.queryTopics',
            colorsTopics: 'common.colorsTopics',
            topTopics: 'search.topTopics',
        });
    },

    computed: {
        itemGroupValue() {
            return this.queryTopics.map(item => item.id);
        },

        maxDocCount() {
            return _.maxBy(
                this.topTopics, item => item.doc_count,
            ).doc_count;
        },
    },

    methods: {
        ...mapActions({
            doMapUpdate: 'search/doMapUpdate',
            doSearchOnMap: 'search/doSearchOnMap',
            setQueryTopics: 'search/setQueryTopics',
        }),

        onChange(topicIds) {
            const value = topicIds.map(
                tid => this.topTopics.find(i => i.topic.id === tid).topic,
            );
            this.setQueryTopics(value);
            this.doMapUpdate();
            this.doSearchOnMap();
        },

        color(topicId) {
            if (this.chartsGroupBy === 'topics') {
                return this.colorsTopics[topicId];
            }
            return null;
        },
    },
};
</script>

<style scoped lang="sass">
@import '@/styles/fixed_height_items_list.sass'
</style>
