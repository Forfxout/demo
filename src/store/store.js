import _ from 'lodash';
import { configureStore, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { save } from './persistentState';

import {
    slices, reducer, loadingStatusAction, epics, persistentState,
} from './slices';

import api from '../api/api';
import monitoringApi from '@/api/monitoringApi';


const epicMiddleware = createEpicMiddleware();
const saveToLocalStoreMiddleware = save({ states: persistentState });
let middleware = [epicMiddleware, saveToLocalStoreMiddleware];

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    const createImmutableStateInvariantMiddleware = require('redux-immutable-state-invariant').default;
    middleware = [
        createImmutableStateInvariantMiddleware(),
        epicMiddleware,
        createSerializableStateInvariantMiddleware({
            getEntries: (value) => {
                // Do not check meta field for action. It may contains functions
                if (value.type && value.payload && value.meta) {
                    return _.entries(_.omit(value, 'meta'));
                }
                return _.entries(value);
            },
        }),
        saveToLocalStoreMiddleware,
    ];
}

export const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
});

epicMiddleware.run(combineEpics(...epics));

export const actions = {};

slices.forEach((slice) => {
    Object.values(slice.actions)
        .forEach((action) => {
            actions[action.type] = action;
        });
});

// Subscribe to API loading status
api.loading$.subscribe((loading) => {
    store.dispatch(loadingStatusAction(loading));
});

monitoringApi.events$.subscribe((event) => {
    store.dispatch(actions['monitoring/addDocToSubscription']([event.subscription.id, event.document]));
});
