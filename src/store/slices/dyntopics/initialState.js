export default {
    dyntopics: null, // null means that dynamic topics are not loaded yet

    filtersValues: {
        dateFrom: null,
        dateTo: null,
    },

    filters: {
        dateFrom: {
            title: 'Date from',
            name: 'dateFrom',
            icon: 'fa-calendar-alt',
            format: 'YYYY-MM-DD',
        },
        dateTo: {
            title: 'Date to',
            name: 'dateTo',
            icon: 'fa-calendar-alt',
            format: 'YYYY-MM-DD',
        },
    },
};
