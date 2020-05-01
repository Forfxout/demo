<template>
<v-list-group
    v-model="isOpen"
    :prepend-icon="filter.icon"
>
    <template #activator>
        <v-list-item-title>{{ filter.title }}</v-list-item-title>
    </template>

    <v-list-item
        v-for="item in filter.items"
        :key="item.title"
        @click.prevent
        dense
    >
        <v-list-item-action>
            <v-checkbox
                :input-value="value.includes(item.value)"
                @change="onChange(item.value, $event)"
            />
        </v-list-item-action>

        <v-list-item-content
            @click.prevent="onChange(item.value, !value.includes(item.value))"
        >
            <v-list-item-title>
                <slot name="title" :item="item">
                    {{ item.text }}
                </slot>
            </v-list-item-title>
        </v-list-item-content>

        <slot name="append" :item="item" />
    </v-list-item>
</v-list-group>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'FiltersCheckboxFilter',
    props: ['filter', 'value', 'open'],

    computed: {
        isOpen: {
            get() {
                return this.open;
            },
            set(val) {
                this.setFilterIsOpen([this.filter.name, val]);
            },
        },
    },

    methods: {
        ...mapActions({
            addValue: 'search/addFilterValue',
            removeValue: 'search/removeFilterValue',
            setFilterIsOpen: 'search/setFilterIsOpen',
        }),

        onChange(value, selected) {
            if (selected) {
                this.addValue([this.filter.name, value]);
            } else {
                this.removeValue([this.filter.name, value]);
            }
            this.$emit('change');
        },
    },
};
</script>
