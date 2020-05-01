import initialState from './initialState';
import { createSetReducers } from '@/store/slices/utils/reducers';

// Use null as universal empty value
const EMPTY_VALUE = null;

export default {
    ...createSetReducers('dyntopics'),

    reset(state, { payload }) {
        Object.assign(state, payload || initialState);
    },

    // Trigger dynamic topics loading
    loadDyntopics() {},

    setFilterValue(state, { payload: [name, value] }) {
        if (state.filters[name].allowEmpty) {
            state.filtersValues[name] = value;
        } else {
            state.filtersValues[name] = value || EMPTY_VALUE;
        }
    },

    setDates(state, { payload: [dateFrom, dateTo] }) {
        state.filtersValues.dateFrom = dateFrom;
        state.filtersValues.dateTo = dateTo;
    },

    setDyntopicQuery() {},
};
