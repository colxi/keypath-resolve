/*
* @Author: colxi
* @Date:   2018-08-04 09:26:27
* @Last Modified by:   colxi
* @Last Modified time: 2018-08-09 16:03:42
*/
'use strict'
const resolveKeyPath = require ('./main.js')
const resolveLocalKeyPath = eval( resolveKeyPath.localScope );

let a={
    b:{
        c : 111
    },
    d: [
        1,
        2,
        3,
        4,
        5,
        {
            e : 333
        }
    ]
}

global.b={
    c:{
        d : 222
    },
    e: [
        1,
        2,
        3,
        4,
        5,
        {
            f : 444
        }
    ]
}


let _result = true;
let _counter = 0;

const result=function(r){
    _counter++;
    if(_result) _result = r;
    return r ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
}


console.clear()

//console.log(resolveKeyPath( 'b.c.d' ))
//process.exit()


console.log(' ')
console.log(' ')
console.log('*** STARTING TEST ***')
console.log(' ')

console.log('TESTED OBJECTS')
console.log('--------------------------------------------------------------------------')
console.log(' ')
console.log('let a    = ',a)
console.log('global.b = ',b)
console.log(' ')
console.log('--------------------------------------------------------------------------')

console.log(' ')
console.log(' ')


console.log('TEST : RESOLVER')
console.log('--------------------------------------------------------------------------')

try{
    resolveKeyPath('a');
    console.log( "resolveKeyPath('a') ...",  result(false) );
}catch(e){ console.log( "resolveKeyPath('a') ...", result( true ), '(Non Resolvable)' ) };
try{
    resolveKeyPath('a.b.c') ;
    console.log( "resolveKeyPath('a.b.c') ...",  result(false) );
}catch(e){ console.log( "resolveKeyPath('a.b.c') ...", result( true ), '(Non Resolvable)' ) };
console.log( "resolveKeyPath('b.c', a) ..." , result( resolveKeyPath('b.c', a) === a.b.c ) );

console.log( "resolveKeyPath('b') ...", result( resolveKeyPath('b')  === b ) );
console.log( "resolveKeyPath('b.c.d') ..." ,  result( resolveKeyPath('b.c.d')  === b.c.d ) );
console.log( "resolveKeyPath('c.d', b) ..." , result( resolveKeyPath('c.d', b)  === b.c.d ) );


console.log(' ')

try{
    resolveKeyPath('a', false);
    console.log( "resolveKeyPath('a', false) ...",  result(false) );
}catch(e){ console.log( "resolveKeyPath('a', false) ...", result( true ), '(Non Resolvable)' ) };
try{
    resolveKeyPath('a.b.c', false) ;
    console.log( "resolveKeyPath('a.b.c', false) ...",  result(false) );
}catch(e){ console.log( "resolveKeyPath('a.b.c', false) ...", result( true ), '(Non Resolvable)' ) };
console.log( "resolveKeyPath('b.c', a, false) ..." , ( ()=>{
    let r =resolveKeyPath('b.c', a, false) ;
    return result( r.context === a.b && r.property==='c' )
})() );

console.log( "resolveKeyPath('b', false) ...",  ( ()=>{
    let r = resolveKeyPath('b', false)
    return result( r.context === global && r.property==='b' );
})() )
console.log( "resolveKeyPath('b.c.d', false) ..." ,   ( ()=>{
    let r =  resolveKeyPath('b.c.d', false)
    return result(r.context === b.c && r.property==='d' ) ;
})() )
console.log( "resolveKeyPath('c.d', b , false) ..." , ( ()=>{
    let r = resolveKeyPath('c.d', b, false);
    return result(  r.context === b.c && r.property==='d' ) ;
})() )




console.log(' ')
console.log('TEST : LOCAL RESOLVER')
console.log('--------------------------------------------------------------------------')

console.log( "resolveLocalKeyPath('a') ...", result( resolveLocalKeyPath('a') === a ) );
console.log( "resolveLocalKeyPath('a.b.c') ..." , result( resolveLocalKeyPath('a.b.c') === a.b.c ) );
console.log( "resolveLocalKeyPath('b.c', a) ..." , result( resolveLocalKeyPath('b.c', a) === a.b.c ) );

console.log( "resolveLocalKeyPath('b') ...", result( resolveLocalKeyPath('b')  === b ) );
console.log( "resolveLocalKeyPath('b.c.d') ..." ,  result( resolveLocalKeyPath('b.c.d')  === b.c.d ) );
console.log( "resolveLocalKeyPath('c.d', b) ..." , result( resolveLocalKeyPath('c.d', b)  === b.c.d ) );

console.log(' ');

