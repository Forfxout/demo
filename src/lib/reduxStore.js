import { get, set } from 'lodash';


function getStateGetter(prop) {
    return (state) => {
        const value = get(state, prop);
        if (value === undefined) {
            throw Error(`"${prop}" contains undefined. Looks like you made mistake in property name
                  or field contains undefined value what is bad practice`);
        }
        return value;
    };
}


function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function mapState(component, props) {
    const state = component.$store.getState();
    const bindings = component.$$bindings || {};
    const output = {};

    Object.entries(props).forEach(([prop, getter]) => {
        if (typeof getter === 'string') {
            bindings[prop] = getStateGetter(getter);
        } else {
            bindings[prop] = getter;
        }
        output[prop] = copy(bindings[prop](state));
    });

    // eslint-disable-next-line no-param-reassign
    component.$$bindings = bindings;
    return output;
}


function getSyncStateWithComponent(store, component, bindings) {
    return function SyncStateWithComponent() {
        const state = store.getState();
        Object.entries(bindings).forEach(([prop, getter]) => {
            const data = getter(state);

            // Vue returns Observable object so converting to JSON,
            // is the easiest way to get rid of the __ob__ mess.
            let prevData = null;
            let curData = null;
            let update = true;
            try {
                prevData = JSON.stringify(get(component.$data, prop));
                curData = JSON.stringify(data);
                update = prevData !== curData;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.debug(component.$vnode.tag, prop, error);
                }
            }
            // Send updates to the component only of data was changed.
            if (update) {
                if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.debug(
                        component.$vnode.tag,
                        prop,
                        prevData ? JSON.parse(prevData) : '<unknown>',
                        curData ? JSON.parse(curData) : '<unknown>',
                    );
                }
                set(component.$data, prop, copy(data));
            }
        });
    };
}

const getActionCaller = action => function actionCaller(...args) {
    if (!this.$$actions[action]) {
        throw Error(`Undefined action ${action}`);
    }
    this.$store.dispatch(this.$$actions[action].apply(this, args));
};

const actionsObjectMappers = actions => Object.keys(actions)
    .reduce((result, name) => Object.assign(result, {
        [name]: getActionCaller(actions[name]),
    }), {});

export const mapActions = props => actionsObjectMappers(props);

const plugin = {
    install(Vue_, options) {
        Vue_.mixin({
            beforeCreate() {
                this.$store = options.store;
                this.$$actions = options.actions;
                this.mapState = props => mapState(this, props);
            },

            created() {
                // Root component should not interact with the store
                if (!this.$root) {
                    return;
                }

                // If the helper methods (mapState) registered store bindings, create subscriptions
                // Note: Vue will call subscription callback for each created component
                // on any action no matter if the store was really changed
                if (this.$$bindings) {
                    this.unsubscribe = options.store.subscribe(
                        getSyncStateWithComponent(options.store, this, this.$$bindings),
                    );
                }
            },

            beforeDestroy() {
                if (this.unsubscribe) {
                    this.unsubscribe();
                }
            },
        });
    },
};

export default plugin;
