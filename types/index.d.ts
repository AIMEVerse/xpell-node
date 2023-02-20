declare interface IXData {
    [k:string]: string | null | [] | undefined | Function | boolean | number | {}
}

declare interface IXData_2 {
    [k: string]: string | null | [] | undefined | Function | boolean | number | {}
}

/**
 * XObject constructor data interface 
 * @interface IXObjectData
 * @param _xversion - minimum Xpell interpreter version (optional default value is 1.0)
 */
export declare interface IXObjectData extends IXData_2 {
    [k: string]: string | null | [] | undefined | Function | boolean | number | {}
    _id?: string | null
    // id?: string | null
    _name?: string
    _type?: string
    _children?: Array<IXObjectData>
    _xversion?: number
}

/**
 * XCommand class - this command is being sent to the Xpell parser or every XModule/XObject for execution
 */

export declare class XCommand {

    /**
     * The XModule to handle to command
     */
    _module!: string

    /**
     * The XObject that should handle the command (optional - uses only to send XCommand to specific object)
     */
    _object?:string 

    /**
     * The command operation (op/method) to execute
     */
    _op!:string 

    /**
     * command parameters array
     */
    _params?: {
        [k:string] : string | number | Function
    }


    /**
     * XCommand create date timestamp
     */
    d!: number

    constructor(data?:XCommandData) {
        if(data) {
            Object.keys(data).forEach((key:string)=>{
                this[<"_module">key] = data[<"_module">key]})
        }
        if(!this.d) this.d = Date.now()
    }

    /**
     * Gets th parameter value from the XCommand whether it has a name or just a position
     * There are 2 ways to send XCommand with parameters: 
     *  1. <module> <op> <param-0> <param-1> <param-2>     // position is for this case
     *  2. <module> <op> param-name:param-value            // name is for this case
     * @param position the position of the parameter if no name is send 
     * @param name the name of the parameter 
     * @param defaultValue the default value if none above exists
     * @returns {any} the actual parameter value
     */
    getParam(position:number, name:string,defaultValue:any) {
        if (this._params?.hasOwnProperty(name)) return this._params[name]
        else if (this._params?.hasOwnProperty(position)) return this._params[position]
        else return defaultValue
    }
}

export declare type XCommandData = {
    _module: string  ,
    _object?:string  ,
    _op:string ,
    _params?: {
        [k:string] : string | number | Function
    },
}

/**
 * @property 
 */
export declare const XData = new XDataSource();

declare type XDataInstanceXporter = {
    cls:any, //the Object Class to replace with the exporter output
    handler:XDataXporterHandler //the class handler (exporter function)
}

declare type XDataXporter = {
    _ignore_fields : string[],
    _instance_xporters:{
        [id:string]: XDataInstanceXporter
    }
}

declare interface XDataXporterHandler {
    (inst:any): any
}

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
// import {XUtils as _xu} from "./XUtils"



export declare type XEvent = {
    _id: number
    _name: string
    _data: any
}

/**
 * This interface define the listener callable function (provided with "on" method)
 */
export declare interface XEventListener {
    (xevent: XEvent): void
}

declare const XEventManager = new XEventDispatcher();
export { XEventManager }
export { XEventManager as _xem }

/**
 * 
 */
declare const XLogger = new XLoggerEngine();
export { XLogger }
export { XLogger as _xlog }

/**
 * Xpell Base Module
 * This class represents xpell base module to be extends
 * @class XModule
 * 
 */
export declare class XModule {
    [k:string]:any
    _id: string
    _name: string;
    _log_rules: {
        createObject: boolean,
        removeObject: boolean,

    } = {
        createObject: false,
        removeObject: false
    }

    //private object manager instance
    protected objectManger = new XObjectManager()
    //engine: any;  //deprecated remove after spell3d


    constructor(data: XModuleData) {
        this._name = data._name
        this._id = XUtils.guid()


    }

    load() {
        _xl.log("Module " + this._name + " loaded")
    }

