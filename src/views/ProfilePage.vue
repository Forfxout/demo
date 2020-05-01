<template>
<fragment>
    <top-toolbar />
    <profile-sidebar />

    <v-content>
        <loading-indicator />
        <error-message />

        <v-container fluid>
            <user-profile />
        </v-container>
    </v-content>
</fragment>
</template>

<script>
import ProfileSidebar from '@/components/sidebar/ProfileSidebar.vue';
import UserProfile from '@/components/auth/UserProfile.vue';


export default {
    name: 'ProfilePage',
    components: {
        ProfileSidebar,
        UserProfile,
    },
};
</script>
