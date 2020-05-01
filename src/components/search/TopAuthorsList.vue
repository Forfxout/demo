<template>
<v-card
    :loading="loading"
    tile
>
    <v-card-title>Authors</v-card-title>

    <v-card-text class="items-list">
        <v-list-item
            v-for="item in topAuthors"
            :key="item.id"
            dense
            class="text-no-wrap px-0"
        >
            <v-list-item-icon class="mr-3">
                <v-chip>{{ item.doc_count }}</v-chip>
            </v-list-item-icon>

            <v-list-item-content>
                {{ item.screen_name }}
                <v-progress-linear
                    :value="item.doc_count / maxDocCount * 100"
                    :buffer-value="item.doc_count / maxDocCount * 100"
                />
            </v-list-item-content>
        </v-list-item>
    </v-card-text>
</v-card>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'TopAuthorsList',
    data() {
        return this.mapState({
            loading: 'common.loadingTopAuthors',
            topAuthors: 'search.topAuthors',
        });
    },

    computed: {
        maxDocCount() {
            return _.maxBy(
                this.topAuthors, item => item.doc_count,
            ).doc_count;
        },
    },
};
</script>

<style scoped lang="sass">
@import '@/styles/fixed_height_items_list.sass'
</style>