    /**
     * Creates new XObject from data object
     * @param data - The data of the new object (JSON)
     * @return {XObject|*}
     */
    create(data:IXObjectData) {

        let xObject:any;
        if (data.hasOwnProperty("_type")) {
            if (this.objectManger.hasObjectClass(<string>data["_type"])) {
                let xObjectClass = this.objectManger.getObjectClass(<string>data["_type"]);
                if (xObjectClass.hasOwnProperty("defaults")) {
                    XUtils.mergeDefaultsWithData(data, xObjectClass.defaults);
                }
                xObject = new xObjectClass(data);
            }
            else {
                throw "Xpell object '" + data["_type"] + "' not found";
            }
        }
        else {
            xObject = new XObject(data);
        }

        //await spell_object.init();
        this.objectManger.addObject(xObject)
        if (data._children) {
            // const sthis = this //strong "this" for anonymous function use
            data._children.forEach(async (spell) => {
                let new_spell = this.create(spell);
                xObject.append(new_spell)
            });
        }
        xObject.onCreate()
        return xObject;
    }

    /**
     * removes and XObject from the object manager
     * @param objectId op
     */
    remove(objectId:string) {
        const obj:XObject = this.objectManger.getObject(objectId)
        if (obj) {
            this.objectManger.removeObject(objectId)
            if(obj["dispose"] && typeof obj.dispose === "function") {
                (<XObject>obj).dispose()
            }
        }
    }


    _info(xCommand:XCommand) {
        _xl.log("module info")
    }

    //xpell interpreter 
    /**
     * Run xpell command - 
     * CLI mode, parse the command to XCommand JSON format and call execute method
     * @param {string} XCommand input - text 
     * @returns command execution result
     */
    async run(stringXCommand:string) {
        if (stringXCommand) {
            let strCmd = stringXCommand.trim()
            //add module name to run command if not exists (in case of direct call from the module)
            if (!strCmd.startsWith(this._name)) {
                strCmd = this._name + " " + strCmd
            }
            let xCommand = XParser.parse(strCmd)
            return await this.execute(xCommand)
        } else {
            throw "Unable to parse Xpell Command"
        }
    }




    /**
     * execute xpell command - CLI mode
     * @param {XCommand} XCommand input (JSON)
     * @returns command execution result
     */
    async execute(xCommand: XCommand | XCommandData) {


        //search for xpell wrapping functions (starts with _ "underscore" example -> _start() , async _spell_async_func() )
        if(xCommand._op){
            const lop:string = "_" + xCommand._op.replaceAll('-', '_') //search for local op = lop
            if (this[lop] && typeof this[lop] === 'function') {
                return this[lop](xCommand)
            }
            else if (this.objectManger) //direct xpell injection to specific module
                {

                const o = this.objectManger.getObjectByName(xCommand._op)
                if (o) { o.execute(xCommand) }
                else { throw "Xpell Module cant find op:" + xCommand._op }
            }
            else {
                throw "Xpell Module cant find op:" + xCommand._op
            }
        }



    }

    /**
     * This method triggers every frame from the Xpell engine.
     * The method can be override by the extending module to support extended onFrame functionality
     * @param frameNumber Current frame number
     */
    async onFrame(frameNumber: number) {
        Object.keys(this.objectManger.xObjects).forEach(key => {
            const so:XObject = <any>this.objectManger.xObjects[key]
            if (so && so.onFrame && typeof so.onFrame === 'function') {
                so?.onFrame(frameNumber)
            }
        })
    }


    /**
     * X Object Manager
     */

    //getter for om (object manager) instance
    get om() { return this.objectManger }

    /**
     * Imports external object pack to the engine
     * The object class should be like XObjects with static implementation of getObjects() method
     * @param {XObjects} xObjectPack 
     */
    importObjectPack(xObjectPack: XObjectPack | any) {
        this.objectManger.registerObjects(xObjectPack.getObjects())
    }

    /**
     * Imports external object pack to the engine
     * @deprecated - use importObjectPack instead
     * @param xObjectPack 
     */
    importObjects(xObjectPack: XObjectPack | any) {
        this.importObjectPack(xObjectPack)
    }

    /**
     * Imports external objects to the engine
     * The object class should be like XObjects with static implementation of getObjects() method
     * @param xObjectName 
     * @param xObject 
     */
    importObject(xObjectName:string, xObject:XObject) {
        this.objectManger.registerObject(xObjectName, xObject)
    }

}

