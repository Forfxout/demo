import buildUrl from 'build-url';
import Vue from 'vue';
import VueRouter from 'vue-router';

import ChangeProfilePage from '@/views/ChangeProfilePage.vue';
import DyntopicsPage from '@/views/DyntopicsPage.vue';
import EditSubscriptionPage from '@/views/EditSubscriptionPage.vue';
import InfluencersPage from '@/views/InfluencersPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import MapPage from '@/views/MapPage.vue';
import MonitoringPage from '@/views/MonitoringPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import RelationsPage from '@/views/RelationsPage.vue';
import SearchPage from '@/views/SearchPage.vue';
import SelectWorkspacePage from '@/views/SelectWorkspacePage.vue';
import TimelinePage from '@/views/TimelinePage.vue';
// FIXME: Fix cycle imports
import { actions, store } from '@/store/store'; // eslint-disable-line import/no-cycle
import { applyWorkspaceConfig } from '@/lib/workspacesManager'; // eslint-disable-line import/no-cycle

Vue.use(VueRouter);

// loadWorkspace trigger Workspace data loading, e.g. Ontology.
const routes = [{
    path: '/',
    name: 'select-workspace',
    component: SelectWorkspacePage,
    meta: { public: true },
}, {
    // Pass workspaceId here so we can correctly save new state in localStore.
    // Without workspaceId store state is not saved to localStore.
    path: '/:workspaceId/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
        store.dispatch(actions['auth/logout']());
        next({ name: 'select-workspace' });
    },
}, {
    path: '/:workspaceId/login',
    name: 'login',
    component: LoginPage,
    meta: { public: true },
}, {
    path: '/:workspaceId',
    name: 'search',
    component: SearchPage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/profile/change',
    name: 'change-profile',
    component: ChangeProfilePage,
    meta: { loadWorkspace: true },
}, {
    // NOTE: Used in daily_digest email template
    path: '/:workspaceId/monitoring',
    name: 'monitoring',
    component: MonitoringPage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/map',
    name: 'map',
    component: MapPage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/timeline',
    name: 'timeline',
    component: TimelinePage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/relations',
    name: 'relations',
    component: RelationsPage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/influencers',
    name: 'influencers',
    component: InfluencersPage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/monitoring/:subscriptionId',
    name: 'edit-subscription',
    component: EditSubscriptionPage,
    meta: { loadWorkspace: true },
}, {
    path: '/:workspaceId/dyntopics',
    name: 'dyntopics',
    component: DyntopicsPage,
    meta: { loadWorkspace: true },
}];

const router = new VueRouter({
    mode: 'history',
    routes,
});


function checkWorkspaceLoading(route) {
    // Check if new route required loading Workspace data from server
    if (route.matched.some(record => record.meta.loadWorkspace)
            && !store.getState().common.isWorkspaceLoaded) {
        store.dispatch(actions['common/startWorkspaceLoading']());
    }
}


function checkAccessAndNext(route, next) {
    const { isAuthenticated } = store.getState().auth;
    if (route.matched.every(record => record.meta.public) || isAuthenticated) {
        checkWorkspaceLoading(route);
        next();
    } else {
        next({
            name: 'login',
            params: { workspaceId: route.params.workspaceId },
            query: { next: route.fullPath },
        });
    }
}


// If route contains workspaceId in params load config from server
router.beforeEach((to, from, next) => {
    const currentWorkspaceId = store.getState().common.workspaceId;

    if (to.params.workspaceId) {
        // If other workspace page is opened, load this new workspace config.
        // applyWorkspaceConfig handles workspace switch
        if (to.params.workspaceId !== currentWorkspaceId) {
            const url = buildUrl(process.env.VUE_APP_BACKEND_API, {
                path: `/${to.params.workspaceId}/project/config`,
            });

            fetch(url).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        applyWorkspaceConfig(data);
                        checkAccessAndNext(to, next);
                    });
                } else {
                    response.json().then((data) => {
                        store.dispatch(actions['common/setError'](data.detail));
                        next({ name: 'select-workspace' });
                    });
                }
            });
        } else {
            checkAccessAndNext(to, next);
        }
    } else {
        // Reset current workspace in store to avoid saving store state to localStore
        // with incorrect workspaceId. This can happen when you switch workspace,
        // start save data for new workspace before setting new workspaceId to store
        store.dispatch(actions['common/reset']());
        checkAccessAndNext(to, next);
    }
});

export default router;
