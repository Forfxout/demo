<template>
<v-form
    @submit.prevent="save"
>
    <v-card
        flat
        outlined
    >
        <v-card-title
            v-if="subscription"
            class="pt-2 pb-0"
        >
            Edit Stream "{{ subscription.name }}"
        </v-card-title>
        <v-card-title
            v-else
            class="pt-2 pb-0"
        >
            Create new Stream
        </v-card-title>

        <v-container class="py-0">
            <v-row>
                <v-col class="py-1" cols="12" md="3">
                    <v-text-field
                        v-model="name"
                        class="pt-0"
                        label="Name"
                    />
                </v-col>
                <v-col class="py-1" cols="12" md="3">
                    <v-select
                        v-model="notifyEmailType"
                        :items="notifyEmailChoices"
                        class="pt-0"
                        label="Email notification"
                    ></v-select>
                </v-col>
            </v-row>
        </v-container>

        <v-card-actions class="py-0">
            <v-spacer></v-spacer>
            <v-btn
                @click="$emit('cancel')"
                text
            >
                <v-icon left small>fa-times-circle</v-icon>
                Close
            </v-btn>
            <v-btn
                :disabled="isEmpty || saving"
                type="submit"
                color="success"
                text
            >
                <v-icon left small>fa-save</v-icon>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</v-form>
</template>

<script>
import _ from 'lodash';
import { mapActions } from '@/store';

const NOTIFY_NONE = 'none';


export default {
    name: 'UpdateSubscriptionForm',
    props: {
        subscription: Object,
        defaultName: {
            type: String,
            default: '',
        },
    },

    data() {
        const data = {
            saving: false,
            name: this.defaultName,
            notifyEmailType: NOTIFY_NONE,
            ...this.mapState({
                notifyEmailChoices: 'common.notifyEmailChoices',
            }),
        };

        if (this.subscription) {
            Object.assign(data, {
                name: this.subscription.name,
                notifyEmailType: this.subscription.notify_email_type,
            });
        }

        return data;
    },

    watch: {
        subscription(subscription) {
            this.name = subscription.name;
            this.notifyEmailType = subscription.notify_email_type;
        },

        defaultName(value) {
            this.name = value;
        },
    },

    computed: {
        isEmpty() {
            return !this.name;
        },
    },

    methods: {
        ...mapActions({
            subscriptionSave: 'monitoring/subscriptionSave',
            setError: 'common/setError',
        }),

        save() {
            if (this.isEmpty) {
                return;
            }
            this.saving = true;

            const data = {
                id: this.subscription && this.subscription.id,
                name: this.name,
                notifyEmailType: this.notifyEmailType,
            };
            // Add delay because search onChange is triggered after onBlur and save
            _.delay(this.subscriptionSave, 50, data, this.onSuccess, this.onError);
        },

        onSuccess(data) {
            this.saving = false;
            this.$emit('saved', data);
        },

        onError(errors) {
            this.saving = false;
            this.setError(errors[0].msg);
        },
    },
};
</script>
