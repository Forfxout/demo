<template>
<v-list-item
    @click.prevent
    dense
>
    <v-select
        :value="value"
        :items="filter.items"
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


export default {
    name: 'FiltersMultiSelect',

    props: {
        filter: Object,
        value: Array,
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
