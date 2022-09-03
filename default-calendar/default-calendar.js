import { getCurrentScope as Ue, onScopeDispose as Qe, unref as M, ref as i, watch as K, defineComponent as X, computed as J, onMounted as Oe, openBlock as D, createElementBlock as C, createElementVNode as o, withDirectives as V, vModelText as Q, Fragment as O, renderList as x, toDisplayString as B, createCommentVNode as je, createBlock as He, Teleport as We, isRef as De, createVNode as ke, normalizeClass as U, vShow as qe, pushScopeId as Ge, popScopeId as ze } from "vue";
var we;
const H = typeof window < "u", Ke = (e) => typeof e == "string", le = () => {
};
H && ((we = window == null ? void 0 : window.navigator) == null ? void 0 : we.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Je(e) {
  return typeof e == "function" ? e() : M(e);
}
function Xe(e) {
  return e;
}
function Ze(e) {
  return Ue() ? (Qe(e), !0) : !1;
}
function j(e) {
  var t;
  const n = Je(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Re = H ? window : void 0;
H && window.document;
H && window.navigator;
H && window.location;
function G(...e) {
  let t, n, s, c;
  if (Ke(e[0]) ? ([n, s, c] = e, t = Re) : [t, n, s, c] = e, !t)
    return le;
  let m = le;
  const y = K(() => j(t), (g) => {
    m(), g && (g.addEventListener(n, s, c), m = () => {
      g.removeEventListener(n, s, c), m = le;
    });
  }, { immediate: !0, flush: "post" }), k = () => {
    y(), m();
  };
  return Ze(k), k;
}
function xe(e, t, n = {}) {
  const { window: s = Re, ignore: c, capture: m = !0, detectIframe: y = !1 } = n;
  if (!s)
    return;
  const k = i(!0);
  let g;
  const d = (w) => {
    s.clearTimeout(g);
    const b = j(e), E = w.composedPath();
    !b || b === w.target || E.includes(b) || !k.value || c && c.length > 0 && c.some((L) => {
      const v = j(L);
      return v && (w.target === v || E.includes(v));
    }) || t(w);
  }, h = [
    G(s, "click", d, { passive: !0, capture: m }),
    G(s, "pointerdown", (w) => {
      const b = j(e);
      k.value = !!b && !w.composedPath().includes(b);
    }, { passive: !0 }),
    G(s, "pointerup", (w) => {
      if (w.button === 0) {
        const b = w.composedPath();
        w.composedPath = () => b, g = s.setTimeout(() => d(w), 50);
      }
    }, { passive: !0 }),
    y && G(s, "blur", (w) => {
      var b;
      const E = j(e);
      ((b = document.activeElement) == null ? void 0 : b.tagName) === "IFRAME" && !(E != null && E.contains(document.activeElement)) && t(w);
    })
  ].filter(Boolean);
  return () => h.forEach((w) => w());
}
const ue = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, oe = "__vueuse_ssr_handlers__";
ue[oe] = ue[oe] || {};
ue[oe];
var Ie;
(function(e) {
  e.UP = "UP", e.RIGHT = "RIGHT", e.DOWN = "DOWN", e.LEFT = "LEFT", e.NONE = "NONE";
})(Ie || (Ie = {}));
var et = Object.defineProperty, Ce = Object.getOwnPropertySymbols, tt = Object.prototype.hasOwnProperty, lt = Object.prototype.propertyIsEnumerable, Te = (e, t, n) => t in e ? et(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, nt = (e, t) => {
  for (var n in t || (t = {}))
    tt.call(t, n) && Te(e, n, t[n]);
  if (Ce)
    for (var n of Ce(t))
      lt.call(t, n) && Te(e, n, t[n]);
  return e;
};
const at = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
nt({
  linear: Xe
}, at);
const be = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"], ut = () => {
  const e = new Date(), t = e.getFullYear(), n = e.getMonth() + 1;
  let s = t, c = n + 1;
  return n === 12 && (c = 1, s = s + 1), {
    leftYear: t,
    leftMonth: n,
    rightYear: s,
    rightMonth: c
  };
}, A = (e) => e < 10 ? "0" + e : e, z = (e) => {
  const t = new Date(e), n = t.getFullYear(), s = A(t.getMonth() + 1), c = A(t.getDate());
  return n + "-" + s + "-" + c;
}, ne = (e, t) => (e <= 0 && (e = 12, t--), {
  month: e,
  year: t
}), ae = (e, t) => (e > 12 && (e = 1, t++), {
  month: e,
  year: t
}), ot = (e, t) => new Date(e, t - 1, 1).getDay(), se = (e, t) => new Date(e, t, 0).getDate(), Be = (e, t) => {
  let n = ot(e, t), s = se(e, t - 1);
  n === 0 && (n = 7);
  let c = [];
  for (; c.length < n; )
    c.push(s--);
  return c.reverse();
}, st = (e, t) => {
  const n = Be(e, t).length, s = se(e, t), c = 42 - n - s, m = [];
  for (let y = 1; y <= c; y++)
    m.push(y);
  return m;
}, Pe = (e, t) => {
  const n = Be(e, t);
  let s = [];
  const c = se(e, t);
  for (let d = 1; d <= c; d++)
    s.push(d);
  const m = st(e, t), y = n.map((d) => {
    const h = e + "-" + (t - 1) + "-" + d;
    return {
      value: d,
      category: "prev",
      timestamp: new Date(h).getTime()
    };
  }), k = s.map((d) => {
    const h = e + "-" + t + "-" + d;
    return {
      value: d,
      category: "curr",
      timestamp: new Date(h).getTime()
    };
  }), g = m.map((d) => {
    const h = e + "-" + (t + 1) + "-" + d;
    return {
      value: d,
      category: "next",
      timestamp: new Date(h).getTime()
    };
  });
  return [...y, ...k, ...g];
}, rt = (e, t, n) => (e.category === "prev" && (n === 1 ? (t--, n = 12) : n--), e.category === "next" && (n === 12 ? (t++, n = 1) : n++), {
  month: n,
  year: t
}), it = [
  {
    count: 24,
    ulRef: i(),
    liRef: i(),
    currRef: i(""),
    id: "hour"
  },
  {
    count: 60,
    ulRef: i(),
    liRef: i(),
    currRef: i(""),
    id: "minu"
  },
  {
    count: 60,
    ulRef: i(),
    liRef: i(),
    currRef: i(""),
    id: "seco"
  }
], ct = (e, t, n, s) => {
  var m, y, k;
  let c = [];
  switch (c = vt(e), s) {
    case "hour":
      const g = ((m = c.find(
        (P) => P.val === n.value
      )) == null ? void 0 : m.top) - 91;
      t.scrollTo({
        top: g
      });
      break;
    case "minu":
      let d = ((y = c.find(
        (P) => P.val === n.value
      )) == null ? void 0 : y.top) - 91;
      t.scrollTo({
        top: d
      });
      break;
    case "seco":
      let h = ((k = c.find(
        (P) => P.val === n.value
      )) == null ? void 0 : k.top) - 91;
      t.scrollTo({
        top: h
      });
      break;
  }
  t.addEventListener("scroll", () => {
    var g;
    n.value = (g = c.find(
      (d) => d.top > t.scrollTop + 65
    )) == null ? void 0 : g.val;
  });
}, vt = (e) => e.value.map((t) => ({
  top: t.offsetTop,
  val: t.innerText
})), dt = { class: "time-picker" }, ft = ["id"], pt = ["onClick"], mt = X({
  name: "TimePicker"
}), ht = /* @__PURE__ */ X({
  ...mt,
  props: {
    showCategory: { default: () => ["hour", "minu", "seco"] },
    isMountBody: { type: Boolean, default: !0 },
    modelValue: { default: "" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, s = i(!1), c = i(), m = i("18:20:00"), y = i("18"), k = i("20"), g = i("00");
    let d = J(() => it.filter((v) => n.showCategory.includes(v.id))), h = J(() => {
      if (n.showCategory.includes("seco")) {
        if (!n.showCategory.includes("hour"))
          return k.value + " : " + g.value;
      } else
        return y.value + " : " + k.value;
      return y.value + " : " + k.value + " : " + g.value;
    });
    const P = (v) => v < 10 ? "0" + v : v.toString(), w = () => {
      s.value = !0;
      const v = [y, k, g];
      setTimeout(() => {
        d.value.forEach((_, p) => {
          const I = document.querySelector(`#${_.id}`);
          ct(_.liRef, I, v[p], _.id);
        });
      }, 200);
    };
    xe(c, () => {
      s.value = !1;
    }), K(h, (v) => {
      m.value = v;
    });
    const b = (v, _, p) => {
      let I = v.value[Number(_)].offsetTop - 65;
      document.querySelector(`#${p}`).scrollTo({
        top: I
      });
    }, E = () => {
      t("update:modelValue", m.value), s.value = !1;
    }, L = () => {
      t("update:modelValue", m.value), s.value = !1;
    };
    return Oe(() => {
      t("update:modelValue", m.value);
    }), (v, _) => (D(), C("div", null, [
      o("div", { onClick: w }, [
        V(o("input", {
          type: "text",
          "onUpdate:modelValue": _[0] || (_[0] = (p) => m.value = p),
          autocomplete: "off"
        }, null, 512), [
          [Q, m.value]
        ])
      ]),
      s.value ? (D(), C("div", {
        key: 0,
        ref_key: "timePickerRef",
        ref: c,
        class: "outer"
      }, [
        o("div", dt, [
          (D(!0), C(O, null, x(M(d), (p) => (D(), C("ul", {
            key: p.count,
            id: p.id
          }, [
            (D(!0), C(O, null, x(p.count, (I) => (D(), C("li", {
              key: I,
              ref_for: !0,
              ref: p.liRef,
              onClick: (R) => b(p.liRef, P(I - 1), p.id)
            }, B(P(I - 1)), 9, pt))), 128))
          ], 8, ft))), 128))
        ]),
        o("div", { class: "footer" }, [
          o("button", { onClick: E }, "\u53D6\u6D88"),
          o("button", { onClick: L }, "\u786E\u5B9A")
        ])
      ], 512)) : je("", !0)
    ]));
  }
});
const Se = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, c] of t)
    n[s] = c;
  return n;
}, Me = /* @__PURE__ */ Se(ht, [["__scopeId", "data-v-c2675cdb"]]), Ve = (e) => (Ge("data-v-cf52ee6c"), e = e(), ze(), e), gt = /* @__PURE__ */ Ve(() => /* @__PURE__ */ o("span", null, "\u81F3", -1)), yt = { class: "calendar-header" }, _t = { class: "calendar-header-left" }, Dt = /* @__PURE__ */ Ve(() => /* @__PURE__ */ o("div", null, ">", -1)), kt = { class: "calendar-header-right" }, wt = { class: "calendar-content" }, It = { class: "calendar-content-left" }, Ct = { class: "calendar-content-left-top" }, Tt = { class: "calendar-content-left-top-icon" }, bt = { class: "calendar-content-left-top-date" }, Pt = ["onMouseenter", "onClick"], Mt = { class: "calendar-content-right" }, Et = { class: "calendar-content-right-top" }, Ot = { class: "calendar-content-right-top-date" }, Rt = { class: "calendar-content-right-top-icon" }, xt = ["onMouseenter", "onClick"], Bt = X({
  name: "Calendar"
}), St = /* @__PURE__ */ X({
  ...Bt,
  props: {
    unlinkPanels: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = new Date().getDate(), s = i(!1), c = i(), m = i(), y = i(), k = i(), g = i(), d = i(), h = i([1661090509502, 1661090509502]), P = () => {
      s.value = !0;
    };
    xe(c, () => {
      s.value = !1;
    });
    const { leftYear: w, leftMonth: b, rightYear: E, rightMonth: L } = ut();
    let v = i(w), _ = i(b), p = i(E), I = i(L), R = i([]), S = i([]), W = i(!1), Z = i(!1), N = i(), $ = i(), ee = i(!1);
    const re = (l) => {
      if (Z.value = !0, W.value && (W.value = !1), l === "month")
        if (I.value++, t.unlinkPanels) {
          const { month: u, year: a } = ae(
            I.value,
            p.value
          );
          I.value = u, p.value = a;
        } else {
          _.value++;
          const { month: u, year: a } = ae(
            I.value,
            p.value
          );
          I.value = u, p.value = a;
          const { month: T, year: f } = ae(
            _.value,
            v.value
          );
          _.value = T, v.value = f;
        }
      else
        l === "year" && (p.value++, t.unlinkPanels || v.value++);
      ve();
    }, ie = (l) => {
      if (W.value = !0, Z.value && (Z.value = !1), l === "month")
        if (_.value--, t.unlinkPanels) {
          const { month: u, year: a } = ne(
            _.value,
            v.value
          );
          _.value = u, v.value = a;
        } else {
          I.value--;
          const { month: u, year: a } = ne(
            _.value,
            v.value
          );
          v.value = a, _.value = u;
          const { month: T, year: f } = ne(
            I.value,
            p.value
          );
          p.value = f, I.value = T;
        }
      else
        l === "year" && (v.value--, t.unlinkPanels || p.value--);
      ve();
    };
    let r = i([]);
    const ce = (l, u) => {
      var he, ge, ye, _e;
      let a = u === "left" ? v.value : p.value, T = A(
        u === "left" ? _.value : I.value
      ), f = A(l.value);
      const { month: Y, year: Fe } = rt(
        l,
        a,
        Number(T)
      ), F = new Date(Fe + "-" + Y + "-" + f).getTime();
      h.value.length > 2 ? (h.value = [], (he = h.value) == null || he.push(F)) : h.value.length === 0 ? (ge = h.value) == null || ge.push(F) : F >= h.value[0] ? ((ye = h.value) == null || ye.push(F), te(h.value)) : ((_e = h.value) == null || _e.unshift(F), te(h.value)), Ae(l);
    }, Ae = (l) => {
      r.value.length === 0 ? r.value.push({ val: l.timestamp, isInit: !0 }) : r.value.length === 2 && (ee.value = !0, r.value.find(
        (a) => a.isInit === !1
      ) === void 0 && (r.value = [], r.value.push({
        isInit: !0,
        val: l.timestamp
      }), ee.value = !1), r.value.length === 2 && (r.value = r.value.map((a) => (a.isInit || (a.isInit = !0), a))));
    };
    function te(l) {
      N.value = z(l[0]), $.value = z(l[1]);
    }
    Oe(() => {
      te(h.value);
    });
    for (let l = 0; l < 6; l++)
      R.value[l] = new Array(), S.value[l] = new Array();
    const ve = () => {
      for (let l = 0; l < 6; l++)
        t.unlinkPanels ? W.value ? R.value[l] = new Array() : S.value[l] = new Array() : (R.value[l] = new Array(), S.value[l] = new Array());
    };
    K(
      [v, _],
      (l) => {
        let u = 0;
        Pe(l[0], l[1]).forEach((a, T) => {
          (T + 1) % 7 === 0 ? (R.value[u].push(a), u++) : R.value[u].push(a);
        });
      },
      {
        immediate: !0
      }
    ), K(
      [p, I],
      (l) => {
        let u = 0;
        Pe(l[0], l[1]).forEach((a, T) => {
          (T + 1) % 7 === 0 ? (S.value[u].push(a), u++) : S.value[u].push(a);
        });
      },
      {
        immediate: !0
      }
    );
    const Le = J(() => v.value + "\u5E74" + A(_.value) + "\u6708"), Ne = J(() => p.value + "\u5E74" + A(I.value) + "\u6708"), de = (l, u) => l.category === "prev" || l.category === "next" ? "prevAndNext" : l.category === "curr" && l.value === n && u ? "todayStyle" : "", fe = (l) => {
      if (!(r.value.length === 0 || ee.value)) {
        if (r.value.length === 1)
          l.timestamp < r.value[0].val ? r.value.unshift({ val: l.timestamp, isInit: !1 }) : r.value.push({ val: l.timestamp, isInit: !1 });
        else {
          const u = r.value.find((T) => T.isInit), a = r.value.findIndex(
            (T) => T.isInit
          );
          a === 0 && l.timestamp <= (u == null ? void 0 : u.val) ? (r.value.pop(), r.value.unshift({ val: l.timestamp, isInit: !1 })) : a === 0 && (r.value[1].val = l.timestamp), a === 1 && l.timestamp >= (u == null ? void 0 : u.val) ? (r.value.shift(), r.value.push({ val: l.timestamp, isInit: !1 })) : a === 1 && (r.value[0].val = l.timestamp);
        }
        if (r.value.length === 2 && r.value[0].val <= l.timestamp && l.timestamp <= r.value[1].val)
          return "selectedRangeBg";
      }
    }, $e = () => {
      s.value = !1;
    }, Ye = () => {
      y.value = z(r.value[0].val) + " " + g.value, k.value = z(r.value[1].val) + " " + d.value, s.value = !1;
    }, pe = (l) => l.category === "curr" && r.value && r.value.length === 2 && l.timestamp < r.value[1].val && l.timestamp > r.value[0].val ? "selectedRangeBg" : "", q = (l, u) => u === 0 && l.category === "curr" && r.value && r.value.length === 2 && l.timestamp === r.value[u].val ? "selectedDateLeftBoundary" : u === 1 && l.category === "curr" && r.value && r.value.length === 2 && l.timestamp === r.value[u].val ? "selectedDateRightBoundary" : "", me = (l) => l.category === "curr" && r && r.value.length === 2 && (l.timestamp === r.value[1].val || l.timestamp === r.value[0].val) ? "selectedDate" : "";
    return (l, u) => (D(), C(O, null, [
      o("div", {
        onClick: P,
        class: "calendarInput"
      }, [
        V(o("input", {
          type: "text",
          "onUpdate:modelValue": u[0] || (u[0] = (a) => y.value = a)
        }, null, 512), [
          [Q, y.value]
        ]),
        gt,
        V(o("input", {
          type: "text",
          "onUpdate:modelValue": u[1] || (u[1] = (a) => k.value = a)
        }, null, 512), [
          [Q, k.value]
        ])
      ]),
      (D(), He(We, { to: "body" }, [
        V(o("div", {
          class: "calendar",
          ref_key: "calendarRef",
          ref: c
        }, [
          o("div", yt, [
            o("div", _t, [
              V(o("input", {
                type: "text",
                "onUpdate:modelValue": u[2] || (u[2] = (a) => De(N) ? N.value = a : N = a)
              }, null, 512), [
                [Q, M(N)]
              ]),
              ke(Me, {
                modelValue: g.value,
                "onUpdate:modelValue": u[3] || (u[3] = (a) => g.value = a)
              }, null, 8, ["modelValue"])
            ]),
            Dt,
            o("div", kt, [
              V(o("input", {
                type: "text",
                "onUpdate:modelValue": u[4] || (u[4] = (a) => De($) ? $.value = a : $ = a)
              }, null, 512), [
                [Q, M($)]
              ]),
              ke(Me, {
                modelValue: d.value,
                "onUpdate:modelValue": u[5] || (u[5] = (a) => d.value = a)
              }, null, 8, ["modelValue"])
            ])
          ]),
          o("div", wt, [
            o("div", It, [
              o("div", Ct, [
                o("div", Tt, [
                  o("span", {
                    onClick: u[6] || (u[6] = (a) => ie("year"))
                  }, "<<"),
                  o("span", {
                    onClick: u[7] || (u[7] = (a) => ie("month"))
                  }, "<")
                ]),
                o("div", bt, B(M(Le)), 1)
              ]),
              o("div", null, [
                o("table", null, [
                  o("thead", null, [
                    o("tr", null, [
                      (D(!0), C(O, null, x(M(be), (a) => (D(), C("th", { key: a }, B(a), 1))), 128))
                    ])
                  ]),
                  o("tbody", null, [
                    (D(!0), C(O, null, x(M(R), (a, T) => (D(), C("tr", { key: T }, [
                      (D(!0), C(O, null, x(a, (f) => (D(), C("td", {
                        key: f,
                        class: U([
                          pe(f),
                          q(f, 0),
                          q(f, 1)
                        ])
                      }, [
                        o("div", {
                          class: U(de(f, "curr"))
                        }, [
                          o("span", {
                            class: U([
                              m.value === f.value ? "selectedDate" : "",
                              me(f)
                            ]),
                            onMouseenter: (Y) => fe(f),
                            onClick: (Y) => ce(f, "left")
                          }, B(f.value), 43, Pt)
                        ], 2)
                      ], 2))), 128))
                    ]))), 128))
                  ])
                ])
              ])
            ]),
            o("div", Mt, [
              o("div", Et, [
                o("div", Ot, B(M(Ne)), 1),
                o("div", Rt, [
                  o("span", {
                    onClick: u[8] || (u[8] = (a) => re("month"))
                  }, " > "),
                  o("span", {
                    onClick: u[9] || (u[9] = (a) => re("year"))
                  }, " >> ")
                ])
              ]),
              o("div", null, [
                o("table", null, [
                  o("thead", null, [
                    o("tr", null, [
                      (D(!0), C(O, null, x(M(be), (a) => (D(), C("th", { key: a }, B(a), 1))), 128))
                    ])
                  ]),
                  o("tbody", null, [
                    (D(!0), C(O, null, x(M(S), (a, T) => (D(), C("tr", { key: T }, [
                      (D(!0), C(O, null, x(a, (f) => (D(), C("td", {
                        key: f,
                        class: U([
                          pe(f),
                          q(f, 0),
                          q(f, 1)
                        ])
                      }, [
                        o("div", null, [
                          o("span", {
                            class: U([de(f), me(f)]),
                            onMouseenter: (Y) => fe(f),
                            onClick: (Y) => ce(f, "right")
                          }, B(f.value), 43, xt)
                        ])
                      ], 2))), 128))
                    ]))), 128))
                  ])
                ])
              ])
            ])
          ]),
          o("div", { class: "calendar-footer" }, [
            o("button", { onClick: $e }, "\u53D6\u6D88"),
            o("button", { onClick: Ye }, "\u786E\u5B9A")
          ])
        ], 512), [
          [qe, s.value]
        ])
      ]))
    ], 64));
  }
});
const Ee = /* @__PURE__ */ Se(St, [["__scopeId", "data-v-cf52ee6c"]]), At = {
  install: (e, t) => {
    e.component(Ee.name, Ee);
  }
};
export {
  At as default
};
