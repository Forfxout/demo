<template>
<v-toolbar-items>
    <v-menu offset-y>
        <template #activator="{ on: menu }">
            <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                    <v-btn
                        v-on="{ ...menu, ...tooltip }"
                        text
                    >{{ mainTopic ? mainTopic.name.en : "Select Topic" }}</v-btn>
                </template>
                <span>Select Main Topic</span>
            </v-tooltip>
        </template>

        <v-card
            class="pl-2"
            width="300"
        >
            <v-treeview
                :items="topics"
                :active="value"
                @update:active="onChange"
                item-text="name.en"
                hoverable
                dense
                open-all
                activatable
            />
        </v-card>
    </v-menu>
</v-toolbar-items>
</template>

<script>
// DEPRECETED
import { mapActions } from '@/store';

import { cutTree, findItemById } from '@/lib/treeData';


export default {
    name: 'MainTopicSelectTop',

    data() {
        return this.mapState({
            mainTopic: 'search.mainTopic',
            ontologyTopics: 'common.ontologyTopics',
        });
    },

    computed: {
        topics() {
            const level = 2;
            return cutTree(this.ontologyTopics, level);
        },

        value() {
            if (this.mainTopic) {
                return [this.mainTopic.id];
            }
            return [];
        },
    },

    methods: {
        ...mapActions({
            setMainTopic: 'search/setMainTopic',
        }),

        onChange(value) {
            const topicId = value[0];
            if (topicId) {
                this.setMainTopic(findItemById(this.topics, topicId));
            }
        },
    },
};
</script>
