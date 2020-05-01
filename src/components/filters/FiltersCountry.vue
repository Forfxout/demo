<template>
<v-list-item
    @click.prevent
    dense
>
    <v-autocomplete
        :value="value"
        :items="items"
        @change="onChange"
        :label="filter.title"
        :prepend-icon="filter.icon"
        auto-select-first
        deletable-chips
        hide-selected
        multiple
        single-line
        small-chips
    >
        <template #selection="data">
            <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="remove(data.item.value)"
            >
                <v-avatar
                    left
                    style="font-size: 20px"
                    class="mr-0"
                >
                    <flag
                        :squared="false"
                        :iso="data.item.value"
                        :title="data.item.text"
                    >
                        {{ data.item.value }}
                    </flag>
                </v-avatar>
            </v-chip>
        </template>
    </v-autocomplete>
</v-list-item>
</template>

<script>
import { mapActions } from '@/store';


export default {
    name: 'FiltersCountry',

    props: {
        filter: Object,
        value: Array,
    },

    data() {
        return this.mapState({
            items: 'common.countries',
        });
    },

    methods: {
        ...mapActions({
            setValue: 'search/setFilterValue',
            removeValue: 'search/removeFilterValue',
        }),

        onChange(value) {
            this.setValue([this.filter.name, value]);
            this.$emit('change');
        },

        remove(value) {
            this.removeValue([this.filter.name, value]);
            this.$emit('change');
        },
    },
};
</script>
