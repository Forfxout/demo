import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';
import reducers from './reducers';
import selectors from './selectors';


const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers,
});

searchSlice.selectors = {
    ...searchSlice.selectors,
    ...selectors,
};

searchSlice.initialState = initialState;

export default searchSlice;
