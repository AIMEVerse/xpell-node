import XObjectManager from "./XObjectManager";
import { IXObjectData, XObject, XObjectPack } from "./XObject";
import XCommand, { XCommandData } from "./XCommand";
type XModuleData = {
    _name: string;
};
/**
 * Xpell Base Module
 * This class represents xpell base module to be extends
 * @class XModule
 *
 */
export declare class XModule {
    [k: string]: any;
    _id: string;
    _name: string;
    _log_rules: {
        createObject: boolean;
        removeObject: boolean;
    };
    protected objectManger: XObjectManager;
    constructor(data: XModuleData);
    load(): void;
    /**
     * Creates new XObject from data object
     * @param data - The data of the new object (JSON)
     * @return {XObject|*}
     */
    create(data: IXObjectData): any;
    /**
     * removes and XObject from the object manager
     * @param objectId op
     */
    remove(objectId: string): void;
    _info(xCommand: XCommand): void;
    /**
     * Run xpell command -
     * CLI mode, parse the command to XCommand JSON format and call execute method
     * @param {string} XCommand input - text
     * @returns command execution result
     */
    run(stringXCommand: string): Promise<any>;
    /**
     * execute xpell command - CLI mode
     * @param {XCommand} XCommand input (JSON)
     * @returns command execution result
     */
    execute(xCommand: XCommand | XCommandData): Promise<any>;
    /**
     * This method triggers every frame from the Xpell engine.
     * The method can be override by the extending module to support extended onFrame functionality
     * @param frameNumber Current frame number
     */
    onFrame(frameNumber: number): Promise<void>;
    /**
     * X Object Manager
     */
    get om(): XObjectManager;
    /**
     * Imports external object pack to the engine
     * The object class should be like XObjects with static implementation of getObjects() method
     * @param {XObjects} xObjectPack
     */
    importObjectPack(xObjectPack: XObjectPack | any): void;
    /**
     * Imports external object pack to the engine
     * @deprecated - use importObjectPack instead
     * @param xObjectPack
     */
    importObjects(xObjectPack: XObjectPack | any): void;
    /**
     * Imports external objects to the engine
     * The object class should be like XObjects with static implementation of getObjects() method
     * @param xObjectName
     * @param xObject
     */
    importObject(xObjectName: string, xObject: XObject): void;
}
export { XModuleData };
export default XModule;
