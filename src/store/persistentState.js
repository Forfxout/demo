// Based on https://github.com/kilkelly/redux-localstorage-simple
import _ from 'lodash';

const NAMESPACE = 'redux_peek';
const STATES_DEFAULT = [];


function lensPath(path, obj) {
    if (obj === undefined) {
        return null;
    }
    if (path.length === 1) {
        return obj[path[0]];
    }
    return lensPath(path.slice(1), obj[path[0]]);
}


function realiseObject(objectPath, objectInitialValue = {}) {
    function realiseObjectFunc(objectPathArr, objectInProgress) {
        if (objectPathArr.length === 0) {
            return objectInProgress;
        }
        return realiseObjectFunc(objectPathArr.slice(1), { [objectPathArr[0]]: objectInProgress });
    }
    return realiseObjectFunc(objectPath.split('.').reverse(), objectInitialValue);
}


export function save({ states = STATES_DEFAULT } = {}) {
    return store => next => (action) => {
        const returnValue = next(action);
        const storeState = store.getState();

        if (storeState.common.workspaceId) {
            saveToLocalStore(storeState, states, storeState.common.workspaceId);
        }
        return returnValue;
    };
}


// Digs into rootState for the data to put in LocalStorage
function getStateForLocalStorage(state, rootState) {
    const delimiter = '.';

    if (state.split(delimiter).length > 1) {
        return lensPath(state.split(delimiter), rootState);
    }
    return lensPath([state], rootState);
}


function saveToLocalStore(storeState, states, workspaceId) {
    const namespace = `${NAMESPACE}_${workspaceId}`;

    if (states.length === 0) {
        localStorage[namespace] = JSON.stringify(storeState);
    } else {
        states.forEach((state) => {
            const stateForLocalStorage = getStateForLocalStorage(state, storeState);
            if (stateForLocalStorage) {
                // console.log('saveToLocalStore', `${namespace}_${state}`, stateForLocalStorage);
                localStorage[`${namespace}_${state}`] = JSON.stringify(stateForLocalStorage);
            } else {
                // Make sure nothing is ever saved for this incorrect state
                localStorage.removeItem(`${namespace}_${state}`);
            }
        });
    }
}


export function load({ states = STATES_DEFAULT, workspaceId } = {}) {
    const namespace = `${NAMESPACE}_${workspaceId}`;
    let loadedState = {};

    // Load all of the namespaced Redux data from LocalStorage into local Redux state tree
    if (states.length === 0) {
        if (localStorage[namespace]) {
            loadedState = JSON.parse(localStorage[namespace]);
        }
    } else { // Load only specified states into the local Redux state tree
        states.forEach((state) => {
            const data = localStorage.getItem(`${namespace}_${state}`);
            if (data) {
                loadedState = _.merge(loadedState, realiseObject(state, JSON.parse(data)));
            }
        });
    }

    return loadedState;
}
