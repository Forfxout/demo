import { ofType } from 'redux-observable';

import { flatMap, map, switchMap } from 'rxjs/operators';

import dyntopicsSlice from './index';
import searchSlice from '@/store/slices/search';
import api from '@/api/api';
import { setError } from '@/store/slices/utils';

const searchActions = searchSlice.actions;
const { actions, selectors } = dyntopicsSlice;


export default [
    // Load dynamic topics
    (action$, state$) => action$.pipe(
        ofType(
            actions.loadDyntopics.type,
            actions.setFilterValue.type,
        ),
        switchMap(() => {
            const params = selectors.getDyntopicsParams(state$.value);
            return api.loadDyntopics(params).pipe(
                map(data => [
                    actions.setDyntopics(data.response.dyntopics),
                    actions.setDates([data.response.date_from, data.response.date_to]),
                ]),
                flatMap(action => action),
            );
        }),
        setError(),
    ),

    // Search by dynamic topic
    (action$, state$) => action$.pipe(
        ofType(actions.setDyntopicQuery.type),

        map(({ payload }) => [
            searchActions.setQuery(payload.query),
            searchActions.setQueryTopics([]),
            searchActions.setQueryConcepts([]),
            searchActions.setFilterValue(['type', []]),
            searchActions.setFilterValue(['lang', []]),
            searchActions.setFilterValue(['dateFrom', null]),
            searchActions.setFilterValue(['dateTo', null]),
            searchActions.setFilterValue(['geoCountry', []]),
            searchActions.setFilterValue(['orderBy', 'indexing_date_desc']),
            searchActions.setFilterValue(['hasCoverImage', null]),
            searchActions.setFilterValue(['hasVideo', null]),
        ]),
        flatMap(action => action),
    ),
];
