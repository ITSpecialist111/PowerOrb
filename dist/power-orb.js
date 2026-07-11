//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, ae = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, w = "?" + C, oe = `<${w}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, j = />/g, M = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), le = /'/g, ue = /"/g, N = /^(?:script|style|textarea|title)$/i, P = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), F = P(1), de = P(2), I = Symbol.for("lit-noChange"), L = Symbol.for("lit-nothing"), R = /* @__PURE__ */ new WeakMap(), z = T.createTreeWalker(T, 129);
function B(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ae === void 0 ? t : ae.createHTML(t);
}
var fe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = ce : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (N.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = j : o === M ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? ue : le) : o === ue || o === le ? o = M : o === ce || o === j ? o = A : (o = M, i = void 0);
		let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [B(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, V = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = fe(t, n);
		if (this.el = e.createElement(l, r), z.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = z.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? me : r[1] === "?" ? he : r[1] === "@" ? ge : W
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (N.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), z.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) if (i.data === w) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += C.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function H(e, t, n = e, r) {
	if (t === I) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = H(e, i._$AS(e, t.values), i, r)), t;
}
var pe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
		z.currentNode = r;
		let i = z.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new U(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new _e(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = z.nextNode(), a++);
		}
		return z.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, U = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = L, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = H(this, e, t), D(e) ? e === L || e == null || e === "" ? (this._$AH !== L && this._$AR(), this._$AH = L) : e !== this._$AH && e !== I && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== L && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = V.createElement(B(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new pe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = R.get(e.strings);
		return t === void 0 && R.set(e.strings, t = new V(e)), t;
	}
	k(t) {
		O(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, W = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = L, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = L;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = H(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== I, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = H(this, r[n + o], t, o), s === I && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === L ? e = L : e !== L && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === L ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, me = class extends W {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === L ? void 0 : e;
	}
}, he = class extends W {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== L);
	}
}, ge = class extends W {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = H(this, e, t, 0) ?? L) === I) return;
		let n = this._$AH, r = e === L && n !== L || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== L && (n === L || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, _e = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		H(this, e);
	}
}, ve = y.litHtmlPolyfillSupport;
ve?.(V, U), (y.litHtmlVersions ??= []).push("3.3.3");
var ye = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new U(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, G = globalThis, K = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ye(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return I;
	}
};
K._$litElement$ = !0, K.finalized = !0, G.litElementHydrateSupport?.({ LitElement: K });
var be = G.litElementPolyfillSupport;
be?.({ LitElement: K }), (G.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var xe = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Se = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: g
}, Ce = (e = Se, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function q(e) {
	return (t, n) => typeof n == "object" ? Ce(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function J(e) {
	return q({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region src/energy.ts
function Y(e) {
	return typeof e == "object" && !!e;
}
function X(e, t) {
	let n = e[t];
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function Z(e, t, n) {
	if (!t) return;
	let r = e.find((e) => e.entityId === t);
	r ? r.multiplier += n : e.push({
		entityId: t,
		multiplier: n
	});
}
function we(e, t) {
	let n = X(t, "stat_rate"), r = X(t, "stat_rate_inverted");
	if (n || r) {
		Z(e, n, 1), Z(e, r, -1);
		return;
	}
	Z(e, X(t, "stat_rate_from"), 1), Z(e, X(t, "stat_rate_to"), -1);
}
function Te(e) {
	let t = [];
	for (let n of e.energy_sources ?? []) {
		if (!Y(n)) continue;
		let e = X(n, "type"), r = Y(n.power_config) ? n.power_config : n;
		if (e === "solar") Z(t, X(n, "stat_rate"), 1);
		else if (e === "grid") {
			let e = X(n, "stat_rate");
			e ? Z(t, e, 1) : we(t, r);
		} else e === "battery" && we(t, r);
	}
	return t.filter((e) => e.multiplier !== 0);
}
function Ee(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = e.attributes.unit_of_measurement?.toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : n === "w" || n === void 0 ? t : null;
}
function De(e, t) {
	let n = 0, r = 0;
	for (let i of t) {
		let t = Ee(e[i.entityId]);
		t !== null && (n += t * i.multiplier, r += 1);
	}
	return r > 0 ? Math.max(0, n) : null;
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/decorate.js
function Q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/power-orb-card.ts
var Oe = 300 * 1e3, $ = class extends K {
	constructor(...e) {
		super(...e), this.channels = [], this.loading = !0, this.samples = [], this.config = { type: "custom:power-orb" }, this.connectionGeneration = 0, this.lastSampleAt = 0;
	}
	set hass(e) {
		this._hass = e, this.captureSample(), this.requestUpdate();
	}
	get hass() {
		return this._hass;
	}
	setConfig(e) {
		if (!e || e.type !== "custom:power-orb") throw Error("Power Orb requires type: custom:power-orb");
		if (e.max_power !== void 0 && e.max_power <= 0) throw Error("max_power must be greater than zero");
		this.config = e, this.channels = e.entity ? [{
			entityId: e.entity,
			multiplier: 1
		}] : [], this.loading = !e.entity, this.error = void 0, this.samples = [], this.disconnectData(), this.isConnected && this._hass && this.connect();
	}
	static getStubConfig() {
		return { type: "custom:power-orb" };
	}
	getCardSize() {
		return 7;
	}
	getGridOptions() {
		return {
			rows: 6,
			columns: 6,
			min_rows: 6,
			min_columns: 3
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._hass && this.connect();
	}
	disconnectedCallback() {
		this.disconnectData(), super.disconnectedCallback();
	}
	connect() {
		if (!this._hass || this.config.entity) return Promise.resolve();
		if (this.connecting) return this.connecting;
		let e = this.connectionGeneration;
		return this.connecting = this.startDiscovery(e).finally(() => {
			e === this.connectionGeneration && (this.connecting = void 0);
		}), this.connecting;
	}
	async startDiscovery(e) {
		if (await this.loadEnergyPreferences(), !(e !== this.connectionGeneration || !this._hass)) {
			this.refreshTimer = window.setInterval(() => void this.loadEnergyPreferences(), Oe);
			try {
				let t = await this._hass.connection.subscribeEvents(() => void this.loadEnergyPreferences(), "power_orb_refresh");
				e === this.connectionGeneration ? this.unsubscribe = t : t();
			} catch {}
		}
	}
	disconnectData() {
		this.connectionGeneration += 1, this.unsubscribe?.(), this.unsubscribe = void 0, this.refreshTimer !== void 0 && (window.clearInterval(this.refreshTimer), this.refreshTimer = void 0), this.connecting = void 0;
	}
	async loadEnergyPreferences() {
		if (!(!this._hass || this.config.entity)) {
			this.loading = !0;
			try {
				let e = await this._hass.callWS({ type: "energy/get_prefs" });
				this.channels = Te(e), this.error = this.channels.length === 0 ? "Add real-time power sensors to your Energy dashboard." : void 0, this.captureSample(!0);
			} catch {
				this.error = "Power Orb could not read the Energy dashboard.";
			} finally {
				this.loading = !1;
			}
		}
	}
	currentPower() {
		return this._hass ? this.config.entity ? Ee(this._hass.states[this.config.entity]) : De(this._hass.states, this.channels) : null;
	}
	captureSample(e = !1) {
		let t = Date.now();
		if (!e && t - this.lastSampleAt < 1e3) return;
		let n = this.currentPower();
		n !== null && (this.lastSampleAt = t, this.samples = [...this.samples.slice(-59), n]);
	}
	formatPower(e) {
		let t = this.config.unit === "kW" || this.config.unit === void 0 && Math.abs(e) >= 1e3, n = this._hass?.locale?.language ?? this._hass?.language, r = t ? e / 1e3 : e;
		return {
			value: new Intl.NumberFormat(n, { maximumFractionDigits: t ? 2 : 0 }).format(r),
			unit: t ? "kW" : "W"
		};
	}
	sparkline() {
		if (this.samples.length < 2) return L;
		let e = Math.max(...this.samples, 1), t = Math.max(this.samples.length - 1, 1);
		return de`
      <svg class="sparkline" viewBox="0 0 100 42" preserveAspectRatio="none"
        role="img" aria-label="Recent power trend">
        <polyline points=${this.samples.map((n, r) => {
			let i = r / t * 100, a = 38 - n / e * 34;
			return `${i.toFixed(2)},${a.toFixed(2)}`;
		}).join(" ")}></polyline>
      </svg>
    `;
	}
	render() {
		let e = this.currentPower(), t = this.config.max_power ?? Math.max(...this.samples, e ?? 0, 5e3), n = e === null ? 0 : Math.min(1, Math.max(.08, e / t)), r = e === null ? void 0 : this.formatPower(e);
		return F`
      <ha-card>
        <div class="card" style=${`--intensity:${n}`}>
          <header>
            <span>${this.config.name ?? "Power Orb"}</span>
            <span class="status" title="Live data">
              <i class=${e === null ? "offline" : ""}></i> live
            </span>
          </header>

          <div class="visual">
            <div class="orb" aria-hidden="true">
              <div class="core"></div>
              <div class="ring ring-one"></div>
              <div class="ring ring-two"></div>
            </div>
            <div class="reading" aria-live="polite">
              ${r ? F`<strong>${r.value}</strong
                    ><span>${r.unit}</span>` : F`<strong>—</strong>`}
              <small>home power</small>
            </div>
          </div>

          ${this.sparkline()}
          ${this.loading ? F`<p class="message">Discovering Energy dashboard…</p>` : this.error ? F`<p class="message error">${this.error}</p>` : F`<p class="message">
                  ${this.config.entity ? this.config.entity : `${this.channels.length} live ${this.channels.length === 1 ? "sensor" : "sensors"}`}
                </p>`}
        </div>
      </ha-card>
    `;
	}
	static {
		this.styles = o`
    :host {
      display: block;
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 35%, rgba(23, 104, 122, 0.24), transparent 45%),
        var(--ha-card-background, var(--card-background-color, #10161d));
      color: var(--primary-text-color, #f4fbff);
    }
    .card {
      min-height: 320px;
      padding: 20px;
      position: relative;
      box-sizing: border-box;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      font-weight: 600;
    }
    .status {
      color: var(--secondary-text-color, #aab8c2);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .status i {
      display: inline-block;
      width: 7px;
      height: 7px;
      margin-right: 5px;
      border-radius: 50%;
      background: #44e0a1;
      box-shadow: 0 0 8px #44e0a1;
    }
    .status i.offline {
      background: #7f8b93;
      box-shadow: none;
    }
    .visual {
      height: 205px;
      display: grid;
      place-items: center;
      position: relative;
    }
    .orb {
      width: 156px;
      height: 156px;
      position: relative;
      border-radius: 50%;
      background:
        radial-gradient(circle at 42% 38%, rgba(255, 255, 255, 0.9), transparent 5%),
        radial-gradient(circle at 50% 50%, #8cf7ee 0%, #20b8ca 30%, #086177 68%, #032d3c 100%);
      box-shadow:
        0 0 calc(18px + 36px * var(--intensity)) rgba(41, 218, 222, calc(0.2 + 0.55 * var(--intensity))),
        inset -18px -16px 30px rgba(0, 12, 28, 0.55);
      transform: scale(calc(0.94 + 0.06 * var(--intensity)));
      transition: box-shadow 0.8s ease, transform 0.8s ease;
    }
    .core {
      position: absolute;
      inset: 18%;
      border-radius: 50%;
      border: 1px solid rgba(177, 255, 250, 0.35);
      animation: breathe 3s ease-in-out infinite;
    }
    .ring {
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(77, 225, 232, 0.35);
      border-radius: 50%;
      transform: rotateX(68deg) rotateZ(12deg);
    }
    .ring-two {
      inset: -22px 2px;
      transform: rotateY(67deg) rotateZ(-22deg);
      animation: orbit 8s linear infinite;
    }
    .reading {
      position: absolute;
      z-index: 2;
      display: grid;
      grid-template-columns: auto auto;
      align-items: baseline;
      gap: 5px;
      text-align: center;
      text-shadow: 0 2px 12px #002b37;
    }
    .reading strong {
      font-size: 35px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .reading span {
      font-size: 15px;
      font-weight: 600;
    }
    .reading small {
      grid-column: 1 / -1;
      margin-top: 6px;
      color: rgba(235, 255, 255, 0.82);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .sparkline {
      display: block;
      width: 100%;
      height: 42px;
      opacity: 0.75;
    }
    .sparkline polyline {
      fill: none;
      stroke: #55dce3;
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .message {
      min-height: 16px;
      margin: 8px 0 0;
      color: var(--secondary-text-color, #aab8c2);
      font-size: 12px;
      text-align: center;
    }
    .message.error {
      color: var(--error-color, #ff7b7b);
    }
    @keyframes breathe {
      50% { transform: scale(1.08); opacity: 0.65; }
    }
    @keyframes orbit {
      to { transform: rotateY(67deg) rotateZ(338deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .core, .ring-two { animation: none; }
    }
  `;
	}
};
Q([q({ attribute: !1 })], $.prototype, "hass", null), Q([J()], $.prototype, "channels", void 0), Q([J()], $.prototype, "loading", void 0), Q([J()], $.prototype, "error", void 0), Q([J()], $.prototype, "samples", void 0), $ = Q([xe("power-orb")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "power-orb") || window.customCards.push({
	type: "power-orb",
	name: "Power Orb",
	description: "Live home power from the Home Assistant Energy dashboard",
	documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
	preview: !0
});
//#endregion
export { $ as PowerOrbCard };
