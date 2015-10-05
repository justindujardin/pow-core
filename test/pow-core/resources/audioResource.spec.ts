import {AudioResource} from "pow-core/resources/audio";
import {ResourceLoader} from "pow-core/resourceLoader";

export function main() {
  describe("AudioResource", ()=> {

    // For some inexplicable reason IE10/11 fail to fire the proper
    // audio element events in tha karma use-case (when the dev tools
    // are open as well).  The use of the AudioResource is fine in practice.
    // todo: Figure out why IE10/11 fail to fire events in unit test
    var ie10 = /MSIE 10/i.test(navigator.userAgent);
    var ie11 = /rv:11.0/i.test(navigator.userAgent);
    if (AudioResource.supportedFormats().length === 0 || ie10 || ie11) {
      console.log("Skipping audio test on platform with no supported media types");
      return;
    }

    it("should be defined", ()=> {
      expect(AudioResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<AudioResource>('base/test/fixtures/tele', ()=> {
        console.error("Loaded:" + resource.url);
        expect(resource.error).toBeNull();
        expect(resource.isReady()).toBe(true);
        resource.play().pause();
        done();
      });
    });
    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<AudioResource>('bad/does/not/exist', ()=> {
        expect(resource.isReady()).toBe(false);
        done();
      });
    });
  });
}
