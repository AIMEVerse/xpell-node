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

export {Xpell,Xpell as _x} from "./src/Xpell"
export {XUtils,XUtils as _xu} from "./src/XUtils"
export {XData,XData as _xd,type XDataObject,type XDataVariable} from "./src/XData"
export {XParser} from "./src/XParser"
export {XCommand,type XCommandData} from "./src/XCommand"
export {XLogger,XLogger as _xlog} from "./src/XLogger"
export {XModule,type XModuleData} from "./src/XModule"
export {XObject,XObjectPack,type IXObjectData,type XDataXporterHandler} from "./src/XObject"
export {XObjectManager} from "./src/XObjectManager"
export {XEventManager, XEventManager as _xem,type XEventListener,type XEvent,type XEventListenerOptions} from "./src/XEventManager"
export {type XNanoCommandPack,type XNanoCommand} from "./src/XNanoCommands"