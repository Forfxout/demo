<template>
<v-card
    class="mx-auto"
    max-width="600"
>
    <v-list>
        <v-list-item>
            <v-list-item-title>Email</v-list-item-title>
            <v-list-item-subtitle class="text-right">{{ profile.email }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
            <v-list-item-title>First name</v-list-item-title>
            <v-list-item-subtitle class="text-right">{{ profile.first_name }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
            <v-list-item-title>Last name</v-list-item-title>
            <v-list-item-subtitle class="text-right">{{ profile.last_name }}</v-list-item-subtitle>
        </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-card-actions>
        <v-spacer />
        <v-btn
            :to="{ name: 'change-profile', params: { workspaceId } }"
            text
        >Edit</v-btn>
    </v-card-actions>
</v-card>
</template>

<script>
export default {
    name: 'UserProfile',

    data() {
        return this.mapState({
            workspaceId: 'common.workspaceId',
            profile: 'auth.profile',
        });
    },
};
</script>
