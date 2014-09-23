/**
 Copyright (C) 2013 by Justin DuJardin

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

/// <reference path="../xml.ts"/>
/// <reference path="./tiled.ts"/>
/// <reference path="./tiledTsx.ts"/>

module pow2 {

   declare var $:any;

   /**
    * Use jQuery to load a TMX $map file from a URL.
    */
   export class TiledTMXResource extends XMLResource {
      $map:any; // The <map> element
      width:number = 0;
      height:number = 0;
      orientation:string = "orthogonal";
      tileheight:number = 16;
      tilewidth:number = 16;
      version:number = 1;
      properties:any = {};
      tilesets:any = {};
      layers:pow2.tiled.ITiledLayer[] = [];
      xmlHeader:string = '<?xml version="1.0" encoding="UTF-8"?>';

      write():any{
         var root:any = $('<map/>');
         tiled.setElAttribute(root,'version',this.version);
         tiled.setElAttribute(root,'orientation',this.orientation);
         tiled.setElAttribute(root,'width',this.width);
         tiled.setElAttribute(root,'height',this.height);
         tiled.setElAttribute(root,'tilewidth',this.tilewidth);
         tiled.setElAttribute(root,'tileheight',this.tileheight);
         tiled.writeTiledProperties(root,this.properties);

         _.each(this.tilesets,(tileSet:any)=>{
            if(!tileSet.literal){
               throw new Error("Add support for inline TSX writing");
            }
            if(!tileSet.firstgid){
               throw new Error(pow2.errors.INVALID_ITEM);
            }
            var tilesetElement:any = $('<tileset/>');
            tilesetElement.attr('firstgid',tileSet.firstgid);
            tilesetElement.attr('source',tileSet.literal);
            root.append(tilesetElement);
         });

         _.each(this.layers,(layer:pow2.tiled.ITiledLayer)=>{
            var layerElement:any = null;
            if(typeof layer.data !== 'undefined') {
               layerElement = $('<layer/>');
               tiled.writeITiledObjectBase(layerElement,layer);
               var dataElement:any = $('<data/>');

               // Validate data length
               var expectLength:number = this.width * this.height;
               if(layer.data.length != expectLength){
                  throw new Error(pow2.errors.INVALID_ITEM);
               }

               // Only supports CSV. Add GZIP support some day.
               dataElement.attr('encoding','csv');
               dataElement.text(layer.data.join(','));
               layerElement.append(dataElement);
            } else if (typeof layer.objects !== 'undefined'){
               layerElement = $('<objectgroup/>');
               _.each(layer.objects,(obj:tiled.ITiledObject)=>{
                  var objectElement = $('<object/>');
                  tiled.writeITiledObjectBase(objectElement,obj);
                  tiled.writeTiledProperties(objectElement,obj.properties);
                  layerElement.append(objectElement);
               });
            }
            else {
               throw new Error(pow2.errors.INVALID_ITEM);
            }
            tiled.writeITiledLayerBase(layerElement,layer);
            root.append(layerElement);
         });
         return this.xmlHeader + tiled.xml2Str(root[0]);
      }

      prepare(data) {
         this.$map = this.getRootNode('map');
         this.version = parseInt(this.getElAttribute(this.$map,'version'));
         this.width = parseInt(this.getElAttribute(this.$map,'width'));
         this.height = parseInt(this.getElAttribute(this.$map,'height'));
         this.orientation = this.getElAttribute(this.$map,'orientation');
         this.tileheight = parseInt(this.getElAttribute(this.$map,'tileheight'));
         this.tilewidth = parseInt(this.getElAttribute(this.$map,'tilewidth'));
         this.properties = tiled.readTiledProperties(this.$map);
         var tileSetDeps:pow2.tiled.ITileSetDependency[] = [];
         var tileSets = this.getChildren(this.$map,'tileset');
         var relativePath:string = this.url.substr(0,this.url.lastIndexOf('/') + 1);
         _.each(tileSets,(ts) => {
            var source:string = this.getElAttribute(ts,'source');
            var firstGid:number = parseInt(this.getElAttribute(ts,'firstgid') || "-1");
            if(source){
               tileSetDeps.push({
                  source:tiled.compactUrl(relativePath, source),
                  literal:source,
                  firstgid:firstGid
               });
            }
            // Tileset element is inline, load from the existing XML and
            // assign the source (used for relative image loading) to be
            // the .tmx file.
            else {
               tileSetDeps.push({
                  data:ts,
                  source:relativePath,
                  firstgid:firstGid
               })
            }
         });

         // Extract tile <layer>s and <objectgroup>s
         var layers = this.getChildren(this.$map,'layer,objectgroup');
         _.each(layers,(layer) => {
            var tileLayer = <tiled.ITiledLayer>tiled.readITiledLayerBase(layer);
            this.layers.push(tileLayer);

            // Take CSV and convert it to JSON array, then parse.
            var data:any = this.getChild(layer,'data');
            if(data){
               var encoding:string = this.getElAttribute(data,'encoding');
               if(!encoding || encoding.toLowerCase() !== 'csv'){
                  this.failed("Pow2 only supports CSV maps.  Edit the Map Properties (for:" + this.url +  ") in Tiled to use the CSV option when saving.");
               }
               tileLayer.data = JSON.parse('[' + $.trim(data.text()) + ']');
            }

            // Any custom color for this layer?
            var color:string = this.getElAttribute(layer,'color');
            if(color){
               tileLayer.color = color;
            }

            // Read any child objects
            var objects = this.getChildren(layer,'object');
            if(objects){
               tileLayer.objects = [];
               _.each(objects,(object) => {
                  tileLayer.objects.push(<tiled.ITiledObject>tiled.readITiledObject(object));
               });
            }
         });

         // Load any source references.
         var _next = ():any => {
            if(tileSetDeps.length <= 0){
               return this.ready();
            }
            var dep = tileSetDeps.shift();
            if(dep.data) {

               var tsr = <TiledTSXResource>this.loader.create(TiledTSXResource,dep.data);
               tsr.relativeTo = relativePath;
               tsr.once(Resource.READY,()=>{
                  this.tilesets[tsr.name] = tsr;
                  tsr.firstgid = dep.firstgid;
                  _next();
               });
               tsr.once(Resource.FAILED,(error)=>{
                  this.failed(error);
               });
               tsr.prepare(dep.data);
            }
            else if(dep.source){
               this.loader.load(dep.source,(tsr?:TiledTSXResource) => {
                  this.tilesets[tsr.name] = tsr;
                  tsr.firstgid = dep.firstgid;
                  tsr.literal = dep.literal;
                  _next();
               });
            }
            else {
               throw new Error("Unknown type of tile set data");
            }
         };
         _next();
      }
   }
}