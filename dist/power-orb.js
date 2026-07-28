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
var se = globalThis, ce = (e) => e, _ = se.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", pe = Array.isArray, me = (e) => pe(e) || typeof e?.[Symbol.iterator] == "function", he = "[ 	\n\f\r]", S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, C = RegExp(`>|${he}(?:([^\\s"'>=/]+)(${he}*=${he}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, xe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), w = xe(1), T = xe(2), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), O = y.createTreeWalker(y, 129);
function Ce(e, t) {
	if (!pe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === S ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = C) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = C) : o = _e : o === C ? c[0] === ">" ? (o = i ?? S, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? C : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = C : o === ge || o === _e ? o = S : (o = C, i = void 0);
		let d = o === C && e[t + 1].startsWith("/>") ? " " : "";
		a += o === S ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Te = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), O.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = O.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Oe : r[1] === "?" ? ke : r[1] === "@" ? Ae : A
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (be.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), O.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], b());
					}
				}
			} else if (i.nodeType === 8) if (i.data === de) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += v.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = y.createElement("template");
		return n.innerHTML = e, n;
	}
};
function k(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = k(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new De(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new je(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = y, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, De = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = k(this, e, t), x(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Te.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Te(e)), t;
	}
	k(t) {
		pe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(b()), this.O(b()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, A = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = k(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = k(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Oe = class extends A {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, ke = class extends A {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, Ae = class extends A {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = k(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, je = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		k(this, e);
	}
}, Me = se.litHtmlPolyfillSupport;
Me?.(Te, De), (se.litHtmlVersions ??= []).push("3.3.3");
var Ne = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new De(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Pe = globalThis, j = class extends g {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
j._$litElement$ = !0, j.finalized = !0, Pe.litElementHydrateSupport?.({ LitElement: j });
var Fe = Pe.litElementPolyfillSupport;
Fe?.({ LitElement: j }), (Pe.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Ie = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Le = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: ae
}, Re = (e = Le, t, n) => {
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
function ze(e) {
	return (t, n) => typeof n == "object" ? Re(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function M(e) {
	return ze({
		...e,
		state: !0,
		attribute: !1
	});
}
function N(e) {
	return typeof e == "object" && !!e;
}
function P(e, t) {
	let n = e[t];
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function F(e, t, n, r) {
	if (!t) return;
	let i = e.find((e) => e.entityId === t && e.role === r);
	i ? i.multiplier += n : e.push({
		entityId: t,
		multiplier: n,
		role: r
	});
}
function Be(e, t, n) {
	let r = P(t, "stat_rate"), i = P(t, "stat_rate_inverted");
	if (r || i) {
		F(e, r, 1, n.net), F(e, i, -1, n.net);
		return;
	}
	F(e, P(t, "stat_rate_from"), 1, n.positive), F(e, P(t, "stat_rate_to"), -1, n.negative);
}
function Ve(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.energy_sources ?? []) {
		if (!N(n)) continue;
		let e = P(n, "type");
		if (e !== "solar" && e !== "grid" && e !== "battery") continue;
		let r = t.get(e) ?? [];
		t.set(e, r);
		let i = N(n.power_config) ? n.power_config : n;
		if (e === "solar") F(r, P(n, "stat_rate"), 1, "solar");
		else if (e === "grid") {
			let e = P(n, "stat_rate");
			e ? F(r, e, 1, "grid") : Be(r, i, {
				net: "grid",
				positive: "grid_import",
				negative: "grid_export"
			});
		} else e === "battery" && Be(r, i, {
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
var He = {
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
function I(e, t, n) {
	let r = typeof e == "string" ? [e] : e;
	if (!Array.isArray(r) || r.length === 0 || r.some((e) => typeof e != "string" || !e)) throw Error(`${t}.${n} must contain one or more entity IDs`);
	return r;
}
function Ue(e, t) {
	if (typeof t == "string" || Array.isArray(t)) return I(t, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if (!N(t)) throw Error(`${e} must contain one or more entity IDs`);
	let n = [
		"entity",
		"inverted",
		"from",
		"to"
	], r = Object.keys(t).filter((e) => !n.includes(e));
	if (r.length > 0) throw Error(`${e} does not support ${r.join(", ")}`);
	let i = "from" in t || "to" in t;
	if (Number("entity" in t) + Number("inverted" in t) + Number(i) > 1) throw Error(`${e} must use only one of entity, inverted, or from and to`);
	if ("entity" in t) return I(t.entity, e, "entity").map((t) => ({
		entityId: t,
		multiplier: 1,
		role: e
	}));
	if ("inverted" in t) return I(t.inverted, e, "inverted").map((t) => ({
		entityId: t,
		multiplier: -1,
		role: e
	}));
	if (i) {
		if (e === "solar") throw Error("solar does not support from and to; use a single entity");
		if (!("from" in t) || !("to" in t)) throw Error(`${e} requires both from and to`);
		let n = He[e];
		return [...I(t.from, e, "from").map((e) => ({
			entityId: e,
			multiplier: 1,
			role: n.positive
		})), ...I(t.to, e, "to").map((e) => ({
			entityId: e,
			multiplier: -1,
			role: n.negative
		}))];
	}
	throw Error(`${e} must define entity, inverted, or from and to`);
}
function We(e) {
	if (!N(e)) throw Error("entities must map solar, grid, or battery to entity IDs");
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
		let a = Ue(i, t);
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
function Ge(e) {
	return Ve(e).flatMap((e) => e.channels);
}
function L(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = e.attributes.unit_of_measurement?.toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : n === "w" || n === void 0 ? t : null;
}
function Ke(e, t) {
	if (t.length === 0) return null;
	let n = 0;
	for (let r of t) {
		let t = L(e[r.entityId]);
		if (t === null) return null;
		n += t * r.multiplier;
	}
	return Math.max(0, n);
}
function qe(e, t) {
	let n = 0, r = 0;
	for (let i of t.channels) {
		let t = L(e[i.entityId]);
		if (t === null) return null;
		n += t * i.multiplier, r += 1;
	}
	return r > 0 ? n : null;
}
function Je(e, t) {
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
		let t = L(e[r.entityId]);
		if (t === null) return null;
		let i = t * r.multiplier;
		n.activeChannels += 1, r.role === "solar" ? n.solar += i : r.role === "grid" || r.role === "grid_import" ? i >= 0 ? n.gridImport += i : n.gridExport += Math.abs(i) : r.role === "grid_export" ? i <= 0 ? n.gridExport += Math.abs(i) : n.gridImport += i : r.role === "battery" || r.role === "battery_discharge" ? i >= 0 ? n.batteryDischarge += i : n.batteryCharge += Math.abs(i) : r.role === "battery_charge" && (i <= 0 ? n.batteryCharge += Math.abs(i) : n.batteryDischarge += i);
	}
	return n.activeChannels === 0 ? null : (n.homeLoad = Math.max(0, n.solar + n.gridImport + n.batteryDischarge - n.gridExport - n.batteryCharge), n);
}
function Ye(e) {
	return Math.round(Math.min(100, Math.max(0, e * 100)));
}
function Xe(e) {
	let t = e.gridImport - e.gridExport, n = e.batteryDischarge - e.batteryCharge, r = e.homeLoad > 0 ? Ye((e.homeLoad - e.gridImport) / e.homeLoad) : 100, i = e.solar > 25 ? Ye((e.solar - e.gridExport) / e.solar) : null, a = "Waiting for enough live energy data.";
	return e.gridExport > 250 ? a = "Solar surplus now: run flexible loads or charge storage." : e.gridImport > 500 && e.solar > 0 ? a = "Importing from grid: shift flexible loads toward brighter periods." : e.batteryCharge > 250 ? a = "Battery is charging: preserve stored energy for the evening peak." : e.batteryDischarge > 250 ? a = "Battery is covering demand: keep heavy loads staggered." : e.solar > 0 && (a = "Solar is covering the home with minimal grid movement."), {
		selfPoweredPercent: r,
		solarUsedPercent: i,
		netGridWatts: t,
		netBatteryWatts: n,
		recommendation: a
	};
}
var Ze = 864e5, Qe = /* @__PURE__ */ new Set([
	"w",
	"kw",
	"mw",
	"gw"
]);
function R(e, t) {
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
function $e(e, t) {
	return Number(R(e, t).hour) % 24;
}
function et(e, t) {
	let n = R(e, t);
	return `${n.year}-${n.month}-${n.day}`;
}
function z(e, t) {
	let n = R(e, t), r = Date.UTC(Number(n.year), Number(n.month) - 1, Number(n.day)), i = R(r, t);
	return r - (Date.UTC(Number(i.year), Number(i.month) - 1, Number(i.day), Number(i.hour) % 24, Number(i.minute), Number(i.second)) - r);
}
function tt(e, t, n) {
	return z(z(e, n) - t * Ze + Ze / 2, n);
}
function B(e, t) {
	let n = R(e, t);
	return Number(n.hour) % 24 + Number(n.minute) / 60 + Number(n.second) / 3600;
}
function V(e, t) {
	if (e.length === 0) return 0;
	let n = t * (e.length - 1), r = Math.floor(n), i = Math.ceil(n), a = e[r] ?? 0, o = e[i] ?? a;
	return r === i ? a : a + (o - a) * (n - r);
}
function nt(e, t) {
	let n = 0;
	for (let r of e) {
		let e = t.get(r.entityId);
		if (!e || typeof e.mean != "number" || !Number.isFinite(e.mean)) return null;
		n += e.mean * r.multiplier;
	}
	return Math.max(0, n);
}
function rt(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) for (let t of e[r.entityId] ?? []) {
		let e = n.get(t.start) ?? /* @__PURE__ */ new Map();
		e.set(r.entityId, t), n.set(t.start, e);
	}
	return n;
}
async function it(e, t, n, r, i) {
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
async function at(e, t) {
	let n = [...new Set(t.map((e) => e.entityId))], r = await e.callWS({
		type: "recorder/get_statistics_metadata",
		statistic_ids: n
	}), i = /* @__PURE__ */ new Set();
	for (let e of r ?? []) {
		let t = e.display_unit_of_measurement?.toLowerCase(), n = e.unit_class === "power" || t !== void 0 && Qe.has(t);
		e.has_mean !== !1 && n && i.add(e.statistic_id);
	}
	return n.filter((e) => !i.has(e));
}
async function ot(e, t, n, r) {
	let i = z(n, r), a = tt(n, 28, r), o = tt(n, 5, r), s = [...new Set(t.map((e) => e.entityId))], [c, l] = await Promise.all([it(e, s, a, i, "hour"), it(e, s, o, i, "5minute")]), u = Array.from({ length: 24 }, () => []), d = Array.from({ length: 24 }, () => []), ee = /* @__PURE__ */ new Set();
	for (let [e, n] of rt(c, t)) {
		let i = nt(t, n);
		i !== null && (u[$e(e, r)]?.push(i), ee.add(et(e, r)));
	}
	for (let [e, n] of rt(l, t)) {
		let i = nt(t, n);
		i !== null && d[$e(e, r)]?.push(i);
	}
	let te = u.map((e, t) => {
		if (e.length < 10) return null;
		let n = [...e].sort((e, t) => e - t), r = d[t] ?? [], i = r.length >= 20 ? [...r].sort((e, t) => e - t) : null;
		return {
			hour: t,
			low: V(n, .1),
			median: V(n, .5),
			high: V(n, .9),
			liveLow: i ? V(i, .1) : null,
			liveHigh: i ? V(i, .9) : null,
			samples: n.length
		};
	}), f = ee.size, p = "ok";
	return te.every((e) => e === null) || f < 7 ? p = "learning" : f < 14 && (p = "provisional"), {
		hours: te,
		days: f,
		status: p
	};
}
async function st(e, t, n, r) {
	let i = z(n, r), a = rt(await it(e, [...new Set(t.map((e) => e.entityId))], i, void 0, "hour"), t), o = Math.floor(n / 36e5) * 36e5, s = /* @__PURE__ */ new Map();
	for (let [e, n] of [...a.entries()].sort((e, t) => e[0] - t[0])) {
		if (e >= o) continue;
		let i = nt(t, n);
		if (i === null) continue;
		let a = $e(e, r);
		s.set(a, {
			hour: a,
			watts: i
		});
	}
	return [...s.values()].sort((e, t) => e.hour - t.hour);
}
function ct(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${t(e)}:00\u2013${t((e + 1) % 24)}:00`;
}
var lt = 1.1;
function ut(e) {
	return {
		low: e.low,
		high: e.high
	};
}
function dt(e) {
	let t = ut(e), n = mt(t) * pt;
	return {
		low: t.low - n,
		high: t.high + n
	};
}
function H(e) {
	return e.liveLow === null || e.liveHigh === null ? null : {
		low: e.liveLow / lt,
		high: e.liveHigh * lt
	};
}
function ft(e, t) {
	if (!t || t.median < 50) return null;
	let n = H(t);
	if (!n) return null;
	let r = ct(t.hour);
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
var U = .36, W = .64, pt = .1;
function mt(e) {
	return Math.max(e.high - e.low, 60);
}
function ht(e, t) {
	return (e - t.low) / mt(t);
}
function gt(e) {
	let t = W - U;
	if (e >= 0 && e <= 1) return U + t * e;
	let n = Math.asinh(6);
	if (e > 1) {
		let t = Math.min(1, Math.asinh(e - 1) / n);
		return W + (1 - W) * t;
	}
	return U - U * Math.min(1, Math.asinh(-e) / n);
}
var _t = [
	1,
	1.25,
	1.5,
	2,
	2.5,
	3,
	4,
	5,
	6,
	8,
	10
];
function vt(e) {
	if (!Number.isFinite(e) || e <= 0) return 1e3;
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return (_t.find((e) => n <= e + 1e-9) ?? 10) * t;
}
function yt(e, t) {
	let n = [], r = [];
	for (let t of e) {
		if (!t) {
			r.length > 0 && n.push(r), r = [];
			continue;
		}
		r.push({
			hour: t.hour,
			...ut(t)
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
var bt = 300 * 1e3, xt = 300 * 1e3, K = 3600 * 1e3, St = 30 * 1e3, Ct = 300, wt = 400, q = wt / 2, J = 174, Y = 62, Tt = 9, Et = Y + (J - Y) * U, Dt = Y + (J - Y) * W, Ot = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new Map(), At = /* @__PURE__ */ new Map();
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
function jt(e, t, n, r) {
	if (t - e < .01) return "";
	if (t - e >= 23.99) return Mt(n, r);
	let i = +(t - e > 12), a = Z(e, r), o = Z(t, r), s = Z(t, n), c = Z(e, n);
	return [
		`M ${Q(a)}`,
		`A ${r} ${r} 0 ${i} 1 ${Q(o)}`,
		`L ${Q(s)}`,
		`A ${n} ${n} 0 ${i} 0 ${Q(c)}`,
		"Z"
	].join(" ");
}
function Mt(e, t) {
	let n = (e, t) => `M ${q - e} ${q} a ${e} ${e} 0 1 ${t} ${e * 2} 0 a ${e} ${e} 0 1 ${t} ${-e * 2} 0 Z`;
	return `${n(t, 0)} ${n(e, 1)}`;
}
var $ = class extends j {
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
		let t = e.entities === void 0 ? [] : We(e.entities);
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
		}, St), this.resizeObserver = new ResizeObserver((e) => {
			let t = e[0]?.contentRect.width ?? 0, n = t > 0 && t < Ct;
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
		if (await this.loadEnergyPreferences(), !(e !== this.connectionGeneration || !this._hass) && (this.loadHistory(), this.historyTimer = window.setInterval(() => void this.loadHistory(!0), xt), !(this.config.entity || this.config.entities !== void 0))) {
			this.refreshTimer = window.setInterval(() => void this.loadEnergyPreferences(), bt);
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
				this.flows = Ve(e), this.channels = Ge(e), this.error = this.channels.length === 0 ? "Add real-time power sensors to your Energy dashboard." : void 0;
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
			let e = await X(At, r, `${r}${Math.floor(n / K)}`, () => at(t, this.channels));
			if (e.length > 0) {
				this.applyHistory({
					baseline: null,
					today: [],
					missing: e
				});
				return;
			}
			let [i, a] = await Promise.all([X(Ot, r, `${r}${Math.floor(n / K)}`, () => ot(t, this.channels, n, this.timeZone)), X(kt, r, `${r}${Math.floor(n / xt)}`, () => st(t, this.channels, n, this.timeZone))]);
			this.applyHistory({
				baseline: i,
				today: a,
				missing: []
			}), this.historyRetried = !1;
		} catch {
			if (At.delete(`${r}${Math.floor(n / K)}`), Ot.delete(`${r}${Math.floor(n / K)}`), kt.delete(`${r}${Math.floor(n / xt)}`), !this.historyRetried) {
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
		return this._hass ? Ke(this._hass.states, this.channels) : null;
	}
	formatPower(e) {
		let t = this.config.unit === "kW" || this.config.unit === void 0 && Math.abs(e) >= 1e3, n = this._hass?.locale?.language ?? this._hass?.language, r = t ? e / 1e3 : e;
		return {
			value: new Intl.NumberFormat(n, { maximumFractionDigits: t ? 2 : 0 }).format(r),
			unit: t ? "kW" : "W"
		};
	}
	unitFor(e, t) {
		let n = this.baseline?.hours[Math.floor(e) % 24];
		if (n) return gt(ht(t, ut(n)));
		if (this.baseline) return null;
		let r = this.fallbackMax();
		return Math.sqrt(Math.min(Math.max(t, 0), r) / r);
	}
	fallbackMax() {
		if (this.config.max_power !== void 0) return this.config.max_power;
		let e = this.currentPower() ?? 0;
		for (let t of this.today) e = Math.max(e, t.watts);
		return vt(Math.max(e, 1e3));
	}
	radiusFor(e, t) {
		let n = this.unitFor(e, t);
		return n === null ? null : Y + (J - Y) * n;
	}
	bandRuns(e) {
		return yt(this.baseline?.hours ?? [], e);
	}
	departure(e, t) {
		let n = this.baseline?.hours[e];
		return n ? this.side(t, dt(n)) : null;
	}
	liveDeparture(e, t) {
		let n = this.baseline?.hours[e], r = n ? H(n) : null;
		return r ? this.side(t, r) : null;
	}
	side(e, t) {
		return e > t.high ? "above" : e < t.low ? "below" : null;
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
	renderBand() {
		return this.bandRuns(!0).map((e) => {
			let t = e[0], n = e[e.length - 1];
			return !t || !n ? D : T`<path class="band"
        d=${jt(t.hour, n.hour + 1, Et, Dt)} />`;
		});
	}
	renderTicks(e) {
		let t = this.baseline?.hours;
		if (!t) return D;
		let n = this.today.map((e) => {
			let n = t[e.hour];
			return n ? this.tick(e.hour + .5, e.watts, dt(n)) : D;
		}), r = B(this.now, this.timeZone), i = t[Math.floor(r)], a = i ? H(i) : null;
		return e !== null && a && n.push(this.tick(r, e, a)), n;
	}
	tick(e, t, n) {
		let r = t > n.high;
		if (!r && t >= n.low) return D;
		let i = this.radiusFor(e, r ? n.high : n.low), a = this.radiusFor(e, t);
		if (i === null || a === null) return D;
		let o = Math.abs(a - i) < Tt ? i + (r ? Tt : -9) : a, s = Z(e, i), c = Z(e, Math.min(Math.max(o, Y), J));
		return T`<line
      class=${`tick ${r ? "above" : "below"}`}
      x1=${s[0]} y1=${s[1]} x2=${c[0]} y2=${c[1]}
    />`;
	}
	traceNodes(e) {
		let t = [];
		for (let e of this.traceRuns()) {
			t.length > 0 && t.push({
				hour: -1,
				watts: 0,
				state: "break"
			});
			for (let n of e) t.push({
				hour: n.hour + .5,
				watts: n.watts,
				state: this.departure(n.hour, n.watts) ?? "normal"
			});
		}
		let n = B(this.now, this.timeZone);
		return e !== null && this.beadJoinsTrace(n) && t.push({
			hour: n,
			watts: e,
			state: this.liveDeparture(Math.floor(n), e) ?? "normal"
		}), t;
	}
	traceSegments(e) {
		let t = this.traceNodes(e), n = [];
		for (let e = 1; e < t.length; e += 1) {
			let r = t[e - 1], i = t[e];
			if (!r || !i || r.state === "break" || i.state === "break") continue;
			let a = this.radiusFor(r.hour, r.watts), o = this.radiusFor(i.hour, i.watts);
			a === null || o === null || n.push({
				state: i.state === "normal" ? r.state : i.state,
				label: this.segmentLabel(i),
				points: `${Q(Z(r.hour, a))} ${Q(Z(i.hour, o))}`
			});
		}
		return n;
	}
	segmentLabel(e) {
		let t = this.formatPower(e.watts);
		return `${String(Math.floor(e.hour) % 24).padStart(2, "0")}:00 ${t.value} ${t.unit}`;
	}
	renderDial(e) {
		let t = B(this.now, this.timeZone), n = e === null ? null : this.radiusFor(t, e), r = n === null ? null : Z(t, n);
		return T`
      <svg class="dial" viewBox="0 0 ${wt} ${wt}" role="img"
        aria-label=${this.summary(e)}>
        <path class="lived" d=${jt(0, t, Y, J)} />
        <circle class="rim" cx=${q} cy=${q} r=${J} />
        <circle class="rim" cx=${q} cy=${q} r=${Y} />
        ${[
			0,
			6,
			12,
			18
		].map((e) => {
			let t = Z(e, Y), n = Z(e, J), r = Z(e, 189);
			return T`
            <line class="spoke" x1=${t[0]} y1=${t[1]} x2=${n[0]} y2=${n[1]} />
            <text class="hour" x=${r[0]} y=${r[1]}>${String(e).padStart(2, "0")}</text>
          `;
		})}
        ${this.renderBand()} ${this.renderTicks(e)}
        ${this.traceSegments(e).map((e) => T`<polyline class=${`trace ${e.state}`} points=${e.points}>
              <title>${e.label}</title>
            </polyline>`)}
        ${this.renderNowBracket(t)}
        ${r ? T`
              <circle class="bead-halo" cx=${r[0]} cy=${r[1]} r="11" />
              <circle class="bead" cx=${r[0]} cy=${r[1]} r="6" />
            ` : D}
        ${this.baseline ? T`<text class="scale" x=${Z(21, Dt)[0]}
              y=${Z(21, Dt)[1]}>usual</text>` : D}
      </svg>
    `;
	}
	renderNowBracket(e) {
		let t = this.baseline?.hours[Math.floor(e)], n = t ? H(t) : null;
		if (!n) return D;
		let r = this.radiusFor(e, n.low), i = this.radiusFor(e, n.high);
		if (r === null || i === null) return D;
		let a = Z(e, Math.max(r, Y)), o = Z(e, Math.min(i, J));
		return T`<line class="now-range" x1=${a[0]} y1=${a[1]}
      x2=${o[0]} y2=${o[1]} />`;
	}
	renderStrip(e) {
		let t = (e) => e / 24 * 400, n = (e, t) => {
			let n = this.unitFor(e, t);
			return n === null ? null : 148 - 130 * n;
		}, r = this.baseline?.hours, i = this.bandRuns(!1).map((e) => {
			let n = e[0], r = e[e.length - 1];
			if (!n || !r) return D;
			let i = 148 - 130 * W, a = 148 - 130 * U;
			return T`<rect class="band" x=${t(n.hour)} y=${i}
        width=${t(r.hour + 1) - t(n.hour)} height=${a - i} />`;
		}), a = r ? this.today.map((e) => {
			let i = r[e.hour];
			if (!i) return D;
			let a = dt(i), o = e.watts > a.high;
			if (!o && e.watts >= a.low) return D;
			let s = n(e.hour, o ? a.high : a.low), c = n(e.hour, e.watts);
			return s === null || c === null ? D : T`<line
            class=${`tick ${o ? "above" : "below"}`}
            x1=${t(e.hour + .5)} y1=${s}
            x2=${t(e.hour + .5)} y2=${c}
          />`;
		}) : D, o = B(this.now, this.timeZone), s = this.traceNodes(e), c = [];
		for (let e = 1; e < s.length; e += 1) {
			let r = s[e - 1], i = s[e];
			if (!r || !i || r.state === "break" || i.state === "break") continue;
			let a = n(r.hour, r.watts), o = n(i.hour, i.watts);
			a === null || o === null || c.push({
				state: i.state === "normal" ? r.state : i.state,
				points: `${t(r.hour)},${a} ${t(i.hour)},${o}`
			});
		}
		let l = e === null ? null : n(o, e);
		return T`
      <svg class="strip" viewBox="0 0 ${400} ${170}" role="img"
        aria-label=${this.summary(e)}>
        ${[
			0,
			6,
			12,
			18
		].map((e) => T`
            <line class="spoke" x1=${t(e)} y1="18" x2=${t(e)} y2=${148} />
            <text class="hour" x=${t(e) + 4} y=${164}>${String(e).padStart(2, "0")}</text>
          `)}
        ${i} ${a}
        ${c.map((e) => T`<polyline class=${`trace ${e.state}`} points=${e.points} />`)}
        ${l === null ? D : T`<circle class="bead" cx=${t(o)} cy=${l} r="5" />`}
        ${this.baseline ? T`<text class="scale" x="4" y=${148 - 130 * W - 5}>usual</text>` : D}
      </svg>
    `;
	}
	flowValue(e) {
		if (!this._hass) return null;
		let t = this.flows.find((t) => t.kind === e);
		return t ? qe(this._hass.states, t) : null;
	}
	flowLabel(e, t) {
		return Math.abs(t) < 25 ? "idle" : e === "grid" ? t > 0 ? "importing" : "exporting" : e === "battery" ? t > 0 ? "supplying" : "charging" : "generating";
	}
	renderChip(e) {
		if (!this.flows.some((t) => t.kind === e)) return D;
		let t = this.flowValue(e), n = t === null ? void 0 : this.formatPower(Math.abs(t));
		return w`
      <div class=${`chip chip-${e}`}>
        <span class="dot" aria-hidden="true"></span>
        <span class="chip-copy">
          <small>${{
			solar: "Solar",
			grid: "Grid",
			battery: "Battery"
		}[e]}</small>
          <strong
            >${n ? w`${n.value}<em>${n.unit}</em>` : "—"}</strong
          >
          <span>${t === null ? "unavailable" : this.flowLabel(e, t)}</span>
        </span>
      </div>
    `;
	}
	deviation(e) {
		if (e === null || !this.baseline) return null;
		let t = Math.floor(B(this.now, this.timeZone));
		return ft(e, this.baseline.hours[t] ?? null);
	}
	summary(e) {
		if (e === null) return "Home power unavailable";
		let t = this.formatPower(e), n = this.deviation(e), r = `Home load ${t.value} ${t.unit}`;
		return n ? `${r}, ${n.sentence.toLowerCase()}` : r;
	}
	render() {
		let e = this.currentPower(), t = e === null ? void 0 : this.formatPower(e), n = this.deviation(e), r = this.config.entity || !this._hass ? null : Je(this._hass.states, this.channels), i = r ? Xe(r).selfPoweredPercent : null;
		return w`
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
              ${t ? w`<strong>${t.value}</strong><span>${t.unit}</span>` : w`<strong>—</strong>`}
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
            <span class="key dot"></span>now
          </div>

          <div class="chips">
            ${this.renderChip("solar")} ${this.renderChip("grid")}
            ${this.renderChip("battery")}
            ${i === null ? D : w`
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

          ${this.loading ? w`<p class="message">Discovering Energy dashboard…</p>` : this.error ? w`<p class="message error">${this.error}</p>` : this.historyNote ? w`<p class="message">${this.historyNote}</p>` : D}
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
      container-type: inline-size;
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
    .strip .hour {
      text-anchor: start;
    }
    .scale {
      fill: #6f7488;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .strip .scale {
      text-anchor: start;
    }
    .band {
      fill: rgba(160, 178, 210, 0.16);
      stroke: rgba(196, 212, 238, 0.45);
      stroke-width: 1;
      fill-rule: evenodd;
    }
    .lived {
      fill: rgba(255, 255, 255, 0.025);
      stroke: none;
      pointer-events: none;
    }
    .now-range {
      stroke: rgba(255, 255, 255, 0.3);
      stroke-width: 6;
      stroke-linecap: round;
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
      /* The centre hole scales with the card, so the figure has to as well. */
      font-size: clamp(20px, 9cqw, 34px);
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
G([ze({ attribute: !1 })], $.prototype, "hass", null), G([M()], $.prototype, "channels", void 0), G([M()], $.prototype, "flows", void 0), G([M()], $.prototype, "loading", void 0), G([M()], $.prototype, "error", void 0), G([M()], $.prototype, "baseline", void 0), G([M()], $.prototype, "today", void 0), G([M()], $.prototype, "historyNote", void 0), G([M()], $.prototype, "compact", void 0), G([M()], $.prototype, "now", void 0), $ = G([Ie("power-orb")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "power-orb") || window.customCards.push({
	type: "power-orb",
	name: "Power Orb",
	description: "Live home power compared with your own normal day",
	documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
	preview: !0
});
//#endregion
export { $ as PowerOrbCard };
