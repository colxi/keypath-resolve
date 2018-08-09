/*
* @Author: colxi  (colxi.kl@gmail.com)
* @Date:   2018-08-04 09:26:27
* @Last Modified by:   colxi
* @Last Modified time: 2018-08-09 13:15:53
* @Webpage: https://www.npmjs.com/package/keypath-resolve
*
* resolveKeyPath() :  Resolves a string representation of an object key path,
*                     using the provided object as a Context, the global scope
*                     context, or  pervorms a local resolution if constructed
*                     using he local resolver form.
*/


(function(){
    // Configuration
    let LOCAL_RESOLUTION = false;
    let ENVIROMENT = 'browser';

    // test if code is executed in Node envirment, and update
    // ENVIROMENT flag if the test results positive
    try {
        if( Object.prototype.toString.call(global.process) === '[object process]' ){
            ENVIROMENT = 'node';
        }
    }catch(e) { /* error */ }


    /**
     * keyPathToArray() : Converts a string keypath to an array of keys. It
     * accepts dot notation and brakets notation keypaths. Basic formating
     * validation is performed.
     *
     * @param       keyPath         String representing the keypath
     *
     * @return      Array|false
     */
    function keyPathToArray(keyPath){
        /**
         *
         * parseKey() : Proceses keys strings, and adds another validation layer
         * It can parse regular keys, keys starting with a dot, and keys represented
         * with the braket notation. Returns a clean key name, or false if
         * inon properly formated key name.
         *
         * @param       keyString        String  representing the key name
         *
         * @return                       Strung or false if fails
         *
         */
        const parseKey = function(keyString){
            if(keyString[0] === '.'){
                // if key starts with a dot, is a regular key.
                // Remove the dot
                // eg. ".myKey" -> "myKey"
                keyString=keyString.substring(1);
            }else if( keyString[0]==='['){
                // If key starts with a braket
                // remove brakets and trim the content
                // eg. "[ 'myKey' ]" -> " 'myKey' " -> "'myKey'"
                keyString = keyString.slice(1,-1).trim();

                // if key is not an Integer, must be quoted (single or double
                // quotes allowed), if is properly quoted, remove quotes.
                // Returnn false if not properly quoted
                if( keyString !== String(parseInt(keyString)) ){
                    let first= keyString[0];
                    let last = keyString.slice(-1);
                    if( (first==='"' && last=== '"') ||  (first==='\'' && last=== '\'') ){
                        // remove quotes
                        keyString= keyString.slice(1,-1);
                    }else return false; // unproperly quoted
                }
            }
            // validate : key string has length after the procesing.
            if( !keyString.length ) return false; // invalid length

            // done!
            return keyString;
        };


        // block if keypath is not a string
        if(typeof keyPath !== 'string') return false;

        const keyRules = /\.|\[(.*?)\]/g;
        const result = [];
        let startIndex = 0;
        let match;
        let keyString;

        // if keypath starts with a dot, return false
        if( keyPath[0] === '.' ) return false; // Unproperly formated keystring

        // iterate all keys resulting from the keypath
        do{
            match = keyRules.exec(keyPath);
            if (match){
                // parse and validate the keyString
                // if Unproperly formated keystring return false
                keyString = parseKey( keyPath.substring(startIndex, match.index) );
                if( keyString === false ) return false;

                // Ignore the blank key found when keypath starts with a braket
                if( match.index !==0 ) result.push( keyString );
                startIndex = match.index;
            }
        }while(match);

        // process last key
        // if Unproperly formated keystring return false
        keyString = parseKey( keyPath.substring(startIndex) );
        if( keyString === false ) return false;
        result.push( keyString );

        // done!
        return result;
    }


    /**
     *
     * resolveKeyPath() : Resolves Object and arrays keypaths. Keypaths can be
     * provided as strings or arrays of strings (and array index numbers).
     * This method will start the resolution in the provided scopeContext, or
     * if not present, in the global scope.
     * The parameter resolveValue (true by default) defines if the return will
     * be the resolved value, or an object containing the resolution context
     * and thenproperty name (for manual resolution)
     *
     * A special 'construction' can be performed, throught the expression
     * resolveLocalKeyPath = eval(resolveKeyPath.resolveKeyPath.localScope)
     * This 'constructor' will return a method capable of resolving keyPaths
     * from the local private scope where the evaluation is executed.
     *
     * @param  keyPath          Stringn or array of strings
     *
     * @param  scopeContext     Object tonuse as scope context. If omited, global
     *                          scopemis used instead. If this parameter is set
     *                          to true or false, will behave as 'resolveValue'
     *                          and scopeContext will be th global scope.
     *                          When executed as a local resolver, if omited,
     *                          scopeContext is the context whre the method
     *                          'construction' was performed.
     *
     * @param  resolveValue     If true, returns the value of the resolution. If
     *                          setmt false, returns the context of the resulting
     *                          resolution, and the name of the property to
     *                          resolve. (default true)
     *
     * @return                  Resolved value, or object, with resolved context
     *                          and property name. resolveValue will determine the
     *                          type of return
     *
     */
    const resolveKeyPath = function( keyPath , scopeContext , resolveValue){

        /*
         -----------------------------------------------------------------------
            Process arguments
         -----------------------------------------------------------------------
        */

        // default arguments values
        keyPath = keyPath || '';
        resolveValue = (resolveValue === false) ? false : true;


        // if scopeContext parameter is a boolean, behave as resolveValue
        // parameter, and set scopeContext parameter to undefined.
        if(arguments.length == 2 && (scopeContext===true || scopeContext===false)){
            resolveValue=scopeContext;
            scopeContext= undefined;
        }


        /*
         -----------------------------------------------------------------------
            Prepare keyPath and convert it into an array of keys
         -----------------------------------------------------------------------
        */

        // force keypath to be a string
        if ( Array.isArray( keyPath ) ) keyPath = keyPath.join('.');
        // trim the keypath
        keyPath = keyPath.trim();
        // convert into array of keys. Error if problems found
        let keys = keyPathToArray(keyPath);
        if(keys === false) throw new Error('resolveKeyPath() : Invalid keyPath format ("'+keyPath+'")');


        /*
         -----------------------------------------------------------------------
            Find context for keypath resolution
         -----------------------------------------------------------------------
        */

        let context;
        // if no scopeContext has been provided...
        if(typeof scopeContext === 'undefined' ){
            if( !LOCAL_RESOLUTION ){
                // not local resolution, look for the object in the global scope
                context = ( ENVIROMENT === 'node') ? global : window;
            }else{
                // if LOCAL_RESOLUTION, resolve in the local scope usnig eval
                try{ context = eval(keys[0]) }
                catch( e ){ throw new Error('resolveKeyPath() : Cannot resolve keyPath "' + keyPath + '"') }
                // remove the just used key (index 0)
                let _property = keys.shift();
                // if there are no more keys, no iteration is needed, return the result!
                if( keys.length === 0 ){
                    // resolve final value if required
                    if(resolveValue) return context;
                    else{
                        // context resolution requested...
                        // return context if if belongs to global onject...
                        let _context = ( ENVIROMENT === 'node') ? global : window;
                        if(_context[_property] === context) return { context : _context , property: _property };
                        // or trigger error if not (context unreachable)
                        else throw new Error('The context of the provided keyPath ("'+keyPath+'") is private, cannot be referenced. Returning context is limited to Object properties, and global vars.');
                    }
                }
            }
        }else{
            // if scopeContext is provided, use it
            context = scopeContext;
        }


        /*
         -----------------------------------------------------------------------
            Perform keyPath resolution
         -----------------------------------------------------------------------
        */

        // extract the last item in keyoath keys (will be necessary if resolveValue=false )
        let lastKey = ( keys.splice(-1,1) )[0];

        // if keypath conyains multiple keys...
        if( keys.length > 0 ){
            // iterate the keys to obtain each context
            for(let i = 0; i<keys.length;i++){
                if( !context.hasOwnProperty(  keys[i] ) ){
                    throw new Error('resolveKeyPath() : Cannot resolve keyPath "' + keyPath + '"');
                }
                // assign the currentContext
                context = context[ keys[i] ];
            }
            // iteration done!
        }
        // validate last key in keypath
        if( !context.hasOwnProperty(lastKey) ){
            throw new Error('resolveKeyPath() : Cannot resolve keyPath "' + keyPath + '"');
        }


        // done!
        // return value resolution or contxt (when requested)
        return (resolveValue) ? context[lastKey] : { context : context , property: lastKey};
    };



    /**
     *
     * Declare the local scope resolver code to use with Eval()
     *
     */
    let localResolverClosure='';
    localResolverClosure += '(function(){';
    localResolverClosure += '    const ENVIROMENT="' + ENVIROMENT + '";';
    localResolverClosure += '    const LOCAL_RESOLUTION = true;';
    localResolverClosure +=  keyPathToArray.toString();
    localResolverClosure += '    return ' + resolveKeyPath.toString();
    localResolverClosure += '})()';

    resolveKeyPath.localScope = localResolverClosure;



    /**
     *
     * Add keyPath resolver to Object prototype
     *
     */
    Object.prototype.resolveKeyPath= function(kp, resolveValue){
        return resolveKeyPath(kp, this, resolveValue );
    };



    // Export method if running in node module enviroment, or declare it in the
    // window global scooemif not
    if (ENVIROMENT === 'node' ) module.exports = resolveKeyPath;
    else window.resolveKeyPath = resolveKeyPath;

})();
