<template>
<v-list-item
    @click.prevent
    dense
>
    <v-menu
        v-model="menu"
        offset-y
    >
        <template #activator="{ on }">
            <v-text-field
                :label="filter.title"
                :value="value"
                :prepend-icon="filter.icon"
                :append-icon="value ? 'fa-times' : null"
                @click:append="clearValue"
                v-on="on"
                readonly
                single-line
            />
        </template>

        <v-date-picker
            :value="datePickerValue"
            @change="onChange"
            no-title
            scrollable
        />
    </v-menu>
</v-list-item>
</template>

<script>
import moment from 'moment';

import { mapActions } from '@/store';


export default {
    name: 'FiltersDateFilter',

    props: {
        filter: Object,
        value: String,
        setFilterValueAction: {
            type: String,
            validator: value => ['search/setFilterValue', 'dyntopics/setFilterValue'].includes(value),
        },
    },

    data() {
        return {
            menu: false,
        };
    },

    computed: {
        datePickerValue() {
            if (!this.value) {
                return null;
            }
            return moment(this.value).format('YYYY-MM-DD');
        },
    },

    methods: {
        ...mapActions({
            'search/setFilterValue': 'search/setFilterValue',
            'dyntopics/setFilterValue': 'dyntopics/setFilterValue',
        }),

        onChange(value) {
            const dateTimeValue = value ? moment(value).format(this.filter.format) : value;
            this[this.setFilterValueAction]([this.filter.name, dateTimeValue]);
            this.$emit('change');
        },

        clearValue() {
            if (this.value) {
                this[this.setFilterValueAction]([this.filter.name, null]);
                this.$emit('change');
            }
        },
    },
};
</script>
