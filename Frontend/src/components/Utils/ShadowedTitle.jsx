import React from "react";

function darkenHexColor(hex, amount = 0.2) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r * (1 - amount));
    g = Math.floor(g * (1 - amount));
    b = Math.floor(b * (1 - amount));

    return `rgb(${r}, ${g}, ${b})`;
}

const ShadowedTitle = ({ text, textColor="#ffffff", shadowColor = "#000000" }) => {
    const darkerColor = darkenHexColor(shadowColor);

    return (
        <div className="relative w-fit leading-none z-0 text-wrap">

            <h1 className="text-3xl md:text-5xl font-bold text-white relative text-center"
                style={{
                    textShadow: `2px 2px 0 ${darkerColor}, 4px 4px 0 ${darkerColor}, 6px 6px 0 ${darkerColor}`,
                    color: textColor,
                }}>
                {text}
            </h1>
        </div>
    );
};

export default ShadowedTitle;
