var pow2;
(function (pow2) {
    var _worldLookup = {};

    function getWorld(name) {
        return _worldLookup[name];
    }
    pow2.getWorld = getWorld;

    function registerWorld(name, instance) {
        if (!name) {
            throw new Error("Cannot register world with null name");
        }
        if (_worldLookup.hasOwnProperty(name)) {
            throw new Error("Cannot register world multiple times with the same name");
        }
        _worldLookup[name] = instance;
        return _worldLookup[name];
    }
    pow2.registerWorld = registerWorld;

    function unregisterWorld(name) {
        if (!name) {
            throw new Error("Cannot unregister a world with null name");
        }
        if (!_worldLookup.hasOwnProperty(name)) {
            throw new Error("Cannot unregister non existent world");
        }
        var instance = _worldLookup[name];
        delete _worldLookup[name];
        return instance;
    }
    pow2.unregisterWorld = unregisterWorld;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var Events = (function () {
        function Events() {
        }
        Events.prototype.on = function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback)
                return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({ callback: callback, context: context, ctx: context || this });
            return this;
        };

        Events.prototype.once = function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback)
                return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        };

        Events.prototype.off = function (name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, 'off', name, [callback, context]))
                return this;
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }
            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events = this._events[name]) {
                    this._events[name] = retain = [];
                    if (callback || context) {
                        for (j = 0, k = events.length; j < k; j++) {
                            ev = events[j];
                            if ((callback && callback !== ev.callback && callback !== ev.callback._callback) || (context && context !== ev.context)) {
                                retain.push(ev);
                            }
                        }
                    }
                    if (!retain.length)
                        delete this._events[name];
                }
            }

            return this;
        };

        Events.prototype.trigger = function (name) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (!this._events)
                return this;
            var args = Array.prototype.slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args))
                return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events)
                triggerEvents(events, args);
            if (allEvents)
                triggerEvents(allEvents, arguments);
            return this;
        };
        return Events;
    })();
    pow2.Events = Events;

    var eventSplitter = /\s+/;

    var eventsApi = function (obj, action, name, rest) {
        if (!name)
            return true;

        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                while (++i < l)
                    (ev = events[i]).callback.apply(ev.ctx, args);
                return;
        }
    };
})(pow2 || (pow2 = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pow2;
(function (pow2) {
    var Resource = (function (_super) {
        __extends(Resource, _super);
        function Resource(url, data) {
            if (typeof data === "undefined") { data = null; }
            _super.call(this);
            this.loader = null;
            this._ready = false;
            this.url = url;
            this.data = data;
        }
        Resource.prototype.load = function () {
            console.log("Loading: " + this.url);
        };

        Resource.prototype.setLoader = function (loader) {
            this.loader = loader;
        };

        Resource.prototype.isReady = function () {
            return this.data !== null && this._ready === true;
        };

        Resource.prototype.ready = function () {
            this._ready = true;
            this.trigger('ready', this);
        };
        Resource.prototype.failed = function (error) {
            this._ready = false;
            console.log("ERROR loading resource: " + this.url + "\n   -> " + error);
            this.trigger('failed', this);
        };
        return Resource;
    })(pow2.Events);
    pow2.Resource = Resource;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var Point = (function () {
        function Point(pointOrX, y) {
            if (pointOrX instanceof Point) {
                this.set(pointOrX.x, pointOrX.y);
            } else if (typeof pointOrX === 'string' && typeof y === 'string') {
                this.set(parseFloat(pointOrX), parseFloat(y));
            } else if (typeof pointOrX == 'number' && typeof y === 'number') {
                this.set(pointOrX, y);
            } else {
                this.zero();
            }
        }
        Point.prototype.toString = function () {
            return "" + this.x + "," + this.y;
        };

        Point.prototype.set = function (pointOrX, y) {
            if (pointOrX instanceof Point) {
                this.x = pointOrX.x;
                this.y = pointOrX.y;
            } else {
                this.x = typeof pointOrX !== 'undefined' ? pointOrX : 0;
                this.y = typeof y !== 'undefined' ? y : 0;
            }
            return this;
        };

        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };

        Point.prototype.copy = function (from) {
            this.x = from.x;
            this.y = from.y;
            return this;
        };

        Point.prototype.truncate = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        };

        Point.prototype.round = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        };

        Point.prototype.add = function (pointOrXOrValue, y) {
            if (pointOrXOrValue instanceof Point) {
                this.x += pointOrXOrValue.x;
                this.y += pointOrXOrValue.y;
            } else if (pointOrXOrValue && typeof y === 'undefined') {
                this.x += pointOrXOrValue;
                this.y += pointOrXOrValue;
            } else {
                this.x += pointOrXOrValue;
                this.y += y;
            }
            return this;
        };
        Point.prototype.subtract = function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        };

        Point.prototype.multiply = function (pointOrXOrValue, y) {
            if (pointOrXOrValue instanceof Point) {
                this.x *= pointOrXOrValue.x;
                this.y *= pointOrXOrValue.y;
            } else if (pointOrXOrValue && typeof y === 'undefined') {
                this.x *= pointOrXOrValue;
                this.y *= pointOrXOrValue;
            } else {
                this.x *= pointOrXOrValue;
                this.y *= y;
            }
            return this;
        };

        Point.prototype.divide = function (pointOrXOrValue, y) {
            if (pointOrXOrValue instanceof Point) {
                if (pointOrXOrValue.x === 0 || pointOrXOrValue.y === 0) {
                    throw new Error("Divide by zero");
                }
                this.x /= pointOrXOrValue.x;
                this.y /= pointOrXOrValue.y;
            } else if (pointOrXOrValue && typeof y === 'undefined') {
                if (pointOrXOrValue === 0) {
                    throw new Error("Divide by zero");
                }
                this.x /= pointOrXOrValue;
                this.y /= pointOrXOrValue;
            } else {
                if (pointOrXOrValue === 0 || y === 0) {
                    throw new Error("Divide by zero");
                }
                this.x /= pointOrXOrValue;
                this.y /= y;
            }
            return this;
        };

        Point.prototype.inverse = function () {
            this.x *= -1;
            this.y *= -1;
            return this;
        };
        Point.prototype.equal = function (point) {
            return this.x === point.x && this.y === point.y;
        };

        Point.prototype.isZero = function () {
            return this.x === 0 && this.y === 0;
        };
        Point.prototype.zero = function () {
            this.x = this.y = 0;
            return this;
        };

        Point.prototype.interpolate = function (from, to, factor) {
            factor = Math.min(Math.max(factor, 0), 1);
            this.x = (from.x * (1.0 - factor)) + (to.x * factor);
            this.y = (from.y * (1.0 - factor)) + (to.y * factor);
            return this;
        };

        Point.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        Point.prototype.magnitudeSquared = function () {
            return this.x * this.x + this.y * this.y;
        };

        Point.prototype.normalize = function () {
            var m = this.magnitude();
            if (m > 0) {
                this.x /= m;
                this.y /= m;
            }
            return this;
        };
        return Point;
    })();
    pow2.Point = Point;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var Rect = (function () {
        function Rect(rectOrPointOrX, extentOrY, width, height) {
            if (rectOrPointOrX instanceof Rect) {
                this.point = new pow2.Point(rectOrPointOrX.point);
                this.extent = new pow2.Point(rectOrPointOrX.extent);
            } else if (width && height) {
                this.point = new pow2.Point(rectOrPointOrX, extentOrY);
                this.extent = new pow2.Point(width, height);
            } else if (rectOrPointOrX instanceof pow2.Point && extentOrY instanceof pow2.Point) {
                this.point = new pow2.Point(rectOrPointOrX);
                this.extent = new pow2.Point(extentOrY);
            } else {
                this.point = new pow2.Point(0, 0);
                this.extent = new pow2.Point(1, 1);
            }
            return this;
        }
        Rect.prototype.toString = function () {
            return "p(" + this.point.toString() + ") extent(" + this.extent.toString() + ")";
        };

        Rect.prototype.set = function (rectOrPointOrX, extentOrY, width, height) {
            if (rectOrPointOrX instanceof Rect) {
                this.point.set(rectOrPointOrX.point);
                this.extent.set(rectOrPointOrX.extent);
            } else if (width && height) {
                this.point.set(rectOrPointOrX, extentOrY);
                this.extent.set(width, height);
            } else if (rectOrPointOrX instanceof pow2.Point && extentOrY instanceof pow2.Point) {
                this.point.set(rectOrPointOrX);
                this.extent.set(extentOrY);
            } else {
                throw new Error("Unsupported arguments to Rect.set");
            }
            return this;
        };

        Rect.prototype.clone = function () {
            return new Rect(this.point.clone(), this.extent.clone());
        };

        Rect.prototype.clamp = function (rect) {
            if (this.point.x < rect.point.x) {
                this.point.x += rect.point.x - this.point.x;
            }
            if (this.point.y < rect.point.y) {
                this.point.y += rect.point.y - this.point.y;
            }
            if (this.point.x + this.extent.x > rect.point.x + rect.extent.x) {
                this.point.x -= ((this.point.x + this.extent.x) - (rect.point.x + rect.extent.x));
            }
            if (this.point.y + this.extent.y > rect.point.y + rect.extent.y) {
                this.point.y -= ((this.point.y + this.extent.y) - (rect.point.y + rect.extent.y));
            }

            return this;
        };

        Rect.prototype.clip = function (clipRect) {
            var right = this.point.x + this.extent.x;
            var bottom = this.point.y + this.extent.y;
            this.point.x = Math.max(clipRect.point.x, this.point.x);
            this.extent.x = Math.min(clipRect.point.x + clipRect.extent.x, right) - this.point.x;
            this.point.y = Math.max(clipRect.point.y, this.point.y);
            this.extent.x = Math.min(clipRect.point.y + clipRect.extent.y, bottom) - this.point.y;
            return this;
        };
        Rect.prototype.isValid = function () {
            return this.extent.x > 0 && this.extent.y > 0;
        };
        Rect.prototype.intersect = function (clipRect) {
            return !(clipRect.point.x > this.point.x + this.extent.x || clipRect.point.x + clipRect.extent.x < this.point.x || clipRect.point.y > this.point.y + this.extent.y || clipRect.point.y + clipRect.extent.y < this.point.y);
        };

        Rect.prototype.pointInRect = function (pointOrX, y) {
            var x = 0;
            if (pointOrX instanceof pow2.Point) {
                x = pointOrX.x;
                y = pointOrX.y;
            } else {
                x = pointOrX;
            }
            if (x >= this.point.x + this.extent.x || y >= this.point.y + this.extent.y) {
                return false;
            }
            return !(x < this.point.x || y < this.point.y);
        };

        Rect.prototype.getCenter = function () {
            var x = parseFloat((this.point.x + this.extent.x * 0.5).toFixed(2));
            var y = parseFloat((this.point.y + this.extent.y * 0.5).toFixed(2));
            return new pow2.Point(x, y);
        };

        Rect.prototype.setCenter = function (pointOrX, y) {
            var x;
            if (pointOrX instanceof pow2.Point) {
                x = pointOrX.x;
                y = pointOrX.y;
            } else {
                x = pointOrX;
            }
            this.point.x = parseFloat((x - this.extent.x * 0.5).toFixed(2));
            this.point.y = parseFloat((y - this.extent.y * 0.5).toFixed(2));
            return this;
        };

        Rect.prototype.scale = function (value) {
            this.point.multiply(value);
            this.extent.multiply(value);
            return this;
        };

        Rect.prototype.round = function () {
            this.point.round();
            this.extent.set(Math.ceil(this.extent.x), Math.ceil(this.extent.y));
            return this;
        };

        Rect.prototype.getLeft = function () {
            return this.point.x;
        };
        Rect.prototype.getTop = function () {
            return this.point.y;
        };
        Rect.prototype.getRight = function () {
            return this.point.x + this.extent.x;
        };
        Rect.prototype.getBottom = function () {
            return this.point.y + this.extent.y;
        };
        Rect.prototype.getHalfSize = function () {
            return new pow2.Point(this.extent.x / 2, this.extent.y / 2);
        };

        Rect.prototype.addPoint = function (value) {
            if (value.x < this.point.x) {
                this.extent.x = this.extent.x - (value.x - this.point.x);
                this.point.x = value.x;
            }
            if (value.y < this.point.y) {
                this.extent.y = this.extent.y - (value.x - this.point.y);
                this.point.y = value.y;
            }
            if (value.x > this.point.x + this.extent.x) {
                this.extent.x = value.x - this.point.x;
            }
            if (value.y > this.point.y + this.extent.y) {
                this.extent.y = value.y - this.point.y;
            }
        };

        Rect.prototype.inflate = function (x, y) {
            if (typeof x === "undefined") { x = 1; }
            if (typeof y === "undefined") { y = 1; }
            this.point.x -= x;
            this.extent.x += 2 * x;
            this.point.y -= y;
            this.extent.y += 2 * y;
            return this;
        };
        return Rect;
    })();
    pow2.Rect = Rect;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var AudioResource = (function (_super) {
        __extends(AudioResource, _super);
        function AudioResource() {
            _super.apply(this, arguments);
        }
        AudioResource.prototype.load = function () {
            var _this = this;
            var sources = _.keys(AudioResource.types).length;
            var invalid = [];
            var incrementFailure = function (path) {
                sources--;
                invalid.push(path);
                if (sources <= 0) {
                    _this.failed("No valid sources at the following URLs\n   " + invalid.join('\n   '));
                }
            };

            var reference = document.createElement('audio');

            _.each(AudioResource.types, function (mime, extension) {
                if (!reference.canPlayType(mime + ";")) {
                    return;
                }
                var source = document.createElement('source');
                source.type = mime;
                source.src = _this.url + '.' + extension;
                source.addEventListener('error', function (e) {
                    incrementFailure(source.src);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                });
                reference.appendChild(source);
            });
            reference.addEventListener('canplaythrough', function () {
                _this.data = reference;
                _this.ready();
            });
            reference.load();
        };
        AudioResource.types = {
            'mp3': 'audio/mpeg',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav'
        };
        return AudioResource;
    })(pow2.Resource);
    pow2.AudioResource = AudioResource;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var ImageResource = (function (_super) {
        __extends(ImageResource, _super);
        function ImageResource() {
            _super.apply(this, arguments);
        }
        ImageResource.prototype.load = function () {
            var _this = this;
            var reference = document.createElement('img');
            reference.onload = function () {
                _this.data = reference;
                _this.ready();
            };
            reference.onerror = function (err) {
                _this.failed(err);
            };
            reference.src = this.url;
        };
        return ImageResource;
    })(pow2.Resource);
    pow2.ImageResource = ImageResource;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var JSONResource = (function (_super) {
        __extends(JSONResource, _super);
        function JSONResource() {
            _super.apply(this, arguments);
        }
        JSONResource.prototype.load = function () {
            var _this = this;
            var request = $.getJSON(this.url);
            request.done(function (object) {
                _this.data = object;
                _this.ready();
            });
            request.fail(function (jqxhr, settings, exception) {
                _this.failed(exception);
            });
        };
        return JSONResource;
    })(pow2.Resource);
    pow2.JSONResource = JSONResource;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var ScriptResource = (function (_super) {
        __extends(ScriptResource, _super);
        function ScriptResource() {
            _super.apply(this, arguments);
        }
        ScriptResource.prototype.load = function () {
            var _this = this;
            var request = $.getScript(this.url);
            request.done(function (script) {
                _this.data = script;
                _this.ready();
            });
            request.fail(function (jqxhr, settings, exception) {
                _this.failed(exception);
            });
        };
        return ScriptResource;
    })(pow2.Resource);
    pow2.ScriptResource = ScriptResource;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var XMLResource = (function (_super) {
        __extends(XMLResource, _super);
        function XMLResource() {
            _super.apply(this, arguments);
        }
        XMLResource.prototype.load = function () {
            var _this = this;
            var request = $.get(this.url);
            request.done(function (object) {
                _this.data = $(object);
                _this.prepare(_this.data);
            });
            request.fail(function (jqxhr, settings, exception) {
                _this.failed(exception);
            });
        };

        XMLResource.prototype.prepare = function (data) {
            this.ready();
        };

        XMLResource.prototype.getElTag = function (el) {
            if (el) {
                var name = el.prop('tagName');
                if (name) {
                    return name.toLowerCase();
                }
            }
            return null;
        };

        XMLResource.prototype.getRootNode = function (tag) {
            if (!this.data) {
                return null;
            }
            return $(_.find(this.data, function (d) {
                return d.tagName && d.tagName.toLowerCase() === tag;
            }));
        };

        XMLResource.prototype.getChildren = function (el, tag) {
            var list = el.find(tag);
            return _.compact(_.map(list, function (c) {
                var child = $(c);
                return child.parent()[0] !== el[0] ? null : child;
            }));
        };

        XMLResource.prototype.getChild = function (el, tag) {
            return this.getChildren(el, tag)[0];
        };

        XMLResource.prototype.getElAttribute = function (el, name) {
            if (el) {
                var attr = el.attr(name);
                if (attr) {
                    return attr;
                }
            }
            return null;
        };
        return XMLResource;
    })(pow2.Resource);
    pow2.XMLResource = XMLResource;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var _shared = null;
    var Time = (function () {
        function Time(options) {
            this.autoStart = false;
            this.tickRateMS = 32;
            this.mspf = 0;
            this.world = null;
            this.lastTime = 0;
            this.time = 0;
            this.running = false;
            this.objects = [];
            _.extend(this, options || {});
            this.polyFillAnimationFrames();
            if (this.autoStart) {
                this.start();
            }
        }
        Time.get = function () {
            if (!_shared) {
                _shared = new pow2.Time({ autoStart: true });
            }
            return _shared;
        };

        Time.prototype.start = function () {
            var _this = this;
            if (this.running) {
                return;
            }
            this.running = true;
            var _frameCallback = function (time) {
                _this.time = Math.floor(time);
                var now = new Date().getMilliseconds();
                var elapsed = Math.floor(time - _this.lastTime);
                if (elapsed >= _this.tickRateMS) {
                    _this.lastTime = time;
                    _this.tickObjects(elapsed);
                }
                _this.processFrame(elapsed);
                _this.mspf = new Date().getMilliseconds() - now;
                window.requestAnimationFrame(_frameCallback);
            };
            _frameCallback(0);
        };

        Time.prototype.stop = function () {
            this.running = false;
        };

        Time.prototype.removeObject = function (object) {
            this.objects = _.reject(this.objects, function (o) {
                return o._uid === object._uid;
            });
        };

        Time.prototype.addObject = function (object) {
            if (!object._uid) {
                throw new Error("Invalid object contains no _uid ->" + object);
            }
            if (_.where(this.objects, { _uid: object._uid }).length > 0) {
                return;
            }
            this.objects.push(object);
        };

        Time.prototype.tickObjects = function (elapsedMS) {
            var values = this.objects;
            for (var i = values.length - 1; i >= 0; --i) {
                values[i].tick && values[i].tick(elapsedMS);
            }
        };
        Time.prototype.processFrame = function (elapsedMS) {
            var values = this.objects;
            for (var i = values.length - 1; i >= 0; --i) {
                values[i].processFrame && values[i].processFrame(elapsedMS);
            }
        };

        Time.prototype.polyFillAnimationFrames = function () {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var i = 0; i < vendors.length; i++) {
                if (window.requestAnimationFrame) {
                    return;
                }
                window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var tickListener = function () {
                        callback(currTime + timeToCall);
                    };
                    var id = window.setTimeout(tickListener, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
        };
        return Time;
    })();
    pow2.Time = Time;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    

    var State = (function () {
        function State() {
            this.transitions = [];
        }
        State.prototype.enter = function (machine) {
        };
        State.prototype.exit = function (machine) {
        };
        State.prototype.update = function (machine) {
            var l = this.transitions.length;
            for (var i = 0; i < l; i++) {
                var t = this.transitions[i];
                if (!t.evaluate(machine)) {
                    continue;
                }
                if (!machine.setCurrentState(t.targetState)) {
                    continue;
                }
                return;
            }
        };
        return State;
    })();
    pow2.State = State;

    var StateTransition = (function () {
        function StateTransition() {
        }
        StateTransition.prototype.evaluate = function (machine) {
            return true;
        };
        return StateTransition;
    })();
    pow2.StateTransition = StateTransition;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    

    var StateMachine = (function (_super) {
        __extends(StateMachine, _super);
        function StateMachine() {
            _super.apply(this, arguments);
            this.defaultState = null;
            this.states = [];
            this._currentState = null;
            this._previousState = null;
            this._newState = false;
        }
        StateMachine.prototype.onAddToWorld = function (world) {
        };
        StateMachine.prototype.onRemoveFromWorld = function (world) {
        };

        StateMachine.prototype.update = function (data) {
            this._newState = false;
            if (this._currentState === null) {
                this.setCurrentState(this.defaultState);
            }
            if (this._currentState !== null) {
                this._currentState.update(this);
            }

            if (this._newState === false && this._currentState !== null) {
                this._previousState = this._currentState;
            }
        };
        StateMachine.prototype.addState = function (state) {
            this.states.push(state);
        };
        StateMachine.prototype.addStates = function (states) {
            this.states = _.unique(this.states.concat(states));
        };

        StateMachine.prototype.getCurrentState = function () {
            return this._currentState;
        };
        StateMachine.prototype.getCurrentName = function () {
            return this._currentState !== null ? this._currentState.name : null;
        };

        StateMachine.prototype.setCurrentState = function (newState) {
            var state = typeof newState === 'string' ? this.getState(newState) : newState;
            var oldState = this._currentState;
            if (!state) {
                console.error("STATE NOT FOUND: " + newState);
                return false;
            }

            if (this._currentState && state.name === this._currentState.name) {
                console.warn("Attempting to set current state to already active state");
                return true;
            }
            this._newState = true;
            this._previousState = this._currentState;
            this._currentState = state;

            if (oldState) {
                this.trigger("exit", oldState, state);
                oldState.exit(this);
            }
            state.enter(this);
            this.trigger("enter", state, oldState);
            return true;
        };
        StateMachine.prototype.getPreviousState = function () {
            return this._previousState;
        };
        StateMachine.prototype.getState = function (name) {
            var state = _.find(this.states, function (s) {
                return s.name === name;
            });
            return state;
        };
        return StateMachine;
    })(pow2.Events);
    pow2.StateMachine = StateMachine;

    var TickedStateMachine = (function (_super) {
        __extends(TickedStateMachine, _super);
        function TickedStateMachine() {
            _super.apply(this, arguments);
            this.paused = false;
        }
        TickedStateMachine.prototype.onAddToWorld = function (world) {
            world.time.addObject(this);
        };
        TickedStateMachine.prototype.onRemoveFromWorld = function (world) {
            world.time.removeObject(this);
        };
        TickedStateMachine.prototype.tick = function (elapsed) {
            this.update(elapsed);
        };
        return TickedStateMachine;
    })(StateMachine);
    pow2.TickedStateMachine = TickedStateMachine;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var World = (function () {
        function World(services) {
            var _this = this;
            this.loader = null;
            services = _.defaults(services || {}, {
                loader: new pow2.ResourceLoader,
                time: new pow2.Time({ autoStart: true }),
                state: null
            });
            _.extend(this, services);
            _.each(services, function (s, k) {
                _this.mark(s);
            });
        }
        World.prototype.setService = function (name, value) {
            this.mark(value);
            this[name] = value;
            return value;
        };

        World.prototype.mark = function (object) {
            if (object) {
                object.world = this;
                if (object.onAddToWorld) {
                    object.onAddToWorld(this);
                }
            }
        };

        World.prototype.erase = function (object) {
            if (object) {
                if (object.onRemoveFromWorld) {
                    object.onRemoveFromWorld(this);
                }
                delete object.world;
            }
        };
        return World;
    })();
    pow2.World = World;
})(pow2 || (pow2 = {}));
var pow2;
(function (pow2) {
    var _shared = null;

    var ResourceLoader = (function () {
        function ResourceLoader() {
            this._cache = {};
            this._types = {
                'png': pow2.ImageResource,
                'js': pow2.ScriptResource,
                'json': pow2.JSONResource,
                'xml': pow2.XMLResource,
                '': pow2.AudioResource
            };
            this._doneQueue = [];
            this.world = null;
            this._uid = _.uniqueId('res');
        }
        ResourceLoader.get = function () {
            if (!_shared) {
                _shared = new pow2.ResourceLoader();
            }
            return _shared;
        };

        ResourceLoader.prototype.onAddToWorld = function (world) {
            world.time.addObject(this);
        };
        ResourceLoader.prototype.onRemoveFromWorld = function (world) {
            world.time.removeObject(this);
        };

        ResourceLoader.prototype.tick = function (elapsed) {
        };
        ResourceLoader.prototype.processFrame = function (elapsed) {
            var doneQueue = this._doneQueue;
            this._doneQueue = [];
            _.each(doneQueue, function (done) {
                done.cb(done.result);
            });
        };

        ResourceLoader.prototype.ensureType = function (extension, type) {
            this._types[extension] = type;
        };

        ResourceLoader.prototype.getResourceExtension = function (url) {
            var index = url.lastIndexOf('.');
            if (index === -1) {
                return '';
            }
            return url.substr(index + 1);
        };

        ResourceLoader.prototype.create = function (typeConstructor, data) {
            var type = new typeConstructor(null, data);
            type.setLoader(this);
            return type;
        };

        ResourceLoader.prototype.loadAsType = function (source, resourceType, done) {
            var _this = this;
            var completeCb = function (obj) {
                if (_this.world && done) {
                    _this._doneQueue.push({ cb: done, result: obj });
                } else if (done) {
                    _.defer(function () {
                        done(obj);
                    });
                }
            };
            if (!resourceType) {
                completeCb(null);
                console.error("Unknown resource type: " + source);
                return;
            }

            var resource = this._cache[source];
            if (!resource) {
                resource = this._cache[source] = new resourceType(source, this);
                resource.setLoader(this);
            } else if (resource.isReady()) {
                return completeCb(resource);
            }

            resource.once('ready', function (resource) {
                console.log("Loaded asset: " + resource.url);
                completeCb(resource);
            });
            resource.once('failed', function (resource) {
                console.log("Failed to load asset: " + resource.url);
                completeCb(null);
            });
            resource.load();
            return resource;
        };

        ResourceLoader.prototype.load = function (sources, done) {
            var results = [];
            var loadQueue = 0;
            if (!_.isArray(sources)) {
                sources = [sources];
            }
            function _checkDone() {
                if (done && loadQueue === 0) {
                    var result = results.length > 1 ? results : results[0];
                    done(result);
                }
            }
            for (var i = 0; i < sources.length; i++) {
                var src = sources[i];
                var extension = this.getResourceExtension(src);
                var resourceType = this._types[extension];
                if (!resourceType) {
                    console.error("Unknown resource type: " + src);
                    return;
                }
                var resource = this._cache[src];
                if (!resource) {
                    resource = this._cache[src] = new resourceType(src, this);
                    resource.setLoader(this);
                } else if (resource.isReady()) {
                    results.push(resource);
                    continue;
                }
                resource.extension = extension;
                loadQueue++;

                resource.once('ready', function (resource) {
                    console.log("Loaded asset: " + resource.url);
                    loadQueue--;
                    _checkDone();
                });
                resource.once('failed', function (resource) {
                    console.log("Failed to load asset: " + resource.url);
                    loadQueue--;
                    _checkDone();
                });
                resource.load();
                results.push(resource);
            }
            var obj = results.length > 1 ? results : results[0];
            if (loadQueue === 0) {
                if (this.world && done) {
                    this._doneQueue.push({ cb: done, result: obj });
                } else if (done) {
                    _.defer(function () {
                        done(obj);
                    });
                }
            }
            return obj;
        };
        return ResourceLoader;
    })();
    pow2.ResourceLoader = ResourceLoader;
})(pow2 || (pow2 = {}));
//# sourceMappingURL=pow-core.js.map
