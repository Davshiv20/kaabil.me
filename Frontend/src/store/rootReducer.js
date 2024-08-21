import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import reducers here
import authReducer from '@features/authSlice';


// Create persist configs for each reducer

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'isAuthenticated']
};


// Create persisted reducers

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Combine all reducers into a rootReducer
const rootReducer = combineReducers({
    auth: persistedAuthReducer
});

export default rootReducer;
