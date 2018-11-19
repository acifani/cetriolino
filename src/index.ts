import * as fs from 'fs'

type Key = string
type Value = any
type DB = { [key: string]: any }

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

    set(key: Key, value: any): DB {
        this.db[key] = value
        if (this.autoDump) {
            this.dump()
        }
        return this.db
    }

    remove(key: Key): boolean {
        const removed = delete this.db[key]
        if (removed && this.autoDump) {
            this.dump()
        }
        return removed
    }

    exists(key: Key): boolean {
        return this.db[key] !== undefined
    }

    keys(): string[] {
        return Object.keys(this.db)
    }

    clear(): void {
        this.db = {}
    }

    load(filePath: string) {
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
}
