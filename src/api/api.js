import _ from 'lodash';
import buildUrl from 'build-url';
import { ajax } from 'rxjs/ajax';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';


class Api {
    constructor(config) {
        this.basePath = config.basePath;
        this.companyId = null;
        this.projectId = null;
        this.token = null;
        this.requests = {};
        this.loading$ = new BehaviorSubject({});

        this.incRequests = this.incRequests.bind(this);
        this.decRequests = this.decRequests.bind(this);
    }

    @trackLoading
    search(params) {
        const url = this.projectUrl('/explore');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    suggest(params) {
        const url = this.projectUrl('/explore/suggest');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    countries(params) {
        const url = this.projectUrl('/explore/countries');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    timeline(params) {
        const url = this.projectUrl('/explore/timeline');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    relations(params) {
        const url = this.projectUrl('/explore/relations');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    topTopics(params) {
        const url = this.projectUrl('/explore/top_topics');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    topConcepts(params) {
        const url = this.projectUrl('/explore/top_concepts');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    topAuthors(params) {
        const url = this.projectUrl('/authors/top');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    loadDocument(docId, query, concepts) {
        const params = {};
        if (query) {
            params.query = query;
        }
        if (concepts) {
            params.concepts = concepts;
        }
        const url = this.projectUrl(`/documents/${docId}`, params);
        return ajax.get(url, this.headers());
    }

    @trackLoading
    ontologyTopics() {
        const url = this.projectUrl('/ontology/topics');
        return ajax.get(url, this.headers());
    }

    @trackLoading
    ontologyConcepts() {
        const url = this.projectUrl('/ontology/concepts');
        return ajax.get(url, this.headers());
    }

    @trackLoading
    ontologyConceptCategories(queryParams) {
        const url = this.projectUrl('/ontology/concept_categories', queryParams);
        return ajax.get(url, this.headers());
    }

    @trackLoading
    ontologyAuthorCategories(queryParams) {
        const url = this.projectUrl('/ontology/author_categories', queryParams);
        return ajax.get(url, this.headers());
    }

    @trackLoading
    subscriptionList(limit) {
        const queryParams = {
            limit: limit || 10,
        };
        const url = this.projectUrl('/user_subscriptions', queryParams);
        return ajax.get(url, this.headers());
    }

    @trackLoading
    subscriptionCreate(params) {
        const url = this.projectUrl('/subscription');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    subscriptionLoad(subscriptionId, limit) {
        const queryParams = {
            limit: limit || 10,
        };
        const url = this.projectUrl(`/user_subscriptions/${subscriptionId}`, queryParams);
        return ajax.get(url, this.headers());
    }

    @trackLoading
    subscriptionUpdate(subscriptionId, params) {
        const url = this.projectUrl(`/subscription/${subscriptionId}`);
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    subscriptionDelete(subscriptionId) {
        const url = this.projectUrl(`/subscription/${subscriptionId}`);
        return ajax.delete(url, this.headers());
    }

    @trackLoading
    subscriptionLoadDocuments(subscriptionId, lastDocument, limit) {
        const queryParams = {
            before: lastDocument.indexing_date,
            last_document_id: lastDocument.id,
            limit: limit || 10,
        };
        const url = this.projectUrl(`/user_subscriptions/${subscriptionId}/documents`, queryParams);
        return ajax.get(url, this.headers());
    }

    @trackLoading
    authProfileLoad() {
        const url = this.companyUrl('/auth/profile');
        return ajax.get(url, this.headers());
    }

    @trackLoading
    authProfileSave(params) {
        const url = this.companyUrl('/auth/profile');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    countryCounts() {
        const url = this.projectUrl('/project/country_counts');
        return ajax.get(url, this.headers());
    }

    @trackLoading
    loadDyntopics(params) {
        const url = this.projectUrl('/dyntopics/');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    @trackLoading
    translate(params) {
        const url = this.projectUrl('/documents/translation');
        return ajax.post(url, JSON.stringify(params), this.headers());
    }

    headers() {
        return {
            Authorization: `Bearer ${this.token || ''}`,
        };
    }

    projectUrl(path, queryParams = {}) {
        return buildUrl(this.basePath, {
            path: `${this.projectId}${path}`,
            queryParams,
            disableCSV: true,
        });
    }

    companyUrl(path, queryParams = {}) {
        return buildUrl(this.basePath, {
            path: `${this.companyId}${path}`,
            queryParams,
            disableCSV: true,
        });
    }

    incRequests(methodName) {
        if (!_.has(this.requests, methodName)) {
            this.requests[methodName] = 0;
        }
        this.requests[methodName] += 1;
        this.loading$.next(this._loadingStatus());
    }

    decRequests(methodName) {
        this.requests[methodName] -= 1;
        this.loading$.next(this._loadingStatus());
    }

    _loadingStatus() {
        const output = {};
        Object.entries(this.requests)
            .forEach(([key, value]) => {
                output[key] = value > 0;
            });
        return output;
    }

    setToken(token) {
        // User in @/store/slices/auth/epics.js setTokenToApi when auth token is changed
        this.token = token;
    }

    setProjectId(projectId) {
        // Used in @/lib/workspacesManager.js applyWorkspaceConfig
        // when new workspace config is loaded
        this.projectId = projectId;
    }

    setCompanyId(companyId) {
        // Used in @/lib/workspacesManager.js applyWorkspaceConfig
        // when new workspace config is loaded
        this.companyId = companyId;
    }
}


function trackLoading(target, property, descriptor) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function wrapped(...args) {
        this.incRequests(originalMethod.name);
        const $response = originalMethod.call(this, ...args);
        return $response.pipe(
            finalize(() => this.decRequests(originalMethod.name)),
        );
    };

    return descriptor;
}


export default new Api({
    basePath: process.env.VUE_APP_BACKEND_API,
});
