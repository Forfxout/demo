<template>
<v-tabs>
    <v-tab
        :to="{ name: 'search' }"
        exact
    >
        <v-icon class="mr-2">fa-search</v-icon> Search
    </v-tab>
    <v-tab
        :to="{ name: 'map' }"
        exact
    >
        <v-icon class="mr-2">fa-map</v-icon> Map
    </v-tab>
    <v-tab
        :to="{ name: 'timeline' }"
        exact
    >
        <v-icon class="mr-2">fa-chart-bar</v-icon> Timeline
    </v-tab>
    <v-tab
        :to="{ name: 'relations' }"
        exact
    >
        <v-icon class="mr-2">fa-chart-area</v-icon> Relations
    </v-tab>
    <v-tab
        :to="{ name: 'influencers' }"
        exact
    >
        <v-icon class="mr-2">fa-users</v-icon> Influencers
    </v-tab>
</v-tabs>
</template>

<script>
export default {
    name: 'SearchNavigation',
};
</script>
