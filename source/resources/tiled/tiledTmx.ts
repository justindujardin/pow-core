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
         _.each(tileSets,(ts) => {
            var source:string = this.getElAttribute(ts,'source');
            var firstGid:number = parseInt(this.getElAttribute(ts,'firstgid') || "-1");
            if(source){
               tileSetDeps.push({
                  source:source,
                  firstgid:firstGid
               });
            }
            // Tileset element is inline, load from the existing XML and
            // assign the source (used for relative image loading) to be
            // the .tmx file.
            else {
               tileSetDeps.push({
                  data:ts,
                  source:this.url,
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
                  tileLayer.objects.push(<tiled.ITiledObject>tiled.readITiledLayerBase(object));
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
               tsr.url = dep.source;
               tsr.once(Resource.READY,()=>{
                  this.tilesets[tsr.name] = tsr;
                  tsr.firstgid = dep.firstgid;
                  _next();
               });
               tsr.once(Resource.FAILED,(error)=>{
                  this.failed(error);
               });
               tsr.prepare(data);
            }
            else if(dep.source){
               this.loader.load(dep.source,(tsr?:TiledTSXResource) => {
                  this.tilesets[tsr.name] = tsr;
                  tsr.firstgid = dep.firstgid;
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