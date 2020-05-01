import _ from 'lodash';

import initialState from './initialState';
import { createSetReducers } from '@/store/slices/utils/reducers';
import { getColor } from '@/utils/colors';


export default {
    ...createSetReducers(
        'workspaceName', 'projectId', 'projectLanguages', 'authConfig', 'countries',
    ),

    reset(state, { payload }) {
        _.assign(state, payload || initialState);
    },

    setLoading(state, { payload }) {
        let any = false;

        Object.entries(payload)
            .forEach(([key, value]) => {
                if (value) {
                    any = true;
                }
                const name = `loading${(key.charAt(0).toUpperCase() + key.slice(1))}`;
                state[name] = value > 0;
            });

        state.loading = any;
    },

    setOntologyTopics(state, { payload }) {
        // Add a color to each topic to use the same color for all charts
        state.colorsTopics = {};
        payload.sort((t1, t2) => t1.id.localeCompare(t2.id));
        payload.forEach((topic, index) => {
            state.colorsTopics[topic.id] = getColor(index / payload.length);
        });
        state.ontologyTopics = payload;
    },

    setOntologyCCategories(state, { payload }) {
        // Add a color to concepts to use the same color for all charts
        state.ontologyCCategories = payload.filter(cc => cc.concepts.length);

        state.colorsConcepts = {};
        const concepts = new Set();
        state.ontologyCCategories.forEach((cc) => {
            cc.concepts.forEach((cId) => {
                concepts.add(cId);
            });
        });

        const conceptsArr = Array.from(concepts);
        conceptsArr.sort();

        conceptsArr.forEach((conceptId, index) => {
            state.colorsConcepts[conceptId] = getColor(index / conceptsArr.length);
        });

        // Add a color to concept categories
        state.colorsCCategories = {};
        payload.sort((cc1, cc2) => cc1.id.localeCompare(cc2.id));
        payload.forEach((ccategory, index) => {
            state.colorsCCategories[ccategory.id] = getColor(index / payload.length);
        });
    },

    setOntologyACategories(state, { payload }) {
        state.ontologyACategories = payload;

        state.colorsACategories = {};
        payload.sort((cc1, cc2) => cc1.id.localeCompare(cc2.id));
        payload.forEach((acategory, index) => {
            state.colorsACategories[acategory.id] = getColor(index / payload.length);
        });
    },

    setFeature(state, { payload: [name, value] }) {
        state.features[name] = value;
    },

    setError(state, { payload }) {
        if (payload) {
            // eslint-disable-next-line no-console
            console.error(payload);
        }
        state.error = payload;
    },

    setWorkspaceId(state, { payload }) {
        if (state.workspaceId !== payload) {
            state.isWorkspaceLoaded = false;
        }
        state.workspaceId = payload;
    },

    // Trigger workspace data loading
    startWorkspaceLoading() {},

    completeWorkspaceLoading(state) {
        state.isWorkspaceLoaded = true;
    },
};
