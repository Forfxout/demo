<template>
<v-dialog
    v-model="dialog"
    width="400"
>
    <template #activator="{ on: dialog }">
        <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
                <v-btn
                    icon
                    v-on="{ ...dialog, ...tooltip }"
                >
                    <v-icon small>fa-trash-alt</v-icon>
                </v-btn>
            </template>
            <span>Delete Stream</span>
        </v-tooltip>
    </template>

    <v-card>
        <v-card-title>Delete Stream "{{ subscription.name }}"?</v-card-title>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                @click="dialog = false"
                text
            >Cancel</v-btn>
            <v-btn
                @click="onDelete"
                text
                color="error"
            >Delete</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'DeleteSubscriptionBtn',
    props: ['subscription'],

    data() {
        return {
            dialog: false,
        };
    },

    methods: {
        ...mapActions({
            subscriptionDelete: 'monitoring/subscriptionDelete',
        }),

        onDelete() {
            this.dialog = false;
            this.subscriptionDelete(this.subscription.id);
        },
    },
};
</script>
