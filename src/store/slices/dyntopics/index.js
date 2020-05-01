import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';
import reducers from './reducers';
import selectors from './selectors';


const dyntopicsSlice = createSlice({
    name: 'dyntopics',
    initialState,
    reducers,
});

dyntopicsSlice.selectors = {
    ...dyntopicsSlice.selectors,
    ...selectors,
};

dyntopicsSlice.initialState = initialState;

export default dyntopicsSlice;
