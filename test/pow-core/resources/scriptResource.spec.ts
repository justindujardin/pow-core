import {ScriptResource} from "pow-core/resources/script";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";

export function main() {
  describe("ScriptResource", ()=> {
    it("should be defined", ()=> {
      expect(ScriptResource).toBeDefined();
    });
    it("should succeed with good url", (done)=> {
      new ScriptResource()
        .fetch('base/test/fixtures/example.js')
        .then(() => {
          var w:any = window;
          expect(w.POW_CORE_TEST.result).toBe('OK');
          delete w.POW_CORE_TEST;
          done();
        });
    });
    it("should fail with bad url", (done)=> {
      new ScriptResource()
        .fetch('base/bad/does/not/exist.js')
        .catch(() => done());
    });

  });
}
