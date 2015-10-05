import {IWorldObject} from "pow-core/world";
import {IWorld} from "pow-core/world";
import {World} from "pow-core/world";
import {ResourceLoader} from "pow-core/resourceLoader";

class WorldObject implements IWorldObject {
  world:IWorld;
}
class WorldObjectWithCallbacks implements IWorldObject {
  world:IWorld = null;
  added:boolean = false;

  onAddToWorld(world:IWorld) {
    this.added = true;
  }

  onRemoveFromWorld(world:IWorld) {
    this.added = false;
  }

}
export function main() {
  describe("World", ()=> {
    it("is defined", () => expect(World).toBeDefined());

    it("initializes with static shared resource loader and time manager by default", ()=> {
      var world = new World();
      expect(world.loader).toBeDefined();
      expect(world.time).toBeDefined();
    });

    it('allows overriding services after construction', () => {
      var world = new World();
      expect(world.loader._uid).toBe(ResourceLoader.get()._uid);
      world.setService('loader', new ResourceLoader());
      expect(world.loader._uid).not.toBe(ResourceLoader.get()._uid);
    });

    describe('mark', () => {
      it('calls onAddToWorld for objects that specify implement it', () => {
        var object = new WorldObjectWithCallbacks();
        expect(object.added).toBe(false);
        var world = new World();
        world.mark(object);
        expect(object.added).toBe(true);
      });
      it('does not explode with object that does not implement onAddToWorld', () => {
        var object = new WorldObject();
        var world = new World();
        world.mark(object);
      });
      it('does not explode with bad input', () => {
        var world = new World();
        world.mark(null);
      });
    });

    describe('erase', () => {
      it('calls onRemoveFromWorld for objects that specify implement it', () => {
        var object = new WorldObjectWithCallbacks();
        expect(object.added).toBe(false);
        var world = new World();
        world.mark(object);
        expect(object.added).toBe(true);
        world.erase(object);
        expect(object.added).toBe(false);
      });
      it('does not explode with object that does not implement onAddToWorld', () => {
        var object = new WorldObject();
        var world = new World();
        world.erase(object);
      });
      it('does not explode with bad input', () => {
        var world = new World();
        world.erase(null);
      });
    });

  });
}
