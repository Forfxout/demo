import { ofType } from 'redux-observable';

import { EMPTY, merge } from 'rxjs';
import {
    flatMap, map, switchMap, debounceTime, tap, takeUntil,
} from 'rxjs/operators';

import searchSlice from './index';
import api from '@/api/api';
import { setError } from '@/store/slices/utils';
import router from '@/router';

const { actions, selectors } = searchSlice;

const SEARCH_ACTIONS = [
    actions.doSearch.type,
    actions.doSearchOnMap.type,
    actions.doSearchOnSubEdit.type,
];


function doSearch(state$) {
    const params = selectors.getSearchQuery(state$.value);
    params.page_size = state$.value.search.documentsPerPage;
    params.offset = 0;

    return api.search(params)
        .pipe(
            map(data => [
                actions.setDocuments(data.response.hits.hits),
                actions.setDocumentsTotal(data.response.hits.total),
                actions.increaseSearchResultId(),
            ]),
            flatMap(action => action),
        );
}


function loadNextPage(state$) {
    const { documents, documentsPerPage, MAX_DOCS } = state$.value.search;

    if (documents.length > MAX_DOCS) {
        // eslint-disable-next-line no-console
        console.warn('Skip loading more documents. MAX_DOCS exceeded.');
        return EMPTY;
    }

    const params = selectors.getSearchQuery(state$.value);
    params.page_size = documentsPerPage;
    params.offset = documents.length;

    return api.search(params)
        .pipe(
            map(data => [
                actions.setDocuments(documents.concat(data.response.hits.hits)),
                actions.setDocumentsTotal(data.response.hits.total),
            ]),
            flatMap(action => action),
        );
}


function cancelOnSearch(action$) {
    return takeUntil(
        action$.pipe(ofType(...SEARCH_ACTIONS)),
    );
}


function loadTopData(state$) {
    // TODO: Use FilterQuery. SearchQuery contains unused params
    return [
        api.topConcepts(selectors.getSearchQuery(state$.value))
            .pipe(
                map(data => actions.setTopConcepts(data.response.concepts)),
            ),
        api.topAuthors(selectors.getSearchQuery(state$.value))
            .pipe(
                map(data => actions.setTopAuthors(data.response.authors)),
            ),
        api.topTopics(selectors.getSearchQuery(state$.value))
            .pipe(
                map(data => actions.setTopTopics(data.response.topics)),
            ),
    ];
}


