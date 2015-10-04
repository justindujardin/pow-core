
import {Events} from "pow-core/events";
import {IProcessObject} from "pow-core/time";
import {Time} from "pow-core/time";
declare var _:any;

class MockTimeObject extends Events implements IProcessObject {
  _uid:string = _.uniqueId('p');

  tick(elapsed:number) {
    this.trigger('tick');
  }
}

export function main() {

  describe("Time", ()=> {
    it("should be defined", ()=> {
      expect(Time).toBeDefined();
    });

    it("should expose a static instance for shared use", ()=> {
      var t:Time = Time.get();
      expect(t.polyFillAnimationFrames).toBeDefined();
    });

    describe('addObject', ()=> {
      it('should generate unique id if _uid is not an object property', ()=> {
        var obj:any = {};
        var t:Time = Time.get();
        t.addObject(obj);
        expect(obj._uid).toBeDefined();
        expect(typeof obj._uid).toBe('string');
      });
    });

    function setupTimeCounter(time:Time):any {
      var counter = {
        ticks: 0,
        frames: 0,
        tick: function () {
          counter.ticks++;
        },
        processFrame: function () {
          counter.frames++;
        }
      };
      time.addObject(counter);
      return counter;
    }

    describe('start', () => {
      it('should start tick/processFrame loop', (done)=> {
        var time = new Time();
        var counter = setupTimeCounter(time);
        expect(counter.ticks).toBe(0);
        expect(counter.frames).toBe(0);
        time.start();
        time.start();
        _.delay(()=> {
          expect(counter.ticks).toBeGreaterThan(0);
          expect(counter.frames).toBeGreaterThan(0);
          time.removeObject(counter);
          time.stop();
          done();
        }, 50);
      });
    });

    describe('stop', () => {
      it('should stop tick/processFrame loop', (done)=> {
        var time = new Time();
        var counter = setupTimeCounter(time);
        time.start();
        _.defer(()=> {
          time.stop();
          var ticks = counter.ticks;
          var frames = counter.frames;
          _.delay(()=> {
            expect(counter.ticks).toBe(ticks);
            expect(counter.frames).toBe(frames);
            time.removeObject(counter);
            time.stop();
            done();
          }, 50);
        });
      });
    });

    describe('polyFillAnimationFrames', () => {
      it('should trigger time updates with polyfill and setInterval', function (done) {
        var olds:any = {
          requestAnimationFrame: window.requestAnimationFrame
        };
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var i = 0; i < vendors.length; i++) {
          olds = window[vendors[i] + 'RequestAnimationFrame'];
          window[vendors[i] + 'RequestAnimationFrame'] = null;
        }
        window.requestAnimationFrame = null;

        var t:Time = new Time();
        var m:MockTimeObject = new MockTimeObject();
        t.addObject(m);
        m.once('tick', ()=> {
          t.stop();
          t.removeObject(m);
          expect(window.requestAnimationFrame).toBeDefined();
          _.each(olds, (value, key:any) => {
            window[key] = value;
          });
          done();
        });
        t.start();
      });

    });

    var functions = [
      'webkitRequestAnimationFrame',
      'mozRequestAnimationFrame'
    ];
    functions.forEach(function (fnName) {
      var w:any = window;
      if (!w[fnName]) {
        return;
      }
      it('should apply polyfill if not present on window', function () {
        var oldRaf:any = w.requestAnimationFrame;
        var oldVendorRaf:any = w[fnName];

        w.requestAnimationFrame = null;
        w[fnName] = null;

        new Time();
        expect(window.requestAnimationFrame).toBeDefined();

        w.requestAnimationFrame = oldRaf;
        w[fnName] = oldVendorRaf;
      });
      it('should be patched as requestAnimationFrame if present on window', function () {
        if (window.hasOwnProperty(fnName)) {
          var oldRaf:any = w.requestAnimationFrame;
          w.requestAnimationFrame = null;
          new Time();
          expect(window.requestAnimationFrame).toBeDefined();
          w.requestAnimationFrame = oldRaf;
        }
      });
    });
  });
}
