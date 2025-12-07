/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, K = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (r) => new dt(typeof r == "string" ? r : r + "", void 0, Y), pt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new dt(e, r, Y);
}, gt = (r, t) => {
  if (K) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = L.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, tt = K ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return yt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: vt, defineProperty: bt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Et, getOwnPropertySymbols: St, getPrototypeOf: wt } = Object, y = globalThis, et = y.trustedTypes, Pt = et ? et.emptyScript : "", q = y.reactiveElementPolyfillSupport, T = (r, t) => r, I = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Pt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (r, t) => !vt(r, t), st = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && bt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const t = wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const e = this.properties, s = [...Et(e), ...St(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(tt(i));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : I).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : I;
      this._$Em = i;
      const d = a.fromAttribute(e, l.type);
      this[i] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const n = this.constructor, o = this[t];
      if (s ?? (s = n.getPropertyOptions(t)), !((s.hasChanged ?? Z)(o, e) || s.useDefault && s.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[T("elementProperties")] = /* @__PURE__ */ new Map(), P[T("finalized")] = /* @__PURE__ */ new Map(), q == null || q({ ReactiveElement: P }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, j = M.trustedTypes, it = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ut = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + m, Ct = `<${$t}>`, S = document, R = () => S.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", G = Array.isArray, xt = (r) => G(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, nt = />/g, b = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, at = /"/g, _t = /^(?:script|style|textarea|title)$/i, Ot = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), _ = Ot(1), x = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), A = S.createTreeWalker(S, 129);
function ft(r, t) {
  if (!G(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ut = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let d, p, h = -1, $ = 0;
    for (; $ < a.length && (o.lastIndex = $, p = o.exec(a), p !== null); ) $ = o.lastIndex, o === U ? p[1] === "!--" ? o = rt : p[1] !== void 0 ? o = nt : p[2] !== void 0 ? (_t.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = b) : p[3] !== void 0 && (o = b) : o === b ? p[0] === ">" ? (o = i ?? U, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? b : p[3] === '"' ? at : ot) : o === at || o === ot ? o = b : o === rt || o === nt ? o = U : (o = b, i = void 0);
    const f = o === b && r[l + 1].startsWith("/>") ? " " : "";
    n += o === U ? a + Ct : h >= 0 ? (s.push(d), a.slice(0, h) + ut + a.slice(h) + m + f) : a + m + (h === -2 ? l : f);
  }
  return [ft(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [d, p] = Ut(t, e);
    if (this.el = H.createElement(d, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ut)) {
          const $ = p[o++], f = i.getAttribute(h).split(m), k = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: n, name: k[2], strings: f, ctor: k[1] === "." ? Mt : k[1] === "?" ? Rt : k[1] === "@" ? Nt : V }), i.removeAttribute(h);
        } else h.startsWith(m) && (a.push({ type: 6, index: n }), i.removeAttribute(h));
        if (_t.test(i.tagName)) {
          const h = i.textContent.split(m), $ = h.length - 1;
          if ($ > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < $; f++) i.append(h[f], R()), A.nextNode(), a.push({ type: 2, index: ++n });
            i.append(h[$], R());
          }
        }
      } else if (i.nodeType === 8) if (i.data === $t) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(m, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += m.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function O(r, t, e = r, s) {
  var o, l;
  if (t === x) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = N(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = O(r, i._$AS(r, t.values), i, s)), t;
}
class Tt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    A.currentNode = i;
    let n = A.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new D(n, n.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (d = new Ht(n, this, t)), this._$AV.push(d), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = A.nextNode(), o++);
    }
    return A.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class D {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = O(this, t, e), N(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : xt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new Tt(i, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new D(this.O(R()), this.O(R()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = O(this, t, e, 0), o = !N(t) || t !== this._$AH && t !== x, o && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = n[0], a = 0; a < n.length - 1; a++) d = O(this, l[s + a], e, a), d === x && (d = this._$AH[a]), o || (o = !N(d) || d !== this._$AH[a]), d === c ? t = c : t !== c && (t += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Rt extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Nt extends V {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? c) === x) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const F = M.litHtmlPolyfillSupport;
F == null || F(H, D), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.1");
const Dt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new D(t.insertBefore(R(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class C extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Dt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return x;
  }
}
var ct;
C._$litElement$ = !0, C.finalized = !0, (ct = E.litElementHydrateSupport) == null || ct.call(E, { LitElement: C });
const X = E.litElementPolyfillSupport;
X == null || X({ LitElement: C });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: Z }, kt = (r = zt, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, r);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, r, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(r) {
  return (t, e) => typeof e == "object" ? kt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function B(r) {
  return g({ ...r, state: !0, attribute: !1 });
}
var Lt = Object.defineProperty, It = Object.getOwnPropertyDescriptor, z = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? It(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && Lt(t, e, i), i;
};
const J = 24 * 60;
function ht(r) {
  const [t, e] = r.split(":").map(Number);
  return t * 60 + (e || 0);
}
let w = class extends C {
  constructor() {
    super(...arguments), this.intervals = [], this.height = 40, this.borderRadius = 10, this.enableVerticalLine = !0;
  }
  getTicks() {
    const r = [];
    for (let t = 0; t <= 24; t += 2) {
      const e = `${t.toString().padStart(2, "0")}:00`, s = t * 60 / J * 100;
      r.push({ label: e, posPercent: s });
    }
    return r;
  }
  getNormalizedIntervals() {
    return this.intervals.map((r) => {
      const t = ht(r.start), e = ht(r.end), s = t / J * 100, i = (e - t) / J * 100;
      return { ...r, leftPercent: s, widthPercent: i };
    });
  }
  render() {
    const r = this.getTicks(), t = this.getNormalizedIntervals();
    return _`
      <!-- Top hour labels -->
      <div class="top-labels">
        ${r.map(
      (e) => _`
              <div class="top-label" style="left: ${e.posPercent}%">
                ${e.label}
              </div>
            `
    )}
      </div>

      <!-- Middle section -->
      <div
          class="track"
          style="
          height: ${this.height}px;
          border-radius: ${this.borderRadius}px;
        "
      >
        <!-- Red working/outage blocks -->
        ${t.map((e, s) => {
      const i = `${e.title ?? "Interval"}` + (e.status ? ` (${e.status})` : "") + ` ${e.start}–${e.end}`;
      return _`
            <div
                class="block"
                title="${i}"
                style="
                left: ${e.leftPercent}%;
                width: ${e.widthPercent}%;
                border-radius: ${this.borderRadius}px;
              "
            ></div>
          `;
    })}

        <!-- Vertical hour lines (optional) -->
        ${this.enableVerticalLine ? r.map(
      (e, s) => s === 0 || s === r.length - 1 ? c : _`
                      <div class="hour-line" style="left: ${e.posPercent}%"></div>
                    `
    ) : c}
      </div>

      <!-- Bottom start/end labels -->
      <div class="bottom-labels">
        ${t.map((e, s) => {
      const i = e.leftPercent, n = e.leftPercent + e.widthPercent;
      return _`
            <div class="bottom-label" style="left: ${i}%">
              ${e.start}
            </div>
            <div class="bottom-label" style="left: ${n}%">
              ${e.end}
            </div>
          `;
    })}
      </div>
    `;
  }
};
w.styles = pt`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #222;
    }

    .top-labels {
      position: relative;
      width: 100%;
      height: 16px;
      margin-bottom: 4px;
    }

    .top-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      white-space: nowrap;
    }

    .track {
      position: relative;
      width: 100%;
      background-color: #e0e0e0;
      overflow: hidden;
    }

    .block {
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: #ff5c5c;
      z-index: 1;
    }

    .hour-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #c0c0c0;
      opacity: 0.9;
      transform: translateX(-0.5px);
      z-index: 2; /* draw over blocks */
    }

    .bottom-labels {
      position: relative;
      width: 100%;
      margin-top: 4px;
      height: 18px;
    }

    .bottom-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      white-space: nowrap;
    }
  `;
z([
  g({ type: Array })
], w.prototype, "intervals", 2);
z([
  g({ type: Number })
], w.prototype, "height", 2);
z([
  g({ type: Number, attribute: "border-radius" })
], w.prototype, "borderRadius", 2);
z([
  g({ type: Boolean, attribute: "enable-vertical-line" })
], w.prototype, "enableVerticalLine", 2);
w = z([
  mt("simple-outage-timeline")
], w);
var jt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, v = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Vt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && jt(t, e, i), i;
};
let u = class extends C {
  constructor() {
    super(...arguments), this.apiUrl = "", this.enableVerticalLine = !0, this._intervals = [], this._loading = !1, this._error = null;
  }
  // === Lovelace required API ===
  // Called once when user configures the card
  setConfig(r) {
    if (!r.api_url)
      throw new Error("api_url is required in card config");
    this._title = r.title, this.apiUrl = r.api_url, this.scheduleDate = r.schedule_date, this.enableVerticalLine = r.enable_vertical_line ?? this.enableVerticalLine, this._fetchIfReady();
  }
  // HA injects hass object so you can access entities if needed
  set hass(r) {
    this._hass = r;
  }
  // Hint to HA how tall the card is in "rows"
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this._fetchIfReady();
  }
  updated(r) {
    (r.has("apiUrl") || r.has("scheduleDate")) && this._fetchIfReady();
  }
  _fetchIfReady() {
    this.apiUrl && this._fetchData();
  }
  async _fetchData() {
    this._loading = !0, this._error = null, this._intervals = [];
    try {
      const r = await fetch(this.apiUrl);
      if (!r.ok)
        throw new Error(`HTTP ${r.status}`);
      const t = await r.json(), e = this._normalizeApiData(t);
      if (!Array.isArray(e) || e.length === 0) {
        this._intervals = [];
        return;
      }
      const s = this.scheduleDate || this._getTodayISO();
      let i = e.find((n) => n.schedule_date === s) ?? e[0];
      if (!i || !Array.isArray(i.intervals)) {
        this._intervals = [];
        return;
      }
      this._intervals = i.intervals.map((n) => ({
        start: this._normalizeTime(n.start),
        end: this._normalizeTime(n.end),
        title: `Outage (${i.group})`,
        status: `Scheduled ${i.schedule_date}`
      }));
    } catch (r) {
      console.error("TimelineCard fetch error:", r), this._error = (r == null ? void 0 : r.message) ?? "Error loading outages";
    } finally {
      this._loading = !1;
    }
  }
  _normalizeApiData(r) {
    return Array.isArray(r) ? r : r && typeof r == "object" && Array.isArray(r.data) ? r.data : r && typeof r == "object" ? [r] : [];
  }
  _getTodayISO() {
    const r = /* @__PURE__ */ new Date(), t = r.getFullYear(), e = String(r.getMonth() + 1).padStart(2, "0"), s = String(r.getDate()).padStart(2, "0");
    return `${t}-${e}-${s}`;
  }
  _normalizeTime(r) {
    return r === "24:00" ? "24:00" : r;
  }
  render() {
    return _`
      <ha-card>
        ${this._title ? _`<div class="header">${this._title}</div>` : c}

        ${this._loading ? _`<div class="status loading">Loading outages…</div>` : c}

        ${this._error ? _`<div class="status error">Error: ${this._error}</div>` : c}

        <simple-outage-timeline
            .intervals=${this._intervals}
            .height=${40}
            .borderRadius=${10}
            .enableVerticalLine=${this.enableVerticalLine}
        ></simple-outage-timeline>
      </ha-card>
    `;
  }
};
u.styles = pt`
    :host {
      display: block;
    }

    ha-card {
      padding: 16px;
    }

    .header {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }
  `;
v([
  g({ type: String, attribute: "api-url" })
], u.prototype, "apiUrl", 2);
v([
  g({ type: String, attribute: "schedule-date" })
], u.prototype, "scheduleDate", 2);
v([
  g({ type: Boolean, attribute: "enable-vertical-line" })
], u.prototype, "enableVerticalLine", 2);
v([
  B()
], u.prototype, "_intervals", 2);
v([
  B()
], u.prototype, "_loading", 2);
v([
  B()
], u.prototype, "_error", 2);
v([
  B()
], u.prototype, "_title", 2);
u = v([
  mt("outage-timeline-card")
], u);
export {
  u as TimelineCard
};
