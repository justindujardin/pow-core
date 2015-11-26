import {IWorld} from "pow-core/world";
import {World} from "pow-core/world";
import * as pow2 from "pow-core/all";
import {errors} from "pow-core/errors";

export function main() {
  describe("pow2", ()=> {
    let world:IWorld = null;
    beforeEach(() => {
      world = new World();
    });
    afterEach(() => {
      pow2.clearWorlds();
    });

    it("should be defined", ()=> {
      expect(pow2).toBeDefined();
    });

    describe('registerWorld', () => {
      it("should register world by name", ()=> {
        pow2.registerWorld('test', world);
        expect(pow2.getWorld('test')).toBe(world);
      });

      it("should throw an error when not given a name", ()=> {
        expect(()=> {
          pow2.registerWorld(null, world);
        }).toThrow(new Error(errors.REQUIRED_ARGUMENT));
      });
      it("should throw an error when a world with the given name already exists", ()=> {
        pow2.registerWorld('test', world);
        expect(()=> {
          pow2.registerWorld('test', world);
        }).toThrow(new Error(errors.ALREADY_EXISTS));
      });
    });

    describe('unregisterWorld', () => {
      it("should unregister world by name", ()=> {
        pow2.registerWorld('test', world);
        expect(pow2.getWorld('test')).toBe(world);
        expect(pow2.unregisterWorld('test')).toBe(world);
        expect(pow2.getWorld('test')).toBeFalsy();
      });

      it("should throw an error when not given a name", ()=> {
        expect(()=> {
          pow2.unregisterWorld(null);
        }).toThrow(new Error(errors.REQUIRED_ARGUMENT));
      });
      it("should throw an error when a world with the given name does not exist", ()=> {
        expect(()=> {
          pow2.unregisterWorld('test');
        }).toThrow(new Error(errors.INVALID_ARGUMENTS));
      });
    });

  });
}
