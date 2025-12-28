import { p as dn, a as hn, w as gn } from "../share.js";
import { Z as kn, b as En, c as Pn, f as Sn, i as Mn, l as Wn, m as Un } from "../share.js";
async function hr(F = {}) {
  var H, O, nr, f = F, Qr = !!globalThis.window, re = typeof Bun < "u", gr = !!globalThis.WorkerGlobalScope;
  !((O = globalThis.process) === null || O === void 0 || (O = O.versions) === null || O === void 0) && O.node && ((nr = globalThis.process) === null || nr === void 0 ? void 0 : nr.type) != "renderer";
  var pr = "./this.program", ee, ir = "";
  function te(r) {
    return f.locateFile ? f.locateFile(r, ir) : ir + r;
  }
  var yr, ar;
  if (Qr || gr || re) {
    try {
      ir = new URL(".", ee).href;
    } catch {
    }
    gr && (ar = (r) => {
      var e = new XMLHttpRequest();
      return e.open("GET", r, !1), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response);
    }), yr = async (r) => {
      var e = await fetch(r, {
        credentials: "same-origin"
      });
      if (e.ok)
        return e.arrayBuffer();
      throw new Error(e.status + " : " + e.url);
    };
  }
  var mr = console.log.bind(console), I = console.error.bind(console), x, wr = !1, br, Tr, U, C, q, Z, X, _, Rr, Ar, Fr = !1;
  function Cr() {
    var r = tr.buffer;
    U = new Int8Array(r), q = new Int16Array(r), f.HEAPU8 = C = new Uint8Array(r), Z = new Uint16Array(r), X = new Int32Array(r), _ = new Uint32Array(r), Rr = new Float32Array(r), Ar = new Float64Array(r);
  }
  function ne() {
    if (f.preRun)
      for (typeof f.preRun == "function" && (f.preRun = [f.preRun]); f.preRun.length; )
        de(f.preRun.shift());
    kr(Pr);
  }
  function ie() {
    Fr = !0, G.na();
  }
  function ae() {
    if (f.postRun)
      for (typeof f.postRun == "function" && (f.postRun = [f.postRun]); f.postRun.length; )
        _e(f.postRun.shift());
    kr(Er);
  }
  function or(r) {
    var e, t;
    (e = f.onAbort) === null || e === void 0 || e.call(f, r), r = "Aborted(" + r + ")", I(r), wr = !0, r += ". Build with -sASSERTIONS for more info.";
    var n = new WebAssembly.RuntimeError(r);
    throw (t = Tr) === null || t === void 0 || t(n), n;
  }
  var D;
  function oe() {
    return te("zxing_writer.wasm");
  }
  function se(r) {
    if (r == D && x)
      return new Uint8Array(x);
    if (ar)
      return ar(r);
    throw "both async and sync fetching of the wasm failed";
  }
  async function ue(r) {
    if (!x)
      try {
        var e = await yr(r);
        return new Uint8Array(e);
      } catch {
      }
    return se(r);
  }
  async function fe(r, e) {
    try {
      var t = await ue(r), n = await WebAssembly.instantiate(t, e);
      return n;
    } catch (i) {
      I(`failed to asynchronously prepare wasm: ${i}`), or(i);
    }
  }
  async function ve(r, e, t) {
    if (!r && WebAssembly.instantiateStreaming)
      try {
        var n = fetch(e, {
          credentials: "same-origin"
        }), i = await WebAssembly.instantiateStreaming(n, t);
        return i;
      } catch (a) {
        I(`wasm streaming compile failed: ${a}`), I("falling back to ArrayBuffer instantiation");
      }
    return fe(e, t);
  }
  function ce() {
    var r = {
      a: Bt
    };
    return r;
  }
  async function le() {
    function r(a, o) {
      return G = a.exports, Nt(G), Cr(), G;
    }
    function e(a) {
      return r(a.instance);
    }
    var t = ce();
    if (f.instantiateWasm)
      return new Promise((a, o) => {
        f.instantiateWasm(t, (s, u) => {
          a(r(s));
        });
      });
    D != null || (D = oe());
    var n = await ve(x, D, t), i = e(n);
    return i;
  }
  var kr = (r) => {
    for (; r.length > 0; )
      r.shift()(f);
  }, Er = [], _e = (r) => Er.push(r), Pr = [], de = (r) => Pr.push(r), g = (r) => Zr(r), p = () => Xr(), Y = [], K = 0, he = (r) => {
    var e = new sr(r);
    return e.get_caught() || (e.set_caught(!0), K--), e.set_rethrown(!1), Y.push(e), Lr(r), qr(r);
  }, k = 0, ge = () => {
    d(0, 0);
    var r = Y.pop();
    zr(r.excPtr), k = 0;
  };
  class sr {
    constructor(e) {
      this.excPtr = e, this.ptr = e - 24;
    }
    set_type(e) {
      _[this.ptr + 4 >> 2] = e;
    }
    get_type() {
      return _[this.ptr + 4 >> 2];
    }
    set_destructor(e) {
      _[this.ptr + 8 >> 2] = e;
    }
    get_destructor() {
      return _[this.ptr + 8 >> 2];
    }
    set_caught(e) {
      e = e ? 1 : 0, U[this.ptr + 12] = e;
    }
    get_caught() {
      return U[this.ptr + 12] != 0;
    }
    set_rethrown(e) {
      e = e ? 1 : 0, U[this.ptr + 13] = e;
    }
    get_rethrown() {
      return U[this.ptr + 13] != 0;
    }
    init(e, t) {
      this.set_adjusted_ptr(0), this.set_type(e), this.set_destructor(t);
    }
    set_adjusted_ptr(e) {
      _[this.ptr + 16 >> 2] = e;
    }
    get_adjusted_ptr() {
      return _[this.ptr + 16 >> 2];
    }
  }
  var J = (r) => xr(r), ur = (r) => {
    var e = k;
    if (!e)
      return J(0), 0;
    var t = new sr(e);
    t.set_adjusted_ptr(e);
    var n = t.get_type();
    if (!n)
      return J(0), e;
    for (var i of r) {
      if (i === 0 || i === n)
        break;
      var a = t.ptr + 16;
      if (Gr(i, n, a))
        return J(i), e;
    }
    return J(n), e;
  }, pe = () => ur([]), ye = (r) => ur([r]), me = (r, e) => ur([r, e]), we = () => {
    var r = Y.pop();
    r || or("no exception to throw");
    var e = r.excPtr;
    throw r.get_rethrown() || (Y.push(r), r.set_rethrown(!0), r.set_caught(!1), K++), k = e, k;
  }, be = (r, e, t) => {
    var n = new sr(r);
    throw n.init(e, t), k = r, K++, k;
  }, Te = () => K, Re = (r) => {
    throw k || (k = r), k;
  }, Sr = globalThis.TextDecoder && new TextDecoder(), Mr = (r, e, t, n) => {
    var i = e + t;
    if (n) return i;
    for (; r[e] && !(e >= i); ) ++e;
    return e;
  }, Wr = function(r) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, t = arguments.length > 2 ? arguments[2] : void 0, n = arguments.length > 3 ? arguments[3] : void 0;
    var i = Mr(r, e, t, n);
    if (i - e > 16 && r.buffer && Sr)
      return Sr.decode(r.subarray(e, i));
    for (var a = ""; e < i; ) {
      var o = r[e++];
      if (!(o & 128)) {
        a += String.fromCharCode(o);
        continue;
      }
      var s = r[e++] & 63;
      if ((o & 224) == 192) {
        a += String.fromCharCode((o & 31) << 6 | s);
        continue;
      }
      var u = r[e++] & 63;
      if ((o & 240) == 224 ? o = (o & 15) << 12 | s << 6 | u : o = (o & 7) << 18 | s << 12 | u << 6 | r[e++] & 63, o < 65536)
        a += String.fromCharCode(o);
      else {
        var v = o - 65536;
        a += String.fromCharCode(55296 | v >> 10, 56320 | v & 1023);
      }
    }
    return a;
  }, Ae = (r, e, t) => r ? Wr(C, r, e, t) : "";
  function Fe(r, e, t) {
    return 0;
  }
  function Ce(r, e, t) {
    return 0;
  }
  var ke = (r, e, t) => {
  };
  function Ee(r, e, t, n) {
  }
  var Pe = (r, e) => {
  }, Se = () => or(""), Q = {}, fr = (r) => {
    for (; r.length; ) {
      var e = r.pop(), t = r.pop();
      t(e);
    }
  };
  function rr(r) {
    return this.fromWireType(_[r >> 2]);
  }
  var N = {}, $ = {}, er = {}, Me = class extends Error {
    constructor(e) {
      super(e), this.name = "InternalError";
    }
  }, Ur = (r) => {
    throw new Me(r);
  }, $r = (r, e, t) => {
    r.forEach((s) => er[s] = e);
    function n(s) {
      var u = t(s);
      u.length !== r.length && Ur("Mismatched type converter count");
      for (var v = 0; v < r.length; ++v)
        E(r[v], u[v]);
    }
    var i = new Array(e.length), a = [], o = 0;
    {
      const s = e;
      for (let u = 0; u < s.length; ++u) {
        const v = s[u];
        $.hasOwnProperty(v) ? i[u] = $[v] : (a.push(v), N.hasOwnProperty(v) || (N[v] = []), N[v].push(() => {
          i[u] = $[v], ++o, o === a.length && n(i);
        }));
      }
    }
    a.length === 0 && n(i);
  }, We = (r) => {
    var e = Q[r];
    delete Q[r];
    var t = e.rawConstructor, n = e.rawDestructor, i = e.fields, a = i.map((o) => o.getterReturnType).concat(i.map((o) => o.setterArgumentType));
    $r([r], a, (o) => {
      var s = {};
      {
        const u = i;
        for (let v = 0; v < u.length; ++v) {
          const c = u[v], l = o[v], y = c.getter, b = c.getterContext, S = o[v + i.length], m = c.setter, R = c.setterContext;
          s[c.fieldName] = {
            read: (w) => l.fromWireType(y(b, w)),
            write: (w, dr) => {
              var M = [];
              m(R, w, S.toWireType(M, dr)), fr(M);
            },
            optional: l.optional
          };
        }
      }
      return [{
        name: e.name,
        fromWireType: (u) => {
          var v = {};
          for (var c in s)
            v[c] = s[c].read(u);
          return n(u), v;
        },
        toWireType: (u, v) => {
          for (var c in s)
            if (!(c in v) && !s[c].optional)
              throw new TypeError(`Missing field: "${c}"`);
          var l = t();
          for (c in s)
            s[c].write(l, v[c]);
          return u !== null && u.push(n, l), l;
        },
        readValueFromPointer: rr,
        destructorFunction: n
      }];
    });
  }, Ue = (r, e, t, n, i) => {
  }, T = (r) => {
    for (var e = ""; ; ) {
      var t = C[r++];
      if (!t) return e;
      e += String.fromCharCode(t);
    }
  }, $e = class extends Error {
    constructor(e) {
      super(e), this.name = "BindingError";
    }
  }, A = (r) => {
    throw new $e(r);
  };
  function Ve(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var n = e.name;
    if (r || A(`type "${n}" must have a positive integer typeid pointer`), $.hasOwnProperty(r)) {
      if (t.ignoreDuplicateRegistrations)
        return;
      A(`Cannot register type '${n}' twice`);
    }
    if ($[r] = e, delete er[r], N.hasOwnProperty(r)) {
      var i = N[r];
      delete N[r], i.forEach((a) => a());
    }
  }
  function E(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return Ve(r, e, t);
  }
  var je = (r, e, t, n) => {
    e = T(e), E(r, {
      name: e,
      fromWireType: function(i) {
        return !!i;
      },
      toWireType: function(i, a) {
        return a ? t : n;
      },
      readValueFromPointer: function(i) {
        return this.fromWireType(C[i]);
      },
      destructorFunction: null
    });
  }, Vr = [], V = [0, 1, , 1, null, 1, !0, 1, !1, 1], vr = (r) => {
    r > 9 && --V[r + 1] === 0 && (V[r] = void 0, Vr.push(r));
  }, P = {
    toValue: (r) => (r || A(`Cannot use deleted val. handle = ${r}`), V[r]),
    toHandle: (r) => {
      switch (r) {
        case void 0:
          return 2;
        case null:
          return 4;
        case !0:
          return 6;
        case !1:
          return 8;
        default: {
          const e = Vr.pop() || V.length;
          return V[e] = r, V[e + 1] = 1, e;
        }
      }
    }
  }, Oe = {
    name: "emscripten::val",
    fromWireType: (r) => {
      var e = P.toValue(r);
      return vr(r), e;
    },
    toWireType: (r, e) => P.toHandle(e),
    readValueFromPointer: rr,
    destructorFunction: null
  }, Ie = (r) => E(r, Oe), De = (r, e) => {
    switch (e) {
      case 4:
        return function(t) {
          return this.fromWireType(Rr[t >> 2]);
        };
      case 8:
        return function(t) {
          return this.fromWireType(Ar[t >> 3]);
        };
      default:
        throw new TypeError(`invalid float width (${e}): ${r}`);
    }
  }, Ne = (r, e, t) => {
    e = T(e), E(r, {
      name: e,
      fromWireType: (n) => n,
      toWireType: (n, i) => i,
      readValueFromPointer: De(e, t),
      destructorFunction: null
    });
  }, jr = (r, e) => Object.defineProperty(e, "name", {
    value: r
  });
  function Be(r) {
    for (var e = 1; e < r.length; ++e)
      if (r[e] !== null && r[e].destructorFunction === void 0)
        return !0;
    return !1;
  }
  function He(r, e, t, n, i, a) {
    var o = e.length;
    o < 2 && A("argTypes array size mismatch! Must at least get return value and 'this' types!"), e[1];
    var s = Be(e), u = !e[0].isVoid, v = o - 2, c = new Array(v), l = [], y = [], b = function() {
      y.length = 0;
      var S;
      l.length = 1, l[0] = i;
      for (var m = 0; m < v; ++m)
        c[m] = e[m + 2].toWireType(y, m < 0 || arguments.length <= m ? void 0 : arguments[m]), l.push(c[m]);
      var R = n(...l);
      function w(dr) {
        if (s)
          fr(y);
        else
          for (var M = 2; M < e.length; M++) {
            var _n = M === 1 ? S : c[M - 2];
            e[M].destructorFunction !== null && e[M].destructorFunction(_n);
          }
        if (u)
          return e[0].fromWireType(dr);
      }
      return w(R);
    };
    return jr(r, b);
  }
  var xe = (r, e, t) => {
    if (r[e].overloadTable === void 0) {
      var n = r[e];
      r[e] = function() {
        for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
          a[o] = arguments[o];
        return r[e].overloadTable.hasOwnProperty(a.length) || A(`Function '${t}' called with an invalid number of arguments (${a.length}) - expects one of (${r[e].overloadTable})!`), r[e].overloadTable[a.length].apply(this, a);
      }, r[e].overloadTable = [], r[e].overloadTable[n.argCount] = n;
    }
  }, Ze = (r, e, t) => {
    f.hasOwnProperty(r) ? ((t === void 0 || f[r].overloadTable !== void 0 && f[r].overloadTable[t] !== void 0) && A(`Cannot register public name '${r}' twice`), xe(f, r, r), f[r].overloadTable.hasOwnProperty(t) && A(`Cannot register multiple overloads of a function with the same number of arguments (${t})!`), f[r].overloadTable[t] = e) : (f[r] = e, f[r].argCount = t);
  }, Xe = (r, e) => {
    for (var t = [], n = 0; n < r; n++)
      t.push(_[e + n * 4 >> 2]);
    return t;
  }, ze = (r, e, t) => {
    f.hasOwnProperty(r) || Ur("Replacing nonexistent public symbol"), f[r].overloadTable !== void 0 && t !== void 0 ? f[r].overloadTable[t] = e : (f[r] = e, f[r].argCount = t);
  }, j = {}, Le = (r, e, t) => {
    r = r.replace(/p/g, "i");
    var n = j[r];
    return n(e, ...t);
  }, Or = [], h = (r) => {
    var e = Or[r];
    return e || (Or[r] = e = Kr.get(r)), e;
  }, Ge = function(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (r.includes("j"))
      return Le(r, e, t);
    var n = h(e), i = n(...t);
    function a(o) {
      return o;
    }
    return i;
  }, qe = function(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    return function() {
      for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
        i[a] = arguments[a];
      return Ge(r, e, i, t);
    };
  }, z = function(r, e) {
    r = T(r);
    function t() {
      if (r.includes("j"))
        return qe(r, e);
      var i = h(e);
      return i;
    }
    var n = t();
    return typeof n != "function" && A(`unknown function pointer with signature ${r}: ${e}`), n;
  };
  class Ye extends Error {
  }
  var Ir = (r) => {
    var e = Hr(r), t = T(e);
    return W(e), t;
  }, Ke = (r, e) => {
    var t = [], n = {};
    function i(a) {
      if (!n[a] && !$[a]) {
        if (er[a]) {
          er[a].forEach(i);
          return;
        }
        t.push(a), n[a] = !0;
      }
    }
    throw e.forEach(i), new Ye(`${r}: ` + t.map(Ir).join([", "]));
  }, Je = (r) => {
    r = r.trim();
    const e = r.indexOf("(");
    return e === -1 ? r : r.slice(0, e);
  }, Qe = (r, e, t, n, i, a, o, s) => {
    var u = Xe(e, t);
    r = T(r), r = Je(r), i = z(n, i), Ze(r, function() {
      Ke(`Cannot call ${r} due to unbound types`, u);
    }, e - 1), $r([], u, (v) => {
      var c = [v[0], null].concat(v.slice(1));
      return ze(r, He(r, c, null, i, a), e - 1), [];
    });
  }, rt = (r, e, t) => {
    switch (e) {
      case 1:
        return t ? (n) => U[n] : (n) => C[n];
      case 2:
        return t ? (n) => q[n >> 1] : (n) => Z[n >> 1];
      case 4:
        return t ? (n) => X[n >> 2] : (n) => _[n >> 2];
      default:
        throw new TypeError(`invalid integer width (${e}): ${r}`);
    }
  }, et = (r, e, t, n, i) => {
    e = T(e);
    const a = n === 0;
    let o = (u) => u;
    if (a) {
      var s = 32 - 8 * t;
      o = (u) => u << s >>> s, i = o(i);
    }
    E(r, {
      name: e,
      fromWireType: o,
      toWireType: (u, v) => v,
      readValueFromPointer: rt(e, t, n !== 0),
      destructorFunction: null
    });
  }, tt = (r, e, t) => {
    var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], i = n[e];
    function a(o) {
      var s = _[o >> 2], u = _[o + 4 >> 2];
      return new i(U.buffer, u, s);
    }
    t = T(t), E(r, {
      name: t,
      fromWireType: a,
      readValueFromPointer: a
    }, {
      ignoreDuplicateRegistrations: !0
    });
  }, nt = (r, e, t, n) => {
    if (!(n > 0)) return 0;
    for (var i = t, a = t + n - 1, o = 0; o < r.length; ++o) {
      var s = r.codePointAt(o);
      if (s <= 127) {
        if (t >= a) break;
        e[t++] = s;
      } else if (s <= 2047) {
        if (t + 1 >= a) break;
        e[t++] = 192 | s >> 6, e[t++] = 128 | s & 63;
      } else if (s <= 65535) {
        if (t + 2 >= a) break;
        e[t++] = 224 | s >> 12, e[t++] = 128 | s >> 6 & 63, e[t++] = 128 | s & 63;
      } else {
        if (t + 3 >= a) break;
        e[t++] = 240 | s >> 18, e[t++] = 128 | s >> 12 & 63, e[t++] = 128 | s >> 6 & 63, e[t++] = 128 | s & 63, o++;
      }
    }
    return e[t] = 0, t - i;
  }, B = (r, e, t) => nt(r, C, e, t), Dr = (r) => {
    for (var e = 0, t = 0; t < r.length; ++t) {
      var n = r.charCodeAt(t);
      n <= 127 ? e++ : n <= 2047 ? e += 2 : n >= 55296 && n <= 57343 ? (e += 4, ++t) : e += 3;
    }
    return e;
  }, it = (r, e) => {
    e = T(e), E(r, {
      name: e,
      fromWireType(t) {
        var n = _[t >> 2], i = t + 4, a;
        return a = Ae(i, n, !0), W(t), a;
      },
      toWireType(t, n) {
        n instanceof ArrayBuffer && (n = new Uint8Array(n));
        var i, a = typeof n == "string";
        a || ArrayBuffer.isView(n) && n.BYTES_PER_ELEMENT == 1 || A("Cannot pass non-string to std::string"), a ? i = Dr(n) : i = n.length;
        var o = _r(4 + i + 1), s = o + 4;
        return _[o >> 2] = i, a ? B(n, s, i + 1) : C.set(n, s), t !== null && t.push(W, o), o;
      },
      readValueFromPointer: rr,
      destructorFunction(t) {
        W(t);
      }
    });
  }, Nr = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, at = (r, e, t) => {
    var n = r >> 1, i = Mr(Z, n, e / 2, t);
    if (i - n > 16 && Nr) return Nr.decode(Z.subarray(n, i));
    for (var a = "", o = n; o < i; ++o) {
      var s = Z[o];
      a += String.fromCharCode(s);
    }
    return a;
  }, ot = (r, e, t) => {
    if (t != null || (t = 2147483647), t < 2) return 0;
    t -= 2;
    for (var n = e, i = t < r.length * 2 ? t / 2 : r.length, a = 0; a < i; ++a) {
      var o = r.charCodeAt(a);
      q[e >> 1] = o, e += 2;
    }
    return q[e >> 1] = 0, e - n;
  }, st = (r) => r.length * 2, ut = (r, e, t) => {
    for (var n = "", i = r >> 2, a = 0; !(a >= e / 4); a++) {
      var o = _[i + a];
      if (!o && !t) break;
      n += String.fromCodePoint(o);
    }
    return n;
  }, ft = (r, e, t) => {
    if (t != null || (t = 2147483647), t < 4) return 0;
    for (var n = e, i = n + t - 4, a = 0; a < r.length; ++a) {
      var o = r.codePointAt(a);
      if (o > 65535 && a++, X[e >> 2] = o, e += 4, e + 4 > i) break;
    }
    return X[e >> 2] = 0, e - n;
  }, vt = (r) => {
    for (var e = 0, t = 0; t < r.length; ++t) {
      var n = r.codePointAt(t);
      n > 65535 && t++, e += 4;
    }
    return e;
  }, ct = (r, e, t) => {
    t = T(t);
    var n, i, a;
    e === 2 ? (n = at, i = ot, a = st) : (n = ut, i = ft, a = vt), E(r, {
      name: t,
      fromWireType: (o) => {
        var s = _[o >> 2], u = n(o + 4, s * e, !0);
        return W(o), u;
      },
      toWireType: (o, s) => {
        typeof s != "string" && A(`Cannot pass non-string to C++ string type ${t}`);
        var u = a(s), v = _r(4 + u + e);
        return _[v >> 2] = u / e, i(s, v + 4, u + e), o !== null && o.push(W, v), v;
      },
      readValueFromPointer: rr,
      destructorFunction(o) {
        W(o);
      }
    });
  }, lt = (r, e, t, n, i, a) => {
    Q[r] = {
      name: T(e),
      rawConstructor: z(t, n),
      rawDestructor: z(i, a),
      fields: []
    };
  }, _t = (r, e, t, n, i, a, o, s, u, v) => {
    Q[r].fields.push({
      fieldName: T(e),
      getterReturnType: t,
      getter: z(n, i),
      getterContext: a,
      setterArgumentType: o,
      setter: z(s, u),
      setterContext: v
    });
  }, dt = (r, e) => {
    e = T(e), E(r, {
      isVoid: !0,
      name: e,
      fromWireType: () => {
      },
      toWireType: (t, n) => {
      }
    });
  }, cr = [], ht = (r) => {
    var e = cr.length;
    return cr.push(r), e;
  }, gt = (r, e) => {
    var t = $[r];
    return t === void 0 && A(`${e} has unknown type ${Ir(r)}`), t;
  }, pt = (r, e) => {
    for (var t = new Array(r), n = 0; n < r; ++n)
      t[n] = gt(_[e + n * 4 >> 2], `parameter ${n}`);
    return t;
  }, yt = (r, e, t) => {
    var n = [], i = r(n, t);
    return n.length && (_[e >> 2] = P.toHandle(n)), i;
  }, mt = {}, Br = (r) => {
    var e = mt[r];
    return e === void 0 ? T(r) : e;
  }, wt = (r, e, t) => {
    var n = 8, [i, ...a] = pt(r, e), o = i.toWireType.bind(i), s = a.map((l) => l.readValueFromPointer.bind(l));
    r--;
    var u = new Array(r), v = (l, y, b, S) => {
      for (var m = 0, R = 0; R < r; ++R)
        u[R] = s[R](S + m), m += n;
      var w;
      switch (t) {
        case 0:
          w = P.toValue(l).apply(null, u);
          break;
        case 2:
          w = Reflect.construct(P.toValue(l), u);
          break;
        case 3:
          w = u[0];
          break;
        case 1:
          w = P.toValue(l)[Br(y)](...u);
          break;
      }
      return yt(o, b, w);
    }, c = `methodCaller<(${a.map((l) => l.name)}) => ${i.name}>`;
    return ht(jr(c, v));
  }, bt = (r) => r ? (r = Br(r), P.toHandle(globalThis[r])) : P.toHandle(globalThis), Tt = (r) => {
    r > 9 && (V[r + 1] += 1);
  }, Rt = (r, e, t, n, i) => cr[r](e, t, n, i), At = (r) => {
    var e = P.toValue(r);
    fr(e), vr(r);
  }, Ft = (r, e, t, n) => {
    var i = (/* @__PURE__ */ new Date()).getFullYear(), a = new Date(i, 0, 1), o = new Date(i, 6, 1), s = a.getTimezoneOffset(), u = o.getTimezoneOffset(), v = Math.max(s, u);
    _[r >> 2] = v * 60, X[e >> 2] = +(s != u);
    var c = (b) => {
      var S = b >= 0 ? "-" : "+", m = Math.abs(b), R = String(Math.floor(m / 60)).padStart(2, "0"), w = String(m % 60).padStart(2, "0");
      return `UTC${S}${R}${w}`;
    }, l = c(s), y = c(u);
    u < s ? (B(l, t, 17), B(y, n, 17)) : (B(l, n, 17), B(y, t, 17));
  }, Ct = () => 2147483648, kt = (r, e) => Math.ceil(r / e) * e, Et = (r) => {
    var e = tr.buffer.byteLength, t = (r - e + 65535) / 65536 | 0;
    try {
      return tr.grow(t), Cr(), 1;
    } catch {
    }
  }, Pt = (r) => {
    var e = C.length;
    r >>>= 0;
    var t = Ct();
    if (r > t)
      return !1;
    for (var n = 1; n <= 4; n *= 2) {
      var i = e * (1 + 0.2 / n);
      i = Math.min(i, r + 100663296);
      var a = Math.min(t, kt(Math.max(r, i), 65536)), o = Et(a);
      if (o)
        return !0;
    }
    return !1;
  }, lr = {}, St = () => pr || "./this.program", L = () => {
    if (!L.strings) {
      var r = (typeof navigator == "object" && navigator.language || "C").replace("-", "_") + ".UTF-8", e = {
        USER: "web_user",
        LOGNAME: "web_user",
        PATH: "/",
        PWD: "/",
        HOME: "/home/web_user",
        LANG: r,
        _: St()
      };
      for (var t in lr)
        lr[t] === void 0 ? delete e[t] : e[t] = lr[t];
      var n = [];
      for (var t in e)
        n.push(`${t}=${e[t]}`);
      L.strings = n;
    }
    return L.strings;
  }, Mt = (r, e) => {
    var t = 0, n = 0;
    for (var i of L()) {
      var a = e + t;
      _[r + n >> 2] = a, t += B(i, a, 1 / 0) + 1, n += 4;
    }
    return 0;
  }, Wt = (r, e) => {
    var t = L();
    _[r >> 2] = t.length;
    var n = 0;
    for (var i of t)
      n += Dr(i) + 1;
    return _[e >> 2] = n, 0;
  }, Ut = (r) => 52, $t = (r, e, t, n) => 52;
  function Vt(r, e, t, n, i) {
    return 70;
  }
  var jt = [null, [], []], Ot = (r, e) => {
    var t = jt[r];
    e === 0 || e === 10 ? ((r === 1 ? mr : I)(Wr(t)), t.length = 0) : t.push(e);
  }, It = (r, e, t, n) => {
    for (var i = 0, a = 0; a < t; a++) {
      var o = _[e >> 2], s = _[e + 4 >> 2];
      e += 8;
      for (var u = 0; u < s; u++)
        Ot(r, C[o + u]);
      i += s;
    }
    return _[n >> 2] = i, 0;
  }, Dt = (r) => r;
  if (f.noExitRuntime && f.noExitRuntime, f.print && (mr = f.print), f.printErr && (I = f.printErr), f.wasmBinary && (x = f.wasmBinary), f.arguments && f.arguments, f.thisProgram && (pr = f.thisProgram), f.preInit)
    for (typeof f.preInit == "function" && (f.preInit = [f.preInit]); f.preInit.length > 0; )
      f.preInit.shift()();
  var Hr, _r, W, d, xr, Zr, Xr, zr, Lr, Gr, qr, Yr, tr, Kr;
  function Nt(r) {
    Hr = r.oa, _r = f._malloc = r.qa, W = f._free = r.ra, d = r.sa, xr = r.ta, Zr = r.ua, Xr = r.va, zr = r.wa, Lr = r.xa, Gr = r.ya, qr = r.za, j.jiji = r.Aa, j.viijii = r.Ba, Yr = j.jiiii = r.Ca, j.iiiiij = r.Da, j.iiiiijj = r.Ea, j.iiiiiijj = r.Fa, tr = r.ma, Kr = r.pa;
  }
  var Bt = {
    r: he,
    w: ge,
    a: pe,
    f: ye,
    n: me,
    da: we,
    q: be,
    Y: Te,
    d: Re,
    K: Fe,
    ba: Ce,
    $: ke,
    ca: Ee,
    _: Pe,
    T: Se,
    ja: We,
    S: Ue,
    ha: je,
    fa: Ie,
    L: Ne,
    M: Qe,
    t: et,
    o: tt,
    ga: it,
    D: ct,
    F: lt,
    ka: _t,
    ia: dt,
    C: wt,
    la: vr,
    P: bt,
    E: Tt,
    A: Rt,
    W: At,
    U: Ft,
    Z: Pt,
    V: Mt,
    X: Wt,
    I: Ut,
    aa: $t,
    R: Vt,
    J: It,
    G: sn,
    O: Lt,
    H: on,
    m: un,
    b: Yt,
    e: Gt,
    h: zt,
    j: Jt,
    v: en,
    s: nn,
    B: an,
    x: vn,
    Q: cn,
    k: qt,
    i: Ht,
    c: Zt,
    g: Xt,
    u: xt,
    y: tn,
    ea: Qt,
    p: fn,
    l: Kt,
    z: rn,
    N: Dt
  };
  function Ht(r, e) {
    var t = p();
    try {
      h(r)(e);
    } catch (n) {
      if (g(t), n !== n + 0) throw n;
      d(1, 0);
    }
  }
  function xt(r, e, t, n, i) {
    var a = p();
    try {
      h(r)(e, t, n, i);
    } catch (o) {
      if (g(a), o !== o + 0) throw o;
      d(1, 0);
    }
  }
  function Zt(r, e, t) {
    var n = p();
    try {
      h(r)(e, t);
    } catch (i) {
      if (g(n), i !== i + 0) throw i;
      d(1, 0);
    }
  }
  function Xt(r, e, t, n) {
    var i = p();
    try {
      h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function zt(r, e, t, n) {
    var i = p();
    try {
      return h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function Lt(r, e, t, n, i, a) {
    var o = p();
    try {
      return h(r)(e, t, n, i, a);
    } catch (s) {
      if (g(o), s !== s + 0) throw s;
      d(1, 0);
    }
  }
  function Gt(r, e, t) {
    var n = p();
    try {
      return h(r)(e, t);
    } catch (i) {
      if (g(n), i !== i + 0) throw i;
      d(1, 0);
    }
  }
  function qt(r) {
    var e = p();
    try {
      h(r)();
    } catch (t) {
      if (g(e), t !== t + 0) throw t;
      d(1, 0);
    }
  }
  function Yt(r, e) {
    var t = p();
    try {
      return h(r)(e);
    } catch (n) {
      if (g(t), n !== n + 0) throw n;
      d(1, 0);
    }
  }
  function Kt(r, e, t, n, i, a, o, s, u, v, c) {
    var l = p();
    try {
      h(r)(e, t, n, i, a, o, s, u, v, c);
    } catch (y) {
      if (g(l), y !== y + 0) throw y;
      d(1, 0);
    }
  }
  function Jt(r, e, t, n, i) {
    var a = p();
    try {
      return h(r)(e, t, n, i);
    } catch (o) {
      if (g(a), o !== o + 0) throw o;
      d(1, 0);
    }
  }
  function Qt(r, e, t, n, i, a, o) {
    var s = p();
    try {
      h(r)(e, t, n, i, a, o);
    } catch (u) {
      if (g(s), u !== u + 0) throw u;
      d(1, 0);
    }
  }
  function rn(r, e, t, n, i, a, o, s, u, v, c, l, y, b, S, m) {
    var R = p();
    try {
      h(r)(e, t, n, i, a, o, s, u, v, c, l, y, b, S, m);
    } catch (w) {
      if (g(R), w !== w + 0) throw w;
      d(1, 0);
    }
  }
  function en(r, e, t, n, i, a) {
    var o = p();
    try {
      return h(r)(e, t, n, i, a);
    } catch (s) {
      if (g(o), s !== s + 0) throw s;
      d(1, 0);
    }
  }
  function tn(r, e, t, n, i, a) {
    var o = p();
    try {
      h(r)(e, t, n, i, a);
    } catch (s) {
      if (g(o), s !== s + 0) throw s;
      d(1, 0);
    }
  }
  function nn(r, e, t, n, i, a, o) {
    var s = p();
    try {
      return h(r)(e, t, n, i, a, o);
    } catch (u) {
      if (g(s), u !== u + 0) throw u;
      d(1, 0);
    }
  }
  function an(r, e, t, n, i, a, o, s) {
    var u = p();
    try {
      return h(r)(e, t, n, i, a, o, s);
    } catch (v) {
      if (g(u), v !== v + 0) throw v;
      d(1, 0);
    }
  }
  function on(r, e, t, n) {
    var i = p();
    try {
      return h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function sn(r, e, t, n) {
    var i = p();
    try {
      return h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function un(r) {
    var e = p();
    try {
      return h(r)();
    } catch (t) {
      if (g(e), t !== t + 0) throw t;
      d(1, 0);
    }
  }
  function fn(r, e, t, n, i, a, o, s) {
    var u = p();
    try {
      h(r)(e, t, n, i, a, o, s);
    } catch (v) {
      if (g(u), v !== v + 0) throw v;
      d(1, 0);
    }
  }
  function vn(r, e, t, n, i, a, o, s, u, v, c, l) {
    var y = p();
    try {
      return h(r)(e, t, n, i, a, o, s, u, v, c, l);
    } catch (b) {
      if (g(y), b !== b + 0) throw b;
      d(1, 0);
    }
  }
  function cn(r, e, t, n, i) {
    var a = p();
    try {
      return Yr(r, e, t, n, i);
    } catch (o) {
      if (g(a), o !== o + 0) throw o;
      d(1, 0);
    }
  }
  function ln() {
    ne();
    function r() {
      var e, t;
      f.calledRun = !0, !wr && (ie(), (e = br) === null || e === void 0 || e(f), (t = f.onRuntimeInitialized) === null || t === void 0 || t.call(f), ae());
    }
    f.setStatus ? (f.setStatus("Running..."), setTimeout(() => {
      setTimeout(() => f.setStatus(""), 1), r();
    }, 1)) : r();
  }
  var G;
  return G = await le(), ln(), Fr ? H = f : H = new Promise((r, e) => {
    br = r, Tr = e;
  }), H;
}
function Jr(F) {
  return dn(hr, F);
}
function wn() {
  return hn(hr);
}
function bn(F) {
  return Jr({
    overrides: F,
    equalityFn: Object.is,
    fireImmediately: !0
  });
}
function Tn(F) {
  Jr({
    overrides: F,
    equalityFn: Object.is,
    fireImmediately: !1
  });
}
async function Rn(F, H) {
  return gn(hr, F, H);
}
const An = "d93a8850fdccb687c5a7334d449d2f19fc58864afc0b7beaef944c67d8755c71";
export {
  kn as ZXING_CPP_COMMIT,
  An as ZXING_WASM_SHA256,
  En as ZXING_WASM_VERSION,
  Pn as barcodeFormats,
  Sn as characterSets,
  Mn as defaultWriterOptions,
  bn as getZXingModule,
  Wn as linearBarcodeFormats,
  Un as matrixBarcodeFormats,
  Jr as prepareZXingModule,
  wn as purgeZXingModule,
  Tn as setZXingModuleOverrides,
  Rn as writeBarcode
};
