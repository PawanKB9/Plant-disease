import { configureStore } from '@reduxjs/toolkit';
import { AppApi } from './AppApi.jsx';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
    reducer: {
        [AppApi.reducerPath]: AppApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AppApi.middleware),
});
setupListeners(store.dispatch)

export default store;