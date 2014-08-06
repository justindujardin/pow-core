///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class MockResource extends pow2.Resource {
   public shouldFail:boolean = false;
   load() {
      _.defer(()=>{
         this.shouldFail ? this.failed(null) : this.ready();
      });
   }
}

describe("pow2.ResourceLoader",()=>{
   it("should be defined and instantiable",()=>{
      expect(pow2.ResourceLoader).toBeDefined();
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      expect(loader).not.toBeNull();
   });

   it("should be accessible as a shared singleton",()=>{
      expect(pow2.ResourceLoader.get()).toBeDefined();
      expect(pow2.ResourceLoader.get()).toBeDefined();
   });

   it("should trigger Resource.READY event when resource loads properly",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:MockResource = loader.create<MockResource>(MockResource,true);
      resource.shouldFail = false;
      resource.on(pow2.Resource.READY,()=>{
         expect(resource.shouldFail).toBe(false);
         done();
      });
      resource.load();
   });

   it("should trigger Resource.FAILED event when resource fails to load",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:MockResource = loader.create<MockResource>(MockResource,true);
      resource.shouldFail = true;
      resource.on(pow2.Resource.FAILED,()=>{
         expect(resource.shouldFail).toBe(true);
         done();
      });
      resource.load();
   });

   it("should allow specifying resource type explicitly",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      var resource:MockResource = <MockResource>loader.loadAsType("something",MockResource,()=>{
         expect(resource.shouldFail).toBeFalsy();
         done();
      });
   });

   it("should register custom types",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      loader.registerType('mock',MockResource);
      var resource:MockResource = <MockResource>loader.load('made-up.mock');
      resource.on(pow2.Resource.READY,()=>{
         done();
      });
   });

   it("should cache loaded resources",(done)=>{
      var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
      loader.registerType('mock',MockResource);
      var resource:any = loader.load('made-up.mock',()=>{
         resource._marked = 1337;
         // Ensure the same resource is returned, indicating that it
         // was retrieved from the cache.
         loader.load('made-up.mock',(res:pow2.IResource)=>{
            expect((<any>res)._marked).toBe(1337);
            done();
         });
      });
   });

});