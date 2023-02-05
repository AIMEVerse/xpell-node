

import { IXObjectData, _x,_xem } from "./index"

//display Xpell engine info
_x.verbose()


_x.start()

_xem.on("xem-test",(eventName:string,data:any)=>{
    console.log("Event + " + eventName, data)
})


_xem.fire("xem-test",{data:"duck-off"})