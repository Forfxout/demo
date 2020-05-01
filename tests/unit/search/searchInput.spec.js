import Vue from 'vue';
import { fakeSchedulers } from 'rxjs-marbles/jest';
import { from } from 'rxjs';
import { mount } from '@vue/test-utils';

import api from '@/api/api';
import ComboboxWithTextInput from '@/components/general/ComboboxWithTextInput.vue';
import SearchInput from '@/components/search/SearchInput.vue';
import vuetify from '@/plugins/vuetify';
import { store, actions } from '@/store/store';
import router from '@/router';

describe('SearchInput.vue', () => {
    beforeEach(() => jest.useFakeTimers());

    it('Render SearchInput', fakeSchedulers(async (advance) => {
        // Authenticate user, init workspace and current route
        const workspaceId = 'icrc';
        const token = 'token';
        const userId = 'user';
        store.dispatch(actions['common/setWorkspaceId'](workspaceId));
        store.dispatch(actions['auth/authenticate']([token, userId, workspaceId]));

        router.push({
            name: 'search',
            params: { workspaceId },
        });

        // Mock api.search
        const documents = [1, 2, 3];
        const response = {
            response: {
                hits: {
                    hits: documents,
                    total: documents.length,
                },
            },
        };
        api.search = jest.fn();
        api.search.mockImplementation(params => from(new Promise(resolve => resolve(response))));

        // Crate component
        const wrapper = mount(SearchInput, {
            vuetify,
            propsData: {
                keepSearchQuery: true,
            },
        });
        const combobox = wrapper.find(ComboboxWithTextInput);
        const searchQuery = 'icrc';

        combobox.vm.setValue([searchQuery]);
        expect(wrapper.vm.query).toBe(searchQuery);

        // skip debounceTime(100) and execute epics
        advance(100);

        // Check Store
        await Vue.nextTick(); // wait for store update
        const state = store.getState();
        expect(state.search.query).toBe(searchQuery);
        expect(state.search.documents).toBe(documents);
        expect(state.search.documentsTotal).toBe(documents.length);
    }));
});
