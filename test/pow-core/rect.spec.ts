
import * as errors from "pow-core/errors";
import {Rect} from "pow-core/rect";
import {Point} from "pow-core/point";

export function main() {
  describe("Rect", ()=> {
    it("should be defined", ()=> {
      expect(Rect).toBeDefined();
    });

    describe('constructor', ()=> {
      it("should initialize to 0,0,1,1 without arguments", ()=> {
        var r1:Rect = new Rect();
        expect(r1.point.x).toBe(0);
        expect(r1.point.y).toBe(0);
        expect(r1.extent.x).toBe(1);
        expect(r1.extent.y).toBe(1);
      });
      it("should initialize from another rect instance", ()=> {
        var r1:Rect = new Rect(15, 15, 0, 0);
        var r2:Rect = new Rect(r1);
        expect(r2.point.x).toBe(15);
        expect(r2.point.y).toBe(15);
        expect(r2.extent.x).toBe(0);
        expect(r2.extent.y).toBe(0);
      });
      it("should initialize from x y width and height as numbers", ()=> {
        var r1:Rect = new Rect(15, 15, 0, 0);
        expect(r1.point.x).toBe(15);
        expect(r1.point.y).toBe(15);
        expect(r1.extent.x).toBe(0);
        expect(r1.extent.y).toBe(0);
      });
      it("should initialize from two points", ()=> {
        var point:Point = new Point(0, 0);
        var extent:Point = new Point(15, 15);
        var r1:Rect = new Rect(point, extent);
        expect(r1.point).toEqual(point);
        expect(r1.extent).toEqual(extent);
      });

      it('should throw error with invalid arguments', ()=> {
        var p:Rect = new Rect();
        expect(() => {
          p.set(<any>'four', <any>10);
        }).toThrow(new Error(errors.INVALID_ARGUMENTS));
      });

    });

    describe('toString', ()=> {
      it('should return "x,y,width,height" as a string', ()=> {
        var p:Rect = new Rect(15.5, 2.3, 1, 1);
        expect(p.toString()).toEqual("15.5,2.3,1,1");
      });
    });

    describe('set', ()=> {
      it("should accept another rect instance as argument", ()=> {
        var r1:Rect = new Rect(15, 15, 0, 0);
        var r2:Rect = new Rect().set(r1);
        expect(r2.point.equal(r1.point));
        expect(r2.extent.equal(r1.extent));
      });
      it("should accept x y width and height numbers as arguments", ()=> {
        var r1:Rect = new Rect().set(15, 15, 0, 0);
        expect(r1.point.x).toBe(15);
        expect(r1.point.y).toBe(15);
        expect(r1.extent.x).toBe(0);
        expect(r1.extent.y).toBe(0);
      });
      it("should accept two points as arguments", ()=> {
        var point:Point = new Point(0, 0);
        var extent:Point = new Point(15, 15);
        var r1:Rect = new Rect().set(point, extent);
        expect(r1.point).toEqual(point);
        expect(r1.extent).toEqual(extent);
      });
    });


    describe('clone', ()=> {
      it('should return a new instance with the identical values', ()=> {
        var r1:Rect = new Rect(2, 2, 2, 2);
        var r2:Rect = r1.clone();
        expect(r1.point).toEqual(r2.point);
        expect(r1.extent).toEqual(r2.extent);
      });
    });

    describe('clip', ()=> {
      it('should clip this to be contained inside the given rectangle', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        var r2:Rect = new Rect(-2, -2, 4, 4);
        var clipped:Rect = r2.clone();

        // Clip the point, adjusting the extent properly
        clipped.clip(r1);
        console.log(clipped.toString());
        expect(clipped.point.equal(new Point(0, 0))).toBeTruthy();
        expect(clipped.extent.equal(new Point(2, 2))).toBeTruthy();
      });
    });

    describe('isValid', ()=> {
      it('should return true when extent is greater than zero', ()=> {
        expect(new Rect(0, 0, -1, -1).isValid()).toBeFalsy();
        expect(new Rect(0, 0, 0, 0).isValid()).toBeFalsy();
        expect(new Rect(0, 0, 1, 1).isValid()).toBeTruthy();
      });
    });

    describe('intersect', ()=> {
      it('should return true if the two rectangles overlap at all', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        var r2:Rect = new Rect(-2, -2, 4, 4);
        var r3:Rect = new Rect(-6, -6, 5, 5);
        expect(r1.intersect(r2)).toBeTruthy();
        expect(r1.intersect(r3)).toBeFalsy();
        expect(r2.intersect(r3)).toBeTruthy();
      });
    });

    describe('pointInRect', ()=> {
      it('should return true if a point is contained within the rectangle', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        expect(r1.pointInRect(2, 2)).toBeTruthy();
      });

      it('should return false if a point is not contained within the rectangle', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        expect(r1.pointInRect(new Point(-2, -2))).toBeFalsy();
        expect(r1.pointInRect(new Point(12, 12))).toBeFalsy();
      });

      it('should accept another point instance as argument', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        expect(r1.pointInRect(new Point(-2, -2))).toBeFalsy();
      });
      it('should accept x and y as number arguments', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        expect(r1.pointInRect(2, 2)).toBeTruthy();
      });

      it('should throw error with invalid arguments', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        expect(() => {
          r1.pointInRect(<any>'four', <any>10);
        }).toThrow(new Error(errors.INVALID_ARGUMENTS));
      });

    });

    describe('getCenter', ()=> {
      it('should return the center point of the rectangle', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 5);
        expect(r1.getCenter().equal(new Point(5, 2.5))).toBeTruthy();
      });
    });

    describe('setCenter', ()=> {
      it('should set the center point for a rectangle', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        var r2:Rect = r1.clone().setCenter(5, 5);
        expect(r1.point.equal(r2.point)).toBeTruthy();
      });

      it('should accept a point instance as argument', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        // positive 5 + -(10/2) = 0
        r1.setCenter(new Point(5, 5));
        expect(r1.point.isZero()).toBeTruthy();
      });
      it('should accept x and y as number arguments', ()=> {
        var r1:Rect = new Rect(0, 0, 10, 10);
        // Center will mean that 1/2 the width and height must be subtracted to get
        // the new point.  -5 + -(10 / 2) = -10
        r1.setCenter(-5, -5);
        expect(r1.point.equal(new Point(-10, -10))).toBeTruthy();
      });
    });

    describe('getLeft', ()=> {
      it('should return the point of the left edge', ()=> {
        expect(new Rect(5, 5, 5, 5).getLeft()).toBe(5);
      });
    });
    describe('getTop', ()=> {
      it('should return the point of the top edge', ()=> {
        expect(new Rect(5, 5, 5, 5).getTop()).toBe(5);
      });
    });
    describe('getRight', ()=> {
      it('should return the point of the right edge', ()=> {
        expect(new Rect(5, 5, 5, 5).getRight()).toBe(10);
      });
    });
    describe('getBottom', ()=> {
      it('should return the point of the bottom edge', ()=> {
        expect(new Rect(5, 5, 5, 5).getBottom()).toBe(10);
      });
    });

    describe('getHalfSize', ()=> {
      it('should return half of the extent of the rectangle', ()=> {
        expect(new Rect(5, 5, 10, 10).getHalfSize().equal(new Point(5, 5))).toBeTruthy();
        expect(new Rect(0, 0, 9, 9).getHalfSize().equal(new Point(4.5, 4.5))).toBeTruthy();
      });
    });

    describe('addPoint', ()=> {
      it('should expand rectangle to contain point', ()=> {
        var r1:Rect = new Rect(0, 0, 1, 1);
        r1.addPoint(new Point(2, 2));
        expect(r1.extent.equal(new Point(2, 2))).toBeTruthy();
        expect(r1.point.isZero()).toBeTruthy();

        r1.addPoint(new Point(-2, -2));
        expect(r1.extent.equal(new Point(4, 4))).toBeTruthy();
        expect(r1.point.equal(new Point(-2, -2))).toBeTruthy();
      });
    });

    describe('inflate', ()=> {
      it('should expand by the given x and y along each axis in both directions', ()=> {
        var r1:Rect = new Rect(0, 0, 1, 1);
        r1.inflate(2, 2);
        expect(r1.point.equal(new Point(-2, -2))).toBeTruthy();
        expect(r1.extent.equal(new Point(5, 5))).toBeTruthy();
      });
      it('should expand by one unit along each axis in both directions if not specified', ()=> {
        var r1:Rect = new Rect(0, 0, 1, 1);
        r1.inflate();
        expect(r1.point.equal(new Point(-1, -1))).toBeTruthy();
        expect(r1.extent.equal(new Point(3, 3))).toBeTruthy();
      });
    });
  });

}
