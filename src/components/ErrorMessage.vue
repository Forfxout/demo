<template>
<v-snackbar
    :value="!!error"
    color="error"
    top
>
    {{ error }}
    <v-btn
        text
        @click="setError(null)"
    >
        Close
    </v-btn>
</v-snackbar>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'ErrorMessage',

    data() {
        return this.mapState({
            error: 'common.error',
        });
    },

    methods: mapActions({
        setError: 'common/setError',
    }),
};
</script>
