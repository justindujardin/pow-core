///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.AudioResource", ()=> {

  // For some inexplicable reason IE10/11 fail to fire the proper
  // audio element events in tha karma use-case (when the dev tools
  // are open as well).  The use of the AudioResource is fine in practice.
  // todo: Figure out why IE10/11 fail to fire events in unit test
  var ie10 = /MSIE 10/i.test(navigator.userAgent);
  var ie11 = /rv:11.0/i.test(navigator.userAgent);
  if (pow2.AudioResource.supportedFormats().length === 0 || ie10 || ie11) {
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
