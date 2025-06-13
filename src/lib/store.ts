import { configureStore } from "@reduxjs/toolkit";

import filterReducer from "./slices/filtersSlice";
import globalErrorsReducer from "./slices/globalErrorsSlice";

export const makeStore = ()=>{
    return configureStore({
        reducer: {
            filters: filterReducer,
            globalErrors: globalErrorsReducer
        },
        middleware: (getDefaultMiddleware)=>
            getDefaultMiddleware({
                serializableCheck: false
            })
    });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];