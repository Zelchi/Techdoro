interface Window {
    api: render;
}

type time = {
    timeNow: number,
    timeMax: number,
}

type propClock = {
    alarm: () => void,
    swap: () => void,
    clock: {
        time: time
        setTime: (t: time) => void,
    },
    type: boolean,
}

type ProgressBar = {
    time: time,
    type: boolean,
}