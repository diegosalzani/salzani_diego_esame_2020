/*
 * Metro 4 Components Library 4.3.7  (https://metroui.org.ua)
 * Copyright 2012-2020 by Serhii Pimenov (https://pimenov.com.ua). All rights reserved.
 * Built at 24/05/2020 10:14:59
 * Licensed under MIT
 */
(function( factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define('metro4', factory );
    } else {
        factory( );
    }
}(function( ) { 
'use strict';

window.hideM4QVersion = true;
/*
 * m4q v1.0.6, (https://github.com/olton/m4q.git)
 * Copyright 2018 - 2020 by Sergey Pimenov
 * Helper for DOM manipulation, animation, and ajax routines.
 * Licensed under MIT
 */

 (function (global, undefined) {

// Source: src/mode.js

/* jshint -W097 */
'use strict';

// Source: src/func.js

/* global dataSet */
/* exported isSimple, isHidden, isPlainObject, isEmptyObject, isArrayLike, str2arr, parseUnit, getUnit, setStyleProp, acceptData, dataAttr, normName, strip, dashedName */

var numProps = ['opacity', 'zIndex'];

function isSimple(v){
    return typeof v === "string" || typeof v === "boolean" || typeof v === "number";
}

function isVisible(elem) {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

function isHidden(elem) {
    var s = getComputedStyle(elem);
    return !isVisible(elem) || +s.opacity === 0 || elem.hidden || s.visibility === "hidden";
}

function not(value){
    return value === undefined || value === null;
}

function camelCase(string){
    return string.replace( /-([a-z])/g, function(all, letter){
        return letter.toUpperCase();
    });
}

function dashedName(str){
    return str.replace(/([A-Z])/g, function(u) { return "-" + u.toLowerCase(); });
}

function isPlainObject( obj ) {
    var proto;
    if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
        return false;
    }
    proto = obj.prototype !== undefined;
    if ( !proto ) {
        return true;
    }
    return proto.constructor && typeof proto.constructor === "function";
}

function isEmptyObject( obj ) {
    for (var name in obj ) {
        if (hasProp(obj, name)) return false;
    }
    return true;
}

function isArrayLike (o){
    return o instanceof Object && 'length' in o;
}

function str2arr (str, sep) {
    sep = sep || " ";
    return str.split(sep).map(function(el){
        return  (""+el).trim();
    }).filter(function(el){
        return el !== "";
    });
}

function parseUnit(str, out) {
    if (!out) out = [ 0, '' ];
    str = String(str);
    out[0] = parseFloat(str);
    out[1] = str.match(/[\d.\-+]*\s*(.*)/)[1] || '';
    return out;
}

function getUnit(val, und){
    var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
    return typeof split[1] !== "undefined" ? split[1] : und;
}

function setStyleProp(el, key, val){
    key = camelCase(key);

    if (["scrollLeft", "scrollTop"].indexOf(key) > -1) {
        el[key] = (parseInt(val));
    } else {
        el.style[key] = isNaN(val) || numProps.indexOf(""+key) > -1 ? val : val + 'px';
    }
}

function acceptData(owner){
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
}

function getData(data){
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

function dataAttr(elem, key, data){
    var name;

    if ( not(data) && elem.nodeType === 1 ) {
        name = "data-" + key.replace( /[A-Z]/g, "-$&" ).toLowerCase();
        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            data = getData( data );
            dataSet.set( elem, key, data );
        } else {
            data = undefined;
        }
    }
    return data;
}

function normName(name) {
    return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
}

function strip(name, what) {
    return typeof name !== "string" ? undefined : name.replace(what, "");
}

function hasProp(obj, prop){
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

// Source: src/setimmediate.js

/*
 * setImmediate polyfill
 * Version 1.0.5
 * Url: https://github.com/YuzuJS/setImmediate
 * Copyright (c) 2016 Yuzu (https://github.com/YuzuJS)
 * Licensed under MIT
 */
(function (global) {

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1;
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var registerImmediate;

    function setImmediate(callback) {
        if (typeof callback !== "function") {
            /* jshint -W054 */
            callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        tasksByHandle[nextHandle] = { callback: callback, args: args };
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        if (currentlyRunningATask) {
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        global.addEventListener("message", onGlobalMessage, false);

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    installPostMessageImplementation();

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;

}(window));

// Source: src/promise.js

/* global setImmediate */

/*
 * Promise polyfill
 * Version 1.2.0
 * Url: https://github.com/lahmatiy/es6-promise-polyfill
 * Copyright (c) 2014 Roman Dvornov
 * Licensed under MIT
 */
(function (global) {

    if (global.Promise) {
        return;
    }

    // console.log("Promise polyfill v1.2.0");

    var PENDING = 'pending';
    var SEALED = 'sealed';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    var NOOP = function(){};

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    // async calls
    var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
    var asyncQueue = [];
    var asyncTimer;

    function asyncFlush(){
        // run promise callbacks
        for (var i = 0; i < asyncQueue.length; i++)
            asyncQueue[i][0](asyncQueue[i][1]);

        // reset async asyncQueue
        asyncQueue = [];
        asyncTimer = false;
    }

    function asyncCall(callback, arg){
        asyncQueue.push([callback, arg]);

        if (!asyncTimer)
        {
            asyncTimer = true;
            asyncSetTimer(asyncFlush, 0);
        }
    }

    function invokeResolver(resolver, promise) {
        function resolvePromise(value) {
            resolve(promise, value);
        }

        function rejectPromise(reason) {
            reject(promise, reason);
        }

        try {
            resolver(resolvePromise, rejectPromise);
        } catch(e) {
            rejectPromise(e);
        }
    }

    function invokeCallback(subscriber){
        var owner = subscriber.owner;
        var settled = owner.state_;
        var value = owner.data_;
        var callback = subscriber[settled];
        var promise = subscriber.then;

        if (typeof callback === 'function')
        {
            settled = FULFILLED;
            try {
                value = callback(value);
            } catch(e) {
                reject(promise, e);
            }
        }

        if (!handleThenable(promise, value))
        {
            if (settled === FULFILLED)
                resolve(promise, value);

            if (settled === REJECTED)
                reject(promise, value);
        }
    }

    function handleThenable(promise, value) {
        var resolved;

        try {
            if (promise === value)
                throw new TypeError('A promises callback cannot return that same promise.');

            if (value && (typeof value === 'function' || typeof value === 'object'))
            {
                var then = value.then;  // then should be retrived only once

                if (typeof then === 'function')
                {
                    then.call(value, function(val){
                        if (!resolved)
                        {
                            resolved = true;

                            if (value !== val)
                                resolve(promise, val);
                            else
                                fulfill(promise, val);
                        }
                    }, function(reason){
                        if (!resolved)
                        {
                            resolved = true;

                            reject(promise, reason);
                        }
                    });

                    return true;
                }
            }
        } catch (e) {
            if (!resolved)
                reject(promise, e);

            return true;
        }

        return false;
    }

    function resolve(promise, value){
        if (promise === value || !handleThenable(promise, value))
            fulfill(promise, value);
    }

    function fulfill(promise, value){
        if (promise.state_ === PENDING)
        {
            promise.state_ = SEALED;
            promise.data_ = value;

            asyncCall(publishFulfillment, promise);
        }
    }

    function reject(promise, reason){
        if (promise.state_ === PENDING)
        {
            promise.state_ = SEALED;
            promise.data_ = reason;

            asyncCall(publishRejection, promise);
        }
    }

    function publish(promise) {
        var callbacks = promise.then_;
        promise.then_ = undefined;

        for (var i = 0; i < callbacks.length; i++) {
            invokeCallback(callbacks[i]);
        }
    }

    function publishFulfillment(promise){
        promise.state_ = FULFILLED;
        publish(promise);
    }

    function publishRejection(promise){
        promise.state_ = REJECTED;
        publish(promise);
    }

    /**
     * @class
     */
    function Promise(resolver){
        if (typeof resolver !== 'function')
            throw new TypeError('Promise constructor takes a function argument');

        if (!(this instanceof Promise))
            throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

        this.then_ = [];

        invokeResolver(resolver, this);
    }

    Promise.prototype = {
        constructor: Promise,

        state_: PENDING,
        then_: null,
        data_: undefined,

        then: function(onFulfillment, onRejection){
            var subscriber = {
                owner: this,
                then: new this.constructor(NOOP),
                fulfilled: onFulfillment,
                rejected: onRejection
            };

            if (this.state_ === FULFILLED || this.state_ === REJECTED)
            {
                // already resolved, call callback async
                asyncCall(invokeCallback, subscriber);
            }
            else
            {
                // subscribe
                this.then_.push(subscriber);
            }

            return subscriber.then;
        },

        done: function(onFulfillment){
            return this.then(onFulfillment, null);
        },

        always: function(onAlways){
            return this.then(onAlways, onAlways);
        },

        'catch': function(onRejection) {
            return this.then(null, onRejection);
        }
    };

    Promise.all = function(promises){
        var Class = this;

        if (!isArray(promises))
            throw new TypeError('You must pass an array to Promise.all().');

        return new Class(function(resolve, reject){
            var results = [];
            var remaining = 0;

            function resolver(index){
                remaining++;
                return function(value){
                    results[index] = value;
                    if (!--remaining)
                        resolve(results);
                };
            }

            for (var i = 0, promise; i < promises.length; i++)
            {
                promise = promises[i];

                if (promise && typeof promise.then === 'function')
                    promise.then(resolver(i), reject);
                else
                    results[i] = promise;
            }

            if (!remaining)
                resolve(results);
        });
    };

    Promise.race = function(promises){
        var Class = this;

        if (!isArray(promises))
            throw new TypeError('You must pass an array to Promise.race().');

        return new Class(function(resolve, reject) {
            for (var i = 0, promise; i < promises.length; i++)
            {
                promise = promises[i];

                if (promise && typeof promise.then === 'function')
                    promise.then(resolve, reject);
                else
                    resolve(promise);
            }
        });
    };

    Promise.resolve = function(value){
        var Class = this;

        if (value && typeof value === 'object' && value.constructor === Class)
            return value;

        return new Class(function(resolve){
            resolve(value);
        });
    };

    Promise.reject = function(reason){
        var Class = this;

        return new Class(function(resolve, reject){
            reject(reason);
        });
    };

    if (typeof  global.Promise === "undefined") {
        global.Promise = Promise;
    }
}(window));

// Source: src/core.js

/* global hasProp */

var m4qVersion = "v1.0.6. Built at 17/05/2020 19:27:22";

/* eslint-disable-next-line */
var matches = Element.prototype.matches
    || Element.prototype.matchesSelector
    || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector
    || Element.prototype.msMatchesSelector
    || Element.prototype.oMatchesSelector;

var $ = function(selector, context){
    return new $.init(selector, context);
};

$.version = m4qVersion;

$.fn = $.prototype = {
    version: m4qVersion,
    constructor: $,
    length: 0,
    uid: "",

    push: [].push,
    sort: [].sort,
    splice: [].splice,
    indexOf: [].indexOf,
    reverse: [].reverse
};

$.extend = $.fn.extend = function(){
    var options, name,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target !== "object" && typeof target !== "function" ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                if (hasProp(options, name))
                    target[ name ] = options[ name ];
            }
        }
    }

    return target;
};

$.assign = function(){
    var options, name,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target !== "object" && typeof target !== "function" ) {
        target = {};
    }

    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                if (hasProp(options, name) && options[name] !== undefined)
                    target[ name ] = options[ name ];
            }
        }
    }

    return target;
};

if (typeof window["hideM4QVersion"] === "undefined") console.info("m4q " + $.version);

// Source: src/interval.js

/* global $ */

var now = function(){
    return Date.now();
};

$.extend({

    intervalId: -1,
    intervalQueue: [],
    intervalTicking: false,
    intervalTickId: null,

    setInterval: function(fn, int){
        var that = this;

        this.intervalId++;

        this.intervalQueue.push({
            id: this.intervalId,
            fn: fn,
            interval: int,
            lastTime: now()
        });

        if (!this.intervalTicking) {
            var tick = function(){
                that.intervalTickId = requestAnimationFrame(tick);
                $.each(that.intervalQueue, function(){
                    var item = this;
                    if (item.interval < 17 || now() - item.lastTime >= item.interval) {
                        item.fn();
                        item.lastTime = now();
                    }
                });
            };
            this.intervalTicking = true;
            tick();
        }

        return this.intervalId;
    },

    clearInterval: function(id){
        for(var i = 0; i < this.intervalQueue.length; i++){
            if (id === this.intervalQueue[i].id) {
                this.intervalQueue.splice(i, 1);
                break;
            }
        }
        if (this.intervalQueue.length === 0) {
            cancelAnimationFrame(this.intervalTickId);
            this.intervalTicking = false;
        }
    },

    setTimeout: function(fn, interval){
        var that = this, id = this.setInterval(function(){
            that.clearInterval(id);
            fn();
        }, interval);

        return id;
    },

    clearTimeout: function(id){
        return this.clearInterval(id);
    }
});

// Source: src/contains.js

/* global $, not, matches, isArrayLike, isVisible */

$.fn.extend({
    index: function(sel){
        var el, _index = -1;

        if (this.length === 0) {
            return _index;
        }

        if (not(sel)) {
            el = this[0];
        } else if (sel instanceof $ && sel.length > 0) {
            el = sel[0];
        } else if (typeof sel === "string") {
            el = $(sel)[0];
        } else {
            el = undefined;
        }

        if (not(el)) {
            return _index;
        }

        if (el && el.parentNode) $.each(el.parentNode.children, function(i){
            if (this === el) {
                _index = i;
            }
        });
        return _index;
    },

    get: function(i){
        if (i === undefined) {
            return this.items();
        }
        return i < 0 ? this[ i + this.length ] : this[ i ];
    },

    eq: function(i){
        return !not(i) && this.length > 0 ? $.extend($(this.get(i)), {_prevObj: this}) : this;
    },

    is: function(s){
        var result = false;

        if (this.length === 0) {
            return false;
        }

        if (s instanceof $) {
            return this.same(s);
        }

        if (s === ":selected") {
            this.each(function(){
                if (this.selected) result = true;
            });
        } else

        if (s === ":checked") {
            this.each(function(){
                if (this.checked) result = true;
            });
        } else

        if (s === ":visible") {
            this.each(function(){
                if (isVisible(this)) result = true;
            });
        } else

        if (s === ":hidden") {
            this.each(function(){
                var styles = getComputedStyle(this);
                if (
                    this.getAttribute('type') === 'hidden'
                        || this.hidden
                        || styles.display === 'none'
                        || styles.visibility === 'hidden'
                        || parseInt(styles.opacity) === 0
                ) result = true;
            });
        } else

        if (typeof  s === "string" && [':selected'].indexOf(s) === -1) {
            this.each(function(){
                if (matches.call(this, s)) {
                    result = true;
                }
            });
        } else

        if (isArrayLike(s)) {
            this.each(function(){
                var el = this;
                $.each(s, function(){
                    var sel = this;
                    if (el === sel) {
                        result = true;
                    }
                });
            });
        } else

        if (typeof s === "object" && s.nodeType === 1) {
            this.each(function(){
                if  (this === s) {
                    result = true;
                }
            });
        }

        return result;
    },

    same: function(o){
        var result = true;

        if (!(o instanceof $)) {
            o = $(o);
        }

        if (this.length !== o.length) return false;

        this.each(function(){
            if (o.items().indexOf(this) === -1) {
                result = false;
            }
        });

        return result;
    },

    last: function(){
        return this.eq(this.length - 1);
    },

    first: function(){
        return this.eq(0);
    },

    odd: function(){
        var result = this.filter(function(el, i){
            return i % 2 === 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    even: function(){
        var result = this.filter(function(el, i){
            return i % 2 !== 0;
        });
        return $.extend(result, {_prevObj: this});
    },

    filter: function(fn){
        if (typeof fn === "string") {
            var sel = fn;
            fn = function(el){
                return matches.call(el, sel);
            };
        }

        return $.extend($.merge($(), [].filter.call(this, fn)), {_prevObj: this});
    },

    find: function(s){
        var res = [], result;

        if (s instanceof $) return s;

        if (this.length === 0) {
            result = this;
        } else {
            this.each(function () {
                var el = this;
                if (typeof el.querySelectorAll !== "undefined") res = res.concat([].slice.call(el.querySelectorAll(s)));
            });
            result = $.merge($(), res);
        }

        return $.extend(result, {_prevObj: this});
    },

    contains: function(s){
        return this.find(s).length > 0;
    },

    children: function(s){
        var i, res = [];

        if (s instanceof $) return s;

        this.each(function(){
            var el = this;
            for(i = 0; i < el.children.length; i++) {
                if (el.children[i].nodeType === 1)
                    res.push(el.children[i]);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parent: function(s){
        var res = [];
        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            if (this.parentNode) {
                if (res.indexOf(this.parentNode) === -1) res.push(this.parentNode);
            }
        });
        res = s ? res.filter(function(el){
            return matches.call(el, s);
        }) : res;

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    parents: function(s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var par = this.parentNode;
            while (par) {
                if (par.nodeType === 1 && res.indexOf(par) === -1) {
                    if (!not(s)) {
                        if (matches.call(par, s)) {
                            res.push(par);
                        }
                    } else {
                        res.push(par);
                    }
                }
                par = par.parentNode;
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    siblings: function(s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var el = this;
            if (el.parentNode) {
                $.each(el.parentNode.children, function(){
                    if (el !== this) res.push(this);
                });
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _siblingAll: function(dir, s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var el = this;
            while (el) {
                el = el[dir];
                if (!el) break;
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    _sibling: function(dir, s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        this.each(function(){
            var el = this[dir];
            if (el && el.nodeType === 1) {
                res.push(el);
            }
        });

        if (s) {
            res = res.filter(function(el){
                return matches.call(el, s);
            });
        }

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    prev: function(s){
        return this._sibling('previousElementSibling', s);
    },

    next: function(s){
        return this._sibling('nextElementSibling', s);
    },

    prevAll: function(s){
        return this._siblingAll('previousElementSibling', s);
    },

    nextAll: function(s){
        return this._siblingAll('nextElementSibling', s);
    },

    closest: function(s){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        if (s instanceof $) return s;

        if (!s) {
            return this.parent(s);
        }

        this.each(function(){
            var el = this;
            while (el) {
                if (!el) break;
                if (matches.call(el, s)) {
                    res.push(el);
                    return ;
                }
                el = el.parentElement;
            }
        });

        return $.extend($.merge($(), res.reverse()), {_prevObj: this});
    },

    has: function(selector){
        var res = [];

        if (this.length === 0) {
            return ;
        }

        this.each(function(){
            var el = $(this);
            var child = el.children(selector);
            if (child.length > 0) {
                res.push(this);
            }
        });

        return $.extend($.merge($(), res), {_prevObj: this});
    },

    back: function(to_start){
        var ret;
        if (to_start === true) {
            ret = this._prevObj;
            while (ret) {
                if (!ret._prevObj) break;
                ret = ret._prevObj;
            }
        } else {
            ret = this._prevObj ? this._prevObj : this;
        }
        return ret;
    }
});

// Source: src/script.js

/* global $, not */

function createScript(script){
    var s = document.createElement('script');
    s.type = 'text/javascript';

    if (not(script)) return $(s);

    var _script = $(script)[0];

    if (_script.src) {
        s.src = _script.src;
    } else {
        s.textContent = _script.innerText;
    }

    document.body.appendChild(s);

    if (_script.parentNode) _script.parentNode.removeChild(_script);

    return s;
}

$.extend({
    script: function(el){

        if (not(el)) {
            return createScript();
        }

        var _el = $(el)[0];

        if (_el.tagName && _el.tagName === "SCRIPT") {
            createScript(_el);
        } else $.each($(_el).find("script"), function(){
            createScript(this);
        });
    }
});

$.fn.extend({
    script: function(){
        return this.each(function(){
            $.script(this);
        });
    }
});

// Source: src/prop.js

/* global $, not */

$.fn.extend({
    _prop: function(prop, value){
        if (arguments.length === 1) {
            return this.length === 0 ? undefined : this[0][prop];
        }

        if (not(value)) {
            value = '';
        }

        return this.each(function(){
            var el = this;

            el[prop] = value;

            if (prop === "innerHTML") {
                $.script(el);
            }
        });
    },

    prop: function(prop, value){
        return arguments.length === 1 ? this._prop(prop) : this._prop(prop, typeof value === "undefined" ? "" : value);
    },

    val: function(value){
        if (not(value)) {
            return this.length === 0 ? undefined : this[0].value;
        }

        return this.each(function(){
            var el = $(this);
            if (typeof this.value !== "undefined") {
                this.value = value;
            } else {
                el.html(value);
            }
        });
    },

    html: function(value){
        var that = this, v = [];

        if (arguments.length === 0) {
            return this._prop('innerHTML');
        }

        if (value instanceof $) {
            value.each(function(){
                v.push($(this).outerHTML());
            });
        } else {
            v.push(value);
        }

        that._prop('innerHTML', v.length === 1 && not(v[0]) ? "" : v.join("\n"));

        return this;
    },

    outerHTML: function(){
        return this._prop('outerHTML');
    },

    text: function(value){
        return arguments.length === 0 ? this._prop('textContent') : this._prop('textContent', typeof value === "undefined" ? "" : value);
    },

    innerText: function(value){
        return arguments.length === 0 ? this._prop('innerText') : this._prop('innerText', typeof value === "undefined" ? "" : value);
    },

    empty: function(){
        return this.each(function(){
            if (typeof this.innerHTML !== "undefined") this.innerHTML = "";
        });
    },

    clear: function(){
        return this.empty();
    }
});

// Source: src/each.js

/* global $, isArrayLike, hasProp */

$.each = function(ctx, cb){
    var index = 0;
    if (isArrayLike(ctx)) {
        [].forEach.call(ctx, function(val, key) {
            cb.apply(val, [key, val]);
        });
    } else {
        for(var key in ctx) {
            if (hasProp(ctx, key))
                cb.apply(ctx[key], [key, ctx[key],  index++]);
        }
    }

    return ctx;
};

$.fn.extend({
    each: function(cb){
        return $.each(this, cb);
    }
});


// Source: src/data.js

/* global acceptData, camelCase, $, not, dataAttr, isEmptyObject, hasProp */

/*
 * Data routines
 * Url: https://jquery.com
 * Copyright (c) Copyright JS Foundation and other contributors, https://js.foundation/
 * Licensed under MIT
 */
var Data = function(ns){
    this.expando = "DATASET:UID:" + ns.toUpperCase();
    Data.uid++;
};

Data.uid = -1;

Data.prototype = {
    cache: function(owner){
        var value = owner[this.expando];
        if (!value) {
            value = {};
            if (acceptData(owner)) {
                if (owner.nodeType) {
                    owner[this.expando] = value;
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true
                    });
                }
            }
        }
        return value;
    },

    set: function(owner, data, value){
        var prop, cache = this.cache(owner);

        if (typeof data === "string") {
            cache[camelCase(data)] = value;
        } else {
            for (prop in data) {
                if (hasProp(data, prop))
                    cache[camelCase(prop)] = data[prop];
            }
        }
        return cache;
    },

    get: function(owner, key){
        return key === undefined ? this.cache(owner) : owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    },

    access: function(owner, key, value){
        if (key === undefined || ((key && typeof key === "string") && value === undefined) ) {
            return this.get(owner, key);
        }
        this.set(owner, key, value);
        return value !== undefined ? value : key;
    },

    remove: function(owner, key){
        var i, cache = owner[this.expando];
        if (cache === undefined) {
            return ;
        }
        if (key !== undefined) {
            if ( Array.isArray( key ) ) {
                key = key.map( camelCase );
            } else {
                key = camelCase( key );

                key = key in cache ? [ key ] : ( key.match( /[^\x20\t\r\n\f]+/g ) || [] ); // ???
            }

            i = key.length;

            while ( i-- ) {
                delete cache[ key[ i ] ];
            }
        }
        if ( key === undefined || isEmptyObject( cache ) ) {
            if ( owner.nodeType ) {
                owner[ this.expando ] = undefined;
            } else {
                delete owner[ this.expando ];
            }
        }
        return true;
    },

    hasData: function(owner){
        var cache = owner[ this.expando ];
        return cache !== undefined && !isEmptyObject( cache );
    }
};

var dataSet = new Data('m4q');

$.extend({
    hasData: function(elem){
        return dataSet.hasData(elem);
    },

    data: function(elem, key, val){
        return dataSet.access(elem, key, val);
    },

    removeData: function(elem, key){
        return dataSet.remove(elem, key);
    },

    dataSet: function(ns){
        if (not(ns)) return dataSet;
        if (['INTERNAL', 'M4Q'].indexOf(ns.toUpperCase()) > -1) {
            throw Error("You can not use reserved name for your dataset");
        }
        return new Data(ns);
    }
});

$.fn.extend({
    data: function(key, val){
        var res, elem, data, attrs, name, i;

        if (this.length === 0) {
            return ;
        }

        elem = this[0];

        if ( arguments.length === 0 ) {
            if ( this.length ) {
                data = dataSet.get( elem );

                if ( elem.nodeType === 1) {
                    attrs = elem.attributes;
                    i = attrs.length;
                    while ( i-- ) {
                        if ( attrs[ i ] ) {
                            name = attrs[ i ].name;
                            if ( name.indexOf( "data-" ) === 0 ) {
                                name = camelCase( name.slice( 5 ) );
                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                    }
                }
            }

            return data;
        }

        if ( arguments.length === 1 ) {
            res = dataSet.get(elem, key);
            if (res === undefined) {
                if ( elem.nodeType === 1) {
                    if (elem.hasAttribute("data-"+key)) {
                        res = elem.getAttribute("data-"+key);
                    }
                }
            }
            return res;
        }

        return this.each( function() {
            dataSet.set( this, key, val );
        } );
    },

    removeData: function( key ) {
        return this.each( function() {
            dataSet.remove( this, key );
        } );
    },

    origin: function(name, value, def){

        if (this.length === 0) {
            return this;
        }

        if (not(name) && not(value)) {
            return $.data(this[0]);
        }

        if (not(value)) {
            var res = $.data(this[0], "origin-"+name);
            return !not(res) ? res : def;
        }

        this.data("origin-"+name, value);

        return this;
    }
});

// Source: src/utils.js

/* global $, not, camelCase, dashedName, isPlainObject, isEmptyObject, isArrayLike, acceptData, parseUnit, getUnit, isVisible, isHidden, matches, strip, normName, hasProp */

$.extend({
    uniqueId: function (prefix) {
        var d = new Date().getTime();
        if (not(prefix)) {
            prefix = 'm4q';
        }
        return (prefix !== '' ? prefix + '-' : '') + 'xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },

    toArray: function(n){
        var i, out = [];

        for (i = 0 ; i < n.length; i++ ) {
            out.push(n[i]);
        }

        return out;
    },

    import: function(ctx){
        var res = [];
        this.each(ctx, function(){
            res.push(this);
        });
        return this.merge($(), res);
    },

    merge: function( first, second ) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },

    type: function(obj){
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
    },

    sleep: function(ms) {
        ms += new Date().getTime();
        /* eslint-disable-next-line */
        while (new Date() < ms){}
    },

    isSelector: function(selector){
        if (typeof(selector) !== 'string') {
            return false;
        }
        if (selector.indexOf("<") !== -1) {
            return false;
        }
        try {
            $(selector);
        } catch(error) {
            return false;
        }
        return true;
    },

    remove: function(s){
        return $(s).remove();
    },

    camelCase: function(string){return camelCase(string);},
    dashedName: function(str){return dashedName(str);},
    isPlainObject: function(obj){return isPlainObject(obj);},
    isEmptyObject: function(obj){return isEmptyObject(obj);},
    isArrayLike: function(obj){return isArrayLike(obj);},
    acceptData: function(owner){return acceptData(owner);},
    not: function(val){return not(val);},
    parseUnit: function(str, out){return parseUnit(str, out);},
    getUnit: function(str, und){return getUnit(str, und);},
    unit: function(str, out){return parseUnit(str, out);},
    isVisible: function(elem) {return isVisible(elem);},
    isHidden: function(elem) {return isHidden(elem);},
    matches: function(el, s) {return matches.call(el, s);},
    random: function(from, to) {
        if (arguments.length === 1 && isArrayLike(from)) {
            return from[Math.floor(Math.random()*(from.length))];
        }
        return Math.floor(Math.random()*(to-from+1)+from);
    },
    strip: function(val, what){return strip(val, what);},
    normName: function(val){return normName(val);},
    hasProp: function(obj, prop){return hasProp(obj, prop);},

    serializeToArray: function(form){
        var _form = $(form)[0];
        if (!_form || _form.nodeName !== "FORM") {
            console.warn("Element is not a HTMLFromElement");
            return;
        }
        var i, j, q = [];
        for (i = _form.elements.length - 1; i >= 0; i = i - 1) {
            if (_form.elements[i].name === "") {
                continue;
            }
            switch (_form.elements[i].nodeName) {
                case 'INPUT':
                    switch (_form.elements[i].type) {
                        case 'checkbox':
                        case 'radio':
                            if (_form.elements[i].checked) {
                                q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            }
                            break;
                        case 'file':
                            break;
                        default: q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                    }
                    break;
                case 'TEXTAREA':
                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                    break;
                case 'SELECT':
                    switch (_form.elements[i].type) {
                        case 'select-one':
                            q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            break;
                        case 'select-multiple':
                            for (j = _form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                if (_form.elements[i].options[j].selected) {
                                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].options[j].value));
                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (_form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                            break;
                    }
                    break;
            }
        }
        return q;
    },
    serialize: function(form){
        return $.serializeToArray(form).join("&");
    }
});

$.fn.extend({
    items: function(){
        return $.toArray(this);
    }
});

// Source: src/events.js

/* global $, not, camelCase, str2arr, normName, matches, isEmptyObject, isPlainObject */

(function () {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

var overriddenStop =  Event.prototype.stopPropagation;
var overriddenPrevent =  Event.prototype.preventDefault;

Event.prototype.stopPropagation = function(){
    this.isPropagationStopped = true;
    overriddenStop.apply(this, arguments);
};
Event.prototype.preventDefault = function(){
    this.isPreventedDefault = true;
    overriddenPrevent.apply(this, arguments);
};

Event.prototype.stop = function(immediate){
    return immediate ? this.stopImmediatePropagation() : this.stopPropagation();
};

$.extend({
    events: [],
    eventHooks: {},

    eventUID: -1,

    /*
    * el, eventName, handler, selector, ns, id, options
    * */
    setEventHandler: function(obj){
        var i, freeIndex = -1, eventObj, resultIndex;
        if (this.events.length > 0) {
            for(i = 0; i < this.events.length; i++) {
                if (this.events[i].handler === null) {
                    freeIndex = i;
                    break;
                }
            }
        }

        eventObj = {
            element: obj.el,
            event: obj.event,
            handler: obj.handler,
            selector: obj.selector,
            ns: obj.ns,
            id: obj.id,
            options: obj.options
        };

        if (freeIndex === -1) {
            this.events.push(eventObj);
            resultIndex = this.events.length - 1;
        } else {
            this.events[freeIndex] = eventObj;
            resultIndex = freeIndex;
        }

        return resultIndex;
    },

    getEventHandler: function(index){
        if (this.events[index] !== undefined && this.events[index] !== null) {
            this.events[index] = null;
            return this.events[index].handler;
        }
        return undefined;
    },

    off: function(){
        $.each(this.events, function(){
            this.element.removeEventListener(this.event, this.handler, true);
        });
        this.events = [];
        return this;
    },

    getEvents: function(){
        return this.events;
    },

    getEventHooks: function(){
        return this.eventHooks;
    },

    addEventHook: function(event, handler, type){
        if (not(type)) {
            type = "before";
        }
        $.each(str2arr(event), function(){
            this.eventHooks[camelCase(type+"-"+this)] = handler;
        });
        return this;
    },

    removeEventHook: function(event, type){
        if (not(type)) {
            type = "before";
        }
        $.each(str2arr(event), function(){
            delete this.eventHooks[camelCase(type+"-"+this)];
        });
        return this;
    },

    removeEventHooks: function(event){
        var that = this;
        if (not(event)) {
            this.eventHooks = {};
        } else {
            $.each(str2arr(event), function(){
                delete that.eventHooks[camelCase("before-"+this)];
                delete that.eventHooks[camelCase("after-"+this)];
            });
        }
        return this;
    }
});

$.fn.extend({
    on: function(eventsList, sel, handler, options){
        if (this.length === 0) {
            return ;
        }

        if (typeof sel === 'function') {
            options = handler;
            handler = sel;
            sel = undefined;
        }

        if (!isPlainObject(options)) {
            options = {};
        }

        return this.each(function(){
            var el = this;
            $.each(str2arr(eventsList), function(){
                var h, ev = this,
                    event = ev.split("."),
                    name = normName(event[0]),
                    ns = options.ns ? options.ns : event[1],
                    index, originEvent;

                $.eventUID++;

                h = function(e){
                    var target = e.target;
                    var beforeHook = $.eventHooks[camelCase("before-"+name)];
                    var afterHook = $.eventHooks[camelCase("after-"+name)];

                    if (typeof beforeHook === "function") {
                        beforeHook.call(target, e);
                    }

                    if (!sel) {
                        handler.call(el, e);
                    } else {
                        while (target && target !== el) {
                            if (matches.call(target, sel)) {
                                handler.call(target, e);
                                if (e.isPropagationStopped) {
                                    e.stopImmediatePropagation();
                                    break;
                                }
                            }
                            target = target.parentNode;
                        }
                    }

                    if (typeof afterHook === "function") {
                        afterHook.call(target, e);
                    }

                    if (options.once) {
                        index = +$(el).origin( "event-"+e.type+(sel ? ":"+sel:"")+(ns ? ":"+ns:"") );
                        if (!isNaN(index)) $.events.splice(index, 1);
                    }
                };

                Object.defineProperty(h, "name", {
                    value: handler.name && handler.name !== "" ? handler.name : "func_event_"+name+"_"+$.eventUID
                });

                originEvent = name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");

                el.addEventListener(name, h, !isEmptyObject(options) ? options : false);

                index = $.setEventHandler({
                    el: el,
                    event: name,
                    handler: h,
                    selector: sel,
                    ns: ns,
                    id: $.eventUID,
                    options: !isEmptyObject(options) ? options : false
                });
                $(el).origin('event-'+originEvent, index);
            });
        });
    },

    one: function(events, sel, handler, options){
        if (!isPlainObject(options)) {
            options = {};
        }

        options.once = true;

        return this.on.apply(this, [events, sel, handler, options]);
    },

    off: function(eventsList, sel, options){

        if (isPlainObject(sel)) {
            options = sel;
            sel = null;
        }

        if (!isPlainObject(options)) {
            options = {};
        }

        if (not(eventsList) || eventsList.toLowerCase() === 'all') {
            return this.each(function(){
                var el = this;
                $.each($.events, function(){
                    var e = this;
                    if (e.element === el) {
                        el.removeEventListener(e.event, e.handler, e.options);
                        e.handler = null;
                        $(el).origin("event-"+name+(e.selector ? ":"+e.selector:"")+(e.ns ? ":"+e.ns:""), null);
                    }
                });
            });
        }

        return this.each(function(){
            var el = this;
            $.each(str2arr(eventsList), function(){
                var evMap = this.split("."),
                    name = normName(evMap[0]),
                    ns = options.ns ? options.ns : evMap[1],
                    originEvent, index;

                originEvent = "event-"+name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");
                index = $(el).origin(originEvent);

                if (index !== undefined && $.events[index].handler) {
                    el.removeEventListener(name, $.events[index].handler, $.events[index].options);
                    $.events[index].handler = null;
                }

                $(el).origin(originEvent, null);
            });
        });
    },

    trigger: function(name, data){
        return this.fire(name, data);
    },

    fire: function(name, data){
        var _name;

        if (this.length === 0) {
            return ;
        }

        _name = normName(name);

        if (['focus', 'blur'].indexOf(_name) > -1) {
            this[0][_name]();
            return this;
        }

        var e = document.createEvent('Events');
        e.detail = data;
        e.initEvent(_name, true, false);

        return this.each(function(){
            this.dispatchEvent(e);
        });
    }
});

( "blur focus resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu touchstart touchend touchmove touchcancel" )
    .split( " " )
    .forEach(
    function( name ) {
        $.fn[ name ] = function( sel, fn, opt ) {
            return arguments.length > 0 ?
                this.on( name, sel, fn, opt ) :
                this.fire( name );
        };
});

$.fn.extend( {
    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

$.ready = function(fn, options){
    document.addEventListener('DOMContentLoaded', fn, (options || false));
};

$.load = function(fn){
    return $(window).on("load", fn);
};

$.unload = function(fn){
    return $(window).on("unload", fn);
};

$.fn.extend({
    unload: function(fn){
        return (this.length === 0 || this[0].self !== window) ? undefined : $.unload(fn);
    }
});

$.beforeunload = function(fn){
    if (typeof fn === "string") {
        return $(window).on("beforeunload", function(e){
            e.returnValue = fn;
            return fn;
        });
    } else {
        return $(window).on("beforeunload", fn);
    }
};

$.fn.extend({
    beforeunload: function(fn){
        return (this.length === 0 || this[0].self !== window) ? undefined : $.beforeunload(fn);
    }
});

$.fn.extend({
    ready: function(fn){
        if (this.length && this[0] === document && typeof fn === 'function') {
            return $.ready(fn);
        }
    }
});

// Source: src/ajax.js

/* global $, Promise, not, isSimple, isPlainObject, isEmptyObject, camelCase */

$.ajax = function(p){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest(), data;
        var method = (p.method || "GET").toUpperCase();
        var headers = [];
        var async = not(p.async) ? true : p.async;
        var url = p.url;

        var exec = function(fn, params){
            if (typeof fn === "function") {
                fn.apply(null, params);
            }
        };

        var isGet = function(method){
            return ["GET", "JSON"].indexOf(method) !== -1;
        };

        var plainObjectToData = function(obj){
            var _data = [];
            $.each(obj, function(k, v){
                var _v = isSimple(v) ? v : JSON.stringify(v);
                _data.push(k+"=" + _v);
            });
            return _data.join("&");
        };

        if (p.data instanceof HTMLFormElement) {
            var _action = p.data.getAttribute("action");
            var _method = p.data.getAttribute("method");

            if (not(url) && _action && _action.trim() !== "") {url = _action;}
            if (_method && _method.trim() !== "") {method = _method.toUpperCase();}
        }


        if (p.timeout) {
            xhr.timeout = p.timeout;
        }

        if (p.withCredentials) {
            xhr.withCredentials = p.withCredentials;
        }

        if (p.data instanceof HTMLFormElement) {
            data = $.serialize(p.data);
        } else if (p.data instanceof HTMLElement && p.data.getAttribute("type") && p.data.getAttribute("type").toLowerCase() === "file") {
            var _name = p.data.getAttribute("name");
            data = new FormData();
            for (var i = 0; i < p.data.files.length; i++) {
                data.append(_name, p.data.files[i]);
            }
        } else if (isPlainObject(p.data)) {
            data = plainObjectToData(p.data);
        } else if (p.data instanceof FormData) {
            data = p.data;
        } else if (typeof p.data === "string") {
            data = p.data;
        } else {
            data = new FormData();
            data.append("_data", JSON.stringify(p.data));
        }

        if (isGet(method)) {
            url += (typeof data === "string" ? "?"+data : isEmptyObject(data) ? "" : "?"+JSON.stringify(data));
        }

        xhr.open(method, url, async, p.user, p.password);
        if (p.headers) {
            $.each(p.headers, function(k, v){
                xhr.setRequestHeader(k, v);
                headers.push(k);
            });
        }
        if (!isGet(method)) {
            if (headers.indexOf("Content-type") === -1 && p.contentType !== false) {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
        }
        xhr.send(data);

        xhr.addEventListener("load", function(e){
            if (xhr.readyState === 4 && xhr.status < 300) {
                var _return = p.returnValue && p.returnValue === 'xhr' ? xhr : xhr.response;
                if (p.parseJson) {
                    try {
                        _return = JSON.parse(_return);
                    } catch (ex) {
                        _return = {};
                    }
                }
                exec(resolve, [_return]);
                exec(p.onSuccess, [e, xhr]);
            } else {
                exec(reject, [xhr]);
                exec(p.onFail, [e, xhr]);
            }
            exec(p.onLoad, [e, xhr]);
        });

        $.each(["readystatechange", "error", "timeout", "progress", "loadstart", "loadend", "abort"], function(){
            var ev = camelCase("on-"+(this === 'readystatechange' ? 'state' : this));
            xhr.addEventListener(ev, function(e){
                exec(p[ev], [e, xhr]);
            });
        });
    });
};

['get', 'post', 'put', 'patch', 'delete', 'json'].forEach(function(method){
    $[method] = function(url, data, options){
        var _method = method.toUpperCase();
        var _options = {
            method: _method === 'JSON' ? 'GET' : _method,
            url: url,
            data: data,
            parseJson: _method === 'JSON'
        };
        return $.ajax($.extend({}, _options, options));
    };
});

$.fn.extend({
    load: function(url, data, options){
        var that = this;

        if (this.length && this[0].self === window ) {
            return $.load(url);
        }

        return $.get(url, data, options).then(function(data){
            that.each(function(){
                this.innerHTML = data;
            });
        });
    }
});

// Source: src/css.js

/* global $, not, setStyleProp */

$.fn.extend({

    style: function(name, pseudo){
        var el;

        function _getStyle(el, prop, pseudo){
            return ["scrollLeft", "scrollTop"].indexOf(prop) > -1 ? $(el)[prop]() : getComputedStyle(el, pseudo)[prop];
        }

        if (typeof name === 'string' && this.length === 0) {
            return undefined;
        }

        if (this.length === 0) {
            return this;
        }

        el = this[0];

        if (not(name) || name === "all") {
            return getComputedStyle(el, pseudo);
        } else {
            var result = {}, names = name.split(", ").map(function(el){
                return (""+el).trim();
            });
            if (names.length === 1)  {
                return _getStyle(el, names[0], pseudo);
            } else {
                $.each(names, function () {
                    var prop = this;
                    result[this] = _getStyle(el, prop, pseudo);
                });
                return result;
            }
        }
    },

    removeStyleProperty: function(name){
        if (not(name) || this.length === 0) return this;
        var names = name.split(", ").map(function(el){
            return (""+el).trim();
        });

        return this.each(function(){
            var el = this;
            $.each(names, function(){
                el.style.removeProperty(this);
            });
        });
    },

    css: function(key, val){
        key = key || 'all';

        if (typeof key === "string" && not(val)) {
            return  this.style(key);
        }

        return this.each(function(){
            var el = this;
            if (typeof key === "object") {
                $.each(key, function(key, val){
                    setStyleProp(el, key, val);
                });
            } else if (typeof key === "string") {
                setStyleProp(el, key, val);
            }
        });
    },

    scrollTop: function(val){
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? pageYOffset : this[0].scrollTop;
        }
        return this.each(function(){
            this.scrollTop = val;
        });
    },

    scrollLeft: function(val){
        if (not(val)) {
            return this.length === 0 ? undefined : this[0] === window ? pageXOffset : this[0].scrollLeft;
        }
        return this.each(function(){
            this.scrollLeft = val;
        });
    }
});



// Source: src/classes.js

/* global $, not */

$.fn.extend({
    addClass: function(){},
    removeClass: function(){},
    toggleClass: function(){},

    containsClass: function(cls){
        return this.hasClass(cls);
    },

    hasClass: function(cls){
        var result = false;
        var classes = cls.split(" ").filter(function(v){
            return (""+v).trim() !== "";
        });

        if (not(cls)) {
            return false;
        }

        this.each(function(){
            var el = this;

            $.each(classes, function(){
                if (!result && el.classList && el.classList.contains(this)) {
                    result = true;
                }
            });
        });

        return result;
    },

    clearClasses: function(){
        return this.each(function(){
            this.className = "";
        });
    },

    cls: function(array){
        return this.length === 0 ? undefined : array ? this[0].className.split(" ") : this[0].className;
    },

    removeClassBy: function(mask){
        return this.each(function(){
            var el = $(this);
            var classes = el.cls(true);
            $.each(classes, function(){
                var elClass = this;
                if (elClass.indexOf(mask) > -1) {
                    el.removeClass(elClass);
                }
            });
        });
    }
});

['add', 'remove', 'toggle'].forEach(function (method) {
    $.fn[method + "Class"] = function(cls){
        if (not(cls) || (""+cls).trim() === "") return this;
        return this.each(function(){
            var el = this;
            var hasClassList = typeof el.classList !== "undefined";
            $.each(cls.split(" ").filter(function(v){
                return (""+v).trim() !== "";
            }), function(){
                if (hasClassList) el.classList[method](this);
            });
        });
    };
});


// Source: src/parser.js

/* global $, isPlainObject, hasProp */

$.parseHTML = function(data, context){
    var base, singleTag, result = [], ctx, _context;
    /* eslint-disable-next-line */
    var regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

    if (typeof data !== "string") {
        return [];
    }

    data = data.trim();

    ctx = document.implementation.createHTMLDocument("");
    base = ctx.createElement( "base" );
    base.href = document.location.href;
    ctx.head.appendChild( base );
    _context = ctx.body;

    singleTag = regexpSingleTag.exec(data);

    if (singleTag) {
        result.push(document.createElement(singleTag[1]));
    } else {
        _context.innerHTML = data;
        for(var i = 0; i < _context.childNodes.length; i++) {
            result.push(_context.childNodes[i]);
        }
    }

    if (context && !(context instanceof $) && isPlainObject(context)) {
        $.each(result,function(){
            var el = this;
            for(var name in context) {
                if (hasProp(context, name))
                    el.setAttribute(name, context[name]);
            }
        });
    }

    return result;
};


// Source: src/size.js

/* global $, not */

$.fn.extend({
    _size: function(prop, val){
        if (this.length === 0) return ;

        if (not(val)) {

            var el = this[0];

            if (prop === 'height') {
                return el === window ? window.innerHeight : el === document ? el.body.clientHeight : parseInt(getComputedStyle(el).height);
            }
            if (prop === 'width') {
                return el === window ? window.innerWidth : el === document ? el.body.clientWidth : parseInt(getComputedStyle(el).width);
            }
        }

        return this.each(function(){
            var el = this;
            if (el === window || el === document) {return ;}
            el.style[prop] = isNaN(val) ? val : val + 'px';
        });
    },

    height: function(val){
        return this._size('height', val);
    },

    width: function(val){
        return this._size('width', val);
    },

    _sizeOut: function(prop, val){
        var el, size, style, result;

        if (this.length === 0) {
            return ;
        }

        if (!not(val) && typeof val !== "boolean") {
            return this.each(function(){
                var el = this;
                if (el === window || el === document) {return ;}
                var h, style = getComputedStyle(el),
                    bs = prop === 'width' ? parseInt(style['border-left-width']) + parseInt(style['border-right-width']) : parseInt(style['border-top-width']) + parseInt(style['border-bottom-width']),
                    pa = prop === 'width' ? parseInt(style['padding-left']) + parseInt(style['padding-right']) : parseInt(style['padding-top']) + parseInt(style['padding-bottom']);

                h = $(this)[prop](val)[prop]() - bs - pa;
                el.style[prop] = h + 'px';
            });
        }

        el = this[0];
        size = el[prop === 'width' ? 'offsetWidth' : 'offsetHeight'];
        style = getComputedStyle(el);
        result = size + parseInt(style[prop === 'width' ? 'margin-left' : 'margin-top']) + parseInt(style[prop === 'width' ? 'margin-right' : 'margin-bottom']);
        return val === true ? result : size;
    },

    outerWidth: function(val){
        return this._sizeOut('width', val);
    },

    outerHeight: function(val){
        return this._sizeOut('height', val);
    },

    padding: function(p){
        if (this.length === 0) return;
        var s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["padding-top"]),
            right: parseInt(s["padding-right"]),
            bottom: parseInt(s["padding-bottom"]),
            left: parseInt(s["padding-left"])
        };
    },

    margin: function(p){
        if (this.length === 0) return;
        var s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["margin-top"]),
            right: parseInt(s["margin-right"]),
            bottom: parseInt(s["margin-bottom"]),
            left: parseInt(s["margin-left"])
        };
    },

    border: function(p){
        if (this.length === 0) return;
        var s = getComputedStyle(this[0], p);

        return {
            top: parseInt(s["border-top-width"]),
            right: parseInt(s["border-right-width"]),
            bottom: parseInt(s["border-bottom-width"]),
            left: parseInt(s["border-left-width"])
        };
    }
});

// Source: src/position.js

/* global $, not */

$.fn.extend({
    offset: function(val){
        var rect;

        if (not(val)) {
            if (this.length === 0) return undefined;
            rect = this[0].getBoundingClientRect();
            return {
                top: rect.top + pageYOffset,
                left: rect.left + pageXOffset
            };
        }

        return this.each(function(){ //?
            var el = $(this),
                top = val.top,
                left = val.left,
                position = getComputedStyle(this).position,
                offset = el.offset();

            if (position === "static") {
                el.css("position", "relative");
            }

            if (["absolute", "fixed"].indexOf(position) === -1) {
                top = top - offset.top;
                left = left - offset.left;
            }

            el.css({
                top: top,
                left: left
            });
        });
    },

    position: function(margin){
        var ml = 0, mt = 0, el, style;

        if (not(margin) || typeof margin !== "boolean") {
            margin = false;
        }

        if (this.length === 0) {
            return undefined;
        }

        el = this[0];
        style = getComputedStyle(el);

        if (margin) {
            ml = parseInt(style['margin-left']);
            mt = parseInt(style['margin-top']);
        }

        return {
            left: el.offsetLeft - ml,
            top: el.offsetTop - mt
        };
    },

    left: function(val, margin){
        if (this.length === 0) return ;
        if (not(val)) {
            return this.position(margin).left;
        }
        if (typeof val === "boolean") {
            margin = val;
            return this.position(margin).left;
        }
        return this.each(function(){
            $(this).css({
                left: val
            });
        });
    },

    top: function(val, margin){
        if (this.length === 0) return ;
        if (not(val)) {
            return this.position(margin).top;
        }
        if (typeof val === "boolean") {
            margin = val;
            return this.position(margin).top;
        }
        return this.each(function(){
            $(this).css({
                top: val
            });
        });
    },

    coord: function(){
        return this.length === 0 ? undefined : this[0].getBoundingClientRect();
    },

    pos: function(){
        if (this.length === 0) return ;
        return {
            top: parseInt($(this[0]).style("top")),
            left: parseInt($(this[0]).style("left"))
        };
    }
});

// Source: src/attr.js

/* global $, not, isPlainObject */

$.fn.extend({
    attr: function(name, val){
        var attributes = {};

        if (this.length === 0 && arguments.length === 0) {
            return undefined;
        }

        if (this.length && arguments.length === 0) {
            $.each(this[0].attributes, function(){
                attributes[this.nodeName] = this.nodeValue;
            });
            return attributes;
        }

        if (typeof name === 'string' && val === undefined) {
            return this.length && this[0].nodeType === 1 && this[0].hasAttribute(name) ? this[0].getAttribute(name) : undefined;
        }

        return this.each(function(){
            var el = this;
            if (isPlainObject(name)) {
                $.each(name, function(k, v){
                    el.setAttribute(k, v);
                });
            } else {
                el.setAttribute(name, val);
                // console.log(name, val);
            }
        });
    },

    removeAttr: function(name){
        var attributes;

        if (not(name)) {
            return this.each(function(){
                var el = this;
                $.each(this.attributes, function(){
                    el.removeAttribute(this);
                });
            });
        }

        attributes = typeof name === "string" ? name.split(",").map(function(el){
            return el.trim();
        }) : name;

        return this.each(function(){
            var el = this;
            $.each(attributes, function(){
                if (el.hasAttribute(this)) el.removeAttribute(this);
            });
        });
    },

    toggleAttr: function(name, val){
        return this.each(function(){
            var el = this;

            if (not(val)) {
                el.removeAttribute(name);
            } else {
                el.setAttribute(name, val);
            }

        });
    },

    id: function(val){
        return this.length ? $(this[0]).attr("id", val) : undefined;
    }
});

$.extend({
    meta: function(name){
        return not(name) ? $("meta") : $("meta[name='$name']".replace("$name", name));
    },

    metaBy: function(name){
        return not(name) ? $("meta") : $("meta[$name]".replace("$name", name));
    },

    doctype: function(){
        return $("doctype");
    },

    html: function(){
        return $("html");
    },

    head: function(){
        return $("html").find("head");
    },

    body: function(){
        return $("body");
    },

    document: function(){
        return $(document);
    },

    window: function(){
        return $(window);
    },

    charset: function(val){
        var meta = $("meta[charset]");
        if (val) {
            meta.attr("charset", val);
        }
        return meta.attr("charset");
    }
});

// Source: src/proxy.js

/* global $ */

$.extend({
    proxy: function(fn, ctx){
        return typeof fn !== "function" ? undefined : fn.bind(ctx);
    },

    bind: function(fn, ctx){
        return this.proxy(fn, ctx);
    }
});


// Source: src/manipulation.js

/* global $, isArrayLike, not, matches, hasProp */

(function (arr) {
    arr.forEach(function (item) {
        ['append', 'prepend'].forEach(function(where){
            if (hasProp(item, where)) {
                return;
            }
            Object.defineProperty(item, where, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function prepend() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function (argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    if (where === 'prepend')
                        this.insertBefore(docFrag, this.firstChild);
                    else
                        this.appendChild(docFrag);
                }
            });
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

var normalizeElements = function(s){
    var result;
    if (typeof s === "string") result = $.isSelector(s) ? $(s) : $.parseHTML(s);
    else if (s instanceof HTMLElement) result = [s];
    else if (isArrayLike(s)) result = s;
    return result;
};

$.fn.extend({
    append: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(elIndex, el){
            $.each(_elements, function(){
                if (el === this) return ;
                var child = elIndex === 0 ? this : this.cloneNode(true);
                $.script(child);
                if (child.tagName && child.tagName !== "SCRIPT") el.append(child);
            });
        });
    },

    appendTo: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                parent.append(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    prepend: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function (elIndex, el) {
            $.each(_elements, function(){
                if (el === this) return ;
                var child = elIndex === 0 ? this : this.cloneNode(true);
                $.script(child);
                if (child.tagName && child.tagName !== "SCRIPT") el.prepend(child);
            });
        });
    },

    prependTo: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(parIndex, parent){
                if (el === this) return ;
                $(parent).prepend(parIndex === 0 ? el : el.cloneNode(true));
            });
        });
    },

    insertBefore: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(elIndex){
                if (el === this) return ;
                var parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), this);
                }
            });
        });
    },

    insertAfter: function(elements){
        var _elements = normalizeElements(elements);

        return this.each(function(){
            var el = this;
            $.each(_elements, function(elIndex, element){
                if (el === this) return ;
                var parent = this.parentNode;
                if (parent) {
                    parent.insertBefore(elIndex === 0 ? el : el.cloneNode(true), element.nextSibling);
                }
            });
        });
    },

    after: function(html){
        return this.each(function(){
            var el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('afterend', html);
            } else {
                $(html).insertAfter(el);
            }
        });
    },

    before: function(html){
        return this.each(function(){
            var el = this;
            if (typeof html === "string") {
                el.insertAdjacentHTML('beforebegin', html);
            } else {
                $(html).insertBefore(el);
            }
        });
    },

    clone: function(deep, withData){
        var res = [];
        if (not(deep)) {
            deep = false;
        }
        if (not(withData)) {
            withData = false;
        }
        this.each(function(){
            var el = this.cloneNode(deep);
            var $el = $(el);
            var data;
            if (withData && $.hasData(this)) {
                data = $(this).data();
                $.each(data, function(k, v){
                    $el.data(k, v);
                });
            }
            res.push(el);
        });
        return $.merge($(), res);
    },

    import: function(deep){
        var res = [];
        if (not(deep)) {
            deep = false;
        }
        this.each(function(){
            res.push(document.importNode(this, deep));
        });
        return $.merge($(), res);
    },

    adopt: function(){
        var res = [];
        this.each(function(){
            res.push(document.adoptNode(this));
        });
        return $.merge($(), res);
    },

    remove: function(selector){
        var i = 0, node, out, res = [];

        if (this.length === 0) {
            return ;
        }

        out = selector ? this.filter(function(el){
            return matches.call(el, selector);
        }) : this.items();

        for ( ; ( node = out[ i ] ) != null; i++ ) {
            if (node.parentNode) {
                res.push(node.parentNode.removeChild(node));
                $.removeData(node);
            }
        }

        return $.merge($(), res);
    }
});

// Source: src/animation.js

/* global $, not, camelCase, parseUnit, Promise, getUnit */

$.extend({
    animation: {
        duration: 1000,
        ease: "linear",
        elements: {}
    }
});

if (typeof window["setupAnimation"] === 'object') {
    $.each(window["setupAnimation"], function(key, val){
        if (typeof $.animation[key] !== "undefined" && !not(val))
            $.animation[key] = val;
    });
}

var transformProps = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY'];
var numberProps = ['opacity', 'zIndex'];
var floatProps = ['opacity', 'volume'];
var scrollProps = ["scrollLeft", "scrollTop"];
var reverseProps = ["opacity", "volume"];

function _validElement(el) {
    return el instanceof HTMLElement || el instanceof SVGElement;
}

/**
 *
 * @param to
 * @param from
 * @returns {*}
 * @private
 */
function _getRelativeValue (to, from) {
    var operator = /^(\*=|\+=|-=)/.exec(to);
    if (!operator) return to;
    var u = getUnit(to) || 0;
    var x = parseFloat(from);
    var y = parseFloat(to.replace(operator[0], ''));
    switch (operator[0][0]) {
        case '+':
            return x + y + u;
        case '-':
            return x - y + u;
        case '*':
            return x * y + u;
    }
}

/**
 *
 * @param el
 * @param prop
 * @param pseudo
 * @returns {*|number|string}
 * @private
 */
function _getStyle (el, prop, pseudo){
    if (typeof el[prop] !== "undefined") {
        if (scrollProps.indexOf(prop) > -1) {
            return prop === "scrollLeft" ? el === window ? pageXOffset : el.scrollLeft : el === window ? pageYOffset : el.scrollTop;
        } else {
            return el[prop] || 0;
        }
    }

    return el.style[prop] || getComputedStyle(el, pseudo)[prop];
}

/**
 *
 * @param el
 * @param key
 * @param val
 * @param unit
 * @param toInt
 * @private
 */
function _setStyle (el, key, val, unit, toInt) {

    if (not(toInt)) {
        toInt = false;
    }

    key = camelCase(key);

    if (toInt) {
        val  = parseInt(val);
    }

    if (_validElement(el)) {
        if (typeof el[key] !== "undefined") {
            el[key] = val;
        } else {
            el.style[key] = key === "transform" || key.toLowerCase().includes('color') ? val : val + unit;
        }
    } else {
        el[key] = val;
    }
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyStyles (el, mapProps, p) {
    $.each(mapProps, function (key, val) {
        _setStyle(el, key, val[0] + (val[2] * p), val[3], val[4]);
    });
}

/**
 *
 * @param el
 * @returns {{}}
 * @private
 */
function _getElementTransforms (el) {
    if (!_validElement(el)) return {};
    var str = el.style.transform || '';
    var reg = /(\w+)\(([^)]*)\)/g;
    var transforms = {};
    var m;

    /* jshint ignore:start */
    // eslint-disable-next-line
    while (m = reg.exec(str))
        transforms[m[1]] = m[2];
    /* jshint ignore:end */

    return transforms;
}

/**
 *
 * @param val
 * @returns {number[]}
 * @private
 */
function _getColorArrayFromHex (val){
    var a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val ? val : "#000000");
    return a.slice(1).map(function(v) {
            return parseInt(v, 16);
    });
}

/**
 *
 * @param el
 * @param key
 * @returns {number[]}
 * @private
 */
function _getColorArrayFromElement (el, key) {
    return getComputedStyle(el)[key].replace(/[^\d.,]/g, '').split(',').map(function(v) {
        return parseInt(v);
    });
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyTransform (el, mapProps, p) {
    var t = [];
    var elTransforms = _getElementTransforms(el);

    $.each(mapProps, function(key, val) {
        var from = val[0], to = val[1], delta = val[2], unit = val[3];
        key = "" + key;

        if ( key.indexOf("rotate") > -1 || key.indexOf("skew") > -1) {
            if (unit === "") unit = "deg";
        }

        if (key.indexOf('scale') > -1) {
            unit = '';
        }

        if (key.indexOf('translate') > -1 && unit === '') {
            unit = 'px';
        }

        if (unit === "turn") {
            t.push(key+"(" + (to * p) + unit + ")");
        } else {
            t.push(key +"(" + (from + (delta * p)) + unit+")");
        }
    });

    $.each(elTransforms, function(key, val) {
        if (mapProps[key] === undefined) {
            t.push(key+"("+val+")");
        }
    });

    el.style.transform = t.join(" ");
}

/**
 *
 * @param el
 * @param mapProps
 * @param p
 * @private
 */
function _applyColors (el, mapProps, p) {
    $.each(mapProps, function (key, val) {
        var i, result = [0, 0, 0], v;
        for (i = 0; i < 3; i++) {
            result[i] = Math.floor(val[0][i] + (val[2][i] * p));
        }
        v = "rgb("+(result.join(","))+")";
        el.style[key] = v;
    });
}

/**
 *
 * @param val
 * @returns {string|*}
 * @private
 */
function _expandColorValue (val) {
    var regExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    if (val[0] === "#" && val.length === 4) {
        return "#" + val.replace(regExp, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    }
    return val[0] === "#" ? val : "#"+val;
}

/**
 *
 * @param el
 * @param map
 * @param p
 */
function applyProps (el, map, p) {
    _applyStyles(el, map.props, p);
    _applyTransform(el, map.transform, p);
    _applyColors(el, map.color, p);
}

/**
 *
 * @param el
 * @param draw
 * @param dir
 * @returns {{transform: {}, color: {}, props: {}}}
 */
function createAnimationMap (el, draw, dir) {
    var map = {
        props: {},
        transform: {},
        color: {}
    };
    var i, from, to, delta, unit, temp;
    var elTransforms = _getElementTransforms(el);

    if (not(dir)) {
        dir = "normal";
    }

    $.each(draw, function(key, val) {

        var isTransformProp = transformProps.indexOf(""+key) > -1;
        var isNumProp = numberProps.indexOf(""+key) > -1;
        var isColorProp = (""+key).toLowerCase().indexOf("color") > -1;

        if (Array.isArray(val) && val.length === 1) {
            val = val[0];
        }

        if (!Array.isArray(val)) {
            if (isTransformProp) {
                from = elTransforms[key] || 0;
            } else if (isColorProp) {
                from = _getColorArrayFromElement(el, key);
            } else {
                from = _getStyle(el, key);
            }
            from = !isColorProp ? parseUnit(from) : from;
            to = !isColorProp ? parseUnit(_getRelativeValue(val, Array.isArray(from) ? from[0] : from)) : _getColorArrayFromHex(val);
        } else {
            from = !isColorProp ? parseUnit(val[0]) : _getColorArrayFromHex(_expandColorValue(val[0]));
            to = !isColorProp ? parseUnit(val[1]) : _getColorArrayFromHex(_expandColorValue(val[1]));
        }

        if (reverseProps.indexOf(""+key) > -1 && from[0] === to[0]) {
            from[0] = to[0] > 0 ? 0 : 1;
        }

        if (dir === "reverse") {
            temp = from;
            from = to;
            to = temp;
        }

        unit = el instanceof HTMLElement && to[1] === '' && !isNumProp && !isTransformProp ? 'px' : to[1];

        if (isColorProp) {
            delta = [0, 0, 0];
            for (i = 0; i < 3; i++) {
                delta[i] = to[i] - from[i];
            }
        } else {
            delta = to[0] - from[0];
        }

        if (isTransformProp) {
            map.transform[key] = [from[0], to[0], delta, unit];
        } else if (isColorProp) {
            map.color[key] = [from, to, delta, unit];
        } else {
            map.props[key] = [from[0], to[0], delta, unit, floatProps.indexOf(""+key) === -1];
        }
    });

    return map;
}

function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

var Easing = {
    linear: function(){return function(t) {return t;};}
};

Easing.default = Easing.linear;

var eases = {
    Sine: function(){
        return function(t){
            return 1 - Math.cos(t * Math.PI / 2);
        };
    },
    Circ: function(){
        return function(t){
            return 1 - Math.sqrt(1 - t * t);
        };
    },
    Back: function(){
        return function(t){
            return t * t * (3 * t - 2);
        };
    },
    Bounce: function(){
        return function(t){
            var pow2, b = 4;
            // eslint-disable-next-line
            while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
            return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2);
        };
    },
    Elastic: function(amplitude, period){
        if (not(amplitude)) {
            amplitude = 1;
        }

        if (not(period)) {
            period = 0.5;
        }
        var a = minMax(amplitude, 1, 10);
        var p = minMax(period, 0.1, 2);
        return function(t){
            return (t === 0 || t === 1) ? t :
                -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
        };
    }
};

['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'].forEach(function(name, i) {
    eases[name] = function(){
        return function(t){
            return Math.pow(t, i + 2);
        };
    };
});

Object.keys(eases).forEach(function(name) {
    var easeIn = eases[name];
    Easing['easeIn' + name] = easeIn;
    Easing['easeOut' + name] = function(a, b){
        return function(t){
            return 1 - easeIn(a, b)(1 - t);
        };
    };
    Easing['easeInOut' + name] = function(a, b){
        return function(t){
            return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
    };
});

var defaultProps = {
    id: null,
    el: null,
    draw: {},
    dur: $.animation.duration,
    ease: $.animation.ease,
    loop: 0,
    pause: 0,
    dir: "normal",
    defer: 0,
    onFrame: function(){},
    onDone: function(){}
};

function animate(args){
    return new Promise(function(resolve){
        var that = this, start;
        var props = $.assign({}, defaultProps, args);
        var id = props.id, el = props.el, draw = props.draw, dur = props.dur, ease = props.ease, loop = props.loop, onFrame = props.onFrame, onDone = props.onDone, pause = props.pause, dir = props.dir, defer = props.defer;
        var map = {};
        var easeName = "linear", easeArgs = [], easeFn = Easing.linear, matchArgs;
        var direction = dir === "alternate" ? "normal" : dir;
        var replay = false;
        var animationID = id ? id : +(performance.now() * Math.pow(10, 14));

        if (not(el)) {
            throw new Error("Unknown element!");
        }

        if (typeof el === "string") {
            el = document.querySelector(el);
        }

        if (typeof draw !== "function" && typeof draw !== "object") {
            throw new Error("Unknown draw object. Must be a function or object!");
        }

        if (dur === 0) {
            dur = 1;
        }

        if (dir === "alternate" && typeof loop === "number") {
            loop *= 2;
        }

        if (typeof ease === "string") {
            matchArgs = /\(([^)]+)\)/.exec(ease);
            easeName = ease.split("(")[0];
            easeArgs = matchArgs ? matchArgs[1].split(',').map(function(p){return parseFloat(p);}) : [];
            easeFn = Easing[easeName] || Easing.linear;
        } else if (typeof ease === "function") {
            easeFn = ease;
        } else {
            easeFn = Easing.linear;
        }

        $.animation.elements[animationID] = {
            element: el,
            id: null,
            stop: 0,
            pause: 0,
            loop: 0
        };

        var play = function() {
            if (typeof draw === "object") {
                map = createAnimationMap(el, draw, direction);
            }
            start = performance.now();
            $.animation.elements[animationID].loop += 1;
            $.animation.elements[animationID].id = requestAnimationFrame(animate);
        };

        var done = function() {
            cancelAnimationFrame($.animation.elements[animationID].id);
            delete $.animation.elements[id];

            if (typeof onDone === "function") {
                onDone.apply(el);
            }

            resolve(that);
        };

        var animate = function(time) {
            var p, t;
            var stop = $.animation.elements[animationID].stop;

            if ( stop > 0) {
                if (stop === 2) {
                    if (typeof draw === "function") {

                        draw.bind(el)(1, 1);

                    } else {

                        applyProps(el, map, 1);

                    }
                }
                done();
                return;
            }

            t = (time - start) / dur;

            if (t > 1) t = 1;
            if (t < 0) t = 0;

            p = easeFn.apply(null, easeArgs)(t);

            if (typeof draw === "function") {

                draw.bind(el)(t, p);

            } else {

                applyProps(el, map, p);

            }

            if (typeof onFrame === 'function') {
                onFrame.apply(el, [t, p]);
            }

            if (t < 1) {
                $.animation.elements[animationID].id = requestAnimationFrame(animate);
            }

            if (parseInt(t) === 1) {
                if (loop) {
                    if (dir === "alternate") {
                        direction = direction === "normal" ? "reverse" : "normal";
                    }

                    if (typeof loop === "boolean") {
                        setTimeout(function () {
                            play();
                        }, pause);
                    } else {
                        if (loop > $.animation.elements[animationID].loop) {
                            setTimeout(function () {
                                play();
                            }, pause);
                        } else {
                            done();
                        }
                    }
                } else {
                    if (dir === "alternate" && !replay) {
                        direction = direction === "normal" ? "reverse" : "normal";
                        replay = true;
                        play();
                    } else {
                        done();
                    }
                }
            }
        };
        if (defer > 0) {
            setTimeout(function() {
                play();
            }, defer);
        } else {
            play();
        }
    });
}

/* eslint-disable */
function stop(id, done){
    if (not(done)) {
        done = true;
    }
    $.animation.elements[id].stop = done === true ? 2 : 1;
}
/* eslint-enable */

function chain(arr, loop){
    if (not(loop)) loop = false;
    if (!Array.isArray(arr)) {
        console.warn("Chain array is not defined!");
        return false;
    }

    var reducer = function(acc, item){
        return acc.then(function(){
            return animate(item);
        });
    };

    arr.reduce(reducer, Promise.resolve()).then(function(){
        if (loop) {
            if (typeof loop === "boolean") {
                chain(arr, loop);
            } else {
                loop--;
                chain(arr, loop);
            }
        }
    });
}

$.easing = {};

$.extend($.easing, Easing);

$.extend({
    animate: function(args){
        var el, draw, dur, ease, cb;

        if (arguments.length > 1) {
            el = $(arguments[0])[0];
            draw = arguments[1];
            dur = arguments[2] || $.animation.duration;
            ease = arguments[3] || $.animation.ease;
            cb = arguments[4];

            if (typeof dur === 'function') {
                cb = dur;
                ease = $.animation.ease;
                dur = $.animation.duration;
            }

            if (typeof ease === 'function') {
                cb = ease;
                ease = $.animation.ease;
            }

            return animate({
                el: el,
                draw: draw,
                dur: dur,
                ease: ease,
                onDone: cb
            });
        }

        return animate(args);
    },
    stop: stop,
    chain: chain
});

$.fn.extend({
    /**
     *

     args = {
         draw: {} | function,
         dur: 1000,
         ease: "linear",
         loop: 0,
         pause: 0,
         dir: "normal",
         defer: 0,
         onFrame: function,
         onDone: function
     }

     * @returns {this}
     */
    animate: function(args){
        var that = this;
        var draw, dur, easing, cb;
        var a = args;
        var compatibilityMode;

        compatibilityMode = !Array.isArray(args) && (arguments.length > 1 || (arguments.length === 1 && typeof arguments[0].draw === 'undefined'));

        if ( compatibilityMode ) {
            draw = arguments[0];
            dur = arguments[1] || $.animation.duration;
            easing = arguments[2] || $.animation.ease;
            cb = arguments[3];

            if (typeof dur === 'function') {
                cb = dur;
                dur = $.animation.duration;
                easing = $.animation.ease;
            }

            if (typeof easing === 'function') {
                cb = easing;
                easing = $.animation.ease;
            }

            return this.each(function(){
                return $.animate({
                    el: this,
                    draw: draw,
                    dur: dur,
                    ease: easing,
                    onDone: cb
                });
            });
        }

        if (Array.isArray(args)) {
            $.each(args, function(){
                var a = this;
                that.each(function(){
                    a.el = this;
                    $.animate(a);
                });
            });
            return this;
        }

        return this.each(function(){
            a.el = this;
            $.animate(a);
        });
    },

    chain: function(arr, loop){
        return this.each(function(){
            var el = this;
            $.each(arr, function(){
                this.el = el;
            });
            $.chain(arr, loop);
        });
    },

    /**
     *
     * @param done
     * @returns {this}
     */
    stop: function(done){
        var elements = $.animation.elements;
        return this.each(function(){
            var el = this;
            $.each(elements, function(k, o){
                if (o.element === el) {
                    stop(k, done);
                }
            });
        });
    }
});


// Source: src/visibility.js

/* global $ */

$.extend({
    hidden: function(el, val, cb){
        el = $(el)[0];

        if (typeof val === "string") {
            val = val.toLowerCase() === "true";
        }

        if (typeof val === "function") {
            cb = val;
            val = !el.hidden;
        }

        el.hidden = val;

        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }

        return this;
    },

    hide: function(el, cb){
        var $el = $(el);

        if (el.style.display) {
            $el.origin('display', (el.style.display ? el.style.display : getComputedStyle(el, null).display));
        }
        el.style.display = 'none';
        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }
        return this;
    },

    show: function(el, cb){
        var display = $(el).origin('display', undefined, "block");
        el.style.display = display ? display === 'none' ? 'block' : display : '';
        if (parseInt(el.style.opacity) === 0) {
            el.style.opacity = "1";
        }
        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }
        return this;
    },

    visible: function(el, mode, cb){
        if (mode === undefined) {
            mode = true;
        }
        el.style.visibility = mode ? 'visible' : 'hidden';
        if (typeof cb === "function") {
            $.bind(cb, el);
            cb.call(el, arguments);
        }
        return this;
    },

    toggle: function(el, cb){
        var func = getComputedStyle(el, null).display !== 'none' ? 'hide' : 'show';
        return $[func](el, cb);
    }
});