export default [
    // Trigger search on Search page
    (action$, state$) => action$.pipe(
        ofType(
            actions.doSearch.type,
        ),
        tap(() => {
            // Redirect to the Search page if a search is triggered on a page
            // that can't display a search result
            if (!['search', 'map'].includes(router.currentRoute.name)) {
                // TODO: Maybe it would be better do not use router directly in Store
                router.push({
                    name: 'search',
                    params: { workspaceId: state$.value.common.workspaceId },
                });
            }
        }),
        debounceTime(50),
        switchMap(() => doSearch(state$)),
        setError(),
    ),

    // Trigger search on Edit Subscription and Map pages
    (action$, state$) => action$.pipe(
        ofType(
            actions.doSearchOnSubEdit.type,
            actions.doSearchOnMap.type,
            actions.doSearchOnTimeline.type,
        ),
        debounceTime(50),
        switchMap(() => doSearch(state$)),
        setError(),
    ),

    // Trigger loading map data on Map page
    (action$, state$) => action$.pipe(
        ofType(
            actions.doMapUpdate.type,
        ),
        debounceTime(50),
        switchMap(() => merge(
            api.countries(selectors.getCountriesQuery(state$.value))
                .pipe(
                    map(data => actions.setMapCountries(data.response.countries)),
                ),
            ...loadTopData(state$),
        )),
        setError(),
    ),

    // Trigger loading timeline data on Timeline page
    (action$, state$) => action$.pipe(
        ofType(
            actions.doTimelineUpdate.type,
        ),
        debounceTime(50),
        switchMap(() => merge(
            api.timeline(selectors.getTimelineQuery(state$.value))
                .pipe(
                    map(data => actions.setTimelineData(data.response.timeline)),
                ),
            ...loadTopData(state$),
        )),
        setError(),
    ),

    // Trigger loading relations data on Relations page
    (action$, state$) => action$.pipe(
        ofType(
            actions.doRelationsUpdate.type,
        ),
        debounceTime(50),
        switchMap(
            () => api.relations(selectors.getRelationsQuery(state$.value))
                .pipe(
                    map(({ response }) => [
                        actions.setRelationsDimension1(response.dimension1.items),
                        actions.setRelationsDimension2(response.dimension2.items),
                        actions.setRelationsLinks(response.links),
                    ]),
                    flatMap(action => action),
                ),
        ),
        setError(),
    ),

    // FIXME: Do not set on Edit sub page
    (action$, state$) => action$.pipe(
        ofType(
            actions.removeQueryConcept.type,
            actions.removeQueryTopic.type,
            actions.setQuery.type,
            actions.setQueryConcepts.type,
            actions.setQueryTopics.type,
        ),
        map(() => actions.setProposedSubName(selectors.getProposedSubName(state$.value))),
    ),

    // Load next page
    (action$, state$) => action$.pipe(
        ofType(
            actions.loadNextPage.type,
        ),
        switchMap(() => loadNextPage(state$)),
        setError(),
    ),

    // Trigger suggestion loading
    (action$, state$) => action$.pipe(
        ofType(
            actions.setSuggestTerm.type,
        ),
        debounceTime(200),
        switchMap(({ payload }) => {
            const state = state$.value;
            if (!payload) {
                return EMPTY;
            }

            const params = selectors.getSuggestParams(state);
            return api.suggest(params)
                .pipe(
                    cancelOnSearch(action$),
                    map(data => [
                        actions.setSuggestedTopics(data.response.topics),
                        actions.setSuggestedConcepts(data.response.concepts),
                    ]),
                    flatMap(action => action),
                );
        }),
        setError(),
    ),

    // Load selected document
    (actions$, state$) => actions$.pipe(
        ofType(
            actions.setSelectedDocumentId.type,
        ),
        switchMap(({ payload }) => {
            const { docId } = payload;
            if (!docId) {
                return EMPTY;
            }

            return api.loadDocument(docId, payload.query, payload.concepts)
                .pipe(
                    map(data => actions.setSelectedDocument(data.response)),
                );
        }),
        setError(),
    ),

    (actions$, state$) => actions$.pipe(
        ofType(
            actions.getTranslation.type,
        ),
        switchMap(() => {
            const doc = state$.value.search.selectedDocument;
            const docLang = doc.native_languages[0];
            const params = {
                id: doc.id,
                title: doc.title[docLang],
                body: doc.body[docLang],
                source_language: docLang,
            };
            return api.translate(params)
                .pipe(
                    map(data => actions.updateSelectedDocument(data.response)),
                );
        }),
        setError(),
    ),

    // Reset Map group by when you clear Concept category filter
    (actions$, state$) => actions$.pipe(
        ofType(
            actions.setRelationsSelectedLink.type,
        ),
        switchMap(({ paylod }) => {
            const params = selectors.getRelationsSearchQuery(state$.value);
            params.page_size = state$.value.search.documentsPerPage;
            params.offset = 0;

            return api.search(params)
                .pipe(
                    map(data => [
                        actions.setRelationsDocuments(data.response.hits.hits),
                        actions.setRelationsDocumentsTotal(data.response.hits.total),
                        actions.increaseSearchResultId(),
                    ]),
                    flatMap(action => action),
                );
        }),
        setError(),
    ),

    // Load next page for selected link on Relations page
    (actions$, state$) => actions$.pipe(
        ofType(
            actions.loadRelationsDocsNextPage.type,
        ),
        switchMap(() => {
            const { relationsDocuments, documentsPerPage, MAX_DOCS } = state$.value.search;

            if (relationsDocuments.length > MAX_DOCS) {
                // eslint-disable-next-line no-console
                console.warn('Skip loading more documents. MAX_DOCS exceeded.');
                return EMPTY;
            }

            const params = selectors.getRelationsSearchQuery(state$.value);
            params.page_size = documentsPerPage;
            params.offset = relationsDocuments.length;

            return api.search(params)
                .pipe(
                    map(data => [
                        actions.setRelationsDocuments(
                            relationsDocuments.concat(data.response.hits.hits),
                        ),
                        actions.setRelationsDocumentsTotal(data.response.hits.total),
                    ]),
                    flatMap(action => action),
                );
        }),
        setError(),
    ),

    // Load Influencers
    (actions$, state$) => actions$.pipe(
        ofType(
            actions.doInfluencersUpdate.type,
        ),
        switchMap(() => {
            let params = selectors.getSearchQuery(state$.value);
            const { influencersMinDocs } = state$.value.search;

            if (influencersMinDocs) {
                params = {
                    ...params,
                    min_doc_count: influencersMinDocs,
                };
            }

            return api.topAuthors(params)
                .pipe(
                    map(data => [
                        actions.setInfluencers(data.response.authors),
                        actions.setInfluencersTotal(data.response.total),
                    ]),
                    flatMap(action => action),
                );
        }),
        setError(),
    ),
];