try{
    // should generate an error
    resolveLocalKeyPath('a', false)
    console.log( "resolveLocalKeyPath('a', false) ...", result(false));
}catch(e){ console.log( "resolveLocalKeyPath('a', false) ...", result(true), '(Non Resolvable)') }
console.log( "resolveLocalKeyPath('a.b.c', false) ..." , ( ()=>{
    let r = resolveLocalKeyPath( 'a.b.c', false );
    return  result(r.context === a.b && r.property === 'c');
})() );
console.log( "resolveLocalKeyPath('b.c', a, false) ..." , ( ()=>{
    let r = resolveLocalKeyPath( 'b.c', a, false );
    return  result(r.context === a.b && r.property === 'c');
})() );

console.log( "resolveLocalKeyPath('b', false) ..." , ( ()=>{
    let r = resolveLocalKeyPath( 'b', false );
    return  result(r.context === global  && r.property === 'b') ;
})() );
console.log( "resolveLocalKeyPath('b.c.d', false) ..." , ( ()=>{
    let r = resolveLocalKeyPath( 'b.c.d', false );
    return  result(r.context === b.c  && r.property === 'd') ;
})() );
console.log( "resolveLocalKeyPath('c.d', b, false) ..." , ( ()=>{
    let r = resolveLocalKeyPath( 'c.d', b, false );
    return  result(r.context === b.c  && r.property === 'd') ;
})() );




console.log(' ')
console.log('TEST : OBJECT.PROTOTYPE RESOLVER')
console.log('--------------------------------------------------------------------------')


console.log( "a.resolveKeyPath('b') ...", result( a.resolveKeyPath('b') === a.b ) );
console.log( "a.resolveKeyPath('b.c') ..." , result( a.resolveKeyPath('b.c') === a.b.c ) );

console.log( "b.resolveKeyPath('c') ...", result( b.resolveKeyPath('c')  === b.c ) );
console.log( "b.resolveKeyPath('c.d') ..." ,  result( b.resolveKeyPath('c.d')  === b.c.d ) );


console.log( " ");


console.log( "a.resolveKeyPath('b', false) ...", ( ()=>{
    let r = a.resolveKeyPath('b', false);
    return result( r.context=== a && r.property=== 'b' );
})() )
console.log( "a.resolveKeyPath('b.c', false) ..." , ( ()=>{
    let r = a.resolveKeyPath('b.c', false);
    return result( r.context=== a.b && r.property=== 'c' );
})() )

console.log( "b.resolveKeyPath('c', false) ...", ( ()=>{
    let r =  b.resolveKeyPath('c', false);
    return result( r.context=== b && r.property=== 'c' );
})() )

console.log( "b.resolveKeyPath('c.d', false) ..." ,  ( ()=>{
    let r = b.resolveKeyPath('c.d', false);
    return result( r.context=== b.c && r.property=== 'd' );
})() )




console.log(' ');
console.log('TEST : COMPLEX KEYPATHS');
console.log('--------------------------------------------------------------------------');


console.log( "a.resolveKeyPath('d.5.e')",  result( a.resolveKeyPath('d.5.e') === a.d[5].e ) );
console.log( "a.resolveKeyPath('d[5].e')", result( a.resolveKeyPath('d[5].e') === a.d[5].e ) );
console.log( "a.resolveKeyPath('d[5][\"e\"]')" , result( a.resolveKeyPath('d[5]["e"]') === a.d[5].e ) );
console.log( "a.resolveKeyPath('d[5][\'e\']')" , result( a.resolveKeyPath('d[5][\'e\']') === a.d[5].e ) );
console.log( "a.resolveKeyPath('d[\"5\"].e') ", result(a.resolveKeyPath('d["5"].e') === a.d[5].e ) );



console.log( " " );
console.log('--------------------------------------------------------------------------');
console.log( "TOTAL TESTS : ", _counter );
console.log( "TEST RESULT : ", result(_result) );
console.log('--------------------------------------------------------------------------');


console.log( " " );
console.log( " " );
console.log( " " );
console.log( "BONUS TEST : TIMMING" );
console.log('--------------------------------------------------------------------------');
let loops = 5000;
console.log( "Executing " , loops*15, 'resolutions...');
let initTime = new Date();

for(let i =0; i<= loops;i++){
    resolveKeyPath('b.c.d')
    resolveKeyPath('c.d', b)
    resolveKeyPath('b', false)
    resolveKeyPath('b.c.d', false)
    resolveKeyPath('c.d', b, false)
    resolveLocalKeyPath('a')
    resolveLocalKeyPath('a.b.c')
    resolveLocalKeyPath('b.c', a)
    resolveLocalKeyPath('b', false)
    resolveLocalKeyPath('b.c.d', false)
    resolveLocalKeyPath('c.d', b, false)
    a.resolveKeyPath('b')
    a.resolveKeyPath('b.c')
    b.resolveKeyPath('c', false)
    b.resolveKeyPath('c.d', false)
}

console.log( " " );
console.log('--------------------------------------------------------------------------')
console.log( "ELAPSED TIME :", new Date() - initTime ,'ms' );
console.log('--------------------------------------------------------------------------')
