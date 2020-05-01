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


export default {
    name: 'FiltersConceptCategory',

    props: {
        filter: Object,
        value: Array,
    },

    data() {
        return this.mapState({
            lang: 'common.lang',
            ontologyCCategories: 'common.ontologyCCategories',
        });
    },

    computed: {
        items() {
            return this.ontologyCCategories.map(cc => ({
                text: cc.name[this.lang],
                value: cc.id,
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
