import { createSlice } from "@reduxjs/toolkit";

type Time = {
    timeLongMax: number,
    timeShortMax: number
}

const getLocalStorage = () => {
    const timeLong = localStorage.getItem('timeLongMax');
    const timeShort = localStorage.getItem('timeShortMax');

    return {
        timeLongMax: timeLong ? parseInt(timeLong) : 25,
        timeShortMax: timeShort ? parseInt(timeShort) : 5
    }
}

const timeState: Time = getLocalStorage();

const timeMaxSlice = createSlice({
    name: 'timeMaxSlice',
    initialState: timeState,
    reducers: {
        setTimeMax: (state, action) => {
            state.timeLongMax = action.payload.timeLongMax;
            state.timeShortMax = action.payload.timeShortMax;
            localStorage.setItem('timeLongMax', action.payload.timeLongMax.toString());
            localStorage.setItem('timeShortMax', action.payload.timeShortMax.toString());
        }
    }
});

export const { setTimeMax } = timeMaxSlice.actions;
export default timeMaxSlice.reducer;