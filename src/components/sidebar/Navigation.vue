<template>
<v-list
    dense
    expand
>
    <v-list-item
        :to="{ name: 'search' }"
        exact
    >
        <v-list-item-action>
            <v-icon>fa-search</v-icon>
        </v-list-item-action>
        <v-list-item-title>Explore</v-list-item-title>
    </v-list-item>

    <v-list-item
        :to="{ name: 'monitoring' }"
        exact
    >
        <v-list-item-action>
            <v-icon>fa-newspaper</v-icon>
        </v-list-item-action>
        <v-list-item-title>
            Monitoring
        </v-list-item-title>
    </v-list-item>

    <v-list-item
        :to="{ name: 'dyntopics' }"
        exact
    >
        <v-list-item-action>
            <v-icon>fa-history</v-icon>
        </v-list-item-action>
        <v-list-item-title>
            Dynamic topics
        </v-list-item-title>
    </v-list-item>
</v-list>
</template>

<script>
export default {
    name: 'Navigation',
};
</script>
