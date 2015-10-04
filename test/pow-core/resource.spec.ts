
import * as errors from "pow-core/errors";
import {Resource} from "pow-core/resource";

export function main() {
  describe("Resource", ()=> {
    it("should be defined", ()=> {
      expect(Resource).toBeDefined();
    });

    it("should require load to be implemented in a subclass", ()=> {
      var r:Resource = new Resource("/bad/url");
      expect(()=> {
        r.load();
      }).toThrow(new Error(errors.CLASS_NOT_IMPLEMENTED));
    });

  });
}
