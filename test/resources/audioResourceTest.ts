///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.AudioResource", ()=> {

  if (pow2.AudioResource.supportedFormats().length === 0) {
    console.log("Skipping audio test on platform with no supported media types");
    return;
  }

  it("should be defined", ()=> {
    expect(pow2.AudioResource).toBeDefined();
  });

  it("should succeed with good url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource = loader.load<pow2.AudioResource>('base/test/fixtures/tele', ()=> {
      console.error("Loaded:" + resource.url);
      expect(resource.error).toBeNull();
      expect(resource.isReady()).toBe(true);
      resource.play().pause();
      done();
    });
  });
  it("should fail with bad url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource = loader.load<pow2.AudioResource>('bad/does/not/exist', ()=> {
      expect(resource.isReady()).toBe(false);
      done();
    });
  });
});
