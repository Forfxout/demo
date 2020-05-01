import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';
import reducers from './reducers';
import selectors from './selectors';


const monitoringSlice = createSlice({
    name: 'monitoring',
    initialState,
    reducers,
});

monitoringSlice.selectors = {
    ...monitoringSlice.selectors,
    ...selectors,
};

monitoringSlice.persistent = ['subscriptionsOrder'];
monitoringSlice.initialState = initialState;

export default monitoringSlice;
