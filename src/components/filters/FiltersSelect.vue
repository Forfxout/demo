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
    />
</v-list-item>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'FiltersSelect',

    props: {
        filter: Object,
        value: String,
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
