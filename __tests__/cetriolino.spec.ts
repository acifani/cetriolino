import Cetriolino from '../src'

let _db: Cetriolino

const VALID_JSON = {
    one: 1,
    two: 2,
    three: { hello: 'world' },
    four: null,
}

enum FilePath {
    Exists = "0",
    DoesNotexist = "1",
    IsValidJSON = "2",
    IsNotValidJSON = "3",
}

jest.mock('fs', () => ({
    readFileSync: (filePath: FilePath) => {
        switch (filePath) {
            case FilePath.Exists:
                return ''
            case FilePath.IsNotValidJSON:
                return new Buffer('{i am not a valid json file,')
            case FilePath.IsValidJSON:
                return new Buffer(JSON.stringify(VALID_JSON))
        }
    } 
}))

beforeEach(() => {
    _db = new Cetriolino(FilePath.IsValidJSON)
})

describe('cetriolino', () => {
    describe('constructor', () => {
        it('should throw when file is not valid JSON', () => {
            const constructor = () => new Cetriolino(FilePath.IsNotValidJSON)
            expect(constructor).toThrowError()
        })

        it('should not throw when file exists', () => {
            const constructor = () => new Cetriolino(FilePath.Exists)
            expect(constructor).not.toThrowError()
        })

        it('should load file when file has valid JSON', () => {
            const target = new Cetriolino(FilePath.IsValidJSON)
            expect(target.keys()).not.toBeFalsy()
        })
    })

    describe('get', () => {
        it('should return undefined when key does not exist', () => {
            const output = _db.get('I_DO_NOT_EXIST')
            expect(output).toBeUndefined()
        })

        it('should return expected value when key exists', () => {
            const output = _db.get('one')
            expect(output).toBe(VALID_JSON.one)
        })

        it('should return an object when value is an object', () => {
            const output = _db.get('three')
            expect(output).toEqual(VALID_JSON.three)
        })

        it('should return null when value is null', () => {
            const output = _db.get('four')
            expect(output).toBeNull()
        })
    })

    describe('set', () => {
        it('should set value when key does not exist', () => {
            const inputValue = 'NEW_VALUE'
            const inputKey = 'NEW_KEY'
            _db.set(inputKey, inputValue)
            const output = _db.get(inputKey)
            expect(output).toBe(inputValue)
        })

        it('should set value when key already exists', () => {
            const input = 'UPDATED_VALUE'
            _db.set('one', input)
            const output = _db.get('one')
            expect(output).toBe(input)
        })

        it('should set object value when value is an object', () => {
            const inputValue = { a: 'a', b: 'b' }
            const inputKey = 'A_KEY'
            _db.set(inputKey, inputValue)
            const output = _db.get(inputKey)
            expect(output).toEqual(inputValue)
        })
    })

    describe('remove', () => {
        it('should remove value when key exists', () => {
            _db.remove('one')
            const output = _db.get('one');
            expect(output).toBeUndefined()
        })

        it('should not throw when key does not exist', () => {
            const action = () => _db.remove('DO_NOT_EXIST')
            expect(action).not.toThrowError()
        })
    })

    describe('exists', () => {
        it('should return true when key exists', () => {
            const output = _db.exists('one')
            expect(output).toBe(true)
        })

        it('should return false when key does not exist', () => {
            const output = _db.exists('DO_NOT_EXIST')
            expect(output).toBe(false)
        })
    })

    describe('keys', () => {
        it('should return an empty array when db is empty', () => {
            _db.clear()
            const output = _db.keys()
            expect(output).toEqual([])
        })

        it('should return all the keys when db is not empty', () => {
            const output = _db.keys()
            expect(output).toEqual(Object.keys(VALID_JSON))
        })
    })

    describe('clear', () => {
        it('should reset the db when db is not empty', () => {})
        it('should not throw when db is empty', () => {})
    })
})