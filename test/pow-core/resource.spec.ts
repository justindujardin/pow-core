import {errors} from "pow-core/errors";
import {Resource} from "pow-core/resource";

export function main() {
  describe("Resource", ()=> {
    it("should be defined", ()=> {
      expect(Resource).toBeDefined();
    });

    it("should require load to be implemented in a subclass", (done)=> {
      new Resource().fetch("/bad/url").catch(() => done());
    });

  });
}