$.fn.extend({
    hide: function(){
        var callback;

        $.each(arguments, function(){
            if (typeof this === 'function') {
                callback = this;
            }
        });

        return this.each(function(){
            $.hide(this, callback);
        });
    },

    show: function(){
        var callback;

        $.each(arguments, function(){
            if (typeof this === 'function') {
                callback = this;
            }
        });

        return this.each(function(){
            $.show(this, callback);
        });
    },

    visible: function(mode, cb){
        return this.each(function(){
            $.visible(this, mode, cb);
        });
    },

    toggle: function(cb){
        return this.each(function(){
            $.toggle(this, cb);
        });
    },

    hidden: function(val, cb){
        return this.each(function(){
            $.hidden(this, val, cb);
        });
    }
});



// Source: src/effects.js

/* global $, not, isVisible */

$.extend({
    fx: {
        off: false
    }
});

$.fn.extend({
    fadeIn: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);
            var visible = !(!isVisible(el) || (isVisible(el) && +($el.style('opacity')) === 0));

            if (visible) {
                return this;
            }

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }

            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            if ($.fx.off) {
                dur = 0;
            }

            var originDisplay = $el.origin("display", undefined, 'block');

            el.style.opacity = "0";
            el.style.display = originDisplay;

            return $.animate({
                el: el,
                draw: {
                    opacity: 1
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    fadeOut: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);

            if ( !isVisible(el) ) return ;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            $el.origin("display", $el.style('display'));

            return $.animate({
                el: el,
                draw: {
                    opacity: 0
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    this.style.display = 'none';

                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    slideUp: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);
            var currHeight;

            if ($el.height() === 0) return ;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            currHeight = $el.height();
            $el.origin("height", currHeight);
            $el.origin("display", $(el).style('display'));

            $el.css({
                overflow: "hidden"
            });

            return $.animate({
                el: el,
                draw: {
                    height: 0
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    $el.hide().removeStyleProperty("overflow, height");
                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    slideDown: function(dur, easing, cb){
        return this.each(function(){
            var el = this;
            var $el = $(el);
            var targetHeight, originDisplay;

            if (not(dur) && not(easing) && not(cb)) {
                cb = null;
                dur = $.animation.duration;
            } else
            if (typeof dur === "function") {
                cb = dur;
                dur = $.animation.duration;
            }
            if (typeof easing === "function") {
                cb = easing;
                easing = $.animation.ease;
            }

            $el.show().visible(false);
            targetHeight = +$el.origin("height", undefined, $el.height());
            if (parseInt(targetHeight) === 0) {
                targetHeight = el.scrollHeight;
            }
            originDisplay = $el.origin("display", $el.style('display'), "block");
            $el.height(0).visible(true);

            $el.css({
                overflow: "hidden",
                display: originDisplay === "none" ? "block" : originDisplay
            });

            return $.animate({
                el: el,
                draw: {
                    height: targetHeight
                },
                dur: dur,
                ease: easing,
                onDone: function(){
                    $(el).removeStyleProperty("overflow, height, visibility");
                    if (typeof cb === 'function') {
                        $.proxy(cb, this)();
                    }
                }
            });
        });
    },

    moveTo: function(x, y, dur, easing, cb){
        var draw = {
            top: y,
            left: x
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    centerTo: function(x, y, dur, easing, cb){
        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            var draw = {
                left: x - this.clientWidth / 2,
                top: y - this.clientHeight / 2
            };
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    colorTo: function(color, dur, easing, cb){
        var draw = {
            color: color
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    },

    backgroundTo: function(color, dur, easing, cb){
        var draw = {
            backgroundColor: color
        };

        if (typeof dur === "function") {
            cb = dur;
            dur = $.animation.duration;
            easing = $.animation.ease;
        }

        if (typeof easing === "function") {
            cb = easing;
            easing = $.animation.ease;
        }

        return this.each(function(){
            $.animate({
                el: this,
                draw: draw,
                dur: dur,
                ease: easing,
                onDone: cb
            });
        });
    }
});

// Source: src/init.js

/* global $, isArrayLike */

$.init = function(sel, ctx){
    var parsed, r;

    this.uid = $.uniqueId();

    if (!sel) {
        return this;
    }

    if (typeof sel === "function") {
        return $.ready(sel);
    }

    if (typeof sel === 'string' && sel === "document") {
        sel = document;
    }

    if (typeof sel === 'string' && sel === "body") {
        sel = document.body;
    }

    if (typeof sel === 'string' && sel === "html") {
        sel = document.documentElement;
    }

    if (typeof sel === 'string' && sel === "doctype") {
        sel = document.doctype;
    }

    if (sel && (sel.nodeType || sel.self === window)) {
        this[0] = sel;
        this.length = 1;
        return this;
    }

    if (sel instanceof $) {
        r = $();
        $.each(sel, function(){
            r.push(this);
        });
        return r;
    }

    if (isArrayLike(sel)) {
        r = $();
        $.each(sel, function(){
            $(this).each(function(){
                r.push(this);
            });
        });
        return r;
    }

    if (typeof sel === "object") {
        return sel;
    }

    if (typeof sel === "string") {

        sel = sel.trim();

        if (sel === "#" || sel === ".") {
            throw new Error("sel can't be # or .") ;
        }

        parsed = $.parseHTML(sel, ctx);

        if (parsed.length === 1 && parsed[0].nodeType === 3) { // Must be a text node -> css sel
            [].push.apply(this, document.querySelectorAll(sel));
        } else {
            $.merge(this, parsed);
        }
    }

    if (ctx !== undefined) {
        var that = this;
        if (ctx instanceof $) {
            this.each(function () {
                $(ctx).append(that);
            });
        } else if (ctx instanceof HTMLElement) {
            $(ctx).append(that);
        }
    }

    return this;
};

$.init.prototype = $.fn;


// Source: src/populate.js

/* global Promise, $ */

var _$ = window.$;

$.Promise = Promise;

window.m4q = $;

if (typeof window.$ === "undefined") {
    window.$ = $;
}

$.global = function(){
    _$ = window.$;
    window.$ = $;
};

$.noConflict = function() {
    if ( window.$ === $ ) {
        window.$ = _$;
    }

    return $;
};

}(window));
/* global jQuery, Utils */

/* Metro 4 Core */

var $ = m4q; // eslint-disable-line

if (typeof m4q === 'undefined') {
    throw new Error('Metro 4 requires m4q helper!');
}

if (!('MutationObserver' in window)) {
    throw new Error('Metro 4 requires MutationObserver!');
}

var meta_init = $.meta('metro4:init').attr("content");
var meta_init_mode = $.meta('metro4:init:mode').attr("content");
var meta_locale = $.meta('metro4:locale').attr("content");
var meta_week_start = $.meta('metro4:week_start').attr("content");
var meta_date_format = $.meta('metro4:date_format').attr("content");
var meta_date_format_input = $.meta('metro4:date_format_input').attr("content");
var meta_animation_duration = $.meta('metro4:animation_duration').attr("content");
var meta_callback_timeout = $.meta('metro4:callback_timeout').attr("content");
var meta_timeout = $.meta('metro4:timeout').attr("content");
var meta_scroll_multiple = $.meta('metro4:scroll_multiple').attr("content");
var meta_cloak = $.meta('metro4:cloak').attr("content"); //default or fade
var meta_cloak_duration = $.meta('metro4:cloak_duration').attr("content"); //100

var meta_jquery = $.meta('metro4:jquery').attr("content"); //undefined
window.jquery_present = typeof jQuery !== "undefined";
if (window.METRO_JQUERY === undefined) {
    window.METRO_JQUERY = meta_jquery !== undefined ? JSON.parse(meta_jquery) : true;
}

/* Added by Ken Kitay https://github.com/kens-code*/
var meta_about = $.meta('metro4:about').attr("content");
if (window.METRO_SHOW_ABOUT === undefined) {
    window.METRO_SHOW_ABOUT = meta_about !== undefined ? JSON.parse(meta_about) : true;
}
/* --- end ---*/

var meta_compile = $.meta('metro4:compile').attr("content");
if (window.METRO_SHOW_COMPILE_TIME === undefined) {
    window.METRO_SHOW_COMPILE_TIME = meta_compile !== undefined ? JSON.parse(meta_compile) : true;
}

if (window.METRO_INIT === undefined) {
    window.METRO_INIT = meta_init !== undefined ? JSON.parse(meta_init) : true;
}

if (window.METRO_INIT_MODE === undefined) {
    window.METRO_INIT_MODE = meta_init_mode !== undefined ? meta_init_mode : "contentloaded";
}

if (window.METRO_DEBUG === undefined) {window.METRO_DEBUG = true;}

if (window.METRO_WEEK_START === undefined) {
    window.METRO_WEEK_START = meta_week_start !== undefined ? parseInt(meta_week_start) : 0;
}
if (window.METRO_DATE_FORMAT === undefined) {
    window.METRO_DATE_FORMAT = meta_date_format !== undefined ? meta_date_format : "%Y-%m-%d";
}
if (window.METRO_DATE_FORMAT_INPUT === undefined) {
    window.METRO_DATE_FORMAT_INPUT = meta_date_format_input !== undefined ? meta_date_format_input : "%Y-%m-%d";
}
if (window.METRO_LOCALE === undefined) {
    window.METRO_LOCALE = meta_locale !== undefined ? meta_locale : 'en-US';
}
if (window.METRO_ANIMATION_DURATION === undefined) {
    window.METRO_ANIMATION_DURATION = meta_animation_duration !== undefined ? parseInt(meta_animation_duration) : 100;
}
if (window.METRO_CALLBACK_TIMEOUT === undefined) {
    window.METRO_CALLBACK_TIMEOUT = meta_callback_timeout !== undefined ? parseInt(meta_callback_timeout) : 500;
}
if (window.METRO_TIMEOUT === undefined) {
    window.METRO_TIMEOUT = meta_timeout !== undefined ? parseInt(meta_timeout) : 2000;
}
if (window.METRO_SCROLL_MULTIPLE === undefined) {
    window.METRO_SCROLL_MULTIPLE = meta_scroll_multiple !== undefined ? parseInt(meta_scroll_multiple) : 20;
}
if (window.METRO_CLOAK_REMOVE === undefined) {
    window.METRO_CLOAK_REMOVE = meta_cloak !== undefined ? (""+meta_cloak).toLowerCase() : "fade";
}
if (window.METRO_CLOAK_DURATION === undefined) {
    window.METRO_CLOAK_DURATION = meta_cloak_duration !== undefined ? parseInt(meta_cloak_duration) : 500;
}
if (window.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE === undefined) {window.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE = true;}
if (window.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS === undefined) {window.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS = true;}
if (window.METRO_HOTKEYS_FILTER_TEXT_INPUTS === undefined) {window.METRO_HOTKEYS_FILTER_TEXT_INPUTS = true;}
if (window.METRO_HOTKEYS_BUBBLE_UP === undefined) {window.METRO_HOTKEYS_BUBBLE_UP = false;}
if (window.METRO_THROWS === undefined) {window.METRO_THROWS = true;}

window.METRO_MEDIA = [];

var isTouch = (('ontouchstart' in window) || (navigator["MaxTouchPoints"] > 0) || (navigator["msMaxTouchPoints"] > 0));

var normalizeComponentName = function(name){
    return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
};

var Metro = {

    version: "4.3.7",
    compileTime: "24/05/2020 10:15:00",
    buildNumber: "",
    isTouchable: isTouch,
    fullScreenEnabled: document.fullscreenEnabled,
    sheet: null,

    controlsPosition: {
        INSIDE: "inside",
        OUTSIDE: "outside"
    },

    groupMode: {
        ONE: "one",
        MULTI: "multi"
    },

    aspectRatio: {
        HD: "hd",
        SD: "sd",
        CINEMA: "cinema"
    },

    fullScreenMode: {
        WINDOW: "window",
        DESKTOP: "desktop"
    },

    position: {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right",
        TOP_RIGHT: "top-right",
        TOP_LEFT: "top-left",
        BOTTOM_LEFT: "bottom-left",
        BOTTOM_RIGHT: "bottom-right",
        LEFT_BOTTOM: "left-bottom",
        LEFT_TOP: "left-top",
        RIGHT_TOP: "right-top",
        RIGHT_BOTTOM: "right-bottom"
    },

    popoverEvents: {
        CLICK: "click",
        HOVER: "hover",
        FOCUS: "focus"
    },

    stepperView: {
        SQUARE: "square",
        CYCLE: "cycle",
        DIAMOND: "diamond"
    },

    listView: {
        LIST: "list",
        CONTENT: "content",
        ICONS: "icons",
        ICONS_MEDIUM: "icons-medium",
        ICONS_LARGE: "icons-large",
        TILES: "tiles",
        TABLE: "table"
    },

    events: {
        click: 'click',
        start: isTouch ? 'touchstart' : 'mousedown',
        stop: isTouch ? 'touchend' : 'mouseup',
        move: isTouch ? 'touchmove' : 'mousemove',
        enter: isTouch ? 'touchstart' : 'mouseenter',

        startAll: 'mousedown touchstart',
        stopAll: 'mouseup touchend',
        moveAll: 'mousemove touchmove',

        leave: 'mouseleave',
        focus: 'focus',
        blur: 'blur',
        resize: 'resize',
        keyup: 'keyup',
        keydown: 'keydown',
        keypress: 'keypress',
        dblclick: 'dblclick',
        input: 'input',
        change: 'change',
        cut: 'cut',
        paste: 'paste',
        scroll: 'scroll',
        mousewheel: 'mousewheel',
        inputchange: "change input propertychange cut paste copy drop",
        dragstart: "dragstart",
        dragend: "dragend",
        dragenter: "dragenter",
        dragover: "dragover",
        dragleave: "dragleave",
        drop: 'drop',
        drag: 'drag'
    },

    keyCode: {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        BREAK: 19,
        CAPS: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        COMMA: 188
    },

    media_queries: {
        FS: "(min-width: 0px)",
        XS: "(min-width: 360px)",
        SM: "(min-width: 576px)",
        MD: "(min-width: 768px)",
        LG: "(min-width: 992px)",
        XL: "(min-width: 1200px)",
        XXL: "(min-width: 1452px)"
    },

    media_sizes: {
        FS: 0,
        XS: 360,
        SM: 576,
        LD: 640,
        MD: 768,
        LG: 992,
        XL: 1200,
        XXL: 1452
    },

    media_mode: {
        FS: "fs",
        XS: "xs",
        SM: "sm",
        MD: "md",
        LG: "lg",
        XL: "xl",
        XXL: "xxl"
    },

    media_modes: ["fs","xs","sm","md","lg","xl","xxl"],

    actions: {
        REMOVE: 1,
        HIDE: 2
    },

    hotkeys: {},

    about: function(){
        var content =
            "<h3>About</h3>" +
            "<hr>" +
            "<div><b>Metro 4</b> - v" + Metro.version +". "+ Metro.showCompileTime() + "</div>" +
            "<div><b>M4Q</b> - " + m4q.version + "</div>";
        Metro.infobox.create(content)
    },

    info: function(){
        console.info("Metro 4 - v" + Metro.version +". "+ Metro.showCompileTime());
        console.info("m4q - " + m4q.version);
    },

    showCompileTime: function(){
        return "Built at: " + Metro.compileTime;
    },

    aboutDlg: function(){
        alert("Metro 4 - v" + Metro.version +". "+ Metro.showCompileTime());
    },

    ver: function(){
        return Metro.version;
    },

    build: function(){
        return Metro.build;
    },

    compile: function(){
        return Metro.compileTime;
    },

    observe: function(){
        var observer, observerCallback;
        var observerConfig = {
            childList: true,
            attributes: true,
            subtree: true
        };
        observerCallback = function(mutations){
            mutations.map(function(mutation){

                if (mutation.type === 'attributes' && mutation.attributeName !== "data-role") {
                    if (mutation.attributeName === 'data-hotkey') {

                        Metro.initHotkeys([mutation.target], true);

                    } else {

                        var element = $(mutation.target);
                        var mc = element.data('metroComponent');

                        if (mc !== undefined) {
                            $.each(mc, function(){
                                var plug = Metro.getPlugin(element, this);
                                if (plug) plug.changeAttribute(mutation.attributeName);
                            });
                        }
                    }
                } else

                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    var i, widgets = [];
                    var $node, node, nodes = mutation.addedNodes;

                    if (nodes.length) {
                        for(i = 0; i < nodes.length; i++) {
                            node = nodes[i];
                            $node = $(node);

                            if ($node.attr("data-role") !== undefined) {
                                widgets.push(node);
                            }

                            $.each($node.find("[data-role]"), function(){
                                var o = this;
                                if (widgets.indexOf(o) !== -1) {
                                    return;
                                }
                                widgets.push(o);
                            });
                        }

                        if (widgets.length) Metro.initWidgets(widgets, "observe");
                    }

                } else  {
                    //console.log(mutation);
                }
            });
        };
        observer = new MutationObserver(observerCallback);
        observer.observe($("html")[0], observerConfig);
    },

    init: function(){
        var widgets = $("[data-role]");
        var hotkeys = $("[data-hotkey]");
        var html = $("html");

        if (window.METRO_SHOW_ABOUT) Metro.info(true);

        if (isTouch === true) {
            html.addClass("metro-touch-device");
        } else {
            html.addClass("metro-no-touch-device");
        }

        Metro.sheet = Utils.newCssSheet();

        window.METRO_MEDIA = [];
        $.each(Metro.media_queries, function(key, query){
            if (Utils.media(query)) {
                window.METRO_MEDIA.push(Metro.media_mode[key]);
            }
        });

        Metro.observe();

        Metro.initHotkeys(hotkeys);
        Metro.initWidgets(widgets, "init");

        if (window.METRO_CLOAK_REMOVE !== "fade") {
            $(".m4-cloak").removeClass("m4-cloak");
            $(window).fire("metroinitied");
        } else {
            $(".m4-cloak").animate({
                draw: {
                    opacity: 1
                },
                dur: 300,
                onDone: function(){
                    $(".m4-cloak").removeClass("m4-cloak");
                    $(window).fire("metroinitied");
                }
            });
        }
    },

    initHotkeys: function(hotkeys, redefine){
        $.each(hotkeys, function(){
            var element = $(this);
            var hotkey = element.attr('data-hotkey') ? element.attr('data-hotkey').toLowerCase() : false;
            var fn = element.attr('data-hotkey-func') ? element.attr('data-hotkey-func') : false;

            if (hotkey === false) {
                return;
            }

            if (element.data('hotKeyBonded') === true && !Utils.bool(redefine)) {
                return;
            }

            Metro.hotkeys[hotkey] = [this, fn];

            element.data('hotKeyBonded', true);
        });
    },

    initWidgets: function(widgets) {
        $.each(widgets, function () {
            var $this = $(this);
            var roles = $this.data('role').split(/\s*,\s*/);

            roles.map(function (func) {

                var $$ = Utils.$();
                var _func = normalizeComponentName(func);

                if ($$.fn[_func] !== undefined && $this.attr("data-role-"+_func) === undefined) {
                    try {
                        $$.fn[_func].call($this);
                        $this.attr("data-role-"+_func, true);

                        var mc = $this.data('metroComponent');

                        if (mc === undefined) {
                            mc = [_func];
                        } else {
                            mc.push(_func);
                        }
                        $this.data('metroComponent', mc);
                    } catch (e) {
                        console.error("Error creating component " + func);
                        throw e;
                    }
                }
            });
        });
    },

    plugin: function(name, object){
        var _name = normalizeComponentName(name);

        var register = function($){
            $.fn[_name] = function( options ) {
                return this.each(function() {
                    $.data( this, _name, Object.create(object).init(options, this ));
                });
            };
        }

        register(m4q);

        if (window.METRO_JQUERY && window.jquery_present) {
            register(jQuery);
        }
    },

    destroyPlugin: function(element, name){
        var p, mc;
        var el = $(element);
        var _name = normalizeComponentName(name);

        p = Metro.getPlugin(el, _name);

        if (typeof p === 'undefined') {
            console.warn("Component "+name+" can not be destroyed: the element is not a Metro 4 component.");
            return ;
        }

        if (typeof p['destroy'] !== 'function') {
            console.warn("Component "+name+" can not be destroyed: method destroy not found.");
            return ;
        }

        p['destroy']();
        mc = el.data("metroComponent");
        Utils.arrayDelete(mc, _name);
        el.data("metroComponent", mc);
        $.removeData(el[0], _name);
        el.removeAttr("data-role-"+_name);
    },

    destroyPluginAll: function(element){
        var el = $(element);
        var mc = el.data("metroComponent");

        if (mc !== undefined && mc.length > 0) $.each(mc, function(){
            Metro.destroyPlugin(el[0], this);
        });
    },

    noop: function(){},
    noop_true: function(){return true;},
    noop_false: function(){return false;},

    requestFullScreen: function(element){
        if (element["mozRequestFullScreen"]) {
            element["mozRequestFullScreen"]();
        } else if (element["webkitRequestFullScreen"]) {
            element["webkitRequestFullScreen"]();
        } else if (element["msRequestFullscreen"]) {
            element["msRequestFullscreen"]();
        } else {
            element.requestFullscreen().catch( function(err){
                console.warn("Error attempting to enable full-screen mode: "+err.message+" "+err.name);
            });
        }
    },

    exitFullScreen: function(){
        if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        }
        else if (document["webkitCancelFullScreen"]) {
            document["webkitCancelFullScreen"]();
        }
        else if (document["msExitFullscreen"]) {
            document["msExitFullscreen"]();
        } else {
            document.exitFullscreen().catch( function(err){
                console.warn("Error attempting to disable full-screen mode: "+err.message+" "+err.name);
            });
        }
    },

    inFullScreen: function(){
        var fsm = (document.fullscreenElement || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"]);
        return fsm !== undefined;
    },

    checkRuntime: function(el, name){
        var element = $(el);
        var _name = normalizeComponentName(name);
        if (!element.attr("data-role-"+_name)) {
            Metro.makeRuntime(element, _name);
        }
    },

    makeRuntime: function(el, name){
        var element = $(el);
        var _name = normalizeComponentName(name);

        element.attr("data-role-"+_name, true);
        element.attr("data-role", _name);
        var mc = element.data('metroComponent');

        if (mc === undefined) {
            mc = [_name];
        } else {
            mc.push(_name);
        }
        element.data('metroComponent', mc);
    },

    $: function(){
        return window.METRO_JQUERY && window.jquery_present ? jQuery : m4q;
    },

    get$el: function(el){
        return Metro.$()($(el)[0]);
    },

    getPlugin: function(el, name){
        var _name = normalizeComponentName(name);
        var $el = Metro.get$el(el);
        return $el.length ? $el.data(_name) : undefined;
    },

    makePlugin: function(el, name, options){
        var _name = normalizeComponentName(name);
        var $el = Metro.get$el(el);
        return $el.length && typeof $el[_name] === "function" ? $el[_name](options) : undefined;
    },

    createExec: function(that){
        var timeout = that.options[that.name.toLowerCase()+'Deferred'];
        if (timeout > 0) {
            setTimeout(function(){
                that._create();
            }, timeout)
        } else {
            that._create();
        }
    }
};

/* eslint-disable-next-line */
var Component = function(nameName, compObj){
    var name = normalizeComponentName(nameName);
    var component = $.extend({name: name}, {
        _super: function(el, options, defaults){
            this.elem = el;
            this.element = $(el);
            this.options = $.extend( {}, defaults, options );

            this._setOptionsFromDOM();
        },

        _setOptionsFromDOM: function(){
            var element = this.element, o = this.options;

            $.each(element.data(), function(key, value){
                if (key in o) {
                    try {
                        o[key] = JSON.parse(value);
                    } catch (e) {
                        o[key] = value;
                    }
                }
            });
        }
    }, compObj);
    Metro.plugin(name, component);
    return component;
}

Metro.Component = Component;

Metro.locales = {};

window.Metro = Metro;

$(window).on(Metro.events.resize, function(){
    window.METRO_MEDIA = [];
    $.each(Metro.media_queries, function(key, query){
        if (Utils.media(query)) {
            window.METRO_MEDIA.push(Metro.media_mode[key]);
        }
    });
});
/* global METRO_JQUERY, jquery_present, jQuery, Metro, METRO_THROWS, MD5, METRO_MEDIA */

var Utils = {
    isUrl: function (val) {
        /* eslint-disable-next-line */
        return /^(\.\/|\.\.\/|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val);
    },

    isTag: function(val){
        /* eslint-disable-next-line */
        return /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val);
    },

    isColor: function (val) {
        /* eslint-disable-next-line */
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
    },

    isEmbedObject: function(val){
        var embed = ["iframe", "object", "embed", "video"];
        var result = false;
        $.each(embed, function(){
            if (typeof val === "string" && val.toLowerCase() === this) {
                result = true;
            } else if (val.nodeType !== undefined && val.tagName.toLowerCase() === this) {
                result = true;
            }
        });
        return result;
    },

    isVideoUrl: function(val){
        return /youtu\.be|youtube|vimeo/gi.test(val);
    },

    isDate: function(val, format){
        var result;

        if (Utils.isDateObject(val)) {
            return true;
        }

        if (Utils.isValue(format)) {
            result = String(val).toDate(format);
        } else {
            result = String(new Date(val));
        }

        return result !== "Invalid Date";
    },

    isDateObject: function(v){
        return typeof v === 'object' && v.getMonth !== undefined;
    },

    isInt: function(n){
        return !isNaN(n) && +n % 1 === 0;
    },

    isFloat: function(n){
        return (!isNaN(n) && +n % 1 !== 0) || /^\d*\.\d+$/.test(n);
    },

    isTouchDevice: function() {
        return (('ontouchstart' in window)
            || (navigator.MaxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0));
    },

    isFunc: function(f){
        return Utils.isType(f, 'function');
    },

    isObject: function(o){
        return Utils.isType(o, 'object');
    },

    isArray: function(a){
        return Array.isArray(a);
    },

    isType: function(o, t){
        if (!Utils.isValue(o)) {
            return false;
        }

        if (typeof o === t) {
            return o;
        }

        if (Utils.isTag(o) || Utils.isUrl(o)) {
            return false;
        }

        if (typeof window[o] === t) {
            return window[o];
        }

        if (typeof o === 'string' && o.indexOf(".") === -1) {
            return false;
        }

        if (typeof o === 'string' && o.indexOf("/") !== -1) {
            return false;
        }

        if (typeof o === 'string' && o.indexOf(" ") !== -1) {
            return false;
        }

        if (typeof o === 'string' && o.indexOf("(") !== -1) {
            return false;
        }

        if (typeof o === 'string' && o.indexOf("[") !== -1) {
            return false;
        }

        if (typeof o === "number" && t.toLowerCase() !== "number") {
            return false;
        }

        var ns = o.split(".");
        var i, context = window;

        for(i = 0; i < ns.length; i++) {
            context = context[ns[i]];
        }

        return typeof context === t ? context : false;
    },

    $: function(){
        return METRO_JQUERY && jquery_present ? jQuery : m4q;
    },

    isMetroObject: function(el, type){
        var $el = $(el), el_obj = Metro.getPlugin(el, type);

        if ($el.length === 0) {
            console.warn(type + ' ' + el + ' not found!');
            return false;
        }

        if (el_obj === undefined) {
            console.warn('Element not contain role '+ type +'! Please add attribute data-role="'+type+'" to element ' + el);
            return false;
        }

        return true;
    },

    isJQuery: function(el){
        return (typeof jQuery !== "undefined" && el instanceof jQuery);
    },

    isM4Q: function(el){
        return (typeof m4q !== "undefined" && el instanceof m4q);
    },

    isQ: function(el){
        return Utils.isJQuery(el) || Utils.isM4Q(el);
    },

    isIE11: function(){
        return !!window.MSInputMethodContext && !!document.documentMode;
    },

    embedObject: function(val){
        return "<div class='embed-container'>" + $(val)[0].outerHTML + "</div>";
    },

    embedUrl: function(val){
        if (val.indexOf("youtu.be") !== -1) {
            val = "https://www.youtube.com/embed/" + val.split("/").pop();
        }
        return "<div class='embed-container'><iframe src='"+val+"'></iframe></div>";
    },

    secondsToTime: function(secs) {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        return {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
    },

    hex2rgba: function(hex, alpha){
        var c;
        alpha = isNaN(alpha) ? 1 : alpha;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length=== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
        }
        throw new Error('Hex2rgba error. Bad Hex value');
    },

    elementId: function(prefix){
        return prefix+"-"+(new Date()).getTime()+$.random(1, 1000);
    },

    secondsToFormattedString: function(time){
        var sec_num = parseInt(time, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        return [hours, minutes, seconds].join(":");
    },

    func: function(f){
        /* jshint -W054 */
        return new Function("a", f);
    },

    exec: function(f, args, context){
        var result;
        if (f === undefined || f === null) {return false;}
        var func = Utils.isFunc(f);

        if (func === false) {
            func = Utils.func(f);
        }

        try {
            result = func.apply(context, args);
        } catch (err) {
            result = null;
            if (METRO_THROWS === true) {
                throw err;
            }
        }
        return result;
    },

    isOutsider: function(element) {
        var el = $(element);
        var rect;
        var clone = el.clone();

        clone.removeAttr("data-role").css({
            visibility: "hidden",
            position: "absolute",
            display: "block"
        });
        el.parent().append(clone);

        rect = clone[0].getBoundingClientRect();
        clone.remove();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    inViewport: function(el){
        var rect = Utils.rect(el);

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    rect: function(el){
        return el.getBoundingClientRect();
    },

    getCursorPosition: function(el, e){
        var a = Utils.rect(el);
        return {
            x: Utils.pageXY(e).x - a.left - window.pageXOffset,
            y: Utils.pageXY(e).y - a.top - window.pageYOffset
        };
    },

    getCursorPositionX: function(el, e){
        return Utils.getCursorPosition(el, e).x;
    },

    getCursorPositionY: function(el, e){
        return Utils.getCursorPosition(el, e).y;
    },

    objectLength: function(obj){
        return Object.keys(obj).length;
    },

    percent: function(total, part, round_value){
        if (total === 0) {
            return 0;
        }
        var result = part * 100 / total;
        return round_value === true ? Math.round(result) : Math.round(result * 100) / 100;
    },

    camelCase: function(str){
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    },

    dashedName: function(str){
        return str.replace(/([A-Z])/g, function(u) { return "-" + u.toLowerCase(); });
    },

    objectShift: function(obj){
        var min = 0;
        $.each(obj, function(i){
            if (min === 0) {
                min = i;
            } else {
                if (min > i) {
                    min = i;
                }
            }
        });
        delete obj[min];

        return obj;
    },

    objectDelete: function(obj, key){
        if (obj[key] !== undefined) delete obj[key];
    },

    arrayDeleteByMultipleKeys: function(arr, keys){
        keys.forEach(function(ind){
            delete arr[ind];
        });
        return arr.filter(function(item){
            return item !== undefined;
        });
    },

    arrayDelete: function(arr, val){
        if (arr.indexOf(val) > -1) arr.splice(arr.indexOf(val), 1);
    },

    arrayDeleteByKey: function(arr, key){
        arr.splice(key, 1);
    },

    nvl: function(data, other){
        return data === undefined || data === null ? other : data;
    },

    objectClone: function(obj){
        var copy = {};
        for(var key in obj) {
            if ($.hasProp(obj, key)) {
                copy[key] = obj[key];
            }
        }
        return copy;
    },

    github: function(repo, callback){
        $.json('https://api.github.com/repos/' + repo).then(function(data){
            Utils.exec(callback, [data]);
        });
    },

    detectIE: function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },

    detectChrome: function(){
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    },

    md5: function(s){
        return MD5(s);
    },

    encodeURI: function(str){
        return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
    },

    pageHeight: function(){
        var body = document.body,
            html = document.documentElement;

        return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    },

    cleanPreCode: function(selector){
        var els = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

        els.forEach(function(el){
            var txt = el.textContent
                .replace(/^[\r\n]+/, "")	// strip leading newline
                .replace(/\s+$/g, "");

            if (/^\S/gm.test(txt)) {
                el.textContent = txt;
                return;
            }

            var mat, str, re = /^[\t ]+/gm, len, min = 1e3;

            /* jshint -W084 */
            /* eslint-disable-next-line */
            while (mat = re.exec(txt)) {
                len = mat[0].length;

                if (len < min) {
                    min = len;
                    str = mat[0];
                }
            }

            if (min === 1e3)
                return;

            el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "").trim();
        });
    },

    coords: function(element){
        var el = $(element)[0];
        var box = el.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset,
            left: box.left + window.pageXOffset
        };
    },

    positionXY: function(e, t){
        switch (t) {
            case 'client': return Utils.clientXY(e);
            case 'screen': return Utils.screenXY(e);
            case 'page': return Utils.pageXY(e);
            default: return {x: 0, y: 0};
        }
    },

    /**
     *
     * @param {TouchEvent|Event|MouseEvent} e
     * @returns {{x: (*), y: (*)}}
     */
    clientXY: function(e){
        return {
            x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
            y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY
        };
    },

    /**
     *
     * @param {TouchEvent|Event|MouseEvent} e
     * @returns {{x: (*), y: (*)}}
     */
    screenXY: function(e){
        return {
            x: e.changedTouches ? e.changedTouches[0].screenX : e.screenX,
            y: e.changedTouches ? e.changedTouches[0].screenY : e.screenY
        };
    },

    /**
     *
     * @param {TouchEvent|Event|MouseEvent} e
     * @returns {{x: (*), y: (*)}}
     */
    pageXY: function(e){
        return {
            x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
            y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
        };
    },

    isRightMouse: function(e){
        return "which" in e ? e.which === 3 : "button" in e ? e.button === 2 : undefined;
    },

    hiddenElementSize: function(el, includeMargin){
        var width, height, clone = $(el).clone(true);

        clone.removeAttr("data-role").css({
            visibility: "hidden",
            position: "absolute",
            display: "block"
        });
        $("body").append(clone);

        if (!Utils.isValue(includeMargin)) {
            includeMargin = false;
        }

        width = clone.outerWidth(includeMargin);
        height = clone.outerHeight(includeMargin);
        clone.remove();
        return {
            width: width,
            height: height
        };
    },

    getStyle: function(element, pseudo){
        var el = $(element)[0];
        return window.getComputedStyle(el, pseudo);
    },

    getStyleOne: function(el, property){
        return Utils.getStyle(el).getPropertyValue(property);
    },

    getTransformMatrix: function(el, returnArray){
        var computedMatrix = Utils.getStyleOne(el, "transform");
        var a = computedMatrix
            .replace("matrix(", '')
            .slice(0, -1)
            .split(',');
        return returnArray !== true ? {
            a: a[0],
            b: a[1],
            c: a[2],
            d: a[3],
            tx: a[4],
            ty: a[5]
        } : a;
    },

    computedRgbToHex: function(rgb){
        var a = rgb.replace(/[^\d,]/g, '').split(',');
        var result = "#", i;

        for(i = 0; i < 3; i++) {
            var h = parseInt(a[i]).toString(16);
            result += h.length === 1 ? "0" + h : h;
        }

        return result;
    },

    computedRgbToRgba: function(rgb, alpha){
        var a = rgb.replace(/[^\d,]/g, '').split(',');
        if (alpha === undefined) {
            alpha = 1;
        }
        a.push(alpha);
        return "rgba("+a.join(",")+")";
    },

    computedRgbToArray: function(rgb){
        return rgb.replace(/[^\d,]/g, '').split(',');
    },

    hexColorToArray: function(hex){
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length === 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return [(c>>16)&255, (c>>8)&255, c&255];
        }
        return [0,0,0];
    },

    hexColorToRgbA: function(hex, alpha){
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length === 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255, alpha ? alpha : 1].join(',')+')';
        }
        return 'rgba(0,0,0,1)';
    },

    getInlineStyles: function(element){
        var i, l, styles = {}, el = $(element)[0];
        for (i = 0, l = el.style.length; i < l; i++) {
            var s = el.style[i];
            styles[s] = el.style[s];
        }

        return styles;
    },

    updateURIParameter: function(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    },

    getURIParameter: function(url, name){
        if (!url) url = window.location.href;
        /* eslint-disable-next-line */
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    getLocales: function(){
        return Object.keys(Metro.locales);
    },

    addLocale: function(locale){
        Metro.locales = $.extend( {}, Metro.locales, locale );
    },

    aspectRatioH: function(width, a){
        if (a === "16/9") return width * 9 / 16;
        if (a === "21/9") return width * 9 / 21;
        if (a === "4/3") return width * 3 / 4;
    },

    aspectRatioW: function(height, a){
        if (a === "16/9") return height * 16 / 9;
        if (a === "21/9") return height * 21 / 9;
        if (a === "4/3") return height * 4 / 3;
    },

    valueInObject: function(obj, value){
        return Object.values(obj).indexOf(value) > -1;
    },

    keyInObject: function(obj, key){
        return Object.keys(obj).indexOf(key) > -1;
    },

    inObject: function(obj, key, val){
        return obj[key] !== undefined && obj[key] === val;
    },

    newCssSheet: function(media){
        var style = document.createElement("style");

        if (media !== undefined) {
            style.setAttribute("media", media);
        }

        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);

        return style.sheet;
    },

    addCssRule: function(sheet, selector, rules, index){
        if("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }
    },

    media: function(query){
        return window.matchMedia(query).matches;
    },

    mediaModes: function(){
        return METRO_MEDIA;
    },

    mediaExist: function(media){
        return METRO_MEDIA.indexOf(media) > -1;
    },

    inMedia: function(media){
        return METRO_MEDIA.indexOf(media) > -1 && METRO_MEDIA.indexOf(media) === METRO_MEDIA.length - 1;
    },

    isValue: function(val){
        return val !== undefined && val !== null && val !== "";
    },

    isNull: function(val){
        return val === undefined || val === null;
    },

    isNegative: function(val){
        return parseFloat(val) < 0;
    },

    isPositive: function(val){
        return parseFloat(val) > 0;
    },

    isZero: function(val){
        return (parseFloat(val.toFixed(2))) === 0.00;
    },

    between: function(val, bottom, top, equals){
        return equals === true ? val >= bottom && val <= top : val > bottom && val < top;
    },

    parseMoney: function(val){
        return Number(parseFloat(val.replace(/[^0-9-.]/g, '')));
    },

    parseCard: function(val){
        return val.replace(/[^0-9]/g, '');
    },

    parsePhone: function(val){
        return Utils.parseCard(val);
    },

    isVisible: function(element){
        var el = $(element)[0];
        return Utils.getStyleOne(el, "display") !== "none" && Utils.getStyleOne(el, "visibility") !== "hidden" && el.offsetParent !== null;
    },

    parseNumber: function(val, thousand, decimal){
        return val.replace(new RegExp('\\'+thousand, "g"), "").replace(new RegExp('\\'+decimal, 'g'), ".");
    },

    nearest: function(val, precision, down){
        val /= precision;
        val = Math[down === true ? 'floor' : 'ceil'](val) * precision;
        return val;
    },

    bool: function(value){
        switch(value){
            case true:
            case "true":
            case 1:
            case "1":
            case "on":
            case "yes":
                return true;
            default:
                return false;
        }
    },

    copy: function(element){
        var body = document.body, range, sel;
        var el = $(element)[0];

        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }

        document.execCommand("Copy");

        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    },

    isLocalhost: function(pattern){
        pattern = pattern || ".local";
        return (
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1" ||
            location.hostname === "[::1]" ||
            location.hostname === "" ||
            window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/ ) ||
            location.hostname.indexOf(pattern) !== -1
        );
    },

    decCount: function(v){
        return v % 1 === 0 ? 0 : v.toString().split(".")[1].length;
    }
};

Metro.utils = Utils;
if (METRO_INIT ===  true) {
	METRO_INIT_MODE === 'immediate' ? Metro.init() : $(function(){Metro.init()});
}

return Metro;

}));