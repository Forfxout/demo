<template>
<v-select
    :value="chartsGroupBy"
    :items="items"
    @change="onChange"
    label="Group by"
    solo
    class="group-by-select"
/>
</template>

<script>
import { mapActions } from '@/store';

export default {
    name: 'ChartsGroupBySelect',
    data() {
        return this.mapState({
            lang: 'common.lang',
            chartsGroupBy: 'search.chartsGroupBy',
            ontologyCCategories: 'common.ontologyCCategories',
        });
    },

    computed: {
        items() {
            const output = [{
                text: 'topics',
                value: 'topics',
            }];
            this.ontologyCCategories.forEach((item) => {
                output.push({
                    text: item.name[this.lang],
                    value: item.id,
                });
            });
            return output;
        },
    },

    methods: {
        ...mapActions({
            setChartsGroupBy: 'search/setChartsGroupBy',
            setFilterValue: 'search/setFilterValue',
        }),

        onChange(value) {
            this.setChartsGroupBy(value);
            this.$emit('change');
        },
    },
};
</script>

<style scoped lang="sass">
.group-by-select
    width: 200px
</style>
