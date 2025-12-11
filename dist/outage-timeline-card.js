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
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new dt(e, r, Y);
}, vt = (r, t) => {
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
const { is: gt, defineProperty: bt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Et, getOwnPropertySymbols: St, getPrototypeOf: wt } = Object, y = globalThis, et = y.trustedTypes, xt = et ? et.emptyScript : "", q = y.reactiveElementPolyfillSupport, T = (r, t) => r, I = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? xt : null;
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
} }, Z = (r, t) => !gt(r, t), st = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let x = class extends HTMLElement {
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
    const { get: i, set: o } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const l = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, l, s);
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
    return vt(t, this.constructor.elementStyles), t;
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
    var o;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : I).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : I;
      this._$Em = i;
      const d = a.fromAttribute(e, l.type);
      this[i] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const o = this.constructor, n = this[t];
      if (s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? Z)(n, e) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: l } = n, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[T("elementProperties")] = /* @__PURE__ */ new Map(), x[T("finalized")] = /* @__PURE__ */ new Map(), q == null || q({ ReactiveElement: x }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, j = M.trustedTypes, it = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ut = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + m, Pt = `<${$t}>`, S = document, R = () => S.createComment(""), k = (r) => r === null || typeof r != "object" && typeof r != "function", G = Array.isArray, Ct = (r) => G(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, ot = />/g, b = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, at = /"/g, _t = /^(?:script|style|textarea|title)$/i, Ot = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), _ = Ot(1), C = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), A = S.createTreeWalker(S, 129);
function ft(r, t) {
  if (!G(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ut = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = U;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let d, p, h = -1, $ = 0;
    for (; $ < a.length && (n.lastIndex = $, p = n.exec(a), p !== null); ) $ = n.lastIndex, n === U ? p[1] === "!--" ? n = rt : p[1] !== void 0 ? n = ot : p[2] !== void 0 ? (_t.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = b) : p[3] !== void 0 && (n = b) : n === b ? p[0] === ">" ? (n = i ?? U, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? b : p[3] === '"' ? at : nt) : n === at || n === nt ? n = b : n === rt || n === ot ? n = U : (n = b, i = void 0);
    const f = n === b && r[l + 1].startsWith("/>") ? " " : "";
    o += n === U ? a + Pt : h >= 0 ? (s.push(d), a.slice(0, h) + ut + a.slice(h) + m + f) : a + m + (h === -2 ? l : f);
  }
  return [ft(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [d, p] = Ut(t, e);
    if (this.el = N.createElement(d, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ut)) {
          const $ = p[n++], f = i.getAttribute(h).split(m), z = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: o, name: z[2], strings: f, ctor: z[1] === "." ? Mt : z[1] === "?" ? Rt : z[1] === "@" ? kt : V }), i.removeAttribute(h);
        } else h.startsWith(m) && (a.push({ type: 6, index: o }), i.removeAttribute(h));
        if (_t.test(i.tagName)) {
          const h = i.textContent.split(m), $ = h.length - 1;
          if ($ > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < $; f++) i.append(h[f], R()), A.nextNode(), a.push({ type: 2, index: ++o });
            i.append(h[$], R());
          }
        }
      } else if (i.nodeType === 8) if (i.data === $t) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(m, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += m.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function O(r, t, e = r, s) {
  var n, l;
  if (t === C) return t;
  let i = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = k(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = O(r, i._$AS(r, t.values), i, s)), t;
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
    let o = A.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new H(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Nt(o, this, t)), this._$AV.push(d), a = s[++l];
      }
      n !== (a == null ? void 0 : a.index) && (o = A.nextNode(), n++);
    }
    return A.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
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
    t = O(this, t, e), k(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ct(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = N.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const n = new Tt(i, this), l = n.u(this.options);
      n.p(e), this.T(l), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new H(this.O(R()), this.O(R()), this, this.options)) : s = e[i], s._$AI(o), i++;
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
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = O(this, t, e, 0), n = !k(t) || t !== this._$AH && t !== C, n && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = O(this, l[s + a], e, a), d === C && (d = this._$AH[a]), n || (n = !k(d) || d !== this._$AH[a]), d === c ? t = c : t !== c && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !i && this.j(t);
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
class kt extends V {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? c) === C) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
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
F == null || F(N, H), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.1");
const Ht = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new H(t.insertBefore(R(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class P extends x {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
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
    return C;
  }
}
var ct;
P._$litElement$ = !0, P.finalized = !0, (ct = E.litElementHydrateSupport) == null || ct.call(E, { LitElement: P });
const X = E.litElementPolyfillSupport;
X == null || X({ LitElement: P });
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
const Dt = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: Z }, zt = (r = Dt, t, e) => {
  const { kind: s, metadata: i } = e;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, r);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, r, l), l;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function v(r) {
  return (t, e) => typeof e == "object" ? zt(r, t, e) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function B(r) {
  return v({ ...r, state: !0, attribute: !1 });
}
var Lt = Object.defineProperty, It = Object.getOwnPropertyDescriptor, D = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? It(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && Lt(t, e, i), i;
};
const J = 24 * 60;
function ht(r) {
  const [t, e] = r.split(":").map(Number);
  return t * 60 + (e || 0);
}
let w = class extends P {
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
      const i = e.leftPercent, o = e.leftPercent + e.widthPercent;
      return _`
            <div class="bottom-label" style="left: ${i}%">
              ${e.start}
            </div>
            <div class="bottom-label" style="left: ${o}%">
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
      --timeline-text-color: var(--primary-text-color);
      --timeline-track-background: #e0e0e0;
      --timeline-block-color: #ea3434;
      --timeline-hour-line-color: #c0c0c0;
      --timeline-top-label-color: var(--secondary-text-color);
      --timeline-bottom-label-color: var(--primary-text-color);

      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: var(--timeline-text-color);
      margin-left: 12px;
      margin-right: 12px;
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
      color: var(--timeline-top-label-color);
    }

    .track {
      position: relative;
      width: 100%;
      background-color: var(--timeline-track-background);
      overflow: hidden;
    }

    .block {
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: var(--timeline-block-color);
      z-index: 1;
    }

    .hour-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: var(--timeline-hour-line-color);
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
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      color: var(--timeline-bottom-label-color);
    }
  `;
D([
  v({ type: Array })
], w.prototype, "intervals", 2);
D([
  v({ type: Number })
], w.prototype, "height", 2);
D([
  v({ type: Number, attribute: "border-radius" })
], w.prototype, "borderRadius", 2);
D([
  v({ type: Boolean, attribute: "enable-vertical-line" })
], w.prototype, "enableVerticalLine", 2);
w = D([
  mt("simple-outage-timeline")
], w);
var jt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, g = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Vt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && jt(t, e, i), i;
};
let u = class extends P {
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
      let i = e.find((o) => o.schedule_date === s) ?? e[0];
      if (!i || !Array.isArray(i.intervals)) {
        this._intervals = [];
        return;
      }
      this._intervals = i.intervals.map((o) => ({
        start: this._normalizeTime(o.start),
        end: this._normalizeTime(o.end),
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
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow);
    }

    .header {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }
  `;
g([
  v({ type: String, attribute: "api-url" })
], u.prototype, "apiUrl", 2);
g([
  v({ type: String, attribute: "schedule-date" })
], u.prototype, "scheduleDate", 2);
g([
  v({ type: Boolean, attribute: "enable-vertical-line" })
], u.prototype, "enableVerticalLine", 2);
g([
  B()
], u.prototype, "_intervals", 2);
g([
  B()
], u.prototype, "_loading", 2);
g([
  B()
], u.prototype, "_error", 2);
g([
  B()
], u.prototype, "_title", 2);
u = g([
  mt("outage-timeline-card")
], u);
export {
  u as TimelineCard
};
