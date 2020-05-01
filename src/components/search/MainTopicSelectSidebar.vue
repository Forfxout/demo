<template>
<v-list-item
    @click.prevent
    dense
>
    <v-select
        :value="value"
        :items="items"
        @change="onChange"
        label="Select main topic"
        single-line
    >
        <v-tooltip bottom slot="prepend">
            <template #activator="{ on }">
                <v-icon v-on="on">fa-book-open</v-icon>
            </template>
            <span>Select main topic</span>
        </v-tooltip>
    </v-select>
</v-list-item>
</template>

<script>
import { mapActions } from '@/store';

import { cutTree, findItemById } from '@/lib/treeData';


export default {
    name: 'MainTopicSelectSidebar',

    data() {
        return this.mapState({
            lang: 'common.lang',
            mainTopic: 'search.mainTopic',
            ontologyTopics: 'common.ontologyTopics',
        });
    },

    computed: {
        items() {
            const level = 1;
            const items = cutTree(this.ontologyTopics, level);
            const res = items.map(item => ({
                text: item.name[this.lang],
                value: item.id,
            }));
            return [{ text: 'All Topics', value: null }].concat(res);
        },

        value() {
            if (this.mainTopic) {
                return this.mainTopic.id;
            }
            return null;
        },
    },

    methods: {
        ...mapActions({
            setMainTopic: 'search/setMainTopic',
        }),

        onChange(value) {
            this.setMainTopic(value === null ? value : findItemById(this.ontologyTopics, value));
            this.$emit('change');
        },
    },
};
</script>
