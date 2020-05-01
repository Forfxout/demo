import _ from 'lodash';

import initialState from './initialState';
import { createSetReducers, addActionCallbacks } from '@/store/slices/utils/reducers';


const subExtraFields = {
    newDocuments: [],
    isPaused: false,
};


export default {
    ...createSetReducers('subscriptionToEdit', 'showSubsForm'),

    reset(state, { payload }) {
        _.assign(state, payload || initialState);
    },

    // trigger subscriptions loading
    subscriptionsLoad() {},

    // trigger epic to load subscription from server and set to edit
    setSubscriptionToEditById() {},

    // Trigger loading mode Subscription documents
    loadMoreDocuments() {},

    // Trigger epics that sets Subscription query
    setSubscriptionQuery() {},

    setSubscriptions(state, { payload }) {
        state.subscriptions = payload.map(sub => ({ ...sub, ...subExtraFields }));
        // Remove missing subs from subscriptionsOrder. Add new to the end
        const ids = payload.map(s => s.subscription.id);
        const ordered = _.intersection(state.subscriptionsOrder, ids);
        state.subscriptionsOrder = _.concat(ordered, _.difference(ids, ordered));
    },

    setSubscription(state, { payload }) {
        const item = state.subscriptions.find(
            sub => sub.subscription.id === payload.subscription.id,
        );
        if (item) {
            Object.assign(item, payload);
        } else {
            state.subscriptions.push({
                ...payload,
                ...subExtraFields,
            });
            state.subscriptionsOrder.push(payload.subscription.id);
        }
    },

    moveSubscriptionRight(state, { payload }) {
        const subId = payload;
        const index = _.indexOf(state.subscriptionsOrder, subId);
        if (index < (state.subscriptionsOrder.length - 1)) {
            _.pull(state.subscriptionsOrder, subId);
            const newIndex = index + 1;
            state.subscriptionsOrder.splice(newIndex, 0, subId);
        }
    },

    moveSubscriptionLeft(state, { payload }) {
        const subId = payload;
        const index = _.indexOf(state.subscriptionsOrder, subId);
        if (index > 0) {
            _.pull(state.subscriptionsOrder, subId);
            const newIndex = index - 1;
            state.subscriptionsOrder.splice(newIndex, 0, subId);
        }
    },

    // trigger subscription saving
    subscriptionSave: addActionCallbacks(() => {}),

    // trigger subscription delete
    subscriptionDelete: addActionCallbacks(() => {}),

    // Used by MonitoringAPi add add new document from websocket
    addDocToSubscription(state, { payload: [subscriptionId, document] }) {
        const subscription = state.subscriptions.find(
            sub => sub.subscription.id === subscriptionId,
        );
        if (!subscription) {
            return;
        }
        const subDocument = { ...document, ws: true };
        if (state.subscriptionsPaused.includes(subscriptionId)) {
            subscription.newDocuments.unshift(subDocument);
        } else {
            subscription.documents.unshift(subDocument);
        }
    },

    setSubscriptionPaused(state, { payload: [subscriptionId, isPaused] }) {
        const subscription = state.subscriptions.find(
            sub => sub.subscription.id === subscriptionId,
        );
        if (!subscription) {
            return;
        }
        if (isPaused) {
            if (!state.subscriptionsPaused.includes(subscriptionId)) {
                state.subscriptionsPaused.push(subscriptionId);
            }
        } else {
            state.subscriptionsPaused = state.subscriptionsPaused.filter(
                id => id !== subscriptionId,
            );
            // If stream is un-pausing, append new documents from the buffer
            if (subscription.newDocuments.length) {
                subscription.documents.unshift(...subscription.newDocuments);
                subscription.newDocuments = [];
                if (subscription.documents.length > state.MAX_DOCS_PER_SUB) {
                    subscription.documents = subscription.documents.slice(
                        state.MAX_DOCS_PER_SUB - 1,
                    );
                }
            }
        }
    },

    // Append more documents to subscription
    appendDocsToSubscription(state, { payload: [subscriptionId, documents] }) {
        const subscription = state.subscriptions.find(
            sub => sub.subscription.id === subscriptionId,
        );
        if (!subscription) {
            return;
        }
        subscription.documents = subscription.documents.concat(documents);
    },
};
