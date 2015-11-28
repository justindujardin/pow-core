System.registerDynamic("pow-core/errors.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  exports.errors = {
    INVALID_ARGUMENTS: 'invalid arguments',
    DIVIDE_ZERO: 'divide by zero operation',
    CLASS_NOT_IMPLEMENTED: 'must be implemented in a subclass',
    UNSUPPORTED_OPERATION: 'this operation is unsupported by the implementation',
    REQUIRED_ARGUMENT: 'argument must be valid',
    ALREADY_EXISTS: 'already exists and would overwrite existing value',
    INDEX_OUT_OF_RANGE: 'index out of range',
    INVALID_ITEM: 'invalid item type or value',
    COMPONENT_REGISTER_FAIL: 'component failed to register with host entity'
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/api.js", ["pow-core/errors.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var errors_1 = req('pow-core/errors.js');
  var _worldLookup = {};
  function getWorld(name) {
    return _worldLookup[name];
  }
  exports.getWorld = getWorld;
  function registerWorld(name, instance) {
    if (!name) {
      throw new Error(errors_1.errors.REQUIRED_ARGUMENT);
    }
    if (_worldLookup.hasOwnProperty(name)) {
      throw new Error(errors_1.errors.ALREADY_EXISTS);
    }
    _worldLookup[name] = instance;
    return _worldLookup[name];
  }
  exports.registerWorld = registerWorld;
  function unregisterWorld(name) {
    if (!name) {
      throw new Error(errors_1.errors.REQUIRED_ARGUMENT);
    }
    if (!_worldLookup.hasOwnProperty(name)) {
      throw new Error(errors_1.errors.INVALID_ARGUMENTS);
    }
    var instance = _worldLookup[name];
    delete _worldLookup[name];
    return instance;
  }
  exports.unregisterWorld = unregisterWorld;
  function clearWorlds() {
    _worldLookup = {};
  }
  exports.clearWorlds = clearWorlds;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/component.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var Component = (function() {
    function Component() {
      this.id = _.uniqueId('sc');
    }
    Component.prototype.connectComponent = function() {
      return true;
    };
    Component.prototype.disconnectComponent = function() {
      return true;
    };
    Component.prototype.syncComponent = function() {
      return true;
    };
    Component.prototype.toString = function() {
      var ctor = this.constructor;
      var ctorString = ctor ? ctor.toString().match(/function (.+?)\(/) : null;
      if (ctor && ctor.name) {
        return ctor.name;
      } else if (ctorString && ctorString[1]) {
        return ctorString[1];
      } else {
        return this.name;
      }
    };
    return Component;
  })();
  exports.Component = Component;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/entity.js", ["pow-core/errors.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var errors_1 = req('pow-core/errors.js');
  var Entity = (function() {
    function Entity() {
      this._components = [];
    }
    Entity.prototype.destroy = function() {
      _.each(this._components, function(o) {
        o.disconnectComponent();
      });
      this._components.length = 0;
    };
    Entity.prototype.findComponent = function(type) {
      var values = this._components;
      var l = this._components.length;
      for (var i = 0; i < l; i++) {
        var o = values[i];
        if (o instanceof type) {
          return o;
        }
      }
      return null;
    };
    Entity.prototype.findComponents = function(type) {
      var values = this._components;
      var results = [];
      var l = this._components.length;
      for (var i = 0; i < l; i++) {
        var o = values[i];
        if (o instanceof type) {
          results.push(o);
        }
      }
      return results;
    };
    Entity.prototype.findComponentByName = function(name) {
      var values = this._components;
      var l = this._components.length;
      for (var i = 0; i < l; i++) {
        var o = values[i];
        if (o.name === name) {
          return o;
        }
      }
      return null;
    };
    Entity.prototype.syncComponents = function() {
      var values = this._components;
      var l = this._components.length;
      for (var i = 0; i < l; i++) {
        values[i].syncComponent();
      }
    };
    Entity.prototype.addComponent = function(component, silent) {
      if (_.where(this._components, {id: component.id}).length > 0) {
        throw new Error(errors_1.errors.ALREADY_EXISTS);
      }
      component.host = this;
      if (component.connectComponent() === false) {
        delete component.host;
        return false;
      }
      this._components.push(component);
      if (silent !== true) {
        this.syncComponents();
      }
      return true;
    };
    Entity.prototype.removeComponentByType = function(componentType, silent) {
      if (silent === void 0) {
        silent = false;
      }
      var component = this.findComponent(componentType);
      if (!component) {
        return false;
      }
      return this.removeComponent(component, silent);
    };
    Entity.prototype.removeComponent = function(component, silent) {
      if (silent === void 0) {
        silent = false;
      }
      var previousCount = this._components.length;
      this._components = _.filter(this._components, function(obj) {
        if (obj.id === component.id) {
          if (obj.disconnectComponent() === false) {
            return true;
          }
          obj.host = null;
          return false;
        }
        return true;
      });
      var change = this._components.length !== previousCount;
      if (change && silent !== true) {
        this.syncComponents();
      }
      return change;
    };
    return Entity;
  })();
  exports.Entity = Entity;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/observable.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  function isObject(obj) {
    return !!obj && typeof obj === 'object' && Object.prototype.toString.call(obj) !== '[object Array]';
  }
  exports.isObject = isObject;
  var Observable = (function() {
    function Observable() {
      this._listeners = [];
    }
    Observable.prototype.subscribe = function(generator) {
      var _this = this;
      if (!generator || !isObject(generator)) {
        return null;
      }
      var expired = false;
      this._listeners.push(generator);
      return {unsubscribe: function() {
          if (!expired) {
            expired = true;
            _this._removeGenerator(generator);
          }
        }};
    };
    Observable.prototype.next = function(value) {
      return this._execute('next', value);
    };
    Observable.prototype.throw = function(error) {
      return this._execute('throw', error);
    };
    Observable.prototype.return = function(value) {
      return this._execute('return', value);
    };
    Observable.prototype._execute = function(operation, value) {
      var _this = this;
      var completed = [];
      for (var i = 0; i < this._listeners.length; i++) {
        try {
          var generator = this._listeners[i];
          if (!generator || !generator[operation]) {
            continue;
          }
          var result = generator[operation](value);
          if (result && result.done === true) {
            completed.push(this._listeners[i]);
          }
        } catch (e) {
          if (operation === 'throw') {
            console.error("Error thrown in error handler: ", e);
          } else {
            this.throw(e);
          }
          break;
        }
      }
      if (completed.length) {
        completed.forEach(function(g) {
          return _this._removeGenerator(g);
        });
      }
    };
    Observable.prototype._removeGenerator = function(generator) {
      for (var i = 0; i < this._listeners.length; i++) {
        if (this._listeners[i] === generator) {
          this._listeners.splice(i, 1);
          return;
        }
      }
    };
    return Observable;
  })();
  exports.Observable = Observable;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/point.js", ["pow-core/errors.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var errors_1 = req('pow-core/errors.js');
  var Point = (function() {
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
    Point.prototype.toString = function() {
      return "" + this.x + "," + this.y;
    };
    Point.prototype.set = function(pointOrX, y) {
      if (pointOrX instanceof Point) {
        this.x = pointOrX.x;
        this.y = pointOrX.y;
      } else if (typeof pointOrX === 'number' && typeof y === 'number') {
        this.x = pointOrX;
        this.y = y;
      } else {
        throw new Error(errors_1.errors.INVALID_ARGUMENTS);
      }
      return this;
    };
    Point.prototype.clone = function() {
      return new Point(this.x, this.y);
    };
    Point.prototype.floor = function() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    };
    Point.prototype.round = function() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    };
    Point.prototype.add = function(pointOrXOrValue, y) {
      if (pointOrXOrValue instanceof Point) {
        this.x += pointOrXOrValue.x;
        this.y += pointOrXOrValue.y;
      } else if (typeof pointOrXOrValue === 'number' && typeof y === 'undefined') {
        this.x += pointOrXOrValue;
        this.y += pointOrXOrValue;
      } else {
        this.x += pointOrXOrValue;
        this.y += y;
      }
      return this;
    };
    Point.prototype.subtract = function(pointOrXOrValue, y) {
      if (pointOrXOrValue instanceof Point) {
        this.x -= pointOrXOrValue.x;
        this.y -= pointOrXOrValue.y;
      } else if (typeof pointOrXOrValue === 'number' && typeof y === 'undefined') {
        this.x -= pointOrXOrValue;
        this.y -= pointOrXOrValue;
      } else {
        this.x -= pointOrXOrValue;
        this.y -= y;
      }
      return this;
    };
    Point.prototype.multiply = function(pointOrXOrValue, y) {
      if (pointOrXOrValue instanceof Point) {
        this.x *= pointOrXOrValue.x;
        this.y *= pointOrXOrValue.y;
      } else if (typeof pointOrXOrValue === 'number' && typeof y === 'undefined') {
        this.x *= pointOrXOrValue;
        this.y *= pointOrXOrValue;
      } else {
        this.x *= pointOrXOrValue;
        this.y *= y;
      }
      return this;
    };
    Point.prototype.divide = function(pointOrXOrValue, y) {
      if (pointOrXOrValue instanceof Point) {
        if (pointOrXOrValue.x === 0 || pointOrXOrValue.y === 0) {
          throw new Error(errors_1.errors.DIVIDE_ZERO);
        }
        this.x /= pointOrXOrValue.x;
        this.y /= pointOrXOrValue.y;
      } else if (typeof pointOrXOrValue === 'number' && typeof y === 'undefined') {
        if (pointOrXOrValue === 0) {
          throw new Error(errors_1.errors.DIVIDE_ZERO);
        }
        this.x /= pointOrXOrValue;
        this.y /= pointOrXOrValue;
      } else {
        if (pointOrXOrValue === 0 || y === 0) {
          throw new Error(errors_1.errors.DIVIDE_ZERO);
        }
        this.x /= pointOrXOrValue;
        this.y /= y;
      }
      return this;
    };
    Point.prototype.inverse = function() {
      this.x *= -1;
      this.y *= -1;
      return this;
    };
    Point.prototype.equal = function(point) {
      return this.x === point.x && this.y === point.y;
    };
    Point.prototype.isZero = function() {
      return this.x === 0 && this.y === 0;
    };
    Point.prototype.zero = function() {
      this.x = this.y = 0;
      return this;
    };
    Point.prototype.interpolate = function(from, to, factor) {
      factor = Math.min(Math.max(factor, 0), 1);
      this.x = (from.x * (1.0 - factor)) + (to.x * factor);
      this.y = (from.y * (1.0 - factor)) + (to.y * factor);
      return this;
    };
    return Point;
  })();
  exports.Point = Point;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/rect.js", ["pow-core/errors.js", "pow-core/point.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var errors_1 = req('pow-core/errors.js');
  var point_1 = req('pow-core/point.js');
  var Rect = (function() {
    function Rect(rectOrPointOrX, extentOrY, width, height) {
      if (rectOrPointOrX instanceof Rect) {
        this.point = new point_1.Point(rectOrPointOrX.point);
        this.extent = new point_1.Point(rectOrPointOrX.extent);
      } else if (typeof width === 'number' && typeof height === 'number') {
        this.point = new point_1.Point(rectOrPointOrX, extentOrY);
        this.extent = new point_1.Point(width, height);
      } else if (rectOrPointOrX instanceof point_1.Point && extentOrY instanceof point_1.Point) {
        this.point = new point_1.Point(rectOrPointOrX);
        this.extent = new point_1.Point(extentOrY);
      } else {
        this.point = new point_1.Point(0, 0);
        this.extent = new point_1.Point(1, 1);
      }
      return this;
    }
    Rect.prototype.toString = function() {
      return this.point.toString() + "," + this.extent.toString();
    };
    Rect.prototype.set = function(rectOrPointOrX, extentOrY, width, height) {
      if (rectOrPointOrX instanceof Rect) {
        this.point.set(rectOrPointOrX.point);
        this.extent.set(rectOrPointOrX.extent);
      } else if (typeof width === 'number' && typeof height === 'number') {
        this.point.set(rectOrPointOrX, extentOrY);
        this.extent.set(width, height);
      } else if (rectOrPointOrX instanceof point_1.Point && extentOrY instanceof point_1.Point) {
        this.point.set(rectOrPointOrX);
        this.extent.set(extentOrY);
      } else {
        throw new Error(errors_1.errors.INVALID_ARGUMENTS);
      }
      return this;
    };
    Rect.prototype.clone = function() {
      return new Rect(this.point.clone(), this.extent.clone());
    };
    Rect.prototype.clip = function(clipRect) {
      var right = this.point.x + this.extent.x;
      var bottom = this.point.y + this.extent.y;
      this.point.x = Math.max(clipRect.point.x, this.point.x);
      this.extent.x = Math.min(clipRect.point.x + clipRect.extent.x, right) - this.point.x;
      this.point.y = Math.max(clipRect.point.y, this.point.y);
      this.extent.y = Math.min(clipRect.point.y + clipRect.extent.y, bottom) - this.point.y;
      return this;
    };
    Rect.prototype.isValid = function() {
      return this.extent.x > 0 && this.extent.y > 0;
    };
    Rect.prototype.intersect = function(clipRect) {
      return !(clipRect.point.x > this.point.x + this.extent.x || clipRect.point.x + clipRect.extent.x < this.point.x || clipRect.point.y > this.point.y + this.extent.y || clipRect.point.y + clipRect.extent.y < this.point.y);
    };
    Rect.prototype.pointInRect = function(pointOrX, y) {
      var x = 0;
      if (pointOrX instanceof point_1.Point) {
        x = pointOrX.x;
        y = pointOrX.y;
      } else if (typeof pointOrX === 'number' && typeof y === 'number') {
        x = pointOrX;
      } else {
        throw new Error(errors_1.errors.INVALID_ARGUMENTS);
      }
      if (x >= this.point.x + this.extent.x || y >= this.point.y + this.extent.y) {
        return false;
      }
      return !(x < this.point.x || y < this.point.y);
    };
    Rect.prototype.getCenter = function() {
      var x = parseFloat((this.point.x + this.extent.x * 0.5).toFixed(2));
      var y = parseFloat((this.point.y + this.extent.y * 0.5).toFixed(2));
      return new point_1.Point(x, y);
    };
    Rect.prototype.setCenter = function(pointOrX, y) {
      var x;
      if (pointOrX instanceof point_1.Point) {
        x = pointOrX.x;
        y = pointOrX.y;
      } else {
        x = pointOrX;
      }
      this.point.x = parseFloat((x - this.extent.x * 0.5).toFixed(2));
      this.point.y = parseFloat((y - this.extent.y * 0.5).toFixed(2));
      return this;
    };
    Rect.prototype.getLeft = function() {
      return this.point.x;
    };
    Rect.prototype.getTop = function() {
      return this.point.y;
    };
    Rect.prototype.getRight = function() {
      return this.point.x + this.extent.x;
    };
    Rect.prototype.getBottom = function() {
      return this.point.y + this.extent.y;
    };
    Rect.prototype.getHalfSize = function() {
      return new point_1.Point(this.extent.x / 2, this.extent.y / 2);
    };
    Rect.prototype.addPoint = function(value) {
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
    Rect.prototype.inflate = function(x, y) {
      if (x === void 0) {
        x = 1;
      }
      if (y === void 0) {
        y = 1;
      }
      this.point.x -= x;
      this.extent.x += 2 * x;
      this.point.y -= y;
      this.extent.y += 2 * y;
      return this;
    };
    return Rect;
  })();
  exports.Rect = Rect;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resource.js", ["pow-core/errors.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var errors_1 = req('pow-core/errors.js');
  var Resource = (function() {
    function Resource(url, data) {
      if (url === void 0) {
        url = null;
      }
      if (data === void 0) {
        data = null;
      }
      this.url = url;
      this.data = data;
    }
    Resource.prototype.load = function(data) {
      return Promise.reject(errors_1.errors.CLASS_NOT_IMPLEMENTED);
    };
    Resource.prototype.fetch = function(url) {
      return Promise.reject(errors_1.errors.CLASS_NOT_IMPLEMENTED);
    };
    return Resource;
  })();
  exports.Resource = Resource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/image.js", ["pow-core/resource.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var resource_1 = req('pow-core/resource.js');
  var ImageResource = (function(_super) {
    __extends(ImageResource, _super);
    function ImageResource() {
      _super.apply(this, arguments);
    }
    ImageResource.prototype.fetch = function(url) {
      var _this = this;
      this.url = url || this.url;
      return new Promise(function(resolve, reject) {
        var reference = new Image();
        reference.onload = function() {
          _this.data = reference;
          resolve(_this);
        };
        reference.onerror = function(err) {
          reject(err);
        };
        reference.src = _this.url;
      });
    };
    return ImageResource;
  })(resource_1.Resource);
  exports.ImageResource = ImageResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/script.js", ["pow-core/resource.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var resource_1 = req('pow-core/resource.js');
  var ScriptResource = (function(_super) {
    __extends(ScriptResource, _super);
    function ScriptResource() {
      _super.apply(this, arguments);
    }
    ScriptResource.prototype.fetch = function(url) {
      var _this = this;
      this.url = url || this.url;
      return new Promise(function(resolve, reject) {
        var request = $.getScript(_this.url);
        request.done(function(script) {
          _this.data = script;
          resolve(_this);
        });
        request.fail(function(jqxhr, settings, exception) {
          reject(exception);
        });
      });
    };
    return ScriptResource;
  })(resource_1.Resource);
  exports.ScriptResource = ScriptResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/json.js", ["pow-core/resource.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var resource_1 = req('pow-core/resource.js');
  var JSONResource = (function(_super) {
    __extends(JSONResource, _super);
    function JSONResource() {
      _super.apply(this, arguments);
    }
    JSONResource.prototype.fetch = function(url) {
      var _this = this;
      this.url = url || this.url;
      return new Promise(function(resolve, reject) {
        var request = $.getJSON(_this.url);
        request.done(function(object) {
          _this.data = object;
          resolve(_this);
        });
        request.fail(function(jqxhr, settings, exception) {
          reject(exception);
        });
      });
    };
    return JSONResource;
  })(resource_1.Resource);
  exports.JSONResource = JSONResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/xml.js", ["pow-core/resource.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var resource_1 = req('pow-core/resource.js');
  var XMLResource = (function(_super) {
    __extends(XMLResource, _super);
    function XMLResource() {
      _super.apply(this, arguments);
    }
    XMLResource.prototype.fetch = function(url) {
      var _this = this;
      this.url = url || this.url;
      return new Promise(function(resolve, reject) {
        var request = $.get(_this.url);
        request.done(function(object) {
          _this.data = $(object);
          _this.load(_this.data).then(resolve).catch(reject);
        });
        request.fail(function(jqxhr, settings, exception) {
          reject(exception);
        });
      });
    };
    XMLResource.prototype.load = function(data) {
      return Promise.resolve(this);
    };
    XMLResource.prototype.getRootNode = function(tag) {
      if (!this.data) {
        return null;
      }
      return $(_.find(this.data, function(d) {
        return d.tagName && d.tagName.toLowerCase() === tag;
      }));
    };
    XMLResource.prototype.getChildren = function(el, tag) {
      var list = el.find(tag);
      return _.compact(_.map(list, function(c) {
        var child = $(c);
        return (child.parent()[0] !== el[0] ? null : child);
      }));
    };
    XMLResource.prototype.getChild = function(el, tag) {
      return this.getChildren(el, tag)[0];
    };
    XMLResource.prototype.getElAttribute = function(el, name) {
      if (el) {
        var attr = el.attr(name);
        if (attr) {
          return attr;
        }
      }
      return null;
    };
    return XMLResource;
  })(resource_1.Resource);
  exports.XMLResource = XMLResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/entities.js", ["pow-core/resources/json.js", "pow-core/errors.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var json_1 = req('pow-core/resources/json.js');
  var errors_1 = req('pow-core/errors.js');
  (function(EntityError) {
    EntityError[EntityError["NONE"] = 0] = "NONE";
    EntityError[EntityError["ENTITY_TYPE"] = 1] = "ENTITY_TYPE";
    EntityError[EntityError["COMPONENT_TYPE"] = 2] = "COMPONENT_TYPE";
    EntityError[EntityError["COMPONENT_NAME_DUPLICATE"] = 4] = "COMPONENT_NAME_DUPLICATE";
    EntityError[EntityError["COMPONENT_REGISTER"] = 8] = "COMPONENT_REGISTER";
    EntityError[EntityError["COMPONENT_INPUT"] = 16] = "COMPONENT_INPUT";
    EntityError[EntityError["INPUT_NAME"] = 32] = "INPUT_NAME";
    EntityError[EntityError["INPUT_TYPE"] = 64] = "INPUT_TYPE";
  })(exports.EntityError || (exports.EntityError = {}));
  var EntityError = exports.EntityError;
  var EntityContainerResource = (function(_super) {
    __extends(EntityContainerResource, _super);
    function EntityContainerResource() {
      _super.apply(this, arguments);
    }
    EntityContainerResource.prototype.createObject = function(templateName, inputs) {
      var _this = this;
      var tpl = this.getTemplate(templateName);
      if (!tpl) {
        return Promise.reject('invalid template');
      }
      return this.validateTemplate(tpl, inputs).then(function() {
        return _this._fetchImportModule(tpl.type);
      }).then(function(type) {
        var inputValues = tpl.params ? _.map(tpl.params, function(n) {
          return inputs[n];
        }) : [inputs];
        var object = _this.constructObject(type, inputValues);
        return Promise.all(_.map(tpl.components, function(comp) {
          return new Promise(function(resolve, reject) {
            var inputValues = _.map(comp.params || [], function(n) {
              return inputs[n];
            });
            _this._fetchImportModule(comp.type).then(function(ctor) {
              var compObject = _this.constructObject(ctor, inputValues);
              compObject.name = comp.name;
              if (!object.addComponent(compObject)) {
                reject(errors_1.errors.COMPONENT_REGISTER_FAIL);
              }
              resolve(compObject);
            }).catch(reject);
          });
        })).then(function() {
          return object;
        }).catch(function() {
          return null;
        });
      });
    };
    EntityContainerResource.prototype.validateTemplate = function(templateData, inputs) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        _this._fetchImportModule(templateData.type).then(function(type) {
          if (!type) {
            return reject(EntityError.ENTITY_TYPE);
          }
          if (!templateData.inputs) {
            return;
          }
          var tplInputs = _.keys(templateData.inputs);
          if (!tplInputs) {
            return;
          }
          if (typeof inputs === 'undefined') {
            console.error("EntityContainer: missing inputs for template that requires: " + tplInputs.join(', '));
            return reject(EntityError.INPUT_NAME);
          }
          var verifyInput = function(type, name) {
            return new Promise(function(resolve, reject) {
              return _this._fetchImportModule(type).then(function(inputType) {
                if (typeof inputs[name] === 'undefined') {
                  console.error("EntityContainer: missing input with name: " + name);
                  reject(EntityError.INPUT_NAME);
                } else if (inputType && !(inputs[name] instanceof inputType)) {
                  console.error("EntityContainer: bad input type for input: " + name);
                  reject(EntityError.INPUT_TYPE);
                }
                resolve(inputType);
              }).catch(function() {
                if (!_this.typeofCompare(inputs[name], type)) {
                  console.error("EntityContainer: bad input type for input (" + name + ") expected (" + type + ") but got (" + typeof inputs[name] + ")");
                  reject(EntityError.INPUT_TYPE);
                }
                resolve();
              });
            });
          };
          return Promise.all(_.map(templateData.inputs, verifyInput)).catch(function(e) {
            return reject(e);
          });
        }).then(function() {
          if (templateData.components) {
            var keys = _.map(templateData.components, function(c) {
              return c.name;
            });
            var unique = _.uniq(keys).length === keys.length;
            if (!unique) {
              console.error("EntityContainer: duplicate name in template components: " + keys.join(', '));
              return reject(EntityError.COMPONENT_NAME_DUPLICATE);
            }
          }
        }).then(function() {
          return Promise.all(_.map(templateData.components, function(c) {
            return _this._fetchImportModule(c.type);
          })).then(function() {
            var unsatisfied = EntityError.NONE;
            _.each(templateData.components, function(comp) {
              if (comp.params) {
                _.each(comp.params, function(i) {
                  if (typeof inputs[i] === 'undefined') {
                    console.error("EntityContainer: missing component param: " + i);
                    unsatisfied |= EntityError.COMPONENT_INPUT;
                  }
                });
              }
            });
            if (unsatisfied !== EntityError.NONE) {
              reject(unsatisfied);
            }
          }).catch(function() {
            return reject(EntityError.COMPONENT_TYPE);
          });
        }).then(function() {
          return resolve();
        });
      });
    };
    EntityContainerResource.prototype.getTemplate = function(templateName) {
      if (!this.data) {
        return null;
      }
      var tpl = _.where(this.data, {name: templateName})[0];
      if (!tpl) {
        return null;
      }
      return tpl;
    };
    EntityContainerResource.prototype.constructObject = function(constructor, argArray) {
      var args = [null].concat(argArray);
      var factoryFunction = constructor.bind.apply(constructor, args);
      return new factoryFunction();
    };
    EntityContainerResource.prototype.typeofCompare = function(type, expected) {
      var typeString = typeof type;
      var expected = '' + expected;
      return typeString.toUpperCase() === expected.toUpperCase();
    };
    EntityContainerResource.prototype._fetchImportModule = function(importTuple) {
      var tuple = importTuple.split(EntityContainerResource.IMPORT_SPLITTER);
      if (tuple.length !== 2) {
        return Promise.reject('import type (' + importTuple + ') must be of format "path|typename"');
      }
      var importName = tuple[0];
      var importType = tuple[1];
      return new Promise(function(resolve, reject) {
        System.import(importName).then(function(importModule) {
          if (!importModule[importType]) {
            reject("INVALID MODULE TYPE: " + importName);
          }
          EntityContainerResource._typesCache[importTuple] = importModule[importType];
          resolve(importModule[importType]);
        }).catch(function(e) {
          reject("INVALID MODULE: " + importName + ' - ' + e);
        });
      });
    };
    EntityContainerResource.IMPORT_SPLITTER = '|';
    EntityContainerResource._typesCache = {};
    return EntityContainerResource;
  })(json_1.JSONResource);
  exports.EntityContainerResource = EntityContainerResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/tiled/tiled.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  function readITiledBase(el) {
    return {
      name: getElAttribute(el, 'name'),
      x: parseInt(getElAttribute(el, 'x') || "0"),
      y: parseInt(getElAttribute(el, 'y') || "0"),
      width: parseInt(getElAttribute(el, 'width') || "0"),
      height: parseInt(getElAttribute(el, 'height') || "0"),
      visible: parseInt(getElAttribute(el, 'visible') || "1") === 1,
      _xml: el
    };
  }
  exports.readITiledBase = readITiledBase;
  function writeITiledBase(el, data) {
    setElAttribute(el, 'name', data.name);
    if (data.type) {
      setElAttribute(el, 'type', data.type);
    }
    if (data.x !== 0) {
      setElAttribute(el, 'x', data.x);
    }
    if (data.y !== 0) {
      setElAttribute(el, 'y', data.y);
    }
    setElAttribute(el, 'width', data.width);
    setElAttribute(el, 'height', data.height);
    if (data.visible === false) {
      setElAttribute(el, 'visible', data.visible);
    }
    if (typeof data.color !== 'undefined') {
      setElAttribute(el, 'color', data.color);
    }
  }
  exports.writeITiledBase = writeITiledBase;
  function writeITiledObjectBase(el, data) {
    writeITiledBase(el, data);
  }
  exports.writeITiledObjectBase = writeITiledObjectBase;
  function readITiledObject(el) {
    var result = readITiledLayerBase(el);
    var type = getElAttribute(el, 'type');
    if (type) {
      result.type = type;
    }
    return result;
  }
  exports.readITiledObject = readITiledObject;
  function readITiledLayerBase(el) {
    var result = readITiledBase(el);
    result.opacity = parseInt(getElAttribute(el, 'opacity') || "1");
    var props = readTiledProperties(el);
    if (props) {
      result.properties = props;
    }
    return result;
  }
  exports.readITiledLayerBase = readITiledLayerBase;
  function compactUrl(base, relative) {
    var stack = base.split("/");
    var parts = relative.split("/");
    stack.pop();
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] == ".")
        continue;
      if (parts[i] == "..")
        stack.pop();
      else
        stack.push(parts[i]);
    }
    return stack.join("/");
  }
  exports.compactUrl = compactUrl;
  function xml2Str(xmlNode) {
    try {
      return (new XMLSerializer()).serializeToString(xmlNode);
    } catch (e) {
      try {
        return xmlNode.xml;
      } catch (e) {
        throw new Error('Xmlserializer not supported');
      }
    }
  }
  exports.xml2Str = xml2Str;
  function writeITiledLayerBase(el, data) {
    writeITiledBase(el, data);
    setElAttribute(el, 'opacity', data.opacity);
    writeTiledProperties(el, data.properties);
  }
  exports.writeITiledLayerBase = writeITiledLayerBase;
  function readTiledProperties(el) {
    var propsObject = getChild(el, 'properties');
    if (propsObject && propsObject.length > 0) {
      var properties = {};
      var props = getChildren(propsObject, 'property');
      _.each(props, function(p) {
        var key = getElAttribute(p, 'name');
        var value = getElAttribute(p, 'value');
        if (typeof value === 'string') {
          var checkValue = value.toLowerCase();
          if (checkValue === 'true' || checkValue === 'false') {
            value = checkValue === 'true';
          } else if (!isNaN((checkValue = parseFloat(value)))) {
            value = checkValue;
          }
        }
        properties[key] = value;
      });
      return properties;
    }
    return null;
  }
  exports.readTiledProperties = readTiledProperties;
  function writeTiledProperties(el, data) {
    var result = $('<properties/>');
    _.each(data, function(value, key) {
      var prop = $('<property/>');
      setElAttribute(prop, 'name', key);
      setElAttribute(prop, 'value', value);
      result.append(prop);
    });
    if (result.children().length > 0) {
      el.append(result);
    }
  }
  exports.writeTiledProperties = writeTiledProperties;
  function getChildren(el, tag) {
    var list = el.find(tag);
    return _.compact(_.map(list, function(c) {
      var child = $(c);
      return child.parent()[0] !== el[0] ? null : child;
    }));
  }
  exports.getChildren = getChildren;
  function getChild(el, tag) {
    return getChildren(el, tag)[0];
  }
  exports.getChild = getChild;
  function setElAttribute(el, name, value) {
    el.attr(name, value);
  }
  exports.setElAttribute = setElAttribute;
  function getElAttribute(el, name) {
    return el.attr(name) || null;
  }
  exports.getElAttribute = getElAttribute;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/tiled/tiledTsx.js", ["pow-core/resources/tiled/tiled.js", "pow-core/resources/xml.js", "pow-core/resources/image.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var tiled = req('pow-core/resources/tiled/tiled.js');
  var xml_1 = req('pow-core/resources/xml.js');
  var image_1 = req('pow-core/resources/image.js');
  var TilesetTile = (function() {
    function TilesetTile(id) {
      this.properties = {};
      this.id = id;
    }
    return TilesetTile;
  })();
  exports.TilesetTile = TilesetTile;
  var TiledTSXResource = (function(_super) {
    __extends(TiledTSXResource, _super);
    function TiledTSXResource() {
      _super.apply(this, arguments);
      this.name = null;
      this.tilewidth = 16;
      this.tileheight = 16;
      this.imageWidth = 0;
      this.imageHeight = 0;
      this.image = null;
      this.firstgid = -1;
      this.tiles = [];
      this.relativeTo = null;
      this.imageUrl = null;
      this.literal = null;
    }
    TiledTSXResource.prototype.load = function(data) {
      var _this = this;
      this.data = data || this.data;
      return new Promise(function(resolve, reject) {
        var tileSet = _this.getRootNode('tileset');
        _this.name = _this.getElAttribute(tileSet, 'name');
        _this.tilewidth = parseInt(_this.getElAttribute(tileSet, 'tilewidth'));
        _this.tileheight = parseInt(_this.getElAttribute(tileSet, 'tileheight'));
        var relativePath = _this.url ? _this.url.substr(0, _this.url.lastIndexOf('/') + 1) : "";
        var tiles = _this.getChildren(tileSet, 'tile');
        _.each(tiles, function(ts) {
          var id = parseInt(_this.getElAttribute(ts, 'id'));
          var tile = new TilesetTile(id);
          tile.properties = tiled.readTiledProperties(ts);
          _this.tiles.push(tile);
        });
        var image = _this.getChild(tileSet, 'img');
        if (!image || image.length === 0) {
          return resolve(_this);
        }
        var source = _this.getElAttribute(image, 'source');
        _this.imageWidth = parseInt(_this.getElAttribute(image, 'width') || "0");
        _this.imageHeight = parseInt(_this.getElAttribute(image, 'height') || "0");
        _this.imageUrl = tiled.compactUrl(_this.relativeTo ? _this.relativeTo : relativePath, source);
        console.log("Tileset source: " + _this.imageUrl);
        new image_1.ImageResource(_this.imageUrl).fetch().then(function(res) {
          _this.image = res;
          _this.imageWidth = _this.image.data.width;
          _this.imageHeight = _this.image.data.height;
          var xUnits = _this.imageWidth / _this.tilewidth;
          var yUnits = _this.imageHeight / _this.tileheight;
          var tileCount = xUnits * yUnits;
          var tileLookup = new Array(tileCount);
          for (var i = 0; i < tileCount; i++) {
            tileLookup[i] = false;
          }
          _.each(_this.tiles, function(tile) {
            tileLookup[tile.id] = tile.properties;
          });
          _this.tiles = tileLookup;
          resolve(_this);
        }).catch(function(e) {
          reject("Failed to load required TileMap image: " + source + " - " + e);
        });
      });
    };
    TiledTSXResource.prototype.hasGid = function(gid) {
      return this.firstgid !== -1 && gid >= this.firstgid && gid < this.firstgid + this.tiles.length;
    };
    TiledTSXResource.prototype.getTileMeta = function(gidOrIndex) {
      var index = this.firstgid !== -1 ? (gidOrIndex - (this.firstgid)) : gidOrIndex;
      var tilesX = this.imageWidth / this.tilewidth;
      var x = index % tilesX;
      var y = Math.floor((index - x) / tilesX);
      return _.extend(this.tiles[index] || {}, {
        image: this.image,
        url: this.imageUrl,
        x: x * this.tilewidth,
        y: y * this.tileheight,
        width: this.tilewidth,
        height: this.tileheight
      });
    };
    return TiledTSXResource;
  })(xml_1.XMLResource);
  exports.TiledTSXResource = TiledTSXResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/tiled/tiledTmx.js", ["pow-core/errors.js", "pow-core/resources/tiled/tiled.js", "pow-core/resources/xml.js", "pow-core/resources/tiled/tiledTsx.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var errors_1 = req('pow-core/errors.js');
  var tiled = req('pow-core/resources/tiled/tiled.js');
  var xml_1 = req('pow-core/resources/xml.js');
  var tiledTsx_1 = req('pow-core/resources/tiled/tiledTsx.js');
  var TiledTMXResource = (function(_super) {
    __extends(TiledTMXResource, _super);
    function TiledTMXResource() {
      _super.apply(this, arguments);
      this.width = 0;
      this.height = 0;
      this.orientation = "orthogonal";
      this.tileheight = 16;
      this.tilewidth = 16;
      this.version = 1;
      this.properties = {};
      this.tilesets = {};
      this.layers = [];
      this.xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    }
    TiledTMXResource.prototype.write = function() {
      var _this = this;
      var root = $('<map/>');
      tiled.setElAttribute(root, 'version', this.version);
      tiled.setElAttribute(root, 'orientation', this.orientation);
      tiled.setElAttribute(root, 'width', this.width);
      tiled.setElAttribute(root, 'height', this.height);
      tiled.setElAttribute(root, 'tilewidth', this.tilewidth);
      tiled.setElAttribute(root, 'tileheight', this.tileheight);
      tiled.writeTiledProperties(root, this.properties);
      _.each(this.tilesets, function(tileSet) {
        if (!tileSet.literal) {
          throw new Error("Add support for inline TSX writing");
        }
        if (!tileSet.firstgid) {
          throw new Error(errors_1.errors.INVALID_ITEM);
        }
        var tilesetElement = $('<tileset/>');
        tilesetElement.attr('firstgid', tileSet.firstgid);
        tilesetElement.attr('source', tileSet.literal);
        root.append(tilesetElement);
      });
      _.each(this.layers, function(layer) {
        var layerElement = null;
        if (typeof layer.data !== 'undefined') {
          layerElement = $('<layer/>');
          tiled.writeITiledObjectBase(layerElement, layer);
          var dataElement = $('<data/>');
          var expectLength = _this.width * _this.height;
          if (layer.data.length != expectLength) {
            throw new Error(errors_1.errors.INVALID_ITEM);
          }
          dataElement.attr('encoding', 'csv');
          dataElement.text(layer.data.join(','));
          layerElement.append(dataElement);
        } else if (typeof layer.objects !== 'undefined') {
          layerElement = $('<objectgroup/>');
          _.each(layer.objects, function(obj) {
            var objectElement = $('<object/>');
            tiled.writeITiledObjectBase(objectElement, obj);
            tiled.writeTiledProperties(objectElement, obj.properties);
            layerElement.append(objectElement);
          });
        } else {
          throw new Error(errors_1.errors.INVALID_ITEM);
        }
        tiled.writeITiledLayerBase(layerElement, layer);
        root.append(layerElement);
      });
      return this.xmlHeader + tiled.xml2Str(root[0]);
    };
    TiledTMXResource.prototype.load = function(data) {
      var _this = this;
      this.data = data || this.data;
      return new Promise(function(resolve, reject) {
        _this.$map = _this.getRootNode('map');
        _this.version = parseInt(_this.getElAttribute(_this.$map, 'version'));
        _this.width = parseInt(_this.getElAttribute(_this.$map, 'width'));
        _this.height = parseInt(_this.getElAttribute(_this.$map, 'height'));
        _this.orientation = _this.getElAttribute(_this.$map, 'orientation');
        _this.tileheight = parseInt(_this.getElAttribute(_this.$map, 'tileheight'));
        _this.tilewidth = parseInt(_this.getElAttribute(_this.$map, 'tilewidth'));
        _this.properties = tiled.readTiledProperties(_this.$map);
        var tileSetDeps = [];
        var tileSets = _this.getChildren(_this.$map, 'tileset');
        var relativePath = _this.url.substr(0, _this.url.lastIndexOf('/') + 1);
        _.each(tileSets, function(ts) {
          var source = _this.getElAttribute(ts, 'source');
          var firstGid = parseInt(_this.getElAttribute(ts, 'firstgid') || "-1");
          if (source) {
            tileSetDeps.push({
              source: tiled.compactUrl(relativePath, source),
              literal: source,
              firstgid: firstGid
            });
          } else {
            tileSetDeps.push({
              data: ts,
              source: relativePath,
              firstgid: firstGid
            });
          }
        });
        var layers = _this.getChildren(_this.$map, 'layer,objectgroup');
        var failed = false;
        _.each(layers, function(layer) {
          if (failed) {
            return;
          }
          var tileLayer = tiled.readITiledLayerBase(layer);
          _this.layers.push(tileLayer);
          var data = _this.getChild(layer, 'data');
          if (data) {
            var encoding = _this.getElAttribute(data, 'encoding');
            if (!encoding || encoding.toLowerCase() !== 'csv') {
              failed = true;
              return reject("pow-core only supports CSV maps.  Edit the Map Properties (for:" + _this.url + ") to use the CSV");
            }
            tileLayer.data = JSON.parse('[' + $.trim(data.text()) + ']');
          }
          var color = _this.getElAttribute(layer, 'color');
          if (color) {
            tileLayer.color = color;
          }
          var objects = _this.getChildren(layer, 'object');
          if (objects) {
            tileLayer.objects = [];
            _.each(objects, function(object) {
              tileLayer.objects.push(tiled.readITiledObject(object));
            });
          }
        });
        if (failed) {
          return;
        }
        var _next = function() {
          if (tileSetDeps.length <= 0) {
            return resolve(_this);
          }
          var dep = tileSetDeps.shift();
          if (dep.data) {
            new tiledTsx_1.TiledTSXResource().load(dep.data).then(function(resource) {
              resource.relativeTo = relativePath;
              resource.firstgid = dep.firstgid;
              _this.tilesets[resource.name] = resource;
              _next();
            }).catch(function(e) {
              return reject(e);
            });
          } else if (dep.source) {
            new tiledTsx_1.TiledTSXResource().fetch(dep.data).then(function(resource) {
              _this.tilesets[resource.name] = resource;
              resource.firstgid = dep.firstgid;
              resource.literal = dep.literal;
              _next();
            }).catch(function(e) {
              return reject(e);
            });
          } else {
            reject("Unknown type of tile set data");
          }
        };
        _next();
      });
    };
    return TiledTMXResource;
  })(xml_1.XMLResource);
  exports.TiledTMXResource = TiledTMXResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resources/audio.js", ["pow-core/resource.js", "pow-core/errors.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var resource_1 = req('pow-core/resource.js');
  var errors_1 = req('pow-core/errors.js');
  var AudioResource = (function(_super) {
    __extends(AudioResource, _super);
    function AudioResource() {
      _super.apply(this, arguments);
      this._source = null;
      this._audio = null;
      this._volume = 0.8;
    }
    AudioResource.supportedFormats = function() {
      var _this = this;
      var w = window;
      var ac = w.AudioContext || w.webkitAudioContext;
      if (AudioResource._context === null && ac) {
        AudioResource._context = new ac();
      }
      if (AudioResource._types === null) {
        this._types = [];
        var a = document.createElement('audio');
        if (a.canPlayType) {
          try {
            a.canPlayType('audio/wav;');
            _.each(this.FORMATS, function(desc) {
              var types = desc[1];
              var extension = desc[0];
              _.each(types, function(type) {
                if (!!a.canPlayType(type)) {
                  _this._types.push({
                    extension: extension,
                    type: type
                  });
                }
              });
            });
          } catch (e) {}
        }
      }
      return this._types.slice();
    };
    AudioResource.prototype.fetch = function(url) {
      this.url = url || this.url;
      var formats = AudioResource.supportedFormats();
      var sources = formats.length;
      if (sources === 0) {
        return Promise.reject(errors_1.errors.UNSUPPORTED_OPERATION);
      }
      var reference = document.createElement('audio');
      if (AudioResource._context) {
        this._source = AudioResource._context.createMediaElementSource(reference);
        if (this._source) {
          return this._loadAudioBuffer(formats);
        }
      }
      return this._loadAudioElement(formats);
    };
    AudioResource.prototype.play = function(when) {
      if (when === void 0) {
        when = 0;
      }
      if (this._source) {
        this._source.start(when);
      }
      return this;
    };
    AudioResource.prototype.pause = function() {
      if (this._source) {
        this._source.stop(0);
      } else if (this._audio) {}
      return this;
    };
    Object.defineProperty(AudioResource.prototype, "volume", {
      get: function() {
        return this._volume;
      },
      set: function(value) {
        this._volume = value;
      },
      enumerable: true,
      configurable: true
    });
    AudioResource.prototype._loadAudioBuffer = function(formats) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        var todo = formats.slice();
        var decodeFile = function() {
          if (todo.length === 0) {
            return reject("no sources");
          }
          var fileWithExtension = _this.url + '.' + todo.shift().extension;
          var request = new XMLHttpRequest();
          request.open('GET', fileWithExtension, true);
          request.responseType = 'arraybuffer';
          request.onload = function() {
            AudioResource._context.decodeAudioData(request.response, function(buffer) {
              var source = AudioResource._context.createBufferSource();
              source.buffer = buffer;
              source.connect(AudioResource._context.destination);
              _this._source = source;
              resolve(_this);
            }, decodeFile);
          };
          request.send();
        };
        decodeFile();
      });
    };
    AudioResource.prototype._loadAudioElement = function(formats) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        var sources = formats.length;
        var invalid = [];
        var incrementFailure = function(path) {
          sources--;
          invalid.push(path);
          if (sources <= 0) {
            reject("No valid sources at the following URLs\n   " + invalid.join('\n   '));
          }
        };
        if (sources === 0) {
          return reject('no supported media types');
        }
        var reference = document.createElement('audio');
        if (AudioResource._context) {
          _this._source = AudioResource._context.createMediaElementSource(reference);
        }
        reference.addEventListener('canplaythrough', function() {
          _this.data = reference;
          _this._audio = reference;
          resolve(_this);
        });
        _.each(formats, function(format) {
          var source = document.createElement('source');
          source.addEventListener('error', function() {
            console.log("source failed: " + source.src);
            incrementFailure(source.src);
          });
          source.type = format.type.substr(0, format.type.indexOf(';'));
          source.src = _this.url + '.' + format.extension;
          reference.appendChild(source);
        });
        reference.load();
      });
    };
    AudioResource.FORMATS = [['mp3', ['audio/mpeg;']], ['m4a', ['audio/x-m4a;']], ['aac', ['audio/mp4a;', 'audio/mp4;']], ['ogg', ['audio/ogg; codecs="vorbis"']], ['wav', ['audio/wav; codecs="1"']]];
    AudioResource._context = null;
    AudioResource._types = null;
    return AudioResource;
  })(resource_1.Resource);
  exports.AudioResource = AudioResource;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/resourceLoader.js", ["pow-core/errors.js", "pow-core/resources/image.js", "pow-core/resources/script.js", "pow-core/resources/json.js", "pow-core/resources/xml.js", "pow-core/resources/entities.js", "pow-core/resources/tiled/tiledTmx.js", "pow-core/resources/tiled/tiledTsx.js", "pow-core/resources/audio.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var errors_1 = req('pow-core/errors.js');
  var image_1 = req('pow-core/resources/image.js');
  var script_1 = req('pow-core/resources/script.js');
  var json_1 = req('pow-core/resources/json.js');
  var xml_1 = req('pow-core/resources/xml.js');
  var entities_1 = req('pow-core/resources/entities.js');
  var tiledTmx_1 = req('pow-core/resources/tiled/tiledTmx.js');
  var tiledTsx_1 = req('pow-core/resources/tiled/tiledTsx.js');
  var audio_1 = req('pow-core/resources/audio.js');
  var ResourceLoader = (function() {
    function ResourceLoader() {
      this._cache = {};
      this._types = {
        'png': image_1.ImageResource,
        'js': script_1.ScriptResource,
        'json': json_1.JSONResource,
        'xml': xml_1.XMLResource,
        'entities': entities_1.EntityContainerResource,
        'tmx': tiledTmx_1.TiledTMXResource,
        'tsx': tiledTsx_1.TiledTSXResource,
        '': audio_1.AudioResource
      };
    }
    ResourceLoader.prototype.registerType = function(extension, type) {
      this._types[extension] = type;
    };
    ResourceLoader.prototype.getResourceExtension = function(url) {
      var index = url.lastIndexOf('.');
      if (index === -1 || index <= url.lastIndexOf('/')) {
        return '';
      }
      return url.substr(index + 1);
    };
    ResourceLoader.prototype.create = function(typeConstructor, data) {
      if (typeof typeConstructor !== 'function') {
        throw new Error(errors_1.errors.INVALID_ARGUMENTS);
      }
      var type = new typeConstructor(null, data);
      return type;
    };
    ResourceLoader.prototype.loadAsType = function(source, resourceType) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        if (!source || !resourceType) {
          return reject(errors_1.errors.INVALID_ARGUMENTS);
        }
        var resource = _this._cache[source];
        if (resource && resource.data) {
          return resolve(resource);
        } else if (!resource) {
          resource = _this._cache[source] = new resourceType(source, null);
        }
        resource.fetch().then(function() {
          return resolve(resource);
        }).catch(function(e) {
          return reject(e);
        });
      });
    };
    ResourceLoader.prototype.load = function(sources) {
      var _this = this;
      return new Promise(function(resolve, reject) {
        var results = [];
        var loadQueue = 0;
        var errors = 0;
        if (!_.isArray(sources)) {
          sources = [sources];
        }
        function _checkDone() {
          if (loadQueue === 0) {
            return (errors === 0) ? resolve(results) : reject(errors + ' resources failed to load');
          }
        }
        for (var i = 0; i < sources.length; i++) {
          var src = sources[i];
          var extension = _this.getResourceExtension(src);
          var type = _this._types[extension];
          if (!type) {
            errors++;
            continue;
          }
          loadQueue++;
          _this.loadAsType(src, _this._types[extension]).then(function(resource) {
            loadQueue--;
            _checkDone();
            resource.extension = extension;
            results.push(resource);
          }).catch(function(e) {
            console.log('failed to load resource with error: ' + e);
            errors++;
            loadQueue--;
            _checkDone();
          });
        }
        _checkDone();
      });
    };
    return ResourceLoader;
  })();
  exports.ResourceLoader = ResourceLoader;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/time.js", [], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var _shared = null;
  var Time = (function() {
    function Time() {
      this.tickRateMS = 32;
      this.mspf = 0;
      this.world = null;
      this.lastTime = 0;
      this.time = 0;
      this.running = false;
      this.objects = [];
      this.polyFillAnimationFrames();
    }
    Time.get = function() {
      if (!_shared) {
        _shared = new Time();
      }
      return _shared;
    };
    Time.prototype.start = function() {
      var _this = this;
      if (this.running) {
        return;
      }
      this.running = true;
      var _frameCallback = function(time) {
        if (!_this.running) {
          return;
        }
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
    Time.prototype.stop = function() {
      this.running = false;
    };
    Time.prototype.removeObject = function(object) {
      this.objects = _.reject(this.objects, function(o) {
        return o._uid === object._uid;
      });
    };
    Time.prototype.addObject = function(object) {
      if (!object._uid) {
        object._uid = _.uniqueId("u");
      }
      if (_.where(this.objects, {_uid: object._uid}).length > 0) {
        return;
      }
      this.objects.push(object);
    };
    Time.prototype.tickObjects = function(elapsedMS) {
      var values = this.objects;
      for (var i = values.length - 1; i >= 0; --i) {
        values[i].tick && values[i].tick(elapsedMS);
      }
    };
    Time.prototype.processFrame = function(elapsedMS) {
      var values = this.objects;
      for (var i = values.length - 1; i >= 0; --i) {
        values[i].processFrame && values[i].processFrame(elapsedMS);
      }
    };
    Time.prototype.polyFillAnimationFrames = function() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for (var i = 0; i < vendors.length; i++) {
        if (window.requestAnimationFrame) {
          return;
        }
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var tickListener = function() {
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
  exports.Time = Time;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/world.js", ["pow-core/time.js", "pow-core/resourceLoader.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var time_1 = req('pow-core/time.js');
  var resourceLoader_1 = req('pow-core/resourceLoader.js');
  var World = (function() {
    function World(services) {
      var _this = this;
      this.loader = null;
      services = _.defaults(services || {}, {
        loader: new resourceLoader_1.ResourceLoader,
        time: time_1.Time.get()
      });
      _.extend(this, services);
      _.each(services, function(s) {
        return _this.mark(s);
      });
    }
    World.prototype.setService = function(name, value) {
      this.mark(value);
      this[name] = value;
      return value;
    };
    World.prototype.mark = function(object) {
      if (object) {
        object.world = this;
        if (object.onAddToWorld) {
          object.onAddToWorld(this);
        }
      }
    };
    World.prototype.erase = function(object) {
      if (object) {
        if (object.onRemoveFromWorld) {
          object.onRemoveFromWorld(this);
        }
        delete object.world;
      }
    };
    return World;
  })();
  exports.World = World;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("pow-core/all.js", ["pow-core/api.js", "pow-core/component.js", "pow-core/entity.js", "pow-core/errors.js", "pow-core/observable.js", "pow-core/point.js", "pow-core/rect.js", "pow-core/resource.js", "pow-core/resourceLoader.js", "pow-core/time.js", "pow-core/world.js", "pow-core/resources/audio.js", "pow-core/resources/entities.js", "pow-core/resources/image.js", "pow-core/resources/json.js", "pow-core/resources/script.js", "pow-core/resources/xml.js", "pow-core/resources/tiled/tiled.js", "pow-core/resources/tiled/tiledTmx.js", "pow-core/resources/tiled/tiledTsx.js"], true, function(req, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  __export(req('pow-core/api.js'));
  __export(req('pow-core/component.js'));
  __export(req('pow-core/entity.js'));
  __export(req('pow-core/errors.js'));
  __export(req('pow-core/observable.js'));
  __export(req('pow-core/point.js'));
  __export(req('pow-core/rect.js'));
  __export(req('pow-core/resource.js'));
  __export(req('pow-core/resourceLoader.js'));
  __export(req('pow-core/time.js'));
  __export(req('pow-core/world.js'));
  __export(req('pow-core/resources/audio.js'));
  __export(req('pow-core/resources/entities.js'));
  __export(req('pow-core/resources/image.js'));
  __export(req('pow-core/resources/json.js'));
  __export(req('pow-core/resources/script.js'));
  __export(req('pow-core/resources/xml.js'));
  __export(req('pow-core/resources/tiled/tiled.js'));
  __export(req('pow-core/resources/tiled/tiledTmx.js'));
  __export(req('pow-core/resources/tiled/tiledTsx.js'));
  global.define = __define;
  return module.exports;
});

//# sourceMappingURL=pow-core.js.map