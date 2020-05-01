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

        <main-topic-select-sidebar @change="$emit('filter-change')" />
        <v-divider />

        <filters-multi-select
            :filter="filters.type"
            :value="filtersValues.type"
            @change="$emit('filter-change')"
        />

        <filters-language
            :filter="filters.lang"
            :value="filtersValues.lang"
            @change="$emit('filter-change')"
        />

        <filters-date-filter
            v-if="!hideDateFrom"
            setFilterValueAction="search/setFilterValue"
            :filter="filters.dateFrom"
            :value="filtersValues.dateFrom"
            @change="$emit('filter-change')"
        />

        <filters-date-filter
            v-if="!hideDateTo"
            setFilterValueAction="search/setFilterValue"
            :filter="filters.dateTo"
            :value="filtersValues.dateTo"
            @change="$emit('filter-change')"
        />

        <filters-country
            :filter="filters.geoCountry"
            :value="filtersValues.geoCountry"
            @change="$emit('filter-change')"
        />

        <filters-concept-category
            :filter="filters.conceptCategories"
            :value="filtersValues.conceptCategories"
            @change="$emit('filter-change')"
        />

        <filters-order-by
            v-if="!hideOrderBy"
            :filter="filters.orderBy"
            :value="filtersValues.orderBy"
            @change="$emit('filter-change')"
        />

        <filters-bool-null
            :filter="filters.hasCoverImage"
            :value="filtersValues.hasCoverImage"
            @change="$emit('filter-change')"
        />

        <filters-bool-null
            :filter="filters.hasVideo"
            :value="filtersValues.hasVideo"
            @change="$emit('filter-change')"
        />
    </v-list>
</v-navigation-drawer>
</template>

<script>
import FiltersBoolNull from '@/components/filters/FiltersBoolNull.vue';
import FiltersConceptCategory from '@/components/filters/FiltersConceptCategory.vue';
import FiltersCountry from '@/components/filters/FiltersCountry.vue';
import FiltersDateFilter from '@/components/filters/FiltersDateFilter.vue';
import FiltersLanguage from '@/components/filters/FiltersLanguage.vue';
import FiltersMultiSelect from '@/components/filters/FiltersMultiSelect.vue';
import FiltersOrderBy from '@/components/filters/FiltersOrderBy.vue';
import MainTopicSelectSidebar from '@/components/search/MainTopicSelectSidebar.vue';
import Navigation from '@/components/sidebar/Navigation.vue';


export default {
    name: 'SearchSidebar',
    props: {
        hideDateFrom: Boolean,
        hideDateTo: Boolean,
        hideOrderBy: Boolean,
    },
    components: {
        FiltersBoolNull,
        FiltersConceptCategory,
        FiltersCountry,
        FiltersDateFilter,
        FiltersLanguage,
        FiltersMultiSelect,
        FiltersOrderBy,
        MainTopicSelectSidebar,
        Navigation,
    },

    data() {
        return this.mapState({
            filters: 'search.filters',
            filtersValues: 'search.filtersValues',
            filtersOpen: 'search.filtersOpen',
        });
    },
};
</script>