export declare type XModuleData = {
    _name: string
}

/**
 * Single x-nano-command interface
 */
declare interface XNanoCommand  {
    (xCommand: XCommand | XCommandData, xObject?: XObject): any
}

/**
 * x-nano-command pack
 */
export declare type XNanoCommandPack = {
    [k:string] :XNanoCommand
}

/**
 * XObject class
 * @class XObject
 */
export declare class XObject implements IXObjectData {
    [k: string]: string | null | [] | undefined | Function | boolean | number | {}
    _children: Array<XObject>
    private _nano_commands: { [k: string]: XNanoCommand }
    private _xporter:XDataXporter = {
        _ignore_fields: ["_to_xdata_ignore_fields", "_xporter","_children"],
        _instance_xporters: {}
    }
    /**
     * XObject constructor is creating the object and adding all the data keys to the XObject instance
     * @param data constructor input data (object)
     * @param defaults - defaults to merge with data
     * @param skipParse - skip data parsing 
     * 
     */
    constructor(data: IXObjectData, defaults?: any, skipParse?: boolean) {
        if (defaults) {
            XUtils.mergeDefaultsWithData(data, defaults)
        }

        this._id = (data && data._id) ? data._id : "so-" + XUtils.guid();
        this._type = "object" //default type
        this._children = []
        this._nano_commands = {}
        this.addNanoCommandPack(_xobject_basic_nano_commands)

        //add Xporter ignore field and instance handler (uses as example also)
        this.addXporterDataIgnoreFields(["_nano_commands"]) 
        this.addXporterInstanceXporter(XObject,(objectInstance: XObject) => {
            return objectInstance.toXData()
        })

        if (!skipParse && data) {
            // if() {
            delete data._id // delete the _id field to remove duplication by the parse function
            this.parse(data, reservedWords);
            // } 

        }

    }

    /**
     * Append a child XObject to this XObject
     * @param xobject 
     */
    append(xobject:XObject) {
        this._children.push(xobject)
    }

    /**
     * Add single nano command to the object
     * @param commandName - the nano command name
     * @param nanoCommandFunction 
     */
    addNanoCommand(commandName: string, nanoCommandFunction: XNanoCommand) {
        if (typeof nanoCommandFunction === 'function') {
            // _xlog.log("command " + commandName + " loaded to xobject " + this._id)
            this._nano_commands[commandName] = nanoCommandFunction
        }
    }

    addNanoCommandPack(ncPack: XNanoCommandPack) {
        if (ncPack) {
            Object.keys(ncPack).forEach((key: string) => {
                this.addNanoCommand(key, ncPack[key])
            })
        }
    }

    /**
     * List of fields to ignore when exporting the xobject to XData or string format
     * @param <string[]> ignoreFields - an array with all the fields to ignore 
     */
    addXporterDataIgnoreFields(ignoreFields:string[]) {
        this._xporter._ignore_fields = this._xporter._ignore_fields.concat(ignoreFields)
    }

    /**
     * Add XData Xporter instance handler
     * @param <XDataInstanceXporter> ie - the instance exporter object
     */
    addXporterInstanceXporter(classOfInstance:any,handler:XDataXporterHandler) {
        const xporterName = XUtils.guid()
        this._xporter._instance_xporters[xporterName] = {
            cls:classOfInstance,
            handler:handler
        }
    }



    async dispose() {
        this._children.forEach(child => child.dispose())
    }

    //get _id() {return this.#_id}

    /**
     * occurs on Xpell.init
     * must override
     */
    init(): void {
        throw "init method not implemented"
    }


    /**
     * Parse data to the XObject
     * @param data data to parse
     * @param ignore - lis of words to ignore in the parse process
     */
    parse(data: IXObjectData, ignore = reservedWords) {

        let cdata = Object.keys(data);
        cdata.forEach(field => {
            if (!ignore.hasOwnProperty(field) && data.hasOwnProperty(field)) {
                this[field] = <any>data[field];
            }
        });
    }

