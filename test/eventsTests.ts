///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

describe("pow2.Events",()=>{
   it("should be defined",()=>{
      expect(pow2.Events).toBeDefined();
   });

   var obj:pow2.Events;
   var count:number;
   var cb:any = () => { count++; };
   beforeEach(()=>{
      obj = new pow2.Events();
      count = 0;
   });
   afterEach(()=>{
      obj.off();
   });

   it("should add observers with on",()=>{
      var ev:string = 'event';
      obj.trigger(ev);
      expect(count).toBe(0);
      obj.on(ev,cb);
      obj.trigger(ev);
      expect(count).toBe(1);
   });

   it("should remove observers with off",()=>{
      var ev:string = 'event';
      obj.on(ev,cb);
      obj.trigger(ev);
      expect(count).toBe(1);
      obj.off(ev,cb);
      obj.trigger(ev);
      expect(count).toBe(1);
   });

   it("should add one time observers with once",()=>{
      var ev:string = 'event';
      obj.once(ev,cb);
      obj.trigger(ev);
      obj.trigger(ev);
      obj.trigger(ev);
      expect(count).toBe(1);
   });

   it("should support trigger with any number of arguments",()=>{
      var ev:string = 'event';
      var expectArgs:number = -1;
      var cb:any = () => {
         expect(expectArgs).toBeGreaterThan(-1);
         expect(arguments.length).toBe(expectArgs);
      };
      obj.on(ev,cb);
      var i:number = 0;
      for(; i < 10; i++){
         expectArgs = i;
         var values = new Array(i);
         for(var j:number = 0; j < values.length; j++){
            values[j] = j;
         }
         values.unshift(ev);
         obj.trigger.apply(obj,values);
      }
   });

   it("should support multiple event names",()=>{
      var ev:string = 'event';
      obj.on(ev,cb);
      obj.trigger('event event');
      expect(count).toBe(2);
   });

   it("should support object listener syntax",()=>{
      obj.on({
         'event': cb
      });
      obj.trigger('event');
   });
});
