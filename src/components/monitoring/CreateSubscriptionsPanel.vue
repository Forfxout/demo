<template>
<div class="create-subscription-panel">
    <update-subscription-form
        v-if="showSubsForm"
        @cancel="setShowSubsForm(false)"
        @saved="onSave"
        :default-name="proposedSubName_"
        class="pa-1"
    />
</div>
</template>

<script>
import { mapActions } from '@/store';

import UpdateSubscriptionForm from '@/components/monitoring/UpdateSubscriptionForm.vue';


export default {
    name: 'CreateSubscriptionsPanel',

    components: {
        UpdateSubscriptionForm,
    },

    data() {
        return {
            proposedSubName_: '',
            ...this.mapState({
                showSubsForm: 'monitoring.showSubsForm',
                workspaceId: 'common.workspaceId',
                proposedSubName: 'search.proposedSubName',
            }),
        };
    },

    watch: {
        proposedSubName(value) {
            // Change proposed name only when form is closed to avoid changing user input
            if (!this.showSubsForm) {
                this.proposedSubName_ = value;
            }
        },

        showSubsForm(value) {
            if (!value) {
                this.proposedSubName_ = this.proposedSubName;
            }
        },
    },

    methods: {
        ...mapActions({
            setShowSubsForm: 'monitoring/setShowSubsForm',
        }),

        onSave({ subscriptionId }) {
            this.setShowSubsForm(false);
            this.$router.push({
                name: 'monitoring',
                params: {
                    workspaceId: this.workspaceId,
                },
            });
        },
    },
};
</script>

<style scoped lang="sass">
.create-subscription-panel
    position: fixed
    width: 100%
    padding-right: $sidebar-width
</style>
