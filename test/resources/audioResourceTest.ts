///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.AudioResource", ()=> {

  it("should be defined", ()=> {
    expect(pow2.AudioResource).toBeDefined();
  });

  it("should succeed with good url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource = loader.load<pow2.AudioResource>('base/test/fixtures/tele', ()=> {
      console.error("Loaded:" + resource.url);
      expect(resource.error).toBeNull();
      expect(resource.isReady()).toBe(true);
      expect(resource.data.currentTime).toBe(0);
      expect(resource.data.ended).toBe(false);
      expect(resource.data.paused).toBe(true);
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
