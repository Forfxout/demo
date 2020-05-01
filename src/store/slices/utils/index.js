import _ from 'lodash';
import { catchError, tap } from 'rxjs/operators';
import { concat, of } from 'rxjs';

import commonSlice from '@/store/slices/common';
import authSlice from '@/store/slices/auth';


export function setError() {
    return catchError((error, caught) => {
        // All epics with api requests use this function to catch error
        // Failed requests are handled here too, so we can catch "Not authenticated"
        // and logout user
        // FIXME: Show some message to user
        if (error.name === 'AjaxError' && error.status === 401) {
            return concat(
                of(authSlice.actions.logout()),
                caught,
            );
        }

        const msg = _.get(error.response, 'detail[0].msg');
        return concat(
            of(commonSlice.actions.setError(msg || error.message)),
            caught,
        );
    });
}

export function debug(message) {
    if (process.env.VUE_APP_DEBUG) {
        // eslint-disable-next-line no-console
        return tap(evt => console.log('RxJs DEBUG:', message, evt));
    }
    return tap();
}
