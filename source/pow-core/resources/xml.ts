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

import {Resource} from "../resource";
declare var $:any;
declare var _:any;


/**
 * Use jQuery to load an XML file from a URL.
 */
export class XMLResource extends Resource {
  data:any; // JQuery object
  load() {
    var request:any = $.get(this.url); // JQueryXHR
    request.done((object:XMLDocument) => {
      this.data = $(object);
      this.prepare(this.data);
    });
    request.fail((jqxhr, settings, exception) => {
      this.failed(exception);
    });
  }

  /*
   Do any data modification here, or just fall-through to ready.
   */
  prepare(data) {
    this.ready();
  }

  getRootNode(tag:string) {
    if (!this.data) {
      return null;
    }
    return $(_.find(this.data, function (d:any) {
      return d.tagName && d.tagName.toLowerCase() === tag;
    }));
  }

  getChildren<T>(el:any, tag:string):T[] {
    var list = el.find(tag);
    return _.compact(_.map(list, function (c) {
      var child:any = $(c);
      return <T>(child.parent()[0] !== el[0] ? null : child);
    }));
  }

  getChild<T>(el:any, tag:string):T {
    return <T>this.getChildren(el, tag)[0];
  }

  getElAttribute(el:any, name:string) {
    if (el) {
      var attr = el.attr(name);
      if (attr) {
        return attr;
      }
    }
    return null;
  }
}
