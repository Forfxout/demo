<template>
<v-app-bar
    color="brand"
    app
    clipped-left
    fixed
>
    <v-app-bar-nav-icon>
        <v-img
            :src="logo"
            height="40"
            width="40"
            @click="onLogoClick"
            class="mr-2 ml-1"
        />
    </v-app-bar-nav-icon>

    <slot name="search-input">
        <search-input @change="doSearch" />
    </slot>

    <show-sub-form-btn v-if="subShowBtnVisible" />

    <v-menu offset-y>
        <template #activator="{ on }">
            <v-btn
                v-on="on"
                icon
                color="primary"
            >
                <v-icon>fa-user-circle</v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item
                :to="{ name: 'profile', params: { workspaceId } }"
                exact
            >
                <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item
                :to="{ name: 'select-workspace' }"
                exact
            >
                <v-list-item-title>Change workspace</v-list-item-title>
            </v-list-item>
            <v-list-item
                :to="{ name: 'logout', params: { workspaceId } }"
                exact
            >
                <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
            <!--
            <v-list-item @click="startTour">
                <v-list-item-title>Start tour</v-list-item-title>
            </v-list-item>
            -->
        </v-list>
    </v-menu>
</v-app-bar>
</template>

<script>
import { mapActions } from '@/store';

import ShowSubFormBtn from '@/components/toolbar/ShowSubFormBtn.vue';


export default {
    name: 'TopToolbar',
    props: {
        showSaveBtn: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        ShowSubFormBtn,
    },

    data() {
        return {
            logo: require('@/assets/logo.png'), // eslint-disable-line global-require
            ...this.mapState({
                workspaceId: 'common.workspaceId',
                query: 'search.query',
                queryTopics: 'search.queryTopics',
                queryConcepts: 'search.queryConcepts',
            }),
        };
    },

    computed: {
        subShowBtnVisible() {
            return Boolean(
                this.showSaveBtn && (
                    this.query
                    || (this.queryTopics && this.queryTopics.length > 0)
                    || (this.queryConcepts && this.queryConcepts.length > 0)
                ),
            );
        },
    },

    methods: {
        ...mapActions({
            doSearch: 'search/doSearch',
        }),

        onLogoClick() {
            this.$router.replace({
                name: 'search', params: { workspaceId: this.workspaceId },
            }).catch(() => {}); // Catch NavigationDuplicated error
        },

        startTour() {},
    },
};
</script>
