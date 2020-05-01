import { ofType } from 'redux-observable';
import {
    of, concat, merge,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { createTree } from '@/lib/treeData';
import { getSortedCountries } from '@/lib/countries';
import commonSlice from './index';
import authSlice from '@/store/slices/auth';
import monitoringSlice from '@/store/slices/monitoring';
import { setError } from '@/store/slices/utils';
import monitoringApi from '@/api/monitoringApi';
import api from '@/api/api';

const { actions } = commonSlice;


export default [
    // Load Ontology and Country counts when Workspace is selected
    (action$, state$) => action$.pipe(
        ofType(
            actions.startWorkspaceLoading.type,
        ),

        switchMap(() => concat(
            merge(
                api.ontologyTopics().pipe(
                    map(({ response }) => actions.setOntologyTopics(
                        createTree(response.topics),
                    )),
                ),
                api.ontologyConceptCategories({ is_dimension: true }).pipe(
                    map(({ response }) => actions.setOntologyCCategories(
                        response.concept_categories,
                    )),
                ),
                api.ontologyAuthorCategories({ is_dimension: true }).pipe(
                    map(({ response }) => actions.setOntologyACategories(
                        response.author_categories,
                    )),
                ),
                api.countryCounts().pipe(
                    map(({ response }) => actions.setCountries(getSortedCountries(response))),
                ),
                api.authProfileLoad().pipe(
                    map(({ response }) => authSlice.actions.setProfile(response.profile)),
                ),
            ),
            of(actions.completeWorkspaceLoading()),
        )),

        setError(),
    ),

    // Workspace loading complete callback
    (action$, state$) => action$.pipe(
        ofType(
            actions.completeWorkspaceLoading.type,
        ),

        switchMap(() => {
            // Connect to websocket
            monitoringApi.connect();
            return [
                // Trigger user subscriptions loading
                monitoringSlice.actions.subscriptionsLoad(),
            ];
        }),

        setError(),
    ),
];
