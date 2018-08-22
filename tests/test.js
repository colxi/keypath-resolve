/*
* @Author: colxi
* @Date:   2018-08-04 09:26:27
* @Last Modified by:   colxi
* @Last Modified time: 2018-08-22 00:00:25
*/
'use strict'
const Keypath= require ('../src/keypath-resolve.js');

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
    ],
    f: undefined
}


let _result = true;
let _counter = 0;

const result=function(r){
    _counter++;
    if(_result) _result = r;
    return r ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
}


console.clear()

//console.log.keypath( 'b.c.d' ))
//process.exit()


console.log(' ');
console.log(' ');
console.log('*** STARTING TEST ***');
console.log(' ');

console.log('TESTED OBJECTS');
console.log('--------------------------------------------------------------------------');
console.log(' ');
console.log('let a    = ',a);
console.log('global.b = ',b);
console.log(' ');
console.log('--------------------------------------------------------------------------');
console.log(' ');


console.log(' ');
console.log('TEST : RESOLVE');
console.log('--------------------------------------------------------------------------');
try{
    Keypath.resolve('a');
    console.log( "Keypath.resolve('a') ...",  result(false) );
}catch(e){ console.log( "Keypath.resolve('a') ...", result( true ), '(Non Resolvable)' ) };
try{
    Keypath.resolve('a.b.c') ;
    console.log( "Keypath.resolve('a.b.c') ...",  result(false) );
}catch(e){ console.log( "Keypath.resolve('a.b.c') ...", result( true ), '(Non Resolvable)' ) };
console.log( "Keypath.resolve(a, 'b.c') ..." , result( Keypath.resolve(a, 'b.c') === a.b.c ) );
console.log( "Keypath.resolve('b') ...", result( Keypath.resolve('b')  === b ) );
console.log( "Keypath.resolve('b.c.d') ..." ,  result( Keypath.resolve('b.c.d')  === b.c.d ) );
console.log( "Keypath.resolve(b, 'c.d') ..." , result( Keypath.resolve(b,'c.d')  === b.c.d ) );



console.log(' ');
console.log('TEST : CONTEXT RESOLVE');
console.log('--------------------------------------------------------------------------');
try{
    Keypath.resolveContext('a');
    console.log( "Keypath.resolveContext('a') ...",  result(false) );
}catch(e){ console.log( "Keypath.resolveContext('a') ...", result( true ), '(Non Resolvable)' ) };
try{
    Keypath.resolveContext('a.b.c');
    console.log( "Keypath.resolveContext('a.b.c') ...",  result(false) );
}catch(e){ console.log( "Keypath.resolveContext('a.b.c') ...", result( true ), '(Non Resolvable)' ) };
console.log( "Keypath.resolveContext(a, 'b.c') ..." , ( ()=>{
    let r = Keypath.resolveContext(a, 'b.c') ;
    return result( r.context === a.b && r.property==='c' );
})() );
console.log( "Keypath.resolveContext('b') ...",  ( ()=>{
    let r = Keypath.resolveContext('b');
    return result( r.context === global && r.property==='b' );
})() );
console.log( "Keypath.resolveContext('b.c.d') ..." ,   ( ()=>{
    let r =  Keypath.resolveContext('b.c.d');
    return result(r.context === b.c && r.property==='d' ) ;
})() );
console.log( "Keypath.resolveContext(b, 'c.d') ..." , ( ()=>{
    let r = Keypath.resolveContext(b, 'c.d');
    return result(  r.context === b.c && r.property==='d' ) ;
})() );



console.log(' ');
console.log('TEST : BRACKET NOTATION');
console.log('--------------------------------------------------------------------------');
console.log( "Keypath(a,'d.5.e')",  result( Keypath(a,'d.5.e') === a.d[5].e ) );
console.log( "Keypath(a,'d[5].e')", result( Keypath(a,'d[5].e') === a.d[5].e ) );
console.log( "Keypath(a,'d[5][\"e\"]')" , result( Keypath(a,'d[5]["e"]') === a.d[5].e ) );
console.log( "Keypath(q,'d[5][\'e\']')" , result( Keypath(a,'d[5][\'e\']') === a.d[5].e ) );
console.log( "Keypath(a,'d[\"5\"].e') ", result(Keypath(a,'d["5"].e') === a.d[5].e ) );

console.log(' ');

console.log('TEST : API');
console.log('--------------------------------------------------------------------------');
console.log( "Keypath.exist(a,'b')",  result( Keypath.exist(a,'b') === true ) );
console.log( "Keypath.exist(a,'h')",  result( Keypath.exist(a,'h') === false ) );

console.log( "Keypath.create(a,'h')",  result( Keypath.create(a,'h') === a.h ) );
console.log( "Keypath.create(a,'i.j.k')",  result( Keypath.create(a,'i.j.k') === a.i.j.k ) );
console.log( "Keypath.create('b.z.j.k')",  result( Keypath.create('b.z.j.k') === b.z.j.k ) );

console.log( "Keypath.assign(a, 'i.j.k', {} )",  result( Keypath.assign(a, 'i.j.k',{}) === a.i.j.k) );
console.log( "Keypath.assign(a, 'i.j.k.l', 123)",  result( Keypath.assign(a, 'i.j.k.l',123) === 123) );
console.log( "Keypath.assign(a, 'i', 123)",  result( Keypath.assign(a, 'i',123) === 123) );
console.log( "Keypath.assign('b.i', 123)",  result( Keypath.assign('b.i',123) === 123) );
console.log( "Keypath.assign(b,'f', 123)",  result( Keypath.assign(b,'f',123) === 123 ) );
console.log( "Keypath.assign('c', 123)",  result( Keypath.assign('c',123) === 123) );

console.log(' ');
console.log('TEST : RESOLVE (custom default context)');
console.log('--------------------------------------------------------------------------');
Keypath.defaultContext(a);
console.log( "Keypath.resolve('b.c') ..." , result( Keypath.resolve('b.c') === a.b.c ) );
console.log( "Keypath.resolve('b') ...", result( Keypath.resolve('b')  === a.b ) );
Keypath.defaultContext(b);
console.log( "Keypath.resolve('c.d') ..." ,  result( Keypath.resolve('c.d')  === b.c.d ) );
console.log( "Keypath.resolve('c') ..." , result( Keypath.resolve('c')  === b.c ) );
Keypath.defaultContext(global);

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
let loops = 7800;
console.log( "Executing " , loops*13, 'resolutions...');
let initTime = new Date();

for(let i =0; i<= loops;i++){
    Keypath('b');
    Keypath('b.c');
    Keypath(b, 'c');
    Keypath(b, 'c.d');
    Keypath(b, 'e.2');
    Keypath(b, 'e[3]');
    Keypath(a, 'b');
    Keypath(a,'b.c');
    Keypath(a, 'd');
    Keypath(a, 'd[1]');
    Keypath(a, 'd["2"]');
    Keypath(a, 'd[4]');
    Keypath(a, 'd.3');
}

console.log( " " );
console.log('--------------------------------------------------------------------------');
console.log( "ELAPSED TIME :", new Date() - initTime ,'ms' );
console.log('--------------------------------------------------------------------------');
