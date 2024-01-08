class A {
  static objTemplates = {'arr': [[], a => {a.length = 0}]};
  static classTemplates = {};
  static createTemplate(n, v, r, p) {
    const isClass = /^\s*class\s+/.test(v.toString());
    A[(isClass ? 'class' : 'obj')+'Templates'][n] = isClass ? v : [v, r];
    A[n] = [];
    for (let i = 0; i < p; i++) A[(isClass ? 'class' : 'obj')+'Template'](n);
  }
  static objTemplate(n) {
    if (!A[n].length) {
      let e = {...A.objTemplates[n][0]};
      e.release = () => {
        A.objTemplates[n][1](e);
        A[n].push(e);
      };
      return e;
    } else return A[n].shift();
  }
  static classTemplate(n) {
    if (!A[n].length) {
      let e = new A.classTemplates[n]();
      e.release = () => {
        e.reset();
        A[n].push(e);
      };
      return e;
    } else return A[n].shift();
  }
}
