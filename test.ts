

import { IXObjectData,XCommand, XCommandData, XModule, XObject, XObjectPack, _x,_xem } from "./index"
import { GenericModule as gm} from "./src/XModule"
//display Xpell engine info
_x.verbose()




_x.start()

_x.loadModule(gm)

gm.importObjectPack(XObjectPack)

const xo = gm.create({_type:"object",_id:"my-x-obj",_children:[{_type:"object",id:"obj2"}]})
// console.log(xo.toXData());

_xem.on("xem-test",(xevent)=>{
    // console.log("Event + " , xevent)
})


_xem.fire("xem-test",{myData:"duck-off"})
