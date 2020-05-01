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
    </v-list>
</v-navigation-drawer>
</template>

<script>
import Navigation from '@/components/sidebar/Navigation.vue';


export default {
    name: 'ProfileSidebar',
    components: {
        Navigation,
    },
};
</script>
