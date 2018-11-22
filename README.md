# cetriolino

[![Greenkeeper badge](https://badges.greenkeeper.io/acifani/cetriolino.svg)](https://greenkeeper.io/)

Simple key-value storage, with no runtime dependencies, 
written in TypeScript.

Heavily insipired by 
[pickleDB](https://github.com/patx/pickledb).

## Usage

```javascript
import Cetriolino from 'cetriolino'

const db = new Cetriolino('db.json')

db.set('one', 1)
db.get('one') // 1

db.lcreate('hey') // or: db.set('hey', [])
db.lpush('hey', ['oh', "let's", 'go']) // 3
db.get('hey') // [ 'oh', 'let\'s', 'go' ]

db.dump()
```

## Install

```console
$ npm install cetriolino
```

or

```console
$ yarn add cetriolino
```

## To-Do

- [ ] Add support for nested dictionaries
