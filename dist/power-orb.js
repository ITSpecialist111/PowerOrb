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
var y = globalThis, b = (e) => e, x = y.trustedTypes, ae = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, w = "?" + C, oe = `<${w}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, j = />/g, M = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), le = /'/g, ue = /"/g, de = /^(?:script|style|textarea|title)$/i, N = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), P = N(1), fe = N(2), F = Symbol.for("lit-noChange"), I = Symbol.for("lit-nothing"), L = /* @__PURE__ */ new WeakMap(), R = T.createTreeWalker(T, 129);
function z(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ae === void 0 ? t : ae.createHTML(t);
}
var pe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = ce : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (de.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = j : o === M ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? ue : le) : o === ue || o === le ? o = M : o === ce || o === j ? o = A : (o = M, i = void 0);
		let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [z(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, B = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = pe(t, n);
		if (this.el = e.createElement(l, r), R.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = R.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? he : r[1] === "?" ? ge : r[1] === "@" ? _e : U
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (de.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), R.nextNode(), c.push({
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
function V(e, t, n = e, r) {
	if (t === F) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = V(e, i._$AS(e, t.values), i, r)), t;
}
var me = class {
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
		R.currentNode = r;
		let i = R.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new H(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ve(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = R.nextNode(), a++);
		}
		return R.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, H = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = V(this, e, t), D(e) ? e === I || e == null || e === "" ? (this._$AH !== I && this._$AR(), this._$AH = I) : e !== this._$AH && e !== F && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== I && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = B.createElement(z(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new me(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = L.get(e.strings);
		return t === void 0 && L.set(e.strings, t = new B(e)), t;
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
}, U = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = I, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = I;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = V(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== F, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = V(this, r[n + o], t, o), s === F && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === I ? e = I : e !== I && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, he = class extends U {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === I ? void 0 : e;
	}
}, ge = class extends U {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== I);
	}
}, _e = class extends U {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = V(this, e, t, 0) ?? I) === F) return;
		let n = this._$AH, r = e === I && n !== I || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== I && (n === I || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ve = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		V(this, e);
	}
}, ye = y.litHtmlPolyfillSupport;
ye?.(B, H), (y.litHtmlVersions ??= []).push("3.3.3");
var be = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new H(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, W = globalThis, G = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = be(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return F;
	}
};
G._$litElement$ = !0, G.finalized = !0, W.litElementHydrateSupport?.({ LitElement: G });
var xe = W.litElementPolyfillSupport;
xe?.({ LitElement: G }), (W.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Se = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Ce = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: g
}, we = (e = Ce, t, n) => {
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
function K(e) {
	return (t, n) => typeof n == "object" ? we(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function q(e) {
	return K({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region src/energy.ts
function J(e) {
	return typeof e == "object" && !!e;
}
function Y(e, t) {
	let n = e[t];
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function X(e, t, n, r) {
	if (!t) return;
	let i = e.find((e) => e.entityId === t && e.role === r);
	i ? i.multiplier += n : e.push({
		entityId: t,
		multiplier: n,
		role: r
	});
}
function Te(e, t, n) {
	let r = Y(t, "stat_rate"), i = Y(t, "stat_rate_inverted");
	if (r || i) {
		X(e, r, 1, n.net), X(e, i, -1, n.net);
		return;
	}
	X(e, Y(t, "stat_rate_from"), 1, n.positive), X(e, Y(t, "stat_rate_to"), -1, n.negative);
}
function Ee(e) {
	let t = [];
	for (let n of e.energy_sources ?? []) {
		if (!J(n)) continue;
		let e = Y(n, "type"), r = J(n.power_config) ? n.power_config : n;
		if (e === "solar") X(t, Y(n, "stat_rate"), 1, "solar");
		else if (e === "grid") {
			let e = Y(n, "stat_rate");
			e ? X(t, e, 1, "grid") : Te(t, r, {
				net: "grid",
				positive: "grid_import",
				negative: "grid_export"
			});
		} else e === "battery" && Te(t, r, {
			net: "battery",
			positive: "battery_discharge",
			negative: "battery_charge"
		});
	}
	return t.filter((e) => e.multiplier !== 0);
}
function Z(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = e.attributes.unit_of_measurement?.toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : n === "w" || n === void 0 ? t : null;
}
function De(e, t) {
	let n = 0, r = 0;
	for (let i of t) {
		let t = Z(e[i.entityId]);
		t !== null && (n += t * i.multiplier, r += 1);
	}
	return r > 0 ? Math.max(0, n) : null;
}
function Oe(e, t) {
	let n = {
		solar: 0,
		gridImport: 0,
		gridExport: 0,
		batteryCharge: 0,
		batteryDischarge: 0,
		homeLoad: 0,
		activeChannels: 0
	};
	for (let r of t) {
		let t = Z(e[r.entityId]);
		if (t === null) continue;
		let i = t * r.multiplier;
		n.activeChannels += 1, r.role === "solar" ? n.solar += Math.max(0, i) : r.role === "grid" || r.role === "grid_import" ? i >= 0 ? n.gridImport += i : n.gridExport += Math.abs(i) : r.role === "grid_export" ? i <= 0 ? n.gridExport += Math.abs(i) : n.gridImport += i : r.role === "battery" || r.role === "battery_discharge" ? i >= 0 ? n.batteryDischarge += i : n.batteryCharge += Math.abs(i) : r.role === "battery_charge" && (i <= 0 ? n.batteryCharge += Math.abs(i) : n.batteryDischarge += i);
	}
	return n.activeChannels === 0 ? null : (n.homeLoad = Math.max(0, n.solar + n.gridImport + n.batteryDischarge - n.gridExport - n.batteryCharge), n);
}
function ke(e) {
	return Math.round(Math.min(100, Math.max(0, e * 100)));
}
function Ae(e) {
	let t = e.gridImport - e.gridExport, n = e.batteryDischarge - e.batteryCharge, r = e.homeLoad > 0 ? ke((e.homeLoad - e.gridImport) / e.homeLoad) : 100, i = e.solar > 0 ? ke((e.solar - e.gridExport) / e.solar) : 0, a = "Waiting for enough live energy data.";
	return e.gridExport > 250 ? a = "Solar surplus now: run flexible loads or charge storage." : e.gridImport > 500 && e.solar > 0 ? a = "Importing from grid: shift flexible loads toward brighter periods." : e.batteryCharge > 250 ? a = "Battery is charging: preserve stored energy for the evening peak." : e.batteryDischarge > 250 ? a = "Battery is covering demand: keep heavy loads staggered." : e.solar > 0 && (a = "Solar is covering the home with minimal grid movement."), {
		selfPoweredPercent: r,
		solarUsedPercent: i,
		netGridWatts: t,
		netBatteryWatts: n,
		recommendation: a
	};
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
var je = 300 * 1e3, $ = class extends G {
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
			multiplier: 1,
			role: "grid"
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
			this.refreshTimer = window.setInterval(() => void this.loadEnergyPreferences(), je);
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
				this.channels = Ee(e), this.error = this.channels.length === 0 ? "Add real-time power sensors to your Energy dashboard." : void 0, this.captureSample(!0);
			} catch {
				this.error = "Power Orb could not read the Energy dashboard.";
			} finally {
				this.loading = !1;
			}
		}
	}
	currentPower() {
		return this._hass ? this.config.entity ? Z(this._hass.states[this.config.entity]) : De(this._hass.states, this.channels) : null;
	}
	currentSnapshot() {
		return !this._hass || this.config.entity ? null : Oe(this._hass.states, this.channels);
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
		if (this.samples.length < 2) return I;
		let e = Math.max(...this.samples, 1), t = Math.max(this.samples.length - 1, 1);
		return fe`
      <svg class="sparkline" viewBox="0 0 100 42" preserveAspectRatio="none"
        role="img" aria-label="Recent power trend">
        <polyline points=${this.samples.map((n, r) => {
			let i = r / t * 100, a = 38 - n / e * 34;
			return `${i.toFixed(2)},${a.toFixed(2)}`;
		}).join(" ")}></polyline>
      </svg>
    `;
	}
	flowStyle(e, t) {
		return `--flow:${t > 0 ? Math.min(1, Math.max(0, e / t)) : 0}`;
	}
	metric(e, t, n) {
		let r = this.formatPower(t);
		return P`
      <div class=${`metric ${t > 0 ? "active" : ""}`}>
        <span>${e}</span>
        <strong>${r.value}<small>${r.unit}</small></strong>
        <em>${n}</em>
      </div>
    `;
	}
	render() {
		let e = this.currentPower(), t = this.config.max_power ?? Math.max(...this.samples, e ?? 0, 5e3), n = e === null ? 0 : Math.min(1, Math.max(.08, e / t)), r = e === null ? void 0 : this.formatPower(e), i = this.currentSnapshot(), a = i ? Ae(i) : void 0, o = a?.netGridWatts ?? 0, s = a?.netBatteryWatts ?? 0;
		return P`
      <ha-card>
        <div class="card" style=${`--intensity:${n}`}>
          <header>
            <span>${this.config.name ?? "Power Orb"}</span>
            <span class="status" title="Live data">
              <i class=${e === null ? "offline" : ""}></i> live
            </span>
          </header>

          ${i ? P`
                <section class="dashboard" aria-label="Live energy dashboard">
                  <div class="sky" aria-hidden="true">
                    <div class="sun"></div>
                    <svg class="arc" viewBox="0 0 260 100" preserveAspectRatio="none">
                      <path d="M12 88 C 70 8, 188 8, 248 88"></path>
                    </svg>
                  </div>

                  <div class="flow flow-solar ${i.solar > 0 ? "active" : ""}" style=${this.flowStyle(i.solar, t)}></div>
                  <div class="flow flow-grid ${o === 0 ? "" : "active"}" style=${this.flowStyle(Math.abs(o), t)}></div>
                  <div class="flow flow-battery ${s === 0 ? "" : "active"}" style=${this.flowStyle(Math.abs(s), t)}></div>

                  <div class="node solar-node">
                    <span>Solar</span>
                    <strong>${this.formatPower(i.solar).value}<small>${this.formatPower(i.solar).unit}</small></strong>
                  </div>
                  <div class="node home-node">
                    <span>Home</span>
                    <strong>${this.formatPower(i.homeLoad).value}<small>${this.formatPower(i.homeLoad).unit}</small></strong>
                  </div>
                  <div class="node grid-node">
                    <span>Grid</span>
                    <strong>${this.formatPower(Math.abs(o)).value}<small>${this.formatPower(Math.abs(o)).unit}</small></strong>
                  </div>
                  <div class="node battery-node">
                    <span>Battery</span>
                    <strong>${this.formatPower(Math.abs(s)).value}<small>${this.formatPower(Math.abs(s)).unit}</small></strong>
                  </div>
                </section>

                <section class="metrics" aria-label="Energy source details">
                  ${this.metric("Solar", i.solar, "production")}
                  ${this.metric("Grid", Math.abs(o), o < 0 ? "exporting" : o > 0 ? "importing" : "idle")}
                  ${this.metric("Battery", Math.abs(s), s < 0 ? "charging" : s > 0 ? "discharging" : "idle")}
                  ${this.metric("Home", i.homeLoad, "estimated load")}
                </section>

                <section class="insights" aria-label="Automatic energy insights">
                  <div>
                    <span>Self powered</span>
                    <strong>${a?.selfPoweredPercent ?? 0}<small>%</small></strong>
                  </div>
                  <div>
                    <span>Solar used</span>
                    <strong>${a?.solarUsedPercent ?? 0}<small>%</small></strong>
                  </div>
                  <p>${a?.recommendation}</p>
                </section>
              ` : P`
                <div class="visual">
                  <div class="orb" aria-hidden="true">
                    <div class="core"></div>
                    <div class="ring ring-one"></div>
                    <div class="ring ring-two"></div>
                  </div>
                  <div class="reading" aria-live="polite">
                    ${r ? P`<strong>${r.value}</strong
                          ><span>${r.unit}</span>` : P`<strong>—</strong>`}
                    <small>live power</small>
                  </div>
                </div>
              `}

          <div class="trend">
            <div class="trend-label">
              <span>Recent load</span>
              ${r ? P`<strong>${r.value}<small>${r.unit}</small></strong>` : I}
            </div>
            ${this.sparkline()}
          </div>

          ${this.loading ? P`<p class="message">Discovering Energy dashboard…</p>` : this.error ? P`<p class="message error">${this.error}</p>` : P`<p class="message">
                  ${this.config.entity ? this.config.entity : `${this.channels.length} Energy dashboard ${this.channels.length === 1 ? "sensor" : "sensors"} mapped automatically`}
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
      min-height: 430px;
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
    .dashboard {
      position: relative;
      min-height: 230px;
      margin: 18px 0 14px;
      border-radius: 18px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(24, 91, 120, 0.34), transparent 54%),
        linear-gradient(180deg, transparent 58%, rgba(38, 83, 48, 0.28) 59%, rgba(25, 43, 32, 0.58));
      box-shadow: inset 0 0 0 1px rgba(180, 231, 232, 0.12);
    }
    .sky {
      position: absolute;
      inset: 12px 16px auto;
      height: 88px;
      opacity: 0.95;
    }
    .sun {
      position: absolute;
      left: 50%;
      top: 4px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #ffd978;
      box-shadow: 0 0 34px rgba(255, 207, 94, 0.76);
      transform: translateX(-50%);
    }
    .arc {
      position: absolute;
      inset: 10px 0 0;
      width: 100%;
      height: 82px;
    }
    .arc path {
      fill: none;
      stroke: rgba(255, 238, 188, 0.5);
      stroke-width: 1.4;
      stroke-dasharray: 4 6;
    }
    .flow {
      position: absolute;
      background: rgba(113, 234, 220, calc(0.22 + 0.58 * var(--flow)));
      border-radius: 999px;
      box-shadow: 0 0 calc(8px + 18px * var(--flow)) rgba(76, 229, 220, calc(0.12 + 0.5 * var(--flow)));
      opacity: 0.36;
      transform-origin: center;
      transition: opacity 0.5s ease, box-shadow 0.5s ease;
    }
    .flow.active {
      opacity: 1;
    }
    .flow::after {
      content: "";
      position: absolute;
      inset: -2px auto -2px 0;
      width: 28%;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.86), transparent);
      animation: flow 2.3s linear infinite;
    }
    .flow-solar {
      left: 49%;
      top: 84px;
      width: 5px;
      height: 66px;
    }
    .flow-solar::after {
      width: 100%;
      height: 24px;
      animation-name: flow-down;
    }
    .flow-grid {
      left: 62%;
      top: 154px;
      width: 23%;
      height: calc(2px + 5px * var(--flow));
    }
    .flow-battery {
      left: 17%;
      top: 154px;
      width: 23%;
      height: calc(2px + 5px * var(--flow));
    }
    .node {
      position: absolute;
      display: grid;
      place-items: center;
      width: 88px;
      min-height: 58px;
      padding: 8px;
      box-sizing: border-box;
      border-radius: 14px;
      background: rgba(7, 22, 30, 0.72);
      border: 1px solid rgba(175, 239, 235, 0.18);
      box-shadow: 0 14px 26px rgba(0, 0, 0, 0.18);
      text-align: center;
    }
    .node span,
    .metric span,
    .trend-label span {
      color: var(--secondary-text-color, #aab8c2);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .node strong,
    .metric strong,
    .trend-label strong {
      font-size: 18px;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
    .node small,
    .metric small,
    .trend-label small {
      margin-left: 3px;
      font-size: 10px;
      font-weight: 600;
    }
    .solar-node {
      left: 50%;
      top: 62px;
      transform: translateX(-50%);
    }
    .home-node {
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%);
      background: rgba(6, 35, 43, 0.9);
      border-color: rgba(102, 235, 226, 0.38);
    }
    .grid-node {
      right: 16px;
      bottom: 22px;
    }
    .battery-node {
      left: 16px;
      bottom: 22px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }
    .metric {
      min-width: 0;
      padding: 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.045);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
    }
    .metric.active {
      background: rgba(61, 211, 198, 0.1);
    }
    .metric strong {
      display: block;
      margin-top: 7px;
    }
    .metric em {
      display: block;
      margin-top: 3px;
      color: var(--secondary-text-color, #aab8c2);
      font-size: 11px;
      font-style: normal;
    }
    .trend {
      margin-top: 12px;
    }
    .insights {
      display: grid;
      grid-template-columns: minmax(78px, 0.45fr) minmax(78px, 0.45fr) minmax(0, 1.3fr);
      gap: 8px;
      margin-top: 8px;
      align-items: stretch;
    }
    .insights div,
    .insights p {
      margin: 0;
      padding: 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.055);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
    }
    .insights span {
      display: block;
      color: var(--secondary-text-color, #aab8c2);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .insights strong {
      display: block;
      margin-top: 5px;
      font-size: 22px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .insights small {
      margin-left: 2px;
      font-size: 11px;
    }
    .insights p {
      color: var(--primary-text-color, #f4fbff);
      font-size: 12px;
      line-height: 1.35;
    }
    .trend-label {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 3px;
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
    @keyframes flow {
      to { transform: translateX(360%); }
    }
    @keyframes flow-down {
      to { transform: translateY(280%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .core, .ring-two, .flow::after { animation: none; }
    }
    @media (max-width: 420px) {
      .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .insights {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .insights p {
        grid-column: 1 / -1;
      }
      .node {
        width: 78px;
      }
    }
  `;
	}
};
Q([K({ attribute: !1 })], $.prototype, "hass", null), Q([q()], $.prototype, "channels", void 0), Q([q()], $.prototype, "loading", void 0), Q([q()], $.prototype, "error", void 0), Q([q()], $.prototype, "samples", void 0), $ = Q([Se("power-orb")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "power-orb") || window.customCards.push({
	type: "power-orb",
	name: "Power Orb",
	description: "Live solar, grid, battery, and home power from the Energy dashboard",
	documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
	preview: !0
});
//#endregion
export { $ as PowerOrbCard };
