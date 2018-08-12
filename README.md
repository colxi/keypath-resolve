![logo](https://cdn.rawgit.com/colxi/keypath-resolve/f6782ad8/logo.png)

# keypath-resolve
[![NoDependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://github.com/colxi/midi-parser-js)
[![Browser](https://img.shields.io/badge/browser-compatible-blue.svg)](https://github.com/colxi/midi-parser-js)
[![Node](https://img.shields.io/badge/node-compatible-brightgreen.svg)](https://www.npmjs.com/package/midi-parser-js)

Tiny and flexible library ( 1Kb gziped, 3Kb minified), for **safe**  evaluation (**no is eval used internally**) and resolution of Keypaths, formated using  dot and bracket notation (eg. `myObj.myProperty.myNestedArray[3].deepProperty`).


The API also provides methods for common keypath operations :
- Keypath.resolve()
- Keypath.create()
- Keypath.assign()
- Keypath.exist()
- Keypath.resolveContext()

## Features 
 
- Allows Keypaths in dot notation and bracket notation (and mixed)
- Allows Global context resolutions (autodetects `window`/`global`)
- No dependencies
- Extremely fast : >200,000 keypath resolutions/second
- Wide platform support : 
  - Node 
  - Chrome 49+
  - Firefox 47+
  - Edge
  - Opera
  - Safari 5.1+
  - Internet Explorer 11+

## API Methods

### Keypath.resolve()

Resolves the value of the provided keypath . If the keypath does not exist in the object triggers an error.
> **Keypath.resolve(  [contextObject ,]  keypath )**

- **`contextObject`** : (optional) Object to use as scope context. If omited, global scope is used instead.
- **`keyPath`**: String representing the keyPath to resolve.


```javascript
	const myObj = {
		myProp : [ 'foo', 'bar']
    }
    Keypath.resolve(myObj, 'myProp[0]');   
    // returns 'foo'
```

### Keypath.create()
Creates the provided keypath structure, as a sequence of objects or arrays, according to the keypath string.

> **Keypath.create(  [contextObject ,]  keypath )**

- **`contextObject`** : (optional) Object to use as scope context. If omited, global scope is used instead.
- **`keyPath`**: String representing the keyPath to create.


```javascript
	const myObj = {}
    Keypath.create(myObj, 'myNested.myProp');   
    // creates the following object structure :
    // myObj.myNested.myProp , and sets the last property
    // value to undefined. Returns undefined
```

### Keypath.assign()
Resolves the provided keypath and assignsto it the provided value. If the keypath does not exist in the object triggers an error.

> **Keypath.assign(  [contextObject ,]  keypath, value )**

- **`contextObject`** : (optional) Object to use as scope context. If omited, global scope is used instead.
- **`keyPath`**: String representing the keyPath to create.
- **`value`** : Value to set to the keypath resolution item

```javascript
	const myObj = {
    	myProp : undefined
    }
    Keypath.assign(myObj, 'myProp', 'foo');   
    // Assigns 'foo' to myProp and returns foo'
```


### Keypath.exist()
Tries to resolve the provided keypath, if succeeds returns true, if fails returns false. 
> **Keypath.exist(  [contextObject ,]  keypath )**

- **`contextObject`** : (optional) Object to use as scope context. If omited, global scope is used instead.
- **`keyPath`**: String representing the keyPath to create.

```javascript
	const myObj = {
    	myProp : [111,222,333,444]
    }
    Keypath.exist(myObj, 'myProp[2]' );   
    // Returns true
```


### Keypath.resolveContext()
Resolves the provided keypath and returns an object containing the context of the resolution and the name of the property to retrieve the value. If the keypath cannot be resolved, triggers an error.
> **Keypath.resolveContext(  [contextObject ,]  keypath )**

- **`contextObject`** : (optional) Object to use as scope context. If omited, global scope is used instead.
- **`keyPath`**: String representing the keyPath to create.

```javascript
	const myObj = {
    	myNested:  {
        	first: 'foo',
            second : 'bar'
        }
    }
    Keypath.resolveContext(myObj, 'myProp.myNested.first]' );   
    // Returns Object :
    // { context: {first: 'foo', second: 'bar'} , property:'foo' }
```


---

## Package distribution :

In browser enviroment you can include this library using the jsdelivr CDN ...

```
<script src='https://cdn.jsdelivr.net/gh/colxi/keypath-resolve@latest/src/keypath-resolve.min.js'></script>
```

Package can also be installed via:

```
$ npm install keypath-resolve --save
```

Available in Github :
```
 https://github.com/colxi/keypath-resolve
```

**In browsers enviroment the global `window.Keypath`  Object is created automatically.  In Node you must perform a regulr module import using  `require` to retrieve the  `Keypath`  exported Object.**

## Changelog
v2.0.0 Major changes 

- New API  
- New methods and features
- Removed local resolver (inapropiate use could lead to security issues )
- Removed Object.prototype.resolveKeyPath ( to avoid messing with prototypes of primitives )

v1.2.2 Improved speed and implemented bracket notation

v1.2.1 Minor bufgixes, improved documentation

v1.2.0 First public release

## Licence 
MIT
