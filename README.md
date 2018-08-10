![logo](https://cdn.rawgit.com/colxi/keypath-resolve/f6782ad8/logo.png)

# keypath-resolve
[![NoDependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://github.com/colxi/midi-parser-js)
[![Browser](https://img.shields.io/badge/browser-compatible-blue.svg)](https://github.com/colxi/midi-parser-js)
[![Node](https://img.shields.io/badge/node-compatible-brightgreen.svg)](https://www.npmjs.com/package/midi-parser-js)

Tiny and flexible **Object KeyPath resolver** library (  1Kb gziped, 3Kb minified), to evaluate sting Object Keypaths (eg. `myObj.myProperty.myNestedArray[3]`), and return the resulting value.

It can return also a on-step-to-resolution Object (final property Object context), when required, to allow manual resolution




 
- Allows Keypaths in dot notation and braket notation 
- Special 'constructor' for private local context keypath resolutons
- Allows Global context resolutions (autodetects `window`/`global`)
- No dependencies
- Extremely fast : >100,000 keypath resolutions/second
- Wide platform support : 
  - Node 
  - Chrome
  - Firefox
  - Edge
  - Opera
  - Safari
  - Internet Explorer 9+

## Syntax

### resolveKeyPath()

Two syntax forms are allowed:
> **resolveKeypath( keyPath  [,contextObject] [,resolveValue] )**
> **resolveKeypath( keyPath  [,resolveValue] )**

- **`keyPath`**: String (or Array of strings) representing the keyPath to resolve.
- **`contextObject`** : (optional) Object to use as scope context. If omited, global scope is used instead. If this parameter is set  to true or false, will behave as `resolveValue` argument and global scope will be used as `scopeContext`. 
- **`resolveValue`** : (optional) Boolean.  If true, the function call will return the value of the resolution. If  set to false, will return the context of the resulting resolution, and the name of the property to  resolve. (default true)
 

**Returns** : Resolved value or resolution context (when `resolveValue=false`)

---
### Object.prototype.resolveKeyPath() 

> **Object.prtotype.resolveKeypath( keyPath  [,resolveValue] )**

Same syntax as resolveKeyPath(), except it doesn't need the `contexObject`parameter

---

### resolveLocalKeyPath "Constructor"

This Experimental "Constructor" returns a method, capable of resolving keypaths in the private local scope ( scpe where the `Eval` was executed )

> **let resolveLocalKeyPath = eval( resolveKeyPath.localScope );**


Same syntax as resolveKeyPath(), except it doesn't need the `contexObject`parameter (but can be provided).
>**Warning : the resulting keypath resolver function, uses `eval`intenally. Don't use it with untrusted keypaths  **


## Basic usage example 

Usage of resolveKeypath() and Object.prototype.resolveKeyPath()

```javascript
    // object to be usedin keypath resolution
	const myObj = {
		myNested : [ 'foo', 'bar']
    }
    resolveKeyPath('myNested[0]', myObj);   // returns 'foo'
 
    myObj.resolveKeyPath('myNested[1]');   // returns 'bar'

```
## Advanced usage examples 
Usage of resolveKeyPath() without value resolution (retrieve resolution context):

```javascript
    const myObj = {
        myNested : [ 'foo', 'bar']
    }
    resolveKeyPath( 'myNested[1]', myObj, false)  
    // returns { context: [ 'foo', 'bar'] , property: '1' }

```


Usage of resolveLocalKeyPath() :

```javascript
    // generate a private scooe ...
    (function(){
        const myObj = {
            myNested : [ 'foo', 'bar']
        }
    	// construct the local resolver
        let resolveLocalKeyPath = eval( resolveKeyPath.localScope );
	    resolveLocalKeyPath( 'myObj.myNested[0]' )   // returns 'foo'
    })();

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

**In browsers enviroment the global `window.resolveKeyPath()` method is created automatically. However in Node you must use `require` to retrieve the  `resolveKeyPath()`  exported method.**



## Licence 
GPL 3
