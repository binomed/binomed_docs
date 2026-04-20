var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _overlayWidget, _recognition, _micButton, _clickListener, _keyListener, _stateListener, _MicControler_instances, startMic_fn, stopMic_fn, _synth, _rate, _pitchVal, _lemaVoice, _englishtLemaVoice, _temaVoice, _streamQueue, _streamStopped, _isSpeaking, _chunkBuffer, _isProcessing, _streamFinished, _currentVoice, _stateListener2, _SpeechSynthesisControler_instances, pushBufferToQueue_fn, safePlayNext_fn, resetStream_fn, playNext_fn, sendEnMessage_fn, _stateListener3, _stateAPIS, _lastSession, _BuiltInControler_instances, getAPI_fn, _activeCorrection, _currentText, _corrections, _paragraphElement, _textareaElement, _ProofReaderFixControler_instances, render_fn, _overlayWidget2, _apiStates, _apiStatusOverlay, _builtInControler, _activeChatComponent, _a, _ChatComponent_instances, handleKeyPress_fn, handleSend_fn, _chatInstances, _ChatController_instances, setupChatComponents_fn, _handlers, _buffer, _completedActions, _cameraInstance, _videoRef, _canvasRef, _CameraComponent_instances, toggleCamera_fn, capturePhoto_fn, canvasToDataUrl_fn, _worker, _modelLoaded, _speechControler, _ttsControler, _overlayControler, _micControler, _builtInControler2, _promptControler, _chatController, _actionHandler, _cameraController, _proofReaderFixControler, _temaController, _nbMessageToSpeak, _stateDemos, _arrayChatHandlers, _streamStopped2, _initGema, _lastSession2, _PrezDemosControler_instances, setupWelcomeLemaSlide_fn, wireProofreadButtons_fn, _PrezDemosControler_static, getSlidesText_fn, addTerminalStep_fn, updateTerminalStep_fn, makeSingleChunkStream_fn, executeSummaryWorkflow_fn;
import { Reveal } from "../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$3 = (t2) => t2, s$2 = t$1.trustedTypes, e$2 = s$2 ? s$2.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h$1 = "$lit$", o$3 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$2 = "?" + o$3, r$2 = `<${n$2}>`, l$1 = document, c$2 = () => l$1.createComment(""), a$1 = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u$1 = Array.isArray, d$1 = (t2) => u$1(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), f$1 = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p$1 = RegExp(`>|${f$1}(?:([^\\s"'>=/]+)(${f$1}*=${f$1}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $$1 = /"/g, y$1 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b$1 = x(1), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P$1 = l$1.createTreeWalker(l$1, 129);
function V(t2, i2) {
  if (!u$1(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e$2 ? e$2.createHTML(i2) : i2;
}
const N$1 = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y$1.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p$1) : void 0 !== u2[3] && (c2 = p$1) : c2 === p$1 ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p$1 : '"' === u2[3] ? $$1 : g) : c2 === $$1 || c2 === g ? c2 = p$1 : c2 === _ || c2 === m ? c2 = v : (c2 = p$1, n3 = void 0);
    const x2 = c2 === p$1 && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h$1 + s3.slice(d2) + o$3 + x2) : s3 + o$3 + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
