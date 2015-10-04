
import {JSONResource} from "pow-core/resources/json";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";
export function main() {
  describe("JSONResource", ()=> {
    it("should be defined", ()=> {
      expect(JSONResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<JSONResource>('base/test/fixtures/example.json');
      resource.on(Resource.READY, ()=> {
        expect(resource.data.result).toBe('OK');
        done();
      });
    });
    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<JSONResource>('bad/does/not/exist.json');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });
  });
}