    /**
     * Parse data to the XObject
     * @param data data to parse
     * @param {object} fields- object with fields and default values (IXData format)
     * 
     * fields example = {
     *  _name : "default-name",
     * ...
     * }
     */
    parseFieldsFromXDataObject(data: IXObjectData, fields: { [name: string]: any }) {

        let cdata = Object.keys(fields);
        cdata.forEach((field: string) => {
            if (data.hasOwnProperty(field)) {
                this[field] = <any>data[field];
            } else {
                this[field] = fields[field]
            }
        })
    }


    /**
     * Parse list of fields from IXObjectData to the class
     * @param {IXObjectData} data -  the data
     * @param {Array<string>} fields - array of field names (string)
     * @param checkNonXParams - also check non Xpell fields (fields that not starting with "_" sign)
     */
    parseFields(data: IXObjectData, fields: Array<string>, checkNonXParams?: boolean) {

        fields.forEach(field => {
            if (data.hasOwnProperty(field)) {
                this[field] = <any>data[field];
            } else if (checkNonXParams && field.startsWith("_")) {
                const choppedField = field.substring(1) // remove "_" from field name "_id" = "id"
                if (data.hasOwnProperty(choppedField)) {
                    this[field] = <any>data[choppedField]
                    this[choppedField] = <any>data[choppedField] //add both to support Three arguments
                }
            }
        })
    }




    /**
     * this method triggered after the HTML DOM object has been created and added to the parent element
     * support external _on_create anonymous function in the , example:
     * _on_create: async (xObject) => {
     *      // xObject -> The XObject parent of the _on_create function, use instead of this keyword
     *      // write code that will be executed each frame.
     *      // make sure to write async anonymous function. 
     * }
     * 
     */
    async onCreate() {
        if (this._on_create) {
            if (typeof this._on_create == "function") {
                this._on_create(this)
            } else if (typeof this._on_create == "string") {
                this.run(this._id + " " + this._on_create) //
            }
        }
        //propagate event to children
        this._children.forEach((child: XObject) => {
            if (child.onCreate && typeof child.onCreate === 'function') {
                child.onCreate()
            }
        })

    }

    /**
     * Triggers when the object is being mounted to other element
     * support external _on_create anonymous function in the , example:
     * _on_mount: async (xObject) => {
     *      // xObject -> The XObject parent of the _on_mount function, use instead of this keyword
     *      // write code that will be executed each frame.
     *      // make sure to write async anonymous function. 
     * }
     */
    async onMount() {
        if (this._on_mount) {
            if (typeof this._on_mount == "function") {
                this._on_mount(this)
            } else if (typeof this._on_mount == "string") {
                this.run(this._id + " " + this._on_mount) //
            }
        }
        //propagate event to children
        this._children.forEach((child: XObject) => {
            if (child.onMount && typeof child.onMount === 'function') {
                child.onMount()
            }
        })
    }

    /**
     * Triggers from Xpell frame every frame
     * Support _on_frame atrribute that can be XCommand string or function
     * @param {number} frameNumber 
     * 
     * XObject supports
     * 1. External _on_frame anonymous function in the , example:
     * _on_frame: async (xObject,frameNumber) => {
     *      // xObject -> The XObject parent of the _on_frame function, use instead of this keyword
     *      // frameNumber = Xpell current frame number 
     *      // write code that will be executed each frame.
     *      // make sure to write async anonymous function. 
     *      // be wise with the function execution and try to keep it in the 15ms running time to support 60 FPS
     * }
     * 
     * 2. String execution of nano commands
     * 
     * _on_frame: "nano command text"
     * 
     */
    async onFrame(frameNumber: number) {
        //
        if (this._on_frame) {
            if (typeof this._on_frame == "function") {
                this._on_frame(this, frameNumber)
            } else if (typeof this._on_frame == "string") {
                this.run(this._id + " " + this._on_frame) //
            }
        }

        //propagate event to children
        this._children.forEach((child: XObject) => {
            if (child.onFrame && typeof child.onFrame === 'function') {
                child.onFrame(frameNumber)
            }
        })
    }

