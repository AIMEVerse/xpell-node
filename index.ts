/**
 * Xpell - Real-Time User Interface Platform
 * Typescript Edition
 * Library Entry Point
 * 
 * @description Universal User Interface (UI) Engine for Javascript supporting devices & browsers
 * @author Fridman Fridman <tamirf@yahoo.com>
 * @since  22/07/2022
 * @Copyright Fridman Tamir 2022, all right reserved
 *
 *      This program is free software; you can redistribute it and/or
 *		modify it under the terms of the GNU General Public License
 *		as published by the Free Software Foundation; either version
 *		3 of the License, or (at your option) any later version.
 *
 */

const XFolder = "./src/"

export {default as Xpell,Xpell as _x} from "./src/Xpell"
export {XUtils,XUtils as _xu} from "./src/XUtils"
export {XData} from "./src/XData"
export {XParser} from "./src/XParser"
export {XCommand} from "./src/XCommand"
export {XLogger,XLogger as _xlog} from "./src/XLogger"
export {XModule} from "./src/XModule"
import IXObjectData from "./src/XObject"
export {IXObjectData}
export {XObject,XObjectPack} from "./src/XObject"
export {XObjectManager} from "./src/XObjectManager"
export {XEventManager, XEventManager as _xem} from "./src/XEventManager"
