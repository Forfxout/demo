<template>
<fragment>
    <top-toolbar />
    <profile-sidebar />

    <v-content>
        <loading-indicator />
        <error-message />

        <v-container fluid>
            <change-profile-form
                :profile="profile"
                @cancel="$router.push({ name: 'profile', params: { workspaceId } })"
                @saved="$router.push({ name: 'profile', params: { workspaceId } })"
            />
        </v-container>
    </v-content>
</fragment>
</template>

<script>
import ProfileSidebar from '@/components/sidebar/ProfileSidebar.vue';
import ChangeProfileForm from '@/components/auth/ChangeProfileForm.vue';


export default {
    name: 'ChangeProfilePage',
    components: {
        ProfileSidebar,
        ChangeProfileForm,
    },

    data() {
        return this.mapState({
            workspaceId: 'common.workspaceId',
            profile: 'auth.profile',
        });
    },
};
</script>
