
import {Events} from "pow-core/events";

export function main() {
  describe("Events", ()=> {
    it("should be defined", ()=> {
      expect(Events).toBeDefined();
    });

    var obj:Events;
    var count:number;
    var cb:any = () => {
      count++;
    };
    beforeEach(()=> {
      obj = new Events();
      count = 0;
    });
    afterEach(()=> {
      obj.off();
    });

    describe('on', ()=> {
      it("should add observers", ()=> {
        var ev:string = 'event';
        obj.trigger(ev);
        expect(count).toBe(0);
        obj.on(ev, cb);
        obj.trigger(ev);
        expect(count).toBe(1);
      });
      it("should support object listener syntax", ()=> {
        obj.on({
          'event': cb
        });
        obj.trigger('event');
        expect(count).toBe(1);
      });
      it("should support listening to all events", ()=> {
        var count:number = 0;
        obj.on('all', ()=> {
          count++;
        });
        obj.trigger('foo');
        obj.trigger('bar');
        expect(count).toBe(2);
      });
    });


    describe('off', ()=> {
      it("should remove observers", ()=> {
        var ev:string = 'event';
        obj.on(ev, cb);
        obj.trigger(ev);
        expect(count).toBe(1);
        obj.off(ev, cb);
        obj.trigger(ev);
        expect(count).toBe(1);
      });
      it("should do nothing with bad input", ()=> {
        var ev:string = 'event';
        obj.on(ev, cb);
        obj.off(null, cb);
        obj.off(null, null, this);
        obj.off(ev, null, null);
      });
    });

    describe('once', ()=> {
      it("should add one time observers with once", ()=> {
        var ev:string = 'event';
        obj.once(ev, cb);
        obj.trigger(ev);
        obj.trigger(ev);
        obj.trigger(ev);
        expect(count).toBe(1);
        // Don't explode with invalid input
        obj.once(ev);
        obj.trigger(ev);
        expect(count).toBe(1);
      });
      it("should do nothing with bad input", ()=> {
        var ev:string = 'event';
        obj.once(ev);
        obj.trigger(ev);
        expect(count).toBe(0);
      });
    });

    describe('trigger', ()=> {
      it("should support any number of arguments", ()=> {
        var ev:string = 'event';
        var expectArgs:number = -1;

        function cb() {
          expect(expectArgs).toBeGreaterThan(-1);
          expect(arguments.length).toBe(expectArgs);
        }

        obj.on(ev, cb);
        var i:number = 0;
        for (; i < 10; i++) {
          expectArgs = i;
          var values = new Array(i);
          for (var j:number = 0; j < values.length; j++) {
            values[j] = j;
          }
          values.unshift(ev);
          obj.trigger.apply(obj, values);
        }
      });

      it("should support multiple event names", ()=> {
        var ev:string = 'event';
        obj.on(ev, cb);
        obj.trigger('event event');
        expect(count).toBe(2);
      });

    });

  });
}
