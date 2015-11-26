import {JSONResource} from "pow-core/resources/json";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";
export function main() {
  describe("JSONResource", ()=> {
    it("should be defined", ()=> {
      expect(JSONResource).toBeDefined();
    });
    it("should succeed with good url", (done)=> {
      new JSONResource()
        .fetch('base/test/fixtures/example.json')
        .then((res:JSONResource) => {
          expect(res.data.result).toBe('OK');
          done();
        });
    });
    it("should fail with bad url", (done)=> {
      new JSONResource()
        .fetch('base/bad/does/not/exist.json')
        .catch(() => done());
    });
  });
}
