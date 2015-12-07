import {Component} from "pow-core/component";
import {Entity} from "pow-core/entity";
import * as ee from "pow-core/resources/entities";
import {ResourceLoader} from "pow-core/resourceLoader";
import {EntityContainerResource} from "pow-core/resources/entities";
import * as powtest from '../powTest';

declare var _:any;

export class BooleanConstructComponent extends Component {
  constructor(public arg:boolean) {
    super();
  }
}
export class BooleanConstructObject extends Entity {
  constructor(public arg:boolean) {
    super();
  }
}

export function main() {
  describe("EntityContainerResource", ()=> {

    var factory:EntityContainerResource = null;
    beforeEach((done)=> {
      new EntityContainerResource()
        .fetch('/base/test/fixtures/basic.entities')
        .then((resource:EntityContainerResource) => {
          factory = resource;
          done();
        }).catch(console.error.bind(console));
    });
    afterEach(()=> {
      factory = null;
    });

    describe("createObject", ()=> {
      describe("validates input names and types", ()=> {
        it("works with exact input type match", (done)=> {
          factory
            .createObject('EntityWithComponentInput', {component: new Component()})
            .then(() => done())
            .catch(console.error.bind(console));
        });
        it("works with more specific instance type given common ancestor", (done)=> {
          factory
            .createObject('EntityWithComponentInput', {component: new BooleanConstructComponent(true)})
            .then(() => done())
            .catch(console.error.bind(console));
        });
        it("fails with invalid instance of model input", (done)=> {
          factory
            .createObject('EntityWithComponentInput', {component: null})
            .catch(() => done())
            .catch(console.error.bind(console));
        });
        it("fails with missing input", (done)=> {
          factory
            .createObject('EntityWithComponentInput')
            .catch(() => done())
            .catch(console.error.bind(console));
        });
        it("fails with improper key input", (done)=> {
          factory
            .createObject('EntityWithComponentInput', {other: null})
            .catch(() => done())
            .catch(console.error.bind(console));
        });
      });
      it('should instantiate entity object with constructor arguments', (done)=> {
        factory
          .createObject('EntityWithParams', {arg: true})
          .then((entity:BooleanConstructObject) => {
            expect(entity.arg).toBe(true);
            entity.destroy();

            done();
          })
          .catch((e) => {
            console.error(e);
          });
      });
      it('should instantiate components with correct names', (done)=> {
        factory
          .createObject('EntityWithComponents')
          .then((entity:Entity)=> {
            expect(entity._components.length).toBe(2);
            expect(entity.findComponentByName('one')).not.toBeNull();
            expect(entity.findComponentByName('two')).not.toBeNull();
            entity.destroy();
            done();
          });
      });
      it('should instantiate components with constructor arguments', (done)=> {
        factory
          .createObject('ComponentWithParams', {arg: true})
          .then((entity:Entity) => {
            var boolComponent = <BooleanConstructComponent>entity.findComponent(BooleanConstructComponent);
            expect(boolComponent).not.toBeNull();
            expect(boolComponent.arg).toBe(true);
            entity.destroy();
            done();
          }).catch(console.error.bind(console));
      });
      it('should instantiate components with constructor arguments', (done)=> {
        factory
          .createObject('ComponentWithParams', {arg: false})
          .then((entity:Entity) => {
            var boolComponent = <BooleanConstructComponent>entity.findComponent(BooleanConstructComponent);
            expect(boolComponent).not.toBeNull();
            expect(boolComponent.arg).toBe(false);
            entity.destroy();
            done();
          }).catch(console.error.bind(console));
      });
      it("should instantiate components", (done)=> {
        factory
          .createObject('EntityWithComponents')
          .then((object:Entity) => {
            var tpl = factory.getTemplate('EntityWithComponents');
            expect(tpl).not.toBeNull();
            expect(object._components.length).toBe(tpl.components.length);
            done();
          });

      });

    });

    describe('validateTemplate', ()=> {
      describe("checks input names/types", ()=> {
        it("and works with exact input type match", (done)=> {
          var tpl = factory.getTemplate('EntityWithComponentInput');
          factory.validateTemplate(tpl, {
            component: new Component()
          }).then(() => done());
        });
        it("and works with more specific instance type given common ancestor", (done)=> {
          var tpl = factory.getTemplate('EntityWithComponentInput');
          factory
            .validateTemplate(tpl, {component: new BooleanConstructComponent(true)})
            .then(() => done());

        });
        it("and fails with invalid instance of model input", (done)=> {
          var tpl = factory.getTemplate('EntityWithComponentInput');
          factory
            .validateTemplate(tpl, {component: null})
            .catch((e) => {
              expect(e).toBe(ee.EntityError.INPUT_TYPE);
              done();
            });

        });
        it("and fails without proper input", (done)=> {
          var tpl = factory.getTemplate('EntityWithComponentInput');
          factory.validateTemplate(tpl).catch((e) => {
            expect(e).toBe(ee.EntityError.INPUT_NAME);
            done();
          });
        });
        it("and fails without proper input", (done)=> {
          var tpl = factory.getTemplate('EntityWithComponentInput');
          factory.validateTemplate(tpl, {
            other: null
          }).catch((e) => {
            expect(e).toBe(ee.EntityError.INPUT_NAME);
            done();
          });
        });
      });

    });
  });

}
