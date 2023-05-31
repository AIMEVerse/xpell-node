
/**
 * XData (Xpell Global shared Variables & Objects)
 * This object uses as a real-time shared memory between all Xpell modules nad components
 * Usage:
 *  - store primitive variable: 
 *      XData._v["my-var-id"] = "my-var-value"
 *  - get primitive variable:
 *      const v = XData._v["my-var-id"]
 *  - store object:
 *      XData._o["my-object-id"] = {my:"object"}
 *  - get object:
 *      const o = XData._o["my-object-id"]
 */

export type XDataObject = {[_id: string ]: any}
export type XDataVariable = {[_id: string ]: string | number | boolean}


export class _XData {
    //deprecated use _v and _o
    objects: XDataObject = {}
    variables: XDataVariable = {}


    #_objects: XDataObject = {}

    constructor(){
        this.#_objects = {}
    }


    

    /**
     * This method gets the XDataObject object
     * @returns XDataObject object
     * @example
     *  // get the XDataObject object
     *  const o = XData._o["my-object-id"]
     *  // set the XDataObject object
     *  XData._o["my-object-id"] = {my:"object"}
     */
    get _o(){
        return this.#_objects
    }

    /**
     * This method cleans the XData Memory
     */
    clean(){
        this.#_objects = {}
    }


}

/**
 * @property 
 */
export const XData = new _XData()

export default XData