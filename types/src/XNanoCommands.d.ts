/**
 * This file contains all the Basic Nano Commands of the Xobject
*/
import XCommand from "./XCommand";
import XObject from "./XObject";
export type XNanoCommandPack = {
    [k: string]: (XCommand: XCommand, XObject?: XObject) => void;
};
/**
 * XNanoCommand Pack
 */
export declare const _xobject_basic_nano_commands: XNanoCommandPack;
declare const _default: XNanoCommandPack;
export default _default;