    /**
     * Runs object nano commands
     * @param nanoCommand - object nano command (string)
     * @param cache - cache last command to prevent multiple parsing on the same command
     */

    async run(nanoCommand: string, cache = true) {

        let jcmd: XCommand = (this._cache_cmd_txt && this._cache_cmd_txt == nanoCommand) ? <XCommand>this._cache_jcmd : XParser.parse(nanoCommand)
        //cache command to prevent parsing in every frame
        if (cache) {
            this._cache_cmd_txt = nanoCommand
            this._cache_jcmd = jcmd
        }
        this.execute(jcmd) //execute nano commands

    }


    /**
     * Execute XCommand within the XObject Nano Commands
     * @param xCommand XCommand to execute
     * 
     * Nano command example:
     * 
     * "set-text" : (xCommand,xObject) => {
     *      xObject.setText(xCommands.params.text)
     * }
     * 
     */
    async execute(xCommand: XCommand | XCommandData) {
        // run nano commands

        if (xCommand._op && this._nano_commands[xCommand._op]) {
            try {
                this._nano_commands[xCommand._op](<XCommand>xCommand, this)
            } catch (err) {
                _xlog.error(this._id + " has error with command name " + xCommand._op + " " + err)
            }
        } else {
            _xlog.error(this._id + " has no command name " + xCommand._op)
        }
    }

    /**
     * Return an IXObjectData JSON representation of the XObject
     * @returns IXObjectData
     */
    toXData(): IXObjectData {
        const out: IXObjectData = {}
        Object.keys(this).forEach(field => {
            if (!this._xporter._ignore_fields.includes(field) &&
            this.hasOwnProperty(field) && this[field] !== undefined) {
                const tf = this[field]
                console.log(tf,typeof tf)
                if (typeof tf === "function") {
                    const funcStr = tf.toString()
                    if (!funcStr.startsWith("class")) { //in case of class reference it being ignored
                        out[field] = funcStr
                    } 
                } else if (typeof tf === "object") {
                    const xporters = Object.keys(this._xporter._instance_xporters)
                    let regField = true
                    xporters.forEach(xporter => {
                        const xp = this._xporter._instance_xporters[xporter]
                        if (tf instanceof this._xporter._instance_xporters[xporter].cls) {
                            out[field] = this._xporter._instance_xporters[xporter].handler(tf)
                            regField = false
                        }
                    })

                    if (regField) {
                        out[field] = tf
                    }
                }
                else {
                    out[field] = tf
                }

            }
        })
        //children are being created separately
        out._children = []
        if(this._children.length>0) {
            this._children.forEach(child => out._children?.push(child.toXData()))
        }

        return out
    }

    /**
     * Return a string representation of the XObject
     * @returns string
     */
    toString() {
        return JSON.stringify(this.toXData())
    }

}

/**
 * Xpell Module Object Manager
 * @description This manager holds the module XObjects that should be managed (XObject children will not be managed separately)
 * XModules uses the Object Manager to create new XObjects by providing the class of the object by name
 */

export declare class XObjectManager {
    objectClasses: {[name:string]:any};
    xObjects: {[name:string]:any};
    namesIndex: {[name:string]:any};
    constructor() {
        /**
         * Object Classes dictionary
         */
        this.objectClasses = {};

        /**
         * Live XObject that is being maintained by the Object Manager
         */
        this.xObjects = {};

        /**
         * Object Names index - uses to get object by name
         */
        this.namesIndex = {}
    }



    /**
     * Register multiple classes dictionary into the object manager
     * @param xObjects - key value list -> \{"view":XView,...\}
     */
    registerObjects(xObjects:XObjectPack):void {
        let names = Object.keys(xObjects)
        names.forEach(name => this.registerObject(name, xObjects[name]))
    }

    /**
     * Registers single XObject
     * @param name - name of the object
     * @param xObjects The object class
     */
    registerObject(name:string, xObjects:XObject) {
        this.objectClasses[name] = xObjects;
    }

    /**
     * Checks if a class (name) is found in the object manager classes dictionary
     * @param name - class name
     * @returns {boolean} 
     */
    hasObjectClass(name:string) {
        return this.objectClasses.hasOwnProperty(name);
    }

