window.onerror = alert;
!function t(r,e,n){function i(f,u){if(!e[f]){if(!r[f]){var a="function"==typeof require&&require
if(!u&&a)return a(f,!0)
if(o)return o(f,!0)
var s=Error("Cannot find module '"+f+"'")
throw s.code="MODULE_NOT_FOUND",s}var h=e[f]={exports:{}}
r[f][0].call(h.exports,function(t){var e=r[f][1][t]
return i(e?e:t)},h,h.exports,t,r,e,n)}return e[f].exports}for(var o="function"==typeof require&&require,f=0;f<n.length;f++)i(n[f])
return i}({1:[function(t,r,e){"use strict"
function n(){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=0,e=t.length;e>r;++r)a[r]=t[r],s[t.charCodeAt(r)]=r
s["-".charCodeAt(0)]=62,s["_".charCodeAt(0)]=63}function i(t){var r,e,n,i,o,f,u=t.length
if(u%4>0)throw Error("Invalid string. Length must be a multiple of 4")
o="="===t[u-2]?2:"="===t[u-1]?1:0,f=new h(3*u/4-o),n=o>0?u-4:u
var a=0
for(r=0,e=0;n>r;r+=4,e+=3)i=s[t.charCodeAt(r)]<<18|s[t.charCodeAt(r+1)]<<12|s[t.charCodeAt(r+2)]<<6|s[t.charCodeAt(r+3)],f[a++]=i>>16&255,f[a++]=i>>8&255,f[a++]=255&i
return 2===o?(i=s[t.charCodeAt(r)]<<2|s[t.charCodeAt(r+1)]>>4,f[a++]=255&i):1===o&&(i=s[t.charCodeAt(r)]<<10|s[t.charCodeAt(r+1)]<<4|s[t.charCodeAt(r+2)]>>2,f[a++]=i>>8&255,f[a++]=255&i),f}function o(t){return a[t>>18&63]+a[t>>12&63]+a[t>>6&63]+a[63&t]}function f(t,r,e){for(var n,i=[],f=r;e>f;f+=3)n=(t[f]<<16)+(t[f+1]<<8)+t[f+2],i.push(o(n))
return i.join("")}function u(t){for(var r,e=t.length,n=e%3,i="",o=[],u=16383,s=0,h=e-n;h>s;s+=u)o.push(f(t,s,s+u>h?h:s+u))
return 1===n?(r=t[e-1],i+=a[r>>2],i+=a[r<<4&63],i+="=="):2===n&&(r=(t[e-2]<<8)+t[e-1],i+=a[r>>10],i+=a[r>>4&63],i+=a[r<<2&63],i+="="),o.push(i),o.join("")}e.toByteArray=i,e.fromByteArray=u
var a=[],s=[],h="undefined"!=typeof Uint8Array?Uint8Array:Array
n()},{}],2:[function(t,r,e){(function(r){"use strict"
function n(){try{var t=new Uint8Array(1)
return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(r){return!1}}function i(){return f.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function o(t,r){if(i()<r)throw new RangeError("Invalid typed array length")
return f.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r),t.__proto__=f.prototype):(null===t&&(t=new f(r)),t.length=r),t}function f(t,r,e){if(!(f.TYPED_ARRAY_SUPPORT||this instanceof f))return new f(t,r,e)
if("number"==typeof t){if("string"==typeof r)throw Error("If encoding is specified then the first argument must be a string")
return h(this,t)}return u(this,t,r,e)}function u(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number')
return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?g(t,r,e,n):"string"==typeof r?c(t,r,e):p(t,r)}function a(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number')}function s(t,r,e,n){return a(r),0>=r?o(t,r):void 0!==e?"string"==typeof n?o(t,r).fill(e,n):o(t,r).fill(e):o(t,r)}function h(t,r){if(a(r),t=o(t,0>r?0:0|y(r)),!f.TYPED_ARRAY_SUPPORT)for(var e=0;r>e;++e)t[e]=0
return t}function c(t,r,e){if(("string"!=typeof e||""===e)&&(e="utf8"),!f.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding')
var n=0|w(r,e)
return t=o(t,n),t.write(r,e),t}function l(t,r){var e=0|y(r.length)
t=o(t,e)
for(var n=0;e>n;n+=1)t[n]=255&r[n]
return t}function g(t,r,e,n){if(r.byteLength,0>e||r.byteLength<e)throw new RangeError("'offset' is out of bounds")
if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds")
return r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n),f.TYPED_ARRAY_SUPPORT?(t=r,t.__proto__=f.prototype):t=l(t,r),t}function p(t,r){if(f.isBuffer(r)){var e=0|y(r.length)
return t=o(t,e),0===t.length?t:(r.copy(t,0,0,e),t)}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||H(r.length)?o(t,0):l(t,r)
if("Buffer"===r.type&&W(r.data))return l(t,r.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function y(t){if(t>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes")
return 0|t}function b(t){return+t!=t&&(t=0),f.alloc(+t)}function w(t,r){if(f.isBuffer(t))return t.length
if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength
"string"!=typeof t&&(t=""+t)
var e=t.length
if(0===e)return 0
for(var n=!1;;)switch(r){case"ascii":case"binary":case"raw":case"raws":return e
case"utf8":case"utf-8":case void 0:return q(t).length
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e
case"hex":return e>>>1
case"base64":return Z(t).length
default:if(n)return q(t).length
r=(""+r).toLowerCase(),n=!0}}function d(t,r,e){var n=!1
if((void 0===r||0>r)&&(r=0),r>this.length)return""
if((void 0===e||e>this.length)&&(e=this.length),0>=e)return""
if(e>>>=0,r>>>=0,r>=e)return""
for(t||(t="utf8");;)switch(t){case"hex":return Y(this,r,e)
case"utf8":case"utf-8":return T(this,r,e)
case"ascii":return I(this,r,e)
case"binary":return S(this,r,e)
case"base64":return U(this,r,e)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return C(this,r,e)
default:if(n)throw new TypeError("Unknown encoding: "+t)
t=(t+"").toLowerCase(),n=!0}}function v(t,r,e){var n=t[r]
t[r]=t[e],t[e]=n}function E(t,r,e,n){function i(t,r){return 1===o?t[r]:t.readUInt16BE(r*o)}var o=1,f=t.length,u=r.length
if(void 0!==n&&(n=(n+"").toLowerCase(),"ucs2"===n||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1
o=2,f/=2,u/=2,e/=2}for(var a=-1,s=e;f>s;++s)if(i(t,s)===i(r,-1===a?0:s-a)){if(-1===a&&(a=s),s-a+1===u)return a*o}else-1!==a&&(s-=s-a),a=-1
return-1}function A(t,r,e,n){e=+e||0
var i=t.length-e
n?(n=+n,n>i&&(n=i)):n=i
var o=r.length
if(o%2!==0)throw Error("Invalid hex string")
n>o/2&&(n=o/2)
for(var f=0;n>f;++f){var u=parseInt(r.substr(2*f,2),16)
if(isNaN(u))return f
t[e+f]=u}return f}function B(t,r,e,n){return G(q(r,t.length-e),t,e,n)}function m(t,r,e,n){return G(X(r),t,e,n)}function O(t,r,e,n){return m(t,r,e,n)}function _(t,r,e,n){return G(Z(r),t,e,n)}function R(t,r,e,n){return G(J(r,t.length-e),t,e,n)}function U(t,r,e){return 0===r&&e===t.length?K.fromByteArray(t):K.fromByteArray(t.slice(r,e))}function T(t,r,e){e=Math.min(t.length,e)
for(var n=[],i=r;e>i;){var o=t[i],f=null,u=o>239?4:o>223?3:o>191?2:1
if(e>=i+u){var a,s,h,c
switch(u){case 1:128>o&&(f=o)
break
case 2:a=t[i+1],128===(192&a)&&(c=(31&o)<<6|63&a,c>127&&(f=c))
break
case 3:a=t[i+1],s=t[i+2],128===(192&a)&&128===(192&s)&&(c=(15&o)<<12|(63&a)<<6|63&s,c>2047&&(55296>c||c>57343)&&(f=c))
break
case 4:a=t[i+1],s=t[i+2],h=t[i+3],128===(192&a)&&128===(192&s)&&128===(192&h)&&(c=(15&o)<<18|(63&a)<<12|(63&s)<<6|63&h,c>65535&&1114112>c&&(f=c))}}null===f?(f=65533,u=1):f>65535&&(f-=65536,n.push(f>>>10&1023|55296),f=56320|1023&f),n.push(f),i+=u}return P(n)}function P(t){var r=t.length
if($>=r)return String.fromCharCode.apply(String,t)
for(var e="",n=0;r>n;)e+=String.fromCharCode.apply(String,t.slice(n,n+=$))
return e}function I(t,r,e){var n=""
e=Math.min(t.length,e)
for(var i=r;e>i;++i)n+=String.fromCharCode(127&t[i])
return n}function S(t,r,e){var n=""
e=Math.min(t.length,e)
for(var i=r;e>i;++i)n+=String.fromCharCode(t[i])
return n}function Y(t,r,e){var n=t.length;(!r||0>r)&&(r=0),(!e||0>e||e>n)&&(e=n)
for(var i="",o=r;e>o;++o)i+=z(t[o])
return i}function C(t,r,e){for(var n=t.slice(r,e),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1])
return i}function L(t,r,e){if(t%1!==0||0>t)throw new RangeError("offset is not uint")
if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function x(t,r,e,n,i,o){if(!f.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance')
if(r>i||o>r)throw new RangeError('"value" argument is out of bounds')
if(e+n>t.length)throw new RangeError("Index out of range")}function M(t,r,e,n){0>r&&(r=65535+r+1)
for(var i=0,o=Math.min(t.length-e,2);o>i;++i)t[e+i]=(r&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function D(t,r,e,n){0>r&&(r=4294967295+r+1)
for(var i=0,o=Math.min(t.length-e,4);o>i;++i)t[e+i]=r>>>8*(n?i:3-i)&255}function k(t,r,e,n,i,o){if(e+n>t.length)throw new RangeError("Index out of range")
if(0>e)throw new RangeError("Index out of range")}function j(t,r,e,n,i){return i||k(t,r,e,4,3.4028234663852886e38,-3.4028234663852886e38),Q.write(t,r,e,n,23,4),e+4}function V(t,r,e,n,i){return i||k(t,r,e,8,1.7976931348623157e308,-1.7976931348623157e308),Q.write(t,r,e,n,52,8),e+8}function N(t){if(t=F(t).replace(tt,""),t.length<2)return""
for(;t.length%4!==0;)t+="="
return t}function F(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function z(t){return 16>t?"0"+t.toString(16):t.toString(16)}function q(t,r){r=r||1/0
for(var e,n=t.length,i=null,o=[],f=0;n>f;++f){if(e=t.charCodeAt(f),e>55295&&57344>e){if(!i){if(e>56319){(r-=3)>-1&&o.push(239,191,189)
continue}if(f+1===n){(r-=3)>-1&&o.push(239,191,189)
continue}i=e
continue}if(56320>e){(r-=3)>-1&&o.push(239,191,189),i=e
continue}e=(i-55296<<10|e-56320)+65536}else i&&(r-=3)>-1&&o.push(239,191,189)
if(i=null,128>e){if((r-=1)<0)break
o.push(e)}else if(2048>e){if((r-=2)<0)break
o.push(e>>6|192,63&e|128)}else if(65536>e){if((r-=3)<0)break
o.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(1114112>e))throw Error("Invalid code point")
if((r-=4)<0)break
o.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return o}function X(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e))
return r}function J(t,r){for(var e,n,i,o=[],f=0;f<t.length&&!((r-=2)<0);++f)e=t.charCodeAt(f),n=e>>8,i=e%256,o.push(i),o.push(n)
return o}function Z(t){return K.toByteArray(N(t))}function G(t,r,e,n){for(var i=0;n>i&&!(i+e>=r.length||i>=t.length);++i)r[i+e]=t[i]
return i}function H(t){return t!==t}var K=t("base64-js"),Q=t("ieee754"),W=t("isarray")
e.Buffer=f,e.SlowBuffer=b,e.INSPECT_MAX_BYTES=50,f.TYPED_ARRAY_SUPPORT=void 0!==r.TYPED_ARRAY_SUPPORT?r.TYPED_ARRAY_SUPPORT:n(),e.kMaxLength=i(),f.poolSize=8192,f._augment=function(t){return t.__proto__=f.prototype,t},f.from=function(t,r,e){return u(null,t,r,e)},f.TYPED_ARRAY_SUPPORT&&(f.prototype.__proto__=Uint8Array.prototype,f.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&f[Symbol.species]===f&&Object.defineProperty(f,Symbol.species,{value:null,configurable:!0})),f.alloc=function(t,r,e){return s(null,t,r,e)},f.allocUnsafe=function(t){return h(null,t)},f.allocUnsafeSlow=function(t){return h(null,t)},f.isBuffer=function(t){return!(null==t||!t._isBuffer)},f.compare=function(t,r){if(!f.isBuffer(t)||!f.isBuffer(r))throw new TypeError("Arguments must be Buffers")
if(t===r)return 0
for(var e=t.length,n=r.length,i=0,o=Math.min(e,n);o>i;++i)if(t[i]!==r[i]){e=t[i],n=r[i]
break}return n>e?-1:e>n?1:0},f.isEncoding=function(t){switch((t+"").toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0
default:return!1}},f.concat=function(t,r){if(!W(t))throw new TypeError('"list" argument must be an Array of Buffers')
if(0===t.length)return f.alloc(0)
var e
if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length
var n=f.allocUnsafe(r),i=0
for(e=0;e<t.length;++e){var o=t[e]
if(!f.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers')
o.copy(n,i),i+=o.length}return n},f.byteLength=w,f.prototype._isBuffer=!0,f.prototype.swap16=function(){var t=this.length
if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits")
for(var r=0;t>r;r+=2)v(this,r,r+1)
return this},f.prototype.swap32=function(){var t=this.length
if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits")
for(var r=0;t>r;r+=4)v(this,r,r+3),v(this,r+1,r+2)
return this},f.prototype.toString=function(){var t=0|this.length
return 0===t?"":0===arguments.length?T(this,0,t):d.apply(this,arguments)},f.prototype.equals=function(t){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer")
return this===t?!0:0===f.compare(this,t)},f.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES
return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},f.prototype.compare=function(t,r,e,n,i){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer")
if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),0>r||e>t.length||0>n||i>this.length)throw new RangeError("out of range index")
if(n>=i&&r>=e)return 0
if(n>=i)return-1
if(r>=e)return 1
if(r>>>=0,e>>>=0,n>>>=0,i>>>=0,this===t)return 0
for(var o=i-n,u=e-r,a=Math.min(o,u),s=this.slice(n,i),h=t.slice(r,e),c=0;a>c;++c)if(s[c]!==h[c]){o=s[c],u=h[c]
break}return u>o?-1:o>u?1:0},f.prototype.indexOf=function(t,r,e){if("string"==typeof r?(e=r,r=0):r>2147483647?r=2147483647:-2147483648>r&&(r=-2147483648),r>>=0,0===this.length)return-1
if(r>=this.length)return-1
if(0>r&&(r=Math.max(this.length+r,0)),"string"==typeof t&&(t=f.from(t,e)),f.isBuffer(t))return 0===t.length?-1:E(this,t,r,e)
if("number"==typeof t)return f.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,t,r):E(this,[t],r,e)
throw new TypeError("val must be string, number or Buffer")},f.prototype.includes=function(t,r,e){return-1!==this.indexOf(t,r,e)},f.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0
else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0
else{if(!isFinite(r))throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")
r=0|r,isFinite(e)?(e=0|e,void 0===n&&(n="utf8")):(n=e,e=void 0)}var i=this.length-r
if((void 0===e||e>i)&&(e=i),t.length>0&&(0>e||0>r)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds")
n||(n="utf8")
for(var o=!1;;)switch(n){case"hex":return A(this,t,r,e)
case"utf8":case"utf-8":return B(this,t,r,e)
case"ascii":return m(this,t,r,e)
case"binary":return O(this,t,r,e)
case"base64":return _(this,t,r,e)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,t,r,e)
default:if(o)throw new TypeError("Unknown encoding: "+n)
n=(""+n).toLowerCase(),o=!0}},f.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}}
var $=4096
f.prototype.slice=function(t,r){var e=this.length
t=~~t,r=void 0===r?e:~~r,0>t?(t+=e,0>t&&(t=0)):t>e&&(t=e),0>r?(r+=e,0>r&&(r=0)):r>e&&(r=e),t>r&&(r=t)
var n
if(f.TYPED_ARRAY_SUPPORT)n=this.subarray(t,r),n.__proto__=f.prototype
else{var i=r-t
n=new f(i,void 0)
for(var o=0;i>o;++o)n[o]=this[o+t]}return n},f.prototype.readUIntLE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i
return n},f.prototype.readUIntBE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=this[t+--r],i=1;r>0&&(i*=256);)n+=this[t+--r]*i
return n},f.prototype.readUInt8=function(t,r){return r||L(t,1,this.length),this[t]},f.prototype.readUInt16LE=function(t,r){return r||L(t,2,this.length),this[t]|this[t+1]<<8},f.prototype.readUInt16BE=function(t,r){return r||L(t,2,this.length),this[t]<<8|this[t+1]},f.prototype.readUInt32LE=function(t,r){return r||L(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},f.prototype.readUInt32BE=function(t,r){return r||L(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},f.prototype.readIntLE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i
return i*=128,n>=i&&(n-=Math.pow(2,8*r)),n},f.prototype.readIntBE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=r,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i
return i*=128,o>=i&&(o-=Math.pow(2,8*r)),o},f.prototype.readInt8=function(t,r){return r||L(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},f.prototype.readInt16LE=function(t,r){r||L(t,2,this.length)
var e=this[t]|this[t+1]<<8
return 32768&e?4294901760|e:e},f.prototype.readInt16BE=function(t,r){r||L(t,2,this.length)
var e=this[t+1]|this[t]<<8
return 32768&e?4294901760|e:e},f.prototype.readInt32LE=function(t,r){return r||L(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},f.prototype.readInt32BE=function(t,r){return r||L(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},f.prototype.readFloatLE=function(t,r){return r||L(t,4,this.length),Q.read(this,t,!0,23,4)},f.prototype.readFloatBE=function(t,r){return r||L(t,4,this.length),Q.read(this,t,!1,23,4)},f.prototype.readDoubleLE=function(t,r){return r||L(t,8,this.length),Q.read(this,t,!0,52,8)},f.prototype.readDoubleBE=function(t,r){return r||L(t,8,this.length),Q.read(this,t,!1,52,8)},f.prototype.writeUIntLE=function(t,r,e,n){if(t=+t,r=0|r,e=0|e,!n){var i=Math.pow(2,8*e)-1
x(this,t,r,e,i,0)}var o=1,f=0
for(this[r]=255&t;++f<e&&(o*=256);)this[r+f]=t/o&255
return r+e},f.prototype.writeUIntBE=function(t,r,e,n){if(t=+t,r=0|r,e=0|e,!n){var i=Math.pow(2,8*e)-1
x(this,t,r,e,i,0)}var o=e-1,f=1
for(this[r+o]=255&t;--o>=0&&(f*=256);)this[r+o]=t/f&255
return r+e},f.prototype.writeUInt8=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,1,255,0),f.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},f.prototype.writeUInt16LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,65535,0),f.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):M(this,t,r,!0),r+2},f.prototype.writeUInt16BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,65535,0),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):M(this,t,r,!1),r+2},f.prototype.writeUInt32LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,4294967295,0),f.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):D(this,t,r,!0),r+4},f.prototype.writeUInt32BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,4294967295,0),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):D(this,t,r,!1),r+4},f.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r=0|r,!n){var i=Math.pow(2,8*e-1)
x(this,t,r,e,i-1,-i)}var o=0,f=1,u=0
for(this[r]=255&t;++o<e&&(f*=256);)0>t&&0===u&&0!==this[r+o-1]&&(u=1),this[r+o]=(t/f>>0)-u&255
return r+e},f.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r=0|r,!n){var i=Math.pow(2,8*e-1)
x(this,t,r,e,i-1,-i)}var o=e-1,f=1,u=0
for(this[r+o]=255&t;--o>=0&&(f*=256);)0>t&&0===u&&0!==this[r+o+1]&&(u=1),this[r+o]=(t/f>>0)-u&255
return r+e},f.prototype.writeInt8=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,1,127,-128),f.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),0>t&&(t=255+t+1),this[r]=255&t,r+1},f.prototype.writeInt16LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,32767,-32768),f.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):M(this,t,r,!0),r+2},f.prototype.writeInt16BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,32767,-32768),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):M(this,t,r,!1),r+2},f.prototype.writeInt32LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,2147483647,-2147483648),f.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):D(this,t,r,!0),r+4},f.prototype.writeInt32BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,2147483647,-2147483648),0>t&&(t=4294967295+t+1),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):D(this,t,r,!1),r+4},f.prototype.writeFloatLE=function(t,r,e){return j(this,t,r,!0,e)},f.prototype.writeFloatBE=function(t,r,e){return j(this,t,r,!1,e)},f.prototype.writeDoubleLE=function(t,r,e){return V(this,t,r,!0,e)},f.prototype.writeDoubleBE=function(t,r,e){return V(this,t,r,!1,e)},f.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&e>n&&(n=e),n===e)return 0
if(0===t.length||0===this.length)return 0
if(0>r)throw new RangeError("targetStart out of bounds")
if(0>e||e>=this.length)throw new RangeError("sourceStart out of bounds")
if(0>n)throw new RangeError("sourceEnd out of bounds")
n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e)
var i,o=n-e
if(this===t&&r>e&&n>r)for(i=o-1;i>=0;--i)t[i+r]=this[i+e]
else if(1e3>o||!f.TYPED_ARRAY_SUPPORT)for(i=0;o>i;++i)t[i+r]=this[i+e]
else Uint8Array.prototype.set.call(t,this.subarray(e,e+o),r)
return o},f.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var i=t.charCodeAt(0)
256>i&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string")
if("string"==typeof n&&!f.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t=255&t)
if(0>r||this.length<r||this.length<e)throw new RangeError("Out of range index")
if(r>=e)return this
r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0)
var o
if("number"==typeof t)for(o=r;e>o;++o)this[o]=t
else{var u=f.isBuffer(t)?t:q(""+new f(t,n)),a=u.length
for(o=0;e-r>o;++o)this[o+r]=u[o%a]}return this}
var tt=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":1,ieee754:3,isarray:4}],3:[function(t,r,e){e.read=function(t,r,e,n,i){var o,f,u=8*i-n-1,a=(1<<u)-1,s=a>>1,h=-7,c=e?i-1:0,l=e?-1:1,g=t[r+c]
for(c+=l,o=g&(1<<-h)-1,g>>=-h,h+=u;h>0;o=256*o+t[r+c],c+=l,h-=8);for(f=o&(1<<-h)-1,o>>=-h,h+=n;h>0;f=256*f+t[r+c],c+=l,h-=8);if(0===o)o=1-s
else{if(o===a)return f?NaN:(g?-1:1)*(1/0)
f+=Math.pow(2,n),o-=s}return(g?-1:1)*f*Math.pow(2,o-n)},e.write=function(t,r,e,n,i,o){var f,u,a,s=8*o-i-1,h=(1<<s)-1,c=h>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,g=n?0:o-1,p=n?1:-1,y=0>r||0===r&&0>1/r?1:0
for(r=Math.abs(r),isNaN(r)||r===1/0?(u=isNaN(r)?1:0,f=h):(f=Math.floor(Math.log(r)/Math.LN2),r*(a=Math.pow(2,-f))<1&&(f--,a*=2),r+=f+c>=1?l/a:l*Math.pow(2,1-c),r*a>=2&&(f++,a/=2),f+c>=h?(u=0,f=h):f+c>=1?(u=(r*a-1)*Math.pow(2,i),f+=c):(u=r*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[e+g]=255&u,g+=p,u/=256,i-=8);for(f=f<<i|u,s+=i;s>0;t[e+g]=255&f,g+=p,f/=256,s-=8);t[e+g-p]|=128*y}},{}],4:[function(t,r,e){var n={}.toString
r.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},{}],5:[function(t,r,e){"use strict"
function n(t,r){var e=Object.keys(V)
if(e.indexOf(r)<0)throw new TypeError("Underlying type does not exist. Typo?")
j[t]=r}function i(t){var r=Object.keys(V),e=t.trim().toLowerCase()
if(j.hasOwnProperty(e)&&(e=j[e]),-1===r.indexOf(e))throw new TypeError("Invalid data type for schema: "+t+" -> "+e)
return e}function o(t){k=t}function f(t){var r=t.trim().toLowerCase(),e=["ascii","utf8","utf16le","ucs2","base64","binary","hex"]
if(!(e.indexOf(r)>-1))throw new TypeError("String encoding not available")
D=r}function u(t,r){for(;t>127;)r[X.byteOffset++]=127&t|128,t>>=7
r[X.byteOffset++]=127&t}function a(t,r){u(t<<1^t>>31,r)}function s(t){var r,e=0,n=0
do r=t[X.byteOffset++],e|=(127&r)<<7*n,n++
while(128&r)
return e}function h(t){var r=s(t)
return r>>>1^-(1&r)}function c(t,r){var e=M.byteLength(t||"",D)
u(e,r),X.byteOffset+=r.write(t||"",X.byteOffset,e,D)}function l(t){var r=s(t),e=t.toString(D,X.byteOffset,X.byteOffset+r)
return X.byteOffset+=r,e}function g(t,r){var e=t.length
u(e,r),t.copy(r,X.byteOffset),X.byteOffset+=e}function p(t){var r=s(t),e=z(r)
return t.copy(e,0,X.byteOffset,X.byteOffset+r),X.byteOffset+=r,e}function y(t,r){switch(t){case"boolean":return"bag.byteOffset = wBuffer.writeUInt8("+r+" ? 1 : 0, bag.byteOffset, true);"
case"int8":return"bag.byteOffset = wBuffer.writeInt8("+r+", bag.byteOffset, true);"
case"uint8":return"bag.byteOffset = wBuffer.writeUInt8("+r+", bag.byteOffset, true);"
case"int16":return"bag.byteOffset = wBuffer.writeInt16BE("+r+", bag.byteOffset, true);"
case"uint16":return"bag.byteOffset = wBuffer.writeUInt16BE("+r+", bag.byteOffset, true);"
case"int32":return"bag.byteOffset = wBuffer.writeInt32BE("+r+", bag.byteOffset, true);"
case"uint32":return"bag.byteOffset = wBuffer.writeUInt32BE("+r+", bag.byteOffset, true);"
case"float32":return"bag.byteOffset = wBuffer.writeFloatBE("+r+", bag.byteOffset, true);"
case"float64":return"bag.byteOffset = wBuffer.writeDoubleBE("+r+", bag.byteOffset, true);"
case"string":return"bag.writeString("+r+", wBuffer);"
case"varuint":return"bag.writeVarUInt("+r+", wBuffer);"
case"varint":return"bag.writeVarInt("+r+", wBuffer);"
case"buffer":return"bag.writeBuffer("+r+", wBuffer);"}}function b(t){return 0>=t?1:Math.floor(Math.log(t)/Math.log(128))+1}function w(t){return b(t<<1^t>>31)}function d(t,r,e,n,i){var o=1>=n?r:r+"xn",f=void 0===i?"ref"+o+".length":i,u="j"+r
return"for (var "+u+"="+(t.length-1)+";"+u+"<"+f+";"+u+"++) { "+e+"}"}function v(t){return"byteC+=bag.getVarUIntByteLength(ref"+t+".length);"}function E(t){return"bag.writeVarUInt(ref"+t+".length,wBuffer);"}function A(t){return"var "+t+"=bag.readVarUInt(buffer);"}function B(t,r,e,n){return"var ref"+t+"="+n+"; ref"+r+"["+e+"]=ref"+t+";"}function m(t,r,e){return"var ref"+t+"=ref"+r+"["+e+"];"}function O(t,r,e,n,i,o,f,u){var a=(C(o,r),C(o,e)),s=t?"j"+e:n
o[o.length-1]+=m(r+"xn",a,s),f[f.length-1]+=B(r+"xn",a,s,i),u[u.length-1]+=m(r+"xn",a,s)}function _(t,r,e,n,i){if(typeof t!==r)throw new TypeError(t+" does not match the type of "+r)
if(void 0!==e&&e>t)throw new TypeError(t+" is less than minimum allowed value of "+e+" for schema type "+i)
if(void 0!==n&&t>n)throw new TypeError(t+" is greater than maximum allowed value of "+n+" for schema type "+i)}function R(t){var r="bag.throwTypeError("+t+",'Buffer or Uint8Array');"
return"if ("+t+" instanceof Uint8Array === false && "+t+" instanceof Buffer === false){"+r+"}"}function U(t,r){var e="bag.throwTypeError("+t+",'"+r+"');"
return"if (typeof("+t+") !== '"+r+"'){"+e+"}"}function T(t,r,e,n){var i="bag.throwTypeError("+t+",'number',"+r+","+e+",'"+n+"');"
return"if (typeof("+t+") !== 'number'||"+t+"<"+r+"||"+t+">"+e+"){"+i+"}"}function P(t,r){var e=3.4028234663852886e38
switch(t){case"boolean":return U(r,"boolean")
case"int8":return T(r,-128,127,"int8")
case"uint8":return T(r,0,255,"uint8")
case"int16":return T(r,-32768,32767,"int16")
case"uint16":return T(r,0,65535,"uint16")
case"int32":return T(r,-2147483648,2147483647,"int32")
case"uint32":return T(r,0,4294967295,"uint32")
case"float32":return T(r,-e,e,"float32")
case"float64":return T(r,-Number.MAX_VALUE,Number.MAX_VALUE,"float64")
case"string":return U(r,"string")
case"varuint":return T(r,0,2147483647,"varuint")
case"varint":return T(r,-1073741824,1073741823,"varint")
case"buffer":return R(r)}}function I(t,r,e,n){var i="ref"+r+e
return(n?P(t,i):"")+y(t,i)}function S(t,r,e){return"ref"+r+e+"="+V[t]}function Y(t,r,e){var n=N.hasOwnProperty(t)
return n?"byteC+="+N[t]+";":"byteC+=bag.dynamicByteCounts['"+t+"'](ref"+r+e+");"}function C(t,r){return t.length<=2&&t[t.length-1].length<=0?r:r+"xn"}function L(t,r){function e(t,y){a++
var b=Object.keys(t)
b.sort(function(t,r){return r>t?-1:t>r?1:0})
for(var w=a,_=0;_<b.length;_++){var R=b[_],U=t[R]
y&&(R=+R)
var T="number"==typeof R?R:"'"+R+"'",P=U.constructor===Array?"[]":"{}",L=y&&_>=b.length-1
if(L&&(s.push(""),h.push(""),c.push("")),U.constructor===Array){var x=a+1,M=s.length<=1?x:x+"xn",D="arrLen"+a
1===s.length&&(u+=m(x,w,T),o+=B(x,w,T,"[]"))
var k=E(M),j=A(D),V=v(M)
O(L,x,w,T,P,s,h,c),e(U,!0),l=k+d(U,x,s.pop()+l,s.length),g=j+d(U,x,h.pop()+g,s.length,D),p=V+d(U,x,c.pop()+p,s.length),1===s.length&&(n+=l,l="",o+=g,g="",f+=p,p="")}else if("object"==typeof U){var x=a+1
1===s.length&&(u+=m(x,w,T),o+=B(x,w,T,"{}")),O(L,x,w,T,P,s,h,c),e(U,!1)}else{var N=y?"":"["+T+"]",F=i(U)
t[R]=F
var M=C(s,w)
if(y&&(M+=L?"[j"+w+"]":"["+_+"]"),s[s.length-1]+=I(F,M,N,r),h[h.length-1]+=S(F,M,N),c[c.length-1]+=Y(F,M,N),s.length>1)continue
var z=y?w+"["+_+"]":w
n+=I(F,z,N,r),o+=S(F,z,N),f+=Y(F,z,N)}}}var n="bag.byteOffset=0;",o="var ref1={}; bag.byteOffset=0;",f="",u="var ref1=json;",a=0,s=[""],h=[""],c=[""],l="",g="",p=""
t={a:t},e(t,!1),f="var byteC=0;".concat(f,"var wBuffer=bag.allocUnsafe(byteC);"),n=u.concat(f,n,"return wBuffer;"),o=o.concat("return ref1['a'];")
var y=Function("json","bag",n),b=Function("buffer","bag",o)
return[y,b]}function x(t,r){var e=L(t,void 0===r?k:r),n=e[0],i=e[1]
return{encode:function(t){var r={a:t}
return n(r,X)},decode:function(t){var r=M.isBuffer(t)?t:q(t)
return i(r,X)}}}var M=t("buffer").Buffer,D="utf8",k=!0,j={},V={"boolean":"!!buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",int8:"buffer.readInt8(bag.byteOffset, true); bag.byteOffset += 1;",uint8:"buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",int16:"buffer.readInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",uint16:"buffer.readUInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",int32:"buffer.readInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",uint32:"buffer.readUInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",float32:"buffer.readFloatBE(bag.byteOffset, true); bag.byteOffset += 4;",float64:"buffer.readDoubleBE(bag.byteOffset, true); bag.byteOffset += 8;",string:"bag.readString(buffer);",varuint:"bag.readVarUInt(buffer);",varint:"bag.readVarInt(buffer);",buffer:"bag.readBuffer(buffer);"},N={"boolean":1,int8:1,uint8:1,int16:2,uint16:2,int32:4,uint32:4,float32:4,float64:8},F={string:function(t){var r=M.byteLength(t,D)
return b(r)+r},varuint:function(t){return b(t)},varint:function(t){return w(t)},buffer:function(t){var r=t.length
return b(r)+r}},z=M.allocUnsafe?function(t){return M.allocUnsafe(t)}:function(t){return new M(t)},q=M.from?function(t){return M.from(t)}:function(t){return new M(t)},X={}
X.allocUnsafe=z,X.getVarUIntByteLength=b,X.dynamicByteCounts=F,X.readVarUInt=s,X.readVarInt=h,X.writeVarUInt=u,X.writeVarInt=a,X.readString=l,X.writeString=c,X.readBuffer=p,X.writeBuffer=g,X.throwTypeError=_,X.byteOffset=0,n("bool","boolean"),r.exports=e={build:x,addTypeAlias:n,setStringEncoding:f,setValidateByDefault:o},window.schemapack=r.exports},{buffer:2}]},{},[5])
//const binary = document.createElement('SCRIPT');
const pathfinding = document.createElement('SCRIPT');
//binary.src = 'https://raw.githubusercontent.com/phretaddin/schemapack/master/build/schemapack.min.js';
pathfinding.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/pathfinding.js';
pathfinding.onload = () => {
  const engine = document.createElement('SCRIPT');
  engine.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/engine.js';
  engine.onload = Game;
  document.head.appendChild(engine);
}
document.head.appendChild(binary);
document.head.appendChild(pathfinding);
function Game() {
  const schema = window.schemapack.build({
  username: 'string',
  type: 'string',
  gamemode: 'string',
  op: 'string',
  token: 'int16',
  password: 'string',
  key: 'string',
  value: {
    'pixel-tanks': {
      username: 'string',
      class: 'string',
      cosmetic: 'string',
      cosmetics: ['string'],
      deathEffect: 'string',
      deathEffects: ['string'],
      color: 'string',
      stats: ['int16'],
      classes: ['boolean'],
      items: ['string'],
      keybinds: {
        items: ['int16'],
        emotes: ['int16'],    
      },
    }
  },
  tank: {
    rank: 'int16',
    username: 'string',
    class: 'string',
    cosmetic: 'string',
    deathEffect: 'string',
    color: 'string',
    x: 'int16',
    y: 'int16',
    r: 'int16',
    use: ['string'],
    fire: [{
      x: 'int16',
      y: 'int16',
      type: 'string',
      r: 'int16',
    }],
    baseFrame: 'int16',
    baseRotation: 'int16',
    invis: 'boolean',
    immune: 'boolean',
    animation: {
      id: 'string',
      frame: 'int16',
    },
    airstrike: {
      x: 'int16',
      y: 'int16',
    },
  },
  id: 'float32',
  room: 'float32',
  data: ['string'],
  b: [{
    x: 'int16',
    y: 'int16', 
    maxHp: 'int16',
    hp: 'int16',
    type: 'string',
    s: 'boolean',
    team: 'string',
    id: 'float32',
  }],
  pt: [{
    rank: 'int16',
    username: 'string',
    cosmetic: 'string',
    color: 'string',
    damage: {
      x: 'int16',
      y: 'int16',
      d: 'int16',
    },
    maxHp: 'int16',
    hp: 'int16',
    shields: 'int16',
    team: 'string',
    x: 'int16',
    y: 'int16',
    r: 'int16',
    ded: 'boolean',
    pushback: 'int16',
    baseRotation: 'int16', 
    baseFrame: 'int16',
    fire: {
      frame: 'int16',
    },
    animation: {}, // FIX
    buff: 'boolean',
    invis: 'boolean',
    id: 'float32',
    class: 'string',
    flashbanged: 'boolean',
    dedEffect: 'string',
  }],
  ai: [{
    role: 'int16',
    x: 'int16',
    y: 'int16',
    r: 'int16',
    baseRotation: 'int16',
    baseFrame: 'int16',
    mode: 'int16',
    rank: 'int16',
    hp: 'int16',
    maxHp: 'int16',
    pushback: 'int16',
    cosmetic: 'string',
    id: 'float32',
    fire: {
      frame: 'int16',
    },
    damage: {
      x: 'int16',
      y: 'int16',
      d: 'int16',
    },
    team: 'string',
    color: 'string',
  }],
  s: [{
    team: 'string',
    r: 'int16',
    type: 'string',
    x: 'int16',
    y: 'int16',
    sx: 'int16',
    sy: 'int16',
    id: 'float32',
  }],
  d: [{
    x: 'int16',
    y: 'int16',
    w: 'int16',
    h: 'int16',
    f: 'int16',
    id: 'float32',
  }],
  logs: [{
    m: 'string',
    c: 'string',
  }],
  global: 'string',
  tickspeed: 'string',
  event: 'string',
  delete: {
    b: ['float32'],
    pt: ['float32'],
    ai: ['float32'],
    s: ['float32'],
    d: ['float32'],
  },
});
  class MegaSocket {
    constructor(url, options={keepAlive: true, autoconnect: true, reconnect: false}) {
      this.url = url;
      this.options = options;
      this.callstack = {open: [], close: [], message: []};
      this.status = 'idle';
      window.addEventListener('offline', () => {
        this.socket.close();
        this.socket.onclose();
      });
      if (this.options.reconnect) window.addEventListener('online', this.connect.bind(this));
      if (this.options.autoconnect) {
        this.status = 'connecting';
        this.connect();
      }
    }

    connect() {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        this.status = 'connected';
        if (this.options.keepAlive) this.socket.keepAlive = setInterval(() => {
          this.socket.send(schema.encode({type: 'ping', op: 'ping'}));
        }, 30000);
        this.callstack.open.forEach(f => f());
      }
      this.socket.onmessage = data => {
        try {
          data = schema.decode(data.data);
        } catch(e) {
          alert('Socket Encryption Error: ' + data.data+' | '+e);
        }
        if (data.status === 'error') {
          if (data.message === 'Invalid token.') {
            clearInterval(PixelTanks.autosave);
            if (PixelTanks.user.player) PixelTanks.user.player.implode();
            PixelTanks.user.token = undefined;
            PixelTanks.user.username = undefined;
            return Menus.trigger('start');
          }
          return alert(data.message);
        }
        this.callstack.message.forEach(f => f(data));
      }
      this.socket.onclose = e => {
        clearInterval(this.socket.keepAlive);
        this.status = 'disconnected';
        this.callstack.close.forEach(f => f());
        if (this.options.reconnect) this.connect();
      }
    }

    on(event, operation) {
      if (event === 'connect') this.callstack.open.push(operation);
      if (event === 'message') this.callstack.message.push(operation);
      if (event === 'close') this.callstack.close.push(operation);
    }
    no(event) {
      if (event === 'connect') this.callstack.open = [];
      if (event === 'message') this.callstack.message = [];
      if (event === 'close') this.callstack.close = [];
    }
    send(data) {
      data = schema.encode(data);
      this.socket.send(data);
    }
    close() {
      this.socket.close();
    }
  }

  class A {
    static each(arr, func, filter, param) {
      var l = 0;
      while (l<arr.length) {
        if ((filter === undefined || filter === null) ? true : (arr[l][filter.key] === filter.value)) {
          var r = undefined;
          if (typeof func === 'string') {
            r = arr[l][func](param);
          } else {
            r = func.bind(arr[l])({ ...param, i: l });
          }
          if (r !== undefined) return r;
        }
        l++;
      }
    }

    static search(arr, filter) {
      var l = 0;
      while (l<arr.length) {
        if (arr[l][filter.key] === filter.value) {
          return arr[l];
        }
        l++;
      }
    }

    static collider(rect1, rect2) {
      if ((rect1.x > rect2.x || rect1.x+rect1.w > rect2.x) && (rect1.x < rect2.x+rect2.w || rect1.x+rect1.w < rect2.x+rect2.w) && (rect1.y > rect2.y || rect1.y+rect1.h > rect2.y) && (rect1.y < rect2.y+rect2.h || rect1.y+rect1.h < rect2.y+rect2.h)) return true;
      return false;
    }

    static assign(obj, keys, values) {
      A.each(keys, function(d) {obj[this] = d.values[d.i]}, null, {values: values});
    }

    static en(c) {var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

    static de(b) {var a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}
  }

  class Menu {
    constructor(data, id) {
      const {buttons, listeners, cdraw} = data;
      this.id = id;
      this.buttons = buttons;
      this.listeners = listeners;
      this.buttonEffect = true;
      this.cdraw = cdraw.bind(this);
      this.listeners.click = this.onclick;
      for (const l in this.listeners) this.listeners[l] = this.listeners[l].bind(this);
      for (const b of this.buttons) {
        if (typeof b[4] === 'function') b[4] = b[4].bind(this);
        b[6] = 0;
      }
      this.render = [0, 0, 1600, 1000];
      this.compile();
    }
    
    addListeners() {
      for (const l in this.listeners) window.addEventListener(l, this.listeners[l]);
    }
    
    removeListeners() {
      for (const l in this.listeners) window.removeEventListener(l, this.listeners[l]);
    }
    
    onclick() {
      for (const b of this.buttons) {
        if (A.collider({x: Menus.x, y: Menus.y, w: 0, h: 0}, {x: this.render[0]+b[0], y: this.render[1]+b[1], w: b[2]*this.render[2]/1600, h: b[3]*this.render[3]/1000})) {
          if (typeof b[4] === 'function') {
            return b[4]();
          } else return Menus.trigger(b[4]);
        }
      }
    }

    compile() {
      return;
      this.cache = [];
      for (const b of this.buttons) {
        const x = this.render[0]+b[0]*this.render[2]/1600, y = this.render[1]+b[1]*this.render[3]/1000, w = b[2]*this.render[2]/1600, h = b[3]*this.render[3]/1000;
        const canvas = document.createElement('canvas'), draw = canvas.getContext('2d');
        canvas.width = w*PixelTanks.resizer;
        canvas.height = h*PixelTanks.resizer;
        draw.setTransform(1, 0, 0, 1, -x*PixelTanks.resizer, -y*PixelTanks.resizer);
        draw.getContext('2d').drawImage(GUI.canvas, 0, 0);
        this.cache.push([x, y, w, h, canvas]);
      }  
    }
    
    draw(render) {
      if (render && this.render !== render) {
        this.render = render;
        this.compile();
      }
      if (PixelTanks.images.menus[this.id]) GUI.drawImage(PixelTanks.images.menus[this.id], this.render[0], this.render[1], this.render[2], this.render[3], 1);
      GUI.draw.fillStyle = '#ffffff';
      GUI.draw.globalAlpha = .3;
      for (const b of this.buttons) GUI.draw.fillRect(b[0], b[1], b[2], b[3]);
      GUI.draw.globalAlpha = 1;
      this.cdraw();
      return;
      if (!this.buttonEffect) return;
      for (const b of this.buttons) {
        if (b[5]) {
          const [x, y, w, h, canvas] = this.cache;
          if (A.collider({x, y, w, h}, {x: Menus.x, y: Menus.y, w: 0, h: 0})) {
            b[6] = Math.min(b[6]+1, 10);
          } else {
            b[6] = Math.max(b[6]-1, 0);
          }
        }
        GUI.drawImage(canvas, x-b[6], y-b[6], w+b[6]*2, h+b[6]*2, 1);
      }
    }
  }
    
  class Menus {
    static start() {
      Menus.renderer = requestAnimationFrame(Menus.render);
    }
  
    static render() {
      Menus.renderer = requestAnimationFrame(Menus.render);
      GUI.clear();
      Menus.redraw();
    }
  
    static mouseLog(e) {
      Menus.x = (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/PixelTanks.resizer;
      Menus.y = e.clientY/PixelTanks.resizer;
    }
  
    static stop() {
      cancelAnimationFrame(Menus.renderer);
      Menus.renderer = undefined;
    }
  
    static trigger(name) {
      if (Menus.current) Menus.menus[Menus.current].removeListeners();
      if (Menus.renderer === undefined) Menus.start();
      Menus.current = name;
      Menus.menus[Menus.current].addListeners();
    }
  
    static redraw() {
      if (!Menus.current) return;
      Menus.menus[Menus.current].draw([0, 0, 1600, 1000]);
    }
  
    static removeListeners() {
      Menus.stop();
      Menus.menus[Menus.current].removeListeners();
    }
  }

  class Network {
    static get(callback) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'get', username, token});
      PixelTanks.socket.on('message', data => {
        if (data.status === 'success' && data.type === 'get') {
          PixelTanks.socket.no('message');
          callback(data.data);
        }
      });
    }

    static update(key, value) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'set', username, token, key, value});
      PixelTanks.socket.on('message', data => {
        if (data.success) PixelTanks.socket.no('message');
      });
    }

    static auth(username, password, type, callback) {
      PixelTanks.socket.send({op: 'auth', type, username, password});
      PixelTanks.socket.on('message', data => {
        if (data.status === 'success') {
          PixelTanks.socket.no('message');
          PixelTanks.user.username = username;
          PixelTanks.user.token = data.token;
          callback();
        }
      });
    }
  }

  class Loader {

    static loadImage(source, t, i) {
      this.total++;
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
          this.loaded++;
          PixelTanks.updateBootProgress(Math.round(this.loaded/this.total*100)/100);
          resolve(image);
        }
        image.onerror = () => reject(new Error(`Failed to load image: ${source}`));
        image.src = `https://cs6413110.github.io/Pixel-Tanks/public/images${source}.png`;
        this.key[t][i] = image;
      });
    }
  
    static async loadImages(key) {
      Loader.key = key;
      Loader.loaded = 0;
      Loader.total = 0;
      const promises = [];
      for (const t in key) {
        for (const i in key[t]) {
          if (!i.endsWith('_')) promises.push(this.loadImage(key[t][i], t, i));
        }
      }
      await Promise.all(promises);
      PixelTanks.launch();
    }
  
  }

  class GUI {
    
    static resize() {
      PixelTanks.resizer = window.innerHeight/1000;
      GUI.canvas.height = window.innerHeight;
      GUI.canvas.width = window.innerHeight*1.6;
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      Menus.redraw();
    }

    static drawImage(image, x, y, w, h, t, px, py, bx, by, a, cx, cy, cw, ch) {
      if (a !== undefined) {
        GUI.draw.translate(x+px, y+py);
        GUI.draw.rotate(a*Math.PI/180);
      }
      GUI.draw.globalAlpha = t;
      if (cx || cy || cy || ch) {
        GUI.draw.drawImage(image, cx, cy, cw, ch, x, y, w, h);
      } else {
        GUI.draw.drawImage(image, a !== undefined ? -px+bx : x, a !== undefined ? -py+by : y, w, h);
      }
      GUI.draw.globalAlpha = 1;
      if (a !== undefined) {
        GUI.draw.rotate(-a*Math.PI/180);
        GUI.draw.translate(-x-px, -y-py);
      }
    }

    static drawText(message, x, y, size, color, anchor) {
      GUI.draw.font = `${size}px Font`;
      GUI.draw.fillStyle = color;
      GUI.draw.fillText(message, x-GUI.draw.measureText(message).width*anchor, y+size*.8*(1-anchor));
    }

    static clear() {
      GUI.draw.clearRect(-10000, -10000, 20000, 20000);
    }
  }

  class PixelTanks {

    static start() {
      PixelTanks.setup();
      PixelTanks.boot();
    }

    static setup() {
      document.body.innerHTML += `
      <style>
        html, body {
          margin: 0;
          max-height: 100vh;
          max-width: 100vw;
          padding: 0;
          overflow: hidden;
          text-align: center;
        }
        canvas {
          display: inline;
        }
        @font-face {
          font-family: 'Font';
          src: url('https://cs6413110.github.io/Pixel-Tanks/public/fonts/PixelOperator.ttf') format('truetype');
        }
      </style>`;
      Menus.scaler = document.createElement('CANVAS');
      GUI.canvas = document.createElement('CANVAS');
      GUI.draw = GUI.canvas.getContext('2d');
      GUI.draw.imageSmoothingEnabled = false;
      Menus.scaler.getContext('2d').imageSmoothingEnabled = false;
      document.body.appendChild(GUI.canvas);
      PixelTanks.resizer = window.innerHeight/1000;
      GUI.canvas.height = window.innerHeight;
      GUI.canvas.width = window.innerHeight*1.6;
      GUI.canvas.style = 'background-color: black;';
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      GUI.drawText('Loading Font', 800, 500, 50, '#fffff', 0.5);
      window.oncontextmenu = () => {return false};
      window.addEventListener('resize', GUI.resize);
      window.addEventListener('mousemove', Menus.mouseLog);
    }
  
    static updateBootProgress(progress) {
      GUI.clear();
      GUI.drawText(Math.round(progress*100)+'%', 800, 500, 50, '#ffffff', 0.5);
    }

    static boot() {
      PixelTanks.user = {};

      PixelTanks.images = {
        blocks: {
          barrier: '/blocks/barrier',
          strong: '/blocks/strong',
          weak: '/blocks/weak',
          spike: '/blocks/spike',
          floor: '/blocks/floor',
          void: '/blocks/void',
          gold: '/blocks/gold',
          fire: '/blocks/fire',
          friendlyfire: '/blocks/friendlyfire',
          airstrike: '/blocks/airstrike',
          friendlyairstrike: '/blocks/friendlyairstrike',
        },
        bullets: {
          //normal: '/bullets/normal', no image yet :(
          shotgun: '/bullets/shotgun',
          powermissle: '/bullets/powermissle',
          megamissle: '/bullets/megamissle',
          grapple: '/bullets/grapple',
          dynamite: '/bullets/dynamite',
          fire: '/bullets/fire',
        },
        tanks: {
          buff: '/tanks/buff',
          base: '/tanks/base',
          destroyed: '/tanks/destroyed',
          top: '/tanks/top',
          bottom: '/tanks/bottom',
          bottom2: '/tanks/bottom2',
        },
        cosmetics: {
              'DarkMemeGod': '/cosmetics/meme',
              'Aaron': '/cosmetics/aaron',
              'Astronaut': '/cosmetics/astronaut',
              'Onfire': '/cosmetics/onfire',
              'Assassin': '/cosmetics/assassin',
              'Redsus': '/cosmetics/redsus',
              'Venom': '/cosmetics/venom',
              'Blue Tint': '/cosmetics/blue_tint',
              'Purple Flower': '/cosmetics/purple_flower',
              'Leaf': '/cosmetics/leaf',
              'Basketball': '/cosmetics/basketball',
              'Purple Top Hat': '/cosmetics/purple_top_hat',
              'Terminator': '/cosmetics/terminator',
              'Dizzy': '/cosmetics/dizzy',
              'Knife': '/cosmetics/knife',
              'Scared': '/cosmetics/scared',
              'Laff': '/cosmetics/laff',
              'Hacker Hoodie': '/cosmetics/hacker_hoodie',
              'Error': '/cosmetics/error',
              'Purple Grad Hat': '/cosmetics/purple_grad_hat',
              'Bat Wings': '/cosmetics/bat_wings',
              'Back Button': '/cosmetics/back',
              'Fisher Hat': '/cosmetics/fisher_hat',
              'Kill = Ban': '/cosmetics/ban',
              'Blue Ghost': '/cosmetics/blue_ghost',
              'Pumpkin Face': '/cosmetics/pumpkin_face',
              'Pumpkin Hat': '/cosmetics/pumpkin_hat',
              'Red Ghost': '/cosmetics/red_ghost',
              'Candy Corn': '/cosmetics/candy_corn',
              'Yellow Pizza': '/cosmetics/yellow_pizza',
              'Orange Ghost': '/cosmetics/orange_ghost',
              'Pink Ghost': '/cosmetics/pink_ghost',
              'Paleontologist': '/cosmetics/paleontologist',
              'Yellow Hoodie': '/cosmetics/yellow_hoodie',
              'X': '/cosmetics/x',
              'Sweat': '/cosmetics/sweat',
              'Spirals': '/cosmetics/spirals',
              'Spikes': '/cosmetics/spikes',
              'Rudolph': '/cosmetics/rudolph',
              'Reindeer Hat': '/cosmetics/reindeer_hat',
              'Red Hoodie': '/cosmetics/red_hoodie',
              'Question Mark': '/cosmetics/question_mark',
              'Purple-Pink Hoodie': '/cosmetics/purplepink_hoodie',
              'Purple Hoodie': '/cosmetics/purple_hoodie',
              'Pumpkin': '/cosmetics/pumpkin',
              'Pickle': '/cosmetics/pickle',
              'Orange Hoodie': '/cosmetics/orange_hoodie',
              'Helment': '/cosmetics/helment',
              'Green Hoodie': '/cosmetics/green_hoodie',
              'Exclaimation Point': '/cosmetics/exclaimation_point',
              'Eggplant': '/cosmetics/eggplant',
              'Devil Wings': '/cosmetics/devils_wings',
              'Christmas Tree': '/cosmetics/christmas_tree',
              'Christmas Lights': '/cosmetics/christmas_lights',
              'Checkmark': '/cosmetics/checkmark',
              'Cat Hat': '/cosmetics/cat_hat',
              'Blueberry': '/cosmetics/blueberry',
              'Blue Hoodie': '/cosmetics/blue_hoodie',
              'Blue Helment': '/cosmetics/blue_helment',
              'Banana': '/cosmetics/bannana',
              'Aqua Helment': '/cosmetics/aqua_helment',
              'Apple': '/cosmetics/apple',
              'Hoodie': '/cosmetics/hoodie',
              'Purple Helment': '/cosmetics/purple_helment',
              'Angel Wings': '/cosmetics/angel_wings',
              'Boost': '/cosmetics/boost',
              'Bunny Ears': '/cosmetics/bunny_ears',
              'Cake': '/cosmetics/cake',
              'Cancelled': '/cosmetics/cancelled',
              'Candy Cane': '/cosmetics/candy_cane',
              'Cat Ears': '/cosmetics/cat_ears',
              'Christmas Hat': '/cosmetics/christmas_hat',
              'Controller': '/cosmetics/controller',
              'Deep Scratch': '/cosmetics/deep_scratch',
              'Devil Horns': '/cosmetics/devil_horn',
              'Headphones': '/cosmetics/earmuffs',
              'Eyebrows': '/cosmetics/eyebrows',
              'First Aid': '/cosmetics/first_aid',
              'Flag': '/cosmetics/flag',
              'Halo': '/cosmetics/halo',
              'Hax': '/cosmetics/hax',
              'Low Battery': '/cosmetics/low_battery',
              'Mini Tank': '/cosmetics/mini_tank',
              'MLG Glasses': '/cosmetics/mlg_glasses',
              'Money Eyes': '/cosmetics/money_eyes',
              'No Mercy': '/cosmetics/no_mercy',
              'Peace': '/cosmetics/peace',
              'Police': '/cosmetics/police',
              'Question Mark': '/cosmetics/question_mark',
              'Rage': '/cosmetics/rage',
              'Small Scratch': '/cosmetics/small_scratch',
              'Speaker': '/cosmetics/speaker',
              'Swords': '/cosmetics/swords',
              'Tools': '/cosmetics/tools',
              'Top Hat': '/cosmetics/top_hat',
              'Uno Reverse': '/cosmetics/uno_reverse',
              'Mask': '/cosmetics/victim',
        },
        menus: {
          ui: '/menus/ui',
          start: '/menus/start',
          main: '/menus/main',
          multiplayer: '/menus/multiplayer',
          singleplayer: '/menus/singleplayer',
          victory: '/menus/victory',
          defeat: '/menus/defeat',
          crate: '/menus/crate',
          settings: '/menus/settings',
          keybinds: '/menus/keybinds',
          inventory: '/menus/inventory',
          classTab: '/menus/classTab',
          healthTab: '/menus/healthTab',
          itemTab: '/menus/itemTab',
          cosmeticTab: '/menus/cosmeticTab',
          deathEffectsTab: '/menus/cosmeticTab',
          shop: '/menus/shop',
          broke: '/menus/broke',
          htp1: '/menus/htp1',
          htp2: '/menus/htp2',
          htp3: '/menus/htp3',
          htp4: '/menus/htp4',
          pause: '/menus/pause',
          help: '/menus/help',
          helpinventory: '/menus/helpinventory',
          helpcosmetic: '/menus/helpcosmetic',
          helpclass: '/menus/helpclass',
          helpmode: '/menus/helpmode',
          helpvocab: '/menus/helpvocab',
          helpteam: '/menus/helpteam',
        },
        emotes: { // type: 0=loop 1=play once 2=static
          speech: '/emotes/speech',
          speech_: {speed: 50},
          mlg: '/emotes/mlg',
          mlg_: {type: 1, frames: 13, speed: 50},
          wink: '/emotes/wink',
          wink_: {type: 2, speed: 50},
          confuzzled: '/emotes/confuzzled',
          confuzzled_: {type: 2, speed: 50},
          surrender: '/emotes/surrender',
          surrender_: {type: 2, speed: 50},
          anger: '/emotes/anger',
          anger_: {type: 0, frames: 4, speed: 50},
          ded: '/emotes/ded',
          ded_: {type: 2, speed: 50},
          mercy: '/emotes/mercy',
          mercy_: {type: 0, frames: 1, speed: 50},
          suffocation: '/emotes/suffocation',
          suffocation_: {type: 0, frames: 3, speed: 50},
          nomercy: '/emotes/nomercy',
          nomercy_: {type: 0, frames: 1, speed: 50},
          idea: '/emotes/idea',
          idea_: {type: 1, frames: 6, speed: 50},
          scared: '/emotes/scared',
          scared_: {type: 2, speed: 50},
          crying: '/emotes/crying',
          crying_: {type: 0, frames: 5, speed: 50},
          flat: '/emotes/flat',
          flat_: {type: 0, frames: 1, speed: 50},
          noflat: '/emotes/noflat',
          noflat_: {type: 0, frames: 1, speed: 50},
          rage: '/emotes/rage',
          rage_: {type: 0, frames: 5, speed: 50},
          sad: '/emotes/sad',
          sad_: {type: 0, frames: 2, speed: 50},
          sweat: '/emotes/sweat',
          sweat_: {type: 0, frames: 10, speed: 50},
          teamedon: '/emotes/miss',
          teamedon_: {type: 1, frames: 28, speed: 75},
          evanism: '/emotes/evanism',
          evanism_: {type: 1, frames: 45, speed: 100},
          miss: '/emotes/teamedon',
          miss_: {type: 0, frames: 12, speed: 50},
        },
        animations: {
          tape: '/animations/tape',
          tape_: {frames: 17, speed: 50},
          toolkit: '/animations/toolkit',
          toolkit_: {frames: 16, speed: 50},
          glu: '/animations/glu',
          glu_: {frames: 45, speed: 50},
          heal: '/animations/heal',
          heal_: {frames: 16, speed: 25},
          fire: '/animations/fire',
          fire_: {frames: 1, speed: 50},
          explosion: '/animations/explosion',
        },
        deathEffects: {
          explode: '/animations/explode',
          explode_: {frames: 17, speed: 75, kill: 8, type: 1},
          clicked: '/animations/clicked',
          clicked_: {frames: 29, speed: 75, kill: 28, type: 2},
          amogus: '/animations/amogus',
          amogus_: {frames: 47, speed: 75, kill: 21, type: 1},
          nuke: '/animations/nuke',
          nuke_: {frames: 26, speed: 75, kill: 12, type: 1},
          error: '/animations/error',
          error_: {frames: 10, speed: 250, kill: 10, type: 2},
          magic: '/animations/magic',
          magic_: {frames: 69, speed: 75, kill: 51, type: 2},
          /*securly: '/animations/securly',
          securly_: {frames: 1, speed: 9900, kill: 1, type: 3},*/
          anvil: '/animations/anvil',
          anvil_: {frames: 22, speed: 75, kill: 6, type: 1},
          insta: '/animations/insta',
          insta_: {frames: 22, speed: 75, kill: 21, type: 1},
          cat: '/animations/cat',
          cat_: {frames: 4, speed: 250, kill: 4, type: 1},
          crate: '/animations/crate',
          crate_: {frames: 31, speed: 75, kill: 21, type: 2},
          battery: '/animations/battery',
          battery_: {frames: 55, speed: 75, kill: 54, type: 2},
          evan: '/animations/evan',
          evan_: {frames: 8, speed: 500, kill: 7, type: 1},
          minecraft: '/animations/minecraft',
          minecraft_: {frames: 22, speed: 100, kill: 15, type: 2},
          enderman: '/animations/enderman',
          enderman_: {frames: 4, speed: 500, kill: 3, type: 2},
          wakawaka: '/animations/wakawaka',
          wakawaka_: {frames: 27, speed: 75, kill: 13, type: 2},
        },
        items: {
          airstrike: '/items/airstrike',
          duck_tape: '/items/duck-tape',
          super_glu: '/items/super-glu',
          shield: '/items/shield',
          flashbang: '/items/flashbang',
          bomb: '/items/bomb',
          dynamite: '/items/dynamite',
          weak: '/items/weak',
          strong: '/items/strong',
          spike: '/items/spike',
          mine: '/items/mine',
          fortress: '/items/fortress',
          toolkitui: '/items/toolkitui',
          boostui: '/items/boostui',
          powermissleui: '/items/powermissleui',
          tacticalui: '/items/tacticalui',
          stealthui: '/items/stealthui',
          builderui: '/items/builderui',
          warriorui: '/items/warriorui',
          medicui: '/items/medicui',
          fireui: '/items/fireui',
        }
      };

      Loader.loadImages(PixelTanks.images);

      Menus.menus = {
        start: {
          buttons: [
            [544, 648, 216, 116, function() {PixelTanks.auth(this.username, this.password, 'login')}, true],
            [840, 648, 216, 116, function() {PixelTanks.auth(this.username, this.password, 'signup')}, true],
            [564, 392, 456, 80, function() {this.type = 'username'}, false],
            [564, 520, 456, 80, function() {this.type = 'password'}, false],
          ],
          listeners: {
            keydown: function(e) {
              if (e.key.length === 1) this[this.type] += e.key;
              if (e.keyCode === 8) this[this.type] = this[this.type].slice(0, -1);
              if (e.keyCode === 13) PixelTanks.auth(this.username, this.password, 'login');
            }
          },
          cdraw: function() {
            if (!this.type) {
              this.type = 'username';
              this.username = '';
              this.password = '';
            }
            GUI.drawText(this.username, 574, 407, 50, '#000000', 0);
            GUI.drawText(this.password.replace(/./g, '*'), 574, 535, 50, '#000000', 0);
          },
        },
        main: {
          buttons: [
            [972, 840, 88, 88, 'keybinds', true],
            [532, 616, 536, 136, 'multiplayer', true],
            [648, 840, 88, 88, 'shop', true],
            [540, 840, 88, 88, 'inventory', true],
            [756, 840, 88, 88, 'crate', true],
            [864, 840, 88, 88, 'help', true],
            [532, 392, 536, 136, 'singleplayer', true],
            /*[320, 920, 80, 80, function() {
              clearInterval(PixelTanks.autosave);
              PixelTanks.user.token = undefined;
              PixelTanks.user.username = undefined;
              Menus.trigger('start');
            }],*/ // logout
          ],
          listeners: {},
          cdraw: function() {
            PixelTanks.renderBottom(1200, 600, 160, PixelTanks.userData.color);
            GUI.drawImage(PixelTanks.images.tanks.bottom, 1200, 600, 160, 160, 1);
            PixelTanks.renderTop(1200, 600, 160, PixelTanks.userData.color);
            GUI.drawImage(PixelTanks.images.tanks.top, 1200, 600, 160, 180, 1);
            if (PixelTanks.userData.cosmetic !== '' && PixelTanks.userData.cosmetic !== undefined) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 1200, 600, 160, 180, 1);
            GUI.drawText(PixelTanks.user.username, 1280, 800, 100, '#ffffff', 0.5);
          },
        },
        singleplayer: {
          buttons: [
            [25, 28, 80, 74, 'main', true],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              const levelCoords = [
                [31, 179],
                [244, 179],
                [452, 179],
                [672, 179],
                [890, 179],
                [31, 262],
                [244, 262],
                [452, 262],
                [672, 262],
                [890, 262],
                [31, 345],
                [244, 345],
                [452, 345],
                [672, 345],
                [890, 345],
                [31, 428],
                [244, 428],
                [452, 428],
                [672, 428],
                [890, 428],
              ];
              for (const c of levelCoords) {
                if (x > c[0]*1600/1049 && x < (c[0]+80)*1600/1049 && y > c[1]*1000/653 && y < (c[1]+74)*1000/653) {
                  Menus.removeListeners();
                  PixelTanks.user.player = new Tank(levelCoords.indexOf(c)+3, false, null);
                }
              }
            }
          },
          cdraw: function() {},
        },
        victory: {
          buttons: [
            [656, 603, 313, 112, 'main', true],
            [558, 726, 505, 114, function() {
              alert('lol idk')
            }, true],
          ],
          listeners: {},
          cdraw: function() {
            
          },
        },
        defeat: {
          buttons: [
            [656, 603, 313, 112, 'main', true],
            [558, 726, 505, 114, function() {
              alert('lol idk')
            }, true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        multiplayer: {
          buttons: [
            [424, 28, 108, 108, 'main'],
            [340, 376, 416, 116, function() {this.gamemode = 'ffa'}, true],
            [340, 532, 416, 116, function() {this.gamemode = 'duels'}, true],
            [340, 688, 416, 116, function() {this.gamemode = 'tdm'}, true],
            [340, 844, 416, 116, function() {this.gamemode = 'juggernaut'}, true],
            [868, 848, 368, 88, function() {
              PixelTanks.user.player = new Tank(this.ip, true, this.gamemode); 
              Menus.removeListeners();
            }, true],
          ],
          listeners: {
            keydown: function(e) {
              if (e.key.length === 1) {
                this.ip += e.key;
              } else if (e.keyCode === 8) {
                this.ip = this.ip.slice(0, -1);
              } else if (e.keyCode !== -1) return;
              this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip, {keepAlive: false, reconnect: true, autoconnect: true});
              this.socket.on('connect', () => {
                this.socket.send({username: PixelTanks.user.username, type: 'stats'});
              });
              this.socket.on('message', (d) => {
                this.output = d;
              });
            }
          },
          cdraw: function() {
            if (!this.gamemode) {
              this.gamemode = 'ffa';
              this.output = {FFA: '', DUELS: '', TDM: ''};
              this.ip = '141.148.128.231/ffa';
              this.listeners.keydown({keyCode: -1, key: ''});
            }
            GUI.drawText(this.gamemode, 1200, 800, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.ip, 800, 276, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.output.FFA.length, 820, 434, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.output.DUELS.length, 820, 590, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.output.TDM.length, 820, 764, 50, '#FFFFFF', 0.5);
            let offset = 0;
            for (const server of this.output[this.gamemode.toUpperCase()]) {
              if (server !== null) for (const player of server) {
                GUI.drawText(player, 880, 400+40*offset, 50, '#FFFFFF', 0);
                offset++;
              }
            }
          }
        },
        crate: {
          buttons: [
            [416, 20, 81, 81, 'main', true],
            [232, 308, 488, 488, function() {PixelTanks.openCrate(0)}, false],
            [880, 308, 488, 488, function() {PixelTanks.openCrate(1)}, false],
          ],
          listeners: {},
          cdraw: function() {
            GUI.drawText('Crates: ' + PixelTanks.userData.stats[1], 800, 260, 30, '#ffffff', 0.5);
          }
        },
        settings: {
          buttons: [
            [59, 56, 53, 53, 'main', true],
            [397, 65, 38, 35, 'keybinds', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp1: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [476, 224, 320, 80, 'htp2', true],
            [804, 224, 320, 80, 'htp3', true],
            [1132, 224, 320, 80, 'htp4', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp2: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [148, 224, 320, 80, 'htp1', true],
            [804, 224, 320, 80, 'htp3', true],
            [1132, 224, 320, 80, 'htp4', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp3: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [148, 224, 320, 80, 'htp1', true],
            [476, 224, 320, 80, 'htp2', true],
            [1132, 224, 320, 80, 'htp4', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp4: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [148, 224, 320, 80, 'htp1', true],
            [476, 224, 320, 80, 'htp2', true],
            [804, 224, 320, 80, 'htp3', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        keybinds: {
          buttons: [
            [40, 40, 120, 120, 'main', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        help: {
          buttons: [
            [684, 764, 236, 80, 'helpinventory', true],
            [1024, 764, 236, 80, 'helpcosmetic', true],
            [1344, 764, 236, 80, 'helpclass', true],
            [44, 884, 236, 80, 'helpmode', true],
            [364, 884, 236, 80, 'helpvocab', true],
            [1344, 884, 236, 80, 'helpteam', true],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              const helpCoords = [
                [44, 644],
                [364, 644],
                [684, 644],
                [1024, 644],
                [1344, 644],
                [44, 764],
                [364, 764],
                [684, 884],
                [1344, 884],
              ];
              for (const c of helpCoords) {
                if (x > c[0]*1600/1049 && x < (c[0]+80)*1600/1049 && y > c[1]*1000/653 && y < (c[1]+74)*1000/653) {
                  Menus.removeListeners();
                  PixelTanks.user.player = new Tank(helpCoords.indexOf(c)+1, false, null);
                }
              }
            }
          },
          cdraw: function() {
            const helpCoords = [
                [44, 644],
                [364, 644],
                [684, 644],
                [1024, 644],
                [1344, 644],
                [44, 764],
                [364, 764],
                [684, 884],
                [1344, 884],
              ];
            GUI.draw.fillStyle = '#000000';
            for (const c of helpCoords) GUI.draw.fillRect(c[0], c[1], 80, 74);
          },
        },
        helpinventory: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpcosmetic: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpclass: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpmode: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpvocab: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpteam: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        inventory: {
          buttons: [
            [416, 20, 108, 108, 'main', true],
            [1064, 460, 88, 88, PixelTanks.upgrade, true],
            [1112, 816, 88, 88, function() {PixelTanks.switchTab('classTab')}, true],
            [400, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 1)}, true],
            [488, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 2)}, true],
            [576, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 3)}, true],
            [664, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 4)}, true],
            [756, 220, 88, 88, function() {PixelTanks.switchTab('cosmeticTab')}, true],
            [532, 220, 88, 88, function() {PixelTanks.switchTab('deathEffectsTab')}, true],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              if (this.classTab) {
                if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = false;
                for (let xm = 0; xm < 2; xm++) {
                  for (let ym = 0; ym < 3; ym++) {
                    if (collision(x, y, 0, 0, [702, 810][xm], [348, 456, 564][ym], 88, 88)) {
                      if (PixelTanks.userData.classes[[[0, 5, 3], [1, 4, 2]][xm][ym]]) {
                        PixelTanks.userData.class = [['tactical', 'fire', 'medic'], ['stealth', 'builder', 'warrior']][xm][ym];
                      } else alert('You need to buy this first!');
                      return;
                    }
                  }
                }
              } else if (this.itemTab) {
                if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = false;
                const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], fortress: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], mine: [904, 570]};
                for (const item in key) {
                  if (collision(x, y, 0, 0, key[item][0], key[item][1], 80, 80)) {
                    if (!PixelTanks.userData.items.includes(item)) {
                      PixelTanks.userData.items[this.currentItem-1] = item;
                    } else alert('You are not allowed to have more than 1 of the same item');
                    return;
                  }
                }
              } else if (this.cosmeticTab) {
                if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.cosmeticTab = false;
                for (let i = 0; i < 16; i++) {
                  if (collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                    if (e.button === 0) {
                      PixelTanks.userData.cosmetic = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i];
                    } else {
                      PixelTanks.userData.cosmetics.splice(this.cosmeticMenu*16+i, 1);
                    }
                    return;
                  }
                }
              } else if (this.deathEffectsTab) {
                if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.deathEffectsTab = false;
                for (let i = 0; i < 16; i++) {
                  if (collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                    if (e.button === 0) {
                      PixelTanks.userData.deathEffect = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i];
                    } else {
                      PixelTanks.userData.deathEffects.splice(this.deathEffectsMenu*16+i, 1);
                    }
                    return;
                  }
                }
              }
            },
            mousemove: function(e) {
              this.target = {x: e.clientX-window.innerWidth/2, y: e.clientY-window.innerHeight/2};
            },
            keydown: function(e) {
              if (e.key.length === 1 && this.color.length < 7) {
                this.color += e.key;
                PixelTanks.userData.color = this.color;
              }
              if (e.keyCode === 8) this.color = this.color.slice(0, -1);
              if (this.cosmeticTab) {
                if (e.keyCode === 37 && this.cosmeticMenu > 0) this.cosmeticMenu--;
                if (e.keyCode === 39 && this.cosmeticMenu+1 !== Math.ceil(PixelTanks.userData.cosmetics.length/16)) this.cosmeticMenu++;
              }
            }
          },
          cdraw: function() {
            if (!this.target) {
              this.time = Date.now();
              this.color = PixelTanks.userData.color;
              this.target = {x: 0, y: 0};
              this.cosmeticMenu = 0;
              this.deathEffectsMenu = 0;
            }
            const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
            const coinsUP = (rank+1)*1000, xpUP = (rank+1)*100;
            GUI.draw.fillStyle = this.color;
            GUI.draw.fillRect(1008, 260, 32, 32);
            GUI.drawText(this.color, 1052, 260, 30, '#000000', 0);
            GUI.drawText(PixelTanks.user.username, 300, 420, 80, '#000000', .5);
            GUI.drawText('Coins: '+coins, 300, 500, 50, '#FFE900', .5);
            GUI.drawText('Rank: '+rank, 300, 550, 50, '#FF2400', .5);
            GUI.drawText('Level Up Progress', 1400, 400, 50, '#000000', .5);
            GUI.drawText((rank < 20 ? coins+'/'+coinsUP : 'MAXED')+' Coins', 1400, 500, 50, rank < 20 ? (coins < coinsUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
            GUI.drawText((rank < 20 ? xp+'/'+xpUP : 'MAXED')+' XP', 1400, 550, 50, rank < 20 ? (xp < xpUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
            if (coins < coinsUP || xp < xpUP || rank > 19) {
              GUI.draw.fillStyle = '#000000';
              GUI.draw.globalAlpha = .7;
              GUI.draw.fillRect(1064, 458, 88, 88);
              GUI.draw.globalAlpha = 1;
            }
            for (let i = 0; i < 4; i++) GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], [404, 492, 580, 668][i], 820, 80, 80, 1);
            PixelTanks.renderBottom(680, 380, 240, PixelTanks.userData.color);
            GUI.drawImage(PixelTanks.images.tanks.bottom, 680, 380, 240, 240, 1);
            PixelTanks.renderTop(680, 380, 240, PixelTanks.userData.color, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            const key = {tactical: [7, 7], fire: [7, 61], medic: [7, 115], stealth: [61, 7], builder: [61, 61], warrior: [61, 115]};
            if (PixelTanks.userData.class) GUI.drawImage(PixelTanks.images.menus.classTab, 1112, 816, 88, 88, 1, 0, 0, 0, 0, undefined, key[PixelTanks.userData.class][0], key[PixelTanks.userData.class][1], 44, 44);
            if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 760, 224, 80, 80, 1);
            const deathEffectData = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect+'_'];
            if (PixelTanks.userData.deathEffect) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect], 536, 224, 80, 80, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/deathEffectData.speed)%deathEffectData.frames)*200, 0, 200, 200);
            Menus.menus.inventory.buttonEffect = true;
            if (this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
              Menus.menus.inventory.buttonEffect = false;
              GUI.drawImage(PixelTanks.images.blocks.void, 0, 0, 1600, 1600, .7);
            }
            if (this.classTab) {
              GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
              GUI.draw.strokeStyle = '#FFFF00';
              GUI.draw.lineWidth = 10;
              if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88); else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88); else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88); else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(814, 348, 88, 88); else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(814, 456, 88, 88); else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(814, 565, 88, 88);
            } else if (this.itemTab) {
              GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
              const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], fortress: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], mine: [904, 570]};
              for (const item in key) GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
            } else if (this.cosmeticTab) {
              const a = this.cosmeticMenu === 0, b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length/16);
              GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
              for (let i = this.cosmeticMenu*16; i < Math.min((this.cosmeticMenu+1)*16, PixelTanks.userData.cosmetics.length); i++) {
                GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetics[i]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1);
                if (PixelTanks.userData.cosmetics[i] === PixelTanks.userData.cosmetic) {
                  GUI.draw.strokeStyle = '#FFFF22';
                  GUI.draw.lineWidth = 10;
                  GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
                }
              }
            } else if (this.deathEffectsTab) {
              const a = this.deathEffectsMenu === 0, b = this.deathEffectsMenu === Math.floor(PixelTanks.userData.deathEffects.length/16);
              GUI.drawImage(PixelTanks.images.menus.deathEffectsTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
              for (let i = this.deathEffectsMenu*16; i < Math.min((this.deathEffectsMenu+1)*16, PixelTanks.userData.deathEffects.length); i++) {
                const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]+'_'];
                GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/d.speed)%d.frames)*200, 0, 200, 200);
                if (PixelTanks.userData.deathEffects[i] === PixelTanks.userData.deathEffect) {
                  GUI.draw.strokeStyle = 0xffff22;
                  GUI.draw.lineWidth = 10;
                  GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
                }
              }
            }
          },
        },
        shop: {
          buttons: [
            [416, 20, 108, 108, 'main', true],
            [232, 208, 488, 96, function() {/* class tab */}, true],
            [880, 208, 488, 96, function() {/* ded tab */}, true],
            [496, 404, 176, 176, function() {PixelTanks.purchase(0)}, true],
            [712, 404, 176, 176, function() {PixelTanks.purchase(1)}, true],
            [928, 404, 176, 176, function() {PixelTanks.purchase(4)}, true],
            [496, 620, 176, 176, function() {PixelTanks.purchase(2)}, true],
            [712, 620, 176, 176, function() {PixelTanks.purchase(5)}, true],
            [928, 620, 176, 176, function() {PixelTanks.purchase(3)}, true],
          ],
          listeners: {},
          cdraw: function() {
            GUI.drawText(PixelTanks.userData.stats[0]+' coinage', 800, 350, 50, 0x000000, 0.5);
          },
        },
        pause: {
          buttons: [[128, 910, 1460, 76, function() {
            PixelTanks.user.player.implode();
            Menus.trigger('main');
          }, true]],
          listeners: {},
          cdraw: () => {},
        },
      }

      for (const m in Menus.menus) Menus.menus[m] = new Menu(Menus.menus[m], m);
      PixelTanks.socket = new MegaSocket(window.location.protocol === 'https:' ? 'wss://'+window.location.hostname : 'ws://141.148.128.231', {keepAlive: true, reconnect: true, autoconnect: true});
    }

    static launch() {
      setTimeout(() => Menus.trigger('start'), 200);
    }

    static save() {
      try {
        const temp = PixelTanks.playerData;
        temp['pixel-tanks'] = PixelTanks.userData;
        Network.update('playerdata', JSON.stringify(temp));
      } catch (e) {
        console.error('Save Error:' + e)
      }
    }

    static getData(callback) {
        Network.get(data => {
          const {'pixel-tanks': userData, ...playerData} = JSON.parse(data.playerdata);
          PixelTanks.userData = userData;
          PixelTanks.playerData = playerData;
          if (!PixelTanks.userData) {
            PixelTanks.userData = {
              username: PixelTanks.user.username,
              class: '',
              cosmetic: '',
              cosmetics: [],
              deathEffect: '',
              deathEffects: [],
              color: '#ffffff',
              stats: [
                1000000, // coins
                0, // crates
                1, // level
                0, // xp
                20, // rank
              ],
              classes: [
                false, // tactical
                false, // stealth
                false, // warrior
                false, // medic
                false, // builder
                false, // fire
              ],
              items: ['duck_tape', 'weak', 'bomb', 'flashbang'],
              keybinds: {
                items: [49, 50, 51, 52],
                emotes: [53, 54, 55, 56, 57, 48],    
              },
            };
          }
          clearInterval(PixelTanks.autosave);
          PixelTanks.autosave = setInterval(() => PixelTanks.save(), 5000);
          callback();
        });
    }

    static auth(u, p, t) {
      Network.auth(u, p, t, () => {
        PixelTanks.getData(() => Menus.trigger(t === 'login' ? 'main' : 'htp1'));
      });
    }

    static switchTab(id, n) {
      if (!Menus.menus.inventory.healthTab && !Menus.menus.inventory.classTab && !Menus.menus.inventory.itemTab && !Menus.menus.inventory.cosmeticTab) Menus.menus.inventory[id] = true;
      if (n) Menus.menus.inventory.currentItem = n;
      Menus.redraw();
    } // OPTIMIZE
    
    static openCrate(type) {
      try {
      const price = type ? 5 : 1, name = type ? 'deathEffects' : 'cosmetics', rand = Math.floor(Math.random()*1001), crate = [{
        common: ['X', 'Red Hoodie', 'Devil Wings', 'Devil Horns', 'Exclaimation Point', 'Orange Hoodie', 'Yellow Hoodie', 'Green Hoodie', 'Leaf', 'Blue Hoodie', 'Purple Hoodie', 'Purple Flower', 'Boost', 'Cancelled', 'Spirals', 'Laff', 'Speaker', 'Spikes', 'Bat Wings', 'Christmas Tree', 'Candy Cane', 'Pumpkin Face', 'Top Hat', 'Mask', 'Purple-Pink Hoodie', 'Bunny Ears', 'Red Ghost', 'Blue Ghost', 'Pink Ghost', 'Orange Ghost'],
        uncommon: ['Apple', 'Pumpkin', 'Basketball', 'Banana', 'Pickle', 'Blueberry', 'Eggplant', 'Peace', 'Question Mark', 'Small Scratch', 'Kill = Ban', 'Headphones', 'Reindeer Hat', 'Pumpkin Hat', 'Cat Ears', 'Cake', 'Cat Hat', 'First Aid', 'Fisher Hat'],
        rare: ['Hax', 'Tools', 'Money Eyes', 'Dizzy', 'Checkmark', 'Sweat', 'Scared', 'Blue Tint', 'Purple Top Hat', 'Purple Grad Hat', 'Eyebrows', 'Helment', 'Rudolph', 'Candy Corn', 'Flag', 'Swords'],
        epic: ['Rage', 'Onfire', 'Halo', 'Police', 'Deep Scratch', 'Back Button', 'Controller', 'Assassin', 'Astronaut', 'Christmas Lights', 'No Mercy', 'Error'],
        legendary: ['Redsus', 'Uno Reverse', 'Christmas Hat', 'Mini Tank', 'Paleontologist', 'Yellow Pizza'],
        mythic: ['Terminator', 'MLG Glasses'],
      }, {
        common: ['explode', 'nuke', 'evan'],
        uncommon: ['anvil', 'insta'],
        rare: ['amogus', 'minecraft', 'magic'],
        epic: ['wakawaka', 'battery'],
        legendary: ['error', 'enderman'],
        mythic: ['clicked', 'cat'],
      }];
      let rarity;
      if (rand < 1) { // .1%
        rarity = 'mythic';
      } else if (rand < 10) { // .9%
        rarity = 'legendary';
      } else if (rand < 50) { // 4%
        rarity = 'epic';
      } else if (rand < 150) { // 10%
        rarity = 'rare';
      } else if (rand < 300) { // 15%
        rarity = 'uncommon';
      } else { // 70%
        rarity = 'common'; 
      }
      if (PixelTanks.userData.stats[1] < price) return alert('Your broke boi!');
      PixelTanks.userData.stats[1] -= price; 
      let number = Math.floor(Math.random()*(crate[type][rarity].length)), item;
      for (const e in this.images[name]) if (e === crate[type][rarity][number]) item = this.images[name][e];
      if (item === undefined) document.write('Game Crash!<br>Crashed while trying to give you cosmetic id "'+crate[type][rarity][number]+'". Report this to cs641311, bradley, or Celestial.');
      Menus.removeListeners();
      const start = Date.now(), render = setInterval(function() {
        GUI.clear();
        if (type) GUI.drawImage(item, 600, 400, 400, 400, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-start)/PixelTanks.images[name][crate[type][rarity][number]+'_'].speed)%PixelTanks.images[name][crate[type][rarity][number]+'_'].frames)*200, 0, 200, 200);
        if (!type) GUI.drawImage(item, 600, 400, 400, 400, 1);
        GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
        GUI.drawText(crate[type][rarity][number], 800, 800, 50, '#ffffff', 0.5);
        GUI.drawText(rarity, 800, 900, 30, {mythic: '#FF0000', legendary: '#FFFF00', epic: '#A020F0', rare: '#0000FF', uncommon: '#32CD32', common: '#FFFFFF'}[rarity], 0.5);
      }, 15);
      setTimeout(() => {
        clearInterval(render);
        Menus.trigger('crate');
      }, 5000);
      PixelTanks.userData[name].push(crate[type][rarity][number]);
      PixelTanks.save();
      } catch(e) {alert(e)}
    }

    static upgrade() {
      const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
      if (coins < (rank+1)*1000 || xp < (rank+1)*100) return alert('Your broke boi!');
      if (rank >= 20) return alert('You are max level!');
      PixelTanks.userData.stats[0] -= (rank+1)*1000;
      PixelTanks.userData.stats[3] -= (rank+1)*100;
      PixelTanks.userData.stats[4]++;
      PixelTanks.save();
      alert('You Leveled Up to '+(rank+1));
    }

    static renderBottom(x, y, s, color, a=0) {
      GUI.draw.translate(x+40/80*s, y+40/80*s);
      GUI.draw.rotate(a*Math.PI/180);
      GUI.draw.fillStyle = color;
      GUI.draw.beginPath();
      GUI.draw.moveTo(-20/80*s, -32/80*s);
      GUI.draw.lineTo(20/80*s, -32/80*s);
      GUI.draw.lineTo(20/80*s, 32/80*s);
      GUI.draw.lineTo(-20/80*s, 32/80*s); 
      GUI.draw.lineTo(-20/80*s, -32/80*s);
      GUI.draw.fill();
      GUI.draw.rotate(-a*Math.PI/180);
      GUI.draw.translate(-x-40/80*s, -y-40/80*s);
    }

    static renderTop(x, y, s, color, a=0, p=0) {
      GUI.draw.translate(x+40/80*s, y+40/80*s);
      GUI.draw.rotate(a*Math.PI/180);
      GUI.draw.fillStyle = color;
      GUI.draw.beginPath();
      GUI.draw.moveTo(-11/80*s, p+48/80*s);
      GUI.draw.lineTo(-11/80*s, p+28/80*s);
      GUI.draw.lineTo(-16/80*s, p+28/80*s);
      GUI.draw.lineTo(-27/80*s, p+17/80*s);
      GUI.draw.lineTo(-27/80*s, p-16/80*s);
      GUI.draw.lineTo(-16/80*s, p-27/80*s);
      GUI.draw.lineTo(17/80*s, p-27/80*s);
      GUI.draw.lineTo(28/80*s, p-16/80*s);
      GUI.draw.lineTo(28/80*s, p+17/80*s);
      GUI.draw.lineTo(17/80*s, p+28/80*s);
      GUI.draw.lineTo(12/80*s, p+28/80*s);
      GUI.draw.lineTo(12/80*s, p+48/80*s);
      GUI.draw.lineTo(-11/80*s, p+48/80*s);
      GUI.draw.fill();
      GUI.draw.rotate(-a*Math.PI/180);
      GUI.draw.translate(-x-40/80*s, -y-40/80*s);
    }

    static purchase(stat) {
      // since u can like only buy classes the number relates to the index of the true/false value in the PixelTanks.userData.classes to determine whether you have it or not
      const prices = [
        70000, // tactical
        30000, // stealth
        80000, // warrior
        40000, // medic
        60000, // builder
        90000, // fire
      ];
      if (PixelTanks.userData.classes[stat]) return alert('You already bought this.');
      if (PixelTanks.userData.stats[0] < prices[stat]) return alert('Your brok boi.');
      PixelTanks.userData.stats[0] -= prices[stat];
      PixelTanks.userData.classes[stat] = true;
    }
  }

  class Tank {
    constructor(ip, multiplayer, gamemode) {
      this.xp = 0;
      this.crates = 0;
      this.kills = 0;
      this.coins = 0;
      this.lastUpdate = {};
      this.hostupdate = {
        b: [],
        s: [],
        pt: [],
        d: [],
        ai: [],
        logs: [],
        tickspeed: -1,
      };
      this.paused = false;
      this.speed = 4;
      this.key = [];
      this.left = null;
      this.up = null;
      this.canGrapple = true;
      this.showChat = false;
      this.msg = '';
      this.multiplayer = multiplayer;
      this.tank = {use: [], fire: [], r: 0, x: 0, y: 0};
      this.tank.invis = PixelTanks.userData.class === 'stealth';
      this.ops = 0;
      this.ups = 0;
      this.fps = 0;
      this.ping = 0;
      this.debug = '';
      this.reset();

      const joinData = {
        username: PixelTanks.user.username,
        token: PixelTanks.user.token,
        type: 'join',
        gamemode: gamemode,
        tank: {
          rank: PixelTanks.userData.stats[4],
          username: PixelTanks.user.username,
          class: PixelTanks.userData.class,
          cosmetic: PixelTanks.userData.cosmetic,
          deathEffect: PixelTanks.userData.deathEffect,
          color: PixelTanks.userData.color,
        },
      }

      if (multiplayer) {
        this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+ip, {keepAlive: false, reconnect: false, autoconnect: true});
        this.socket.on('message', data => {
          switch (data.event) {
            case 'hostupdate':
              this.ups++;
              this.hostupdate.tickspeed = data.tickspeed;
              this.hostupdate.global = data.global;
              this.hostupdate.logs = data.logs.reverse();
              ['pt', 'b', 's', 'ai', 'd'].forEach(p => {
                if (data[p].length) data[p].forEach(e => {
                 const index = this.hostupdate[p].findIndex(obj => obj.id === e.id);
                 if (index !== -1) {
                   this.hostupdate[p][index] = e;
                 } else {
                   this.hostupdate[p].push(e);
                 }
                });
                if (data.delete[p].length) this.hostupdate[p] = this.hostupdate[p].filter(e => !data.delete[p].includes(e.id));
              });
              break;
            case 'ded':
              this.reset();
              break;
            case 'gameover':
              this.implode();
              if (data.type === 'victory') {
                Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
                Menus.trigger('victory');
              } else {
                Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
                Menus.trigger('defeat');
              }
              break;
            case 'override':
              data.data.forEach(d => {
                this.tank[d.key] = d.value;
              });
              if (this.dx) {
                this.dx.t = Date.now();
                this.dx.o = this.tank.x;
              }
              if (this.dy) {
                this.dy.t = Date.now();
                this.dy.o = this.tank.y;
              }
              break;
            case 'kill':
              const crates = Math.floor(Math.random()*2)+1, coins = Math.floor(Math.random()*1000);
              this.kills++;
              this.xp += 10;
              this.crates += crates;
              this.coins += coins;
              PixelTanks.userData.stats[1] += crates;
              PixelTanks.userData.stats[3] += 10;
              PixelTanks.userData.stats[0] += coins;
              PixelTanks.save();
              this.canItem0 = true;
              this.canItem1 = true;
              this.canItem2 = true;
              this.canItem3 = true;
              this.canToolkit = true;
              this.timers.toolkit = -1;
              this.timers.items = [{time: 0, cooldown: -1}, {time: 0, cooldown: -1,}, {time: 0, cooldown: -1}, {time: 0, cooldown: -1}]
              break;
            case 'ping':
              if (data.id === this.pingId) this.ping = Date.now()-this.pingStart;
              break;
          }
        });

        this.socket.on('connect', () => {
          this.socket.send(joinData);
          setInterval(this.send.bind(this), 1000/30);
        });
      } else {
        this.world = new Singleplayer(ip);
        setTimeout(() => {
          this.world.add(joinData.tank);
          setInterval(this.send.bind(this), 1000/60);
        });
      }
      this.pinger = setInterval(() =>  {
        if (multiplayer) {
          this.pingId = Math.random();
          this.pingStart = Date.now();
          this.socket.send({type: 'ping', id: this.pingId});
        }
        this.debug = 'T='+this.hostupdate.tickspeed+' P='+this.ping+' F='+this.fps+' U='+this.ups+' O='+this.ops;
        this.ops = 0;
        this.ups = 0;
        this.fps = 0;
      }, 1000);

      document.addEventListener('keydown', this.keydown.bind(this));
      document.addEventListener('keyup', this.keyup.bind(this));
      document.addEventListener('mousemove', this.mousemove.bind(this));
      document.addEventListener('mousedown', this.mousedown.bind(this));
      document.addEventListener('mouseup', this.mouseup.bind(this));
      this.render = requestAnimationFrame(this.frame.bind(this));
    }

    reset() {
      const time = new Date('Nov 28 2006').getTime();
      this.timers = {
        boost: time,
        powermissle: time,
        toolkit: time,
        class: {time: time, cooldown: -1},
        items: [{time: time, cooldown: -1}, {time: time, cooldown: -1,}, {time: time, cooldown: -1}, {time: time, cooldown: -1}],
      };
      this.fireType = 1;
      this.halfSpeed = false;
      this.canClass = true;
      this.canFire = true;
      this.canBoost = true;
      this.canToolkit = true;
      this.canPowermissle = true;
      this.canItem0 = true;
      this.canItem1 = true;
      this.canItem2 = true;
      this.canItem3 = true;
      this.canGrapple = true;
      this.kills = 0;
    }

    drawBlock(b) {
      const size = b.type === 'airstrike' ? 200 : 100;
      const type = ['airstrike', 'fire'].includes(b.type) && getTeam(this.team) === getTeam(b.team) ? 'friendly'+b.type : b.type;
      GUI.drawImage(PixelTanks.images.blocks[type], b.x, b.y, size, size, 1);
    }

    drawShot(s) {
      if (s.type == 'bullet') {
        GUI.drawImage(PixelTanks.images.blocks.void, s.x, s.y, 10, 10, .7, 5, 5, 0, 0, s.r+180);
      } else if (['powermissle', 'healmissle'].includes(s.type)) {
        GUI.drawImage(PixelTanks.images.bullets.powermissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+180);
      } else if (s.type === 'megamissle') {
        GUI.drawImage(PixelTanks.images.bullets.megamissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+180);
      } else if (s.type === 'shotgun') {
        GUI.drawImage(PixelTanks.images.bullets.shotgun, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+180);
      } else if (s.type === 'grapple') {
        GUI.drawImage(PixelTanks.images.bullets.grapple, s.x, s.y, 45, 45, 1, 22.5, 22.5, 0, 0, s.r+180);
        GUI.draw.lineWidth = 10;
        GUI.draw.beginPath();
        GUI.draw.strokeStyle = '#A9A9A9';
        GUI.draw.moveTo(s.x, s.y);
        const t = this.hostupdate.pt.find(t => t.username === s.team.split(':')[0]);
        if (t) GUI.draw.lineTo(t.x+40, t.y+40);
        GUI.draw.stroke();
      } else if (s.type === 'dynamite') {
        GUI.drawImage(PixelTanks.images.bullets.dynamite, s.x, s.y, 10, 40, 1, 5, 5, 0, 0, s.r+180);
      } else if (s.type === 'fire') {
        GUI.drawImage(PixelTanks.images.bullets.fire, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+180);
      }
    }

    drawExplosion(e) {
      GUI.drawImage(PixelTanks.images.animations.explosion, e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, e.f*50, 0, 50, 50);
    }

    drawAI(ai) {
      const {x, y, role, r, baseRotation, baseFrame, pushback, cosmetic, hp, maxHp, color} = ai;
      if (role !== 0) PixelTanks.renderBottom(x, y, 80, color);
      GUI.drawImage(PixelTanks.images.tanks[role === 0 ? 'base' : 'bottom'+(baseFrame ? '' : '2')], x, y, 80, 80, 1, 40, 40, 0, 0, baseRotation);
      if (ai.fire) GUI.drawImage(PixelTanks.images.animations.fire, x, y, 80, 80, 1, 0, 0, 0, 0, undefined, ai.fire.frame*29, 0, 29, 29);
      PixelTanks.renderTop(x, y, 80, color, r, pushback);
      GUI.drawImage(PixelTanks.images.tanks.top, x, y, 80, 90, 1, 40, 40, 0, pushback, r);
      if (cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[cosmetic], x, y, 80, 90, 1, 40, 40, 0, pushback, r);
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(x-2, y+98, 84, 11);
      GUI.draw.fillStyle = '#00FF00';
      GUI.draw.fillRect(x, y+100, 80*hp/maxHp, 5);
      GUI.drawText('['+role+'] AI Bot', x+40, y-25, 50, '#ffffff', 0.5);
      GUI.draw.fillStyle = '#ffffff';
      if (ai.damage) {
        for (let i = 0; i < 2; i++) {
          GUI.drawText((ai.damage.d < 0 ? '+' : '-')+Math.round(ai.damage.d), ai.damage.x, ai.damage.y, Math.round(ai.damage.d/5)+[20, 15][i], ['#ffffff', getTeam(this.team) === getTeam(ai.team) ? '#ff0000' : '#0000ff'][i], 0.5);
        }
      }
    }

    drawTank(t) {
      if (t.class === 'medic' && !t.ded) {
        GUI.draw.fillStyle = '#00FF00';
        GUI.draw.beginPath();
        GUI.draw.globalAlpha = .1;
        GUI.draw.arc(t.x+40, t.y+40, 250, 0, 2*Math.PI);
        GUI.draw.fill();
        GUI.draw.globalAlpha = 1;
      }
      const p = t.username === PixelTanks.user.username;
      let a = 1;
      if (t.invis && !p) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 ? 0 : .2;
      if ((t.invis && p) || t.ded) a = .5;
      GUI.draw.globalAlpha = a;
      PixelTanks.renderBottom(t.x, t.y, 80, t.color, t.baseRotation);
      GUI.drawImage(PixelTanks.images.tanks['bottom'+(t.baseFrame ? '' : '2')], t.x, t.y, 80, 80, a, 40, 40, 0, 0, t.baseRotation);
      if (t.fire) GUI.drawImage(PixelTanks.images.animations.fire, t.x, t.y, 80, 80, 1, 0, 0, 0, 0, undefined, t.fire.frame*29, 0, 29, 29);
      GUI.draw.globalAlpha = a;
      PixelTanks.renderTop(t.x, t.y, 80, t.color, t.r, t.pushback);
      GUI.drawImage(PixelTanks.images.tanks.top, t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
      if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
      if ((!t.ded && getTeam(this.team) === getTeam(t.team)) || (PixelTanks.userData.class === 'tactical' && !t.ded && !t.invis) || (PixelTanks.userData.class === 'tactical' && !t.ded && Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) < 200)) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(t.x-2, t.y+98, 84, 11);
        GUI.draw.fillStyle = '#FF0000';
        GUI.draw.fillRect(t.x, t.y+100, 80*Math.min(t.hp+t.damage?.d, t.maxHp)/t.maxHp, 5);
        GUI.draw.fillStyle = '#00FF00';
        GUI.draw.fillRect(t.x, t.y+100, 80*t.hp/t.maxHp, 5);
      }
      if (t.invis && t.username !== PixelTanks.user.username) return;

      var username = '['+t.rank+'] '+t.username;
      if (t.team.split(':')[1].includes('@leader')) {
        username += ' ['+t.team.split(':')[1].replace('@leader', '')+'] (Leader)'
      } else if (t.team.split(':')[1].includes('@requestor#')) {
        username += ' [Requesting...] ('+t.team.split(':')[1].split('@requestor#')[1]+')';
      } else if (new Number(t.team.split(':')[1]) < 1) {} else {
        username += ' ['+t.team.split(':')[1]+']';
      }

      GUI.drawText(username, t.x+40, t.y-25, 50, '#ffffff', 0.5);

      if (t.shields > 0 && (!t.invis || (t.invis && p))) {
        GUI.draw.beginPath();
        GUI.draw.fillStyle = '#7DF9FF';
        GUI.draw.globalAlpha = (t.shields/100)*.4; // .2 max, .1 min
        GUI.draw.arc(t.x+40, t.y+40, 66, 0, 2*Math.PI);
        GUI.draw.fill();
        GUI.draw.globalAlpha = 1;
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(t.x-2, t.y+113, 84, 11);
        GUI.draw.fillStyle = '#00FFFF';
        GUI.draw.fillRect(t.x, t.y+115, 80*t.shields/100, 5);
      }

      if (t.buff) GUI.drawImage(PixelTanks.images.tanks.buff, t.x-5, t.y-5, 80, 80, .2);
      if (t.damage) {
        const {x, y, d} = t.damage;
        for (let i = 0; i < 2; i++) {
          GUI.drawText((d < 0 ? '+' : '-')+Math.round(d), x, y, Math.round(d/5)+[20, 15][i], ['#ffffff', getTeam(this.team) === getTeam(t.team) ? '#ff0000' : '#0000ff'][i], 0.5);
        }
      }
      
      if (t.emote) {
        GUI.drawImage(PixelTanks.images.emotes.speech, t.x+90, t.y-15, 100, 100, 1);
        GUI.drawImage(PixelTanks.images.emotes[t.emote.a], t.x+90, t.y-15, 100, 100, 1, 0, 0, 0, 0, undefined, t.emote.f*50, 0, 50, 50);
      }

      if (t.dedEffect) {
        const {speed, frames, kill} = PixelTanks.images.deathEffects[t.dedEffect.id+'_'];
        if (t.dedEffect.time/speed > frames) return;
        if (t.dedEffect.time/speed < kill) {
          GUI.drawImage(PixelTanks.images.tanks.bottom, t.dedEffect.x, t.dedEffect.y, 80, 80, 1, 40, 40, 0, 0, 0);
          GUI.drawImage(PixelTanks.images.tanks.destroyed, t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
        }
        GUI.drawImage(PixelTanks.images.deathEffects[t.dedEffect.id], t.dedEffect.x-60, t.dedEffect.y-60, 200, 200, 1, 0, 0, 0, 0, undefined, Math.floor(t.dedEffect.time/speed)*200, 0, 200, 200);
      }

      if (t.animation) GUI.drawImage(PixelTanks.images.animations[t.animation.id], t.x, t.y, 80, 90, 1, 0, 0, 0, 0, undefined, t.animation.frame*40, 0, 40, 45);
    }

    frame() {
      this.render = requestAnimationFrame(this.frame.bind(this));
      GUI.clear();
      if (this.hostupdate.pt.length === 0) {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.fillRect(0, 0, 1600, 1600);
        return  GUI.drawText('Loading Terrain', 800, 500, 100, '#000000', 0.5);
      }
      if (this.multiplayer) if (this.socket.status !== 'connected' ) {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.fillRect(0, 0, 1600, 1600);
        return GUI.drawText('Server Closed', 800, 500, 100, '#000000', 0.5);
      }
      this.fps++;
      const t = this.hostupdate.pt, b = this.hostupdate.b, s = this.hostupdate.s, a = this.hostupdate.ai, e = this.hostupdate.d;
      if (this.dx) {
        var x = this.dx.o+Math.floor((Date.now()-this.dx.t)/15)*this.dx.a*this.speed*(this.halfSpeed ? .5 : (this.buffed ? 1.5 : 1));
        if (this.collision(x, this.tank.y)) {
          this.tank.x = x;
          this.left = this.dx.a < 0;
        } else this.left = null;
        this.dx.t = Date.now()-(Date.now()-this.dx.t)%15;
        this.dx.o = this.tank.x;
      }
      if (this.dy) {
        var y = this.dy.o+Math.floor((Date.now()-this.dy.t)/15)*this.dy.a*this.speed*(this.halfSpeed ? .5 : (this.buffed ? 1.5 : 1));
        if (this.collision(this.tank.x, y)) {
          this.tank.y = y;
          this.up = this.dy.a < 0;
        } else this.up = null;
        this.dy.t = Date.now()-(Date.now()-this.dy.t)%15;
        this.dy.o = this.tank.y;
      }
      if (this.b) this.tank.baseFrame = ((this.b.o ? 0 : 1)+Math.floor((Date.now()-this.b.t)/60))%2;
      this.tank.baseRotation = (this.left === null) ? (this.up ? 180 : 0) : (this.left ? (this.up === null ? 90 : (this.up ? 135 : 45)) : (this.up === null ? 270 : (this.up ? 225: 315)));
      const player = t.find(tank => tank.username === PixelTanks.user.username);
      if (player) {
        player.x = this.tank.x;
        player.y = this.tank.y;
        player.r = this.tank.r;
        player.baseRotation = this.tank.baseRotation;
        player.baseFrame = this.tank.baseFrame;
        this.team = player.team;
        this.ded = player.ded;
      }
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, (-player.x+760)*PixelTanks.resizer, (-player.y+460)*PixelTanks.resizer);

      GUI.drawImage(PixelTanks.images.blocks.floor, 0, 0, 3000, 3000, 1);

      b.forEach(block => this.drawBlock(block));
      s.forEach(shot => this.drawShot(shot));
      a.forEach(ai => this.drawAI(ai));
      t.forEach(tank => this.drawTank(tank));
      for (const block of b) {
        if (block.s) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.fillRect(block.x-2, block.y+108, 104, 11);
          GUI.draw.fillStyle = '#0000FF';
          GUI.draw.fillRect(block.x, block.y+110, 100*block.hp/block.maxHp, 5);
        }
      }
      e.forEach(e => this.drawExplosion(e));
      
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      GUI.drawImage(PixelTanks.images.menus.ui, 0, 0, 1600, 1000, 1);
      GUI.draw.fillStyle = PixelTanks.userData.color;
      GUI.draw.globalAlpha = 0.5;
      const c = [500, 666, 832, 998];
      for (let i = 0; i < 4; i++) {
        GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], c[i], 900, 100, 100, 1);
        if (!this['canItem'+i]) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.globalAlpha = .5;
          GUI.draw.fillRect(c[i], 900, 100, 100);
        } else {
          GUI.draw.fillStyle = '#FFFFFF';
          GUI.draw.globalAlpha = .25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers.items[i].time+this.timers.items[i].cooldown))%4000)/1000)-3)));
          GUI.draw.fillRect(c[i], 900, 100, 100);
        }
        GUI.draw.globalAlpha = 1;
        GUI.draw.fillStyle = PixelTanks.userData.color;
        GUI.draw.fillRect(c[i], 900+Math.min((Date.now()-this.timers.items[i].time)/this.timers.items[i].cooldown, 1)*100, 100, 100);
      }
      GUI.drawImage(PixelTanks.images.items["powermissleui"], 422, 950, 50, 50, 1);
      GUI.drawImage(PixelTanks.images.items["toolkitui"], 1127, 950, 50, 50, 1);
      GUI.drawImage(PixelTanks.images.items["boostui"], 1205, 950, 50, 50, 1);
      for (let i = 0; i < 3; i++) {
        GUI.draw.fillRect([422, 1127, 1205][i], 950+Math.min((Date.now()-this.timers[['powermissle', 'toolkit', 'boost'][i]])/[10000, 40000, 5000][i], 1)*50, 50, 50);
      }
      GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.class+"ui"], 345, 950, 50, 50, 1);
      GUI.draw.fillRect(345, 950+Math.min((Date.now()-this.timers.class.time)/this.timers.class.cooldown, 1)*50, 50, 50);
      GUI.draw.globalAlpha = 1;

      GUI.draw.fillStyle = '#000000';
      GUI.draw.globalAlpha = .2;
      GUI.draw.fillRect(0, 0, 180, 250);
      GUI.draw.globalAlpha = 1;
      GUI.drawText(this.debug, 10, 20, 30, '#ffffff', 0);
      GUI.drawText('Killstreak: '+this.kills, 10, 50, 30, '#ffffff', 0);
      GUI.drawText('Crates: '+this.crates, 10, 100, 30, '#ffffff', 0);
      GUI.drawText('XP: '+this.xp, 10, 150, 30, '#ffffff', 0);
      GUI.drawText('coin$: '+this.coins, 10, 200, 30, '#ffffff', 0);
      if (this.hostupdate.global) GUI.drawText(this.hostupdate.global, 800, 30, 60, '#ffffff', .5);

      var l = 0, len = Math.min((this.showChat || this.hostupdate.logs.length<3) ? this.hostupdate.logs.length : 3, 30);
      while (l<len) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .2;
        GUI.draw.fillRect(0, 800-l*30, GUI.draw.measureText(this.hostupdate.logs[l].m).width, 30);
        GUI.draw.globalAlpha = 1;
        GUI.drawText(this.hostupdate.logs[l].m, 0, 800-l*30, 30, this.hostupdate.logs[l].c, 0);
        l++;
      }

      if (this.showChat) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .2;
        GUI.draw.fillRect(0, 830, GUI.draw.measureText(this.msg).width, 30);
        GUI.draw.globalAlpha = 1;
        GUI.drawText(this.msg, 0, 830, 30, '#ffffff', 0);
      }

      if (player.flashbanged) {
        GUI.draw.fillStyle = '#FFFFFF';
        GUI.draw.fillRect(0, 0, 1600, 1000);
      }
      
      if (this.paused) {
        GUI.draw.globalAlpha = .7;
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(0, 0, 1600, 1000);
        GUI.draw.globalAlpha = 1;
        Menus.menus.pause.draw([1200, 0, 400, 1000]);
      }
    }

    chat(e) {
      if (e.key.length === 1) this.msg += e.key;
      if (e.keyCode === 8) this.msg = this.msg.slice(0, -1);
      if (e.keyCode === 13) {
        if (this.msg !== '') {
          this.socket.send(this.msg.charAt(0) === '/' ? {type: 'command', data: this.msg.replace('/', '').split(' ')} : {type: 'chat', msg: this.msg});
          this.msg = '';
        }
        this.showChat = false;
      }
    }

    keydown(e) {
      e.preventDefault();
      if (!this.key[e.keyCode]) {
        if (this.showChat) return this.chat(e);
        this.keyStart(e);
        this.keyLoop(e);
        this.key[e.keyCode] = setInterval(this.keyLoop.bind(this), 15, e);
      }
    }

    keyup(e) {
      e.preventDefault();
      clearInterval(this.key[e.keyCode]);
      this.key[e.keyCode] = false;
      if (e.keyCode == 65 || e.keyCode == 68) this.left = null;
      if (e.keyCode == 87 || e.keyCode == 83) this.up = null;
      if (this.dx && (e.keyCode === 65 && this.dx.a < 0 || e.keyCode === 68 && this.dx.a > 0)) this.dx = false;
      if (this.dy && (e.keyCode === 87 && this.dy.a < 0 || e.keyCode === 83 && this.dy.a > 0)) this.dy = false;
      if ([87, 65, 68, 83].includes(e.keyCode)) {
        this.b = false;
        if (this.key[65]) this.keyStart({keyCode: 65});
        if (this.key[68]) this.keyStart({keyCode: 68});
        if (this.key[87]) this.keyStart({keyCode: 87});
        if (this.key[83]) this.keyStart({keyCode: 83});
      }
    }

    mousemove(e) {
      this.mouse = {x: (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/PixelTanks.resizer, y: e.clientY/PixelTanks.resizer};
      this.tank.r = toAngle(e.clientX-window.innerWidth/2, e.clientY-window.innerHeight/2);
    }

    mousedown(e) {
      this.fire(e.button);
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(() => {
        this.canFire = true;
        this.fire(e.button);
      }, this.fireType === 1 ? 200 : 600);
    }

    mouseup() {
      clearInterval(this.fireInterval);
    }

    fire(type) {
      if (type === 2) {
        if (!this.canPowermissle) return;
        this.canPowermissle = false;
        this.timers.powermissle = Date.now();
        setTimeout(() => {
          this.canPowermissle = true;
        }, 10000);
      } else if (type === 0) {
        if (!this.canFire) return;
        this.canFire = false;
        clearTimeout(this.fireTimeout);
        this.fireTimeout = setTimeout(() => {this.canFire = true}, this.fireType === 1 ? 200 : 600);
      }
      var fireType = ['grapple', 'megamissle', 'dynamite', 2].includes(type) ? 1 : this.fireType, type = type === 2 ? (PixelTanks.userData.class === 'medic' ? 'healmissle' : 'powermissle') : (type === 0 ? (this.fireType === 1 ? 'bullet' : 'shotgun') : type), l = fireType === 1 ? 0 : -10;
      while (l<(fireType === 1 ? 1 : 15)) {
        this.tank.fire.push({...toPoint(this.tank.r+l), type: type, r: this.tank.r+l});
        l += 5;
      }
    }

    collision(x, y) {
      if (this.ded) return true;
      if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;
      if (this.tank.invis && this.tank.immune && !this.halfSpeed) return true;
      var l = 0, blocks = this.hostupdate.b, len = blocks.length;
      while (l<len) {
        if ((x > blocks[l].x || x + 80 > blocks[l].x) && (x < blocks[l].x + 100 || x + 80 < blocks[l].x + 100) && (y > blocks[l].y || y + 80 > blocks[l].y) && (y < blocks[l].y + 100 || y + 80 < blocks[l].y + 100)) {
          if (['barrier', 'weak', 'strong', 'gold', 'void'].includes(blocks[l].type)) return false;
        }
        l++;
      }
      return true;
    }

    playAnimation(id) {
      this.tank.animation = {id: id, frame: 0};
      clearInterval(this.animationInterval);
      this.animationInterval = setInterval(function() {
        if (this.tank.animation.frame === PixelTanks.images.animations[id+'_'].frames) {
          clearInterval(this.animationInterval);
          setTimeout(function() {this.tank.animation = false}.bind(this), PixelTanks.images.animations[id+'_'].speed);
        } else this.tank.animation.frame++;
      }.bind(this), PixelTanks.images.animations[id+'_'].speed);
    }

    useItem(id, slot) {
      if (!this['canItem'+slot]) {
        if (id === 'dynamite') this.tank.use.push('dynamite');
        return;
      }
      let cooldown = 0;
      if (id === 'duck_tape') {
        this.tank.use.push('tape');
        this.playAnimation('tape');
        cooldown = 30000;
      } else if (id === 'super_glu') {
        this.tank.use.push('glu');
        this.playAnimation('glu');
        cooldown = 30000;
      } else if (id === 'shield') {
        this.tank.use.push('shield');
        cooldown = 30000;
      } else if (id === 'weak') {
        this.tank.use.push('block#'+(PixelTanks.userData.class === 'builder' ? 'strong' : 'weak'));
        cooldown = 4000;
      } else if (id === 'strong') {
        this.tank.use.push('block#'+(PixelTanks.userData.class === 'builder' ? 'gold' : 'strong'));
        cooldown = 8000;
      } else if (id === 'spike') {
        this.tank.use.push('block#spike');
        cooldown = 10000;
      } else if (id === 'mine') {
        // soon to be replaced
      } else if (id === 'fortress') {
        // soon to be replaced
      } else if (id === 'flashbang') {
        this.tank.use.push('flashbang');
        cooldown = 20000;
      } else if (id === 'bomb') {
        this.tank.use.push('bomb');
        cooldown = 5000;
      } else if (id === 'dynamite') {
        this.fire('dynamite');
        cooldown = 25000;
      } else if (id === 'airstrike') {
        this.tank.airstrike = {x: this.mouse.x+this.tank.x-850, y: this.mouse.y+this.tank.y-550};
        cooldown = 20000;
      }
      this.timers.items[slot] = {cooldown: cooldown, time: Date.now()};
      this['canItem'+slot] = false;
      clearTimeout(this['itemTimeout'+slot]);
      this['itemTimeout'+slot] = setTimeout(() => {
        this['canItem'+slot] = true;
      }, cooldown);
    }

    keyStart(e) {
      if (this.paused && e.keyCode !== 27) return;
      const k = e.keyCode;
      if ([65, 68].includes(k)) {
        this.dx = {o: this.tank.x, t: Date.now(), a: k === 65 ? -1 : 1, b: false};
        this.b = {o: this.tank.baseFrame, t: Date.now()};
      } else if ([83, 87].includes(k)) {
        this.dy = {o: this.tank.y, t: Date.now(), a: k === 87 ? -1 : 1, b: false};
        this.b = {o: this.tank.baseFrame, t: Date.now()};
      }
      for (let i = 0; i < 4; i++) {
        if (k === PixelTanks.userData.keybinds.items[i]) this.useItem(PixelTanks.userData.items[i], i);
      }
      for (let i = 0; i < 6; i++) {
        if (k === PixelTanks.userData.keybinds.emotes[i]) this.emote(Pixel.userData.emotes[i]);
      }
      if (k === 13) this.showChat = true;
      if (k === 9) {
        this.fireType = this.fireType < 2 ? 2 : 1;
        clearInterval(this.fireInterval);
      } else if (k === 82 && this.canGrapple) {
        this.fire('grapple');
        this.canGrapple = false;
        setTimeout(() => {this.canGrapple = true}, 5000);
      } else if (k === 81) {
        if (this.halfSpeed || this.canToolkit) {
          this.tank.use.push('toolkit');
          this.halfSpeed = !this.halfSpeed;
        }
        if (this.canToolkit) {
          this.canToolkit = false;
          this.timers.toolkit = new Date();
          setTimeout(() => {this.canToolkit = true}, 40000);
          setTimeout(() => {this.halfSpeed = false}, PixelTanks.userData.class === 'medic' ? 5000 : 7500);
          this.playAnimation('toolkit');
        }
        if (!this.halfSpeed && Date.now()-this.timers.toolkit < (PixelTanks.userData.class === 'medic' ? 5000 : 7500)) {
          this.timers.toolkit = new Date("Nov 28 2006").getTime();
          this.canToolkit = true;
        }
      } else if (k === 70 && this.canClass) {
        this.canClass = false;
        const c = PixelTanks.userData.class;
        if (c === 'stealth' && !this.halfSpeed) {
          this.tank.invis = !this.tank.invis;
          this.timers.class = {time: Date.now(), cooldown: 50};
        } else if (c === 'tactical') {
          this.fire('megamissle');
          this.timers.class = {time: Date.now(), cooldown: 25000};
        } else if (c === 'builder') {
          this.tank.use.push('turret');
          this.timers.class = {time: Date.now(), cooldown: 30000};
        } else if (c === 'warrior') {
          this.tank.use.push('buff');
          this.timers.class = {time: Date.now(), cooldown: 40000};
        } else if (c === 'medic') {
          this.tank.use.push('healSwitch');
          this.timers.class = {time: Date.now(), cooldown: 0};
        } else if (c === 'fire') {
          for (let i = -30; i < 30; i += 5) this.tank.fire.push({...toPoint(this.tank.r+i), type: 'fire', r: this.tank.r+i});
          this.timers.class = {time: Date.now(), cooldown: 10000};
        }
        setTimeout(() => {this.canClass = true}, this.timers.class.cooldown);
      } else if (k === 27) {
        this.paused = !this.paused;
        if (this.paused) {
          Menus.menus.pause.addListeners();
        } else {
          Menus.removeListeners();
        }
      }
    }

    keyLoop(e) {
      if (e.keyCode === 16) {
        if (this.canBoost) {
          this.speed = 16;
          this.canBoost = false;
          this.tank.immune = true;
          this.timers.boost = Date.now();
          setTimeout(() => {
            this.speed = 4;
            this.tank.immune = false;
            if (PixelTanks.userData.class === 'stealth') this.tank.use.push('break');
          }, 500);
          setTimeout(() => {this.canBoost = true}, 5000);
        }
      }
    }

    emote(id) {
      clearInterval(this.emoteAnimation);
      clearTimeout(this.emoteTimeout);
      const {type, frames} = PixelTanks.images.emotes[id+'_'];
      this.tank.emote = {a: id, f: 0};
      if (type !== 2) this.emoteAnimation = setInterval(() => {
        if (this.tank.emote.f !== frames) {
          this.tank.emote.f++;
        } else if (type === 0) {
          this.tank.emote.f = 0;
        }
      }, 50);
      this.emoteTimeout = setTimeout(() => {
        clearInterval(this.emoteAnimation);
        this.tank.emote = null;
      }, type < 2 ? 5000 : 1500+50*frames);
    }

    send() {
      const {x, y, r, use, fire, airstrike} = this.tank;
      const updateData = {username: PixelTanks.user.username, type: 'update', data: this.tank};
      if (x === this.lastUpdate.x && y === this.lastUpdate.y && r === this.lastUpdate.r && use.length === 0 && fire.length === 0 && airstrike === null) return;
      this.ops++;
      if (this.multiplayer) {
        this.socket.send(updateData);
      } else {
        this.world.update(updateData);
        this.hostupdate = {
          pt: this.world.pt,
          b: this.world.b,
          s: this.world.s,
          ai: this.world.ai,
          d: this.world.d,
          logs: this.world.logs.reverse(),
        }
      }
      this.lastUpdate = {x, y, r};
      this.tank.airstrike = null;
      this.tank.fire = [];
      this.tank.use = [];
    }

    implode() {
      if (this.multiplayer) {
        this.socket.close();
      } else {
        this.world.i.forEach(i => clearInterval(i));
      }
      document.removeEventListener('keydown', this.keydown.bind(this));
      document.removeEventListener('keyup', this.keyup.bind(this));
      document.removeEventListener('mousemove', this.mousemove.bind(this));
      document.removeEventListener('mousedown', this.mousedown.bind(this));
      document.removeEventListener('mouseup', this.mouseup.bind(this));
      cancelAnimationFrame(this.render);
      Menus.menus.pause.removeListeners();
      PixelTanks.user.player = undefined;
    }
  }

  class Singleplayer extends Engine {
    constructor(level) {
      const levels = [
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","A0","B0","A0","B0","B4","B0","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B0","B1","B0","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B1","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B5","B5","B5","B5","B0","B2","B0","B0","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B3","B3","B0","B3","B3","B5","B5","B5","B5","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B0","B3","B3","B3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B0","B0","B5","B5"],["B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B3","B0","B1","B0","B5","B5"],["B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B0","B0","B5","B5","B5","B5","A0","B0","B3","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B5","B5","B4","B0","B0","B0","B4","B0","B2","B0","B0","B0","B1","B0","B5","B5","B5","B5","B1","B3","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B5","B5","B0","B0","B3","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B4","B0","B4","B0","B0","B4","B0","B1","B1","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B1","B0","B0","B5","B5"],["B5","B5","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B5","B5","B5"],["B5","B5","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","A0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B4","B1","B4","B0","B1","B0","B1","B1","B4","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B4","B0","B0","A1","B0","B0","B1","B0","B4","B0","B0","B1","A1","B1","B0","B0","B0","B0","A0","B4","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B4","B1","B4","B0","B1","B0","B1","B1","B4","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B4","B5","B5","B1","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B1","B0","B0","B1","B0","B0","B2","B3","B2","B0","B0","B4","B5","B1","B1","B1","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B2","B0","B0","B0","B0","B0","B0","B4","B1","B5","B1","B5","B1"],["B5","B5","B4","B0","B0","S","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B1","B0","B0","B2","B0","B2","B0","B0","B4","B5","B5","B1","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B1","B0","B0","B2","B3","B0","B0","B4","B5","B5","B1","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B0","B1","B1","B0","B0","B2","B0","B0","B0","B0","B0","B4","B5","B5","B1","B5","B5"],["B5","B5","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B4","B4","B4","B4","B5","B5","B5","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B0","B0","B0","B4","B4","B5","B4","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B0","A1","B0","B0","B4","B4","B4","B0","B0","A1","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B4","B0","B0","B4","B0","B4","B0","B4","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B4","B4","B0","B0","B2","B1","B2","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B4","B4","B4","B1","S","B1","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B4","B4","B0","B0","B2","B1","B2","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B4","B0","B0","B4","B0","B4","B0","B4","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0"],["B5","B4","B0","A1","B0","B0","B4","B4","B4","B0","B0","A1","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B0","B0","B0"],["B5","B4","B0","B0","B0","B4","B4","B5","B4","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B4","B4","B4","B4","B4","B5","B5","B5","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B4","B4","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B4","B4","B4","B0","B0","B0","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B1","B0","B0","B0","B0","B0","B1","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B2","B0","B0","B0","B2","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","A2","B0","B2","B0","S","B0","B2","B0","A2","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B2","B0","B0","B0","B2","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B1","B0","B2","B2","B2","B0","B1","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B0","A2","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","S","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","A1","B0","B0","B0","B0","B0","B0","B1","B0","B0","A1","B0","B0","B1","B0","B0","B0","B0","B0","A1","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],    
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B3","B0","B4","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","A2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","S","B0","B0","B0","B3","B0","B0","A0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","A2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B3","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B3","B3","B3","B3","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","A0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","A2","B0","A2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","A2","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A2","B1","B1","B1","B1","B1","B1","A2","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","S","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","A2","B1","B1","B1","B1","B1","B1","A2","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A2","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A1","A1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B1","B5","B5","S","B5","B5","B1","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B1","B5","B5","B1","B5","B5","B1","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","A1","A1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","A1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","A1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B4","S","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","A1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","A1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A3","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A3","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A3","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","S","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B1","A3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B1","A3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","A0","A0","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","A0","A0","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B2","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B2","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A2","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","A2","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A2","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","S","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","A0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B3","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B0","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B2","B2","B0","B5","B5","B5","B5","B0","B5","B5","B5","B5","B0","B5","B5","A1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","A3","B1","B0","S","B0","B1","A3","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","A1","B5","B5","B0","B5","B5","B5","B5","B0","B5","B5","B5","B5","B0","B2","B2","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B1","B5","B5","B0","B5","B5","B5","B5","B0","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B3","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","A0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B0","B5","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A0","B0","B0","B0","S","B0","B0","B0","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B0","B5","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B3","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B0","B0","B0","B0","B0","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B0","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","A1","A2","A1","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","A1","A2","A1","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B0","B0","B0","B0","B0","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B3","B0","B5","B0","B0","B0","B0","B0","S","B0","B0","B0","B0","B0","B5","B0","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","A1","B0","A1","B0","B0","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B3","B3","B3","B3","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B3","B3","B0","B0","B0","S","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B0","A1","B0","A1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","A0","A0","A0","A0","A0","A0","A0","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","S","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B3","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B2","B0","B4","B0","B0","B0","B4","B0","B2","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B2","B0","B2","B0","B2","B0","B2","B0","B2","B0","B2","B0","B2","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B4","B0","B2","B0","B4","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B3","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A1","A1","A1","B3","S","B3","A1","A1","A1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","A3","B5","B5","B5","B5","B5","A2","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B1","B0","B1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","A0","B1","B0","B4","B2","B4","B0","B1","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B1","B4","S","B4","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","A0","B1","B0","B4","B2","B4","B0","B1","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B1","B0","B1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","A2","B5","B5","B5","B5","B5","A3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
      ];
      if (level > levels.length || level < 1) level = 1;
      super([levels[level-1]]);
    }

    ontick() {
      if (this.ai.length === 0) {
        setTimeout(() => {
          PixelTanks.user.player.implode();
          Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
          Menus.trigger('victory');
        }, 3000);
        this.ontick = () => {}
      }
    }

    ondeath() {
      this.ai.forEach(ai => {
        ai.mode = 3;
      });
      setTimeout(() => {
        PixelTanks.user.player.implode();
        Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
        Menus.trigger('defeat');
      }, 10000);
    }

    override(data) {
      PixelTanks.user.player.tank.x = data.x;
      PixelTanks.user.player.tank.y = data.y;
    }
  }

  window.onload = PixelTanks.start;
};
