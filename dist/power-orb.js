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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
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
}, re = (e, t) => !l(e, t), ie = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: re
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ie) {
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
		return this.elementProperties.get(e) ?? ie;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? re)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[g("elementProperties")] = /* @__PURE__ */ new Map(), v[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: v }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, ae = (e) => e, b = y.trustedTypes, oe = b ? b.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, se = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + x, le = `<${ce}>`, S = document, C = () => S.createComment(""), w = (e) => e === null || typeof e != "object" && typeof e != "function", ue = Array.isArray, de = (e) => ue(e) || typeof e?.[Symbol.iterator] == "function", fe = "[ 	\n\f\r]", T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pe = /-->/g, me = />/g, E = RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, ge = /"/g, _e = /^(?:script|style|textarea|title)$/i, ve = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), D = ve(1), O = ve(2), k = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), ye = /* @__PURE__ */ new WeakMap(), j = S.createTreeWalker(S, 129);
function be(e, t) {
	if (!ue(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
var xe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = T;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === T ? c[1] === "!--" ? o = pe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = E) : (_e.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = E) : o = me : o === E ? c[0] === ">" ? (o = i ?? T, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? E : c[3] === "\"" ? ge : he) : o === ge || o === he ? o = E : o === pe || o === me ? o = T : (o = E, i = void 0);
		let d = o === E && e[t + 1].startsWith("/>") ? " " : "";
		a += o === T ? n + le : l >= 0 ? (r.push(s), n.slice(0, l) + se + n.slice(l) + x + d) : n + x + (l === -2 ? t : d);
	}
	return [be(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, M = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = xe(t, n);
		if (this.el = e.createElement(l, r), j.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = j.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(se)) {
					let t = u[o++], n = i.getAttribute(e).split(x), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ce : r[1] === "?" ? we : r[1] === "@" ? Te : F
					}), i.removeAttribute(e);
				} else e.startsWith(x) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (_e.test(i.tagName)) {
					let e = i.textContent.split(x), t = e.length - 1;
					if (t > 0) {
						i.textContent = b ? b.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], C()), j.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], C());
					}
				}
			} else if (i.nodeType === 8) if (i.data === ce) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(x, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += x.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = S.createElement("template");
		return n.innerHTML = e, n;
	}
};
function N(e, t, n = e, r) {
	if (t === k) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = w(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = N(e, i._$AS(e, t.values), i, r)), t;
}
var Se = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? S).importNode(t, !0);
		j.currentNode = r;
		let i = j.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new P(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ee(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = j.nextNode(), a++);
		}
		return j.currentNode = S, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, P = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = N(this, e, t), w(e) ? e === A || e == null || e === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : e !== this._$AH && e !== k && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== A && w(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = M.createElement(be(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Se(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ye.get(e.strings);
		return t === void 0 && ye.set(e.strings, t = new M(e)), t;
	}
	k(t) {
		ue(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(C()), this.O(C()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ae(e).nextSibling;
			ae(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, F = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = A;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = N(this, e, t, 0), a = !w(e) || e !== this._$AH && e !== k, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = N(this, r[n + o], t, o), s === k && (s = this._$AH[o]), a ||= !w(s) || s !== this._$AH[o], s === A ? e = A : e !== A && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ce = class extends F {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === A ? void 0 : e;
	}
}, we = class extends F {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== A);
	}
}, Te = class extends F {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = N(this, e, t, 0) ?? A) === k) return;
		let n = this._$AH, r = e === A && n !== A || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== A && (n === A || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ee = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		N(this, e);
	}
}, De = y.litHtmlPolyfillSupport;
De?.(M, P), (y.litHtmlVersions ??= []).push("3.3.3");
var Oe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new P(t.insertBefore(C(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, I = globalThis, L = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oe(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return k;
	}
};
L._$litElement$ = !0, L.finalized = !0, I.litElementHydrateSupport?.({ LitElement: L });
var ke = I.litElementPolyfillSupport;
ke?.({ LitElement: L }), (I.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Ae = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, je = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	hasChanged: re
}, Me = (e = je, t, n) => {
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
function Ne(e) {
	return (t, n) => typeof n == "object" ? Me(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function R(e) {
	return Ne({
		...e,
		state: !0,
		attribute: !1
	});
}
function z(e) {
	return typeof e == "object" && !!e;
}
function B(e, t) {
	let n = e[t];
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function V(e, t, n, r) {
	if (!t) return;
	let i = e.find((e) => e.entityId === t && e.role === r);
	i ? i.multiplier += n : e.push({
		entityId: t,
		multiplier: n,
		role: r
	});
}
function Pe(e, t, n) {
	let r = B(t, "stat_rate"), i = B(t, "stat_rate_inverted");
	if (r || i) {
		V(e, r, 1, n.net), V(e, i, -1, n.net);
		return;
	}
	V(e, B(t, "stat_rate_from"), 1, n.positive), V(e, B(t, "stat_rate_to"), -1, n.negative);
}
function Fe(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.energy_sources ?? []) {
		if (!z(n)) continue;
		let e = B(n, "type");
		if (e !== "solar" && e !== "grid" && e !== "battery") continue;
		let r = t.get(e) ?? [];
		t.set(e, r);
		let i = z(n.power_config) ? n.power_config : n;
		if (e === "solar") V(r, B(n, "stat_rate"), 1, "solar");
		else if (e === "grid") {
			let e = B(n, "stat_rate");
			e ? V(r, e, 1, "grid") : Pe(r, i, {
				net: "grid",
				positive: "grid_import",
				negative: "grid_export"
			});
		} else e === "battery" && Pe(r, i, {
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
var Ie = {
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
function H(e, t, n) {
	let r = typeof e == "string" ? [e] : e;
	if (!Array.isArray(r) || r.length === 0 || r.some((e) => typeof e != "string" || !e)) throw Error(`${t}.${n} must contain one or more entity IDs`);
	return r;
}
function Le(e, t) {
	if (typeof t == "string" || Array.isArray(t)) return H(t, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if (!z(t)) throw Error(`${e} must contain one or more entity IDs`);
	let n = [
		"entity",
		"inverted",
		"from",
		"to"
	], r = Object.keys(t).filter((e) => !n.includes(e));
	if (r.length > 0) throw Error(`${e} does not support ${r.join(", ")}`);
	let i = "from" in t || "to" in t;
	if (Number("entity" in t) + Number("inverted" in t) + Number(i) > 1) throw Error(`${e} must use only one of entity, inverted, or from and to`);
	if ("entity" in t) return H(t.entity, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if ("inverted" in t) return H(t.inverted, e, "inverted").map((t) => ({
		entityId: t,
		multiplier: -1,
		role: e
	}));
	if (i) {
		if (e === "solar") throw Error("solar does not support from and to; use a single entity");
		if (!("from" in t) || !("to" in t)) throw Error(`${e} requires both from and to`);
		let n = Ie[e];
		return [...H(t.from, e, "from").map((e) => ({
			entityId: e,
			multiplier: 1,
			role: n.positive
		})), ...H(t.to, e, "to").map((e) => ({
			entityId: e,
			multiplier: -1,
			role: n.negative
		}))];
	}
	throw Error(`${e} must define entity, inverted, or from and to`);
}
function Re(e) {
	if (!z(e)) throw Error("entities must map solar, grid, or battery to entity IDs");
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
		let a = Le(i, t);
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
function ze(e) {
	return Fe(e).flatMap((e) => e.channels);
}
function Be(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = e.attributes.unit_of_measurement?.toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : n === "w" || n === void 0 ? t : null;
}
function Ve(e, t) {
	if (t.length === 0) return null;
	let n = 0;
	for (let r of t) {
		let t = Be(e[r.entityId]);
		if (t === null) return null;
		n += t * r.multiplier;
	}
	return Math.max(0, n);
}
function He(e, t) {
	let n = 0, r = 0;
	for (let i of t.channels) {
		let t = Be(e[i.entityId]);
		if (t === null) return null;
		n += t * i.multiplier, r += 1;
	}
	return r > 0 ? n : null;
}
function Ue(e, t) {
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
		let t = Be(e[r.entityId]);
		if (t === null) return null;
		let i = t * r.multiplier;
		n.activeChannels += 1, r.role === "solar" ? n.solar += i : r.role === "grid" || r.role === "grid_import" ? i >= 0 ? n.gridImport += i : n.gridExport += Math.abs(i) : r.role === "grid_export" ? i <= 0 ? n.gridExport += Math.abs(i) : n.gridImport += i : r.role === "battery" || r.role === "battery_discharge" ? i >= 0 ? n.batteryDischarge += i : n.batteryCharge += Math.abs(i) : r.role === "battery_charge" && (i <= 0 ? n.batteryCharge += Math.abs(i) : n.batteryDischarge += i);
	}
	return n.activeChannels === 0 ? null : (n.homeLoad = Math.max(0, n.solar + n.gridImport + n.batteryDischarge - n.gridExport - n.batteryCharge), n);
}
function We(e) {
	return Math.round(Math.min(100, Math.max(0, e * 100)));
}
function Ge(e) {
	let t = e.gridImport - e.gridExport, n = e.batteryDischarge - e.batteryCharge, r = e.homeLoad > 0 ? We((e.homeLoad - e.gridImport) / e.homeLoad) : 100, i = e.solar > 25 ? We((e.solar - e.gridExport) / e.solar) : null, a = "Waiting for enough live energy data.";
	return e.gridExport > 250 ? a = "Solar surplus now: run flexible loads or charge storage." : e.gridImport > 500 && e.solar > 0 ? a = "Importing from grid: shift flexible loads toward brighter periods." : e.batteryCharge > 250 ? a = "Battery is charging: preserve stored energy for the evening peak." : e.batteryDischarge > 250 ? a = "Battery is covering demand: keep heavy loads staggered." : e.solar > 0 && (a = "Solar is covering the home with minimal grid movement."), {
		selfPoweredPercent: r,
		solarUsedPercent: i,
		netGridWatts: t,
		netBatteryWatts: n,
		recommendation: a
	};
}
var Ke = 864e5, qe = /* @__PURE__ */ new Set([
	"w",
	"kw",
	"mw",
	"gw"
]);
function U(e, t) {
	let n = new Intl.DateTimeFormat("en-GB", {
		timeZone: t,
		hourCycle: "h23",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}), r = {};
	for (let t of n.formatToParts(new Date(e))) r[t.type] = t.value;
	return r;
}
function Je(e, t) {
	return Number(U(e, t).hour) % 24;
}
function Ye(e, t) {
	let n = U(e, t);
	return `${n.year}-${n.month}-${n.day}`;
}
function W(e, t) {
	let n = U(e, t), r = Date.UTC(Number(n.year), Number(n.month) - 1, Number(n.day)), i = U(r, t);
	return r - (Date.UTC(Number(i.year), Number(i.month) - 1, Number(i.day), Number(i.hour) % 24, Number(i.minute), Number(i.second)) - r);
}
function Xe(e, t, n) {
	return W(W(e, n) - t * Ke + Ke / 2, n);
}
function G(e, t) {
	let n = U(e, t);
	return Number(n.hour) % 24 + Number(n.minute) / 60 + Number(n.second) / 3600;
}
function K(e, t) {
	if (e.length === 0) return 0;
	let n = t * (e.length - 1), r = Math.floor(n), i = Math.ceil(n), a = e[r] ?? 0, o = e[i] ?? a;
	return r === i ? a : a + (o - a) * (n - r);
}
function Ze(e, t) {
	let n = 0;
	for (let r of e) {
		let e = t.get(r.entityId);
		if (!e || typeof e.mean != "number" || !Number.isFinite(e.mean)) return null;
		n += e.mean * r.multiplier;
	}
	return Math.max(0, n);
}
function Qe(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) for (let t of e[r.entityId] ?? []) {
		let e = n.get(t.start) ?? /* @__PURE__ */ new Map();
		e.set(r.entityId, t), n.set(t.start, e);
	}
	return n;
}
async function $e(e, t, n, r, i) {
	let a = {
		type: "recorder/statistics_during_period",
		start_time: new Date(n).toISOString(),
		statistic_ids: t,
		period: i,
		types: ["mean"],
		units: { power: "W" }
	};
	return r !== void 0 && (a.end_time = new Date(r).toISOString()), e.callWS(a);
}
async function et(e, t) {
	let n = [...new Set(t.map((e) => e.entityId))], r = await e.callWS({
		type: "recorder/get_statistics_metadata",
		statistic_ids: n
	}), i = /* @__PURE__ */ new Set();
	for (let e of r ?? []) {
		let t = e.display_unit_of_measurement?.toLowerCase(), n = e.unit_class === "power" || t !== void 0 && qe.has(t);
		e.has_mean !== !1 && n && i.add(e.statistic_id);
	}
	return n.filter((e) => !i.has(e));
}
async function tt(e, t, n, r) {
	let i = W(n, r), a = Xe(n, 28, r), o = Xe(n, 5, r), s = [...new Set(t.map((e) => e.entityId))], [c, l] = await Promise.all([$e(e, s, a, i, "hour"), $e(e, s, o, i, "5minute")]), u = Array.from({ length: 24 }, () => []), d = Array.from({ length: 24 }, () => []), f = /* @__PURE__ */ new Set();
	for (let [e, n] of Qe(c, t)) {
		let i = Ze(t, n);
		i !== null && (u[Je(e, r)]?.push(i), f.add(Ye(e, r)));
	}
	for (let [e, n] of Qe(l, t)) {
		let i = Ze(t, n);
		i !== null && d[Je(e, r)]?.push(i);
	}
	let p = u.map((e, t) => {
		if (e.length < 10) return null;
		let n = [...e].sort((e, t) => e - t), r = d[t] ?? [], i = r.length >= 20 ? [...r].sort((e, t) => e - t) : null;
		return {
			hour: t,
			low: K(n, .1),
			median: K(n, .5),
			high: K(n, .9),
			liveLow: i ? K(i, .1) : null,
			liveHigh: i ? K(i, .9) : null,
			samples: n.length
		};
	}), m = f.size, h = "ok";
	return p.every((e) => e === null) || m < 7 ? h = "learning" : m < 14 && (h = "provisional"), {
		hours: p,
		days: m,
		status: h
	};
}
async function nt(e, t, n, r) {
	let i = W(n, r), a = Qe(await $e(e, [...new Set(t.map((e) => e.entityId))], i, void 0, "hour"), t), o = Math.floor(n / 36e5) * 36e5, s = /* @__PURE__ */ new Map();
	for (let [e, n] of [...a.entries()].sort((e, t) => e[0] - t[0])) {
		if (e >= o) continue;
		let i = Ze(t, n);
		if (i === null) continue;
		let a = Je(e, r);
		s.set(a, {
			hour: a,
			watts: i
		});
	}
	return [...s.values()].sort((e, t) => e.hour - t.hour);
}
function rt(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${t(e)}:00\u2013${t((e + 1) % 24)}:00`;
}
function it(e, t) {
	if (!t || t.median < 50 || t.liveLow === null || t.liveHigh === null) return null;
	let n = rt(t.hour);
	if (e >= t.liveLow && e <= t.liveHigh) return {
		ratio: 1,
		direction: "normal",
		sentence: `Normal for ${n}`
	};
	let r = e / t.median, i = e > t.liveHigh ? "above" : "below";
	if (r >= 2) return {
		ratio: r,
		direction: i,
		sentence: `More than 2\u00d7 normal for ${n}`
	};
	if (r <= .5) return {
		ratio: r,
		direction: i,
		sentence: `Less than half normal for ${n}`
	};
	let a = Math.round(Math.abs(r - 1) * 20) * 5;
	return a === 0 ? {
		ratio: r,
		direction: i,
		sentence: `Just ${i} normal for ${n}`
	} : {
		ratio: r,
		direction: i,
		sentence: `${a}% ${i} normal for ${n}`
	};
}
function at(e) {
	if (!Number.isFinite(e) || e <= 0) return 1e3;
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * t;
}
function ot(e, t, n = "typical") {
	let r = [], i = [];
	for (let t of e) {
		let e = n === "live" ? t?.liveLow : t?.low, a = n === "live" ? t?.liveHigh : t?.high;
		if (!t || e == null || a == null) {
			i.length > 0 && r.push(i), i = [];
			continue;
		}
		i.push({
			hour: t.hour,
			low: e,
			high: a
		});
	}
	if (i.length > 0 && r.push(i), !t) return r;
	let a = r[0], o = r[r.length - 1], s = n !== "live" || e[0]?.liveLow !== null && e[23]?.liveLow !== null;
	if (!a || !o || !e[0] || !e[23] || !s) return r;
	if (r.length === 1) {
		let e = a[0];
		return e && a.push({
			...e,
			hour: 24
		}), r;
	}
	return r.pop(), r.shift(), r.push([...o, ...a.map((e) => ({
		...e,
		hour: e.hour + 24
	}))]), r;
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/decorate.js
function q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/power-orb-card.ts
var st = 300 * 1e3, ct = 300 * 1e3, J = 3600 * 1e3, lt = 30 * 1e3, ut = 300, dt = 400, Y = dt / 2, ft = 174, X = 80, pt = 5, mt = /* @__PURE__ */ new Map(), ht = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map();
function _t(e, t, n, r) {
	let i = e.get(n);
	if (i) return i;
	let a = r();
	e.set(n, a);
	for (let r of [...e.keys()]) r !== n && r.startsWith(t) && e.delete(r);
	return a;
}
function Z(e, t) {
	let n = e / 24 * Math.PI * 2 - Math.PI / 2;
	return [Y + t * Math.cos(n), Y + t * Math.sin(n)];
}
function Q(e) {
	return `${e[0].toFixed(2)},${e[1].toFixed(2)}`;
}
var $ = class extends L {
	constructor(...e) {
		super(...e), this.channels = [], this.flows = [], this.loading = !0, this.baseline = null, this.today = [], this.compact = !1, this.now = Date.now(), this.config = { type: "custom:power-orb" }, this.connectionGeneration = 0, this.historyAttempted = !1, this.historyRetried = !1;
	}
	set hass(e) {
		let t = this._hass;
		this._hass = e, (!t || this.watchedChanged(t, e)) && this.requestUpdate();
	}
	get hass() {
		return this._hass;
	}
	setConfig(e) {
		if (!e || e.type !== "custom:power-orb") throw Error("Power Orb requires type: custom:power-orb");
		if (e.max_power !== void 0 && e.max_power <= 0) throw Error("max_power must be greater than zero");
		if (e.entity && e.entities !== void 0) throw Error("Configure either entity or entities, not both");
		let t = e.entities === void 0 ? [] : Re(e.entities);
		this.config = e, this.channels = e.entity ? [{
			entityId: e.entity,
			multiplier: 1,
			role: "grid"
		}] : t.flatMap((e) => e.channels), this.flows = t, this.loading = !e.entity && e.entities === void 0, this.error = void 0, this.resetHistory(), this.disconnectData(), this.isConnected && this._hass && this.connect();
	}
	static getStubConfig() {
		return { type: "custom:power-orb" };
	}
	getCardSize() {
		return 10;
	}
	getGridOptions() {
		return {
			rows: 10,
			columns: 12,
			min_rows: 8,
			min_columns: 6
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.tickTimer = window.setInterval(() => {
			this.now = Date.now();
		}, lt), this.resizeObserver = new ResizeObserver((e) => {
			let t = e[0]?.contentRect.width ?? 0, n = t > 0 && t < ut;
			n !== this.compact && (this.compact = n);
		}), this.resizeObserver.observe(this), this._hass && this.connect();
	}
	disconnectedCallback() {
		this.disconnectData(), this.tickTimer !== void 0 && (window.clearInterval(this.tickTimer), this.tickTimer = void 0), this.resizeObserver?.disconnect(), this.resizeObserver = void 0, super.disconnectedCallback();
	}
	watchedChanged(e, t) {
		if (e.locale !== t.locale) return !0;
		for (let n of this.channels) if (e.states[n.entityId] !== t.states[n.entityId]) return !0;
		return !1;
	}
	get timeZone() {
		return this._hass?.config?.time_zone;
	}
	connect() {
		if (!this._hass) return Promise.resolve();
		if (this.connecting) return this.connecting;
		let e = this.connectionGeneration;
		return this.connecting = this.startDiscovery(e).finally(() => {
			e === this.connectionGeneration && (this.connecting = void 0);
		}), this.connecting;
	}
	async startDiscovery(e) {
		if (await this.loadEnergyPreferences(), !(e !== this.connectionGeneration || !this._hass) && (this.loadHistory(), this.historyTimer = window.setInterval(() => void this.loadHistory(!0), ct), !(this.config.entity || this.config.entities !== void 0))) {
			this.refreshTimer = window.setInterval(() => void this.loadEnergyPreferences(), st);
			try {
				let t = await this._hass.connection.subscribeEvents(() => void this.loadEnergyPreferences(), "power_orb_refresh");
				e === this.connectionGeneration ? this.unsubscribe = t : t();
			} catch {}
		}
	}
	disconnectData() {
		this.connectionGeneration += 1, this.unsubscribe?.(), this.unsubscribe = void 0;
		for (let e of [this.refreshTimer, this.historyTimer]) e !== void 0 && window.clearInterval(e);
		this.retryTimer !== void 0 && (window.clearTimeout(this.retryTimer), this.retryTimer = void 0), this.refreshTimer = void 0, this.historyTimer = void 0, this.connecting = void 0;
	}
	resetHistory() {
		this.baseline = null, this.today = [], this.historyNote = void 0, this.historyAttempted = !1, this.historyRetried = !1;
	}
	async loadEnergyPreferences() {
		if (!(!this._hass || this.config.entity || this.config.entities !== void 0)) {
			this.loading = !0;
			try {
				let e = await this._hass.callWS({ type: "energy/get_prefs" });
				this.flows = Fe(e), this.channels = ze(e), this.error = this.channels.length === 0 ? "Add real-time power sensors to your Energy dashboard." : void 0;
			} catch {
				this.error = "Power Orb could not read the Energy dashboard.";
			} finally {
				this.loading = !1;
			}
		}
	}
	async loadHistory(e = !1) {
		let t = this._hass;
		if (!t || this.channels.length === 0 || e && !this.historyAttempted) return;
		this.historyAttempted = !0;
		let n = Date.now(), r = `${[...new Set(this.channels.map((e) => e.entityId))].sort().join("|")}::`;
		try {
			let e = await _t(gt, r, `${r}${Math.floor(n / J)}`, () => et(t, this.channels));
			if (e.length > 0) {
				this.applyHistory({
					baseline: null,
					today: [],
					missing: e
				});
				return;
			}
			let [i, a] = await Promise.all([_t(mt, r, `${r}${Math.floor(n / J)}`, () => tt(t, this.channels, n, this.timeZone)), _t(ht, r, `${r}${Math.floor(n / ct)}`, () => nt(t, this.channels, n, this.timeZone))]);
			this.applyHistory({
				baseline: i,
				today: a,
				missing: []
			}), this.historyRetried = !1;
		} catch {
			if (gt.delete(`${r}${Math.floor(n / J)}`), mt.delete(`${r}${Math.floor(n / J)}`), ht.delete(`${r}${Math.floor(n / ct)}`), !this.historyRetried) {
				this.historyRetried = !0, this.retryTimer = window.setTimeout(() => void this.loadHistory(), 5e3);
				return;
			}
			this.baseline = null, this.today = [], this.historyNote = "Baseline unavailable — could not read recorder history.";
		}
	}
	applyHistory(e) {
		if (e.missing.length > 0) {
			this.baseline = null, this.today = [], this.historyNote = e.missing.length === 1 ? `No recorder statistics for ${e.missing[0]} — baseline unavailable.` : `No recorder statistics for ${e.missing.length} sensors — baseline unavailable.`;
			return;
		}
		this.today = e.today;
		let t = e.baseline;
		if (!t || t.status === "learning") {
			this.baseline = null, this.historyNote = `Learning your normal — ${t?.days ?? 0} of 7 days.`;
			return;
		}
		if (this.baseline = t, t.status === "provisional") {
			this.historyNote = `Provisional baseline — ${t.days} of 14 days.`;
			return;
		}
		let n = t.hours.some((e) => e?.liveHigh !== null);
		this.historyNote = n ? void 0 : "Not enough recorder detail for a live verdict — raise recorder purge_keep_days.";
	}
	currentPower() {
		return this._hass ? Ve(this._hass.states, this.channels) : null;
	}
	formatPower(e) {
		let t = this.config.unit === "kW" || this.config.unit === void 0 && Math.abs(e) >= 1e3, n = this._hass?.locale?.language ?? this._hass?.language, r = t ? e / 1e3 : e;
		return {
			value: new Intl.NumberFormat(n, { maximumFractionDigits: t ? 2 : 0 }).format(r),
			unit: t ? "kW" : "W"
		};
	}
	scaleMax() {
		let e = this.config.max_power ?? 0;
		for (let t of this.baseline?.hours ?? []) t && (e = Math.max(e, t.high, t.liveHigh ?? 0));
		for (let t of this.today) e = Math.max(e, t.watts);
		return at(Math.max(e, 1e3));
	}
	radius(e, t) {
		let n = Math.sqrt(Math.min(Math.max(e, 0), t) / t);
		return X + (ft - X) * n;
	}
	bandRuns(e, t = "typical") {
		return ot(this.baseline?.hours ?? [], e, t);
	}
	beadJoinsTrace(e) {
		let t = this.today[this.today.length - 1];
		if (!t) return !1;
		let n = Math.floor(e) - t.hour;
		return n === 0 || n === 1;
	}
	traceRuns() {
		let e = [], t = [];
		for (let n of this.today) {
			let r = t[t.length - 1];
			r && n.hour !== r.hour + 1 && (e.push(t), t = []), t.push(n);
		}
		return t.length > 0 && e.push(t), e;
	}
	renderBand(e) {
		let t = (t) => this.bandRuns(!0, t).map((n) => {
			let r = n.map((t) => {
				let n = this.radius(t.low, e), r = Math.max(this.radius(t.high, e), n + pt);
				return Q(Z(t.hour + .5, r));
			}), i = [...n].reverse().map((t) => Q(Z(t.hour + .5, this.radius(t.low, e))));
			return O`<polygon class=${`band band-${t}`}
          points=${[...r, ...i].join(" ")} />`;
		});
		return [...t("typical"), ...t("live")];
	}
	renderTicks(e) {
		let t = this.baseline?.hours;
		return t ? this.today.map((n) => {
			let r = t[n.hour];
			if (!r) return A;
			let i = n.watts > r.high, a = n.watts < r.low;
			if (!i && !a) return A;
			let o = Z(n.hour + .5, this.radius(i ? r.high : r.low, e)), s = Z(n.hour + .5, this.radius(n.watts, e));
			return O`<line
        class=${`tick ${i ? "above" : "below"}`}
        x1=${o[0]} y1=${o[1]} x2=${s[0]} y2=${s[1]}
      />`;
		}) : A;
	}
	tracePoints(e, t) {
		let n = this.traceRuns().map((t) => t.map((t) => Q(Z(t.hour + .5, this.radius(t.watts, e)))).join(" "));
		if (t !== null) {
			let r = G(this.now, this.timeZone), i = Q(Z(r, this.radius(t, e))), a = n[n.length - 1];
			a && this.beadJoinsTrace(r) && (n[n.length - 1] = `${a} ${i}`);
		}
		return n.filter((e) => e.includes(" "));
	}
	renderDial(e) {
		let t = this.scaleMax(), n = this.tracePoints(t, e), r = G(this.now, this.timeZone), i = e === null ? null : Z(r, this.radius(e, t)), a = this.formatPower(t);
		return O`
      <svg class="dial" viewBox="0 0 ${dt} ${dt}" role="img"
        aria-label=${this.summary(e)}>
        <circle class="rim" cx=${Y} cy=${Y} r=${ft} />
        <circle class="rim" cx=${Y} cy=${Y} r=${X} />
        ${[
			0,
			6,
			12,
			18
		].map((e) => {
			let t = Z(e, X), n = Z(e, ft), r = Z(e, 189);
			return O`
            <line class="spoke" x1=${t[0]} y1=${t[1]} x2=${n[0]} y2=${n[1]} />
            <text class="hour" x=${r[0]} y=${r[1]}>${String(e).padStart(2, "0")}</text>
          `;
		})}
        ${this.renderBand(t)} ${this.renderTicks(t)}
        ${n.map((e) => O`<polyline class="trace" points=${e} />`)}
        ${i ? O`
              <circle class="bead-halo" cx=${i[0]} cy=${i[1]} r="11" />
              <circle class="bead" cx=${i[0]} cy=${i[1]} r="6" />
            ` : A}
        <text class="scale" x=${Y} y="14">${a.value} ${a.unit}</text>
      </svg>
    `;
	}
	renderStrip(e) {
		let t = this.scaleMax(), n = (e) => 148 - 130 * Math.sqrt(Math.min(Math.max(e, 0), t) / t), r = (e) => e / 24 * 400, i = this.formatPower(t), a = this.baseline?.hours, o = ["typical", "live"].flatMap((e) => this.bandRuns(!1, e).map((t) => {
			let i = t.map((e) => {
				let t = n(e.low);
				return `${r(e.hour + .5)},${Math.min(n(e.high), t - pt)}`;
			}), a = [...t].reverse().map((e) => `${r(e.hour + .5)},${n(e.low)}`);
			return O`<polygon class=${`band band-${e}`}
          points=${[...i, ...a].join(" ")} />`;
		})), s = a ? this.today.map((e) => {
			let t = a[e.hour];
			if (!t) return A;
			let i = e.watts > t.high, o = e.watts < t.low;
			return !i && !o ? A : O`<line
            class=${`tick ${i ? "above" : "below"}`}
            x1=${r(e.hour + .5)} y1=${n(i ? t.high : t.low)}
            x2=${r(e.hour + .5)} y2=${n(e.watts)}
          />`;
		}) : A, c = this.traceRuns().map((e) => e.map((e) => `${r(e.hour + .5)},${n(e.watts)}`).join(" ")), l = G(this.now, this.timeZone), u = c[c.length - 1];
		return e !== null && u && this.beadJoinsTrace(l) && (c[c.length - 1] = `${u} ${r(l)},${n(e)}`), O`
      <svg class="strip" viewBox="0 0 ${400} ${170}" role="img"
        aria-label=${this.summary(e)}>
        ${[
			0,
			6,
			12,
			18
		].map((e) => O`
            <line class="spoke" x1=${r(e)} y1="18" x2=${r(e)} y2=${148} />
            <text class="hour" x=${r(e) + 4} y=${164}
              text-anchor="start">${String(e).padStart(2, "0")}</text>
          `)}
        ${o} ${s}
        ${c.filter((e) => e.includes(" ")).map((e) => O`<polyline class="trace" points=${e} />`)}
        ${e === null ? A : O`<circle class="bead" cx=${r(l)} cy=${n(e)} r="5" />`}
        <text class="scale" x="4" y="12" text-anchor="start">
          ${i.value} ${i.unit}
        </text>
      </svg>
    `;
	}
	flowValue(e) {
		if (!this._hass) return null;
		let t = this.flows.find((t) => t.kind === e);
		return t ? He(this._hass.states, t) : null;
	}
	flowLabel(e, t) {
		return Math.abs(t) < 25 ? "idle" : e === "grid" ? t > 0 ? "importing" : "exporting" : e === "battery" ? t > 0 ? "supplying" : "charging" : "generating";
	}
	renderChip(e) {
		if (!this.flows.some((t) => t.kind === e)) return A;
		let t = this.flowValue(e), n = t === null ? void 0 : this.formatPower(Math.abs(t));
		return D`
      <div class=${`chip chip-${e}`}>
        <span class="dot" aria-hidden="true"></span>
        <span class="chip-copy">
          <small>${{
			solar: "Solar",
			grid: "Grid",
			battery: "Battery"
		}[e]}</small>
          <strong
            >${n ? D`${n.value}<em>${n.unit}</em>` : "—"}</strong
          >
          <span>${t === null ? "unavailable" : this.flowLabel(e, t)}</span>
        </span>
      </div>
    `;
	}
	deviation(e) {
		if (e === null || !this.baseline) return null;
		let t = Math.floor(G(this.now, this.timeZone));
		return it(e, this.baseline.hours[t] ?? null);
	}
	summary(e) {
		if (e === null) return "Home power unavailable";
		let t = this.formatPower(e), n = this.deviation(e), r = `Home load ${t.value} ${t.unit}`;
		return n ? `${r}, ${n.sentence.toLowerCase()}` : r;
	}
	render() {
		let e = this.currentPower(), t = e === null ? void 0 : this.formatPower(e), n = this.deviation(e), r = this.config.entity || !this._hass ? null : Ue(this._hass.states, this.channels), i = r ? Ge(r).selfPoweredPercent : null;
		return D`
      <ha-card>
        <div class=${`card ${this.compact ? "is-compact" : ""}`}>
          <header>
            <div>
              <small>Today against normal</small>
              <span>${this.config.name ?? "Power Orb"}</span>
            </div>
            <span class="status" title="Live data">
              <i class=${e === null ? "offline" : ""}></i> live
            </span>
          </header>

          <div class="scene">
            ${this.compact ? this.renderStrip(e) : this.renderDial(e)}
            <div class="reading">
              ${t ? D`<strong>${t.value}</strong><span>${t.unit}</span>` : D`<strong>—</strong>`}
              <small>home now</small>
            </div>
          </div>

          <p
            class=${`verdict ${n ? n.direction : "unknown"}`}
            title=${n ? n.sentence : "Baseline not available yet"}
          >
            ${n ? n.sentence : "Comparing with your normal day"}
          </p>

          <div class="chips">
            ${this.renderChip("solar")} ${this.renderChip("grid")}
            ${this.renderChip("battery")}
            ${i === null ? A : D`
                  <div class="chip chip-self">
                    <span class="dot" aria-hidden="true"></span>
                    <span class="chip-copy">
                      <small>Self powered</small>
                      <strong>${i}<em>%</em></strong>
                      <span>of home load</span>
                    </span>
                  </div>
                `}
          </div>

          ${this.loading ? D`<p class="message">Discovering Energy dashboard…</p>` : this.error ? D`<p class="message error">${this.error}</p>` : this.historyNote ? D`<p class="message">${this.historyNote}</p>` : A}
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
      --orb-above: #ff7a5c;
      --orb-below: #a8e05f;
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 42%, rgba(45, 120, 126, 0.16), transparent 38%),
        radial-gradient(circle at 8% 0%, rgba(95, 68, 132, 0.16), transparent 34%),
        linear-gradient(145deg, #11121a, #08090e 60%, #0d1018);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #f7f8ff;
    }
    .card {
      padding: 20px;
      position: relative;
      box-sizing: border-box;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      color: #a7abbd;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
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
    .scene {
      margin-top: 10px;
      position: relative;
      display: grid;
      place-items: center;
    }
    .dial {
      width: 100%;
      max-width: 380px;
      height: auto;
      display: block;
    }
    .strip {
      width: 100%;
      height: auto;
      display: block;
    }
    .rim {
      fill: none;
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 1;
    }
    .spoke {
      stroke: rgba(255, 255, 255, 0.2);
      stroke-width: 1;
    }
    .hour,
    .scale {
      fill: #8b90a6;
      font-size: 13px;
      text-anchor: middle;
      letter-spacing: 0.08em;
    }
    .hour {
      dominant-baseline: middle;
    }
    .scale {
      font-size: 12px;
    }
    .band {
      fill: rgba(160, 178, 210, 0.24);
      stroke: rgba(196, 212, 238, 0.55);
      stroke-width: 1;
      stroke-linejoin: round;
    }
    .band-live {
      fill: none;
      stroke: rgba(196, 212, 238, 0.34);
      stroke-dasharray: 4 4;
    }
    .tick {
      stroke-width: 4;
    }
    .tick.above {
      stroke: var(--orb-above);
      stroke-dasharray: 3 3;
    }
    .tick.below {
      stroke: var(--orb-below);
    }
    .trace {
      fill: none;
      stroke: var(--orb-home);
      stroke-width: 2.5;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .bead {
      fill: var(--orb-home);
    }
    .bead-halo {
      fill: none;
      stroke: var(--orb-home);
      stroke-width: 2;
      opacity: 0.5;
      animation: pulse 2.4s ease-out infinite;
    }
    .reading {
      position: absolute;
      display: grid;
      grid-template-columns: auto auto;
      align-items: baseline;
      justify-content: center;
      gap: 5px;
      text-align: center;
      pointer-events: none;
    }
    .is-compact .reading {
      position: static;
      margin-top: 4px;
    }
    .reading strong {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 34px;
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
      color: rgba(221, 255, 249, 0.72);
      font-size: 9px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .verdict {
      margin: 12px 0 0;
      padding: 9px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      font-size: 13px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .verdict.above {
      color: var(--orb-above);
    }
    .verdict.below {
      color: var(--orb-below);
    }
    .verdict.unknown {
      color: #9aa0b4;
    }
    .chips {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 10px;
      border-radius: 12px;
      background: rgba(20, 22, 32, 0.9);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
    }
    .chip-solar {
      color: var(--orb-solar);
    }
    .chip-grid {
      color: var(--orb-grid);
    }
    .chip-battery {
      color: var(--orb-battery);
    }
    .chip-self {
      color: var(--orb-home);
    }
    .dot {
      width: 10px;
      height: 10px;
      flex: 0 0 auto;
      border: 2px solid currentColor;
      border-radius: 50%;
    }
    .chip-battery .dot {
      border-radius: 3px;
    }
    .chip-grid .dot {
      transform: rotate(45deg);
      border-radius: 2px;
    }
    .chip-copy {
      min-width: 0;
      display: grid;
    }
    .chip-copy small,
    .chip-copy > span {
      color: #8f93a8;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-copy strong {
      margin: 2px 0;
      color: #f7f8ff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 15px;
      font-variant-numeric: tabular-nums;
    }
    .chip-copy em {
      margin-left: 3px;
      color: currentColor;
      font-size: 9px;
      font-style: normal;
    }
    .message {
      margin: 8px 0 0;
      color: #9aa0b4;
      font-size: 11px;
      text-align: center;
    }
    .message.error {
      color: var(--error-color, #ff7b7b);
    }
    @keyframes pulse {
      to {
        opacity: 0;
        stroke-width: 5;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bead-halo {
        animation: none;
        opacity: 0.35;
      }
    }
  `;
	}
};
q([Ne({ attribute: !1 })], $.prototype, "hass", null), q([R()], $.prototype, "channels", void 0), q([R()], $.prototype, "flows", void 0), q([R()], $.prototype, "loading", void 0), q([R()], $.prototype, "error", void 0), q([R()], $.prototype, "baseline", void 0), q([R()], $.prototype, "today", void 0), q([R()], $.prototype, "historyNote", void 0), q([R()], $.prototype, "compact", void 0), q([R()], $.prototype, "now", void 0), $ = q([Ae("power-orb")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "power-orb") || window.customCards.push({
	type: "power-orb",
	name: "Power Orb",
	description: "Live home power compared with your own normal day",
	documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
	preview: !0
});
//#endregion
export { $ as PowerOrbCard };
