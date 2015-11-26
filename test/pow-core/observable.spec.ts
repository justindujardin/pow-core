
import {Observable,ISubscription,IGenerator} from 'pow-core/observable';

export function main() {
  describe('obs', () => {

    describe('IObservable', () => {

      describe('subscribe', () => {

        it('should add listener to list', () => {
          var o:any = new Observable<void>();
          expect(o._listeners.length).toBe(0);
          o.subscribe({});
          expect(o._listeners.length).toBe(1);
        });

        it('should return a subscription with an unsubscribe method', () => {
          var o:any = new Observable<void>();
          var s:ISubscription = o.subscribe({});
          expect(s.unsubscribe).toBeDefined();
        });

        it('should return null if required generator argument is missing', () => {
          var o:any = new Observable<void>();
          expect(o.subscribe(null)).toBeNull();
        });

        it('should return null if required generator argument is not an object', () => {
          var o:any = new Observable<void>();
          expect(o.subscribe([])).toBeNull();
          expect(o.subscribe("notanobject")).toBeNull();
        });

      });
    });
    describe('ISubscription', () => {

      describe('unsubscribe', () => {

        it('should remove a listener from the obs when unsubscribe is called', () => {
          var o:any = new Observable<void>();
          var generator:IGenerator<void> = {};
          o.subscribe({});
          var s:ISubscription = o.subscribe(generator);
          expect(o._listeners.length).toBe(2);
          expect(s.unsubscribe).toBeDefined();
          s.unsubscribe();
          expect(o._listeners.length).toBe(1);
        });

        it('should have no side effects when called multiple times', () => {
          var o:any = new Observable<void>();
          var s:ISubscription = o.subscribe({});
          s.unsubscribe();
          s.unsubscribe();
        });

      });
    });

    describe('IGenerator', () => {
      function expectNotCalledAfterUnsubscribe(operation:string) {
        var count:number = 0;
        var o:any = new Observable<void>();
        var generator:any = {};
        generator[operation] = (value?:void):any => count++;
        var subscription:ISubscription = o.subscribe(generator);
        o[operation]();
        expect(count).toBe(1);
        subscription.unsubscribe();
        o[operation]();
        expect(count).toBe(1);
      }

      function expectUnsubscribeOnDoneTrue(operation:string) {
        var o:any = new Observable<void>();
        var generator:any = {};
        generator[operation] = (value?:void):any => {
          return {
            done: true
          };
        };
        o.subscribe(generator);
        expect(o._listeners.length).toBe(1);
        o[operation]();
        expect(o._listeners.length).toBe(0);
      }

      function expectThrowOnCallbackThrow(operation:string) {
        var called:boolean = false;
        var o:any = new Observable<void>();
        var e = new Error('Test Error');
        var generator:any = {
          throw: (error:string) => {
            expect(error).toBe(e);
            called = true;
          }
        };
        generator[operation] = (value?:any):any => {
          throw e;
        };
        o.subscribe(generator);
        o[operation]();
        expect(called).toBe(operation !== 'throw');
      }

      function expectNoThrowOnMissing(operation:string) {
        var o:any = new Observable();
        var count = 0;
        if (operation !== 'throw') {
          o.subscribe({
            throw: (e:any) => count++
          });
          o[operation]();
          expect(count).toBe(0);
        }
        else {
          o.subscribe({});
          o.subscribe({
            throw: (e:any) => expect(e).toBe('foo')
          });
          o[operation]('foo');
        }
      }

      describe('next', () => {
        it('must never be called after the unsubscribe method of subscription has been called', () => {
          expectNotCalledAfterUnsubscribe('next');
        });
        it('should unsubscribe if an object {done:true} is returned from handler', () => {
          expectUnsubscribeOnDoneTrue('next');
        });
        it('errors thrown during execution are reported to a generator with throw method defined', () => {
          expectThrowOnCallbackThrow('next');
        });
        it('should not throw an error if a generator does not define the method', () => {
          expectNoThrowOnMissing('next');
        });
      });
      describe('throw', () => {
        it('must never be called after the unsubscribe method of subscription has been called', () => {
          expectNotCalledAfterUnsubscribe('throw');
        });
        it('should unsubscribe if an object {done:true} is returned from handler', () => {
          expectUnsubscribeOnDoneTrue('throw');
        });
        it('errors thrown during execution are reported to a generator with throw method defined', () => {
          expectThrowOnCallbackThrow('throw');
        });
        it('should not throw an error if a generator does not define the method', () => {
          expectNoThrowOnMissing('throw');
        });
      });
      describe('return', () => {
        it('must never be called after the unsubscribe method of subscription has been called', () => {
          expectNotCalledAfterUnsubscribe('return');
        });
        it('should unsubscribe if an object {done:true} is returned from handler', () => {
          expectUnsubscribeOnDoneTrue('return');
        });
        it('errors thrown during execution are reported to a generator with throw method defined', () => {
          expectThrowOnCallbackThrow('return');
        });
        it('should not throw an error if a generator does not define the method', () => {
          expectNoThrowOnMissing('return');
        });
      });
    });
  });

// --- Examples

  describe('examples', () => {

    it('should work for game trigger objects with enter/leave observables', (done) => {
      // Construct a kind of rube goldberg test that follows a player into
      // and back out of a pseudo-game-trigger object by listening
      // to the exposed enter/leave observables of the trigger.

      var player:string = 'this would really be a game object of some type';

      // 1) A trigger-like object that the game will call doEnter/doLeave on.
      var trigger:any = {
        enter: new Observable<void>(),
        leave: new Observable<void>(),
        doEnter: (obj:string) => trigger.enter.next(obj),
        doLeave: (obj:string) => trigger.leave.next(obj),
        destroy: () => {

          // 8) Cleanup observables to let them know the object will no longer
          //    emit any events, and complete the test.
          trigger.enter.return();
          trigger.leave.return();
          expect(returnedEmitters).toBe(2);
          done();
        }
      };

      // 2) Track the number of calls to the `return` method on our
      //    observable generators.  Expect that it will be 2 by the
      //    time we're done, one each for enter/leave observables.
      var returnedEmitters:number = 0;

      // 3) Some other piece of code (maybe the UI) wants to know when
      //    a player enters this particular trigger.  So it subscribe's
      //    to the `enter` observable.
      trigger.enter.subscribe({
        next: (value:string) => {

          // 6) Expect our test player and make it leave.
          expect(value).toBe(player);
          trigger.doLeave(player);
        },
        return: () => returnedEmitters++
      });

      // 4) Yet another piece of code wants to know about when the player
      //    leaves the trigger.  It subscribes to the `leave` observable.
      trigger.leave.subscribe({
        next: (value:string) => {

          // 7) Okay, the player leave event works, now destroy the
          //    whole thing and make sure that the `return` events
          //    were generated.
          expect(value).toBe(player);
          trigger.destroy();
        },
        return: () => returnedEmitters++
      });

      // 5) Set it in motion by entering the player into our trigger.
      trigger.doEnter(player);
    });

  });
}
