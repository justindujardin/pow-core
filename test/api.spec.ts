///<reference path="../types/jasmine.d.ts"/>

import {IWorld} from "pow-core/world";
import {World} from "pow-core/world";
import * as pow2 from "pow-core/api";

export function main() {
  describe("pow2", ()=> {
    it("should be defined", ()=> {
      expect(pow2).toBeDefined();
    });

    it("should allow registering and unregistering worlds by name", ()=> {
      var myWorld:IWorld = new World();
      pow2.registerWorld('test', myWorld);
      expect(pow2.getWorld('test')).toBe(myWorld);
      expect(pow2.unregisterWorld('test')).toBe(myWorld);
      expect(pow2.getWorld('test')).toBeFalsy();
    });

  });
}
