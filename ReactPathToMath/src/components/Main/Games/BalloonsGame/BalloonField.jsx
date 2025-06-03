import React from 'react';
import Balloon from './Balloon';

function BalloonField({ options = [], onBalloonClick }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 p-8">
            {options.map((option, index) => (
                <Balloon key={index} option={option} onClick={onBalloonClick} />
            ))}
        </div>
    );
}

export default BalloonField;
