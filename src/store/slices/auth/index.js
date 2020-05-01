import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';
import reducers from './reducers';


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers,
});

authSlice.persistent = '*';
authSlice.initialState = initialState;

export default authSlice;
