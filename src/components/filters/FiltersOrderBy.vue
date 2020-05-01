<template>
<v-list-item
    @click.prevent
    dense
>
    <v-select
        :value="value"
        :items="items"
        @change="onChange"
        :label="filter.title"
        :prepend-icon="filter.icon"
        single-line
    />
</v-list-item>
</template>

<script>
import FiltersSelect from '@/components/filters/FiltersSelect.vue';

export default {
    name: 'FiltersOrderBy',
    extends: FiltersSelect,

    data() {
        return this.mapState({
            query: 'search.query',
        });
    },

    computed: {
        items() {
            const items = [{
                text: 'Publishing Date DESC',
                value: 'publishing_date_desc',
            }, {
                text: 'Publishing Date ASC',
                value: 'publishing_date_asc',
            }, {
                text: 'Indexing Date DESC',
                value: 'indexing_date_desc',
            }, {
                text: 'Indexing Date ASC',
                value: 'indexing_date_asc',
            }];

            if (this.query) {
                items.push({
                    text: 'Score',
                    value: 'score',
                });
            }
            return items;
        },
    },
};
</script>
