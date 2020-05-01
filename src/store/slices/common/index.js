import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';
import reducers from './reducers';


const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers,
});

commonSlice.initialState = initialState;

export default commonSlice;
