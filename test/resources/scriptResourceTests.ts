///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.ScriptResource",()=>{
   it("should be defined",()=>{
      expect(pow2.ScriptResource).toBeDefined();
   });

   it("should succeed with good url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.ScriptResource = loader.load('base/test/fixtures/example.js');
      resource.on(pow2.Resource.READY,()=>{
         var w:any = window;
         expect(w.POW_CORE_TEST.result).toBe('OK');
         delete w.POW_CORE_TEST;
         done();
      });
   });
   it("should fail with bad url",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:pow2.ImageResource = loader.load('bad/does/not/exist.js');
      resource.on(pow2.Resource.FAILED,()=>{
         var w:any = window;
         expect(w.POW_CORE_TEST).toBeUndefined();
         done();
      });
   });
});