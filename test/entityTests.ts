///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class TestComponentNamed extends pow2.Component {
  constructor(public name:string) {
    super();
  }
}
class TestComponentBoolean extends pow2.Component {
  constructor(public value:boolean) {
    super();
  }
}
class TestComponentConnecting extends pow2.Component {
  constructor(public willConnect:boolean) {
    super();
  }

  connectComponent():boolean {
    return this.willConnect;
  }
}
class TestComponentDisconnecting extends pow2.Component {
  constructor(public willDisconnect:boolean) {
    super();
  }

  disconnectComponent():boolean {
    return this.willDisconnect;
  }
}
class TestComponentSynchronize extends pow2.Component {
  public syncCalls:number = 0;

  resetCalls() {
    this.syncCalls = 0;
  }

  syncComponent():boolean {
    this.syncCalls++;
    return super.syncComponent();
  }
}

describe("pow2.Entity", ()=> {
  it("is defined", () => expect(pow2.Entity).toBeDefined());

  // Build an entity and allocate and add a set of components to it.
  function entityWithComponents(types:pow2.Component[]):pow2.Entity {
    var entity:pow2.Entity = new pow2.Entity();
    types.forEach((c:pow2.Component) => entity.addComponent(c));
    return entity;
  }


  it("findComponent finds a single component by a given type", ()=> {
    var e:pow2.Entity = entityWithComponents([
      new TestComponentNamed('comp1')
    ]);
    expect(e.findComponent(TestComponentNamed).name).toBe('comp1');
    expect(e.findComponent(TestComponentBoolean)).toBeNull();
  });

  it("findComponents finds all components with a given type", ()=> {
    var e:pow2.Entity = entityWithComponents([
      new TestComponentNamed('comp1'),
      new TestComponentNamed('comp2'),
    ]);
    expect(e.findComponents(TestComponentNamed).length).toBe(2);
    expect(e.findComponents(TestComponentBoolean).length).toBe(0);
  });

  it("findComponentByName finds components by name", ()=> {
    var e:pow2.Entity = entityWithComponents([
      new TestComponentNamed('comp1'),
      new TestComponentNamed('comp2')
    ]);
    expect(e._components.length).toBe(2);
    expect(e.findComponentByName('comp1')).not.toBeNull();
    expect(e.findComponentByName('comp2')).not.toBeNull();
    expect(e.findComponentByName('comp3')).toBeNull();
  });

  describe('addComponent', () => {
    it('registers components with this object as the host', ()=> {
      var c:pow2.Component = new TestComponentBoolean(false);
      var e:pow2.Entity = entityWithComponents([c]);
      expect(e._components.length).toBe(1);
      expect(c.host.id).toBe(e.id);
    });
    it('throws an error when adding the same component twice', ()=> {
      var c:pow2.Component = new TestComponentBoolean(false);
      var e:pow2.Entity = entityWithComponents([c]);
      expect(e._components.length).toBe(1);
      // throw
      expect(() => e.addComponent(c)).toThrow(new Error(pow2.errors.ALREADY_EXISTS));
    });
    it('does not add a component it returns false from connectComponent()', ()=> {
      var c:pow2.Component = new TestComponentConnecting(false);
      var e:pow2.Entity = new pow2.Entity();
      expect(e.addComponent(c)).toBe(false);
      expect(e._components.length).toBe(0);
    });
    it('calls syncComponent() on all components when a new component is added', ()=> {
      var c:TestComponentSynchronize = new TestComponentSynchronize();
      var e:pow2.Entity = new pow2.Entity();
      expect(c.syncCalls).toBe(0);
      expect(e.addComponent(c)).toBe(true);
      expect(c.syncCalls).toBe(1);
    });
    it('does not call syncComponent() on components when silent parameter is true', ()=> {
      var c:TestComponentSynchronize = new TestComponentSynchronize();
      var e:pow2.Entity = new pow2.Entity();
      expect(c.syncCalls).toBe(0);
      expect(e.addComponent(c, true)).toBe(true);
      expect(c.syncCalls).toBe(0);
    });
  });

  describe('removeComponent', () => {
    it('removes a component by instance', () => {
      var c = new TestComponentBoolean(false);
      var e:pow2.Entity = entityWithComponents([c]);
      expect(e._components.length).toBe(1);
      expect(e.removeComponent(c)).toBe(true);
      expect(e.removeComponent(c)).toBe(false);
    });
    it('fails to remove a component that it does not host', () => {
      var c = new TestComponentBoolean(false);
      var d = new TestComponentBoolean(false);
      var e:pow2.Entity = entityWithComponents([d]);
      expect(e.removeComponent(c)).toBe(false);
      expect(e.removeComponent(d)).toBe(true);
    });
    it('fails to disconnect a component that returns false from disconnectComponent()', () => {
      var c = new TestComponentDisconnecting(false);
      var e:pow2.Entity = entityWithComponents([c]);
      expect(e._components.length).toBe(1);
      expect(e.removeComponent(c)).toBe(false);
    });

    it('calls syncComponent() on all components when a new component is added', ()=> {
      var c = new TestComponentSynchronize();
      var d = new TestComponentBoolean(true);
      var e:pow2.Entity = entityWithComponents([c, d]);
      c.resetCalls();
      expect(e.removeComponent(d)).toBe(true);
      expect(c.syncCalls).toBe(1);
    });
    it('does not call syncComponent() on components when silent parameter is true', ()=> {
      var c = new TestComponentSynchronize();
      var d = new TestComponentBoolean(true);
      var e:pow2.Entity = entityWithComponents([c, d]);
      c.resetCalls();
      expect(e.removeComponent(d, true)).toBe(true);
      expect(c.syncCalls).toBe(0);
    });

  });
  describe('removeComponentByType', () => {
    it('removes a component by type', () => {
      var c = new pow2.Component();
      var e:pow2.Entity = entityWithComponents([c]);
      expect(e.removeComponentByType(pow2.Component)).toBe(true);
    });
    it('fails to remove a component by type when it has none', () => {
      var d = new pow2.Component();
      var e:pow2.Entity = entityWithComponents([d]);
      expect(e.removeComponentByType(TestComponentBoolean)).toBe(false);
    });
    it('calls syncComponent() on all components when a new component is added', ()=> {
      var c = new TestComponentSynchronize();
      var d = new TestComponentBoolean(true);
      var e:pow2.Entity = entityWithComponents([c, d]);
      c.resetCalls();
      expect(e.removeComponentByType(TestComponentBoolean)).toBe(true);
      expect(c.syncCalls).toBe(1);
    });
    it('does not call syncComponent() on components when silent parameter is true', ()=> {
      var c = new TestComponentSynchronize();
      var d = new TestComponentBoolean(true);
      var e:pow2.Entity = entityWithComponents([c, d]);
      c.resetCalls();
      expect(e.removeComponentByType(TestComponentBoolean, true)).toBe(true);
      expect(c.syncCalls).toBe(0);
    });
  });

});
