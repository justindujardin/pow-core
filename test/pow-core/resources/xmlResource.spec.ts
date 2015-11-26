import {XMLResource} from "pow-core/resources/xml";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";

export function main() {
  describe("XMLResource", ()=> {
    it("should be defined", ()=> {
      expect(XMLResource).toBeDefined();
    });
    it("should succeed with good url", (done)=> {
      new XMLResource()
        .fetch('base/test/fixtures/example.xml')
        .then((res:XMLResource) => {
          expect(res.data.find('xml').text()).toBe('OK');
          done();
        });
    });
    it("should fail with bad url", (done)=> {
      new XMLResource()
        .fetch('base/bad/does/not/exist.xml')
        .catch(() => done());
    });
  });
}
