import _ from 'lodash';
import { catchError } from 'rxjs/operators';

import { load } from '../persistentState';
import authSlice from './auth';
import commonSlice from './common';
import dyntopicsSlice from './dyntopics';
import searchSlice from './search';
import monitoringSlice from './monitoring';

import authEpics from './auth/epics';
import commonEpics from './common/epics';
import dyntopicsEpics from './dyntopics/epics';
import monitoringEpics from './monitoring/epics';
import searchEpics from './search/epics';

export const slices = [authSlice, commonSlice, dyntopicsSlice, searchSlice, monitoringSlice];

export const reducer = _.fromPairs(slices.map(slice => [slice.name, slice.reducer]));

export const loadingStatusAction = commonSlice.actions.setLoading;

// Catch error for all epics to avoid broken epics handling
const protect = epic => (action$, state$, dependencies) => epic(action$, state$, dependencies).pipe(
    catchError((error, caught) => {
        console.warn('Uncaught exception in epic:', error); // eslint-disable-line no-console
        return caught;
    }),
);

export const epics = _.flatten([
    authEpics, commonEpics, dyntopicsEpics, monitoringEpics, searchEpics])
    .map(epic => protect(epic));

// These state fields are saved to browser local store
// NOTE: Do not overuse this because there is no way to invalidate data for now
// TODO: Add some way to invalidate stored data when we change store structure.
// Maybe some version number saved in localStore
// TODO: Now can be used only for auth because all state is reset when workspace
// config is loaded from server and this happens after persistent state is loaded
// from localStorage
export const persistentState = _.flatten(slices.map((slice) => {
    if (slice.persistent === '*') {
        return slice.name;
    }
    if (slice.persistent) {
        return slice.persistent.map(field => `${slice.name}.${field}`);
    }
    return [];
}));

// Used as default state when we can't load it from local storage
const initialState = _.fromPairs(slices.map(slice => [slice.name, slice.initialState]));

export function loadPersistentState(workspaceId) {
    const preloadedState = load({
        states: persistentState,
        workspaceId,
    });
    return _.merge(_.cloneDeep(initialState), preloadedState);
}
