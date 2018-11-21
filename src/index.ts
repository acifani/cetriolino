import * as fs from 'fs'

export type Key = string
export type Value = any
export type DB = { [key: string]: any }

export default class Cetriolino {
    private db: DB = {}
    private autoDump: boolean
    private filePath: string

    constructor(filePath: string, autoDump: boolean = false) {
        this.filePath = filePath
        this.autoDump = autoDump
        this.load(this.filePath)
    }

    get(key: Key): Value {
        return this.db[key]
    }

    random(): Value {
        const keys = this.keys()
        const randomIndex = (keys.length * Math.random()) << 0
        return this.get(keys[randomIndex])
    }

    set(key: Key, value: any): void {
        this.db[key] = value
        if (this.autoDump) {
            this.dump()
        }
    }

    remove(key: Key): void {
        delete this.db[key]
        if (this.autoDump) {
            this.dump()
        }
    }

    append(key: Key, value: Value): void {
        let existingValue = this.get(key)
        const newValue = existingValue ? (existingValue += value) : value
        this.set(key, newValue)
    }

    exists(key: Key): boolean {
        return this.db[key] !== undefined
    }

    lcreate(name: string): void {
        this.db[name] = []
        if (this.autoDump) {
            this.dump()
        }
    }

    lremove(name: string): void {
        delete this.db[name]
        if (this.autoDump) {
            this.dump()
        }
    }

    lpush(name: string, value: Value): number {
        this.throwIfNotArray(name)
        const result = this.db[name].push(value)
        if (this.autoDump) {
            this.dump()
        }
        return result
    }

    lpop(name: string): Value | undefined {
        this.throwIfNotArray(name)
        const value = this.db[name].pop()
        if (this.autoDump) {
            this.dump()
        }
        return value
    }

    lappend(name: string, position: number, value: Value): void {
        this.throwIfNotArray(name)
        let existingValue = this.db[name][position]
        const newValue = existingValue ? (existingValue += value) : value
        this.db[name][position] = newValue
        if (this.autoDump) {
            this.dump()
        }
    }

    lget(name: string, position: number): Value | undefined {
        this.throwIfNotArray(name)
        return this.db[name][position]
    }

    lgetAll(name: string): Value[] {
        this.throwIfNotArray(name)
        return this.db[name]
    }

    llength(name: string): number {
        this.throwIfNotArray(name)
        return this.db[name].length
    }

    keys(): string[] {
        return Object.keys(this.db)
    }

    clear(): void {
        this.db = {}
    }

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
