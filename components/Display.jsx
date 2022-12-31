import React from "react";

const Display = (props) => {

    // const [label, setLabel] = React.useState("Start Jammin'");

    return (
        <div id="instrument">
            <p>{props.label}</p>
        </div>
    )
}


export default Display; 