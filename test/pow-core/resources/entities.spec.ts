import {Component} from "pow-core/component";
import {Entity} from "pow-core/entity";
import * as ee from "pow-core/resources/entities";
import {ResourceLoader} from "pow-core/resourceLoader";
import {EntityContainerResource} from "pow-core/resources/entities";
import * as powtest from '../powTest';

declare var _:any;

class BooleanConstructComponent extends Component {
  constructor(public arg:boolean) {
    super();
  }
}
class BooleanConstructObject extends Entity {
  constructor(public arg:boolean) {
    super();
  }
}

export function main() {
  describe("EntityContainerResource", ()=> {

    var loader:ResourceLoader = new ResourceLoader();
    var factory:EntityContainerResource = null;
    beforeEach((done)=> {
      loader.load('base/test/fixtures/basic.entities', (resource:EntityContainerResource) => {
        factory = resource;
        done();
      });
    });
    afterEach(()=> {
      factory = null;
    });

    describe("createObject", ()=> {
      describe("should validate input names and types", ()=> {
        it("works with exact input type match", ()=> {
          expect(factory.createObject('EntityWithComponentInput', {
            component: new Component()
          })).not.toBeNull();
        });
        it("works with more specific instance type given common ancestor", ()=> {
          expect(factory.createObject('EntityWithComponentInput', {
            component: new BooleanConstructComponent(true)
          })).not.toBeNull();
        });
        it("fails with invalid instance of model input", ()=> {
          expect(factory.createObject('EntityWithComponentInput', {
            component: null
          })).toBeNull();
        });
        it("fails without proper input", ()=> {
          expect(factory.createObject('EntityWithComponentInput')).toBeNull();
          expect(factory.createObject('EntityWithComponentInput', {
            other: null
          })).toBeNull();
        });
      });
      it('should instantiate entity object with constructor arguments', ()=> {
        var entity:BooleanConstructObject = <any>factory.createObject('EntityWithParams', {
          arg: true
        });
        expect(entity.arg).toBe(true);
        entity.destroy();
        entity = <any>factory.createObject('EntityWithParams', {
          arg: false
        });
        expect(entity.arg).toBe(false);
        entity.destroy();
      });
      it('should instantiate components with correct names', ()=> {
        var entity:Entity = factory.createObject('EntityWithComponents');
        expect(entity._components.length).toBe(2);
        expect(entity.findComponentByName('one')).not.toBeNull();
        expect(entity.findComponentByName('two')).not.toBeNull();
        entity.destroy();
      });
      it('should instantiate components with constructor arguments', ()=> {
        var entity:Entity = factory.createObject('ComponentWithParams', {
          arg: true
        });
        var boolComponent = <BooleanConstructComponent>entity.findComponent(BooleanConstructComponent);
        expect(boolComponent).not.toBeNull();
        expect(boolComponent.arg).toBe(true);

        entity.destroy();
        entity = factory.createObject('ComponentWithParams', {
          arg: false
        });
        boolComponent = <BooleanConstructComponent>entity.findComponent(BooleanConstructComponent);
        expect(boolComponent).not.toBeNull();
        expect(boolComponent.arg).toBe(false);
        entity.destroy();
      });
      it("should instantiate components", ()=> {
        var object:Entity = factory.createObject('EntityWithComponents');

        var tpl:any = factory.getTemplate('EntityWithComponents');
        expect(tpl).not.toBeNull();

        // Check that we can find instantiated components of the type specified in the template.
        _.each(tpl.components, (comp:any)=> {
          expect(object.findComponent(powtest.NamespaceClassToType(comp.type))).not.toBeNull();
        });
      });

    });

    describe('validateTemplate', ()=> {
      describe("should validate input names and types", ()=> {
        it("works with exact input type match", ()=> {
          var tpl:any = factory.getTemplate('EntityWithComponentInput');
          expect(factory.validateTemplate(tpl, {
            component: new Component()
          })).toBe(ee.EntityError.NONE);
        });
        it("works with more specific instance type given common ancestor", ()=> {
          var tpl:any = factory.getTemplate('EntityWithComponentInput');
          expect(factory.validateTemplate(tpl, {
            component: new BooleanConstructComponent(true)
          })).toBe(ee.EntityError.NONE);

        });
        it("fail with invalid instance of model input", ()=> {
          var tpl:any = factory.getTemplate('EntityWithComponentInput');
          expect(factory.validateTemplate(tpl, {
            component: null
          })).toBe(ee.EntityError.INPUT_TYPE);

        });
        it("fail without proper input", ()=> {
          var tpl:any = factory.getTemplate('EntityWithComponentInput');
          expect(factory.validateTemplate(tpl)).toBe(ee.EntityError.INPUT_NAME);
          expect(factory.validateTemplate(tpl, {
            other: null
          })).toBe(ee.EntityError.INPUT_NAME);
        });
      });

    });
  });

}
