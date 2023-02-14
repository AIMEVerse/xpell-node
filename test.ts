

import { IXObjectData, XCommand, XCommandData, _x,_xem } from "./index"

//display Xpell engine info
_x.verbose()


_x.start()

_xem.on("xem-test",(xevent)=>{
    console.log("Event + " , xevent)
})


_xem.fire("xem-test",{myData:"duck-off"})

const xcmd:XCommandData = {
    _
}