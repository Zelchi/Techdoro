import { createSlice } from "@reduxjs/toolkit";

type Time = {
    LongMax: number,
    ShortMax: number,
    FinalMax: number,
}

const getLocalStorage = (): Time => {
    const timeLong = localStorage.getItem('timeLongMax');
    const timeShort = localStorage.getItem('timeShortMax');
    const timeFinal = localStorage.getItem('timeFinalMax');

    return {
        LongMax: timeLong ? parseInt(timeLong) : 25,
        ShortMax: timeShort ? parseInt(timeShort) : 5,
        FinalMax: timeFinal ? parseInt(timeFinal) : 10
    }
}

const timeState: Time = getLocalStorage();

const timeMaxSlice = createSlice({
    name: 'timeMaxSlice',
    initialState: timeState,
    reducers: {
        setTimeMax: (state, action) => {
            state.LongMax = action.payload.timeLongMax;
            state.ShortMax = action.payload.timeShortMax;
            state.FinalMax = action.payload.timeFinalMax;
            localStorage.setItem('timeLongMax', action.payload.timeLongMax.toString());
            localStorage.setItem('timeShortMax', action.payload.timeShortMax.toString());
            localStorage.setItem('timeFinalMax', action.payload.timeFinalMax.toString());
        }
    }
});

export const { setTimeMax } = timeMaxSlice.actions;
export default timeMaxSlice.reducer;