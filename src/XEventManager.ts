
class XEventDispatcher {

    private events: {[name:string]:Array<CallableFunction>}

    constructor() {
        this.events = {}
    }

    on(eventName:string, listener:CallableFunction) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    fire(eventName:string, data?:any) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => listener(data));
        }
    }
    
}


export const  XEventManager = new XEventDispatcher()

export default XEventManager