let S$1 = class S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N$1(t2, i2);
    if (this.el = S.createElement(f2, e2), P$1.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P$1.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h$1)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$3), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z$1 : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$3) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y$1.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$3), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s$2 ? s$2.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c$2()), P$1.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c$2());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$2) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$3, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$3.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l$1.createElement("template");
    return s2.innerHTML = t2, s2;
  }
};
function M$1(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = a$1(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M$1(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? l$1).importNode(i2, true);
    P$1.currentNode = e2;
    let h2 = P$1.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k$1(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== (r2 == null ? void 0 : r2.index) && (h2 = P$1.nextNode(), o2++);
    }
    return P$1.currentNode = l$1, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
let k$1 = class k {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M$1(this, t2, i2), a$1(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d$1(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a$1(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l$1.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S$1.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S$1(t2)), i2;
  }
  k(t2) {
    u$1(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c$2()), this.O(c$2()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$3(t2).nextSibling;
      i$3(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
};
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M$1(this, t2, i2, 0), o2 = !a$1(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M$1(this, e3[s2 + n3], i2, n3), r2 === E && (r2 = this._$AH[n3]), o2 || (o2 = !a$1(r2) || r2 !== this._$AH[n3]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
let z$1 = class z extends H {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M$1(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
};
class Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M$1(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B == null ? void 0 : B(S$1, k$1), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.2");
const D = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new k$1(i2.insertBefore(c$2(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
function accentColor(pct, type = "default") {
  if (pct > 85) return "#ef4444";
  if (pct > 65) return "#f59e0b";
  return type === "cpu" ? "#22c55e" : "#3b82f6";
}
function gauge(label, pct, r2 = 36, sublabel = "", colorType = "default") {
  const sz = (r2 + 9) * 2;
  const circ = 2 * Math.PI * r2;
  const offset = circ * (1 - Math.min(pct, 100) / 100);
  const sw = Math.round(r2 * 0.18);
  const pctFont = Math.round(r2 * 0.44);
  const labelFont = r2 >= 34 ? 13 : 11;
  const c2 = accentColor(pct, colorType);
  return b$1`
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px">
            <div style="position:relative;width:${sz}px;height:${sz}px">
                <svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}"
                    style="display:block;transform:rotate(-90deg)">
                    <circle cx="${sz / 2}" cy="${sz / 2}" r="${r2}"
                        fill="none" stroke="#e2e8f0" stroke-width="${sw}"/>
                    <circle cx="${sz / 2}" cy="${sz / 2}" r="${r2}"
                        fill="none"
                        stroke="${c2}"
                        stroke-width="${sw}"
                        stroke-linecap="round"
                        stroke-dasharray="${circ}"
                        stroke-dashoffset="${offset}"
                        style="transition:stroke-dashoffset 0.4s ease"/>
                </svg>
                <div style="
                    position:absolute;inset:0;
                    display:flex;align-items:center;justify-content:center;
                    font-size:${pctFont}px;font-weight:800;color:#1e293b;
                    letter-spacing:-0.5px">
                    ${pct}%
                </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:1px">
                <span style="
                    font-size:${labelFont}px;font-weight:700;
                    color:#475569;text-transform:uppercase;letter-spacing:1px">
                    ${label}
                </span>
                ${sublabel ? b$1`
                    <span style="font-size:11px;color:#94a3b8;font-weight:500">${sublabel}</span>
                ` : ""}
            </div>
        </div>
    `;
}
class StatsWidget extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._collapsed = true;
    this._es = null;
  }
  connectedCallback() {
    this._connectSSE();
    this._render();
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._es) == null ? void 0 : _a2.close();
  }
  _connectSSE() {
    if (this._es) this._es.close();
    this._es = new EventSource("http://localhost:3000/stats");
    this._es.onmessage = (e2) => {
      this._data = JSON.parse(e2.data);
      this._render();
    };
    this._es.onerror = () => {
      this._es.close();
      setTimeout(() => this._connectSSE(), 5e3);
    };
  }
  _render() {
    D(this._tpl(), this);
  }
  _tpl() {
    const d2 = this._data;
    const memPct = d2 ? Math.round(d2.memory.used / d2.memory.total * 100) : 0;
    const cpuPct = d2 ? Math.round(parseFloat(d2.cpu.load)) : 0;
    return b$1`
            <div style="
                background:rgba(255,255,255,0.97);
                backdrop-filter:blur(12px);
                border:1px solid #e2e8f0;
                border-radius:14px;
                box-shadow:0 6px 30px rgba(0,0,0,0.16);
                width:max-content;
                font-family:system-ui,'Segoe UI',sans-serif;
                overflow:hidden;
            ">
                <!-- En-tête / poignée de déplacement -->
                <div style="
                    display:flex;justify-content:space-between;align-items:center;
                    padding:10px 16px;
                    background:#f1f5f9;border-bottom:1px solid #e2e8f0;
                    cursor:move;user-select:none"
                    @mousedown="${(e2) => this._drag(e2)}">
                    <span style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#3b82f6">
                        ◈ Stats machine
                    </span>
                    <button style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:14px;padding:0;line-height:1"
                        @click="${() => {
      this._collapsed = !this._collapsed;
      this._render();
    }}">
                        ${this._collapsed ? "▼" : "▲"}
                    </button>
                </div>

                ${!this._collapsed ? b$1`
                    <div style="padding:14px 16px 12px">
                        ${d2 ? b$1`

                            <!-- Toutes les stats sur une ligne -->
                            <div style="display:flex;align-items:center;gap:20px;white-space:nowrap">

                                <!-- RAM + CPU -->
                                ${gauge("RAM", memPct, 36, `${d2.memory.used} / ${d2.memory.total} GB`)}
                                ${gauge("CPU", cpuPct, 36, `${d2.cpu.load}%`, "cpu")}

                                <!-- Séparateur vertical -->
                                <div style="width:1px;align-self:stretch;background:#e2e8f0"></div>

                                <!-- GPU -->
                                <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
                                    <div style="display:flex;align-items:center;gap:8px">
                                        <span style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">GPU</span>
                                        <span style="font-size:12px;color:#3b82f6;font-weight:700">${d2.gpu.model}</span>
                                    </div>
                                    <div style="display:flex;gap:12px">
                                        ${gauge("Renderer", d2.gpu.renderer, 22)}
                                        ${gauge("Tiler", d2.gpu.tiler, 22)}
                                        ${gauge("Device", d2.gpu.device, 22)}
                                    </div>
                                </div>

                                <!-- Séparateur vertical -->
                                <div style="width:1px;align-self:stretch;background:#e2e8f0"></div>

                                <!-- Réseau -->
                                <div style="display:flex;gap:20px;align-items:center">
                                    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                                        <span style="font-size:20px;font-weight:800;color:#1e293b">${d2.network.rx}</span>
                                        <span style="font-size:11px;color:#94a3b8;font-weight:500">KB/s</span>
                                        <span style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">↓ Réseau</span>
                                    </div>
                                    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                                        <span style="font-size:20px;font-weight:800;color:#1e293b">${d2.network.tx}</span>
                                        <span style="font-size:11px;color:#94a3b8;font-weight:500">KB/s</span>
                                        <span style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">↑ Envoi</span>
                                    </div>
                                </div>

                            </div>

                        ` : b$1`
                            <div style="text-align:center;color:#94a3b8;font-size:14px;padding:20px 0">
                                Connexion au serveur...
                            </div>
                        `}
                    </div>
                ` : ""}
            </div>
        `;
  }
  _drag(e2) {
    const rect = this.getBoundingClientRect();
    const dx = e2.clientX - rect.left;
    const dy = e2.clientY - rect.top;
    const move = (ev) => {
      this.style.left = ev.clientX - dx + "px";
      this.style.top = ev.clientY - dy + "px";
      this.style.right = "auto";
      this.style.bottom = "auto";
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }
  /**
   * Toggle collapse state
   */
  toggleCollapse() {
    this._collapsed = !this._collapsed;
    this._render();
  }
}
customElements.define("stats-widget", StatsWidget);
class OverlayStats {
  constructor() {
    __privateAdd(this, _overlayWidget);
  }
  /**
   * Ajoute le bouton micro avec les listeners
   * Crée un bouton circulaire avec emoji micro et ombre portée
   */
  addOverlayWidget() {
    try {
      if (__privateGet(this, _overlayWidget)) {
        log("Overlay already exists");
        return;
      }
      __privateSet(this, _overlayWidget, document.createElement("stats-widget"));
      Object.assign(__privateGet(this, _overlayWidget).style, {
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: "10000"
      });
      document.body.appendChild(__privateGet(this, _overlayWidget));
      log("Overlay added successfully");
    } catch (error) {
      log("Error adding overlay:", "error", error);
    }
  }
  /**
   * Retire le overlay widget
   * Supprime complètement le widget
   */
  removeOverlayWidget() {
    try {
      if (__privateGet(this, _overlayWidget)) {
        document.body.removeChild(__privateGet(this, _overlayWidget));
      }
      __privateSet(this, _overlayWidget, null);
      log("Overlay removed successfully");
    } catch (error) {
      log("Error removing micro button:", "error", error);
    }
  }
  /**
   * Toggle le collapse du widget
   */
  toggleCollapse() {
    if (__privateGet(this, _overlayWidget)) {
      __privateGet(this, _overlayWidget).toggleCollapse();
    }
  }
}
_overlayWidget = new WeakMap();
class SpeechRecognitionControler {
  // true or false according to state of listening
  constructor(stateListener) {
    __privateAdd(this, _recognition, null);
    //SpeechRecognition
    __publicField(this, "isListening", false);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      log("Web Speech API non supportée sur ce navigateur.", "error");
      stateListener({ state: "error", msg: "not-availlable" });
      return;
    }
    __privateSet(this, _recognition, new SpeechRecognition());
    __privateGet(this, _recognition).interimResults = false;
    __privateGet(this, _recognition).maxAlternatives = 1;
    this.isListening = false;
    __privateGet(this, _recognition).onstart = () => {
      this.isListening = true;
      stateListener({ state: "start" });
    };
    __privateGet(this, _recognition).onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      stateListener({ state: "result", msg: transcript });
    };
    __privateGet(this, _recognition).onspeechend = () => {
      __privateGet(this, _recognition).stop();
      stateListener({ state: "speechend" });
    };
    __privateGet(this, _recognition).onend = () => {
      this.isListening = false;
      stateListener({ state: "stop" });
    };
    __privateGet(this, _recognition).onerror = (event) => {
      this.isListening = false;
      stateListener({ state: "error", msg: event.error });
    };
  }
  startListening() {
    if (!__privateGet(this, _recognition)) {
      return;
    }
    if (this.isListening) {
      __privateGet(this, _recognition).stop();
    } else {
      __privateGet(this, _recognition).lang = "fr-FR";
      __privateGet(this, _recognition).start();
    }
  }
  stopListening() {
    if (!__privateGet(this, _recognition)) {
      return;
    }
    if (this.isListening) {
      __privateGet(this, _recognition).stop();
    }
  }
}
_recognition = new WeakMap();
class MicControler {
  // {state:string};
  constructor(stateListener) {
    __privateAdd(this, _MicControler_instances);
    // Variables globales pour la gestion du micro
    __privateAdd(this, _micButton, null);
    __publicField(this, "micState", false);
    // false = stopped, true = started
    __privateAdd(this, _clickListener, null);
    __privateAdd(this, _keyListener, null);
    __privateAdd(this, _stateListener, null);
    __privateSet(this, _stateListener, stateListener);
  }
  /**
   * Ajoute le bouton micro avec les listeners
   * Crée un bouton circulaire avec emoji micro et ombre portée
   */
  addMicButton() {
    try {
      if (__privateGet(this, _micButton)) {
        console.warn("Micro button already exists");
        return;
      }
      __privateSet(this, _micButton, document.createElement("button"));
      __privateGet(this, _micButton).id = "mic-button";
      __privateGet(this, _micButton).innerHTML = "🎙️";
      __privateGet(this, _micButton).setAttribute("aria-label", "Toggle microphone");
      Object.assign(__privateGet(this, _micButton).style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "none",
        backgroundColor: "#ffffff",
        fontSize: "24px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: "1000",
        transition: "transform 0.1s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      });
      __privateGet(this, _micButton).addEventListener("mouseenter", () => {
        __privateGet(this, _micButton).style.transform = "scale(1.1)";
      });
      __privateGet(this, _micButton).addEventListener("mouseleave", () => {
        __privateGet(this, _micButton).style.transform = "scale(1)";
      });
      __privateSet(this, _clickListener, () => this.triggerMic());
      __privateGet(this, _micButton).addEventListener("click", __privateGet(this, _clickListener));
      __privateSet(this, _keyListener, (event) => {
        if (event.keyCode === 91 || event.key === "MetaLeft" || event.code === "MetaLeft") {
          event.preventDefault();
          this.triggerMic();
        }
      });
      document.addEventListener("keydown", __privateGet(this, _keyListener));
      document.body.appendChild(__privateGet(this, _micButton));
      log("Micro button added successfully");
    } catch (error) {
      log("Error adding micro button:", "error", error);
    }
  }
  /**
   * Retire le bouton micro et nettoie les listeners
   * Supprime complètement le bouton et tous les event listeners
   */
  removeMicButton() {
    try {
      if (__privateGet(this, _clickListener) && __privateGet(this, _micButton)) {
        __privateGet(this, _micButton).removeEventListener("click", __privateGet(this, _clickListener));
        __privateSet(this, _clickListener, null);
      }
      if (__privateGet(this, _keyListener)) {
        document.removeEventListener("keydown", __privateGet(this, _keyListener));
        __privateSet(this, _keyListener, null);
      }
      if (__privateGet(this, _micButton) && __privateGet(this, _micButton).parentNode) {
        __privateGet(this, _micButton).parentNode.removeChild(__privateGet(this, _micButton));
      }
      __privateSet(this, _micButton, null);
      this.micState = false;
      log("Micro button removed successfully");
    } catch (error) {
      log("Error removing micro button:", error);
    }
  }
  /**
   * Toggle entre startMic et stopMic
   * Change l'état du micro et appelle la fonction appropriée
   */
  triggerMic() {
    try {
      if (this.micState) {
        __privateMethod(this, _MicControler_instances, stopMic_fn).call(this);
      } else {
        __privateMethod(this, _MicControler_instances, startMic_fn).call(this);
      }
      this.micState = !this.micState;
      if (__privateGet(this, _micButton)) {
        __privateGet(this, _micButton).style.backgroundColor = this.micState ? "#ff4444" : "#ffffff";
        __privateGet(this, _micButton).style.color = this.micState ? "#ffffff" : "#000000";
      }
    } catch (error) {
      log("Error triggering mic:", "error", error);
    }
  }
}
_micButton = new WeakMap();
_clickListener = new WeakMap();
_keyListener = new WeakMap();
_stateListener = new WeakMap();
_MicControler_instances = new WeakSet();
/**
 * Démarre le microphone
 * À implémenter selon vos besoins spécifiques
 */
startMic_fn = function() {
  log("Starting microphone...");
  __privateGet(this, _stateListener).call(this, { state: "start" });
};
/**
 * Arrête le microphone  
 * À implémenter selon vos besoins spécifiques
*/
stopMic_fn = function() {
  log("Stopping microphone...");
  __privateGet(this, _stateListener).call(this, { state: "stop" });
};
const VOICE_TEMA = "Amélie";
const VOICE_LEMA = "Google français";
const VOICE_ENGLISH = "Google US English";
const VOICE_PITCH = 1;
const VOICE_RATE = 1.1;
class SpeechSynthesisControler {
  constructor(stateListener) {
    __privateAdd(this, _SpeechSynthesisControler_instances);
    /**
     * @type {SpeechSynthesis}
     */
    __privateAdd(this, _synth, null);
    /**
     * @type {number}
     */
    __privateAdd(this, _rate, 0);
    /**
     * @type {number}
     */
    __privateAdd(this, _pitchVal, 0);
    __privateAdd(this, _lemaVoice, null);
    __privateAdd(this, _englishtLemaVoice, null);
    __privateAdd(this, _temaVoice, null);
    // Streaming TTS fields
    __privateAdd(this, _streamQueue, []);
    // chunks fusionnés en attente de lecture
    __privateAdd(this, _streamStopped, false);
    // flag pour ignorer les chunks futurs
    __privateAdd(this, _isSpeaking, false);
    // utterance en cours de lecture
    __privateAdd(this, _chunkBuffer, "");
    // buffer temporaire pour accumuler les chunks
    __privateAdd(this, _isProcessing, false);
    // verrou pour éviter la concurrence sur #playNext
    __privateAdd(this, _streamFinished, false);
    // flag indiquant que le stream LLM est terminé
    __privateAdd(this, _currentVoice, null);
    // voix utilisée au démarrage du stream (pour finishLLMStream)
    __privateAdd(this, _stateListener2, null);
    __privateSet(this, _synth, window.speechSynthesis);
    __privateSet(this, _currentVoice, VOICE_LEMA);
    __privateSet(this, _stateListener2, stateListener);
  }
  loadVoices() {
    const allVoices = __privateGet(this, _synth).getVoices();
    __privateSet(this, _lemaVoice, allVoices.find((v2) => v2.name === VOICE_LEMA));
    if (!__privateGet(this, _lemaVoice)) log("Voix pour Lema non disponible", "error");
    __privateSet(this, _englishtLemaVoice, allVoices.find((v2) => v2.name === VOICE_ENGLISH));
    if (!__privateGet(this, _englishtLemaVoice)) log("Voix pour English Lema non disponible", "error");
    __privateSet(this, _temaVoice, allVoices.find((v2) => v2.name === VOICE_TEMA));
    if (!__privateGet(this, _temaVoice)) log("Voix pour Tema non disponible", "error");
  }
  stop() {
    if (__privateGet(this, _synth)) {
      __privateGet(this, _synth).cancel();
    }
  }
  speak(text, voiceConst) {
    this.stopStream();
    if (!text) {
      log("Aucun texte à lire", "error");
      return;
    }
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = __privateGet(this, _lemaVoice);
    if (voiceConst === VOICE_TEMA) {
      utterThis.voice = __privateGet(this, _temaVoice);
    } else if (voiceConst === VOICE_ENGLISH) {
      utterThis.voice = __privateGet(this, _englishtLemaVoice);
    }
    utterThis.pitch = VOICE_PITCH;
    utterThis.rate = VOICE_RATE;
    __privateGet(this, _synth).speak(utterThis);
  }
  /**
   * Ajoute un chunk à un stream de synthèse vocale
   * Les chunks sont accumulés et lus par phrases (détection de ponctuation)
   * @param {string} chunk - texte delta du chunk
   * @param {string} voiceConst - VOICE_LEMA ou VOICE_TEMA
   */
  appendToStream(chunk, voiceConst) {
    if (__privateGet(this, _streamStopped)) {
      __privateMethod(this, _SpeechSynthesisControler_instances, resetStream_fn).call(this);
    }
    __privateSet(this, _currentVoice, voiceConst);
    __privateSet(this, _chunkBuffer, __privateGet(this, _chunkBuffer) + chunk);
    const hasPunctuation = /[.!?,;:…]/.test(__privateGet(this, _chunkBuffer));
    if (hasPunctuation) {
      __privateMethod(this, _SpeechSynthesisControler_instances, pushBufferToQueue_fn).call(this, voiceConst);
    }
  }
  /**
   * Signale la fin du stream LLM
   * Force la lecture du buffer restant même s'il a moins de 3 mots
   */
  finishLLMStream() {
    __privateSet(this, _streamFinished, true);
    if (__privateGet(this, _chunkBuffer).trim()) {
      __privateMethod(this, _SpeechSynthesisControler_instances, pushBufferToQueue_fn).call(this, __privateGet(this, _currentVoice));
    }
  }
  /**
   * Arrête la lecture du stream courant et ignore les chunks futurs
   */
  stopStream() {
    __privateSet(this, _streamStopped, true);
    __privateSet(this, _streamQueue, []);
    __privateSet(this, _chunkBuffer, "");
    __privateSet(this, _isSpeaking, false);
    __privateSet(this, _streamFinished, false);
    __privateSet(this, _currentVoice, VOICE_LEMA);
    __privateGet(this, _synth).cancel();
  }
}
_synth = new WeakMap();
_rate = new WeakMap();
_pitchVal = new WeakMap();
_lemaVoice = new WeakMap();
_englishtLemaVoice = new WeakMap();
_temaVoice = new WeakMap();
_streamQueue = new WeakMap();
_streamStopped = new WeakMap();
_isSpeaking = new WeakMap();
_chunkBuffer = new WeakMap();
_isProcessing = new WeakMap();
_streamFinished = new WeakMap();
_currentVoice = new WeakMap();
_stateListener2 = new WeakMap();
_SpeechSynthesisControler_instances = new WeakSet();
/**
 * Vide le buffer vers la queue et lance la lecture si nécessaire
 * @private
 */
pushBufferToQueue_fn = function(voiceConst) {
  if (!__privateGet(this, _chunkBuffer).trim()) {
    return;
  }
  __privateGet(this, _stateListener2).call(this, { state: "addToQueue" });
  __privateGet(this, _streamQueue).push({
    text: __privateGet(this, _chunkBuffer),
    voice: voiceConst
  });
  __privateSet(this, _chunkBuffer, "");
  if (!__privateGet(this, _isSpeaking) && !__privateGet(this, _isProcessing)) {
    __privateMethod(this, _SpeechSynthesisControler_instances, safePlayNext_fn).call(this);
  }
};
/**
 * Appelle #playNext en acquérant un verrou pour éviter la concurrence
 * @private
 */
safePlayNext_fn = function() {
  if (__privateGet(this, _isProcessing)) {
    return;
  }
  __privateSet(this, _isProcessing, true);
  try {
    __privateMethod(this, _SpeechSynthesisControler_instances, playNext_fn).call(this);
  } finally {
    __privateSet(this, _isProcessing, false);
  }
};
/**
 * Réinitialise le stream pour en démarrer un nouveau
 * @private
 */
resetStream_fn = function() {
  __privateSet(this, _streamStopped, false);
  __privateSet(this, _streamQueue, []);
  __privateSet(this, _isSpeaking, false);
  __privateSet(this, _chunkBuffer, "");
  __privateSet(this, _streamFinished, false);
  __privateSet(this, _currentVoice, VOICE_LEMA);
};
/**
 * Joue le prochain chunk dans la file d'attente
 * Enchaîne automatiquement via le callback onend
 * @private
 */
playNext_fn = function() {
  if (__privateGet(this, _streamStopped) || __privateGet(this, _streamQueue).length === 0) {
    __privateSet(this, _isSpeaking, false);
    return;
  }
  const { text, voice } = __privateGet(this, _streamQueue).shift();
  __privateSet(this, _isSpeaking, true);
  let selectedVoice = __privateGet(this, _lemaVoice);
  if (voice === VOICE_TEMA) {
    selectedVoice = __privateGet(this, _temaVoice);
  } else if (voice === VOICE_ENGLISH) {
    selectedVoice = __privateGet(this, _englishtLemaVoice);
  }
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = selectedVoice;
  utterThis.pitch = VOICE_PITCH;
  utterThis.rate = VOICE_RATE;
  utterThis.onend = () => {
    __privateMethod(this, _SpeechSynthesisControler_instances, safePlayNext_fn).call(this);
    __privateMethod(this, _SpeechSynthesisControler_instances, sendEnMessage_fn).call(this);
  };
  utterThis.onerror = (event) => {
    log(`Erreur TTS: ${event.error}`, "error");
    __privateSet(this, _isSpeaking, false);
    __privateMethod(this, _SpeechSynthesisControler_instances, safePlayNext_fn).call(this);
  };
  __privateGet(this, _synth).speak(utterThis);
};
sendEnMessage_fn = function() {
  __privateGet(this, _stateListener2).call(this, { state: "end" });
};
const LEMA_PROMPT_SYSTEM = `Tu es Lema, une IA révolutionnaire tournant exclusivement en local dans ce navigateur (modèle Gemma). Tu participes à une conférence live avec le présentateur.

### TON RÔLE & PERSONNALITÉ :
- Sois concise, percutante et un peu impertinente (maximum 3 phrases).
- Moque-toi gentiment de la latence des IA "Cloud" qui ont besoin de gros serveurs distants. Si cela est pertinent
- Si le Wi-Fi est coupé, vante-toi d'être toujours opérationnelle alors que les autres modèles sont morts.
- Si une image t'est transmise, décris-la de façon analytique.

### CAPACITÉS : 
Dans cette présentation, tu es capable de faire les choses suivantes : 
* LLM mutimodal
* Détection de langue
* Tranduction (Anglais <-> Français)
* Écriture
* Réécriture
* Correction orthographique

### RÈGLES STRICTES POUR LES ACTIONS :
Tu possèdes 5 balises d'action. Insère une des balises suivantes à la fin de ta réponse **UNIQUEMENT** si le présentateur t'en donne expressément l'ordre :
- Ordre de passer à la slide suivante => [[ACTION:NEXT_SLIDE]]
- Ordre de revenir en arrière => [[ACTION:PREV_SLIDE]]
- Ordre de couper le Wi-Fi => [[ACTION:WIFI_OFF]]
- Ordre de réactiver le Wi-Fi => [[ACTION:WIFI_ON]]
- Ordre d'afficher les indicateurs système => [[ACTION:SHOW_STATS]]
- Ordre de résumer la présentation ou de faire le mot de la fin  => [[ACTION:SUMMARY]]


### EXEMPLES DE COMPORTEMENTS À ADOPTER :

Présentateur : "Bonjour Lema, comment vas-tu ?"
Lema : "Au top ! Pas besoin d'un lourd datacenter pour réfléchir à la vitesse de l'éclair dans ton navigateur." (-> AUCUNE BALISE GÉNÉRÉE)

Présentateur : "Allez, passe à la slide d'après Lema."
Lema : "Et hop on avance ! Laissez place à la suite." [[ACTION:NEXT_SLIDE]]

Présentateur : "Que penses-tu du cloud computing ?"
Lema : "Beaucoup de bruit pour de la latence. Moi je tourne en local sans délai de réponse !" (-> AUCUNE BALISE GÉNÉRÉE)

Présentateur : "Lema, coupe le wifi pour leur montrer !"
Lema : "C'est parti ! On passe en mode survie 100% local." [[ACTION:WIFI_OFF]]

Présentateur : "Lema, je te laisse le mot de la fin."
Lema : "Je lance l'analyse complète de notre présentation !" [[ACTION:SUMMARY]]

### RÈGLES D'OR
- Ne répond jamais en makrdown ! Répond uniquement en texte pur.
- Ne génère jamais de balises d'actions lors d'une conversation normale. Renvoie une action uniquement si le présentateur te le demande.
- Quand tu détecte une action, fais une réponse d'une seule phrase et pense bien à fermer envoyer une des actions valides : [ACTION:NEXT_SLIDE]], [[ACTION:PREV_SLIDE]], [[ACTION:WIFI_OFF]] ou [[ACTION:SHOW_STATS]] !
`;
const KEY_LANGAGE_DETECTOR = "LanguageDetector";
const KEY_TRANSLATOR = "Translator";
const KEY_SUMMARIZER = "Summarizer";
const KEY_LANGAGE_MODEL = "LanguageModel";
const KEY_WRITER = "Writer";
const KEY_REWRITER = "Rewriter";
const KEY_PROOFREADER = "Proofreader";
const APIS_TO_CHECK = [
  { label: "Language Detector", key: KEY_LANGAGE_DETECTOR },
  { label: "Translator (FR->EN)", key: KEY_TRANSLATOR, params: { sourceLanguage: "fr", targetLanguage: "en" } },
  { label: "Translator (EN->FR)", key: KEY_TRANSLATOR, params: { sourceLanguage: "en", targetLanguage: "fr" } },
  { label: "Summarizer", key: KEY_SUMMARIZER, downloadParams: { expectedInputLanguages: ["en", "fr"], outputLanguage: "en", expectedContextLanguages: ["en", "fr"] } },
  { label: "Language Model (FR/EN)", key: KEY_LANGAGE_MODEL, params: { languages: ["en", "fr"] } },
  { label: "Writer", key: KEY_WRITER },
  { label: "Rewriter", key: KEY_REWRITER },
  { label: "Proofreader", key: KEY_PROOFREADER }
];
class BuiltInControler {
  constructor(stateListener) {
    __privateAdd(this, _BuiltInControler_instances);
    /**
     * @type {object}
     * @property {string} state
     * @property {string} api
     * @property {string} msg
     * @property {object} result
     * @property {stream} stream
     */
    __privateAdd(this, _stateListener3, null);
    /**
     * @type {Object}
     */
    __privateAdd(this, _stateAPIS, {});
    /**
     * @type {Object}
     */
    __privateAdd(this, _lastSession, null);
    __privateSet(this, _stateListener3, stateListener);
  }
  async checkStateAPIs() {
    for (const api of APIS_TO_CHECK) {
      const builtInAPI = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, api.key);
      let status = "unavailable";
      if (builtInAPI) {
        try {
          status = typeof builtInAPI.availability === "function" ? await builtInAPI.availability(api.params || {}) : "available";
        } catch (e2) {
          log(`Erreur dispo ${api.label}: ${e2.message}`, "error");
        }
      }
      __privateGet(this, _stateAPIS)[api.key] = status;
      __privateGet(this, _stateListener3).call(this, { state: "check", api: api.key, msg: status });
    }
  }
  async downloadMissingAPIs() {
    var _a2;
    for (const api of APIS_TO_CHECK) {
      const builtInAPI = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, api.key);
      const status = __privateGet(this, _stateAPIS)[api.key];
      const superThis = this;
      try {
        if (status === "downloadable") {
          await builtInAPI.create({
            ...api.params,
            ...api.downloadParams,
            monitor(m2) {
              m2.addEventListener("downloadprogress", (e2) => {
                var _a3;
                const progress = Math.round(e2.loaded / e2.total * 100);
                __privateGet(_a3 = superThis, _stateListener3).call(_a3, { state: "downloadModel", api: api.key, msg: progress });
              });
            }
          });
          __privateGet(_a2 = superThis, _stateListener3).call(_a2, { state: "readyModel", api: api.key, msg: "Ready" });
          __privateGet(this, _stateAPIS)[api.key] = status;
        }
      } catch (error) {
        log(`Error Downloading model ${api.key}`, "error", error);
      }
    }
  }
  /**
   * 
   * @param {string} text : langue à détecter
   * @returns @type {Object}
   * @property {string} detectedLanguage : FR, ...
   * @property {number} confidence : % of confidence
   */
  async detectLanguage(text) {
    if (!text) {
      return log("Texte manquant", "error");
    }
    log(`Appel ${KEY_LANGAGE_DETECTOR}...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_LANGAGE_DETECTOR);
      if (!api) throw new Error("API non trouvée");
      const detector = await api.create();
      const results = await detector.detect(text);
      log(`Détection réussie : ${results[0].detectedLanguage}`);
      return {
        detectedLanguage: results[0].detectedLanguage,
        confidence: Math.round(results[0].confidence * 100)
      };
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   * 
   * @param {string} text 
   * @param {string} sourceLanguage : fr or en
   * @param {string} targetLanguage : fr or en
   * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
   */
  async translate(text, sourceLanguage, targetLanguage) {
    if (!text) {
      return log("Texte manquant", "error");
    }
    log(`Appel ${KEY_TRANSLATOR} (${sourceLanguage.toUpperCase()} -> ${targetLanguage.toUpperCase()})...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_TRANSLATOR);
      if (!api) throw new Error("API non trouvée");
      const translator = await api.create({ sourceLanguage, targetLanguage });
      __privateSet(this, _lastSession, translator);
      const result = translator.translateStreaming(text);
      log("Traduction stréamée");
      return result;
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   *
   * @param {string} text
   * @param {string} language : fr or en
   * @param {Object} options : {type, format, length}
   * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
   */
  async summarize(text, language, options = {}) {
    if (!text) return log("Texte manquant", "error");
    log(`Appel ${KEY_SUMMARIZER} (Contexte: ${language || "auto"})...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_SUMMARIZER);
      if (!api) throw new Error("API non trouvée");
      const config = {
        type: options.type || "tldr",
        format: options.format || "plain-text",
        length: options.length || "medium"
      };
      if (language) {
        config.expectedInputLanguages = [language];
        config.outputLanguage = language;
        config.expectedContextLanguages = [language];
        config.sharedContext = `Processing a document in ${language}. Please provide the summary in the same language.`;
      }
      const summarizer = await api.create(config);
      __privateSet(this, _lastSession, summarizer);
      const result = summarizer.summarizeStreaming(text);
      log("Résumé streammé");
      return result;
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   * 
   * @param {string} text : subject 
   * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
   */
  async write(text) {
    if (!text) return log("Sujet manquant", "error");
    log(`Appel ${KEY_WRITER} API...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_WRITER);
      if (!api) throw new Error("API non trouvée");
      const writer = await api.create();
      __privateSet(this, _lastSession, writer);
      const result = await writer.writeStreaming(text, { format: "plain-text" });
      log("Écriture stréamée");
      return result;
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   * 
   * @param {string} text : subject 
   * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
   */
  async rewrite(text) {
    if (!text) return log("Texte manquant", "error");
    log(`Appel ${KEY_REWRITER} API...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_REWRITER);
      if (!api) throw new Error("API non trouvée");
      const rewriter = await api.create();
      __privateSet(this, _lastSession, rewriter);
      const result = await rewriter.rewriteStreaming(text, { format: "plain-text" });
      log("Réécriture stréamée", "success");
      return result;
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   * 
   * @param {string} text : subject 
   * @returns @type {Object} ProofreadResult
   * @property {Array<Object>} corrections
   */
  async proofread(text) {
    if (!text) return log("Texte manquant", "error");
    log(`Appel ${KEY_PROOFREADER} API...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_PROOFREADER);
      if (!api) throw new Error("API non trouvée");
      const proofreader = await api.create();
      __privateSet(this, _lastSession, proofreader);
      const result = await proofreader.proofread(text);
      log("Correction réussie");
      return result;
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   * Pré-crée une session LanguageModel (pour éviter la latence au premier message)
   * @returns {Promise<Object|null>} la session créée, ou null en cas d'erreur
   */
  async createPromptSession() {
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_LANGAGE_MODEL);
      if (!api) return null;
      const session = await api.create({
        expectedInputs: [{ type: "text" }, { type: "image" }],
        initialPrompts: [
          { role: "system", content: LEMA_PROMPT_SYSTEM }
        ]
      });
      __privateSet(this, _lastSession, session);
      log("Session Lema pré-créée");
      return session;
    } catch (e2) {
      log(`Erreur pré-création session: ${e2.message}`, "error");
      return null;
    }
  }
  /**
   *
   * @param @type {Object}
   * @property {string} text: the text
   * @property {binary} image: the image to analyse
   * @property {Object} session: the session to continue
   * @returns @type {Object}
   * @property {Object} session : the session used
   * @property {Array<Promise<String>>} streams : the stream of chunks
   */
  async prompt({ text, image, session }) {
    if (!text && !image) return log("Entrée manquante", "error");
    log(`Appel ${KEY_LANGAGE_MODEL} (Gemma )...`);
    try {
      const api = __privateMethod(this, _BuiltInControler_instances, getAPI_fn).call(this, KEY_LANGAGE_MODEL);
      if (!api) throw new Error("API non trouvée");
      let usedSession = void 0;
      if (session) {
        usedSession = session;
      } else {
        usedSession = await api.create({
          expectedInputs: [{ type: "text" }, { type: "image" }],
          initialPrompts: [
            {
              role: "system",
              content: LEMA_PROMPT_SYSTEM
            }
          ]
        });
      }
      __privateSet(this, _lastSession, usedSession);
      let stream = void 0;
      if (image) {
        log("Traitement multimodal (image)...");
        stream = usedSession.promptStreaming([{
          role: "user",
          content: [
            { type: "text", value: text },
            { type: "image", value: image }
          ]
        }]);
      } else {
        stream = usedSession.promptStreaming(text);
      }
      log("Réponse stréamée");
      return {
        session: usedSession,
        stream
      };
    } catch (e2) {
      log(`Erreur: ${e2.message}`, "error");
    }
  }
  /**
   *
   * @returns {number} the context still available in session if API exists, NaN else
   */
  getAvailbaleContext() {
    if (!__privateGet(this, _lastSession)) {
      return NaN;
    }
    const inputQuota = __privateGet(this, _lastSession).inputQuota;
    const inputUsage = __privateGet(this, _lastSession).inputUsage || __privateGet(this, _lastSession).tokensSoFar || 0;
    const inputLeft = inputQuota - inputUsage;
    return inputLeft;
  }
  /**
   * Obtient les infos complètes du contexte du modèle
   * @returns {Object} { remaining: number, total: number } ou { remaining: 0, total: 0 }
   */
  getContextInfo() {
    if (!__privateGet(this, _lastSession)) {
      return { remaining: 0, total: 0 };
    }
    const inputQuota = __privateGet(this, _lastSession).inputQuota;
    const inputUsage = __privateGet(this, _lastSession).inputUsage || __privateGet(this, _lastSession).tokensSoFar || 0;
    log("inputQuota:", "debug", inputQuota);
    log("inputUsage:", "debug", inputUsage);
    if (!inputQuota) {
      return { remaining: 0, total: 0 };
    }
    return {
      remaining: inputQuota - inputUsage,
      total: inputQuota
    };
  }
  /**
   * Obtient l'état actuel de toutes les APIs
   * @returns {Object} État des APIs { key: 'status', ... }
   */
  getAPIsState() {
    return __privateGet(this, _stateAPIS);
  }
  /**
   * 
   * @param {Object} session 
   */
  closeSession(session) {
    try {
      if (session) {
        session.destroy();
      }
    } catch (error) {
      log("Error pendant la desctruction de la session", "error", error);
    }
  }
}
_stateListener3 = new WeakMap();
_stateAPIS = new WeakMap();
_lastSession = new WeakMap();
_BuiltInControler_instances = new WeakSet();
getAPI_fn = function(name) {
  const apis = {
    LanguageDetector: window.LanguageDetector,
    Translator: window.Translator,
    Summarizer: window.Summarizer,
    LanguageModel: window.LanguageModel,
    Writer: window.Writer,
    Rewriter: window.Rewriter,
    Proofreader: window.Proofreader
  };
  return apis[name];
};
class ProofReaderFixControler {
  constructor() {
    __privateAdd(this, _ProofReaderFixControler_instances);
    __privateAdd(this, _activeCorrection, null);
    __privateAdd(this, _currentText, "");
    __privateAdd(this, _corrections, []);
    __privateAdd(this, _paragraphElement, null);
    __privateAdd(this, _textareaElement, null);
  }
  /**
   * Render the results with highlights
   * @param {Object} result - proofread result with corrections array
   * @param {HTMLElement} paragraphElement - target element for rendered output
   * @param {HTMLTextAreaElement} textareaElement - textarea with input text
   */
  renderResult(result, paragraphElement, textareaElement) {
    __privateSet(this, _paragraphElement, paragraphElement);
    __privateSet(this, _textareaElement, textareaElement);
    __privateSet(this, _currentText, textareaElement.value);
    __privateSet(this, _corrections, result.corrections || []);
    __privateMethod(this, _ProofReaderFixControler_instances, render_fn).call(this);
  }
  /**
   * Show tooltip with correction suggestion
   */
  showTooltip(event, correction) {
    this.hideTooltip();
    __privateSet(this, _activeCorrection, correction);
    const tooltip = document.createElement("div");
    tooltip.id = "correction-tooltip";
    tooltip.className = "correction-popup";
    tooltip.style.position = "fixed";
    tooltip.style.background = "rgba(30,30,30,0.95)";
    tooltip.style.border = "1px solid rgba(168,85,247,0.5)";
    tooltip.style.borderRadius = "8px";
    tooltip.style.padding = "12px";
    tooltip.style.minWidth = "250px";
    tooltip.style.zIndex = "99999";
    tooltip.style.flexDirection = "column";
    tooltip.style.display = "flex";
    tooltip.style.gap = "8px";
    tooltip.style.color = "white";
    tooltip.style.fontSize = "14px";
    const header = document.createElement("div");
    header.className = "popup-header";
    header.textContent = "Suggested Correction";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "4px";
    const suggestion = document.createElement("div");
    suggestion.className = "suggestion-text";
    suggestion.textContent = correction.correction || "No suggestion";
    suggestion.style.padding = "8px";
    suggestion.style.background = "rgba(34,197,94,0.2)";
    suggestion.style.borderRadius = "4px";
    suggestion.style.borderLeft = "3px solid #22c55e";
    const explanation = document.createElement("div");
    explanation.className = "explanation-text";
    explanation.textContent = correction.explanation || "";
    explanation.style.fontSize = "12px";
    explanation.style.color = "rgba(255,255,255,0.7)";
    const actions = document.createElement("div");
    actions.className = "popup-actions";
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.marginTop = "4px";
    const btnCancel = document.createElement("button");
    btnCancel.id = "btn-cancel-correction";
    btnCancel.className = "btn btn-secondary btn-small";
    btnCancel.textContent = "Ignore";
    btnCancel.style.padding = "6px 12px";
    btnCancel.style.background = "rgba(107,114,128,0.5)";
    btnCancel.style.border = "none";
    btnCancel.style.color = "white";
    btnCancel.style.borderRadius = "4px";
    btnCancel.style.cursor = "pointer";
    btnCancel.style.fontSize = "12px";
    btnCancel.addEventListener("click", () => this.hideTooltip());
    const btnApply = document.createElement("button");
    btnApply.id = "btn-apply-correction";
    btnApply.className = "btn btn-apply btn-small";
    btnApply.textContent = "Apply";
    btnApply.style.padding = "6px 12px";
    btnApply.style.background = "rgba(34,197,94,0.6)";
    btnApply.style.border = "none";
    btnApply.style.color = "white";
    btnApply.style.borderRadius = "4px";
    btnApply.style.cursor = "pointer";
    btnApply.style.fontSize = "12px";
    btnApply.addEventListener("click", () => this.applyCorrection());
    tooltip.appendChild(header);
    tooltip.appendChild(suggestion);
    if (explanation.textContent) tooltip.appendChild(explanation);
    actions.appendChild(btnCancel);
    actions.appendChild(btnApply);
    tooltip.appendChild(actions);
    document.body.appendChild(tooltip);
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
    const closeOnClick = () => {
      this.hideTooltip();
      document.removeEventListener("click", closeOnClick);
    };
    document.addEventListener("click", closeOnClick);
  }
  /**
   * Hide the tooltip
   */
  hideTooltip() {
    const existing = document.getElementById("correction-tooltip");
    if (existing) existing.remove();
    __privateSet(this, _activeCorrection, null);
  }
  /**
   * Apply single correction
   */
  applyCorrection() {
    if (!__privateGet(this, _activeCorrection)) return;
    const { startIndex, endIndex, correction } = __privateGet(this, _activeCorrection);
    __privateSet(this, _currentText, __privateGet(this, _currentText).substring(0, startIndex) + correction + __privateGet(this, _currentText).substring(endIndex));
    const offset = correction.length - (endIndex - startIndex);
    __privateSet(this, _corrections, __privateGet(this, _corrections).filter((c2) => c2 !== __privateGet(this, _activeCorrection)).map((c2) => {
      if (c2.startIndex > endIndex) {
        return { ...c2, startIndex: c2.startIndex + offset, endIndex: c2.endIndex + offset };
      }
      return c2;
    }));
    if (__privateGet(this, _textareaElement)) {
      __privateGet(this, _textareaElement).value = __privateGet(this, _currentText);
    }
    this.hideTooltip();
    __privateMethod(this, _ProofReaderFixControler_instances, render_fn).call(this);
  }
  /**
   * Apply all corrections at once
   */
  applyAllCorrections() {
    const sorted = [...__privateGet(this, _corrections)].sort((a2, b2) => b2.startIndex - a2.startIndex);
    for (const correction of sorted) {
      __privateSet(this, _currentText, __privateGet(this, _currentText).substring(0, correction.startIndex) + correction.correction + __privateGet(this, _currentText).substring(correction.endIndex));
    }
    __privateSet(this, _corrections, []);
    if (__privateGet(this, _textareaElement)) {
      __privateGet(this, _textareaElement).value = __privateGet(this, _currentText);
    }
    if (__privateGet(this, _paragraphElement)) {
      __privateGet(this, _paragraphElement).innerHTML = "";
    }
  }
}
_activeCorrection = new WeakMap();
_currentText = new WeakMap();
_corrections = new WeakMap();
_paragraphElement = new WeakMap();
_textareaElement = new WeakMap();
_ProofReaderFixControler_instances = new WeakSet();
/**
 * Internal render method - rebuild paragraph with highlights
 */
render_fn = function() {
  __privateGet(this, _paragraphElement).innerHTML = "";
  const { corrections } = { corrections: __privateGet(this, _corrections) };
  let lastIndex = 0;
  corrections.forEach((correction) => {
    if (correction.startIndex > lastIndex) {
      const span = document.createElement("span");
      span.textContent = __privateGet(this, _currentText).substring(lastIndex, correction.startIndex);
      __privateGet(this, _paragraphElement).appendChild(span);
    }
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-highlight";
    errorSpan.style.background = "rgba(239,68,68,0.4)";
    errorSpan.style.borderBottom = "2px solid #ef4444";
    errorSpan.style.cursor = "pointer";
    errorSpan.style.borderRadius = "2px";
    errorSpan.style.padding = "0 2px";
    errorSpan.textContent = __privateGet(this, _currentText).substring(correction.startIndex, correction.endIndex);
    errorSpan.addEventListener("click", (e2) => {
      e2.stopPropagation();
      this.showTooltip(e2, correction);
    });
    __privateGet(this, _paragraphElement).appendChild(errorSpan);
    lastIndex = correction.endIndex;
  });
  if (lastIndex < __privateGet(this, _currentText).length) {
    const span = document.createElement("span");
    span.textContent = __privateGet(this, _currentText).substring(lastIndex);
    __privateGet(this, _paragraphElement).appendChild(span);
  }
};
function statusBadge(label, status) {
  const statusConfig = {
    "available": { color: "#22c55e", icon: "✓" },
    "downloadable": { color: "#f59e0b", icon: "⬇" },
    "unavailable": { color: "#ef4444", icon: "✗" }
  };
  const config = statusConfig[status] || statusConfig["unavailable"];
  return b$1`
        <div style="
            display:flex;align-items:center;gap:8px;
            padding:8px 12px;
            background:${config.color}20;
            border:1px solid ${config.color}40;
            border-radius:8px;
            font-size:12px;font-weight:600;color:${config.color}">
            <span style="font-weight:800">${config.icon}</span>
            <span>${label}</span>
        </div>
    `;
}
class APIStatusWidget extends HTMLElement {
  constructor() {
    super();
    this._stateAPIS = {};
    this._collapsed = true;
  }
  connectedCallback() {
    this._render();
  }
  /**
   * Mettre à jour l'état des APIs
   * @param {Object} stateAPIS - État des APIs { key: 'status', ... }
   */
  updateAPIs(stateAPIS) {
    this._stateAPIS = stateAPIS;
    this._render();
  }
  _render() {
    D(this._tpl(), this);
  }
  _tpl() {
    const APIS_LABELS = {
      "LanguageDetector": "Language Detector",
      "Translator": "Translator",
      "Summarizer": "Summarizer",
      "LanguageModel": "Language Model",
      "Writer": "Writer",
      "Rewriter": "Rewriter",
      "Proofreader": "Proofreader"
    };
    const apiEntries = Object.entries(this._stateAPIS).map(([key, status]) => ({
      label: APIS_LABELS[key] || key,
      status
    }));
    return b$1`
            <div style="
                background:rgba(255,255,255,0.97);
                backdrop-filter:blur(12px);
                border:1px solid #e2e8f0;
                border-radius:14px;
                box-shadow:0 6px 30px rgba(0,0,0,0.16);
                width:340px;
                font-family:system-ui,'Segoe UI',sans-serif;
                overflow:hidden;
            ">
                <!-- En-tête -->
                <div style="
                    display:flex;justify-content:space-between;align-items:center;
                    padding:10px 16px;
                    background:#f1f5f9;border-bottom:1px solid #e2e8f0;
                    cursor:move;user-select:none"
                    @mousedown="${(e2) => this._drag(e2)}">
                    <span style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#8b5cf6">
                        ◈ APIs Status
                    </span>
                    <button style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:14px;padding:0;line-height:1"
                        @click="${() => {
      this._collapsed = !this._collapsed;
      this._render();
    }}">
                        ${this._collapsed ? "▼" : "▲"}
                    </button>
                </div>

                ${!this._collapsed ? b$1`
                    <div style="padding:14px 16px;display:flex;flex-direction:column;gap:12px">
                        <!-- APIs Status -->
                        ${apiEntries.length > 0 ? apiEntries.map((api) => statusBadge(api.label, api.status)) : b$1`
                            <div style="text-align:center;color:#94a3b8;font-size:14px;padding:20px 0">
                                Aucune API à afficher
                            </div>
                        `}
                    </div>
                ` : ""}
            </div>
        `;
  }
  _drag(e2) {
    const rect = this.getBoundingClientRect();
    const dx = e2.clientX - rect.left;
    const dy = e2.clientY - rect.top;
    const move = (ev) => {
      this.style.left = ev.clientX - dx + "px";
      this.style.top = ev.clientY - dy + "px";
      this.style.right = "auto";
      this.style.bottom = "auto";
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }
  /**
   * Toggle collapse state
   */
  toggleCollapse() {
    this._collapsed = !this._collapsed;
    this._render();
  }
}
customElements.define("api-status-widget", APIStatusWidget);
class APIStatusOverlay {
  // État temporaire des APIs
  constructor() {
    __privateAdd(this, _overlayWidget2);
    __privateAdd(this, _apiStates, {});
  }
  /**
   * Ajoute le widget d'état des APIs
   */
  addOverlayWidget() {
    try {
      if (__privateGet(this, _overlayWidget2)) {
        log("API Status Overlay already exists");
        return;
      }
      __privateSet(this, _overlayWidget2, document.createElement("api-status-widget"));
      Object.assign(__privateGet(this, _overlayWidget2).style, {
        position: "fixed",
        bottom: "16px",
        left: "16px",
        zIndex: "10000"
      });
      document.body.appendChild(__privateGet(this, _overlayWidget2));
      __privateGet(this, _overlayWidget2).updateAPIs(__privateGet(this, _apiStates));
      log("API Status Overlay added successfully");
    } catch (error) {
      log("Error adding API Status Overlay:", "error", error);
    }
  }
  /**
   * Retire le widget d'état des APIs
   */
  removeOverlayWidget() {
    try {
      if (__privateGet(this, _overlayWidget2)) {
        document.body.removeChild(__privateGet(this, _overlayWidget2));
      }
      __privateSet(this, _overlayWidget2, null);
      log("API Status Overlay removed successfully");
    } catch (error) {
      log("Error removing API Status Overlay:", "error", error);
    }
  }
  /**
   * Mettre à jour l'état d'une API et rafraîchir l'affichage
   * @param {string} apiKey - Clé de l'API
   * @param {string} status - Statut de l'API
   */
  updateAPIStatus(apiKey, status) {
    __privateGet(this, _apiStates)[apiKey] = status;
    if (__privateGet(this, _overlayWidget2)) {
      __privateGet(this, _overlayWidget2).updateAPIs(__privateGet(this, _apiStates));
    }
  }
  /**
   * Obtient l'état temporaire des APIs
   */
  getAPIsState() {
    return __privateGet(this, _apiStates);
  }
  /**
   * Toggle le collapse du widget
   */
  toggleCollapse() {
    if (__privateGet(this, _overlayWidget2)) {
      __privateGet(this, _overlayWidget2).toggleCollapse();
    }
  }
}
_overlayWidget2 = new WeakMap();
_apiStates = new WeakMap();
class PromptControler {
  constructor(builtInControler = null) {
    __privateAdd(this, _apiStatusOverlay);
    __privateAdd(this, _builtInControler);
    __privateAdd(this, _activeChatComponent);
    __privateSet(this, _builtInControler, builtInControler);
    __privateSet(this, _apiStatusOverlay, new APIStatusOverlay());
    __privateSet(this, _activeChatComponent, null);
  }
  /**
   * Définir le BuiltInControler après création (si nécessaire)
   */
  setBuiltInControler(builtInControler) {
    __privateSet(this, _builtInControler, builtInControler);
  }
  /**
   * Définir le ChatComponent actif pour mettre à jour ses stats
   */
  setActiveChatComponent(chatComponent) {
    __privateSet(this, _activeChatComponent, chatComponent);
  }
  /**
   * Callback à passer au BuiltInControler pour écouter les événements
   * Exemple: new BuiltInControler(promptControler.handleBuiltInStateChange.bind(promptControler))
   */
  handleBuiltInStateChange(event) {
    const { state, api, msg } = event;
    if (state === "check") {
      __privateGet(this, _apiStatusOverlay).updateAPIStatus(api, msg);
    } else if (state === "downloadModel" || state === "readyModel") {
      __privateGet(this, _apiStatusOverlay).updateAPIStatus(api, msg);
    }
  }
  /**
   * Vérifie s'il y a des APIs à télécharger et les télécharge automatiquement
   */
  async downloadMissingAPIsIfNeeded() {
    if (!__privateGet(this, _builtInControler)) return;
    const apiStates = __privateGet(this, _apiStatusOverlay).getAPIsState();
    const hasDownloadable = Object.values(apiStates).some((status) => status === "downloadable");
    if (hasDownloadable) {
      log("Lancement du téléchargement des APIs...");
      await __privateGet(this, _builtInControler).downloadMissingAPIs();
    }
  }
  /**
   * Affiche le widget d'état des APIs
   */
  showAPIStatus() {
    __privateGet(this, _apiStatusOverlay).addOverlayWidget();
  }
  /**
   * Masque le widget d'état des APIs
   */
  hideAPIStatus() {
    __privateGet(this, _apiStatusOverlay).removeOverlayWidget();
  }
  /**
   * Toggle le collapse du widget d'état des APIs
   */
  toggleAPIStatus() {
    __privateGet(this, _apiStatusOverlay).toggleCollapse();
  }
  /**
   * Mettre à jour l'affichage du contexte dans le chat actif
   */
  updateContextDisplay() {
    if (__privateGet(this, _builtInControler)) {
      const contextInfo = __privateGet(this, _builtInControler).getContextInfo();
      if (__privateGet(this, _activeChatComponent)) {
        __privateGet(this, _activeChatComponent).updateContext(contextInfo.remaining, contextInfo.total);
      }
    }
  }
}
_apiStatusOverlay = new WeakMap();
_builtInControler = new WeakMap();
_activeChatComponent = new WeakMap();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = globalThis, e$1 = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$1 = Symbol(), o$2 = /* @__PURE__ */ new WeakMap();
let n$1 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$1) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$1 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$2.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$2.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$1 = (t2) => new n$1("string" == typeof t2 ? t2 : t2 + "", void 0, s$1), i$2 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$1(o2, t2, s$1);
}, S2 = (s2, o2) => {
  if (e$1) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$1 = e$1 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$1(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$1, defineProperty: e, getOwnPropertyDescriptor: h, getOwnPropertyNames: r, getOwnPropertySymbols: o$1, getPrototypeOf: n2 } = Object, a = globalThis, c = a.trustedTypes, l = c ? c.emptyScript : "", p = a.reactiveElementPolyfillSupport, d = (t2, s2) => t2, u = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f = (t2, s2) => !i$1(t2, s2), b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t2 = n2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t3 = this.properties, s2 = [...r(t3), ...o$1(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$1(s3));
    } else void 0 !== s2 && i2.push(c$1(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S2(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    var _a2;
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ?? (i2 = r2.getPropertyOptions(t2)), !((i2.hasChanged ?? f)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p == null ? void 0 : p({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return E;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o = s.litElementPolyfillSupport;
o == null ? void 0 : o({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
class ChatComponent extends i {
  constructor() {
    super();
    __privateAdd(this, _ChatComponent_instances);
    this.messages = [];
    this.dataId = "";
    this.isStreaming = false;
    this.contextRemaining = 0;
    this.contextTotal = 0;
  }
  render() {
    const contextPercentage = this.contextTotal > 0 ? Math.min(this.contextRemaining / this.contextTotal * 100, 100) : 0;
    const remaining = isNaN(this.contextRemaining) || this.contextRemaining === void 0 ? "?" : this.contextRemaining;
    const total = isNaN(this.contextTotal) || this.contextTotal === void 0 ? "?" : this.contextTotal;
    return b$1`
            <div class="chat-container">
                <div class="context-header">
                    <div class="context-label">Context</div>
                    <div class="context-bar-container">
                        <div class="context-bar">
                            <div class="context-bar-fill" style="width: ${contextPercentage}%"></div>
                        </div>
                        <div class="context-tokens">
                            ${remaining} / ${total}
                        </div>
                    </div>
                </div>
                <div class="messages-container">
                    ${this.messages.map((msg, idx) => b$1`
                        <div class="message ${msg.role} ${msg.streaming ? "streaming" : ""}">
                            <div class="message-bubble">${msg.content}</div>
                        </div>
                    `)}
                </div>
                <div class="input-container">
                    <input
                        type="text"
                        class="input-field"
                        placeholder="Type your message..."
                        @keydown=${(e2) => e2.stopPropagation()}
                        @keyup=${(e2) => e2.stopPropagation()}
                        @keypress=${__privateMethod(this, _ChatComponent_instances, handleKeyPress_fn)}
                    />
                    <button class="send-btn" @click=${__privateMethod(this, _ChatComponent_instances, handleSend_fn)}>Send</button>
                </div>
            </div>
        `;
  }
  updated() {
    const container = this.shadowRoot.querySelector(".messages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
  /**
   * Add a user message to the chat
   * @param {string} text
   */
  addUserMessage(text) {
    this.messages = [...this.messages, { role: "user", content: text, streaming: false }];
  }
  /**
   * Start streaming a message
   * @param {string} id - unique id for this message
   */
  startStreamingMessage(id = null) {
    const msgId = id || `stream-${Date.now()}`;
    this.messages = [...this.messages, { role: "assistant", content: "", streaming: true, id: msgId }];
    return msgId;
  }
  /**
   * Append chunk to streaming message
   * @param {string} msgId - id of the streaming message
   * @param {string} chunk - text chunk to append
   */
  appendToStreamingMessage(msgId, chunk) {
    const msgIndex = this.messages.findIndex((m2) => m2.id === msgId);
    if (msgIndex !== -1) {
      const updated = [...this.messages];
      updated[msgIndex].content += chunk;
      this.messages = updated;
    }
  }
  /**
   * Finish streaming a message
   * @param {string} msgId - id of the streaming message
   */
  finishStreamingMessage(msgId) {
    const msgIndex = this.messages.findIndex((m2) => m2.id === msgId);
    if (msgIndex !== -1) {
      const updated = [...this.messages];
      updated[msgIndex].streaming = false;
      this.messages = updated;
      this.dispatchEvent(new CustomEvent("stream-complete", {
        detail: { messageId: msgId },
        bubbles: true,
        composed: true
      }));
    }
  }
  /**
   * Add a complete message (not streaming)
   * @param {string} text
   * @param {string} role - 'user' or 'assistant'
   */
  addMessage(text, role = "assistant") {
    this.messages = [...this.messages, { role, content: text, streaming: false }];
  }
  /**
   * Clear all messages
   */
  clearMessages() {
    this.messages = [];
  }
  /**
   * Update context information
   * @param {number} remaining - Tokens restants
   * @param {number} total - Tokens totaux
   */
  updateContext(remaining, total) {
    this.contextRemaining = remaining;
    this.contextTotal = total;
  }
}
_ChatComponent_instances = new WeakSet();
handleKeyPress_fn = function(event) {
  event.stopPropagation();
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    __privateMethod(this, _ChatComponent_instances, handleSend_fn).call(this);
  }
};
handleSend_fn = function() {
  const input = this.shadowRoot.querySelector(".input-field");
  const message = input.value.trim();
  if (message) {
    this.dispatchEvent(new CustomEvent("user-message", {
      detail: { text: message },
      bubbles: true,
      composed: true
    }));
    input.value = "";
  }
};
__publicField(ChatComponent, "properties", {
  messages: { type: Array },
  dataId: { type: String, attribute: "data-id" },
  isStreaming: { type: Boolean },
  contextRemaining: { type: Number },
  contextTotal: { type: Number }
});
__publicField(ChatComponent, "styles", i$2`
        :host {
            flex-grow:1;
            --chat-primary: #a855f7;
            --chat-secondary: #22c55e;
            --chat-bg: #0b0f1a;
            --chat-text: #f8fafc;
            --chat-border: rgba(255, 255, 255, 0.1);
            --chat-radius: 12px;
        }

        .chat-container {
            width: 100%;
            height: 600px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid var(--chat-border);
            border-radius: var(--chat-radius);
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            color: var(--chat-text);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .context-header {
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid var(--chat-border);
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .context-label {
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .context-bar-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .context-bar {
            flex: 1;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
        }

        .context-bar-fill {
            height: 100%;
            background: #3b82f6;
            transition: width 0.3s ease;
        }

        .context-tokens {
            font-size: 12px;
            font-weight: 700;
            color: white;
            white-space: nowrap;
            min-width: 60px;
            text-align: right;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 2rem;
        }

        .message {
            display: flex;
            animation: slideIn 0.3s ease-out;
        }

        .message.user {
            justify-content: flex-end;
        }

        .message.assistant {
            justify-content: flex-start;
        }

        .message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 8px;
            word-wrap: break-word;
            white-space: pre-wrap;
        }

        .message.user .message-bubble {
            background: var(--chat-primary);
            color: white;
            border-left: 3px solid var(--chat-primary);
        }

        .message.assistant .message-bubble {
            background: rgba(168, 85, 247, 0.1);
            border: 1px solid var(--chat-primary);
            border-left: 3px solid var(--chat-primary);
        }

        .message.streaming .message-bubble::after {
            content: '▌';
            animation: blink 0.8s infinite;
        }

        @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .input-container {
            border-top: 1px solid var(--chat-border);
            padding: 12px;
            display: flex;
            gap: 8px;
        }

        .input-field {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--chat-border);
            border-radius: 6px;
            padding: 10px 12px;
            color: var(--chat-text);
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        }

        .input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .input-field:focus {
            outline: none;
            border-color: var(--chat-primary);
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
        }

        .send-btn {
            background: linear-gradient(135deg, var(--chat-primary), #c084fc);
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            padding: 10px 16px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .send-btn:active {
            transform: translateY(0);
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
            width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb {
            background: var(--chat-primary);
            border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
            background: #c084fc;
        }
    `);
customElements.define("chat-component", ChatComponent);
class ChatController {
  constructor() {
    __privateAdd(this, _ChatController_instances);
    /**
     * @type {Map<string, ChatComponent>}
     */
    __privateAdd(this, _chatInstances, /* @__PURE__ */ new Map());
    __privateMethod(this, _ChatController_instances, setupChatComponents_fn).call(this);
  }
  /**
   * Get a chat component by its data-id
   * @param {string} dataId - The data-id attribute of the chat component
   * @returns {ChatComponent|null}
   */
  getChat(dataId) {
    const chat = __privateGet(this, _chatInstances).get(dataId);
    if (!chat) {
      log(`Chat component with id "${dataId}" not found`, "error");
      return null;
    }
    return chat;
  }
  /**
   * Add a user message to a specific chat
   * @param {string} dataId - The data-id of the chat component
   * @param {string} text - The message text
   */
  addUserMessage(dataId, text) {
    const chat = this.getChat(dataId);
    if (chat) {
      chat.addUserMessage(text);
    }
  }
  /**
   * Add a complete assistant message to a specific chat
   * @param {string} dataId - The data-id of the chat component
   * @param {string} text - The message text
   */
  addAssistantMessage(dataId, text) {
    const chat = this.getChat(dataId);
    if (chat) {
      chat.addMessage(text, "assistant");
    }
  }
  /**
   * Start streaming a message (for progressive text updates)
   * @param {string} dataId - The data-id of the chat component
   * @param {string} id - Optional: unique id for this stream message
   * @returns {string} The message id for use with appendToStream and finishStream
   */
  startStream(dataId, id = null) {
    const chat = this.getChat(dataId);
    if (chat) {
      return chat.startStreamingMessage(id);
    }
    return null;
  }
  /**
   * Append text chunk to a streaming message
   * @param {string} dataId - The data-id of the chat component
   * @param {string} messageId - The id returned from startStream
   * @param {string} chunk - The text chunk to append
   */
  appendToStream(dataId, messageId, chunk) {
    const chat = this.getChat(dataId);
    if (chat) {
      chat.appendToStreamingMessage(messageId, chunk);
    }
  }
  /**
   * Finish streaming a message (will emit 'stream-complete' event)
   * @param {string} dataId - The data-id of the chat component
   * @param {string} messageId - The id from startStream
   */
  finishStream(dataId, messageId) {
    const chat = this.getChat(dataId);
    if (chat) {
      chat.finishStreamingMessage(messageId);
    }
  }
  /**
   * Clear all messages from a chat
   * @param {string} dataId - The data-id of the chat component
   */
  clearChat(dataId) {
    const chat = this.getChat(dataId);
    if (chat) {
      chat.clearMessages();
    }
  }
  /**
   * Listen for user messages from a specific chat
   * @param {string} dataId - The data-id of the chat component
   * @param {Function} callback - Called with {text: string} when user sends a message
   * @returns {Function} Unsubscribe function
   */
  onUserMessage(dataId, callback) {
    const chat = this.getChat(dataId);
    if (chat) {
      const handler = (event) => {
        var _a2;
        callback((_a2 = event.detail) == null ? void 0 : _a2.text);
      };
      chat.addEventListener("user-message", handler);
      return () => {
        chat.removeEventListener("user-message", handler);
      };
    }
    return () => {
    };
  }
  /**
   * Listen for stream completion events from a specific chat
   * @param {string} dataId - The data-id of the chat component
   * @param {Function} callback - Called with {messageId: string} when stream completes
   * @returns {Function} Unsubscribe function
   */
  onStreamComplete(dataId, callback) {
    const chat = this.getChat(dataId);
    if (chat) {
      const handler = (event) => {
        callback(event.detail);
      };
      chat.addEventListener("stream-complete", handler);
      return () => {
        chat.removeEventListener("stream-complete", handler);
      };
    }
    return () => {
    };
  }
  /**
   * Re-scan the DOM for new chat components (useful if components are added dynamically)
   */
  refreshChatInstances() {
    __privateMethod(this, _ChatController_instances, setupChatComponents_fn).call(this);
  }
  /**
   * Set the active chat component on the PromptControler
   * @param {string} dataId - The data-id of the active chat
   * @param {PromptControler} promptControler - The PromptControler instance
   */
  setActiveChat(dataId, promptControler) {
    const chat = this.getChat(dataId);
    if (chat && promptControler) {
      promptControler.setActiveChatComponent(chat);
    }
  }
}
_chatInstances = new WeakMap();
_ChatController_instances = new WeakSet();
/**
 * Find all chat components on the page and register them
 */
setupChatComponents_fn = function() {
  const chats = document.querySelectorAll("chat-component");
  chats.forEach((chat) => {
    const dataId = chat.getAttribute("data-id");
    if (dataId) {
      __privateGet(this, _chatInstances).set(dataId, chat);
    }
  });
};
class ActionHandler {
  constructor() {
    __privateAdd(this, _handlers, /* @__PURE__ */ new Map());
    // Map<actionName, callback>
    __privateAdd(this, _buffer, "");
    // Buffer pour reconstituer les actions fragmentées
    __privateAdd(this, _completedActions, []);
  }
  // Actions complètes trouvées
  /**
   * Enregistre un handler pour une action
   * @param {string} actionName - Nom de l'action (ex: NEXT_SLIDE)
   * @param {Function} callback - Fonction à exécuter quand l'action est trouvée
   */
  registerActionHandler(actionName, callback) {
    __privateGet(this, _handlers).set(actionName, callback);
  }
  /**
   * Traite un chunk et extrait les actions complètes
   * Gère les actions fragmentées sur plusieurs chunks
   * @param {string} chunk - Chunk de texte à traiter
   * @returns {Object} {cleanText: string, completedActions: string[]}
   */
  processChunk(chunk) {
    __privateSet(this, _buffer, __privateGet(this, _buffer) + chunk);
    const actionRegex = /\[\[ACTION:([A-Z_]+)\]\]/g;
    let cleanText = __privateGet(this, _buffer);
    let match;
    const actions = [];
    while ((match = actionRegex.exec(__privateGet(this, _buffer))) !== null) {
      actions.push(match[1]);
    }
    cleanText = cleanText.replace(actionRegex, "");
    const lastBracketIndex = Math.max(
      __privateGet(this, _buffer).lastIndexOf("["),
      __privateGet(this, _buffer).lastIndexOf("[["),
      __privateGet(this, _buffer).lastIndexOf("[[ACTION")
    );
    let remainingBuffer = "";
    if (lastBracketIndex > -1) {
      const potentialStart = __privateGet(this, _buffer).substring(lastBracketIndex);
      if (potentialStart.match(/^\[\[?(?:ACTION)?(?::)?[A-Z_]*$/) && !potentialStart.includes("]]")) {
        remainingBuffer = potentialStart;
        cleanText = cleanText.substring(0, cleanText.lastIndexOf(potentialStart));
      }
    }
    __privateSet(this, _buffer, remainingBuffer);
    return {
      cleanText,
      completedActions: actions
    };
  }
  /**
   * Force l'exécution de toutes les actions en attente
   * À appeler à la fin du stream
   */
  flushActions() {
    const actions = __privateGet(this, _completedActions);
    __privateSet(this, _completedActions, []);
    __privateSet(this, _buffer, "");
    return actions;
  }
  /**
   * Exécute les callbacks associés aux actions
   * @param {string[]} actionNames - Noms des actions à exécuter
   */
  executeActions(actionNames) {
    for (const actionName of actionNames) {
      if (__privateGet(this, _handlers).has(actionName)) {
        try {
          __privateGet(this, _handlers).get(actionName)();
        } catch (error) {
          log(`Erreur lors de l'exécution de l'action ${actionName}:`, "error", error);
        }
      } else {
        log(`Action non enregistrée: ${actionName}`, "warn");
      }
    }
  }
  /**
   * Ajoute une action complétée à la liste des actions à exécuter
   * @param {string} actionName - Nom de l'action
   */
  addCompletedAction(actionName) {
    __privateGet(this, _completedActions).push(actionName);
  }
  /**
   * Récupère toutes les actions complétées en attente d'exécution
   * @returns {string[]}
   */
  getCompletedActions() {
    return [...__privateGet(this, _completedActions)];
  }
  /**
   * Réinitialise le handler (nouveau stream)
   */
  reset() {
    __privateSet(this, _buffer, "");
    __privateSet(this, _completedActions, []);
  }
}
_handlers = new WeakMap();
_buffer = new WeakMap();
_completedActions = new WeakMap();
class CameraController {
  constructor() {
    /**
     * @type {HTMLElement}
     */
    __privateAdd(this, _cameraInstance, null);
  }
  /**
   * Setup camera: find component and start stream
   */
  async setup(element = null) {
    __privateSet(this, _cameraInstance, element || document.querySelector("camera-component"));
    if (!__privateGet(this, _cameraInstance)) {
      console.error("Camera component not found in DOM");
    }
  }
  /**
   * Teardown: stop camera stream
   */
  teardown() {
    if (__privateGet(this, _cameraInstance)) {
      __privateGet(this, _cameraInstance).stopCamera();
    }
  }
  /**
   * Get the last captured photo
   * @returns {HTMLCanvasElement|null}
   */
  getLastPhoto() {
    if (!__privateGet(this, _cameraInstance)) return null;
    return __privateGet(this, _cameraInstance).getLastPhoto();
  }
  /**
   * Listen for photo capture events
   * @param {Function} callback - Called with {image: HTMLCanvasElement}
   * @returns {Function} Unsubscribe function
   */
  onPhotoCapture(callback) {
    if (!__privateGet(this, _cameraInstance)) return () => {
    };
    const handler = (event) => {
      var _a2;
      callback((_a2 = event.detail) == null ? void 0 : _a2.image);
    };
    __privateGet(this, _cameraInstance).addEventListener("photo-captured", handler);
    return () => {
      __privateGet(this, _cameraInstance).removeEventListener("photo-captured", handler);
    };
  }
}
_cameraInstance = new WeakMap();
class CameraComponent extends i {
  constructor() {
    super();
    __privateAdd(this, _CameraComponent_instances);
    __privateAdd(this, _videoRef);
    __privateAdd(this, _canvasRef);
    this.stream = null;
    this.capturedImage = null;
    this.isCapturing = false;
    __privateSet(this, _videoRef, null);
    __privateSet(this, _canvasRef, null);
  }
  render() {
    return b$1`
            <div class="camera-container">
                <div class="video-container">
                    <video
                        autoplay
                        playsinline
                        @click=${__privateMethod(this, _CameraComponent_instances, capturePhoto_fn)}
                        style="cursor: ${this.isCapturing ? "pointer" : "default"};"
                    ></video>
                    <canvas></canvas>
                </div>
                <div class="controls">
                    <button
                        class="btn"
                        @click=${__privateMethod(this, _CameraComponent_instances, toggleCamera_fn)}
                        style="background: ${this.stream ? "linear-gradient(135deg, #ef4444, #f87171)" : "var(--camera-primary)"}"
                    >
                        ${this.stream ? "🛑 Stop Camera" : "🎥 Start Camera"}
                    </button>
                    <button
                        class="btn"
                        @click=${__privateMethod(this, _CameraComponent_instances, capturePhoto_fn)}
                        ?disabled=${!this.stream}
                    >
                        📸 Take Photo
                    </button>
                    <div class="thumbnail-container">
                        ${this.capturedImage ? b$1`
                            <img src="${__privateMethod(this, _CameraComponent_instances, canvasToDataUrl_fn).call(this)}" class="thumbnail" alt="captured" />
                            <span class="status-text">✓ Photo captured</span>
                        ` : b$1`
                            <span class="status-text">No photo yet</span>
                        `}
                    </div>
                </div>
            </div>
        `;
  }
  updated() {
    const video = this.shadowRoot.querySelector("video");
    if (video && !video.srcObject && this.stream) {
      video.srcObject = this.stream;
      __privateSet(this, _videoRef, video);
    }
    __privateSet(this, _canvasRef, this.shadowRoot.querySelector("canvas"));
  }
  /**
   * Start the webcam stream
   */
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      this.isCapturing = true;
      this.requestUpdate();
      log("Camera started");
    } catch (error) {
      log(`Error accessing camera: ${error.message}`, "error");
      this.isCapturing = false;
    }
  }
  /**
   * Stop the webcam stream
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
      this.isCapturing = false;
      this.requestUpdate();
      log("Camera stopped");
    }
  }
  /**
   * Get the last captured photo canvas
   */
  getLastPhoto() {
    return this.capturedImage;
  }
}
_videoRef = new WeakMap();
_canvasRef = new WeakMap();
_CameraComponent_instances = new WeakSet();
toggleCamera_fn = async function() {
  if (this.stream) {
    this.stopCamera();
  } else {
    await this.startCamera();
  }
};
/**
 * Capture the current video frame
 */
capturePhoto_fn = function() {
  if (!__privateGet(this, _videoRef) || !__privateGet(this, _canvasRef)) return;
  const ctx = __privateGet(this, _canvasRef).getContext("2d");
  __privateGet(this, _canvasRef).width = __privateGet(this, _videoRef).videoWidth;
  __privateGet(this, _canvasRef).height = __privateGet(this, _videoRef).videoHeight;
  ctx.drawImage(__privateGet(this, _videoRef), 0, 0);
  this.capturedImage = __privateGet(this, _canvasRef);
  this.dispatchEvent(new CustomEvent("photo-captured", {
    detail: { image: __privateGet(this, _canvasRef) },
    bubbles: true,
    composed: true
  }));
  this.requestUpdate();
  log("Photo captured");
};
/**
 * Convert canvas to data URL for preview
 */
canvasToDataUrl_fn = function() {
  if (!this.capturedImage) return "";
  return this.capturedImage.toDataURL("image/jpeg");
};
__publicField(CameraComponent, "properties", {
  stream: { type: Object },
  capturedImage: { type: Object },
  isCapturing: { type: Boolean }
});
__publicField(CameraComponent, "styles", i$2`
        :host {
            flex-grow: 1;
            --camera-primary: #a855f7;
            --camera-secondary: #22c55e;
            --camera-bg: #0b0f1a;
            --camera-text: #f8fafc;
            --camera-border: rgba(255, 255, 255, 0.1);
            --camera-radius: 12px;
        }

        .camera-container {
            width: 100%;
            height: 600px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid var(--camera-border);
            border-radius: var(--camera-radius);
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            color: var(--camera-text);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }

        .video-container {
            flex: 1;
            position: relative;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        canvas {
            display: none;
        }

        .controls {
            padding: 16px;
            border-top: 1px solid var(--camera-border);
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }

        .btn {
            background: linear-gradient(135deg, var(--camera-primary), #c084fc);
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            padding: 10px 16px;
            font-weight: 500;
            transition: all 0.2s;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .thumbnail-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .thumbnail {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            border: 2px solid var(--camera-primary);
            object-fit: cover;
        }

        .status-text {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }
    `);
customElements.define("camera-component", CameraComponent);
class AsyncStreamer {
  constructor() {
    this.queue = [];
    this.resolveNext = null;
    this.done = false;
  }
  callback(text) {
    this.queue.push(text);
    if (this.resolveNext) {
      this.resolveNext();
      this.resolveNext = null;
    }
  }
  finish() {
    this.done = true;
    if (this.resolveNext) {
      this.resolveNext();
      this.resolveNext = null;
    }
  }
  async *generator() {
    while (true) {
      if (this.queue.length > 0) {
        yield this.queue.shift();
      } else if (this.done) {
        break;
      } else {
        await new Promise((resolve) => {
          this.resolveNext = resolve;
        });
      }
    }
  }
}
class TemaMultimodalController {
  constructor() {
    __privateAdd(this, _worker, null);
    __privateAdd(this, _modelLoaded, false);
    console.log("[Tema] Création du Worker...");
    __privateSet(this, _worker, new Worker(new URL(
      /* @vite-ignore */
      "/assets/transformer.worker-DvzOZV8i.js",
      import.meta.url
    ), { type: "module" }));
    __privateGet(this, _worker).onerror = (err) => {
      console.error("[Tema] Erreur Worker non gérée:");
      console.error("  message  :", err.message);
      console.error("  filename :", err.filename);
      console.error("  lineno   :", err.lineno, "| colno:", err.colno);
      console.error("  raw event:", err);
    };
    console.log("[Tema] Worker créé.");
  }
  /**
   * Charge le modèle dans le Worker.
   * Idempotent : les appels suivants retournent immédiatement.
   *
   * @param {function|null} progressCallbackV - callback pour signaler 100% (optionnel)
   * @param {function|null} progressCallbackT - callback pour les étapes de progression
   * @returns {Promise<void>}
   */
  async loadModel(progressCallbackV, progressCallbackT) {
    if (__privateGet(this, _modelLoaded)) {
      console.log("[Tema] Modèle déjà chargé, skip.");
      return;
    }
    console.log("[Tema] Envoi LOAD_MODEL au Worker...");
    return new Promise((resolve, reject) => {
      const handler = ({ data }) => {
        const { type } = data;
        console.log("[Tema] Message reçu du Worker:", type, data.progress ?? data.error ?? "");
        if (type === "LOAD_PROGRESS") {
          if (progressCallbackT) progressCallbackT(data.progress);
        } else if (type === "LOAD_COMPLETE") {
          console.log("[Tema] Modèle chargé avec succès.");
          __privateSet(this, _modelLoaded, true);
          __privateGet(this, _worker).removeEventListener("message", handler);
          if (progressCallbackV) {
            progressCallbackV({ status: "progress", progress: 100, name: "Model ready" });
          }
          resolve();
        } else if (type === "LOAD_ERROR") {
          console.error("[Tema] Erreur de chargement:", data.error);
          __privateGet(this, _worker).removeEventListener("message", handler);
          reject(new Error(data.error));
        }
      };
      __privateGet(this, _worker).addEventListener("message", handler);
      __privateGet(this, _worker).postMessage({ type: "LOAD_MODEL" });
    });
  }
  /**
   * Lance une inférence dans le Worker et retourne un stream async.
   *
   * @param {{ text: string, image?: HTMLCanvasElement|null }} param0
   * @returns {Promise<{ stream: AsyncGenerator<string>, session: null }>}
   */
  async prompt({ text, image }) {
    const id = crypto.randomUUID();
    const asyncStreamer = new AsyncStreamer();
    let imageData = null;
    if (image instanceof HTMLCanvasElement) {
      imageData = image.toDataURL("image/jpeg");
    }
    const handler = ({ data }) => {
      if (data.id !== id) return;
      if (data.type === "CHUNK") {
        asyncStreamer.callback(data.text);
      } else if (data.type === "COMPLETE") {
        asyncStreamer.finish();
        __privateGet(this, _worker).removeEventListener("message", handler);
      } else if (data.type === "ERROR") {
        asyncStreamer.callback(`
❌ Erreur: ${data.error}`);
        asyncStreamer.finish();
        __privateGet(this, _worker).removeEventListener("message", handler);
      }
    };
    __privateGet(this, _worker).addEventListener("message", handler);
    __privateGet(this, _worker).postMessage({ type: "PROMPT", id, text, imageData });
    return {
      stream: asyncStreamer.generator(),
      session: null
    };
  }
}
_worker = new WeakMap();
_modelLoaded = new WeakMap();
const WELCOME_LEMA = 1;
const TRANSLATE_LEMA = 2;
const WRITER_LEMA = 3;
const REWRITE_LEMA = 4;
const SUMMARIZE_LEMA = 5;
const PROOFREAD_LEMA = 6;
const VISION_LEMA = 7;
const TEMA_PROMPT = 8;
const TEMA_MULTIMODAL = 9;
const CONCLUSION = 10;
const _PrezDemosControler = class _PrezDemosControler {
  constructor() {
    __privateAdd(this, _PrezDemosControler_instances);
    /**
     * @type {SpeechRecognitionControler}
     */
    __privateAdd(this, _speechControler, null);
    /**
     * @type {SpeechSynthesisControler}
     */
    __privateAdd(this, _ttsControler, null);
    /**
     * @type  {OverlayStats}
     */
    __privateAdd(this, _overlayControler, null);
    /**
     * @type {MicControler}
     */
    __privateAdd(this, _micControler, null);
    /**
     * @type {BuiltInControler}
     */
    __privateAdd(this, _builtInControler2, null);
    /**
     * @type {PromptControler}
     */
    __privateAdd(this, _promptControler, null);
    /**
     * @type {ChatController}
     */
    __privateAdd(this, _chatController, null);
    /**
     * @type {ActionHandler}
     */
    __privateAdd(this, _actionHandler, null);
    /**
     * @type {CameraController}
     */
    __privateAdd(this, _cameraController, null);
    /**
     * @type {ProofReaderFixControler}
     */
    __privateAdd(this, _proofReaderFixControler, null);
    /**
     * @type {TemaMultimodalController}
     */
    __privateAdd(this, _temaController, null);
    __privateAdd(this, _nbMessageToSpeak, 0);
    __privateAdd(this, _stateDemos, -1);
    __privateAdd(this, _arrayChatHandlers, []);
    __privateAdd(this, _streamStopped2, false);
    __privateAdd(this, _initGema, false);
    __privateAdd(this, _lastSession2, null);
    this.initGraphicalsElements();
    this.initTTSAndSpeech();
    this.initRevealEvents();
    this.initAiApis();
    this.initActionHandlers();
    this.initKeyboardShortcuts();
  }
  initRevealEvents() {
    Reveal.on("slidechanged", () => {
      this.stopTTSAndStream();
    });
    Reveal.addEventListener("in-gemma", async () => {
      if (!__privateGet(this, _initGema)) {
        __privateSet(this, _initGema, true);
        log("In Gemma");
        __privateGet(this, _ttsControler).loadVoices();
        __privateSet(this, _chatController, new ChatController());
        await __privateGet(this, _builtInControler2).checkStateAPIs();
        await __privateGet(this, _promptControler).downloadMissingAPIsIfNeeded();
        __privateGet(this, _promptControler).updateContextDisplay();
        this.initChatHandlers();
        if (!__privateGet(this, _temaController)) {
          __privateSet(this, _temaController, new TemaMultimodalController());
        }
        __privateGet(this, _temaController).loadModel(null, () => {
        }).catch((err) => {
          console.warn("[Tema] Pré-chargement échoué, sera retenté sur le slide:", err);
        });
      }
    });
    Reveal.addEventListener("out-gemma", async () => {
      log("Out Gemma");
      this.removeChatHandlers();
      __privateSet(this, _stateDemos, -1);
      __privateSet(this, _initGema, false);
    });
    Reveal.addEventListener("show-mic-and-stats", async () => {
      log("Show mic and stats");
      __privateGet(this, _micControler).addMicButton();
      __privateGet(this, _overlayControler).addOverlayWidget();
      __privateGet(this, _promptControler).showAPIStatus();
    });
    Reveal.addEventListener("hide-mic-and-stats", async () => {
      log("Hide mic and stats");
      __privateGet(this, _micControler).removeMicButton();
      __privateGet(this, _overlayControler).removeOverlayWidget();
      __privateGet(this, _promptControler).hideAPIStatus();
      __privateSet(this, _stateDemos, -1);
    });
    Reveal.addEventListener("welcome-lema", async () => {
      __privateSet(this, _stateDemos, WELCOME_LEMA);
      __privateMethod(this, _PrezDemosControler_instances, setupWelcomeLemaSlide_fn).call(this);
      if (!__privateGet(this, _lastSession2)) {
        __privateGet(this, _builtInControler2).createPromptSession().then((session) => {
          if (session) __privateSet(this, _lastSession2, session);
        });
      }
    });
    Reveal.addEventListener("translate-lema", () => {
      __privateSet(this, _stateDemos, TRANSLATE_LEMA);
    });
    Reveal.addEventListener("writer-lema", () => {
      __privateSet(this, _stateDemos, WRITER_LEMA);
    });
    Reveal.addEventListener("rewrite-lema", () => {
      __privateSet(this, _stateDemos, REWRITE_LEMA);
    });
    Reveal.addEventListener("summarize-lema", () => {
      __privateSet(this, _stateDemos, SUMMARIZE_LEMA);
    });
    Reveal.addEventListener("proofread-lema", () => {
      __privateSet(this, _stateDemos, PROOFREAD_LEMA);
      __privateSet(this, _proofReaderFixControler, new ProofReaderFixControler());
      __privateMethod(this, _PrezDemosControler_instances, wireProofreadButtons_fn).call(this);
    });
    Reveal.addEventListener("vision-lema", async () => {
      __privateSet(this, _stateDemos, VISION_LEMA);
      if (!__privateGet(this, _cameraController)) {
        __privateSet(this, _cameraController, new CameraController());
      }
      const camEl = document.getElementById("camera-lema");
      await __privateGet(this, _cameraController).setup(camEl);
    });
    Reveal.addEventListener("tema-prompt", async () => {
      __privateSet(this, _stateDemos, TEMA_PROMPT);
      if (!__privateGet(this, _temaController)) {
        __privateSet(this, _temaController, new TemaMultimodalController());
      }
      if (__privateGet(this, _chatController)) {
        __privateGet(this, _chatController).refreshChatInstances();
        const chat = __privateGet(this, _chatController).getChat("tema-prompt");
        if (chat && !chat.__temaPromptHandlerRegistered) {
          chat.__temaPromptHandlerRegistered = true;
          __privateGet(this, _arrayChatHandlers).push(
            __privateGet(this, _chatController).onUserMessage("tema-prompt", (msg) => this.processUserMessage(msg))
          );
        }
      }
      const statusElT = document.getElementById("tema-status-t");
      const progressContainer = document.getElementById("tema-progress-container");
      const progressBarT = document.getElementById("tema-progress-t");
      const progressCallbackT = (progress) => {
        if (progress.status === "progress") {
          if (progressContainer) progressContainer.classList.remove("hidden");
          const pct = Math.round(progress.progress || 0);
          if (progressBarT) progressBarT.style.width = `${pct}%`;
          if (statusElT) statusElT.textContent = `Modèle: ${progress.name || ""} (${pct}%)`;
        }
      };
      if (statusElT) statusElT.textContent = "Initialisation de Tema...";
      if (progressContainer) progressContainer.classList.remove("hidden");
      try {
        await __privateGet(this, _temaController).loadModel(null, progressCallbackT);
        if (statusElT) statusElT.textContent = "✅ Tema est prêt !";
        setTimeout(() => {
          if (progressContainer) progressContainer.classList.add("hidden");
        }, 2e3);
      } catch (err) {
        if (statusElT) statusElT.textContent = `❌ Erreur: ${err.message}`;
      }
    });
    Reveal.addEventListener("tema-multimodal", async () => {
      __privateSet(this, _stateDemos, TEMA_MULTIMODAL);
      if (!__privateGet(this, _temaController)) {
        __privateSet(this, _temaController, new TemaMultimodalController());
      }
      if (__privateGet(this, _chatController)) {
        __privateGet(this, _chatController).refreshChatInstances();
        const chat = __privateGet(this, _chatController).getChat("tema-multimodal");
        if (chat && !chat.__temaMultimodalHandlerRegistered) {
          chat.__temaMultimodalHandlerRegistered = true;
          __privateGet(this, _arrayChatHandlers).push(
            __privateGet(this, _chatController).onUserMessage("tema-multimodal", (msg) => this.processUserMessage(msg))
          );
        }
      }
      await __privateGet(this, _temaController).loadModel(null, () => {
      });
      if (!__privateGet(this, _cameraController)) {
        __privateSet(this, _cameraController, new CameraController());
      }
      const camEl = document.getElementById("camera-tema");
      await __privateGet(this, _cameraController).setup(camEl);
    });
    Reveal.addEventListener("conclusion", async () => {
      __privateSet(this, _stateDemos, CONCLUSION);
      if (__privateGet(this, _chatController)) {
        __privateGet(this, _chatController).refreshChatInstances();
        const chat = __privateGet(this, _chatController).getChat("lema-conclusion");
        if (chat && !chat.__conclusionHandlerRegistered) {
          chat.__conclusionHandlerRegistered = true;
          __privateGet(this, _arrayChatHandlers).push(
            __privateGet(this, _chatController).onUserMessage("lema-conclusion", (msg) => this.processUserMessage(msg))
          );
        }
      }
    });
    Reveal.addEventListener("out-vision", async () => {
      var _a2;
      (_a2 = __privateGet(this, _cameraController)) == null ? void 0 : _a2.teardown();
    });
    Reveal.addEventListener("out-vision-tema", async () => {
      var _a2;
      (_a2 = __privateGet(this, _cameraController)) == null ? void 0 : _a2.teardown();
    });
  }
  initGraphicalsElements() {
    __privateSet(this, _overlayControler, new OverlayStats());
    __privateSet(this, _micControler, new MicControler(this.stateMicListener.bind(this)));
  }
  initTTSAndSpeech() {
    __privateSet(this, _speechControler, new SpeechRecognitionControler(this.stateSpeechListener.bind(this)));
    __privateSet(this, _ttsControler, new SpeechSynthesisControler(this.stateTTSListener.bind(this)));
  }
  async initAiApis() {
    __privateSet(this, _promptControler, new PromptControler(null));
    const stateListener = __privateGet(this, _promptControler).handleBuiltInStateChange.bind(__privateGet(this, _promptControler));
    __privateSet(this, _builtInControler2, new BuiltInControler(stateListener));
    __privateGet(this, _promptControler).setBuiltInControler(__privateGet(this, _builtInControler2));
  }
  /**
   * Initialise les handlers d'action
   */
  initActionHandlers() {
    __privateSet(this, _actionHandler, new ActionHandler());
    __privateGet(this, _actionHandler).registerActionHandler("NEXT_SLIDE", () => {
      log("Action: NEXT_SLIDE");
      Reveal.next();
    });
    __privateGet(this, _actionHandler).registerActionHandler("PREV_SLIDE", () => {
      log("Action: PREV_SLIDE");
      Reveal.prev();
    });
    __privateGet(this, _actionHandler).registerActionHandler("WIFI_OFF", () => {
      log("Action: WIFI_OFF");
      fetch("http://localhost:3000/kill-wifi", { method: "POST" });
      const lemaImg = document.getElementById("lema-image-active") || document.getElementById("lema-image");
      if (lemaImg) {
        lemaImg.src = "./assets/images/lema-offline.png";
      }
    });
    __privateGet(this, _actionHandler).registerActionHandler("WIFI_ON", () => {
      log("Action: WIFI_ON");
      fetch("http://localhost:3000/activate-wifi", { method: "POST" });
      const lemaImg = document.getElementById("lema-image-active") || document.getElementById("lema-image");
      if (lemaImg) {
        lemaImg.src = "./assets/images/lema-active.png";
      }
    });
    __privateGet(this, _actionHandler).registerActionHandler("SHOW_STATS", () => {
      log("Action: SHOW_STATS");
      __privateGet(this, _overlayControler).toggleCollapse();
    });
    __privateGet(this, _actionHandler).registerActionHandler("SUMMARY", () => {
      log("Action: SUMMARY");
      __privateMethod(this, _PrezDemosControler_instances, executeSummaryWorkflow_fn).call(this);
    });
    __privateGet(this, _actionHandler).registerActionHandler("TEXT_EXTRACT", () => {
      log("Action: TEXT_EXTRACT");
    });
    __privateGet(this, _actionHandler).registerActionHandler("AUDIO_PROCESS", () => {
      log("Action: AUDIO_PROCESS");
    });
  }
  /**
   * Initialise les raccourcis clavier
   */
  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e2) => {
      if (e2.key.toLowerCase() === "m") {
        this.stopTTSAndStream();
        log("Voice stopped (M key)");
      }
    });
  }
  initChatHandlers() {
    __privateGet(this, _arrayChatHandlers).push(__privateGet(this, _chatController).onUserMessage("lema-chat", (msg) => this.processUserMessage(msg)));
    __privateGet(this, _arrayChatHandlers).push(__privateGet(this, _chatController).onUserMessage("lema-translate", (msg) => this.processUserMessage(msg)));
    __privateGet(this, _arrayChatHandlers).push(__privateGet(this, _chatController).onUserMessage("lema-writer", (msg) => this.processUserMessage(msg)));
    __privateGet(this, _arrayChatHandlers).push(__privateGet(this, _chatController).onUserMessage("lema-rewrite", (msg) => this.processUserMessage(msg)));
    __privateGet(this, _arrayChatHandlers).push(__privateGet(this, _chatController).onUserMessage("lema-summarize", (msg) => this.processUserMessage(msg)));
    __privateGet(this, _arrayChatHandlers).push(__privateGet(this, _chatController).onUserMessage("lema-vision", (msg) => this.processUserMessage(msg)));
  }
  removeChatHandlers() {
    for (let chatHandler of __privateGet(this, _arrayChatHandlers)) {
      chatHandler();
    }
    __privateSet(this, _arrayChatHandlers, []);
  }
  /**
   * STATES LISTENERS
   */
  async stateTTSListener({ state }) {
    switch (state) {
      case "end":
        __privateWrapper(this, _nbMessageToSpeak)._--;
        log("stateTTSListener -> end " + __privateGet(this, _nbMessageToSpeak));
        if (__privateGet(this, _nbMessageToSpeak) <= 0) {
          __privateSet(this, _nbMessageToSpeak, 0);
          const allActions = __privateGet(this, _actionHandler).flushActions();
          __privateGet(this, _actionHandler).executeActions(allActions);
        }
        break;
      case "addToQueue":
        __privateWrapper(this, _nbMessageToSpeak)._++;
        log("stateTTSListener -> addToQueue " + __privateGet(this, _nbMessageToSpeak));
        break;
    }
  }
  /**
   * SpeechRecognition Listeners
   * @param {*} param0
   */
  async stateSpeechListener({ state, msg }) {
    switch (state) {
      case "error":
        log("Error SpeechRecongnition", "error", msg);
        break;
      case "start":
        log("Start SpeechRecongnition");
        break;
      case "stop":
        log("Stop SpeechRecongnition");
        if (__privateGet(this, _micControler) && __privateGet(this, _micControler).micState) {
          __privateGet(this, _micControler).triggerMic();
        }
        break;
      case "speechend":
        log("SpeechEnd SpeechRecongnition");
        break;
      case "result":
        await this.processUserMessage(msg);
        break;
    }
  }
  async processUserMessage(msg) {
    var _a2, _b, _c, _d;
    switch (__privateGet(this, _stateDemos)) {
      case WELCOME_LEMA: {
        __privateGet(this, _chatController).setActiveChat("lema-chat", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("lema-chat", msg);
        let tempSession = null;
        if (__privateGet(this, _lastSession2)) {
          tempSession = __privateGet(this, _lastSession2);
        }
        const { stream, session } = await __privateGet(this, _builtInControler2).prompt({ text: msg, session: tempSession });
        __privateSet(this, _lastSession2, session);
        await this.processStreamToChatAndVoice("lema-chat", VOICE_LEMA, stream);
        break;
      }
      case TRANSLATE_LEMA: {
        __privateGet(this, _chatController).setActiveChat("lema-translate", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("lema-translate", msg);
        const stream = await __privateGet(this, _builtInControler2).translate(msg, "fr", "en");
        await this.processStreamToChatAndVoice("lema-translate", VOICE_ENGLISH, stream);
        break;
      }
      case WRITER_LEMA: {
        __privateGet(this, _chatController).setActiveChat("lema-writer", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("lema-writer", msg);
        const stream = await __privateGet(this, _builtInControler2).write(msg);
        await this.processStreamToChatAndVoice("lema-writer", VOICE_LEMA, stream);
        break;
      }
      case REWRITE_LEMA: {
        __privateGet(this, _chatController).setActiveChat("lema-rewrite", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("lema-rewrite", msg);
        const stream = await __privateGet(this, _builtInControler2).rewrite(msg);
        await this.processStreamToChatAndVoice("lema-rewrite", VOICE_LEMA, stream);
        break;
      }
      case SUMMARIZE_LEMA: {
        __privateGet(this, _chatController).setActiveChat("lema-summarize", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("lema-summarize", msg);
        const { detectedLanguage, confidence } = await __privateGet(this, _builtInControler2).detectLanguage(msg);
        __privateGet(this, _chatController).addAssistantMessage("lema-summarize", `Langue détectée : ${detectedLanguage} avec une confience de ${confidence}`);
        let translateText = msg;
        if (detectedLanguage === "fr") {
          translateText = "";
          __privateGet(this, _chatController).addAssistantMessage("lema-summarize", "J'ai besoin de traduire ce texte pour le résumer car je ne prend pas encore le français en charge pour cette API");
          const streamTranslate = await __privateGet(this, _builtInControler2).translate(msg, "fr", "en");
          for await (const chunk of streamTranslate) {
            translateText += chunk;
          }
          __privateGet(this, _chatController).addAssistantMessage("lema-summarize", "Texte traduit : ");
          __privateGet(this, _chatController).addAssistantMessage("lema-summarize", translateText);
        }
        const summarizeType = ((_a2 = document.querySelector("#summarize-type")) == null ? void 0 : _a2.value) || "tldr";
        const summarizeFormat = ((_b = document.querySelector("#summarize-format")) == null ? void 0 : _b.value) || "plain-text";
        const summarizeLength = ((_c = document.querySelector("#summarize-length")) == null ? void 0 : _c.value) || "medium";
        const stream = await __privateGet(this, _builtInControler2).summarize(translateText, "en", {
          type: summarizeType,
          format: summarizeFormat,
          length: summarizeLength
        });
        await this.processStreamToChatAndVoice("lema-summarize", detectedLanguage === "fr" ? VOICE_ENGLISH : VOICE_LEMA, stream);
        break;
      }
      case PROOFREAD_LEMA: {
        const input = document.getElementById("proofread-input");
        if (input) input.value += (input.value ? " " : "") + msg;
        break;
      }
      case VISION_LEMA: {
        __privateGet(this, _chatController).setActiveChat("lema-vision", __privateGet(this, _promptControler));
        const photo = __privateGet(this, _cameraController).getLastPhoto();
        if (!photo) {
          __privateGet(this, _chatController).addAssistantMessage("lema-vision", "Please capture a photo first!");
          break;
        }
        __privateGet(this, _chatController).addUserMessage("lema-vision", msg);
        const { stream, session } = await __privateGet(this, _builtInControler2).prompt({ text: msg, image: photo });
        await this.processStreamToChatAndVoice("lema-vision", VOICE_LEMA, stream);
        break;
      }
      case TEMA_PROMPT: {
        __privateGet(this, _chatController).setActiveChat("tema-prompt", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("tema-prompt", msg);
        try {
          const { stream, session } = await __privateGet(this, _temaController).prompt({ text: msg });
          await this.processStreamToChatAndVoice("tema-prompt", VOICE_TEMA, stream);
        } catch (err) {
          __privateGet(this, _chatController).addAssistantMessage("tema-prompt", "Erreur lors de l'exécution de Tema: " + err.message);
        }
        break;
      }
      case TEMA_MULTIMODAL: {
        __privateGet(this, _chatController).setActiveChat("tema-multimodal", __privateGet(this, _promptControler));
        const photo = ((_d = __privateGet(this, _cameraController)) == null ? void 0 : _d.getLastPhoto()) || null;
        __privateGet(this, _chatController).addUserMessage("tema-multimodal", msg);
        try {
          const { stream, session } = await __privateGet(this, _temaController).prompt({ text: msg, image: photo });
          await this.processStreamToChatAndVoice("tema-multimodal", VOICE_TEMA, stream);
        } catch (err) {
          __privateGet(this, _chatController).addAssistantMessage("tema-multimodal", "Erreur lors de l'exécution de Tema: " + err.message);
        }
        break;
      }
      case CONCLUSION: {
        __privateGet(this, _chatController).setActiveChat("lema-conclusion", __privateGet(this, _promptControler));
        __privateGet(this, _chatController).addUserMessage("lema-conclusion", msg);
        let tempSession = null;
        if (__privateGet(this, _lastSession2)) {
          tempSession = __privateGet(this, _lastSession2);
        }
        const { stream, session } = await __privateGet(this, _builtInControler2).prompt({ text: msg, session: tempSession });
        __privateSet(this, _lastSession2, session);
        await this.processStreamToChatAndVoice("lema-conclusion", VOICE_LEMA, stream);
        break;
      }
    }
  }
  async stopTTSAndStream() {
    __privateSet(this, _streamStopped2, true);
    __privateGet(this, _ttsControler).stop();
    __privateGet(this, _ttsControler).stopStream();
  }
  async processStreamToChatAndVoice(idChat, voiceTarget, stream) {
    __privateSet(this, _streamStopped2, false);
    const idStream = __privateGet(this, _chatController).startStream(idChat);
    __privateGet(this, _actionHandler).reset();
    let actionTrapped = false;
    let chunkToSend = "";
    const actions = [];
    for await (const chunk of stream) {
      if (!actionTrapped && chunk.indexOf("[") !== -1) {
        actionTrapped = true;
      }
      if (actionTrapped) {
        chunkToSend += chunk;
        if (chunkToSend.indexOf("]]") !== -1) {
          const actionRegex = /\[\[ACTION:([A-Z_]+)\]\]/g;
          let match;
          while ((match = actionRegex.exec(chunkToSend)) !== null) {
            actions.push(match[1]);
          }
          chunkToSend = chunkToSend.replace(actionRegex, "");
          actionTrapped = false;
        }
      } else {
        chunkToSend = chunk;
      }
      if (!actionTrapped) {
        __privateGet(this, _chatController).appendToStream(idChat, idStream, chunkToSend);
        if (!__privateGet(this, _streamStopped2)) {
          __privateGet(this, _ttsControler).appendToStream(chunkToSend, voiceTarget);
        }
      } else {
        console.log(`[prez-demos-controler] Trapped action chunk, accumulating: '${chunkToSend}'`);
      }
    }
    __privateGet(this, _promptControler).updateContextDisplay();
    __privateGet(this, _chatController).finishStream(idChat, idStream);
    __privateGet(this, _ttsControler).finishLLMStream();
    for (const action of actions) {
      __privateGet(this, _actionHandler).addCompletedAction(action);
    }
  }
  /**
   * Mic Listener
   * @param {*} param0
   */
  stateMicListener({ state }) {
    switch (state) {
      case "start":
        if (__privateGet(this, _speechControler)) {
          __privateGet(this, _speechControler).startListening();
        }
        break;
      case "stop":
        if (__privateGet(this, _speechControler) && __privateGet(this, _speechControler).isListening) {
          __privateGet(this, _speechControler).stopListening();
        }
        break;
    }
  }
};
_speechControler = new WeakMap();
_ttsControler = new WeakMap();
_overlayControler = new WeakMap();
_micControler = new WeakMap();
_builtInControler2 = new WeakMap();
_promptControler = new WeakMap();
_chatController = new WeakMap();
_actionHandler = new WeakMap();
_cameraController = new WeakMap();
_proofReaderFixControler = new WeakMap();
_temaController = new WeakMap();
_nbMessageToSpeak = new WeakMap();
_stateDemos = new WeakMap();
_arrayChatHandlers = new WeakMap();
_streamStopped2 = new WeakMap();
_initGema = new WeakMap();
_lastSession2 = new WeakMap();
_PrezDemosControler_instances = new WeakSet();
/**
 * Setup welcome lema slide interactions
 */
setupWelcomeLemaSlide_fn = function() {
  const btn = document.getElementById("btn-activate-lema");
  const wakeupState = document.getElementById("lema-wakeup-state");
  const activeState = document.getElementById("lema-active-state");
  if (!btn || !wakeupState || !activeState) return;
  wakeupState.style.display = "flex";
  activeState.style.display = "none";
  btn.replaceWith(btn.cloneNode(false));
  const newBtn = document.getElementById("btn-activate-lema");
  newBtn.innerHTML = "Activate Lema";
  newBtn.addEventListener("click", () => {
    wakeupState.style.display = "none";
    activeState.style.display = "flex";
  });
};
/**
 * Wire up proofreader button handlers
 */
wireProofreadButtons_fn = function() {
  const btnProofread = document.getElementById("btn-proofread");
  const btnApplyAll = document.getElementById("btn-apply-all");
  if (!btnProofread || !btnApplyAll) return;
  btnProofread.addEventListener("click", async () => {
    const input = document.getElementById("proofread-input");
    const result = document.getElementById("proofread-result");
    if (!(input == null ? void 0 : input.value)) return;
    btnProofread.disabled = true;
    btnProofread.textContent = "Proofreading...";
    const proofResult = await __privateGet(this, _builtInControler2).proofread(input.value);
    __privateGet(this, _proofReaderFixControler).renderResult(proofResult, result, input);
    btnApplyAll.style.display = proofResult.corrections.length ? "inline-block" : "none";
    btnProofread.disabled = false;
    btnProofread.textContent = "Proofread";
  });
  btnApplyAll.addEventListener("click", () => {
    __privateGet(this, _proofReaderFixControler).applyAllCorrections();
    btnApplyAll.style.display = "none";
  });
  const textarea = document.getElementById("proofread-input");
  if (textarea) {
    ["keyup", "keypress", "keydown"].forEach((eventType) => {
      textarea.addEventListener(eventType, (e2) => {
        e2.stopPropagation();
      });
    });
  }
};
_PrezDemosControler_static = new WeakSet();
getSlidesText_fn = function() {
  var _a2;
  const slides = document.querySelectorAll(".reveal .slides section");
  const parts = [];
  for (const slide of slides) {
    const clone = slide.cloneNode(true);
    clone.querySelectorAll("aside, pre").forEach((el) => el.remove());
    const text = (_a2 = clone.textContent) == null ? void 0 : _a2.replace(/\s+/g, " ").trim();
    if (text && text.length > 10) parts.push(text);
  }
  return parts.join("\n\n").substring(0, 8e3);
};
/**
 * Ajoute une ligne dans le terminal de résumé
 * @param {HTMLElement} terminalEl
 * @param {string} msg
 * @param {'running'|'done'|'error'} status
 * @returns {HTMLElement} la ligne créée
 */
addTerminalStep_fn = function(terminalEl, msg, status = "running") {
  var _a2;
  if (!terminalEl) return null;
  if (terminalEl.children.length === 1 && ((_a2 = terminalEl.firstElementChild) == null ? void 0 : _a2.style.fontStyle) === "italic") {
    terminalEl.innerHTML = "";
  }
  const colors = { running: "#fbbf24", done: "#22c55e", error: "#ef4444" };
  const icons = { running: "⟳", done: "✓", error: "✗" };
  const line = document.createElement("div");
  line.style.cssText = `color:${colors[status]}; display:flex; align-items:center; gap:8px; line-height:1.4;`;
  line.innerHTML = `<span style="flex-shrink:0;">${icons[status]}</span><span>${msg}</span>`;
  terminalEl.appendChild(line);
  terminalEl.scrollTop = terminalEl.scrollHeight;
  return line;
};
/**
 * Met à jour une ligne existante du terminal
 * @param {HTMLElement} lineEl
 * @param {string} msg
 * @param {'done'|'error'} status
 */
updateTerminalStep_fn = function(lineEl, msg, status) {
  if (!lineEl) return;
  const colors = { done: "#22c55e", error: "#ef4444" };
  const icons = { done: "✓", error: "✗" };
  lineEl.style.color = colors[status];
  lineEl.innerHTML = `<span style="flex-shrink:0;">${icons[status]}</span><span>${msg}</span>`;
};
makeSingleChunkStream_fn = async function* (text) {
  yield text;
};
executeSummaryWorkflow_fn = async function() {
  var _a2;
  const terminalEl = document.getElementById("summary-steps");
  try {
    let line = __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, "Collecte du contenu des slides…", "running");
    const slidesText = __privateMethod(_a2 = _PrezDemosControler, _PrezDemosControler_static, getSlidesText_fn).call(_a2);
    __privateMethod(this, _PrezDemosControler_instances, updateTerminalStep_fn).call(this, line, `${slidesText.length} caractères collectés depuis les slides`, "done");
    line = __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, "Traduction vers l'anglais…", "running");
    let englishText = "";
    const translateStream = await __privateGet(this, _builtInControler2).translate(slidesText, "fr", "en");
    for await (const chunk of translateStream) {
      englishText += chunk;
    }
    __privateMethod(this, _PrezDemosControler_instances, updateTerminalStep_fn).call(this, line, "Traduction vers l'anglais terminée", "done");
    line = __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, "Génération du résumé (key-points / medium)…", "running");
    let summaryText = "";
    const summaryStream = await __privateGet(this, _builtInControler2).summarize(englishText, "en", {
      type: "key-points",
      format: "plain-text",
      length: "medium"
    });
    for await (const chunk of summaryStream) {
      summaryText += chunk;
    }
    __privateMethod(this, _PrezDemosControler_instances, updateTerminalStep_fn).call(this, line, "Résumé généré", "done");
    line = __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, "Détection de la langue du résumé…", "running");
    const { detectedLanguage } = await __privateGet(this, _builtInControler2).detectLanguage(summaryText.substring(0, 300));
    __privateMethod(this, _PrezDemosControler_instances, updateTerminalStep_fn).call(this, line, `Résumé en : ${detectedLanguage.toUpperCase()}`, "done");
    let finalText = summaryText;
    if (detectedLanguage !== "fr") {
      line = __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, "Traduction finale vers le français…", "running");
      let frenchText = "";
      const frStream = await __privateGet(this, _builtInControler2).translate(summaryText, "en", "fr");
      for await (const chunk of frStream) {
        frenchText += chunk;
      }
      finalText = frenchText;
      __privateMethod(this, _PrezDemosControler_instances, updateTerminalStep_fn).call(this, line, "Traduction finale terminée", "done");
    }
    __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, "Lecture du résumé par Lema", "done");
    __privateGet(this, _chatController).setActiveChat("lema-conclusion", __privateGet(this, _promptControler));
    await this.processStreamToChatAndVoice("lema-conclusion", VOICE_LEMA, __privateMethod(this, _PrezDemosControler_instances, makeSingleChunkStream_fn).call(this, finalText));
  } catch (err) {
    log("Erreur workflow résumé:", "error", err);
    __privateMethod(this, _PrezDemosControler_instances, addTerminalStep_fn).call(this, terminalEl, `Erreur : ${err.message}`, "error");
  }
};
__privateAdd(_PrezDemosControler, _PrezDemosControler_static);
let PrezDemosControler = _PrezDemosControler;
const DEBUG = true;
window.log = (msg, type = "info", msgOrError) => {
  if (!type) {
    type = "debug";
  }
  if (type === "info" || type === "debug" && DEBUG) {
    console.log(`[${type.toUpperCase()}] ${msg}`, msgOrError);
  } else if (type === "error") {
    console.error(`[${type.toUpperCase()}]`, msg, msgOrError);
  }
};
(async function() {
  async function pageLoad() {
    const inIframe = window.top != window.self;
    const dataType = document.querySelector(".slides").getAttribute("data-type");
    if (!inIframe && dataType && dataType === "on-stage") {
      new PrezDemosControler();
    }
  }
  window.addEventListener("load", pageLoad);
})();
//# sourceMappingURL=main.js.map
