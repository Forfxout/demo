import { createSelector } from '@reduxjs/toolkit';

const getFiltersValues = store => store.dyntopics.filtersValues;


const getDyntopicsParams = createSelector(
    [getFiltersValues],
    (filtersValues) => {
        const params = { limit: 100 };
        if (filtersValues.dateFrom) {
            params.date_from = filtersValues.dateFrom;
        }
        if (filtersValues.dateTo) {
            params.date_to = filtersValues.dateTo;
        }
        return params;
    },
);


export default {
    getDyntopicsParams,
};
