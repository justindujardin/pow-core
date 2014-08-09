///<reference path="../../../types/jasmine.d.ts"/>
///<reference path="../../../lib/pow-core.d.ts"/>

describe("pow2.TiledTSXResource",()=>{
   it("should be defined",()=>{
      expect(pow2.TiledTSXResource).toBeDefined();
   });

   it("should succeed with good url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTSXResource = <any>loader.load('base/test/fixtures/example.tsx');
      resource.on(pow2.Resource.READY,()=>{
         expect(resource.name).toBe('example');
         done();
      });
   });
   it("should fail with bad url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTSXResource = <any>loader.load('bad/does/not/exist.tsx');
      resource.on(pow2.Resource.FAILED,()=>{ done(); });
   });
   it("should fail with missing image source",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.TiledTSXResource = <any>loader.load('base/test/fixtures/badImage.tsx');
      resource.on(pow2.Resource.FAILED,()=>{ done(); });
   });
});