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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: f } = Object, p = globalThis, ne = p.trustedTypes, re = ne ? ne.emptyScript : "", ie = p.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
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
}, ae = (e, t) => !l(e, t), oe = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: ae
};
Symbol.metadata ??= Symbol("metadata"), p.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = f(this);
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
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ae)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[m("elementProperties")] = /* @__PURE__ */ new Map(), g[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: g }), (p.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var _ = globalThis, se = (e) => e, v = _.trustedTypes, ce = v ? v.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, le = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + y, de = `<${ue}>`, b = document, x = () => b.createComment(""), S = (e) => e === null || typeof e != "object" && typeof e != "function", fe = Array.isArray, pe = (e) => fe(e) || typeof e?.[Symbol.iterator] == "function", me = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, be = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), T = be(1), E = be(2), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), k = b.createTreeWalker(b, 129);
function Se(e, t) {
	if (!fe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ce === void 0 ? t : ce.createHTML(t);
}
var Ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + le + n.slice(l) + y + d) : n + y + (l === -2 ? t : d);
	}
	return [Se(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, A = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ce(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(le)) {
					let t = u[o++], n = i.getAttribute(e).split(y), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : N
					}), i.removeAttribute(e);
				} else e.startsWith(y) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(y), t = e.length - 1;
					if (t > 0) {
						i.textContent = v ? v.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], x()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], x());
					}
				}
			} else if (i.nodeType === 8) if (i.data === ue) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(y, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += y.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function j(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = S(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = j(e, i._$AS(e, t.values), i, r)), t;
}
var we = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new M(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = b, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, M = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = j(this, e, t), S(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && S(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = A.createElement(Se(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new we(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = xe.get(e.strings);
		return t === void 0 && xe.set(e.strings, t = new A(e)), t;
	}
	k(t) {
		fe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(x()), this.O(x()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = se(e).nextSibling;
			se(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, N = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = j(this, e, t, 0), a = !S(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = j(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !S(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends N {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, Ee = class extends N {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, De = class extends N {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = j(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Oe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		j(this, e);
	}
}, ke = _.litHtmlPolyfillSupport;
ke?.(A, M), (_.litHtmlVersions ??= []).push("3.3.3");
var Ae = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new M(t.insertBefore(x(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, je = globalThis, P = class extends g {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ae(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return D;
	}
};
P._$litElement$ = !0, P.finalized = !0, je.litElementHydrateSupport?.({ LitElement: P });
var Me = je.litElementPolyfillSupport;
Me?.({ LitElement: P }), (je.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Ne = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Pe = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: ae
}, Fe = (e = Pe, t, n) => {
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
function Ie(e) {
	return (t, n) => typeof n == "object" ? Fe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function F(e) {
	return Ie({
		...e,
		state: !0,
		attribute: !1
	});
}
function I(e) {
	return typeof e == "object" && !!e;
}
function L(e, t) {
	let n = e[t];
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function R(e, t, n, r) {
	if (!t) return;
	let i = e.find((e) => e.entityId === t && e.role === r);
	i ? i.multiplier += n : e.push({
		entityId: t,
		multiplier: n,
		role: r
	});
}
function Le(e, t, n) {
	let r = L(t, "stat_rate"), i = L(t, "stat_rate_inverted");
	if (r || i) {
		R(e, r, 1, n.net), R(e, i, -1, n.net);
		return;
	}
	R(e, L(t, "stat_rate_from"), 1, n.positive), R(e, L(t, "stat_rate_to"), -1, n.negative);
}
function Re(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.energy_sources ?? []) {
		if (!I(n)) continue;
		let e = L(n, "type");
		if (e !== "solar" && e !== "grid" && e !== "battery") continue;
		let r = t.get(e) ?? [];
		t.set(e, r);
		let i = I(n.power_config) ? n.power_config : n;
		if (e === "solar") R(r, L(n, "stat_rate"), 1, "solar");
		else if (e === "grid") {
			let e = L(n, "stat_rate");
			e ? R(r, e, 1, "grid") : Le(r, i, {
				net: "grid",
				positive: "grid_import",
				negative: "grid_export"
			});
		} else e === "battery" && Le(r, i, {
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
var ze = {
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
function z(e, t, n) {
	let r = typeof e == "string" ? [e] : e;
	if (!Array.isArray(r) || r.length === 0 || r.some((e) => typeof e != "string" || !e)) throw Error(`${t}.${n} must contain one or more entity IDs`);
	return r;
}
function Be(e, t) {
	if (typeof t == "string" || Array.isArray(t)) return z(t, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if (!I(t)) throw Error(`${e} must contain one or more entity IDs`);
	let n = [
		"entity",
		"inverted",
		"from",
		"to"
	], r = Object.keys(t).filter((e) => !n.includes(e));
	if (r.length > 0) throw Error(`${e} does not support ${r.join(", ")}`);
	let i = "from" in t || "to" in t;
	if (Number("entity" in t) + Number("inverted" in t) + Number(i) > 1) throw Error(`${e} must use only one of entity, inverted, or from and to`);
	if ("entity" in t) return z(t.entity, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if ("inverted" in t) return z(t.inverted, e, "inverted").map((t) => ({
		entityId: t,
		multiplier: -1,
		role: e
	}));
	if (i) {
		if (e === "solar") throw Error("solar does not support from and to; use a single entity");
		if (!("from" in t) || !("to" in t)) throw Error(`${e} requires both from and to`);
		let n = ze[e];
		return [...z(t.from, e, "from").map((e) => ({
			entityId: e,
			multiplier: 1,
			role: n.positive
		})), ...z(t.to, e, "to").map((e) => ({
			entityId: e,
			multiplier: -1,
			role: n.negative
		}))];
	}
	throw Error(`${e} must define entity, inverted, or from and to`);
}
function Ve(e) {
	if (!I(e)) throw Error("entities must map solar, grid, or battery to entity IDs");
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
		let a = Be(i, t);
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
function He(e) {
	return Re(e).flatMap((e) => e.channels);
}
function Ue(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = e.attributes.unit_of_measurement?.toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : n === "w" || n === void 0 ? t : null;
}
function We(e, t) {
	if (t.length === 0) return null;
	let n = 0;
	for (let r of t) {
		let t = Ue(e[r.entityId]);
		if (t === null) return null;
		n += t * r.multiplier;
	}
	return Math.max(0, n);
}
function Ge(e, t) {
	let n = 0, r = 0;
	for (let i of t.channels) {
		let t = Ue(e[i.entityId]);
		if (t === null) return null;
		n += t * i.multiplier, r += 1;
	}
	return r > 0 ? n : null;
}
function Ke(e, t) {
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
		let t = Ue(e[r.entityId]);
		if (t === null) return null;
		let i = t * r.multiplier;
		n.activeChannels += 1, r.role === "solar" ? n.solar += i : r.role === "grid" || r.role === "grid_import" ? i >= 0 ? n.gridImport += i : n.gridExport += Math.abs(i) : r.role === "grid_export" ? i <= 0 ? n.gridExport += Math.abs(i) : n.gridImport += i : r.role === "battery" || r.role === "battery_discharge" ? i >= 0 ? n.batteryDischarge += i : n.batteryCharge += Math.abs(i) : r.role === "battery_charge" && (i <= 0 ? n.batteryCharge += Math.abs(i) : n.batteryDischarge += i);
	}
	return n.activeChannels === 0 ? null : (n.homeLoad = Math.max(0, n.solar + n.gridImport + n.batteryDischarge - n.gridExport - n.batteryCharge), n);
}
function qe(e) {
	return Math.round(Math.min(100, Math.max(0, e * 100)));
}
function Je(e) {
	let t = e.gridImport - e.gridExport, n = e.batteryDischarge - e.batteryCharge, r = e.homeLoad > 0 ? qe((e.homeLoad - e.gridImport) / e.homeLoad) : 100, i = e.solar > 25 ? qe((e.solar - e.gridExport) / e.solar) : null, a = "Waiting for enough live energy data.";
	return e.gridExport > 250 ? a = "Solar surplus now: run flexible loads or charge storage." : e.gridImport > 500 && e.solar > 0 ? a = "Importing from grid: shift flexible loads toward brighter periods." : e.batteryCharge > 250 ? a = "Battery is charging: preserve stored energy for the evening peak." : e.batteryDischarge > 250 ? a = "Battery is covering demand: keep heavy loads staggered." : e.solar > 0 && (a = "Solar is covering the home with minimal grid movement."), {
		selfPoweredPercent: r,
		solarUsedPercent: i,
		netGridWatts: t,
		netBatteryWatts: n,
		recommendation: a
	};
}
var Ye = 864e5, Xe = /* @__PURE__ */ new Set([
	"w",
	"kw",
	"mw",
	"gw"
]);
function B(e, t) {
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
function Ze(e, t) {
	return Number(B(e, t).hour) % 24;
}
function Qe(e, t) {
	let n = B(e, t);
	return `${n.year}-${n.month}-${n.day}`;
}
function V(e, t) {
	let n = B(e, t), r = Date.UTC(Number(n.year), Number(n.month) - 1, Number(n.day)), i = B(r, t);
	return r - (Date.UTC(Number(i.year), Number(i.month) - 1, Number(i.day), Number(i.hour) % 24, Number(i.minute), Number(i.second)) - r);
}
function $e(e, t, n) {
	return V(V(e, n) - t * Ye + Ye / 2, n);
}
function H(e, t) {
	let n = B(e, t);
	return Number(n.hour) % 24 + Number(n.minute) / 60 + Number(n.second) / 3600;
}
function U(e, t) {
	if (e.length === 0) return 0;
	let n = t * (e.length - 1), r = Math.floor(n), i = Math.ceil(n), a = e[r] ?? 0, o = e[i] ?? a;
	return r === i ? a : a + (o - a) * (n - r);
}
function et(e, t) {
	let n = 0;
	for (let r of e) {
		let e = t.get(r.entityId);
		if (!e || typeof e.mean != "number" || !Number.isFinite(e.mean)) return null;
		n += e.mean * r.multiplier;
	}
	return Math.max(0, n);
}
function tt(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) for (let t of e[r.entityId] ?? []) {
		let e = n.get(t.start) ?? /* @__PURE__ */ new Map();
		e.set(r.entityId, t), n.set(t.start, e);
	}
	return n;
}
async function nt(e, t, n, r, i) {
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
async function rt(e, t) {
	let n = [...new Set(t.map((e) => e.entityId))], r = await e.callWS({
		type: "recorder/get_statistics_metadata",
		statistic_ids: n
	}), i = /* @__PURE__ */ new Set();
	for (let e of r ?? []) {
		let t = e.display_unit_of_measurement?.toLowerCase(), n = e.unit_class === "power" || t !== void 0 && Xe.has(t);
		e.has_mean !== !1 && n && i.add(e.statistic_id);
	}
	return n.filter((e) => !i.has(e));
}
async function it(e, t, n, r) {
	let i = V(n, r), a = $e(n, 28, r), o = $e(n, 5, r), s = [...new Set(t.map((e) => e.entityId))], [c, l] = await Promise.all([nt(e, s, a, i, "hour"), nt(e, s, o, i, "5minute")]), u = Array.from({ length: 24 }, () => []), d = Array.from({ length: 24 }, () => []), ee = /* @__PURE__ */ new Set();
	for (let [e, n] of tt(c, t)) {
		let i = et(t, n);
		i !== null && (u[Ze(e, r)]?.push(i), ee.add(Qe(e, r)));
	}
	for (let [e, n] of tt(l, t)) {
		let i = et(t, n);
		i !== null && d[Ze(e, r)]?.push(i);
	}
	let te = u.map((e, t) => {
		if (e.length < 10) return null;
		let n = [...e].sort((e, t) => e - t), r = d[t] ?? [], i = r.length >= 20 ? [...r].sort((e, t) => e - t) : null;
		return {
			hour: t,
			low: U(n, .1),
			median: U(n, .5),
			high: U(n, .9),
			liveLow: i ? U(i, .1) : null,
			liveHigh: i ? U(i, .9) : null,
			samples: n.length
		};
	}), f = ee.size, p = "ok";
	return te.every((e) => e === null) || f < 7 ? p = "learning" : f < 14 && (p = "provisional"), {
		hours: te,
		days: f,
		status: p
	};
}
async function at(e, t, n, r) {
	let i = V(n, r), a = tt(await nt(e, [...new Set(t.map((e) => e.entityId))], i, void 0, "hour"), t), o = Math.floor(n / 36e5) * 36e5, s = /* @__PURE__ */ new Map();
	for (let [e, n] of [...a.entries()].sort((e, t) => e[0] - t[0])) {
		if (e >= o) continue;
		let i = et(t, n);
		if (i === null) continue;
		let a = Ze(e, r);
		s.set(a, {
			hour: a,
			watts: i
		});
	}
	return [...s.values()].sort((e, t) => e.hour - t.hour);
}
function ot(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${t(e)}:00\u2013${t((e + 1) % 24)}:00`;
}
var st = 1.1;
function ct(e) {
	return {
		low: e.liveLow ?? e.low,
		high: e.liveHigh ?? e.high
	};
}
function W(e) {
	return e.liveLow === null || e.liveHigh === null ? null : {
		low: e.liveLow / st,
		high: e.liveHigh * st
	};
}
function lt(e, t) {
	if (!t || t.median < 50) return null;
	let n = W(t);
	if (!n) return null;
	let r = ot(t.hour);
	if (e >= n.low && e <= n.high) return {
		ratio: 1,
		direction: "normal",
		sentence: `Normal for ${r}`
	};
	let i = e > n.high, a = i ? "above" : "below", o = e / Math.max(i ? t.liveHigh : t.liveLow, 1);
	return i && o >= 2 ? {
		ratio: o,
		direction: a,
		sentence: `More than 2\u00d7 the usual range for ${r}`
	} : !i && o <= .5 ? {
		ratio: o,
		direction: a,
		sentence: `Less than half the usual range for ${r}`
	} : {
		ratio: o,
		direction: a,
		sentence: `${Math.round(Math.abs(o - 1) * 20) * 5}% ${a} the usual range for ${r}`
	};
}
function ut(e) {
	if (!Number.isFinite(e) || e <= 0) return 1e3;
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * t;
}
function dt(e, t) {
	let n = [], r = [];
	for (let t of e) {
		if (!t) {
			r.length > 0 && n.push(r), r = [];
			continue;
		}
		r.push({
			hour: t.hour,
			...ct(t)
		});
	}
	if (r.length > 0 && n.push(r), !t) return n;
	let i = n[0], a = n[n.length - 1];
	if (!i || !a || !e[0] || !e[23]) return n;
	if (n.length === 1) {
		let e = i[0];
		return e && i.push({
			...e,
			hour: 24
		}), n;
	}
	return n.pop(), n.shift(), n.push([...a, ...i.map((e) => ({
		...e,
		hour: e.hour + 24
	}))]), n;
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/decorate.js
function G(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/power-orb-card.ts
var ft = 300 * 1e3, pt = 300 * 1e3, K = 3600 * 1e3, mt = 30 * 1e3, ht = 300, gt = 400, q = gt / 2, J = 174, Y = 62, _t = 5, vt = 9, yt = /* @__PURE__ */ new Map(), bt = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map();
function X(e, t, n, r) {
	let i = e.get(n);
	if (i) return i;
	let a = r();
	e.set(n, a);
	for (let r of [...e.keys()]) r !== n && r.startsWith(t) && e.delete(r);
	return a;
}
function Z(e, t) {
	let n = e / 24 * Math.PI * 2 - Math.PI / 2;
	return [q + t * Math.cos(n), q + t * Math.sin(n)];
}
function Q(e) {
	return `${e[0].toFixed(2)},${e[1].toFixed(2)}`;
}
function St(e, t, n, r) {
	if (t - e < .01) return "";
	let i = +(t - e > 12), a = Z(e, r), o = Z(t, r), s = Z(t, n), c = Z(e, n);
	return [
		`M ${Q(a)}`,
		`A ${r} ${r} 0 ${i} 1 ${Q(o)}`,
		`L ${Q(s)}`,
		`A ${n} ${n} 0 ${i} 0 ${Q(c)}`,
		"Z"
	].join(" ");
}
var $ = class extends P {
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
		let t = e.entities === void 0 ? [] : Ve(e.entities);
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
		}, mt), this.resizeObserver = new ResizeObserver((e) => {
			let t = e[0]?.contentRect.width ?? 0, n = t > 0 && t < ht;
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
		if (await this.loadEnergyPreferences(), !(e !== this.connectionGeneration || !this._hass) && (this.loadHistory(), this.historyTimer = window.setInterval(() => void this.loadHistory(!0), pt), !(this.config.entity || this.config.entities !== void 0))) {
			this.refreshTimer = window.setInterval(() => void this.loadEnergyPreferences(), ft);
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
				this.flows = Re(e), this.channels = He(e), this.error = this.channels.length === 0 ? "Add real-time power sensors to your Energy dashboard." : void 0;
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
			let e = await X(xt, r, `${r}${Math.floor(n / K)}`, () => rt(t, this.channels));
			if (e.length > 0) {
				this.applyHistory({
					baseline: null,
					today: [],
					missing: e
				});
				return;
			}
			let [i, a] = await Promise.all([X(yt, r, `${r}${Math.floor(n / K)}`, () => it(t, this.channels, n, this.timeZone)), X(bt, r, `${r}${Math.floor(n / pt)}`, () => at(t, this.channels, n, this.timeZone))]);
			this.applyHistory({
				baseline: i,
				today: a,
				missing: []
			}), this.historyRetried = !1;
		} catch {
			if (xt.delete(`${r}${Math.floor(n / K)}`), yt.delete(`${r}${Math.floor(n / K)}`), bt.delete(`${r}${Math.floor(n / pt)}`), !this.historyRetried) {
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
		return this._hass ? We(this._hass.states, this.channels) : null;
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
		return ut(Math.max(e, 1e3));
	}
	radius(e, t) {
		let n = Math.sqrt(Math.min(Math.max(e, 0), t) / t);
		return Y + (J - Y) * n;
	}
	bandRuns(e) {
		return dt(this.baseline?.hours ?? [], e);
	}
	departure(e, t) {
		let n = this.baseline?.hours[e];
		if (!n) return null;
		let r = W(n);
		return r ? t > r.high ? "above" : t < r.low ? "below" : null : null;
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
		return this.bandRuns(!0).map((t) => {
			let n = t.map((t) => {
				let n = this.radius(t.low, e), r = Math.max(this.radius(t.high, e), n + _t);
				return Q(Z(t.hour + .5, r));
			}), r = [...t].reverse().map((t) => Q(Z(t.hour + .5, this.radius(t.low, e))));
			return E`<polygon class="band" points=${[...n, ...r].join(" ")} />`;
		});
	}
	renderTicks(e, t) {
		let n = this.baseline?.hours;
		if (!n) return O;
		let r = this.today.map((t) => {
			let r = n[t.hour];
			return r ? this.tick(t.hour + .5, t.watts, r, e) : O;
		}), i = H(this.now, this.timeZone), a = n[Math.floor(i)];
		return t !== null && a && r.push(this.tick(i, t, a, e)), r;
	}
	tick(e, t, n, r) {
		let i = W(n);
		if (!i) return O;
		let a = t > i.high;
		if (!a && t >= i.low) return O;
		let o = this.radius(a ? i.high : i.low, r), s = this.radius(t, r), c = Math.abs(s - o) < vt ? o + (a ? vt : -9) : s, l = Z(e, o), u = Z(e, c);
		return E`<line
      class=${`tick ${a ? "above" : "below"}`}
      x1=${l[0]} y1=${l[1]} x2=${u[0]} y2=${u[1]}
    />`;
	}
	traceSegments(e, t) {
		let n = [];
		for (let e of this.traceRuns()) {
			n.length > 0 && n.push({
				hour: -1,
				watts: 0,
				state: "break"
			});
			for (let t of e) n.push({
				hour: t.hour + .5,
				watts: t.watts,
				state: this.departure(t.hour, t.watts) ?? "normal"
			});
		}
		let r = H(this.now, this.timeZone);
		t !== null && this.beadJoinsTrace(r) && n.push({
			hour: r,
			watts: t,
			state: this.departure(Math.floor(r), t) ?? "normal"
		});
		let i = [];
		for (let t = 1; t < n.length; t += 1) {
			let r = n[t - 1], a = n[t];
			!r || !a || r.state === "break" || a.state === "break" || i.push({
				state: a.state === "normal" ? r.state : a.state,
				points: `${Q(Z(r.hour, this.radius(r.watts, e)))} ${Q(Z(a.hour, this.radius(a.watts, e)))}`
			});
		}
		return i;
	}
	renderDial(e) {
		let t = this.scaleMax(), n = H(this.now, this.timeZone), r = e === null ? null : Z(n, this.radius(e, t)), i = this.formatPower(t), a = this.formatPower(t / 4);
		return E`
      <svg class="dial" viewBox="0 0 ${gt} ${gt}" role="img"
        aria-label=${this.summary(e)}>
        <circle class="rim" cx=${q} cy=${q} r=${J} />
        <circle class="rim" cx=${q} cy=${q} r=${Y} />
        <circle class="rim mid" cx=${q} cy=${q}
          r=${this.radius(t / 4, t)} />
        ${[
			0,
			6,
			12,
			18
		].map((e) => {
			let t = Z(e, Y), n = Z(e, J), r = Z(e, 189);
			return E`
            <line class="spoke" x1=${t[0]} y1=${t[1]} x2=${n[0]} y2=${n[1]} />
            <text class="hour" x=${r[0]} y=${r[1]}>${String(e).padStart(2, "0")}</text>
          `;
		})}
        ${this.renderBand(t)} ${this.renderTicks(t, e)}
        ${this.traceSegments(t, e).map((e) => E`<polyline class=${`trace ${e.state}`} points=${e.points} />`)}
        ${r ? E`
              <circle class="bead-halo" cx=${r[0]} cy=${r[1]} r="11" />
              <circle class="bead" cx=${r[0]} cy=${r[1]} r="6" />
            ` : O}
        <path class="future" d=${St(n, 24, Y, J)} />
        <text class="scale" x=${Z(21, J)[0]} y=${Z(21, J)[1]}>
          ${i.value} ${i.unit}
        </text>
        <text class="scale" x=${Z(21, this.radius(t / 4, t))[0]}
          y=${Z(21, this.radius(t / 4, t))[1]}>
          ${a.value} ${a.unit}
        </text>
      </svg>
    `;
	}
	renderStrip(e) {
		let t = this.scaleMax(), n = (e) => 148 - 130 * Math.sqrt(Math.min(Math.max(e, 0), t) / t), r = (e) => e / 24 * 400, i = this.formatPower(t), a = this.baseline?.hours, o = this.bandRuns(!1).map((e) => {
			let t = e.map((e) => {
				let t = n(e.low);
				return `${r(e.hour + .5)},${Math.min(n(e.high), t - _t)}`;
			}), i = [...e].reverse().map((e) => `${r(e.hour + .5)},${n(e.low)}`);
			return E`<polygon class="band" points=${[...t, ...i].join(" ")} />`;
		}), s = a ? this.today.map((e) => {
			let t = a[e.hour];
			if (!t) return O;
			let i = W(t);
			if (!i) return O;
			let o = e.watts > i.high;
			return !o && e.watts >= i.low ? O : E`<line
            class=${`tick ${o ? "above" : "below"}`}
            x1=${r(e.hour + .5)} y1=${n(o ? i.high : i.low)}
            x2=${r(e.hour + .5)} y2=${n(e.watts)}
          />`;
		}) : O, c = this.traceRuns().map((e) => e.map((e) => `${r(e.hour + .5)},${n(e.watts)}`).join(" ")), l = H(this.now, this.timeZone), u = c[c.length - 1];
		return e !== null && u && this.beadJoinsTrace(l) && (c[c.length - 1] = `${u} ${r(l)},${n(e)}`), E`
      <svg class="strip" viewBox="0 0 ${400} ${170}" role="img"
        aria-label=${this.summary(e)}>
        ${[
			0,
			6,
			12,
			18
		].map((e) => E`
            <line class="spoke" x1=${r(e)} y1="18" x2=${r(e)} y2=${148} />
            <text class="hour" x=${r(e) + 4} y=${164}
              text-anchor="start">${String(e).padStart(2, "0")}</text>
          `)}
        ${o} ${s}
        ${c.filter((e) => e.includes(" ")).map((e) => E`<polyline class="trace" points=${e} />`)}
        ${e === null ? O : E`<circle class="bead" cx=${r(l)} cy=${n(e)} r="5" />`}
        <text class="scale" x="4" y="12" text-anchor="start">
          ${i.value} ${i.unit}
        </text>
      </svg>
    `;
	}
	flowValue(e) {
		if (!this._hass) return null;
		let t = this.flows.find((t) => t.kind === e);
		return t ? Ge(this._hass.states, t) : null;
	}
	flowLabel(e, t) {
		return Math.abs(t) < 25 ? "idle" : e === "grid" ? t > 0 ? "importing" : "exporting" : e === "battery" ? t > 0 ? "supplying" : "charging" : "generating";
	}
	renderChip(e) {
		if (!this.flows.some((t) => t.kind === e)) return O;
		let t = this.flowValue(e), n = t === null ? void 0 : this.formatPower(Math.abs(t));
		return T`
      <div class=${`chip chip-${e}`}>
        <span class="dot" aria-hidden="true"></span>
        <span class="chip-copy">
          <small>${{
			solar: "Solar",
			grid: "Grid",
			battery: "Battery"
		}[e]}</small>
          <strong
            >${n ? T`${n.value}<em>${n.unit}</em>` : "—"}</strong
          >
          <span>${t === null ? "unavailable" : this.flowLabel(e, t)}</span>
        </span>
      </div>
    `;
	}
	deviation(e) {
		if (e === null || !this.baseline) return null;
		let t = Math.floor(H(this.now, this.timeZone));
		return lt(e, this.baseline.hours[t] ?? null);
	}
	summary(e) {
		if (e === null) return "Home power unavailable";
		let t = this.formatPower(e), n = this.deviation(e), r = `Home load ${t.value} ${t.unit}`;
		return n ? `${r}, ${n.sentence.toLowerCase()}` : r;
	}
	render() {
		let e = this.currentPower(), t = e === null ? void 0 : this.formatPower(e), n = this.deviation(e), r = this.config.entity || !this._hass ? null : Ke(this._hass.states, this.channels), i = r ? Je(r).selfPoweredPercent : null;
		return T`
      <ha-card>
        <div class=${`card ${this.compact ? "is-compact" : ""}`}>
          <header>
            <div>
              <small>Today against normal</small>
              <span>${this.config.name ?? "Home load"}</span>
            </div>
            <span class="status" title="Live data">
              <i class=${e === null ? "offline" : ""}></i> live
            </span>
          </header>

          <div class="scene">
            ${this.compact ? this.renderStrip(e) : this.renderDial(e)}
            <div class="reading">
              ${t ? T`<strong>${t.value}</strong><span>${t.unit}</span>` : T`<strong>—</strong>`}
              <small>home now</small>
            </div>
          </div>

          <p
            class=${`verdict ${n ? n.direction : "unknown"}`}
            title=${n ? n.sentence : "Baseline not available yet"}
          >
            ${n ? n.sentence : "Comparing with your normal day"}
          </p>

          <div class="legend" aria-hidden="true">
            <span class="key band"></span>usual range
            <span class="key line"></span>today
            <span class="key line above"></span>above
            <span class="key line below"></span>below
          </div>

          <div class="chips">
            ${this.renderChip("solar")} ${this.renderChip("grid")}
            ${this.renderChip("battery")}
            ${i === null ? O : T`
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

          ${this.loading ? T`<p class="message">Discovering Energy dashboard…</p>` : this.error ? T`<p class="message error">${this.error}</p>` : this.historyNote ? T`<p class="message">${this.historyNote}</p>` : O}
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
      letter-spacing: 0.08em;
    }
    .hour {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .scale {
      fill: #6f7488;
      font-size: 11px;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .band {
      fill: rgba(160, 178, 210, 0.13);
      stroke: none;
    }
    .future {
      fill: rgba(6, 7, 12, 0.55);
      stroke: none;
      pointer-events: none;
    }
    .rim.mid {
      stroke: rgba(255, 255, 255, 0.07);
    }
    .tick {
      stroke-width: 4;
      stroke-linecap: round;
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
      stroke-width: 3;
      stroke-linejoin: round;
      stroke-linecap: round;
      filter: drop-shadow(0 0 4px currentColor);
      color: var(--orb-home);
    }
    .trace.above {
      stroke: var(--orb-above);
      color: var(--orb-above);
    }
    .trace.below {
      stroke: var(--orb-below);
      color: var(--orb-below);
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
      line-height: 1.3;
      text-align: center;
    }
    .verdict.above {
      color: var(--orb-above);
    }
    .verdict.below {
      color: var(--orb-below);
    }
    .verdict.normal,
    .verdict.unknown {
      color: #9aa0b4;
    }
    .legend {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 4px 12px;
      margin-top: 8px;
      color: #767b90;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .key {
      width: 14px;
      height: 10px;
      margin-right: 5px;
      display: inline-block;
      vertical-align: middle;
    }
    .key.band {
      background: rgba(160, 178, 210, 0.14);
      box-shadow: inset 0 0 0 1px rgba(196, 212, 238, 0.4);
      border-radius: 2px;
    }
    .key.line {
      height: 2px;
      background: var(--orb-home);
    }
    .key.line.above {
      background: var(--orb-above);
    }
    .key.line.below {
      background: var(--orb-below);
    }
    .key.dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--orb-home);
    }
    .chips {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
      white-space: nowrap;
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
G([Ie({ attribute: !1 })], $.prototype, "hass", null), G([F()], $.prototype, "channels", void 0), G([F()], $.prototype, "flows", void 0), G([F()], $.prototype, "loading", void 0), G([F()], $.prototype, "error", void 0), G([F()], $.prototype, "baseline", void 0), G([F()], $.prototype, "today", void 0), G([F()], $.prototype, "historyNote", void 0), G([F()], $.prototype, "compact", void 0), G([F()], $.prototype, "now", void 0), $ = G([Ne("power-orb")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "power-orb") || window.customCards.push({
	type: "power-orb",
	name: "Power Orb",
	description: "Live home power compared with your own normal day",
	documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
	preview: !0
});
//#endregion
export { $ as PowerOrbCard };
