<template>
<v-navigation-drawer
    :value="true"
    app
    clipped
    permanent
>
    <v-list
        dense
        expand
    >
        <navigation />
        <v-divider />

        <filters-date-filter
            setFilterValueAction="dyntopics/setFilterValue"
            :filter="filters.dateFrom"
            :value="filtersValues.dateFrom"
        />

        <filters-date-filter
            setFilterValueAction="dyntopics/setFilterValue"
            :filter="filters.dateTo"
            :value="filtersValues.dateTo"
        />
    </v-list>
</v-navigation-drawer>
</template>

<script>
import FiltersDateFilter from '@/components/filters/FiltersDateFilter.vue';
import Navigation from '@/components/sidebar/Navigation.vue';


export default {
    name: 'DyntopicsSidebar',
    components: {
        FiltersDateFilter,
        Navigation,
    },

    data() {
        return this.mapState({
            filters: 'dyntopics.filters',
            filtersValues: 'dyntopics.filtersValues',
        });
    },
};
</script>
