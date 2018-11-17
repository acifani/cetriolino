import Cetriolino from '../src'

describe('cetriolino', () => {
    describe('constructor', () => {
        it('should throw when file does not exist', () => {})
        it('should throw when file is not valid JSON', () => {})
        it('should not throw when file exists', () => {})
        it('should load file when file has valid JSON', () => {})
    })

    describe('get', () => {
        it('should return undefined when key does not exist', () => {})
        it('should return expected value when key exists', () => {})
        it('should return an object when value is an object', () => {})
        it('should return null when value is null', () => {})
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