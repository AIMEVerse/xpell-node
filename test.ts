

import { IXObjectData,XCommand, XCommandData, XModule, XObject, XObjectPack, _x,_xem,_xd } from "./index"
import { GenericModule as gm} from "./src/XModule"
//display Xpell engine info
_x.verbose()





_x.start()

_x.loadModule(gm)




gm.importObjectPack(XObjectPack)

const xo = gm.create({_type:"object",_id:"my-x-obj",_children:[{_type:"object",id:"obj2"}]})
// console.log(xo.toXData());

const listener = _xem.once("xem-test",(xevent)=>{
    console.log("Event  " , xevent)
})


const listener2 = _xem.on("xem-test",(xevent)=>{
    console.log("listenre2   " , xevent)
    console.log("XData  " , _xd._v["my-var"],_xd._o["o1"]);
    
})



// console.log("Listener id: " + listener);

// _xem.removeListener(listener)
_xem.fire("xem-test","duck-off2")

_xem.fire("xem-test","duck-off")