    /**
     * Retrieves XObject class instance
     * @param name class name
     * @returns {XObject}
     */
    getObjectClass(name:string) {
        return this.objectClasses[name];
    }

    /**
     * Retrieves all the classes dictionary
     * @returns 
     */
    getAllClasses() {
        return this.objectClasses;
    }

    /**
     * Add XObject instance to the manager
     * @param xObject XObject to maintain
     */
    addObject(xObject:XObject) {
        if (xObject && xObject._id) {
            this.xObjects[<string>xObject._id] = xObject
            if (!xObject._name || (<string>xObject._name).length==0) {
                xObject._name = xObject._id
            }
            this.namesIndex[<string>xObject._name] = xObject._id
            XEM.fire("xpell-on-change")
        }
        else {
            XLogger.log("unable to add object")
        }
    }

    /**
     * Remove XObject from the manager 
     * @param xObjectId object id to remove
     */
    removeObject(xObjectId:string) {
        const obj = this.xObjects[xObjectId]
        if(obj) {
            this.namesIndex[obj?.name] = null
            this.xObjects[xObjectId] = null;
        }
    }

    /**
     * Retrieves XObject instance
     * @param xObjectId XObject id 
     * @returns {XObject}
     */
    getObject(xObjectId:string):XObject {
        return this.xObjects[xObjectId]
    }


    /**
     * Retrieves XObject instance
     * @param objectName XObject name 
     * @returns {XObject}
     */
    getObjectByName(objectName:string):XObject | null {
        if(this.namesIndex[objectName]) {
            return this.getObject(this.namesIndex[objectName])
        } 
        return null
    }
}

/**
 * ObjectPack class for multi object registration
 */
export declare class XObjectPack {
    [k: string]: any
    /**
     * Get all registered object in this ObjectPack
     * @returns XObject dictionary
     */
    static getObjects(): object {
        return {
            "object": XObject
        }
    }
}

/**
 * Xpell Parser - Parse XML, HTML, Raw Text & Json to Xpell Command
 */

export declare class XParser {


    private static html2XMap = {
        elements:{
            div: "view",
            a: "link",
            b:"xhtml",
            h1: "xhtml",h2: "xhtml",h3: "xhtml",h4: "xhtml",h5: "xhtml",p: "xhtml",small:"xhtml",aside:"xhtml",span:"xhtml",
            table:"xhtml",th:"xhtml",td:"xhtml",tr:"xhtml",thead:"xhtml",tbody:"xhtml",
            ul:"xhtml",li:"xhtml",ol:"xhtml",
            canvas:"xhtml",
            img: "image",
        },
        attributes:{
            id:"_id"
        }
    }


    /**
     * Adds HTML-Xpell Mapping item
     * @param htmlElement HTML element to change from
     * @param xpellElement Xpell element to change to 
     */
    static addHtml2XpellMapItem(htmlElement:string,xpellElement:string) {
        XParser.html2XMap.elements[<"div">htmlElement] = xpellElement
    }


    /**
     * convert text command to Xpell json command
     * @param {string} txt 
     */
    static parse(txt:string,module?:string):XCommand {        
        const carr:string[] = txt.split(" ")
        let rv = new XCommand()
        if(module){

            rv["_module"]= module
            rv["_op"] =  carr[0]
        } else {
            rv["_module"]= carr[0]
            rv["_op"] =  carr[1]
        }
        rv["_params"] = {}

        if(carr.length>1){
            for (let i=2;i<carr.length;++i){
                const v = carr[i]
                const dl = v.indexOf(":")
                if(dl>-1){
                    const mc = v.split(":")
                    rv._params[mc[0]] = mc[1]
                }
                else
                    {
                    rv._params[i-1] = carr[i]
                }

            }
        }

        return rv
    }


