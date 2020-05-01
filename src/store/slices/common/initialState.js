export default {
    workspaceName: null,
    workspaceId: null,
    projectId: null,
    projectLanguages: [],

    ontologyTopics: [],
    ontologyCCategories: [],
    ontologyACategories: [],
    colorsACategories: {},
    colorsCCategories: {},
    colorsConcepts: {},
    colorsTopics: {},

    countries: [],

    isWorkspaceLoaded: false,
    lang: 'en',
    error: null,

    authConfig: {
        backend: null,
    },

    features: {},

    ui: {},

    notifyEmailChoices: [{
        value: 'none',
        text: 'Disabled',
    }, {
        value: 'every_doc',
        text: 'Every new document',
    }, {
        value: 'daily_digest',
        text: 'Send daily digest',
    }],

    // Loading statuses per api method. Name format is loading<api method name>.
    // Explicitly define here field name to avoid error about undefined value.
    loading: false,
    loadingTopAuthors: false,
    loadingTopConcepts: false,
    loadingTopTopics: false,
};
