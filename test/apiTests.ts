///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>
describe("pow2",()=>{
   it("should be defined",()=>{
      expect(pow2).toBeDefined();
   });

   it("should allow registering and unregistering worlds by name",()=>{
      var myWorld:pow2.IWorld = new pow2.World();
      pow2.registerWorld('test',myWorld);
      expect(pow2.getWorld('test')).toBe(myWorld);
      expect(pow2.unregisterWorld('test')).toBe(myWorld);
      expect(pow2.getWorld('test')).toBeFalsy();
   });

});