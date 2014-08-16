/**
 Copyright (C) 2013-2014 by Justin DuJardin

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


module pow2.tiled {
   declare var $:any;


   // -------------------------------------------------------------------------
   // Implement a subset of the Tiled editor format:
   //
   // https://github.com/bjorn/tiled/wiki/TMX-Map-Format

   export interface ITileInstanceMeta {
      image: HTMLImageElement;
      url: string;
      x: number;
      y: number;
      width: number;
      height: number;
      data?: any;
   }

   export interface ITiledBase {
      name:string;
      x:number;
      y:number;
      width:number;
      height:number;
      visible:boolean;
      _xml:any;
   }

   // <layer>, <objectgroup>
   export interface ITiledLayerBase extends ITiledBase {
      opacity:number; // 0-1
      properties?:any;
   }
   export interface ITiledLayer extends ITiledLayerBase {
      data?:any;
      color?:string;
      objects?:ITiledObject[];
   }

   // <object>
   export interface ITiledObject extends ITiledBase {
      properties?:any;
      rotation?:number;
      type?:string;
      gid?:number;
      color?:string;
   }

   export interface ITileSetDependency {
      source?:string; // Path to URL source from which to load data.
      data?:any; // Data instead of source.
      firstgid:number; // First global id.
   }


   // Tiled object XML reading utilities.
   export function readITiledBase(el:any):ITiledBase{
      return {
         name:getElAttribute(el,'name'),
         x:parseInt(getElAttribute(el,'x') || "0"),
         y:parseInt(getElAttribute(el,'y') || "0"),
         width:parseInt(getElAttribute(el,'width') || "0"),
         height:parseInt(getElAttribute(el,'height') || "0"),
         visible:parseInt(getElAttribute(el, 'visible') || "1") === 1, // 0 or 1,
         _xml:el
      };
   }

   export function readITiledLayerBase(el:any):ITiledLayerBase {
      // Base layer properties
      var result:ITiledLayerBase = <ITiledLayerBase>readITiledBase(el);
      // Layer opacity is 0-1
      result.opacity = parseInt(getElAttribute(el,'opacity') || "1");
      // Custom properties
      var props = readTiledProperties(el);
      if(props){
         result.properties = props;
      }
      result._xml = el;
      return result;
   }

   export function readTiledProperties(el:any){
      var propsObject:any = getChild(el,'properties');
      if(propsObject && propsObject.length > 0){
         var properties = {};
         var props = getChildren(propsObject,'property');
         _.each(props,(p) => {
            var key = getElAttribute(p,'name');
            var value:any = getElAttribute(p,'value');

            // Do some horrible type guessing.
            if(typeof value === 'string'){
               var checkValue:any = value.toLowerCase();
               if(checkValue === 'true' || checkValue === 'false'){
                  value = checkValue === 'true';
               }
               else if(!isNaN((checkValue = parseFloat(value)))){
                  value = checkValue
               }
            }
            properties[key] = value;
         });
         return properties;
      }
      return null;
   }

   // XML Utilities

   export function getChildren(el:any,tag:string):any[] {
      var list = el.find(tag);
      return _.compact(_.map(list,function(c){
         var child:any = $(c);
         return child.parent()[0] !== el[0] ? null : child;
      }));
   }

   export function getChild(el:any,tag:string):any {
      return getChildren(el,tag)[0];
   }

   export function getElAttribute(el:any, name:string){
      if(el){
         var attr = el.attr(name);
         if(attr){
            return attr;
         }
      }
      return null;
   }

}