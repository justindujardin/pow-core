import {errors} from "pow-core/errors";
import {Resource} from "pow-core/resource";
import {ResourceLoader} from "pow-core/resourceLoader";
import {IResource} from "pow-core/resource";
import {World} from "pow-core/world";

declare var _:any;

class MockResource extends Resource {
  load(data?:boolean):Promise<MockResource> {
    return new Promise((resolve, reject) => {
      data ? reject('false') : resolve();
    });
  }
  fetch(shouldFailAsString?:string):Promise<MockResource> {
    return new Promise((resolve, reject) => {
      !!shouldFailAsString ? reject('false') : resolve();
    });
  }
}

export function main() {
  describe("ResourceLoader", ()=> {
    it("should be defined and instantiable", ()=> {
      expect(ResourceLoader).toBeDefined();
      var loader = new ResourceLoader();
      expect(loader).not.toBeNull();
    });

    describe('create', () => {
      it("should throw error if create is called with invalid args", ()=> {
        var loader = new ResourceLoader();
        expect(()=> {
          loader.create(<any>"this isn't a constructor", null);
        }).toThrow(new Error(errors.INVALID_ARGUMENTS));
      });

      it("should resolve promise when resource loads properly", (done)=> {
        new ResourceLoader()
          .create<MockResource>(MockResource)
          .load(false)
          .then(() => done());
      });

      it("should reject promise when resource fails to load", (done)=> {
        new ResourceLoader()
          .create<MockResource>(MockResource)
          .load(true)
          .catch(() => done());
      });
    });


    describe('loadAsType', () => {
      it("should allow specifying resource type explicitly", (done)=> {
        new ResourceLoader()
          .loadAsType<MockResource>("something", MockResource)
          .catch(console.error.bind(console))
          .then(() => done());
      });
      it("should reject with error if not given a source", (done)=> {
        new ResourceLoader()
          .loadAsType<MockResource>(null, MockResource)
          .catch(() => done());
      });
      it("should reject with error if not given a type to load as", (done)=> {
        new ResourceLoader()
          .loadAsType<MockResource>("something", null)
          .catch(() => done());
      });
    });


    describe('load', () => {
      it("should fail with unknown resource type", (done)=> {
        var loader = new ResourceLoader();
        loader.load<MockResource>("something.unknown").catch(() => done());
      });
      it("should cache loaded resources", (done)=> {
        var loader = new ResourceLoader();
        loader.registerType('mock', MockResource);
        loader.load('made-up.mock').then((resources:any[])=> {
          resources[0]._marked = 1337;
          // Ensure the same resource is returned, indicating that it
          // was retrieved from the cache.
          loader.load('made-up.mock').then((cachedResources:any[])=> {
            expect(cachedResources[0]._marked).toBe(1337);
            done();
          });
        });
      });

      it("should load an array of resources", (done)=> {
        var loader = new ResourceLoader();
        loader.registerType('mock', MockResource);
        loader
          .load<MockResource[]>(['made-up.mock', 'two.mock'])
          .then((resources:any)=> {
            expect(resources.length).toBe(2);
            done();
          });
      });
    });

    describe('registerType', () => {
      it("should register custom types", (done)=> {
        var loader = new ResourceLoader();
        loader.registerType('mock', MockResource);
        loader.load('made-up.mock').then(() => done());
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
