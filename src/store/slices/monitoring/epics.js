import _ from 'lodash';
import { ofType } from 'redux-observable';
import { throwError, of, EMPTY } from 'rxjs';

import {
    map, switchMap, catchError, flatMap,
} from 'rxjs/operators';

import monitoringSlice from './index';
import searchSlice from '@/store/slices/search';
import api from '@/api/api';
import { setError } from '@/store/slices/utils';

const searchActions = searchSlice.actions;
const { actions } = monitoringSlice;


function setSubscriptionQueryActions(userQuery) {
    return [
        searchActions.setQuery(userQuery.query),
        searchActions.setQueryTopics(userQuery.topics),
        searchActions.setQueryConcepts(userQuery.concepts),
        searchActions.setFilterValue(['type', userQuery.type]),
        searchActions.setFilterValue(['geoCountry', userQuery.geo_country]),
        searchActions.setFilterValue(['hasCoverImage', userQuery.has_cover_image]),
        searchActions.setFilterValue(['hasVideo', userQuery.has_video]),
        searchActions.setFilterValue(['orderBy', 'indexing_date_desc']),
        searchActions.setFilterValue(['dateFrom', null]),
        searchActions.setFilterValue(['dateTo', null]),
    ];
}


export default [
    // Load user subscriptions
    (action$, state$) => action$.pipe(
        ofType(actions.subscriptionsLoad.type),

        switchMap(() => api.subscriptionList()
            .pipe(
                map(({ response }) => actions.setSubscriptions(response)),
            )),

        setError(),
    ),

    // Create new or update subscription
    (action$, state$) => action$.pipe(
        ofType(actions.subscriptionSave.type),

        switchMap(({ payload, meta }) => {
            const params = {
                name: payload.name,
                notify_email_type: payload.notifyEmailType,
                ...searchSlice.selectors.getSearchQuery(state$.value),
            };

            let request;
            if (payload.id) {
                request = api.subscriptionUpdate(payload.id, params);
            } else {
                request = api.subscriptionCreate(params);
            }

            return request.pipe(
                map(({ response }) => {
                    if (meta.success) {
                        meta.success({
                            subscriptionId: response.id,
                        });
                    }
                    return response;
                }),

                catchError((error) => {
                    if (error.name === 'AjaxError' && error.status === 422 && meta.error) {
                        meta.error(error.response.detail);
                        return EMPTY;
                    }
                    return throwError(error);
                }),
            );
        }),

        switchMap(subscription => api.subscriptionLoad(subscription.id)
            .pipe(
                map(({ response }) => [
                    actions.setSubscriptionToEdit(subscription),
                    actions.setSubscription(response),
                ]),
            )),
        flatMap(action => action),

        setError(),
    ),

    // Delete subscription
    (action$, state$) => action$.pipe(
        ofType(actions.subscriptionDelete.type),

        switchMap(({ payload, meta }) => {
            const subscriptionId = payload;
            return api.subscriptionDelete(subscriptionId)
                .pipe(
                    map(() => {
                        if (meta.success) {
                            meta.success({
                                subscriptionId,
                            });
                        }

                        return [
                            actions.setSubscriptionToEdit(null),
                            actions.subscriptionsLoad(),
                        ];
                    }),
                    flatMap(action => action),
                );
        }),

        setError(),
    ),

    // Load subscription if is not loaded yet and set it to edit
    (action$, state$) => action$.pipe(
        ofType(actions.setSubscriptionToEditById.type),

        switchMap(({ payload }) => {
            const subscriptionId = payload;
            const { subscriptions } = state$.value.monitoring;

            // Check if subscription is already loaded
            const subscription = _.find(
                subscriptions, item => item.subscription.id === subscriptionId,
            );

            if (subscription) {
                return of(subscription.subscription);
            }

            // Load subscription from server
            return api.subscriptionLoad(subscriptionId)
                .pipe(
                    map(data => data.response.subscription),
                );
        }),

        map(subscription => actions.setSubscriptionToEdit(subscription)),

        setError(),
    ),

    // Update query and filter when Subscription to edit is set
    (action$, state$) => action$.pipe(
        ofType(actions.setSubscriptionToEdit.type),

        map(({ payload }) => {
            if (payload) {
                return setSubscriptionQueryActions(payload.user_query);
            }
            // TODO: Restore original query
            return [];
        }),
        flatMap(action => action),
    ),

    (action$, state$) => action$.pipe(
        ofType(actions.setSubscriptionQuery.type),
        map(({ payload }) => setSubscriptionQueryActions(payload.user_query)),
        flatMap(action => action),
    ),

    // Load more documents for subscription
    (action$, state$) => action$.pipe(
        ofType(actions.loadMoreDocuments.type),

        switchMap(({ payload }) => {
            const subscriptionId = payload;
            const { subscriptions, MAX_DOCS_PER_SUB } = state$.value.monitoring;
            const subscription = subscriptions.find(s => s.subscription.id === subscriptionId);

            if (subscription.documents.length > MAX_DOCS_PER_SUB) {
                // eslint-disable-next-line no-console
                console.warn('Skip loading more documents. MAX_DOCS_PER_SUB exceeded.');
                return EMPTY;
            }

            const lastDocument = _.last(subscription.documents);
            return api.subscriptionLoadDocuments(subscriptionId, lastDocument)
                .pipe(
                    map(
                        data => actions.appendDocsToSubscription(
                            [subscriptionId, data.response.documents],
                        ),
                    ),
                );
        }),

        setError(),
    ),
];