    /**
     * Convert raw Xpell command (JSON) to XCommand
     * @param rawXpell JSON of Xpell command
     * @returns {XCommand}
     */
    static parseXpell(rawXpell:string):XCommand {
        let code = rawXpell.trim();

        let args:Array<string> = XParser.parseArguments(code);

        let cmd = new XCommand();
        cmd._module = args[0];
        cmd._op = args[1];
        cmd._params = {};


        // start params from index 2
        for (let i = 2; i < args.length; i++) {
            let paramStr:string = args[i];
            let delimiterIdx = paramStr.indexOf(':');
            let quotesIdx = paramStr.indexOf('"');
            let finalDelimiter = (quotesIdx < delimiterIdx) ? -1 : delimiterIdx;

            let paramName = (finalDelimiter === -1) ? i.toString() : paramStr.substring(0, delimiterIdx);
            let paramValue = XParser.fixArgumentValue(paramStr.substring(finalDelimiter + 1));

            cmd._params[paramName] = paramValue
        }


        return cmd;
    }


    /**
     * Parse CLI arguments
     * @param code arguments
     * @returns Array<string> 
     */
    static parseArguments(code:string):Array<string>  {
        let args:Array<string> = [];

        while (code.length) {
            let argIndex = XParser.getNextArgumentIndex(code);
            if (argIndex == -1) {
                // error
                console.error('error: ' + code);
                break;
            }
            else {
                args.push(code.substring(0, argIndex));

                let oldCode = code; // this variable is used to check if loop in endless
                code = code.substring(argIndex).trim();

                if (code.length == oldCode.length) {
                    // error - while loop is in endless
                    console.error('error: while loop is in endless - leftovers: ' + code);
                    break;
                }

            }
        }
        return args;
    }

    /**
     * Covent Xpell2 (XP2) Json to Xpell JSON
     * @param XP2Json Xpell 2 JSON
     * @returns 
     */
    static xpellify(XP2Json:{[k:string]:any}):any  {
        const tkeys = Object.keys(XP2Json)
        let outputXpell:any = {_type:tkeys[0]}
        outputXpell[_XC.NODES.children] = [] // child's xpells
        const firstObject = XP2Json[tkeys[0]]
        const foKeys = Object.keys(firstObject)

        foKeys.forEach(iKey => {
            if(iKey === "_attr") { Object.assign(outputXpell,firstObject[iKey]) }
            else {
                const lob:{[k:string]:any} ={}
                lob[iKey]=firstObject[iKey]

                outputXpell[_XC.NODES.children].push(XParser.xpellify(lob))
            }
        })
        return outputXpell
    }


