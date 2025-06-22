import React from "react";

/**
 * Darkens a given hex color by reducing its RGB values.
 *
 * @param {string} hex - Hex color string.
 * @param {number} amount - Amount to darken each color channel (default 0.2 = 20%).
 * @returns {string} - Darkened color as an RGB string.
 */
function darkenHexColor(hex, amount = 0.2) {
    // Parse the red, green, and blue components from the hex string
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Reduce each component by the given percentage
    r = Math.floor(r * (1 - amount));
    g = Math.floor(g * (1 - amount));
    b = Math.floor(b * (1 - amount));

    // Return the new color in rgb format
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * ShadowedTitle component displays a heading with a bold multi-layered text shadow.
 *
 * @param {Object} props
 * @param {string} props.text - The title text to display.
 * @param {string} [props.textColor="#ffffff"] - The color of the text.
 * @param {string} [props.shadowColor="#000000"] - The base color of the text shadow.
 * @returns {JSX.Element} Styled heading with layered shadow.
 */
const ShadowedTitle = ({ text, textColor="#ffffff", shadowColor = "#000000" }) => {
    // Compute a darker version of the shadow color to enhance visibility
    const darkerColor = darkenHexColor(shadowColor);

    return (
        <div className="relative w-fit leading-none z-0 text-wrap">
            {/* Main title with multi-layered offset shadows for 3D effect */}
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
