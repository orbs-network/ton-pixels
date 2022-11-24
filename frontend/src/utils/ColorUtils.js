/**
 *
 */
export default class ColorUtils {

    /**
     *
     * @param r
     * @param g
     * @param b
     * @returns {string}
     */
    static rgbToHex(r, g, b) {
        return "#" + ColorUtils._componentToHex(r) + ColorUtils._componentToHex(g) + ColorUtils._componentToHex(b);
    }


    /**
     *
     * @param hex
     * @returns {{r: number, b: number, g: number}|null}
     */
    static hexToRgb(hex) {

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: 255
        } : null;

    }

    /**
     *
     * @param c
     * @returns {string|string}
     * @private
     */
    static _componentToHex(c) {

        const hex = c.toString(16);

        return hex.length === 1 ? "0" + hex : hex;

    }

}
