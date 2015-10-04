
import {ScriptResource} from "pow-core/resources/script";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";

export function main() {
  describe("ScriptResource", ()=> {
    it("should be defined", ()=> {
      expect(ScriptResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<ScriptResource>('base/test/fixtures/example.js');
      resource.on(Resource.READY, ()=> {
        var w:any = window;
        expect(w.POW_CORE_TEST.result).toBe('OK');
        delete w.POW_CORE_TEST;
        done();
      });
    });
    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<ScriptResource>('bad/does/not/exist.js');
      resource.on(Resource.FAILED, ()=> {
        var w:any = window;
        expect(w.POW_CORE_TEST).toBeUndefined();
        done();
      });
    });
  });
}
