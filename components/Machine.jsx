import React from 'react';
import Pad from "./Pad";
import Display from "./Display";
import smoothSounds from "../src/sounds.js";

export default function Machine() {

    const [label, setLabel] = React.useState("Start Jammin'");

    const changeLabel = (padLabel) => {
        const newLabel = padLabel.replace("_", " ");
        setLabel(newLabel);
    };

    const pads = smoothSounds.map(soundObj => {
        return (
            <Pad
                key={soundObj.label}
                sound={soundObj}
                labelFunc={changeLabel}
            />
        );
    });

    return (
        <div className='padboard' id='display'>
            <h1 className='title'>The Ding-a-Ling 3000 Drum Machine</h1>
            <div className='pads'>
                {pads}
            </div>
            <Display
                label={label}
            />
        </div>
    );
};