///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

describe("pow2.JSONResource",()=>{
   it("should be defined",()=>{
      expect(pow2.JSONResource).toBeDefined();
   });

   it("should succeed with good url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.JSONResource = loader.load('base/test/fixtures/example.json');
      resource.on(pow2.Resource.READY,()=>{
         expect(resource.data.result).toBe('OK');
         done();
      });
   });
   it("should fail with bad url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.ImageResource = loader.load('bad/does/not/exist.json');
      resource.on(pow2.Resource.FAILED,()=>{
         done();
      });
   });
});