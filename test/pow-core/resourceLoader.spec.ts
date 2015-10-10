import {errors} from "pow-core/errors";
import {Resource} from "pow-core/resource";
import {ResourceLoader} from "pow-core/resourceLoader";
import {IResource} from "pow-core/resource";
import {World} from "pow-core/world";
declare var _:any;

class MockResource extends Resource {
  public shouldFail:boolean = false;

  load() {
    _.defer(()=> {
      this.shouldFail ? this.failed(null) : this.ready();
    });
  }
}
class FailResource extends Resource {
  load() {
    _.defer(() => this.failed(null));
  }
}
export function main() {
  describe("ResourceLoader", ()=> {
    it("should be defined and instantiable", ()=> {
      expect(ResourceLoader).toBeDefined();
      var loader = new ResourceLoader();
      expect(loader).not.toBeNull();
    });

    it("should be accessible as a shared singleton", ()=> {
      // Twice to hit cached value branch
      expect(ResourceLoader.get()).toBeDefined();
      expect(ResourceLoader.get()).toBeDefined();
    });

    describe('create', () => {
      it("should throw error if create is called with invalid args", ()=> {
        var loader = new ResourceLoader();
        expect(()=> {
          loader.create(<any>"this isn't a constructor", null);
        }).toThrow(new Error(errors.INVALID_ARGUMENTS));
      });

      it("should trigger Resource.READY event when resource loads properly", (done)=> {
        var loader = new ResourceLoader();
        var resource = loader.create<MockResource>(MockResource, true);
        resource.shouldFail = false;
        resource.on(Resource.READY, ()=> {
          expect(resource.shouldFail).toBe(false);
          done();
        });
        resource.load();
      });

      it("should trigger Resource.FAILED event when resource fails to load", (done)=> {
        var loader = new ResourceLoader();
        var resource = loader.create<MockResource>(MockResource, true);
        resource.shouldFail = true;
        resource.on(Resource.FAILED, ()=> {
          expect(resource.shouldFail).toBe(true);
          done();
        });
        resource.load();
      });
    });


    describe('loadAsType', () => {
      it("should allow specifying resource type explicitly", (done)=> {
        var loader = new ResourceLoader();
        var resource = loader.loadAsType<MockResource>("something", MockResource, ()=> {
          expect(resource.shouldFail).toBeFalsy();
          done();
        });
      });
    });


    describe('load', () => {
      it("should fail with unknown resource type", ()=> {
        var loader = new ResourceLoader();
        var resource = loader.load<MockResource>("something.unknown");
        expect(resource).toBe(null);
      });
      it("should cache loaded resources", (done)=> {
        var loader = new ResourceLoader();
        loader.registerType('mock', MockResource);
        var resource:any = loader.load('made-up.mock', ()=> {
          resource._marked = 1337;
          // Ensure the same resource is returned, indicating that it
          // was retrieved from the cache.
          loader.load('made-up.mock', (res:IResource)=> {
            expect((<any>res)._marked).toBe(1337);
            done();
          });
        });
      });

      it("should load an array of resources", (done)=> {
        var loader = new ResourceLoader();
        loader.registerType('mock', MockResource);
        var resources = loader.load<MockResource[]>(['made-up.mock', 'two.mock'], ()=> {
          done();
        });
        expect(resources.length).toBe(2);
      });


      it("should work with world time updates", (done) => {
        var loader = new ResourceLoader();
        var world = new World();
        world.time.start();
        world.mark(loader);
        loader.registerType('mock', MockResource);
        loader.load<MockResource>('made-up.mock', () => {
          loader.loadAsType('made-up.mock', MockResource, () => {
            world.erase(loader);
            done();
          });
        });
      });
    });

    describe('registerType', () => {
      it("should register custom types", (done)=> {
        var loader = new ResourceLoader();
        loader.registerType('mock', MockResource);
        var resource = <MockResource>loader.load('made-up.mock');
        resource.on(Resource.READY, done);
      });
    });

    describe('getResourceExtension', () => {
      it("should return file extensions for a given url", ()=> {
        var loader = new ResourceLoader();
        var expectations:[string,string][] = [
          ['png', 'foo.png'],
          ['png', 'http://www.website.com/foo.png'],
          ['', 'http://www.website.com/foo'],
          ['', 'foo/bar']
        ];
        for (var i:number = 0; i < expectations.length; i++) {
          var tuple:[string,string] = expectations[i];
          expect(loader.getResourceExtension(tuple[1])).toBe(tuple[0]);
        }
      });
    });

  });
}
