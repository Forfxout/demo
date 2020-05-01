import _ from 'lodash';

import initialState from './initialState';
import { createSetReducers } from '@/store/slices/utils/reducers';

// Use null as universal empty value
const EMPTY_VALUE = null;

export default {
    ...createSetReducers(
        'queryTopics', 'queryConcepts', 'documents', 'documentsTotal', 'mainTopic',
        'suggestedTopics', 'suggestedConcepts', 'selectedDocument', 'proposedSubName',
        'topAuthors', 'topConcepts', 'topTopics', 'mapCountries',
        'timelineData', 'timelineResolution', 'relationsDimension1', 'relationsDimension2',
        'relationsLinks', 'relationsSelectedLink', 'relationsDocuments',
        'relationsDocumentsTotal', 'influencers', 'influencersTotal', 'influencersMinDocs',
    ),

    reset(state, { payload }) {
        _.assign(state, payload || initialState);
    },

    setQuery(state, { payload }) {
        state.query = payload;
        if (state.filtersValues.orderBy === 'score' && !state.query) {
            state.filtersValues.orderBy = 'publishing_date_desc';
        }
    },

    setSuggestTerm(state, { payload }) {
        state.suggestTerm = payload;
        state.suggestedTopics = [];
        state.suggestedConcepts = [];
    },

    removeQueryConcept(state, { payload }) {
        const conceptId = payload.id || payload;
        state.queryConcepts = state.queryConcepts.filter(c => c.id !== conceptId);
    },

    removeQueryTopic(state, { payload }) {
        const topicId = payload.id || payload;
        state.queryTopics = state.queryTopics.filter(t => t.id !== topicId);
    },

    setChartsGroupBy(state, { payload }) {
        state.chartsGroupBy = payload;
        if (payload === 'topics') {
            state.filtersValues.conceptCategories = [];
        } else {
            state.filtersValues.conceptCategories = [payload];
        }
    },

    setFilterValue(state, { payload: [name, value] }) {
        if (state.filters[name].allowEmpty) {
            state.filtersValues[name] = value;
        } else {
            state.filtersValues[name] = value || EMPTY_VALUE;
        }

        // Reset charts group by
        if (name === 'conceptCategories' && value.length === 0) {
            state.chartsGroupBy = 'topics';
        }
    },

    addFilterValue(state, { payload: [name, value] }) {
        if (Array.isArray(state.filtersValues[name])
                && !state.filtersValues[name].includes(value)) {
            state.filtersValues[name].push(value);
        } else if (_.isObject(state.filtersValues[name])) {
            Object.assign(state.filtersValues[name], value);
        } else {
            state.filtersValues[name] = value;
        }
    },

    removeFilterValue(state, { payload: [name, value] }) {
        if (Array.isArray(state.filtersValues[name])) {
            state.filtersValues[name] = state.filtersValues[name].filter(i => i !== value);
        } else if (_.isObject(state.filtersValues[name])) {
            delete state.filtersValues[name];
        } else if (state.filtersValues[name] === value) {
            state.filtersValues[name] = EMPTY_VALUE;
        }

        // Reset charts group by
        if (name === 'conceptCategories' && state.filtersValues[name].length === 0) {
            state.chartsGroupBy = 'topics';
        }
    },

    setFilterIsOpen(state, { payload: [name, value] }) {
        state.filtersOpen[name] = value;
    },

    setSelectedDocumentId(state, { payload }) {
        state.selectedDocumentId = payload.docId;
        if (!payload.docId) {
            state.selectedDocument = null;
        }
        state.showTranslation = false;
    },

    toggleShowTranslation(state) {
        state.showTranslation = !state.showTranslation;
    },

    updateSelectedDocument(state, { payload }) {
        const { title, body } = payload;
        const targetLang = payload.target_language;
        state.selectedDocument.body[targetLang] = body;
        if (title) {
            state.selectedDocument.title[targetLang] = title;
        }
    },

    // Trgger getting translation
    getTranslation() {
    },

    // Trigger next page loading without search result reset
    loadNextPage() {},

    increaseSearchResultId(state) {
        state.searchResultId += 1;
    },

    setRelationsDimension1Type(state, { payload }) {
        state.relationsDimension1Type = payload;

        if (state.relationsDimension2Type === payload) {
            state.relationsDimension2Type = state.relationsDimensionChoices.find(
                item => item !== payload,
            );
        }

        state.relationsSelectedLink = null;
        state.relationsDocuments = null;
        state.relationsDocumentsTotal = null;
    },

    setRelationsDimension2Type(state, { payload }) {
        state.relationsDimension2Type = payload;

        if (state.relationsDimension1Type === payload) {
            state.relationsDimension1Type = state.relationsDimensionChoices.find(
                item => item !== payload,
            );
        }

        state.relationsSelectedLink = null;
        state.relationsDocuments = null;
        state.relationsDocumentsTotal = null;
    },

    // Use individual search action to allow easier changing behaviour
    // on different pages
    // Trigger search on Search page
    doSearch() {},

    // Trigger search on Edit Subscription page
    doSearchOnSubEdit() {},

    // Trigger search on Map page
    doSearchOnMap() {},

    // Trigger search on Timeline page
    doSearchOnTimeline() {},

    // Trigger loading map data on Map page
    doMapUpdate() {},

    // Trigger timeline chart data loading on Timeline page
    doTimelineUpdate() {},

    // Trigger relations chart data loading on Relations page
    doRelationsUpdate() {},

    // Trigger relations documents next page loading
    loadRelationsDocsNextPage() {},

    // Trigger influencers loading
    doInfluencersUpdate() {},
};
