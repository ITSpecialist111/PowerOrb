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
var y = globalThis, b = (e) => e, x = y.trustedTypes, S = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + w, oe = `<${ae}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, le = />/g, j = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, de = /"/g, fe = /^(?:script|style|textarea|title)$/i, pe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), M = pe(1), N = pe(2), P = Symbol.for("lit-noChange"), F = Symbol.for("lit-nothing"), I = /* @__PURE__ */ new WeakMap(), L = T.createTreeWalker(T, 129);
function R(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return S === void 0 ? t : S.createHTML(t);
}
var me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = ce : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = j) : (fe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = j) : o = le : o === j ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? j : c[3] === "\"" ? de : ue) : o === de || o === ue ? o = j : o === ce || o === le ? o = A : (o = j, i = void 0);
		let d = o === j && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [R(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, z = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = me(t, n);
		if (this.el = e.createElement(l, r), L.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = L.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ge : r[1] === "?" ? _e : r[1] === "@" ? ve : H
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (fe.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), L.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) if (i.data === ae) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += w.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function B(e, t, n = e, r) {
	if (t === P) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = B(e, i._$AS(e, t.values), i, r)), t;
}
var he = class {
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
		L.currentNode = r;
		let i = L.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new V(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ye(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = L.nextNode(), a++);
		}
		return L.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, V = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = B(this, e, t), D(e) ? e === F || e == null || e === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : e !== this._$AH && e !== P && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== F && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = z.createElement(R(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new he(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = I.get(e.strings);
		return t === void 0 && I.set(e.strings, t = new z(e)), t;
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
}, H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = F, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = F;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = B(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== P, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = B(this, r[n + o], t, o), s === P && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === F ? e = F : e !== F && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ge = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === F ? void 0 : e;
	}
}, _e = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== F);
	}
}, ve = class extends H {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = B(this, e, t, 0) ?? F) === P) return;
		let n = this._$AH, r = e === F && n !== F || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== F && (n === F || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ye = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		B(this, e);
	}
}, be = y.litHtmlPolyfillSupport;
be?.(z, V), (y.litHtmlVersions ??= []).push("3.3.3");
var xe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new V(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, U = globalThis, W = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xe(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return P;
	}
};
W._$litElement$ = !0, W.finalized = !0, U.litElementHydrateSupport?.({ LitElement: W });
var Se = U.litElementPolyfillSupport;
Se?.({ LitElement: W }), (U.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Ce = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, we = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: g
}, Te = (e = we, t, n) => {
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
function Ee(e) {
	return (t, n) => typeof n == "object" ? Te(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function G(e) {
	return Ee({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region src/energy.ts
function K(e) {
	return typeof e == "object" && !!e;
}
function q(e, t) {
	let n = e[t];
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function J(e, t, n, r) {
	if (!t) return;
	let i = e.find((e) => e.entityId === t && e.role === r);
	i ? i.multiplier += n : e.push({
		entityId: t,
		multiplier: n,
		role: r
	});
}
function De(e, t, n) {
	let r = q(t, "stat_rate"), i = q(t, "stat_rate_inverted");
	if (r || i) {
		J(e, r, 1, n.net), J(e, i, -1, n.net);
		return;
	}
	J(e, q(t, "stat_rate_from"), 1, n.positive), J(e, q(t, "stat_rate_to"), -1, n.negative);
}
function Oe(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.energy_sources ?? []) {
		if (!K(n)) continue;
		let e = q(n, "type");
		if (e !== "solar" && e !== "grid" && e !== "battery") continue;
		let r = t.get(e) ?? [];
		t.set(e, r);
		let i = K(n.power_config) ? n.power_config : n;
		if (e === "solar") J(r, q(n, "stat_rate"), 1, "solar");
		else if (e === "grid") {
			let e = q(n, "stat_rate");
			e ? J(r, e, 1, "grid") : De(r, i, {
				net: "grid",
				positive: "grid_import",
				negative: "grid_export"
			});
		} else e === "battery" && De(r, i, {
			net: "battery",
			positive: "battery_discharge",
			negative: "battery_charge"
		});
	}
	return [...t.entries()].map(([e, t]) => ({
		kind: e,
		channels: t.filter((e) => e.multiplier !== 0)
	})).filter((e) => e.channels.length > 0);
}
var ke = {
	solar: {
		positive: "solar",
		negative: "solar"
	},
	grid: {
		positive: "grid_import",
		negative: "grid_export"
	},
	battery: {
		positive: "battery_discharge",
		negative: "battery_charge"
	}
};
function Y(e, t, n) {
	let r = typeof e == "string" ? [e] : e;
	if (!Array.isArray(r) || r.length === 0 || r.some((e) => typeof e != "string" || !e)) throw Error(`${t}.${n} must contain one or more entity IDs`);
	return r;
}
function Ae(e, t) {
	if (typeof t == "string" || Array.isArray(t)) return Y(t, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if (!K(t)) throw Error(`${e} must contain one or more entity IDs`);
	let n = [
		"entity",
		"inverted",
		"from",
		"to"
	], r = Object.keys(t).filter((e) => !n.includes(e));
	if (r.length > 0) throw Error(`${e} does not support ${r.join(", ")}`);
	let i = "from" in t || "to" in t;
	if (Number("entity" in t) + Number("inverted" in t) + Number(i) > 1) throw Error(`${e} must use only one of entity, inverted, or from and to`);
	if ("entity" in t) return Y(t.entity, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if ("inverted" in t) return Y(t.inverted, e, "inverted").map((t) => ({
		entityId: t,
		multiplier: -1,
		role: e
	}));
	if (i) {
		if (e === "solar") throw Error("solar does not support from and to; use a single entity");
		if (!("from" in t) || !("to" in t)) throw Error(`${e} requires both from and to`);
		let n = ke[e];
		return [...Y(t.from, e, "from").map((e) => ({
			entityId: e,
			multiplier: 1,
			role: n.positive
		})), ...Y(t.to, e, "to").map((e) => ({
			entityId: e,
			multiplier: -1,
			role: n.negative
		}))];
	}
	throw Error(`${e} must define entity, inverted, or from and to`);
}
function je(e) {
	if (!K(e)) throw Error("entities must map solar, grid, or battery to entity IDs");
	let t = [
		"solar",
		"grid",
		"battery"
	];
	if (Object.keys(e).some((e) => !t.includes(e))) throw Error("entities only supports solar, grid, and battery roles");
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of t) {
		let t = e[i];
		if (t === void 0) continue;
		let a = Ae(i, t);
		for (let e of a) {
			if (n.has(e.entityId)) throw Error(`${e.entityId} cannot be assigned to more than one role`);
			n.add(e.entityId);
		}
		r.push({
			kind: i,
			channels: a
		});
	}
	if (r.length === 0) throw Error("entities must define at least one energy role");
	return r;
}
function Me(e) {
	return Oe(e).flatMap((e) => e.channels);
}
function X(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = e.attributes.unit_of_measurement?.toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : n === "w" || n === void 0 ? t : null;
}
function Ne(e, t) {
	let n = 0, r = 0;
	for (let i of t) {
		let t = X(e[i.entityId]);
		t !== null && (n += t * i.multiplier, r += 1);
	}
	return r > 0 ? Math.max(0, n) : null;
}
function Pe(e, t) {
	let n = 0, r = 0;
	for (let i of t.channels) {
		let t = X(e[i.entityId]);
		t !== null && (n += t * i.multiplier, r += 1);
	}
	return r > 0 ? n : null;
}
function Fe(e, t) {
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
		let t = X(e[r.entityId]);
		if (t === null) continue;
		let i = t * r.multiplier;
		n.activeChannels += 1, r.role === "solar" ? n.solar += Math.max(0, i) : r.role === "grid" || r.role === "grid_import" ? i >= 0 ? n.gridImport += i : n.gridExport += Math.abs(i) : r.role === "grid_export" ? i <= 0 ? n.gridExport += Math.abs(i) : n.gridImport += i : r.role === "battery" || r.role === "battery_discharge" ? i >= 0 ? n.batteryDischarge += i : n.batteryCharge += Math.abs(i) : r.role === "battery_charge" && (i <= 0 ? n.batteryCharge += Math.abs(i) : n.batteryDischarge += i);
	}
	return n.activeChannels === 0 ? null : (n.homeLoad = Math.max(0, n.solar + n.gridImport + n.batteryDischarge - n.gridExport - n.batteryCharge), n);
}
function Z(e) {
	return Math.round(Math.min(100, Math.max(0, e * 100)));
}
function Ie(e) {
	let t = e.gridImport - e.gridExport, n = e.batteryDischarge - e.batteryCharge, r = e.homeLoad > 0 ? Z((e.homeLoad - e.gridImport) / e.homeLoad) : 100, i = e.solar > 0 ? Z((e.solar - e.gridExport) / e.solar) : 0, a = "Waiting for enough live energy data.";
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
var Le = 300 * 1e3, $ = class extends W {
	constructor(...e) {
		super(...e), this.channels = [], this.flows = [], this.loading = !0, this.samples = [], this.config = { type: "custom:power-orb" }, this.connectionGeneration = 0, this.lastSampleAt = 0;
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
		if (e.entity && e.entities !== void 0) throw Error("Configure either entity or entities, not both");
		let t = e.entities === void 0 ? [] : je(e.entities);
		this.config = e, this.channels = e.entity ? [{
			entityId: e.entity,
			multiplier: 1,
			role: "grid"
		}] : t.flatMap((e) => e.channels), this.flows = t, this.loading = !e.entity && e.entities === void 0, this.error = void 0, this.samples = [], this.disconnectData(), this.isConnected && this._hass && this.connect();
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
		if (!this._hass || this.config.entity || this.config.entities !== void 0) return Promise.resolve();
		if (this.connecting) return this.connecting;
		let e = this.connectionGeneration;
		return this.connecting = this.startDiscovery(e).finally(() => {
			e === this.connectionGeneration && (this.connecting = void 0);
		}), this.connecting;
	}
	async startDiscovery(e) {
		if (await this.loadEnergyPreferences(), !(e !== this.connectionGeneration || !this._hass)) {
			this.refreshTimer = window.setInterval(() => void this.loadEnergyPreferences(), Le);
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
		if (!(!this._hass || this.config.entity || this.config.entities !== void 0)) {
			this.loading = !0;
			try {
				let e = await this._hass.callWS({ type: "energy/get_prefs" });
				this.flows = Oe(e), this.channels = Me(e), this.error = this.channels.length === 0 ? "Add real-time power sensors to your Energy dashboard." : void 0, this.captureSample(!0);
			} catch {
				this.error = "Power Orb could not read the Energy dashboard.";
			} finally {
				this.loading = !1;
			}
		}
	}
	currentPower() {
		return this._hass ? this.config.entity ? X(this._hass.states[this.config.entity]) : Ne(this._hass.states, this.channels) : null;
	}
	currentSnapshot() {
		return !this._hass || this.config.entity ? null : Fe(this._hass.states, this.channels);
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
		if (this.samples.length < 2) return F;
		let e = Math.max(...this.samples, 1), t = Math.max(this.samples.length - 1, 1);
		return N`
      <svg class="sparkline" viewBox="0 0 100 42" preserveAspectRatio="none"
        role="img" aria-label="Recent power trend">
        <polyline points=${this.samples.map((n, r) => {
			let i = r / t * 100, a = 38 - n / e * 34;
			return `${i.toFixed(2)},${a.toFixed(2)}`;
		}).join(" ")}></polyline>
      </svg>
    `;
	}
	flowValue(e) {
		if (!this._hass) return null;
		let t = this.flows.find((t) => t.kind === e);
		return t ? Pe(this._hass.states, t) : null;
	}
	flowLabel(e, t) {
		return Math.abs(t) < 1 ? "idle" : e === "grid" ? t > 0 ? "importing" : "exporting" : e === "battery" ? t > 0 ? "supplying" : "charging" : t > 0 ? "generating" : "idle";
	}
	renderFlow(e) {
		if (!this.flows.find((t) => t.kind === e)) return F;
		let t = this.flowValue(e), n = t === null ? void 0 : this.formatPower(Math.abs(t)), r = t !== null && Math.abs(t) >= 1, i = r ? Math.max(.9, 4.5 - Math.min(Math.abs(t), 1e4) / 2800) : 0, a = t !== null && t < 0 ? "outward" : "inward", o = {
			solar: "Solar",
			grid: "Grid",
			battery: "Battery"
		};
		return M`
      <div
        class=${`flow flow-${e} ${r ? a : "idle"}`}
        style=${`--flow-speed:${i}s`}
        aria-label=${`${o[e]} ${n ? `${n.value} ${n.unit}, ${this.flowLabel(e, t ?? 0)}` : "unavailable"}`}
      >
        <span class="flow-icon" aria-hidden="true"></span>
        <span class="flow-copy">
          <small>${o[e]}</small>
          <strong
            >${n ? M`${n.value}<em>${n.unit}</em>` : "ÔÇö"}</strong
          >
          <span>${t === null ? "unavailable" : this.flowLabel(e, t)}</span>
        </span>
      </div>
    `;
	}
	render() {
		let e = this.currentPower(), t = this.config.max_power ?? Math.max(...this.samples, e ?? 0, 5e3), n = e === null ? 0 : Math.min(1, Math.max(.08, e / t)), r = e === null ? void 0 : this.formatPower(e), i = this.currentSnapshot(), a = i ? Ie(i) : void 0;
		return M`
      <ha-card>
        <div class="card" style=${`--intensity:${n}`}>
          <header>
            <div>
              <small>Energy constellation</small>
              <span>${this.config.name ?? "Power Orb"}</span>
            </div>
            <span class="status" title="Live data">
              <i class=${e === null ? "offline" : ""}></i> live
            </span>
          </header>

          <div class=${`constellation ${this.config.entity ? "direct" : ""}`}>
            <svg
              class="flow-map"
              viewBox="0 0 600 360"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              ${[
			"solar",
			"grid",
			"battery"
		].map((e) => {
			if (!this.flows.some((t) => t.kind === e)) return F;
			let t = {
				solar: "M 105 78 C 185 78, 205 180, 300 180",
				grid: "M 495 78 C 415 78, 395 180, 300 180",
				battery: "M 105 286 C 185 286, 205 180, 300 180"
			}, n = this.flowValue(e), r = n !== null && Math.abs(n) >= 1, i = n !== null && n < 0 ? "outward" : "inward", a = r ? Math.max(.9, 4.5 - Math.min(Math.abs(n), 1e4) / 2800) : 0;
			return N`
                    <path class=${`track ${e}`} d=${t[e]}></path>
                    <path
                      class=${`energy ${e} ${r ? i : "idle"}`}
                      style=${`--flow-speed:${a}s`}
                      d=${t[e]}
                    ></path>
                  `;
		})}
            </svg>

            ${this.config.entity ? F : M`
                  ${this.renderFlow("solar")}
                  ${this.renderFlow("grid")}
                  ${this.renderFlow("battery")}
                `}

            <div class="home">
              <div class="orb" aria-hidden="true">
                <div class="facet"></div>
                <div class="core"></div>
                <div class="ring ring-one"></div>
                <div class="ring ring-two"></div>
              </div>
              <div class="reading" aria-live="polite">
                <small>Home</small>
                ${r ? M`<strong>${r.value}</strong
                      ><span>${r.unit}</span>` : M`<strong>ÔÇö</strong>`}
                <em>live demand</em>
              </div>
            </div>
          </div>

          <div class="trend">
            <span>60-second demand trace</span>
            ${this.sparkline()}
          </div>
          ${a ? M`
                <section class="insights" aria-label="Automatic energy insights">
                  <div>
                    <span>Self powered</span>
                    <strong>${a.selfPoweredPercent}<small>%</small></strong>
                  </div>
                  <div>
                    <span>Solar used</span>
                    <strong>${a.solarUsedPercent}<small>%</small></strong>
                  </div>
                  <p>${a.recommendation}</p>
                </section>
              ` : F}
          ${this.loading ? M`<p class="message">Discovering Energy dashboardÔÇª</p>` : this.error ? M`<p class="message error">${this.error}</p>` : M`<p class="message">
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
      --orb-solar: #ffc857;
      --orb-grid: #68a7ff;
      --orb-battery: #b68cff;
      --orb-home: #72f5dc;
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 45%, rgba(45, 120, 126, 0.15), transparent 35%),
        radial-gradient(circle at 8% 0%, rgba(95, 68, 132, 0.16), transparent 34%),
        linear-gradient(145deg, #11121a, #08090e 60%, #0d1018);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--primary-text-color, #f7f8ff);
    }
    .card {
      min-height: 500px;
      padding: 22px;
      position: relative;
      box-sizing: border-box;
    }
    .card::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.22;
      background-image: radial-gradient(rgba(255, 255, 255, 0.32) 0.5px, transparent 0.5px);
      background-size: 7px 7px;
      mask-image: linear-gradient(to bottom, black, transparent 70%);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    header div {
      display: grid;
      gap: 4px;
    }
    header div > small {
      color: #8f93a8;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    header div > span {
      font-size: 19px;
      font-weight: 650;
      letter-spacing: -0.02em;
    }
    .status {
      padding: 6px 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.035);
      color: #a7abbd;
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
      background: var(--orb-home);
      box-shadow: 0 0 8px var(--orb-home);
    }
    .status i.offline {
      background: #7f8b93;
      box-shadow: none;
    }
    .constellation {
      height: 350px;
      margin-top: 8px;
      position: relative;
    }
    .constellation.direct {
      display: grid;
      place-items: center;
    }
    .flow-map {
      position: absolute;
      width: 100%;
      height: 100%;
      inset: 0;
      overflow: visible;
    }
    .flow-map path {
      fill: none;
      vector-effect: non-scaling-stroke;
    }
    .flow-map .track {
      stroke: rgba(255, 255, 255, 0.08);
      stroke-width: 2;
    }
    .flow-map .energy {
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 1 14;
      animation: current var(--flow-speed) linear infinite;
      filter: drop-shadow(0 0 5px currentColor);
    }
    .flow-map .energy.inward {
      animation-direction: reverse;
    }
    .flow-map .energy.idle {
      opacity: 0.2;
      animation: none;
    }
    .flow-map .solar { color: var(--orb-solar); stroke: var(--orb-solar); }
    .flow-map .grid { color: var(--orb-grid); stroke: var(--orb-grid); }
    .flow-map .battery { color: var(--orb-battery); stroke: var(--orb-battery); }
    .flow {
      width: 116px;
      min-height: 68px;
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 9px;
      position: absolute;
      z-index: 2;
      box-sizing: border-box;
      border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
      border-radius: 16px;
      background: rgba(18, 20, 30, 0.76);
      box-shadow: inset 0 1px rgba(255, 255, 255, 0.055), 0 14px 35px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(12px);
    }
    .flow-solar,
    .flow-grid,
    .flow-battery {
      transform: translate(-50%, -50%);
    }
    .flow-solar { top: 21.67%; left: 17.5%; color: var(--orb-solar); }
    .flow-grid { top: 21.67%; left: 82.5%; color: var(--orb-grid); }
    .flow-battery { top: 79.44%; left: 17.5%; color: var(--orb-battery); }
    .flow-icon {
      width: 12px;
      height: 12px;
      flex: 0 0 auto;
      border: 2px solid currentColor;
      border-radius: 50%;
      box-shadow: 0 0 13px currentColor;
    }
    .flow-battery .flow-icon {
      border-radius: 3px;
    }
    .flow-grid .flow-icon {
      transform: rotate(45deg);
      border-radius: 2px;
    }
    .flow-copy {
      min-width: 0;
      display: grid;
    }
    .flow-copy small,
    .flow-copy > span {
      color: #8f93a8;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .flow-copy strong {
      margin: 2px 0;
      color: #f7f8ff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 16px;
      font-weight: 650;
      font-variant-numeric: tabular-nums;
    }
    .flow-copy em {
      margin-left: 3px;
      color: currentColor;
      font-size: 9px;
      font-style: normal;
    }
    .home {
      width: 174px;
      height: 174px;
      display: grid;
      place-items: center;
      position: absolute;
      z-index: 3;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .direct .home {
      position: relative;
      left: auto;
      top: auto;
      transform: none;
    }
    .orb {
      width: 146px;
      height: 146px;
      position: absolute;
      border-radius: 50%;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.12), transparent 38%),
        radial-gradient(circle at 45% 42%, #26363c 0%, #111b22 44%, #06090d 76%);
      border: 1px solid rgba(164, 255, 238, 0.24);
      box-shadow:
        0 0 calc(12px + 30px * var(--intensity)) rgba(85, 234, 211, calc(0.14 + 0.36 * var(--intensity))),
        inset -22px -18px 34px rgba(0, 0, 0, 0.62);
      transform: scale(calc(0.94 + 0.06 * var(--intensity)));
      transition: box-shadow 0.8s ease, transform 0.8s ease;
    }
    .facet {
      position: absolute;
      inset: 9%;
      border-radius: 42% 58% 48% 52%;
      background:
        linear-gradient(32deg, transparent 48%, rgba(145, 255, 235, 0.08) 49%, transparent 51%),
        linear-gradient(145deg, transparent 47%, rgba(255, 255, 255, 0.07) 48%, transparent 50%);
      transform: rotate(14deg);
    }
    .core {
      position: absolute;
      inset: 18%;
      border-radius: 50%;
      border: 1px solid rgba(155, 255, 237, 0.28);
      animation: breathe 3s ease-in-out infinite;
    }
    .ring {
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(114, 245, 220, 0.3);
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
      text-shadow: 0 2px 12px #001b18;
    }
    .reading strong {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 31px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .reading span {
      font-size: 15px;
      font-weight: 600;
    }
    .reading small,
    .reading em {
      grid-column: 1 / -1;
      color: rgba(221, 255, 249, 0.76);
      font-size: 9px;
      font-style: normal;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .reading small { margin-bottom: 5px; }
    .reading em { margin-top: 6px; }
    .trend {
      height: 54px;
      padding: 7px 10px 0;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.025);
    }
    .trend > span {
      position: absolute;
      color: #74788d;
      font-size: 8px;
      letter-spacing: 0.14em;
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
      stroke: var(--orb-home);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
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
    @keyframes current {
      to { stroke-dashoffset: 30; }
    }
    @media (max-width: 430px) {
      .card { padding: 17px; }
      .flow { width: 104px; padding: 8px; }
      .flow-copy strong { font-size: 14px; }
      .insights { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .insights p { grid-column: 1 / -1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .core, .ring-two, .flow-map .energy { animation: none; }
      .flow-map .energy { stroke-dasharray: none; opacity: 0.65; }
    }
  `;
	}
};
Q([Ee({ attribute: !1 })], $.prototype, "hass", null), Q([G()], $.prototype, "channels", void 0), Q([G()], $.prototype, "flows", void 0), Q([G()], $.prototype, "loading", void 0), Q([G()], $.prototype, "error", void 0), Q([G()], $.prototype, "samples", void 0), $ = Q([Ce("power-orb")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "power-orb") || window.customCards.push({
	type: "power-orb",
	name: "Power Orb",
	description: "Live home power from the Home Assistant Energy dashboard",
	documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
	preview: !0
});
//#endregion
export { $ as PowerOrbCard };
