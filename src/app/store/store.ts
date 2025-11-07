import { configureStore } from "@reduxjs/toolkit";
import volume from "./reducers/volumeSlice";
import timeMax from "./reducers/timeMaxSlice";
import theme from "./reducers/themeSlice";
import window from "./reducers/windowSlice";

const store = configureStore({
    reducer: {
        timeMax,
        theme,
        volume,
        window
    }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;