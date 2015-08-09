///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class NamedComponent extends pow2.Component {

}

describe("pow2.Component", ()=> {
  it("is defined", () => expect(pow2.Component).toBeDefined());

  it("connectComponent returns true by default", ()=> {
    var c = new pow2.Component();
    expect(c.connectComponent()).toBe(true);
  });
  it("disconnectComponent returns true by default", ()=> {
    var c = new pow2.Component();
    expect(c.disconnectComponent()).toBe(true);
  });
  it("syncComponent returns true by default", ()=> {
    var c = new pow2.Component();
    expect(c.syncComponent()).toBe(true);
  });

  it('returns a human readable class from toString()', () => {
    var c = new NamedComponent();
    expect(c.toString()).toBe('NamedComponent');
  });

});
