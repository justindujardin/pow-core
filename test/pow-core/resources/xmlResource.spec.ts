import {XMLResource} from "pow-core/resources/xml";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";

export function main() {
  describe("XMLResource", ()=> {
    it("should be defined", ()=> {
      expect(XMLResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<XMLResource>('base/test/fixtures/example.xml');
      resource.on(Resource.READY, ()=> {
        expect(resource.data.find('xml').text()).toBe('OK');
        done();
      });
    });
    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<XMLResource>('bad/does/not/exist.xml');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });
  });
}
