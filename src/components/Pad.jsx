import React from 'react'

const Pad = React.forwardRef((props, ref) => {
    return (
        <div className='drum-pad'
            onClick={() => props.playSound(ref.current.id)}
            id={props.sound.label}
        >
            <audio
                label={props.label}
                src={props.sound.src}
                className="clip"
                id={props.sound.key}
                ref={ref}
            />
            <p className='pad-text'>{props.sound.key}</p>
        </div>
    )
});

export default Pad;