import React from 'react';
import Pad from "./Pad";
import Display from "./Display";
import sounds from "../sounds.js";
import { useEffect, useRef, useMemo } from 'react';

const NINE = 9;

export default function Machine() {
    const [label, setLabel] = React.useState("Start Jammin'");
    const padRefArr = new Array(NINE).fill(null).map(() => useRef(null));


    //midi support 
    useEffect(() => {

        const midiMessageFunc = (midiInputVal => {
            const note = midiInputVal.data[1];
            const vel = midiInputVal.data[2];

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
        })

        //adding event listeners for each recognized midi port 
        try {
            navigator.requestMIDIAccess()
                .then(success => {
                    const midiInputs = success.inputs;
                    midiInputs.forEach(input => {
                        input.addEventListener("midimessage", (midiVal => midiMessageFunc(midiVal)));
                    });
                });
        } catch (e) {
            if (e instanceof TypeError) {
                console.log("Sorry, your browser doesn't support midi.");
            }
        };

        //cleaup function (removing listeners from each recognized midi port)
        return (() => {
            try {
                navigator.requestMIDIAccess()
                    .then(success => {
                        success.inputs.forEach(input => {
                            input.removeEventListener("midimessage", (midiVal => midiMessageFunc(midiVal)));
                        });
                    });
            } catch (e) {
                if (e instanceof TypeError) {
                    console.log("Sorry, your browser doesn't support midi.");
                };
            };
        });
    }, []);

    //keyboard support
    useEffect(() => {
        document.addEventListener("keydown", (event) => playSound(event.key.toUpperCase()));

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

    const changeLabel = (padLabel) => {
        const newLabel = padLabel.replace("_", " ");
        setLabel(newLabel);
    };

    const pads = useMemo(() =>
        sounds.map((soundObj, index) => {
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
        }), []);

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