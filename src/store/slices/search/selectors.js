import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';


export function isEmpty(value) {
    return (value === null) || ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value));
}

// getSearchParams
const getQuery = store => store.search.query;
const getFiltersValues = store => store.search.filtersValues;
const getFilters = store => store.search.filters;
const getMainTopic = store => store.search.mainTopic;
const getTopics = store => store.search.queryTopics;
const getConcepts = store => store.search.queryConcepts;

const getSearchQuery = createSelector(
    [getQuery, getFiltersValues, getFilters, getMainTopic, getTopics, getConcepts],
    (query, filtersValues, filters, mainTopic, topics, concepts) => {
        const output = {
            query,
            concepts: concepts.map(c => c.id),
            topics: topics.map(t => t.id),
        };
        if (mainTopic) {
            output.topics.push(mainTopic.id);
        }

        Object.entries(filtersValues).forEach(([key, value]) => {
            if (filters[key].allowEmpty || !isEmpty(value)) {
                // FIXME: Quick fix of country codes bug for Staging
                if (key === 'geoCountry') {
                    output[_.snakeCase(key)] = value.map(item => item.toLowerCase());
                } else {
                    output[_.snakeCase(key)] = value;
                }
            }
        });

        return output;
    },
);

// getCountriesQuery
const getChartGroupBy = store => store.search.chartsGroupBy;

const getCountriesQuery = createSelector(
    [getSearchQuery, getChartGroupBy],
    (searchQuery, chartsGroupBy) => {
        if (chartsGroupBy === 'topics') {
            return {
                ..._.omit(searchQuery, 'order_by'),
                group_by: chartsGroupBy,
            };
        }
        return {
            ..._.omit(searchQuery, 'order_by'),
            group_by: 'concepts',
        };
    },
);

// getTimelineQuery
const getTimelineResolution = store => store.search.timelineResolution;

const getTimelineQuery = createSelector(
    [getCountriesQuery, getTimelineResolution],
    (searchQuery, timelineResolution) => ({
        ...searchQuery,
        resolution: timelineResolution,
    }),
);

// getRelationsQuery
const getRelationsDimensions = (store) => {
    function prepareDimension(dimensionType) {
        const parts = dimensionType.split(':');
        const output = {
            type: parts[0],
        };
        if (parts[1]) {
            [, output.object_id] = parts;
        }
        return output;
    }

    const { relationsDimension1Type, relationsDimension2Type } = store.search;

    return {
        dimension1: prepareDimension(relationsDimension1Type),
        dimension2: prepareDimension(relationsDimension2Type),
    };
};

const getRelationsQuery = createSelector(
    [getSearchQuery, getRelationsDimensions],
    (searchQuery, dimensions) => ({
        ...dimensions,
        ..._.omit(searchQuery, 'order_by'),
    }),
);

// getRelationsSearchQuery
const getSelectedLink = ({ search }) => search.relationsLinks[search.relationsSelectedLink];
const getDimension1 = ({ search }) => search.relationsDimension1;
const getDimension2 = ({ search }) => search.relationsDimension2;
const getDimension1Type = ({ search }) => search.relationsDimension1Type;
const getDimension2Type = ({ search }) => search.relationsDimension2Type;

const getSelectedSource = createSelector(
    [getSelectedLink, getDimension1],
    (link, dimension1) => dimension1[link.source],
);

const getSelectedTarget = createSelector(
    [getSelectedLink, getDimension2],
    (link, dimension2) => dimension2[link.target],
);

function getDimensionFilter(dimensionType, object) {
    switch (dimensionType.split(':')[0]) {
    case 'topics':
        return { topics: [object.id] };
    case 'concept_categories':
        return { concept_category: object.id };
    case 'author_categories':
        return { author_categories: [object.id] };
    case 'authors':
    case 'author_category':
        return { authors: [object.id] };
    case 'concept_category':
        return { concepts: [object.id] };
    default:
        throw new Error('Undefined dimensions');
    }
}

const getRelationsSearchQuery = createSelector(
    [getDimension1Type, getDimension2Type, getSelectedSource, getSelectedTarget],
    (dimension1Type, dimension2Type, source, target) => {
        return {
            ...getDimensionFilter(dimension1Type, source),
            ...getDimensionFilter(dimension2Type, target),
        };
    },
);


// getProposedSubName
const getProposedSubName = createSelector(
    [getQuery],
    (query) => {
        // FIXME: use topics and concepts
        if (query) {
            if (query.length < 50) {
                return query;
            }
            return query.split(' ').slice(0, 5).join(' ');
        }
        return '';
    },
);

// getSuggestParams
const getSuggestTerm = store => store.search.suggestTerm;
const getSuggestType = store => store.search.suggestType;
const getLang = store => store.common.lang;

const getSuggestParams = createSelector(
    [getSearchQuery, getMainTopic, getSuggestTerm, getSuggestType, getLang],
    (searchQuery, mainTopic, suggestTerm, suggestType, lang) => ({
        term: suggestTerm,
        topic: mainTopic ? mainTopic.id : null,
        type: suggestType,
        lang,
        // FIXME: Disable for now to have more suggestions
        // search_request: searchQuery,
    }),
);


export default {
    getCountriesQuery,
    getProposedSubName,
    getRelationsQuery,
    getRelationsSearchQuery,
    getSearchQuery,
    getSuggestParams,
    getTimelineQuery,
};
