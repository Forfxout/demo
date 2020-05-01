<template>
<v-btn-toggle
    :value="timelineResolution"
    @change="onChange"
>
    <v-btn
        v-for="item in items"
        :value="item"
        :key="item"
    >
        {{ item }}
    </v-btn>
</v-btn-toggle>
</template>

<script>
import { mapActions } from '@/store';

export default {
    name: 'TimelineResolutionSelect',
    data() {
        return {
            items: ['day', 'week', 'month', 'year'],
            ...this.mapState({
                timelineResolution: 'search.timelineResolution',
            }),
        };
    },

    methods: {
        ...mapActions({
            setTimelineResolution: 'search/setTimelineResolution',
        }),

        onChange(value) {
            this.setTimelineResolution(value);
            this.$emit('change');
        },
    },
};
</script>
