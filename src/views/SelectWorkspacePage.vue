<template>
<v-content>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <error-message />

                <v-card class="elevation-6">
                    <v-card-text>
                        <v-form @submit.prevent="goToCurrentWorkspace">
                            <v-text-field
                                v-model="workspaceId"
                                label="Enter Workspace ID"
                                type="text"
                                append-outer-icon="fa-arrow-circle-right"
                                @click:append-outer="goToCurrentWorkspace"
                            />
                        </v-form>
                    </v-card-text>
                </v-card>

                <v-card
                    v-for="workspace in workspaces"
                    :key="workspace.id"
                    class="mt-2 elevation-6"
                    @click="goToWorkspace(workspace.id)"
                >
                    <v-card-actions>
                        <v-list-item class="grow">
                            <v-list-item-content>
                                <v-list-item-title>{{ workspace.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-layout
                                align-center
                                justify-end
                            >
                                <v-icon>fa-arrow-circle-right</v-icon>
                            </v-layout>
                        </v-list-item>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</v-content>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue';
import { getWorkspacesChoicesFromCache } from '@/lib/workspacesManager';


export default {
    name: 'SelectWorkspacePage',
    components: {
        ErrorMessage,
    },

    data() {
        return {
            workspaceId: null,
            workspaces: getWorkspacesChoicesFromCache(),
        };
    },

    methods: {
        goToCurrentWorkspace() {
            this.$router.push({
                name: 'search', params: { workspaceId: this.workspaceId },
            });
        },

        goToWorkspace(workspaceId) {
            this.$router.push({
                name: 'search', params: { workspaceId },
            });
        },
    },
};
</script>
