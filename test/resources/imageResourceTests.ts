///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.ImageResource", ()=> {
  it("should be defined", ()=> {
    expect(pow2.ImageResource).toBeDefined();
  });

  it("should succeed with good url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource:pow2.ImageResource = loader.load('base/test/fixtures/vezu.png');
    resource.on(pow2.Resource.READY, ()=> {
      expect(resource.data.naturalWidth).toBe(16);
      expect(resource.data.naturalHeight).toBe(16);
      done();
    });
  });
  it("should fail with bad url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource:pow2.ImageResource = loader.load('base/bad/does/not/exist.png');
    resource.on(pow2.Resource.FAILED, ()=> {
      done();
    });
  });
});
