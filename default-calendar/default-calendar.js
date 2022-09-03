import { watch as O, unref as R, ref as r, defineComponent as H, computed as q, onMounted as De, openBlock as g, createElementBlock as _, createElementVNode as u, withDirectives as V, vModelText as F, Fragment as I, renderList as x, toDisplayString as B, createCommentVNode as Pe, createBlock as Ve, Teleport as Ae, isRef as pe, createVNode as me, normalizeClass as Y, vShow as Ee, pushScopeId as Se, popScopeId as $e } from "vue";
function ke(l, t) {
  Le(window, (i) => {
    const c = R(l), D = i.composedPath();
    !c || D.includes(c) || t();
  });
}
function Le(...l) {
  let t, s;
  [t, s] = l, O(
    () => t,
    (i) => {
      !i || i.addEventListener("click", s, { capture: !0, passive: !0 });
    },
    {
      immediate: !0,
      flush: "post"
    }
  );
}
const he = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"], Ye = () => {
  const l = new Date(), t = l.getFullYear(), s = l.getMonth() + 1;
  let i = t, c = s + 1;
  return s === 12 && (c = 1, i = i + 1), {
    leftYear: t,
    leftMonth: s,
    rightYear: i,
    rightMonth: c
  };
}, A = (l) => l < 10 ? "0" + l : l, j = (l) => {
  const t = new Date(l), s = t.getFullYear(), i = A(t.getMonth() + 1), c = A(t.getDate());
  return s + "-" + i + "-" + c;
}, Z = (l, t) => (l <= 0 && (l = 12, t--), {
  month: l,
  year: t
}), ee = (l, t) => (l > 12 && (l = 1, t++), {
  month: l,
  year: t
}), Fe = (l, t) => new Date(l, t - 1, 1).getDay(), te = (l, t) => new Date(l, t, 0).getDate(), Ce = (l, t) => {
  let s = Fe(l, t), i = te(l, t - 1);
  s === 0 && (s = 7);
  let c = [];
  for (; c.length < s; )
    c.push(i--);
  return c.reverse();
}, Ne = (l, t) => {
  const s = Ce(l, t).length, i = te(l, t), c = 42 - s - i, D = [];
  for (let C = 1; C <= c; C++)
    D.push(C);
  return D;
}, ge = (l, t) => {
  const s = Ce(l, t);
  let i = [];
  const c = te(l, t);
  for (let p = 1; p <= c; p++)
    i.push(p);
  const D = Ne(l, t), C = s.map((p) => {
    const m = l + "-" + (t - 1) + "-" + p;
    return {
      value: p,
      category: "prev",
      timestamp: new Date(m).getTime()
    };
  }), T = i.map((p) => {
    const m = l + "-" + t + "-" + p;
    return {
      value: p,
      category: "curr",
      timestamp: new Date(m).getTime()
    };
  }), M = D.map((p) => {
    const m = l + "-" + (t + 1) + "-" + p;
    return {
      value: p,
      category: "next",
      timestamp: new Date(m).getTime()
    };
  });
  return [...C, ...T, ...M];
}, Ue = (l, t, s) => (l.category === "prev" && (s === 1 ? (t--, s = 12) : s--), l.category === "next" && (s === 12 ? (t++, s = 1) : s++), {
  month: s,
  year: t
}), je = [
  {
    count: 24,
    ulRef: r(),
    liRef: r(),
    currRef: r(""),
    id: "hour"
  },
  {
    count: 60,
    ulRef: r(),
    liRef: r(),
    currRef: r(""),
    id: "minu"
  },
  {
    count: 60,
    ulRef: r(),
    liRef: r(),
    currRef: r(""),
    id: "seco"
  }
], Oe = (l, t, s, i) => {
  var D, C, T;
  let c = [];
  switch (c = qe(l), i) {
    case "hour":
      const M = ((D = c.find(
        (w) => w.val === s.value
      )) == null ? void 0 : D.top) - 91;
      t.scrollTo({
        top: M
      });
      break;
    case "minu":
      let p = ((C = c.find(
        (w) => w.val === s.value
      )) == null ? void 0 : C.top) - 91;
      t.scrollTo({
        top: p
      });
      break;
    case "seco":
      let m = ((T = c.find(
        (w) => w.val === s.value
      )) == null ? void 0 : T.top) - 91;
      t.scrollTo({
        top: m
      });
      break;
  }
  t.addEventListener("scroll", () => {
    var M;
    s.value = (M = c.find(
      (p) => p.top > t.scrollTop + 65
    )) == null ? void 0 : M.val;
  });
}, qe = (l) => l.value.map((t) => ({
  top: t.offsetTop,
  val: t.innerText
})), He = { class: "time-picker" }, ze = ["id"], Ge = ["onClick"], Je = H({
  name: "TimePicker"
}), Ke = /* @__PURE__ */ H({
  ...Je,
  props: {
    showCategory: { default: () => ["hour", "minu", "seco"] },
    isMountBody: { type: Boolean, default: !0 },
    modelValue: { default: "" }
  },
  emits: ["update:modelValue"],
  setup(l, { emit: t }) {
    const s = l, i = r(!1), c = r(), D = r("18:20:00"), C = r("18"), T = r("20"), M = r("00");
    let p = q(() => je.filter((d) => s.showCategory.includes(d.id))), m = q(() => {
      if (s.showCategory.includes("seco")) {
        if (!s.showCategory.includes("hour"))
          return T.value + " : " + M.value;
      } else
        return C.value + " : " + T.value;
      return C.value + " : " + T.value + " : " + M.value;
    });
    const w = (d) => d < 10 ? "0" + d : d.toString(), z = () => {
      i.value = !0;
      const d = [C, T, M];
      setTimeout(() => {
        p.value.forEach((h, f) => {
          const y = document.querySelector(`#${h.id}`);
          Oe(h.liRef, y, d[f], h.id);
        });
      }, 200);
    };
    ke(c, () => {
      i.value = !1;
    }), O(m, (d) => {
      D.value = d;
    });
    const G = (d, h, f) => {
      let y = d.value[Number(h)].offsetTop - 65;
      document.querySelector(`#${f}`).scrollTo({
        top: y
      });
    }, J = () => {
      t("update:modelValue", D.value), i.value = !1;
    }, K = () => {
      t("update:modelValue", D.value), i.value = !1;
    };
    return De(() => {
      t("update:modelValue", D.value);
    }), (d, h) => (g(), _("div", null, [
      u("div", { onClick: z }, [
        V(u("input", {
          type: "text",
          "onUpdate:modelValue": h[0] || (h[0] = (f) => D.value = f),
          autocomplete: "off"
        }, null, 512), [
          [F, D.value]
        ])
      ]),
      i.value ? (g(), _("div", {
        key: 0,
        ref_key: "timePickerRef",
        ref: c,
        class: "outer"
      }, [
        u("div", He, [
          (g(!0), _(I, null, x(R(p), (f) => (g(), _("ul", {
            key: f.count,
            id: f.id
          }, [
            (g(!0), _(I, null, x(f.count, (y) => (g(), _("li", {
              key: y,
              ref_for: !0,
              ref: f.liRef,
              onClick: (b) => G(f.liRef, w(y - 1), f.id)
            }, B(w(y - 1)), 9, Ge))), 128))
          ], 8, ze))), 128))
        ]),
        u("div", { class: "footer" }, [
          u("button", { onClick: J }, "\u53D6\u6D88"),
          u("button", { onClick: K }, "\u786E\u5B9A")
        ])
      ], 512)) : Pe("", !0)
    ]));
  }
});
const Me = (l, t) => {
  const s = l.__vccOpts || l;
  for (const [i, c] of t)
    s[i] = c;
  return s;
}, ye = /* @__PURE__ */ Me(Ke, [["__scopeId", "data-v-50ad1535"]]), Te = (l) => (Se("data-v-918b2776"), l = l(), $e(), l), Qe = /* @__PURE__ */ Te(() => /* @__PURE__ */ u("span", null, "\u81F3", -1)), We = { class: "calendar-header" }, Xe = { class: "calendar-header-left" }, Ze = /* @__PURE__ */ Te(() => /* @__PURE__ */ u("div", null, ">", -1)), et = { class: "calendar-header-right" }, tt = { class: "calendar-content" }, lt = { class: "calendar-content-left" }, at = { class: "calendar-content-left-top" }, nt = { class: "calendar-content-left-top-icon" }, ut = { class: "calendar-content-left-top-date" }, st = ["onMouseenter", "onClick"], ot = { class: "calendar-content-right" }, rt = { class: "calendar-content-right-top" }, it = { class: "calendar-content-right-top-date" }, ct = { class: "calendar-content-right-top-icon" }, vt = ["onMouseenter", "onClick"], dt = H({
  name: "Calendar"
}), ft = /* @__PURE__ */ H({
  ...dt,
  props: {
    unlinkPanels: { type: Boolean, default: !1 }
  },
  setup(l) {
    const t = l, s = new Date().getDate(), i = r(!1), c = r(), D = r(), C = r(), T = r(), M = r(), p = r(), m = r([1661090509502, 1661090509502]), w = () => {
      i.value = !0;
    };
    ke(c, () => {
      i.value = !1;
    });
    const { leftYear: z, leftMonth: G, rightYear: J, rightMonth: K } = Ye();
    let d = r(z), h = r(G), f = r(J), y = r(K), b = r([]), P = r([]), N = r(!1), Q = r(!1), E = r(), S = r(), W = r(!1);
    const le = (e) => {
      if (Q.value = !0, N.value && (N.value = !1), e === "month")
        if (y.value++, t.unlinkPanels) {
          const { month: n, year: a } = ee(
            y.value,
            f.value
          );
          y.value = n, f.value = a;
        } else {
          h.value++;
          const { month: n, year: a } = ee(
            y.value,
            f.value
          );
          y.value = n, f.value = a;
          const { month: k, year: v } = ee(
            h.value,
            d.value
          );
          h.value = k, d.value = v;
        }
      else
        e === "year" && (f.value++, t.unlinkPanels || d.value++);
      ue();
    }, ae = (e) => {
      if (N.value = !0, Q.value && (Q.value = !1), e === "month")
        if (h.value--, t.unlinkPanels) {
          const { month: n, year: a } = Z(
            h.value,
            d.value
          );
          h.value = n, d.value = a;
        } else {
          y.value--;
          const { month: n, year: a } = Z(
            h.value,
            d.value
          );
          d.value = a, h.value = n;
          const { month: k, year: v } = Z(
            y.value,
            f.value
          );
          f.value = v, y.value = k;
        }
      else
        e === "year" && (d.value--, t.unlinkPanels || f.value--);
      ue();
    };
    let o = r([]);
    const ne = (e, n) => {
      var ce, ve, de, fe;
      let a = n === "left" ? d.value : f.value, k = A(
        n === "left" ? h.value : y.value
      ), v = A(e.value);
      const { month: $, year: Be } = Ue(
        e,
        a,
        Number(k)
      ), L = new Date(Be + "-" + $ + "-" + v).getTime();
      m.value.length > 2 ? (m.value = [], (ce = m.value) == null || ce.push(L)) : m.value.length === 0 ? (ve = m.value) == null || ve.push(L) : L >= m.value[0] ? ((de = m.value) == null || de.push(L), X(m.value)) : ((fe = m.value) == null || fe.unshift(L), X(m.value)), we(e);
    }, we = (e) => {
      o.value.length === 0 ? o.value.push({ val: e.timestamp, isInit: !0 }) : o.value.length === 2 && (W.value = !0, o.value.find(
        (a) => a.isInit === !1
      ) === void 0 && (o.value = [], o.value.push({
        isInit: !0,
        val: e.timestamp
      }), W.value = !1), o.value.length === 2 && (o.value = o.value.map((a) => (a.isInit || (a.isInit = !0), a))));
    };
    function X(e) {
      E.value = j(e[0]), S.value = j(e[1]);
    }
    De(() => {
      X(m.value);
    });
    for (let e = 0; e < 6; e++)
      b.value[e] = new Array(), P.value[e] = new Array();
    const ue = () => {
      for (let e = 0; e < 6; e++)
        t.unlinkPanels ? N.value ? b.value[e] = new Array() : P.value[e] = new Array() : (b.value[e] = new Array(), P.value[e] = new Array());
    };
    O(
      [d, h],
      (e) => {
        let n = 0;
        ge(e[0], e[1]).forEach((a, k) => {
          (k + 1) % 7 === 0 ? (b.value[n].push(a), n++) : b.value[n].push(a);
        });
      },
      {
        immediate: !0
      }
    ), O(
      [f, y],
      (e) => {
        let n = 0;
        ge(e[0], e[1]).forEach((a, k) => {
          (k + 1) % 7 === 0 ? (P.value[n].push(a), n++) : P.value[n].push(a);
        });
      },
      {
        immediate: !0
      }
    );
    const Re = q(() => d.value + "\u5E74" + A(h.value) + "\u6708"), Ie = q(() => f.value + "\u5E74" + A(y.value) + "\u6708"), se = (e, n) => e.category === "prev" || e.category === "next" ? "prevAndNext" : e.category === "curr" && e.value === s && n ? "todayStyle" : "", oe = (e) => {
      if (!(o.value.length === 0 || W.value)) {
        if (o.value.length === 1)
          e.timestamp < o.value[0].val ? o.value.unshift({ val: e.timestamp, isInit: !1 }) : o.value.push({ val: e.timestamp, isInit: !1 });
        else {
          const n = o.value.find((k) => k.isInit), a = o.value.findIndex(
            (k) => k.isInit
          );
          a === 0 && e.timestamp <= (n == null ? void 0 : n.val) ? (o.value.pop(), o.value.unshift({ val: e.timestamp, isInit: !1 })) : a === 0 && (o.value[1].val = e.timestamp), a === 1 && e.timestamp >= (n == null ? void 0 : n.val) ? (o.value.shift(), o.value.push({ val: e.timestamp, isInit: !1 })) : a === 1 && (o.value[0].val = e.timestamp);
        }
        if (o.value.length === 2 && o.value[0].val <= e.timestamp && e.timestamp <= o.value[1].val)
          return "selectedRangeBg";
      }
    }, be = () => {
      i.value = !1;
    }, xe = () => {
      C.value = j(o.value[0].val) + " " + M.value, T.value = j(o.value[1].val) + " " + p.value, i.value = !1;
    }, re = (e) => e.category === "curr" && o.value && o.value.length === 2 && e.timestamp < o.value[1].val && e.timestamp > o.value[0].val ? "selectedRangeBg" : "", U = (e, n) => n === 0 && e.category === "curr" && o.value && o.value.length === 2 && e.timestamp === o.value[n].val ? "selectedDateLeftBoundary" : n === 1 && e.category === "curr" && o.value && o.value.length === 2 && e.timestamp === o.value[n].val ? "selectedDateRightBoundary" : "", ie = (e) => e.category === "curr" && o && o.value.length === 2 && (e.timestamp === o.value[1].val || e.timestamp === o.value[0].val) ? "selectedDate" : "";
    return (e, n) => (g(), _(I, null, [
      u("div", {
        onClick: w,
        class: "calendarInput"
      }, [
        V(u("input", {
          type: "text",
          "onUpdate:modelValue": n[0] || (n[0] = (a) => C.value = a)
        }, null, 512), [
          [F, C.value]
        ]),
        Qe,
        V(u("input", {
          type: "text",
          "onUpdate:modelValue": n[1] || (n[1] = (a) => T.value = a)
        }, null, 512), [
          [F, T.value]
        ])
      ]),
      (g(), Ve(Ae, { to: "body" }, [
        V(u("div", {
          class: "calendar",
          ref_key: "calendarRef",
          ref: c
        }, [
          u("div", We, [
            u("div", Xe, [
              V(u("input", {
                type: "text",
                "onUpdate:modelValue": n[2] || (n[2] = (a) => pe(E) ? E.value = a : E = a)
              }, null, 512), [
                [F, R(E)]
              ]),
              me(ye, {
                modelValue: M.value,
                "onUpdate:modelValue": n[3] || (n[3] = (a) => M.value = a)
              }, null, 8, ["modelValue"])
            ]),
            Ze,
            u("div", et, [
              V(u("input", {
                type: "text",
                "onUpdate:modelValue": n[4] || (n[4] = (a) => pe(S) ? S.value = a : S = a)
              }, null, 512), [
                [F, R(S)]
              ]),
              me(ye, {
                modelValue: p.value,
                "onUpdate:modelValue": n[5] || (n[5] = (a) => p.value = a)
              }, null, 8, ["modelValue"])
            ])
          ]),
          u("div", tt, [
            u("div", lt, [
              u("div", at, [
                u("div", nt, [
                  u("span", {
                    onClick: n[6] || (n[6] = (a) => ae("year"))
                  }, "<<"),
                  u("span", {
                    onClick: n[7] || (n[7] = (a) => ae("month"))
                  }, "<")
                ]),
                u("div", ut, B(R(Re)), 1)
              ]),
              u("div", null, [
                u("table", null, [
                  u("thead", null, [
                    u("tr", null, [
                      (g(!0), _(I, null, x(R(he), (a) => (g(), _("th", { key: a }, B(a), 1))), 128))
                    ])
                  ]),
                  u("tbody", null, [
                    (g(!0), _(I, null, x(R(b), (a, k) => (g(), _("tr", { key: k }, [
                      (g(!0), _(I, null, x(a, (v) => (g(), _("td", {
                        key: v,
                        class: Y([
                          re(v),
                          U(v, 0),
                          U(v, 1)
                        ])
                      }, [
                        u("div", {
                          class: Y(se(v, "curr"))
                        }, [
                          u("span", {
                            class: Y([
                              D.value === v.value ? "selectedDate" : "",
                              ie(v)
                            ]),
                            onMouseenter: ($) => oe(v),
                            onClick: ($) => ne(v, "left")
                          }, B(v.value), 43, st)
                        ], 2)
                      ], 2))), 128))
                    ]))), 128))
                  ])
                ])
              ])
            ]),
            u("div", ot, [
              u("div", rt, [
                u("div", it, B(R(Ie)), 1),
                u("div", ct, [
                  u("span", {
                    onClick: n[8] || (n[8] = (a) => le("month"))
                  }, " > "),
                  u("span", {
                    onClick: n[9] || (n[9] = (a) => le("year"))
                  }, " >> ")
                ])
              ]),
              u("div", null, [
                u("table", null, [
                  u("thead", null, [
                    u("tr", null, [
                      (g(!0), _(I, null, x(R(he), (a) => (g(), _("th", { key: a }, B(a), 1))), 128))
                    ])
                  ]),
                  u("tbody", null, [
                    (g(!0), _(I, null, x(R(P), (a, k) => (g(), _("tr", { key: k }, [
                      (g(!0), _(I, null, x(a, (v) => (g(), _("td", {
                        key: v,
                        class: Y([
                          re(v),
                          U(v, 0),
                          U(v, 1)
                        ])
                      }, [
                        u("div", null, [
                          u("span", {
                            class: Y([se(v), ie(v)]),
                            onMouseenter: ($) => oe(v),
                            onClick: ($) => ne(v, "right")
                          }, B(v.value), 43, vt)
                        ])
                      ], 2))), 128))
                    ]))), 128))
                  ])
                ])
              ])
            ])
          ]),
          u("div", { class: "calendar-footer" }, [
            u("button", { onClick: be }, "\u53D6\u6D88"),
            u("button", { onClick: xe }, "\u786E\u5B9A")
          ])
        ], 512), [
          [Ee, i.value]
        ])
      ]))
    ], 64));
  }
});
const _e = /* @__PURE__ */ Me(ft, [["__scopeId", "data-v-918b2776"]]), mt = {
  install: (l, t) => {
    l.component(_e.name, _e);
  }
};
export {
  mt as default
};
