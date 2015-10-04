
import {TiledTSXResource} from "pow-core/resources/tiled/tiledTsx";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";
import * as tiled from "pow-core/resources/tiled/tiled";
export function main() {
  describe("TiledTSXResource", ()=> {
    it("should be defined", ()=> {
      expect(TiledTSXResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTSXResource>('base/test/fixtures/example.tsx');
      resource.on(Resource.READY, ()=> {
        expect(resource.name).toBe('example');
        done();
      });
    });
    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTSXResource>('bad/does/not/exist.tsx');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });
    it("should fail with missing image source", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTSXResource>('base/test/fixtures/badImage.tsx');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });

    describe('getTileMeta', ()=> {
      it("should return metadata about a tile by global id", (done)=> {
        var loader:ResourceLoader = new ResourceLoader();
        var resource = loader.load<TiledTSXResource>('base/test/fixtures/example.tsx');
        resource.on(Resource.READY, ()=> {
          var meta:tiled.ITileInstanceMeta = resource.getTileMeta(1);
          expect(meta).not.toBeNull();
          expect(meta.url).toContain('vezu.png');
          done();
        });
      });
    });
  });
}
