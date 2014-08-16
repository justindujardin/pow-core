///<reference path="../../../types/jasmine.d.ts"/>
///<reference path="../../../lib/pow-core.d.ts"/>

describe("pow2.TiledTMXResource",()=>{
   it("should be defined",()=>{
      expect(pow2.TiledTMXResource).toBeDefined();
   });

   it("should succeed with good url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('base/test/fixtures/example.tmx');
      resource.on(pow2.Resource.READY,()=>{
         var tileSize:number = 16;
         expect(resource.height).toBe(4);
         expect(resource.width).toBe(4);
         expect(resource.tilewidth).toBe(tileSize);
         expect(resource.tileheight).toBe(tileSize);
         expect(resource.layers.length).toBe(2);
         done();
      });
   });

   it("should keep reference to original xml elements",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('base/test/fixtures/example.tmx');
      resource.on(pow2.Resource.READY,()=>{
         expect(resource.layers.length).toBe(2);
         expect(resource.layers[0]._xml).toBeDefined();
         expect(resource.layers[1]._xml).toBeDefined();
         done();
      });
   });

   it("should extract layer data from map",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('base/test/fixtures/example.tmx');
      resource.on(pow2.Resource.READY,()=>{
         var layer:pow2.tiled.ITiledLayer = resource.layers[0];
         expect(layer._xml).toBeDefined();
         expect(layer.name).toBe("TestLayer");
         done();
      });
   });

   it("should extract objectgroup data from map",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('base/test/fixtures/example.tmx');
      resource.on(pow2.Resource.READY,()=>{
         var objectLayer:pow2.tiled.ITiledLayer = resource.layers[1];
         expect(objectLayer.objects.length).toBe(1);



         expect(objectLayer._xml).toBeDefined();
         expect(objectLayer.color).toBe('#000000');

         var object:pow2.tiled.ITiledObject = objectLayer.objects[0];
         expect(object.properties).toBeDefined();
         expect(object.properties.result).toBe("OK");
         expect(object.name).toBe("example");
         done();
      });
   });


   it("should fail with bad url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('bad/does/not/exist.tmx');
      resource.on(pow2.Resource.FAILED,()=>{ done(); });
   });

   it("should fail with missing image source",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('base/test/fixtures/badImage.tmx');
      resource.on(pow2.Resource.FAILED,()=>{ done(); });
   });

   it("should fail with non-csv encoded layer data",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTMXResource = <any>loader.load('base/test/fixtures/badEncoding.tmx');
      resource.on(pow2.Resource.FAILED,()=>{ done(); });
   });


});