///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class MockResource extends pow2.Resource {
   public shouldFail:boolean = false;
   load() {
      _.defer(()=>{
         this.shouldFail ? this.failed(this.error) : this.ready();
      });
   }
}

describe("pow2.ResourceLoader",()=>{
   it("should be defined and instantiable",()=>{
      expect(pow2.ResourceLoader).toBeDefined();
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      expect(loader).not.toBeNull();
   });

   it("should allow registering custom resource types",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:MockResource = loader.create<MockResource>(MockResource,true);
      resource.shouldFail = false;
      resource.on('ready',()=>{
         expect(resource.shouldFail).toBe(false);
         done();
      });
      resource.on('fail',()=>{
         expect(resource.shouldFail).toBe(true);
         done();
      });
      resource.load();
   });

});