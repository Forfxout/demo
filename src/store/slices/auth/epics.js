import { EMPTY, throwError } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';

import api from '@/api/api';
import monitoringApi from '@/api/monitoringApi';
import authSlice from './index';
import { setError } from '@/store/slices/utils';

const { actions } = authSlice;


export default [
    // Not sure this is a good place to set a token directly to API instance,
    // but all auth changes are handled with store, so we can catch them here.
    (action$, state$) => action$.pipe(
        ofType(actions.authenticate.type),
        switchMap(({ payload: [token, userId, workspaceId] }) => {
            api.setToken(token);
            monitoringApi.setToken(token);
            monitoringApi.setUser(userId);
            return EMPTY;
        }),
    ),

    // Clean up tokens in APIs and redirect to Login or Select Workspace page
    (action$, state$) => action$.pipe(
        ofType(actions.logout.type),
        switchMap(() => {
            api.setToken(null);

            monitoringApi.disconnect();
            monitoringApi.setToken(null);
            monitoringApi.setUser(null);
            return EMPTY;
        }),
    ),

    // Update profile
    (action$, state$) => action$.pipe(
        ofType(actions.profileSave.type),
        switchMap(({ payload, meta }) => api.authProfileSave(payload).pipe(
            map(({ response }) => {
                if (meta.success) {
                    meta.success();
                }
                return actions.setProfile(response.profile);
            }),

            catchError((error) => {
                if (error.name === 'AjaxError' && error.status === 422 && meta.error) {
                    meta.error(error.response.detail);
                    return EMPTY;
                }
                return throwError(error);
            }),

        )),
        setError(),
    ),
];
