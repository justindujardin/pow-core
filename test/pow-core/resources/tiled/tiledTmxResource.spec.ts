import {TiledTMXResource} from "pow-core/resources/tiled/tiledTmx";
import * as tiled from "pow-core/resources/tiled/tiled";
import {ResourceLoader} from "pow-core/resourceLoader";
import {Resource} from "pow-core/resource";
declare var $:any;

export function main() {
  describe("TiledTMXResource", ()=> {
    it("should be defined", ()=> {
      expect(TiledTMXResource).toBeDefined();
    });

    it("should succeed with good url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/example.tmx');
      resource.on(Resource.READY, ()=> {
        var tileSize:number = 16;
        expect(resource.height).toBe(4);
        expect(resource.width).toBe(4);
        expect(resource.tilewidth).toBe(tileSize);
        expect(resource.tileheight).toBe(tileSize);
        expect(resource.layers.length).toBe(2);
        done();
      });
    });

    it("should keep reference to original xml elements", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/example.tmx');
      resource.on(Resource.READY, ()=> {
        expect(resource.layers.length).toBe(2);
        done();
      });
    });

    it("should extract layer data from map", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/example.tmx');
      resource.on(Resource.READY, ()=> {
        var layer:tiled.ITiledLayer = resource.layers[0];
        expect(layer.name).toBe("TestLayer");
        done();
      });
    });

    it("should extract objectgroup data from map", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/example.tmx');
      resource.on(Resource.READY, ()=> {
        var objectLayer:tiled.ITiledLayer = resource.layers[1];
        expect(objectLayer.objects.length).toBe(2);
        expect(objectLayer.color).toBe('#000000');
        var object:tiled.ITiledObject = objectLayer.objects[0];
        expect(object.properties).toBeDefined();
        expect(object.properties.result).toBe("OK");
        expect(object.name).toBe("example");
        done();
      });
    });

    it("should serialize to xml with same data as when loaded", (done)=> {
      // Load the example file, serialize to XML and reload a new resource with the
      // data.  Compare the two loaded resource properties as expected.
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/example.tmx');
      resource.on(Resource.READY, ()=> {
        // Ensure sane data to compare.
        var l1:tiled.ITiledLayer = resource.layers[1];
        var o1:tiled.ITiledObject = l1.objects[0];

        expect(l1.color).toBe('#000000');
        expect(o1.properties).toBeDefined();
        expect(o1.properties.result).toBe("OK");
        expect(o1.name).toBe("example");
        expect(o1.type).toBe("box");


        // Serialize as an XML string, and deserialize into object form.
        // Test this rather than XML string comparisons to be less fragile.
        var xml = $(resource.write());
        var clone:TiledTMXResource = loader.create<TiledTMXResource>(TiledTMXResource, xml);
        // Have to set the URL because TMX relies on knowing its location to construct
        // relative paths to tile set and image sources.
        clone.url = 'base/test/fixtures/example.tmx';
        clone.on(Resource.READY, ()=> {
          // Layer data
          expect(clone.layers[0].data).toEqual(resource.layers[0].data);

          // Object layer comparisons
          var l2:tiled.ITiledLayer = clone.layers[1];
          var o2:tiled.ITiledObject = l2.objects[0];

          expect(l1.objects.length).toBe(l2.objects.length);
          expect(l1.color).toBe(l2.color);

          expect(o2.properties).toBeDefined();
          expect(o2.properties.result).toBe(o1.properties.result);
          expect(o2.name).toBe(o1.name);
          expect(o2.type).toBe(o1.type);

          done();
        });
        clone.prepare(xml);
      });
    });

    it("should fail with bad url", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('bad/does/not/exist.tmx');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });

    it("should fail with missing image source", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/badImage.tmx');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });

    it("should fail with non-csv encoded layer data", (done)=> {
      var loader:ResourceLoader = new ResourceLoader();
      var resource = loader.load<TiledTMXResource>('base/test/fixtures/badEncoding.tmx');
      resource.on(Resource.FAILED, ()=> {
        done();
      });
    });


  });
}
