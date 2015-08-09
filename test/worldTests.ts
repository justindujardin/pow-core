///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class WorldObject implements pow2.IWorldObject {
  world:pow2.IWorld;
}
class WorldObjectWithCallbacks implements pow2.IWorldObject {
  world:pow2.IWorld = null;
  added:boolean = false;

  onAddToWorld(world:pow2.IWorld) {
    this.added = true;
  }

  onRemoveFromWorld(world:pow2.IWorld) {
    this.added = false;
  }

}

describe("pow2.World", ()=> {
  it("is defined", () => expect(pow2.World).toBeDefined());

  it("initializes with static shared resource loader and time manager by default", ()=> {
    var world = new pow2.World();
    expect(world.loader).toBeDefined();
    expect(world.time).toBeDefined();
  });

  it('allows overriding services after construction', () => {
    var world = new pow2.World();
    expect(world.loader._uid).toBe(pow2.ResourceLoader.get()._uid);
    world.setService('loader', new pow2.ResourceLoader());
    expect(world.loader._uid).not.toBe(pow2.ResourceLoader.get()._uid);
  });

  describe('mark', () => {
    it('calls onAddToWorld for objects that specify implement it', () => {
      var object = new WorldObjectWithCallbacks();
      expect(object.added).toBe(false);
      var world = new pow2.World();
      world.mark(object);
      expect(object.added).toBe(true);
    });
    it('does not explode with object that does not implement onAddToWorld', () => {
      var object = new WorldObject();
      var world = new pow2.World();
      world.mark(object);
    });
    it('does not explode with bad input', () => {
      var world = new pow2.World();
      world.mark(null);
    });
  });

  describe('erase', () => {
    it('calls onRemoveFromWorld for objects that specify implement it', () => {
      var object = new WorldObjectWithCallbacks();
      expect(object.added).toBe(false);
      var world = new pow2.World();
      world.mark(object);
      expect(object.added).toBe(true);
      world.erase(object);
      expect(object.added).toBe(false);
    });
    it('does not explode with object that does not implement onAddToWorld', () => {
      var object = new WorldObject();
      var world = new pow2.World();
      world.erase(object);
    });
    it('does not explode with bad input', () => {
      var world = new pow2.World();
      world.erase(null);
    });
  });

});
