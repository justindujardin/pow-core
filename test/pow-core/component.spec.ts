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

    it('returns a human readable class from toString()', () => {
      var c = new NamedComponent();
      expect(c.toString()).toBe('NamedComponent');
    });

  });
}
