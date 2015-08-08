///<reference path="../../types/jasmine.d.ts"/>
///<reference path="../../lib/pow-core.d.ts"/>

describe("pow2.XMLResource", ()=> {
  it("should be defined", ()=> {
    expect(pow2.XMLResource).toBeDefined();
  });

  it("should succeed with good url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource:pow2.XMLResource = <any>loader.load('base/test/fixtures/example.xml');
    resource.on(pow2.Resource.READY, ()=> {
      expect(resource.data.find('xml').text()).toBe('OK');
      done();
    });
  });
  it("should fail with bad url", (done)=> {
    var loader:pow2.ResourceLoader = new pow2.ResourceLoader();
    var resource:pow2.XMLResource = <any>loader.load('bad/does/not/exist.xml');
    resource.on(pow2.Resource.FAILED, ()=> {
      done();
    });
  });
});
