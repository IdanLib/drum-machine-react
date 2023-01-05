import React from 'react';
import Pad from "./Pad";
import Display from "./Display";
import sounds from "../src/sounds.js";
import { useEffect, createRef } from 'react';
import { useRef } from 'react';

export default function Machine() {
    const [label, setLabel] = React.useState("Start Jammin'");
    const padRefArr = new Array(9).fill(null).map(() => useRef(null));

    const changeLabel = (padLabel) => {
        const newLabel = padLabel.replace("_", " ");
        setLabel(newLabel);
    };

    useEffect(() => {
        //keyboard support
        document.addEventListener("keydown", (event) => playSound(event.key.toUpperCase()));

        //midi support 
        try {
            navigator.requestMIDIAccess()
                .then(success => {
                    const inputs = success.inputs;
                    inputs.forEach(input => {
                        input.addEventListener("midimessage", midiInput => {
                            const note = midiInput.data[1];
                            const vel = midiInput.data[2];

                            const pad = sounds.find(soundObj => {
                                return soundObj.midiNote === note;
                            });

                            if (!pad || vel <= 0) { return; }

                            const currentPad = padRefArr.find(item => {
                                return item.current.id === pad.key;
                            });
                            try {
                                currentPad.current.currentTime = 0;
                                currentPad.current.play();
                                changeLabel(currentPad.current.attributes.label.value);
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    });
                });
        } catch (e) {
            if (e instanceof TypeError) {
                console.log("Sorry, your browser doesn't support midi.");
            }
        };

        //cleanup
        return (() => {
            document.removeEventListener("keydown", (event) => playSound(event.key.toUpperCase()));
        });
    }, []);

    const playSound = (id) => {
        const currentPad = padRefArr.find(item => {
            return item.current.id === id;
        });

        if (!currentPad) { return; }
        changeLabel(currentPad.current.attributes.label.value);
        currentPad.current.currentTime = 0;
        currentPad.current.play();
    };

    const pads = sounds.map((soundObj, index) => {
        return (
            <Pad
                key={soundObj.label}
                sound={soundObj}
                label={soundObj.label}
                labelFunc={changeLabel}
                playSound={playSound}
                ref={padRefArr[index]}
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