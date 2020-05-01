<template>
<v-tooltip
    bottom
>
    <template #activator="{ on }">
        <div>
            <v-btn
                v-if="!showSubsForm"
                color="primary"
                @click="setShowSubsForm(true)"
                v-on="on"
                class="mr-1 sub-form-btn"
                depressed
            >
                <v-icon left small>fa-save</v-icon>
                Save
            </v-btn>

            <v-btn
                v-if="showSubsForm"
                color="secondary"
                @click="setShowSubsForm(false)"
                v-on="on"
                class="mr-1 sub-form-btn"
                depressed
            >
                <v-icon left small>fa-times-circle</v-icon>
                Close
            </v-btn>
        </div>
    </template>
    <span>{{ showSubsForm ? 'Close save form' : 'Save a search query to Stream' }}</span>
</v-tooltip>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'ShowSubFormBtn',

    data() {
        return this.mapState({
            showSubsForm: 'monitoring.showSubsForm',
        });
    },

    methods: {
        ...mapActions({
            setShowSubsForm: 'monitoring/setShowSubsForm',
        }),
    },
};
</script>
<style scoped lang="sass">
.sub-form-btn
    width: 120px
    height: 38px !important
    border-radius: 0 5px 5px 0
    margin-left: -5px
</style>
