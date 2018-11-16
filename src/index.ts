import * as fs from 'fs'

type Key = string
type Value = any
type DB = { [key: string]: any }

export default class Cetriolino {
	private db: DB = {}

	constructor(filePath: string) {
		this.load(filePath)
	}

	get(key: Key): Value {
		return this.db[key]
	}

	set(key: Key, value: any): DB { 
		this.db[key] = value 
		return this.db
	}

	remove(key: Key): boolean {
		return delete this.db[key]
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
			const content = fs.readFileSync(filePath);
			this.db = JSON.parse(content.toString()) || {}
		} catch (e) {
			throw e
		}
	}
}