    /**
     * Converts XML/HTML string to XCommand
     * @param xmlString XML string
     * @returns 
     */
    static xmlString2Xpell(xmlString:string):{}   {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString,"text/xml");
        if(xmlDoc.childNodes.length>0) {
            return XParser.xml2Xpell(xmlDoc.childNodes[0])
        } else return {}

    }

    /**
     * Converts XML/HTML Document to Xpell JSON
     * @param xmlNode XML Document Node
     * @param forceXhtml force Xpell XHTML for every unknown object
     * @returns {} Xpell JSON
     */
    static xml2Xpell  (xmlNode:any,forceXhtml?:boolean):{}  {
        //Conversation map for elements and attributes
        const cMap = XParser.html2XMap
        let scanChildren = true
        let outputXpell:{[k:string]:any} = {}
        outputXpell["_children"] = []
        const root_name = xmlNode.nodeName
        const _html_tag_attr = xmlNode.nodeName
        let forceXhtmlOnChildren = forceXhtml
        if(forceXhtml) { 
            outputXpell[_XC.NODES.type] = "xhtml"
            outputXpell["_html_ns"] = 'http://www.w3.org/2000/svg'
        }else {
            outputXpell["_type"] = (cMap.elements[<"div">root_name]) ?cMap.elements[<"div">root_name] : root_name  //html element to xpell object name
        }
        if(xmlNode.attributes) {
            for(let i=0;i<xmlNode.attributes.length;++i)  {
                const n = xmlNode.attributes[i]
                const attr_name = (cMap.attributes[<"id">n.name]) ?cMap.attributes[<"id">n.name] : n.name //replace html attribute to xpell attributes (id -> _id)
                outputXpell[attr_name] = n.value
            }
        }
        if (xmlNode?.firstChild?.nodeValue) {
            outputXpell["text"] = xmlNode?.firstChild.nodeValue.trim();
        }
        if(outputXpell[_XC.NODES.type] == "xhtml") {
            outputXpell["_html_tag"] = _html_tag_attr
        }
        else if(outputXpell[_XC.NODES.type] == "svg" ) {
            forceXhtmlOnChildren = true
            outputXpell["_html_ns"] = 'http://www.w3.org/2000/svg'
        }
        if(scanChildren &&  xmlNode?.childNodes.length>0) {
            for(let i=0;i<xmlNode.childNodes.length;++i)  {
                const node = (xmlNode.childNodes[i])
                if(!node.nodeName.startsWith("#")) {
                    outputXpell[_XC.NODES.children].push(XParser.xml2Xpell(node,forceXhtmlOnChildren))
                }
            }   
        }
        return outputXpell

    }

    static fixArgumentValue(arg:any) {
        let finalArg = "";
        let prevChar = "";
        for (var i = 0; i < arg.length; i++) {
            let char = arg.charAt(i);
            let addToFinal = true;

            if (char === '"' && prevChar !== "\\")
            addToFinal = false;

            if (addToFinal)
            finalArg += char;
            prevChar = char;
        }


        finalArg = finalArg.replace(/\\\"/g, '"');

        return finalArg;
    }


    /**
     * Get next argument from string
     * @param {String} str
     * @return {number} indexOf the end of the argument
     */
    static getNextArgumentIndex(str:string) {
        let idx = -1;
        let count = str.length;
        let zeroCount = count - 1;
        let inQuotes = false;
        let prevChar = "";
        for (let i = 0; i < count; i++) {
            let char = str.charAt(i);


            if (char === '"') {
                if (inQuotes) {
                    if (prevChar === '\\') {
                        // ignore
                    }
                    else {
                        // end of arguments
                        inQuotes = false;
                    }

                }
                else {
                    inQuotes = true;
                }
            }
            else if (char === ' ') {
                if (!inQuotes) {
                    // end of arguments
                    idx = i;
                    break;
                }
            }

            if (i === zeroCount) {
                idx = count;
                break;
            }


            prevChar = char;
            // argument is still processing
        }

        return idx;
    }
}

/**
 * Xpell Engine instance
 * @public Xpell Engine instance
 */
declare const Xpell = new XpellEngine();
export { Xpell }
export { Xpell as _x }

declare class XUtils {
    /**
     * create ignore list for parser to ignore spells words
     * @param list - list of reserved words (comma separated)
     */
    static createIgnoreList(list:string,reservedWords:{}) {
        let words = list.split(",");
        let outList:{[k:string]:string} = reservedWords;
        words.forEach(word => outList[word] = "");
        return outList;
    }


    /**
     * Generates GUID (Globally unique Identifier)
     * @returns {string} 
     */
    static guid() {
        let chars = '0123456789abcdef'.split('');
        let uuid:string[] = [], rnd = Math.random, r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4'; // version 4
        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | rnd() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
        }
        return uuid.join('');
    }

    /**
     * Merges XDataObject with Defaults object
     * @param data - data of the Xpell command
     * @param defaults - defaults object to merge with
     * @param force - add defaults values even if exists
     */
    static mergeDefaultsWithData(data:IXData, defaults:IXData,force?:boolean) {
        if (data) {
            if (!data["_id"]) {
                if(!data["id"]) {defaults["_id"] = XUtils.guid()}
                else {defaults["_id"] = data["id"]}
            }
            //selective assign

            let dkey = Object.keys(defaults);
            dkey.forEach(key => {
                if (!data.hasOwnProperty(key) || force) {
                    data[key] = <any>defaults[key];
                }
            })
        }
        else {
            data = <any>defaults
        }
    }


    /**
     * Encode string to Base-64 format
     * @param str string to encode
     * @returns {string}
     */
    static encode(str:string) {
        return btoa(encodeURIComponent(str));
    }

    /**
     * Decode Base64 String to text
     * @param str Base64 encoded string
     * @returns {string}
     */
    static decode( str:string ) {
        return decodeURIComponent(atob(str));
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    static getRandomInt(min:number, max:number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
export { XUtils }
export { XUtils as _xu }

export { }
