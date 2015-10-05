import {ImageResource} from "pow-core/resources/image";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";

export function main() {
  describe("ImageResource", ()=> {
    it("should be defined", ()=> {
      expect(ImageResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<ImageResource>('base/test/fixtures/vezu.png');
      resource.on(Resource.READY, ()=> {
        expect(resource.data.naturalWidth).toBe(16);
        expect(resource.data.naturalHeight).toBe(16);
        done();
      });
    });
    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<ImageResource>('base/bad/does/not/exist.png');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });
  });
}
