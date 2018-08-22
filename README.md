![logo](https://cdn.rawgit.com/colxi/keypath-resolve/f6782ad8/logo.png)

# Keypath-resolve
[![NoDependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://github.com/colxi/midi-parser-js)
[![Browser](https://img.shields.io/badge/browser-compatible-blue.svg)](https://github.com/colxi/midi-parser-js)
[![Node](https://img.shields.io/badge/node-compatible-brightgreen.svg)](https://www.npmjs.com/package/midi-parser-js)

Tiny and flexible library ( 1Kb gziped, 3Kb minified), for **safe** (any form  of code evaluation is used internally) resolution and manipulation of Keypaths. Accepts keypaths formated using **dot and bracket notation** (or mixed). 

```javascript
  // simple resolution example
  Keypath.resolve( targeObj , 'myProperty.myNestedArray[3]["deepProperty"]' )
```



The library API provides methods for common keypath operations :
- Keypath.resolve()
- Keypath.create()
- Keypath.assign()
- Keypath.exist()
- Keypath.toArray()  
- Keypath.resolveContext()

## Features 
- No dependencies. Tiny and compact.
- Accepts Keypaths in dot notation and bracket notation (or mixed)
- Allows Global context resolutions (autodetects `window`/`global`)
- Safe : no `eval`, or `new Function()` code evaluation
- Extremely fast : >200,000 keypath resolutions/second (check ./tests/test.js)
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

- **`contextObject`** : (optional) Object to use as target object. If omited, global object is used instead.
- **`keyPath`**: String representing the keyPath to resolve.


```javascript
    const myObj = {
        myArray : [ 
            {
                myProp : 'foo'
            }
        ]
    }
    Keypath.resolve(myObj, 'myArray[0].myProp');   
    Keypath.resolve(myObj, 'myArray.0["myProp"]');   
    Keypath.resolve(myObj, "myArray['0'].myProp");   
    // all return 'foo'
```

### Keypath.create()
Creates the provided keypath structure, as a sequence of objects or arrays, according to the keypath string.

> **Keypath.create(  [contextObject ,]  keypath )**

- **`contextObject`** : (optional) Object to use as target object. If omited, global object is used instead.
- **`keyPath`**: String representing the keyPath to create.


```javascript
    const myObj = {}
    Keypath.create(myObj, 'myNested["myProp"]');   
    // creates the following object structure :
    // myObj.myNested.myProp , and sets the last property
    // value to undefined. Returns undefined
```

### Keypath.assign()
Resolves the provided keypath and assigns to it the provided value. If the keypath does not exist in the object triggers an error.

> **Keypath.assign(  [contextObject ,]  keypath, value )**

- **`contextObject`** : (optional) Object to use as target object. If omited, global object is used instead.
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

- **`contextObject`** : (optional) Object to use as target object. If omited, global object is used instead.
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

- **`contextObject`** : (optional) Object to use as target object. If omited, global object is used instead.
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
    // { context: {first: 'foo', second: 'bar'} , property:'first' }
```

### Keypath.toArray()
Returns an array with the keys of the provided keypath. Returns false if the keypath is not properly formated
> **Keypath.toArray( keypath )**

- **`keyPath`**: String representing the keyPath to create.

```javascript
    Keypath.exist('myProp[2].myNested["deepProp"]' );   
    // Returns ['myProp', '2','myNested','deepProp'] 
```

### Keypath.defaultContext()
Set the context to be used by default, when no context is provided to the API collection methods calls (by default: global/windowd).
> **Keypath.defaultContext( context )**

- **`context`**: Reference to the object to be used as default context.

```javascript
    myObj= {
        myProo:'foo'
    }
    Keypath.defaultContext( myObj );   
    Keypath.resolve('myProp');
    // Returns 'foo'
    Keypath.exist('myProp');
    // Returns true
    // (...)
```
---

## Global Context Resolutions

> When the context object is omited, in any of the API methods calls, the resolution will be performed searching in the global object (window/global).



```javascript
    global.myObj = {
        myArray : [ 
            {
                myProp : 'foo'
            }
        ]
    }
    Keypath.resolve('myObj.myArray[0].myProp');   
    // returns 'foo'
```

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
v2.1.4 Added Keypath.defaultContext method

v2.1.2 Added Keypath.toArray and improved documentation

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
