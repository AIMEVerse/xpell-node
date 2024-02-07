/**
 * Xpell - Real-Time User Interface Platform
 * Typescript Edition   
 *      
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version
 * 3 of the License, or (at your option) any later version.
 *
 *
 */



/** interface */
import { XCommand, XCommandData } from "./XCommand.js"
import { XUtils, FPSCalc } from "./XUtils.js"
import { XLogger as _xlog } from "./XLogger.js"
import XData from "./XData.js"
import XParser from "./XParser.js"
import XModule from "./XModule.js"
import { XEventManager as XEM } from "./XEventManager.js"








// class XpellMainModule extends XModule {



//     constructor(data) {
//         const defaults = {name:"xpell"}
//         super(data,defaults)
//     }

//     _info(xcmd:XCommand) {
//         _xlog.log("Xpell Engine V:" + Xpell.version)
//     }

//     _loadModule(xcmd:XCommand) {
//         _xlog.log(xcmd.params["name"])
//     }
// }

/**
 * @class  Xpell main engine
 */
export class XpellEngine {
    _version: string
    _engine_id: string
    _frame_number: number
    #fps_calc: FPSCalc
    _fps: number = 1
    #_modules: { [name: string]: any } = {}
    parser: typeof XParser
    private _interval: NodeJS.Timeout | undefined

    constructor() {
        this._version = "0.0.1"
        this._engine_id = XUtils.guid()
        this._frame_number = 0
        this.#fps_calc = new FPSCalc()
        this.parser = XParser
        this.#_modules = {}
        XEM.fire("xpell-init")
        _xlog.enabled = false
        //this.load()
    }


    /**
     * Enable Xpell logs to console
     */
    verbose() {
        _xlog.enabled = true
    }


    /**
     * Loads Xpell module into the engine
     * @param {XModule} xModule 
     */
    loadModule(xModule: XModule): void {
        if (this.#_modules.hasOwnProperty(xModule._name)) {
            _xlog.log("Module " + xModule._name + " already loaded")
        } else {
            this.#_modules[<any>xModule._name] = xModule;
            xModule.load()
        }
    }

    /**
     * Loads multiple module at ones
     * @param {Array<XModule>} xModulesArray 
     */
    loadModules(xModulesArray: Array<XModule>): void {
        const sthis = this //strong this
        xModulesArray.forEach(mod => sthis.loadModule(mod))
    }


    /**
     * Display information about the Xpell engine to the console
     */
    info() {
        _xlog.log("Xpell information:\n- Engine Id: " + this._engine_id + "\n- Version " + this._version)
    }


    /**
    * Run textual xCommand -
    * @param {cmd} - text command
    */

    run(stringXCommand: string) {
        if (stringXCommand?.length > 2) {
            let scmd = XParser.parse(stringXCommand)
            return this.execute(scmd)
        } else {
            throw "Unable to parse Xpell command"
        }
    }

    /**
     * Execute Xpell Command 
     * @param {XCommand} 
     */
    execute(xcmd: XCommand | XCommandData): any {
        if (xcmd && xcmd._module && this.#_modules[xcmd._module]) {
            return this.#_modules[xcmd._module].execute(xcmd)
        } else {
            throw "Xpell module " + xcmd._module + " not loaded"
        }
    }



    /**
     * Main onFrame method
     * calls all the sub-modules onFrame methods (if implemented)
     */
    async onFrame(): Promise<void> {
        this._frame_number++
        Object.keys(this.#_modules).forEach(mod => {
            if (this.#_modules[mod].onFrame && typeof this.#_modules[mod].onFrame === 'function') {
                this.#_modules[mod].onFrame(this._frame_number)
            }
        })
        XData._o["frame-number"] = this._frame_number
        XData._o["fps"] = this.#fps_calc.calc()
        // _xlog.log("Frame: " + this._frame_number + " FPS: " + XData._o["fps"])





    }


    /**
     * Gets Xpell module by name
     * @param {string} moduleName - name of the loaded module
     * @returns {XModule}
     */
    getModule(moduleName: string): XModule {
        return this.#_modules[moduleName]
    }

    /**
     * Start Xpell engine for web browsers using setInterval
     */
    start() {
        _xlog.log("Starting Xpell")
        this._interval = setInterval(() => { Xpell.onFrame() }, 1000 / this._fps)
    }

    /**
     * Stop Xpell engine
     */
    stop() {
        clearInterval(this._interval)
    }



}

/**
 * Xpell Engine instance
 * @public Xpell Engine instance
 */
export const Xpell = new XpellEngine()

export default Xpell



/**
 * Xpell - Real-Time User Interface Platform
 * Typescript Edition
 * Library Entry Point
 * 
 * @description Universal User Interface (UI) Engine for Javascript supporting devices & browsers
 * @author Fridman Fridman <fridman.tamir@gmail.com>
 * @since  22/07/2022
 * @Copyright Fridman Tamir 2022, all right reserved
 *
 *      This program is free software; you can redistribute it and/or
 *		modify it under the terms of the GNU General Public License
 *		as published by the Free Software Foundation; either version
 *		3 of the License, or (at your option) any later version.
 *
 */

export { Xpell as _x }
export { XUtils, XUtils as _xu } from "./XUtils.js"
export { XData, XData as _xd, type XDataObject, type XDataVariable, _XData } from "./XData.js"
export { XParser } from "./XParser.js"
export { XCommand, type XCommandData } from "./XCommand.js"
export { XLogger, XLogger as _xlog, _XLogger } from "./XLogger.js"
export {
    XModule,
    type XModuleData,
    GenericModule
} from "./XModule.js"
export {
    XObject,
    XObjectPack,
    type IXData,
    type IXObjectData,
    type XDataXporterHandler,
    type XObjectData,
    type XObjectOnEventIndex,
    type XObjectOnEventHandler
} from "./XObject.js"
export { XObjectManager } from "./XObjectManager.js"
export { XEventManager, XEventManager as _xem, type XEventListener, type XEvent, type XEventListenerOptions, _XEventManager } from "./XEventManager.js"
export { type XNanoCommandPack, type XNanoCommand } from "./XNanoCommands.js"
export {Wormholes, type WormholeEvents} from "./Wormholes.js"
