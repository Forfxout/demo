export default {
    isSuggestionLoading: false,
    suggestType: null,
    suggestTerm: null,
    suggestedTopics: [],
    suggestedConcepts: [],
    showTranslation: false,

    mainTopic: null,
    query: '',
    queryTopics: [],
    queryConcepts: [],
    // necessary to add to document key because document highlight may change after query change
    searchResultId: 0,

    proposedSubName: '',

    // Limit documents number for performance reason
    MAX_DOCS: 1000,
    documentsPerPage: 100,
    documents: [],
    documentsTotal: null,
    selectedDocumentId: null,
    selectedDocument: null,

    topAuthors: null,
    topConcepts: null,
    topTopics: null,

    chartsGroupBy: 'topics',

    // Map data
    mapCountries: null,

    // Timeline data
    timelineData: null,
    timelineResolution: 'week',

    // Relations data
    relationsDimensionChoices: [
        'topics',
        'concept_categories',
        'author_categories',
        'authors',
    ],
    relationsDimension1Type: 'topics',
    relationsDimension2Type: 'concept_categories',
    relationsDimension1: null,
    relationsDimension2: null,
    relationsLinks: null,
    relationsSelectedLink: null,
    relationsDocuments: null,
    relationsDocumentsTotal: null,

    // Influencers data
    influencers: null,
    influencersTotal: null,
    influencersMinDocs: null,

    filtersValues: {
        type: [],
        lang: [],
        orderBy: 'publishing_date_desc', // see values in FiltersOrderBy component
        dateFrom: null,
        dateTo: null,
        geoCountry: [],
        hasCoverImage: null,
        hasVideo: null,
        conceptCategories: [],
    },

    filters: {
        type: {
            title: 'Document type',
            name: 'type',
            icon: 'fa-file-alt',
            items: [{
                text: 'Facebook',
                value: 'facebook',
            }, {
                text: 'Instagram',
                value: 'instagram',
            }, {
                text: 'Twitter',
                value: 'twitter',
            }, {
                text: 'Web',
                value: 'web',
            }],
        },
        lang: {
            title: 'Language',
            name: 'lang',
            icon: 'fa-language',
        },
        orderBy: {
            title: 'Order by',
            name: 'orderBy',
            icon: 'fa-sort',
        },
        dateFrom: {
            title: 'Published from',
            name: 'dateFrom',
            icon: 'fa-calendar-alt',
            format: 'YYYY-MM-DD HH:mm:ss',
        },
        dateTo: {
            title: 'Published to',
            name: 'dateTo',
            icon: 'fa-calendar-alt',
            format: 'YYYY-MM-DD HH:mm:ss',
        },
        geoCountry: {
            title: 'Origin country',
            name: 'geoCountry',
            icon: 'fa-globe',
        },
        conceptCategories: {
            title: 'Concept category',
            name: 'conceptCategories',
            icon: 'fa-folder',
        },
        hasCoverImage: {
            title: 'Has image?',
            name: 'hasCoverImage',
            icon: 'fa-image',
            allowEmpty: true,
        },
        hasVideo: {
            title: 'Has video?',
            name: 'hasVideo',
            icon: 'fa-video',
            allowEmpty: true,
        },
    },

    filtersOpen: {
        type: false,
    },
};
