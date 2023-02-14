/**
 * XEventManager (_xem) is Xpell event system manager.
 * This engine enables event dispatching and listening
 * Usage:
 *
 * 1.Event Listen
 *      // listen to event name "my-event" and display the event data to the console when fired
 *      _xem.on("my-event",(eventName,data)=>{
 *          console.log("XEM Event " + eventName,data)
 *      })
 *
 * 2. Event Fire
 *      //fire (trigger) event name "my-event" and simple object as data
 *      _xem.fire("my-event",{_data_param:"my data"})
 */
export type XEvent = {
    _id: number;
    _name: string;
    _data: any;
};
/**
 * This interface define the listener callable function (provided with "on" method)
 */
export interface XEventListener {
    (xevent: XEvent): void;
}
/**
 * XEventDispatcher is the system event dispatcher and manager
 */
declare class XEventDispatcher {
    private _events;
    private _event_counter;
    constructor();
    on(eventName: string, listener: XEventListener): void;
    fire(eventName: string, data?: any): void;
}
export declare const XEventManager: XEventDispatcher;
export default XEventManager;
