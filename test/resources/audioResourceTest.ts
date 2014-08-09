///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.AudioResource",()=>{
   it("should be defined",()=>{
      expect(pow2.AudioResource).toBeDefined();
   });

   it("should succeed with good url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.AudioResource = loader.load('base/test/fixtures/tele');
      resource.on(pow2.Resource.READY,()=>{
         expect(resource.data.currentTime).toBe(0);
         expect(resource.data.ended).toBe(false);
         expect(resource.data.paused).toBe(true);
         done();
      });
   });
   it("should fail with bad url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.AudioResource = loader.load('bad/does/not/exist');
      resource.on(pow2.Resource.FAILED,()=>{
         done();
      });
   });
});