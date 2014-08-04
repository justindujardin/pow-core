///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

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
         expect(resource.objectGroups.length).toBe(1);
         expect(resource.layers.length).toBe(1);
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


});