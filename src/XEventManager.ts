/**
 * XEventManager (_xem) is Xpell event system manager.
 * This engine enables event dispatching and listening
 * Usage: 
 * 
 * 1.Event Listen
 *      // listen to event name "my-event" and display the event data to the console when fired
 *      _xem.on("my-event",(eventName,data)=>{
 *          _Xlog.log("XEM Event " + eventName,data)
 *      })
 * 
 * 2. Event Fire
 *      //fire (trigger) event name "my-event" and simple object as data
 *      _xem.fire("my-event",{_data_param:"my data"})
 */
import {  _xlog } from "./XLogger.js"
import {XUtils as _xu} from "./XUtils.js"



export type XEvent = {
    _id: number
    _name: string
    _data: any,
}


export type XEventListenerOptions =  {
    _once?: boolean
    _instance?: _XEventManager
}

/**
 * This interface define the listener callable function (provided with "on" method)
 */
export interface XEventListener {
    _id?: string
    (data: any): void
    _options?:XEventListenerOptions
}

/**
 * XEventDispatcher is the system event dispatcher and manager
 */
export class _XEventManager {
    _log_rules: {
        register: boolean,
        remove: boolean,

    } = {
            register: false,
            remove: false
        }

    //events dictionary object and listeners list
    protected _events: { [name: string]: Array<XEventListener> }
    protected _listeners_to_event_index: { [listernerId: string]: string} = {}
    constructor() {
        this._events = {}
    }

    /**
     * This method listen to event name and register the listener function
     * @param eventName event name to listen to
     * @param listener listener function to be called when event fired
     * @returns listener id
     * @example
     *     // listen to event name "my-event" and display the event data to the console when fired
     *    _xem.on("my-event",(data)=>{
     *         _xlog.log("XEM Event " + data)
     *    })
     */
    on(eventName: string, listener: XEventListener, options?:XEventListenerOptions): string {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(listener)
        listener._id =  _xu.guid()
        listener._options = options
        this._listeners_to_event_index[listener._id] = eventName
        if(this._log_rules.register) _xlog.log("XEM Register " + eventName, listener._id)
        return listener._id
    }

    /**
     * This method listen to event name and register the listener function
     * The listener will be removed after first fire
     * @param eventName event name to listen to
     * @param listener listener function to be called when event fired
     * @returns listener id
     */
    once(eventName: string, listener: XEventListener) {
        return this.on(eventName,listener,{_once:true})
    }

    /**
     * This method remove listener by listener id
     * @param listenerId listener id to remove
     */
    remove(listenerId: string) {
        if (this._listeners_to_event_index[listenerId]) {
            const eventName = this._listeners_to_event_index[listenerId]
            this._events[eventName].forEach((listener, index) => {
                if (listener._id == listenerId) {
                    this._events[eventName].splice(index, 1)
                }
            })
            delete this._listeners_to_event_index[listenerId]
            if(this._log_rules.remove) _xlog.log("XEM Remove " + eventName, listenerId)
        }
    }

    // /**
    //  * This method remove all listeners by event name
    //  * @param eventName event name to remove all listeners
    //  * currently not in use because of safety issues
    //  */
    // removeEventListeners(eventName: string) {
    //     if (this._events[eventName]) {
    //         this._events[eventName].forEach((listener, index) => {
    //             if (listener._id) delete this._listeners_to_event_index[listener._id]
    //         })
    //         delete this._events[eventName]
    //     }
    // }

    /**
     * This method fire (trigger) event name and data
     * @param eventName event name to fire
     * @param data data to be passed to the listener function
     */
    async fire(eventName: string, data?: any) {
        if (this._events[eventName]) {
            const eventsToRemove:Array<string> = []
            this._events[eventName].forEach((listener) => {
                listener(data)
                if(listener._options && listener._options._once && listener._id){
                    eventsToRemove.push(listener._id)
                }
            });
            eventsToRemove.forEach((listenerId)=>this.remove(listenerId))
        }
    }

    

}


export const XEventManager = new _XEventManager()

export default XEventManager

