///<reference path="../types/jasmine.d.ts"/>

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12 * 1000;

export function NamespaceClassToType(fullTypeName:string):any {
  if (!fullTypeName) {
    return null;
  }
  var parts:string[] = fullTypeName.split(".");
  for (var i = 0, len = parts.length, obj = window; i < len; ++i) {
    obj = obj[parts[i]];
    if (!obj) {
      return null;
    }
  }
  return obj;
}

export function BasicClassSanityChecks(fullTypeName:string) {
  it("should be defined", ()=> {
    expect(NamespaceClassToType(fullTypeName)).not.toBeNull();
  });
}
