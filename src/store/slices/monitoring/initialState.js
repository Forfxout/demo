export default {
    // Limit documents number for performance reason
    MAX_DOCS_PER_SUB: 1000,
    subscriptions: null, // null means that subscriptions are not loaded yet
    subscriptionToEdit: null,
    subscriptionsOrder: [],
    subscriptionsPaused: [],
    showSubsForm: false,
};
