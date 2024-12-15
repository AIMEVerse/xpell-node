//import { performance } from "perf_hooks";


// declare class performance{ 
//     declare function now()
// }

import fs from "fs"
import path from "path"
import {XCommand, _xlog} from "./Xpell.js"
import * as crypto from 'crypto'
import { Buffer } from 'buffer';

interface IXData {
    [k:string]: string | null | [] | undefined | Function | boolean | number | {}
}

export class _XUtils {
    /**
     * create ignore list for parser to ignore spells words
     * @param list - list of reserved words (comma separated)
     */
    createIgnoreList(list:string,reservedWords:{}) {
        let words = list.split(",");
        let outList:{[k:string]:string} = reservedWords;
        words.forEach(word => outList[word] = "");
        return outList;
    }


    /**
     * Generates GUID (Globally unique Identifier)
     * @returns {string} 
     */
    guid() {
        // let chars = '0123456789abcdef'.split('');
        // let uuid:string[] = [], rnd = Math.random, r;
        // uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        // uuid[14] = '4'; // version 4
        // for (let i = 0; i < 36; i++) {
        //     if (!uuid[i]) {
        //         r = 0 | rnd() * 16;
        //         uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
        //     }
        // }
        // return uuid.join('');
        return crypto.randomUUID()
    }

    /**
     * Merges XDataObject with Defaults object
     * @param data - data of the Xpell command
     * @param defaults - defaults object to merge with
     * @param force - add defaults values even if exists
     */
    mergeDefaultsWithData(data:IXData, defaults:IXData,force?:boolean) {
        if (data) {
            if (!data.hasOwnProperty("_id")) {
                if(!data["id"]) {
                    const guid = XUtils.guid().toString()
                    // _xlog.debug(`XUtils.mergeDefaultsWithData: generated guid ${guid}`,defaults)
                    defaults["_id"] = guid
                }
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
    encode(str: string): string {
        return Buffer.from(encodeURIComponent(str)).toString('base64');
    }

    /**
     * Decode Base64 String to text
     * @param str Base64 encoded string
     * @returns {string}
     */
    decode(str: string): string {
        return decodeURIComponent(Buffer.from(str, 'base64').toString());
    }
    
    /**
         * Returns a random integer between min (inclusive) and max (inclusive).
         * The value is no lower than min (or the next integer greater than min
         * if min isn't an integer) and no greater than max (or the next integer
         * lower than max if max isn't an integer).
         * Using Math.round() will give you a non-uniform distribution!
         */
    getRandomInt(min:number, max:number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

     addIfNotNull (source:any, target:any, key:any[]) {
        for (const k of key) {
            if (source[k]) target[k] = source[k]
        }
        
    }


    mkDirByPathSync(targetDir:string,) {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir =  '.';
    
        return targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                fs.mkdirSync(curDir);
            } catch (err:any) {
                if (err.code === 'EEXIST') { // curDir already exists!
                    return curDir;
                }
    
                // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
                if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                    throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }
    
                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                    throw err; // Throw if it's just the last created dir.
                }
            }
    
            return curDir;
        }, initDir);
    }
    
    /**
     * Checks if folders exists and creates them if not (supports nested folders)
     * @param folders - folders to check (Array of strings)
     */
    checkFolders(folders:string[]) {
        folders.forEach(folder => XUtils.mkDirByPathSync(folder))
        //there are no folders to check :]]
    }

    /**
     * Extracts parameter from XCommand
     * @param xcmd - XCommand object 
     * @param paramName - The name of the parameter to extract
     * @param defaultValue - Default value if parameter is not found
     * @returns 
     */
     getParam (xcmd:XCommand, paramName:string,defaultValue:any = 0) {
        return (xcmd._params && xcmd._params[paramName]) ? xcmd._params[paramName] : defaultValue
    }

    /**
     * Add Last Slash
     * @description adds a last slash to the url if it doesn't have one
     * @param url 
     * @returns 
     */
    als(url:string) {
        return url.endsWith("/") ? url : url + "/"
    }

    /**
     * Clear Last Slash
     * @description shortens the url by removing the last slash
     * @param url 
     * @returns shortened url
     */
    cls(url:string) {
        return url.endsWith("/") ? url.slice(0,-1) : url
    }

    afs(url:string) {
        return url.startsWith("/") ? url : "/" + url
    }

    cfs(url:string) {
        return url.endsWith("/") ? url.slice(0,-1) : url
    }
}



/**
 * FPS Calculator
 * @class FPSCalc
 */
export class FPSCalc  {
    #accumulatedFPS:number = 0  //accumulated FPS
    #historyMovingAvg:number = 0//history moving average
    #lastTimestamp:number  = 0//timestamp



    /**
     * Calc FPS according to moving average formula
     * @returns Accumulated FPS value
     */
    calc() {
        
        const now:number = Date.now();
        const diff:number = now-this.#lastTimestamp
        this.#lastTimestamp = now
        
        this.#historyMovingAvg = .95 * this.#historyMovingAvg + .05 * diff //#stable FPS with moving avarage
        this.#accumulatedFPS = Math.floor((1 / this.#historyMovingAvg)*1000)
        return this.#accumulatedFPS
    }


    

}

export const XUtils = new _XUtils()
export default XUtils