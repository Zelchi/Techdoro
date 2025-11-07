import { createSlice } from "@reduxjs/toolkit";

type Time = {
    timeLongMax: number,
    timeShortMax: number,
    timeFinalMax: number,
}

const getLocalStorage = (): Time => {
    const timeLong = localStorage.getItem('timeLongMax');
    const timeShort = localStorage.getItem('timeShortMax');
    const timeFinal = localStorage.getItem('timeFinalMax');

    return {
        timeLongMax: timeLong ? parseInt(timeLong) : 25,
        timeShortMax: timeShort ? parseInt(timeShort) : 5,
        timeFinalMax: timeFinal ? parseInt(timeFinal) : 10
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
            state.timeFinalMax = action.payload.timeFinalMax;
            localStorage.setItem('timeLongMax', action.payload.timeLongMax.toString());
            localStorage.setItem('timeShortMax', action.payload.timeShortMax.toString());
            localStorage.setItem('timeFinalMax', action.payload.timeFinalMax.toString());
        }
    }
});

export const { setTimeMax } = timeMaxSlice.actions;
export default timeMaxSlice.reducer;