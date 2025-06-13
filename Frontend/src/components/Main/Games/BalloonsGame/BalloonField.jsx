import React from 'react';
import Balloon from './Balloon';
// This component renders a grid of balloons based on the provided options.

function BalloonField({ options = [], onBalloonClick }) {

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"> 

            {options.map((option, index) => (
                // Each balloon is rendered with a unique key and the option data.
                // The onClick handler is passed down to handle balloon clicks.
                <Balloon key={index} option={option} onClick={onBalloonClick} />      
            ))}
        </div>
    );
}

export default BalloonField;