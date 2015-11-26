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
      new TiledTSXResource()
        .fetch('base/test/fixtures/example.tsx')
        .then((resource:TiledTSXResource) => {
          expect(resource.name).toBe('example');
          done();
        });
    });
    it("should fail with bad url", (done)=> {
      new TiledTSXResource()
        .fetch('bad/does/not/exist.tsx')
        .catch(() => done());
    });
    it("should fail with missing image source", (done)=> {
      new TiledTSXResource()
        .fetch('base/test/fixtures/badImage.tsx')
        .catch(() => done());
    });

    describe('getTileMeta', ()=> {
      it("should return metadata about a tile by global id", (done)=> {
      new TiledTSXResource()
        .fetch('base/test/fixtures/example.tsx')
        .then((resource:TiledTSXResource) => {
          var meta:tiled.ITileInstanceMeta = resource.getTileMeta(1);
          expect(meta).not.toBeNull();
          expect(meta.url).toContain('vezu.png');
          done();
        });
      });
    });
  });
}
