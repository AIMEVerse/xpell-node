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



/**
 * This interface define the listener callable function (provided with "on" method)
 */
export interface XEventListener {
    (eventName:string,data:any):void
}

/**
 * XEventDispatcher is the system event dispatcher and manager
 */
class XEventDispatcher {

    //events dictionary object and listeners list
    private _events: {[name:string]:Array<XEventListener>}

    constructor() {
        this._events = {}
    }

    on(eventName:string, listener:XEventListener) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(listener);
    }

    fire(eventName:string, data?:any) {
        if (this._events[eventName]) {
            this._events[eventName].forEach(listener => listener(eventName,data));
        }
    }
    
}


export const  XEventManager = new XEventDispatcher()

export default XEventManager

