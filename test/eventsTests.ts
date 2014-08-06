///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

//on(name: any, callback?: Function, context?: any): IEvents;
//off(name?: string, callback?: Function, context?: any): IEvents;
//once(events: string, callback: Function, context?: any): IEvents;
//trigger(name: string, ...args: any[]): IEvents;

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
});
