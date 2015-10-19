import {ImageResource} from "pow-core/resources/image";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";

export function main() {
  describe("ImageResource", ()=> {
    it("should be defined", ()=> {
      expect(ImageResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      new ImageResource()
        .fetch('base/test/fixtures/vezu.png')
        .then((res:ImageResource) => {
          expect(res.data.naturalWidth).toBe(16);
          expect(res.data.naturalHeight).toBe(16);
          done();
        });
    });
    it("should fail with bad url", (done)=> {
      new ImageResource()
        .fetch('base/test/fixtures/invalidfile.png')
        .catch(() => done());
    });
  });
}
