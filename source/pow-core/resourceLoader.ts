/*
 Copyright (C) 2013-2015 by Justin DuJardin

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
declare var _:any;

import {errors} from "./errors";
import {Resource} from "./resource";
import {IResource} from "./resource";
import {IWorldObject} from "./world";
import {IProcessObject} from "./time";
import {ImageResource} from "./resources/image";
import {ScriptResource} from "./resources/script";
import {JSONResource} from "./resources/json";
import {XMLResource} from "./resources/xml";
import {EntityContainerResource} from "./resources/entities";
import {TiledTMXResource} from "./resources/tiled/tiledTmx";
import {TiledTSXResource} from "./resources/tiled/tiledTsx";
import {AudioResource} from "./resources/audio";
import {IWorld} from "./world";
var _shared:ResourceLoader = null;
/**
 * A basic resource loading manager.  Supports a basic api for requesting
 * resources by file name, and uses registered types and file extension
 * matching to create and load a resource.
 */
export class ResourceLoader implements IWorldObject, IProcessObject {
  private _cache:Object = {};
  private _types:Object = {
    'png': ImageResource,
    'js': ScriptResource,
    'json': JSONResource,
    'xml': XMLResource,
    'entities': EntityContainerResource,
    'tmx': TiledTMXResource,
    'tsx': TiledTSXResource,
    '': AudioResource
  };
  private _doneQueue = [];
  _uid:string;
  world:IWorld = null;

  constructor() {
    this._uid = _.uniqueId('res');
  }

  static get():ResourceLoader {
    if (!_shared) {
      _shared = new ResourceLoader();
    }
    return _shared;
  }

  // IWorldObject implementation
  onAddToWorld(world) {
    world.time.addObject(this);
  }

  onRemoveFromWorld(world) {
    world.time.removeObject(this);
  }

  // IProcessObject implementation
  tick(elapsed:number) {
  }

  processFrame(elapsed:number) {
    // It is important that we create a secondary reference to doneQueue here
    // in case any of the done callbacks request resources that end up in the
    // queue.
    var doneQueue = this._doneQueue;
    this._doneQueue = [];
    _.each(doneQueue, function (done) {
      done.cb(done.result);
    });
  }

  registerType(extension:string, type:Function) {
    this._types[extension] = type;
  }

  getResourceExtension(url:string):string {
    var index:number = url.lastIndexOf('.');
    if (index === -1 || index <= url.lastIndexOf('/')) {
      return '';
    }
    return url.substr(index + 1);
  }

  create<T extends IResource>(typeConstructor:any, data:any):T {
    if (typeof typeConstructor !== 'function') {
      throw new Error(errors.INVALID_ARGUMENTS);
    }
    var type:Resource = <Resource>new typeConstructor(null, data);
    type.setLoader(this);
    return <T><any>type;
  }

  loadAsType<T extends IResource>(source:string, resourceType:any, done?:(res?:IResource)=>any):T {
    var completeCb:any = (obj:any) => {
      if (this.world && done) {
        this._doneQueue.push({cb: done, result: obj});
      }
      else if (done) {
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

    var resource:any = this._cache[source];
    if (!resource) {
      resource = this._cache[source] = new resourceType(source, this);
      resource.setLoader(this);
    }
    else if (resource.isReady()) {
      completeCb(resource);
      return resource;
    }

    resource.once('ready', (resource:IResource) => {
      console.log("Loaded asset: " + resource.url);
      completeCb(resource);
    });
    resource.once('failed', (resource:IResource) => {
      completeCb(resource);
    });
    resource.load();
    return resource;
  }

  load<T extends IResource|IResource[]>(sources:Array<string>, done?:(res?:IResource)=>any):T[];
  load<T extends IResource|IResource[]>(sources:Array<string>, done?:(res?:IResource)=>any):T[];
  load<T extends IResource|IResource[]>(source:string, done?:(res?:IResource)=>any):T;
  load<T extends IResource|IResource[]>(sources:any, done?:any):T|T[] {
    var results:Array<T> = [];
    var loadQueue:number = 0;
    if (!_.isArray(sources)) {
      sources = [sources];
    }
    function _checkDone() {
      if (done && loadQueue === 0) {
        var result:any = results.length > 1 ? results : results[0];
        done(result);
      }
    }

    for (var i:number = 0; i < sources.length; i++) {
      var src:string = sources[i];
      var extension:string = this.getResourceExtension(src);
      var resource = this.loadAsType<any>(src, this._types[extension], () => {
        loadQueue--;
        _checkDone();
      });
      if (resource) {
        resource.extension = extension;
        loadQueue++;
        results.push(resource);
      }
      else {
        results.push(null);
      }
    }
    return <any>results.length > 1 ? results : results[0];
  }
}
