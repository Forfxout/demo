import api from '@/api/api';
import monitoringApi from '@/api/monitoringApi';
import { actions, store } from '@/store/store';
import { loadPersistentState } from '@/store/slices/index';

// If you need to change cache format just change this key name
const LOCALSTORE_WORKSPACE_KEY = 'workspaces_choices_peek';


export function applyWorkspaceConfig(config) {
    // Save workspace in localStore to show workspace choices on home page
    cacheWorkspace(config);
    const persistentState = loadPersistentState(config.workspace_id);

    // API send workspace id and token with every request
    api.setProjectId(config.project_id);
    api.setCompanyId(config.company_id);
    api.setToken(persistentState.auth.token);

    monitoringApi.setProjectId(config.project_id);
    monitoringApi.setToken(persistentState.auth.token);
    monitoringApi.setUser(persistentState.auth.userId);

    // Set workspace_id to store first so all data correctly saved to localStore
    store.dispatch(actions['common/reset'](persistentState.config));
    store.dispatch(actions['common/setWorkspaceId'](config.workspace_id));
    store.dispatch(actions['common/setAuthConfig'](config.auth));
    store.dispatch(actions['common/setWorkspaceName'](config.workspace_name));
    store.dispatch(actions['common/setProjectId'](config.project_id));
    store.dispatch(actions['common/setProjectLanguages'](config.project_languages));
    // Load other state from localStore
    store.dispatch(actions['auth/reset'](persistentState.auth));
    store.dispatch(actions['dyntopics/reset'](persistentState.dyntopics));
    store.dispatch(actions['search/reset'](persistentState.search));
    store.dispatch(actions['monitoring/reset'](persistentState.monitoring));
}

// TODO: Add some way to invalidate saved state when we change store structure
// It would be good to save this data in persistentState with store, but
// now it saves data only per workspace. And it would make code much more difficult
// handle also case when we save/load some store state not per workspace
function cacheWorkspace(config) {
    // TODO: Add some way to remove deleted workspaces
    let workspaces = getWorkspacesChoicesFromCache();
    workspaces = workspaces.filter(pr => pr.id !== config.workspace_id);

    const data = {
        id: config.workspace_id,
        name: config.workspace_name,
    };

    workspaces.unshift(data);
    localStorage.setItem(LOCALSTORE_WORKSPACE_KEY, JSON.stringify(workspaces));
}


export function getWorkspacesChoicesFromCache() {
    let workspaces = localStorage.getItem(LOCALSTORE_WORKSPACE_KEY);
    if (!workspaces) {
        workspaces = [];
    } else {
        try {
            workspaces = JSON.parse(workspaces);
        } catch (error) {
            workspaces = [];
            localStorage.setItem(LOCALSTORE_WORKSPACE_KEY, JSON.stringify(workspaces));
        }
    }
    return workspaces;
}
