import React from 'react';
import Balloon from './Balloon';

/**
 * BalloonField component renders a grid of Balloon components.
 * Each balloon represents an answer option and can be clicked to trigger a callback.
 *
 * @param {Object} props
 * @param {Array<{ textValue: string, value: any }>} props.options - Array of option objects to display as balloons.
 * @param {function} props.onBalloonClick - Callback function invoked when a balloon is clicked.
 * @returns {JSX.Element} Rendered grid of balloons.
 */
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