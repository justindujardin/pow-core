///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

describe("pow2.Resource", ()=> {
  it("should be defined", ()=> {
    expect(pow2.Resource).toBeDefined();
  });

  it("should require load to be implemented in a subclass", ()=> {
    var r:pow2.Resource = new pow2.Resource("/bad/url");
    expect(()=> {
      r.load();
    }).toThrow(new Error(pow2.errors.CLASS_NOT_IMPLEMENTED));
  });

});
