///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class MockTimeObject extends pow2.Events implements pow2.IProcessObject{
   _uid:string = _.uniqueId('p');
   tick(elapsed:number) {
      this.trigger('tick');
   }
}

describe("pow2.Time",()=>{
   it("should be defined",()=>{
      expect(pow2.Time).toBeDefined();
   });

   it("should expose a static instance for shared use",()=>{
      var t:pow2.Time = pow2.Time.get();
      expect(t.polyFillAnimationFrames).toBeDefined();
   });

   it("should poly-fill requestAnimationFrame in legacy browsers",(done)=>{
      var olds:{
         [key:string]:any
      } = {
         'requestAnimationFrame':window.requestAnimationFrame
      };
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for (var i = 0; i < vendors.length; i++) {
         olds = window[vendors[i] + 'RequestAnimationFrame'];
         window[vendors[i] + 'RequestAnimationFrame'] = null;
      }
      window.requestAnimationFrame = null;

      var t:pow2.Time = new pow2.Time();
      var m:MockTimeObject = new MockTimeObject();
      t.addObject(m);
      m.once('tick',()=>{
         t.stop();
         t.removeObject(m);
         expect(window.requestAnimationFrame).toBeDefined();
         _.each(olds,(value,key)=>{
            window[key] = value;
         });
         done();
      });
      t.start();
   });

});