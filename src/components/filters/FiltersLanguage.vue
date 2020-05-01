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
        clearable
        multiple
    />
</v-list-item>
</template>

<script>
import { mapActions } from '@/store';
import { LANGUAGE_NAME_MAP } from '@/lib/languages';


export default {
    name: 'FiltersMultiSelect',

    props: {
        filter: Object,
        value: Array,
    },

    data() {
        return this.mapState({
            projectLanguages: 'common.projectLanguages',
        });
    },

    computed: {
        items() {
            return this.projectLanguages.map(lang => ({
                value: lang,
                text: LANGUAGE_NAME_MAP[lang],
            }));
        },
    },

    methods: {
        ...mapActions({
            setValue: 'search/setFilterValue',
        }),

        onChange(value) {
            this.setValue([this.filter.name, value]);
            this.$emit('change');
        },
    },
};
</script>
