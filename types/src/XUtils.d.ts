interface IXData {
    [k: string]: string | null | [] | undefined | Function | boolean | number | {};
}
export declare class XUtils {
    /**
     * create ignore list for parser to ignore spells words
     * @param list - list of reserved words (comma separated)
     */
    static createIgnoreList(list: string, reservedWords: {}): {
        [k: string]: string;
    };
    /**
     * Generates GUID (Globally unique Identifier)
     * @returns {string}
     */
    static guid(): string;
    /**
     * Merges XDataObject with Defaults object
     * @param data - data of the Xpell command
     * @param defaults - defaults object to merge with
     * @param force - add defaults values even if exists
     */
    static mergeDefaultsWithData(data: IXData, defaults: IXData, force?: boolean): void;
    /**
     * Encode string to Base-64 format
     * @param str string to encode
     * @returns {string}
     */
    static encode(str: string): string;
    /**
     * Decode Base64 String to text
     * @param str Base64 encoded string
     * @returns {string}
     */
    static decode(str: string): string;
    /**
         * Returns a random integer between min (inclusive) and max (inclusive).
         * The value is no lower than min (or the next integer greater than min
         * if min isn't an integer) and no greater than max (or the next integer
         * lower than max if max isn't an integer).
         * Using Math.round() will give you a non-uniform distribution!
         */
    static getRandomInt(min: number, max: number): number;
}
/**
 * FPS Calculator
 * @class FPSCalc
 */
export declare class FPSCalc {
    #private;
    /**
     * Calc FPS according to moving average formula
     * @returns Accumulated FPS value
     */
    calc(): number;
}
export default XUtils;
