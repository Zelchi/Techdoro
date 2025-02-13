import { useRef, useEffect } from 'react'
import click from "../sound/click.mp3"
import alarm from "../sound/alarme.mp3"

const efeitosSonoros = {
    click,
    alarm,
} as const;

type som = keyof typeof efeitosSonoros;

export const useSound = (src: som, volume = 0.3) => {
    const som = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const audio = document.createElement("audio")
        document.body.appendChild(audio);
        const source = document.createElement("source")
        source.setAttribute("type", "audio/mpeg")
        source.setAttribute("src", efeitosSonoros[src]);
        audio.appendChild(source);
        som.current = audio;
        audio.volume = volume;
        return () => {
            document.body.removeChild(audio);
        }
    }, [src, volume])

    const play = () => {
        if (som.current) {
            som.current.load();
            som.current.play();
        }
    }

    const pause = () => {
        if (som.current) {
            if (som.current.paused) {
                som.current.play();
            } else {
                som.current.pause()
            }
        }
    }

    const stop = () => {
        if (som.current) {
            som.current.load();
        }
    }

    return [play, pause, stop]
}