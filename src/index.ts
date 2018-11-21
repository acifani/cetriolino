import * as fs from 'fs'

export type Key = string
export type Value = any
export type DB = { [key: string]: any }

export default class Cetriolino {
    private db: DB = {}
    private autoDump: boolean
    private filePath: string

    /**
     * Creates a new Cetriolino instance.
     *
     * See [[load]] for more info regarding the file loading.
     *
     * @param filePath Path to the JSON file that will be used to persist the data.
     * @param autoDump If enabled, Cetriolino will automatically save data to the
     * specified file after every change.
     */
    constructor(filePath: string, autoDump: boolean = false) {
        this.filePath = filePath
        this.autoDump = autoDump
        this.load(this.filePath)
    }

    /**
     * @returns Value of the Key, if found, `undefined` otherwise.
     */
    get(key: Key): Value | undefined {
        return this.db[key]
    }

    /**
     * @returns Random value chosen from all of the available keys in the db.
     */
    random(): Value {
        const keys = this.keys()
        const randomIndex = (keys.length * Math.random()) << 0
        return this.get(keys[randomIndex])
    }

    /**
     * Creates a new values or updates an existing one.
     */
    set(key: Key, value: any): void {
        this.db[key] = value
        if (this.autoDump) {
            this.dump()
        }
    }

    /**
     * Deletes an existing key.
     */
    remove(key: Key): void {
        if (!this.exists(key)) {
            return
        }

        delete this.db[key]
        if (this.autoDump) {
            this.dump()
        }
    }

    /**
     * Appends additional data to an existing value.
     *
     * If the key does not exists, it is created with the provided value.
     */
    append(key: Key, value: Value): void {
        let existingValue = this.get(key)
        const newValue = existingValue ? (existingValue += value) : value
        this.set(key, newValue)
    }

    /**
     * @returns Whether or not a given key value equals `undefined`
     */
    exists(key: Key): boolean {
        return this.db[key] !== undefined
    }

    /**
     * Creates an empty list with the given name.
     */
    lcreate(name: string): void {
        this.db[name] = []
        if (this.autoDump) {
            this.dump()
        }
    }

    /**
     * Deletes an existing list with the given name.
     */
    lremove(name: string): void {
        if (!this.exists(name)) {
            return
        }

        delete this.db[name]
        if (this.autoDump) {
            this.dump()
        }
    }

    /**
     * Pushes additional value(s) to an existing list.
     *
     * @returns New length of the list.
     */
    lpush(name: string, value: Value | Value[]): number {
        this.throwIfNotArray(name)
        const result = this.db[name].push([...value] || [])
        if (this.autoDump) {
            this.dump()
        }
        return result
    }

    /**
     * Pops last element from the list.
     *
     * @returns The value of the element if the list has any, `
     * undefined` otherwise.
     */
    lpop(name: string): Value | undefined {
        this.throwIfNotArray(name)
        const value = this.db[name].pop()
        if (this.autoDump) {
            this.dump()
        }
        return value
    }

    /**
     * Appends additional data to an existing list value.
     *
     * If the element at the chosen position does not exist,
     * it is set with the given value.
     *
     * @param position Position within the list of the element to be appended.
     */
    lappend(name: string, position: number, value: Value): void {
        this.throwIfNotArray(name)
        let existingValue = this.db[name][position]
        const newValue = existingValue ? (existingValue += value) : value
        this.db[name][position] = newValue
        if (this.autoDump) {
            this.dump()
        }
    }

    /**
     * @returns Value of the element at the given position of the given list,
     * if it exists. `undefined` otherwise.
     */
    lget(name: string, position: number): Value | undefined {
        this.throwIfNotArray(name)
        return this.db[name][position]
    }

    /**
     * @returns Whole list, if it exists.
     */
    lgetAll(name: string): Value[] {
        this.throwIfNotArray(name)
        return this.db[name]
    }

    /**
     * @returns Length of the given list, if it exists.
     */
    llength(name: string): number {
        this.throwIfNotArray(name)
        return this.db[name].length
    }

    /**
     * @returns Array containing all the keys in the db.
     */
    keys(): string[] {
        return Object.keys(this.db)
    }

    /**
     * Deletes **everything** from the db.
     */
    clear(): void {
        this.db = {}
        if (this.autoDump) {
            this.dump()
        }
    }

    /**
     * Manually loads and parses a JSON file to use as db.
     *
     * Any JSON file can be used as a starting point.
     * If the given file does not exist, the db will be initialized empty.
     */
    load(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath)
            const json = content.toString()
            this.db = json ? JSON.parse(json) : {}
        } catch (e) {
            if (e.code === 'ENOENT') {
                this.db = {}
            } else {
                throw e
            }
        }
    }

    /**
     * Manually dumps the db to the file given in the [[constructor]]/[[load]] method.
     *
     * The file is serialized to JSON and the db content needs to be able to
     * be `JSON.stringify`-ed to be dumped without issues.
     *
     * More info on JSON.stringify`
     * [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
     */
    dump(): void {
        const db = JSON.stringify(this.db)
        fs.writeFile(this.filePath, db, err => {
            if (err) {
                throw err
            }
        })
    }

    private throwIfNotArray(name: string): void {
        const value = this.get(name)
        if (!Array.isArray(value)) {
            throw new Error('Key is not an Array')
        }
    }
}
