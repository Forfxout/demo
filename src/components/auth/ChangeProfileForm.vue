<template>
<v-form
    @submit.prevent="save"
>
    <v-card
        flat
        outlined
        class="mx-auto"
        max-width="600"
    >
        <v-card-title>
            Change your profile data
        </v-card-title>

        <v-card-text>
            <v-text-field
                v-model="firstName"
                label="First name"
                required
            />

            <v-text-field
                v-model="lastName"
                label="Last name"
                required
            />
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                @click="$emit('cancel')"
                text
            >
                <v-icon left small>fa-times-circle</v-icon>
                Cancel
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
import { mapActions } from '@/store';


export default {
    name: 'ChangeProfileForm',
    props: {
        profile: Object,
    },

    data() {
        return {
            saving: false,
            firstName: this.profile.first_name,
            lastName: this.profile.last_name,
        };
    },

    watch: {
        profile(profile) {
            this.firstName = profile.first_name;
            this.lastName = profile.last_name;
        },
    },

    computed: {
        isEmpty() {
            return !this.firstName || !this.lastName;
        },
    },

    methods: {
        ...mapActions({
            profileSave: 'auth/profileSave',
            setError: 'common/setError',
        }),

        save() {
            if (this.isEmpty) {
                return;
            }
            this.saving = true;

            const data = {
                first_name: this.firstName,
                last_name: this.lastName,
            };
            this.profileSave(data, this.onSuccess, this.onError);
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
