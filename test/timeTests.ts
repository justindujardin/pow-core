///<reference path="../types/jasmine.d.ts"/>
///<reference path="../lib/pow-core.d.ts"/>

class MockTimeObject extends pow2.Events implements pow2.IProcessObject {
  _uid:string = _.uniqueId('p');

  tick(elapsed:number) {
    this.trigger('tick');
  }
}

describe("pow2.Time", ()=> {
  it("should be defined", ()=> {
    expect(pow2.Time).toBeDefined();
  });

  it("should expose a static instance for shared use", ()=> {
    var t:pow2.Time = pow2.Time.get();
    expect(t.polyFillAnimationFrames).toBeDefined();
  });

  describe('addObject', ()=> {
    it('should generate unique id if _uid is not an object property', ()=> {
      var obj:any = {};
      var t:pow2.Time = pow2.Time.get();
      t.addObject(obj);
      expect(obj._uid).toBeDefined();
      expect(typeof obj._uid).toBe('string');
    });
  });

  function setupTimeCounter(time:pow2.Time):any {
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
      var time = new pow2.Time();
      var counter = setupTimeCounter(time);
      expect(counter.ticks).toBe(0);
      expect(counter.frames).toBe(0);
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
      var time = new pow2.Time();
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

  it("should poly-fill requestAnimationFrame in legacy browsers", (done)=> {
    var olds:{
      [key:string]:any
    } = {
      'requestAnimationFrame': window.requestAnimationFrame
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
    m.once('tick', ()=> {
      t.stop();
      t.removeObject(m);
      expect(window.requestAnimationFrame).toBeDefined();
      _.each(olds, (value, key)=> {
        window[key] = value;
      });
      done();
    });
    t.start();
  });

});