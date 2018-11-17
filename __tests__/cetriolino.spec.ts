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
        it('should set value when key does not exist', () => {})
        it('should set value when key already exists', () => {})
        it('should set object value when value is an object', () => {})
    })

    describe('remove', () => {
        it('should remove value when key exists', () => {})
        it('should not throw when key does not exist', () => {})
        it('should return true when key has been deleted', () => {})
        it('should return false when key has not been deleted', () => {})
    })

    describe('exists', () => {
        it('should return true when key exists', () => {})
        it('should return false when key does not exist', () => {})
    })

    describe('keys', () => {
        it('should return an empty array when db is empty', () => {})
        it('should return all the keys when db is not empty', () => {})
    })

    describe('clear', () => {
        it('should reset the db when db is not empty', () => {})
        it('should not throw when db is empty', () => {})
    })
})