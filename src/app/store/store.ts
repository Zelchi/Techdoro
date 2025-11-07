import { configureStore } from "@reduxjs/toolkit";
import volumeState from "./reducers/volumeSlice";
import timeMaxSlice from "./reducers/timeMaxSlice";
import themeSlice from "./reducers/themeSlice";
import windowSlice from "./reducers/windowSlice";

const store = configureStore({
    reducer: {
        timeMaxSlice,
        themeSlice,
        volumeState,
        windowSlice
    }
});
 
export type RootState = ReturnType<typeof store.getState>;
export default store;