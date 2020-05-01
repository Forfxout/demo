import autobahn from 'autobahn';
import { Subject } from 'rxjs/index';


class MonitoringApi {
    constructor(config) {
        this.routerUrl = config.routerUrl;
        this.realm = config.realm;
        this.projectId = null;
        this.user = null;
        this.token = null;

        this.connection = null;
        this.events$ = new Subject();

        this.onEvents = this.onEvents.bind(this);
    }

    onEvents(events) {
        events.forEach(event => this.events$.next(event));
    }

    connect() {
        if (this.connection) {
            this.disconnect();
        }

        this.connection = new autobahn.Connection({
            url: this.routerUrl,
            realm: this.realm,
        });

        this.connection.onopen = (session) => {
            const topic = `monitoring.subscriptions.${this.projectId}.${this.user}`;
            // eslint-disable-next-line no-console
            console.log('Subscribe to', topic);
            session.subscribe(topic, this.onEvents);
        };

        this.connection.open();
    }

    disconnect() {
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
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

    setUser(user) {
        this.user = user;
    }
}


export default new MonitoringApi({
    routerUrl: process.env.VUE_APP_CROSSBAR_PUBLIC_URL,
    realm: 'monitoring',
});
