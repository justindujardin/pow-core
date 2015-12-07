import {Component} from "pow-core/component";

class NamedComponent extends Component {

}
export function main() {
  describe("Component", ()=> {
    it("is defined", () => expect(Component).toBeDefined());

    it("connectComponent returns true by default", ()=> {
      var c = new Component();
      expect(c.connectComponent()).toBe(true);
    });
    it("disconnectComponent returns true by default", ()=> {
      var c = new Component();
      expect(c.disconnectComponent()).toBe(true);
    });
    it("syncComponent returns true by default", ()=> {
      var c = new Component();
      expect(c.syncComponent()).toBe(true);
    });

    describe('toString', () => {
      it('returns a human readable class', () => {
        var c = new NamedComponent();
        expect(c.toString()).toBe('NamedComponent');
      });

      it('returns a readable class when constructor.name is missing', () => {
        var c:any = new NamedComponent();
        delete c.constructor.name;
        expect(c.toString()).toBe('NamedComponent');
      });

      it('returns instance name when all else fails', () => {
        var c:any = new NamedComponent();
        c.name = 'NamedComponent';
        delete c.constructor.name;
        c.constructor.toString = () => {
          return '';
        };
        expect(c.toString()).toBe('NamedComponent');
      });
    });

  });
}
