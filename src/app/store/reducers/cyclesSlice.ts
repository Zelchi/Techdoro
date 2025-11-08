import { createSlice } from "@reduxjs/toolkit";

// Quantidade de ciclos de foco (LongMax + ShortMax) antes de ir para o clock final (pausa longa)
// Persistido em localStorage para manter preferência do usuário.

export type CyclesState = {
    cyclesBeforeFinal: number;
};

const getLocalStorage = (): CyclesState => {
    const cycles = localStorage.getItem('cyclesBeforeFinal');
    return {
        cyclesBeforeFinal: cycles ? parseInt(cycles) : 4 // padrão pomodoro clássico
    };
};

const cyclesState: CyclesState = getLocalStorage();

const cyclesSlice = createSlice({
    name: 'cyclesSlice',
    initialState: cyclesState,
    reducers: {
        setCyclesBeforeFinal: (state, action) => {
            state.cyclesBeforeFinal = action.payload;
            localStorage.setItem('cyclesBeforeFinal', action.payload.toString());
        }
    }
});

export const { setCyclesBeforeFinal } = cyclesSlice.actions;
export default cyclesSlice.reducer;
