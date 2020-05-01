<template>
<combobox-with-text-input
    ref="combobox"
    @change="onChange"
    @blur="onBlur"
    @click:clear="onClear"
    :value="value"
    :items="items"
    :query-input.sync="search"
    placeholder="Start searching for documents"
    append-icon=""
    prepend-inner-icon="fa-search"
    autofocus
    clearable
    dense
    flat
    hide-details
    hide-no-data
    hide-selected
    multiple
    no-filter
    return-object
    solo
>
    <template #selection="{ item }">
        <v-chip
            v-if="item.chip"
            :key="JSON.stringify(item)"
            @click:close="onChipClose(item)"
            :color="item.color"
            outlined
            close
        >
            {{ item.text }}
        </v-chip>
    </template>

    <template #item="{ item }">
        <v-chip
            :color="item.color"
            outlined
        >
            {{ item.text }}
        </v-chip>
    </template>
</combobox-with-text-input>
</template>

<script>
// There is a redirect to Explore page if search happens on other page.
// See frontend/src/store/slices/search/epics.js

// TODO: Some ideas how improve search flow:
//       - Use one action to set query instead of setQuery, setQueryTopics, setQueryConcepts, etc.
//       - Split query on Explore page and Subscription edit. Pass query to this component.
import _ from 'lodash';

import { mapActions } from '@/store';
import ComboboxWithTextInput from '@/components/general/ComboboxWithTextInput.vue';

const COLOR_TOPIC = 'topic';
const COLOR_CONCEPT = 'concept';


export default {
    name: 'SearchInput',

    props: {
        keepSearchQuery: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        ComboboxWithTextInput,
    },

    data() {
        let queryData = {
            query: '',
            queryTopics: [],
            queryConcepts: [],
        };

        if (this.keepSearchQuery) {
            queryData = this.mapState({
                query: 'search.query',
                queryTopics: 'search.queryTopics',
                queryConcepts: 'search.queryConcepts',
            });
        }
        return {
            ...this.mapState({
                lang: 'common.lang',
                suggestedTopics: 'search.suggestedTopics',
                suggestedConcepts: 'search.suggestedConcepts',
            }),
            ...queryData,
            search: queryData.query, // Fill text input
        };
    },

    computed: {
        value() {
            const output = [];

            this.queryTopics.forEach(topic => output.push({
                text: topic.name[this.lang],
                chip: true,
                color: COLOR_TOPIC,
                value: topic.id, // Used by hide-selected
                topic,
            }));

            this.queryConcepts.forEach(concept => output.push({
                text: concept.name[this.lang],
                chip: true,
                color: COLOR_CONCEPT,
                value: concept.id, // Used by hide-selected
                concept,
            }));

            if (this.query) {
                // Plain text is not displayed as a chip. We show query in text input
                output.push(this.query);
            }
            return output;
        },

        items() {
            const output = [];

            this.suggestedTopics.forEach(topic => output.push({
                text: topic.name[this.lang],
                value: topic.id, // Used by hide-selected
                color: COLOR_TOPIC,
                topic,
            }));

            this.suggestedConcepts.forEach(concept => output.push({
                text: concept.name[this.lang],
                value: concept.id, // Used by hide-selected
                color: COLOR_CONCEPT,
                concept,
            }));

            return output;
        },
    },

    watch: {
        search(val) {
            // Trigger autocomplete when text input is changed
            let term = val;
            if (val) {
                // Get word under cursor position. Sending whole query makes suggestion useless
                const position = this.$refs.combobox.getCursorPosition();
                const parts = [
                    _.last(val.substring(0, position).split(/\W+/)),
                    _.first(val.substring(position).split(/\W+/)),
                ];
                term = parts.join('');
            }
            this.setSuggestTerm(term);
        },

        query(val) {
            // Update input when query is changed
            this.search = val;
        },
    },

    methods: {
        ...mapActions({
            setQuery: 'search/setQuery',
            setSuggestTerm: 'search/setSuggestTerm',
            setQueryTopics: 'search/setQueryTopics',
            setQueryConcepts: 'search/setQueryConcepts',
            removeQueryTopic: 'search/removeQueryTopic',
            removeQueryConcept: 'search/removeQueryConcept',
        }),

        onChange(rawValue) {
            this.$refs.combobox.closeMenu();

            let query = '';
            const topics = [];
            const concepts = [];
            rawValue.filter(item => item).forEach((item) => {
                // Just created keyword
                if (typeof item !== 'object') {
                    // Last string item contains current input value
                    query = item;
                // Topic
                } else if (item.topic) {
                    topics.push(item.topic);
                // Concept
                } else if (item.concept) {
                    concepts.push(item.concept);
                }
            });

            this.setQuery(query);
            this.setQueryConcepts(concepts);
            this.setQueryTopics(topics);
            this.$emit('change');
        },

        onBlur(value) {
            // Just save query for create/edit Subscription and keep query
            // when you switch page
            const newQuery = this.$refs.combobox.searchInputVal;
            if (newQuery !== this.query) {
                this.setQuery(newQuery);
            }
        },

        onChipClose(item) {
            if (item.topic) {
                this.removeQueryTopic(item.topic);
            } else if (item.concept) {
                this.removeQueryConcept(item.concept);
            }
            this.$emit('change');
        },

        onClear() {
            this.setQuery('');
            this.setQueryTopics([]);
            this.setQueryConcepts([]);
            this.$emit('change');
        },
    },
};
</script>
