import { configureStore } from "@reduxjs/toolkit";
import volumeState from "./reducers/volumeSlice";

const store = configureStore({
    reducer: {
        volumeState,
    }
});
 
export type RootState = ReturnType<typeof store.getState>;
export default store;