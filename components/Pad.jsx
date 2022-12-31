import React from 'react'
import { useEffect } from 'react'

export default function Pad(props) {

    // const [isPlayed, setIsPlayed] = React.useState(false);

    console.log("pad pressed");
    function playSoundByKey(event) {
        playSound(event.key.toUpperCase());
    };

    useEffect(() => {

        document.addEventListener("keydown", playSoundByKey);

        return (() => {
            document.removeEventListener("keydown", playSoundByKey);
        })
    }, []);

    const playSound = (padId) => {
        // const pad = document.querySelector(`#${props.sound.key}`);
        const pad = document.querySelector(`#${padId}`);
        if (!pad) { return; }
        props.labelFunc(props.sound.label); //issue here
        pad.currentTime = 0;
        pad.play();
    };

    return (
        <div className='drum-pad' onClick={() => playSound(props.sound.key)} id={props.sound.label}>

            {/* <div className='drum-pad' onClick={playSound} id={props.sound.label}> */}
            <audio
                src={props.sound.src}
                className="clip"
                id={props.sound.key}
            />
            <p className='pad-text'>{props.sound.key}</p>
        </div>
    )

}
