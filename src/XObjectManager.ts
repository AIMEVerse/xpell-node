import XEM from "./XEventManager"
import XLogger from "./XLogger";
import XObject, { XObjectPack } from "./XObject";

/**
 * Xpell Module Object Manager
 * @description This manager holds the module XObjects that should be managed (XObject children will not be managed separately)
 * XModules uses the Object Manager to create new XObjects by providing the class of the object by name
 */

export class XObjectManager {
    objectClasses: {[name:string]:any};
    xObjects: {[name:string]:any};
    namesIndex: {[name:string]:any};
    constructor() {
        /**
         * Object Classes dictionary
         */
        this.objectClasses = {};

        /**
         * Live XObject that is being maintained by the Object Manager
         */
        this.xObjects = {};

        /**
         * Object Names index - uses to get object by name
         */
        this.namesIndex = {}
    }

    

    /**
     * Register multiple classes dictionary into the object manager
     * @param xObjects - key value list -> \{"view":XView,...\}
     */
    registerObjects(xObjects:XObjectPack):void {
        let names = Object.keys(xObjects)
        names.forEach(name => this.registerObject(name, xObjects[name]))
    }

    /**
     * Registers single XObject
     * @param name - name of the object
     * @param xObjects The object class
     */
    registerObject(name:string, xObjects:XObject) {
        this.objectClasses[name] = xObjects;
    }

    /**
     * Checks if a class (name) is found in the object manager classes dictionary
     * @param name - class name
     * @returns {boolean} 
     */
    hasObjectClass(name:string) {
        return this.objectClasses.hasOwnProperty(name);
    }

    /**
     * Retrieves XObject class instance
     * @param name class name
     * @returns {XObject}
     */
    getObjectClass(name:string) {
        return this.objectClasses[name];
    }

    /**
     * Retrieves all the classes dictionary
     * @returns 
     */
    getAllClasses() {
        return this.objectClasses;
    }

    /**
     * Add XObject instance to the manager
     * @param xObject XObject to maintain
     */
    addObject(xObject:XObject) {
        if (xObject && xObject._id) {
            this.xObjects[<string>xObject._id] = xObject
            if (!xObject._name || (<string>xObject._name).length==0) {
                xObject._name = xObject._id
            }
            this.namesIndex[<string>xObject._name] = xObject._id
            XEM.fire("xpell-on-change")
        }
        else {
            XLogger.log("unable to add object")
        }
    }

    /**
     * Remove XObject from the manager 
     * @param xObjectId object id to remove
     */
    removeObject(xObjectId:string) {
        const obj = this.xObjects[xObjectId]
        if(obj) {
            this.namesIndex[obj?.name] = null
            this.xObjects[xObjectId] = null;
        }
    }

    /**
     * Retrieves XObject instance
     * @param xObjectId XObject id 
     * @returns {XObject}
     */
    getObject(xObjectId:string):XObject {
        //console.log(this.spell_objects);
        return this.xObjects[xObjectId]
    }


    /**
     * Retrieves XObject instance
     * @param objectName XObject name 
     * @returns {XObject}
     */
    getObjectByName(objectName:string):XObject | null {
        if(this.namesIndex[objectName]) {
            return this.getObject(this.namesIndex[objectName])
        } 
        return null
    }
}

export default XObjectManager