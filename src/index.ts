/**
 * @author Equinox <ratnesh.pkn@gmail.com>
 * @since 0.1.0
 */
import {promises as fs} from "fs"


export class FileStore {
    constructor(config?: {debug: any}) {
        // If debug mode is on, create a simple logger method
        log = buildLogger(config)
        try {
            fs.stat("cache")
        } catch (error) {
            const err = error as any
            if (err.code === "ENOENT") {
                fs.mkdir("cache")
            }
            log(error)
        }
    }
    async getItem(key: string) {
        log(key)
        const item = (await fs.readFile("cache/" + getHashCode(key))) || null

        return JSON.parse(item?.toString())
    }

    async setItem(key: string, value: any) {
        log(key)
        await fs.writeFile("cache/" + getHashCode(key), JSON.stringify(value))
        return value
    }

    async removeItem(key: string) {
        log(key)
        await fs.unlink("cache/" + getHashCode(key))
    }

    async clear() {
        await fs.rmdir("cache")
    }

    async length(): Promise<number> {
        const files = await fs.readdir("cache")
        log(files.length)
        return files.length
    }

    async iterate(fn: any) {
        const files = await fs.readdir("cache")
        const mapOfFiles = files.reduce(async (map: {[key: string]: any}, file) => {
            map[file] = await fs.readFile(file)
            return map
        }, {})

        return Promise.all(mapObject(mapOfFiles, fn))
    }
}

function isObject(value: any): boolean {
    const type = typeof value
    return value != null && (type === "object" || type === "function")
}

function mapObject(value: any, fn: any) {
    if (!isObject(value)) {
        return []
    }
    return Object.keys(value).map((key) => fn(value[key], key))
}

function urlencode(string: string): string {
    return string.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function getHashCode(key: string): string {
    return urlencode(Buffer.from(key).toString("base64")) + ".json"
}

function buildLogger(config?: {debug: any}): (...args: any[]) => void {
    return config?.debug ?
        typeof config?.debug === "function" ?
            config.debug :
            logToConsole :
        noop
}

const noop = () => {/* do nothing */}
const logToConsole = (...args: any[]) => console.log("[axios-cache-adapter-fs]", ...args)

let log: (...args: any[]) => void = noop


export default FileStore
