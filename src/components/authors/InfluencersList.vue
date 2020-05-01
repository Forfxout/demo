<template>
<v-card>
    <v-card-title>
        <v-row>
            <v-col>
                <v-text-field
                    v-model="search"
                    append-icon="fa-search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-col>
            <v-col>
                <v-text-field
                    :value="influencersMinDocs"
                    @change="onMinDocsChange"
                    @click:clear="onMinDocsChange(null)"
                    type="number"
                    label="Minimal number of documents"
                    clearable
                    single-line
                    hide-details
                ></v-text-field>
            </v-col>
        </v-row>
    </v-card-title>

    <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        disable-pagination
        hide-default-footer
    >
        <template #top>
            <div
                v-if="influencersTotal"
                class="pl-4 caption"
            >
                Showing {{ items.length }} of total {{ influencersTotal }}
            </div>
        </template>

        <template #item.screen_name="{ item }">
            <doc-type-icon
                :doc-type="item.doc_type"
                small
            />
            {{ item.screen_name }}
            <v-icon
                v-if="item.verified"
                small
                title="verified"
            >fa-user-check</v-icon>
        </template>

        <template #item.doc_count="{ item }">
            {{ item.doc_count }}
            <v-progress-linear
                :value="item.doc_count / maxDocCount * 100"
                :buffer-value="item.doc_count / maxDocCount * 100"
            />
        </template>

        <template #item.followers_count="{ item }">
            {{ item.followers_count }}
            <v-progress-linear
                :value="item.followers_count / maxFollowersCount * 100"
                :buffer-value="item.followers_count / maxFollowersCount * 100"
            />
        </template>

        <template #item.friends_count="{ item }">
            {{ item.friends_count }}
            <v-progress-linear
                :value="item.friends_count / maxFriendsCount * 100"
                :buffer-value="item.friends_count / maxFriendsCount * 100"
            />
        </template>

        <template #item.statuses_count="{ item }">
            {{ item.statuses_count }}
            <v-progress-linear
                :value="item.statuses_count / maxStatusesCount * 100"
                :buffer-value="item.statuses_count / maxStatusesCount * 100"
            />
        </template>

        <template #item.favourites_count="{ item }">
            {{ item.favourites_count }}
            <v-progress-linear
                :value="item.favourites_count / maxFavouritesCount * 100"
                :buffer-value="item.favourites_count / maxFavouritesCount * 100"
            />
        </template>
    </v-data-table>
</v-card>
</template>

<script>
import _ from 'lodash';

import { mapActions } from '@/store';
import DocTypeIcon from '@/components/general/DocTypeIcon.vue';

export default {
    name: 'InfluencersList',
    components: {
        DocTypeIcon,
    },

    data() {
        return {
            headers: [{
                text: 'Username',
                value: 'screen_name',
                width: 200,
            }, {
                text: 'Description',
                value: 'description',
                sortable: false,
            }, {
                text: 'Doc. Count',
                value: 'doc_count',
                width: 70,
            }, {
                text: 'Followers',
                value: 'followers_count',
                width: 70,
            }, {
                text: 'Following',
                value: 'friends_count',
                width: 70,
            }, {
                text: 'Statuses',
                value: 'statuses_count',
                width: 70,
            }, {
                text: 'Likes',
                value: 'favourites_count',
                width: 70,
            }],
            sortBy: 'doc_count',
            sortDesc: true,
            search: '',
            ...this.mapState({
                loading: 'common.loadingTopAuthors',
                influencers: 'search.influencers',
                influencersTotal: 'search.influencersTotal',
                influencersMinDocs: 'search.influencersMinDocs',
            }),
        };
    },

    mounted() {
        // Load data on start
        if (this.influencers === null) {
            this.doInfluencersUpdate();
        }
    },

    computed: {
        items() {
            if (this.influencers === null) {
                return [];
            }
            return this.influencers;
        },

        maxDocCount() {
            return this.maxFieldValue('doc_count');
        },

        maxFollowersCount() {
            return this.maxFieldValue('followers_count');
        },

        maxFriendsCount() {
            return this.maxFieldValue('friends_count');
        },

        maxStatusesCount() {
            return this.maxFieldValue('statuses_count');
        },

        maxFavouritesCount() {
            return this.maxFieldValue('favourites_count');
        },
    },

    methods: {
        ...mapActions({
            doInfluencersUpdate: 'search/doInfluencersUpdate',
            setInfluencersMinDocs: 'search/setInfluencersMinDocs',
        }),

        maxFieldValue(field) {
            return _.maxBy(this.items, item => item[field])[field];
        },

        onMinDocsChange(value) {
            this.setInfluencersMinDocs(value ? Number(value) : value);
            this.doInfluencersUpdate();
        },
    },
};
</script>
