import initialState from './initialState';
import { createSetReducers, addActionCallbacks } from '@/store/slices/utils/reducers';


export default {
    ...createSetReducers('profile'),

    reset(state, { payload }) {
        Object.assign(state, payload || initialState);
    },

    authenticate(state, { payload: [token, userId, workspaceId] }) {
        state.isAuthenticated = true;
        state.token = token;
        state.userId = userId;
        state.workspaceId = workspaceId;
    },

    logout(state) {
        state.isAuthenticated = false;
        state.token = null;
        state.userId = null;
        state.workspaceId = null;
    },

    // trigger subscription saving
    profileSave: addActionCallbacks(() => {}),
};
