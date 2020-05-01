<template>
<v-list-item
    @click.prevent
    dense
>
    <v-select
        :value="inputValue"
        :items="items"
        @change="onChange"
        :label="filter.title"
        :prepend-icon="filter.icon"
        clearable
        single-line
    />
</v-list-item>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'FiltersBoolNull',

    props: {
        filter: Object,
        value: Boolean,
    },

    data() {
        return {
            items: [{
                text: 'Yes',
                value: 'yes',
            }, {
                text: 'No',
                value: 'no',
            }],
        };
    },

    computed: {
        inputValue() {
            if (this.value === true) {
                return 'yes';
            }
            if (this.value === false) {
                return 'no';
            }
            return this.value;
        },
    },

    methods: {
        ...mapActions({
            setValue: 'search/setFilterValue',
        }),

        onChange(value) {
            if (value === undefined) {
                this.setValue([this.filter.name, null]);
            } else {
                this.setValue([this.filter.name, value === 'yes']);
            }
            this.$emit('change');
        },
    },
};
</script>
