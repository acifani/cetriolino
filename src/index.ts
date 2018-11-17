import * as fs from 'fs'

type Key = string
type Value = any
type DB = {
    [key: string]: any
}

export default class Cetriolino {
    private db: DB = {}
    private autoDump: boolean
    private filePath: string

    constructor(filePath: string, autoDump: boolean) {
        this.filePath = filePath
        this.load(filePath)
        this.autoDump = autoDump
    }

    get(key: Key): Value {
        return this.db[key]
    }

    set(key: Key, value: any): DB {
        this.db[key] = value
        if (this.autoDump) {
            this.dump(this.filePath)
        }
        return this.db
    }

    remove(key: Key): boolean {
        const removed = delete this.db[key]
        if (this.autoDump) {
            this.dump(this.filePath)
        }
        return removed
    }

    exists(key: Key): boolean {
        return this.db[key] !== undefined
    }

    keys(): Iterable<Key> {
        return this.db.keys()
    }

    clear(): void {
        this.db = {}
    }

    private load(filePath: string) {
        try {
            const content = fs.readFileSync(filePath)
            this.db = JSON.parse(content.toString()) || {}
        } catch (e) {
            if (e.code === "ENOENT") {
                this.db = {};
            }
            else {
                throw e
            }
        }
    }

    dump(filePath: string): void {
        fs.writeFile(filePath, JSON.stringify(this.db), function(err) {
            if (err) {
                return console.log(err)
            }
            console.log('The db was saved!')
        })
    }
}
