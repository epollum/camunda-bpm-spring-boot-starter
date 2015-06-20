define("text", {
  load: function (e) {
    throw new Error("Dynamic load not allowed: " + e)
  }
}), define("text!directives/breadcrumbs.html", [], function () {
  return '<!-- # CE - camunda-cockpit-ui/client/scripts/directives/breadcrumbs.html -->\n<ul class="breadcrumb">\n  <li>\n    <a href="#">Home</a>\n  </li>\n\n  <li ng-repeat="(index, crumb) in breadcrumbs"\n      ng-class="{ active: !!$last }"\n      data-index="{{ index }}">\n    <span class="divider">{{ crumb.divider || divider }}</span>\n\n    <span ng-if="!!crumb.href">\n      <a ng-if="!$last"\n         href="{{ crumb.href }}">{{ crumb.label }}</a>\n\n      <span ng-if="!!$last">{{ crumb.label }}</span>\n    </span>\n\n    <span ng-if="!crumb.href">\n      <a ng-if="!!crumb.callback"\n         ng-click="crumb.callback(index, breadcrumbs)"\n         href>{{ crumb.label }}</a>\n\n      <span ng-if="!crumb.callback">{{ crumb.label }}</span>\n    </span>\n  </li>\n</ul>\n<!-- / CE - camunda-cockpit-ui/client/scripts/directives/breadcrumbs.html -->\n'
}), define("directives/breadcrumbs", ["angular", "text!./breadcrumbs.html"], function (e, t) {
  "use strict";
  return [function () {
    return {
      scope: {divider: "@"}, restrict: "A", template: t, link: function (e) {
        e.$on("page.breadcrumbs.changed", function (t, n) {
          e.breadcrumbs = n
        })
      }, controller: ["$scope", "page", function (e, t) {
        e.breadcrumbs = t.breadcrumbsGet()
      }]
    }
  }]
}), define("directives/numeric", [], function () {
  "use strict";
  var e = function () {
    return {
      restrict: "A", require: "ngModel", link: function (e, t, n, i) {
        var r = n.integer ? /^-?[\d]+$/ : /^(0|(-?(((0|[1-9]\d*)\.\d+)|([1-9]\d*))))([eE][-+]?[0-9]+)?$/, a = function (e) {
          var t = r.test(e);
          return i.$setValidity("numeric", t), t ? parseFloat(e, 10) : e
        };
        i.$parsers.push(a);
        var o = function (e) {
          if (void 0 !== e && null !== e) {
            var n = r.test(e);
            return i.$setValidity("numeric", n), n ? parseFloat(e, 10) : (i.$pristine = !1, i.$dirty = !0, t.addClass("ng-dirty"), e)
          }
        };
        i.$formatters.push(o)
      }
    }
  };
  return e
}), define("directives/date", ["angular"], function () {
  "use strict";
  return function () {
    return {
      restrict: "A", require: "ngModel", link: function (e, t, n, i) {
        var r = /^(\d{2}|\d{4})(?:\-)([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)([0-2]{1}\d{1}|[3]{1}[0-1]{1})T(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1}):([0-5]{1}\d{1}):([0-5]{1}\d{1})?$/, a = function (e) {
          var t = r.test(e);
          return i.$setValidity("date", t), e
        };
        i.$parsers.push(a);
        var o = function (e) {
          if (e) {
            var n = r.test(e);
            return i.$setValidity("date", n), n || (i.$pristine = !1, i.$dirty = !0, t.addClass("ng-dirty")), e
          }
        };
        i.$formatters.push(o)
      }
    }
  }
}), define("text!directives/processDiagram.html", [], function () {
  return "<div cam-widget-bpmn-viewer\n  diagram-data='diagramData'\n  control='control'\n  on-load='onLoad()'\n  on-click='onClick(element, $event)'\n  on-mouse-enter='onMouseEnter(element, $event)'\n  on-mouse-leave='onMouseLeave(element, $event)'\n  style='height: 100%'>\n</div>\n"
}), define("directives/processDiagram", ["angular", "jquery", "text!./processDiagram.html"], function (e, t, n) {
  "use strict";
  var i = ["$scope", "$compile", "Views", "$timeout", function (t, n, i) {
    function r(t) {
      e.forEach(t, function (e) {
        a(e)
      })
    }

    function a(i) {
      var r = t.control.getElement(i.id);
      if (r) {
        var a = t.$new();
        a.bpmnElement = i;
        var o = e.element(d);
        o.css({width: r.width, height: r.height}), n(o)(a);
        try {
          t.control.createBadge(i.id, {html: o, position: {top: 0, left: 0}})
        } catch (s) {
        }
      }
    }

    function o(n) {
      t.control.isLoaded() && (u && e.forEach(u, function (e) {
        l[e] && t.control.clearHighlight(e)
      }), n && e.forEach(n, function (e) {
        l[e] && t.control.highlight(e)
      })), t.$root.$emit("instance-diagram-selection-change", n), u = n
    }

    function s(e) {
      t.control.isLoaded() && e && c(e), p = e
    }

    function c(e) {
      l[e] && t.control.scrollToElement(e)
    }

    t.overlayVars = {read: ["processData", "bpmnElement", "pageData"]}, t.overlayProviders = i.getProviders({component: t.providerComponent});
    var l, u, p, d = '<div class="bpmn-overlay"><div view ng-repeat="overlayProvider in overlayProviders" provider="overlayProvider" vars="overlayVars"></div></div>';
    t.$on("$destroy", function () {
      t.processDiagram = null, t.overlayProviders = null
    }), t.control = {}, t.$watch("processDiagram", function (e) {
      e && e.$loaded !== !1 && (l = e.bpmnElements, t.diagramData = e.bpmnDefinition)
    }), t.onLoad = function () {
      r(t.processDiagram.bpmnElements), o(u), s(p)
    };
    var f = function (e) {
      return e.isSelectable || t.selectAll && e.$instanceOf("bpmn:FlowNode")
    };
    t.onClick = function (e, n) {
      t.onElementClick(l[e.businessObject.id] && f(l[e.businessObject.id]) ? {
        id: e.businessObject.id,
        $event: n
      } : {id: null, $event: n})
    }, t.onMouseEnter = function (e) {
      l[e.businessObject.id] && f(l[e.businessObject.id]) && (t.control.getViewer().get("canvas").addMarker(e.businessObject.id, "selectable"), t.control.highlight(e.businessObject.id))
    }, t.onMouseLeave = function (e) {
      !l[e.businessObject.id] || !f(l[e.businessObject.id]) || u && -1 !== u.indexOf(e.businessObject.id) || t.control.clearHighlight(e.businessObject.id)
    }, t.$watch("selection.activityIds", function (e) {
      o(e)
    }), t.$watch("selection.scrollToBpmnElement", function (e) {
      e && s(e)
    })
  }], r = function () {
    return {
      restrict: "EAC",
      scope: {
        processDiagram: "=",
        processDiagramOverlay: "=",
        onElementClick: "&",
        selection: "=",
        processData: "=",
        pageData: "=",
        providerComponent: "@",
        selectAll: "&"
      },
      controller: i,
      template: n,
      link: function (e) {
        e.selectAll = e.$eval(e.selectAll)
      }
    }
  };
  return r.$inject = ["$compile", "Views"], r
}), define("text!directives/processDiagramPreview.html", [], function () {
  return "<span ng-hide=\"diagramXML\">\n  <i class=\"glyphicon glyphicon-loading\"></i> loading process diagram...\n</span>\n<div ng-show=\"diagramXML\">\n  <div cam-widget-bpmn-viewer\n    diagram-data='diagramXML'\n    control='control'\n    disable-navigation='true'>\n  </div>\n</div>\n"
}), define("directives/processDiagramPreview", ["text!./processDiagramPreview.html", "angular"], function (e, t) {
  "use strict";
  return ["ProcessDefinitionResource", "debounce", function (n, i) {
    return {
      restrict: "EAC", template: e, controller: ["$scope", function (e) {
        e.control = {}
      }], link: function (e, r, a) {
        e.$watch(a.processDefinitionId, function (a) {
          if (a) {
            var o = "processDiagram_" + a.replace(/[.|:]/g, "_");
            r.attr("id", o), n.getBpmn20Xml({id: a}).$promise.then(function (n) {
              e.diagramXML = n.bpmn20Xml, r.find("[cam-widget-bpmn-viewer]").css({
                width: parseInt(r.parent().width(), 10),
                height: r.parent().height()
              });
              var a = i(function () {
                e.control.resetZoom(), e.control.resetZoom()
              }, 500);
              t.element(window).on("resize", function () {
                r.find("[cam-widget-bpmn-viewer]").css({
                  width: parseInt(r.parent().width(), 10),
                  height: r.parent().height()
                }), a()
              })
            })
          }
        })
      }
    }
  }]
}), define("text!directives/activity-instance-tree.html", [], function () {
  return '<!-- # CE - camunda-cockpit-ui/client/scripts/directives/activity-instance-tree.html -->\n<div class="tree-node" >\n\n  <div id="{{ node.id }}"\n       ng-class="{ \'state-running\': !node.endTime, \'state-completed\' : node.endTime && !node.canceled, \'state-canceled\': node.endTime && node.canceled }"\n       class="tree-node-group">\n\n    <span class="tree-node-label"\n          ng-class="{ \'selected\' : node.isSelected, \'has-children\': node.children.length }">\n\n      <button class="btn btn-link btn-control-link btn-toggle"\n              ng-if="node.children.length"\n              ng-click="toggleOpen()">\n        <span class="glyphicon"\n           ng-class="{ \'glyphicon-chevron-right\' : !node.isOpen, \'glyphicon-chevron-down\' : node.isOpen }"></span>\n      </button>\n\n      <button class="btn btn-link btn-control-link btn-control remove"\n              ng-click="deselect($event)">\n        <span class="glyphicon glyphicon-remove"></span>\n      </button>\n\n      <span class="{{ symbolIconName(node.activityType) }}"\n            tooltip="{{ node.activityType }}"></span>\n\n      <a ng-click="select($event)"\n         tooltip-placement="right"\n         tooltip="{{ node.name }}">\n        {{ node.name }}\n      </a>\n\n    </span>\n\n    <!-- running -->\n    <span ng-if="!node.endTime"\n          class="tree-node-addon activity-instance-running"\n          tooltip="Running Activity Instance"\n          tooltip-placement="right">\n      <span class="glyphicon glyphicon-adjust"></span>\n    </span>\n\n    <!-- completed -->\n    <span ng-if="node.endTime && !node.canceled"\n          class="tree-node-addon activity-instance-completed"\n          tooltip="Completed Activity Instance"\n          tooltip-placement="right">\n      <span class="glyphicon glyphicon-ok-circle"></span>\n    </span>\n\n    <!-- canceled -->\n    <span ng-if="node.endTime && node.canceled"\n          class="tree-node-addon activity-instance-canceled"\n          tooltip="Canceled Activity Instance"\n          tooltip-placement="right">\n      <span class="glyphicon glyphicon-ban-circle"></span>\n    </span>\n\n  </div>\n\n  <ul class="list-unstyled" ng-show="node.isOpen" ng-if="node.children.length">\n    <li ng-repeat="child in node.children">\n      <div activity-instance-tree="child"\n           selection="selection"\n           on-element-click="propogateSelection(id, activityId, $event)"\n           order-children-by="orderChildrenBy()">\n      </div>\n    </li>\n  </ul>\n</div>\n<!-- / CE - camunda-cockpit-ui/client/scripts/directives/activity-instance-tree.html -->\n'
}), define("directives/activityInstanceTree", ["angular", "require", "text!./activity-instance-tree.html"], function (e, t, n) {
  "use strict";
  function i(e) {
    return (e || "").replace(/([A-Z])/g, function (e) {
      return "-" + e.toLowerCase()
    })
  }

  var r = {
    "start-event": "start-event-none",
    "error-start-event": "start-event-error",
    "cancel-end-event": "end-event-cancel",
    "error-end-event": "end-event-error",
    "none-end-event": "end-event-none",
    "parallel-gateway": "gateway-parallel",
    "exclusive-gateway": "gateway-xor",
    "intermediate-compensation-throw-event": "intermediate-event-throw-compensation"
  }, a = ["$compile", "$http", "$filter", function (t, a, o) {
    return {
      restrict: "EAC",
      scope: {
        node: "=activityInstanceTree",
        onElementClick: "&",
        selection: "=",
        quickFilters: "=",
        orderChildrenBy: "&"
      },
      link: function (a, s) {
        function c(e) {
          e(n)
        }

        function l(e, t) {
          var n = a.node, i = e.name;
          n && (i === h || i === f) && n.id === t.parentActivityInstanceId && (n.isOpen = !0, n.parentActivityInstanceId && n.id !== n.parentActivityInstanceId && u(h, n))
        }

        function u(e, t) {
          var n = t.id, i = t.parentActivityInstanceId;
          a.$emit(e, {id: n, parentActivityInstanceId: i})
        }

        function p(n) {
          c(function (i) {
            n.isOpen = n.endTime ? !1 : !0;
            var r = e.element(i);
            t(r)(a), d.replaceWith(r), d = r
          })
        }

        a.symbolIconName = function (e) {
          var t = i(e);
          return t = r[t] ? r[t] : t, "icon-" + t
        };
        var d = s, f = "node.selected", h = "node.opened", m = a.orderChildrenBy();
        a.$watch("node", function (e) {
          if (e && e.$loaded !== !1) {
            var t = (e.childActivityInstances || []).concat(e.childTransitionInstances || []);
            m && (t = o("orderBy")(t, m)), e.children = t, p(e)
          }
        }), a.$on(h, function (e, t) {
          l(e, t)
        }), a.$on(f, function (e, t) {
          l(e, t)
        }), a.$watch("selection.activityInstanceIds", function (e, t) {
          var n = a.node;
          n && (t && -1 != t.indexOf(n.id) && (n.isSelected = !1), e && -1 != e.indexOf(n.id) && (n.isSelected = !0, n.parentActivityInstanceId && u(f, n)))
        }), a.deselect = function (e) {
          e.ctrlKey = !0, a.select(e)
        }, a.select = function (e) {
          var t = a.node;
          e.stopPropagation(), a.$emit("instance-tree-selection-change"), a.onElementClick({
            id: t.id,
            activityId: t.activityId || t.targetActivityId,
            $event: e
          })
        }, a.propogateSelection = function (e, t, n) {
          a.onElementClick({id: e, activityId: t, $event: n})
        }, a.toggleOpen = function () {
          var e = a.node;
          e.isOpen = !e.isOpen
        }
      }
    }
  }];
  return a
}), function (e, t) {
  function n(t, n) {
    var r, a, o, s = t.nodeName.toLowerCase();
    return "area" === s ? (r = t.parentNode, a = r.name, t.href && a && "map" === r.nodeName.toLowerCase() ? (o = e("img[usemap=#" + a + "]")[0], !!o && i(o)) : !1) : (/input|select|textarea|button|object/.test(s) ? !t.disabled : "a" === s ? t.href || n : n) && i(t)
  }

  function i(t) {
    return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
        return "hidden" === e.css(this, "visibility")
      }).length
  }

  var r = 0, a = /^ui-id-\d+$/;
  e.ui = e.ui || {}, e.extend(e.ui, {
    version: "@VERSION",
    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  }), e.fn.extend({
    focus: function (t) {
      return function (n, i) {
        return "number" == typeof n ? this.each(function () {
          var t = this;
          setTimeout(function () {
            e(t).focus(), i && i.call(t)
          }, n)
        }) : t.apply(this, arguments)
      }
    }(e.fn.focus), scrollParent: function () {
      var t;
      return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
        return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
      }).eq(0) : this.parents().filter(function () {
        return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
      }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t
    }, zIndex: function (n) {
      if (n !== t)return this.css("zIndex", n);
      if (this.length)for (var i, r, a = e(this[0]); a.length && a[0] !== document;) {
        if (i = a.css("position"), ("absolute" === i || "relative" === i || "fixed" === i) && (r = parseInt(a.css("zIndex"), 10), !isNaN(r) && 0 !== r))return r;
        a = a.parent()
      }
      return 0
    }, uniqueId: function () {
      return this.each(function () {
        this.id || (this.id = "ui-id-" + ++r)
      })
    }, removeUniqueId: function () {
      return this.each(function () {
        a.test(this.id) && e(this).removeAttr("id")
      })
    }
  }), e.extend(e.expr[":"], {
    data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
      return function (n) {
        return !!e.data(n, t)
      }
    }) : function (t, n, i) {
      return !!e.data(t, i[3])
    }, focusable: function (t) {
      return n(t, !isNaN(e.attr(t, "tabindex")))
    }, tabbable: function (t) {
      var i = e.attr(t, "tabindex"), r = isNaN(i);
      return (r || i >= 0) && n(t, !r)
    }
  }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (n, i) {
    function r(t, n, i, r) {
      return e.each(a, function () {
        n -= parseFloat(e.css(t, "padding" + this)) || 0, i && (n -= parseFloat(e.css(t, "border" + this + "Width")) || 0), r && (n -= parseFloat(e.css(t, "margin" + this)) || 0)
      }), n
    }

    var a = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"], o = i.toLowerCase(), s = {
      innerWidth: e.fn.innerWidth,
      innerHeight: e.fn.innerHeight,
      outerWidth: e.fn.outerWidth,
      outerHeight: e.fn.outerHeight
    };
    e.fn["inner" + i] = function (n) {
      return n === t ? s["inner" + i].call(this) : this.each(function () {
        e(this).css(o, r(this, n) + "px")
      })
    }, e.fn["outer" + i] = function (t, n) {
      return "number" != typeof t ? s["outer" + i].call(this, t) : this.each(function () {
        e(this).css(o, r(this, t, !0, n) + "px")
      })
    }
  }), e.fn.addBack || (e.fn.addBack = function (e) {
    return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
  }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
    return function (n) {
      return arguments.length ? t.call(this, e.camelCase(n)) : t.call(this)
    }
  }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart"in document.createElement("div"), e.fn.extend({
    disableSelection: function () {
      return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
        e.preventDefault()
      })
    }, enableSelection: function () {
      return this.unbind(".ui-disableSelection")
    }
  }), e.extend(e.ui, {
    plugin: {
      add: function (t, n, i) {
        var r, a = e.ui[t].prototype;
        for (r in i)a.plugins[r] = a.plugins[r] || [], a.plugins[r].push([n, i[r]])
      }, call: function (e, t, n) {
        var i, r = e.plugins[t];
        if (r && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType)for (i = 0; i < r.length; i++)e.options[r[i][0]] && r[i][1].apply(e.element, n)
      }
    }, hasScroll: function (t, n) {
      if ("hidden" === e(t).css("overflow"))return !1;
      var i = n && "left" === n ? "scrollLeft" : "scrollTop", r = !1;
      return t[i] > 0 ? !0 : (t[i] = 1, r = t[i] > 0, t[i] = 0, r)
    }
  })
}(jQuery), define("jquery-ui-core", function () {
}), function (e, t) {
  var n = 0, i = Array.prototype.slice, r = e.cleanData;
  e.cleanData = function (t) {
    for (var n, i = 0; null != (n = t[i]); i++)try {
      e(n).triggerHandler("remove")
    } catch (a) {
    }
    r(t)
  }, e.widget = function (t, n, i) {
    var r, a, o, s, c = {}, l = t.split(".")[0];
    t = t.split(".")[1], r = l + "-" + t, i || (i = n, n = e.Widget), e.expr[":"][r.toLowerCase()] = function (t) {
      return !!e.data(t, r)
    }, e[l] = e[l] || {}, a = e[l][t], o = e[l][t] = function (e, t) {
      return this._createWidget ? void(arguments.length && this._createWidget(e, t)) : new o(e, t)
    }, e.extend(o, a, {
      version: i.version,
      _proto: e.extend({}, i),
      _childConstructors: []
    }), s = new n, s.options = e.widget.extend({}, s.options), e.each(i, function (t, i) {
      return e.isFunction(i) ? void(c[t] = function () {
        var e = function () {
          return n.prototype[t].apply(this, arguments)
        }, r = function (e) {
          return n.prototype[t].apply(this, e)
        };
        return function () {
          var t, n = this._super, a = this._superApply;
          return this._super = e, this._superApply = r, t = i.apply(this, arguments), this._super = n, this._superApply = a, t
        }
      }()) : void(c[t] = i)
    }), o.prototype = e.widget.extend(s, {widgetEventPrefix: a ? s.widgetEventPrefix || t : t}, c, {
      constructor: o,
      namespace: l,
      widgetName: t,
      widgetFullName: r
    }), a ? (e.each(a._childConstructors, function (t, n) {
      var i = n.prototype;
      e.widget(i.namespace + "." + i.widgetName, o, n._proto)
    }), delete a._childConstructors) : n._childConstructors.push(o), e.widget.bridge(t, o)
  }, e.widget.extend = function (n) {
    for (var r, a, o = i.call(arguments, 1), s = 0, c = o.length; c > s; s++)for (r in o[s])a = o[s][r], o[s].hasOwnProperty(r) && a !== t && (n[r] = e.isPlainObject(a) ? e.isPlainObject(n[r]) ? e.widget.extend({}, n[r], a) : e.widget.extend({}, a) : a);
    return n
  }, e.widget.bridge = function (n, r) {
    var a = r.prototype.widgetFullName || n;
    e.fn[n] = function (o) {
      var s = "string" == typeof o, c = i.call(arguments, 1), l = this;
      return o = !s && c.length ? e.widget.extend.apply(null, [o].concat(c)) : o, this.each(s ? function () {
        var i, r = e.data(this, a);
        return r ? e.isFunction(r[o]) && "_" !== o.charAt(0) ? (i = r[o].apply(r, c), i !== r && i !== t ? (l = i && i.jquery ? l.pushStack(i.get()) : i, !1) : void 0) : e.error("no such method '" + o + "' for " + n + " widget instance") : e.error("cannot call methods on " + n + " prior to initialization; attempted to call method '" + o + "'")
      } : function () {
        var t = e.data(this, a);
        t ? t.option(o || {})._init() : e.data(this, a, new r(o, this))
      }), l
    }
  }, e.Widget = function () {
  }, e.Widget._childConstructors = [], e.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {disabled: !1, create: null},
    _createWidget: function (t, i) {
      i = e(i || this.defaultElement || this)[0], this.element = e(i), this.uuid = n++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), i !== this && (e.data(i, this.widgetFullName, this), this._on(!0, this.element, {
        remove: function (e) {
          e.target === i && this.destroy()
        }
      }), this.document = e(i.style ? i.ownerDocument : i.document || i), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
    },
    _getCreateOptions: e.noop,
    _getCreateEventData: e.noop,
    _create: e.noop,
    _init: e.noop,
    destroy: function () {
      this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
    },
    _destroy: e.noop,
    widget: function () {
      return this.element
    },
    option: function (n, i) {
      var r, a, o, s = n;
      if (0 === arguments.length)return e.widget.extend({}, this.options);
      if ("string" == typeof n)if (s = {}, r = n.split("."), n = r.shift(), r.length) {
        for (a = s[n] = e.widget.extend({}, this.options[n]), o = 0; o < r.length - 1; o++)a[r[o]] = a[r[o]] || {}, a = a[r[o]];
        if (n = r.pop(), 1 === arguments.length)return a[n] === t ? null : a[n];
        a[n] = i
      } else {
        if (1 === arguments.length)return this.options[n] === t ? null : this.options[n];
        s[n] = i
      }
      return this._setOptions(s), this
    },
    _setOptions: function (e) {
      var t;
      for (t in e)this._setOption(t, e[t]);
      return this
    },
    _setOption: function (e, t) {
      return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
    },
    enable: function () {
      return this._setOption("disabled", !1)
    },
    disable: function () {
      return this._setOption("disabled", !0)
    },
    _on: function (t, n, i) {
      var r, a = this;
      "boolean" != typeof t && (i = n, n = t, t = !1), i ? (n = r = e(n), this.bindings = this.bindings.add(n)) : (i = n, n = this.element, r = this.widget()), e.each(i, function (i, o) {
        function s() {
          return t || a.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? a[o] : o).apply(a, arguments) : void 0
        }

        "string" != typeof o && (s.guid = o.guid = o.guid || s.guid || e.guid++);
        var c = i.match(/^(\w+)\s*(.*)$/), l = c[1] + a.eventNamespace, u = c[2];
        u ? r.delegate(u, l, s) : n.bind(l, s)
      })
    },
    _off: function (e, t) {
      t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t)
    },
    _delay: function (e, t) {
      function n() {
        return ("string" == typeof e ? i[e] : e).apply(i, arguments)
      }

      var i = this;
      return setTimeout(n, t || 0)
    },
    _hoverable: function (t) {
      this.hoverable = this.hoverable.add(t), this._on(t, {
        mouseenter: function (t) {
          e(t.currentTarget).addClass("ui-state-hover")
        }, mouseleave: function (t) {
          e(t.currentTarget).removeClass("ui-state-hover")
        }
      })
    },
    _focusable: function (t) {
      this.focusable = this.focusable.add(t), this._on(t, {
        focusin: function (t) {
          e(t.currentTarget).addClass("ui-state-focus")
        }, focusout: function (t) {
          e(t.currentTarget).removeClass("ui-state-focus")
        }
      })
    },
    _trigger: function (t, n, i) {
      var r, a, o = this.options[t];
      if (i = i || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], a = n.originalEvent)for (r in a)r in n || (n[r] = a[r]);
      return this.element.trigger(n, i), !(e.isFunction(o) && o.apply(this.element[0], [n].concat(i)) === !1 || n.isDefaultPrevented())
    }
  }, e.each({show: "fadeIn", hide: "fadeOut"}, function (t, n) {
    e.Widget.prototype["_" + t] = function (i, r, a) {
      "string" == typeof r && (r = {effect: r});
      var o, s = r ? r === !0 || "number" == typeof r ? n : r.effect || n : t;
      r = r || {}, "number" == typeof r && (r = {duration: r}), o = !e.isEmptyObject(r), r.complete = a, r.delay && i.delay(r.delay), o && e.effects && e.effects.effect[s] ? i[t](r) : s !== t && i[s] ? i[s](r.duration, r.easing, a) : i.queue(function (n) {
        e(this)[t](), a && a.call(i[0]), n()
      })
    }
  })
}(jQuery), define("jquery-ui-widget", function () {
}), function (e) {
  var t = !1;
  e(document).mouseup(function () {
    t = !1
  }), e.widget("ui.mouse", {
    version: "@VERSION",
    options: {cancel: "input,textarea,button,select,option", distance: 1, delay: 0},
    _mouseInit: function () {
      var t = this;
      this.element.bind("mousedown." + this.widgetName, function (e) {
        return t._mouseDown(e)
      }).bind("click." + this.widgetName, function (n) {
        return !0 === e.data(n.target, t.widgetName + ".preventClickEvent") ? (e.removeData(n.target, t.widgetName + ".preventClickEvent"), n.stopImmediatePropagation(), !1) : void 0
      }), this.started = !1
    },
    _mouseDestroy: function () {
      this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
    },
    _mouseDown: function (n) {
      if (!t) {
        this._mouseStarted && this._mouseUp(n), this._mouseDownEvent = n;
        var i = this, r = 1 === n.which, a = "string" == typeof this.options.cancel && n.target.nodeName ? e(n.target).closest(this.options.cancel).length : !1;
        return r && !a && this._mouseCapture(n) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
          i.mouseDelayMet = !0
        }, this.options.delay)), this._mouseDistanceMet(n) && this._mouseDelayMet(n) && (this._mouseStarted = this._mouseStart(n) !== !1, !this._mouseStarted) ? (n.preventDefault(), !0) : (!0 === e.data(n.target, this.widgetName + ".preventClickEvent") && e.removeData(n.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (e) {
          return i._mouseMove(e)
        }, this._mouseUpDelegate = function (e) {
          return i._mouseUp(e)
        }, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), n.preventDefault(), t = !0, !0)) : !0
      }
    },
    _mouseMove: function (t) {
      return e.ui.ie && (!document.documentMode || document.documentMode < 9) && !t.button ? this._mouseUp(t) : this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted)
    },
    _mouseUp: function (t) {
      return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1
    },
    _mouseDistanceMet: function (e) {
      return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
    },
    _mouseDelayMet: function () {
      return this.mouseDelayMet
    },
    _mouseStart: function () {
    },
    _mouseDrag: function () {
    },
    _mouseStop: function () {
    },
    _mouseCapture: function () {
      return !0
    }
  })
}(jQuery), define("jquery-ui-mouse", function () {
}), function (e) {
  e.widget("ui.draggable", e.ui.mouse, {
    version: "@VERSION",
    widgetEventPrefix: "drag",
    options: {
      addClasses: !0,
      appendTo: "parent",
      axis: !1,
      connectToSortable: !1,
      containment: !1,
      cursor: "auto",
      cursorAt: !1,
      grid: !1,
      handle: !1,
      helper: "original",
      iframeFix: !1,
      opacity: !1,
      refreshPositions: !1,
      revert: !1,
      revertDuration: 500,
      scope: "default",
      scroll: !0,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      snap: !1,
      snapMode: "both",
      snapTolerance: 20,
      stack: !1,
      zIndex: !1,
      drag: null,
      start: null,
      stop: null
    },
    _create: function () {
      "original" !== this.options.helper || /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
    },
    _destroy: function () {
      this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy()
    },
    _mouseCapture: function (t) {
      var n = this.options;
      return this.helper || n.disabled || e(t.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(t), this.handle ? (e(n.iframeFix === !0 ? "iframe" : n.iframeFix).each(function () {
        e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({
          width: this.offsetWidth + "px",
          height: this.offsetHeight + "px",
          position: "absolute",
          opacity: "0.001",
          zIndex: 1e3
        }).css(e(this).offset()).appendTo("body")
      }), !0) : !1)
    },
    _mouseStart: function (t) {
      var n = this.options;
      return this.helper = this._createHelper(t), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), e.ui.ddmanager && (e.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offsetParent = this.helper.offsetParent(), this.offsetParentCssPosition = this.offsetParent.css("position"), this.offset = this.positionAbs = this.element.offset(), this.offset = {
        top: this.offset.top - this.margins.top,
        left: this.offset.left - this.margins.left
      }, this.offset.scroll = !1, e.extend(this.offset, {
        click: {
          left: t.pageX - this.offset.left,
          top: t.pageY - this.offset.top
        }, parent: this._getParentOffset(), relative: this._getRelativeOffset()
      }), this.originalPosition = this.position = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, n.cursorAt && this._adjustOffsetFromHelper(n.cursorAt), this._setContainment(), this._trigger("start", t) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this._mouseDrag(t, !0), e.ui.ddmanager && e.ui.ddmanager.dragStart(this, t), !0)
    },
    _mouseDrag: function (t, n) {
      if ("fixed" === this.offsetParentCssPosition && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), !n) {
        var i = this._uiHash();
        if (this._trigger("drag", t, i) === !1)return this._mouseUp({}), !1;
        this.position = i.position
      }
      return this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), !1
    },
    _mouseStop: function (t) {
      var n = this, i = !1;
      return e.ui.ddmanager && !this.options.dropBehaviour && (i = e.ui.ddmanager.drop(this, t)), this.dropped && (i = this.dropped, this.dropped = !1), "original" !== this.options.helper || e.contains(this.element[0].ownerDocument, this.element[0]) ? ("invalid" === this.options.revert && !i || "valid" === this.options.revert && i || this.options.revert === !0 || e.isFunction(this.options.revert) && this.options.revert.call(this.element, i) ? e(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
        n._trigger("stop", t) !== !1 && n._clear()
      }) : this._trigger("stop", t) !== !1 && this._clear(), !1) : !1
    },
    _mouseUp: function (t) {
      return e("div.ui-draggable-iframeFix").each(function () {
        this.parentNode.removeChild(this)
      }), e.ui.ddmanager && e.ui.ddmanager.dragStop(this, t), e.ui.mouse.prototype._mouseUp.call(this, t)
    },
    cancel: function () {
      return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
    },
    _getHandle: function (t) {
      return this.options.handle ? !!e(t.target).closest(this.element.find(this.options.handle)).length : !0
    },
    _createHelper: function (t) {
      var n = this.options, i = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t])) : "clone" === n.helper ? this.element.clone().removeAttr("id") : this.element;
      return i.parents("body").length || i.appendTo("parent" === n.appendTo ? this.element[0].parentNode : n.appendTo), i[0] === this.element[0] || /(fixed|absolute)/.test(i.css("position")) || i.css("position", "absolute"), i
    },
    _adjustOffsetFromHelper: function (t) {
      "string" == typeof t && (t = t.split(" ")), e.isArray(t) && (t = {
        left: +t[0],
        top: +t[1] || 0
      }), "left"in t && (this.offset.click.left = t.left + this.margins.left), "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top"in t && (this.offset.click.top = t.top + this.margins.top), "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
    },
    _getParentOffset: function () {
      var t = this.offsetParent.offset();
      return "absolute" === this.cssPosition && this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && e.ui.ie) && (t = {
        top: 0,
        left: 0
      }), {
        top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      }
    },
    _getRelativeOffset: function () {
      if ("relative" === this.cssPosition) {
        var e = this.element.position();
        return {
          top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        }
      }
      return {top: 0, left: 0}
    },
    _cacheMargins: function () {
      this.margins = {
        left: parseInt(this.element.css("marginLeft"), 10) || 0,
        top: parseInt(this.element.css("marginTop"), 10) || 0,
        right: parseInt(this.element.css("marginRight"), 10) || 0,
        bottom: parseInt(this.element.css("marginBottom"), 10) || 0
      }
    },
    _cacheHelperProportions: function () {
      this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
    },
    _setContainment: function () {
      var t, n, i, r = this.options;
      return r.containment ? "window" === r.containment ? void(this.containment = [e(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, e(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, e(window).scrollLeft() + e(window).width() - this.helperProportions.width - this.margins.left, e(window).scrollTop() + (e(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : "document" === r.containment ? void(this.containment = [0, 0, e(document).width() - this.helperProportions.width - this.margins.left, (e(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : r.containment.constructor === Array ? void(this.containment = r.containment) : ("parent" === r.containment && (r.containment = this.helper[0].parentNode), n = e(r.containment), i = n[0], void(i && (t = "hidden" !== n.css("overflow"), this.containment = [(parseInt(n.css("borderLeftWidth"), 10) || 0) + (parseInt(n.css("paddingLeft"), 10) || 0), (parseInt(n.css("borderTopWidth"), 10) || 0) + (parseInt(n.css("paddingTop"), 10) || 0), (t ? Math.max(i.scrollWidth, i.offsetWidth) : i.offsetWidth) - (parseInt(n.css("borderRightWidth"), 10) || 0) - (parseInt(n.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (t ? Math.max(i.scrollHeight, i.offsetHeight) : i.offsetHeight) - (parseInt(n.css("borderBottomWidth"), 10) || 0) - (parseInt(n.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = n))) : void(this.containment = null)
    },
    _convertPositionTo: function (t, n) {
      n || (n = this.position);
      var i = "absolute" === t ? 1 : -1, r = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent;
      return this.offset.scroll || (this.offset.scroll = {
        top: r.scrollTop(),
        left: r.scrollLeft()
      }), {
        top: n.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top) * i,
        left: n.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left) * i
      }
    },
    _generatePosition: function (t) {
      var n, i, r, a, o = this.options, s = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, c = t.pageX, l = t.pageY;
      return this.offset.scroll || (this.offset.scroll = {
        top: s.scrollTop(),
        left: s.scrollLeft()
      }), this.originalPosition && (this.containment && (this.relative_container ? (i = this.relative_container.offset(), n = [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top]) : n = this.containment, t.pageX - this.offset.click.left < n[0] && (c = n[0] + this.offset.click.left), t.pageY - this.offset.click.top < n[1] && (l = n[1] + this.offset.click.top), t.pageX - this.offset.click.left > n[2] && (c = n[2] + this.offset.click.left), t.pageY - this.offset.click.top > n[3] && (l = n[3] + this.offset.click.top)), o.grid && (r = o.grid[1] ? this.originalPageY + Math.round((l - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY, l = n ? r - this.offset.click.top >= n[1] || r - this.offset.click.top > n[3] ? r : r - this.offset.click.top >= n[1] ? r - o.grid[1] : r + o.grid[1] : r, a = o.grid[0] ? this.originalPageX + Math.round((c - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX, c = n ? a - this.offset.click.left >= n[0] || a - this.offset.click.left > n[2] ? a : a - this.offset.click.left >= n[0] ? a - o.grid[0] : a + o.grid[0] : a)), {
        top: l - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : this.offset.scroll.top),
        left: c - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : this.offset.scroll.left)
      }
    },
    _clear: function () {
      this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
    },
    _trigger: function (t, n, i) {
      return i = i || this._uiHash(), e.ui.plugin.call(this, t, [n, i]), "drag" === t && (this.positionAbs = this._convertPositionTo("absolute")), e.Widget.prototype._trigger.call(this, t, n, i)
    },
    plugins: {},
    _uiHash: function () {
      return {
        helper: this.helper,
        position: this.position,
        originalPosition: this.originalPosition,
        offset: this.positionAbs
      }
    }
  }), e.ui.plugin.add("draggable", "connectToSortable", {
    start: function (t, n) {
      var i = e(this).data("ui-draggable"), r = i.options, a = e.extend({}, n, {item: i.element});
      i.sortables = [], e(r.connectToSortable).each(function () {
        var n = e.data(this, "ui-sortable");
        n && !n.options.disabled && (i.sortables.push({
          instance: n,
          shouldRevert: n.options.revert
        }), n.refreshPositions(), n._trigger("activate", t, a))
      })
    }, stop: function (t, n) {
      var i = e(this).data("ui-draggable"), r = e.extend({}, n, {item: i.element});
      e.each(i.sortables, function () {
        this.instance.isOver ? (this.instance.isOver = 0, i.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = this.shouldRevert), this.instance._mouseStop(t), this.instance.options.helper = this.instance.options._helper, "original" === i.options.helper && this.instance.currentItem.css({
          top: "auto",
          left: "auto"
        })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", t, r))
      })
    }, drag: function (t, n) {
      var i = e(this).data("ui-draggable"), r = this;
      e.each(i.sortables, function () {
        var a = !1, o = this;
        this.instance.positionAbs = i.positionAbs, this.instance.helperProportions = i.helperProportions, this.instance.offset.click = i.offset.click, this.instance._intersectsWith(this.instance.containerCache) && (a = !0, e.each(i.sortables, function () {
          return this.instance.positionAbs = i.positionAbs, this.instance.helperProportions = i.helperProportions, this.instance.offset.click = i.offset.click, this !== o && this.instance._intersectsWith(this.instance.containerCache) && e.contains(o.instance.element[0], this.instance.element[0]) && (a = !1), a
        })), a ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = e(r).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function () {
          return n.helper[0]
        }, t.target = this.instance.currentItem[0], this.instance._mouseCapture(t, !0), this.instance._mouseStart(t, !0, !0), this.instance.offset.click.top = i.offset.click.top, this.instance.offset.click.left = i.offset.click.left, this.instance.offset.parent.left -= i.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= i.offset.parent.top - this.instance.offset.parent.top, i._trigger("toSortable", t), i.dropped = this.instance.element, i.currentItem = i.element, this.instance.fromOutside = i), this.instance.currentItem && this.instance._mouseDrag(t)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", t, this.instance._uiHash(this.instance)), this.instance._mouseStop(t, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), i._trigger("fromSortable", t), i.dropped = !1)
      })
    }
  }), e.ui.plugin.add("draggable", "cursor", {
    start: function () {
      var t = e("body"), n = e(this).data("ui-draggable").options;
      t.css("cursor") && (n._cursor = t.css("cursor")), t.css("cursor", n.cursor)
    }, stop: function () {
      var t = e(this).data("ui-draggable").options;
      t._cursor && e("body").css("cursor", t._cursor)
    }
  }), e.ui.plugin.add("draggable", "opacity", {
    start: function (t, n) {
      var i = e(n.helper), r = e(this).data("ui-draggable").options;
      i.css("opacity") && (r._opacity = i.css("opacity")), i.css("opacity", r.opacity)
    }, stop: function (t, n) {
      var i = e(this).data("ui-draggable").options;
      i._opacity && e(n.helper).css("opacity", i._opacity)
    }
  }), e.ui.plugin.add("draggable", "scroll", {
    start: function () {
      var t = e(this).data("ui-draggable");
      t.scrollParent[0] !== document && "HTML" !== t.scrollParent[0].tagName && (t.overflowOffset = t.scrollParent.offset())
    }, drag: function (t) {
      var n = e(this).data("ui-draggable"), i = n.options, r = !1;
      n.scrollParent[0] !== document && "HTML" !== n.scrollParent[0].tagName ? (i.axis && "x" === i.axis || (n.overflowOffset.top + n.scrollParent[0].offsetHeight - t.pageY < i.scrollSensitivity ? n.scrollParent[0].scrollTop = r = n.scrollParent[0].scrollTop + i.scrollSpeed : t.pageY - n.overflowOffset.top < i.scrollSensitivity && (n.scrollParent[0].scrollTop = r = n.scrollParent[0].scrollTop - i.scrollSpeed)), i.axis && "y" === i.axis || (n.overflowOffset.left + n.scrollParent[0].offsetWidth - t.pageX < i.scrollSensitivity ? n.scrollParent[0].scrollLeft = r = n.scrollParent[0].scrollLeft + i.scrollSpeed : t.pageX - n.overflowOffset.left < i.scrollSensitivity && (n.scrollParent[0].scrollLeft = r = n.scrollParent[0].scrollLeft - i.scrollSpeed))) : (i.axis && "x" === i.axis || (t.pageY - e(document).scrollTop() < i.scrollSensitivity ? r = e(document).scrollTop(e(document).scrollTop() - i.scrollSpeed) : e(window).height() - (t.pageY - e(document).scrollTop()) < i.scrollSensitivity && (r = e(document).scrollTop(e(document).scrollTop() + i.scrollSpeed))), i.axis && "y" === i.axis || (t.pageX - e(document).scrollLeft() < i.scrollSensitivity ? r = e(document).scrollLeft(e(document).scrollLeft() - i.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < i.scrollSensitivity && (r = e(document).scrollLeft(e(document).scrollLeft() + i.scrollSpeed)))), r !== !1 && e.ui.ddmanager && !i.dropBehaviour && e.ui.ddmanager.prepareOffsets(n, t)
    }
  }), e.ui.plugin.add("draggable", "snap", {
    start: function () {
      var t = e(this).data("ui-draggable"), n = t.options;
      t.snapElements = [], e(n.snap.constructor !== String ? n.snap.items || ":data(ui-draggable)" : n.snap).each(function () {
        var n = e(this), i = n.offset();
        this !== t.element[0] && t.snapElements.push({
          item: this,
          width: n.outerWidth(),
          height: n.outerHeight(),
          top: i.top,
          left: i.left
        })
      })
    }, drag: function (t, n) {
      var i, r, a, o, s, c, l, u, p, d, f = e(this).data("ui-draggable"), h = f.options, m = h.snapTolerance, g = n.offset.left, v = g + f.helperProportions.width, y = n.offset.top, b = y + f.helperProportions.height;
      for (p = f.snapElements.length - 1; p >= 0; p--)s = f.snapElements[p].left, c = s + f.snapElements[p].width, l = f.snapElements[p].top, u = l + f.snapElements[p].height, s - m > v || g > c + m || l - m > b || y > u + m || !e.contains(f.snapElements[p].item.ownerDocument, f.snapElements[p].item) ? (f.snapElements[p].snapping && f.options.snap.release && f.options.snap.release.call(f.element, t, e.extend(f._uiHash(), {snapItem: f.snapElements[p].item})), f.snapElements[p].snapping = !1) : ("inner" !== h.snapMode && (i = Math.abs(l - b) <= m, r = Math.abs(u - y) <= m, a = Math.abs(s - v) <= m, o = Math.abs(c - g) <= m, i && (n.position.top = f._convertPositionTo("relative", {
          top: l - f.helperProportions.height,
          left: 0
        }).top - f.margins.top), r && (n.position.top = f._convertPositionTo("relative", {
          top: u,
          left: 0
        }).top - f.margins.top), a && (n.position.left = f._convertPositionTo("relative", {
          top: 0,
          left: s - f.helperProportions.width
        }).left - f.margins.left), o && (n.position.left = f._convertPositionTo("relative", {
          top: 0,
          left: c
        }).left - f.margins.left)), d = i || r || a || o, "outer" !== h.snapMode && (i = Math.abs(l - y) <= m, r = Math.abs(u - b) <= m, a = Math.abs(s - g) <= m, o = Math.abs(c - v) <= m, i && (n.position.top = f._convertPositionTo("relative", {
          top: l,
          left: 0
        }).top - f.margins.top), r && (n.position.top = f._convertPositionTo("relative", {
          top: u - f.helperProportions.height,
          left: 0
        }).top - f.margins.top), a && (n.position.left = f._convertPositionTo("relative", {
          top: 0,
          left: s
        }).left - f.margins.left), o && (n.position.left = f._convertPositionTo("relative", {
          top: 0,
          left: c - f.helperProportions.width
        }).left - f.margins.left)), !f.snapElements[p].snapping && (i || r || a || o || d) && f.options.snap.snap && f.options.snap.snap.call(f.element, t, e.extend(f._uiHash(), {snapItem: f.snapElements[p].item})), f.snapElements[p].snapping = i || r || a || o || d)
    }
  }), e.ui.plugin.add("draggable", "stack", {
    start: function () {
      var t, n = this.data("ui-draggable").options, i = e.makeArray(e(n.stack)).sort(function (t, n) {
        return (parseInt(e(t).css("zIndex"), 10) || 0) - (parseInt(e(n).css("zIndex"), 10) || 0)
      });
      i.length && (t = parseInt(e(i[0]).css("zIndex"), 10) || 0, e(i).each(function (n) {
        e(this).css("zIndex", t + n)
      }), this.css("zIndex", t + i.length))
    }
  }), e.ui.plugin.add("draggable", "zIndex", {
    start: function (t, n) {
      var i = e(n.helper), r = e(this).data("ui-draggable").options;
      i.css("zIndex") && (r._zIndex = i.css("zIndex")), i.css("zIndex", r.zIndex)
    }, stop: function (t, n) {
      var i = e(this).data("ui-draggable").options;
      i._zIndex && e(n.helper).css("zIndex", i._zIndex)
    }
  })
}(jQuery), define("jquery-ui-draggable", function () {
}), define("directives/sidebarContainer", ["jquery", "jquery-ui-draggable"], function (e) {
  "use strict";
  return function () {
    return {
      restrict: "CA", link: function (t, n, i) {
        function r(e) {
          e ? (m.hide(), h.css("display", "block")) : (h.hide(), m.css("display", "block")), localStorage && localStorage.setItem("ctnCollapsableParent:collapsed:" + s, e ? "yes" : "no")
        }

        function a() {
          function n(e) {
            var t = {};
            return t[l] = e, t
          }

          function i(e) {
            var t = {};
            return t[g] = e, t
          }

          function a() {
            var e = c[g](), t = c.position();
            "left" === l || "top" === l ? f.css(v, e) : f.css(v, t[v])
          }

          var g = u ? "width" : "height", v = u ? "left" : "top", y = u ? "x" : "y";
          f.addClass(u ? "vertical" : "horizontal");
          var b = c[g]();
          if (localStorage) {
            var w = localStorage.getItem("ctnCollapsableParent:size:" + s);
            b = null !== w ? w : b
          }
          "yes" === p ? (c.css(g, 0), d.css(l, "6px")) : (c.css(g, b), d.css(l, b + "px")), e(f).draggable({
            axis: y,
            containment: "parent"
          }).on("drag", function () {
            var e = f.position(), t = e[l];
            "right" === l && (t = o.width() - e.left), "bottom" === l && (t = o.height() - e.top), r(10 > t), c.css(g, t), d.css(l, t + 6 + "px"), localStorage && localStorage.setItem("ctnCollapsableParent:size:" + s, t)
          }).on("dragstop", function (e) {
            t.$broadcast("resize", [e])
          }), m.click(function () {
            r(!0), f.animate(n(0)), c.animate(i(0)), d.animate(n(0))
          }), h.click(function () {
            r(!1), f.animate(n(b)), c.animate(i(b)), d.animate(n(b))
          }), e(window).on("resize", a), t.$on("$destroy", function () {
            e(window).off("resize", a)
          }), a()
        }

        var o = e(n), s = i.ctnCollapsableParent, c = e("[ctn-collapsable]", o).eq(0), l = c.attr("ctn-collapsable") || "left", u = "left" === l || "right" === l, p = localStorage ? localStorage.getItem("ctnCollapsableParent:collapsed:" + s) : "no", d = c["left" === l || "top" === l ? "next" : "prev"](), f = e('<div class="resize-handle"></div>').appendTo(o), h = d.children(".show-collapsable").addClass("expand-collapse").append('<i class="glyphicon glyphicon-chevron-right"></i>').attr("title", "Show sidebar"), m = c.children(".hide-collapsable").addClass("expand-collapse").append('<i class="glyphicon glyphicon-chevron-left"></i>').attr("title", "Hide sidebar");
        r("yes" === p), a()
      }
    }
  }
}), define("directives/stateCircle", [], function () {
  "use strict";
  return function () {
    return {
      restrict: "EAC", link: function (e, t, n) {
        function i() {
          var t = e.$eval(n.incidents), i = e.$eval(n.incidentsForTypes) || [];
          if (t && t.length > 0) {
            if (0 === i.length)return void a();
            for (var o = 0; o < t.length; o++) {
              var s = t[o];
              if (-1 != s.incidentType.indexOf(i) && s.incidentCount > 0)return void a()
            }
          }
          r()
        }

        function r() {
          t.removeClass("circle-red").addClass("circle-green")
        }

        function a() {
          t.removeClass("circle-green").addClass("circle-red")
        }

        t.addClass("circle"), e.$watch(n.incidents, function () {
          i()
        })
      }
    }
  }
}), define("text!directives/variable.html", [], function () {
  return '<div>\n  <!-- # CE - camunda-cockpit-ui/client/scripts/directives/variable.html -->\n\n  <div ng-if="isBoolean(variable)">\n    <label class="radio">\n      <input ng-model="variable.value"\n             ng-value="true"\n             type="radio"\n             name="booleanValue">\n       true\n    </label>\n\n    <label class="radio">\n      <input ng-model="variable.value"\n             ng-value="false"\n             type="radio"\n             name="booleanValue">\n       false\n    </label>\n  </div>\n\n  <input ng-if="isInteger(variable) || isShort(variable) || isLong(variable)"\n         class="form-control"\n         name="editIntegerValue"\n         type="text"\n         numeric\n         integer="true"\n         ng-model="variable.value"\n         ng-class="{\'in-place-edit\': isInPlaceEdit() }"\n         autofocus="autofocus"\n         required />\n\n  <input ng-if="isDouble(variable) || isFloat(variable)"\n         class="form-control"\n         name="editFloatValue"\n         type="text"\n         numeric\n         ng-model="variable.value"\n         ng-class="{\'in-place-edit\': isInPlaceEdit() }"\n         autofocus="autofocus"\n         required />\n\n  <input ng-if="isDate(variable)"\n         class="form-control"\n         date\n         name="editDateValue"\n         ng-model="variable.value"\n         type="text"\n         ng-class="{\'in-place-edit\': isInPlaceEdit() }"\n         autofocus="autofocus"\n         required />\n\n  <textarea ng-if="isString(variable)"\n            rows="5"\n            ng-model="variable.value"\n            class="form-control variable-type-string"\n            ng-class="{\'in-place-edit\': isInPlaceEdit() }"\n            autofocus="autofocus"\n            required></textarea>\n\n  <div ng-if="isObject(variable)">\n      <label class="control-label"\n             for="objectTypeName">Object type name*</label>\n        <input id="objectTypeName"\n               name="objectTypeName"\n               class="form-control"\n               type="text"\n               ng-model="variable.valueInfo.objectTypeName"\n               autofocus\n               required />\n      <label class="control-label"\n             for="serializationDataFormat">Serialization data format*</label>\n        <input id="serializationDataFormat"\n               name="serializationDataFormat"\n               class="form-control"\n               type="text"\n               ng-model="variable.valueInfo.serializationDataFormat"\n               required />\n      <label class="control-label"\n             for="serializedValue">Serialized value</label>\n        <textarea rows="5"\n                  ng-model="variable.value"\n                  class="form-control"\n                  ></textarea>\n  </div>\n  <!-- / CE - camunda-cockpit-ui/client/scripts/directives/variable.html -->\n</div>\n'
}), define("directives/variable", ["angular", "text!./variable.html"], function (e, t) {
  "use strict";
  var n = ["$compile", function () {
    return {
      restrict: "EAC", scope: {variable: "="}, replace: !0, template: t, link: function (e, t) {
        var n, i = void 0 !== t.attr("inline-edit"), r = !0;
        e.autofocus = !(void 0 === t.attr("autofocus"));
        e.isBoolean = function (e) {
          return "boolean" === e.type.toLowerCase()
        }, e.isInteger = function (e) {
          return "integer" === e.type.toLowerCase()
        }, e.isShort = function (e) {
          return "short" === e.type.toLowerCase()
        }, e.isLong = function (e) {
          return "long" === e.type.toLowerCase()
        }, e.isDouble = function (e) {
          return "double" === e.type.toLowerCase()
        }, e.isFloat = function (e) {
          return "float" === e.type.toLowerCase()
        }, e.isString = function (e) {
          return "string" === e.type.toLowerCase()
        }, e.isDate = function (e) {
          return "date" === e.type.toLowerCase()
        }, e.isNull = function (e) {
          return "null" === e.type.toLowerCase()
        }, e.isObject = function (e) {
          return "object" === e.type.toLowerCase()
        };
        e.isInPlaceEdit = function () {
          return i
        }, e.$watch("variable.type", function (t, i) {
          if (i !== t) {
            if ("boolean" === t.toLowerCase())return n = e.variable.value, void(e.variable.value = r);
            if ("boolean" === i.toLowerCase())return r = e.variable.value, void(e.variable.value = n);
            "null" === t.toLowerCase() && (e.variable.value = null), "object" === t.toLowerCase() && (e.variable.valueInfo = e.variable.valueInfo || {})
          }
        })
      }
    }
  }];
  return n
}), define("directives/focus", ["angular"], function () {
  "use strict";
  var e = ["$compile", function () {
    return {
      restrict: "A", link: function (e, t, n) {
        var i = n.focus;
        i && t.focus()
      }
    }
  }];
  return e
}), define("cockpit/util/routeUtil", [], function () {
  "use strict";
  function e(e, t, n) {
    var i, r = [];
    if (t && n) {
      var a = "[object Array]" === Object.prototype.toString.call(n);
      for (i in t)a && -1 === n.indexOf(i) || r.push(i + "=" + encodeURIComponent(t[i]))
    }
    return e + (r.length ? "?" + r.join("&") : "")
  }

  var t = {};
  return t.redirectToRuntime = function (t, n, i) {
    var r = n + "/runtime";
    return e(r, i, !0)
  }, t.replaceLastPathFragment = function (t, n, i, r) {
    var a = n.replace(/[^\/]*$/, t);
    return e(a, i, r)
  }, t
}), define("directives/viewPills", ["cockpit/util/routeUtil"], function (e) {
  "use strict";
  return [function () {
    var t = ["$scope", "Views", "$location", function (t, n, i) {
      var r = n.getProviders({component: t.id});
      t.providers = r;
      var a = t.isActive = function (e) {
        return -1 != i.path().indexOf("/" + e.id)
      };
      t.getUrl = function (t) {
        var n = t.id, r = i.path(), o = i.search(), s = a(t) ? !0 : t.keepSearchParams;
        return "#" + e.replaceLastPathFragment(n, r, o, s)
      }
    }];
    return {
      restrict: "EAC",
      scope: {id: "@"},
      template: '<ul class="nav nav-pills">  <li ng-repeat="provider in providers" ng-class="{ active: isActive(provider) }" class="{{ provider.id }}">    <a ng-href="{{ getUrl(provider) }}">{{ provider.label }}</a>  </li></ul>',
      replace: !0,
      controller: t
    }
  }]
}), define("directives/selectActivity", [], function () {
  "use strict";
  return function () {
    return {
      link: function (e, t) {
        var n = e.processData, i = t.attr("cam-select-activity");
        if (!n)throw new Error("No processData defined in scope");
        if (!i)throw new Error("No activity id query given in @cam-select-activity");
        t.on("click", function (t) {
          t.preventDefault(), e.$apply(function () {
            n.set("filter", {activityIds: [e.$eval(i)]})
          })
        })
      }
    }
  }
}), define("directives/selectActivityInstance", [], function () {
  "use strict";
  return function () {
    return {
      link: function (e, t) {
        var n = e.processData, i = t.attr("cam-select-activity-instance");
        if (!n)throw new Error("No processData defined in scope");
        if (!i)throw new Error("No activity instance id query given in @cam-select-activity");
        t.on("click", function (t) {
          t.preventDefault(), e.$apply(function () {
            n.set("filter", {activityInstanceIds: [e.$eval(i)]})
          })
        })
      }
    }
  }
}), define("directives/processVariable", [], function () {
  "use strict";
  return ["Variables", function (e) {
    return {
      require: "ngModel", link: function (t, n, i, r) {
        function a(t) {
          var n;
          try {
            n = e.parse(t)
          } catch (i) {
          }
          return r.$setValidity("processVariableFilter", !!n), n
        }

        r.$parsers.push(a), r.$formatters.push(e.toString)
      }
    }
  }]
}), define("directives/dynamicName", ["angular"], function () {
  "use strict";
  return ["$interpolate", "$compile", function (e, t) {
    return {
      restrict: "A", priority: 9999, terminal: !0, link: function (n, i, r) {
        i.attr("name", e(r.camDynamicName)(n)), t(i, null, 9999)(n)
      }
    }
  }]
}), define("text!directives/quick-filter.html", [], function () {
  return '<!-- # CE - src/main/webapp/app/cockpit/directives/quick-filter.html -->\n<form name="quickFilters"\n      class="quick-filters">\n  <div class="quick-filter name-filter"\n       ng-if="showNameFilter">\n    <label class="input-group">\n      <input ng-keyup="search()"\n             ng-model="name"\n             name="name"\n             type="text"\n             class="form-control" />\n      <span class="input-group-addon"\n            tooltip="Click here to clear the field value.">\n        <span class="glyphicon glyphicon-search"\n              ng-click="clearName()"></span>\n      </span>\n    </label>\n    <button class="btn btn-sm btn-link btn-control-link"\n            type="button"\n            tooltip="Filters activity instances that have the entered name.">\n      <span class="glyphicon glyphicon-question-sign"></span>\n    </button>\n  </div>\n\n  <div class="quick-filter state-filter"\n       ng-if="showStateFilter">\n    <span class="name">State</span>\n\n    <ul class="list-inline">\n      <li>\n        <label class="btn btn-default btn-xs running"\n               tooltip="Running Activity Instance"\n               tooltip-placement="bottom">\n          <span class="glyphicon glyphicon-adjust"></span>\n          <input ng-change="search()"\n                 ng-model="running"\n                 name="running"\n                 type="checkbox" />\n        </label>\n      </li>\n\n      <li>\n        <label class="btn btn-default btn-xs completed"\n               tooltip="Completed Activity Instance"\n               tooltip-placement="bottom">\n          <span class="glyphicon glyphicon-ok-circle"></span>\n          <input ng-change="search()"\n                 ng-model="completed"\n                 name="completed"\n                 type="checkbox" />\n        </label>\n      </li>\n\n      <li>\n        <label class="btn btn-default btn-xs canceled"\n               tooltip="Canceled Activity Instance"\n               tooltip-placement="bottom">\n          <span class="glyphicon glyphicon-ban-circle"></span>\n          <input ng-change="search()"\n                 ng-model="canceled"\n                 name="canceled"\n                 type="checkbox" />\n        </label>\n      </li>\n    </ul>\n  </div>\n</form>\n<!-- / CE - src/main/webapp/app/cockpit/directives/quick-filter.html -->\n'
}), define("directives/quickFilter", ["jquery", "text!./quick-filter.html"], function (e, t) {
  "use strict";
  return function () {
    function n(t, n, i) {
      if (i.find(".selected").length)return !0;
      if ((t.canceled || t.running || t.completed) && (!t.canceled && i.hasClass("state-canceled") || !t.running && i.hasClass("state-running") || !t.completed && i.hasClass("state-completed")))return !1;
      if (!n)return !0;
      var r = new RegExp(n, "i");
      return r.test(e.trim(i.text()))
    }

    return {
      scope: {holderSelector: "@", labelSelector: "@", itemSelector: "@"},
      restrict: "A",
      template: t,
      link: function (t, i, r) {
        function a() {
          setTimeout(t.search, 200)
        }

        if (!t.holderSelector)throw new Error("A holder-selector attribute must be specified");
        if (!t.labelSelector)throw new Error("A label-selector attribute must be specified");
        if (!t.itemSelector)throw new Error("A item-selector attribute must be specified");
        t.$root.$on("instance-tree-selection-change", a), t.$root.$on("instance-diagram-selection-change", a);
        var o = e(t.holderSelector);
        t.showNameFilter = "undefined" != typeof r.nameFilter, t.showStateFilter = "undefined" != typeof r.stateFilter, t.search = function () {
          t.quickFilters && t.quickFilters.running && t.quickFilters.running.$viewValue && t.quickFilters.canceled && t.quickFilters.canceled.$viewValue && t.quickFilters.completed && t.quickFilters.completed.$viewValue && (t.quickFilters.running.$setViewValue(!1), t.quickFilters.running.$render(), t.quickFilters.canceled.$setViewValue(!1), t.quickFilters.canceled.$render(), t.quickFilters.completed.$setViewValue(!1), t.quickFilters.completed.$render());
          var i = t.showNameFilter && t.quickFilters.name ? e.trim(t.quickFilters.name.$viewValue) : "", r = {
            running: !!t.showStateFilter && !!t.quickFilters.running && !!t.quickFilters.running.$viewValue,
            canceled: !!t.showStateFilter && !!t.quickFilters.canceled && !!t.quickFilters.canceled.$viewValue,
            completed: !!t.showStateFilter && !!t.quickFilters.completed && !!t.quickFilters.completed.$viewValue
          };
          e(t.itemSelector, o).each(function () {
            var t = e(this), a = n(r, i, t);
            t[a ? "show" : "hide"]()
          })
        }, t.clearName = function () {
          t.quickFilters.name.$setViewValue(""), t.quickFilters.name.$render(), t.search()
        }
      }
    }
  }
}), define("directives/main", ["angular", "./breadcrumbs", "./numeric", "./date", "./processDiagram", "./processDiagramPreview", "./activityInstanceTree", "./sidebarContainer", "./stateCircle", "./variable", "./focus", "./viewPills", "./selectActivity", "./selectActivityInstance", "./processVariable", "./dynamicName", "./quickFilter"], function (e, t, n, i, r, a, o, s, c, l, u, p, d, f, h, m, g) {
  "use strict";
  var v = e.module("cam.cockpit.directives", []);
  return v.directive("camBreadcrumbsPanel", t), v.directive("numeric", n), v.directive("date", i), v.directive("processDiagram", r), v.directive("processDiagramPreview", a), v.directive("activityInstanceTree", o), v.directive("ctnCollapsableParent", s), v.directive("stateCircle", c), v.directive("variable", l), v.directive("focus", u), v.directive("viewPills", p), v.directive("camSelectActivity", d), v.directive("camSelectActivityInstance", f), v.directive("processVariable", h), v.directive("camDynamicName", m), v.directive("camQuickFilter", g), v
}), define("directives", ["directives/main"], function (e) {
  return e
}), define("filters/shorten", [], function () {
  "use strict";
  var e = function () {
    return function (e, t) {
      return e.length > t ? e.substring(0, t) + "..." : e
    }
  };
  return e
}), define("filters/abbreviateNumber", [], function () {
  var e = function () {
    function e(e, t) {
      t = Math.pow(10, t);
      for (var n = ["k", "m", "b", "t"], i = n.length - 1; i >= 0; i--) {
        var r = Math.pow(10, 3 * (i + 1));
        if (e >= r)return e = Math.round(e * t / r) / t, 1e3 == e && i < n.length - 1 && (e = 1, i++), e += n[i]
      }
      return e
    }

    return function (t, n) {
      return t ? 950 > t ? t : (n || (n = 1), e(t, n)) : void 0
    }
  };
  return e
}), define("filters/duration", [], function () {
  "use strict";
  var e = function () {
    function e(e, t, n) {
      if (e) {
        var i = [];
        i.push(e), i.push(1 === e ? t : t + "s"), n.push(i.join(" "))
      }
    }

    return function (t) {
      if (t) {
        var n = t / 1e3, i = Math.floor(n % 60);
        n /= 60;
        var r = Math.floor(n % 60);
        n /= 60;
        var a = Math.floor(n % 24);
        n /= 24;
        var o = Math.floor(n), s = [];
        return e(o, "day", s), e(a, "hour", s), e(r, "minute", s), e(i, "second", s), s.join(", ")
      }
    }
  };
  return e
}), define("filters/main", ["angular", "./shorten", "./abbreviateNumber", "./duration"], function (e, t, n, i) {
  "use strict";
  var r = e.module("cam.cockpit.filters", []);
  return r.filter("shorten", t), r.filter("abbreviateNumber", n), r.filter("duration", i), r
}), define("filters", ["filters/main"], function (e) {
  return e
}), define("text!pages/dashboard.html", [], function () {
  return '<!-- # CE - camunda-cockpit-ui/client/scripts/pages/dashboard.html -->\n<div class="ctn-view">\n\n  <div ng-repeat="dashboardProvider in dashboardProviders"\n       class="dashboard-view">\n    <view vars="dashboardVars"\n          provider="dashboardProvider"></view>\n  </div>\n\n</div><!-- end .ctn-view -->\n<!-- / CE - camunda-cockpit-ui/client/scripts/pages/dashboard.html -->\n'
}), define("pages/dashboard", ["angular", "text!./dashboard.html"], function (e, t) {
  "use strict";
  var n = ["$scope", "$rootScope", "Views", "Data", "dataDepend", "page", function (e, t, n, i, r, a) {
    var o = e.processData = r.create(e);
    e.dashboardVars = {read: ["processData"]}, e.dashboardProviders = n.getProviders({component: "cockpit.dashboard"}), i.instantiateProviders("cockpit.dashboard.data", {
      $scope: e,
      processData: o
    });
    for (var s = n.getProviders({component: "cockpit.dashboard"}), c = {
      $scope: e,
      processData: o
    }, l = 0; l < s.length; l++)"function" == typeof s[l].initialize && s[l].initialize(c);
    t.showBreadcrumbs = !1, a.breadcrumbsClear(), a.titleSet(["camunda Cockpit", "Dashboard"].join(" | "))
  }], i = ["$routeProvider", function (e) {
    e.when("/dashboard", {template: t, controller: n, authentication: "required", reloadOnSearch: !1})
  }];
  return i
}), function (e) {
  function t(e) {
    function t(e) {
      return r(e) ? e : [e]
    }

    function n(e) {
      return Array.prototype.slice.apply(e)
    }

    var i = e.module("dataDepend", []), r = e.isArray, a = e.isFunction, o = (e.isObject, e.forEach), s = (e.extend, ["$rootScope", "$injector", "$q", function (i, s, c) {
      function l(i, s) {
        function l(e) {
          function t(t) {
            var n = i[t];
            return n || e && (n = e.get(t)), n
          }

          function n(e, n) {
            if (t(e))throw new Error("[dataDepend] provider with key " + e + " already registered");
            i[e] = n
          }

          var i = {};
          return {local: i, get: t, put: n}
        }

        function u() {
          return f++
        }

        function p(t) {
          function i(e) {
            var t = N.value;
            N.$loaded = !0, delete N.$error, P = !1, t !== e && (N.value = e, x("setLoaded", t, " -> ", e), h())
          }

          function l(e) {
            var t = k[e];
            return t || (k[e] = t = {}), t
          }

          function u() {
            N.$loaded = !1, M = !1
          }

          function p(e) {
            var t = S.get(e);
            if (!t)throw new Error("[dataDepend] No provider for " + e);
            return t
          }

          function d(e) {
            o(I, e)
          }

          function f(e) {
            o(A, e)
          }

          function h() {
            d(function (e) {
              e.parentChanged()
            })
          }

          function m() {
            function e(e, t) {
              var n = l(e), i = n.value;
              x("resolveDependencies", e, ":", i, "->", t), i !== t && (x("resolveDependencies", "changed"), n.value = t, P = !0)
            }

            var t = [];
            return f(function (n) {
              var i = p(n), r = i.resolve().then(function (t) {
                return e(n, t), t
              }, function (e) {
                throw new Error("<" + n + "> <- " + e.message)
              });
              t.push(r)
            }), c.all(t).then(function () {
              var t = [];
              return f(function (n) {
                var i = p(n).get();
                e(n, i), t.push(i)
              }), t
            })
          }

          function g(e) {
            u(), x("asyncLoad: init load");
            var t = m().then(function (n) {
              if (x("asyncLoad dependencies resolved", n), R !== t)return x("asyncLoad: skip (new load request)"), R;
              var i = y();
              if (C && (P || e || 0 == n.length)) {
                x("asyncLoad: call factory");
                try {
                  i = C.apply(C, n)
                } catch (r) {
                  throw new Error("unresolvable: " + r.message)
                }
              }
              return i
            }).then(function (e) {
              return R !== t ? (x("asyncLoad: skip (new load request)"), R) : (x("asyncLoad: load complete"), R = null, i(e), e)
            }, function (e) {
              if (R !== t)return x("asyncLoad: skip (new load request)"), R;
              throw x("asyncLoad: load error"), R = null, N.$error = e, P = !1, e
            });
            return t
          }

          function v() {
            return x("parentChanged START"), R ? void x("parentChanged SKIP (loading)") : (M = !0, D && (x("parentChanged RESOLVE async"), s(function () {
              x("parentChanged RESOLVE"), b()
            })), void h())
          }

          function y() {
            return N.value
          }

          function b(e) {
            e = e || {};
            var t = e.reload;
            return (M || t) && (R = g(t)), R ? (x("resolve: load async"), R) : (x("resolve: load sync"), c.when(y()))
          }

          function w(e) {
            if (C)throw new Error("[dataDepend] Cannot set value, was using factory");
            if (a(e))throw new Error("[dataDepend] Cannot refine static value using factory function");
            i(e)
          }

          function x() {
          }

          function E(t) {
            function i(e) {
              return e ? e[s] : e
            }

            function a() {
              var e = n(arguments);
              return l.apply(null, e).then(i)
            }

            function o() {
              var e = n(arguments);
              return i(c.apply(null, e))
            }

            if (!r(O.produces))throw new Error("[dataDepend] Provider does not produce multiple values");
            var s = O.produces.indexOf(t), c = O.get, l = O.resolve, u = e.extend({}, O, {resolve: a, get: o});
            return u
          }

          function _() {
            f(function (e) {
              var t = p(e), n = t.children, i = n.indexOf(O);
              -1 !== i && n.splice(i, 1)
            })
          }

          t = t || {};
          var T = t.produces, S = t.registry, A = t.dependencies || [], C = t.factory, D = t.eager || !1, k = {}, I = [], P = !0, M = !0, R = null, N = {$loaded: !1}, O = {
            produces: T,
            data: N,
            get: y,
            set: w,
            resolve: b,
            children: I,
            filter: E,
            destroy: _,
            parentChanged: v
          };
          f(function (e) {
            p(e).children.push(O)
          }), D && (x("resolve async"), s(function () {
            x("resolve"), b()
          })), C || i(t.value);
          var $ = {
            reload: function () {
              b({reload: !0})
            }
          };
          return e.extend(N, $), O
        }

        function d(e, n) {
          function s(e, n) {
            var o = "provider$" + u();
            if (n ? e = t(e) : (n = e, e = i(n), r(n) && (n = n[n.length - 1])), !a(n))throw new Error('[dataDepend] Must provide callback as second parameter or use [ "A", "B", function(a, b) { } ] notation');
            var s = c({produces: o, factory: n, dependencies: e, eager: !0, registry: b});
            return s.data
          }

          function c(e) {
            var t, n = e.produces;
            if (!n)throw new Error("[dataDepend] Must provide produces when creating new provider");
            return t = p(e), r(n) ? o(n, function (e) {
              b.put(e, t.filter(e))
            }) : b.put(n, t), t
          }

          function f(t, n) {
            n = n || t;
            var i = t + ":old";
            h(t, e.$eval(n)), h(i, null);
            var r = b.get(t), a = b.get(i);
            return e.$watch(n, function (e, t) {
              e !== t && (r.set(e), a.set(t))
            }), r.data
          }

          function h(e, t) {
            var n, o, s;
            if (b.get(e))throw new Error("[dataDepend] provider for " + e + " already registered");
            return (a(t) || r(t) && a(t[t.length - 1])) && (n = t, o = i(n), t = void 0, r(n) && (n = n[n.length - 1])), s = c({
              produces: e,
              factory: n,
              value: t,
              dependencies: o,
              registry: b
            }), s.data
          }

          function m(e, t) {
            if ("string" != typeof e)throw new Error("[dataDepend] expected name to be a string, got " + e);
            var n = b.get(e);
            if (!n)throw new Error("[dataDepend] no provider with name " + e);
            n.set(t)
          }

          function g(e) {
            var t = b.get(e);
            if (!t)throw new Error('[dataDepend] Provider "' + e + '" does not exists');
            t.resolve({reload: !0})
          }

          function v() {
            var e = b.local;
            o(e, function (e) {
              e.destroy()
            })
          }

          function y(e) {
            return d(e, b)
          }

          var b = l(n);
          return e.$on("$destroy", v), {
            $providers: b,
            observe: s,
            provide: h,
            set: m,
            changed: g,
            watchScope: f,
            newChild: y
          }
        }

        var f = 0;
        return {create: d}
      }

      return l(s.annotate, function (e) {
        i.$evalAsync(e)
      })
    }]);
    return i.factory("dataDepend", s), i
  }

  if ("function" == typeof define && define.amd)define("angular-data-depend", ["angular"], function (e) {
    return t(e)
  }); else {
    if (void 0 === typeof e)throw new Error("[dataDepend] Failed to bind: AngularJS not available on window or via AMD");
    t(e)
  }
}(angular), function (e, t) {
  "use strict";
  function n() {
    function e(e, n) {
      return t.extend(new (t.extend(function () {
      }, {prototype: e})), n)
    }

    function n(e, t) {
      var n = t.caseInsensitiveMatch, i = {originalPath: e, regexp: e}, r = i.keys = [];
      return e = e.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function (e, t, n, i) {
        var a = "?" === i ? i : null, o = "*" === i ? i : null;
        return r.push({
          name: n,
          optional: !!a
        }), t = t || "", "" + (a ? "" : t) + "(?:" + (a ? t : "") + (o && "(.+?)" || "([^/]+)") + (a || "") + ")" + (a || "")
      }).replace(/([\/$\*])/g, "\\$1"), i.regexp = new RegExp("^" + e + "$", n ? "i" : ""), i
    }

    var i = {};
    this.when = function (e, r) {
      if (i[e] = t.extend({reloadOnSearch: !0}, r, e && n(e, r)), e) {
        var a = "/" == e[e.length - 1] ? e.substr(0, e.length - 1) : e + "/";
        i[a] = t.extend({redirectTo: e}, n(a, r))
      }
      return this
    }, this.otherwise = function (e) {
      return this.when(null, e), this
    }, this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$http", "$templateCache", "$sce", function (n, r, a, o, s, c, l, u) {
      function p(e, t) {
        var n = t.keys, i = {};
        if (!t.regexp)return null;
        var r = t.regexp.exec(e);
        if (!r)return null;
        for (var a = 1, o = r.length; o > a; ++a) {
          var s = n[a - 1], c = "string" == typeof r[a] ? decodeURIComponent(r[a]) : r[a];
          s && c && (i[s.name] = c)
        }
        return i
      }

      function d() {
        var e = f(), i = g.current;
        e && i && e.$$route === i.$$route && t.equals(e.pathParams, i.pathParams) && !e.reloadOnSearch && !m ? (i.params = e.params, t.copy(i.params, a), n.$broadcast("$routeUpdate", i)) : (e || i) && (m = !1, n.$broadcast("$routeChangeStart", e, i), g.current = e, e && e.redirectTo && (t.isString(e.redirectTo) ? r.path(h(e.redirectTo, e.params)).search(e.params).replace() : r.url(e.redirectTo(e.pathParams, r.path(), r.search())).replace()), o.when(e).then(function () {
          if (e) {
            var n, i, r = t.extend({}, e.resolve);
            return t.forEach(r, function (e, n) {
              r[n] = t.isString(e) ? s.get(e) : s.invoke(e)
            }), t.isDefined(n = e.template) ? t.isFunction(n) && (n = n(e.params)) : t.isDefined(i = e.templateUrl) && (t.isFunction(i) && (i = i(e.params)), i = u.getTrustedResourceUrl(i), t.isDefined(i) && (e.loadedTemplateUrl = i, n = c.get(i, {cache: l}).then(function (e) {
              return e.data
            }))), t.isDefined(n) && (r.$template = n), o.all(r)
          }
        }).then(function (r) {
          e == g.current && (e && (e.locals = r, t.copy(e.params, a)), n.$broadcast("$routeChangeSuccess", e, i))
        }, function (t) {
          e == g.current && n.$broadcast("$routeChangeError", e, i, t)
        }))
      }

      function f() {
        var n, a;
        return t.forEach(i, function (i) {
          !a && (n = p(r.path(), i)) && (a = e(i, {params: t.extend({}, r.search(), n), pathParams: n}), a.$$route = i)
        }), a || i[null] && e(i[null], {params: {}, pathParams: {}})
      }

      function h(e, n) {
        var i = [];
        return t.forEach((e || "").split(":"), function (e, t) {
          if (0 === t)i.push(e); else {
            var r = e.match(/(\w+)(.*)/), a = r[1];
            i.push(n[a]), i.push(r[2] || ""), delete n[a]
          }
        }), i.join("")
      }

      var m = !1, g = {
        routes: i, reload: function () {
          m = !0, n.$evalAsync(d)
        }
      };
      return n.$on("$locationChangeSuccess", d), g
    }]
  }

  function i() {
    this.$get = function () {
      return {}
    }
  }

  function r(e, n, i) {
    return {
      restrict: "ECA", terminal: !0, priority: 400, transclude: "element", link: function (r, a, o, s, c) {
        function l() {
          f && (f.remove(), f = null), p && (p.$destroy(), p = null), d && (i.leave(d, function () {
            f = null
          }), f = d, d = null)
        }

        function u() {
          var o = e.current && e.current.locals, s = o && o.$template;
          if (t.isDefined(s)) {
            var u = r.$new(), f = e.current, g = c(u, function (e) {
              i.enter(e, null, d || a, function () {
                !t.isDefined(h) || h && !r.$eval(h) || n()
              }), l()
            });
            d = g, p = f.scope = u, p.$emit("$viewContentLoaded"), p.$eval(m)
          } else l()
        }

        var p, d, f, h = o.autoscroll, m = o.onload || "";
        r.$on("$routeChangeSuccess", u), u()
      }
    }
  }

  function a(e, t, n) {
    return {
      restrict: "ECA", priority: -400, link: function (i, r) {
        var a = n.current, o = a.locals;
        r.html(o.$template);
        var s = e(r.contents());
        if (a.controller) {
          o.$scope = i;
          var c = t(a.controller, o);
          a.controllerAs && (i[a.controllerAs] = c), r.data("$ngControllerController", c), r.children().data("$ngControllerController", c)
        }
        s(i)
      }
    }
  }

  var o = t.module("ngRoute", ["ng"]).provider("$route", n);
  o.provider("$routeParams", i), o.directive("ngView", r), o.directive("ngView", a), r.$inject = ["$route", "$anchorScroll", "$animate"], a.$inject = ["$compile", "$controller", "$route"]
}(window, window.angular), define("angular-route", function () {
}), define("camunda-commons-ui/util/uriFilter", [], function () {
  "use strict";
  var e = ["Uri", function (e) {
    return function (t) {
      return e.appUri(t)
    }
  }];
  return e
}), define("camunda-commons-ui/util/uriProvider", ["angular"], function (e) {
  "use strict";
  return function () {
    var t = /[\w]+:\/\/|:[\w]+/g, n = {};
    this.replace = function (e, t) {
      n[e] = t
    }, this.$get = ["$injector", function (i) {
      return {
        appUri: function (r) {
          var a = r.replace(t, function (t) {
            var r = n[t];
            return void 0 === r ? t : ((e.isFunction(r) || e.isArray(r)) && (r = i.invoke(r)), r)
          });
          return a
        }
      }
    }]
  }
}), define("camunda-commons-ui/util/notifications", ["angular"], function (e) {
  "use strict";
  return ["$filter", "$timeout", function (t, n) {
    return {
      notifications: [], consumers: [], addError: function (e) {
        e.type || (e.type = "danger"), this.add(e)
      }, addMessage: function (e) {
        e.type || (e.type = "info"), this.add(e)
      }, add: function (t) {
        var i = this, r = this.notifications, a = this.consumers, o = t.exclusive;
        if (o)if ("boolean" == typeof o)this.clearAll(); else {
          var s = {};
          e.forEach(o, function (e) {
            s[e] = t[e]
          }), i.clear(s)
        }
        r.push(t);
        for (var c, l = a.length - 1; (c = a[l]) && !c.add(t); l--);
        t.duration && n(function () {
          t.scope && delete t.scope, i.clear(t)
        }, t.duration), t.scope && t.scope.$on("$destroy", function () {
          delete t.scope, i.clear(t)
        })
      }, clear: function (n) {
        var i = this.notifications, r = this.consumers, a = [];
        "string" == typeof n && (n = {status: n}), a = t("filter")(i, n), a.push(n), e.forEach(a, function (t) {
          var n = i.indexOf(t);
          -1 != n && i.splice(n, 1), e.forEach(r, function (e) {
            e.remove(t)
          })
        })
      }, clearAll: function () {
        for (var e = this.notifications; e.length;) {
          var t = e.pop();
          this.clear(t)
        }
      }, registerConsumer: function (e) {
        this.consumers.push(e)
      }, unregisterConsumer: function (e) {
        var t = this.consumers, n = t.indexOf(e);
        -1 != n && t.splice(n, 1)
      }
    }
  }]
}), define("camunda-commons-ui/util/index", ["angular", "./uriFilter", "./uriProvider", "./notifications"], function (e, t, n, i) {
  "use strict";
  return e.module("cam.commons.util", []).filter("uri", t).provider("Uri", n).service("Notifications", i)
}), define("camunda-commons-ui/util", ["camunda-commons-ui/util/index"], function (e) {
  return e
}), define("text!camunda-commons-ui/auth/page/login.html", [], function () {
  return '<!-- # CE - camunda-commons-ui/lib/auth/page/login.html -->\n<div class="form-signin-container">\n  <form class="form-signin"\n        ng-submit="login()"\n        name="signinForm"\n        request-aware>\n    <h2 class="form-signin-heading">Please sign in</h2>\n\n    <div notifications-panel\n         class="notifications-panel"></div>\n\n    <input autofocus\n           tabindex="1"\n           type="text"\n           class="form-control"\n           placeholder="Username"\n           auto-fill ng-model="username" />\n    <input tabindex="2"\n           type="password"\n           class="form-control"\n           placeholder="Password"\n           auto-fill\n           ng-model="password" />\n    <button tabindex="3"\n            class="btn btn-lg btn-primary"\n            type="submit">Sign in</button>\n  </form>\n</div>\n<!-- / CE - camunda-commons-ui/lib/auth/page/login.html -->\n'
}), define("camunda-commons-ui/auth/page/login", ["angular", "text!./login.html"], function (e, t) {
  "use strict";
  var n = e.element, i = ["$scope", "$rootScope", "AuthenticationService", "Notifications", "$location", function (e, t, i, r, a) {
    if (t.authentication)return a.path("/");
    t.showBreadcrumbs = !1;
    var o = n('form[name="signinForm"] [autofocus]')[0];
    o && o.focus(), e.login = function () {
      i.login(e.username, e.password).then(function () {
        r.clearAll()
      })["catch"](function () {
        r.addError({
          status: "Login Failed",
          message: "Wrong credentials or missing access rights to application",
          scope: e
        })
      })
    }
  }];
  return ["$routeProvider", function (e) {
    e.when("/login", {template: t, controller: i})
  }]
}), define("camunda-commons-ui/auth/directives/camIfLoggedIn", [], function () {
  "use strict";
  return ["$animate", "$rootScope", function (e, t) {
    return {
      transclude: "element", priority: 1e3, terminal: !0, restrict: "A", compile: function (n, i, r) {
        return function (n, i) {
          function a(t) {
            o && (e.leave(o), o = void 0), s && (s.$destroy(), s = void 0), t && (s = n.$new(), r(s, function (t) {
              o = t, e.enter(t, i.parent(), i)
            }))
          }

          var o, s;
          n.$on("authentication.changed", function (e, t) {
            a(t)
          }), a(t.authentication)
        }
      }
    }
  }]
}), define("camunda-commons-ui/auth/directives/camIfLoggedOut", [], function () {
  "use strict";
  return ["$animate", "$rootScope", function (e, t) {
    return {
      transclude: "element", priority: 1e3, terminal: !0, restrict: "A", compile: function (n, i, r) {
        return function (n, i) {
          function a(t) {
            o && (e.leave(o), o = void 0), s && (s.$destroy(), s = void 0), t && (s = n.$new(), r(s, function (t) {
              o = t, e.enter(t, i.parent(), i)
            }))
          }

          var o, s;
          n.$on("authentication.changed", function (e, t) {
            a(!t)
          }), a(!t.authentication)
        }
      }
    }
  }]
}), define("camunda-commons-ui/auth/util/authentication", ["angular"], function (e) {
  "use strict";
  function t(t) {
    e.extend(this, t)
  }

  return t.prototype.canAccess = function (e) {
    return this.authorizedApps && -1 !== this.authorizedApps.indexOf(e)
  }, t
}), define("camunda-commons-ui/auth/service/authenticationService", ["require", "angular", "jquery", "../util/authentication"], function (e) {
  "use strict";
  var t = e("jquery"), n = e("../util/authentication");
  return ["$rootScope", "$q", "$http", "Uri", function (e, i, r, a) {
    function o(t, n, i) {
      e.$broadcast(t, n, i)
    }

    function s(e) {
      if (200 !== e.status)return i.reject(e);
      var t = e.data;
      return new n({name: t.userId, authorizedApps: t.authorizedApps})
    }

    function c(t) {
      e.authentication = t, o("authentication.changed", t)
    }

    this.updateAuthentication = c, this.login = function (e, n) {
      function l(e) {
        return c(e), o("authentication.login.success", e), e
      }

      function u(e) {
        return o("authentication.login.failure", e), i.reject(e)
      }

      var p = t.param({username: e, password: n});
      return r({
        method: "POST",
        url: a.appUri("admin://auth/user/:engine/login/:appName"),
        data: p,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
      }).then(s).then(l, u)
    }, this.logout = function () {
      function e(e) {
        c(null), o("authentication.logout.success", e)
      }

      function t(e) {
        return o("authentication.logout.failure", e), i.reject(e)
      }

      return r.post(a.appUri("admin://auth/user/:engine/logout")).then(e, t)
    };
    var l;
    e.$on("authentication.changed", function (e, t) {
      l = i[t ? "when" : "reject"](t)
    }), this.getAuthentication = function () {
      function t(e) {
        return c(e), e
      }

      return l || (l = e.authentication ? i.when(e.authentication) : r.get(a.appUri("admin://auth/user/:engine")).then(s).then(t)), l
    }, e.$on("$routeChangeStart", function (e, t) {
      t.authentication && (t.resolve || (t.resolve = {}), t.resolve.authentication || (t.resolve.authentication = ["AuthenticationService", function (e) {
        return e.getAuthentication()["catch"](function (e) {
          return "optional" === t.authentication ? null : (o("authentication.login.required", t), i.reject(e))
        })
      }]))
    })
  }]
}), define("camunda-commons-ui/auth/index", ["angular", "angular-route", "../util/index", "./page/login", "./directives/camIfLoggedIn", "./directives/camIfLoggedOut", "./service/authenticationService"], function (e, t, n, i, r, a, o) {
  "use strict";
  var s = e.module("cam.commons.auth", [e.module("ngRoute").name, n.name]);
  return s.config(i).run(["$rootScope", "$location", function (e, t) {
    var n;
    e.$on("authentication.login.required", function (i) {
      e.$evalAsync(function () {
        var e = t.url();
        "/login" === e || i.defaultPrevented || (n = e, t.url("/login"))
      })
    }), e.$on("authentication.login.success", function (i) {
      e.$evalAsync(function () {
        i.defaultPrevented || (t.url(n || "/").replace(), n = null)
      })
    })
  }]).run(["$cacheFactory", "$rootScope", "$location", function (e, t, n) {
    t.$on("authentication.logout.success", function (i) {
      t.$evalAsync(function () {
        i.defaultPrevented || (e.get("$http").removeAll(), n.url("/"))
      })
    })
  }]).run(["$rootScope", "Notifications", function (e, t) {
    e.$on("authentication.login.required", function () {
      t.addError({
        status: "Unauthorized",
        message: "Login is required to access the resource",
        http: !0,
        exclusive: ["http"]
      })
    })
  }]).run(["AuthenticationService", function () {
  }]).directive("camIfLoggedIn", r).directive("camIfLoggedOut", a).service("AuthenticationService", o), s
}), define("camunda-commons-ui/pages/index", ["angular", "angular-route"], function (e) {
  "use strict";
  function t(e) {
    var t = "camunda Login";
    -1 !== e.indexOf("/cockpit/") ? t = "camunda Cockpit" : -1 !== e.indexOf("/tasklist/") ? t = "camunda Tasklist" : -1 !== e.indexOf("/admin/") && (t = "camunda Admin"), n("head title").text(t)
  }

  var n = e.element, i = e.module("camunda.common.pages", ["ngRoute"]), r = ["$rootScope", "$location", "Notifications", "AuthenticationService", function (e, n, i, r) {
    function a(e) {
      e.http = !0, e.exclusive = ["http"], i.addError(e)
    }

    function o(i, o) {
      var s = o.status, c = o.data;
      switch (s) {
        case 500:
          a(c && c.message ? {
            status: "Server Error",
            message: c.message,
            exceptionType: c.exceptionType
          } : {
            status: "Server Error",
            message: "The server reported an internal error. Try to refresh the page or login and out of the application."
          });
          break;
        case 0:
          a({status: "Request Timeout", message: "Your request timed out. Try to refresh the page."});
          break;
        case 401:
          -1 !== n.absUrl().indexOf("/setup/#") ? n.path("/setup") : (a({
            type: "warning",
            status: "Session ended",
            message: "Your session timed out or was ended from another browser window. Please signin again."
          }), t(n.absUrl()), r.updateAuthentication(null), e.$broadcast("authentication.login.required"));
          break;
        case 403:
          a("AuthorizationException" == c.type ? {
            status: "Access Denied",
            message: "You are unauthorized to " + c.permissionName.toLowerCase() + " " + c.resourceName.toLowerCase() + (c.resourceId ? " " + c.resourceId : "s") + "."
          } : {
            status: "Access Denied",
            message: "Executing an action has been denied by the server. Try to refresh the page."
          });
          break;
        case 404:
          a({status: "Not found", message: "A resource you requested could not be found."});
          break;
        default:
          a({
            status: "Communication Error",
            message: "The application received an unexpected " + s + " response from the server. Try to refresh the page or login and out of the application."
          })
      }
    }

    e.$on("httpError", o)
  }], a = ["$scope", "$http", "$location", "$window", "Uri", "Notifications", function (t, n, i, r, a, o) {
    var s = a.appUri(":engine"), c = {};
    n.get(a.appUri("engine://engine/")).then(function (n) {
      t.engines = n.data, e.forEach(t.engines, function (e) {
        c[e.name] = e
      }), t.currentEngine = c[s], t.currentEngine || (o.addError({
        status: "Not found",
        message: "The process engine you are trying to access does not exist",
        scope: t
      }), i.path("/"))
    }), t.$watch("currentEngine", function (e) {
      e && s !== e.name && (r.location.href = a.appUri("app://../" + e.name + "/"))
    })
  }], o = ["$scope", "$location", function (e, t) {
    e.activeClass = function (e) {
      var n = t.absUrl();
      return -1 != n.indexOf(e) ? "active" : ""
    }
  }], s = ["$scope", "$window", "$cacheFactory", "$location", "Notifications", "AuthenticationService", "Uri", function (e, t, n, i, r, a) {
    e.logout = function () {
      a.logout()
    }
  }];
  return i.run(r).controller("ProcessEngineSelectionController", a).controller("AuthenticationController", s).controller("NavigationController", o)
}), define("camunda-commons-ui/plugin/view", ["angular"], function (e) {
  "use strict";
  return function (t) {
    t.directive("view", ["$q", "$http", "$templateCache", "$anchorScroll", "$compile", "$controller", function (t, n, i, r, a, o) {
      return {
        restrict: "ECA", terminal: !0, link: function (s, c, l) {
          function u() {
            h && (h.$destroy(), h = null)
          }

          function p() {
            c.html(""), u()
          }

          function d(e) {
            var t = e.template;
            if (t)return t;
            var r = e.url;
            return n.get(r, {cache: i}).then(function (e) {
              return e.data
            })
          }

          function f() {
            var n = s.$eval(l.provider), i = s.$eval(l.vars) || {};
            return n ? void t.when(d(n)).then(function (t) {
              c.html(t), u();
              var l, p = a(c.contents()), d = {};
              h = s.$new(!0), i && (i.read && e.forEach(i.read, function (e) {
                h[e] = s[e], s.$watch(e, function (t) {
                  h[e] = t
                })
              }), i.write && e.forEach(i.write, function (e) {
                h.$watch(e, function (t) {
                  s[e] = t
                })
              })), n.controller && (d.$scope = h, l = o(n.controller, d), c.children().data("$ngControllerController", l)), p(h), h.$emit("$pluginContentLoaded"), r()
            }, function (e) {
              throw p(), e
            }) : void p()
          }

          var h;
          s.$watch(l.provider, f)
        }
      }
    }])
  }
}), define("camunda-commons-ui/plugin/service", ["angular"], function (e) {
  "use strict";
  return function (t) {
    function n(e) {
      return String.prototype.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
    }

    t._camPlugins = {};
    var i, r = [], a = e.element("base").attr("cam-exclude-plugins") || "";
    a && (e.forEach(a.split(","), function (e) {
      e = e.split(":");
      var t = "*";
      e.length >= 2 && n(e[1]) && (t = n(e.pop())), e = n(e.shift()), e && r.push(e + ":" + t)
    }), i = new RegExp("(" + r.join("|") + ")", "i"));
    var o = [function () {
      function e(e, t) {
        for (var n, i = t.priority || 0, r = 0; n = e[r]; r++)if (!n.priority || n.priority < i)return void e.splice(r, 0, t);
        e.push(t)
      }

      function n(t, n, i) {
        var r = i[t] = i[t] || [];
        e(r, n)
      }

      var r = {};
      this.registerPlugin = function (e, a, o) {
        if (t._camPlugins[a + ":" + o.id] = !1, !i || !i.test(a + ":" + o.id)) {
          t._camPlugins[a + ":" + o.id] = !0;
          var s = r[e] = r[e] || {};
          n(a, o, s)
        }
      }, this.$get = ["$filter", function (e) {
        var t = {
          getAllProviders: function (e) {
            return r[e] || {}
          }, getProviders: function (t, n) {
            if (!t)throw new Error("No type given");
            var i = n.component;
            if (!i)throw new Error("No component given");
            var a = (r[t] || {})[i];
            return n.id && (a = e("filter")(a, {id: n.id})), a || []
          }, getProvider: function (e, t) {
            var n = this.getProviders(e, t);
            return (n || [])[0]
          }
        };
        return t
      }]
    }];
    t.provider("Plugins", o);
    var s = ["PluginsProvider", function (t) {
      this.registerDefaultView = function (e, n) {
        i && i.test(e + ":" + n.id) || t.registerPlugin("view", e, n)
      }, this.registerView = function (e, n) {
        t.registerPlugin("view", e, n)
      }, this.$get = ["Uri", "Plugins", function (t, n) {
        function i(n) {
          e.forEach(n, function (n) {
            e.forEach(n, function (e) {
              e.url && (e.url = require.toUrl(t.appUri(e.url)))
            })
          })
        }

        function r() {
          a || (i(n.getAllProviders("view")), a = !0)
        }

        var a = !1, o = {
          getProviders: function (e) {
            return r(), n.getProviders("view", e)
          }, getProvider: function (e) {
            var t = this.getProviders(e);
            return (t || [])[0]
          }
        };
        return o
      }]
    }];
    t.provider("Views", s);
    var c = ["PluginsProvider", function (t) {
      this.registerData = function (e, n) {
        t.registerPlugin("data", e, n)
      }, this.$get = ["Plugins", "$injector", function (t, n) {
        var i = {
          getProviders: function (e) {
            return t.getProviders("data", e)
          }, getProvider: function (e) {
            var t = this.getProviders(e);
            return (t || [])[0]
          }, instantiateProviders: function (t, i) {
            var r = this.getProviders({component: t});
            e.forEach(r, function (e) {
              n.instantiate(e.controller, i)
            })
          }
        };
        return i
      }]
    }];
    t.provider("Data", c)
  }
}), define("camunda-commons-ui/plugin/index", ["angular", "./view", "./service"], function (e, t, n) {
  "use strict";
  var i = e.module("cockpit.plugin", []);
  return t(i), n(i), i
}), define("camunda-commons-ui/directives/email", [], function () {
  "use strict";
  return function () {
    return {
      restrict: "A", require: "ngModel", link: function (e, t, n, i) {
        var r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        i.$parsers.unshift(function (e) {
          return r.test(e) || !e ? (i.$setValidity("email", !0), e) : (i.$setValidity("email", !1), null)
        })
      }
    }
  }
}), define("text!camunda-commons-ui/directives/engineSelect.html", [], function () {
  return '<li class="dropdown engine-select"\n    ng-show="engines.length > 1 && currentEngine">\n<!-- # CE - camunda-commons-ui/lib/directives/engineSelect.html -->\n  <a href\n     class="dropdown-toggle"\n     data-toggle="dropdown">\n    <span class="glyphicon glyphicon-info-sign glyphicon glyphicon-info-sign "\n          tooltip="If you have multiple engines running you can select the process engine here. The data displayed in this application is based on the selected engine only."\n          tooltip-placement="bottom"></span>\n    {{ currentEngine.name }}\n  </a>\n  <ul class="dropdown-menu dropdown-menu-right">\n    <li ng-repeat="(id, engine) in engines">\n      <a ng-href="{{ \'app://../\' + engine.name + \'/\' | uri }}">\n        {{ engine.name }}\n      </a>\n    </li>\n  </ul>\n<!-- / CE - camunda-commons-ui/lib/directives/engineSelect.html -->\n</li>\n'
}), define("camunda-commons-ui/directives/engineSelect", ["angular", "text!./engineSelect.html"], function (e, t) {
  "use strict";
  var n = e.element, i = ["$scope", "$http", "$location", "$window", "Uri", "Notifications", function (t, n, i, r, a, o) {
    var s = a.appUri(":engine"), c = {};
    n.get(a.appUri("engine://engine/")).then(function (n) {
      t.engines = n.data, e.forEach(t.engines, function (e) {
        c[e.name] = e
      }), t.currentEngine = c[s], t.currentEngine || (o.addError({
        status: "Not found",
        message: "The process engine you are trying to access does not exist",
        scope: t
      }), i.path("/dashboard"))
    })
  }];
  return function () {
    return {
      template: t, replace: !0, controller: i, link: function (e, t, i) {
        var r;
        e.$watch(i.ngShow, function (e) {
          e && !r && (r = n('<li class="divider-vertical"></li>').insertAfter(t)), !e && r && (r.remove(), r = null)
        }), e.$on("$destroy", function () {
          r && r.remove()
        })
      }
    }
  }
}), define("camunda-commons-ui/directives/autoFill", [], function () {
  "use strict";
  return ["$interval", function (e) {
    return {
      restrict: "A", require: "ngModel", link: function (t, n, i, r) {
        var a = e(function () {
          var t = n.val();
          t !== r.$viewValue && (r.$setViewValue(t), r.$setPristine()), "function" != typeof document.contains || document.contains(n[0]) ? "function" != typeof document.contains && e.cancel(a) : e.cancel(a)
        }, 500)
      }
    }
  }]
}), define("text!camunda-commons-ui/directives/inPlaceTextField.html", [], function () {
  return '<!-- # CE - camunda-commons-ui/lib/directives/inPlaceTextField.html -->\n<div in-place-text-field-root>\n  <div ng-if="!editing">\n    {{ context[property] }}\n    <span class="edit-toggle"\n          ng-click="enter()">\n      <span class="glyphicon glyphicon-pencil"></span>\n    </span>\n  </div>\n\n  <form ng-if="editing"\n        ng-submit="submit()"\n        class="inline-edit"\n        name="inPlaceTextFieldForm"\n        novalidate\n        request-aware>\n\n    <fieldset>\n      <!-- {{ value }} -->\n      <input name="value"\n             ng-model="value"\n             type="text"\n             class="in-place-edit form-control"\n             placeholder="{{ placeholder }}"\n             autofocus\n             required>\n    </fieldset>\n\n    <div class="inline-edit-footer">\n\n      <p class="error" ng-show="error">\n        {{ error.message }}\n      </p>\n\n      <div class="btn-group">\n        <button type="submit"\n                class="btn btn-sm btn-primary"\n                ng-disabled="inPlaceTextFieldForm.$invalid">\n          <span class="glyphicon glyphicon-ok "></span>\n        </button>\n        <button type="button"\n                class="btn btn-sm btn-default"\n                ng-click="leave()">\n          <span class="glyphicon glyphicon-ban-circle"></span>\n        </button>\n      </div>\n    </div>\n\n  </form>\n</div>\n<!-- / CE - camunda-commons-ui/lib/directives/inPlaceTextField.html -->\n'
}), define("camunda-commons-ui/directives/inPlaceTextField", ["angular", "text!./inPlaceTextField.html"], function (e, t) {
  "use strict";
  return [function () {
    function n(t) {
      t.value = t.context[t.property] || t.defaultValue || null, t.enter = function () {
        t.editing = !0, t.value = t.context[t.property]
      }, t.submit = function () {
        var n = this;
        return t.context[t.property] === n.value ? void t.leave() : (t.context[t.property] = n.value, e.isFunction(t.$parent[t.submitCallback]) && t.$parent[t.submitCallback](n), void t.leave())
      }, t.leave = function () {
        t.editing = !1
      }
    }

    return {
      restrict: "E",
      scope: {
        unserializeCallback: "@unserialize",
        serializeCallback: "@serialize",
        initializeCallback: "@initialize",
        enterCallback: "@enter",
        validateCallback: "@validate",
        submitCallback: "@submit",
        successCallback: "@success",
        errorCallback: "@error",
        leaveCallback: "@leave",
        context: "=",
        property: "@",
        defaultValue: "@default"
      },
      template: t,
      link: function (e) {
        if (!e.property)throw new Error("You must specify a property of the context to be editable");
        var t = e.initializeCallback ? e.$parent[e.initializeCallback] : function (e, t) {
          t()
        };
        t(e, function () {
          n(e)
        })
      }
    }
  }]
}), define("camunda-commons-ui/directives/notificationsPanel", ["angular-sanitize"], function () {
  "use strict";
  var e = '<div class="notifications">  <div ng-repeat="notification in notifications" class="alert" ng-class="notificationClass(notification)">    <button type="button" class="close" ng-click="removeNotification(notification)">&times;</button>    <strong class="status" ng-bind-html="trustHTML(notification.status)" compile-template></strong>     <strong ng-if="notification.message">:</strong>    <span class="message" ng-bind-html="trustHTML(notification.message)" compile-template></span>  </div></div>';
  return ["Notifications", "$filter", "$sce", function (t, n, i) {
    return {
      restrict: "EA", scope: {filter: "=notificationsFilter"}, template: e, link: function (e) {
        function r(e) {
          return a ? !!n("filter")([e], a).length : !0
        }

        var a = e.filter, o = e.notifications = [], s = {
          add: function (e) {
            return r(e) ? (o.push(e), !0) : !1
          }, remove: function (e) {
            var t = o.indexOf(e);
            -1 != t && o.splice(t, 1)
          }
        };
        t.registerConsumer(s), e.removeNotification = function (e) {
          o.splice(o.indexOf(e), 1)
        }, e.notificationClass = function (e) {
          var t = ["danger", "error", "success", "warning", "info"], n = "info";
          return t.indexOf(e.type) > -1 && (n = e.type), "alert-" + n
        }, e.trustHTML = function (e) {
          return i.trustAsHtml(e)
        }, e.$on("$destroy", function () {
          t.unregisterConsumer(s)
        })
      }
    }
  }]
}), define("camunda-commons-ui/directives/password", [], function () {
  "use strict";
  return function () {
    return {
      restrict: "A", require: "ngModel", link: function (e, t, n, i) {
        i.$parsers.unshift(function (e) {
          return e && e.length >= 8 ? i.$setValidity("password", !0) : i.$setValidity("password", !1), e
        })
      }
    }
  }
}), define("camunda-commons-ui/directives/passwordRepeat", [], function () {
  "use strict";
  return function () {
    return {
      restrict: "A", require: "ngModel", link: function (e, t, n, i) {
        var r = n.passwordRepeat;
        i.$parsers.unshift(function (t) {
          var n = e.$eval(r), a = t == n;
          return i.$setValidity("passwordRepeat", a), t
        }), e.$watch(r, function (e) {
          var t = e == i.$viewValue;
          i.$setValidity("passwordRepeat", t), t || i.$setViewValue(i.$viewValue)
        })
      }
    }
  }
}), define("camunda-commons-ui/directives/requestAware", ["angular", "jquery"], function (e, t) {
  "use strict";
  return [function () {
    return {
      require: "form", link: function (e, n, i, r) {
        function a(e) {
          r.$setValidity("request", e)
        }

        function o(e) {
          var i = t(":input", n);
          e ? i.removeAttr("disabled") : i.attr("disabled", "disabled")
        }

        function s(e) {
          o(e), a(e)
        }

        r.$load = {
          start: function () {
            e.$broadcast("formLoadStarted")
          }, finish: function () {
            e.$broadcast("formLoadFinished")
          }
        }, e.$on("formLoadStarted", function () {
          s(!1)
        }), e.$on("formLoadFinished", function () {
          s(!0)
        }), "manual" != i.requestAware && (e.$on("requestStarted", function () {
          r.$load.start()
        }), e.$on("requestFinished", function () {
          r.$load.finish()
        }))
      }
    }
  }]
}), define("camunda-commons-ui/directives/showIfAuthorized", [], function () {
  "use strict";
  var e = {application: 0, user: 1, group: 2, "group membership": 3, authorization: 4}, t = function (t, n, i) {
    var r = {};
    return r.permissionName = t, r.resourceName = n, r.resourceType = e[n], i && (r.resourceId = i), r
  };
  return ["$animate", "AuthorizationResource", function (e, n) {
    return {
      transclude: "element", priority: 1e3, terminal: !0, restrict: "A", compile: function (i, r, a) {
        return function (i, o) {
          var s, c, l = r.authPermission, u = r.authResourceName, p = i.$eval(r.authResourceId);
          n.check(t(l, u, p)).$promise.then(function (t) {
            s && (e.leave(s), s = void 0), c && (c.$destroy(), c = void 0), t.authorized && (c = i.$new(), a(c, function (t) {
              s = t, e.enter(t, o.parent(), o)
            }))
          })
        }
      }
    }
  }]
}), define("camunda-commons-ui/directives/compileTemplate", [], function () {
  "use strict";
  return ["$compile", "$parse", function (e, t) {
    return {
      restrict: "A", link: function (n, i, r) {
        function a() {
          return (o(n) || "").toString()
        }

        var o = t(r.ngBindHtml);
        n.$watch(a, function () {
          e(i.contents())(n)
        })
      }
    }
  }]
}), define("camunda-commons-ui/directives/nl2br", [], function () {
  "use strict";
  return [function () {
    return {
      scope: {original: "=nl2br"}, link: function (e, t) {
        t.html((e.original || "").replace(/\n/g, "<br/>"))
      }
    }
  }]
}), define("camunda-commons-ui/directives/instantTypeahead", [], function () {
  "use strict";
  var e = "[$empty$]";
  return ["$timeout", function (t) {
    return {
      restrict: "A", require: "ngModel", link: function (n, i, r, a) {
        t(function () {
          a.$parsers.unshift(function (t) {
            var n = t ? t : e;
            return a.$viewValue = n, n
          }), a.$parsers.push(function (t) {
            return t === e ? "" : t
          }), n.instantTypeahead = function (t, n) {
            return n === e || ("" + t).toLowerCase().indexOf(("" + n).toLowerCase()) > -1
          }, i.bind("click", function () {
            i.trigger("input")
          })
        })
      }
    }
  }]
}), define("camunda-commons-ui/directives/index", ["angular", "./email", "./engineSelect", "./autoFill", "./inPlaceTextField", "./notificationsPanel", "./password", "./passwordRepeat", "./requestAware", "./showIfAuthorized", "./compileTemplate", "./nl2br", "./instantTypeahead", "../util/index", "angular-bootstrap"], function (e, t, n, i, r, a, o, s, c, l, u, p, d, f) {
  "use strict";
  var h = e.module("camunda.common.directives", ["ui.bootstrap", f.name]);
  return h.directive("email", t), h.directive("autoFill", i), h.directive("engineSelect", n), h.directive("camInPlaceTextField", r), h.directive("notificationsPanel", a), h.directive("password", o), h.directive("passwordRepeat", s), h.directive("showIfAuthorized", l), h.directive("compileTemplate", u), h.directive("nl2br", p), h.directive("instantTypeahead", d), h.config(["$modalProvider", "$tooltipProvider", function (e, t) {
    e.options = {backdrop: !0, keyboard: !0}, t.options({animation: !0, popupDelay: 100, appendToBody: !0})
  }]), h
}), define("camunda-commons-ui/resources/authorizationResource", [], function () {
  "use strict";
  return ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/authorization/:action"), {action: "@action"}, {
      check: {
        method: "GET",
        params: {action: "check"},
        cache: !0
      }, count: {method: "GET", params: {action: "count"}}, create: {method: "POST", params: {action: "create"}}
    })
  }]
}), define("camunda-commons-ui/resources/index", ["angular", "./authorizationResource"], function (e, t) {
  "use strict";
  var n = e.module("camunda.common.resources", []);
  return n.factory("AuthorizationResource", t), n
}), define("camunda-commons-ui/search/index", ["angular"], function (e) {
  "use strict";
  var t = ["$location", "$rootScope", function (t, n) {
    var i = !1;
    n.$on("$routeUpdate", function (e, t) {
      i ? i = !1 : n.$broadcast("$routeChanged", t)
    }), n.$on("$routeChangeSuccess", function () {
      i = !1
    });
    var r = function () {
      Array.prototype.slice(arguments);
      return t.search.apply(t, arguments)
    };
    return r.updateSilently = function (n) {
      var r = t.absUrl();
      e.forEach(n, function (e, n) {
        t.search(n, e)
      });
      var a = t.absUrl();
      a != r && (i = !0)
    }, r
  }], n = e.module("camunda.common.search", []);
  return n.factory("search", t), n
}), define("camunda-commons-ui/services/escape", [], function () {
  "use strict";
  return function () {
    return function (e) {
      return encodeURIComponent(e).replace(/%2F/g, "%252F").replace(/\*/g, "%2A").replace(/%5C/g, "%255C")
    }
  }
}), define("camunda-commons-ui/services/debounce", [], function () {
  "use strict";
  return ["$timeout", function (e) {
    return function (t, n) {
      var i, r = function () {
        var a = this, o = arguments;
        r.$loading = !0, i && e.cancel(i), i = e(function () {
          i = null, r.$loading = !1, t.apply(a, o)
        }, n)
      };
      return r
    }
  }]
}), define("camunda-commons-ui/services/RequestLogger", [], function () {
  "use strict";
  return ["$rootScope", function (e) {
    var t = 0;
    return {
      logStarted: function () {
        t || e.$broadcast("requestStarted"), t++
      }, logFinished: function () {
        t--, t || e.$broadcast("requestFinished")
      }
    }
  }]
}), define("camunda-commons-ui/services/ResourceResolver", [], function () {
  "use strict";
  return ["$route", "$q", "$location", "Notifications", function (e, t, n, i) {
    function r(r, a) {
      function o(e) {
        c.resolve(e)
      }

      function s(e) {
        var t, r, a = "/dashboard";
        404 === e.status ? (t = "No " + p + " with ID " + l, r = !0) : 401 === e.status ? (t = "Authentication failed. Your session might have expired, you need to login.", a = "/login") : t = "Received " + e.status + " from server.", n.path(a), r && n.replace(), i.addError({
          status: "Failed to display " + p,
          message: t,
          http: !0,
          exclusive: ["http"]
        }), c.reject(t)
      }

      var c = t.defer(), l = e.current.params[r], u = a.resolve, p = a.name || "entity", d = u(l);
      if (d.$promise.then)d = d.$promise.then(function (e) {
        o(e)
      }, s); else {
        if (!d.then)throw new Error("No promise returned by #resolve");
        d = d.then(o, s)
      }
      return c.promise
    }

    return {getByRouteParam: r}
  }]
}), define("camunda-commons-ui/services/index", ["angular", "./../util/index", "./escape", "./debounce", "./RequestLogger", "./ResourceResolver"], function (e, t, n, i, r, a) {
  "use strict";
  var o = e.module("camunda.common.services", [t.name]);
  return o.filter("escape", n), o.factory("debounce", i), o.factory("RequestLogger", r), o.factory("ResourceResolver", a), o.config(["$httpProvider", function (e) {
    e.responseInterceptors.push(["$rootScope", "$q", "RequestLogger", function (e, t, n) {
      return function (i) {
        function r(e) {
          return n.logFinished(), e
        }

        function a(i) {
          n.logFinished();
          var r = {status: parseInt(i.status), response: i, data: i.data};
          return e.$broadcast("httpError", r), t.reject(i)
        }

        return n.logStarted(), i.then(r, a)
      }
    }])
  }]), o.config(["$httpProvider", "$windowProvider", function (e, t) {
    var n = t.$get(), i = n.location.href, r = i.match(/\/app\/(\w+)\/(\w+)\//);
    if (!r)throw new Error("no process engine selected");
    e.defaults.headers.get = {"X-Authorized-Engine": r[2]}
  }]), o
}), define("text!camunda-commons-ui/widgets/inline-field/cam-widget-inline-field.html", [], function () {
  return '<span ng-show="!editing"\n      ng-click="startEditing()"\n      ng-transclude\n      class="view-value">\n</span>\n\n<span ng-if="editing && (varType === \'datetime\' || varType === \'date\' || varType === \'time\')"\n      class="preview">\n  {{ dateValue | camDate }}\n</span>\n\n<span ng-if="editing"\n      class="edit">\n\n  <input ng-if="simpleField"\n         class="form-control"\n         type="{{ varType }}"\n         ng-model="editValue"\n         ng-keydown="handleKeydown($event)"\n         placeholder="{{ placeholder }}" />\n\n  <span ng-show="varType === \'datetime\' || varType === \'date\' || varType === \'time\'"\n        class="cam-widget-inline-field field-control">\n\n    <datepicker class="datepicker"\n                ng-if="varType === \'datetime\' || varType === \'date\'"\n                type="text"\n                ng-required="true"\n                is-open="datePickerOptions.isOpen"\n                show-button-bar="false"\n\n                ng-model="dateValue"\n                ng-change="changeDate(this)" />\n\n    <timepicker class="timepicker"\n                ng-if="varType === \'datetime\' || varType === \'time\'"\n                show-meridian="false"\n\n                ng-model="dateValue"\n                ng-change="changeDate(this)" />\n  </span>\n\n  <input ng-if="varType === \'option\' && options[0].value"\n         class="form-control"\n         type="text"\n         ng-model="editValue"\n         ng-keydown="handleKeydown($event)"\n         typeahead="option as option.value for option in options | filter:$viewValue:instantTypeahead"\n         typeahead-on-select="saveSelection($item)"\n         instant-typeahead />\n  <input ng-if="varType === \'option\' && !options[0].value"\n         class="form-control"\n         type="text"\n         ng-model="editValue"\n         ng-keydown="handleKeydown($event)"\n         typeahead="option for option in options | filter:$viewValue:instantTypeahead"\n         typeahead-on-select="saveSelection($item)"\n         instant-typeahead />\n\n  <span ng-show="varType !== \'option\'"\n        class="cam-widget-inline-field btn-group">\n    <button type="button"\n            class="btn btn-xs btn-default"\n            ng-click="changeType()"\n            ng-if="flexible">\n      <span class="glyphicon"\n            ng-class="\'glyphicon-\' + (varType === \'text\' ? \'calendar\' : \'pencil\')"></span>\n    </button>\n\n    <button type="button"\n            class="btn btn-xs btn-default"\n            ng-click="applyChange($event)">\n      <span class="glyphicon glyphicon-ok"></span>\n    </button>\n\n    <button type="button"\n            class="btn btn-xs btn-default"\n            ng-click="cancelChange($event)">\n      <span class="glyphicon glyphicon-remove"></span>\n    </button>\n  </span>\n</span>\n'
}), define("camunda-commons-ui/widgets/inline-field/cam-widget-inline-field", ["text!./cam-widget-inline-field.html", "angular", "jquery"], function (e, t, n) {
  "use strict";
  return ["$timeout", "$filter", "$document", function (i, r, a) {
    return {
      scope: {
        varValue: "=value",
        varType: "@type",
        validator: "&validate",
        change: "&",
        onStart: "&onStartEditing",
        onCancel: "&onCancelEditing",
        placeholder: "@",
        options: "=?",
        allowNonOptions: "@",
        flexible: "@"
      }, template: e, link: function (e, o) {
        function s(e) {
          var t, n, i, r, a, o, s, c = E.exec(e);
          return c ? (t = parseInt(c[1] || 0, 10), n = parseInt(c[2] || 0, 10) - 1, i = parseInt(c[3] || 0, 10), r = parseInt(c[4] || 0, 10), a = parseInt(c[5] || 0, 10), o = parseInt(c[6] || 0, 10), s = parseInt(c[7] || 0, 10), new Date(t, n, i, r, a, o, s)) : void 0
        }

        function c() {
          return ["datetime", "date", "time"].indexOf(e.varType) > -1
        }

        function l() {
          return ["color", "email", "month", "number", "range", "tel", "text", "time", "url", "week"].indexOf(e.varType) > -1
        }

        function u() {
          if (e.editing = !1, e.invalid = !1, e.editValue = e.varValue, e.validator = e.validator || function () {
              }, e.onStart = e.onStart || function () {
              }, e.onCancel = e.onCancel || function () {
              }, e.change = e.change || function () {
              }, e.options = e.options || [], e.allowNonOptions = e.allowNonOptions || !1, e.flexible = e.flexible || !1, e.varType = e.varType ? e.varType : "text", e.simpleField = l(), c()) {
            var t = e.varValue, n = null;
            n = t ? s(t) : Date.now(), e.dateValue = n
          }
        }

        function p(e) {
          if (!e || !e.length)return !1;
          var t = e.parent();
          return t && t.length ? "body" === t[0].tagName.toLowerCase() : !1
        }

        function d() {
          var e = o.offset();
          v.show().css({
            left: e.left + (o.outerWidth() - v.outerWidth()),
            top: e.top - v.outerHeight()
          }), y.show().css({left: e.left, top: e.top + o.outerHeight()})
        }

        function f() {
          v = (v && v.length ? v : o.find(".btn-group")).hide(), p(v) || b.append(v), y = (y && y.length ? y : o.find(".field-control")).hide(), p(y) || b.append(y), i(d, 50)
        }

        function h(t) {
          i(function () {
            (!e.editing || t) && (v && v.remove && v.remove(), v = null, y && y.remove && y.remove(), y = null)
          }, 50)
        }

        function m(e) {
          return o[0].contains(e.target) || v && v.length && v[0].contains(e.target) || y && y.length && y[0].contains(e.target)
        }

        function g(t) {
          if (e.editing && !m(t)) {
            var i = n(t.target), r = "ng-binding text-muted";
            if (!i.hasClass(r)) {
              var a = i.children();
              a.hasClass(r) || e.$apply(e.cancelChange)
            }
          }
        }

        var v, y, b = t.element("body"), w = r("date"), x = "yyyy-MM-dd'T'HH:mm:ss", E = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:.(\d\d\d)| )?$/;
        e.editing = !1, e.$on("$locationChangeSuccess", function () {
          e.cancelChange()
        }), e.$on("$destroy", function () {
          h(!0)
        }), e.$watch("editing", function (t, n) {
          t !== n && (e.editing ? (f(), o.addClass("inline-editing")) : (h(), o.removeClass("inline-editing")))
        }), e.changeType = function () {
          e.varType = "datetime" === e.varType ? "text" : "datetime", u(), e.editing = !0, o[0].attributes.type.value = e.varType, e.simpleField = l()
        }, e.startEditing = function () {
          if (!e.editing) {
            u(), e.editing = !0, e.onStart(e);
            var t = e.editValue;
            e.editValue = "", i(function () {
              i(function () {
                o.find('[ng-model="editValue"]').trigger("input"), e.editValue = t, t && i(function () {
                  for (var e = "object" == typeof t ? t.value : t, i = o.find("li[ng-mouseenter]"), r = 0; r < i.length; r++) {
                    var a = i[r];
                    if (0 === a.innerText.indexOf(e))return void n(a).trigger("mouseenter")
                  }
                })
              })
            }), i(function () {
              n('[ng-model="editValue"]').focus(), n('[ng-model="editValue"]').select(), a.bind("click", g)
            }, 50)
          }
        }, e.applyChange = function (t, i) {
          if (e.invalid = e.validator(e), !e.invalid) {
            if (e.simpleField)e.editValue = n('[ng-model="editValue"]').val(), e.varValue = e.editValue; else if ("option" === e.varType) {
              if (-1 === e.options.indexOf(t) && !e.allowNonOptions)return void e.cancelChange();
              e.editValue = t || n('[ng-model="editValue"]').val(), e.varValue = e.editValue
            } else c() && (e.varValue = w(e.dateValue, x));
            e.$event = i, e.change(e), e.editing = !1, a.unbind("click", g)
          }
        }, e.cancelChange = function () {
          e.editing = !1, e.onCancel(e), a.unbind("click", g)
        }, e.changeDate = function (t) {
          e.editValue = e.dateValue = t.dateValue
        }, e.selectNextInlineField = function (e) {
          for (var t = n("[cam-widget-inline-field][type='text'], [cam-widget-inline-field][type='option']"), r = e * (t.length - 1); r !== !e * (t.length - 1); r += 2 * !e - 1)if (t[r] === o[0])return void i(function () {
            var a = n(t[r + 2 * !e - 1]);
            a.find(".view-value").click(), i(function () {
              a.find("input").select()
            })
          });
          i(function () {
            n(t[e * t.length - 1]).find(".view-value").click()
          })
        }, e.handleKeydown = function (t) {
          13 === t.keyCode ? (e.applyChange(e.selection, t), t.preventDefault()) : 27 === t.keyCode ? (e.cancelChange(t), t.preventDefault()) : 9 === t.keyCode && (e.applyChange(e.selection, t), e.selectNextInlineField(t.shiftKey), t.preventDefault()), e.selection = null
        }, e.selection = null, e.saveSelection = function (t) {
          e.selection = t, i(function () {
            e.selection === t && e.applyChange(t)
          })
        }
      }, transclude: !0
    }
  }]
}), define("text!camunda-commons-ui/widgets/search-pill/cam-widget-search-pill.html", [], function () {
  return '<!-- CE # camunda-commons-ui/lib/widgets/search-pill/search-pill.html -->\n<span class="search-label"\n      ng-class="{\'invalid\': !valid}">\n  <a href\n     ng-click="onDelete()"\n     tooltip-placement="top"\n     tooltip="{{ deleteText }}"\n     class="remove-search glyphicon glyphicon-remove">\n  </a>\n\n  <span class="glyphicon glyphicon-exclamation-sign valid-hide"\n        ng-if="invalidText"\n        tooltip-placement="top"\n        tooltip="{{ invalidText }}"></span>\n  <span class="glyphicon glyphicon-exclamation-sign valid-hide"\n        ng-if="!invalidText"></span>\n\n  <span cam-widget-inline-field\n        class="set-value"\n        type="option"\n        options="type.values"\n        change="changeSearch(\'type\', varValue, $event)"\n        on-start-editing="clearEditTrigger(\'type\')"\n        value="type.value">\n    <span ng-if="type.tooltip"\n          tooltip-placement="top"\n          tooltip="{{type.tooltip}}">\n      {{ type.value.value | camQueryComponent }}\n    </span>\n    <span ng-if="!type.tooltip">\n      {{ type.value.value | camQueryComponent }}\n    </span>\n  </span>\n  <span ng-if="extended">\n    :\n    <span ng-if="potentialNames.length <= 0">\n      <span ng-if="!!name.value.value">\n        <span cam-widget-inline-field\n              class="set-value"\n              type="text"\n              change="changeSearch(\'name\', varValue, $event)"\n              on-start-editing="clearEditTrigger(\'name\')"\n              value="name.value.value">\n          <span ng-if="name.tooltip"\n                tooltip-placement="top"\n                tooltip="{{name.tooltip}}">\n              {{ name.value.value | camQueryComponent }}\n          </span>\n          <span ng-if="!name.tooltip">\n              {{ name.value.value | camQueryComponent }}\n          </span>\n        </span>\n      </span>\n      <span ng-if="!name.value.value">\n        <span cam-widget-inline-field\n              class="set-value"\n              type="text"\n              change="changeSearch(\'name\', varValue, $event)"\n              on-start-editing="clearEditTrigger(\'name\')"\n              value="name.value">\n          <span ng-if="name.tooltip"\n                tooltip-placement="top"\n                tooltip="{{name.tooltip}}">\n              {{ name.value | camQueryComponent }}\n          </span>\n          <span ng-if="!name.tooltip">\n              {{ name.value | camQueryComponent }}\n          </span>\n        </span>\n      </span>\n    </span>\n    <span ng-if="potentialNames.length > 0">\n      <span cam-widget-inline-field\n            class="set-value"\n            type="option"\n            options="potentialNames"\n            allow-non-options="true"\n            change="changeSearch(\'name\', varValue, $event)"\n            on-start-editing="clearEditTrigger(\'name\')"\n            value="name.value">\n        <span ng-if="name.tooltip"\n              tooltip-placement="top"\n              tooltip="{{name.tooltip}}">\n          <span ng-if="name.value.key">\n            {{ name.value.value | camQueryComponent }}\n          </span>\n          <span ng-if="!name.value.key">\n            {{ name.value | camQueryComponent }}\n          </span>\n        </span>\n        <span ng-if="!name.tooltip">\n          <span ng-if="name.value.key">\n            {{ name.value.value | camQueryComponent }}\n          </span>\n          <span ng-if="!name.value.key">\n            {{ name.value | camQueryComponent }}\n          </span>\n        </span>\n      </span>\n    </span>\n  </span>\n\n  <span cam-widget-inline-field\n        class="set-value"\n        type="option"\n        options="operator.values"\n        change="changeSearch(\'operator\', varValue, $event)"\n        on-start-editing="clearEditTrigger(\'operator\')"\n        value="operator.value">\n    <span ng-if="operator.tooltip"\n          tooltip-placement="top"\n          tooltip="{{operator.tooltip}}">\n      {{ operator.value.value | camQueryComponent }}\n    </span>\n    <span ng-if="!operator.tooltip">\n      {{ operator.value.value | camQueryComponent }}\n    </span>\n  </span>\n\n  <span cam-widget-inline-field\n        class="set-value"\n        type="{{ valueType }}"\n        change="changeSearch(\'value\', varValue, $event)"\n        on-start-editing="clearEditTrigger(\'value\')"\n        value="value.value"\n        flexible="{{ allowDates }}">\n    <span class="visible-whitespace"\n          ng-if="value.tooltip"\n          tooltip-placement="top"\n          tooltip="{{value.tooltip}}">{{ value.value | camQueryComponent }}</span>\n    <span class="visible-whitespace"\n          ng-if="!value.tooltip">{{ value.value | camQueryComponent }}</span>\n  </span>\n</span>\n<!-- CE / camunda-commons-ui/lib/widgets/search-pill/search-pill.html -->\n'
}), define("camunda-commons-ui/widgets/search-pill/cam-widget-search-pill", ["text!./cam-widget-search-pill.html", "angular", "jquery"], function (e) {
  "use strict";
  return ["$timeout", function (t) {
    return {
      restrict: "A",
      scope: {
        valid: "=",
        extended: "=",
        allowDates: "=",
        enforceDates: "=",
        invalidText: "@",
        deleteText: "@",
        type: "=",
        name: "=",
        potentialNames: "=?",
        operator: "=",
        value: "=",
        onChange: "&",
        onDelete: "&"
      },
      link: function (e, n) {
        e.valueType = e.enforceDates ? "datetime" : "text", e.potentialNames = e.potentialNames || [], e.changeSearch = function (t, n, i) {
          var r = e[t].value;
          e[t].value = n, e[t].inEdit = !1, "function" == typeof e.onChange && e.onChange({
            field: t,
            before: r,
            value: n,
            $event: i
          })
        }, e.clearEditTrigger = function (t) {
          e[t].inEdit = !1
        }, e.$watch("allowDates", function (t) {
          t || (e.valueType = "text")
        }), e.$watch("enforceDates", function (t) {
          t && (e.valueType = "datetime")
        });
        var i = function (e) {
          t(function () {
            n.find("[cam-widget-inline-field][value='" + e + ".value']").find(".view-value").click()
          })
        };
        e.$watch("value", function (e) {
          return e && e.inEdit && i("value")
        }, !0), e.$watch("name", function (e) {
          return e && e.inEdit && i("name")
        }, !0), e.$watch("type", function (e) {
          return e && e.inEdit && i("type")
        }, !0)
      },
      template: e
    }
  }]
}), define("camunda-commons-ui/widgets/search-pill/cam-query-component", ["angular"], function () {
  "use strict";
  return ["$filter", function (e) {
    function t(e) {
      return e.match(n)
    }

    var n = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:.(\d\d\d)| )?$/, i = e("camDate");
    return function (e) {
      return e && t(e) ? i(e) : e ? e : "??"
    }
  }]
}), define("text!camunda-commons-ui/widgets/header/cam-widget-header.html", [], function () {
  return '<div class="navbar-header">\n  <button type="button"\n          class="navbar-toggle collapsed">\n    <span class="sr-only">Toggle navigation</span>\n    <span class="icon-bar"></span>\n    <span class="icon-bar"></span>\n    <span class="icon-bar"></span>\n  </button>\n\n  <a class="navbar-brand"\n     href="#/"\n     title="{{ brandName }}">\n    {{ brandName }}\n  </a>\n</div>\n\n<div ng-transclude></div>\n\n<ul class="cam-nav nav navbar-nav">\n\n  <li engine-select></li>\n\n  <li class="account dropdown"\n      ng-if="authentication.name"\n      ng-cloak>\n    <a href\n       class="dropdown-toggle">\n      <span class="glyphicon glyphicon-user "></span>\n      {{ authentication.name }}\n    </a>\n\n    <ul class="dropdown-menu dropdown-menu-right">\n      <li class="profile">\n        <a ng-href="{{ \'../../admin/:engine/#/users/\' + authentication.name + \'?tab=profile\' | uri }}">\n          My Profile\n        </a>\n      </li>\n\n      <li class="divider"></li>\n\n      <li class="logout">\n        <a href\n           ng-click="logout()">\n          Sign out\n        </a>\n      </li>\n    </ul>\n  </li>\n\n  <li class="divider-vertical"\n      ng-if="authentication.name"\n      ng-cloak></li>\n\n  <li class="app-switch dropdown">\n    <a href\n       class="dropdown-toggle">\n      <span class="glyphicon glyphicon-home"></span>\n      <span class="caret"></span>\n    </a>\n\n    <ul class="dropdown-menu dropdown-menu-right">\n      <li ng-repeat="(appName, app) in apps"\n          ng-if="appName !== currentApp && (!authentication || authentication.canAccess(appName))"\n          ng-class="appName">\n        <a ng-href="{{ \'../../\' + appName + \'/:engine/\' | uri }}">\n          {{ app.label }}\n        </a>\n      </li>\n    </ul>\n  </li>\n</ul>\n'
}), define("camunda-commons-ui/widgets/header/cam-widget-header", ["angular", "text!./cam-widget-header.html"], function (e, t) {
  "use strict";
  function n(t) {
    var n = e.copy(i);
    return t && delete n[t], n
  }

  var i = {admin: {label: "Admin"}, cockpit: {label: "Cockpit"}, tasklist: {label: "Tasklist"}};
  return [function () {
    return {
      transclude: !0,
      template: t,
      scope: {authentication: "=", currentApp: "@", brandName: "@"},
      controller: ["$scope", "AuthenticationService", function (e, t) {
        e.apps = n(e.currentApp), e.logout = t.logout, e.$watch("currentApp", function () {
          e.apps = n(e.currentApp)
        })
      }]
    }
  }]
}), define("text!camunda-commons-ui/widgets/footer/cam-widget-footer.html", [], function () {
  return '<div class="container-fluid">\n  <div class="row">\n    <div class="col-xs-12">\n      Powered by <a href="http://camunda.org">camunda BPM</a> /\n      <span class="version">{{version}}</span>\n    </div>\n  </div>\n</div>\n'
}), define("camunda-commons-ui/widgets/footer/cam-widget-footer", ["text!./cam-widget-footer.html"], function (e) {
  "use strict";
  return [function () {
    return {template: e, scope: {version: "@"}}
  }]
}), define("text!camunda-commons-ui/widgets/loader/cam-widget-loader.html", [], function () {
  return '<div class="loader-state loaded"\n     ng-show="loadingState === \'LOADED\'"\n     ng-transclude></div>\n\n<div class="loader-state loading"\n     ng-if="loadingState === \'LOADING\'">\n  <span class="glyphicon glyphicon-refresh animate-spin"></span>\n  {{ textLoading }}\n</div>\n\n<div class="loader-state empty"\n     ng-if="loadingState === \'EMPTY\'">\n  {{ textEmpty }}\n</div>\n\n<div class="loader-state alert alert-danger"\n     ng-if="loadingState === \'ERROR\'">\n  {{ textError }}\n</div>\n'
}), define("camunda-commons-ui/widgets/loader/cam-widget-loader", ["angular", "text!./cam-widget-loader.html"], function (e, t) {
  "use strict";
  return [function () {
    return {
      transclude: !0,
      template: t,
      scope: {loadingState: "@", textEmpty: "@", textError: "@", textLoading: "@"},
      compile: function (t, n) {
        e.isDefined(n.textLoading) || (n.textLoading = "Loading…"), e.isDefined(n.loadingState) || (n.loadingState = "INITIAL")
      }
    }
  }]
}), define("text!camunda-commons-ui/widgets/debug/cam-widget-debug.html", [], function () {
  return '<div class="debug">\n  <div class="col-xs-2">\n    <button class="btn btn-default btn-round"\n            ng-click="toggleOpen()"\n            tooltip="{{tooltip}}">\n      <span class="glyphicon"\n            ng-class="{\'glyphicon-eye-open\': !open, \'glyphicon-eye-close\': open}"></span>\n    </button>\n  </div>\n  <div class="col-xs-10"\n       ng-show="open">\n    <code>{{ varName }}</code>\n    <pre>{{ debugged | json }}</pre>\n  </div>\n</div>\n'
}), define("camunda-commons-ui/widgets/debug/cam-widget-debug", ["angular", "text!./cam-widget-debug.html"], function (e, t) {
  "use strict";
  return [function () {
    return {
      template: t,
      scope: {debugged: "=", open: "@", tooltip: "@camWidgetDebugTooltip"},
      link: function (e, t, n) {
        e.varName = n.debugged, e.toggleOpen = function () {
          e.open = !e.open
        }
      }
    }
  }]
}), define("text!camunda-commons-ui/widgets/variable/cam-widget-variable.html", [], function () {
  return '<div ng-if="display && isShown(\'type\')"\n     class="type">{{ variable.type }}</div>\n<div ng-if="display && isShown(\'name\')"\n     class="name">{{ variable.name }}</div>\n<div ng-if="display && isShown(\'value\') && isPrimitive()"\n     ng-class="{null: isNull()}"\n     class="value">\n  <span ng-if="isNull()"\n        class="null-symbol">&lt;null&gt;</span>\n  {{ (variable.value === null ? \'\' : variable.value.toString()) }}\n</div>\n<div ng-if="display && isShown(\'value\') && variable.type === \'Object\'"\n     ng-class="{null: isNull()}"\n     class="value">\n  <a ng-click="editVariableValue()">\n    {{ variable.valueInfo.objectTypeName }}\n  </a>\n</div>\n\n\n<div ng-if="!display"\n     class="input-group editing">\n  <div ng-if="isShown(\'type\')"\n       class="input-group-btn type">\n    <select class="form-control"\n            ng-model="variable.type"\n            ng-options="variableType for variableType in variableTypes track by variableType"\n            required>\n    </select>\n  </div><!-- /btn-group -->\n\n  <input ng-if="isShown(\'name\')"\n         type="text"\n         class="form-control name"\n         ng-model="variable.name"\n         placeholder="varName"\n         required />\n\n  <div ng-if="isShown(\'value\') && !isNull()"\n       class="value-wrapper input-group"\n       ng-class="{checkbox: useCheckbox()}">\n    <div ng-if="variable.type !== \'Null\'"\n         class="input-group-btn">\n      <a ng-click="setNull()"\n         class="btn btn-default set-null"\n         tooltip="Set value to &quot;null&quot;">\n        <span class="glyphicon glyphicon-remove"></span>\n      </a>\n    </div>\n\n    <input ng-if="isPrimitive() && !useCheckbox()"\n           type="text"\n           class="form-control value"\n           ng-model="variable.value"\n           placeholder="Value of the variable"\n           cam-variable-validator="{{variable.type}}" />\n\n    <input ng-if="useCheckbox()"\n           type="checkbox"\n           class="value"\n           ng-model="variable.value"\n           placeholder="Value of the variable"\n           cam-variable-validator="{{variable.type}}" />\n\n    <div ng-if="variable.type === \'Object\'"\n         class="value form-control-static">\n      <a ng-click="editVariableValue()">\n        {{ variable.valueInfo.objectTypeName || \'&lt;undefined&gt;\' }}\n      </a>\n    </div>\n  </div>\n\n  <div ng-if="variable.type !== \'Null\' && isShown(\'value\') && isNull()"\n       ng-click="setNonNull()"\n       class="value-wrapper value null-value btn btn-default"\n       tooltip="Re-set to previous or default value">\n    <span class="null-symbol">&lt;null&gt;</span>\n  </div>\n\n  <div ng-if="variable.type === \'Null\'"\n       class="value-wrapper value btn no-click null-value">\n    <span class="null-symbol">&lt;null&gt;</span>\n  </div>\n</div>\n'
}), define("text!camunda-commons-ui/widgets/variable/cam-widget-variable-dialog.html", [], function () {
  return '<!-- # CE - camunda-commons-ui/lib/widgets/variable/cam-widget-variable-dialog.html -->\n<div class="modal-header">\n  <h3>Inspect "{{ variable.name }}" variable</h3>\n</div>\n\n<div class="modal-body">\n  <div ng-if="readonly">\n    <p>\n      Object type name: <code>{{ variable.valueInfo.objectTypeName }}</code>\n    </p>\n\n    <p>\n      Serialization Data Format: <code>{{ variable.valueInfo.serializationDataFormat }}</code>\n    </p>\n  </div>\n\n  <div ng-if="!readonly"\n       class="form-group">\n    <label for="object-type-name">Object type name</label>\n    <input type="text"\n           id="object-type-name"\n           class="form-control"\n           ng-model="variable.valueInfo.objectTypeName" />\n  </div>\n\n  <div ng-if="!readonly"\n       class="form-group">\n    <label for="serialization-data-format">Serialization data format</label>\n    <input type="text"\n           id="serialization-data-format"\n           class="form-control"\n           ng-model="variable.valueInfo.serializationDataFormat" />\n  </div>\n\n  <div class="form-group">\n    <label for="serialized-value">Serialized value</label>\n    <textarea ng-model="variable.value"\n              id="serialized-value"\n              rows="10"\n              class="form-control"\n              ng-disabled="readonly"></textarea>\n  </div>\n</div>\n\n<div class="modal-footer">\n  <button class="btn btn-default"\n          ng-click="$dismiss(\'close\')">\n    Close\n  </button>\n\n  <button class="btn btn-primary"\n          ng-if="!readonly"\n          ng-disabled="!hasChanged(\'serialized\')"\n          ng-click="$close(variable)">\n    Change\n  </button>\n</div>\n<!-- / CE - camunda-commons-ui/lib/widgets/variable/cam-widget-variable-dialog.html -->\n'
}), !function (e) {
  if ("object" == typeof exports && "undefined" != typeof module)module.exports = e(); else if ("function" == typeof define && define.amd)define("camunda-bpm-sdk-js-type-utils", [], e); else {
    var t;
    "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self);
    var n = t;
    n = n.CamSDK || (n.CamSDK = {}), n = n.utils || (n.utils = {}), n.typeUtils = e()
  }
}(function () {
  return function e(t, n, i) {
    function r(o, s) {
      if (!n[o]) {
        if (!t[o]) {
          var c = "function" == typeof require && require;
          if (!s && c)return c(o, !0);
          if (a)return a(o, !0);
          throw new Error("Cannot find module '" + o + "'")
        }
        var l = n[o] = {exports: {}};
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return r(n ? n : e)
        }, l, l.exports, e, t, n, i)
      }
      return n[o].exports
    }

    for (var a = "function" == typeof require && require, o = 0; o < i.length; o++)r(i[o]);
    return r
  }({
    1: [function (e, t) {
      "use strict";
      var n = /^-?[\d]+$/, i = /^(0|(-?(((0|[1-9]\d*)\.\d+)|([1-9]\d*))))([eE][-+]?[0-9]+)?$/, r = /^(true|false)$/, a = /^(\d{2}|\d{4})(?:\-)([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)([0-2]{1}\d{1}|[3]{1}[0-1]{1})T(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1}):([0-5]{1}\d{1}):([0-5]{1}\d{1})?$/, o = function (e, t) {
        switch (t) {
          case"Integer":
          case"Long":
          case"Short":
            return n.test(e);
          case"Float":
          case"Double":
            return i.test(e);
          case"Boolean":
            return r.test(e);
          case"Date":
            return a.test(e)
        }
      }, s = function (e, t) {
        if ("string" == typeof e && (e = e.trim()), "String" === t || "Bytes" === t)return e;
        if (!o(e, t))throw new Error("Value '" + e + "' is not of type " + t);
        switch (t) {
          case"Integer":
          case"Long":
          case"Short":
            return parseInt(e, 10);
          case"Float":
          case"Double":
            return parseFloat(e);
          case"Boolean":
            return "true" === e;
          case"Date":
            return e
        }
      };
      t.exports = {convertToType: s, isType: o}
    }, {}]
  }, {}, [1])(1)
}), define("camunda-commons-ui/widgets/variable/cam-widget-variable", ["angular", "text!./cam-widget-variable.html", "text!./cam-widget-variable-dialog.html", "camunda-bpm-sdk-js-type-utils"], function (e, t, n, i) {
  "use strict";
  function r(e) {
    return e = e || new Date, e.toISOString().slice(0, -5)
  }

  var a = ["Boolean", "Date", "Double", "Integer", "Long", "Null", "Object", "Short", "String"], o = ["$scope", "$http", "variable", "readonly", function (t, n, i, r) {
    t.variable = i, t.readonly = r;
    var a = e.copy(i);
    t.hasChanged = function () {
      return a.valueInfo = a.valueInfo || {}, i.valueInfo = i.valueInfo || {}, a.value !== i.value || a.valueInfo.serializationDataFormat !== i.valueInfo.serializationDataFormat || a.valueInfo.objectTypeName !== i.valueInfo.objectTypeName
    }
  }];
  return ["$modal", function (s) {
    return {
      template: t, scope: {variable: "=camVariable", display: "@?", shown: "=?"}, link: function (t, c) {
        function l() {
          if (t.valid = t.variable.name && t.variable.type ? null === t.variable.value || ["String", "Object", "Null"].indexOf(t.variable.type) > -1 ? !0 : i.isType(t.variable.value, t.variable.type) : !1, t.valid && t.variable.type && null !== t.variable.value && t.isPrimitive(t.variable.type)) {
            var e;
            e = "Boolean" !== t.variable.type ? i.convertToType(t.variable.value, t.variable.type) : t.variable.value ? "false" !== t.variable.value : !1, typeof t.variable.value != typeof e && (t.variable.value = e)
          }
        }

        t.variableTypes = e.copy(a), t.isPrimitive = function (e) {
          return e = e || t.variable.type, e ? ["Boolean", "Date", "Double", "Integer", "Long", "Short", "String"].indexOf(e) >= 0 : !0
        };
        var u = {Boolean: !1, Date: r(), Double: 0, Integer: 0, Long: 0, Null: "", Short: 0, String: "", Object: {}};
        t.useCheckbox = function () {
          return "Boolean" === t.variable.type
        }, t.isShown = function (e) {
          return Array.isArray(t.shown) && t.shown.length ? t.shown.indexOf(e) > -1 : !0
        }, t.shownClasses = function () {
          return Array.isArray(t.shown) && t.shown.length ? t.shown.map(function (e) {
            return "show-" + e
          }).join(" ") : ""
        }, t.$watch("shown", function () {
          c.removeClass("show-type show-name show-value").addClass(t.shownClasses())
        }), t.valid = !0, t.$watch("variable.value", l), t.$watch("variable.name", l), t.$watch("variable.type", l), l();
        var p = t.variable.value;
        t.$watch("variable.type", function (e, n) {
          "Boolean" === e ? null !== t.variable.value && (p = t.variable.value, t.variable.value = "false" === t.variable.value ? !1 : !!t.variable.value) : "Boolean" === n && (t.variable.value = p);
          var i = c[0].classList;
          n && i.remove("var-type-" + n.toLowerCase()), e && i.add("var-type-" + e.toLowerCase())
        }), t.isNull = function () {
          return null === t.variable.value
        }, t.setNonNull = function () {
          t.variable.value = p || u[t.variable.type]
        }, t.setNull = function () {
          p = t.variable.value, t.variable.value = null
        }, t.editVariableValue = function () {
          s.open({
            template: n, controller: o, windowClass: "cam-widget-variable-dialog", resolve: {
              variable: function () {
                return e.copy(t.variable)
              }, readonly: function () {
                return t.display
              }
            }
          }).result.then(function (e) {
            t.variable.value = e.value, t.variable.valueInfo = e.valueInfo
          })
        }
      }
    }
  }]
}), define("text!camunda-commons-ui/widgets/search/cam-widget-search.html", [], function () {
  return '<form class="search-field"\n      ng-submit="createSearch()"\n      ng-class="{\'has-search\': searches.length}">\n  <div class="form-container search-container">\n    <span cam-widget-search-pill\n          ng-repeat="search in searches"\n          extended="search.extended"\n          allow-dates="search.allowDates"\n          enforce-dates="search.enforceDates"\n          valid="search.valid"\n          name="search.name"\n          potential-names="search.potentialNames"\n          type="search.type"\n          operator="search.operator"\n          value="search.value"\n          invalid-text="{{ translations.invalid }}"\n          delete-text="{{ translations.deleteSearch }}"\n          on-change="handleChange($index, field, before, value, $event)"\n          on-delete="deleteSearch($index)"\n    />\n\n    <input class="form-control main-field"\n           type="text"\n           placeholder="{{ translations.inputPlaceholder }}"\n           ng-model="inputQuery"\n           ng-keydown="onKeydown($event)"\n           typeahead="type as type.value for type in dropdownTypes | filter:$viewValue:instantTypeahead"\n           typeahead-on-select="createSearch($item)"\n           instant-typeahead\n    />\n\n  </div>\n</form>\n'
}),define("camunda-commons-ui/widgets/search/cam-widget-search", ["text!./cam-widget-search.html", "angular", "jquery"], function (e, t, n) {
  "use strict";
  function i(e) {
    return e && "string" == typeof e && e.match(r) ? "date" : typeof e
  }

  var r = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:.(\d\d\d)| )?$/, a = function (e) {
    return e.type.value && (!e.extended || e.name.value) && e.operator.value && e.value.value && ("date" === i(e.value.value) || !e.enforceDates)
  }, o = function (e) {
    if (!e.value)return void(e.value = e.values[0]);
    var t = e.values.map(function (e) {
      return e.key
    }).indexOf(e.value.key);
    e.value = e.values[-1 === t ? 0 : t]
  }, s = function (e) {
    return isNaN(e) || "" === e.trim() ? "true" === e ? !0 : "false" === e ? !1 : "NULL" === e ? null : e : +e
  };
  return ["$timeout", "$location", "search", function (r, c, l) {
    return {
      restrict: "A",
      scope: {
        types: "=camWidgetSearchTypes",
        translations: "=camWidgetSearchTranslations",
        operators: "=camWidgetSearchOperators",
        searches: "=?camWidgetSearchSearches",
        validSearches: "=?camWidgetSearchValidSearches",
        searchId: "@camWidgetSearchId"
      },
      link: function (e, u) {
        var p = e.searchId || "search";
        e.searchTypes = e.types.map(function (e) {
          return e.id
        });
        var d = e.types.reduce(function (e, t) {
          return e || (t["default"] ? t : null)
        }, null), f = function () {
          var n = e.searches.map(function (e) {
            return e.type.value.key
          }).reduce(function (e, t) {
            return -1 === e.indexOf(t) && e.push(t), e
          }, []), i = n.map(function (e) {
            return h(e).groups
          }).filter(function (e) {
            return !!e
          }).reduce(function (e, n) {
            if (e) {
              if (0 === e.length)return t.copy(n);
              for (var i = 0; i < e.length; i++)-1 === n.indexOf(e[i]) && (e.splice(i, 1), i--);
              return 0 === e.length ? null : e
            }
            return null
          }, []);
          return null === i ? [] : 0 === i.length ? e.searchTypes : e.searchTypes.filter(function (e) {
            var t = h(e.key).groups;
            if (!t)return !0;
            for (var n = 0; n < t.length; n++)if (i.indexOf(t[n]) > -1)return !0;
            return !1
          })
        }, h = function (t) {
          return e.types.reduce(function (e, n) {
            return e || (n.id.key === t ? n : null)
          }, null)
        }, m = function (t, n) {
          return t.operators || e.operators[i(s(n))]
        }, g = function () {
          var n = JSON.parse((c.search() || {})[p + "Query"] || "[]"), i = [];
          return t.forEach(n, function (t) {
            var n = h(t.type), r = {
              extended: n.extended,
              type: {
                values: f(), value: f().reduce(function (e, n) {
                  return e || (n.key === t.type ? n : null)
                }, null), tooltip: e.translations.type
              },
              name: {value: t.name, tooltip: e.translations.name},
              operator: {tooltip: e.translations.operator},
              value: {value: t.value, tooltip: e.translations.value},
              allowDates: n.allowDates,
              enforceDates: n.enforceDates,
              potentialNames: n.potentialNames || []
            };
            r.operator.values = m(n, r.value.value), r.operator.value = r.operator.values.reduce(function (e, n) {
              return e || (n.key === t.operator ? n : null)
            }, null), r.valid = a(r), i.push(r)
          }), i
        };
        e.searches = e.searches || [], e.searches = g(), e.validSearchesBuffer = e.searches.reduce(function (e, t) {
          return t.valid && e.push(t), e
        }, []), e.validSearches = t.copy(e.validSearchesBuffer);
        var v = function (t, n) {
          var i = e.searches[t];
          if (!i.valid) {
            if (i.extended && !i.name.value && "name" !== n)return void(i.name.inEdit = !0);
            if ("value" !== n)return void(i.value.inEdit = !0)
          }
          for (var r = 1; r < e.searches.length; r++) {
            var a = (r + t) % e.searches.length;
            if (i = e.searches[a], !i.valid)return void(i.extended && !i.name.value ? i.name.inEdit = !0 : i.value.inEdit = !0)
          }
        };
        e.createSearch = function (t) {
          if (t || e.inputQuery) {
            var n = t ? "" : e.inputQuery;
            t = t && h(t.key) || d;
            var i = m(t, n);
            e.searches.push({
              extended: t.extended,
              type: {values: f(), value: t.id, tooltip: e.translations.type},
              name: {value: "", inEdit: t.extended, tooltip: e.translations.name},
              operator: {value: i[0], values: i, tooltip: e.translations.operator},
              value: {value: n, inEdit: !t.extended && !n, tooltip: e.translations.value},
              allowDates: t.allowDates,
              enforceDates: t.enforceDates,
              potentialNames: t.potentialNames
            });
            var o = e.searches[e.searches.length - 1];
            o.valid = a(o), n ? e.inputQuery = "" : r(function () {
              r(function () {
                e.inputQuery = "", u.find(".search-container > input").blur()
              })
            })
          }
        }, e.deleteSearch = function (t) {
          e.searches.splice(t, 1)
        }, e.handleChange = function (t, n, i, s, c) {
          var l, p = e.searches[t];
          "type" === n ? (l = h(s.key), p.extended = l.extended, p.allowDates = l.allowDates, !p.enforceDates && l.enforceDates && (p.value.value = ""), p.enforceDates = l.enforceDates, p.operator.values = m(l, p.value.value), o(p.operator)) : "value" === n && (t === e.searches.length - 1 && r(function () {
            u.find(".search-container > input").focus()
          }), l = h(p.type.value.key), l.operators || (p.operator.values = m(l, p.value.value), o(p.operator))), p.valid = a(p), c && 13 === c.keyCode && v(t, n)
        }, e.onKeydown = function (t) {
          if (9 !== t.keyCode || e.inputQuery)-1 !== [38, 40, 13].indexOf(t.keyCode) && 0 === u.find(".dropdown-menu").length && r(function () {
            n(t.target).trigger("input")
          }); else {
            t.preventDefault(), t.stopPropagation();
            var i = e.searches[t.shiftKey ? e.searches.length - 1 : 0];
            i && (t.shiftKey ? i.value.inEdit = !0 : i.type.inEdit = !0)
          }
        };
        var y = function (e) {
          var n = [];
          return t.forEach(e, function (e) {
            n.push({type: e.type.value.key, operator: e.operator.value.key, value: e.value.value, name: e.name.value})
          }), n
        };
        e.$watch("searches", function () {
          var n = e.searches;
          t.forEach(n, function (t) {
            t.valid && -1 === e.validSearchesBuffer.indexOf(t) && e.validSearchesBuffer.push(t)
          }), t.forEach(e.validSearchesBuffer, function (t, i) {
            t.valid && -1 !== n.indexOf(t) || e.validSearchesBuffer.splice(i, 1)
          });
          var i = {};
          i[p + "Query"] = JSON.stringify(y(e.validSearchesBuffer)), l.updateSilently(i), w()
        }, !0);
        var b;
        e.$watch("validSearchesBuffer", function () {
          r.cancel(b), b = r(function () {
            e.validSearches = t.copy(e.validSearchesBuffer)
          })
        }, !0);
        var w = function () {
          var t = f();
          e.dropdownTypes = t;
          for (var n = 0; n < e.searches.length; n++)e.searches[n].type.values = t
        };
        e.$watch("types", function () {
          t.forEach(e.searches, function (e) {
            e.potentialNames = h(e.type.value.key).potentialNames || []
          })
        }, !0), e.dropdownTypes = f()
      },
      template: e
    }
  }]
}),!function (e) {
  if ("object" == typeof exports && "undefined" != typeof module)module.exports = e(); else if ("function" == typeof define && define.amd)define("bpmn-io", [], e); else {
    var t;
    "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.BpmnJS = e()
  }
}(function () {
  var e;
  return function t(e, n, i) {
    function r(o, s) {
      if (!n[o]) {
        if (!e[o]) {
          var c = "function" == typeof require && require;
          if (!s && c)return c(o, !0);
          if (a)return a(o, !0);
          var l = new Error("Cannot find module '" + o + "'");
          throw l.code = "MODULE_NOT_FOUND", l
        }
        var u = n[o] = {exports: {}};
        e[o][0].call(u.exports, function (t) {
          var n = e[o][1][t];
          return r(n ? n : t)
        }, u, u.exports, t, e, n, i)
      }
      return n[o].exports
    }

    for (var a = "function" == typeof require && require, o = 0; o < i.length; o++)r(i[o]);
    return r
  }({
    1: [function (e, t) {
      function n(e) {
        i.call(this, e)
      }

      var i = e(2);
      n.prototype = Object.create(i.prototype), t.exports = n, n.prototype._navigationModules = [e(60), e(58)], n.prototype._modules = [].concat(n.prototype._modules, n.prototype._navigationModules)
    }, {2: 2, 58: 58, 60: 60}],
    2: [function (e, t) {
      function n(e, t) {
        var n = e.get("eventBus");
        t.forEach(function (e) {
          n.on(e.event, e.handler)
        })
      }

      function i(e) {
        var t = /unparsable content <([^>]+)> detected([\s\S]*)$/, n = t.exec(e.message);
        return n && (e.message = "unparsable content <" + n[1] + "> detected; this may indicate an invalid BPMN 2.0 diagram file" + n[2]), e
      }

      function r(e) {
        return e + (l(e) ? "px" : "")
      }

      function a(e) {
        this.options = e = o({}, g, e || {});
        var t = e.container;
        t.get && (t = t.get(0)), c(t) && (t = p(t));
        var n = this.container = u('<div class="bjs-container"></div>');
        t.appendChild(n), o(n.style, {width: r(e.width), height: r(e.height), position: e.position});
        var i = "iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFiMte9PrwldFwfcZPqtqN0+zEyOe1XLgjvuKncsJAZ70y6fXh3vDT////UrQV////G2zN+AAAABB0Uk5T////////////////////AOAjXRkAAAHDSURBVHjavJZJkoUgDEBJmAX8979tM8u3E6x20VlYJfFFMoL4vBDxATxZcakIOJTWSmxvKWVIkJ8jHvlRv1F2LFrVISCZI+tCtQx+XfewgVTfyY3plPiQEAzI3zWy+kR6NBhFBYeBuscJLOUuA2WVLpCjVIaFzrNQZArxAZKUQm6gsj37L9Cb7dnIBUKxENaaMJQqMpDXvSL+ktxdGRm2IsKgJGGPg7atwUG5CcFUEuSv+CwQqizTrvDTNXdMU2bMiDWZd8d7QIySWVRsb2vBBioxOFt4OinPBapL+neAb5KL5IJ8szOza2/DYoipUCx+CjO0Bpsv0V6mktNZ+k8rlABlWG0FrOpKYVo8DT3dBeLEjUBAj7moDogVii7nSS9QzZnFcOVBp1g2PyBQ3Vr5aIapN91VJy33HTJLC1iX2FY6F8gRdaAeIEfVONgtFCzZTmoLEdOjBDfsIOA6128gw3eu1shAajdZNAORxuQDJN5A5PbEG6gNIu24QJD5iNyRMZIr6bsHbCtCU/OaOaSvgkUyDMdDa1BXGf5HJ1To+/Ym6mCKT02Y+/Sa126ZKyd3jxhzpc1r8zVL6YM1Qy/kR4ABAFJ6iQUnivhAAAAAAElFTkSuQmCC", a = '<a href="http://bpmn.io" target="_blank" class="bjs-powered-by" title="Powered by bpmn.io" style="position: absolute; bottom: 15px; right: 15px; z-index: 100"><img src="data:image/png;base64,' + i + '"></a>';
        n.appendChild(u(a))
      }

      var o = e(159), s = e(163), c = e(156), l = e(153), u = e(173), p = e(175), d = e(176), f = e(35), h = e(14), m = e(9), g = {
        width: "100%",
        height: "100%",
        position: "relative",
        container: "body"
      };
      a.prototype.importXML = function (e, t) {
        var n = this;
        this.moddle = this.createModdle(), this.moddle.fromXML(e, "bpmn:Definitions", function (e, r, a) {
          if (e)return e = i(e), t(e);
          var o = a.warnings;
          n.importDefinitions(r, function (e, n) {
            return e ? t(e) : void t(null, o.concat(n || []))
          })
        })
      }, a.prototype.saveXML = function (e, t) {
        t || (t = e, e = {});
        var n = this.definitions;
        return n ? void this.moddle.toXML(n, e, t) : t(new Error("no definitions loaded"))
      }, a.prototype.createModdle = function () {
        return new h(this.options.moddleExtensions)
      }, a.prototype.saveSVG = function (e, t) {
        t || (t = e, e = {});
        var n = this.get("canvas"), i = n.getDefaultLayer(), r = n._svg.select("defs"), a = i.innerSVG(), o = r && r.outerSVG() || "", s = i.getBBox(), c = '<?xml version="1.0" encoding="utf-8"?>\n<!-- created with bpmn-js / http://bpmn.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + s.width + '" height="' + s.height + '" viewBox="' + s.x + " " + s.y + " " + s.width + " " + s.height + '" version="1.1">' + o + a + "</svg>";
        t(null, c)
      }, a.prototype.get = function (e) {
        if (!this.diagram)throw new Error("no diagram loaded");
        return this.diagram.get(e)
      }, a.prototype.invoke = function (e) {
        if (!this.diagram)throw new Error("no diagram loaded");
        return this.diagram.invoke(e)
      }, a.prototype.importDefinitions = function (e, t) {
        try {
          this.diagram && this.clear(), this.definitions = e;
          var n = this.diagram = this._createDiagram(this.options);
          this._init(n), m.importBpmnDiagram(n, e, t)
        } catch (i) {
          t(i)
        }
      }, a.prototype._init = function (e) {
        n(e, this.__listeners || [])
      }, a.prototype._createDiagram = function (e) {
        var t = [].concat(e.modules || this.getModules(), e.additionalModules || []);
        return t.unshift({
          bpmnjs: ["value", this],
          moddle: ["value", this.moddle]
        }), e = s(e, "additionalModules"), e = o(e, {canvas: {container: this.container}, modules: t}), new f(e)
      }, a.prototype.getModules = function () {
        return this._modules
      }, a.prototype.clear = function () {
        var e = this.diagram;
        e && e.destroy()
      }, a.prototype.destroy = function () {
        this.clear(), d(this.container)
      }, a.prototype.on = function (e, t) {
        var n = this.diagram, i = this.__listeners = this.__listeners || [];
        i.push({event: e, handler: t}), n && n.get("eventBus").on(e, t)
      }, a.prototype._modules = [e(3), e(55), e(51)], t.exports = a
    }, {
      14: 14,
      153: 153,
      156: 156,
      159: 159,
      163: 163,
      173: 173,
      175: 175,
      176: 176,
      3: 3,
      35: 35,
      51: 51,
      55: 55,
      9: 9
    }],
    3: [function (e, t) {
      t.exports = {__depends__: [e(6), e(11)]}
    }, {11: 11, 6: 6}],
    4: [function (e, t) {
      function n(e, t, n) {
        function h(e, t) {
          Y[e] = t
        }

        function m(e) {
          return Y[e]
        }

        function g(e) {
          function t(e, t) {
            var n = a({
              fill: "black",
              strokeWidth: 1,
              strokeLinecap: "round",
              strokeDasharray: "none"
            }, t.attrs), i = t.ref || {x: 0, y: 0}, r = t.scale || 1;
            "none" === n.strokeDasharray && (n.strokeDasharray = [1e4, 1]);
            var o = t.element.attr(n).marker(0, 0, 20, 20, i.x, i.y).attr({markerWidth: 20 * r, markerHeight: 20 * r});
            return h(e, o)
          }

          t("sequenceflow-end", {
            element: e.path("M 1 5 L 11 10 L 1 15 Z"),
            ref: {x: 11, y: 10},
            scale: .5
          }), t("messageflow-start", {
            element: e.circle(6, 6, 5),
            attrs: {fill: "white", stroke: "black"},
            ref: {x: 6, y: 6}
          }), t("messageflow-end", {
            element: e.path("M 1 5 L 11 10 L 1 15 Z"),
            attrs: {fill: "white", stroke: "black"},
            ref: {x: 11, y: 10}
          }), t("data-association-end", {
            element: e.path("M 1 5 L 11 10 L 1 15"),
            attrs: {fill: "white", stroke: "black"},
            ref: {x: 11, y: 10},
            scale: .5
          }), t("conditional-flow-marker", {
            element: e.path("M 0 10 L 8 6 L 16 10 L 8 14 Z"),
            attrs: {fill: "white", stroke: "black"},
            ref: {x: -1, y: 10},
            scale: .5
          }), t("conditional-default-flow-marker", {
            element: e.path("M 1 4 L 5 16"),
            attrs: {stroke: "black"},
            ref: {x: -5, y: 10},
            scale: .5
          })
        }

        function v(e, n, r) {
          return i(n) || (r = n, n = []), t.style(n || [], a(r, e || {}))
        }

        function y(e, t, n, i, a) {
          r(i) && (a = i, i = 0), i = i || 0, a = v(a, {stroke: "black", strokeWidth: 2, fill: "white"});
          var o = t / 2, s = n / 2;
          return e.circle(o, s, Math.round((t + n) / 4 - i)).attr(a)
        }

        function b(e, t, n, i, a, o) {
          return r(a) && (o = a, a = 0), a = a || 0, o = v(o, {
            stroke: "black",
            strokeWidth: 2,
            fill: "white"
          }), e.rect(a, a, t - 2 * a, n - 2 * a, i).attr(o)
        }

        function w(e, t, n, i) {
          var r = t / 2, a = n / 2, o = [r, 0, t, a, r, n, 0, a];
          return i = v(i, {stroke: "black", strokeWidth: 2, fill: "white"}), e.polygon(o).attr(i)
        }

        function x(e, t, n) {
          return n = v(n, ["no-fill"], {stroke: "black", strokeWidth: 2, fill: "none"}), f(t, n).appendTo(e)
        }

        function E(e, t, n) {
          return n = v(n, ["no-fill"], {strokeWidth: 2, stroke: "black"}), e.path(t).attr(n)
        }

        function _(e) {
          return function (t, n) {
            return z[e](t, n)
          }
        }

        function T(e) {
          return z[e]
        }

        function S(e, t) {
          var n = F(e), i = B(n);
          return L(n, "bpmn:MessageEventDefinition") ? T("bpmn:MessageEventDefinition")(t, e, i) : L(n, "bpmn:TimerEventDefinition") ? T("bpmn:TimerEventDefinition")(t, e, i) : L(n, "bpmn:ConditionalEventDefinition") ? T("bpmn:ConditionalEventDefinition")(t, e) : L(n, "bpmn:SignalEventDefinition") ? T("bpmn:SignalEventDefinition")(t, e, i) : L(n, "bpmn:CancelEventDefinition") && L(n, "bpmn:TerminateEventDefinition", {parallelMultiple: !1}) ? T("bpmn:MultipleEventDefinition")(t, e, i) : L(n, "bpmn:CancelEventDefinition") && L(n, "bpmn:TerminateEventDefinition", {parallelMultiple: !0}) ? T("bpmn:ParallelMultipleEventDefinition")(t, e, i) : L(n, "bpmn:EscalationEventDefinition") ? T("bpmn:EscalationEventDefinition")(t, e, i) : L(n, "bpmn:LinkEventDefinition") ? T("bpmn:LinkEventDefinition")(t, e, i) : L(n, "bpmn:ErrorEventDefinition") ? T("bpmn:ErrorEventDefinition")(t, e, i) : L(n, "bpmn:CancelEventDefinition") ? T("bpmn:CancelEventDefinition")(t, e, i) : L(n, "bpmn:CompensateEventDefinition") ? T("bpmn:CompensateEventDefinition")(t, e, i) : L(n, "bpmn:TerminateEventDefinition") ? T("bpmn:TerminateEventDefinition")(t, e, i) : null
        }

        function A(e, t, n) {
          return q.createText(e, t || "", n).addClass("djs-label")
        }

        function C(e, t, n) {
          var i = F(t);
          return A(e, i.name, {box: t, align: n, padding: 5})
        }

        function D(e, t, n) {
          var i = F(t);
          return i.name || (t.hidden = !0), A(e, i.name, {box: t, align: n, style: {fontSize: "11px"}})
        }

        function k(e, t, n) {
          var i = A(e, t, {box: {height: 30, width: n.height}, align: "center-middle"}), r = -1 * n.height;
          i.transform("rotate(270) translate(" + r + ",0)")
        }

        function I(e) {
          for (var t = e.waypoints, n = "m  " + t[0].x + "," + t[0].y, i = 1; i < t.length; i++)n += "L" + t[i].x + "," + t[i].y + " ";
          return n
        }

        function P(e, t, n) {
          var i, r = F(t), a = c(n, "SubProcessMarker");
          return i = a ? {seq: -21, parallel: -22, compensation: -42, loop: -18, adhoc: 10} : {
            seq: -3,
            parallel: -6,
            compensation: -27,
            loop: 0,
            adhoc: 10
          }, o(n, function (n) {
            T(n)(e, t, i)
          }), "bpmn:AdHocSubProcess" === r.$type && T("AdhocMarker")(e, t, i), r.loopCharacteristics && void 0 === r.loopCharacteristics.isSequential ? void T("LoopMarker")(e, t, i) : (r.loopCharacteristics && void 0 !== r.loopCharacteristics.isSequential && !r.loopCharacteristics.isSequential && T("ParallelMarker")(e, t, i), r.loopCharacteristics && r.loopCharacteristics.isSequential && T("SequentialMarker")(e, t, i), void(r.isForCompensation && T("CompensationMarker")(e, t, i)))
        }

        function M(e, t) {
          var n = t.type, i = z[n];
          return i ? i(e, t) : u.prototype.drawShape.apply(this, [e, t])
        }

        function R(e, t) {
          var n = t.type, i = z[n];
          return i ? i(e, t) : u.prototype.drawConnection.apply(this, [e, t])
        }

        function N(e, t) {
          var i = (t.height - 16) / t.height, r = n.getScaledPath("DATA_OBJECT_COLLECTION_PATH", {
            xScaleFactor: 1,
            yScaleFactor: 1,
            containerWidth: t.width,
            containerHeight: t.height,
            position: {mx: .451, my: i}
          });
          E(e, r, {strokeWidth: 2})
        }

        function O(e) {
          return e.isCollection || e.elementObjectRef && e.elementObjectRef.isCollection
        }

        function $(e) {
          return e.businessObject.di
        }

        function F(e) {
          return e.businessObject
        }

        function L(e, t, n) {
          function i(e, t) {
            return s(t, function (t, n) {
              return e[n] == t
            })
          }

          return l(e.eventDefinitions, function (r) {
            return r.$type === t && i(e, n)
          })
        }

        function B(e) {
          return "bpmn:IntermediateThrowEvent" === e.$type || "bpmn:EndEvent" === e.$type
        }

        u.call(this, t);
        var V = 10, j = 3, U = {fontFamily: "Arial, sans-serif", fontSize: "12px"}, q = new p({
          style: U,
          size: {width: 100}
        }), Y = {}, z = {
          "bpmn:Event": function (e, t, n) {
            return y(e, t.width, t.height, n)
          },
          "bpmn:StartEvent": function (e, t) {
            var n = {}, i = F(t);
            i.isInterrupting || (n = {strokeDasharray: "6", strokeLinecap: "round"});
            var r = T("bpmn:Event")(e, t, n);
            return S(t, e), r
          },
          "bpmn:MessageEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_MESSAGE", {
              xScaleFactor: .9,
              yScaleFactor: .9,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .235, my: .315}
            }), a = i ? "black" : "white", o = i ? "white" : "black", s = E(e, r, {strokeWidth: 1, fill: a, stroke: o});
            return s
          },
          "bpmn:TimerEventDefinition": function (e, t) {
            var i = y(e, t.width, t.height, .2 * t.height, {strokeWidth: 2}), r = n.getScaledPath("EVENT_TIMER_WH", {
              xScaleFactor: .75,
              yScaleFactor: .75,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .5, my: .5}
            });
            E(e, r, {strokeWidth: 2, strokeLinecap: "square"});
            for (var a = 0; 12 > a; a++) {
              var o = n.getScaledPath("EVENT_TIMER_LINE", {
                xScaleFactor: .75,
                yScaleFactor: .75,
                containerWidth: t.width,
                containerHeight: t.height,
                position: {mx: .5, my: .5}
              }), s = t.width / 2, c = t.height / 2;
              E(e, o, {
                strokeWidth: 1,
                strokeLinecap: "square",
                transform: "rotate(" + 30 * a + "," + c + "," + s + ")"
              })
            }
            return i
          },
          "bpmn:EscalationEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_ESCALATION", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .5, my: .555}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a})
          },
          "bpmn:ConditionalEventDefinition": function (e, t) {
            var i = n.getScaledPath("EVENT_CONDITIONAL", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .5, my: .222}
            });
            return E(e, i, {strokeWidth: 1})
          },
          "bpmn:LinkEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_LINK", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .57, my: .263}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a})
          },
          "bpmn:ErrorEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_ERROR", {
              xScaleFactor: 1.1,
              yScaleFactor: 1.1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .2, my: .722}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a})
          },
          "bpmn:CancelEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_CANCEL_45", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .638, my: -.055}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a}).transform("rotate(45)")
          },
          "bpmn:CompensateEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_COMPENSATION", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .201, my: .472}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a})
          },
          "bpmn:SignalEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_SIGNAL", {
              xScaleFactor: .9,
              yScaleFactor: .9,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .5, my: .2}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a})
          },
          "bpmn:MultipleEventDefinition": function (e, t, i) {
            var r = n.getScaledPath("EVENT_MULTIPLE", {
              xScaleFactor: 1.1,
              yScaleFactor: 1.1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .222, my: .36}
            }), a = i ? "black" : "none";
            return E(e, r, {strokeWidth: 1, fill: a})
          },
          "bpmn:ParallelMultipleEventDefinition": function (e, t) {
            var i = n.getScaledPath("EVENT_PARALLEL_MULTIPLE", {
              xScaleFactor: 1.2,
              yScaleFactor: 1.2,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .458, my: .194}
            });
            return E(e, i, {strokeWidth: 1})
          },
          "bpmn:EndEvent": function (e, t) {
            var n = T("bpmn:Event")(e, t, {strokeWidth: 4});
            return S(t, e, !0), n
          },
          "bpmn:TerminateEventDefinition": function (e, t) {
            var n = y(e, t.width, t.height, 8, {strokeWidth: 4, fill: "black"});
            return n
          },
          "bpmn:IntermediateEvent": function (e, t) {
            var n = T("bpmn:Event")(e, t, {strokeWidth: 1});
            return y(e, t.width, t.height, j, {strokeWidth: 1, fill: "none"}), S(t, e), n
          },
          "bpmn:IntermediateCatchEvent": _("bpmn:IntermediateEvent"),
          "bpmn:IntermediateThrowEvent": _("bpmn:IntermediateEvent"),
          "bpmn:Activity": function (e, t, n) {
            return b(e, t.width, t.height, V, n)
          },
          "bpmn:Task": function (e, t) {
            var n = T("bpmn:Activity")(e, t);
            return C(e, t, "center-middle"), P(e, t), n
          },
          "bpmn:ServiceTask": function (e, t) {
            var i = T("bpmn:Task")(e, t), r = n.getScaledPath("TASK_TYPE_SERVICE", {abspos: {x: 12, y: 18}});
            E(e, r, {strokeWidth: 1, fill: "none"});
            var a = n.getScaledPath("TASK_TYPE_SERVICE_FILL", {abspos: {x: 17.2, y: 18}});
            E(e, a, {strokeWidth: 0, stroke: "none", fill: "white"});
            var o = n.getScaledPath("TASK_TYPE_SERVICE", {abspos: {x: 17, y: 22}});
            return E(e, o, {strokeWidth: 1, fill: "white"}), i
          },
          "bpmn:UserTask": function (e, t) {
            var i = T("bpmn:Task")(e, t), r = 15, a = 12, o = n.getScaledPath("TASK_TYPE_USER_1", {
              abspos: {
                x: r,
                y: a
              }
            });
            E(e, o, {strokeWidth: .5, fill: "none"});
            var s = n.getScaledPath("TASK_TYPE_USER_2", {abspos: {x: r, y: a}});
            E(e, s, {strokeWidth: .5, fill: "none"});
            var c = n.getScaledPath("TASK_TYPE_USER_3", {abspos: {x: r, y: a}});
            return E(e, c, {strokeWidth: .5, fill: "black"}), i
          },
          "bpmn:ManualTask": function (e, t) {
            var i = T("bpmn:Task")(e, t), r = n.getScaledPath("TASK_TYPE_MANUAL", {abspos: {x: 17, y: 15}});
            return E(e, r, {strokeWidth: .25, fill: "white", stroke: "black"}), i
          },
          "bpmn:SendTask": function (e, t) {
            var i = T("bpmn:Task")(e, t), r = n.getScaledPath("TASK_TYPE_SEND", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: 21,
              containerHeight: 14,
              position: {mx: .285, my: .357}
            });
            return E(e, r, {strokeWidth: 1, fill: "black", stroke: "white"}), i
          },
          "bpmn:ReceiveTask": function (e, t) {
            var i, r = F(t), a = T("bpmn:Task")(e, t);
            return r.instantiate ? (y(e, 28, 28, 4.4, {strokeWidth: 1}), i = n.getScaledPath("TASK_TYPE_INSTANTIATING_SEND", {
              abspos: {
                x: 7.77,
                y: 9.52
              }
            })) : i = n.getScaledPath("TASK_TYPE_SEND", {
              xScaleFactor: .9,
              yScaleFactor: .9,
              containerWidth: 21,
              containerHeight: 14,
              position: {mx: .3, my: .4}
            }), E(e, i, {strokeWidth: 1}), a
          },
          "bpmn:ScriptTask": function (e, t) {
            var i = T("bpmn:Task")(e, t), r = n.getScaledPath("TASK_TYPE_SCRIPT", {abspos: {x: 15, y: 20}});
            return E(e, r, {strokeWidth: 1}), i
          },
          "bpmn:BusinessRuleTask": function (e, t) {
            var i = T("bpmn:Task")(e, t), r = n.getScaledPath("TASK_TYPE_BUSINESS_RULE_HEADER", {
              abspos: {
                x: 8,
                y: 8
              }
            }), a = E(e, r);
            a.attr({strokeWidth: 1, fill: "AAA"});
            var o = n.getScaledPath("TASK_TYPE_BUSINESS_RULE_MAIN", {abspos: {x: 8, y: 8}}), s = E(e, o);
            return s.attr({strokeWidth: 1}), i
          },
          "bpmn:SubProcess": function (e, t, n) {
            var i = T("bpmn:Activity")(e, t, n), r = F(t), a = d.isExpanded(r), o = !!r.triggeredByEvent;
            return o && i.attr({strokeDasharray: "1,2"}), C(e, t, a ? "center-top" : "center-middle"), a ? P(e, t) : P(e, t, ["SubProcessMarker"]), i
          },
          "bpmn:AdHocSubProcess": function (e, t) {
            return T("bpmn:SubProcess")(e, t)
          },
          "bpmn:Transaction": function (e, n) {
            var i = T("bpmn:SubProcess")(e, n), r = t.style(["no-fill", "no-events"]);
            return b(e, n.width, n.height, V - 2, j, r), i
          },
          "bpmn:CallActivity": function (e, t) {
            return T("bpmn:SubProcess")(e, t, {strokeWidth: 5})
          },
          "bpmn:Participant": function (e, t) {
            var n = T("bpmn:Lane")(e, t), i = d.isExpandedPool(F(t));
            if (i) {
              x(e, [{x: 30, y: 0}, {x: 30, y: t.height}]);
              var r = F(t).name;
              k(e, r, t)
            } else {
              var a = F(t).name;
              A(e, a, {box: t, align: "center-middle"})
            }
            var o = !!F(t).participantMultiplicity;
            return o && T("ParticipantMultiplicityMarker")(e, t), n
          },
          "bpmn:Lane": function (e, t) {
            var n = b(e, t.width, t.height, 0, {fill: "none"}), i = F(t);
            if ("bpmn:Lane" === i.$type) {
              var r = i.name;
              k(e, r, t)
            }
            return n
          },
          "bpmn:InclusiveGateway": function (e, t) {
            var n = w(e, t.width, t.height);
            return y(e, t.width, t.height, .24 * t.height, {strokeWidth: 2.5, fill: "none"}), n
          },
          "bpmn:ExclusiveGateway": function (e, t) {
            var i = w(e, t.width, t.height), r = n.getScaledPath("GATEWAY_EXCLUSIVE", {
              xScaleFactor: .4,
              yScaleFactor: .4,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .32, my: .3}
            });
            return $(t).isMarkerVisible && E(e, r, {strokeWidth: 1, fill: "black"}), i
          },
          "bpmn:ComplexGateway": function (e, t) {
            var i = w(e, t.width, t.height), r = n.getScaledPath("GATEWAY_COMPLEX", {
              xScaleFactor: .5,
              yScaleFactor: .5,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .46, my: .26}
            });
            return E(e, r, {strokeWidth: 1, fill: "black"}), i
          },
          "bpmn:ParallelGateway": function (e, t) {
            var i = w(e, t.width, t.height), r = n.getScaledPath("GATEWAY_PARALLEL", {
              xScaleFactor: .6,
              yScaleFactor: .6,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .46, my: .2}
            });
            return E(e, r, {strokeWidth: 1, fill: "black"}), i
          },
          "bpmn:EventBasedGateway": function (e, t) {
            function i() {
              var i = n.getScaledPath("GATEWAY_EVENT_BASED", {
                xScaleFactor: .18,
                yScaleFactor: .18,
                containerWidth: t.width,
                containerHeight: t.height,
                position: {mx: .36, my: .44}
              });
              E(e, i, {strokeWidth: 2, fill: "none"})
            }

            var r = F(t), a = w(e, t.width, t.height);
            y(e, t.width, t.height, .2 * t.height, {strokeWidth: 1, fill: "none"});
            var o = r.eventGatewayType, s = !!r.instantiate;
            if ("Parallel" === o) {
              var c = n.getScaledPath("GATEWAY_PARALLEL", {
                xScaleFactor: .4,
                yScaleFactor: .4,
                containerWidth: t.width,
                containerHeight: t.height,
                position: {mx: .474, my: .296}
              }), l = E(e, c);
              l.attr({strokeWidth: 1, fill: "none"})
            } else if ("Exclusive" === o) {
              if (!s) {
                var u = y(e, t.width, t.height, .26 * t.height);
                u.attr({strokeWidth: 1, fill: "none"})
              }
              i()
            }
            return a
          },
          "bpmn:Gateway": function (e, t) {
            return w(e, t.width, t.height)
          },
          "bpmn:SequenceFlow": function (e, t) {
            var n = I(t), i = E(e, n, {markerEnd: m("sequenceflow-end")}), r = F(t), a = t.source.businessObject;
            return r.conditionExpression && a.$instanceOf("bpmn:Task") && i.attr({markerStart: m("conditional-flow-marker")}), a["default"] && a.$instanceOf("bpmn:Gateway") && a["default"] === r && i.attr({markerStart: m("conditional-default-flow-marker")}), i
          },
          "bpmn:Association": function (e, t, n) {
            return n = a({strokeDasharray: "1,6", strokeLinecap: "round"}, n || {}), x(e, t.waypoints, n)
          },
          "bpmn:DataInputAssociation": function (e, t) {
            return T("bpmn:Association")(e, t, {markerEnd: m("data-association-end")})
          },
          "bpmn:DataOutputAssociation": function (e, t) {
            return T("bpmn:Association")(e, t, {markerEnd: m("data-association-end")})
          },
          "bpmn:MessageFlow": function (e, t) {
            var i = F(t), r = $(t), a = I(t), o = E(e, a, {
              markerEnd: m("messageflow-end"),
              markerStart: m("messageflow-start"),
              strokeDasharray: "10",
              strokeLinecap: "round",
              strokeWidth: 1
            });
            if (i.messageRef) {
              var s = o.getPointAtLength(o.getTotalLength() / 2), c = n.getScaledPath("MESSAGE_FLOW_MARKER", {
                abspos: {
                  x: s.x,
                  y: s.y
                }
              }), l = {strokeWidth: 1};
              "initiating" === r.messageVisibleKind ? (l.fill = "white", l.stroke = "black") : (l.fill = "#888", l.stroke = "white"), E(e, c, l)
            }
            return o
          },
          "bpmn:DataObject": function (e, t) {
            var i = n.getScaledPath("DATA_OBJECT_PATH", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: .474, my: .296}
            }), r = E(e, i, {fill: "white"}), a = F(t);
            return O(a) && N(e, t), r
          },
          "bpmn:DataObjectReference": _("bpmn:DataObject"),
          "bpmn:DataInput": function (e, t) {
            var i = n.getRawPath("DATA_ARROW"), r = T("bpmn:DataObject")(e, t);
            return E(e, i, {strokeWidth: 1}), r
          },
          "bpmn:DataOutput": function (e, t) {
            var i = n.getRawPath("DATA_ARROW"), r = T("bpmn:DataObject")(e, t);
            return E(e, i, {strokeWidth: 1, fill: "black"}), r
          },
          "bpmn:DataStoreReference": function (e, t) {
            var i = n.getScaledPath("DATA_STORE", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: 0, my: .133}
            }), r = E(e, i, {strokeWidth: 2, fill: "white"});
            return r
          },
          "bpmn:BoundaryEvent": function (e, t) {
            var n = F(t), i = n.cancelActivity, r = {strokeLinecap: "round", strokeWidth: 1};
            i || (r.strokeDasharray = "6");
            var a = T("bpmn:Event")(e, t, r);
            return y(e, t.width, t.height, j, r), S(t, e), a
          },
          "bpmn:Group": function (e, t) {
            return b(e, t.width, t.height, V, {
              strokeWidth: 1,
              strokeDasharray: "8,3,1,3",
              fill: "none",
              pointerEvents: "none"
            })
          },
          label: function (e, t) {
            return D(e, t, "")
          },
          "bpmn:TextAnnotation": function (e, t) {
            var i = {
              fill: "none",
              stroke: "none"
            }, r = b(e, t.width, t.height, 0, 0, i), a = n.getScaledPath("TEXT_ANNOTATION", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: 0, my: 0}
            });
            E(e, a);
            var o = F(t).text || "";
            return A(e, o, {box: t, align: "left-middle", padding: 5}), r
          },
          ParticipantMultiplicityMarker: function (e, t) {
            var i = n.getScaledPath("MARKER_PARALLEL", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: t.width / 2 / t.width, my: (t.height - 15) / t.height}
            });
            E(e, i)
          },
          SubProcessMarker: function (e, t) {
            var i = b(e, 14, 14, 0, {strokeWidth: 1});
            i.transform("translate(" + (t.width / 2 - 7.5) + "," + (t.height - 20) + ")");
            var r = n.getScaledPath("MARKER_SUB_PROCESS", {
              xScaleFactor: 1.5,
              yScaleFactor: 1.5,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: (t.width / 2 - 7.5) / t.width, my: (t.height - 20) / t.height}
            });
            E(e, r)
          },
          ParallelMarker: function (e, t, i) {
            var r = n.getScaledPath("MARKER_PARALLEL", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: (t.width / 2 + i.parallel) / t.width, my: (t.height - 20) / t.height}
            });
            E(e, r)
          },
          SequentialMarker: function (e, t, i) {
            var r = n.getScaledPath("MARKER_SEQUENTIAL", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: (t.width / 2 + i.seq) / t.width, my: (t.height - 19) / t.height}
            });
            E(e, r)
          },
          CompensationMarker: function (e, t, i) {
            var r = n.getScaledPath("MARKER_COMPENSATION", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: (t.width / 2 + i.compensation) / t.width, my: (t.height - 13) / t.height}
            });
            E(e, r, {strokeWidth: 1})
          },
          LoopMarker: function (e, t, i) {
            var r = n.getScaledPath("MARKER_LOOP", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: (t.width / 2 + i.loop) / t.width, my: (t.height - 7) / t.height}
            });
            E(e, r, {strokeWidth: 1, fill: "none", strokeLinecap: "round", strokeMiterlimit: .5})
          },
          AdhocMarker: function (e, t, i) {
            var r = n.getScaledPath("MARKER_ADHOC", {
              xScaleFactor: 1,
              yScaleFactor: 1,
              containerWidth: t.width,
              containerHeight: t.height,
              position: {mx: (t.width / 2 + i.adhoc) / t.width, my: (t.height - 15) / t.height}
            });
            E(e, r, {strokeWidth: 1, fill: "black"})
          }
        };
        e.on("canvas.init", function (e) {
          g(e.svg)
        }), this.drawShape = M, this.drawConnection = R
      }

      var i = e(150), r = e(154), a = e(159), o = e(80), s = e(77), c = e(82), l = e(85), u = e(43), p = e(68), d = e(12), f = u.createLine;
      n.prototype = Object.create(u.prototype), n.$inject = ["eventBus", "styles", "pathMap"], t.exports = n
    }, {12: 12, 150: 150, 154: 154, 159: 159, 43: 43, 68: 68, 77: 77, 80: 80, 82: 82, 85: 85}],
    5: [function (e, t) {
      function n() {
        this.pathMap = {
          EVENT_MESSAGE: {
            d: "m {mx},{my} l 0,{e.y1} l {e.x1},0 l 0,-{e.y1} z l {e.x0},{e.y0} l {e.x0},-{e.y0}",
            height: 36,
            width: 36,
            heightElements: [6, 14],
            widthElements: [10.5, 21]
          },
          EVENT_SIGNAL: {
            d: "M {mx},{my} l {e.x0},{e.y0} l -{e.x1},0 Z",
            height: 36,
            width: 36,
            heightElements: [18],
            widthElements: [10, 20]
          },
          EVENT_ESCALATION: {
            d: "m {mx},{my} c -{e.x1},{e.y0} -{e.x3},{e.y1} -{e.x5},{e.y4} {e.x1},-{e.y3} {e.x3},-{e.y5} {e.x5},-{e.y6} {e.x0},{e.y3} {e.x2},{e.y5} {e.x4},{e.y6} -{e.x0},-{e.y0} -{e.x2},-{e.y1} -{e.x4},-{e.y4} z",
            height: 36,
            width: 36,
            heightElements: [2.382, 4.764, 4.926, 6.589333, 7.146, 13.178667, 19.768],
            widthElements: [2.463, 2.808, 4.926, 5.616, 7.389, 8.424]
          },
          EVENT_CONDITIONAL: {
            d: "M {e.x0},{e.y0} l {e.x1},0 l 0,{e.y2} l -{e.x1},0 Z M {e.x2},{e.y3} l {e.x0},0 M {e.x2},{e.y4} l {e.x0},0 M {e.x2},{e.y5} l {e.x0},0 M {e.x2},{e.y6} l {e.x0},0 M {e.x2},{e.y7} l {e.x0},0 M {e.x2},{e.y8} l {e.x0},0 ",
            height: 36,
            width: 36,
            heightElements: [8.5, 14.5, 18, 11.5, 14.5, 17.5, 20.5, 23.5, 26.5],
            widthElements: [10.5, 14.5, 12.5]
          },
          EVENT_LINK: {
            d: "m {mx},{my} 0,{e.y0} -{e.x1},0 0,{e.y1} {e.x1},0 0,{e.y0} {e.x0},-{e.y2} -{e.x0},-{e.y2} z",
            height: 36,
            width: 36,
            heightElements: [4.4375, 6.75, 7.8125],
            widthElements: [9.84375, 13.5]
          },
          EVENT_ERROR: {
            d: "m {mx},{my} {e.x0},-{e.y0} {e.x1},-{e.y1} {e.x2},{e.y2} {e.x3},-{e.y3} -{e.x4},{e.y4} -{e.x5},-{e.y5} z",
            height: 36,
            width: 36,
            heightElements: [.023, 8.737, 8.151, 16.564, 10.591, 8.714],
            widthElements: [.085, 6.672, 6.97, 4.273, 5.337, 6.636]
          },
          EVENT_CANCEL_45: {
            d: "m {mx},{my} -{e.x1},0 0,{e.x0} {e.x1},0 0,{e.y1} {e.x0},0 0,-{e.y1} {e.x1},0 0,-{e.y0} -{e.x1},0 0,-{e.y1} -{e.x0},0 z",
            height: 36,
            width: 36,
            heightElements: [4.75, 8.5],
            widthElements: [4.75, 8.5]
          },
          EVENT_COMPENSATION: {
            d: "m {mx},{my} {e.x0},-{e.y0} 0,{e.y1} z m {e.x0},0 {e.x0},-{e.y0} 0,{e.y1} z",
            height: 36,
            width: 36,
            heightElements: [5, 10],
            widthElements: [10]
          },
          EVENT_TIMER_WH: {
            d: "M {mx},{my} l {e.x0},-{e.y0} m -{e.x0},{e.y0} l {e.x1},{e.y1} ",
            height: 36,
            width: 36,
            heightElements: [10, 2],
            widthElements: [3, 7]
          },
          EVENT_TIMER_LINE: {
            d: "M {mx},{my} m {e.x0},{e.y0} l -{e.x1},{e.y1} ",
            height: 36,
            width: 36,
            heightElements: [10, 3],
            widthElements: [0, 0]
          },
          EVENT_MULTIPLE: {
            d: "m {mx},{my} {e.x1},-{e.y0} {e.x1},{e.y0} -{e.x0},{e.y1} -{e.x2},0 z",
            height: 36,
            width: 36,
            heightElements: [6.28099, 12.56199],
            widthElements: [3.1405, 9.42149, 12.56198]
          },
          EVENT_PARALLEL_MULTIPLE: {
            d: "m {mx},{my} {e.x0},0 0,{e.y1} {e.x1},0 0,{e.y0} -{e.x1},0 0,{e.y1} -{e.x0},0 0,-{e.y1} -{e.x1},0 0,-{e.y0} {e.x1},0 z",
            height: 36,
            width: 36,
            heightElements: [2.56228, 7.68683],
            widthElements: [2.56228, 7.68683]
          },
          GATEWAY_EXCLUSIVE: {
            d: "m {mx},{my} {e.x0},{e.y0} {e.x1},{e.y0} {e.x2},0 {e.x4},{e.y2} {e.x4},{e.y1} {e.x2},0 {e.x1},{e.y3} {e.x0},{e.y3} {e.x3},0 {e.x5},{e.y1} {e.x5},{e.y2} {e.x3},0 z",
            height: 17.5,
            width: 17.5,
            heightElements: [8.5, 6.5312, -6.5312, -8.5],
            widthElements: [6.5, -6.5, 3, -3, 5, -5]
          },
          GATEWAY_PARALLEL: {
            d: "m {mx},{my} 0,{e.y1} -{e.x1},0 0,{e.y0} {e.x1},0 0,{e.y1} {e.x0},0 0,-{e.y1} {e.x1},0 0,-{e.y0} -{e.x1},0 0,-{e.y1} -{e.x0},0 z",
            height: 30,
            width: 30,
            heightElements: [5, 12.5],
            widthElements: [5, 12.5]
          },
          GATEWAY_EVENT_BASED: {
            d: "m {mx},{my} {e.x0},{e.y0} {e.x0},{e.y1} {e.x1},{e.y2} {e.x2},0 z",
            height: 11,
            width: 11,
            heightElements: [-6, 6, 12, -12],
            widthElements: [9, -3, -12]
          },
          GATEWAY_COMPLEX: {
            d: "m {mx},{my} 0,{e.y0} -{e.x0},-{e.y1} -{e.x1},{e.y2} {e.x0},{e.y1} -{e.x2},0 0,{e.y3} {e.x2},0  -{e.x0},{e.y1} l {e.x1},{e.y2} {e.x0},-{e.y1} 0,{e.y0} {e.x3},0 0,-{e.y0} {e.x0},{e.y1} {e.x1},-{e.y2} -{e.x0},-{e.y1} {e.x2},0 0,-{e.y3} -{e.x2},0 {e.x0},-{e.y1} -{e.x1},-{e.y2} -{e.x0},{e.y1} 0,-{e.y0} -{e.x3},0 z",
            height: 17.125,
            width: 17.125,
            heightElements: [4.875, 3.4375, 2.125, 3],
            widthElements: [3.4375, 2.125, 4.875, 3]
          },
          DATA_OBJECT_PATH: {
            d: "m 0,0 {e.x1},0 {e.x0},{e.y0} 0,{e.y1} -{e.x2},0 0,-{e.y2} {e.x1},0 0,{e.y0} {e.x0},0",
            height: 61,
            width: 51,
            heightElements: [10, 50, 60],
            widthElements: [10, 40, 50, 60]
          },
          DATA_OBJECT_COLLECTION_PATH: {
            d: "m {mx}, {my} m  0 15  l 0 -15 m  4 15  l 0 -15 m  4 15  l 0 -15 ",
            height: 61,
            width: 51,
            heightElements: [12],
            widthElements: [1, 6, 12, 15]
          },
          DATA_ARROW: {
            d: "m 5,9 9,0 0,-3 5,5 -5,5 0,-3 -9,0 z",
            height: 61,
            width: 51,
            heightElements: [],
            widthElements: []
          },
          DATA_STORE: {
            d: "m  {mx},{my} l  0,{e.y2} c  {e.x0},{e.y1} {e.x1},{e.y1}  {e.x2},0 l  0,-{e.y2} c -{e.x0},-{e.y1} -{e.x1},-{e.y1} -{e.x2},0c  {e.x0},{e.y1} {e.x1},{e.y1}  {e.x2},0 m  -{e.x2},{e.y0}c  {e.x0},{e.y1} {e.x1},{e.y1} {e.x2},0m  -{e.x2},{e.y0}c  {e.x0},{e.y1} {e.x1},{e.y1}  {e.x2},0",
            height: 61,
            width: 61,
            heightElements: [7, 10, 45],
            widthElements: [2, 58, 60]
          },
          TEXT_ANNOTATION: {
            d: "m {mx}, {my} m 10,0 l -10,0 l 0,{e.y0} l 10,0",
            height: 30,
            width: 10,
            heightElements: [30],
            widthElements: [10]
          },
          MARKER_SUB_PROCESS: {
            d: "m{mx},{my} m 7,2 l 0,10 m -5,-5 l 10,0",
            height: 10,
            width: 10,
            heightElements: [],
            widthElements: []
          },
          MARKER_PARALLEL: {
            d: "m{mx},{my} m 3,2 l 0,10 m 3,-10 l 0,10 m 3,-10 l 0,10",
            height: 10,
            width: 10,
            heightElements: [],
            widthElements: []
          },
          MARKER_SEQUENTIAL: {
            d: "m{mx},{my} m 0,3 l 10,0 m -10,3 l 10,0 m -10,3 l 10,0",
            height: 10,
            width: 10,
            heightElements: [],
            widthElements: []
          },
          MARKER_COMPENSATION: {
            d: "m {mx},{my} 8,-5 0,10 z m 9,0 8,-5 0,10 z",
            height: 10,
            width: 21,
            heightElements: [],
            widthElements: []
          },
          MARKER_LOOP: {
            d: "m {mx},{my} c 3.526979,0 6.386161,-2.829858 6.386161,-6.320661 0,-3.490806 -2.859182,-6.320661 -6.386161,-6.320661 -3.526978,0 -6.38616,2.829855 -6.38616,6.320661 0,1.745402 0.714797,3.325567 1.870463,4.469381 0.577834,0.571908 1.265885,1.034728 2.029916,1.35457 l -0.718163,-3.909793 m 0.718163,3.909793 -3.885211,0.802902",
            height: 13.9,
            width: 13.7,
            heightElements: [],
            widthElements: []
          },
          MARKER_ADHOC: {
            d: "m {mx},{my} m 0.84461,2.64411 c 1.05533,-1.23780996 2.64337,-2.07882 4.29653,-1.97997996 2.05163,0.0805 3.85579,1.15803 5.76082,1.79107 1.06385,0.34139996 2.24454,0.1438 3.18759,-0.43767 0.61743,-0.33642 1.2775,-0.64078 1.7542,-1.17511 0,0.56023 0,1.12046 0,1.6807 -0.98706,0.96237996 -2.29792,1.62393996 -3.6918,1.66181996 -1.24459,0.0927 -2.46671,-0.2491 -3.59505,-0.74812 -1.35789,-0.55965 -2.75133,-1.33436996 -4.27027,-1.18121996 -1.37741,0.14601 -2.41842,1.13685996 -3.44288,1.96782996 z",
            height: 4,
            width: 15,
            heightElements: [],
            widthElements: []
          },
          TASK_TYPE_SEND: {
            d: "m {mx},{my} l 0,{e.y1} l {e.x1},0 l 0,-{e.y1} z l {e.x0},{e.y0} l {e.x0},-{e.y0}",
            height: 14,
            width: 21,
            heightElements: [6, 14],
            widthElements: [10.5, 21]
          },
          TASK_TYPE_SCRIPT: {
            d: "m {mx},{my} c 9.966553,-6.27276 -8.000926,-7.91932 2.968968,-14.938 l -8.802728,0 c -10.969894,7.01868 6.997585,8.66524 -2.968967,14.938 z m -7,-12 l 5,0 m -4.5,3 l 4.5,0 m -3,3 l 5,0m -4,3 l 5,0",
            height: 15,
            width: 12.6,
            heightElements: [6, 14],
            widthElements: [10.5, 21]
          },
          TASK_TYPE_USER_1: {d: "m {mx},{my} c 0.909,-0.845 1.594,-2.049 1.594,-3.385 0,-2.554 -1.805,-4.62199999 -4.357,-4.62199999 -2.55199998,0 -4.28799998,2.06799999 -4.28799998,4.62199999 0,1.348 0.974,2.562 1.89599998,3.405 -0.52899998,0.187 -5.669,2.097 -5.794,4.7560005 v 6.718 h 17 v -6.718 c 0,-2.2980005 -5.5279996,-4.5950005 -6.0509996,-4.7760005 zm -8,6 l 0,5.5 m 11,0 l 0,-5"},
          TASK_TYPE_USER_2: {d: "m {mx},{my} m 2.162,1.009 c 0,2.4470005 -2.158,4.4310005 -4.821,4.4310005 -2.66499998,0 -4.822,-1.981 -4.822,-4.4310005 "},
          TASK_TYPE_USER_3: {d: "m {mx},{my} m -6.9,-3.80 c 0,0 2.25099998,-2.358 4.27399998,-1.177 2.024,1.181 4.221,1.537 4.124,0.965 -0.098,-0.57 -0.117,-3.79099999 -4.191,-4.13599999 -3.57499998,0.001 -4.20799998,3.36699999 -4.20699998,4.34799999 z"},
          TASK_TYPE_MANUAL: {d: "m {mx},{my} c 0.234,-0.01 5.604,0.008 8.029,0.004 0.808,0 1.271,-0.172 1.417,-0.752 0.227,-0.898 -0.334,-1.314 -1.338,-1.316 -2.467,-0.01 -7.886,-0.004 -8.108,-0.004 -0.014,-0.079 0.016,-0.533 0,-0.61 0.195,-0.042 8.507,0.006 9.616,0.002 0.877,-0.007 1.35,-0.438 1.353,-1.208 0.003,-0.768 -0.479,-1.09 -1.35,-1.091 -2.968,-0.002 -9.619,-0.013 -9.619,-0.013 v -0.591 c 0,0 5.052,-0.016 7.225,-0.016 0.888,-0.002 1.354,-0.416 1.351,-1.193 -0.006,-0.761 -0.492,-1.196 -1.361,-1.196 -3.473,-0.005 -10.86,-0.003 -11.0829995,-0.003 -0.022,-0.047 -0.045,-0.094 -0.069,-0.139 0.3939995,-0.319 2.0409995,-1.626 2.4149995,-2.017 0.469,-0.4870005 0.519,-1.1650005 0.162,-1.6040005 -0.414,-0.511 -0.973,-0.5 -1.48,-0.236 -1.4609995,0.764 -6.5999995,3.6430005 -7.7329995,4.2710005 -0.9,0.499 -1.516,1.253 -1.882,2.19 -0.37000002,0.95 -0.17,2.01 -0.166,2.979 0.004,0.718 -0.27300002,1.345 -0.055,2.063 0.629,2.087 2.425,3.312 4.859,3.318 4.6179995,0.014 9.2379995,-0.139 13.8569995,-0.158 0.755,-0.004 1.171,-0.301 1.182,-1.033 0.012,-0.754 -0.423,-0.969 -1.183,-0.973 -1.778,-0.01 -5.824,-0.004 -6.04,-0.004 10e-4,-0.084 0.003,-0.586 10e-4,-0.67 z"},
          TASK_TYPE_INSTANTIATING_SEND: {d: "m {mx},{my} l 0,8.4 l 12.6,0 l 0,-8.4 z l 6.3,3.6 l 6.3,-3.6"},
          TASK_TYPE_SERVICE: {d: "m {mx},{my} v -1.71335 c 0.352326,-0.0705 0.703932,-0.17838 1.047628,-0.32133 0.344416,-0.14465 0.665822,-0.32133 0.966377,-0.52145 l 1.19431,1.18005 1.567487,-1.57688 -1.195028,-1.18014 c 0.403376,-0.61394 0.683079,-1.29908 0.825447,-2.01824 l 1.622133,-0.01 v -2.2196 l -1.636514,0.01 c -0.07333,-0.35153 -0.178319,-0.70024 -0.323564,-1.04372 -0.145244,-0.34406 -0.321407,-0.6644 -0.522735,-0.96217 l 1.131035,-1.13631 -1.583305,-1.56293 -1.129598,1.13589 c -0.614052,-0.40108 -1.302883,-0.68093 -2.022633,-0.82247 l 0.0093,-1.61852 h -2.241173 l 0.0042,1.63124 c -0.353763,0.0736 -0.705369,0.17977 -1.049785,0.32371 -0.344415,0.14437 -0.665102,0.32092 -0.9635006,0.52046 l -1.1698628,-1.15823 -1.5667691,1.5792 1.1684265,1.15669 c -0.4026573,0.61283 -0.68308,1.29797 -0.8247287,2.01713 l -1.6588041,0.003 v 2.22174 l 1.6724648,-0.006 c 0.073327,0.35077 0.1797598,0.70243 0.3242851,1.04472 0.1452428,0.34448 0.3214064,0.6644 0.5227339,0.96066 l -1.1993431,1.19723 1.5840256,1.56011 1.1964668,-1.19348 c 0.6140517,0.40346 1.3028827,0.68232 2.0233517,0.82331 l 7.19e-4,1.69892 h 2.226848 z m 0.221462,-3.9957 c -1.788948,0.7502 -3.8576,-0.0928 -4.6097055,-1.87438 -0.7521065,-1.78321 0.090598,-3.84627 1.8802645,-4.59604 1.78823,-0.74936 3.856881,0.0929 4.608987,1.87437 0.752106,1.78165 -0.0906,3.84612 -1.879546,4.59605 z"},
          TASK_TYPE_SERVICE_FILL: {d: "m {mx},{my} c -1.788948,0.7502 -3.8576,-0.0928 -4.6097055,-1.87438 -0.7521065,-1.78321 0.090598,-3.84627 1.8802645,-4.59604 1.78823,-0.74936 3.856881,0.0929 4.608987,1.87437 0.752106,1.78165 -0.0906,3.84612 -1.879546,4.59605 z"},
          TASK_TYPE_BUSINESS_RULE_HEADER: {d: "m {mx},{my} 0,4 20,0 0,-4 z"},
          TASK_TYPE_BUSINESS_RULE_MAIN: {d: "m {mx},{my} 0,12 20,0 0,-12 zm 0,8 l 20,0 m -13,-4 l 0,8"},
          MESSAGE_FLOW_MARKER: {d: "m {mx},{my} m -10.5 ,-7 l 0,14 l 21,0 l 0,-14 z l 10.5,6 l 10.5,-6"}
        }, this.getRawPath = function (e) {
          return this.pathMap[e].d
        }, this.getScaledPath = function (e, t) {
          var n, r, a = this.pathMap[e];
          t.abspos ? (n = t.abspos.x, r = t.abspos.y) : (n = t.containerWidth * t.position.mx, r = t.containerHeight * t.position.my);
          var o = {};
          if (t.position) {
            for (var s = t.containerHeight / a.height * t.yScaleFactor, c = t.containerWidth / a.width * t.xScaleFactor, l = 0; l < a.heightElements.length; l++)o["y" + l] = a.heightElements[l] * s;
            for (var u = 0; u < a.widthElements.length; u++)o["x" + u] = a.widthElements[u] * c
          }
          var p = i.format(a.d, {mx: n, my: r, e: o});
          return p
        }
      }

      var i = e(71);
      t.exports = n
    }, {71: 71}],
    6: [function (e, t) {
      t.exports = {renderer: ["type", e(4)], pathMap: ["type", e(5)]}
    }, {4: 4, 5: 5}],
    7: [function (e, t) {
      function n(e, t) {
        return a({id: e.id, type: e.$type, businessObject: e}, t)
      }

      function i(e) {
        return o(e, function (e) {
          return {x: e.x, y: e.y}
        })
      }

      function r(e, t, n, i) {
        this._eventBus = e, this._canvas = t, this._elementFactory = n, this._elementRegistry = i
      }

      var a = e(159), o = e(83), s = e(13), c = s.hasExternalLabel, l = s.getExternalLabelBounds, u = e(12).isExpanded, p = e(10).elementToString;
      r.$inject = ["eventBus", "canvas", "elementFactory", "elementRegistry"], t.exports = r, r.prototype.add = function (e, t) {
        var r, a = e.di;
        if (a.$instanceOf("bpmndi:BPMNPlane"))r = this._elementFactory.createRoot(n(e)), this._canvas.setRootElement(r); else if (a.$instanceOf("bpmndi:BPMNShape")) {
          var o = !u(e), s = t && (t.hidden || t.collapsed), l = e.di.bounds;
          r = this._elementFactory.createShape(n(e, {
            collapsed: o,
            hidden: s,
            x: Math.round(l.x),
            y: Math.round(l.y),
            width: Math.round(l.width),
            height: Math.round(l.height)
          })), this._canvas.addShape(r, t)
        } else {
          if (!a.$instanceOf("bpmndi:BPMNEdge"))throw new Error("unknown di " + p(a) + " for element " + p(e));
          var d = this._getSource(e), f = this._getTarget(e);
          r = this._elementFactory.createConnection(n(e, {
            source: d,
            target: f,
            waypoints: i(e.di.waypoint)
          })), this._canvas.addConnection(r, t)
        }
        return c(e) && this.addLabel(e, r), this._eventBus.fire("bpmnElement.added", {element: r}), r
      }, r.prototype.addLabel = function (e, t) {
        var i = l(e, t), r = this._elementFactory.createLabel(n(e, {
          id: e.id + "_label",
          labelTarget: t,
          type: "label",
          hidden: t.hidden,
          x: Math.round(i.x),
          y: Math.round(i.y),
          width: Math.round(i.width),
          height: Math.round(i.height)
        }));
        return this._canvas.addShape(r, t.parent)
      }, r.prototype._getEnd = function (e, t) {
        var n, i, r = e.$type;
        if (i = e[t + "Ref"], "source" === t && "bpmn:DataInputAssociation" === r && (i = i && i[0]), ("source" === t && "bpmn:DataOutputAssociation" === r || "target" === t && "bpmn:DataInputAssociation" === r) && (i = e.$parent), n = i && this._getElement(i))return n;
        throw new Error(i ? "element " + p(i) + " referenced by " + p(e) + "#" + t + "Ref not yet drawn" : p(e) + "#" + t + "Ref not specified")
      }, r.prototype._getSource = function (e) {
        return this._getEnd(e, "source")
      }, r.prototype._getTarget = function (e) {
        return this._getEnd(e, "target")
      }, r.prototype._getElement = function (e) {
        return this._elementRegistry.get(e.id)
      }
    }, {10: 10, 12: 12, 13: 13, 159: 159, 83: 83}],
    8: [function (e, t) {
      function n(e, t) {
        return e.$instanceOf(t)
      }

      function i(e) {
        return o(e.rootElements, function (e) {
          return n(e, "bpmn:Process") || n(e, "bpmn:Collaboration")
        })
      }

      function r(e) {
        function t(e, t) {
          return function (n) {
            e(n, t)
          }
        }

        function r(t, n) {
          var i = t.gfx;
          if (i)throw new Error("already rendered " + l(t));
          return e.element(t, n)
        }

        function o(t, n) {
          return e.root(t, n)
        }

        function c(e, t) {
          try {
            return e.di && r(e, t)
          } catch (n) {
            p(n.message, {element: e, error: n}), console.error("failed to import " + l(e)), console.error(n)
          }
        }

        function p(t, n) {
          e.error(t, n)
        }

        function d(e) {
          var t = e.bpmnElement;
          t ? t.di ? p("multiple DI elements defined for " + l(t), {element: t}) : (u.bind(t, "di"), t.di = e) : p("no bpmnElement referenced in " + l(e), {element: e})
        }

        function f(e) {
          h(e.plane)
        }

        function h(e) {
          d(e), s(e.planeElement, m)
        }

        function m(e) {
          d(e)
        }

        function g(e, t) {
          var r = e.diagrams;
          if (t && -1 === r.indexOf(t))throw new Error("diagram not part of bpmn:Definitions");
          if (!t && r && r.length && (t = r[0]), t) {
            f(t);
            var a = t.plane;
            if (!a)throw new Error("no plane for " + l(t));
            var s = a.bpmnElement;
            if (!s) {
              if (s = i(e), !s)return p("no process or collaboration present to display");
              p("correcting missing bpmnElement on " + l(a) + " to " + l(s)), a.bpmnElement = s, d(a)
            }
            var c = o(s, a);
            if (n(s, "bpmn:Process"))y(s, c); else {
              if (!n(s, "bpmn:Collaboration"))throw new Error("unsupported bpmnElement for " + l(a) + " : " + l(s));
              V(s, c), b(e.rootElements, c)
            }
            v(U)
          }
        }

        function v(e) {
          s(e, function (e) {
            e()
          })
        }

        function y(e, t) {
          $(e, t), C(e.ioSpecification, t), A(e.artifacts, t), j.push(e)
        }

        function b(e) {
          var i = a(e, function (e) {
            return n(e, "bpmn:Process") && e.laneSets && -1 === j.indexOf(e)
          });
          i.forEach(t(y))
        }

        function w(e, t) {
          c(e, t)
        }

        function x(e, n) {
          s(e, t(w, n))
        }

        function E(e, t) {
          c(e, t)
        }

        function _(e, t) {
          c(e, t)
        }

        function T(e, t) {
          c(e, t)
        }

        function S(e, t) {
          c(e, t)
        }

        function A(e, t) {
          s(e, function (e) {
            n(e, "bpmn:Association") ? U.push(function () {
              S(e, t)
            }) : S(e, t)
          })
        }

        function C(e, n) {
          e && (s(e.dataInputs, t(_, n)), s(e.dataOutputs, t(T, n)))
        }

        function D(e, t) {
          $(e, t), A(e.artifacts, t)
        }

        function k(e, t) {
          var i = c(e, t);
          n(e, "bpmn:SubProcess") && D(e, i || t)
        }

        function I(e, t) {
          c(e, t)
        }

        function P(e, t) {
          c(e, t)
        }

        function M(e, t) {
          c(e, t)
        }

        function R(e, t) {
          var n = c(e, t);
          if (e.childLaneSet)N(e.childLaneSet, n || t); else {
            var i = a(e.flowNodeRef, function (e) {
              return "bpmn:BoundaryEvent" !== e.$type
            });
            L(i, n || t)
          }
        }

        function N(e, n) {
          s(e.lanes, t(R, n))
        }

        function O(e, n) {
          s(e, t(N, n))
        }

        function $(e, t) {
          e.laneSets ? (O(e.laneSets, t), F(e.flowElements)) : L(e.flowElements, t)
        }

        function F(e, t) {
          s(e, function (e) {
            n(e, "bpmn:SequenceFlow") ? U.push(function () {
              I(e, t)
            }) : n(e, "bpmn:BoundaryEvent") ? U.unshift(function () {
              M(e, t)
            }) : n(e, "bpmn:DataObject") || (n(e, "bpmn:DataStoreReference") ? P(e, t) : n(e, "bpmn:DataObjectReference") && P(e, t))
          })
        }

        function L(e, i) {
          s(e, function (e) {
            n(e, "bpmn:SequenceFlow") ? U.push(function () {
              I(e, i)
            }) : n(e, "bpmn:BoundaryEvent") ? U.unshift(function () {
              M(e, i)
            }) : n(e, "bpmn:FlowNode") ? (k(e, i), n(e, "bpmn:Activity") && (C(e.ioSpecification, i), U.push(function () {
              s(e.dataInputAssociations, t(E, i)), s(e.dataOutputAssociations, t(E, i))
            }))) : n(e, "bpmn:DataObject") || (n(e, "bpmn:DataStoreReference") ? P(e, i) : n(e, "bpmn:DataObjectReference") ? P(e, i) : p("unrecognized flowElement " + l(e) + " in context " + (i ? l(i.businessObject) : null), {
              element: e,
              context: i
            }))
          })
        }

        function B(e, t) {
          var n = c(e, t), i = e.processRef;
          i && y(i, n || t)
        }

        function V(e) {
          s(e.participants, t(B)), A(e.artifacts), U.push(function () {
            x(e.messageFlows)
          })
        }

        var j = [], U = [];
        return {handleDefinitions: g}
      }

      var a = e(78), o = e(79), s = e(80), c = e(185), l = e(10).elementToString, u = new c({
        name: "bpmnElement",
        enumerable: !0
      }, {name: "di"});
      t.exports = r
    }, {10: 10, 185: 185, 78: 78, 79: 79, 80: 80}],
    9: [function (e, t) {
      function n(e, t, n) {
        function r(e) {
          var t = {
            root: function (e) {
              return o.add(e)
            }, element: function (e, t) {
              return o.add(e, t)
            }, error: function (e, t) {
              c.push({message: e, context: t})
            }
          }, n = new i(t);
          n.handleDefinitions(e)
        }

        var a, o = e.get("bpmnImporter"), s = e.get("eventBus"), c = [];
        s.fire("import.start");
        try {
          r(t)
        } catch (l) {
          a = l
        }
        s.fire(a ? "import.error" : "import.success", {error: a, warnings: c}), n(a, c)
      }

      var i = e(8);
      t.exports.importBpmnDiagram = n
    }, {8: 8}],
    10: [function (e, t) {
      t.exports.elementToString = function (e) {
        return e ? "<" + e.$type + (e.id ? ' id="' + e.id : "") + '" />' : "<null>"
      }
    }, {}],
    11: [function (e, t) {
      t.exports = {bpmnImporter: ["type", e(7)]}
    }, {7: 7}],
    12: [function (e, t) {
      t.exports.isExpandedPool = function (e) {
        return !!e.processRef
      }, t.exports.isExpanded = function (e) {
        var t = !(e.$instanceOf("bpmn:SubProcess") || e.$instanceOf("bpmn:CallActivity")), n = t || e.di.isExpanded;
        return n
      }
    }, {}],
    13: [function (e, t) {
      var n = e(159), i = t.exports.DEFAULT_LABEL_SIZE = {width: 90, height: 20};
      t.exports.hasExternalLabel = function (e) {
        return e.$instanceOf("bpmn:Event") || e.$instanceOf("bpmn:Gateway") || e.$instanceOf("bpmn:DataStoreReference") || e.$instanceOf("bpmn:DataObjectReference") || e.$instanceOf("bpmn:SequenceFlow") || e.$instanceOf("bpmn:MessageFlow")
      };
      var r = t.exports.getWaypointsMid = function (e) {
        var t = e.length / 2 - 1, n = e[Math.floor(t)], i = e[Math.ceil(t + .01)];
        return {x: n.x + (i.x - n.x) / 2, y: n.y + (i.y - n.y) / 2}
      }, a = t.exports.getExternalLabelMid = function (e) {
        return e.waypoints ? r(e.waypoints) : {x: e.x + e.width / 2, y: e.y + e.height + i.height / 2}
      };
      t.exports.getExternalLabelBounds = function (e, t) {
        var r, o, s, c = e.di, l = c.label;
        return l && l.bounds ? (s = l.bounds, o = {
          width: Math.max(i.width, s.width),
          height: s.height
        }, r = {x: s.x + s.width / 2, y: s.y + s.height / 2}) : (r = a(t), o = i), n({
          x: r.x - o.width / 2,
          y: r.y - o.height / 2
        }, o)
      }
    }, {159: 159}],
    14: [function (e, t) {
      t.exports = e(16)
    }, {16: 16}],
    15: [function (e, t) {
      function n(e, t) {
        o.call(this, e, t)
      }

      var i = e(156), r = e(151), a = e(159), o = e(22), s = e(18), c = e(19);
      n.prototype = Object.create(o.prototype), t.exports = n, n.prototype.fromXML = function (e, t, n, o) {
        i(t) || (o = n, n = t, t = "bpmn:Definitions"), r(n) && (o = n, n = {});
        var c = new s(a({model: this, lax: !0}, n)), l = c.handler(t);
        c.fromXML(e, l, o)
      }, n.prototype.toXML = function (e, t, n) {
        r(t) && (n = t, t = {});
        var i = new c(t);
        try {
          var a = i.toXML(e);
          n(null, a)
        } catch (o) {
          n(o)
        }
      }
    }, {151: 151, 156: 156, 159: 159, 18: 18, 19: 19, 22: 22}],
    16: [function (e, t) {
      var n = e(159), i = e(15), r = {bpmn: e(31), bpmndi: e(32), dc: e(33), di: e(34)};
      t.exports = function (e, t) {
        return new i(n({}, r, e), t)
      }
    }, {15: 15, 159: 159, 31: 31, 32: 32, 33: 33, 34: 34}],
    17: [function (e, t) {
      function n(e) {
        return e.charAt(0).toUpperCase() + e.slice(1)
      }

      function i(e) {
        return e.charAt(0).toLowerCase() + e.slice(1)
      }

      function r(e) {
        return e.xml && "lowerCase" === e.xml.tagAlias
      }

      t.exports.aliasToName = function (e, t) {
        return r(t) ? n(e) : e
      }, t.exports.nameToAlias = function (e, t) {
        return r(t) ? i(e) : e
      }, t.exports.DEFAULT_NS_MAP = {xsi: "http://www.w3.org/2001/XMLSchema-instance"}, t.exports.XSI_TYPE = "xsi:type"
    }, {}],
    18: [function (e, t) {
      function n(e) {
        var t = e.attributes;
        return m(t, function (e, t) {
          var n, i;
          return t.local ? (i = _(t.name, t.prefix), n = i.name) : n = t.prefix, e[n] = t.value, e
        }, {})
      }

      function i(e, t, n) {
        var i, r = _(t.value), a = e.ns[r.prefix || ""], o = r.localName, s = a && n.getPackage(a);
        s && (i = s.xml && s.xml.typePrefix, i && 0 === o.indexOf(i) && (o = o.slice(i.length)), t.value = s.prefix + ":" + o)
      }

      function r(e, t, n) {
        var a, o;
        if (a = e.uri || n) {
          var s = t.getPackage(a);
          o = s ? s.prefix : e.prefix, e.prefix = o, e.uri = a
        }
        g(e.attributes, function (n) {
          n.uri === k && "type" === n.local && i(e, n, t), r(n, t, null)
        })
      }

      function a(e) {
        y(this, e);
        var t = this.elementsById = {}, n = this.references = [], i = this.warnings = [];
        this.addReference = function (e) {
          n.push(e)
        }, this.addElement = function (e, n) {
          if (!e || !n)throw new Error("[xml-reader] id or ctx must not be null");
          t[e] = n
        }, this.addWarning = function (e) {
          i.push(e)
        }
      }

      function o() {
      }

      function s() {
      }

      function c() {
      }

      function l(e, t) {
        this.property = e, this.context = t
      }

      function u(e, t) {
        this.element = t, this.propertyDesc = e
      }

      function p() {
      }

      function d(e, t, n) {
        this.model = e, this.type = e.getType(t), this.context = n
      }

      function f(e, t, n) {
        this.model = e, this.context = n
      }

      function h(e) {
        e instanceof E && (e = {model: e}), y(this, {lax: !1}, e)
      }

      var m = e(84), g = e(80), v = e(79), y = e(159), b = e(88), w = e(21), x = e(20).parser, E = e(22), _ = e(27).parseName, T = e(30), S = T.coerceType, A = T.isSimple, C = e(17), D = C.XSI_TYPE, k = C.DEFAULT_NS_MAP.xsi, I = C.aliasToName;
      o.prototype.handleEnd = function () {
      }, o.prototype.handleText = function () {
      }, o.prototype.handleNode = function () {
      }, s.prototype = new o, s.prototype.handleNode = function () {
        return this
      }, c.prototype = new o, c.prototype.handleText = function (e) {
        this.body = (this.body || "") + e
      }, l.prototype = new c, l.prototype.handleNode = function (e) {
        if (this.element)throw new Error("expected no sub nodes");
        return this.element = this.createReference(e), this
      }, l.prototype.handleEnd = function () {
        this.element.id = this.body
      }, l.prototype.createReference = function () {
        return {property: this.property.ns.name, id: ""}
      }, u.prototype = new c, u.prototype.handleEnd = function () {
        var e = this.body, t = this.element, n = this.propertyDesc;
        e = S(n.type, e), n.isMany ? t.get(n.name).push(e) : t.set(n.name, e)
      }, p.prototype = Object.create(c.prototype), p.prototype.handleNode = function (e) {
        var t, n = this, i = this.element;
        return i ? n = this.handleChild(e) : (i = this.element = this.createElement(e), t = i.id, t && this.context.addElement(t, i)), n
      }, d.prototype = new p, d.prototype.addReference = function (e) {
        this.context.addReference(e)
      }, d.prototype.handleEnd = function () {
        var e = this.body, t = this.element, n = t.$descriptor, i = n.bodyProperty;
        i && void 0 !== e && (e = S(i.type, e), t.set(i.name, e))
      }, d.prototype.createElement = function (e) {
        var t = n(e), i = this.type, r = i.$descriptor, a = this.context, o = new i({});
        return g(t, function (e, t) {
          var n = r.propertiesByName[t];
          n && n.isReference ? a.addReference({
            element: o,
            property: n.ns.name,
            id: e
          }) : (n && (e = S(n.type, e)), o.set(t, e))
        }), o
      }, d.prototype.getPropertyForNode = function (e) {
        var t, n, i, r = _(e.local, e.prefix), a = this.type, o = this.model, s = a.$descriptor, c = r.name, l = s.propertiesByName[c];
        if (l)return l.serialize === D && (i = e.attributes[D]) ? (t = i.value, n = o.getType(t), y({}, l, {effectiveType: n.$descriptor.name})) : l;
        var u = o.getPackage(r.prefix);
        if (u) {
          if (t = r.prefix + ":" + I(r.localName, s.$pkg), n = o.getType(t), l = v(s.properties, function (e) {
              return !e.isVirtual && !e.isReference && !e.isAttribute && n.hasType(e.type)
            }))return y({}, l, {effectiveType: n.$descriptor.name})
        } else if (l = v(s.properties, function (e) {
            return !e.isReference && !e.isAttribute && "Element" === e.type
          }))return l;
        throw new Error("unrecognized element <" + r.name + ">")
      }, d.prototype.toString = function () {
        return "ElementDescriptor[" + this.type.$descriptor.name + "]"
      }, d.prototype.valueHandler = function (e, t) {
        return new u(e, t)
      }, d.prototype.referenceHandler = function (e) {
        return new l(e, this.context)
      }, d.prototype.handler = function (e) {
        return "Element" === e ? new f(this.model, e, this.context) : new d(this.model, e, this.context)
      }, d.prototype.handleChild = function (e) {
        var t, n, i, r;
        if (t = this.getPropertyForNode(e), i = this.element, n = t.effectiveType || t.type, A(n))return this.valueHandler(t, i);
        r = t.isReference ? this.referenceHandler(t).handleNode(e) : this.handler(n).handleNode(e);
        var a = r.element;
        return void 0 !== a && (t.isMany ? i.get(t.name).push(a) : i.set(t.name, a), t.isReference ? (y(a, {element: i}), this.context.addReference(a)) : a.$parent = i), r
      }, f.prototype = Object.create(p.prototype), f.prototype.createElement = function (e) {
        var t = e.name, n = e.prefix, i = e.ns[n], r = e.attributes;
        return this.model.createAny(t, i, r)
      }, f.prototype.handleChild = function (e) {
        var t, n = new f(this.model, "Element", this.context).handleNode(e), i = this.element, r = n.element;
        return void 0 !== r && (t = i.$children = i.$children || [], t.push(r), r.$parent = i), n
      }, f.prototype.handleText = function (e) {
        this.body = this.body || "" + e
      }, f.prototype.handleEnd = function () {
        this.body && (this.element.$body = this.body)
      }, h.prototype.fromXML = function (e, t, n) {
        function i() {
          var e, t, n = d.elementsById, i = d.references;
          for (e = 0; t = i[e]; e++) {
            var r = t.element, a = n[t.id], o = r.$descriptor.propertiesByName[t.property];
            if (a || d.addWarning({
                message: "unresolved reference <" + t.id + ">",
                element: t.element,
                property: t.property,
                value: t.id
              }), o.isMany) {
              var s = r.get(o.name), c = s.indexOf(t);
              a ? s[c] = a : s.splice(c, 1)
            } else r.set(o.name, a)
          }
        }

        function o() {
          h.pop().handleEnd()
        }

        function c(e) {
          var t = h.peek();
          r(e, u);
          try {
            h.push(t.handleNode(e))
          } catch (n) {
            var i = this.line, a = this.column, o = "unparsable content <" + e.name + "> detected\n	line: " + i + "\n	column: " + a + "\n	nested error: " + n.message;
            if (!p)throw console.error("could not parse document"), console.error(n), new Error(o);
            d.addWarning({message: o, error: n}), console.warn("could not parse node"), console.warn(n), h.push(new s)
          }
        }

        function l(e) {
          h.peek().handleText(e)
        }

        var u = this.model, p = this.lax, d = new a({parseRoot: t}), f = new x(!0, {xmlns: !0, trim: !0}), h = new w;
        t.context = d, h.push(t), f.onopentag = c, f.oncdata = f.ontext = l, f.onclosetag = o, f.onend = i, b(function () {
          var i;
          try {
            f.write(e).close()
          } catch (r) {
            i = r
          }
          n(i, i ? void 0 : t.element, d)
        })
      }, h.prototype.handler = function (e) {
        return new d(this.model, e)
      }, t.exports = h, t.exports.ElementHandler = d
    }, {159: 159, 17: 17, 20: 20, 21: 21, 22: 22, 27: 27, 30: 30, 79: 79, 80: 80, 84: 84, 88: 88}],
    19: [function (e, t) {
      function n(e) {
        return b(e) ? e : (e.prefix ? e.prefix + ":" : "") + e.localName
      }

      function i(e, t) {
        return t.isGeneric ? t.name : x({localName: S(t.ns.localName, t.$pkg)}, e)
      }

      function r(e, t) {
        return x({localName: t.ns.localName}, e)
      }

      function a(e) {
        var t = e.$descriptor;
        return w(t.properties, function (t) {
          var n = t.name;
          if (!e.hasOwnProperty(n))return !1;
          var i = e[n];
          return i === t["default"] ? !1 : t.isMany ? i.length : !0
        })
      }

      function o(e) {
        return e = b(e) ? e : "" + e, e.replace(C, function (e) {
          return "&#" + I[e] + ";"
        })
      }

      function s(e) {
        return w(e, function (e) {
          return e.isAttr
        })
      }

      function c(e) {
        return w(e, function (e) {
          return !e.isAttr
        })
      }

      function l(e, t) {
        this.ns = t
      }

      function u() {
      }

      function p(e) {
        this.ns = e
      }

      function d(e, t) {
        this.body = [], this.attrs = [], this.parent = e, this.ns = t
      }

      function f(e, t) {
        d.call(this, e, t)
      }

      function h() {
        this.value = "", this.write = function (e) {
          this.value += e
        }
      }

      function m(e, t) {
        var n = [""];
        this.append = function (t) {
          return e.write(t), this
        }, this.appendNewLine = function () {
          return t && e.write("\n"), this
        }, this.appendIndent = function () {
          return t && e.write(n.join("  ")), this
        }, this.indent = function () {
          return n.push(""), this
        }, this.unindent = function () {
          return n.pop(), this
        }
      }

      function g(e) {
        function t(t, n) {
          var i = n || new h, r = new m(i, e.format);
          return e.preamble && r.append(A), (new d).build(t).serializeTo(r), n ? void 0 : i.value
        }

        return e = x({format: !1, preamble: !0}, e || {}), {toXML: t}
      }

      var v = e(83), y = e(80), b = e(156), w = e(78), x = e(159), E = e(30), _ = e(27).parseName, T = e(17), S = T.nameToAlias, A = '<?xml version="1.0" encoding="UTF-8"?>\n', C = /(<|>|'|"|&|\n\r|\n)/g, D = T.DEFAULT_NS_MAP, k = T.XSI_TYPE, I = {
        "\n": "10",
        "\n\r": "10",
        '"': "34",
        "'": "39",
        "<": "60",
        ">": "62",
        "&": "38"
      };
      l.prototype.build = function (e) {
        return this.element = e, this
      }, l.prototype.serializeTo = function (e) {
        e.appendIndent().append("<" + n(this.ns) + ">" + this.element.id + "</" + n(this.ns) + ">").appendNewLine()
      }, u.prototype.serializeValue = u.prototype.serializeTo = function (e) {
        var t = this.escape;
        t && e.append("<![CDATA["), e.append(this.value), t && e.append("]]>")
      }, u.prototype.build = function (e, t) {
        return this.value = t, "String" === e.type && C.test(t) && (this.escape = !0), this
      }, p.prototype = new u, p.prototype.serializeTo = function (e) {
        e.appendIndent().append("<" + n(this.ns) + ">"), this.serializeValue(e), e.append("</" + n(this.ns) + ">").appendNewLine()
      }, d.prototype.build = function (e) {
        this.element = e;
        var t = this.parseNsAttributes(e);
        if (this.ns || (this.ns = this.nsTagName(e.$descriptor)), e.$descriptor.isGeneric)this.parseGeneric(e); else {
          var n = a(e);
          this.parseAttributes(s(n)), this.parseContainments(c(n)), this.parseGenericAttributes(e, t)
        }
        return this
      }, d.prototype.nsTagName = function (e) {
        var t = this.logNamespaceUsed(e.ns);
        return i(t, e)
      }, d.prototype.nsPropertyTagName = function (e) {
        var t = this.logNamespaceUsed(e.ns);
        return r(t, e)
      }, d.prototype.isLocalNs = function (e) {
        return e.uri === this.ns.uri
      }, d.prototype.nsAttributeName = function (e) {
        var t;
        b(e) ? t = _(e) : e.ns && (t = e.ns);
        var n = this.logNamespaceUsed(t);
        return this.isLocalNs(n) ? {localName: t.localName} : x({localName: t.localName}, n)
      }, d.prototype.parseGeneric = function (e) {
        var t = this, n = this.body, i = this.attrs;
        y(e, function (e, r) {
          "$body" === r ? n.push((new u).build({type: "String"}, e)) : "$children" === r ? y(e, function (e) {
            n.push(new d(t).build(e))
          }) : 0 !== r.indexOf("$") && i.push({name: r, value: o(e)})
        })
      }, d.prototype.parseNsAttributes = function (e) {
        var t = this, n = e.$attrs, i = [];
        return y(n, function (e, n) {
          var r = _(n);
          "xmlns" === r.prefix ? t.logNamespace({
            prefix: r.localName,
            uri: e
          }) : r.prefix || "xmlns" !== r.localName ? i.push({name: n, value: e}) : t.logNamespace({uri: e})
        }), i
      }, d.prototype.parseGenericAttributes = function (e, t) {
        var n = this;
        y(t, function (t) {
          if (t.name !== k)try {
            n.addAttribute(n.nsAttributeName(t.name), t.value)
          } catch (i) {
            console.warn("[writer] missing namespace information for ", t.name, "=", t.value, "on", e, i)
          }
        })
      }, d.prototype.parseContainments = function (e) {
        var t = this, n = this.body, i = this.element;
        y(e, function (e) {
          var r = i.get(e.name), a = e.isReference, o = e.isMany, s = t.nsPropertyTagName(e);
          if (o || (r = [r]), e.isBody)n.push((new u).build(e, r[0])); else if (E.isSimple(e.type))y(r, function (t) {
            n.push(new p(s).build(e, t))
          }); else if (a)y(r, function (e) {
            n.push(new l(t, s).build(e))
          }); else {
            var c = e.serialize === k;
            y(r, function (e) {
              var i;
              i = c ? new f(t, s) : new d(t), n.push(i.build(e))
            })
          }
        })
      }, d.prototype.getNamespaces = function () {
        return this.parent ? this.namespaces = this.parent.getNamespaces() : this.namespaces || (this.namespaces = {
          prefixMap: {},
          uriMap: {},
          used: {}
        }), this.namespaces
      }, d.prototype.logNamespace = function (e) {
        var t = this.getNamespaces(), n = t.uriMap[e.uri];
        return n || (t.uriMap[e.uri] = e), t.prefixMap[e.prefix] = e.uri, e
      }, d.prototype.logNamespaceUsed = function (e) {
        var t = this.element, n = t.$model, i = this.getNamespaces(), r = e.prefix, a = e.uri || D[r] || i.prefixMap[r] || (n ? (n.getPackage(r) || {}).uri : null);
        if (!a)throw new Error("no namespace uri given for prefix <" + e.prefix + ">");
        return e = i.uriMap[a], e || (e = this.logNamespace({
          prefix: r,
          uri: a
        })), i.used[e.uri] || (i.used[e.uri] = e), e
      }, d.prototype.parseAttributes = function (e) {
        var t = this, n = this.element;
        y(e, function (e) {
          t.logNamespaceUsed(e.ns);
          var i = n.get(e.name);
          e.isReference && (i = i.id), t.addAttribute(t.nsAttributeName(e), i)
        })
      }, d.prototype.addAttribute = function (e, t) {
        var n = this.attrs;
        b(t) && (t = o(t)), n.push({name: e, value: t})
      }, d.prototype.serializeAttributes = function (e) {
        function t() {
          return v(a.used, function (e) {
            var t = "xmlns" + (e.prefix ? ":" + e.prefix : "");
            return {name: t, value: e.uri}
          })
        }

        var i = this.attrs, r = !this.parent, a = this.namespaces;
        r && (i = t().concat(i)), y(i, function (t) {
          e.append(" ").append(n(t.name)).append('="').append(t.value).append('"')
        })
      }, d.prototype.serializeTo = function (e) {
        var t = this.body.length, i = !(1 === this.body.length && this.body[0]instanceof u);
        e.appendIndent().append("<" + n(this.ns)), this.serializeAttributes(e), e.append(t ? ">" : " />"), t && (i && e.appendNewLine().indent(), y(this.body, function (t) {
          t.serializeTo(e)
        }), i && e.unindent().appendIndent(), e.append("</" + n(this.ns) + ">")), e.appendNewLine()
      }, f.prototype = new d, f.prototype.build = function (e) {
        var t = e.$descriptor;
        this.element = e, this.typeNs = this.nsTagName(t);
        var n = this.typeNs, i = e.$model.getPackage(n.uri), r = i.xml && i.xml.typePrefix || "";
        return this.addAttribute(this.nsAttributeName(k), (n.prefix ? n.prefix + ":" : "") + r + t.ns.localName), d.prototype.build.call(this, e)
      }, f.prototype.isLocalNs = function (e) {
        return e.uri === this.typeNs.uri
      }, t.exports = g
    }, {156: 156, 159: 159, 17: 17, 27: 27, 30: 30, 78: 78, 80: 80, 83: 83}],
    20: [function (e, t, n) {
      (function (t) {
        !function (n) {
          function i(e, t) {
            if (!(this instanceof i))return new i(e, t);
            var r = this;
            a(r), r.q = r.c = "", r.bufferCheckPosition = n.MAX_BUFFER_LENGTH, r.opt = t || {}, r.opt.lowercase = r.opt.lowercase || r.opt.lowercasetags, r.looseCase = r.opt.lowercase ? "toLowerCase" : "toUpperCase", r.tags = [], r.closed = r.closedRoot = r.sawRoot = !1, r.tag = r.error = null, r.strict = !!e, r.noscript = !(!e && !r.opt.noscript), r.state = Y.BEGIN, r.ENTITIES = Object.create(n.ENTITIES), r.attribList = [], r.opt.xmlns && (r.ns = Object.create(j)), r.trackPosition = r.opt.position !== !1, r.trackPosition && (r.position = r.line = r.column = 0), f(r, "onready")
          }

          function r(e) {
            for (var t = Math.max(n.MAX_BUFFER_LENGTH, 10), i = 0, r = 0, a = C.length; a > r; r++) {
              var o = e[C[r]].length;
              if (o > t)switch (C[r]) {
                case"textNode":
                  m(e);
                  break;
                case"cdata":
                  h(e, "oncdata", e.cdata), e.cdata = "";
                  break;
                case"script":
                  h(e, "onscript", e.script), e.script = "";
                  break;
                default:
                  v(e, "Max buffer length exceeded: " + C[r])
              }
              i = Math.max(i, o)
            }
            e.bufferCheckPosition = n.MAX_BUFFER_LENGTH - i + e.position
          }

          function a(e) {
            for (var t = 0, n = C.length; n > t; t++)e[C[t]] = ""
          }

          function o(e) {
            m(e), "" !== e.cdata && (h(e, "oncdata", e.cdata), e.cdata = ""), "" !== e.script && (h(e, "onscript", e.script), e.script = "")
          }

          function s(e, t) {
            return new c(e, t)
          }

          function c(e, t) {
            if (!(this instanceof c))return new c(e, t);
            D.apply(this), this._parser = new i(e, t), this.writable = !0, this.readable = !0;
            var n = this;
            this._parser.onend = function () {
              n.emit("end")
            }, this._parser.onerror = function (e) {
              n.emit("error", e), n._parser.error = null
            }, this._decoder = null, I.forEach(function (e) {
              Object.defineProperty(n, "on" + e, {
                get: function () {
                  return n._parser["on" + e]
                }, set: function (t) {
                  return t ? void n.on(e, t) : (n.removeAllListeners(e), n._parser["on" + e] = t)
                }, enumerable: !0, configurable: !1
              })
            })
          }

          function l(e) {
            return e.split("").reduce(function (e, t) {
              return e[t] = !0, e
            }, {})
          }

          function u(e) {
            return "[object RegExp]" === Object.prototype.toString.call(e)
          }

          function p(e, t) {
            return u(e) ? !!t.match(e) : e[t]
          }

          function d(e, t) {
            return !p(e, t)
          }

          function f(e, t, n) {
            e[t] && e[t](n)
          }

          function h(e, t, n) {
            e.textNode && m(e), f(e, t, n)
          }

          function m(e) {
            e.textNode = g(e.opt, e.textNode), e.textNode && f(e, "ontext", e.textNode), e.textNode = ""
          }

          function g(e, t) {
            return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t
          }

          function v(e, t) {
            return m(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = new Error(t), e.error = t, f(e, "onerror", t), e
          }

          function y(e) {
            return e.closedRoot || b(e, "Unclosed root tag"), e.state !== Y.BEGIN && e.state !== Y.TEXT && v(e, "Unexpected end"), m(e), e.c = "", e.closed = !0, f(e, "onend"), i.call(e, e.strict, e.opt), e
          }

          function b(e, t) {
            if ("object" != typeof e || !(e instanceof i))throw new Error("bad call to strictFail");
            e.strict && v(e, t)
          }

          function w(e) {
            e.strict || (e.tagName = e.tagName[e.looseCase]());
            var t = e.tags[e.tags.length - 1] || e, n = e.tag = {name: e.tagName, attributes: {}};
            e.opt.xmlns && (n.ns = t.ns), e.attribList.length = 0
          }

          function x(e, t) {
            var n = e.indexOf(":"), i = 0 > n ? ["", e] : e.split(":"), r = i[0], a = i[1];
            return t && "xmlns" === e && (r = "xmlns", a = ""), {prefix: r, local: a}
          }

          function E(e) {
            if (e.strict || (e.attribName = e.attribName[e.looseCase]()), -1 !== e.attribList.indexOf(e.attribName) || e.tag.attributes.hasOwnProperty(e.attribName))return e.attribName = e.attribValue = "";
            if (e.opt.xmlns) {
              var t = x(e.attribName, !0), n = t.prefix, i = t.local;
              if ("xmlns" === n)if ("xml" === i && e.attribValue !== B)b(e, "xml: prefix must be bound to " + B + "\nActual: " + e.attribValue); else if ("xmlns" === i && e.attribValue !== V)b(e, "xmlns: prefix must be bound to " + V + "\nActual: " + e.attribValue); else {
                var r = e.tag, a = e.tags[e.tags.length - 1] || e;
                r.ns === a.ns && (r.ns = Object.create(a.ns)), r.ns[i] = e.attribValue
              }
              e.attribList.push([e.attribName, e.attribValue])
            } else e.tag.attributes[e.attribName] = e.attribValue, h(e, "onattribute", {
              name: e.attribName,
              value: e.attribValue
            });
            e.attribName = e.attribValue = ""
          }

          function _(e, t) {
            if (e.opt.xmlns) {
              var n = e.tag, i = x(e.tagName);
              n.prefix = i.prefix, n.local = i.local, n.uri = n.ns[i.prefix] || "", n.prefix && !n.uri && (b(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), n.uri = i.prefix);
              var r = e.tags[e.tags.length - 1] || e;
              n.ns && r.ns !== n.ns && Object.keys(n.ns).forEach(function (t) {
                h(e, "onopennamespace", {prefix: t, uri: n.ns[t]})
              });
              for (var a = 0, o = e.attribList.length; o > a; a++) {
                var s = e.attribList[a], c = s[0], l = s[1], u = x(c, !0), p = u.prefix, d = u.local, f = "" == p ? "" : n.ns[p] || "", m = {
                  name: c,
                  value: l,
                  prefix: p,
                  local: d,
                  uri: f
                };
                p && "xmlns" != p && !f && (b(e, "Unbound namespace prefix: " + JSON.stringify(p)), m.uri = p), e.tag.attributes[c] = m, h(e, "onattribute", m)
              }
              e.attribList.length = 0
            }
            e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), h(e, "onopentag", e.tag), t || (e.state = e.noscript || "script" !== e.tagName.toLowerCase() ? Y.TEXT : Y.SCRIPT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0
          }

          function T(e) {
            if (!e.tagName)return b(e, "Weird empty close tag."), e.textNode += "</>", void(e.state = Y.TEXT);
            if (e.script) {
              if ("script" !== e.tagName)return e.script += "</" + e.tagName + ">", e.tagName = "", void(e.state = Y.SCRIPT);
              h(e, "onscript", e.script), e.script = ""
            }
            var t = e.tags.length, n = e.tagName;
            e.strict || (n = n[e.looseCase]());
            for (var i = n; t--;) {
              var r = e.tags[t];
              if (r.name === i)break;
              b(e, "Unexpected close tag")
            }
            if (0 > t)return b(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", void(e.state = Y.TEXT);
            e.tagName = n;
            for (var a = e.tags.length; a-- > t;) {
              var o = e.tag = e.tags.pop();
              e.tagName = e.tag.name, h(e, "onclosetag", e.tagName);
              var s = {};
              for (var c in o.ns)s[c] = o.ns[c];
              var l = e.tags[e.tags.length - 1] || e;
              e.opt.xmlns && o.ns !== l.ns && Object.keys(o.ns).forEach(function (t) {
                var n = o.ns[t];
                h(e, "onclosenamespace", {prefix: t, uri: n})
              })
            }
            0 === t && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = Y.TEXT
          }

          function S(e) {
            var t, n = e.entity, i = n.toLowerCase(), r = "";
            return e.ENTITIES[n] ? e.ENTITIES[n] : e.ENTITIES[i] ? e.ENTITIES[i] : (n = i, "#" === n.charAt(0) && ("x" === n.charAt(1) ? (n = n.slice(2), t = parseInt(n, 16), r = t.toString(16)) : (n = n.slice(1), t = parseInt(n, 10), r = t.toString(10))), n = n.replace(/^0+/, ""), r.toLowerCase() !== n ? (b(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(t))
          }

          function A(e) {
            var t = this;
            if (this.error)throw this.error;
            if (t.closed)return v(t, "Cannot write after close. Assign an onready handler.");
            if (null === e)return y(t);
            for (var n = 0, i = ""; t.c = i = e.charAt(n++);)switch (t.trackPosition && (t.position++, "\n" === i ? (t.line++, t.column = 0) : t.column++), t.state) {
              case Y.BEGIN:
                "<" === i ? (t.state = Y.OPEN_WAKA, t.startTagPosition = t.position) : d(P, i) && (b(t, "Non-whitespace before first tag."), t.textNode = i, t.state = Y.TEXT);
                continue;
              case Y.TEXT:
                if (t.sawRoot && !t.closedRoot) {
                  for (var a = n - 1; i && "<" !== i && "&" !== i;)i = e.charAt(n++), i && t.trackPosition && (t.position++, "\n" === i ? (t.line++, t.column = 0) : t.column++);
                  t.textNode += e.substring(a, n - 1)
                }
                "<" === i ? (t.state = Y.OPEN_WAKA, t.startTagPosition = t.position) : (!d(P, i) || t.sawRoot && !t.closedRoot || b(t, "Text data outside of root node."), "&" === i ? t.state = Y.TEXT_ENTITY : t.textNode += i);
                continue;
              case Y.SCRIPT:
                "<" === i ? t.state = Y.SCRIPT_ENDING : t.script += i;
                continue;
              case Y.SCRIPT_ENDING:
                "/" === i ? t.state = Y.CLOSE_TAG : (t.script += "<" + i, t.state = Y.SCRIPT);
                continue;
              case Y.OPEN_WAKA:
                if ("!" === i)t.state = Y.SGML_DECL, t.sgmlDecl = ""; else if (p(P, i)); else if (p(U, i))t.state = Y.OPEN_TAG, t.tagName = i; else if ("/" === i)t.state = Y.CLOSE_TAG, t.tagName = ""; else if ("?" === i)t.state = Y.PROC_INST, t.procInstName = t.procInstBody = ""; else {
                  if (b(t, "Unencoded <"), t.startTagPosition + 1 < t.position) {
                    var o = t.position - t.startTagPosition;
                    i = new Array(o).join(" ") + i
                  }
                  t.textNode += "<" + i, t.state = Y.TEXT
                }
                continue;
              case Y.SGML_DECL:
                (t.sgmlDecl + i).toUpperCase() === F ? (h(t, "onopencdata"), t.state = Y.CDATA, t.sgmlDecl = "", t.cdata = "") : t.sgmlDecl + i === "--" ? (t.state = Y.COMMENT, t.comment = "", t.sgmlDecl = "") : (t.sgmlDecl + i).toUpperCase() === L ? (t.state = Y.DOCTYPE, (t.doctype || t.sawRoot) && b(t, "Inappropriately located doctype declaration"), t.doctype = "", t.sgmlDecl = "") : ">" === i ? (h(t, "onsgmldeclaration", t.sgmlDecl), t.sgmlDecl = "", t.state = Y.TEXT) : p(N, i) ? (t.state = Y.SGML_DECL_QUOTED, t.sgmlDecl += i) : t.sgmlDecl += i;
                continue;
              case Y.SGML_DECL_QUOTED:
                i === t.q && (t.state = Y.SGML_DECL, t.q = ""), t.sgmlDecl += i;
                continue;
              case Y.DOCTYPE:
                ">" === i ? (t.state = Y.TEXT, h(t, "ondoctype", t.doctype), t.doctype = !0) : (t.doctype += i, "[" === i ? t.state = Y.DOCTYPE_DTD : p(N, i) && (t.state = Y.DOCTYPE_QUOTED, t.q = i));
                continue;
              case Y.DOCTYPE_QUOTED:
                t.doctype += i, i === t.q && (t.q = "", t.state = Y.DOCTYPE);
                continue;
              case Y.DOCTYPE_DTD:
                t.doctype += i, "]" === i ? t.state = Y.DOCTYPE : p(N, i) && (t.state = Y.DOCTYPE_DTD_QUOTED, t.q = i);
                continue;
              case Y.DOCTYPE_DTD_QUOTED:
                t.doctype += i, i === t.q && (t.state = Y.DOCTYPE_DTD, t.q = "");
                continue;
              case Y.COMMENT:
                "-" === i ? t.state = Y.COMMENT_ENDING : t.comment += i;
                continue;
              case Y.COMMENT_ENDING:
                "-" === i ? (t.state = Y.COMMENT_ENDED, t.comment = g(t.opt, t.comment), t.comment && h(t, "oncomment", t.comment), t.comment = "") : (t.comment += "-" + i, t.state = Y.COMMENT);
                continue;
              case Y.COMMENT_ENDED:
                ">" !== i ? (b(t, "Malformed comment"), t.comment += "--" + i, t.state = Y.COMMENT) : t.state = Y.TEXT;
                continue;
              case Y.CDATA:
                "]" === i ? t.state = Y.CDATA_ENDING : t.cdata += i;
                continue;
              case Y.CDATA_ENDING:
                "]" === i ? t.state = Y.CDATA_ENDING_2 : (t.cdata += "]" + i, t.state = Y.CDATA);
                continue;
              case Y.CDATA_ENDING_2:
                ">" === i ? (t.cdata && h(t, "oncdata", t.cdata), h(t, "onclosecdata"), t.cdata = "", t.state = Y.TEXT) : "]" === i ? t.cdata += "]" : (t.cdata += "]]" + i, t.state = Y.CDATA);
                continue;
              case Y.PROC_INST:
                "?" === i ? t.state = Y.PROC_INST_ENDING : p(P, i) ? t.state = Y.PROC_INST_BODY : t.procInstName += i;
                continue;
              case Y.PROC_INST_BODY:
                if (!t.procInstBody && p(P, i))continue;
                "?" === i ? t.state = Y.PROC_INST_ENDING : t.procInstBody += i;
                continue;
              case Y.PROC_INST_ENDING:
                ">" === i ? (h(t, "onprocessinginstruction", {
                  name: t.procInstName,
                  body: t.procInstBody
                }), t.procInstName = t.procInstBody = "", t.state = Y.TEXT) : (t.procInstBody += "?" + i, t.state = Y.PROC_INST_BODY);
                continue;
              case Y.OPEN_TAG:
                p(q, i) ? t.tagName += i : (w(t), ">" === i ? _(t) : "/" === i ? t.state = Y.OPEN_TAG_SLASH : (d(P, i) && b(t, "Invalid character in tag name"), t.state = Y.ATTRIB));
                continue;
              case Y.OPEN_TAG_SLASH:
                ">" === i ? (_(t, !0), T(t)) : (b(t, "Forward-slash in opening tag not followed by >"), t.state = Y.ATTRIB);
                continue;
              case Y.ATTRIB:
                if (p(P, i))continue;
                ">" === i ? _(t) : "/" === i ? t.state = Y.OPEN_TAG_SLASH : p(U, i) ? (t.attribName = i, t.attribValue = "", t.state = Y.ATTRIB_NAME) : b(t, "Invalid attribute name");
                continue;
              case Y.ATTRIB_NAME:
                "=" === i ? t.state = Y.ATTRIB_VALUE : ">" === i ? (b(t, "Attribute without value"), t.attribValue = t.attribName, E(t), _(t)) : p(P, i) ? t.state = Y.ATTRIB_NAME_SAW_WHITE : p(q, i) ? t.attribName += i : b(t, "Invalid attribute name");
                continue;
              case Y.ATTRIB_NAME_SAW_WHITE:
                if ("=" === i)t.state = Y.ATTRIB_VALUE; else {
                  if (p(P, i))continue;
                  b(t, "Attribute without value"), t.tag.attributes[t.attribName] = "", t.attribValue = "", h(t, "onattribute", {
                    name: t.attribName,
                    value: ""
                  }), t.attribName = "", ">" === i ? _(t) : p(U, i) ? (t.attribName = i, t.state = Y.ATTRIB_NAME) : (b(t, "Invalid attribute name"), t.state = Y.ATTRIB)
                }
                continue;
              case Y.ATTRIB_VALUE:
                if (p(P, i))continue;
                p(N, i) ? (t.q = i, t.state = Y.ATTRIB_VALUE_QUOTED) : (b(t, "Unquoted attribute value"), t.state = Y.ATTRIB_VALUE_UNQUOTED, t.attribValue = i);
                continue;
              case Y.ATTRIB_VALUE_QUOTED:
                if (i !== t.q) {
                  "&" === i ? t.state = Y.ATTRIB_VALUE_ENTITY_Q : t.attribValue += i;
                  continue
                }
                E(t), t.q = "", t.state = Y.ATTRIB_VALUE_CLOSED;
                continue;
              case Y.ATTRIB_VALUE_CLOSED:
                p(P, i) ? t.state = Y.ATTRIB : ">" === i ? _(t) : "/" === i ? t.state = Y.OPEN_TAG_SLASH : p(U, i) ? (b(t, "No whitespace between attributes"), t.attribName = i, t.attribValue = "", t.state = Y.ATTRIB_NAME) : b(t, "Invalid attribute name");
                continue;
              case Y.ATTRIB_VALUE_UNQUOTED:
                if (d($, i)) {
                  "&" === i ? t.state = Y.ATTRIB_VALUE_ENTITY_U : t.attribValue += i;
                  continue
                }
                E(t), ">" === i ? _(t) : t.state = Y.ATTRIB;
                continue;
              case Y.CLOSE_TAG:
                if (t.tagName)">" === i ? T(t) : p(q, i) ? t.tagName += i : t.script ? (t.script += "</" + t.tagName, t.tagName = "", t.state = Y.SCRIPT) : (d(P, i) && b(t, "Invalid tagname in closing tag"), t.state = Y.CLOSE_TAG_SAW_WHITE); else {
                  if (p(P, i))continue;
                  d(U, i) ? t.script ? (t.script += "</" + i, t.state = Y.SCRIPT) : b(t, "Invalid tagname in closing tag.") : t.tagName = i
                }
                continue;
              case Y.CLOSE_TAG_SAW_WHITE:
                if (p(P, i))continue;
                ">" === i ? T(t) : b(t, "Invalid characters in closing tag");
                continue;
              case Y.TEXT_ENTITY:
              case Y.ATTRIB_VALUE_ENTITY_Q:
              case Y.ATTRIB_VALUE_ENTITY_U:
                switch (t.state) {
                  case Y.TEXT_ENTITY:
                    var s = Y.TEXT, c = "textNode";
                    break;
                  case Y.ATTRIB_VALUE_ENTITY_Q:
                    var s = Y.ATTRIB_VALUE_QUOTED, c = "attribValue";
                    break;
                  case Y.ATTRIB_VALUE_ENTITY_U:
                    var s = Y.ATTRIB_VALUE_UNQUOTED, c = "attribValue"
                }
                ";" === i ? (t[c] += S(t), t.entity = "", t.state = s) : p(O, i) ? t.entity += i : (b(t, "Invalid character entity"), t[c] += "&" + t.entity + i, t.entity = "", t.state = s);
                continue;
              default:
                throw new Error(t, "Unknown state: " + t.state)
            }
            return t.position >= t.bufferCheckPosition && r(t), t
          }

          n.parser = function (e, t) {
            return new i(e, t)
          }, n.SAXParser = i, n.SAXStream = c, n.createStream = s, n.MAX_BUFFER_LENGTH = 65536;
          var C = ["comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script"];
          n.EVENTS = ["text", "processinginstruction", "sgmldeclaration", "doctype", "comment", "attribute", "opentag", "closetag", "opencdata", "cdata", "closecdata", "error", "end", "ready", "script", "opennamespace", "closenamespace"], Object.create || (Object.create = function (e) {
            function t() {
              this.__proto__ = e
            }

            return t.prototype = e, new t
          }), Object.getPrototypeOf || (Object.getPrototypeOf = function (e) {
            return e.__proto__
          }), Object.keys || (Object.keys = function (e) {
            var t = [];
            for (var n in e)e.hasOwnProperty(n) && t.push(n);
            return t
          }), i.prototype = {
            end: function () {
              y(this)
            }, write: A, resume: function () {
              return this.error = null, this
            }, close: function () {
              return this.write(null)
            }, flush: function () {
              o(this)
            }
          };
          try {
            var D = e("stream").Stream
          } catch (k) {
            var D = function () {
            }
          }
          var I = n.EVENTS.filter(function (e) {
            return "error" !== e && "end" !== e
          });
          c.prototype = Object.create(D.prototype, {constructor: {value: c}}), c.prototype.write = function (n) {
            if ("function" == typeof t && "function" == typeof t.isBuffer && t.isBuffer(n)) {
              if (!this._decoder) {
                var i = e("string_decoder").StringDecoder;
                this._decoder = new i("utf8")
              }
              n = this._decoder.write(n)
            }
            return this._parser.write(n.toString()), this.emit("data", n), !0
          }, c.prototype.end = function (e) {
            return e && e.length && this.write(e), this._parser.end(), !0
          }, c.prototype.on = function (e, t) {
            var n = this;
            return n._parser["on" + e] || -1 === I.indexOf(e) || (n._parser["on" + e] = function () {
              var t = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
              t.splice(0, 0, e), n.emit.apply(n, t)
            }), D.prototype.on.call(n, e, t)
          };
          var P = "\r\n	 ", M = "0124356789", R = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", N = "'\"", O = M + R + "#", $ = P + ">", F = "[CDATA[", L = "DOCTYPE", B = "http://www.w3.org/XML/1998/namespace", V = "http://www.w3.org/2000/xmlns/", j = {
            xml: B,
            xmlns: V
          };
          P = l(P), M = l(M), R = l(R);
          var U = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, q = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040\.\d-]/;
          N = l(N), O = l(O), $ = l($);
          var Y = 0;
          n.STATE = {
            BEGIN: Y++,
            TEXT: Y++,
            TEXT_ENTITY: Y++,
            OPEN_WAKA: Y++,
            SGML_DECL: Y++,
            SGML_DECL_QUOTED: Y++,
            DOCTYPE: Y++,
            DOCTYPE_QUOTED: Y++,
            DOCTYPE_DTD: Y++,
            DOCTYPE_DTD_QUOTED: Y++,
            COMMENT_STARTING: Y++,
            COMMENT: Y++,
            COMMENT_ENDING: Y++,
            COMMENT_ENDED: Y++,
            CDATA: Y++,
            CDATA_ENDING: Y++,
            CDATA_ENDING_2: Y++,
            PROC_INST: Y++,
            PROC_INST_BODY: Y++,
            PROC_INST_ENDING: Y++,
            OPEN_TAG: Y++,
            OPEN_TAG_SLASH: Y++,
            ATTRIB: Y++,
            ATTRIB_NAME: Y++,
            ATTRIB_NAME_SAW_WHITE: Y++,
            ATTRIB_VALUE: Y++,
            ATTRIB_VALUE_QUOTED: Y++,
            ATTRIB_VALUE_CLOSED: Y++,
            ATTRIB_VALUE_UNQUOTED: Y++,
            ATTRIB_VALUE_ENTITY_Q: Y++,
            ATTRIB_VALUE_ENTITY_U: Y++,
            CLOSE_TAG: Y++,
            CLOSE_TAG_SAW_WHITE: Y++,
            SCRIPT: Y++,
            SCRIPT_ENDING: Y++
          }, n.ENTITIES = {
            amp: "&",
            gt: ">",
            lt: "<",
            quot: '"',
            apos: "'",
            AElig: 198,
            Aacute: 193,
            Acirc: 194,
            Agrave: 192,
            Aring: 197,
            Atilde: 195,
            Auml: 196,
            Ccedil: 199,
            ETH: 208,
            Eacute: 201,
            Ecirc: 202,
            Egrave: 200,
            Euml: 203,
            Iacute: 205,
            Icirc: 206,
            Igrave: 204,
            Iuml: 207,
            Ntilde: 209,
            Oacute: 211,
            Ocirc: 212,
            Ograve: 210,
            Oslash: 216,
            Otilde: 213,
            Ouml: 214,
            THORN: 222,
            Uacute: 218,
            Ucirc: 219,
            Ugrave: 217,
            Uuml: 220,
            Yacute: 221,
            aacute: 225,
            acirc: 226,
            aelig: 230,
            agrave: 224,
            aring: 229,
            atilde: 227,
            auml: 228,
            ccedil: 231,
            eacute: 233,
            ecirc: 234,
            egrave: 232,
            eth: 240,
            euml: 235,
            iacute: 237,
            icirc: 238,
            igrave: 236,
            iuml: 239,
            ntilde: 241,
            oacute: 243,
            ocirc: 244,
            ograve: 242,
            oslash: 248,
            otilde: 245,
            ouml: 246,
            szlig: 223,
            thorn: 254,
            uacute: 250,
            ucirc: 251,
            ugrave: 249,
            uuml: 252,
            yacute: 253,
            yuml: 255,
            copy: 169,
            reg: 174,
            nbsp: 160,
            iexcl: 161,
            cent: 162,
            pound: 163,
            curren: 164,
            yen: 165,
            brvbar: 166,
            sect: 167,
            uml: 168,
            ordf: 170,
            laquo: 171,
            not: 172,
            shy: 173,
            macr: 175,
            deg: 176,
            plusmn: 177,
            sup1: 185,
            sup2: 178,
            sup3: 179,
            acute: 180,
            micro: 181,
            para: 182,
            middot: 183,
            cedil: 184,
            ordm: 186,
            raquo: 187,
            frac14: 188,
            frac12: 189,
            frac34: 190,
            iquest: 191,
            times: 215,
            divide: 247,
            OElig: 338,
            oelig: 339,
            Scaron: 352,
            scaron: 353,
            Yuml: 376,
            fnof: 402,
            circ: 710,
            tilde: 732,
            Alpha: 913,
            Beta: 914,
            Gamma: 915,
            Delta: 916,
            Epsilon: 917,
            Zeta: 918,
            Eta: 919,
            Theta: 920,
            Iota: 921,
            Kappa: 922,
            Lambda: 923,
            Mu: 924,
            Nu: 925,
            Xi: 926,
            Omicron: 927,
            Pi: 928,
            Rho: 929,
            Sigma: 931,
            Tau: 932,
            Upsilon: 933,
            Phi: 934,
            Chi: 935,
            Psi: 936,
            Omega: 937,
            alpha: 945,
            beta: 946,
            gamma: 947,
            delta: 948,
            epsilon: 949,
            zeta: 950,
            eta: 951,
            theta: 952,
            iota: 953,
            kappa: 954,
            lambda: 955,
            mu: 956,
            nu: 957,
            xi: 958,
            omicron: 959,
            pi: 960,
            rho: 961,
            sigmaf: 962,
            sigma: 963,
            tau: 964,
            upsilon: 965,
            phi: 966,
            chi: 967,
            psi: 968,
            omega: 969,
            thetasym: 977,
            upsih: 978,
            piv: 982,
            ensp: 8194,
            emsp: 8195,
            thinsp: 8201,
            zwnj: 8204,
            zwj: 8205,
            lrm: 8206,
            rlm: 8207,
            ndash: 8211,
            mdash: 8212,
            lsquo: 8216,
            rsquo: 8217,
            sbquo: 8218,
            ldquo: 8220,
            rdquo: 8221,
            bdquo: 8222,
            dagger: 8224,
            Dagger: 8225,
            bull: 8226,
            hellip: 8230,
            permil: 8240,
            prime: 8242,
            Prime: 8243,
            lsaquo: 8249,
            rsaquo: 8250,
            oline: 8254,
            frasl: 8260,
            euro: 8364,
            image: 8465,
            weierp: 8472,
            real: 8476,
            trade: 8482,
            alefsym: 8501,
            larr: 8592,
            uarr: 8593,
            rarr: 8594,
            darr: 8595,
            harr: 8596,
            crarr: 8629,
            lArr: 8656,
            uArr: 8657,
            rArr: 8658,
            dArr: 8659,
            hArr: 8660,
            forall: 8704,
            part: 8706,
            exist: 8707,
            empty: 8709,
            nabla: 8711,
            isin: 8712,
            notin: 8713,
            ni: 8715,
            prod: 8719,
            sum: 8721,
            minus: 8722,
            lowast: 8727,
            radic: 8730,
            prop: 8733,
            infin: 8734,
            ang: 8736,
            and: 8743,
            or: 8744,
            cap: 8745,
            cup: 8746,
            "int": 8747,
            there4: 8756,
            sim: 8764,
            cong: 8773,
            asymp: 8776,
            ne: 8800,
            equiv: 8801,
            le: 8804,
            ge: 8805,
            sub: 8834,
            sup: 8835,
            nsub: 8836,
            sube: 8838,
            supe: 8839,
            oplus: 8853,
            otimes: 8855,
            perp: 8869,
            sdot: 8901,
            lceil: 8968,
            rceil: 8969,
            lfloor: 8970,
            rfloor: 8971,
            lang: 9001,
            rang: 9002,
            loz: 9674,
            spades: 9824,
            clubs: 9827,
            hearts: 9829,
            diams: 9830
          }, Object.keys(n.ENTITIES).forEach(function (e) {
            var t = n.ENTITIES[e], i = "number" == typeof t ? String.fromCharCode(t) : t;
            n.ENTITIES[e] = i
          });
          for (var Y in n.STATE)n.STATE[n.STATE[Y]] = Y;
          Y = n.STATE, String.fromCodePoint || !function () {
            var e = String.fromCharCode, t = Math.floor, n = function () {
              var n, i, r = 16384, a = [], o = -1, s = arguments.length;
              if (!s)return "";
              for (var c = ""; ++o < s;) {
                var l = Number(arguments[o]);
                if (!isFinite(l) || 0 > l || l > 1114111 || t(l) != l)throw RangeError("Invalid code point: " + l);
                65535 >= l ? a.push(l) : (l -= 65536, n = (l >> 10) + 55296, i = l % 1024 + 56320, a.push(n, i)), (o + 1 == s || a.length > r) && (c += e.apply(null, a), a.length = 0)
              }
              return c
            };
            Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
              value: n,
              configurable: !0,
              writable: !0
            }) : String.fromCodePoint = n
          }()
        }("undefined" == typeof n ? sax = {} : n)
      }).call(this, void 0)
    }, {undefined: void 0}],
    21: [function (t, n, i) {
      !function (t) {
        function r() {
          this.data = [null], this.top = 0
        }

        function a() {
          return new r
        }

        r.prototype.clear = function () {
          return this.data = [null], this.top = 0, this
        }, r.prototype.length = function () {
          return this.top
        }, r.prototype.peek = function () {
          return this.data[this.top]
        }, r.prototype.pop = function () {
          return this.top > 0 ? (this.top--, this.data.pop()) : void 0
        }, r.prototype.push = function (e) {
          return this.data[++this.top] = e, this
        }, "undefined" != typeof i ? n.exports = a : "function" == typeof e ? e(function () {
          return a
        }) : t.stack = a
      }(this)
    }, {}],
    22: [function (e, t) {
      t.exports = e(26)
    }, {26: 26}],
    23: [function (e, t) {
      function n() {
      }

      n.prototype.get = function (e) {
        return this.$model.properties.get(this, e)
      }, n.prototype.set = function (e, t) {
        this.$model.properties.set(this, e, t)
      }, t.exports = n
    }, {}],
    24: [function (e, t) {
      function n(e) {
        this.ns = e, this.name = e.name, this.allTypes = [], this.properties = [], this.propertiesByName = {}
      }

      var i = e(164), r = e(159), a = e(80), o = e(27).parseName;
      t.exports = n, n.prototype.build = function () {
        return i(this, ["ns", "name", "allTypes", "properties", "propertiesByName", "bodyProperty"])
      }, n.prototype.addProperty = function (e, t) {
        this.addNamedProperty(e, !0);
        var n = this.properties;
        void 0 !== t ? n.splice(t, 0, e) : n.push(e)
      }, n.prototype.replaceProperty = function (e, t) {
        var n = e.ns, i = this.properties, r = this.propertiesByName, a = e.name !== t.name;
        if (e.isBody) {
          if (!t.isBody)throw new Error("property <" + t.ns.name + "> must be body property to refine <" + e.ns.name + ">");
          this.setBodyProperty(t, !1)
        }
        this.addNamedProperty(t, a);
        var o = i.indexOf(e);
        if (-1 === o)throw new Error("property <" + n.name + "> not found in property list");
        i[o] = t, r[n.name] = r[n.localName] = t
      }, n.prototype.redefineProperty = function (e) {
        var t = e.ns.prefix, n = e.redefines.split("#"), i = o(n[0], t), r = o(n[1], i.prefix).name, a = this.propertiesByName[r];
        if (!a)throw new Error("refined property <" + r + "> not found");
        this.replaceProperty(a, e), delete e.redefines
      }, n.prototype.addNamedProperty = function (e, t) {
        var n = e.ns, i = this.propertiesByName;
        t && (this.assertNotDefined(e, n.name), this.assertNotDefined(e, n.localName)), i[n.name] = i[n.localName] = e
      }, n.prototype.removeNamedProperty = function (e) {
        var t = e.ns, n = this.propertiesByName;
        delete n[t.name], delete n[t.localName]
      }, n.prototype.setBodyProperty = function (e, t) {
        if (t && this.bodyProperty)throw new Error("body property defined multiple times (<" + this.bodyProperty.ns.name + ">, <" + e.ns.name + ">)");
        this.bodyProperty = e
      }, n.prototype.addIdProperty = function (e) {
        var t = o(e, this.ns.prefix), n = {name: t.localName, type: "String", isAttr: !0, ns: t};
        this.addProperty(n, 0)
      }, n.prototype.assertNotDefined = function (e) {
        var t = e.name, n = this.propertiesByName[t];
        if (n)throw new Error("property <" + t + "> already defined; override of <" + n.definedBy.ns.name + "#" + n.ns.name + "> by <" + e.definedBy.ns.name + "#" + e.ns.name + "> not allowed without redefines")
      }, n.prototype.hasProperty = function (e) {
        return this.propertiesByName[e]
      }, n.prototype.addTrait = function (e) {
        var t = this.allTypes;
        -1 === t.indexOf(e) && (a(e.properties, function (t) {
          t = r({}, t, {name: t.ns.localName}), Object.defineProperty(t, "definedBy", {value: e}), t.redefines ? this.redefineProperty(t) : (t.isBody && this.setBodyProperty(t), this.addProperty(t))
        }, this), t.push(e))
      }
    }, {159: 159, 164: 164, 27: 27, 80: 80}],
    25: [function (e, t) {
      function n(e, t) {
        this.model = e, this.properties = t
      }

      var i = e(80), r = e(23);
      t.exports = n, n.prototype.createType = function (e) {
        function t(e) {
          a.define(this, "$type", {
            value: s,
            enumerable: !0
          }), a.define(this, "$attrs", {value: {}}), a.define(this, "$parent", {writable: !0}), i(e, function (e, t) {
            this.set(t, e)
          }, this)
        }

        var n = this.model, a = this.properties, o = Object.create(r.prototype);
        i(e.properties, function (e) {
          e.isMany || void 0 === e["default"] || (o[e.name] = e["default"])
        }), a.defineModel(o, n), a.defineDescriptor(o, e);
        var s = e.ns.name;
        return t.prototype = o, t.hasType = o.$instanceOf = this.model.hasType, a.defineModel(t, n), a.defineDescriptor(t, e), t
      }
    }, {23: 23, 80: 80}],
    26: [function (e, t) {
      function n(e, t) {
        t = t || {}, this.properties = new l(this), this.factory = new s(this, this.properties), this.registry = new c(e, this.properties, t), this.typeCache = {}
      }

      var i = e(156), r = e(154), a = e(80), o = e(79), s = e(25), c = e(29), l = e(28), u = e(27).parseName;
      t.exports = n, n.prototype.create = function (e, t) {
        var n = this.getType(e);
        if (!n)throw new Error("unknown type <" + e + ">");
        return new n(t)
      }, n.prototype.getType = function (e) {
        var t = this.typeCache, n = i(e) ? e : e.ns.name, r = t[n];
        return r || (e = this.registry.getEffectiveDescriptor(n), r = t[n] = this.factory.createType(e)), r
      }, n.prototype.createAny = function (e, t, n) {
        var i = u(e), o = {$type: e}, s = {
          name: e,
          isGeneric: !0,
          ns: {prefix: i.prefix, localName: i.localName, uri: t}
        };
        return this.properties.defineDescriptor(o, s), this.properties.defineModel(o, this), this.properties.define(o, "$parent", {
          enumerable: !1,
          writable: !0
        }), a(n, function (e, t) {
          r(e) && void 0 !== e.value ? o[e.name] = e.value : o[t] = e
        }), o
      }, n.prototype.getPackage = function (e) {
        return this.registry.getPackage(e)
      }, n.prototype.getPackages = function () {
        return this.registry.getPackages()
      }, n.prototype.getElementDescriptor = function (e) {
        return e.$descriptor
      }, n.prototype.hasType = function (e, t) {
        void 0 === t && (t = e, e = this);
        var n = e.$model.getElementDescriptor(e);
        return !!o(n.allTypes, function (e) {
          return e.name === t
        })
      }, n.prototype.getPropertyDescriptor = function (e, t) {
        return this.getElementDescriptor(e).propertiesByName[t]
      }
    }, {154: 154, 156: 156, 25: 25, 27: 27, 28: 28, 29: 29, 79: 79, 80: 80}],
    27: [function (e, t) {
      t.exports.parseName = function (e, t) {
        var n, i, r = e.split(/:/);
        if (1 === r.length)n = e, i = t; else {
          if (2 !== r.length)throw new Error("expected <prefix:localName> or <localName>, got " + e);
          n = r[1], i = r[0]
        }
        return e = (i ? i + ":" : "") + n, {name: e, prefix: i, localName: n}
      }
    }, {}],
    28: [function (e, t) {
      function n(e) {
        this.model = e
      }

      t.exports = n, n.prototype.set = function (e, t, n) {
        var i = this.model.getPropertyDescriptor(e, t);
        i ? Object.defineProperty(e, i.name, {enumerable: !i.isReference, writable: !0, value: n}) : e.$attrs[t] = n
      }, n.prototype.get = function (e, t) {
        var n = this.model.getPropertyDescriptor(e, t);
        if (!n)return e.$attrs[t];
        var i = n.name;
        return !e[i] && n.isMany && Object.defineProperty(e, i, {
          enumerable: !n.isReference,
          writable: !0,
          value: []
        }), e[i]
      }, n.prototype.define = function (e, t, n) {
        Object.defineProperty(e, t, n)
      }, n.prototype.defineDescriptor = function (e, t) {
        this.define(e, "$descriptor", {value: t})
      }, n.prototype.defineModel = function (e, t) {
        this.define(e, "$model", {value: t})
      }
    }, {}],
    29: [function (e, t) {
      function n(e, t, n) {
        this.options = i({generateId: "id"}, n || {}), this.packageMap = {}, this.typeMap = {}, this.packages = [], this.properties = t, r(e, this.registerPackage, this)
      }

      var i = e(159), r = e(80), a = e(30), o = e(24), s = e(27).parseName, c = a.isBuiltIn;
      t.exports = n, n.prototype.getPackage = function (e) {
        return this.packageMap[e]
      }, n.prototype.getPackages = function () {
        return this.packages
      }, n.prototype.registerPackage = function (e) {
        e = i({}, e), r(e.types, function (t) {
          this.registerType(t, e)
        }, this), this.packageMap[e.uri] = this.packageMap[e.prefix] = e, this.packages.push(e)
      }, n.prototype.registerType = function (e, t) {
        e = i({}, e, {
          superClass: (e.superClass || []).slice(),
          "extends": (e["extends"] || []).slice(),
          properties: (e.properties || []).slice()
        });
        var n = s(e.name, t.prefix), a = n.name, o = {};
        r(e.properties, function (e) {
          var t = s(e.name, n.prefix), r = t.name;
          c(e.type) || (e.type = s(e.type, t.prefix).name), i(e, {ns: t, name: r}), o[r] = e
        }), i(e, {ns: n, name: a, propertiesByName: o}), r(e["extends"], function (e) {
          var t = this.typeMap[e];
          t.traits = t.traits || [], t.traits.push(a)
        }, this), this.definePackage(e, t), this.typeMap[a] = e
      }, n.prototype.mapTypes = function (e, t) {
        function n(n) {
          var i = s(n, c(n) ? "" : e.prefix);
          a.mapTypes(i, t)
        }

        var i = c(e.name) ? {name: e.name} : this.typeMap[e.name], a = this;
        if (!i)throw new Error("unknown type <" + e.name + ">");
        r(i.superClass, n), t(i), r(i.traits, n)
      }, n.prototype.getEffectiveDescriptor = function (e) {
        var t = s(e), n = new o(t);
        this.mapTypes(t, function (e) {
          n.addTrait(e)
        });
        var i = this.options.generateId;
        i && !n.hasProperty(i) && n.addIdProperty(i);
        var r = n.build();
        return this.definePackage(r, r.allTypes[r.allTypes.length - 1].$pkg), r
      }, n.prototype.definePackage = function (e, t) {
        this.properties.define(e, "$pkg", {value: t})
      }
    }, {159: 159, 24: 24, 27: 27, 30: 30, 80: 80}],
    30: [function (e, t) {
      var n = {String: !0, Boolean: !0, Integer: !0, Real: !0, Element: !0}, i = {
        String: function (e) {
          return e
        }, Boolean: function (e) {
          return "true" === e
        }, Integer: function (e) {
          return parseInt(e, 10)
        }, Real: function (e) {
          return parseFloat(e, 10)
        }
      };
      t.exports.coerceType = function (e, t) {
        var n = i[e];
        return n ? n(t) : t
      }, t.exports.isBuiltIn = function (e) {
        return !!n[e]
      }, t.exports.isSimple = function (e) {
        return !!i[e]
      }
    }, {}],
    31: [function (e, t) {
      t.exports = {
        name: "BPMN20",
        uri: "http://www.omg.org/spec/BPMN/20100524/MODEL",
        associations: [],
        types: [{
          name: "Interface",
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "operations",
            type: "Operation",
            isMany: !0
          }, {name: "implementationRef", type: "String", isAttr: !0}]
        }, {
          name: "Operation",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "inMessageRef",
            type: "Message",
            isAttr: !0,
            isReference: !0
          }, {name: "outMessageRef", type: "Message", isAttr: !0, isReference: !0}, {
            name: "errorRefs",
            type: "Error",
            isMany: !0,
            isReference: !0
          }, {name: "implementationRef", type: "String", isAttr: !0}]
        }, {name: "EndPoint", superClass: ["RootElement"]}, {
          name: "Auditing",
          superClass: ["BaseElement"]
        }, {
          name: "GlobalTask",
          superClass: ["CallableElement"],
          properties: [{name: "resources", type: "ResourceRole", isMany: !0}]
        }, {name: "Monitoring", superClass: ["BaseElement"]}, {
          name: "Performer",
          superClass: ["ResourceRole"]
        }, {
          name: "Process",
          superClass: ["FlowElementsContainer", "CallableElement"],
          properties: [{name: "processType", type: "ProcessType", isAttr: !0}, {
            name: "isClosed",
            isAttr: !0,
            type: "Boolean"
          }, {name: "auditing", type: "Auditing"}, {name: "monitoring", type: "Monitoring"}, {
            name: "properties",
            type: "Property",
            isMany: !0
          }, {name: "supports", type: "Process", isMany: !0, isReference: !0}, {
            name: "definitionalCollaborationRef",
            type: "Collaboration",
            isAttr: !0,
            isReference: !0
          }, {name: "isExecutable", isAttr: !0, type: "Boolean"}, {
            name: "resources",
            type: "ResourceRole",
            isMany: !0
          }, {name: "artifacts", type: "Artifact", isMany: !0}, {
            name: "correlationSubscriptions",
            type: "CorrelationSubscription",
            isMany: !0
          }]
        }, {
          name: "LaneSet",
          superClass: ["BaseElement"],
          properties: [{name: "lanes", type: "Lane", isMany: !0}, {name: "name", isAttr: !0, type: "String"}]
        }, {
          name: "Lane",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "childLaneSet",
            type: "LaneSet",
            serialize: "xsi:type"
          }, {name: "partitionElementRef", type: "BaseElement", isAttr: !0, isReference: !0}, {
            name: "flowNodeRef",
            type: "FlowNode",
            isMany: !0,
            isReference: !0
          }, {name: "partitionElement", type: "BaseElement"}]
        }, {name: "GlobalManualTask", superClass: ["GlobalTask"]}, {
          name: "ManualTask",
          superClass: ["Task"]
        }, {
          name: "UserTask",
          superClass: ["Task"],
          properties: [{name: "renderings", type: "Rendering", isMany: !0}, {
            name: "implementation",
            isAttr: !0,
            type: "String"
          }]
        }, {name: "Rendering", superClass: ["BaseElement"]}, {
          name: "HumanPerformer",
          superClass: ["Performer"]
        }, {name: "PotentialOwner", superClass: ["HumanPerformer"]}, {
          name: "GlobalUserTask",
          superClass: ["GlobalTask"],
          properties: [{name: "implementation", isAttr: !0, type: "String"}, {
            name: "renderings",
            type: "Rendering",
            isMany: !0
          }]
        }, {
          name: "Gateway",
          isAbstract: !0,
          superClass: ["FlowNode"],
          properties: [{name: "gatewayDirection", type: "GatewayDirection", "default": "Unspecified", isAttr: !0}]
        }, {
          name: "EventBasedGateway",
          superClass: ["Gateway"],
          properties: [{name: "instantiate", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "eventGatewayType",
            type: "EventBasedGatewayType",
            isAttr: !0,
            "default": "Exclusive"
          }]
        }, {
          name: "ComplexGateway",
          superClass: ["Gateway"],
          properties: [{name: "activationCondition", type: "Expression", serialize: "xsi:type"}, {
            name: "default",
            type: "SequenceFlow",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "ExclusiveGateway",
          superClass: ["Gateway"],
          properties: [{name: "default", type: "SequenceFlow", isAttr: !0, isReference: !0}]
        }, {
          name: "InclusiveGateway",
          superClass: ["Gateway"],
          properties: [{name: "default", type: "SequenceFlow", isAttr: !0, isReference: !0}]
        }, {name: "ParallelGateway", superClass: ["Gateway"]}, {
          name: "RootElement",
          isAbstract: !0,
          superClass: ["BaseElement"]
        }, {
          name: "Relationship",
          superClass: ["BaseElement"],
          properties: [{name: "type", isAttr: !0, type: "String"}, {
            name: "direction",
            type: "RelationshipDirection",
            isAttr: !0
          }, {name: "sources", isMany: !0, isReference: !0, type: "Element"}, {
            name: "targets",
            isMany: !0,
            isReference: !0,
            type: "Element"
          }]
        }, {
          name: "BaseElement",
          isAbstract: !0,
          properties: [{name: "id", isAttr: !0, type: "String"}, {
            name: "extensionDefinitions",
            type: "ExtensionDefinition",
            isMany: !0,
            isReference: !0
          }, {name: "extensionElements", type: "ExtensionElements"}, {
            name: "documentation",
            type: "Documentation",
            isMany: !0
          }]
        }, {
          name: "Extension",
          properties: [{name: "mustUnderstand", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "definition",
            type: "ExtensionDefinition"
          }]
        }, {
          name: "ExtensionDefinition",
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "extensionAttributeDefinitions",
            type: "ExtensionAttributeDefinition",
            isMany: !0
          }]
        }, {
          name: "ExtensionAttributeDefinition",
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "type",
            isAttr: !0,
            type: "String"
          }, {name: "isReference", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "extensionDefinition",
            type: "ExtensionDefinition",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "ExtensionElements",
          properties: [{name: "valueRef", isAttr: !0, isReference: !0, type: "Element"}, {
            name: "values",
            type: "Element",
            isMany: !0
          }, {name: "extensionAttributeDefinition", type: "ExtensionAttributeDefinition", isAttr: !0, isReference: !0}]
        }, {
          name: "Documentation",
          superClass: ["BaseElement"],
          properties: [{name: "text", type: "String", isBody: !0}, {
            name: "textFormat",
            "default": "text/plain",
            isAttr: !0,
            type: "String"
          }]
        }, {
          name: "Event",
          isAbstract: !0,
          superClass: ["FlowNode", "InteractionNode"],
          properties: [{name: "properties", type: "Property", isMany: !0}]
        }, {name: "IntermediateCatchEvent", superClass: ["CatchEvent"]}, {
          name: "IntermediateThrowEvent",
          superClass: ["ThrowEvent"]
        }, {name: "EndEvent", superClass: ["ThrowEvent"]}, {
          name: "StartEvent",
          superClass: ["CatchEvent"],
          properties: [{name: "isInterrupting", "default": !0, isAttr: !0, type: "Boolean"}]
        }, {
          name: "ThrowEvent",
          isAbstract: !0,
          superClass: ["Event"],
          properties: [{name: "inputSet", type: "InputSet"}, {
            name: "eventDefinitionRefs",
            type: "EventDefinition",
            isMany: !0,
            isReference: !0
          }, {name: "dataInputAssociation", type: "DataInputAssociation", isMany: !0}, {
            name: "dataInputs",
            type: "DataInput",
            isMany: !0
          }, {name: "eventDefinitions", type: "EventDefinition", isMany: !0}]
        }, {
          name: "CatchEvent",
          isAbstract: !0,
          superClass: ["Event"],
          properties: [{name: "parallelMultiple", isAttr: !0, type: "Boolean", "default": !1}, {
            name: "outputSet",
            type: "OutputSet"
          }, {
            name: "eventDefinitionRefs",
            type: "EventDefinition",
            isMany: !0,
            isReference: !0
          }, {name: "dataOutputAssociation", type: "DataOutputAssociation", isMany: !0}, {
            name: "dataOutputs",
            type: "DataOutput",
            isMany: !0
          }, {name: "eventDefinitions", type: "EventDefinition", isMany: !0}]
        }, {
          name: "BoundaryEvent",
          superClass: ["CatchEvent"],
          properties: [{name: "cancelActivity", "default": !0, isAttr: !0, type: "Boolean"}, {
            name: "attachedToRef",
            type: "Activity",
            isAttr: !0,
            isReference: !0
          }]
        }, {name: "EventDefinition", isAbstract: !0, superClass: ["RootElement"]}, {
          name: "CancelEventDefinition",
          superClass: ["EventDefinition"]
        }, {
          name: "ErrorEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "errorRef", type: "Error", isAttr: !0, isReference: !0}]
        }, {name: "TerminateEventDefinition", superClass: ["EventDefinition"]}, {
          name: "EscalationEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "escalationRef", type: "Escalation", isAttr: !0, isReference: !0}]
        }, {
          name: "Escalation",
          properties: [{name: "structureRef", type: "ItemDefinition", isAttr: !0, isReference: !0}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }, {name: "escalationCode", isAttr: !0, type: "String"}],
          superClass: ["RootElement"]
        }, {
          name: "CompensateEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "waitForCompletion", isAttr: !0, type: "Boolean"}, {
            name: "activityRef",
            type: "Activity",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "TimerEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "timeDate", type: "Expression", serialize: "xsi:type"}, {
            name: "timeCycle",
            type: "Expression",
            serialize: "xsi:type"
          }, {name: "timeDuration", type: "Expression", serialize: "xsi:type"}]
        }, {
          name: "LinkEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "target",
            type: "LinkEventDefinition",
            isAttr: !0,
            isReference: !0
          }, {name: "source", type: "LinkEventDefinition", isMany: !0, isReference: !0}]
        }, {
          name: "MessageEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "messageRef", type: "Message", isAttr: !0, isReference: !0}, {
            name: "operationRef",
            type: "Operation",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "ConditionalEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "condition", type: "Expression", serialize: "xsi:type"}]
        }, {
          name: "SignalEventDefinition",
          superClass: ["EventDefinition"],
          properties: [{name: "signalRef", type: "Signal", isAttr: !0, isReference: !0}]
        }, {
          name: "Signal",
          superClass: ["RootElement"],
          properties: [{name: "structureRef", type: "ItemDefinition", isAttr: !0, isReference: !0}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }]
        }, {name: "ImplicitThrowEvent", superClass: ["ThrowEvent"]}, {
          name: "DataState",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}]
        }, {
          name: "ItemAwareElement",
          superClass: ["BaseElement"],
          properties: [{
            name: "itemSubjectRef",
            type: "ItemDefinition",
            isAttr: !0,
            isReference: !0
          }, {name: "dataState", type: "DataState"}]
        }, {
          name: "DataAssociation",
          superClass: ["BaseElement"],
          properties: [{name: "transformation", type: "FormalExpression"}, {
            name: "assignment",
            type: "Assignment",
            isMany: !0
          }, {name: "sourceRef", type: "ItemAwareElement", isMany: !0, isReference: !0}, {
            name: "targetRef",
            type: "ItemAwareElement",
            isReference: !0
          }]
        }, {
          name: "DataInput",
          superClass: ["ItemAwareElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "isCollection",
            "default": !1,
            isAttr: !0,
            type: "Boolean"
          }, {
            name: "inputSetRefs",
            type: "InputSet",
            isVirtual: !0,
            isMany: !0,
            isReference: !0
          }, {
            name: "inputSetWithOptional",
            type: "InputSet",
            isVirtual: !0,
            isMany: !0,
            isReference: !0
          }, {name: "inputSetWithWhileExecuting", type: "InputSet", isVirtual: !0, isMany: !0, isReference: !0}]
        }, {
          name: "DataOutput",
          superClass: ["ItemAwareElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "isCollection",
            "default": !1,
            isAttr: !0,
            type: "Boolean"
          }, {
            name: "outputSetRefs",
            type: "OutputSet",
            isVirtual: !0,
            isMany: !0,
            isReference: !0
          }, {
            name: "outputSetWithOptional",
            type: "OutputSet",
            isVirtual: !0,
            isMany: !0,
            isReference: !0
          }, {name: "outputSetWithWhileExecuting", type: "OutputSet", isVirtual: !0, isMany: !0, isReference: !0}]
        }, {
          name: "InputSet",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "dataInputRefs",
            type: "DataInput",
            isMany: !0,
            isReference: !0
          }, {
            name: "optionalInputRefs",
            type: "DataInput",
            isMany: !0,
            isReference: !0
          }, {name: "whileExecutingInputRefs", type: "DataInput", isMany: !0, isReference: !0}, {
            name: "outputSetRefs",
            type: "OutputSet",
            isMany: !0,
            isReference: !0
          }]
        }, {
          name: "OutputSet",
          superClass: ["BaseElement"],
          properties: [{name: "dataOutputRefs", type: "DataOutput", isMany: !0, isReference: !0}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }, {name: "inputSetRefs", type: "InputSet", isMany: !0, isReference: !0}, {
            name: "optionalOutputRefs",
            type: "DataOutput",
            isMany: !0,
            isReference: !0
          }, {name: "whileExecutingOutputRefs", type: "DataOutput", isMany: !0, isReference: !0}]
        }, {
          name: "Property",
          superClass: ["ItemAwareElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}]
        }, {name: "DataInputAssociation", superClass: ["DataAssociation"]}, {
          name: "DataOutputAssociation",
          superClass: ["DataAssociation"]
        }, {
          name: "InputOutputSpecification",
          superClass: ["BaseElement"],
          properties: [{name: "inputSets", type: "InputSet", isMany: !0}, {
            name: "outputSets",
            type: "OutputSet",
            isMany: !0
          }, {name: "dataInputs", type: "DataInput", isMany: !0}, {name: "dataOutputs", type: "DataOutput", isMany: !0}]
        }, {
          name: "DataObject",
          superClass: ["FlowElement", "ItemAwareElement"],
          properties: [{name: "isCollection", "default": !1, isAttr: !0, type: "Boolean"}]
        }, {
          name: "InputOutputBinding",
          properties: [{name: "inputDataRef", type: "InputSet", isAttr: !0, isReference: !0}, {
            name: "outputDataRef",
            type: "OutputSet",
            isAttr: !0,
            isReference: !0
          }, {name: "operationRef", type: "Operation", isAttr: !0, isReference: !0}]
        }, {
          name: "Assignment",
          superClass: ["BaseElement"],
          properties: [{name: "from", type: "Expression", serialize: "xsi:type"}, {
            name: "to",
            type: "Expression",
            serialize: "xsi:type"
          }]
        }, {
          name: "DataStore",
          superClass: ["RootElement", "ItemAwareElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "capacity",
            isAttr: !0,
            type: "Integer"
          }, {name: "isUnlimited", "default": !0, isAttr: !0, type: "Boolean"}]
        }, {
          name: "DataStoreReference",
          superClass: ["ItemAwareElement", "FlowElement"],
          properties: [{name: "dataStoreRef", type: "DataStore", isAttr: !0, isReference: !0}]
        }, {
          name: "DataObjectReference",
          superClass: ["ItemAwareElement", "FlowElement"],
          properties: [{name: "dataObjectRef", type: "DataObject", isAttr: !0, isReference: !0}]
        }, {
          name: "ConversationLink",
          superClass: ["BaseElement"],
          properties: [{name: "sourceRef", type: "InteractionNode", isAttr: !0, isReference: !0}, {
            name: "targetRef",
            type: "InteractionNode",
            isAttr: !0,
            isReference: !0
          }, {name: "name", isAttr: !0, type: "String"}]
        }, {
          name: "ConversationAssociation",
          superClass: ["BaseElement"],
          properties: [{
            name: "innerConversationNodeRef",
            type: "ConversationNode",
            isAttr: !0,
            isReference: !0
          }, {name: "outerConversationNodeRef", type: "ConversationNode", isAttr: !0, isReference: !0}]
        }, {
          name: "CallConversation",
          superClass: ["ConversationNode"],
          properties: [{
            name: "calledCollaborationRef",
            type: "Collaboration",
            isAttr: !0,
            isReference: !0
          }, {name: "participantAssociations", type: "ParticipantAssociation", isMany: !0}]
        }, {name: "Conversation", superClass: ["ConversationNode"]}, {
          name: "SubConversation",
          superClass: ["ConversationNode"],
          properties: [{name: "conversationNodes", type: "ConversationNode", isMany: !0}]
        }, {
          name: "ConversationNode",
          isAbstract: !0,
          superClass: ["InteractionNode", "BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "participantRefs",
            type: "Participant",
            isMany: !0,
            isReference: !0
          }, {name: "messageFlowRefs", type: "MessageFlow", isMany: !0, isReference: !0}, {
            name: "correlationKeys",
            type: "CorrelationKey",
            isMany: !0
          }]
        }, {name: "GlobalConversation", superClass: ["Collaboration"]}, {
          name: "PartnerEntity",
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "participantRef",
            type: "Participant",
            isMany: !0,
            isReference: !0
          }]
        }, {
          name: "PartnerRole",
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "participantRef",
            type: "Participant",
            isMany: !0,
            isReference: !0
          }]
        }, {
          name: "CorrelationProperty",
          superClass: ["RootElement"],
          properties: [{
            name: "correlationPropertyRetrievalExpression",
            type: "CorrelationPropertyRetrievalExpression",
            isMany: !0
          }, {name: "name", isAttr: !0, type: "String"}, {
            name: "type",
            type: "ItemDefinition",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "Error",
          superClass: ["RootElement"],
          properties: [{name: "structureRef", type: "ItemDefinition", isAttr: !0, isReference: !0}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }, {name: "errorCode", isAttr: !0, type: "String"}]
        }, {
          name: "CorrelationKey",
          superClass: ["BaseElement"],
          properties: [{
            name: "correlationPropertyRef",
            type: "CorrelationProperty",
            isMany: !0,
            isReference: !0
          }, {name: "name", isAttr: !0, type: "String"}]
        }, {name: "Expression", superClass: ["BaseElement"], isAbstract: !0}, {
          name: "FormalExpression",
          superClass: ["Expression"],
          properties: [{name: "language", isAttr: !0, type: "String"}, {
            name: "body",
            type: "String",
            isBody: !0
          }, {name: "evaluatesToTypeRef", type: "ItemDefinition", isAttr: !0, isReference: !0}]
        }, {
          name: "Message",
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "itemRef",
            type: "ItemDefinition",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "ItemDefinition",
          superClass: ["RootElement"],
          properties: [{name: "itemKind", type: "ItemKind", isAttr: !0}, {
            name: "structureRef",
            type: "String",
            isAttr: !0
          }, {name: "isCollection", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "import",
            type: "Import",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "FlowElement",
          isAbstract: !0,
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "auditing",
            type: "Auditing"
          }, {name: "monitoring", type: "Monitoring"}, {
            name: "categoryValueRef",
            type: "CategoryValue",
            isMany: !0,
            isReference: !0
          }]
        }, {
          name: "SequenceFlow",
          superClass: ["FlowElement"],
          properties: [{name: "isImmediate", isAttr: !0, type: "Boolean"}, {
            name: "conditionExpression",
            type: "Expression",
            serialize: "xsi:type"
          }, {name: "sourceRef", type: "FlowNode", isAttr: !0, isReference: !0}, {
            name: "targetRef",
            type: "FlowNode",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "FlowElementsContainer",
          isAbstract: !0,
          superClass: ["BaseElement"],
          properties: [{name: "laneSets", type: "LaneSet", isMany: !0}, {
            name: "flowElements",
            type: "FlowElement",
            isMany: !0
          }]
        }, {
          name: "CallableElement",
          isAbstract: !0,
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "ioSpecification",
            type: "InputOutputSpecification"
          }, {name: "supportedInterfaceRefs", type: "Interface", isMany: !0, isReference: !0}, {
            name: "ioBinding",
            type: "InputOutputBinding",
            isMany: !0
          }]
        }, {
          name: "FlowNode",
          isAbstract: !0,
          superClass: ["FlowElement"],
          properties: [{name: "incoming", type: "SequenceFlow", isMany: !0, isReference: !0}, {
            name: "outgoing",
            type: "SequenceFlow",
            isMany: !0,
            isReference: !0
          }, {name: "lanes", type: "Lane", isVirtual: !0, isMany: !0, isReference: !0}]
        }, {
          name: "CorrelationPropertyRetrievalExpression",
          superClass: ["BaseElement"],
          properties: [{name: "messagePath", type: "FormalExpression"}, {
            name: "messageRef",
            type: "Message",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "CorrelationPropertyBinding",
          superClass: ["BaseElement"],
          properties: [{name: "dataPath", type: "FormalExpression"}, {
            name: "correlationPropertyRef",
            type: "CorrelationProperty",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "Resource",
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "resourceParameters",
            type: "ResourceParameter",
            isMany: !0
          }]
        }, {
          name: "ResourceParameter",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "isRequired",
            isAttr: !0,
            type: "Boolean"
          }, {name: "type", type: "ItemDefinition", isAttr: !0, isReference: !0}]
        }, {
          name: "CorrelationSubscription",
          superClass: ["BaseElement"],
          properties: [{
            name: "correlationKeyRef",
            type: "CorrelationKey",
            isAttr: !0,
            isReference: !0
          }, {name: "correlationPropertyBinding", type: "CorrelationPropertyBinding", isMany: !0}]
        }, {
          name: "MessageFlow",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "sourceRef",
            type: "InteractionNode",
            isAttr: !0,
            isReference: !0
          }, {name: "targetRef", type: "InteractionNode", isAttr: !0, isReference: !0}, {
            name: "messageRef",
            type: "Message",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "MessageFlowAssociation",
          superClass: ["BaseElement"],
          properties: [{
            name: "innerMessageFlowRef",
            type: "MessageFlow",
            isAttr: !0,
            isReference: !0
          }, {name: "outerMessageFlowRef", type: "MessageFlow", isAttr: !0, isReference: !0}]
        }, {
          name: "InteractionNode",
          isAbstract: !0,
          properties: [{
            name: "incomingConversationLinks",
            type: "ConversationLink",
            isVirtual: !0,
            isMany: !0,
            isReference: !0
          }, {name: "outgoingConversationLinks", type: "ConversationLink", isVirtual: !0, isMany: !0, isReference: !0}]
        }, {
          name: "Participant",
          superClass: ["InteractionNode", "BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "interfaceRefs",
            type: "Interface",
            isMany: !0,
            isReference: !0
          }, {name: "participantMultiplicity", type: "ParticipantMultiplicity"}, {
            name: "endPointRefs",
            type: "EndPoint",
            isMany: !0,
            isReference: !0
          }, {name: "processRef", type: "Process", isAttr: !0, isReference: !0}]
        }, {
          name: "ParticipantAssociation",
          superClass: ["BaseElement"],
          properties: [{
            name: "innerParticipantRef",
            type: "Participant",
            isAttr: !0,
            isReference: !0
          }, {name: "outerParticipantRef", type: "Participant", isAttr: !0, isReference: !0}]
        }, {
          name: "ParticipantMultiplicity",
          properties: [{name: "minimum", "default": 0, isAttr: !0, type: "Integer"}, {
            name: "maximum",
            "default": 1,
            isAttr: !0,
            type: "Integer"
          }]
        }, {
          name: "Collaboration",
          superClass: ["RootElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "isClosed",
            isAttr: !0,
            type: "Boolean"
          }, {name: "choreographyRef", type: "Choreography", isMany: !0, isReference: !0}, {
            name: "artifacts",
            type: "Artifact",
            isMany: !0
          }, {
            name: "participantAssociations",
            type: "ParticipantAssociation",
            isMany: !0
          }, {
            name: "messageFlowAssociations",
            type: "MessageFlowAssociation",
            isMany: !0
          }, {name: "conversationAssociations", type: "ConversationAssociation"}, {
            name: "participants",
            type: "Participant",
            isMany: !0
          }, {name: "messageFlows", type: "MessageFlow", isMany: !0}, {
            name: "correlationKeys",
            type: "CorrelationKey",
            isMany: !0
          }, {name: "conversations", type: "ConversationNode", isMany: !0}, {
            name: "conversationLinks",
            type: "ConversationLink",
            isMany: !0
          }]
        }, {
          name: "ChoreographyActivity",
          isAbstract: !0,
          superClass: ["FlowNode"],
          properties: [{
            name: "participantRefs",
            type: "Participant",
            isMany: !0,
            isReference: !0
          }, {
            name: "initiatingParticipantRef",
            type: "Participant",
            isAttr: !0,
            isReference: !0
          }, {name: "correlationKeys", type: "CorrelationKey", isMany: !0}, {
            name: "loopType",
            type: "ChoreographyLoopType",
            "default": "None",
            isAttr: !0
          }]
        }, {
          name: "CallChoreography",
          superClass: ["ChoreographyActivity"],
          properties: [{
            name: "calledChoreographyRef",
            type: "Choreography",
            isAttr: !0,
            isReference: !0
          }, {name: "participantAssociations", type: "ParticipantAssociation", isMany: !0}]
        }, {
          name: "SubChoreography",
          superClass: ["ChoreographyActivity", "FlowElementsContainer"],
          properties: [{name: "artifacts", type: "Artifact", isMany: !0}]
        }, {
          name: "ChoreographyTask",
          superClass: ["ChoreographyActivity"],
          properties: [{name: "messageFlowRef", type: "MessageFlow", isMany: !0, isReference: !0}]
        }, {
          name: "Choreography",
          superClass: ["FlowElementsContainer", "Collaboration"]
        }, {
          name: "GlobalChoreographyTask",
          superClass: ["Choreography"],
          properties: [{name: "initiatingParticipantRef", type: "Participant", isAttr: !0, isReference: !0}]
        }, {
          name: "TextAnnotation",
          superClass: ["Artifact"],
          properties: [{name: "text", type: "String"}, {
            name: "textFormat",
            "default": "text/plain",
            isAttr: !0,
            type: "String"
          }]
        }, {
          name: "Group",
          superClass: ["Artifact"],
          properties: [{name: "categoryValueRef", type: "CategoryValue", isAttr: !0, isReference: !0}]
        }, {
          name: "Association",
          superClass: ["Artifact"],
          properties: [{name: "associationDirection", type: "AssociationDirection", isAttr: !0}, {
            name: "sourceRef",
            type: "BaseElement",
            isAttr: !0,
            isReference: !0
          }, {name: "targetRef", type: "BaseElement", isAttr: !0, isReference: !0}]
        }, {
          name: "Category",
          superClass: ["RootElement"],
          properties: [{name: "categoryValue", type: "CategoryValue", isMany: !0}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }]
        }, {name: "Artifact", isAbstract: !0, superClass: ["BaseElement"]}, {
          name: "CategoryValue",
          superClass: ["BaseElement"],
          properties: [{
            name: "categorizedFlowElements",
            type: "FlowElement",
            isVirtual: !0,
            isMany: !0,
            isReference: !0
          }, {name: "value", isAttr: !0, type: "String"}]
        }, {
          name: "Activity",
          isAbstract: !0,
          superClass: ["FlowNode"],
          properties: [{
            name: "isForCompensation",
            "default": !1,
            isAttr: !0,
            type: "Boolean"
          }, {name: "loopCharacteristics", type: "LoopCharacteristics"}, {
            name: "resources",
            type: "ResourceRole",
            isMany: !0
          }, {name: "default", type: "SequenceFlow", isAttr: !0, isReference: !0}, {
            name: "properties",
            type: "Property",
            isMany: !0
          }, {name: "ioSpecification", type: "InputOutputSpecification"}, {
            name: "boundaryEventRefs",
            type: "BoundaryEvent",
            isMany: !0,
            isReference: !0
          }, {name: "dataInputAssociations", type: "DataInputAssociation", isMany: !0}, {
            name: "dataOutputAssociations",
            type: "DataOutputAssociation",
            isMany: !0
          }, {name: "startQuantity", "default": 1, isAttr: !0, type: "Integer"}, {
            name: "completionQuantity",
            "default": 1,
            isAttr: !0,
            type: "Integer"
          }]
        }, {
          name: "ServiceTask",
          superClass: ["Task"],
          properties: [{name: "implementation", isAttr: !0, type: "String"}, {
            name: "operationRef",
            type: "Operation",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "SubProcess",
          superClass: ["Activity", "FlowElementsContainer"],
          properties: [{name: "triggeredByEvent", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "artifacts",
            type: "Artifact",
            isMany: !0
          }]
        }, {
          name: "LoopCharacteristics",
          isAbstract: !0,
          superClass: ["BaseElement"]
        }, {
          name: "MultiInstanceLoopCharacteristics",
          superClass: ["LoopCharacteristics"],
          properties: [{name: "isSequential", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "behavior",
            type: "MultiInstanceBehavior",
            "default": "All",
            isAttr: !0
          }, {name: "loopCardinality", type: "Expression", serialize: "xsi:type"}, {
            name: "loopDataInputRef",
            type: "ItemAwareElement",
            isAttr: !0,
            isReference: !0
          }, {name: "loopDataOutputRef", type: "ItemAwareElement", isAttr: !0, isReference: !0}, {
            name: "inputDataItem",
            type: "DataInput"
          }, {name: "outputDataItem", type: "DataOutput"}, {
            name: "completionCondition",
            type: "Expression",
            serialize: "xsi:type"
          }, {
            name: "complexBehaviorDefinition",
            type: "ComplexBehaviorDefinition",
            isMany: !0
          }, {
            name: "oneBehaviorEventRef",
            type: "EventDefinition",
            isAttr: !0,
            isReference: !0
          }, {name: "noneBehaviorEventRef", type: "EventDefinition", isAttr: !0, isReference: !0}]
        }, {
          name: "StandardLoopCharacteristics",
          superClass: ["LoopCharacteristics"],
          properties: [{name: "testBefore", "default": !1, isAttr: !0, type: "Boolean"}, {
            name: "loopCondition",
            type: "Expression",
            serialize: "xsi:type"
          }, {name: "loopMaximum", type: "Expression", serialize: "xsi:type"}]
        }, {
          name: "CallActivity",
          superClass: ["Activity"],
          properties: [{name: "calledElement", type: "String", isAttr: !0}]
        }, {name: "Task", superClass: ["Activity", "InteractionNode"]}, {
          name: "SendTask",
          superClass: ["Task"],
          properties: [{name: "implementation", isAttr: !0, type: "String"}, {
            name: "operationRef",
            type: "Operation",
            isAttr: !0,
            isReference: !0
          }, {name: "messageRef", type: "Message", isAttr: !0, isReference: !0}]
        }, {
          name: "ReceiveTask",
          superClass: ["Task"],
          properties: [{name: "implementation", isAttr: !0, type: "String"}, {
            name: "instantiate",
            "default": !1,
            isAttr: !0,
            type: "Boolean"
          }, {name: "operationRef", type: "Operation", isAttr: !0, isReference: !0}, {
            name: "messageRef",
            type: "Message",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "ScriptTask",
          superClass: ["Task"],
          properties: [{name: "scriptFormat", isAttr: !0, type: "String"}, {name: "script", type: "String"}]
        }, {
          name: "BusinessRuleTask",
          superClass: ["Task"],
          properties: [{name: "implementation", isAttr: !0, type: "String"}]
        }, {
          name: "AdHocSubProcess",
          superClass: ["SubProcess"],
          properties: [{name: "completionCondition", type: "Expression", serialize: "xsi:type"}, {
            name: "ordering",
            type: "AdHocOrdering",
            isAttr: !0
          }, {name: "cancelRemainingInstances", "default": !0, isAttr: !0, type: "Boolean"}]
        }, {
          name: "Transaction",
          superClass: ["SubProcess"],
          properties: [{name: "protocol", isAttr: !0, type: "String"}, {name: "method", isAttr: !0, type: "String"}]
        }, {
          name: "GlobalScriptTask",
          superClass: ["GlobalTask"],
          properties: [{name: "scriptLanguage", isAttr: !0, type: "String"}, {
            name: "script",
            isAttr: !0,
            type: "String"
          }]
        }, {
          name: "GlobalBusinessRuleTask",
          superClass: ["GlobalTask"],
          properties: [{name: "implementation", isAttr: !0, type: "String"}]
        }, {
          name: "ComplexBehaviorDefinition",
          superClass: ["BaseElement"],
          properties: [{name: "condition", type: "FormalExpression"}, {name: "event", type: "ImplicitThrowEvent"}]
        }, {
          name: "ResourceRole",
          superClass: ["BaseElement"],
          properties: [{
            name: "resourceRef",
            type: "Resource",
            isAttr: !0,
            isReference: !0
          }, {
            name: "resourceParameterBindings",
            type: "ResourceParameterBinding",
            isMany: !0
          }, {name: "resourceAssignmentExpression", type: "ResourceAssignmentExpression"}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }]
        }, {
          name: "ResourceParameterBinding",
          properties: [{name: "expression", type: "Expression", serialize: "xsi:type"}, {
            name: "parameterRef",
            type: "ResourceParameter",
            isAttr: !0,
            isReference: !0
          }]
        }, {
          name: "ResourceAssignmentExpression",
          properties: [{name: "expression", type: "Expression", serialize: "xsi:type"}]
        }, {
          name: "Import",
          properties: [{name: "importType", isAttr: !0, type: "String"}, {
            name: "location",
            isAttr: !0,
            type: "String"
          }, {name: "namespace", isAttr: !0, type: "String"}]
        }, {
          name: "Definitions",
          superClass: ["BaseElement"],
          properties: [{name: "name", isAttr: !0, type: "String"}, {
            name: "targetNamespace",
            isAttr: !0,
            type: "String"
          }, {
            name: "expressionLanguage",
            "default": "http://www.w3.org/1999/XPath",
            isAttr: !0,
            type: "String"
          }, {
            name: "typeLanguage",
            "default": "http://www.w3.org/2001/XMLSchema",
            isAttr: !0,
            type: "String"
          }, {name: "imports", type: "Import", isMany: !0}, {
            name: "extensions",
            type: "Extension",
            isMany: !0
          }, {name: "relationships", type: "Relationship", isMany: !0}, {
            name: "rootElements",
            type: "RootElement",
            isMany: !0
          }, {name: "diagrams", isMany: !0, type: "bpmndi:BPMNDiagram"}, {
            name: "exporter",
            isAttr: !0,
            type: "String"
          }, {name: "exporterVersion", isAttr: !0, type: "String"}]
        }],
        emumerations: [{
          name: "ProcessType",
          literalValues: [{name: "None"}, {name: "Public"}, {name: "Private"}]
        }, {
          name: "GatewayDirection",
          literalValues: [{name: "Unspecified"}, {name: "Converging"}, {name: "Diverging"}, {name: "Mixed"}]
        }, {
          name: "EventBasedGatewayType",
          literalValues: [{name: "Parallel"}, {name: "Exclusive"}]
        }, {
          name: "RelationshipDirection",
          literalValues: [{name: "None"}, {name: "Forward"}, {name: "Backward"}, {name: "Both"}]
        }, {
          name: "ItemKind",
          literalValues: [{name: "Physical"}, {name: "Information"}]
        }, {
          name: "ChoreographyLoopType",
          literalValues: [{name: "None"}, {name: "Standard"}, {name: "MultiInstanceSequential"}, {name: "MultiInstanceParallel"}]
        }, {
          name: "AssociationDirection",
          literalValues: [{name: "None"}, {name: "One"}, {name: "Both"}]
        }, {
          name: "MultiInstanceBehavior",
          literalValues: [{name: "None"}, {name: "One"}, {name: "All"}, {name: "Complex"}]
        }, {name: "AdHocOrdering", literalValues: [{name: "Parallel"}, {name: "Sequential"}]}],
        prefix: "bpmn",
        xml: {tagAlias: "lowerCase", typePrefix: "t"}
      }
    }, {}],
    32: [function (e, t) {
      t.exports = {
        name: "BPMNDI",
        uri: "http://www.omg.org/spec/BPMN/20100524/DI",
        types: [{
          name: "BPMNDiagram",
          properties: [{name: "plane", type: "BPMNPlane", redefines: "di:Diagram#rootElement"}, {
            name: "labelStyle",
            type: "BPMNLabelStyle",
            isMany: !0
          }],
          superClass: ["di:Diagram"]
        }, {
          name: "BPMNPlane",
          properties: [{
            name: "bpmnElement",
            isAttr: !0,
            isReference: !0,
            type: "bpmn:BaseElement",
            redefines: "di:DiagramElement#modelElement"
          }],
          superClass: ["di:Plane"]
        }, {
          name: "BPMNShape",
          properties: [{
            name: "bpmnElement",
            isAttr: !0,
            isReference: !0,
            type: "bpmn:BaseElement",
            redefines: "di:DiagramElement#modelElement"
          }, {name: "isHorizontal", isAttr: !0, type: "Boolean"}, {
            name: "isExpanded",
            isAttr: !0,
            type: "Boolean"
          }, {name: "isMarkerVisible", isAttr: !0, type: "Boolean"}, {
            name: "label",
            type: "BPMNLabel"
          }, {name: "isMessageVisible", isAttr: !0, type: "Boolean"}, {
            name: "participantBandKind",
            type: "ParticipantBandKind",
            isAttr: !0
          }, {name: "choreographyActivityShape", type: "BPMNShape", isAttr: !0, isReference: !0}],
          superClass: ["di:LabeledShape"]
        }, {
          name: "BPMNEdge",
          properties: [{name: "label", type: "BPMNLabel"}, {
            name: "bpmnElement",
            isAttr: !0,
            isReference: !0,
            type: "bpmn:BaseElement",
            redefines: "di:DiagramElement#modelElement"
          }, {
            name: "sourceElement",
            isAttr: !0,
            isReference: !0,
            type: "di:DiagramElement",
            redefines: "di:Edge#source"
          }, {
            name: "targetElement",
            isAttr: !0,
            isReference: !0,
            type: "di:DiagramElement",
            redefines: "di:Edge#target"
          }, {name: "messageVisibleKind", type: "MessageVisibleKind", isAttr: !0, "default": "initiating"}],
          superClass: ["di:LabeledEdge"]
        }, {
          name: "BPMNLabel",
          properties: [{
            name: "labelStyle",
            type: "BPMNLabelStyle",
            isAttr: !0,
            isReference: !0,
            redefines: "di:DiagramElement#style"
          }],
          superClass: ["di:Label"]
        }, {name: "BPMNLabelStyle", properties: [{name: "font", type: "dc:Font"}], superClass: ["di:Style"]}],
        emumerations: [{
          name: "ParticipantBandKind",
          literalValues: [{name: "top_initiating"}, {name: "middle_initiating"}, {name: "bottom_initiating"}, {name: "top_non_initiating"}, {name: "middle_non_initiating"}, {name: "bottom_non_initiating"}]
        }, {name: "MessageVisibleKind", literalValues: [{name: "initiating"}, {name: "non_initiating"}]}],
        associations: [],
        prefix: "bpmndi"
      }
    }, {}],
    33: [function (e, t) {
      t.exports = {
        name: "DC",
        uri: "http://www.omg.org/spec/DD/20100524/DC",
        types: [{name: "Boolean"}, {name: "Integer"}, {name: "Real"}, {name: "String"}, {
          name: "Font",
          properties: [{name: "name", type: "String", isAttr: !0}, {
            name: "size",
            type: "Real",
            isAttr: !0
          }, {name: "isBold", type: "Boolean", isAttr: !0}, {
            name: "isItalic",
            type: "Boolean",
            isAttr: !0
          }, {name: "isUnderline", type: "Boolean", isAttr: !0}, {name: "isStrikeThrough", type: "Boolean", isAttr: !0}]
        }, {
          name: "Point",
          properties: [{name: "x", type: "Real", "default": "0", isAttr: !0}, {
            name: "y",
            type: "Real",
            "default": "0",
            isAttr: !0
          }]
        }, {
          name: "Bounds",
          properties: [{name: "x", type: "Real", "default": "0", isAttr: !0}, {
            name: "y",
            type: "Real",
            "default": "0",
            isAttr: !0
          }, {name: "width", type: "Real", isAttr: !0}, {name: "height", type: "Real", isAttr: !0}]
        }],
        prefix: "dc",
        associations: []
      }
    }, {}],
    34: [function (e, t) {
      t.exports = {
        name: "DI",
        uri: "http://www.omg.org/spec/DD/20100524/DI",
        types: [{
          name: "DiagramElement",
          isAbstract: !0,
          properties: [{name: "extension", type: "Extension"}, {
            name: "owningDiagram",
            type: "Diagram",
            isReadOnly: !0,
            isVirtual: !0,
            isReference: !0
          }, {
            name: "owningElement",
            type: "DiagramElement",
            isReadOnly: !0,
            isVirtual: !0,
            isReference: !0
          }, {name: "modelElement", isReadOnly: !0, isVirtual: !0, isReference: !0, type: "Element"}, {
            name: "style",
            type: "Style",
            isReadOnly: !0,
            isVirtual: !0,
            isReference: !0
          }, {name: "ownedElement", type: "DiagramElement", isReadOnly: !0, isVirtual: !0, isMany: !0}]
        }, {name: "Node", isAbstract: !0, superClass: ["DiagramElement"]}, {
          name: "Edge",
          isAbstract: !0,
          superClass: ["DiagramElement"],
          properties: [{
            name: "source",
            type: "DiagramElement",
            isReadOnly: !0,
            isVirtual: !0,
            isReference: !0
          }, {
            name: "target",
            type: "DiagramElement",
            isReadOnly: !0,
            isVirtual: !0,
            isReference: !0
          }, {name: "waypoint", isUnique: !1, isMany: !0, type: "dc:Point", serialize: "xsi:type"}]
        }, {
          name: "Diagram",
          isAbstract: !0,
          properties: [{name: "rootElement", type: "DiagramElement", isReadOnly: !0, isVirtual: !0}, {
            name: "name",
            isAttr: !0,
            type: "String"
          }, {name: "documentation", isAttr: !0, type: "String"}, {
            name: "resolution",
            isAttr: !0,
            type: "Real"
          }, {name: "ownedStyle", type: "Style", isReadOnly: !0, isVirtual: !0, isMany: !0}]
        }, {
          name: "Shape",
          isAbstract: !0,
          superClass: ["Node"],
          properties: [{name: "bounds", type: "dc:Bounds"}]
        }, {
          name: "Plane",
          isAbstract: !0,
          superClass: ["Node"],
          properties: [{
            name: "planeElement",
            type: "DiagramElement",
            subsettedProperty: "DiagramElement-ownedElement",
            isMany: !0
          }]
        }, {
          name: "LabeledEdge",
          isAbstract: !0,
          superClass: ["Edge"],
          properties: [{
            name: "ownedLabel",
            type: "Label",
            isReadOnly: !0,
            subsettedProperty: "DiagramElement-ownedElement",
            isVirtual: !0,
            isMany: !0
          }]
        }, {
          name: "LabeledShape",
          isAbstract: !0,
          superClass: ["Shape"],
          properties: [{
            name: "ownedLabel",
            type: "Label",
            isReadOnly: !0,
            subsettedProperty: "DiagramElement-ownedElement",
            isVirtual: !0,
            isMany: !0
          }]
        }, {
          name: "Label",
          isAbstract: !0,
          superClass: ["Node"],
          properties: [{name: "bounds", type: "dc:Bounds"}]
        }, {name: "Style", isAbstract: !0}, {
          name: "Extension",
          properties: [{name: "values", type: "Element", isMany: !0}]
        }],
        associations: [],
        prefix: "di",
        xml: {tagAlias: "lowerCase"}
      }
    }, {}],
    35: [function (e, t) {
      t.exports = e(36)
    }, {36: 36}],
    36: [function (e, t) {
      function n(e) {
        function t(e) {
          return r.indexOf(e) >= 0
        }

        function n(e) {
          r.push(e)
        }

        function i(e) {
          t(e) || ((e.__depends__ || []).forEach(i), t(e) || (n(e), (e.__init__ || []).forEach(function (e) {
            o.push(e)
          })))
        }

        var r = [], o = [];
        e.forEach(i);
        var s = new a.Injector(r);
        return o.forEach(function (e) {
          try {
            s["string" == typeof e ? "get" : "invoke"](e)
          } catch (t) {
            throw console.error("Failed to instantiate component"), console.error(t.stack), t
          }
        }), s
      }

      function i(t) {
        t = t || {};
        var i = {config: ["value", t]}, r = e(42), a = [i, r].concat(t.modules || []);
        return n(a)
      }

      function r(e, t) {
        this.injector = t = t || i(e), this.get = t.get, this.invoke = t.invoke, this.get("eventBus").fire("diagram.init")
      }

      var a = e(73);
      t.exports = r, r.prototype.destroy = function () {
        this.get("eventBus").fire("diagram.destroy")
      }
    }, {42: 42, 73: 73}],
    37: [function (e, t) {
      function n(e, t) {
        return Math.round(e * t) / t
      }

      function i(e) {
        return c(e) ? e + "px" : e
      }

      function r(e) {
        e = l({}, {width: "100%", height: "100%"}, e);
        var t = e.container || document.body, n = document.createElement("div");
        return n.setAttribute("class", "djs-container"), l(n.style, {
          position: "relative",
          overflow: "hidden",
          width: i(e.width),
          height: i(e.height)
        }), t.appendChild(n), n
      }

      function a(e, t) {
        return e.group().attr({"class": t})
      }

      function o(e, t, n, i) {
        this._eventBus = t, this._elementRegistry = i, this._graphicsFactory = n, this._init(e || {})
      }

      function s(e, t) {
        var n = "matrix(" + t.a + "," + t.b + "," + t.c + "," + t.d + "," + t.e + "," + t.f + ")";
        e.setAttribute("transform", n)
      }

      var c = e(153), l = e(159), u = e(80), p = e(62), d = e(71), f = "base";
      o.$inject = ["config.canvas", "eventBus", "graphicsFactory", "elementRegistry"], t.exports = o, o.prototype._init = function (e) {
        var t = this._eventBus, n = r(e), i = d.createSnapAt("100%", "100%", n), o = a(i, "viewport"), s = this;
        this._container = n, this._svg = i, this._viewport = o, this._layers = {}, t.on("diagram.init", function () {
          t.fire("canvas.init", {svg: i, viewport: o})
        }), t.on("diagram.destroy", function () {
          var e = s._container.parentNode;
          e && e.removeChild(n), t.fire("canvas.destroy", {
            svg: s._svg,
            viewport: s._viewport
          }), s._svg.remove(), s._svg = s._container = s._layers = s._viewport = null
        })
      }, o.prototype.getDefaultLayer = function () {
        return this.getLayer(f)
      }, o.prototype.getLayer = function (e) {
        if (!e)throw new Error("must specify a name");
        var t = this._layers[e];
        return t || (t = this._layers[e] = a(this._viewport, "layer-" + e)), t
      }, o.prototype.getContainer = function () {
        return this._container
      }, o.prototype._updateMarker = function (e, t, n) {
        var i;
        e.id || (e = this._elementRegistry.get(e)), i = this.getGraphics(e), i && (i[n ? "addClass" : "removeClass"](t), this._eventBus.fire("element.marker.update", {
          element: e,
          gfx: i,
          marker: t,
          add: !!n
        }))
      }, o.prototype.addMarker = function (e, t) {
        this._updateMarker(e, t, !0)
      }, o.prototype.removeMarker = function (e, t) {
        this._updateMarker(e, t, !1)
      }, o.prototype.hasMarker = function (e, t) {
        e.id || (e = this._elementRegistry.get(e));
        var n = this.getGraphics(e);
        return n && n.hasClass(t)
      }, o.prototype.toggleMarker = function (e, t) {
        this.hasMarker(e, t) ? this.removeMarker(e, t) : this.addMarker(e, t)
      }, o.prototype.getRootElement = function () {
        return this._rootElement || this.setRootElement({id: "__implicitroot"}), this._rootElement
      }, o.prototype.setRootElement = function (e, t) {
        var n = this._rootElement, i = this._elementRegistry;
        if (n) {
          if (!t)throw new Error("rootElement already defined");
          i.remove(n)
        }
        return i.add(e, this.getDefaultLayer(), this._svg), this._rootElement = e, e
      }, o.prototype._ensureValidId = function (e) {
        if (!e.id)throw new Error("element must have an id");
        if (this._elementRegistry.get(e.id))throw new Error("element with id " + e.id + " already exists")
      }, o.prototype._setParent = function (e, t) {
        p.add(t.children, e), e.parent = t
      }, o.prototype._addElement = function (e, t, n) {
        n = n || this.getRootElement();
        var i = this._eventBus, r = this._graphicsFactory;
        this._ensureValidId(t), i.fire(e + ".add", {element: t, parent: n}), this._setParent(t, n);
        var a = r.create(e, t);
        return this._elementRegistry.add(t, a), r.update(e, t, a), i.fire(e + ".added", {element: t, gfx: a}), t
      }, o.prototype.addShape = function (e, t) {
        return this._addElement("shape", e, t)
      }, o.prototype.addConnection = function (e, t) {
        return this._addElement("connection", e, t)
      }, o.prototype._removeElement = function (e, t) {
        var n = this._elementRegistry, i = this._graphicsFactory, r = this._eventBus;
        return (e = n.get(e.id || e)) ? (r.fire(t + ".remove", {element: e}), i.remove(e), p.remove(e.parent && e.parent.children, e), e.parent = null, r.fire(t + ".removed", {element: e}), n.remove(e), e) : void 0
      }, o.prototype.removeShape = function (e) {
        return this._removeElement(e, "shape")
      }, o.prototype.removeConnection = function (e) {
        return this._removeElement(e, "connection")
      }, o.prototype.sendToFront = function (e, t) {
        t !== !1 && (t = !0), t && e.parent && this.sendToFront(e.parent), u(e.children, function (e) {
          this.sendToFront(e, !1)
        }, this);
        var n = this.getGraphics(e), i = n.parent();
        n.remove().appendTo(i)
      }, o.prototype.getGraphics = function (e) {
        return this._elementRegistry.getGraphics(e)
      }, o.prototype._fireViewboxChange = function () {
        this._eventBus.fire("canvas.viewbox.changed", {viewbox: this.viewbox(!1)})
      }, o.prototype.viewbox = function (e) {
        if (void 0 === e && this._cachedViewbox)return this._cachedViewbox;
        var t, i, r, a, o, s = this._viewport, c = this.getSize();
        return e ? (r = Math.min(c.width / e.width, c.height / e.height), i = (new d.Matrix).scale(r).translate(-e.x, -e.y), s.transform(i), this._fireViewboxChange(), e) : (t = this.getDefaultLayer().getBBox(!0), i = s.transform().localMatrix, r = n(i.a, 1e3), a = n(-i.e || 0, 1e3), o = n(-i.f || 0, 1e3), e = this._cachedViewbox = {
          x: a ? a / r : 0,
          y: o ? o / r : 0,
          width: c.width / r,
          height: c.height / r,
          scale: r,
          inner: {width: t.width, height: t.height, x: t.x, y: t.y},
          outer: c
        })
      }, o.prototype.scroll = function (e) {
        var t = this._viewport.node, n = t.getCTM();
        return e && (e = l({
          dx: 0,
          dy: 0
        }, e || {}), n = this._svg.node.createSVGMatrix().translate(e.dx, e.dy).multiply(n), s(t, n), this._fireViewboxChange()), {
          x: n.e,
          y: n.f
        }
      }, o.prototype.zoom = function (e, t) {
        if ("fit-viewport" === e)return this._fitViewport(t);
        var i = this.viewbox();
        if (void 0 === e)return i.scale;
        var r = i.outer;
        "auto" === t && (t = {x: r.width / 2, y: r.height / 2});
        var a = this._setZoom(e, t);
        return this._fireViewboxChange(), n(a.a, 1e3)
      }, o.prototype._fitViewport = function (e) {
        var t, n, i = this.viewbox(), r = i.outer, a = i.inner;
        return a.x >= 0 && a.y >= 0 && a.x + a.width <= r.width && a.y + a.height <= r.height && !e ? n = {
          x: 0,
          y: 0,
          width: Math.max(a.width + a.x, r.width),
          height: Math.max(a.height + a.y, r.height)
        } : (t = Math.min(1, r.width / a.width, r.height / a.height), n = {
          x: a.x + (e ? a.width / 2 - r.width / t / 2 : 0),
          y: a.y + (e ? a.height / 2 - r.height / t / 2 : 0),
          width: r.width / t,
          height: r.height / t
        }), this.viewbox(n), this.viewbox().scale
      }, o.prototype._setZoom = function (e, t) {
        var n, i, r, a, o, c = this._svg.node, u = this._viewport.node, p = c.createSVGMatrix(), d = c.createSVGPoint();
        r = u.getCTM();
        var f = r.a;
        return t ? (n = l(d, t), i = n.matrixTransform(r.inverse()), a = p.translate(i.x, i.y).scale(1 / f * e).translate(-i.x, -i.y), o = r.multiply(a)) : o = p.scale(e), s(this._viewport.node, o), o
      }, o.prototype.getSize = function () {
        return {width: this._container.clientWidth, height: this._container.clientHeight}
      }, o.prototype.getAbsoluteBBox = function (e) {
        var t, n = this.viewbox();
        if (e.waypoints) {
          var i = this.getGraphics(e), r = i.getBBox(!0);
          t = i.getBBox(), t.x -= r.x, t.y -= r.y, t.width += 2 * r.x, t.height += 2 * r.y
        } else t = e;
        var a = t.x * n.scale - n.x * n.scale, o = t.y * n.scale - n.y * n.scale, s = t.width * n.scale, c = t.height * n.scale;
        return {x: a, y: o, width: s, height: c}
      }
    }, {153: 153, 159: 159, 62: 62, 71: 71, 80: 80}],
    38: [function (e, t) {
      function n() {
        this._uid = 12
      }

      var i = e(56);
      t.exports = n, n.prototype.createRoot = function (e) {
        return this.create("root", e)
      }, n.prototype.createLabel = function (e) {
        return this.create("label", e)
      }, n.prototype.createShape = function (e) {
        return this.create("shape", e)
      }, n.prototype.createConnection = function (e) {
        return this.create("connection", e)
      }, n.prototype.create = function (e, t) {
        return t = t || {}, t.id || (t.id = e + "_" + this._uid++), i.create(e, t)
      }
    }, {56: 56}],
    39: [function (e, t) {
      function n() {
        this._elements = {}
      }

      var i = "data-element-id";
      t.exports = n, n.prototype.add = function (e, t, n) {
        var r = e.id;
        if (!r)throw new Error("element must have an id");
        if (this._elements[r])throw new Error("element with id " + r + " already added");
        t.attr(i, r), n && n.attr(i, r), this._elements[r] = {element: e, gfx: t, secondaryGfx: n}
      }, n.prototype.remove = function (e) {
        var t = this._elements, n = e.id || e, r = n && t[n];
        r && (r.gfx.attr(i, null), r.secondaryGfx && r.secondaryGfx.attr(i, null), delete t[n])
      }, n.prototype.get = function (e) {
        var t;
        t = "string" == typeof e ? e : e && e.attr(i);
        var n = this._elements[t];
        return n && n.element
      }, n.prototype.filter = function (e) {
        var t = this._elements, n = [];
        return Object.keys(t).forEach(function (i) {
          var r = t[i], a = r.element, o = r.gfx;
          e(a, o) && n.push(a)
        }), n
      }, n.prototype.getGraphics = function (e) {
        var t = e.id || e, n = this._elements[t];
        return n && n.gfx
      }
    }, {}],
    40: [function (e, t) {
      function n() {
      }

      function i() {
        this._listeners = {};
        var e = this;
        this.on("diagram.destroy", 1, function () {
          e._listeners = null
        })
      }

      var r = e(151), a = e(150), o = e(153), s = e(159), c = 1e3;
      n.prototype = {
        stopPropagation: function () {
          this.propagationStopped = !0
        }, preventDefault: function () {
          this.defaultPrevented = !0
        }, init: function (e) {
          s(this, e || {})
        }
      }, t.exports = i, t.exports.Event = n, i.prototype.on = function (e, t, n) {
        if (e = a(e) ? e : [e], r(t) && (n = t, t = c), !o(t))throw new Error("priority must be a number");
        var i = this, s = {priority: t, callback: n};
        e.forEach(function (e) {
          i._addListener(e, s)
        })
      }, i.prototype.once = function (e, t) {
        function n() {
          t.apply(i, arguments), i.off(e, n)
        }

        var i = this;
        this.on(e, n)
      }, i.prototype.off = function (e, t) {
        var n, i, r = this._getListeners(e);
        if (t)for (i = r.length - 1; n = r[i]; i--)n.callback === t && r.splice(i, 1); else r.length = 0
      }, i.prototype.fire = function (e, t) {
        var i, r, a, o, s, c;
        if (c = Array.prototype.slice.call(arguments), "string" == typeof e ? c.shift() : (i = e, e = i.type), !e)throw new Error("no event type specified");
        if (a = this._listeners[e], !a)return !0;
        t instanceof n ? i = t : (i = Object.create(n.prototype), i.init(t)), c[0] = i, r = i.type;
        try {
          for (e !== r && (i.type = e), o = 0, s; (s = a[o]) && !i.propagationStopped; o++)try {
            s.callback.apply(null, c) === !1 && i.preventDefault()
          } catch (l) {
            if (!this.handleError(l))throw console.error("unhandled error in event listener"), console.error(l.stack), l
          }
        } finally {
          e !== r && (i.type = r)
        }
        return i.defaultPrevented ? !1 : i.propagationStopped ? null : !0
      }, i.prototype.handleError = function (e) {
        return !this.fire("error", {error: e})
      }, i.prototype._addListener = function (e, t) {
        var n, i, r = this._getListeners(e);
        for (n = 0; i = r[n]; n++)if (i.priority < t.priority)return void r.splice(n, 0, t);
        r.push(t)
      }, i.prototype._getListeners = function (e) {
        var t = this._listeners[e];
        return t || (this._listeners[e] = t = []), t
      }
    }, {150: 150, 151: 151, 153: 153, 159: 159}],
    41: [function (e, t) {
      function n(e, t) {
        this._renderer = e, this._elementRegistry = t
      }

      var i = e(80), r = e(84), a = e(66), o = e(171);
      n.$inject = ["renderer", "elementRegistry"], t.exports = n, n.prototype._getChildren = function (e) {
        var t, n = this._elementRegistry.getGraphics(e);
        return e.parent ? (t = a.getChildren(n), t || (t = n.parent().group().attr("class", "djs-children"))) : t = n, t
      }, n.prototype._clear = function (e) {
        var t = a.getVisual(e);
        return o(t.node), t
      }, n.prototype._createContainer = function (e, t) {
        var n = t.group().attr("class", "djs-group"), i = n.group().attr("class", "djs-element djs-" + e);
        return i.group().attr("class", "djs-visual"), i
      }, n.prototype.create = function (e, t) {
        var n = this._getChildren(t.parent);
        return this._createContainer(e, n)
      }, n.prototype.updateContainments = function (e) {
        var t, n = this, a = this._elementRegistry;
        t = r(e, function (e, t) {
          return t.parent && (e[t.parent.id] = t.parent), e
        }, {}), i(t, function (e) {
          var t = n._getChildren(e), r = e.children;
          r && i(r.slice().reverse(), function (e) {
            var n = a.getGraphics(e);
            n.parent().prependTo(t)
          })
        })
      }, n.prototype.update = function (e, t, n) {
        var i = this._clear(n);
        if ("shape" === e)this._renderer.drawShape(i, t), n.translate(t.x, t.y); else {
          if ("connection" !== e)throw new Error("unknown type: " + e);
          this._renderer.drawConnection(i, t)
        }
        n.attr("display", t.hidden ? "none" : "block")
      }, n.prototype.remove = function (e) {
        var t = this._elementRegistry.getGraphics(e);
        t.parent().remove()
      }
    }, {171: 171, 66: 66, 80: 80, 84: 84}],
    42: [function (e, t) {
      t.exports = {
        __depends__: [e(45)],
        __init__: ["canvas"],
        canvas: ["type", e(37)],
        elementRegistry: ["type", e(39)],
        elementFactory: ["type", e(38)],
        eventBus: ["type", e(40)],
        graphicsFactory: ["type", e(41)]
      }
    }, {37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 45: 45}],
    43: [function (e, t) {
      function n(e) {
        this.CONNECTION_STYLE = e.style(["no-fill"], {
          strokeWidth: 5,
          stroke: "fuchsia"
        }), this.SHAPE_STYLE = e.style({fill: "white", stroke: "fuchsia", strokeWidth: 2})
      }

      function i(e) {
        for (var t, n = "", i = 0; t = e[i]; i++)n += t.x + "," + t.y + " ";
        return n
      }

      function r(e, t) {
        return o.create("polyline", {points: i(e)}).attr(t || {})
      }

      function a(e, t) {
        return e.attr({points: i(t)})
      }

      var o = e(71);
      t.exports = n, n.$inject = ["styles"], n.prototype.drawShape = function (e, t) {
        return e.rect(0, 0, t.width || 0, t.height || 0, 10, 10).attr(this.SHAPE_STYLE)
      }, n.prototype.drawConnection = function (e, t) {
        return r(t.waypoints, this.CONNECTION_STYLE).appendTo(e)
      }, t.exports.createLine = r, t.exports.updateLine = a
    }, {71: 71}],
    44: [function (e, t) {
      function n() {
        var e = {"no-fill": {fill: "none"}, "no-border": {strokeOpacity: 0}, "no-events": {pointerEvents: "none"}};
        this.cls = function (e, t, n) {
          var i = this.style(t, n);
          return r(i, {"class": e})
        }, this.style = function (t, n) {
          i(t) || n || (n = t, t = []);
          var o = a(t, function (t, n) {
            return r(t, e[n] || {})
          }, {});
          return n ? r(o, n) : o
        }
      }

      var i = e(150), r = e(159), a = e(84);
      t.exports = n
    }, {150: 150, 159: 159, 84: 84}],
    45: [function (e, t) {
      t.exports = {renderer: ["type", e(43)], styles: ["type", e(44)]}
    }, {43: 43, 44: 44}],
    46: [function (e, t) {
      function n(e, t, n) {
        function a(n, i) {
          var r, a = i.delegateTarget || i.target, o = a && new c(a), s = t.get(o);
          o && s && (r = !e.fire(n, {element: s, gfx: o, originalEvent: i}), r && i.preventDefault())
        }

        function l(e) {
          var t = m[e];
          return t || (t = m[e] = function (t) {
            t.button || a(e, t)
          }), t
        }

        function u(e, t, n) {
          var i = l(n);
          i.$delegate = r.bind(e, v, t, i)
        }

        function p(e, t, n) {
          r.unbind(e, t, l(n).$delegate)
        }

        function d(e) {
          i(g, function (t, n) {
            u(e.node, n, t)
          })
        }

        function f(e) {
          i(g, function (t, n) {
            p(e.node, n, t)
          })
        }

        var h = n.cls("djs-hit", ["no-fill", "no-border"], {
          stroke: "white",
          strokeWidth: 15
        }), m = {}, g = {
          mouseover: "element.hover",
          mouseout: "element.out",
          click: "element.click",
          dblclick: "element.dblclick",
          mousedown: "element.mousedown",
          mouseup: "element.mouseup"
        }, v = "svg, .djs-element";
        e.on("canvas.destroy", function (e) {
          f(e.svg)
        }), e.on("canvas.init", function (e) {
          d(e.svg)
        }), e.on(["shape.added", "connection.added"], function (e) {
          var t, n, i = e.element, r = e.gfx;
          i.waypoints ? (t = o(i.waypoints), n = "connection") : (t = c.create("rect", {
            x: 0,
            y: 0,
            width: i.width,
            height: i.height
          }), n = "shape"), t.attr(h).appendTo(r.node)
        }), e.on("shape.changed", function (e) {
          var t = e.element, n = e.gfx, i = n.select(".djs-hit");
          i.attr({width: t.width, height: t.height})
        }), e.on("connection.changed", function (e) {
          var t = e.element, n = e.gfx, i = n.select(".djs-hit");
          s(i, t.waypoints)
        }), this.fire = a, this.mouseHandler = l, this.registerEvent = u, this.unregisterEvent = p
      }

      var i = e(80), r = e(172), a = e(43), o = a.createLine, s = a.updateLine, c = e(71);
      n.$inject = ["eventBus", "elementRegistry", "styles"], t.exports = n
    }, {172: 172, 43: 43, 71: 71, 80: 80}],
    47: [function (e, t) {
      t.exports = {__init__: ["interactionEvents"], interactionEvents: ["type", e(46)]}
    }, {46: 46}],
    48: [function (e, t) {
      function n(e, t) {
        function n(e) {
          return i.create("rect", c).prependTo(e)
        }

        function a(e, t) {
          e.attr({x: -s, y: -s, width: t.width + 2 * s, height: t.height + 2 * s})
        }

        function o(e, t) {
          var n = r(t);
          e.attr({x: n.x - s, y: n.y - s, width: n.width + 2 * s, height: n.height + 2 * s})
        }

        var s = 6, c = t.cls("djs-outline", ["no-fill"]);
        e.on(["shape.added", "shape.changed"], function (e) {
          var t = e.element, i = e.gfx, r = i.select(".djs-outline");
          r || (r = n(i, t)), a(r, t)
        }), e.on(["connection.added", "connection.changed"], function (e) {
          var t = e.element, i = e.gfx, r = i.select(".djs-outline");
          r || (r = n(i, t)), o(r, t)
        })
      }

      var i = e(71), r = e(64).getBBox;
      n.$inject = ["eventBus", "styles", "elementRegistry"], t.exports = n
    }, {64: 64, 71: 71}],
    49: [function (e, t) {
      t.exports = {__init__: ["outline"], outline: ["type", e(48)]}
    }, {48: 48}],
    50: [function (e, t) {
      function n(e) {
        var t = f('<div class="djs-overlay-container" style="position: absolute; width: 0; height: 0;" />');
        return e.insertBefore(t, e.firstChild), t
      }

      function i(e, t, n) {
        l(e.style, {left: t + "px", top: n + "px"})
      }

      function r(e, t) {
        e.style.display = t === !1 ? "none" : ""
      }

      function a(e, t, i, r) {
        this._eventBus = t, this._canvas = i, this._elementRegistry = r, this._ids = v, this._overlayDefaults = {
          show: {
            trigger: "automatic",
            minZoom: .7,
            maxZoom: 5
          }
        }, this._overlays = {}, this._overlayContainers = {}, this._overlayRoot = n(i.getContainer()), this._init(e)
      }

      var o = e(150), s = e(156), c = e(154), l = e(159), u = e(80), p = e(78), d = e(87), f = e(173), h = e(170), m = e(176), g = e(64).getBBox, v = new (e(67))("ov");
      a.$inject = ["config.overlays", "eventBus", "canvas", "elementRegistry"], t.exports = a, a.prototype.get = function (e) {
        if (s(e) && (e = {id: e}), e.element) {
          var t = this._getOverlayContainer(e.element, !0);
          return t ? e.type ? p(t.overlays, {type: e.type}) : t.overlays.slice() : []
        }
        return e.type ? p(this._overlays, {type: e.type}) : e.id ? this._overlays[e.id] : null
      }, a.prototype.add = function (e, t, n) {
        if (c(t) && (n = t, t = null), e.id || (e = this._elementRegistry.get(e)), !n.position)throw new Error("must specifiy overlay position");
        if (!n.html)throw new Error("must specifiy overlay html");
        if (!e)throw new Error("invalid element specified");
        var i = this._ids.next();
        return n = l({}, this._overlayDefaults, n, {id: i, type: t, element: e, html: n.html}), this._addOverlay(n), i
      }, a.prototype.remove = function (e) {
        var t = this.get(e) || [];
        o(t) || (t = [t]);
        var n = this;
        u(t, function (e) {
          var t = n._getOverlayContainer(e.element, !0);
          if (e && (m(e.html), m(e.htmlContainer), delete e.htmlContainer, delete e.element, delete n._overlays[e.id]), t) {
            var i = t.overlays.indexOf(e);
            -1 !== i && t.overlays.splice(i, 1)
          }
        })
      }, a.prototype.show = function () {
        r(this._overlayRoot)
      }, a.prototype.hide = function () {
        r(this._overlayRoot, !1)
      }, a.prototype._updateOverlayContainer = function (e) {
        var t = e.element, n = e.html, r = t.x, a = t.y;
        if (t.waypoints) {
          var o = g(t);
          r = o.x, a = o.y
        }
        i(n, r, a)
      }, a.prototype._updateOverlay = function (e) {
        var t = e.position, n = e.htmlContainer, r = e.element, a = t.left, o = t.top;
        if (void 0 !== t.right) {
          var s;
          s = r.waypoints ? g(r).width : r.width, a = -1 * t.right + s
        }
        if (void 0 !== t.bottom) {
          var c;
          c = r.waypoints ? g(r).height : r.height, o = -1 * t.bottom + c
        }
        i(n, a || 0, o || 0)
      }, a.prototype._createOverlayContainer = function (e) {
        var t = f('<div class="djs-overlays djs-overlays-' + e.id + '" style="position: absolute" />');
        this._overlayRoot.appendChild(t);
        var n = {html: t, element: e, overlays: []};
        return this._updateOverlayContainer(n), n
      }, a.prototype._updateRoot = function (e) {
        var t = e.scale || 1, n = e.scale || 1, i = "matrix(" + t + ",0,0," + n + "," + -1 * e.x * t + "," + -1 * e.y * n + ")";
        this._overlayRoot.style.transform = i, this._overlayRoot.style["-ms-transform"] = i
      }, a.prototype._getOverlayContainer = function (e, t) {
        var n = e && e.id || e, i = this._overlayContainers[n];
        return i || t || (i = this._overlayContainers[n] = this._createOverlayContainer(e)), i
      }, a.prototype._addOverlay = function (e) {
        var t, n, i = e.id, r = e.element, a = e.html;
        a.get && (a = a.get(0)), s(a) && (a = f(a)), n = this._getOverlayContainer(r), t = f('<div id="' + i + '" class="djs-overlay" style="position: absolute">'), t.appendChild(a), e.type && h(t).add("djs-overlay-" + e.type), e.htmlContainer = t, n.overlays.push(e), n.html.appendChild(t), this._overlays[i] = e, this._updateOverlay(e)
      }, a.prototype._updateOverlayVisibilty = function (e) {
        u(this._overlays, function (t) {
          var n = t.show, i = t.htmlContainer, a = !0;
          n && ((n.minZoom > e.scale || n.maxZoom < e.scale) && (a = !1), r(i, a))
        })
      }, a.prototype._init = function (e) {
        var t = this._eventBus, n = this, i = function (e) {
          n._updateRoot(e), n._updateOverlayVisibilty(e), n.show()
        };
        e && e.deferUpdate === !1 || (i = d(i, 300)), t.on("canvas.viewbox.changed", function (e) {
          n.hide(), i(e.viewbox)
        }), t.on(["shape.remove", "connection.remove"], function (e) {
          var t = n.get({element: e.element});
          u(t, function (e) {
            n.remove(e.id)
          })
        }), t.on(["element.changed"], function (e) {
          var t = e.element, i = n._getOverlayContainer(t, !0);
          i && (u(i.overlays, function (e) {
            n._updateOverlay(e)
          }), n._updateOverlayContainer(i))
        }), t.on("element.marker.update", function (e) {
          var t = n._getOverlayContainer(e.element, !0);
          t && h(t.html)[e.add ? "add" : "remove"](e.marker)
        })
      }
    }, {150: 150, 154: 154, 156: 156, 159: 159, 170: 170, 173: 173, 176: 176, 64: 64, 67: 67, 78: 78, 80: 80, 87: 87}],
    51: [function (e, t) {
      t.exports = {__init__: ["overlays"], overlays: ["type", e(50)]}
    }, {50: 50}],
    52: [function (e, t) {
      function n(e) {
        this._eventBus = e, this._selectedElements = [];
        var t = this;
        e.on(["shape.remove", "connection.remove"], function (e) {
          var n = e.element;
          t.deselect(n)
        })
      }

      var i = e(150), r = e(80);
      n.$inject = ["eventBus"], t.exports = n, n.prototype.deselect = function (e) {
        var t = this._selectedElements, n = t.indexOf(e);
        if (-1 !== n) {
          var i = t.slice();
          t.splice(n, 1), this._eventBus.fire("selection.changed", {oldSelection: i, newSelection: t})
        }
      }, n.prototype.get = function () {
        return this._selectedElements
      }, n.prototype.isSelected = function (e) {
        return -1 !== this._selectedElements.indexOf(e)
      }, n.prototype.select = function (e, t) {
        var n = this._selectedElements, a = n.slice();
        i(e) || (e = e ? [e] : []), t ? r(e, function (e) {
          -1 === n.indexOf(e) && n.push(e)
        }) : this._selectedElements = n = e.slice(), this._eventBus.fire("selection.changed", {
          oldSelection: a,
          newSelection: n
        })
      }
    }, {150: 150, 80: 80}],
    53: [function (e, t) {
      function n(e, t, n) {
        e.on("create.end", 500, function (e) {
          e.context.canExecute && t.select(e.shape)
        }), e.on("connect.end", 500, function (e) {
          e.context.canExecute && e.context.target && t.select(e.context.target)
        }), e.on("shape.move.end", 500, function (e) {
          t.select(e.context.shapes)
        }), e.on("element.click", function (e) {
          var r = e.element;
          if (r === n.getRootElement() && (r = null), t.isSelected(r))t.deselect(r); else {
            var a = i(e) || e, o = a.shiftKey;
            a.altKey || t.select(r, o)
          }
        })
      }

      var i = e(65).getOriginal;
      n.$inject = ["eventBus", "selection", "canvas"], t.exports = n
    }, {65: 65}],
    54: [function (e, t) {
      function n(e, t) {
        function n(e, n) {
          t.addMarker(e, n)
        }

        function o(e, n) {
          t.removeMarker(e, n)
        }

        this._multiSelectionBox = null, e.on("element.hover", function (e) {
          n(e.element, r)
        }), e.on("element.out", function (e) {
          o(e.element, r)
        }), e.on("selection.changed", function (e) {
          function t(e) {
            o(e, a)
          }

          function r(e) {
            n(e, a)
          }

          var s = e.oldSelection, c = e.newSelection;
          i(s, function (e) {
            -1 === c.indexOf(e) && t(e)
          }), i(c, function (e) {
            -1 === s.indexOf(e) && r(e)
          })
        })
      }

      var i = e(80), r = "hover", a = "selected";
      n.$inject = ["eventBus", "canvas", "selection", "graphicsFactory", "styles"], t.exports = n
    }, {80: 80}],
    55: [function (e, t) {
      t.exports = {
        __init__: ["selectionVisuals", "selectionBehavior"],
        __depends__: [e(47), e(49)],
        selection: ["type", e(52)],
        selectionVisuals: ["type", e(54)],
        selectionBehavior: ["type", e(53)]
      }
    }, {47: 47, 49: 49, 52: 52, 53: 53, 54: 54}],
    56: [function (e, t) {
      function n() {
        Object.defineProperty(this, "businessObject", {writable: !0}), l.bind(this, "parent"), u.bind(this, "label"), p.bind(this, "outgoing"), d.bind(this, "incoming")
      }

      function i() {
        n.call(this), l.bind(this, "children")
      }

      function r() {
        i.call(this)
      }

      function a() {
        i.call(this), u.bind(this, "labelTarget")
      }

      function o() {
        n.call(this), p.bind(this, "source"), d.bind(this, "target")
      }

      var s = e(159), c = e(185), l = new c({
        name: "children",
        enumerable: !0,
        collection: !0
      }, {name: "parent"}), u = new c({
        name: "label",
        enumerable: !0
      }, {name: "labelTarget"}), p = new c({
        name: "outgoing",
        collection: !0
      }, {name: "source"}), d = new c({name: "incoming", collection: !0}, {name: "target"});
      i.prototype = Object.create(n.prototype), r.prototype = Object.create(i.prototype), a.prototype = Object.create(i.prototype), o.prototype = Object.create(n.prototype);
      var f = {connection: o, shape: i, label: a, root: r};
      t.exports.create = function (e, t) {
        var n = f[e];
        if (!n)throw new Error("unknown type: <" + e + ">");
        return s(new n, t)
      }, t.exports.Base = n, t.exports.Root = r, t.exports.Shape = i, t.exports.Connection = o, t.exports.Label = a
    }, {159: 159, 185: 185}],
    57: [function (e, t) {
      function n(e, t) {
        return {x: e.x - t.x, y: e.y - t.y}
      }

      function i(e) {
        return Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.y, 2))
      }

      function r(e, t) {
        function r(e) {
          var r = d.start, s = c.toPoint(e), u = n(s, r);
          if (!d.dragging && i(u) > l && (d.dragging = !0, o.install(), a.set("move")), d.dragging) {
            var p = d.last || d.start;
            u = n(s, p), t.scroll({dx: u.x, dy: u.y}), d.last = s
          }
          e.preventDefault()
        }

        function u(e) {
          s.unbind(document, "mousemove", r), s.unbind(document, "mouseup", u), d = null, a.unset(), c.stopEvent(e)
        }

        function p(e) {
          e.button || e.altKey || (d = {start: c.toPoint(e)}, s.bind(document, "mousemove", r), s.bind(document, "mouseup", u), c.stopEvent(e))
        }

        var d, f = t._container;
        s.bind(f, "mousedown", p)
      }

      var a = e(63), o = e(61), s = e(174), c = e(65), l = 15;
      r.$inject = ["eventBus", "canvas"], t.exports = r
    }, {174: 174, 61: 61, 63: 63, 65: 65}],
    58: [function (e, t) {
      t.exports = {__init__: ["moveCanvas"], moveCanvas: ["type", e(57)]}
    }, {57: 57}],
    59: [function (e, t) {
      function n(e, t) {
        function n(e) {
          return Math.max(s.min, Math.min(s.max, e))
        }

        function r() {
          t.zoom("fit-viewport")
        }

        function a(e, i) {
          var r = t.zoom(), a = Math.pow(1 + Math.abs(e / c), e > 0 ? 1 : -1);
          t.zoom(n(r * a), i)
        }

        function o(e) {
          i.bind(e, "wheel", function (e) {
            var n = 0 === e.deltaMode ? .025 : .5, i = e.shiftKey, r = e.ctrlKey, o = e.deltaX * n, s = e.deltaY * n;
            if (i || r) {
              var c = {};
              r ? c.dx = l * (o || s) : c.dy = l * (o || s), t.scroll(c)
            } else {
              var u = {};
              u = isNaN(e.offsetX) ? {x: e.layerX, y: e.layerY} : {x: e.offsetX, y: e.offsetY}, a(-1 * s, u)
            }
            e.preventDefault()
          })
        }

        var s = {min: .2, max: 4}, c = 5, l = 50;
        e.on("canvas.init", function (e) {
          o(e.svg.node)
        }), this.zoom = a, this.reset = r
      }

      var i = e(174);
      n.$inject = ["eventBus", "canvas"], t.exports = n
    }, {174: 174}],
    60: [function (e, t) {
      t.exports = {__init__: ["zoomScroll"], zoomScroll: ["type", e(59)]}
    }, {59: 59}],
    61: [function (e, t) {
      function n(e) {
        o(e), i(!1)
      }

      function i(e) {
        a[e ? "bind" : "unbind"](document.body, "click", n, !0)
      }

      function r() {
        return i(!0), function () {
          i(!1)
        }
      }

      var a = e(174), o = e(65).stopEvent;
      t.exports.install = r
    }, {174: 174, 65: 65}],
    62: [function (e, t) {
      t.exports.remove = function (e, t) {
        if (e && t) {
          var n = e.indexOf(t);
          if (-1 !== n)return e.splice(n, 1), t
        }
      }, t.exports.add = function (e, t, n) {
        if (e && t) {
          isNaN(n) && (n = -1);
          var i = e.indexOf(t);
          if (-1 !== i) {
            if (i === n)return;
            if (-1 === n)return;
            e.splice(i, 1)
          }
          -1 !== n ? e.splice(n, 0, t) : e.push(t)
        }
      }, t.exports.indexOf = function (e, t) {
        return e && t ? e.indexOf(t) : -1
      }
    }, {}],
    63: [function (e, t) {
      var n = e(170), i = /^djs-cursor-.*$/;
      t.exports.set = function (e) {
        var t = n(document.body);
        t.removeMatching(i), e && t.add("djs-cursor-" + e)
      }, t.exports.unset = function () {
        this.set(null)
      }
    }, {170: 170}],
    64: [function (e, t) {
      function n(e, t, n) {
        var i = !n || -1 === e.indexOf(t);
        return i && e.push(t), i
      }

      function i(e, t, n) {
        n = n || 0, f(e, function (e, r) {
          var a = t(e, r, n);
          u(a) && a.length && i(a, t, n + 1)
        })
      }

      function r(e, t, r) {
        var a = [], o = [];
        return i(e, function (e, i, s) {
          n(a, e, t);
          var c = e.children;
          return (-1 === r || r > s) && c && n(o, c, t) ? c : void 0
        }), a
      }

      function a(e, t) {
        return r(e, !t, 1)
      }

      function o(e, t) {
        return r(e, !t, -1)
      }

      function s(e) {
        function t(e) {
          r[e.source.id] && r[e.target.id] && (r[e.id] = e), a[e.source.id] && a[e.target.id] && (c[e.id] = s[e.id] = e), o[e.id] = e
        }

        function n(e) {
          return s[e.id] = e, e.waypoints ? void(c[e.id] = o[e.id] = e) : (a[e.id] = e, f(e.incoming, t), f(e.outgoing, t), e.children)
        }

        var r = d(e, function (e) {
          return e.id
        }), a = {}, o = {}, s = {}, c = {};
        return i(e, n), {allShapes: a, allConnections: o, topLevel: r, enclosedConnections: c, enclosedElements: s}
      }

      function c(e, t) {
        t = !!t, u(e) || (e = [e]);
        var n, i, r, a;
        return f(e, function (e) {
          var o = e;
          e.waypoints && !t && (o = c(e.waypoints, !0));
          var s = o.x, l = o.y, u = o.height || 0, p = o.width || 0;
          (n > s || void 0 === n) && (n = s), (i > l || void 0 === i) && (i = l), (s + p > r || void 0 === r) && (r = s + p), (l + u > a || void 0 === a) && (a = l + u)
        }), {x: n, y: i, height: a - i, width: r - n}
      }

      function l(e, t) {
        var n = {};
        return f(e, function (e) {
          var i = e;
          i.waypoints && (i = c(i)), !p(t.y) && i.x > t.x && (n[e.id] = e), !p(t.x) && i.y > t.y && (n[e.id] = e), i.x > t.x && i.y > t.y && (p(t.width) && p(t.height) && i.width + i.x < t.width + t.x && i.height + i.y < t.height + t.y ? n[e.id] = e : p(t.width) && p(t.height) || (n[e.id] = e))
        }), n
      }

      var u = e(150), p = e(153), d = e(81), f = e(80);
      t.exports.eachElement = i, t.exports.selfAndDirectChildren = a, t.exports.selfAndAllChildren = o, t.exports.getBBox = c, t.exports.getEnclosedElements = l, t.exports.getClosure = s
    }, {150: 150, 153: 153, 80: 80, 81: 81}],
    65: [function (e, t) {
      function n(e) {
        return e && e.preventDefault()
      }

      function i(e, t) {
        e && (e.stopPropagation && e.stopPropagation(), t && e.stopImmediatePropagation && e.stopImmediatePropagation())
      }

      function r(e) {
        return e.originalEvent || e.srcEvent
      }

      function a(e, t) {
        s(e, t), o(e)
      }

      function o(e) {
        n(e), n(r(e))
      }

      function s(e, t) {
        i(e, t), i(r(e), t)
      }

      function c(e) {
        return e.pointers && e.pointers.length && (e = e.pointers[0]), e.touches && e.touches.length && (e = e.touches[0]), e ? {
          x: e.clientX,
          y: e.clientY
        } : null
      }

      t.exports.getOriginal = r, t.exports.stopEvent = a, t.exports.preventDefault = o, t.exports.stopPropagation = s, t.exports.toPoint = c
    }, {}],
    66: [function (e, t) {
      function n(e) {
        return e.select(".djs-visual")
      }

      function i(e) {
        return e.parent().children()[1]
      }

      function r(e) {
        return n(e).select("*").getBBox()
      }

      t.exports.getVisual = n, t.exports.getChildren = i, t.exports.getBBox = r
    }, {}],
    67: [function (e, t) {
      function n(e) {
        this._counter = 0, this._prefix = (e ? e + "-" : "") + Math.floor(1e9 * Math.random()) + "-"
      }

      t.exports = n, n.prototype.next = function () {
        return this._prefix + ++this._counter
      }
    }, {}],
    68: [function (e, t) {
      function n(e) {
        var t = e.split("-");
        return {horizontal: t[0] || "center", vertical: t[1] || "top"}
      }

      function i(e) {
        return a(e) ? o({top: 0, left: 0, right: 0, bottom: 0}, e) : {top: e, left: e, right: e, bottom: e}
      }

      function r(e) {
        this._config = o({}, {size: d, padding: p, style: {}, align: "center-top"}, e || {})
      }

      var a = e(154), o = e(159), s = e(80), c = e(84), l = e(162), u = e(71), p = 0, d = {width: 150, height: 50};
      r.prototype.createText = function (e, t, r) {
        function a(e) {
          function t() {
            if (s.length < o.length) {
              var t = e[0] || "", n = o.slice(s.length);
              t = /-\s*$/.test(n) ? n.replace(/-\s*$/, "") + t.replace(/^\s+/, "") : n + " " + t, e[0] = t
            }
            return {width: a.width, height: a.height, text: s}
          }

          function n(e) {
            return v.textContent = e, v.getBBox()
          }

          function i(e, t) {
            var n, i = e.split(/(\s|-)/g), r = [], a = 0;
            if (i.length > 1)for (; n = i.shift();) {
              if (!(n.length + a < t)) {
                "-" === n && r.pop();
                break
              }
              r.push(n), a += n.length
            }
            return r.join("")
          }

          function r(e, t, n) {
            var r = e.length * (n / t), a = i(e, r);
            return a || (a = e.slice(0, Math.floor(r - 1))), a
          }

          for (var a, o = e.shift(), s = o; ;) {
            if (a = n(s), a.width < g)return t();
            s = r(s, a.width, g)
          }
        }

        var o = l({}, this._config.size, r.box || {}), p = l({}, this._config.style, r.style || {}), d = n(r.align || this._config.align), f = i(void 0 !== r.padding ? r.padding : this._config.padding), h = t.split(/\r?\n/g), m = [], g = o.width - f.left - f.right, v = e.text(0, 0, "").attr(p).node;
        for (v.ownerSVGElement.appendChild(v); h.length;)m.push(a(h));
        var y, b, w = c(m, function (e, t) {
          return e + t.height
        }, 0);
        switch (d.vertical) {
          case"middle":
            y = (o.height - w) / 2 - m[0].height / 4;
            break;
          default:
            y = f.top
        }
        var x = e.text().attr(p);
        return s(m, function (e) {
          switch (y += e.height, d.horizontal) {
            case"left":
              b = f.left;
              break;
            case"right":
              b = g - f.right - e.width;
              break;
            default:
              b = (g - e.width) / 2 + f.left
          }
          var t = u.create("tspan", {x: b, y: y}).node;
          t.textContent = e.text, x.append(t)
        }), v.parentNode.removeChild(v), x
      }, t.exports = r
    }, {154: 154, 159: 159, 162: 162, 71: 71, 80: 80, 84: 84}],
    69: [function (t, n) {
      !function (t) {
        var i, r, a = "0.4.2", o = "hasOwnProperty", s = /[\.\/]/, c = /\s*,\s*/, l = "*", u = function (e, t) {
          return e - t
        }, p = {n: {}}, d = function () {
          for (var e = 0, t = this.length; t > e; e++)if ("undefined" != typeof this[e])return this[e]
        }, f = function () {
          for (var e = this.length; --e;)if ("undefined" != typeof this[e])return this[e]
        }, h = function (e, t) {
          e = String(e);
          var n, a = r, o = Array.prototype.slice.call(arguments, 2), s = h.listeners(e), c = 0, l = [], p = {}, m = [], g = i;
          m.firstDefined = d, m.lastDefined = f, i = e, r = 0;
          for (var v = 0, y = s.length; y > v; v++)"zIndex"in s[v] && (l.push(s[v].zIndex), s[v].zIndex < 0 && (p[s[v].zIndex] = s[v]));
          for (l.sort(u); l[c] < 0;)if (n = p[l[c++]], m.push(n.apply(t, o)), r)return r = a, m;
          for (v = 0; y > v; v++)if (n = s[v], "zIndex"in n)if (n.zIndex == l[c]) {
            if (m.push(n.apply(t, o)), r)break;
            do if (c++, n = p[l[c]], n && m.push(n.apply(t, o)), r)break; while (n)
          } else p[n.zIndex] = n; else if (m.push(n.apply(t, o)), r)break;
          return r = a, i = g, m
        };
        h._events = p, h.listeners = function (e) {
          var t, n, i, r, a, o, c, u, d = e.split(s), f = p, h = [f], m = [];
          for (r = 0, a = d.length; a > r; r++) {
            for (u = [], o = 0, c = h.length; c > o; o++)for (f = h[o].n, n = [f[d[r]], f[l]], i = 2; i--;)t = n[i], t && (u.push(t), m = m.concat(t.f || []));
            h = u
          }
          return m
        }, h.on = function (e, t) {
          if (e = String(e), "function" != typeof t)return function () {
          };
          for (var n = e.split(c), i = 0, r = n.length; r > i; i++)!function (e) {
            for (var n, i = e.split(s), r = p, a = 0, o = i.length; o > a; a++)r = r.n, r = r.hasOwnProperty(i[a]) && r[i[a]] || (r[i[a]] = {n: {}});
            for (r.f = r.f || [], a = 0, o = r.f.length; o > a; a++)if (r.f[a] == t) {
              n = !0;
              break
            }
            !n && r.f.push(t)
          }(n[i]);
          return function (e) {
            +e == +e && (t.zIndex = +e)
          }
        }, h.f = function (e) {
          var t = [].slice.call(arguments, 1);
          return function () {
            h.apply(null, [e, null].concat(t).concat([].slice.call(arguments, 0)))
          }
        }, h.stop = function () {
          r = 1
        }, h.nt = function (e) {
          return e ? new RegExp("(?:\\.|\\/|^)" + e + "(?:\\.|\\/|$)").test(i) : i
        }, h.nts = function () {
          return i.split(s)
        }, h.off = h.unbind = function (e, t) {
          if (!e)return void(h._events = p = {n: {}});
          var n = e.split(c);
          if (n.length > 1)for (var i = 0, r = n.length; r > i; i++)h.off(n[i], t); else {
            n = e.split(s);
            var a, u, d, i, r, f, m, g = [p];
            for (i = 0, r = n.length; r > i; i++)for (f = 0; f < g.length; f += d.length - 2) {
              if (d = [f, 1], a = g[f].n, n[i] != l)a[n[i]] && d.push(a[n[i]]); else for (u in a)a[o](u) && d.push(a[u]);
              g.splice.apply(g, d)
            }
            for (i = 0, r = g.length; r > i; i++)for (a = g[i]; a.n;) {
              if (t) {
                if (a.f) {
                  for (f = 0, m = a.f.length; m > f; f++)if (a.f[f] == t) {
                    a.f.splice(f, 1);
                    break
                  }
                  !a.f.length && delete a.f
                }
                for (u in a.n)if (a.n[o](u) && a.n[u].f) {
                  var v = a.n[u].f;
                  for (f = 0, m = v.length; m > f; f++)if (v[f] == t) {
                    v.splice(f, 1);
                    break
                  }
                  !v.length && delete a.n[u].f
                }
              } else {
                delete a.f;
                for (u in a.n)a.n[o](u) && a.n[u].f && delete a.n[u].f
              }
              a = a.n
            }
          }
        }, h.once = function (e, t) {
          var n = function () {
            return h.unbind(e, n), t.apply(this, arguments)
          };
          return h.on(e, n)
        }, h.version = a, h.toString = function () {
          return "You are running Eve " + a
        }, "undefined" != typeof n && n.exports ? n.exports = h : "function" == typeof e && e.amd ? e("eve", [], function () {
          return h
        }) : t.eve = h
      }(this)
    }, {}],
    70: [function (t, n, i) {
      !function (r, a) {
        if ("function" == typeof e && e.amd)e(["eve"], function (e) {
          return a(r, e)
        }); else if ("undefined" != typeof i) {
          var o = t(69);
          n.exports = a(r, o)
        } else a(r, r.eve)
      }(window || this, function (e, t) {
        var n = function (t) {
          var n = {}, i = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function (e) {
              setTimeout(e, 16)
            }, r = Array.isArray || function (e) {
              return e instanceof Array || "[object Array]" == Object.prototype.toString.call(e)
            }, a = 0, o = "M" + (+new Date).toString(36), s = function () {
            return o + (a++).toString(36)
          }, c = Date.now || function () {
              return +new Date
            }, l = function (e) {
            var t = this;
            if (null == e)return t.s;
            var n = t.s - e;
            t.b += t.dur * n, t.B += t.dur * n, t.s = e
          }, u = function (e) {
            var t = this;
            return null == e ? t.spd : void(t.spd = e)
          }, p = function (e) {
            var t = this;
            return null == e ? t.dur : (t.s = t.s * e / t.dur, void(t.dur = e))
          }, d = function () {
            var e = this;
            delete n[e.id], e.update(), t("mina.stop." + e.id, e)
          }, f = function () {
            var e = this;
            e.pdif || (delete n[e.id], e.update(), e.pdif = e.get() - e.b)
          }, h = function () {
            var e = this;
            e.pdif && (e.b = e.get() - e.pdif, delete e.pdif, n[e.id] = e)
          }, m = function () {
            var e, t = this;
            if (r(t.start)) {
              e = [];
              for (var n = 0, i = t.start.length; i > n; n++)e[n] = +t.start[n] + (t.end[n] - t.start[n]) * t.easing(t.s)
            } else e = +t.start + (t.end - t.start) * t.easing(t.s);
            t.set(e)
          }, g = function () {
            var e = 0;
            for (var r in n)if (n.hasOwnProperty(r)) {
              var a = n[r], o = a.get();
              e++, a.s = (o - a.b) / (a.dur / a.spd), a.s >= 1 && (delete n[r], a.s = 1, e--, function (e) {
                setTimeout(function () {
                  t("mina.finish." + e.id, e)
                })
              }(a)), a.update()
            }
            e && i(g)
          }, v = function (e, t, r, a, o, c, y) {
            var b = {
              id: s(),
              start: e,
              end: t,
              b: r,
              s: 0,
              dur: a - r,
              spd: 1,
              get: o,
              set: c,
              easing: y || v.linear,
              status: l,
              speed: u,
              duration: p,
              stop: d,
              pause: f,
              resume: h,
              update: m
            };
            n[b.id] = b;
            var w, x = 0;
            for (w in n)if (n.hasOwnProperty(w) && (x++, 2 == x))break;
            return 1 == x && i(g), b
          };
          return v.time = c, v.getById = function (e) {
            return n[e] || null
          }, v.linear = function (e) {
            return e
          }, v.easeout = function (e) {
            return Math.pow(e, 1.7)
          }, v.easein = function (e) {
            return Math.pow(e, .48)
          }, v.easeinout = function (e) {
            if (1 == e)return 1;
            if (0 == e)return 0;
            var t = .48 - e / 1.04, n = Math.sqrt(.1734 + t * t), i = n - t, r = Math.pow(Math.abs(i), 1 / 3) * (0 > i ? -1 : 1), a = -n - t, o = Math.pow(Math.abs(a), 1 / 3) * (0 > a ? -1 : 1), s = r + o + .5;
            return 3 * (1 - s) * s * s + s * s * s
          }, v.backin = function (e) {
            if (1 == e)return 1;
            var t = 1.70158;
            return e * e * ((t + 1) * e - t)
          }, v.backout = function (e) {
            if (0 == e)return 0;
            e -= 1;
            var t = 1.70158;
            return e * e * ((t + 1) * e + t) + 1
          }, v.elastic = function (e) {
            return e == !!e ? e : Math.pow(2, -10 * e) * Math.sin(2 * (e - .075) * Math.PI / .3) + 1
          }, v.bounce = function (e) {
            var t, n = 7.5625, i = 2.75;
            return 1 / i > e ? t = n * e * e : 2 / i > e ? (e -= 1.5 / i, t = n * e * e + .75) : 2.5 / i > e ? (e -= 2.25 / i, t = n * e * e + .9375) : (e -= 2.625 / i, t = n * e * e + .984375), t
          }, e.mina = v, v
        }("undefined" == typeof t ? function () {
        } : t), i = function (e) {
          function n(e, t) {
            if (e) {
              if (e.tagName)return E(e);
              if (r(e, "array") && n.set)return n.set.apply(n, e);
              if (e instanceof y)return e;
              if (null == t)return e = _.doc.querySelector(e), E(e)
            }
            return e = null == e ? "100%" : e, t = null == t ? "100%" : t, new x(e, t)
          }

          function i(e, t) {
            if (t) {
              if ("#text" == e && (e = _.doc.createTextNode(t.text || "")), "string" == typeof e && (e = i(e)), "string" == typeof t)return "xlink:" == t.substring(0, 6) ? e.getAttributeNS(Y, t.substring(6)) : "xml:" == t.substring(0, 4) ? e.getAttributeNS(z, t.substring(4)) : e.getAttribute(t);
              for (var n in t)if (t[T](n)) {
                var r = S(t[n]);
                r ? "xlink:" == n.substring(0, 6) ? e.setAttributeNS(Y, n.substring(6), r) : "xml:" == n.substring(0, 4) ? e.setAttributeNS(z, n.substring(4), r) : e.setAttribute(n, r) : e.removeAttribute(n)
              }
            } else e = _.doc.createElementNS(z, e);
            return e
          }

          function r(e, t) {
            return t = S.prototype.toLowerCase.call(t), "finite" == t ? isFinite(e) : "array" == t && (e instanceof Array || Array.isArray && Array.isArray(e)) ? !0 : "null" == t && null === e || t == typeof e && null !== e || "object" == t && e === Object(e) || N.call(e).slice(8, -1).toLowerCase() == t
          }

          function a(e) {
            if ("function" == typeof e || Object(e) !== e)return e;
            var t = new e.constructor;
            for (var n in e)e[T](n) && (t[n] = a(e[n]));
            return t
          }

          function o(e, t) {
            for (var n = 0, i = e.length; i > n; n++)if (e[n] === t)return e.push(e.splice(n, 1)[0])
          }

          function s(e, t, n) {
            function i() {
              var r = Array.prototype.slice.call(arguments, 0), a = r.join("␀"), s = i.cache = i.cache || {}, c = i.count = i.count || [];
              return s[T](a) ? (o(c, a), n ? n(s[a]) : s[a]) : (c.length >= 1e3 && delete s[c.shift()], c.push(a), s[a] = e.apply(t, r), n ? n(s[a]) : s[a])
            }

            return i
          }

          function c(e, t, n, i, r, a) {
            if (null == r) {
              var o = e - n, s = t - i;
              return o || s ? (180 + 180 * D.atan2(-s, -o) / M + 360) % 360 : 0
            }
            return c(e, t, r, a) - c(n, i, r, a)
          }

          function l(e) {
            return e % 360 * M / 180
          }

          function u(e) {
            return 180 * e / M % 360
          }

          function p(e) {
            var t = [];
            return e = e.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (e, n, i) {
              return i = i.split(/\s*,\s*|\s+/), "rotate" == n && 1 == i.length && i.push(0, 0), "scale" == n && (i.length > 2 ? i = i.slice(0, 2) : 2 == i.length && i.push(0, 0), 1 == i.length && i.push(i[0], 0, 0)), t.push("skewX" == n ? ["m", 1, 0, D.tan(l(i[0])), 1, 0, 0] : "skewY" == n ? ["m", 1, D.tan(l(i[0])), 0, 1, 0, 0] : [n.charAt(0)].concat(i)), e
            }), t
          }

          function d(e, t) {
            var i = J(e), r = new n.Matrix;
            if (i)for (var a = 0, o = i.length; o > a; a++) {
              var s, c, l, u, p, d = i[a], f = d.length, h = S(d[0]).toLowerCase(), m = d[0] != h, g = m ? r.invert() : 0;
              "t" == h && 2 == f ? r.translate(d[1], 0) : "t" == h && 3 == f ? m ? (s = g.x(0, 0), c = g.y(0, 0), l = g.x(d[1], d[2]), u = g.y(d[1], d[2]), r.translate(l - s, u - c)) : r.translate(d[1], d[2]) : "r" == h ? 2 == f ? (p = p || t, r.rotate(d[1], p.x + p.width / 2, p.y + p.height / 2)) : 4 == f && (m ? (l = g.x(d[2], d[3]), u = g.y(d[2], d[3]), r.rotate(d[1], l, u)) : r.rotate(d[1], d[2], d[3])) : "s" == h ? 2 == f || 3 == f ? (p = p || t, r.scale(d[1], d[f - 1], p.x + p.width / 2, p.y + p.height / 2)) : 4 == f ? m ? (l = g.x(d[2], d[3]), u = g.y(d[2], d[3]), r.scale(d[1], d[1], l, u)) : r.scale(d[1], d[1], d[2], d[3]) : 5 == f && (m ? (l = g.x(d[3], d[4]), u = g.y(d[3], d[4]), r.scale(d[1], d[2], l, u)) : r.scale(d[1], d[2], d[3], d[4])) : "m" == h && 7 == f && r.add(d[1], d[2], d[3], d[4], d[5], d[6])
            }
            return r
          }

          function f(e) {
            var t = e.node.ownerSVGElement && E(e.node.ownerSVGElement) || e.node.parentNode && E(e.node.parentNode) || n.select("svg") || n(0, 0), i = t.select("defs"), r = null == i ? !1 : i.node;
            return r || (r = w("defs", t.node).node), r
          }

          function h(e) {
            return e.node.ownerSVGElement && E(e.node.ownerSVGElement) || n.select("svg")
          }

          function m(e, t, n) {
            function r(e) {
              if (null == e)return R;
              if (e == +e)return e;
              i(l, {width: e});
              try {
                return l.getBBox().width
              } catch (t) {
                return 0
              }
            }

            function a(e) {
              if (null == e)return R;
              if (e == +e)return e;
              i(l, {height: e});
              try {
                return l.getBBox().height
              } catch (t) {
                return 0
              }
            }

            function o(i, r) {
              null == t ? c[i] = r(e.attr(i) || 0) : i == t && (c = r(null == n ? e.attr(i) || 0 : n))
            }

            var s = h(e).node, c = {}, l = s.querySelector(".svg---mgr");
            switch (l || (l = i("rect"), i(l, {
              x: -9e9,
              y: -9e9,
              width: 10,
              height: 10,
              "class": "svg---mgr",
              fill: "none"
            }), s.appendChild(l)), e.type) {
              case"rect":
                o("rx", r), o("ry", a);
              case"image":
                o("width", r), o("height", a);
              case"text":
                o("x", r), o("y", a);
                break;
              case"circle":
                o("cx", r), o("cy", a), o("r", r);
                break;
              case"ellipse":
                o("cx", r), o("cy", a), o("rx", r), o("ry", a);
                break;
              case"line":
                o("x1", r), o("x2", r), o("y1", a), o("y2", a);
                break;
              case"marker":
                o("refX", r), o("markerWidth", r), o("refY", a), o("markerHeight", a);
                break;
              case"radialGradient":
                o("fx", r), o("fy", a);
                break;
              case"tspan":
                o("dx", r), o("dy", a);
                break;
              default:
                o(t, r)
            }
            return s.removeChild(l), c
          }

          function v(e) {
            r(e, "array") || (e = Array.prototype.slice.call(arguments, 0));
            for (var t = 0, n = 0, i = this.node; this[t];)delete this[t++];
            for (t = 0; t < e.length; t++)"set" == e[t].type ? e[t].forEach(function (e) {
              i.appendChild(e.node)
            }) : i.appendChild(e[t].node);
            var a = i.childNodes;
            for (t = 0; t < a.length; t++)this[n++] = E(a[t]);
            return this
          }

          function y(e) {
            if (e.snap in W)return W[e.snap];
            var t;
            try {
              t = e.ownerSVGElement
            } catch (n) {
            }
            this.node = e, t && (this.paper = new x(t)), this.type = e.tagName;
            var i = this.id = q(this);
            if (this.anims = {}, this._ = {transform: []}, e.snap = i, W[i] = this, "g" == this.type && (this.add = v), this.type in{
                g: 1,
                mask: 1,
                pattern: 1,
                symbol: 1
              })for (var r in x.prototype)x.prototype[T](r) && (this[r] = x.prototype[r])
          }

          function b(e) {
            this.node = e
          }

          function w(e, t) {
            var n = i(e);
            t.appendChild(n);
            var r = E(n);
            return r
          }

          function x(e, t) {
            var n, r, a, o = x.prototype;
            if (e && "svg" == e.tagName) {
              if (e.snap in W)return W[e.snap];
              var s = e.ownerDocument;
              n = new y(e), r = e.getElementsByTagName("desc")[0], a = e.getElementsByTagName("defs")[0], r || (r = i("desc"), r.appendChild(s.createTextNode("Created with Snap")), n.node.appendChild(r)), a || (a = i("defs"), n.node.appendChild(a)), n.defs = a;
              for (var c in o)o[T](c) && (n[c] = o[c]);
              n.paper = n.root = n
            } else n = w("svg", _.doc.body), i(n.node, {height: t, version: 1.1, width: e, xmlns: z});
            return n
          }

          function E(e) {
            return e ? e instanceof y || e instanceof b ? e : e.tagName && "svg" == e.tagName.toLowerCase() ? new x(e) : e.tagName && "object" == e.tagName.toLowerCase() && "image/svg+xml" == e.type ? new x(e.contentDocument.getElementsByTagName("svg")[0]) : new y(e) : e
          }

          n.version = "0.3.0", n.toString = function () {
            return "Snap v" + this.version
          }, n._ = {};
          var _ = {win: e.window, doc: e.window.document};
          n._.glob = _;
          {
            var T = "hasOwnProperty", S = String, A = parseFloat, C = parseInt, D = Math, k = D.max, I = D.min, P = D.abs, M = (D.pow, D.PI), R = (D.round, ""), N = Object.prototype.toString, O = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i, $ = (n._.separator = /[,\s]+/, /[\s]*,[\s]*/), F = {
              hs: 1,
              rg: 1
            }, L = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi, B = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi, V = /(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/gi, j = 0, U = "S" + (+new Date).toString(36), q = function (e) {
              return (e && e.type ? e.type : R) + U + (j++).toString(36)
            }, Y = "http://www.w3.org/1999/xlink", z = "http://www.w3.org/2000/svg", W = {};
            n.url = function (e) {
              return "url('#" + e + "')"
            }
          }
          n._.$ = i, n._.id = q, n.format = function () {
            var e = /\{([^\}]+)\}/g, t = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, n = function (e, n, i) {
              var r = i;
              return n.replace(t, function (e, t, n, i, a) {
                t = t || i, r && (t in r && (r = r[t]), "function" == typeof r && a && (r = r()))
              }), r = (null == r || r == i ? e : r) + ""
            };
            return function (t, i) {
              return S(t).replace(e, function (e, t) {
                return n(e, t, i)
              })
            }
          }(), n._.clone = a, n._.cacher = s, n.rad = l, n.deg = u, n.angle = c, n.is = r, n.snapTo = function (e, t, n) {
            if (n = r(n, "finite") ? n : 10, r(e, "array")) {
              for (var i = e.length; i--;)if (P(e[i] - t) <= n)return e[i]
            } else {
              e = +e;
              var a = t % e;
              if (n > a)return t - a;
              if (a > e - n)return t - a + e
            }
            return t
          }, n.getRGB = s(function (e) {
            if (!e || (e = S(e)).indexOf("-") + 1)return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: X};
            if ("none" == e)return {r: -1, g: -1, b: -1, hex: "none", toString: X};
            if (!(F[T](e.toLowerCase().substring(0, 2)) || "#" == e.charAt()) && (e = H(e)), !e)return {
              r: -1,
              g: -1,
              b: -1,
              hex: "none",
              error: 1,
              toString: X
            };
            var t, i, a, o, s, c, l = e.match(O);
            return l ? (l[2] && (a = C(l[2].substring(5), 16), i = C(l[2].substring(3, 5), 16), t = C(l[2].substring(1, 3), 16)), l[3] && (a = C((s = l[3].charAt(3)) + s, 16), i = C((s = l[3].charAt(2)) + s, 16), t = C((s = l[3].charAt(1)) + s, 16)), l[4] && (c = l[4].split($), t = A(c[0]), "%" == c[0].slice(-1) && (t *= 2.55), i = A(c[1]), "%" == c[1].slice(-1) && (i *= 2.55), a = A(c[2]), "%" == c[2].slice(-1) && (a *= 2.55), "rgba" == l[1].toLowerCase().slice(0, 4) && (o = A(c[3])), c[3] && "%" == c[3].slice(-1) && (o /= 100)), l[5] ? (c = l[5].split($), t = A(c[0]), "%" == c[0].slice(-1) && (t /= 100), i = A(c[1]), "%" == c[1].slice(-1) && (i /= 100), a = A(c[2]), "%" == c[2].slice(-1) && (a /= 100), ("deg" == c[0].slice(-3) || "°" == c[0].slice(-1)) && (t /= 360), "hsba" == l[1].toLowerCase().slice(0, 4) && (o = A(c[3])), c[3] && "%" == c[3].slice(-1) && (o /= 100), n.hsb2rgb(t, i, a, o)) : l[6] ? (c = l[6].split($), t = A(c[0]), "%" == c[0].slice(-1) && (t /= 100), i = A(c[1]), "%" == c[1].slice(-1) && (i /= 100), a = A(c[2]), "%" == c[2].slice(-1) && (a /= 100), ("deg" == c[0].slice(-3) || "°" == c[0].slice(-1)) && (t /= 360), "hsla" == l[1].toLowerCase().slice(0, 4) && (o = A(c[3])), c[3] && "%" == c[3].slice(-1) && (o /= 100), n.hsl2rgb(t, i, a, o)) : (t = I(D.round(t), 255), i = I(D.round(i), 255), a = I(D.round(a), 255), o = I(k(o, 0), 1), l = {
              r: t,
              g: i,
              b: a,
              toString: X
            }, l.hex = "#" + (16777216 | a | i << 8 | t << 16).toString(16).slice(1), l.opacity = r(o, "finite") ? o : 1, l)) : {
              r: -1,
              g: -1,
              b: -1,
              hex: "none",
              error: 1,
              toString: X
            }
          }, n), n.hsb = s(function (e, t, i) {
            return n.hsb2rgb(e, t, i).hex
          }), n.hsl = s(function (e, t, i) {
            return n.hsl2rgb(e, t, i).hex
          }), n.rgb = s(function (e, t, n, i) {
            if (r(i, "finite")) {
              var a = D.round;
              return "rgba(" + [a(e), a(t), a(n), +i.toFixed(2)] + ")"
            }
            return "#" + (16777216 | n | t << 8 | e << 16).toString(16).slice(1)
          });
          var H = function (e) {
            var t = _.doc.getElementsByTagName("head")[0] || _.doc.getElementsByTagName("svg")[0], n = "rgb(255, 0, 0)";
            return (H = s(function (e) {
              if ("red" == e.toLowerCase())return n;
              t.style.color = n, t.style.color = e;
              var i = _.doc.defaultView.getComputedStyle(t, R).getPropertyValue("color");
              return i == n ? null : i
            }))(e)
          }, G = function () {
            return "hsb(" + [this.h, this.s, this.b] + ")"
          }, K = function () {
            return "hsl(" + [this.h, this.s, this.l] + ")"
          }, X = function () {
            return 1 == this.opacity || null == this.opacity ? this.hex : "rgba(" + [this.r, this.g, this.b, this.opacity] + ")"
          }, Q = function (e, t, i) {
            if (null == t && r(e, "object") && "r"in e && "g"in e && "b"in e && (i = e.b, t = e.g, e = e.r), null == t && r(e, string)) {
              var a = n.getRGB(e);
              e = a.r, t = a.g, i = a.b
            }
            return (e > 1 || t > 1 || i > 1) && (e /= 255, t /= 255, i /= 255), [e, t, i]
          }, Z = function (e, t, i, a) {
            e = D.round(255 * e), t = D.round(255 * t), i = D.round(255 * i);
            var o = {r: e, g: t, b: i, opacity: r(a, "finite") ? a : 1, hex: n.rgb(e, t, i), toString: X};
            return r(a, "finite") && (o.opacity = a), o
          };
          n.color = function (e) {
            var t;
            return r(e, "object") && "h"in e && "s"in e && "b"in e ? (t = n.hsb2rgb(e), e.r = t.r, e.g = t.g, e.b = t.b, e.opacity = 1, e.hex = t.hex) : r(e, "object") && "h"in e && "s"in e && "l"in e ? (t = n.hsl2rgb(e), e.r = t.r, e.g = t.g, e.b = t.b, e.opacity = 1, e.hex = t.hex) : (r(e, "string") && (e = n.getRGB(e)), r(e, "object") && "r"in e && "g"in e && "b"in e && !("error"in e) ? (t = n.rgb2hsl(e), e.h = t.h, e.s = t.s, e.l = t.l, t = n.rgb2hsb(e), e.v = t.b) : (e = {hex: "none"}, e.r = e.g = e.b = e.h = e.s = e.v = e.l = -1, e.error = 1)), e.toString = X, e
          }, n.hsb2rgb = function (e, t, n, i) {
            r(e, "object") && "h"in e && "s"in e && "b"in e && (n = e.b, t = e.s, e = e.h, i = e.o), e *= 360;
            var a, o, s, c, l;
            return e = e % 360 / 60, l = n * t, c = l * (1 - P(e % 2 - 1)), a = o = s = n - l, e = ~~e, a += [l, c, 0, 0, c, l][e], o += [c, l, l, c, 0, 0][e], s += [0, 0, c, l, l, c][e], Z(a, o, s, i)
          }, n.hsl2rgb = function (e, t, n, i) {
            r(e, "object") && "h"in e && "s"in e && "l"in e && (n = e.l, t = e.s, e = e.h), (e > 1 || t > 1 || n > 1) && (e /= 360, t /= 100, n /= 100), e *= 360;
            var a, o, s, c, l;
            return e = e % 360 / 60, l = 2 * t * (.5 > n ? n : 1 - n), c = l * (1 - P(e % 2 - 1)), a = o = s = n - l / 2, e = ~~e, a += [l, c, 0, 0, c, l][e], o += [c, l, l, c, 0, 0][e], s += [0, 0, c, l, l, c][e], Z(a, o, s, i)
          }, n.rgb2hsb = function (e, t, n) {
            n = Q(e, t, n), e = n[0], t = n[1], n = n[2];
            var i, r, a, o;
            return a = k(e, t, n), o = a - I(e, t, n), i = 0 == o ? null : a == e ? (t - n) / o : a == t ? (n - e) / o + 2 : (e - t) / o + 4, i = (i + 360) % 6 * 60 / 360, r = 0 == o ? 0 : o / a, {
              h: i,
              s: r,
              b: a,
              toString: G
            }
          }, n.rgb2hsl = function (e, t, n) {
            n = Q(e, t, n), e = n[0], t = n[1], n = n[2];
            var i, r, a, o, s, c;
            return o = k(e, t, n), s = I(e, t, n), c = o - s, i = 0 == c ? null : o == e ? (t - n) / c : o == t ? (n - e) / c + 2 : (e - t) / c + 4, i = (i + 360) % 6 * 60 / 360, a = (o + s) / 2, r = 0 == c ? 0 : .5 > a ? c / (2 * a) : c / (2 - 2 * a), {
              h: i,
              s: r,
              l: a,
              toString: K
            }
          }, n.parsePathString = function (e) {
            if (!e)return null;
            var t = n.path(e);
            if (t.arr)return n.path.clone(t.arr);
            var i = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0}, a = [];
            return r(e, "array") && r(e[0], "array") && (a = n.path.clone(e)), a.length || S(e).replace(L, function (e, t, n) {
              var r = [], o = t.toLowerCase();
              if (n.replace(V, function (e, t) {
                  t && r.push(+t)
                }), "m" == o && r.length > 2 && (a.push([t].concat(r.splice(0, 2))), o = "l", t = "m" == t ? "l" : "L"), "o" == o && 1 == r.length && a.push([t, r[0]]), "r" == o)a.push([t].concat(r)); else for (; r.length >= i[o] && (a.push([t].concat(r.splice(0, i[o]))), i[o]););
            }), a.toString = n.path.toString, t.arr = n.path.clone(a), a
          };
          var J = n.parseTransformString = function (e) {
            if (!e)return null;
            var t = [];
            return r(e, "array") && r(e[0], "array") && (t = n.path.clone(e)), t.length || S(e).replace(B, function (e, n, i) {
              {
                var r = [];
                n.toLowerCase()
              }
              i.replace(V, function (e, t) {
                t && r.push(+t)
              }), t.push([n].concat(r))
            }), t.toString = n.path.toString, t
          };
          n._.svgTransform2string = p, n._.rgTransform = /^[a-z][\s]*-?\.?\d/i, n._.transform2matrix = d, n._unit2px = m;
          _.doc.contains || _.doc.compareDocumentPosition ? function (e, t) {
            var n = 9 == e.nodeType ? e.documentElement : e, i = t && t.parentNode;
            return e == i || !(!i || 1 != i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
          } : function (e, t) {
            if (t)for (; t;)if (t = t.parentNode, t == e)return !0;
            return !1
          };
          n._.getSomeDefs = f, n._.getSomeSVG = h, n.select = function (e) {
            return e = S(e).replace(/([^\\]):/g, "$1\\:"), E(_.doc.querySelector(e))
          }, n.selectAll = function (e) {
            for (var t = _.doc.querySelectorAll(e), i = (n.set || Array)(), r = 0; r < t.length; r++)i.push(E(t[r]));
            return i
          }, setInterval(function () {
            for (var e in W)if (W[T](e)) {
              var t = W[e], n = t.node;
              ("svg" != t.type && !n.ownerSVGElement || "svg" == t.type && (!n.parentNode || "ownerSVGElement"in n.parentNode && !n.ownerSVGElement)) && delete W[e]
            }
          }, 1e4), y.prototype.attr = function (e, n) {
            {
              var i = this;
              i.node
            }
            if (!e)return i;
            if (r(e, "string")) {
              if (!(arguments.length > 1))return t("snap.util.getattr." + e, i).firstDefined();
              var a = {};
              a[e] = n, e = a
            }
            for (var o in e)e[T](o) && t("snap.util.attr." + o, i, e[o]);
            return i
          }, n.parse = function (e) {
            var t = _.doc.createDocumentFragment(), n = !0, i = _.doc.createElement("div");
            if (e = S(e), e.match(/^\s*<\s*svg(?:\s|>)/) || (e = "<svg>" + e + "</svg>", n = !1), i.innerHTML = e, e = i.getElementsByTagName("svg")[0])if (n)t = e; else {
              for (; e.firstChild;)t.appendChild(e.firstChild);
              i.innerHTML = R
            }
            return new b(t)
          }, n.fragment = function () {
            for (var e = Array.prototype.slice.call(arguments, 0), t = _.doc.createDocumentFragment(), i = 0, r = e.length; r > i; i++) {
              var a = e[i];
              a.node && a.node.nodeType && t.appendChild(a.node), a.nodeType && t.appendChild(a), "string" == typeof a && t.appendChild(n.parse(a).node)
            }
            return new b(t)
          }, n._.make = w, n._.wrap = E, x.prototype.el = function (e, t) {
            var n = w(e, this.node);
            return t && n.attr(t), n
          }, t.on("snap.util.getattr", function () {
            var e = t.nt();
            e = e.substring(e.lastIndexOf(".") + 1);
            var n = e.replace(/[A-Z]/g, function (e) {
              return "-" + e.toLowerCase()
            });
            return et[T](n) ? this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(n) : i(this.node, e)
          });
          var et = {
            "alignment-baseline": 0,
            "baseline-shift": 0,
            clip: 0,
            "clip-path": 0,
            "clip-rule": 0,
            color: 0,
            "color-interpolation": 0,
            "color-interpolation-filters": 0,
            "color-profile": 0,
            "color-rendering": 0,
            cursor: 0,
            direction: 0,
            display: 0,
            "dominant-baseline": 0,
            "enable-background": 0,
            fill: 0,
            "fill-opacity": 0,
            "fill-rule": 0,
            filter: 0,
            "flood-color": 0,
            "flood-opacity": 0,
            font: 0,
            "font-family": 0,
            "font-size": 0,
            "font-size-adjust": 0,
            "font-stretch": 0,
            "font-style": 0,
            "font-variant": 0,
            "font-weight": 0,
            "glyph-orientation-horizontal": 0,
            "glyph-orientation-vertical": 0,
            "image-rendering": 0,
            kerning: 0,
            "letter-spacing": 0,
            "lighting-color": 0,
            marker: 0,
            "marker-end": 0,
            "marker-mid": 0,
            "marker-start": 0,
            mask: 0,
            opacity: 0,
            overflow: 0,
            "pointer-events": 0,
            "shape-rendering": 0,
            "stop-color": 0,
            "stop-opacity": 0,
            stroke: 0,
            "stroke-dasharray": 0,
            "stroke-dashoffset": 0,
            "stroke-linecap": 0,
            "stroke-linejoin": 0,
            "stroke-miterlimit": 0,
            "stroke-opacity": 0,
            "stroke-width": 0,
            "text-anchor": 0,
            "text-decoration": 0,
            "text-rendering": 0,
            "unicode-bidi": 0,
            visibility: 0,
            "word-spacing": 0,
            "writing-mode": 0
          };
          t.on("snap.util.attr", function (e) {
            var n = t.nt(), r = {};
            n = n.substring(n.lastIndexOf(".") + 1), r[n] = e;
            var a = n.replace(/-(\w)/gi, function (e, t) {
              return t.toUpperCase()
            }), o = n.replace(/[A-Z]/g, function (e) {
              return "-" + e.toLowerCase()
            });
            et[T](o) ? this.node.style[a] = null == e ? R : e : i(this.node, r)
          }), function () {
          }(x.prototype), n.ajax = function (e, n, i, a) {
            var o = new XMLHttpRequest, s = q();
            if (o) {
              if (r(n, "function"))a = i, i = n, n = null; else if (r(n, "object")) {
                var c = [];
                for (var l in n)n.hasOwnProperty(l) && c.push(encodeURIComponent(l) + "=" + encodeURIComponent(n[l]));
                n = c.join("&")
              }
              return o.open(n ? "POST" : "GET", e, !0), n && (o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.setRequestHeader("Content-type", "application/x-www-form-urlencoded")), i && (t.once("snap.ajax." + s + ".0", i), t.once("snap.ajax." + s + ".200", i), t.once("snap.ajax." + s + ".304", i)), o.onreadystatechange = function () {
                4 == o.readyState && t("snap.ajax." + s + "." + o.status, a, o)
              }, 4 == o.readyState ? o : (o.send(n), o)
            }
          }, n.load = function (e, t, i) {
            n.ajax(e, function (e) {
              var r = n.parse(e.responseText);
              i ? t.call(i, r) : t(r)
            })
          };
          var tt = function (e) {
            var t = e.getBoundingClientRect(), n = e.ownerDocument, i = n.body, r = n.documentElement, a = r.clientTop || i.clientTop || 0, o = r.clientLeft || i.clientLeft || 0, s = t.top + (g.win.pageYOffset || r.scrollTop || i.scrollTop) - a, c = t.left + (g.win.pageXOffset || r.scrollLeft || i.scrollLeft) - o;
            return {y: s, x: c}
          };
          return n.getElementByPoint = function (e, t) {
            var n = this, i = (n.canvas, _.doc.elementFromPoint(e, t));
            if (_.win.opera && "svg" == i.tagName) {
              var r = tt(i), a = i.createSVGRect();
              a.x = e - r.x, a.y = t - r.y, a.width = a.height = 1;
              var o = i.getIntersectionList(a, null);
              o.length && (i = o[o.length - 1])
            }
            return i ? E(i) : null
          }, n.plugin = function (e) {
            e(n, y, x, _, b)
          }, _.win.Snap = n, n
        }(e || this);
        return i.plugin(function (i, r, a, o, s) {
          function c(e, t) {
            if (null == t) {
              var n = !0;
              if (t = e.node.getAttribute("linearGradient" == e.type || "radialGradient" == e.type ? "gradientTransform" : "pattern" == e.type ? "patternTransform" : "transform"), !t)return new i.Matrix;
              t = i._.svgTransform2string(t)
            } else t = i._.rgTransform.test(t) ? h(t).replace(/\.{3}|\u2026/g, e._.transform || E) : i._.svgTransform2string(t), f(t, "array") && (t = i.path ? i.path.toString.call(t) : h(t)), e._.transform = t;
            var r = i._.transform2matrix(t, e.getBBox(1));
            return n ? r : void(e.matrix = r)
          }

          function l(e) {
            function t(e, t) {
              var n = g(e.node, t);
              n = n && n.match(a), n = n && n[2], n && "#" == n.charAt() && (n = n.substring(1), n && (s[n] = (s[n] || []).concat(function (n) {
                var i = {};
                i[t] = URL(n), g(e.node, i)
              })))
            }

            function n(e) {
              var t = g(e.node, "xlink:href");
              t && "#" == t.charAt() && (t = t.substring(1), t && (s[t] = (s[t] || []).concat(function (t) {
                e.attr("xlink:href", "#" + t)
              })))
            }

            for (var i, r = e.selectAll("*"), a = /^\s*url\(("|'|)(.*)\1\)\s*$/, o = [], s = {}, c = 0, l = r.length; l > c; c++) {
              i = r[c], t(i, "fill"), t(i, "stroke"), t(i, "filter"), t(i, "mask"), t(i, "clip-path"), n(i);
              var u = g(i.node, "id");
              u && (g(i.node, {id: i.id}), o.push({old: u, id: i.id}))
            }
            for (c = 0, l = o.length; l > c; c++) {
              var p = s[o[c].old];
              if (p)for (var d = 0, f = p.length; f > d; d++)p[d](o[c].id)
            }
          }

          function u(e, t, n) {
            return function (i) {
              var r = i.slice(e, t);
              return 1 == r.length && (r = r[0]), n ? n(r) : r
            }
          }

          function p(e) {
            return function () {
              var t = e ? "<" + this.type : "", n = this.node.attributes, i = this.node.childNodes;
              if (e)for (var r = 0, a = n.length; a > r; r++)t += " " + n[r].name + '="' + n[r].value.replace(/"/g, '\\"') + '"';
              if (i.length) {
                for (e && (t += ">"), r = 0, a = i.length; a > r; r++)3 == i[r].nodeType ? t += i[r].nodeValue : 1 == i[r].nodeType && (t += w(i[r]).toString());
                e && (t += "</" + this.type + ">")
              } else e && (t += "/>");
              return t
            }
          }

          var d = r.prototype, f = i.is, h = String, m = i._unit2px, g = i._.$, v = i._.make, y = i._.getSomeDefs, b = "hasOwnProperty", w = i._.wrap;
          d.getBBox = function (e) {
            if (!i.Matrix || !i.path)return this.node.getBBox();
            var t = this, n = new i.Matrix;
            if (t.removed)return i._.box();
            for (; "use" == t.type;)if (e || (n = n.add(t.transform().localMatrix.translate(t.attr("x") || 0, t.attr("y") || 0))), t.original)t = t.original; else {
              var r = t.attr("xlink:href");
              t = t.original = t.node.ownerDocument.getElementById(r.substring(r.indexOf("#") + 1))
            }
            var a = t._, o = i.path.get[t.type] || i.path.get.deflt;
            try {
              return e ? (a.bboxwt = o ? i.path.getBBox(t.realPath = o(t)) : i._.box(t.node.getBBox()), i._.box(a.bboxwt)) : (t.realPath = o(t), t.matrix = t.transform().localMatrix, a.bbox = i.path.getBBox(i.path.map(t.realPath, n.add(t.matrix))), i._.box(a.bbox))
            } catch (s) {
              return i._.box()
            }
          };
          var x = function () {
            return this.string
          };
          d.transform = function (e) {
            var t = this._;
            if (null == e) {
              for (var n, r = this, a = new i.Matrix(this.node.getCTM()), o = c(this), s = [o], l = new i.Matrix, u = o.toTransformString(), p = h(o) == h(this.matrix) ? h(t.transform) : u; "svg" != r.type && (r = r.parent());)s.push(c(r));
              for (n = s.length; n--;)l.add(s[n]);
              return {
                string: p,
                globalMatrix: a,
                totalMatrix: l,
                localMatrix: o,
                diffMatrix: a.clone().add(o.invert()),
                global: a.toTransformString(),
                total: l.toTransformString(),
                local: u,
                toString: x
              }
            }
            return e instanceof i.Matrix ? (this.matrix = e, this._.transform = e.toTransformString()) : c(this, e), this.node && ("linearGradient" == this.type || "radialGradient" == this.type ? g(this.node, {gradientTransform: this.matrix}) : "pattern" == this.type ? g(this.node, {patternTransform: this.matrix}) : g(this.node, {transform: this.matrix})), this
          }, d.parent = function () {
            return w(this.node.parentNode)
          }, d.append = d.add = function (e) {
            if (e) {
              if ("set" == e.type) {
                var t = this;
                return e.forEach(function (e) {
                  t.add(e)
                }), this
              }
              e = w(e), this.node.appendChild(e.node), e.paper = this.paper
            }
            return this
          }, d.appendTo = function (e) {
            return e && (e = w(e), e.append(this)), this
          }, d.prepend = function (e) {
            if (e) {
              if ("set" == e.type) {
                var t, n = this;
                return e.forEach(function (e) {
                  t ? t.after(e) : n.prepend(e), t = e
                }), this
              }
              e = w(e);
              var i = e.parent();
              this.node.insertBefore(e.node, this.node.firstChild), this.add && this.add(), e.paper = this.paper, this.parent() && this.parent().add(), i && i.add()
            }
            return this
          }, d.prependTo = function (e) {
            return e = w(e), e.prepend(this), this
          }, d.before = function (e) {
            if ("set" == e.type) {
              var t = this;
              return e.forEach(function (e) {
                var n = e.parent();
                t.node.parentNode.insertBefore(e.node, t.node), n && n.add()
              }), this.parent().add(), this
            }
            e = w(e);
            var n = e.parent();
            return this.node.parentNode.insertBefore(e.node, this.node), this.parent() && this.parent().add(), n && n.add(), e.paper = this.paper, this
          }, d.after = function (e) {
            e = w(e);
            var t = e.parent();
            return this.node.nextSibling ? this.node.parentNode.insertBefore(e.node, this.node.nextSibling) : this.node.parentNode.appendChild(e.node), this.parent() && this.parent().add(), t && t.add(), e.paper = this.paper, this
          }, d.insertBefore = function (e) {
            e = w(e);
            var t = this.parent();
            return e.node.parentNode.insertBefore(this.node, e.node), this.paper = e.paper, t && t.add(), e.parent() && e.parent().add(), this
          }, d.insertAfter = function (e) {
            e = w(e);
            var t = this.parent();
            return e.node.parentNode.insertBefore(this.node, e.node.nextSibling), this.paper = e.paper, t && t.add(), e.parent() && e.parent().add(), this
          }, d.remove = function () {
            var e = this.parent();
            return this.node.parentNode && this.node.parentNode.removeChild(this.node), delete this.paper, this.removed = !0, e && e.add(), this
          }, d.select = function (e) {
            return e = h(e).replace(/([^\\]):/g, "$1\\:"), w(this.node.querySelector(e))
          }, d.selectAll = function (e) {
            for (var t = this.node.querySelectorAll(e), n = (i.set || Array)(), r = 0; r < t.length; r++)n.push(w(t[r]));
            return n
          }, d.asPX = function (e, t) {
            return null == t && (t = this.attr(e)), +m(this, e, t)
          }, d.use = function () {
            var e, t = this.node.id;
            return t || (t = this.id, g(this.node, {id: t})), e = "linearGradient" == this.type || "radialGradient" == this.type || "pattern" == this.type ? v(this.type, this.node.parentNode) : v("use", this.node.parentNode), g(e.node, {"xlink:href": "#" + t}), e.original = this, e
          }, d.clone = function () {
            var e = w(this.node.cloneNode(!0));
            return g(e.node, "id") && g(e.node, {id: e.id}), l(e), e.insertAfter(this), e
          }, d.toDefs = function () {
            var e = y(this);
            return e.appendChild(this.node), this
          }, d.pattern = d.toPattern = function (e, t, n, i) {
            var r = v("pattern", y(this));
            return null == e && (e = this.getBBox()), f(e, "object") && "x"in e && (t = e.y, n = e.width, i = e.height, e = e.x), g(r.node, {
              x: e,
              y: t,
              width: n,
              height: i,
              patternUnits: "userSpaceOnUse",
              id: r.id,
              viewBox: [e, t, n, i].join(" ")
            }), r.node.appendChild(this.node), r
          }, d.marker = function (e, t, n, i, r, a) {
            var o = v("marker", y(this));
            return null == e && (e = this.getBBox()), f(e, "object") && "x"in e && (t = e.y, n = e.width, i = e.height, r = e.refX || e.cx, a = e.refY || e.cy, e = e.x), g(o.node, {
              viewBox: [e, t, n, i].join(" "),
              markerWidth: n,
              markerHeight: i,
              orient: "auto",
              refX: r || 0,
              refY: a || 0,
              id: o.id
            }), o.node.appendChild(this.node), o
          };
          var _ = function (e, t, i, r) {
            "function" != typeof i || i.length || (r = i, i = n.linear), this.attr = e, this.dur = t, i && (this.easing = i), r && (this.callback = r)
          };
          i._.Animation = _, i.animation = function (e, t, n, i) {
            return new _(e, t, n, i)
          }, d.inAnim = function () {
            var e = this, t = [];
            for (var n in e.anims)e.anims[b](n) && !function (e) {
              t.push({
                anim: new _(e._attrs, e.dur, e.easing, e._callback),
                mina: e,
                curStatus: e.status(),
                status: function (t) {
                  return e.status(t)
                },
                stop: function () {
                  e.stop()
                }
              })
            }(e.anims[n]);
            return t
          }, i.animate = function (e, i, r, a, o, s) {
            "function" != typeof o || o.length || (s = o, o = n.linear);
            var c = n.time(), l = n(e, i, c, c + a, n.time, r, o);
            return s && t.once("mina.finish." + l.id, s), l
          }, d.stop = function () {
            for (var e = this.inAnim(), t = 0, n = e.length; n > t; t++)e[t].stop();
            return this
          }, d.animate = function (e, i, r, a) {
            "function" != typeof r || r.length || (a = r, r = n.linear), e instanceof _ && (a = e.callback, r = e.easing, i = r.dur, e = e.attr);
            var o, s, c, l, p = [], d = [], m = {}, g = this;
            for (var v in e)if (e[b](v)) {
              g.equal ? (l = g.equal(v, h(e[v])), o = l.from, s = l.to, c = l.f) : (o = +g.attr(v), s = +e[v]);
              var y = f(o, "array") ? o.length : 1;
              m[v] = u(p.length, p.length + y, c), p = p.concat(o), d = d.concat(s)
            }
            var w = n.time(), x = n(p, d, w, w + i, n.time, function (e) {
              var t = {};
              for (var n in m)m[b](n) && (t[n] = m[n](e));
              g.attr(t)
            }, r);
            return g.anims[x.id] = x, x._attrs = e, x._callback = a, t("snap.animcreated." + g.id, x), t.once("mina.finish." + x.id, function () {
              delete g.anims[x.id], a && a.call(g)
            }), t.once("mina.stop." + x.id, function () {
              delete g.anims[x.id]
            }), g
          };
          var T = {};
          d.data = function (e, n) {
            var r = T[this.id] = T[this.id] || {};
            if (0 == arguments.length)return t("snap.data.get." + this.id, this, r, null), r;
            if (1 == arguments.length) {
              if (i.is(e, "object")) {
                for (var a in e)e[b](a) && this.data(a, e[a]);
                return this
              }
              return t("snap.data.get." + this.id, this, r[e], e), r[e]
            }
            return r[e] = n, t("snap.data.set." + this.id, this, n, e), this
          }, d.removeData = function (e) {
            return null == e ? T[this.id] = {} : T[this.id] && delete T[this.id][e], this
          }, d.outerSVG = d.toString = p(1), d.innerSVG = p(), d.toDataURL = function () {
            if (e && e.btoa) {
              var t = this.getBBox(), n = i.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                x: +t.x.toFixed(3),
                y: +t.y.toFixed(3),
                width: +t.width.toFixed(3),
                height: +t.height.toFixed(3),
                contents: this.outerSVG()
              });
              return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(n)))
            }
          }, s.prototype.select = d.select, s.prototype.selectAll = d.selectAll
        }), i.plugin(function (e) {
          function t(e, t, i, r, a, o) {
            return null == t && "[object SVGMatrix]" == n.call(e) ? (this.a = e.a, this.b = e.b, this.c = e.c, this.d = e.d, this.e = e.e, void(this.f = e.f)) : void(null != e ? (this.a = +e, this.b = +t, this.c = +i, this.d = +r, this.e = +a, this.f = +o) : (this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0))
          }

          var n = Object.prototype.toString, i = String, r = Math, a = "";
          !function (n) {
            function o(e) {
              return e[0] * e[0] + e[1] * e[1]
            }

            function s(e) {
              var t = r.sqrt(o(e));
              e[0] && (e[0] /= t), e[1] && (e[1] /= t)
            }

            n.add = function (e, n, i, r, a, o) {
              var s, c, l, u, p = [[], [], []], d = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]], f = [[e, i, a], [n, r, o], [0, 0, 1]];
              for (e && e instanceof t && (f = [[e.a, e.c, e.e], [e.b, e.d, e.f], [0, 0, 1]]), s = 0; 3 > s; s++)for (c = 0; 3 > c; c++) {
                for (u = 0, l = 0; 3 > l; l++)u += d[s][l] * f[l][c];
                p[s][c] = u
              }
              return this.a = p[0][0], this.b = p[1][0], this.c = p[0][1], this.d = p[1][1], this.e = p[0][2], this.f = p[1][2], this
            }, n.invert = function () {
              var e = this, n = e.a * e.d - e.b * e.c;
              return new t(e.d / n, -e.b / n, -e.c / n, e.a / n, (e.c * e.f - e.d * e.e) / n, (e.b * e.e - e.a * e.f) / n)
            }, n.clone = function () {
              return new t(this.a, this.b, this.c, this.d, this.e, this.f)
            }, n.translate = function (e, t) {
              return this.add(1, 0, 0, 1, e, t)
            }, n.scale = function (e, t, n, i) {
              return null == t && (t = e), (n || i) && this.add(1, 0, 0, 1, n, i), this.add(e, 0, 0, t, 0, 0), (n || i) && this.add(1, 0, 0, 1, -n, -i), this
            }, n.rotate = function (t, n, i) {
              t = e.rad(t), n = n || 0, i = i || 0;
              var a = +r.cos(t).toFixed(9), o = +r.sin(t).toFixed(9);
              return this.add(a, o, -o, a, n, i), this.add(1, 0, 0, 1, -n, -i)
            }, n.x = function (e, t) {
              return e * this.a + t * this.c + this.e
            }, n.y = function (e, t) {
              return e * this.b + t * this.d + this.f
            }, n.get = function (e) {
              return +this[i.fromCharCode(97 + e)].toFixed(4)
            }, n.toString = function () {
              return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")"
            }, n.offset = function () {
              return [this.e.toFixed(4), this.f.toFixed(4)]
            }, n.determinant = function () {
              return this.a * this.d - this.b * this.c
            }, n.split = function () {
              var t = {};
              t.dx = this.e, t.dy = this.f;
              var n = [[this.a, this.c], [this.b, this.d]];
              t.scalex = r.sqrt(o(n[0])), s(n[0]), t.shear = n[0][0] * n[1][0] + n[0][1] * n[1][1], n[1] = [n[1][0] - n[0][0] * t.shear, n[1][1] - n[0][1] * t.shear], t.scaley = r.sqrt(o(n[1])), s(n[1]), t.shear /= t.scaley, this.determinant() < 0 && (t.scalex = -t.scalex);
              var i = -n[0][1], a = n[1][1];
              return 0 > a ? (t.rotate = e.deg(r.acos(a)), 0 > i && (t.rotate = 360 - t.rotate)) : t.rotate = e.deg(r.asin(i)), t.isSimple = !(+t.shear.toFixed(9) || t.scalex.toFixed(9) != t.scaley.toFixed(9) && t.rotate), t.isSuperSimple = !+t.shear.toFixed(9) && t.scalex.toFixed(9) == t.scaley.toFixed(9) && !t.rotate, t.noRotation = !+t.shear.toFixed(9) && !t.rotate, t
            }, n.toTransformString = function (e) {
              var t = e || this.split();
              return +t.shear.toFixed(9) ? "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)] : (t.scalex = +t.scalex.toFixed(4), t.scaley = +t.scaley.toFixed(4), t.rotate = +t.rotate.toFixed(4), (t.dx || t.dy ? "t" + [+t.dx.toFixed(4), +t.dy.toFixed(4)] : a) + (1 != t.scalex || 1 != t.scaley ? "s" + [t.scalex, t.scaley, 0, 0] : a) + (t.rotate ? "r" + [+t.rotate.toFixed(4), 0, 0] : a))
            }
          }(t.prototype), e.Matrix = t, e.matrix = function (e, n, i, r, a, o) {
            return new t(e, n, i, r, a, o)
          }
        }), i.plugin(function (e, n, i, r, a) {
          function o(i) {
            return function (r) {
              if (t.stop(), r instanceof a && 1 == r.node.childNodes.length && ("radialGradient" == r.node.firstChild.tagName || "linearGradient" == r.node.firstChild.tagName || "pattern" == r.node.firstChild.tagName) && (r = r.node.firstChild, f(this).appendChild(r), r = p(r)), r instanceof n)if ("radialGradient" == r.type || "linearGradient" == r.type || "pattern" == r.type) {
                r.node.id || m(r.node, {id: r.id});
                var o = g(r.node.id)
              } else o = r.attr(i); else if (o = e.color(r), o.error) {
                var s = e(f(this).ownerSVGElement).gradient(r);
                s ? (s.node.id || m(s.node, {id: s.id}), o = g(s.node.id)) : o = r
              } else o = v(o);
              var c = {};
              c[i] = o, m(this.node, c), this.node.style[i] = b
            }
          }

          function s(e) {
            t.stop(), e == +e && (e += "px"), this.node.style.fontSize = e
          }

          function c(e) {
            for (var t = [], n = e.childNodes, i = 0, r = n.length; r > i; i++) {
              var a = n[i];
              3 == a.nodeType && t.push(a.nodeValue), "tspan" == a.tagName && t.push(1 == a.childNodes.length && 3 == a.firstChild.nodeType ? a.firstChild.nodeValue : c(a))
            }
            return t
          }

          function l() {
            return t.stop(), this.node.style.fontSize
          }

          var u = e._.make, p = e._.wrap, d = e.is, f = e._.getSomeDefs, h = /^url\(#?([^)]+)\)$/, m = e._.$, g = e.url, v = String, y = e._.separator, b = "";
          t.on("snap.util.attr.mask", function (e) {
            if (e instanceof n || e instanceof a) {
              if (t.stop(), e instanceof a && 1 == e.node.childNodes.length && (e = e.node.firstChild, f(this).appendChild(e), e = p(e)), "mask" == e.type)var i = e; else i = u("mask", f(this)), i.node.appendChild(e.node);
              !i.node.id && m(i.node, {id: i.id}), m(this.node, {mask: g(i.id)})
            }
          }), function (e) {
            t.on("snap.util.attr.clip", e), t.on("snap.util.attr.clip-path", e), t.on("snap.util.attr.clipPath", e)
          }(function (e) {
            if (e instanceof n || e instanceof a) {
              if (t.stop(), "clipPath" == e.type)var i = e; else i = u("clipPath", f(this)), i.node.appendChild(e.node), !i.node.id && m(i.node, {id: i.id});
              m(this.node, {"clip-path": g(i.node.id || i.id)})
            }
          }), t.on("snap.util.attr.fill", o("fill")), t.on("snap.util.attr.stroke", o("stroke"));
          var w = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
          t.on("snap.util.grad.parse", function (e) {
            e = v(e);
            var t = e.match(w);
            if (!t)return null;
            var n = t[1], i = t[2], r = t[3];
            return i = i.split(/\s*,\s*/).map(function (e) {
              return +e == e ? +e : e
            }), 1 == i.length && 0 == i[0] && (i = []), r = r.split("-"), r = r.map(function (e) {
              e = e.split(":");
              var t = {color: e[0]};
              return e[1] && (t.offset = parseFloat(e[1])), t
            }), {type: n, params: i, stops: r}
          }), t.on("snap.util.attr.d", function (n) {
            t.stop(), d(n, "array") && d(n[0], "array") && (n = e.path.toString.call(n)), n = v(n), n.match(/[ruo]/i) && (n = e.path.toAbsolute(n)), m(this.node, {d: n})
          })(-1), t.on("snap.util.attr.#text", function (e) {
            t.stop(), e = v(e);
            for (var n = r.doc.createTextNode(e); this.node.firstChild;)this.node.removeChild(this.node.firstChild);
            this.node.appendChild(n)
          })(-1), t.on("snap.util.attr.path", function (e) {
            t.stop(), this.attr({d: e})
          })(-1), t.on("snap.util.attr.class", function (e) {
            t.stop(), this.node.className.baseVal = e
          })(-1), t.on("snap.util.attr.viewBox", function (e) {
            var n;
            n = d(e, "object") && "x"in e ? [e.x, e.y, e.width, e.height].join(" ") : d(e, "array") ? e.join(" ") : e, m(this.node, {viewBox: n}), t.stop()
          })(-1), t.on("snap.util.attr.transform", function (e) {
            this.transform(e), t.stop()
          })(-1), t.on("snap.util.attr.r", function (e) {
            "rect" == this.type && (t.stop(), m(this.node, {rx: e, ry: e}))
          })(-1), t.on("snap.util.attr.textpath", function (e) {
            if (t.stop(), "text" == this.type) {
              var i, r, a;
              if (!e && this.textPath) {
                for (r = this.textPath; r.node.firstChild;)this.node.appendChild(r.node.firstChild);
                return r.remove(), void delete this.textPath
              }
              if (d(e, "string")) {
                var o = f(this), s = p(o.parentNode).path(e);
                o.appendChild(s.node), i = s.id, s.attr({id: i})
              } else e = p(e), e instanceof n && (i = e.attr("id"), i || (i = e.id, e.attr({id: i})));
              if (i)if (r = this.textPath, a = this.node, r)r.attr({"xlink:href": "#" + i}); else {
                for (r = m("textPath", {"xlink:href": "#" + i}); a.firstChild;)r.appendChild(a.firstChild);
                a.appendChild(r), this.textPath = p(r)
              }
            }
          })(-1), t.on("snap.util.attr.text", function (e) {
            if ("text" == this.type) {
              for (var n = this.node, i = function (e) {
                var t = m("tspan");
                if (d(e, "array"))for (var n = 0; n < e.length; n++)t.appendChild(i(e[n])); else t.appendChild(r.doc.createTextNode(e));
                return t.normalize && t.normalize(), t
              }; n.firstChild;)n.removeChild(n.firstChild);
              for (var a = i(e); a.firstChild;)n.appendChild(a.firstChild)
            }
            t.stop()
          })(-1), t.on("snap.util.attr.fontSize", s)(-1), t.on("snap.util.attr.font-size", s)(-1), t.on("snap.util.getattr.transform", function () {
            return t.stop(), this.transform()
          })(-1), t.on("snap.util.getattr.textpath", function () {
            return t.stop(), this.textPath
          })(-1), function () {
            function n(n) {
              return function () {
                t.stop();
                var i = r.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + n);
                return "none" == i ? i : e(r.doc.getElementById(i.match(h)[1]))
              }
            }

            function i(e) {
              return function (n) {
                t.stop();
                var i = "marker" + e.charAt(0).toUpperCase() + e.substring(1);
                if ("" == n || !n)return void(this.node.style[i] = "none");
                if ("marker" == n.type) {
                  var r = n.node.id;
                  return r || m(n.node, {id: n.id}), void(this.node.style[i] = g(r))
                }
              }
            }

            t.on("snap.util.getattr.marker-end", n("end"))(-1), t.on("snap.util.getattr.markerEnd", n("end"))(-1), t.on("snap.util.getattr.marker-start", n("start"))(-1), t.on("snap.util.getattr.markerStart", n("start"))(-1), t.on("snap.util.getattr.marker-mid", n("mid"))(-1), t.on("snap.util.getattr.markerMid", n("mid"))(-1), t.on("snap.util.attr.marker-end", i("end"))(-1), t.on("snap.util.attr.markerEnd", i("end"))(-1), t.on("snap.util.attr.marker-start", i("start"))(-1), t.on("snap.util.attr.markerStart", i("start"))(-1), t.on("snap.util.attr.marker-mid", i("mid"))(-1), t.on("snap.util.attr.markerMid", i("mid"))(-1)
          }(), t.on("snap.util.getattr.r", function () {
            return "rect" == this.type && m(this.node, "rx") == m(this.node, "ry") ? (t.stop(), m(this.node, "rx")) : void 0
          })(-1), t.on("snap.util.getattr.text", function () {
            if ("text" == this.type || "tspan" == this.type) {
              t.stop();
              var e = c(this.node);
              return 1 == e.length ? e[0] : e
            }
          })(-1), t.on("snap.util.getattr.#text", function () {
            return this.node.textContent
          })(-1), t.on("snap.util.getattr.viewBox", function () {
            t.stop();
            var n = m(this.node, "viewBox");
            return n ? (n = n.split(y), e._.box(+n[0], +n[1], +n[2], +n[3])) : void 0
          })(-1), t.on("snap.util.getattr.points", function () {
            var e = m(this.node, "points");
            return t.stop(), e ? e.split(y) : void 0
          })(-1), t.on("snap.util.getattr.path", function () {
            var e = m(this.node, "d");
            return t.stop(), e
          })(-1), t.on("snap.util.getattr.class", function () {
            return this.node.className.baseVal
          })(-1), t.on("snap.util.getattr.fontSize", l)(-1), t.on("snap.util.getattr.font-size", l)(-1)
        }), i.plugin(function (n, i, r, a) {
          var o = r.prototype, s = n.is;
          o.rect = function (e, t, n, i, r, a) {
            var o;
            return null == a && (a = r), s(e, "object") && "[object Object]" == e ? o = e : null != e && (o = {
              x: e,
              y: t,
              width: n,
              height: i
            }, null != r && (o.rx = r, o.ry = a)), this.el("rect", o)
          }, o.circle = function (e, t, n) {
            var i;
            return s(e, "object") && "[object Object]" == e ? i = e : null != e && (i = {
              cx: e,
              cy: t,
              r: n
            }), this.el("circle", i)
          };
          var c = function () {
            function e() {
              this.parentNode.removeChild(this)
            }

            return function (t, n) {
              var i = a.doc.createElement("img"), r = a.doc.body;
              i.style.cssText = "position:absolute;left:-9999em;top:-9999em", i.onload = function () {
                n.call(i), i.onload = i.onerror = null, r.removeChild(i)
              }, i.onerror = e, r.appendChild(i), i.src = t
            }
          }();
          o.image = function (e, t, i, r, a) {
            var o = this.el("image");
            if (s(e, "object") && "src"in e)o.attr(e); else if (null != e) {
              var l = {"xlink:href": e, preserveAspectRatio: "none"};
              null != t && null != i && (l.x = t, l.y = i), null != r && null != a ? (l.width = r, l.height = a) : c(e, function () {
                n._.$(o.node, {width: this.offsetWidth, height: this.offsetHeight})
              }), n._.$(o.node, l)
            }
            return o
          }, o.ellipse = function (e, t, n, i) {
            var r;
            return s(e, "object") && "[object Object]" == e ? r = e : null != e && (r = {
              cx: e,
              cy: t,
              rx: n,
              ry: i
            }), this.el("ellipse", r)
          }, o.path = function (e) {
            var t;
            return s(e, "object") && !s(e, "array") ? t = e : e && (t = {d: e}), this.el("path", t)
          }, o.group = o.g = function (e) {
            var t = this.el("g");
            return 1 == arguments.length && e && !e.type ? t.attr(e) : arguments.length && t.add(Array.prototype.slice.call(arguments, 0)), t
          }, o.svg = function (e, t, n, i, r, a, o, c) {
            var l = {};
            return s(e, "object") && null == t ? l = e : (null != e && (l.x = e), null != t && (l.y = t), null != n && (l.width = n), null != i && (l.height = i), null != r && null != a && null != o && null != c && (l.viewBox = [r, a, o, c])), this.el("svg", l)
          }, o.mask = function (e) {
            var t = this.el("mask");
            return 1 == arguments.length && e && !e.type ? t.attr(e) : arguments.length && t.add(Array.prototype.slice.call(arguments, 0)), t
          }, o.ptrn = function (e, t, n, i, r, a, o, c) {
            if (s(e, "object"))var l = e; else l = {patternUnits: "userSpaceOnUse"}, e && (l.x = e), t && (l.y = t), null != n && (l.width = n), null != i && (l.height = i), null != r && null != a && null != o && null != c && (l.viewBox = [r, a, o, c]);
            return this.el("pattern", l)
          }, o.use = function (e) {
            return null != e ? (e instanceof i && (e.attr("id") || e.attr({id: n._.id(e)}), e = e.attr("id")), "#" == String(e).charAt() && (e = e.substring(1)), this.el("use", {"xlink:href": "#" + e})) : i.prototype.use.call(this)
          }, o.symbol = function (e, t, n, i) {
            var r = {};
            return null != e && null != t && null != n && null != i && (r.viewBox = [e, t, n, i]), this.el("symbol", r)
          }, o.text = function (e, t, n) {
            var i = {};
            return s(e, "object") ? i = e : null != e && (i = {x: e, y: t, text: n || ""}), this.el("text", i)
          }, o.line = function (e, t, n, i) {
            var r = {};
            return s(e, "object") ? r = e : null != e && (r = {x1: e, x2: n, y1: t, y2: i}), this.el("line", r)
          }, o.polyline = function (e) {
            arguments.length > 1 && (e = Array.prototype.slice.call(arguments, 0));
            var t = {};
            return s(e, "object") && !s(e, "array") ? t = e : null != e && (t = {points: e}), this.el("polyline", t)
          }, o.polygon = function (e) {
            arguments.length > 1 && (e = Array.prototype.slice.call(arguments, 0));
            var t = {};
            return s(e, "object") && !s(e, "array") ? t = e : null != e && (t = {points: e}), this.el("polygon", t)
          }, function () {
            function i() {
              return this.selectAll("stop")
            }

            function r(e, t) {
              var i = u("stop"), r = {offset: +t + "%"};
              return e = n.color(e), r["stop-color"] = e.hex, e.opacity < 1 && (r["stop-opacity"] = e.opacity), u(i, r), this.node.appendChild(i), this
            }

            function a() {
              if ("linearGradient" == this.type) {
                var e = u(this.node, "x1") || 0, t = u(this.node, "x2") || 1, i = u(this.node, "y1") || 0, r = u(this.node, "y2") || 0;
                return n._.box(e, i, math.abs(t - e), math.abs(r - i))
              }
              var a = this.node.cx || .5, o = this.node.cy || .5, s = this.node.r || 0;
              return n._.box(a - s, o - s, 2 * s, 2 * s)
            }

            function s(e, n) {
              function i(e, t) {
                for (var n = (t - p) / (e - d), i = d; e > i; i++)o[i].offset = +(+p + n * (i - d)).toFixed(2);
                d = e, p = t
              }

              var r, a = t("snap.util.grad.parse", null, n).firstDefined();
              if (!a)return null;
              a.params.unshift(e), r = "l" == a.type.toLowerCase() ? c.apply(0, a.params) : l.apply(0, a.params), a.type != a.type.toLowerCase() && u(r.node, {gradientUnits: "userSpaceOnUse"});
              var o = a.stops, s = o.length, p = 0, d = 0;
              s--;
              for (var f = 0; s > f; f++)"offset"in o[f] && i(f, o[f].offset);
              for (o[s].offset = o[s].offset || 100, i(s, o[s].offset), f = 0; s >= f; f++) {
                var h = o[f];
                r.addStop(h.color, h.offset)
              }
              return r
            }

            function c(e, t, o, s, c) {
              var l = n._.make("linearGradient", e);
              return l.stops = i, l.addStop = r, l.getBBox = a, null != t && u(l.node, {x1: t, y1: o, x2: s, y2: c}), l
            }

            function l(e, t, o, s, c, l) {
              var p = n._.make("radialGradient", e);
              return p.stops = i, p.addStop = r, p.getBBox = a, null != t && u(p.node, {
                cx: t,
                cy: o,
                r: s
              }), null != c && null != l && u(p.node, {fx: c, fy: l}), p
            }

            var u = n._.$;
            o.gradient = function (e) {
              return s(this.defs, e)
            }, o.gradientLinear = function (e, t, n, i) {
              return c(this.defs, e, t, n, i)
            }, o.gradientRadial = function (e, t, n, i, r) {
              return l(this.defs, e, t, n, i, r)
            }, o.toString = function () {
              var e, t = this.node.ownerDocument, i = t.createDocumentFragment(), r = t.createElement("div"), a = this.node.cloneNode(!0);
              return i.appendChild(r), r.appendChild(a), n._.$(a, {xmlns: "http://www.w3.org/2000/svg"}), e = r.innerHTML, i.removeChild(i.firstChild), e
            }, o.toDataURL = function () {
              return e && e.btoa ? "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this))) : void 0
            }, o.clear = function () {
              for (var e, t = this.node.firstChild; t;)e = t.nextSibling, "defs" != t.tagName ? t.parentNode.removeChild(t) : o.clear.call({node: t}), t = e
            }
          }()
        }), i.plugin(function (e, t) {
          function n(e) {
            var t = n.ps = n.ps || {};
            return t[e] ? t[e].sleep = 100 : t[e] = {sleep: 100}, setTimeout(function () {
              for (var n in t)t[$](n) && n != e && (t[n].sleep--, !t[n].sleep && delete t[n])
            }), t[e]
          }

          function i(e, t, n, i) {
            return null == e && (e = t = n = i = 0), null == t && (t = e.y, n = e.width, i = e.height, e = e.x), {
              x: e,
              y: t,
              width: n,
              w: n,
              height: i,
              h: i,
              x2: e + n,
              y2: t + i,
              cx: e + n / 2,
              cy: t + i / 2,
              r1: B.min(n, i) / 2,
              r2: B.max(n, i) / 2,
              r0: B.sqrt(n * n + i * i) / 2,
              path: E(e, t, n, i),
              vb: [e, t, n, i].join(" ")
            }
          }

          function r() {
            return this.join(",").replace(F, "$1")
          }

          function a(e) {
            var t = O(e);
            return t.toString = r, t
          }

          function o(e, t, n, i, r, a, o, s, l) {
            return null == l ? f(e, t, n, i, r, a, o, s) : c(e, t, n, i, r, a, o, s, h(e, t, n, i, r, a, o, s, l))
          }

          function s(n, i) {
            function r(e) {
              return +(+e).toFixed(3)
            }

            return e._.cacher(function (e, a, s) {
              e instanceof t && (e = e.attr("d")), e = I(e);
              for (var l, u, p, d, f, h = "", m = {}, g = 0, v = 0, y = e.length; y > v; v++) {
                if (p = e[v], "M" == p[0])l = +p[1], u = +p[2]; else {
                  if (d = o(l, u, p[1], p[2], p[3], p[4], p[5], p[6]), g + d > a) {
                    if (i && !m.start) {
                      if (f = o(l, u, p[1], p[2], p[3], p[4], p[5], p[6], a - g), h += ["C" + r(f.start.x), r(f.start.y), r(f.m.x), r(f.m.y), r(f.x), r(f.y)], s)return h;
                      m.start = h, h = ["M" + r(f.x), r(f.y) + "C" + r(f.n.x), r(f.n.y), r(f.end.x), r(f.end.y), r(p[5]), r(p[6])].join(), g += d, l = +p[5], u = +p[6];
                      continue
                    }
                    if (!n && !i)return f = o(l, u, p[1], p[2], p[3], p[4], p[5], p[6], a - g)
                  }
                  g += d, l = +p[5], u = +p[6]
                }
                h += p.shift() + p
              }
              return m.end = h, f = n ? g : i ? m : c(l, u, p[0], p[1], p[2], p[3], p[4], p[5], 1)
            }, null, e._.clone)
          }

          function c(e, t, n, i, r, a, o, s, c) {
            var l = 1 - c, u = q(l, 3), p = q(l, 2), d = c * c, f = d * c, h = u * e + 3 * p * c * n + 3 * l * c * c * r + f * o, m = u * t + 3 * p * c * i + 3 * l * c * c * a + f * s, g = e + 2 * c * (n - e) + d * (r - 2 * n + e), v = t + 2 * c * (i - t) + d * (a - 2 * i + t), y = n + 2 * c * (r - n) + d * (o - 2 * r + n), b = i + 2 * c * (a - i) + d * (s - 2 * a + i), w = l * e + c * n, x = l * t + c * i, E = l * r + c * o, _ = l * a + c * s, T = 90 - 180 * B.atan2(g - y, v - b) / V;
            return {x: h, y: m, m: {x: g, y: v}, n: {x: y, y: b}, start: {x: w, y: x}, end: {x: E, y: _}, alpha: T}
          }

          function l(t, n, r, a, o, s, c, l) {
            e.is(t, "array") || (t = [t, n, r, a, o, s, c, l]);
            var u = k.apply(null, t);
            return i(u.min.x, u.min.y, u.max.x - u.min.x, u.max.y - u.min.y)
          }

          function u(e, t, n) {
            return t >= e.x && t <= e.x + e.width && n >= e.y && n <= e.y + e.height
          }

          function p(e, t) {
            return e = i(e), t = i(t), u(t, e.x, e.y) || u(t, e.x2, e.y) || u(t, e.x, e.y2) || u(t, e.x2, e.y2) || u(e, t.x, t.y) || u(e, t.x2, t.y) || u(e, t.x, t.y2) || u(e, t.x2, t.y2) || (e.x < t.x2 && e.x > t.x || t.x < e.x2 && t.x > e.x) && (e.y < t.y2 && e.y > t.y || t.y < e.y2 && t.y > e.y)
          }

          function d(e, t, n, i, r) {
            var a = -3 * t + 9 * n - 9 * i + 3 * r, o = e * a + 6 * t - 12 * n + 6 * i;
            return e * o - 3 * t + 3 * n
          }

          function f(e, t, n, i, r, a, o, s, c) {
            null == c && (c = 1), c = c > 1 ? 1 : 0 > c ? 0 : c;
            for (var l = c / 2, u = 12, p = [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816], f = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472], h = 0, m = 0; u > m; m++) {
              var g = l * p[m] + l, v = d(g, e, n, r, o), y = d(g, t, i, a, s), b = v * v + y * y;
              h += f[m] * B.sqrt(b)
            }
            return l * h
          }

          function h(e, t, n, i, r, a, o, s, c) {
            if (!(0 > c || f(e, t, n, i, r, a, o, s) < c)) {
              var l, u = 1, p = u / 2, d = u - p, h = .01;
              for (l = f(e, t, n, i, r, a, o, s, d); Y(l - c) > h;)p /= 2, d += (c > l ? 1 : -1) * p, l = f(e, t, n, i, r, a, o, s, d);
              return d
            }
          }

          function m(e, t, n, i, r, a, o, s) {
            if (!(U(e, n) < j(r, o) || j(e, n) > U(r, o) || U(t, i) < j(a, s) || j(t, i) > U(a, s))) {
              var c = (e * i - t * n) * (r - o) - (e - n) * (r * s - a * o), l = (e * i - t * n) * (a - s) - (t - i) * (r * s - a * o), u = (e - n) * (a - s) - (t - i) * (r - o);
              if (u) {
                var p = c / u, d = l / u, f = +p.toFixed(2), h = +d.toFixed(2);
                if (!(f < +j(e, n).toFixed(2) || f > +U(e, n).toFixed(2) || f < +j(r, o).toFixed(2) || f > +U(r, o).toFixed(2) || h < +j(t, i).toFixed(2) || h > +U(t, i).toFixed(2) || h < +j(a, s).toFixed(2) || h > +U(a, s).toFixed(2)))return {
                  x: p,
                  y: d
                }
              }
            }
          }

          function g(e, t, n) {
            var i = l(e), r = l(t);
            if (!p(i, r))return n ? 0 : [];
            for (var a = f.apply(0, e), o = f.apply(0, t), s = ~~(a / 8), u = ~~(o / 8), d = [], h = [], g = {}, v = n ? 0 : [], y = 0; s + 1 > y; y++) {
              var b = c.apply(0, e.concat(y / s));
              d.push({x: b.x, y: b.y, t: y / s})
            }
            for (y = 0; u + 1 > y; y++)b = c.apply(0, t.concat(y / u)), h.push({x: b.x, y: b.y, t: y / u});
            for (y = 0; s > y; y++)for (var w = 0; u > w; w++) {
              var x = d[y], E = d[y + 1], _ = h[w], T = h[w + 1], S = Y(E.x - x.x) < .001 ? "y" : "x", A = Y(T.x - _.x) < .001 ? "y" : "x", C = m(x.x, x.y, E.x, E.y, _.x, _.y, T.x, T.y);
              if (C) {
                if (g[C.x.toFixed(4)] == C.y.toFixed(4))continue;
                g[C.x.toFixed(4)] = C.y.toFixed(4);
                var D = x.t + Y((C[S] - x[S]) / (E[S] - x[S])) * (E.t - x.t), k = _.t + Y((C[A] - _[A]) / (T[A] - _[A])) * (T.t - _.t);
                D >= 0 && 1 >= D && k >= 0 && 1 >= k && (n ? v++ : v.push({x: C.x, y: C.y, t1: D, t2: k}))
              }
            }
            return v
          }

          function v(e, t) {
            return b(e, t)
          }

          function y(e, t) {
            return b(e, t, 1)
          }

          function b(e, t, n) {
            e = I(e), t = I(t);
            for (var i, r, a, o, s, c, l, u, p, d, f = n ? 0 : [], h = 0, m = e.length; m > h; h++) {
              var v = e[h];
              if ("M" == v[0])i = s = v[1], r = c = v[2]; else {
                "C" == v[0] ? (p = [i, r].concat(v.slice(1)), i = p[6], r = p[7]) : (p = [i, r, i, r, s, c, s, c], i = s, r = c);
                for (var y = 0, b = t.length; b > y; y++) {
                  var w = t[y];
                  if ("M" == w[0])a = l = w[1], o = u = w[2]; else {
                    "C" == w[0] ? (d = [a, o].concat(w.slice(1)), a = d[6], o = d[7]) : (d = [a, o, a, o, l, u, l, u], a = l, o = u);
                    var x = g(p, d, n);
                    if (n)f += x; else {
                      for (var E = 0, _ = x.length; _ > E; E++)x[E].segment1 = h, x[E].segment2 = y, x[E].bez1 = p, x[E].bez2 = d;
                      f = f.concat(x)
                    }
                  }
                }
              }
            }
            return f
          }

          function w(e, t, n) {
            var i = x(e);
            return u(i, t, n) && b(e, [["M", t, n], ["H", i.x2 + 10]], 1) % 2 == 1
          }

          function x(e) {
            var t = n(e);
            if (t.bbox)return O(t.bbox);
            if (!e)return i();
            e = I(e);
            for (var r, a = 0, o = 0, s = [], c = [], l = 0, u = e.length; u > l; l++)if (r = e[l], "M" == r[0])a = r[1], o = r[2], s.push(a), c.push(o); else {
              var p = k(a, o, r[1], r[2], r[3], r[4], r[5], r[6]);
              s = s.concat(p.min.x, p.max.x), c = c.concat(p.min.y, p.max.y), a = r[5], o = r[6]
            }
            var d = j.apply(0, s), f = j.apply(0, c), h = U.apply(0, s), m = U.apply(0, c), g = i(d, f, h - d, m - f);
            return t.bbox = O(g), g
          }

          function E(e, t, n, i, a) {
            if (a)return [["M", +e + +a, t], ["l", n - 2 * a, 0], ["a", a, a, 0, 0, 1, a, a], ["l", 0, i - 2 * a], ["a", a, a, 0, 0, 1, -a, a], ["l", 2 * a - n, 0], ["a", a, a, 0, 0, 1, -a, -a], ["l", 0, 2 * a - i], ["a", a, a, 0, 0, 1, a, -a], ["z"]];
            var o = [["M", e, t], ["l", n, 0], ["l", 0, i], ["l", -n, 0], ["z"]];
            return o.toString = r, o
          }

          function _(e, t, n, i, a) {
            if (null == a && null == i && (i = n), e = +e, t = +t, n = +n, i = +i, null != a)var o = Math.PI / 180, s = e + n * Math.cos(-i * o), c = e + n * Math.cos(-a * o), l = t + n * Math.sin(-i * o), u = t + n * Math.sin(-a * o), p = [["M", s, l], ["A", n, n, 0, +(a - i > 180), 0, c, u]]; else p = [["M", e, t], ["m", 0, -i], ["a", n, i, 0, 1, 1, 0, 2 * i], ["a", n, i, 0, 1, 1, 0, -2 * i], ["z"]];
            return p.toString = r, p
          }

          function T(t) {
            var i = n(t), o = String.prototype.toLowerCase;
            if (i.rel)return a(i.rel);
            e.is(t, "array") && e.is(t && t[0], "array") || (t = e.parsePathString(t));
            var s = [], c = 0, l = 0, u = 0, p = 0, d = 0;
            "M" == t[0][0] && (c = t[0][1], l = t[0][2], u = c, p = l, d++, s.push(["M", c, l]));
            for (var f = d, h = t.length; h > f; f++) {
              var m = s[f] = [], g = t[f];
              if (g[0] != o.call(g[0]))switch (m[0] = o.call(g[0]), m[0]) {
                case"a":
                  m[1] = g[1], m[2] = g[2], m[3] = g[3], m[4] = g[4], m[5] = g[5], m[6] = +(g[6] - c).toFixed(3), m[7] = +(g[7] - l).toFixed(3);
                  break;
                case"v":
                  m[1] = +(g[1] - l).toFixed(3);
                  break;
                case"m":
                  u = g[1], p = g[2];
                default:
                  for (var v = 1, y = g.length; y > v; v++)m[v] = +(g[v] - (v % 2 ? c : l)).toFixed(3)
              } else {
                m = s[f] = [], "m" == g[0] && (u = g[1] + c, p = g[2] + l);
                for (var b = 0, w = g.length; w > b; b++)s[f][b] = g[b]
              }
              var x = s[f].length;
              switch (s[f][0]) {
                case"z":
                  c = u, l = p;
                  break;
                case"h":
                  c += +s[f][x - 1];
                  break;
                case"v":
                  l += +s[f][x - 1];
                  break;
                default:
                  c += +s[f][x - 2], l += +s[f][x - 1]
              }
            }
            return s.toString = r, i.rel = a(s), s
          }

          function S(t) {
            var i = n(t);
            if (i.abs)return a(i.abs);
            if (N(t, "array") && N(t && t[0], "array") || (t = e.parsePathString(t)), !t || !t.length)return [["M", 0, 0]];
            var o, s = [], c = 0, l = 0, u = 0, p = 0, d = 0;
            "M" == t[0][0] && (c = +t[0][1], l = +t[0][2], u = c, p = l, d++, s[0] = ["M", c, l]);
            for (var f, h, m = 3 == t.length && "M" == t[0][0] && "R" == t[1][0].toUpperCase() && "Z" == t[2][0].toUpperCase(), g = d, v = t.length; v > g; g++) {
              if (s.push(f = []), h = t[g], o = h[0], o != o.toUpperCase())switch (f[0] = o.toUpperCase(), f[0]) {
                case"A":
                  f[1] = h[1], f[2] = h[2], f[3] = h[3], f[4] = h[4], f[5] = h[5], f[6] = +h[6] + c, f[7] = +h[7] + l;
                  break;
                case"V":
                  f[1] = +h[1] + l;
                  break;
                case"H":
                  f[1] = +h[1] + c;
                  break;
                case"R":
                  for (var y = [c, l].concat(h.slice(1)), b = 2, w = y.length; w > b; b++)y[b] = +y[b] + c, y[++b] = +y[b] + l;
                  s.pop(), s = s.concat(M(y, m));
                  break;
                case"O":
                  s.pop(), y = _(c, l, h[1], h[2]), y.push(y[0]), s = s.concat(y);
                  break;
                case"U":
                  s.pop(), s = s.concat(_(c, l, h[1], h[2], h[3])), f = ["U"].concat(s[s.length - 1].slice(-2));
                  break;
                case"M":
                  u = +h[1] + c, p = +h[2] + l;
                default:
                  for (b = 1, w = h.length; w > b; b++)f[b] = +h[b] + (b % 2 ? c : l)
              } else if ("R" == o)y = [c, l].concat(h.slice(1)), s.pop(), s = s.concat(M(y, m)), f = ["R"].concat(h.slice(-2)); else if ("O" == o)s.pop(), y = _(c, l, h[1], h[2]), y.push(y[0]), s = s.concat(y); else if ("U" == o)s.pop(), s = s.concat(_(c, l, h[1], h[2], h[3])), f = ["U"].concat(s[s.length - 1].slice(-2)); else for (var x = 0, E = h.length; E > x; x++)f[x] = h[x];
              if (o = o.toUpperCase(), "O" != o)switch (f[0]) {
                case"Z":
                  c = +u, l = +p;
                  break;
                case"H":
                  c = f[1];
                  break;
                case"V":
                  l = f[1];
                  break;
                case"M":
                  u = f[f.length - 2], p = f[f.length - 1];
                default:
                  c = f[f.length - 2], l = f[f.length - 1]
              }
            }
            return s.toString = r, i.abs = a(s), s
          }

          function A(e, t, n, i) {
            return [e, t, n, i, n, i]
          }

          function C(e, t, n, i, r, a) {
            var o = 1 / 3, s = 2 / 3;
            return [o * e + s * n, o * t + s * i, o * r + s * n, o * a + s * i, r, a]
          }

          function D(t, n, i, r, a, o, s, c, l, u) {
            var p, d = 120 * V / 180, f = V / 180 * (+a || 0), h = [], m = e._.cacher(function (e, t, n) {
              var i = e * B.cos(n) - t * B.sin(n), r = e * B.sin(n) + t * B.cos(n);
              return {x: i, y: r}
            });
            if (u)T = u[0], S = u[1], E = u[2], _ = u[3]; else {
              p = m(t, n, -f), t = p.x, n = p.y, p = m(c, l, -f), c = p.x, l = p.y;
              var g = (B.cos(V / 180 * a), B.sin(V / 180 * a), (t - c) / 2), v = (n - l) / 2, y = g * g / (i * i) + v * v / (r * r);
              y > 1 && (y = B.sqrt(y), i = y * i, r = y * r);
              var b = i * i, w = r * r, x = (o == s ? -1 : 1) * B.sqrt(Y((b * w - b * v * v - w * g * g) / (b * v * v + w * g * g))), E = x * i * v / r + (t + c) / 2, _ = x * -r * g / i + (n + l) / 2, T = B.asin(((n - _) / r).toFixed(9)), S = B.asin(((l - _) / r).toFixed(9));
              T = E > t ? V - T : T, S = E > c ? V - S : S, 0 > T && (T = 2 * V + T), 0 > S && (S = 2 * V + S), s && T > S && (T -= 2 * V), !s && S > T && (S -= 2 * V)
            }
            var A = S - T;
            if (Y(A) > d) {
              var C = S, k = c, I = l;
              S = T + d * (s && S > T ? 1 : -1), c = E + i * B.cos(S), l = _ + r * B.sin(S), h = D(c, l, i, r, a, 0, s, k, I, [S, C, E, _])
            }
            A = S - T;
            var P = B.cos(T), M = B.sin(T), R = B.cos(S), N = B.sin(S), O = B.tan(A / 4), $ = 4 / 3 * i * O, F = 4 / 3 * r * O, L = [t, n], j = [t + $ * M, n - F * P], U = [c + $ * N, l - F * R], q = [c, l];
            if (j[0] = 2 * L[0] - j[0], j[1] = 2 * L[1] - j[1], u)return [j, U, q].concat(h);
            h = [j, U, q].concat(h).join().split(",");
            for (var z = [], W = 0, H = h.length; H > W; W++)z[W] = W % 2 ? m(h[W - 1], h[W], f).y : m(h[W], h[W + 1], f).x;
            return z
          }

          function k(e, t, n, i, r, a, o, s) {
            for (var c, l, u, p, d, f, h, m, g = [], v = [[], []], y = 0; 2 > y; ++y)if (0 == y ? (l = 6 * e - 12 * n + 6 * r, c = -3 * e + 9 * n - 9 * r + 3 * o, u = 3 * n - 3 * e) : (l = 6 * t - 12 * i + 6 * a, c = -3 * t + 9 * i - 9 * a + 3 * s, u = 3 * i - 3 * t), Y(c) < 1e-12) {
              if (Y(l) < 1e-12)continue;
              p = -u / l, p > 0 && 1 > p && g.push(p)
            } else h = l * l - 4 * u * c, m = B.sqrt(h), 0 > h || (d = (-l + m) / (2 * c), d > 0 && 1 > d && g.push(d), f = (-l - m) / (2 * c), f > 0 && 1 > f && g.push(f));
            for (var b, w = g.length, x = w; w--;)p = g[w], b = 1 - p, v[0][w] = b * b * b * e + 3 * b * b * p * n + 3 * b * p * p * r + p * p * p * o, v[1][w] = b * b * b * t + 3 * b * b * p * i + 3 * b * p * p * a + p * p * p * s;
            return v[0][x] = e, v[1][x] = t, v[0][x + 1] = o, v[1][x + 1] = s, v[0].length = v[1].length = x + 2, {
              min: {
                x: j.apply(0, v[0]),
                y: j.apply(0, v[1])
              }, max: {x: U.apply(0, v[0]), y: U.apply(0, v[1])}
            }
          }

          function I(e, t) {
            var i = !t && n(e);
            if (!t && i.curve)return a(i.curve);
            for (var r = S(e), o = t && S(t), s = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null}, c = {
              x: 0,
              y: 0,
              bx: 0,
              by: 0,
              X: 0,
              Y: 0,
              qx: null,
              qy: null
            }, l = (function (e, t, n) {
              var i, r;
              if (!e)return ["C", t.x, t.y, t.x, t.y, t.x, t.y];
              switch (!(e[0]in{T: 1, Q: 1}) && (t.qx = t.qy = null), e[0]) {
                case"M":
                  t.X = e[1], t.Y = e[2];
                  break;
                case"A":
                  e = ["C"].concat(D.apply(0, [t.x, t.y].concat(e.slice(1))));
                  break;
                case"S":
                  "C" == n || "S" == n ? (i = 2 * t.x - t.bx, r = 2 * t.y - t.by) : (i = t.x, r = t.y), e = ["C", i, r].concat(e.slice(1));
                  break;
                case"T":
                  "Q" == n || "T" == n ? (t.qx = 2 * t.x - t.qx, t.qy = 2 * t.y - t.qy) : (t.qx = t.x, t.qy = t.y), e = ["C"].concat(C(t.x, t.y, t.qx, t.qy, e[1], e[2]));
                  break;
                case"Q":
                  t.qx = e[1], t.qy = e[2], e = ["C"].concat(C(t.x, t.y, e[1], e[2], e[3], e[4]));
                  break;
                case"L":
                  e = ["C"].concat(A(t.x, t.y, e[1], e[2]));
                  break;
                case"H":
                  e = ["C"].concat(A(t.x, t.y, e[1], t.y));
                  break;
                case"V":
                  e = ["C"].concat(A(t.x, t.y, t.x, e[1]));
                  break;
                case"Z":
                  e = ["C"].concat(A(t.x, t.y, t.X, t.Y))
              }
              return e
            }), u = function (e, t) {
              if (e[t].length > 7) {
                e[t].shift();
                for (var n = e[t]; n.length;)d[t] = "A", o && (f[t] = "A"), e.splice(t++, 0, ["C"].concat(n.splice(0, 6)));
                e.splice(t, 1), v = U(r.length, o && o.length || 0)
              }
            }, p = function (e, t, n, i, a) {
              e && t && "M" == e[a][0] && "M" != t[a][0] && (t.splice(a, 0, ["M", i.x, i.y]), n.bx = 0, n.by = 0, n.x = e[a][1], n.y = e[a][2], v = U(r.length, o && o.length || 0))
            }, d = [], f = [], h = "", m = "", g = 0, v = U(r.length, o && o.length || 0); v > g; g++) {
              r[g] && (h = r[g][0]), "C" != h && (d[g] = h, g && (m = d[g - 1])), r[g] = l(r[g], s, m), "A" != d[g] && "C" == h && (d[g] = "C"), u(r, g), o && (o[g] && (h = o[g][0]), "C" != h && (f[g] = h, g && (m = f[g - 1])), o[g] = l(o[g], c, m), "A" != f[g] && "C" == h && (f[g] = "C"), u(o, g)), p(r, o, s, c, g), p(o, r, c, s, g);
              var y = r[g], b = o && o[g], w = y.length, x = o && b.length;
              s.x = y[w - 2], s.y = y[w - 1], s.bx = L(y[w - 4]) || s.x, s.by = L(y[w - 3]) || s.y, c.bx = o && (L(b[x - 4]) || c.x), c.by = o && (L(b[x - 3]) || c.y), c.x = o && b[x - 2], c.y = o && b[x - 1]
            }
            return o || (i.curve = a(r)), o ? [r, o] : r
          }

          function P(e, t) {
            if (!t)return e;
            var n, i, r, a, o, s, c;
            for (e = I(e), r = 0, o = e.length; o > r; r++)for (c = e[r], a = 1, s = c.length; s > a; a += 2)n = t.x(c[a], c[a + 1]), i = t.y(c[a], c[a + 1]), c[a] = n, c[a + 1] = i;
            return e
          }

          function M(e, t) {
            for (var n = [], i = 0, r = e.length; r - 2 * !t > i; i += 2) {
              var a = [{x: +e[i - 2], y: +e[i - 1]}, {x: +e[i], y: +e[i + 1]}, {
                x: +e[i + 2],
                y: +e[i + 3]
              }, {x: +e[i + 4], y: +e[i + 5]}];
              t ? i ? r - 4 == i ? a[3] = {x: +e[0], y: +e[1]} : r - 2 == i && (a[2] = {
                x: +e[0],
                y: +e[1]
              }, a[3] = {x: +e[2], y: +e[3]}) : a[0] = {
                x: +e[r - 2],
                y: +e[r - 1]
              } : r - 4 == i ? a[3] = a[2] : i || (a[0] = {
                x: +e[i],
                y: +e[i + 1]
              }), n.push(["C", (-a[0].x + 6 * a[1].x + a[2].x) / 6, (-a[0].y + 6 * a[1].y + a[2].y) / 6, (a[1].x + 6 * a[2].x - a[3].x) / 6, (a[1].y + 6 * a[2].y - a[3].y) / 6, a[2].x, a[2].y])
            }
            return n
          }

          var R = t.prototype, N = e.is, O = e._.clone, $ = "hasOwnProperty", F = /,?([a-z]),?/gi, L = parseFloat, B = Math, V = B.PI, j = B.min, U = B.max, q = B.pow, Y = B.abs, z = s(1), W = s(), H = s(0, 1), G = e._unit2px, K = {
            path: function (e) {
              return e.attr("path")
            }, circle: function (e) {
              var t = G(e);
              return _(t.cx, t.cy, t.r)
            }, ellipse: function (e) {
              var t = G(e);
              return _(t.cx || 0, t.cy || 0, t.rx, t.ry)
            }, rect: function (e) {
              var t = G(e);
              return E(t.x || 0, t.y || 0, t.width, t.height, t.rx, t.ry)
            }, image: function (e) {
              var t = G(e);
              return E(t.x || 0, t.y || 0, t.width, t.height)
            }, line: function (e) {
              return "M" + [e.attr("x1") || 0, e.attr("y1") || 0, e.attr("x2"), e.attr("y2")]
            }, polyline: function (e) {
              return "M" + e.attr("points")
            }, polygon: function (e) {
              return "M" + e.attr("points") + "z"
            }, deflt: function (e) {
              var t = e.node.getBBox();
              return E(t.x, t.y, t.width, t.height)
            }
          };
          e.path = n, e.path.getTotalLength = z, e.path.getPointAtLength = W, e.path.getSubpath = function (e, t, n) {
            if (this.getTotalLength(e) - n < 1e-6)return H(e, t).end;
            var i = H(e, n, 1);
            return t ? H(i, t).end : i
          }, R.getTotalLength = function () {
            return this.node.getTotalLength ? this.node.getTotalLength() : void 0
          }, R.getPointAtLength = function (e) {
            return W(this.attr("d"), e)
          }, R.getSubpath = function (t, n) {
            return e.path.getSubpath(this.attr("d"), t, n)
          }, e._.box = i, e.path.findDotsAtSegment = c, e.path.bezierBBox = l, e.path.isPointInsideBBox = u, e.path.isBBoxIntersect = p, e.path.intersection = v, e.path.intersectionNumber = y, e.path.isPointInside = w, e.path.getBBox = x, e.path.get = K, e.path.toRelative = T, e.path.toAbsolute = S, e.path.toCubic = I, e.path.map = P, e.path.toString = r, e.path.clone = a
        }), i.plugin(function (e, n, i, r) {
          for (var a = n.prototype, o = "hasOwnProperty", s = ("createTouch"in r.doc), c = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel"], l = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
          }, u = (function (e, t) {
            var n = "y" == e ? "scrollTop" : "scrollLeft", i = t && t.node ? t.node.ownerDocument : r.doc;
            return i[n in i.documentElement ? "documentElement" : "body"][n]
          }), p = function () {
            this.returnValue = !1
          }, d = function () {
            return this.originalEvent.preventDefault()
          }, f = function () {
            this.cancelBubble = !0
          }, h = function () {
            return this.originalEvent.stopPropagation()
          }, m = function () {
            return r.doc.addEventListener ? function (e, t, n, i) {
              var r = s && l[t] ? l[t] : t, a = function (r) {
                var a = u("y", i), c = u("x", i);
                if (s && l[o](t))for (var p = 0, f = r.targetTouches && r.targetTouches.length; f > p; p++)if (r.targetTouches[p].target == e || e.contains(r.targetTouches[p].target)) {
                  var m = r;
                  r = r.targetTouches[p], r.originalEvent = m, r.preventDefault = d, r.stopPropagation = h;
                  break
                }
                var g = r.clientX + c, v = r.clientY + a;
                return n.call(i, r, g, v)
              };
              return t !== r && e.addEventListener(t, a, !1), e.addEventListener(r, a, !1), function () {
                return t !== r && e.removeEventListener(t, a, !1), e.removeEventListener(r, a, !1), !0
              }
            } : r.doc.attachEvent ? function (e, t, n, i) {
              var r = function (e) {
                e = e || i.node.ownerDocument.window.event;
                var t = u("y", i), r = u("x", i), a = e.clientX + r, o = e.clientY + t;
                return e.preventDefault = e.preventDefault || p, e.stopPropagation = e.stopPropagation || f, n.call(i, e, a, o)
              };
              e.attachEvent("on" + t, r);
              var a = function () {
                return e.detachEvent("on" + t, r), !0
              };
              return a
            } : void 0
          }(), g = [], v = function (e) {
            for (var n, i = e.clientX, r = e.clientY, a = u("y"), o = u("x"), c = g.length; c--;) {
              if (n = g[c], s) {
                for (var l, p = e.touches && e.touches.length; p--;)if (l = e.touches[p], l.identifier == n.el._drag.id || n.el.node.contains(l.target)) {
                  i = l.clientX, r = l.clientY, (e.originalEvent ? e.originalEvent : e).preventDefault();
                  break
                }
              } else e.preventDefault();
              {
                var d = n.el.node;
                d.nextSibling, d.parentNode, d.style.display
              }
              i += o, r += a, t("snap.drag.move." + n.el.id, n.move_scope || n.el, i - n.el._drag.x, r - n.el._drag.y, i, r, e)
            }
          }, y = function (n) {
            e.unmousemove(v).unmouseup(y);
            for (var i, r = g.length; r--;)i = g[r], i.el._drag = {}, t("snap.drag.end." + i.el.id, i.end_scope || i.start_scope || i.move_scope || i.el, n);
            g = []
          }, b = c.length; b--;)!function (t) {
            e[t] = a[t] = function (n, i) {
              return e.is(n, "function") && (this.events = this.events || [], this.events.push({
                name: t,
                f: n,
                unbind: m(this.node || document, t, n, i || this)
              })), this
            }, e["un" + t] = a["un" + t] = function (e) {
              for (var n = this.events || [], i = n.length; i--;)if (n[i].name == t && (n[i].f == e || !e))return n[i].unbind(), n.splice(i, 1), !n.length && delete this.events, this;
              return this
            }
          }(c[b]);
          a.hover = function (e, t, n, i) {
            return this.mouseover(e, n).mouseout(t, i || n)
          }, a.unhover = function (e, t) {
            return this.unmouseover(e).unmouseout(t)
          };
          var w = [];
          a.drag = function (n, i, r, a, o, s) {
            function c(c, l, u) {
              (c.originalEvent || c).preventDefault(), this._drag.x = l, this._drag.y = u, this._drag.id = c.identifier, !g.length && e.mousemove(v).mouseup(y), g.push({
                el: this,
                move_scope: a,
                start_scope: o,
                end_scope: s
              }), i && t.on("snap.drag.start." + this.id, i), n && t.on("snap.drag.move." + this.id, n), r && t.on("snap.drag.end." + this.id, r), t("snap.drag.start." + this.id, o || a || this, l, u, c)
            }

            if (!arguments.length) {
              var l;
              return this.drag(function (e, t) {
                this.attr({transform: l + (l ? "T" : "t") + [e, t]})
              }, function () {
                l = this.transform().local
              })
            }
            return this._drag = {}, w.push({el: this, start: c}), this.mousedown(c), this
          }, a.undrag = function () {
            for (var n = w.length; n--;)w[n].el == this && (this.unmousedown(w[n].start), w.splice(n, 1), t.unbind("snap.drag.*." + this.id));
            return !w.length && e.unmousemove(v).unmouseup(y), this
          }
        }), i.plugin(function (e, n, i) {
          var r = (n.prototype, i.prototype), a = /^\s*url\((.+)\)/, o = String, s = e._.$;
          e.filter = {}, r.filter = function (t) {
            var i = this;
            "svg" != i.type && (i = i.paper);
            var r = e.parse(o(t)), a = e._.id(), c = (i.node.offsetWidth, i.node.offsetHeight, s("filter"));
            return s(c, {id: a, filterUnits: "userSpaceOnUse"}), c.appendChild(r.node), i.defs.appendChild(c), new n(c)
          }, t.on("snap.util.getattr.filter", function () {
            t.stop();
            var n = s(this.node, "filter");
            if (n) {
              var i = o(n).match(a);
              return i && e.select(i[1])
            }
          }), t.on("snap.util.attr.filter", function (i) {
            if (i instanceof n && "filter" == i.type) {
              t.stop();
              var r = i.node.id;
              r || (s(i.node, {id: i.id}), r = i.id), s(this.node, {filter: e.url(r)})
            }
            i && "none" != i || (t.stop(), this.node.removeAttribute("filter"))
          }), e.filter.blur = function (t, n) {
            null == t && (t = 2);
            var i = null == n ? t : [t, n];
            return e.format('<feGaussianBlur stdDeviation="{def}"/>', {def: i})
          }, e.filter.blur.toString = function () {
            return this()
          }, e.filter.shadow = function (t, n, i, r, a) {
            return "string" == typeof i && (r = i, a = r, i = 4), "string" != typeof r && (a = r, r = "#000"), r = r || "#000", null == i && (i = 4), null == a && (a = 1), null == t && (t = 0, n = 2), null == n && (n = t), r = e.color(r), e.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
              color: r,
              dx: t,
              dy: n,
              blur: i,
              opacity: a
            })
          }, e.filter.shadow.toString = function () {
            return this()
          }, e.filter.grayscale = function (t) {
            return null == t && (t = 1), e.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
              a: .2126 + .7874 * (1 - t),
              b: .7152 - .7152 * (1 - t),
              c: .0722 - .0722 * (1 - t),
              d: .2126 - .2126 * (1 - t),
              e: .7152 + .2848 * (1 - t),
              f: .0722 - .0722 * (1 - t),
              g: .2126 - .2126 * (1 - t),
              h: .0722 + .9278 * (1 - t)
            })
          }, e.filter.grayscale.toString = function () {
            return this()
          }, e.filter.sepia = function (t) {
            return null == t && (t = 1), e.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
              a: .393 + .607 * (1 - t),
              b: .769 - .769 * (1 - t),
              c: .189 - .189 * (1 - t),
              d: .349 - .349 * (1 - t),
              e: .686 + .314 * (1 - t),
              f: .168 - .168 * (1 - t),
              g: .272 - .272 * (1 - t),
              h: .534 - .534 * (1 - t),
              i: .131 + .869 * (1 - t)
            })
          }, e.filter.sepia.toString = function () {
            return this()
          }, e.filter.saturate = function (t) {
            return null == t && (t = 1), e.format('<feColorMatrix type="saturate" values="{amount}"/>', {amount: 1 - t})
          }, e.filter.saturate.toString = function () {
            return this()
          }, e.filter.hueRotate = function (t) {
            return t = t || 0, e.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {angle: t})
          }, e.filter.hueRotate.toString = function () {
            return this()
          }, e.filter.invert = function (t) {
            return null == t && (t = 1), e.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
              amount: t,
              amount2: 1 - t
            })
          }, e.filter.invert.toString = function () {
            return this()
          }, e.filter.brightness = function (t) {
            return null == t && (t = 1), e.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {amount: t})
          }, e.filter.brightness.toString = function () {
            return this()
          }, e.filter.contrast = function (t) {
            return null == t && (t = 1), e.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
              amount: t,
              amount2: .5 - t / 2
            })
          }, e.filter.contrast.toString = function () {
            return this()
          }
        }), i
      })
    }, {69: 69}],
    71: [function (e, t) {
      var n = t.exports = e(70);
      n.plugin(function (e, t) {
        t.prototype.children = function () {
          for (var t = [], n = this.node.childNodes, i = 0, r = n.length; r > i; i++)t[i] = new e(n[i]);
          return t
        }
      }), n.plugin(function (e, t) {
        function n(e) {
          return e.split(/\s+/)
        }

        function i(e) {
          return e.join(" ")
        }

        function r(e) {
          return n(e.attr("class") || "")
        }

        function a(e, t) {
          e.attr("class", i(t))
        }

        t.prototype.addClass = function (e) {
          var t, i, o = r(this), s = n(e);
          for (t = 0, i; i = s[t]; t++)-1 === o.indexOf(i) && o.push(i);
          return a(this, o), this
        }, t.prototype.hasClass = function (e) {
          if (!e)throw new Error("[snapsvg] syntax: hasClass(clsStr)");
          return -1 !== r(this).indexOf(e)
        }, t.prototype.removeClass = function (e) {
          var t, i, o, s = r(this), c = n(e);
          for (t = 0, i; i = c[t]; t++)o = s.indexOf(i), -1 !== o && s.splice(o, 1);
          return a(this, s), this
        }
      }), n.plugin(function (e, t) {
        t.prototype.translate = function (t, n) {
          var i = new e.Matrix;
          return i.translate(t, n), this.transform(i)
        }
      }), n.plugin(function (e) {
        e.create = function (t, n) {
          return e._.wrap(e._.$(t, n))
        }
      }), n.plugin(function (e) {
        e.createSnapAt = function (t, n, i) {
          var r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          return r.setAttribute("width", t), r.setAttribute("height", n), i || (i = document.body), i.appendChild(r), new e(r)
        }
      })
    }, {70: 70}],
    72: [function (e, t, n) {
      var i = function (e) {
        return "[object Array]" === Object.prototype.toString.call(e)
      }, r = function () {
        var e = Array.prototype.slice.call(arguments);
        1 === e.length && i(e[0]) && (e = e[0]);
        var t = e.pop();
        return t.$inject = e, t
      }, a = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, o = /\/\*([^\*]*)\*\//m, s = function (e) {
        if ("function" != typeof e)throw new Error('Cannot annotate "' + e + '". Expected a function!');
        var t = e.toString().match(a);
        return t[1] && t[1].split(",").map(function (e) {
            return t = e.match(o), t ? t[1].trim() : e.trim()
          }) || []
      };
      n.annotate = r, n.parse = s, n.isArray = i
    }, {}],
    73: [function (e, t) {
      t.exports = {annotate: e(72).annotate, Module: e(75), Injector: e(74)}
    }, {72: 72, 74: 74, 75: 75}],
    74: [function (e, t) {
      var n = e(75), i = e(72).parse, r = e(72).annotate, a = e(72).isArray, o = function (e, t) {
        t = t || {
            get: function (e) {
              throw s.push(e), p('No provider for "' + e + '"!')
            }
          };
        var s = [], c = this._providers = Object.create(t._providers || null), l = this._instances = Object.create(null), u = l.injector = this, p = function (e) {
          var t = s.join(" -> ");
          return s.length = 0, new Error(t ? e + " (Resolving: " + t + ")" : e)
        }, d = function (e) {
          if (!c[e] && -1 !== e.indexOf(".")) {
            for (var n = e.split("."), i = d(n.shift()); n.length;)i = i[n.shift()];
            return i
          }
          if (Object.hasOwnProperty.call(l, e))return l[e];
          if (Object.hasOwnProperty.call(c, e)) {
            if (-1 !== s.indexOf(e))throw s.push(e), p("Cannot resolve circular dependency!");
            return s.push(e), l[e] = c[e][0](c[e][1]), s.pop(), l[e]
          }
          return t.get(e)
        }, f = function (e) {
          var t = Object.create(e.prototype), n = h(e, t);
          return "object" == typeof n ? n : t
        }, h = function (e, t) {
          if ("function" != typeof e) {
            if (!a(e))throw new Error('Cannot invoke "' + e + '". Expected a function!');
            e = r(e.slice())
          }
          var n = e.$inject && e.$inject || i(e), o = n.map(function (e) {
            return d(e)
          });
          return e.apply(t, o)
        }, m = function (e) {
          return r(function (t) {
            return e.get(t)
          })
        }, g = function (e, t) {
          if (t && t.length) {
            var n, i, r, a, s = Object.create(null), l = Object.create(null), p = [], d = [], f = [];
            for (var h in c)n = c[h], -1 !== t.indexOf(h) && ("private" === n[2] ? (i = p.indexOf(n[3]), -1 === i ? (r = n[3].createChild([], t), a = m(r), p.push(n[3]), d.push(r), f.push(a), s[h] = [a, h, "private", r]) : s[h] = [f[i], h, "private", d[i]]) : s[h] = [n[2], n[1]], l[h] = !0), "factory" !== n[2] && "type" !== n[2] || !n[1].$scope || t.forEach(function (e) {
              -1 !== n[1].$scope.indexOf(e) && (s[h] = [n[2], n[1]], l[e] = !0)
            });
            t.forEach(function (e) {
              if (!l[e])throw new Error('No provider for "' + e + '". Cannot use provider from the parent!')
            }), e.unshift(s)
          }
          return new o(e, u)
        }, v = {
          factory: h, type: f, value: function (e) {
            return e
          }
        };
        e.forEach(function (e) {
          function t(e, t) {
            return "value" !== e && a(t) && (t = r(t.slice())), t
          }

          if (e instanceof n)e.forEach(function (e) {
            var n = e[0], i = e[1], r = e[2];
            c[n] = [v[i], t(i, r), i]
          }); else if ("object" == typeof e)if (e.__exports__) {
            var i = Object.keys(e).reduce(function (t, n) {
              return "__" !== n.substring(0, 2) && (t[n] = e[n]), t
            }, Object.create(null)), s = new o((e.__modules__ || []).concat([i]), u), l = r(function (e) {
              return s.get(e)
            });
            e.__exports__.forEach(function (e) {
              c[e] = [l, e, "private", s]
            })
          } else Object.keys(e).forEach(function (n) {
            if ("private" === e[n][2])return void(c[n] = e[n]);
            var i = e[n][0], r = e[n][1];
            c[n] = [v[i], t(i, r), i]
          })
        }), this.get = d, this.invoke = h, this.instantiate = f, this.createChild = g
      };
      t.exports = o
    }, {72: 72, 75: 75}],
    75: [function (e, t) {
      var n = function () {
        var e = [];
        this.factory = function (t, n) {
          return e.push([t, "factory", n]), this
        }, this.value = function (t, n) {
          return e.push([t, "value", n]), this
        }, this.type = function (t, n) {
          return e.push([t, "type", n]), this
        }, this.forEach = function (t) {
          e.forEach(t)
        }
      };
      t.exports = n
    }, {}],
    76: [function (e, t) {
      function n(e, t, n) {
        var r = -1, a = e ? e.length : 0;
        for (t = i(t, n, 3); ++r < a;)if (t(e[r], r, e))return r;
        return -1
      }

      var i = e(98);
      t.exports = n
    }, {98: 98}],
    77: [function (e, t) {
      function n(e, t, n) {
        var s = o(e) ? i : a;
        return ("function" != typeof t || "undefined" != typeof n) && (t = r(t, n, 3)), s(e, t)
      }

      var i = e(92), r = e(98), a = e(103), o = e(150);
      t.exports = n
    }, {103: 103, 150: 150, 92: 92, 98: 98}],
    78: [function (e, t) {
      function n(e, t, n) {
        var s = o(e) ? i : a;
        return t = r(t, n, 3), s(e, t)
      }

      var i = e(93), r = e(98), a = e(104), o = e(150);
      t.exports = n
    }, {104: 104, 150: 150, 93: 93, 98: 98}],
    79: [function (e, t) {
      function n(e, t, n) {
        if (s(e)) {
          var c = o(e, t, n);
          return c > -1 ? e[c] : void 0
        }
        return t = i(t, n, 3), a(e, t, r)
      }

      var i = e(98), r = e(102), a = e(105), o = e(76), s = e(150);
      t.exports = n
    }, {102: 102, 105: 105, 150: 150, 76: 76, 98: 98}],
    80: [function (e, t) {
      function n(e, t, n) {
        return "function" == typeof t && "undefined" == typeof n && o(e) ? i(e, t) : r(e, a(t, n, 3))
      }

      var i = e(91), r = e(102), a = e(127), o = e(150);
      t.exports = n
    }, {102: 102, 127: 127, 150: 150, 91: 91}],
    81: [function (e, t) {
      var n = e(130), i = Object.prototype, r = i.hasOwnProperty, a = n(function (e, t, n) {
        r.call(e, n) ? e[n].push(t) : e[n] = [t]
      });
      t.exports = a
    }, {130: 130}],
    82: [function (e, t) {
      function n(e, t, n) {
        var l = e ? e.length : 0;
        return a(l) || (e = s(e), l = e.length), l ? (n = "number" == typeof n ? 0 > n ? c(l + n, 0) : n || 0 : 0, "string" == typeof e || !r(e) && o(e) ? l > n && e.indexOf(t, n) > -1 : i(e, t, n) > -1) : !1
      }

      var i = e(110), r = e(150), a = e(140), o = e(156), s = e(165), c = Math.max;
      t.exports = n
    }, {110: 110, 140: 140, 150: 150, 156: 156, 165: 165}],
    83: [function (e, t) {
      function n(e, t, n) {
        var s = o(e) ? i : a;
        return t = r(t, n, 3), s(e, t)
      }

      var i = e(94), r = e(98), a = e(115), o = e(150);
      t.exports = n
    }, {115: 115, 150: 150, 94: 94, 98: 98}],
    84: [function (e, t) {
      function n(e, t, n, c) {
        var l = s(e) ? i : o;
        return l(e, r(t, c, 4), n, arguments.length < 3, a)
      }

      var i = e(95), r = e(98), a = e(102), o = e(121), s = e(150);
      t.exports = n
    }, {102: 102, 121: 121, 150: 150, 95: 95, 98: 98}],
    85: [function (e, t) {
      function n(e, t, n) {
        var s = o(e) ? i : a;
        return ("function" != typeof t || "undefined" != typeof n) && (t = r(t, n, 3)), s(e, t)
      }

      var i = e(96), r = e(98), a = e(124), o = e(150);
      t.exports = n
    }, {124: 124, 150: 150, 96: 96, 98: 98}],
    86: [function (e, t) {
      var n = e(152), i = n(i = Date.now) && i, r = i || function () {
          return (new Date).getTime()
        };
      t.exports = r
    }, {152: 152}],
    87: [function (e, t) {
      function n(e, t, n) {
        function s() {
          g && clearTimeout(g), d && clearTimeout(d), d = g = v = void 0
        }

        function c() {
          var n = t - (r() - h);
          if (0 >= n || n > t) {
            d && clearTimeout(d);
            var i = v;
            d = g = v = void 0, i && (y = r(), f = e.apply(m, p), g || d || (p = m = null))
          } else g = setTimeout(c, n)
        }

        function l() {
          g && clearTimeout(g), d = g = v = void 0, (w || b !== t) && (y = r(), f = e.apply(m, p), g || d || (p = m = null))
        }

        function u() {
          if (p = arguments, h = r(), m = this, v = w && (g || !x), b === !1)var n = x && !g; else {
            d || x || (y = h);
            var i = b - (h - y), a = 0 >= i || i > b;
            a ? (d && (d = clearTimeout(d)), y = h, f = e.apply(m, p)) : d || (d = setTimeout(l, i))
          }
          return a && g ? g = clearTimeout(g) : g || t === b || (g = setTimeout(c, t)), n && (a = !0, f = e.apply(m, p)), !a || g || d || (p = m = null), f
        }

        var p, d, f, h, m, g, v, y = 0, b = !1, w = !0;
        if ("function" != typeof e)throw new TypeError(a);
        if (t = 0 > t ? 0 : +t || 0, n === !0) {
          var x = !0;
          w = !1
        } else i(n) && (x = n.leading, b = "maxWait"in n && o(+n.maxWait || 0, t), w = "trailing"in n ? n.trailing : w);
        return u.cancel = s, u
      }

      var i = e(154), r = e(86), a = "Expected a function", o = Math.max;
      t.exports = n
    }, {154: 154, 86: 86}],
    88: [function (e, t) {
      function n(e) {
        return i(e, 1, arguments, 1)
      }

      var i = e(100);
      t.exports = n
    }, {100: 100}],
    89: [function (e, t) {
      (function (n) {
        function i(e) {
          var t = e ? e.length : 0;
          for (this.data = {hash: s(null), set: new o}; t--;)this.push(e[t])
        }

        var r = e(129), a = e(152), o = a(o = n.Set) && o, s = a(s = Object.create) && s;
        i.prototype.push = r, t.exports = i
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {129: 129, 152: 152}],
    90: [function (e, t) {
      function n(e, t) {
        var n = -1, i = e.length;
        for (t || (t = Array(i)); ++n < i;)t[n] = e[n];
        return t
      }

      t.exports = n
    }, {}],
    91: [function (e, t) {
      function n(e, t) {
        for (var n = -1, i = e.length; ++n < i && t(e[n], n, e) !== !1;);
        return e
      }

      t.exports = n
    }, {}],
    92: [function (e, t) {
      function n(e, t) {
        for (var n = -1, i = e.length; ++n < i;)if (!t(e[n], n, e))return !1;
        return !0
      }

      t.exports = n
    }, {}],
    93: [function (e, t) {
      function n(e, t) {
        for (var n = -1, i = e.length, r = -1, a = []; ++n < i;) {
          var o = e[n];
          t(o, n, e) && (a[++r] = o)
        }
        return a
      }

      t.exports = n
    }, {}],
    94: [function (e, t) {
      function n(e, t) {
        for (var n = -1, i = e.length, r = Array(i); ++n < i;)r[n] = t(e[n], n, e);
        return r
      }

      t.exports = n
    }, {}],
    95: [function (e, t) {
      function n(e, t, n, i) {
        var r = -1, a = e.length;
        for (i && a && (n = e[++r]); ++r < a;)n = t(n, e[r], r, e);
        return n
      }

      t.exports = n
    }, {}],
    96: [function (e, t) {
      function n(e, t) {
        for (var n = -1, i = e.length; ++n < i;)if (t(e[n], n, e))return !0;
        return !1
      }

      t.exports = n
    }, {}],
    97: [function (e, t) {
      function n(e, t, n) {
        var a = r(t);
        if (!n)return i(t, e, a);
        for (var o = -1, s = a.length; ++o < s;) {
          var c = a[o], l = e[c], u = n(l, t[c], c, e, t);
          (u === u ? u === l : l !== l) && ("undefined" != typeof l || c in e) || (e[c] = u)
        }
        return e
      }

      var i = e(99), r = e(160);
      t.exports = n
    }, {160: 160, 99: 99}],
    98: [function (e, t) {
      function n(e, t, n) {
        var l = typeof e;
        return "function" == l ? "undefined" != typeof t && c(e) ? o(e, t, n) : e : null == e ? s : "object" == l ? i(e) : "undefined" == typeof t ? a(e + "") : r(e + "", t)
      }

      var i = e(116), r = e(117), a = e(120), o = e(127), s = e(169), c = e(137);
      t.exports = n
    }, {116: 116, 117: 117, 120: 120, 127: 127, 137: 137, 169: 169}],
    99: [function (e, t) {
      function n(e, t, n) {
        n || (n = t, t = {});
        for (var i = -1, r = n.length; ++i < r;) {
          var a = n[i];
          t[a] = e[a]
        }
        return t
      }

      t.exports = n
    }, {}],
    100: [function (e, t) {
      function n(e, t, n, a) {
        if ("function" != typeof e)throw new TypeError(r);
        return setTimeout(function () {
          e.apply(void 0, i(n, a))
        }, t)
      }

      var i = e(123), r = "Expected a function";
      t.exports = n
    }, {123: 123}],
    101: [function (e, t) {
      function n(e, t) {
        var n = e ? e.length : 0, o = [];
        if (!n)return o;
        var s = -1, c = i, l = !0, u = l && t.length >= 200 ? a(t) : null, p = t.length;
        u && (c = r, l = !1, t = u);
        e:for (; ++s < n;) {
          var d = e[s];
          if (l && d === d) {
            for (var f = p; f--;)if (t[f] === d)continue e;
            o.push(d)
          } else c(t, d, 0) < 0 && o.push(d)
        }
        return o
      }

      var i = e(110), r = e(128), a = e(132);
      t.exports = n
    }, {110: 110, 128: 128, 132: 132}],
    102: [function (e, t) {
      function n(e, t) {
        var n = e ? e.length : 0;
        if (!r(n))return i(e, t);
        for (var o = -1, s = a(e); ++o < n && t(s[o], o, s) !== !1;);
        return e
      }

      var i = e(109), r = e(140), a = e(148);
      t.exports = n
    }, {109: 109, 140: 140, 148: 148}],
    103: [function (e, t) {
      function n(e, t) {
        var n = !0;
        return i(e, function (e, i, r) {
          return n = !!t(e, i, r)
        }), n
      }

      var i = e(102);
      t.exports = n
    }, {102: 102}],
    104: [function (e, t) {
      function n(e, t) {
        var n = [];
        return i(e, function (e, i, r) {
          t(e, i, r) && n.push(e)
        }), n
      }

      var i = e(102);
      t.exports = n
    }, {102: 102}],
    105: [function (e, t) {
      function n(e, t, n, i) {
        var r;
        return n(e, function (e, n, a) {
          return t(e, n, a) ? (r = i ? n : e, !1) : void 0
        }), r
      }

      t.exports = n
    }, {}],
    106: [function (e, t) {
      function n(e, t, s, c) {
        for (var l = c - 1, u = e.length, p = -1, d = []; ++l < u;) {
          var f = e[l];
          if (o(f) && a(f.length) && (r(f) || i(f))) {
            t && (f = n(f, t, s, 0));
            var h = -1, m = f.length;
            for (d.length += m; ++h < m;)d[++p] = f[h]
          } else s || (d[++p] = f)
        }
        return d
      }

      var i = e(149), r = e(150), a = e(140), o = e(141);
      t.exports = n
    }, {140: 140, 141: 141, 149: 149, 150: 150}],
    107: [function (e, t) {
      function n(e, t, n) {
        for (var r = -1, a = i(e), o = n(e), s = o.length; ++r < s;) {
          var c = o[r];
          if (t(a[c], c, a) === !1)break
        }
        return e
      }

      var i = e(148);
      t.exports = n
    }, {148: 148}],
    108: [function (e, t) {
      function n(e, t) {
        return i(e, t, r)
      }

      var i = e(107), r = e(161);
      t.exports = n
    }, {107: 107, 161: 161}],
    109: [function (e, t) {
      function n(e, t) {
        return i(e, t, r)
      }

      var i = e(107), r = e(160);
      t.exports = n
    }, {107: 107, 160: 160}],
    110: [function (e, t) {
      function n(e, t, n) {
        if (t !== t)return i(e, n);
        for (var r = n - 1, a = e.length; ++r < a;)if (e[r] === t)return r;
        return -1
      }

      var i = e(136);
      t.exports = n
    }, {136: 136}],
    111: [function (e, t) {
      function n(e, t, r, a, o, s) {
        if (e === t)return 0 !== e || 1 / e == 1 / t;
        var c = typeof e, l = typeof t;
        return "function" != c && "object" != c && "function" != l && "object" != l || null == e || null == t ? e !== e && t !== t : i(e, t, n, r, a, o, s)
      }

      var i = e(112);
      t.exports = n
    }, {112: 112}],
    112: [function (e, t) {
      function n(e, t, n, p, h, m, g) {
        var v = o(e), y = o(t), b = l, w = l;
        v || (b = f.call(e), b == c ? b = u : b != u && (v = s(e))), y || (w = f.call(t), w == c ? w = u : w != u && (y = s(t)));
        var x = b == u, E = w == u, _ = b == w;
        if (_ && !v && !x)return r(e, t, b);
        var T = x && d.call(e, "__wrapped__"), S = E && d.call(t, "__wrapped__");
        if (T || S)return n(T ? e.value() : e, S ? t.value() : t, p, h, m, g);
        if (!_)return !1;
        m || (m = []), g || (g = []);
        for (var A = m.length; A--;)if (m[A] == e)return g[A] == t;
        m.push(e), g.push(t);
        var C = (v ? i : a)(e, t, n, p, h, m, g);
        return m.pop(), g.pop(), C
      }

      var i = e(133), r = e(134), a = e(135), o = e(150), s = e(157), c = "[object Arguments]", l = "[object Array]", u = "[object Object]", p = Object.prototype, d = p.hasOwnProperty, f = p.toString;
      t.exports = n
    }, {133: 133, 134: 134, 135: 135, 150: 150, 157: 157}],
    113: [function (e, t) {
      function n(e) {
        return "function" == typeof e || !1
      }

      t.exports = n
    }, {}],
    114: [function (e, t) {
      function n(e, t, n, r, o) {
        var s = t.length;
        if (null == e)return !s;
        for (var c = -1, l = !o; ++c < s;)if (l && r[c] ? n[c] !== e[t[c]] : !a.call(e, t[c]))return !1;
        for (c = -1; ++c < s;) {
          var u = t[c];
          if (l && r[c])var p = a.call(e, u); else {
            var d = e[u], f = n[c];
            p = o ? o(d, f, u) : void 0, "undefined" == typeof p && (p = i(f, d, o, !0))
          }
          if (!p)return !1
        }
        return !0
      }

      var i = e(111), r = Object.prototype, a = r.hasOwnProperty;
      t.exports = n
    }, {111: 111}],
    115: [function (e, t) {
      function n(e, t) {
        var n = [];
        return i(e, function (e, i, r) {
          n.push(t(e, i, r))
        }), n
      }

      var i = e(102);
      t.exports = n
    }, {102: 102}],
    116: [function (e, t) {
      function n(e) {
        var t = a(e), n = t.length;
        if (1 == n) {
          var o = t[0], c = e[o];
          if (r(c))return function (e) {
            return null != e && e[o] === c && s.call(e, o)
          }
        }
        for (var l = Array(n), u = Array(n); n--;)c = e[t[n]], l[n] = c, u[n] = r(c);
        return function (e) {
          return i(e, t, l, u)
        }
      }

      var i = e(114), r = e(142), a = e(160), o = Object.prototype, s = o.hasOwnProperty;
      t.exports = n
    }, {114: 114, 142: 142, 160: 160}],
    117: [function (e, t) {
      function n(e, t) {
        return r(t) ? function (n) {
          return null != n && n[e] === t
        } : function (n) {
          return null != n && i(t, n[e], null, !0)
        }
      }

      var i = e(111), r = e(142);
      t.exports = n
    }, {111: 111, 142: 142}],
    118: [function (e, t) {
      function n(e, t, p, d, f) {
        if (!c(e))return e;
        var h = s(t.length) && (o(t) || u(t));
        return (h ? i : r)(t, function (t, i, r) {
          if (l(t))return d || (d = []), f || (f = []), a(e, r, i, n, p, d, f);
          var o = e[i], s = p ? p(o, t, i, e, r) : void 0, c = "undefined" == typeof s;
          c && (s = t), !h && "undefined" == typeof s || !c && (s === s ? s === o : o !== o) || (e[i] = s)
        }), e
      }

      var i = e(91), r = e(109), a = e(119), o = e(150), s = e(140), c = e(154), l = e(141), u = e(157);
      t.exports = n
    }, {109: 109, 119: 119, 140: 140, 141: 141, 150: 150, 154: 154, 157: 157, 91: 91}],
    119: [function (e, t) {
      function n(e, t, n, u, p, d, f) {
        for (var h = d.length, m = t[n]; h--;)if (d[h] == m)return void(e[n] = f[h]);
        var g = e[n], v = p ? p(g, m, n, e, t) : void 0, y = "undefined" == typeof v;
        y && (v = m, o(m.length) && (a(m) || c(m)) ? v = a(g) ? g : g ? i(g) : [] : s(m) || r(m) ? v = r(g) ? l(g) : s(g) ? g : {} : y = !1), d.push(m), f.push(v), y ? e[n] = u(v, m, p, d, f) : (v === v ? v !== g : g === g) && (e[n] = v)
      }

      var i = e(90), r = e(149), a = e(150), o = e(140), s = e(155), c = e(157), l = e(158);
      t.exports = n
    }, {140: 140, 149: 149, 150: 150, 155: 155, 157: 157, 158: 158, 90: 90}],
    120: [function (e, t) {
      function n(e) {
        return function (t) {
          return null == t ? void 0 : t[e]
        }
      }

      t.exports = n
    }, {}],
    121: [function (e, t) {
      function n(e, t, n, i, r) {
        return r(e, function (e, r, a) {
          n = i ? (i = !1, e) : t(n, e, r, a)
        }), n
      }

      t.exports = n
    }, {}],
    122: [function (e, t) {
      var n = e(169), i = e(143), r = i ? function (e, t) {
        return i.set(e, t), e
      } : n;
      t.exports = r
    }, {143: 143, 169: 169}],
    123: [function (e, t) {
      function n(e, t, n) {
        var i = -1, r = e.length;
        t = null == t ? 0 : +t || 0, 0 > t && (t = -t > r ? 0 : r + t), n = "undefined" == typeof n || n > r ? r : +n || 0, 0 > n && (n += r), r = t > n ? 0 : n - t >>> 0, t >>>= 0;
        for (var a = Array(r); ++i < r;)a[i] = e[i + t];
        return a
      }

      t.exports = n
    }, {}],
    124: [function (e, t) {
      function n(e, t) {
        var n;
        return i(e, function (e, i, r) {
          return n = t(e, i, r), !n
        }), !!n
      }

      var i = e(102);
      t.exports = n
    }, {102: 102}],
    125: [function (e, t) {
      function n(e) {
        return "string" == typeof e ? e : null == e ? "" : e + ""
      }

      t.exports = n
    }, {}],
    126: [function (e, t) {
      function n(e, t) {
        for (var n = -1, i = t.length, r = Array(i); ++n < i;)r[n] = e[t[n]];
        return r
      }

      t.exports = n
    }, {}],
    127: [function (e, t) {
      function n(e, t, n) {
        if ("function" != typeof e)return i;
        if ("undefined" == typeof t)return e;
        switch (n) {
          case 1:
            return function (n) {
              return e.call(t, n)
            };
          case 3:
            return function (n, i, r) {
              return e.call(t, n, i, r)
            };
          case 4:
            return function (n, i, r, a) {
              return e.call(t, n, i, r, a)
            };
          case 5:
            return function (n, i, r, a, o) {
              return e.call(t, n, i, r, a, o)
            }
        }
        return function () {
          return e.apply(t, arguments)
        }
      }

      var i = e(169);
      t.exports = n
    }, {169: 169}],
    128: [function (e, t) {
      function n(e, t) {
        var n = e.data, r = "string" == typeof t || i(t) ? n.set.has(t) : n.hash[t];
        return r ? 0 : -1
      }

      var i = e(154);
      t.exports = n
    }, {154: 154}],
    129: [function (e, t) {
      function n(e) {
        var t = this.data;
        "string" == typeof e || i(e) ? t.set.add(e) : t.hash[e] = !0
      }

      var i = e(154);
      t.exports = n
    }, {154: 154}],
    130: [function (e, t) {
      function n(e, t) {
        return function (n, o, s) {
          var c = t ? t() : {};
          if (o = i(o, s, 3), a(n))for (var l = -1, u = n.length; ++l < u;) {
            var p = n[l];
            e(c, p, o(p, l, n), n)
          } else r(n, function (t, n, i) {
            e(c, t, o(t, n, i), i)
          });
          return c
        }
      }

      var i = e(98), r = e(102), a = e(150);
      t.exports = n
    }, {102: 102, 150: 150, 98: 98}],
    131: [function (e, t) {
      function n(e) {
        return function () {
          var t = arguments, n = t.length, a = t[0];
          if (2 > n || null == a)return a;
          var o = t[n - 2], s = t[n - 1], c = t[3];
          n > 3 && "function" == typeof o ? (o = i(o, s, 5), n -= 2) : (o = n > 2 && "function" == typeof s ? s : null, n -= o ? 1 : 0), c && r(t[1], t[2], c) && (o = 3 == n ? null : o, n = 2);
          for (var l = 0; ++l < n;) {
            var u = t[l];
            u && e(a, u, o)
          }
          return a
        }
      }

      var i = e(127), r = e(139);
      t.exports = n
    }, {127: 127, 139: 139}],
    132: [function (e, t) {
      (function (n) {
        var i = e(89), r = e(168), a = e(152), o = a(o = n.Set) && o, s = a(s = Object.create) && s, c = s && o ? function (e) {
          return new i(e)
        } : r(null);
        t.exports = c
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {152: 152, 168: 168, 89: 89}],
    133: [function (e, t) {
      function n(e, t, n, i, r, a, o) {
        var s = -1, c = e.length, l = t.length, u = !0;
        if (c != l && !(r && l > c))return !1;
        for (; u && ++s < c;) {
          var p = e[s], d = t[s];
          if (u = void 0, i && (u = r ? i(d, p, s) : i(p, d, s)), "undefined" == typeof u)if (r)for (var f = l; f-- && (d = t[f], !(u = p && p === d || n(p, d, i, r, a, o)));); else u = p && p === d || n(p, d, i, r, a, o)
        }
        return !!u
      }

      t.exports = n
    }, {}],
    134: [function (e, t) {
      function n(e, t, n) {
        switch (n) {
          case i:
          case r:
            return +e == +t;
          case a:
            return e.name == t.name && e.message == t.message;
          case o:
            return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
          case s:
          case c:
            return e == t + ""
        }
        return !1
      }

      var i = "[object Boolean]", r = "[object Date]", a = "[object Error]", o = "[object Number]", s = "[object RegExp]", c = "[object String]";
      t.exports = n
    }, {}],
    135: [function (e, t) {
      function n(e, t, n, r, o, s, c) {
        var l = i(e), u = l.length, p = i(t), d = p.length;
        if (u != d && !o)return !1;
        for (var f, h = -1; ++h < u;) {
          var m = l[h], g = a.call(t, m);
          if (g) {
            var v = e[m], y = t[m];
            g = void 0, r && (g = o ? r(y, v, m) : r(v, y, m)), "undefined" == typeof g && (g = v && v === y || n(v, y, r, o, s, c))
          }
          if (!g)return !1;
          f || (f = "constructor" == m)
        }
        if (!f) {
          var b = e.constructor, w = t.constructor;
          if (b != w && "constructor"in e && "constructor"in t && !("function" == typeof b && b instanceof b && "function" == typeof w && w instanceof w))return !1
        }
        return !0
      }

      var i = e(160), r = Object.prototype, a = r.hasOwnProperty;
      t.exports = n
    }, {160: 160}],
    136: [function (e, t) {
      function n(e, t, n) {
        for (var i = e.length, r = t + (n ? 0 : -1); n ? r-- : ++r < i;) {
          var a = e[r];
          if (a !== a)return r
        }
        return -1
      }

      t.exports = n
    }, {}],
    137: [function (e, t) {
      function n(e) {
        var t = !(a.funcNames ? e.name : a.funcDecomp);
        if (!t) {
          var n = c.call(e);
          a.funcNames || (t = !o.test(n)), t || (t = s.test(n) || r(e), i(e, t))
        }
        return t
      }

      var i = e(122), r = e(152), a = e(167), o = /^\s*function[ \n\r\t]+\w/, s = /\bthis\b/, c = Function.prototype.toString;
      t.exports = n
    }, {122: 122, 152: 152, 167: 167}],
    138: [function (e, t) {
      function n(e, t) {
        return e = +e, t = null == t ? i : t, e > -1 && e % 1 == 0 && t > e
      }

      var i = Math.pow(2, 53) - 1;
      t.exports = n
    }, {}],
    139: [function (e, t) {
      function n(e, t, n) {
        if (!a(n))return !1;
        var o = typeof t;
        if ("number" == o)var s = n.length, c = r(s) && i(t, s); else c = "string" == o && t in n;
        if (c) {
          var l = n[t];
          return e === e ? e === l : l !== l
        }
        return !1
      }

      var i = e(138), r = e(140), a = e(154);
      t.exports = n
    }, {138: 138, 140: 140, 154: 154}],
    140: [function (e, t) {
      function n(e) {
        return "number" == typeof e && e > -1 && e % 1 == 0 && i >= e
      }

      var i = Math.pow(2, 53) - 1;
      t.exports = n
    }, {}],
    141: [function (e, t) {
      function n(e) {
        return e && "object" == typeof e || !1
      }

      t.exports = n
    }, {}],
    142: [function (e, t) {
      function n(e) {
        return e === e && (0 === e ? 1 / e > 0 : !i(e))
      }

      var i = e(154);
      t.exports = n
    }, {154: 154}],
    143: [function (e, t) {
      (function (n) {
        var i = e(152), r = i(r = n.WeakMap) && r, a = r && new r;
        t.exports = a
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {152: 152}],
    144: [function (e, t) {
      function n(e, t) {
        e = i(e);
        for (var n = -1, r = t.length, a = {}; ++n < r;) {
          var o = t[n];
          o in e && (a[o] = e[o])
        }
        return a
      }

      var i = e(148);
      t.exports = n
    }, {148: 148}],
    145: [function (e, t) {
      function n(e, t) {
        var n = {};
        return i(e, function (e, i, r) {
          t(e, i, r) && (n[i] = e)
        }), n
      }

      var i = e(108);
      t.exports = n
    }, {108: 108}],
    146: [function (e, t) {
      function n(e) {
        var t;
        if (!r(e) || c.call(e) != a || !s.call(e, "constructor") && (t = e.constructor, "function" == typeof t && !(t instanceof t)))return !1;
        var n;
        return i(e, function (e, t) {
          n = t
        }), "undefined" == typeof n || s.call(e, n)
      }

      var i = e(108), r = e(141), a = "[object Object]", o = Object.prototype, s = o.hasOwnProperty, c = o.toString;
      t.exports = n
    }, {108: 108, 141: 141}],
    147: [function (e, t) {
      function n(e) {
        for (var t = s(e), n = t.length, l = n && e.length, p = l && o(l) && (r(e) || c.nonEnumArgs && i(e)), d = -1, f = []; ++d < n;) {
          var h = t[d];
          (p && a(h, l) || u.call(e, h)) && f.push(h)
        }
        return f
      }

      var i = e(149), r = e(150), a = e(138), o = e(140), s = e(161), c = e(167), l = Object.prototype, u = l.hasOwnProperty;
      t.exports = n
    }, {138: 138, 140: 140, 149: 149, 150: 150, 161: 161, 167: 167}],
    148: [function (e, t) {
      function n(e) {
        return i(e) ? e : Object(e)
      }

      var i = e(154);
      t.exports = n
    }, {154: 154}],
    149: [function (e, t) {
      function n(e) {
        var t = r(e) ? e.length : void 0;
        return i(t) && s.call(e) == a || !1
      }

      var i = e(140), r = e(141), a = "[object Arguments]", o = Object.prototype, s = o.toString;
      t.exports = n
    }, {140: 140, 141: 141}],
    150: [function (e, t) {
      var n = e(140), i = e(152), r = e(141), a = "[object Array]", o = Object.prototype, s = o.toString, c = i(c = Array.isArray) && c, l = c || function (e) {
          return r(e) && n(e.length) && s.call(e) == a || !1
        };
      t.exports = l
    }, {140: 140, 141: 141, 152: 152}],
    151: [function (e, t) {
      (function (n) {
        var i = e(113), r = e(152), a = "[object Function]", o = Object.prototype, s = o.toString, c = r(c = n.Uint8Array) && c, l = i(/x/) || c && !i(c) ? function (e) {
          return s.call(e) == a
        } : i;
        t.exports = l
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {113: 113, 152: 152}],
    152: [function (e, t) {
      function n(e) {
        return null == e ? !1 : l.call(e) == a ? u.test(c.call(e)) : r(e) && o.test(e) || !1
      }

      var i = e(166), r = e(141), a = "[object Function]", o = /^\[object .+?Constructor\]$/, s = Object.prototype, c = Function.prototype.toString, l = s.toString, u = RegExp("^" + i(l).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      t.exports = n
    }, {141: 141, 166: 166}],
    153: [function (e, t) {
      function n(e) {
        return "number" == typeof e || i(e) && o.call(e) == r || !1
      }

      var i = e(141), r = "[object Number]", a = Object.prototype, o = a.toString;
      t.exports = n
    }, {141: 141}],
    154: [function (e, t) {
      function n(e) {
        var t = typeof e;
        return "function" == t || e && "object" == t || !1
      }

      t.exports = n
    }, {}],
    155: [function (e, t) {
      var n = e(152), i = e(146), r = "[object Object]", a = Object.prototype, o = a.toString, s = n(s = Object.getPrototypeOf) && s, c = s ? function (e) {
        if (!e || o.call(e) != r)return !1;
        var t = e.valueOf, a = n(t) && (a = s(t)) && s(a);
        return a ? e == a || s(e) == a : i(e)
      } : i;
      t.exports = c
    }, {146: 146, 152: 152}],
    156: [function (e, t) {
      function n(e) {
        return "string" == typeof e || i(e) && o.call(e) == r || !1
      }

      var i = e(141), r = "[object String]", a = Object.prototype, o = a.toString;
      t.exports = n
    }, {141: 141}],
    157: [function (e, t) {
      function n(e) {
        return r(e) && i(e.length) && D[I.call(e)] || !1
      }

      var i = e(140), r = e(141), a = "[object Arguments]", o = "[object Array]", s = "[object Boolean]", c = "[object Date]", l = "[object Error]", u = "[object Function]", p = "[object Map]", d = "[object Number]", f = "[object Object]", h = "[object RegExp]", m = "[object Set]", g = "[object String]", v = "[object WeakMap]", y = "[object ArrayBuffer]", b = "[object Float32Array]", w = "[object Float64Array]", x = "[object Int8Array]", E = "[object Int16Array]", _ = "[object Int32Array]", T = "[object Uint8Array]", S = "[object Uint8ClampedArray]", A = "[object Uint16Array]", C = "[object Uint32Array]", D = {};
      D[b] = D[w] = D[x] = D[E] = D[_] = D[T] = D[S] = D[A] = D[C] = !0, D[a] = D[o] = D[y] = D[s] = D[c] = D[l] = D[u] = D[p] = D[d] = D[f] = D[h] = D[m] = D[g] = D[v] = !1;
      var k = Object.prototype, I = k.toString;
      t.exports = n
    }, {140: 140, 141: 141}],
    158: [function (e, t) {
      function n(e) {
        return i(e, r(e))
      }

      var i = e(99), r = e(161);
      t.exports = n
    }, {161: 161, 99: 99}],
    159: [function (e, t) {
      var n = e(97), i = e(131), r = i(n);
      t.exports = r
    }, {131: 131, 97: 97}],
    160: [function (e, t) {
      var n = e(140), i = e(152), r = e(154), a = e(147), o = i(o = Object.keys) && o, s = o ? function (e) {
        if (e)var t = e.constructor, i = e.length;
        return "function" == typeof t && t.prototype === e || "function" != typeof e && i && n(i) ? a(e) : r(e) ? o(e) : []
      } : a;
      t.exports = s
    }, {140: 140, 147: 147, 152: 152, 154: 154}],
    161: [function (e, t) {
      function n(e) {
        if (null == e)return [];
        s(e) || (e = Object(e));
        var t = e.length;
        t = t && o(t) && (r(e) || c.nonEnumArgs && i(e)) && t || 0;
        for (var n = e.constructor, l = -1, p = "function" == typeof n && n.prototype === e, d = Array(t), f = t > 0; ++l < t;)d[l] = l + "";
        for (var h in e)f && a(h, t) || "constructor" == h && (p || !u.call(e, h)) || d.push(h);
        return d
      }

      var i = e(149), r = e(150), a = e(138), o = e(140), s = e(154), c = e(167), l = Object.prototype, u = l.hasOwnProperty;
      t.exports = n
    }, {138: 138, 140: 140, 149: 149, 150: 150, 154: 154, 167: 167}],
    162: [function (e, t) {
      var n = e(118), i = e(131), r = i(n);
      t.exports = r
    }, {118: 118, 131: 131}],
    163: [function (e, t) {
      function n(e, t, n) {
        if (null == e)return {};
        if ("function" != typeof t) {
          var u = i(a(arguments, !1, !1, 1), String);
          return c(e, r(s(e), u))
        }
        return t = o(t, n, 3), l(e, function (e, n, i) {
          return !t(e, n, i)
        })
      }

      var i = e(94), r = e(101), a = e(106), o = e(127), s = e(161), c = e(144), l = e(145);
      t.exports = n
    }, {101: 101, 106: 106, 127: 127, 144: 144, 145: 145, 161: 161, 94: 94}],
    164: [function (e, t) {
      function n(e, t, n) {
        return null == e ? {} : "function" == typeof t ? o(e, r(t, n, 3)) : a(e, i(arguments, !1, !1, 1))
      }

      var i = e(106), r = e(127), a = e(144), o = e(145);
      t.exports = n
    }, {106: 106, 127: 127, 144: 144, 145: 145}],
    165: [function (e, t) {
      function n(e) {
        return i(e, r(e))
      }

      var i = e(126), r = e(160);
      t.exports = n
    }, {126: 126, 160: 160}],
    166: [function (e, t) {
      function n(e) {
        return e = i(e), e && a.test(e) ? e.replace(r, "\\$&") : e
      }

      var i = e(125), r = /[.*+?^${}()|[\]\/\\]/g, a = RegExp(r.source);
      t.exports = n
    }, {125: 125}],
    167: [function (e, t) {
      (function (n) {
        var i = e(152), r = /\bthis\b/, a = Object.prototype, o = (o = n.window) && o.document, s = a.propertyIsEnumerable, c = {};
        !function () {
          c.funcDecomp = !i(n.WinRTError) && r.test(function () {
              return this
            }), c.funcNames = "string" == typeof Function.name;
          try {
            c.dom = 11 === o.createDocumentFragment().nodeType
          } catch (e) {
            c.dom = !1
          }
          try {
            c.nonEnumArgs = !s.call(arguments, 1)
          } catch (e) {
            c.nonEnumArgs = !0
          }
        }(0, 0), t.exports = c
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {152: 152}],
    168: [function (e, t) {
      function n(e) {
        return function () {
          return e
        }
      }

      t.exports = n
    }, {}],
    169: [function (e, t) {
      function n(e) {
        return e
      }

      t.exports = n
    }, {}],
    170: [function (e, t) {
      t.exports = e(177)
    }, {177: 177}],
    171: [function (e, t) {
      t.exports = function (e) {
        for (var t; e.childNodes.length;)t = e.childNodes[0], e.removeChild(t);
        return e
      }
    }, {}],
    172: [function (e, t) {
      t.exports = e(180)
    }, {180: 180}],
    173: [function (e, t) {
      t.exports = e(184)
    }, {184: 184}],
    174: [function (e, t) {
      t.exports = e(181)
    }, {181: 181}],
    175: [function (e, t) {
      t.exports = e(183)
    }, {183: 183}],
    176: [function (e, t) {
      t.exports = function (e) {
        e.parentNode && e.parentNode.removeChild(e)
      }
    }, {}],
    177: [function (e, t) {
      function n(e) {
        if (!e || !e.nodeType)throw new Error("A DOM element reference is required");
        this.el = e, this.list = e.classList
      }

      var i = e(178), r = /\s+/, a = Object.prototype.toString;
      t.exports = function (e) {
        return new n(e)
      }, n.prototype.add = function (e) {
        if (this.list)return this.list.add(e), this;
        var t = this.array(), n = i(t, e);
        return ~n || t.push(e), this.el.className = t.join(" "), this
      }, n.prototype.remove = function (e) {
        if ("[object RegExp]" == a.call(e))return this.removeMatching(e);
        if (this.list)return this.list.remove(e), this;
        var t = this.array(), n = i(t, e);
        return ~n && t.splice(n, 1), this.el.className = t.join(" "), this
      }, n.prototype.removeMatching = function (e) {
        for (var t = this.array(), n = 0; n < t.length; n++)e.test(t[n]) && this.remove(t[n]);
        return this
      }, n.prototype.toggle = function (e, t) {
        return this.list ? ("undefined" != typeof t ? t !== this.list.toggle(e, t) && this.list.toggle(e) : this.list.toggle(e), this) : ("undefined" != typeof t ? t ? this.add(e) : this.remove(e) : this.has(e) ? this.remove(e) : this.add(e), this)
      }, n.prototype.array = function () {
        var e = this.el.getAttribute("class") || "", t = e.replace(/^\s+|\s+$/g, ""), n = t.split(r);
        return "" === n[0] && n.shift(), n
      }, n.prototype.has = n.prototype.contains = function (e) {
        return this.list ? this.list.contains(e) : !!~i(this.array(), e)
      }
    }, {178: 178}],
    178: [function (e, t) {
      t.exports = function (e, t) {
        if (e.indexOf)return e.indexOf(t);
        for (var n = 0; n < e.length; ++n)if (e[n] === t)return n;
        return -1
      }
    }, {}],
    179: [function (e, t) {
      var n = e(182);
      t.exports = function (e, t, i, r) {
        for (e = i ? {parentNode: e} : e, r = r || document; (e = e.parentNode) && e !== document;) {
          if (n(e, t))return e;
          if (e === r)return
        }
      }
    }, {182: 182}],
    180: [function (e, t, n) {
      var i = e(179), r = e(181);
      n.bind = function (e, t, n, a, o) {
        return r.bind(e, n, function (n) {
          var r = n.target || n.srcElement;
          n.delegateTarget = i(r, t, !0, e), n.delegateTarget && a.call(e, n)
        }, o)
      }, n.unbind = function (e, t, n, i) {
        r.unbind(e, t, n, i)
      }
    }, {179: 179, 181: 181}],
    181: [function (e, t, n) {
      var i = window.addEventListener ? "addEventListener" : "attachEvent", r = window.removeEventListener ? "removeEventListener" : "detachEvent", a = "addEventListener" !== i ? "on" : "";
      n.bind = function (e, t, n, r) {
        return e[i](a + t, n, r || !1), n
      }, n.unbind = function (e, t, n, i) {
        return e[r](a + t, n, i || !1), n
      }
    }, {}],
    182: [function (e, t) {
      function n(e, t) {
        if (!e || 1 !== e.nodeType)return !1;
        if (a)return a.call(e, t);
        for (var n = i.all(t, e.parentNode), r = 0; r < n.length; ++r)if (n[r] == e)return !0;
        return !1
      }

      var i = e(183), r = Element.prototype, a = r.matches || r.webkitMatchesSelector || r.mozMatchesSelector || r.msMatchesSelector || r.oMatchesSelector;
      t.exports = n
    }, {183: 183}],
    183: [function (e, t, n) {
      function i(e, t) {
        return t.querySelector(e)
      }

      n = t.exports = function (e, t) {
        return t = t || document, i(e, t)
      }, n.all = function (e, t) {
        return t = t || document, t.querySelectorAll(e)
      }, n.engine = function (e) {
        if (!e.one)throw new Error(".one callback required");
        if (!e.all)throw new Error(".all callback required");
        return i = e.one, n.all = e.all, n
      }
    }, {}],
    184: [function (e, t) {
      function n(e, t) {
        if ("string" != typeof e)throw new TypeError("String expected");
        t || (t = document);
        var n = /<([\w:]+)/.exec(e);
        if (!n)return t.createTextNode(e);
        e = e.replace(/^\s+|\s+$/g, "");
        var i = n[1];
        if ("body" == i) {
          var r = t.createElement("html");
          return r.innerHTML = e, r.removeChild(r.lastChild)
        }
        var o = a[i] || a._default, s = o[0], c = o[1], l = o[2], r = t.createElement("div");
        for (r.innerHTML = c + e + l; s--;)r = r.lastChild;
        if (r.firstChild == r.lastChild)return r.removeChild(r.firstChild);
        for (var u = t.createDocumentFragment(); r.firstChild;)u.appendChild(r.removeChild(r.firstChild));
        return u
      }

      t.exports = n;
      var i = document.createElement("div");
      i.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
      var r = !i.getElementsByTagName("link").length;
      i = void 0;
      var a = {
        legend: [1, "<fieldset>", "</fieldset>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        _default: r ? [1, "X<div>", "</div>"] : [0, "", ""]
      };
      a.td = a.th = [3, "<table><tbody><tr>", "</tr></tbody></table>"], a.option = a.optgroup = [1, '<select multiple="multiple">', "</select>"], a.thead = a.tbody = a.colgroup = a.caption = a.tfoot = [1, "<table>", "</table>"], a.polyline = a.ellipse = a.polygon = a.circle = a.text = a.line = a.path = a.rect = a.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', "</svg>"]
    }, {}],
    185: [function (e, t) {
      t.exports = e(187), t.exports.Collection = e(186)
    }, {186: 186, 187: 187}],
    186: [function (e, t) {
      function n(e, t, n, i) {
        var r = n.inverse;
        return e.remove = function (e) {
          var n = this.indexOf(e);
          return -1 !== n && (this.splice(n, 1), t.unset(e, r, i)), e
        }, e.contains = function (e) {
          return -1 !== this.indexOf(e)
        }, e.add = function (e) {
          this.contains(e) || (this.push(e), t.set(e, r, i))
        }, e
      }

      t.exports.extend = n
    }, {}],
    187: [function (e, t) {
      function n(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t.name || t)
      }

      function i(e, t, n) {
        Object.defineProperty(n, t.name, {enumerable: t.enumerable, value: o.extend(n[t.name] || [], e, t, n)})
      }

      function r(e, t, n) {
        var i = t.inverse, r = n[t.name];
        Object.defineProperty(n, t.name, {
          enumerable: t.enumerable, get: function () {
            return r
          }, set: function (t) {
            if (t !== r) {
              var a = r;
              r = null, a && e.unset(a, i, n), r = t, e.set(r, i, n)
            }
          }
        })
      }

      function a(e, t) {
        return this instanceof a ? (e.inverse = t, t.inverse = e, this.props = {}, this.props[e.name] = e, void(this.props[t.name] = t)) : new a(e, t)
      }

      var o = e(186);
      a.prototype.bind = function (e, t) {
        if ("string" == typeof t) {
          if (!this.props[t])throw new Error("no property <" + t + "> in ref");
          t = this.props[t]
        }
        t.collection ? i(this, t, e) : r(this, t, e)
      }, a.prototype.ensureBound = function (e, t) {
        n(e, t) || this.bind(e, t)
      }, a.prototype.unset = function (e, t, n) {
        e && (this.ensureBound(e, t), t.collection ? e[t.name].remove(n) : e[t.name] = void 0)
      }, a.prototype.set = function (e, t, n) {
        e && (this.ensureBound(e, t), t.collection ? e[t.name].add(n) : e[t.name] = n)
      }, t.exports = a
    }, {186: 186}]
  }, {}, [1])(1)
}),define("text!camunda-commons-ui/widgets/bpmn-viewer/cam-widget-bpmn-viewer.html", [], function () {
  return '<div class="alert alert-danger"\n     ng-if="error">\n  <span>\n    <strong>Could not render diagram:</strong>\n  </span>\n  <span>\n   {{ error.message }}\n  </span>\n</div>\n\n<div ng-show="!error">\n\n  <div ng-if="!loaded" class="placeholder-container">\n    <div class="placeholder-content">\n      Loading diagram<br />\n      <span class="glyphicon glyphicon-refresh animate-spin"></span>\n    </div>\n  </div>\n\n  <div class="diagram-holder" ng-class=\'{"diagram-holder": true, "grab-cursor": !disableNavigation && !grabbing, "djs-cursor-move": !disableNavigation && grabbing}\'></div>\n\n  <div ng-if="!disableNavigation"\n       class="navigation zoom">\n    <button class="btn btn-default in"\n            title="zoom in"\n            ng-click="zoomIn()">\n      <span class="glyphicon glyphicon-plus"></span>\n    </button>\n    <button class="btn btn-default out"\n            title="zoom out"\n            ng-click="zoomOut()">\n      <span class="glyphicon glyphicon-minus"></span>\n    </button>\n  </div>\n\n  <div ng-if="!disableNavigation"\n       class="navigation reset">\n    <button class="btn btn-default"\n            title="reset zoom"\n            ng-click="resetZoom()">\n      <span class="glyphicon glyphicon-screenshot"></span>\n    </button>\n  </div>\n</div>\n'
}),define("camunda-commons-ui/widgets/bpmn-viewer/cam-widget-bpmn-viewer", ["angular", "bpmn-io", "text!./cam-widget-bpmn-viewer.html"], function (e, t, n) {
  "use strict";
  return ["$compile", function (e) {
    return {
      scope: {
        diagramData: "=",
        control: "=?",
        disableNavigation: "&",
        onLoad: "&",
        onClick: "&",
        onMouseEnter: "&",
        onMouseLeave: "&"
      }, template: n, link: function (n, i) {
        function r() {
          if (l) {
            n.loaded = !1;
            var e = "object" == typeof l, t = (e ? c.importDefinitions : c.importXML).bind(c);
            t(l, function (t, i) {
              var r = e ? function (e) {
                e()
              } : n.$apply.bind(n);
              r(function () {
                return t ? void(n.error = t) : (n.warn = i, u = c.get("canvas"), a(), o(), n.loaded = !0, void n.onLoad())
              })
            })
          }
        }

        function a() {
          u && u.zoom("fit-viewport", "auto")
        }

        function o() {
          var e = c.get("eventBus");
          e.on("element.click", function (e) {
            n.onClick({element: e.element, $event: e.originalEvent})
          }), e.on("element.hover", function (e) {
            n.onMouseEnter({element: e.element, $event: e.originalEvent})
          }), e.on("element.out", function (e) {
            n.onMouseLeave({element: e.element, $event: e.originalEvent})
          }), e.on("element.mousedown", function () {
            n.grabbing = !0, document.addEventListener("mouseup", p), n.$apply()
          })
        }

        n.grabbing = !1, n.disableNavigation = n.$eval(n.disableNavigation), n.control = n.control || {}, n.control.highlight = function (e) {
          u.addMarker(e, "highlight"), i.find('[data-element-id="' + e + '"]>.djs-outline').attr({
            rx: "14px",
            ry: "14px"
          })
        }, n.control.clearHighlight = function (e) {
          u.removeMarker(e, "highlight")
        }, n.control.isHighlighted = function (e) {
          return u.hasMarker(e, "highlight")
        }, n.control.createBadge = function (t, i) {
          var r, a = c.get("overlays");
          i.html ? r = i.html : (r = document.createElement("span"), i.color && (r.style["background-color"] = i.color), i.tooltip && (r.setAttribute("tooltip", i.tooltip), r.setAttribute("tooltip-placement", "top")), i.text && r.appendChild(document.createTextNode(i.text))), a.add(t, {
            position: i.position || {
              bottom: 0,
              right: 0
            }, show: {minZoom: -1 / 0, maxZoom: +1 / 0}, html: r
          }), e(r)(n)
        }, n.control.removeBadges = function (e) {
          c.get("overlays").remove({element: e})
        }, n.control.getViewer = function () {
          return c
        }, n.control.scrollToElement = function (e) {
          var t, n, i, r, a = c.get("elementRegistry").get(e), o = u.viewbox();
          t = Math.max(o.height, a.height), n = Math.max(o.width, a.width), i = Math.min(Math.max(o.x, a.x - o.width + a.width), a.x), r = Math.min(Math.max(o.y, a.y - o.height + a.height), a.y), u.viewbox({
            x: i,
            y: r,
            width: n,
            height: t
          })
        }, n.control.getElement = function (e) {
          return c.get("elementRegistry").get(e)
        }, n.loaded = !1, n.control.isLoaded = function () {
          return n.loaded
        };
        var s = t;
        n.disableNavigation && (s = Object.getPrototypeOf(t.prototype).constructor);
        var c = new s({
          container: i.find(".diagram-holder"),
          width: "100%",
          height: "100%",
          overlays: {deferUpdate: !1}
        }), l = null, u = null;
        n.$watch("diagramData", function (e) {
          e && (l = e, r())
        });
        var p = function () {
          n.grabbing = !1, document.removeEventListener("mouseup", p), n.$apply()
        };
        n.zoomIn = function () {
          c.diagram.get("zoomScroll").zoom(1, {x: i[0].offsetWidth / 2, y: i[0].offsetHeight / 2})
        }, n.zoomOut = function () {
          c.diagram.get("zoomScroll").zoom(-1, {x: i[0].offsetWidth / 2, y: i[0].offsetHeight / 2})
        }, n.resetZoom = function () {
          u.zoom("fit-viewport", "auto")
        }, n.control.resetZoom = n.resetZoom
      }
    }
  }]
}),function (e) {
  function t(e, t, n) {
    switch (arguments.length) {
      case 2:
        return null != e ? e : t;
      case 3:
        return null != e ? e : null != t ? t : n;
      default:
        throw new Error("Implement me")
    }
  }

  function n(e, t) {
    return Ct.call(e, t)
  }

  function i() {
    return {
      empty: !1,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: !1,
      invalidMonth: null,
      invalidFormat: !1,
      userInvalidated: !1,
      iso: !1
    }
  }

  function r(e) {
    xt.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e)
  }

  function a(e, t) {
    var n = !0;
    return h(function () {
      return n && (r(e), n = !1), t.apply(this, arguments)
    }, t)
  }

  function o(e, t) {
    bn[e] || (r(t), bn[e] = !0)
  }

  function s(e, t) {
    return function (n) {
      return v(e.call(this, n), t)
    }
  }

  function c(e, t) {
    return function (n) {
      return this.localeData().ordinal(e.call(this, n), t)
    }
  }

  function l(e, t) {
    var n, i, r = 12 * (t.year() - e.year()) + (t.month() - e.month()), a = e.clone().add(r, "months");
    return 0 > t - a ? (n = e.clone().add(r - 1, "months"), i = (t - a) / (a - n)) : (n = e.clone().add(r + 1, "months"), i = (t - a) / (n - a)), -(r + i)
  }

  function u(e, t, n) {
    var i;
    return null == n ? t : null != e.meridiemHour ? e.meridiemHour(t, n) : null != e.isPM ? (i = e.isPM(n), i && 12 > t && (t += 12), i || 12 !== t || (t = 0), t) : t
  }

  function p() {
  }

  function d(e, t) {
    t !== !1 && R(e), m(this, e), this._d = new Date(+e._d), xn === !1 && (xn = !0, xt.updateOffset(this), xn = !1)
  }

  function f(e) {
    var t = A(e), n = t.year || 0, i = t.quarter || 0, r = t.month || 0, a = t.week || 0, o = t.day || 0, s = t.hour || 0, c = t.minute || 0, l = t.second || 0, u = t.millisecond || 0;
    this._milliseconds = +u + 1e3 * l + 6e4 * c + 36e5 * s, this._days = +o + 7 * a, this._months = +r + 3 * i + 12 * n, this._data = {}, this._locale = xt.localeData(), this._bubble()
  }

  function h(e, t) {
    for (var i in t)n(t, i) && (e[i] = t[i]);
    return n(t, "toString") && (e.toString = t.toString), n(t, "valueOf") && (e.valueOf = t.valueOf), e
  }

  function m(e, t) {
    var n, i, r;
    if ("undefined" != typeof t._isAMomentObject && (e._isAMomentObject = t._isAMomentObject), "undefined" != typeof t._i && (e._i = t._i), "undefined" != typeof t._f && (e._f = t._f), "undefined" != typeof t._l && (e._l = t._l), "undefined" != typeof t._strict && (e._strict = t._strict), "undefined" != typeof t._tzm && (e._tzm = t._tzm), "undefined" != typeof t._isUTC && (e._isUTC = t._isUTC), "undefined" != typeof t._offset && (e._offset = t._offset), "undefined" != typeof t._pf && (e._pf = t._pf), "undefined" != typeof t._locale && (e._locale = t._locale), $t.length > 0)for (n in $t)i = $t[n], r = t[i], "undefined" != typeof r && (e[i] = r);
    return e
  }

  function g(e) {
    return 0 > e ? Math.ceil(e) : Math.floor(e)
  }

  function v(e, t, n) {
    for (var i = "" + Math.abs(e), r = e >= 0; i.length < t;)i = "0" + i;
    return (r ? n ? "+" : "" : "-") + i
  }

  function y(e, t) {
    var n = {milliseconds: 0, months: 0};
    return n.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(n.months, "M").isAfter(t) && --n.months, n.milliseconds = +t - +e.clone().add(n.months, "M"), n
  }

  function b(e, t) {
    var n;
    return t = L(t, e), e.isBefore(t) ? n = y(e, t) : (n = y(t, e), n.milliseconds = -n.milliseconds, n.months = -n.months), n
  }

  function w(e, t) {
    return function (n, i) {
      var r, a;
      return null === i || isNaN(+i) || (o(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period)."), a = n, n = i, i = a), n = "string" == typeof n ? +n : n, r = xt.duration(n, i), x(this, r, e), this
    }
  }

  function x(e, t, n, i) {
    var r = t._milliseconds, a = t._days, o = t._months;
    i = null == i ? !0 : i, r && e._d.setTime(+e._d + r * n), a && mt(e, "Date", ht(e, "Date") + a * n), o && ft(e, ht(e, "Month") + o * n), i && xt.updateOffset(e, a || o)
  }

  function E(e) {
    return "[object Array]" === Object.prototype.toString.call(e)
  }

  function _(e) {
    return "[object Date]" === Object.prototype.toString.call(e) || e instanceof Date
  }

  function T(e, t, n) {
    var i, r = Math.min(e.length, t.length), a = Math.abs(e.length - t.length), o = 0;
    for (i = 0; r > i; i++)(n && e[i] !== t[i] || !n && D(e[i]) !== D(t[i])) && o++;
    return o + a
  }

  function S(e) {
    if (e) {
      var t = e.toLowerCase().replace(/(.)s$/, "$1");
      e = dn[e] || fn[t] || t
    }
    return e
  }

  function A(e) {
    var t, i, r = {};
    for (i in e)n(e, i) && (t = S(i), t && (r[t] = e[i]));
    return r
  }

  function C(t) {
    var n, i;
    if (0 === t.indexOf("week"))n = 7, i = "day"; else {
      if (0 !== t.indexOf("month"))return;
      n = 12, i = "month"
    }
    xt[t] = function (r, a) {
      var o, s, c = xt._locale[t], l = [];
      if ("number" == typeof r && (a = r, r = e), s = function (e) {
          var t = xt().utc().set(i, e);
          return c.call(xt._locale, t, r || "")
        }, null != a)return s(a);
      for (o = 0; n > o; o++)l.push(s(o));
      return l
    }
  }

  function D(e) {
    var t = +e, n = 0;
    return 0 !== t && isFinite(t) && (n = t >= 0 ? Math.floor(t) : Math.ceil(t)), n
  }

  function k(e, t) {
    return new Date(Date.UTC(e, t + 1, 0)).getUTCDate()
  }

  function I(e, t, n) {
    return lt(xt([e, 11, 31 + t - n]), t, n).week
  }

  function P(e) {
    return M(e) ? 366 : 365
  }

  function M(e) {
    return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
  }

  function R(e) {
    var t;
    e._a && -2 === e._pf.overflow && (t = e._a[kt] < 0 || e._a[kt] > 11 ? kt : e._a[It] < 1 || e._a[It] > k(e._a[Dt], e._a[kt]) ? It : e._a[Pt] < 0 || e._a[Pt] > 24 || 24 === e._a[Pt] && (0 !== e._a[Mt] || 0 !== e._a[Rt] || 0 !== e._a[Nt]) ? Pt : e._a[Mt] < 0 || e._a[Mt] > 59 ? Mt : e._a[Rt] < 0 || e._a[Rt] > 59 ? Rt : e._a[Nt] < 0 || e._a[Nt] > 999 ? Nt : -1, e._pf._overflowDayOfYear && (Dt > t || t > It) && (t = It), e._pf.overflow = t)
  }

  function N(t) {
    return null == t._isValid && (t._isValid = !isNaN(t._d.getTime()) && t._pf.overflow < 0 && !t._pf.empty && !t._pf.invalidMonth && !t._pf.nullInput && !t._pf.invalidFormat && !t._pf.userInvalidated, t._strict && (t._isValid = t._isValid && 0 === t._pf.charsLeftOver && 0 === t._pf.unusedTokens.length && t._pf.bigHour === e)), t._isValid
  }

  function O(e) {
    return e ? e.toLowerCase().replace("_", "-") : e
  }

  function $(e) {
    for (var t, n, i, r, a = 0; a < e.length;) {
      for (r = O(e[a]).split("-"), t = r.length, n = O(e[a + 1]), n = n ? n.split("-") : null; t > 0;) {
        if (i = F(r.slice(0, t).join("-")))return i;
        if (n && n.length >= t && T(r, n, !0) >= t - 1)break;
        t--
      }
      a++
    }
    return null
  }

  function F(e) {
    var t = null;
    if (!Ot[e] && Ft)try {
      t = xt.locale(), require("./locale/" + e), xt.locale(t)
    } catch (n) {
    }
    return Ot[e]
  }

  function L(e, t) {
    var n, i;
    return t._isUTC ? (n = t.clone(), i = (xt.isMoment(e) || _(e) ? +e : +xt(e)) - +n, n._d.setTime(+n._d + i), xt.updateOffset(n, !1), n) : xt(e).local()
  }

  function B(e) {
    return e.match(/\[[\s\S]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
  }

  function V(e) {
    var t, n, i = e.match(jt);
    for (t = 0, n = i.length; n > t; t++)i[t] = yn[i[t]] ? yn[i[t]] : B(i[t]);
    return function (r) {
      var a = "";
      for (t = 0; n > t; t++)a += i[t]instanceof Function ? i[t].call(r, e) : i[t];
      return a
    }
  }

  function j(e, t) {
    return e.isValid() ? (t = U(t, e.localeData()), hn[t] || (hn[t] = V(t)), hn[t](e)) : e.localeData().invalidDate()
  }

  function U(e, t) {
    function n(e) {
      return t.longDateFormat(e) || e
    }

    var i = 5;
    for (Ut.lastIndex = 0; i >= 0 && Ut.test(e);)e = e.replace(Ut, n), Ut.lastIndex = 0, i -= 1;
    return e
  }

  function q(e, t) {
    var n, i = t._strict;
    switch (e) {
      case"Q":
        return Jt;
      case"DDDD":
        return tn;
      case"YYYY":
      case"GGGG":
      case"gggg":
        return i ? nn : zt;
      case"Y":
      case"G":
      case"g":
        return an;
      case"YYYYYY":
      case"YYYYY":
      case"GGGGG":
      case"ggggg":
        return i ? rn : Wt;
      case"S":
        if (i)return Jt;
      case"SS":
        if (i)return en;
      case"SSS":
        if (i)return tn;
      case"DDD":
        return Yt;
      case"MMM":
      case"MMMM":
      case"dd":
      case"ddd":
      case"dddd":
        return Gt;
      case"a":
      case"A":
        return t._locale._meridiemParse;
      case"x":
        return Qt;
      case"X":
        return Zt;
      case"Z":
      case"ZZ":
        return Kt;
      case"T":
        return Xt;
      case"SSSS":
        return Ht;
      case"MM":
      case"DD":
      case"YY":
      case"GG":
      case"gg":
      case"HH":
      case"hh":
      case"mm":
      case"ss":
      case"ww":
      case"WW":
        return i ? en : qt;
      case"M":
      case"D":
      case"d":
      case"H":
      case"h":
      case"m":
      case"s":
      case"w":
      case"W":
      case"e":
      case"E":
        return qt;
      case"Do":
        return i ? t._locale._ordinalParse : t._locale._ordinalParseLenient;
      default:
        return n = new RegExp(Z(Q(e.replace("\\", "")), "i"))
    }
  }

  function Y(e) {
    e = e || "";
    var t = e.match(Kt) || [], n = t[t.length - 1] || [], i = (n + "").match(un) || ["-", 0, 0], r = +(60 * i[1]) + D(i[2]);
    return "+" === i[0] ? r : -r
  }

  function z(e, t, n) {
    var i, r = n._a;
    switch (e) {
      case"Q":
        null != t && (r[kt] = 3 * (D(t) - 1));
        break;
      case"M":
      case"MM":
        null != t && (r[kt] = D(t) - 1);
        break;
      case"MMM":
      case"MMMM":
        i = n._locale.monthsParse(t, e, n._strict), null != i ? r[kt] = i : n._pf.invalidMonth = t;
        break;
      case"D":
      case"DD":
        null != t && (r[It] = D(t));
        break;
      case"Do":
        null != t && (r[It] = D(parseInt(t.match(/\d{1,2}/)[0], 10)));
        break;
      case"DDD":
      case"DDDD":
        null != t && (n._dayOfYear = D(t));
        break;
      case"YY":
        r[Dt] = xt.parseTwoDigitYear(t);
        break;
      case"YYYY":
      case"YYYYY":
      case"YYYYYY":
        r[Dt] = D(t);
        break;
      case"a":
      case"A":
        n._meridiem = t;
        break;
      case"h":
      case"hh":
        n._pf.bigHour = !0;
      case"H":
      case"HH":
        r[Pt] = D(t);
        break;
      case"m":
      case"mm":
        r[Mt] = D(t);
        break;
      case"s":
      case"ss":
        r[Rt] = D(t);
        break;
      case"S":
      case"SS":
      case"SSS":
      case"SSSS":
        r[Nt] = D(1e3 * ("0." + t));
        break;
      case"x":
        n._d = new Date(D(t));
        break;
      case"X":
        n._d = new Date(1e3 * parseFloat(t));
        break;
      case"Z":
      case"ZZ":
        n._useUTC = !0, n._tzm = Y(t);
        break;
      case"dd":
      case"ddd":
      case"dddd":
        i = n._locale.weekdaysParse(t), null != i ? (n._w = n._w || {}, n._w.d = i) : n._pf.invalidWeekday = t;
        break;
      case"w":
      case"ww":
      case"W":
      case"WW":
      case"d":
      case"e":
      case"E":
        e = e.substr(0, 1);
      case"gggg":
      case"GGGG":
      case"GGGGG":
        e = e.substr(0, 2), t && (n._w = n._w || {}, n._w[e] = D(t));
        break;
      case"gg":
      case"GG":
        n._w = n._w || {}, n._w[e] = xt.parseTwoDigitYear(t)
    }
  }

  function W(e) {
    var n, i, r, a, o, s, c;
    n = e._w, null != n.GG || null != n.W || null != n.E ? (o = 1, s = 4, i = t(n.GG, e._a[Dt], lt(xt(), 1, 4).year), r = t(n.W, 1), a = t(n.E, 1)) : (o = e._locale._week.dow, s = e._locale._week.doy, i = t(n.gg, e._a[Dt], lt(xt(), o, s).year), r = t(n.w, 1), null != n.d ? (a = n.d, o > a && ++r) : a = null != n.e ? n.e + o : o), c = ut(i, r, a, s, o), e._a[Dt] = c.year, e._dayOfYear = c.dayOfYear
  }

  function H(e) {
    var n, i, r, a, o = [];
    if (!e._d) {
      for (r = K(e), e._w && null == e._a[It] && null == e._a[kt] && W(e), e._dayOfYear && (a = t(e._a[Dt], r[Dt]), e._dayOfYear > P(a) && (e._pf._overflowDayOfYear = !0), i = at(a, 0, e._dayOfYear), e._a[kt] = i.getUTCMonth(), e._a[It] = i.getUTCDate()), n = 0; 3 > n && null == e._a[n]; ++n)e._a[n] = o[n] = r[n];
      for (; 7 > n; n++)e._a[n] = o[n] = null == e._a[n] ? 2 === n ? 1 : 0 : e._a[n];
      24 === e._a[Pt] && 0 === e._a[Mt] && 0 === e._a[Rt] && 0 === e._a[Nt] && (e._nextDay = !0, e._a[Pt] = 0), e._d = (e._useUTC ? at : rt).apply(null, o), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[Pt] = 24)
    }
  }

  function G(e) {
    var t;
    e._d || (t = A(e._i), e._a = [t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], H(e))
  }

  function K(e) {
    var t = new Date;
    return e._useUTC ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()] : [t.getFullYear(), t.getMonth(), t.getDate()]
  }

  function X(t) {
    if (t._f === xt.ISO_8601)return void et(t);
    t._a = [], t._pf.empty = !0;
    var n, i, r, a, o, s = "" + t._i, c = s.length, l = 0;
    for (r = U(t._f, t._locale).match(jt) || [], n = 0; n < r.length; n++)a = r[n], i = (s.match(q(a, t)) || [])[0], i && (o = s.substr(0, s.indexOf(i)), o.length > 0 && t._pf.unusedInput.push(o), s = s.slice(s.indexOf(i) + i.length), l += i.length), yn[a] ? (i ? t._pf.empty = !1 : t._pf.unusedTokens.push(a), z(a, i, t)) : t._strict && !i && t._pf.unusedTokens.push(a);
    t._pf.charsLeftOver = c - l, s.length > 0 && t._pf.unusedInput.push(s), t._pf.bigHour === !0 && t._a[Pt] <= 12 && (t._pf.bigHour = e), t._a[Pt] = u(t._locale, t._a[Pt], t._meridiem), H(t), R(t)
  }

  function Q(e) {
    return e.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, n, i, r) {
      return t || n || i || r
    })
  }

  function Z(e) {
    return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
  }

  function J(e) {
    var t, n, r, a, o;
    if (0 === e._f.length)return e._pf.invalidFormat = !0, void(e._d = new Date(0 / 0));
    for (a = 0; a < e._f.length; a++)o = 0, t = m({}, e), null != e._useUTC && (t._useUTC = e._useUTC), t._pf = i(), t._f = e._f[a], X(t), N(t) && (o += t._pf.charsLeftOver, o += 10 * t._pf.unusedTokens.length, t._pf.score = o, (null == r || r > o) && (r = o, n = t));
    h(e, n || t)
  }

  function et(e) {
    var t, n, i = e._i, r = on.exec(i);
    if (r) {
      for (e._pf.iso = !0, t = 0, n = cn.length; n > t; t++)if (cn[t][1].exec(i)) {
        e._f = cn[t][0] + (r[6] || " ");
        break
      }
      for (t = 0, n = ln.length; n > t; t++)if (ln[t][1].exec(i)) {
        e._f += ln[t][0];
        break
      }
      i.match(Kt) && (e._f += "Z"), X(e)
    } else e._isValid = !1
  }

  function tt(e) {
    et(e), e._isValid === !1 && (delete e._isValid, xt.createFromInputFallback(e))
  }

  function nt(e, t) {
    var n, i = [];
    for (n = 0; n < e.length; ++n)i.push(t(e[n], n));
    return i
  }

  function it(t) {
    var n, i = t._i;
    i === e ? t._d = new Date : _(i) ? t._d = new Date(+i) : null !== (n = Lt.exec(i)) ? t._d = new Date(+n[1]) : "string" == typeof i ? tt(t) : E(i) ? (t._a = nt(i.slice(0), function (e) {
      return parseInt(e, 10)
    }), H(t)) : "object" == typeof i ? G(t) : "number" == typeof i ? t._d = new Date(i) : xt.createFromInputFallback(t)
  }

  function rt(e, t, n, i, r, a, o) {
    var s = new Date(e, t, n, i, r, a, o);
    return 1970 > e && s.setFullYear(e), s
  }

  function at(e) {
    var t = new Date(Date.UTC.apply(null, arguments));
    return 1970 > e && t.setUTCFullYear(e), t
  }

  function ot(e, t) {
    if ("string" == typeof e)if (isNaN(e)) {
      if (e = t.weekdaysParse(e), "number" != typeof e)return null
    } else e = parseInt(e, 10);
    return e
  }

  function st(e, t, n, i, r) {
    return r.relativeTime(t || 1, !!n, e, i)
  }

  function ct(e, t, n) {
    var i = xt.duration(e).abs(), r = At(i.as("s")), a = At(i.as("m")), o = At(i.as("h")), s = At(i.as("d")), c = At(i.as("M")), l = At(i.as("y")), u = r < mn.s && ["s", r] || 1 === a && ["m"] || a < mn.m && ["mm", a] || 1 === o && ["h"] || o < mn.h && ["hh", o] || 1 === s && ["d"] || s < mn.d && ["dd", s] || 1 === c && ["M"] || c < mn.M && ["MM", c] || 1 === l && ["y"] || ["yy", l];
    return u[2] = t, u[3] = +e > 0, u[4] = n, st.apply({}, u)
  }

  function lt(e, t, n) {
    var i, r = n - t, a = n - e.day();
    return a > r && (a -= 7), r - 7 > a && (a += 7), i = xt(e).add(a, "d"), {
      week: Math.ceil(i.dayOfYear() / 7),
      year: i.year()
    }
  }

  function ut(e, t, n, i, r) {
    var a, o, s = at(e, 0, 1).getUTCDay();
    return s = 0 === s ? 7 : s, n = null != n ? n : r, a = r - s + (s > i ? 7 : 0) - (r > s ? 7 : 0), o = 7 * (t - 1) + (n - r) + a + 1, {
      year: o > 0 ? e : e - 1,
      dayOfYear: o > 0 ? o : P(e - 1) + o
    }
  }

  function pt(t) {
    var n, i = t._i, r = t._f;
    return t._locale = t._locale || xt.localeData(t._l), null === i || r === e && "" === i ? xt.invalid({nullInput: !0}) : ("string" == typeof i && (t._i = i = t._locale.preparse(i)), xt.isMoment(i) ? new d(i, !0) : (r ? E(r) ? J(t) : X(t) : it(t), n = new d(t), n._nextDay && (n.add(1, "d"), n._nextDay = e), n))
  }

  function dt(e, t) {
    var n, i;
    if (1 === t.length && E(t[0]) && (t = t[0]), !t.length)return xt();
    for (n = t[0], i = 1; i < t.length; ++i)t[i][e](n) && (n = t[i]);
    return n
  }

  function ft(e, t) {
    var n;
    return "string" == typeof t && (t = e.localeData().monthsParse(t), "number" != typeof t) ? e : (n = Math.min(e.date(), k(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n), e)
  }

  function ht(e, t) {
    return e._d["get" + (e._isUTC ? "UTC" : "") + t]()
  }

  function mt(e, t, n) {
    return "Month" === t ? ft(e, n) : e._d["set" + (e._isUTC ? "UTC" : "") + t](n)
  }

  function gt(e, t) {
    return function (n) {
      return null != n ? (mt(this, e, n), xt.updateOffset(this, t), this) : ht(this, e)
    }
  }

  function vt(e) {
    return 400 * e / 146097
  }

  function yt(e) {
    return 146097 * e / 400
  }

  function bt(e) {
    xt.duration.fn[e] = function () {
      return this._data[e]
    }
  }

  function wt(e) {
    "undefined" == typeof ender && (Et = St.moment, St.moment = e ? a("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", xt) : xt)
  }

  for (var xt, Et, _t, Tt = "2.9.0", St = "undefined" == typeof global || "undefined" != typeof window && window !== global.window ? this : global, At = Math.round, Ct = Object.prototype.hasOwnProperty, Dt = 0, kt = 1, It = 2, Pt = 3, Mt = 4, Rt = 5, Nt = 6, Ot = {}, $t = [], Ft = "undefined" != typeof module && module && module.exports, Lt = /^\/?Date\((\-?\d+)/i, Bt = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Vt = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, jt = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g, Ut = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, qt = /\d\d?/, Yt = /\d{1,3}/, zt = /\d{1,4}/, Wt = /[+\-]?\d{1,6}/, Ht = /\d+/, Gt = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Kt = /Z|[\+\-]\d\d:?\d\d/gi, Xt = /T/i, Qt = /[\+\-]?\d+/, Zt = /[\+\-]?\d+(\.\d{1,3})?/, Jt = /\d/, en = /\d\d/, tn = /\d{3}/, nn = /\d{4}/, rn = /[+-]?\d{6}/, an = /[+-]?\d+/, on = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, sn = "YYYY-MM-DDTHH:mm:ssZ", cn = [["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/], ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/], ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/], ["GGGG-[W]WW", /\d{4}-W\d{2}/], ["YYYY-DDD", /\d{4}-\d{3}/]], ln = [["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], un = /([\+\-]|\d\d)/gi, pn = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"), {
    Milliseconds: 1,
    Seconds: 1e3,
    Minutes: 6e4,
    Hours: 36e5,
    Days: 864e5,
    Months: 2592e6,
    Years: 31536e6
  }), dn = {
    ms: "millisecond",
    s: "second",
    m: "minute",
    h: "hour",
    d: "day",
    D: "date",
    w: "week",
    W: "isoWeek",
    M: "month",
    Q: "quarter",
    y: "year",
    DDD: "dayOfYear",
    e: "weekday",
    E: "isoWeekday",
    gg: "weekYear",
    GG: "isoWeekYear"
  }, fn = {
    dayofyear: "dayOfYear",
    isoweekday: "isoWeekday",
    isoweek: "isoWeek",
    weekyear: "weekYear",
    isoweekyear: "isoWeekYear"
  }, hn = {}, mn = {
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    M: 11
  }, gn = "DDD w W M D d".split(" "), vn = "M D H h m s w W".split(" "), yn = {
    M: function () {
      return this.month() + 1
    }, MMM: function (e) {
      return this.localeData().monthsShort(this, e)
    }, MMMM: function (e) {
      return this.localeData().months(this, e)
    }, D: function () {
      return this.date()
    }, DDD: function () {
      return this.dayOfYear()
    }, d: function () {
      return this.day()
    }, dd: function (e) {
      return this.localeData().weekdaysMin(this, e)
    }, ddd: function (e) {
      return this.localeData().weekdaysShort(this, e)
    }, dddd: function (e) {
      return this.localeData().weekdays(this, e)
    }, w: function () {
      return this.week()
    }, W: function () {
      return this.isoWeek()
    }, YY: function () {
      return v(this.year() % 100, 2)
    }, YYYY: function () {
      return v(this.year(), 4)
    }, YYYYY: function () {
      return v(this.year(), 5)
    }, YYYYYY: function () {
      var e = this.year(), t = e >= 0 ? "+" : "-";
      return t + v(Math.abs(e), 6)
    }, gg: function () {
      return v(this.weekYear() % 100, 2)
    }, gggg: function () {
      return v(this.weekYear(), 4)
    }, ggggg: function () {
      return v(this.weekYear(), 5)
    }, GG: function () {
      return v(this.isoWeekYear() % 100, 2)
    }, GGGG: function () {
      return v(this.isoWeekYear(), 4)
    }, GGGGG: function () {
      return v(this.isoWeekYear(), 5)
    }, e: function () {
      return this.weekday()
    }, E: function () {
      return this.isoWeekday()
    }, a: function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), !0)
    }, A: function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), !1)
    }, H: function () {
      return this.hours()
    }, h: function () {
      return this.hours() % 12 || 12
    }, m: function () {
      return this.minutes()
    }, s: function () {
      return this.seconds()
    }, S: function () {
      return D(this.milliseconds() / 100)
    }, SS: function () {
      return v(D(this.milliseconds() / 10), 2)
    }, SSS: function () {
      return v(this.milliseconds(), 3)
    }, SSSS: function () {
      return v(this.milliseconds(), 3)
    }, Z: function () {
      var e = this.utcOffset(), t = "+";
      return 0 > e && (e = -e, t = "-"), t + v(D(e / 60), 2) + ":" + v(D(e) % 60, 2)
    }, ZZ: function () {
      var e = this.utcOffset(), t = "+";
      return 0 > e && (e = -e, t = "-"), t + v(D(e / 60), 2) + v(D(e) % 60, 2)
    }, z: function () {
      return this.zoneAbbr()
    }, zz: function () {
      return this.zoneName()
    }, x: function () {
      return this.valueOf()
    }, X: function () {
      return this.unix()
    }, Q: function () {
      return this.quarter()
    }
  }, bn = {}, wn = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"], xn = !1; gn.length;)_t = gn.pop(), yn[_t + "o"] = c(yn[_t], _t);
  for (; vn.length;)_t = vn.pop(), yn[_t + _t] = s(yn[_t], 2);
  yn.DDDD = s(yn.DDD, 3), h(p.prototype, {
    set: function (e) {
      var t, n;
      for (n in e)t = e[n], "function" == typeof t ? this[n] = t : this["_" + n] = t;
      this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
    },
    _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    months: function (e) {
      return this._months[e.month()]
    },
    _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
    monthsShort: function (e) {
      return this._monthsShort[e.month()]
    },
    monthsParse: function (e, t, n) {
      var i, r, a;
      for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), i = 0; 12 > i; i++) {
        if (r = xt.utc([2e3, i]), n && !this._longMonthsParse[i] && (this._longMonthsParse[i] = new RegExp("^" + this.months(r, "").replace(".", "") + "$", "i"), this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(r, "").replace(".", "") + "$", "i")), n || this._monthsParse[i] || (a = "^" + this.months(r, "") + "|^" + this.monthsShort(r, ""), this._monthsParse[i] = new RegExp(a.replace(".", ""), "i")), n && "MMMM" === t && this._longMonthsParse[i].test(e))return i;
        if (n && "MMM" === t && this._shortMonthsParse[i].test(e))return i;
        if (!n && this._monthsParse[i].test(e))return i
      }
    },
    _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    weekdays: function (e) {
      return this._weekdays[e.day()]
    },
    _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    weekdaysShort: function (e) {
      return this._weekdaysShort[e.day()]
    },
    _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
    weekdaysMin: function (e) {
      return this._weekdaysMin[e.day()]
    },
    weekdaysParse: function (e) {
      var t, n, i;
      for (this._weekdaysParse || (this._weekdaysParse = []), t = 0; 7 > t; t++)if (this._weekdaysParse[t] || (n = xt([2e3, 1]).day(t), i = "^" + this.weekdays(n, "") + "|^" + this.weekdaysShort(n, "") + "|^" + this.weekdaysMin(n, ""), this._weekdaysParse[t] = new RegExp(i.replace(".", ""), "i")), this._weekdaysParse[t].test(e))return t
    },
    _longDateFormat: {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY LT",
      LLLL: "dddd, MMMM D, YYYY LT"
    },
    longDateFormat: function (e) {
      var t = this._longDateFormat[e];
      return !t && this._longDateFormat[e.toUpperCase()] && (t = this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (e) {
        return e.slice(1)
      }), this._longDateFormat[e] = t), t
    },
    isPM: function (e) {
      return "p" === (e + "").toLowerCase().charAt(0)
    },
    _meridiemParse: /[ap]\.?m?\.?/i,
    meridiem: function (e, t, n) {
      return e > 11 ? n ? "pm" : "PM" : n ? "am" : "AM"
    },
    _calendar: {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    },
    calendar: function (e, t, n) {
      var i = this._calendar[e];
      return "function" == typeof i ? i.apply(t, [n]) : i
    },
    _relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    },
    relativeTime: function (e, t, n, i) {
      var r = this._relativeTime[n];
      return "function" == typeof r ? r(e, t, n, i) : r.replace(/%d/i, e)
    },
    pastFuture: function (e, t) {
      var n = this._relativeTime[e > 0 ? "future" : "past"];
      return "function" == typeof n ? n(t) : n.replace(/%s/i, t)
    },
    ordinal: function (e) {
      return this._ordinal.replace("%d", e)
    },
    _ordinal: "%d",
    _ordinalParse: /\d{1,2}/,
    preparse: function (e) {
      return e
    },
    postformat: function (e) {
      return e
    },
    week: function (e) {
      return lt(e, this._week.dow, this._week.doy).week
    },
    _week: {dow: 0, doy: 6},
    firstDayOfWeek: function () {
      return this._week.dow
    },
    firstDayOfYear: function () {
      return this._week.doy
    },
    _invalidDate: "Invalid date",
    invalidDate: function () {
      return this._invalidDate
    }
  }), xt = function (t, n, r, a) {
    var o;
    return "boolean" == typeof r && (a = r, r = e), o = {}, o._isAMomentObject = !0, o._i = t, o._f = n, o._l = r, o._strict = a, o._isUTC = !1, o._pf = i(), pt(o)
  }, xt.suppressDeprecationWarnings = !1, xt.createFromInputFallback = a("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (e) {
    e._d = new Date(e._i + (e._useUTC ? " UTC" : ""))
  }), xt.min = function () {
    var e = [].slice.call(arguments, 0);
    return dt("isBefore", e)
  }, xt.max = function () {
    var e = [].slice.call(arguments, 0);
    return dt("isAfter", e)
  }, xt.utc = function (t, n, r, a) {
    var o;
    return "boolean" == typeof r && (a = r, r = e), o = {}, o._isAMomentObject = !0, o._useUTC = !0, o._isUTC = !0, o._l = r, o._i = t, o._f = n, o._strict = a, o._pf = i(), pt(o).utc()
  }, xt.unix = function (e) {
    return xt(1e3 * e)
  }, xt.duration = function (e, t) {
    var i, r, a, o, s = e, c = null;
    return xt.isDuration(e) ? s = {
      ms: e._milliseconds,
      d: e._days,
      M: e._months
    } : "number" == typeof e ? (s = {}, t ? s[t] = e : s.milliseconds = e) : (c = Bt.exec(e)) ? (i = "-" === c[1] ? -1 : 1, s = {
      y: 0,
      d: D(c[It]) * i,
      h: D(c[Pt]) * i,
      m: D(c[Mt]) * i,
      s: D(c[Rt]) * i,
      ms: D(c[Nt]) * i
    }) : (c = Vt.exec(e)) ? (i = "-" === c[1] ? -1 : 1, a = function (e) {
      var t = e && parseFloat(e.replace(",", "."));
      return (isNaN(t) ? 0 : t) * i
    }, s = {
      y: a(c[2]),
      M: a(c[3]),
      d: a(c[4]),
      h: a(c[5]),
      m: a(c[6]),
      s: a(c[7]),
      w: a(c[8])
    }) : null == s ? s = {} : "object" == typeof s && ("from"in s || "to"in s) && (o = b(xt(s.from), xt(s.to)), s = {}, s.ms = o.milliseconds, s.M = o.months), r = new f(s), xt.isDuration(e) && n(e, "_locale") && (r._locale = e._locale), r
  }, xt.version = Tt, xt.defaultFormat = sn, xt.ISO_8601 = function () {
  }, xt.momentProperties = $t, xt.updateOffset = function () {
  }, xt.relativeTimeThreshold = function (t, n) {
    return mn[t] === e ? !1 : n === e ? mn[t] : (mn[t] = n, !0)
  }, xt.lang = a("moment.lang is deprecated. Use moment.locale instead.", function (e, t) {
    return xt.locale(e, t)
  }), xt.locale = function (e, t) {
    var n;
    return e && (n = "undefined" != typeof t ? xt.defineLocale(e, t) : xt.localeData(e), n && (xt.duration._locale = xt._locale = n)), xt._locale._abbr
  }, xt.defineLocale = function (e, t) {
    return null !== t ? (t.abbr = e, Ot[e] || (Ot[e] = new p), Ot[e].set(t), xt.locale(e), Ot[e]) : (delete Ot[e], null)
  }, xt.langData = a("moment.langData is deprecated. Use moment.localeData instead.", function (e) {
    return xt.localeData(e)
  }), xt.localeData = function (e) {
    var t;
    if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e)return xt._locale;
    if (!E(e)) {
      if (t = F(e))return t;
      e = [e]
    }
    return $(e)
  }, xt.isMoment = function (e) {
    return e instanceof d || null != e && n(e, "_isAMomentObject")
  }, xt.isDuration = function (e) {
    return e instanceof f
  };
  for (_t = wn.length - 1; _t >= 0; --_t)C(wn[_t]);
  xt.normalizeUnits = function (e) {
    return S(e)
  }, xt.invalid = function (e) {
    var t = xt.utc(0 / 0);
    return null != e ? h(t._pf, e) : t._pf.userInvalidated = !0, t
  }, xt.parseZone = function () {
    return xt.apply(null, arguments).parseZone()
  }, xt.parseTwoDigitYear = function (e) {
    return D(e) + (D(e) > 68 ? 1900 : 2e3)
  }, xt.isDate = _, h(xt.fn = d.prototype, {
    clone: function () {
      return xt(this)
    },
    valueOf: function () {
      return +this._d - 6e4 * (this._offset || 0)
    },
    unix: function () {
      return Math.floor(+this / 1e3)
    },
    toString: function () {
      return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    },
    toDate: function () {
      return this._offset ? new Date(+this) : this._d
    },
    toISOString: function () {
      var e = xt(this).utc();
      return 0 < e.year() && e.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : j(e, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : j(e, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    },
    toArray: function () {
      var e = this;
      return [e.year(), e.month(), e.date(), e.hours(), e.minutes(), e.seconds(), e.milliseconds()]
    },
    isValid: function () {
      return N(this)
    },
    isDSTShifted: function () {
      return this._a ? this.isValid() && T(this._a, (this._isUTC ? xt.utc(this._a) : xt(this._a)).toArray()) > 0 : !1
    },
    parsingFlags: function () {
      return h({}, this._pf)
    },
    invalidAt: function () {
      return this._pf.overflow
    },
    utc: function (e) {
      return this.utcOffset(0, e)
    },
    local: function (e) {
      return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(this._dateUtcOffset(), "m")), this
    },
    format: function (e) {
      var t = j(this, e || xt.defaultFormat);
      return this.localeData().postformat(t)
    },
    add: w(1, "add"),
    subtract: w(-1, "subtract"),
    diff: function (e, t, n) {
      var i, r, a = L(e, this), o = 6e4 * (a.utcOffset() - this.utcOffset());
      return t = S(t), "year" === t || "month" === t || "quarter" === t ? (r = l(this, a), "quarter" === t ? r /= 3 : "year" === t && (r /= 12)) : (i = this - a, r = "second" === t ? i / 1e3 : "minute" === t ? i / 6e4 : "hour" === t ? i / 36e5 : "day" === t ? (i - o) / 864e5 : "week" === t ? (i - o) / 6048e5 : i), n ? r : g(r)
    },
    from: function (e, t) {
      return xt.duration({to: this, from: e}).locale(this.locale()).humanize(!t)
    },
    fromNow: function (e) {
      return this.from(xt(), e)
    },
    calendar: function (e) {
      var t = e || xt(), n = L(t, this).startOf("day"), i = this.diff(n, "days", !0), r = -6 > i ? "sameElse" : -1 > i ? "lastWeek" : 0 > i ? "lastDay" : 1 > i ? "sameDay" : 2 > i ? "nextDay" : 7 > i ? "nextWeek" : "sameElse";
      return this.format(this.localeData().calendar(r, this, xt(t)))
    },
    isLeapYear: function () {
      return M(this.year())
    },
    isDST: function () {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    },
    day: function (e) {
      var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
      return null != e ? (e = ot(e, this.localeData()), this.add(e - t, "d")) : t
    },
    month: gt("Month", !0),
    startOf: function (e) {
      switch (e = S(e)) {
        case"year":
          this.month(0);
        case"quarter":
        case"month":
          this.date(1);
        case"week":
        case"isoWeek":
        case"day":
          this.hours(0);
        case"hour":
          this.minutes(0);
        case"minute":
          this.seconds(0);
        case"second":
          this.milliseconds(0)
      }
      return "week" === e ? this.weekday(0) : "isoWeek" === e && this.isoWeekday(1), "quarter" === e && this.month(3 * Math.floor(this.month() / 3)), this
    },
    endOf: function (t) {
      return t = S(t), t === e || "millisecond" === t ? this : this.startOf(t).add(1, "isoWeek" === t ? "week" : t).subtract(1, "ms")
    },
    isAfter: function (e, t) {
      var n;
      return t = S("undefined" != typeof t ? t : "millisecond"), "millisecond" === t ? (e = xt.isMoment(e) ? e : xt(e), +this > +e) : (n = xt.isMoment(e) ? +e : +xt(e), n < +this.clone().startOf(t))
    },
    isBefore: function (e, t) {
      var n;
      return t = S("undefined" != typeof t ? t : "millisecond"), "millisecond" === t ? (e = xt.isMoment(e) ? e : xt(e), +e > +this) : (n = xt.isMoment(e) ? +e : +xt(e), +this.clone().endOf(t) < n)
    },
    isBetween: function (e, t, n) {
      return this.isAfter(e, n) && this.isBefore(t, n)
    },
    isSame: function (e, t) {
      var n;
      return t = S(t || "millisecond"), "millisecond" === t ? (e = xt.isMoment(e) ? e : xt(e), +this === +e) : (n = +xt(e), +this.clone().startOf(t) <= n && n <= +this.clone().endOf(t))
    },
    min: a("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function (e) {
      return e = xt.apply(null, arguments), this > e ? this : e
    }),
    max: a("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function (e) {
      return e = xt.apply(null, arguments), e > this ? this : e
    }),
    zone: a("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", function (e, t) {
      return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset()
    }),
    utcOffset: function (e, t) {
      var n, i = this._offset || 0;
      return null != e ? ("string" == typeof e && (e = Y(e)), Math.abs(e) < 16 && (e = 60 * e), !this._isUTC && t && (n = this._dateUtcOffset()), this._offset = e, this._isUTC = !0, null != n && this.add(n, "m"), i !== e && (!t || this._changeInProgress ? x(this, xt.duration(e - i, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, xt.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? i : this._dateUtcOffset()
    },
    isLocal: function () {
      return !this._isUTC
    },
    isUtcOffset: function () {
      return this._isUTC
    },
    isUtc: function () {
      return this._isUTC && 0 === this._offset
    },
    zoneAbbr: function () {
      return this._isUTC ? "UTC" : ""
    },
    zoneName: function () {
      return this._isUTC ? "Coordinated Universal Time" : ""
    },
    parseZone: function () {
      return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Y(this._i)), this
    },
    hasAlignedHourOffset: function (e) {
      return e = e ? xt(e).utcOffset() : 0, (this.utcOffset() - e) % 60 === 0
    },
    daysInMonth: function () {
      return k(this.year(), this.month())
    },
    dayOfYear: function (e) {
      var t = At((xt(this).startOf("day") - xt(this).startOf("year")) / 864e5) + 1;
      return null == e ? t : this.add(e - t, "d")
    },
    quarter: function (e) {
      return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3)
    },
    weekYear: function (e) {
      var t = lt(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
      return null == e ? t : this.add(e - t, "y")
    },
    isoWeekYear: function (e) {
      var t = lt(this, 1, 4).year;
      return null == e ? t : this.add(e - t, "y")
    },
    week: function (e) {
      var t = this.localeData().week(this);
      return null == e ? t : this.add(7 * (e - t), "d")
    },
    isoWeek: function (e) {
      var t = lt(this, 1, 4).week;
      return null == e ? t : this.add(7 * (e - t), "d")
    },
    weekday: function (e) {
      var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return null == e ? t : this.add(e - t, "d")
    },
    isoWeekday: function (e) {
      return null == e ? this.day() || 7 : this.day(this.day() % 7 ? e : e - 7)
    },
    isoWeeksInYear: function () {
      return I(this.year(), 1, 4)
    },
    weeksInYear: function () {
      var e = this.localeData()._week;
      return I(this.year(), e.dow, e.doy)
    },
    get: function (e) {
      return e = S(e), this[e]()
    },
    set: function (e, t) {
      var n;
      if ("object" == typeof e)for (n in e)this.set(n, e[n]); else e = S(e), "function" == typeof this[e] && this[e](t);
      return this
    },
    locale: function (t) {
      var n;
      return t === e ? this._locale._abbr : (n = xt.localeData(t), null != n && (this._locale = n), this)
    },
    lang: a("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (t) {
      return t === e ? this.localeData() : this.locale(t)
    }),
    localeData: function () {
      return this._locale
    },
    _dateUtcOffset: function () {
      return 15 * -Math.round(this._d.getTimezoneOffset() / 15)
    }
  }), xt.fn.millisecond = xt.fn.milliseconds = gt("Milliseconds", !1), xt.fn.second = xt.fn.seconds = gt("Seconds", !1), xt.fn.minute = xt.fn.minutes = gt("Minutes", !1), xt.fn.hour = xt.fn.hours = gt("Hours", !0), xt.fn.date = gt("Date", !0), xt.fn.dates = a("dates accessor is deprecated. Use date instead.", gt("Date", !0)), xt.fn.year = gt("FullYear", !0), xt.fn.years = a("years accessor is deprecated. Use year instead.", gt("FullYear", !0)), xt.fn.days = xt.fn.day, xt.fn.months = xt.fn.month, xt.fn.weeks = xt.fn.week, xt.fn.isoWeeks = xt.fn.isoWeek, xt.fn.quarters = xt.fn.quarter, xt.fn.toJSON = xt.fn.toISOString, xt.fn.isUTC = xt.fn.isUtc, h(xt.duration.fn = f.prototype, {
    _bubble: function () {
      var e, t, n, i = this._milliseconds, r = this._days, a = this._months, o = this._data, s = 0;
      o.milliseconds = i % 1e3, e = g(i / 1e3), o.seconds = e % 60, t = g(e / 60), o.minutes = t % 60, n = g(t / 60), o.hours = n % 24, r += g(n / 24), s = g(vt(r)), r -= g(yt(s)), a += g(r / 30), r %= 30, s += g(a / 12), a %= 12, o.days = r, o.months = a, o.years = s
    },
    abs: function () {
      return this._milliseconds = Math.abs(this._milliseconds), this._days = Math.abs(this._days), this._months = Math.abs(this._months), this._data.milliseconds = Math.abs(this._data.milliseconds), this._data.seconds = Math.abs(this._data.seconds), this._data.minutes = Math.abs(this._data.minutes), this._data.hours = Math.abs(this._data.hours), this._data.months = Math.abs(this._data.months), this._data.years = Math.abs(this._data.years), this
    },
    weeks: function () {
      return g(this.days() / 7)
    },
    valueOf: function () {
      return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * D(this._months / 12)
    },
    humanize: function (e) {
      var t = ct(this, !e, this.localeData());
      return e && (t = this.localeData().pastFuture(+this, t)), this.localeData().postformat(t)
    },
    add: function (e, t) {
      var n = xt.duration(e, t);
      return this._milliseconds += n._milliseconds, this._days += n._days, this._months += n._months, this._bubble(), this
    },
    subtract: function (e, t) {
      var n = xt.duration(e, t);
      return this._milliseconds -= n._milliseconds, this._days -= n._days, this._months -= n._months, this._bubble(), this
    },
    get: function (e) {
      return e = S(e), this[e.toLowerCase() + "s"]()
    },
    as: function (e) {
      var t, n;
      if (e = S(e), "month" === e || "year" === e)return t = this._days + this._milliseconds / 864e5, n = this._months + 12 * vt(t), "month" === e ? n : n / 12;
      switch (t = this._days + Math.round(yt(this._months / 12)), e) {
        case"week":
          return t / 7 + this._milliseconds / 6048e5;
        case"day":
          return t + this._milliseconds / 864e5;
        case"hour":
          return 24 * t + this._milliseconds / 36e5;
        case"minute":
          return 24 * t * 60 + this._milliseconds / 6e4;
        case"second":
          return 24 * t * 60 * 60 + this._milliseconds / 1e3;
        case"millisecond":
          return Math.floor(24 * t * 60 * 60 * 1e3) + this._milliseconds;
        default:
          throw new Error("Unknown unit " + e)
      }
    },
    lang: xt.fn.lang,
    locale: xt.fn.locale,
    toIsoString: a("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function () {
      return this.toISOString()
    }),
    toISOString: function () {
      var e = Math.abs(this.years()), t = Math.abs(this.months()), n = Math.abs(this.days()), i = Math.abs(this.hours()), r = Math.abs(this.minutes()), a = Math.abs(this.seconds() + this.milliseconds() / 1e3);
      return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (e ? e + "Y" : "") + (t ? t + "M" : "") + (n ? n + "D" : "") + (i || r || a ? "T" : "") + (i ? i + "H" : "") + (r ? r + "M" : "") + (a ? a + "S" : "") : "P0D"
    },
    localeData: function () {
      return this._locale
    },
    toJSON: function () {
      return this.toISOString()
    }
  }), xt.duration.fn.toString = xt.duration.fn.toISOString;
  for (_t in pn)n(pn, _t) && bt(_t.toLowerCase());
  xt.duration.fn.asMilliseconds = function () {
    return this.as("ms")
  }, xt.duration.fn.asSeconds = function () {
    return this.as("s")
  }, xt.duration.fn.asMinutes = function () {
    return this.as("m")
  }, xt.duration.fn.asHours = function () {
    return this.as("h")
  }, xt.duration.fn.asDays = function () {
    return this.as("d")
  }, xt.duration.fn.asWeeks = function () {
    return this.as("weeks")
  }, xt.duration.fn.asMonths = function () {
    return this.as("M")
  }, xt.duration.fn.asYears = function () {
    return this.as("y")
  }, xt.locale("en", {
    ordinalParse: /\d{1,2}(th|st|nd|rd)/, ordinal: function (e) {
      var t = e % 10, n = 1 === D(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th";
      return e + n
    }
  }), Ft ? module.exports = xt : "function" == typeof define && define.amd ? (define("moment", ["require", "exports", "module"], function (e, t, n) {
    return n.config && n.config() && n.config().noGlobal === !0 && (St.moment = Et), xt
  }), wt(!0)) : wt()
}.call(this),angular.module("pascalprecht.translate", ["ng"]).run(["$translate", function (e) {
  var t = e.storageKey(), n = e.storage();
  n ? n.get(t) ? e.use(n.get(t)) : angular.isString(e.preferredLanguage()) ? e.use(e.preferredLanguage()) : n.set(t, e.use()) : angular.isString(e.preferredLanguage()) && e.use(e.preferredLanguage())
}]),angular.module("pascalprecht.translate").provider("$translate", ["$STORAGE_KEY", function (e) {
  var t, n, i, r, a, o, s, c, l, u, p, d, f, h, m, g = {}, v = [], y = e, b = [], w = !1, x = "translate-cloak", E = !1, _ = ".", T = "2.4.2", S = function () {
    var e = window.navigator;
    return ((angular.isArray(e.languages) ? e.languages[0] : e.language || e.browserLanguage || e.systemLanguage || e.userLanguage) || "").split("-").join("_")
  }, A = function (e, t) {
    for (var n = 0, i = e.length; i > n; n++)if (e[n] === t)return n;
    return -1
  }, C = function () {
    return this.replace(/^\s+|\s+$/g, "")
  }, D = function (e) {
    for (var t = [], i = angular.lowercase(e), r = 0, a = v.length; a > r; r++)t.push(angular.lowercase(v[r]));
    if (A(t, i) > -1)return e;
    if (n) {
      var o;
      for (var s in n) {
        var c = !1, l = Object.prototype.hasOwnProperty.call(n, s) && angular.lowercase(s) === angular.lowercase(e);
        if ("*" === s.slice(-1) && (c = s.slice(0, -1) === e.slice(0, s.length - 1)), (l || c) && (o = n[s], A(t, angular.lowercase(o)) > -1))return o
      }
    }
    var u = e.split("_");
    return u.length > 1 && A(t, angular.lowercase(u[0])) > -1 ? u[0] : e
  }, k = function (e, t) {
    if (!e && !t)return g;
    if (e && !t) {
      if (angular.isString(e))return g[e]
    } else angular.isObject(g[e]) || (g[e] = {}), angular.extend(g[e], I(t));
    return this
  };
  this.translations = k, this.cloakClassName = function (e) {
    return e ? (x = e, this) : x
  };
  var I = function (e, t, n, i) {
    var r, a, o, s;
    t || (t = []), n || (n = {});
    for (r in e)Object.prototype.hasOwnProperty.call(e, r) && (s = e[r], angular.isObject(s) ? I(s, t.concat(r), n, r) : (a = t.length ? "" + t.join(_) + _ + r : r, t.length && r === i && (o = "" + t.join(_), n[o] = "@:" + a), n[a] = s));
    return n
  };
  this.addInterpolation = function (e) {
    return b.push(e), this
  }, this.useMessageFormatInterpolation = function () {
    return this.useInterpolation("$translateMessageFormatInterpolation")
  }, this.useInterpolation = function (e) {
    return u = e, this
  }, this.useSanitizeValueStrategy = function (e) {
    return w = e, this
  }, this.preferredLanguage = function (e) {
    return P(e), this
  };
  var P = function (e) {
    return e && (t = e), t
  };
  this.translationNotFoundIndicator = function (e) {
    return this.translationNotFoundIndicatorLeft(e), this.translationNotFoundIndicatorRight(e), this
  }, this.translationNotFoundIndicatorLeft = function (e) {
    return e ? (f = e, this) : f
  }, this.translationNotFoundIndicatorRight = function (e) {
    return e ? (h = e, this) : h
  }, this.fallbackLanguage = function (e) {
    return M(e), this
  };
  var M = function (e) {
    return e ? (angular.isString(e) ? (r = !0, i = [e]) : angular.isArray(e) && (r = !1, i = e), angular.isString(t) && A(i, t) < 0 && i.push(t), this) : r ? i[0] : i
  };
  this.use = function (e) {
    if (e) {
      if (!g[e] && !p)throw new Error("$translateProvider couldn't find translationTable for langKey: '" + e + "'");
      return a = e, this
    }
    return a
  };
  var R = function (e) {
    return e ? void(y = e) : c ? c + y : y
  };
  this.storageKey = R, this.useUrlLoader = function (e, t) {
    return this.useLoader("$translateUrlLoader", angular.extend({url: e}, t))
  }, this.useStaticFilesLoader = function (e) {
    return this.useLoader("$translateStaticFilesLoader", e)
  }, this.useLoader = function (e, t) {
    return p = e, d = t || {}, this
  }, this.useLocalStorage = function () {
    return this.useStorage("$translateLocalStorage")
  }, this.useCookieStorage = function () {
    return this.useStorage("$translateCookieStorage")
  }, this.useStorage = function (e) {
    return s = e, this
  }, this.storagePrefix = function (e) {
    return e ? (c = e, this) : e
  }, this.useMissingTranslationHandlerLog = function () {
    return this.useMissingTranslationHandler("$translateMissingTranslationHandlerLog")
  }, this.useMissingTranslationHandler = function (e) {
    return l = e, this
  }, this.usePostCompiling = function (e) {
    return E = !!e, this
  }, this.determinePreferredLanguage = function (e) {
    var n = e && angular.isFunction(e) ? e() : S();
    return t = v.length ? D(n) : n, this
  }, this.registerAvailableLanguageKeys = function (e, t) {
    return e ? (v = e, t && (n = t), this) : v
  }, this.useLoaderCache = function (e) {
    return e === !1 ? m = void 0 : e === !0 ? m = !0 : "undefined" == typeof e ? m = "$translationCache" : e && (m = e), this
  }, this.$get = ["$log", "$injector", "$rootScope", "$q", function (e, n, c, v) {
    var _, S, N, O = n.get(u || "$translateDefaultInterpolation"), $ = !1, F = {}, L = {}, B = function (e, n, r) {
      if (angular.isArray(e)) {
        var o = function (e) {
          for (var t = {}, i = [], a = function (e) {
            var i = v.defer(), a = function (n) {
              t[e] = n, i.resolve([e, n])
            };
            return B(e, n, r).then(a, a), i.promise
          }, o = 0, s = e.length; s > o; o++)i.push(a(e[o]));
          return v.all(i).then(function () {
            return t
          })
        };
        return o(e)
      }
      var c = v.defer();
      e && (e = C.apply(e));
      var l = function () {
        var e = t ? L[t] : L[a];
        if (S = 0, s && !e) {
          var n = _.get(y);
          if (e = L[n], i && i.length) {
            var r = A(i, n);
            S = 0 === r ? 1 : 0, A(i, t) < 0 && i.push(t)
          }
        }
        return e
      }();
      return l ? l.then(function () {
        Q(e, n, r).then(c.resolve, c.reject)
      }, c.reject) : Q(e, n, r).then(c.resolve, c.reject), c.promise
    }, V = function (e) {
      return f && (e = [f, e].join(" ")), h && (e = [e, h].join(" ")), e
    }, j = function (e) {
      a = e, c.$emit("$translateChangeSuccess", {language: e}), s && _.set(B.storageKey(), a), O.setLocale(a), angular.forEach(F, function (e, t) {
        F[t].setLocale(a)
      }), c.$emit("$translateChangeEnd", {language: e})
    }, U = function (e) {
      if (!e)throw"No language key specified for loading.";
      var t = v.defer();
      c.$emit("$translateLoadingStart", {language: e}), $ = !0;
      var i = m;
      "string" == typeof i && (i = n.get(i));
      var r = angular.extend({}, d, {key: e, $http: angular.extend({}, {cache: i}, d.$http)});
      return n.get(p)(r).then(function (n) {
        var i = {};
        c.$emit("$translateLoadingSuccess", {language: e}), angular.isArray(n) ? angular.forEach(n, function (e) {
          angular.extend(i, I(e))
        }) : angular.extend(i, I(n)), $ = !1, t.resolve({
          key: e,
          table: i
        }), c.$emit("$translateLoadingEnd", {language: e})
      }, function (e) {
        c.$emit("$translateLoadingError", {language: e}), t.reject(e), c.$emit("$translateLoadingEnd", {language: e})
      }), t.promise
    };
    if (s && (_ = n.get(s), !_.get || !_.set))throw new Error("Couldn't use storage '" + s + "', missing get() or set() method!");
    angular.isFunction(O.useSanitizeValueStrategy) && O.useSanitizeValueStrategy(w), b.length && angular.forEach(b, function (e) {
      var i = n.get(e);
      i.setLocale(t || a), angular.isFunction(i.useSanitizeValueStrategy) && i.useSanitizeValueStrategy(w), F[i.getInterpolationIdentifier()] = i
    });
    var q = function (e) {
      var t = v.defer();
      return Object.prototype.hasOwnProperty.call(g, e) ? t.resolve(g[e]) : L[e] ? L[e].then(function (e) {
        k(e.key, e.table), t.resolve(e.table)
      }, t.reject) : t.reject(), t.promise
    }, Y = function (e, t, n, i) {
      var r = v.defer();
      return q(e).then(function (o) {
        Object.prototype.hasOwnProperty.call(o, t) ? (i.setLocale(e), r.resolve(i.interpolate(o[t], n)), i.setLocale(a)) : r.reject()
      }, r.reject), r.promise
    }, z = function (e, t, n, i) {
      var r, o = g[e];
      return Object.prototype.hasOwnProperty.call(o, t) && (i.setLocale(e), r = i.interpolate(o[t], n), i.setLocale(a)), r
    }, W = function (e) {
      if (l) {
        var t = n.get(l)(e, a);
        return void 0 !== t ? t : e
      }
      return e
    }, H = function (e, t, n, r) {
      var a = v.defer();
      if (e < i.length) {
        var o = i[e];
        Y(o, t, n, r).then(a.resolve, function () {
          H(e + 1, t, n, r).then(a.resolve)
        })
      } else a.resolve(W(t));
      return a.promise
    }, G = function (e, t, n, r) {
      var a;
      if (e < i.length) {
        var o = i[e];
        a = z(o, t, n, r), a || (a = G(e + 1, t, n, r))
      }
      return a
    }, K = function (e, t, n) {
      return H(N > 0 ? N : S, e, t, n)
    }, X = function (e, t, n) {
      return G(N > 0 ? N : S, e, t, n)
    }, Q = function (e, t, n) {
      var r = v.defer(), o = a ? g[a] : g, s = n ? F[n] : O;
      if (o && Object.prototype.hasOwnProperty.call(o, e)) {
        var c = o[e];
        "@:" === c.substr(0, 2) ? B(c.substr(2), t, n).then(r.resolve, r.reject) : r.resolve(s.interpolate(c, t))
      } else {
        var u;
        l && !$ && (u = W(e)), a && i && i.length ? K(e, t, s).then(function (e) {
          r.resolve(e)
        }, function (e) {
          r.reject(V(e))
        }) : l && !$ && u ? r.resolve(u) : r.reject(V(e))
      }
      return r.promise
    }, Z = function (e, t, n) {
      var r, o = a ? g[a] : g, s = n ? F[n] : O;
      if (o && Object.prototype.hasOwnProperty.call(o, e)) {
        var c = o[e];
        r = "@:" === c.substr(0, 2) ? Z(c.substr(2), t, n) : s.interpolate(c, t)
      } else {
        var u;
        l && !$ && (u = W(e)), a && i && i.length ? (S = 0, r = X(e, t, s)) : r = l && !$ && u ? u : V(e)
      }
      return r
    };
    if (B.preferredLanguage = function (e) {
        return e && P(e), t
      }, B.cloakClassName = function () {
        return x
      }, B.fallbackLanguage = function (e) {
        if (void 0 !== e && null !== e) {
          if (M(e), p && i && i.length)for (var t = 0, n = i.length; n > t; t++)L[i[t]] || (L[i[t]] = U(i[t]));
          B.use(B.use())
        }
        return r ? i[0] : i
      }, B.useFallbackLanguage = function (e) {
        if (void 0 !== e && null !== e)if (e) {
          var t = A(i, e);
          t > -1 && (N = t)
        } else N = 0
      }, B.proposedLanguage = function () {
        return o
      }, B.storage = function () {
        return _
      }, B.use = function (e) {
        if (!e)return a;
        var t = v.defer();
        c.$emit("$translateChangeStart", {language: e});
        var n = D(e);
        return n && (e = n), g[e] || !p || L[e] ? (t.resolve(e), j(e)) : (o = e, L[e] = U(e).then(function (n) {
          k(n.key, n.table), t.resolve(n.key), j(n.key), o === e && (o = void 0)
        }, function (e) {
          o === e && (o = void 0), c.$emit("$translateChangeError", {language: e}), t.reject(e), c.$emit("$translateChangeEnd", {language: e})
        })), t.promise
      }, B.storageKey = function () {
        return R()
      }, B.isPostCompilingEnabled = function () {
        return E
      }, B.refresh = function (e) {
        function t() {
          r.resolve(), c.$emit("$translateRefreshEnd", {language: e})
        }

        function n() {
          r.reject(), c.$emit("$translateRefreshEnd", {language: e})
        }

        if (!p)throw new Error("Couldn't refresh translation table, no loader registered!");
        var r = v.defer();
        if (c.$emit("$translateRefreshStart", {language: e}), e)g[e] ? U(e).then(function (n) {
          k(n.key, n.table), e === a && j(a), t()
        }, n) : n(); else {
          var o = [], s = {};
          if (i && i.length)for (var l = 0, u = i.length; u > l; l++)o.push(U(i[l])), s[i[l]] = !0;
          a && !s[a] && o.push(U(a)), v.all(o).then(function (e) {
            angular.forEach(e, function (e) {
              g[e.key] && delete g[e.key], k(e.key, e.table)
            }), a && j(a), t()
          })
        }
        return r.promise
      }, B.instant = function (e, n, r) {
        if (null === e || angular.isUndefined(e))return e;
        if (angular.isArray(e)) {
          for (var o = {}, s = 0, c = e.length; c > s; s++)o[e[s]] = B.instant(e[s], n, r);
          return o
        }
        if (angular.isString(e) && e.length < 1)return e;
        e && (e = C.apply(e));
        var u, p = [];
        t && p.push(t), a && p.push(a), i && i.length && (p = p.concat(i));
        for (var d = 0, f = p.length; f > d; d++) {
          var h = p[d];
          if (g[h] && "undefined" != typeof g[h][e] && (u = Z(e, n, r)), "undefined" != typeof u)break
        }
        return u || "" === u || (u = O.interpolate(e, n), l && !$ && (u = W(e))), u
      }, B.versionInfo = function () {
        return T
      }, B.loaderCache = function () {
        return m
      }, p && (angular.equals(g, {}) && B.use(B.use()), i && i.length))for (var J = function (e) {
      k(e.key, e.table), c.$emit("$translateChangeEnd", {language: e.key})
    }, et = 0, tt = i.length; tt > et; et++)L[i[et]] = U(i[et]).then(J);
    return B
  }]
}]),angular.module("pascalprecht.translate").factory("$translateDefaultInterpolation", ["$interpolate", function (e) {
  var t, n = {}, i = "default", r = null, a = {
    escaped: function (e) {
      var t = {};
      for (var n in e)Object.prototype.hasOwnProperty.call(e, n) && (t[n] = angular.element("<div></div>").text(e[n]).html());
      return t
    }
  }, o = function (e) {
    var t;
    return t = angular.isFunction(a[r]) ? a[r](e) : e
  };
  return n.setLocale = function (e) {
    t = e
  }, n.getInterpolationIdentifier = function () {
    return i
  }, n.useSanitizeValueStrategy = function (e) {
    return r = e, this
  }, n.interpolate = function (t, n) {
    return r && (n = o(n)), e(t)(n || {})
  }, n
}]),angular.module("pascalprecht.translate").constant("$STORAGE_KEY", "NG_TRANSLATE_LANG_KEY"),angular.module("pascalprecht.translate").directive("translate", ["$translate", "$q", "$interpolate", "$compile", "$parse", "$rootScope", function (e, t, n, i, r, a) {
  return {
    restrict: "AE", scope: !0, compile: function (t, o) {
      var s = o.translateValues ? o.translateValues : void 0, c = o.translateInterpolation ? o.translateInterpolation : void 0, l = t[0].outerHTML.match(/translate-value-+/i), u = "^(.*)(" + n.startSymbol() + ".*" + n.endSymbol() + ")(.*)";
      return function (t, p, d) {
        if (t.interpolateParams = {}, t.preText = "", t.postText = "", d.$observe("translate", function (e) {
            if (angular.equals(e, "") || !angular.isDefined(e)) {
              var i = p.text().match(u);
              angular.isArray(i) ? (t.preText = i[1], t.postText = i[3], t.translationId = n(i[2])(t.$parent)) : t.translationId = p.text().replace(/^\s+|\s+$/g, "")
            } else t.translationId = e
          }), d.$observe("translateDefault", function (e) {
            t.defaultText = e
          }), s && d.$observe("translateValues", function (e) {
            e && t.$parent.$watch(function () {
              angular.extend(t.interpolateParams, r(e)(t.$parent))
            })
          }), l) {
          var f = function (e) {
            d.$observe(e, function (n) {
              t.interpolateParams[angular.lowercase(e.substr(14, 1)) + e.substr(15)] = n
            })
          };
          for (var h in d)Object.prototype.hasOwnProperty.call(d, h) && "translateValue" === h.substr(0, 14) && "translateValues" !== h && f(h)
        }
        var m = function (t, n, r) {
          r || "undefined" == typeof n.defaultText || (t = n.defaultText), p.html(n.preText + t + n.postText);
          var a = e.isPostCompilingEnabled(), s = "undefined" != typeof o.translateCompile, c = s && "false" !== o.translateCompile;
          (a && !s || c) && i(p.contents())(n)
        }, g = function () {
          return s || l ? function () {
            var n = function () {
              t.translationId && t.interpolateParams && e(t.translationId, t.interpolateParams, c).then(function (e) {
                m(e, t, !0)
              }, function (e) {
                m(e, t, !1)
              })
            };
            t.$watch("interpolateParams", n, !0), t.$watch("translationId", n)
          } : function () {
            var n = t.$watch("translationId", function (i) {
              t.translationId && i && e(i, {}, c).then(function (e) {
                m(e, t, !0), n()
              }, function (e) {
                m(e, t, !1), n()
              })
            }, !0)
          }
        }(), v = a.$on("$translateChangeSuccess", g);
        g(), t.$on("$destroy", v)
      }
    }
  }
}]),angular.module("pascalprecht.translate").directive("translateCloak", ["$rootScope", "$translate", function (e, t) {
  return {
    compile: function (n) {
      var i = function () {
        n.addClass(t.cloakClassName())
      }, r = function () {
        n.removeClass(t.cloakClassName())
      }, a = e.$on("$translateChangeEnd", function () {
        r(), a(), a = null
      });
      return i(), function (e, n, a) {
        a.translateCloak && a.translateCloak.length && a.$observe("translateCloak", function (e) {
          t(e).then(r, i)
        })
      }
    }
  }
}]),angular.module("pascalprecht.translate").filter("translate", ["$parse", "$translate", function (e, t) {
  var n = function (n, i, r) {
    return angular.isObject(i) || (i = e(i)(this)), t.instant(n, i, r)
  };
  return n.$stateful = !0, n
}]),define("angular-translate", function () {
}),define("camunda-commons-ui/filter/date/index", ["angular", "moment", "angular-translate"], function (e, t) {
  "use strict";
  var n = e.module("cam.commons.filter.date", ["pascalprecht.translate"]);
  return n.provider("camDateFormat", function () {
    var e = {normal: "LLL", "short": "LL", "long": "LLLL"};
    this.setDateFormat = function (t, n) {
      n = n || "normal", e[n] = t
    }, this.$get = function () {
      return function (t) {
        return t = t || "normal", e[t]
      }
    }
  }), n.config(["$filterProvider", function (e) {
    e.register("camDate", ["$translate", "camDateFormat", function (e, n) {
      return function (e, i) {
        return e ? t(e).format(n(i)) : ""
      }
    }])
  }]), n
}),define("camunda-commons-ui/widgets/variable/cam-variable-validator", ["camunda-bpm-sdk-js-type-utils"], function (e) {
  "use strict";
  return [function () {
    return {
      require: "ngModel", link: function (t, n, i, r) {
        var a = function (t) {
          var n = i.camVariableValidator;
          return -1 !== ["String", "Object", "Null"].indexOf(n) ? r.$setValidity("camVariableValidator", !0) : r.$setValidity("camVariableValidator", e.isType(t, n)), t
        };
        r.$parsers.unshift(a), r.$formatters.push(a), i.$observe("camVariableValidator", function () {
          return a(r.$viewValue)
        })
      }
    }
  }]
}),define("camunda-commons-ui/widgets/index", ["angular", "./inline-field/cam-widget-inline-field", "./search-pill/cam-widget-search-pill", "./search-pill/cam-query-component", "./header/cam-widget-header", "./footer/cam-widget-footer", "./loader/cam-widget-loader", "./debug/cam-widget-debug", "./variable/cam-widget-variable", "./search/cam-widget-search", "./bpmn-viewer/cam-widget-bpmn-viewer", "../filter/date/index", "../directives/index", "../search/index", "./variable/cam-variable-validator", "angular-bootstrap"], function (e, t, n, i, r, a, o, s, c, l, u, p, d, f, h) {
  "use strict";
  var m = e.module("camunda.common.widgets", [p.name, d.name, f.name, "ui.bootstrap"]);
  return m.directive("camWidgetInlineField", t), m.directive("camWidgetSearchPill", n), m.directive("camWidgetHeader", r), m.directive("camWidgetFooter", a), m.directive("camWidgetLoader", o), m.directive("camWidgetDebug", s), m.directive("camWidgetVariable", c), m.directive("camWidgetSearch", l), m.directive("camWidgetBpmnViewer", u), m.directive("camVariableValidator", h), m.filter("camQueryComponent", i), m
}),define("camunda-commons-ui/index", ["angular", "./auth/index", "./util/index", "./pages/index", "./plugin/index", "./directives/index", "./resources/index", "./search/index", "./services/index", "./widgets/index", "./filter/date/index", "angular-bootstrap", "angular-translate"], function (e, t, n, i, r, a, o, s, c, l, u) {
  "use strict";
  return e.module("cam.commons", [t.name, n.name, i.name, r.name, a.name, o.name, s.name, c.name, l.name, u.name, "ui.bootstrap", "pascalprecht.translate"])
}),define("camunda-commons-ui", ["camunda-commons-ui/index"], function (e) {
  return e
}),define("text!pages/process-definition.html", [], function () {
  return '<!-- # CE - camunda-cockpit-ui/client/scripts/pages/process-definition.html -->\n<div class="ctn-fixed-view">\n\n  <div class="ctn-header">\n    <h1>\n      <span class="process-name-prefix">\n        <span>Process</span>\n        <span>definition</span>\n      </span>\n\n      {{ processDefinition.name || processDefinition.key }}\n\n      <span class="badge badge-warning badge-suspended"\n            ng-show="processDefinition.suspended"\n            tooltip="Currently suspended"\n            tooltip-placement="top">\n        <span class="glyphicon glyphicon-pause white"></span>\n      </span>\n    </h1>\n\n    <div class="view-pills" id="cockpit.processDefinition.view"></div>\n  </div>\n\n  <div class="ctn-content-container"\n       ctn-collapsable-parent="sidebar">\n\n    <!-- tool bar -->\n    <div class="ctn-toolbar">\n\n      <!-- Toolbar actions are provided by plugins -->\n      <span ng-repeat="actionProvider in processDefinitionActions">\n        <view provider="actionProvider"\n              vars="processDefinitionVars" />\n      </span>\n    </div>\n\n    <!-- sidebar -->\n    <div class="ctn-column ctn-sidebar ctn-scroll"\n         ctn-collapsable="left">\n\n      <div class="filters"\n           ng-controller="ProcessDefinitionFilterController">\n        <div class="version-filter filter">\n          <span class="name">\n            Version\n          </span>\n          <span ng-if="!instanceStatistics.$loaded"\n                class="glyphicon glyphicon-refresh animate-spin"></span>\n\n          <div class="btn-group dropdown"\n               ng-if="instanceStatistics.$loaded && filterData.allDefinitions.length > 1">\n            <button class="btn btn-default dropdown-toggle"\n                    data-toggle="dropdown">\n              {{ processDefinition.version }} <span class="caret"></span>\n            </button>\n\n            <ul class="dropdown-menu">\n              <li ng-repeat="definition in filterData.allDefinitions">\n                <a ng-href="#/process-definition/{{ definition.id }}">\n                  {{ definition.version }}\n                </a>\n              </li>\n            </ul>\n          </div>\n\n          <span ng-if="instanceStatistics.$loaded && filterData.allDefinitions.length < 2">\n            {{ filterData.allDefinitions.length }}\n          </span>\n        </div>\n\n\n        <div class="process-instances">\n          <label>Running Instances</label>\n          <ul ng-if="instanceStatistics.$loaded">\n            <li>\n              of the selected version:\n              <label>{{ instanceStatistics.current.count }}</label>\n            </li>\n\n            <li>\n              of all versions:\n              <label>{{ instanceStatistics.all.count }}</label>\n            </li>\n          </ul>\n          <span ng-if="!instanceStatistics.$loaded"\n                class="glyphicon glyphicon-refresh animate-spin"></span>\n        </div>\n\n\n        <h5>\n          Filter\n          <div class="btn-group btn-control dropdown">\n            <button class="btn btn-link dropdown-toggle"\n                    data-toggle="dropdown">\n              <span class="glyphicon glyphicon-plus-sign"></span>\n            </button>\n\n            <ul class="dropdown-menu">\n              <li>\n                <a href\n                   ng-click="addVariableFilter()">\n                  by variable\n                </a>\n              </li>\n              <li ng-hide="filterData.businessKey">\n                <a href\n                   ng-click="addBusinessKeyFilter()">\n                  by business key\n                </a>\n              </li>\n              <li ng-hide="filterData.start.length">\n                <a href\n                   ng-click="addStartDateFilter()">\n                  by start date\n                </a>\n              </li>\n            </ul>\n          </div>\n        </h5>\n\n\n        <form name="filterForm"\n              novalidate\n              ng-submit="filterChanged()">\n          <ul class="list-unstyled">\n            <li class="parent-filter filter" ng-if="filterData.parent">\n              <div class="name">\n                Parent\n              </div>\n\n              <div class="search search-text">\n\n                <button class="btn btn-link btn-xs btn-control remove"\n                        ng-click="removeParentFilter()">\n                  <span class="glyphicon glyphicon-remove"></span>\n                </button>\n\n                <a ng-href="#/process-definition/{{ filterData.parent.id }}">\n                  {{ filterData.parent.name || filterData.parent.key }}\n                </a>\n              </div>\n            </li>\n\n            <li class="business-key-filter filter" ng-if="filterData.businessKey">\n              <div class="name">\n                Business Key\n              </div>\n\n              <div class="search">\n                <button class="btn btn-link btn-xs btn-control remove"\n                        ng-click="removeBusinessKeyFilter()">\n                  <span class="glyphicon glyphicon-remove"></span>\n                </button>\n                <input type="text"\n                       required\n                       placeholder="Filter Business Key"\n                       name="businessKey"\n                       class="form-control"\n                       ng-model="filterData.businessKey.value"\n                       ng-change="filterChanged()" />\n              </div>\n\n              <div class="note note-error note-small"\n                   ng-if="filterForm.businessKey.$invalid">\n                Field is required\n              </div>\n            </li>\n\n            <li class="date-filter filter" ng-if="filterData.start.length">\n              <div class="name">\n                Start Date\n              </div>\n\n              <div class="search search-date"\n                   ng-repeat="date in filterData.start">\n                <div class="wrapper">\n                  <select ng-model="date.type"\n                          ng-options="item as item for item in dateTypeItems"\n                          required\n                          class="form-control"\n                          cam-dynamic-name="startDateFilterType{{$index}}"\n                          ng-change="dateFilterTypeChanged(filterForm[\'startDateFilterType0\'], filterForm[\'startDateFilterType1\'])">\n                  </select>\n\n                  <div class="removable-input">\n                    <input type="text"\n                           class="form-control"\n                           date\n                           required\n                           ng-change="filterChanged()"\n                           ng-model="date.value"\n                           cam-dynamic-name="startDateFilterValue{{$index}}" />\n\n                    <button class="btn btn-link btn-xs btn-control remove-date-filter"\n                            ng-click="removeStartDateFilter(date)">\n                      <span class="glyphicon glyphicon-remove"></span>\n                    </button>\n                  </div>\n                </div><!-- / .wrapper -->\n\n                <div class="note note-error note-small"\n                     ng-if="filterForm[\'startDateFilterValue\' + $index].$invalid">\n                  <div ng-show="filterForm[\'startDateFilterValue\' + $index].$error.required">\n                    Field is required.\n                  </div>\n\n                  <div ng-show="filterForm[\'startDateFilterValue\' + $index].$error.date && !filterForm[\'startDateFilterValue\' + $index].$error.required">\n                    Syntax for a date is <code>yyyy-MM-ddTHH:mm:ss</code>.\n                  </div>\n                </div><!-- / .error -->\n\n                <div class="note note-error note-small"\n                     ng-if="filterForm[\'startDateFilterType0\'].$invalid && filterForm[\'startDateFilterType1\'].$invalid">\n                  <div ng-show="filterForm[\'startDateFilterType0\'].$error.dateTypeEqual && filterForm[\'startDateFilterType1\'].$error.dateTypeEqual">\n                    Only the combination <code>after/before</code> is allowed.\n                  </div>\n                </div><!-- / .error -->\n\n                <a class="glyphicon glyphicon-plus-sign pull-right"\n                   tooltip="Add a start date filter"\n                   tooltip-placement="right"\n                   ng-click="addStartDateFilter()"\n                   ng-if="filterData.start.length < 2"></a>\n              </div><!-- ./ ng-repeat -->\n\n            </li>\n\n            <li class="variable-filter filter"\n                ng-if="filterData.variables.length">\n              <div class="name">\n                Variables\n                <a href\n                   ng-click="toggleVariableFilterHelp()"\n                   tooltip-placement="right"\n                   tooltip="Get help on variable filters">\n                  <span class="glyphicon glyphicon-question-sign"></span>\n                </a>\n              </div>\n\n              <div class="search"\n                   ng-repeat="variable in filterData.variables">\n\n                <button class="btn btn-link btn-xs btn-control remove"\n                        ng-click="removeVariableFilter(variable)">\n                  <span class="glyphicon glyphicon-remove"></span>\n                </button>\n\n                <input type="text"\n                       required\n                       class="form-control"\n                       cam-dynamic-name="variableFilter{{$index}}"\n                       placeholder="Filter Variable"\n                       ng-model="variable.value"\n                       ng-change="filterChanged()"\n                       process-variable />\n\n                <div class="note note-error note-small"\n                     ng-show="filterForm[\'variableFilter\' + $index].$invalid">\n                  <div ng-show="filterForm[\'variableFilter\' + $index].$error.required">\n                    Field is required.\n                  </div>\n                  <div ng-show="filterForm[\'variableFilter\' + $index].$error.processVariableFilter && !filterForm[\'variableFilter\' + $index].$error.required">\n                    Syntax for variable filters is <code>variableName OPERATOR value</code>.\n                    <a href\n                       ng-show="!showVariableFilterHelp" ng-click="toggleVariableFilterHelp()">\n                      Learn more.\n                    </a>\n                  </div>\n                </div>\n              </div>\n\n              <a tooltip="Add a variable filter"\n                 tooltip-placement="right"\n                 class="pull-right glyphicon glyphicon-plus-sign"\n                 ng-click="addVariableFilter()">\n              </a>\n\n              <div class="note"\n                   ng-show="showVariableFilterHelp">\n                <h5>\n                  Variable filter syntax\n                  <a ng-click="toggleVariableFilterHelp()">hide</a>\n                </h5>\n\n                <div>\n                  Filters on variables must be specified as\n                  <code>variableName OPERATOR value</code> where <code>OPERATOR</code> may be any of\n                  <span ng-repeat="op in operators">\n                    <span ng-show="$index > 0">, </span>\n                    <code>{{ op }}</code>\n                  </span>.\n                  <br/>\n                  All variable filters are applied using the logical <code>AND</code>.\n                  Strings must be properly enclosed in <code>""</code>.\n                  <br/>\n                  <br/>\n                  Samples:  <code>customerId = 1212</code>,\n                            <code>name like "%Walter"</code>,\n                            <code>checked = true</code>\n                </div>\n              </div>\n            </li>\n\n            <li class="activity-filter filter"\n                ng-if="filterData.activities.length">\n              <div class="name">\n                Activity\n              </div>\n\n              <div class="search search-text"\n                   ng-repeat="activity in filterData.activities">\n                <button class="btn btn-link btn-xs btn-control remove"\n                        ng-click="removeActivityFilter(activity)">\n                  <span class="glyphicon glyphicon-remove"></span>\n                </button>\n                {{ activity.name }}\n              </div>\n            </li>\n          </ul>\n        </form>\n\n        <div class="footer"\n             ng-show="filterChanged.$loading">\n          <span class="glyphicon glyphicon-refresh animate-spin"></span> refreshing…\n        </div>\n      </div>\n\n      <a class="hide-collapsable pull-right"></a>\n    </div>\n\n    <div class="ctn-column ctn-content"\n         ctn-collapsable-parent="tabs">\n\n      <!-- content top pane -->\n      <div class="ctn-row ctn-content-top">\n        <div process-diagram="processDiagram"\n             on-element-click="handleBpmnElementSelection(id, $event)"\n             selection="filter"\n             process-data="processData"\n             provider-component="cockpit.processDefinition.diagram.overlay"></div>\n      </div>\n\n      <!-- content bottom pane -->\n      <div class="ctn-row ctn-content-bottom ctn-tabbed"\n           ctn-collapsable="bottom">\n        <div ng-show="processDefinitionTabs.length">\n          <ul class="nav nav-tabs">\n            <li ng-class="{ active: selectedTab == tabProvider }"\n                ng-repeat="tabProvider in processDefinitionTabs">\n              <a href ng-click="selectTab(tabProvider)">{{ tabProvider.label }}</a>\n            </li>\n          </ul>\n\n          <div class="ctn-tabbed-content ctn-scroll">\n            <view provider="selectedTab"\n                  vars="processDefinitionVars" />\n          </div>\n        </div>\n      </div>\n\n      <a class="show-collapsable"></a>\n    </div>\n  </div>\n\n</div><!-- end .ctn-fixed-view -->\n<!-- / CE - camunda-cockpit-ui/client/scripts/pages/process-definition.html -->\n'
}),define("pages/processDefinition", ["angular", "cockpit/util/routeUtil", "angular-data-depend", "camunda-commons-ui", "text!./process-definition.html"], function (e, t, n, i, r) {
  "use strict";
  var a = e.module("cam.cockpit.pages.processDefinition", [n.name, i.name]), o = ["$scope", "$rootScope", "search", "ProcessDefinitionResource", "ProcessInstanceResource", "Views", "Data", "Transform", "Variables", "dataDepend", "processDefinition", "page", function (t, n, i, r, a, o, s, c, l, u, p, d) {
    function f(t, n) {
      var i = [];
      return e.forEach(t, function (e) {
        try {
          var t = n(e);
          void 0 !== t && i.push(t)
        } catch (r) {
        }
      }), i
    }

    function h(n) {
      if (b !== n) {
        var i = n.activityIds, r = null, a = !1;
        i && i.length && (r = i[i.length - 1]), n.scrollToBpmnElement !== r && (a = !0), n != b && g(n), t.filter = b = e.extend({}, n, {scrollToBpmnElement: r}), a && y.set("filter", b), g(b)
      }
    }

    function m() {
      function e(e) {
        return e ? e.split(/,/) : []
      }

      function t(e) {
        return f(e, l.parse)
      }

      function n(e) {
        var t = e.startedAfter, n = e.startedBefore, i = [];
        return t && i.push({type: "after", value: t}), n && i.push({type: "before", value: n}), i
      }

      var r, a = i(), o = e(a.activityIds);
      return r = {
        activityIds: o,
        parentProcessDefinitionId: a.parentProcessDefinitionId,
        businessKey: a.businessKey,
        variables: t(e(a.variables)),
        start: n(a),
        page: parseInt(a.page) || void 0
      }
    }

    function g(e) {
      function t(e) {
        return e && e.length
      }

      function n(e, t) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          if (i.type === t)return i.value
        }
        return null
      }

      var r = e.businessKey, a = e.activityIds, o = e.parentProcessDefinitionId, s = e.variables, c = e.start;
      i.updateSilently({
        businessKey: r || null,
        activityIds: t(a) ? a.join(",") : null,
        variables: t(s) ? f(s, l.toString).join(",") : null,
        parentProcessDefinitionId: o || null,
        startedAfter: t(c) ? n(c, "after") : null,
        startedBefore: t(c) ? n(c, "before") : null
      }), b = e
    }

    function v(e) {
      var n = i().detailsTab;
      if (e && e.length) {
        if (n) {
          var r = o.getProvider({component: "cockpit.processDefinition.runtime.tab", id: n});
          if (r && -1 != e.indexOf(r))return void(t.selectedTab = r)
        }
        i.updateSilently({detailsTab: null}), t.selectedTab = e[0]
      }
    }

    var y = t.processData = u.create(t);
    t.$on("$routeChanged", function () {
      y.set("filter", m()), v(t.processInstanceTabs)
    });
    var b = null;
    y.provide("processDefinition", p), y.provide("filter", m()), y.provide("parentId", ["filter", function (e) {
      return e.parentProcessDefinitionId
    }]), y.provide("parent", ["parentId", function (e) {
      return e ? r.get({id: e}).$promise : null
    }]), y.provide("instances.all", ["processDefinition", function (e) {
      return a.count({processDefinitionKey: e.key}).$promise
    }]), y.provide("instances.current", ["processDefinition", function (e) {
      return a.count({processDefinitionId: e.id}).$promise
    }]), y.provide("bpmn20Xml", ["processDefinition", function (e) {
      return r.getBpmn20Xml({id: e.id}).$promise
    }]), y.provide("parsedBpmn20", ["bpmn20Xml", function (e) {
      return c.transformBpmn20Xml(e.bpmn20Xml)
    }]), y.provide("bpmnElements", ["parsedBpmn20", function (e) {
      return e.bpmnElements
    }]), y.provide("bpmnDefinition", ["parsedBpmn20", function (e) {
      return e.definitions
    }]), y.provide("allProcessDefinitions", ["processDefinition", function (e) {
      return r.query({key: e.key, sortBy: "version", sortOrder: "asc"}).$promise
    }]), y.provide("processDiagram", ["bpmnDefinition", "bpmnElements", function (n, i) {
      var r = t.processDiagram = t.processDiagram || {};
      return e.extend(r, {bpmnDefinition: n, bpmnElements: i}), r
    }]), n.showBreadcrumbs = !0, t.breadcrumbData = y.observe(["processDefinition", "parent"], function (e, t) {
      d.breadcrumbsClear(), t && d.breadcrumbsAdd({
        type: "processDefinition",
        label: t.name || t.id,
        href: "#/process-definition/" + t.id + "/runtime",
        processDefinition: t
      }), d.breadcrumbsAdd({
        type: "processDefinition",
        label: e.name || e.key || e.id,
        href: "#/process-definition/" + e.id + "/runtime",
        processDefinition: e
      }), d.titleSet(["camunda Cockpit", e.name || e.key || e.id, "Definition View"].join(" | "))
    }), t.instanceStatistics = y.observe(["instances.all", "instances.current"], function (e, n) {
      t.instanceStatistics.all = e, t.instanceStatistics.current = n
    }), t.processDiagramData = y.observe("processDiagram", function (e) {
      t.processDiagram = e
    }), y.observe("filter", h), t.handleBpmnElementSelection = function (t, n) {
      var i = e.copy(b), r = n.ctrlKey, a = e.copy(i.activityIds) || [], o = a.indexOf(t), s = -1 !== o;
      t ? r ? s ? a.splice(o, 1) : a.push(t) : a = [t] : a = null, i.activityIds = a, y.set("filter", i)
    }, t.processDefinition = p, t.processDefinitionVars = {read: ["processDefinition", "selection", "processData", "filter"]}, t.processDefinitionTabs = o.getProviders({component: "cockpit.processDefinition.runtime.tab"}), t.processDefinitionActions = o.getProviders({component: "cockpit.processDefinition.runtime.action"}), s.instantiateProviders("cockpit.processDefinition.data", {
      $scope: t,
      processData: y
    });
    for (var w = o.getProviders({component: "cockpit.processDefinition.runtime.tab"}).concat(o.getProviders({component: "cockpit.processDefinition.runtime.action"})).concat(o.getProviders({component: "cockpit.processDefinition.view"})).concat(o.getProviders({component: "cockpit.processDefinition.diagram.overlay"})).concat(o.getProviders({component: "cockpit.jobDefinition.action"})), x = {
      processDefinition: p,
      processData: y
    }, E = 0; E < w.length; E++)"function" == typeof w[E].initialize && w[E].initialize(x);
    t.selectTab = function (e) {
      t.selectedTab = e, i.updateSilently({detailsTab: e.id})
    }, v(t.processDefinitionTabs)
  }], s = ["$scope", "$filter", "debounce", "Variables", function (t, n, i, r) {
    function a(t) {
      var n = [];
      return e.forEach(t, function (e) {
        n.push({value: e})
      }), n
    }

    function o(t, n) {
      var i = [];
      return e.forEach(t, function (e) {
        i.push({id: e, name: n[e].name || e})
      }), i
    }

    function s(t) {
      return e.copy(t) || []
    }

    var c, l = t.processData.newChild(t), u = n("date"), p = "yyyy-MM-dd'T'HH:mm:ss";
    t.dateTypeItems = ["after", "before"], l.provide("filterData", ["processDefinition", "allProcessDefinitions", "filter", "parent", "bpmnElements", function (e, t, n, i, r) {
      return c && c.filter == n ? c : {
        definition: e,
        allDefinitions: t,
        businessKey: n.businessKey ? {value: n.businessKey} : null,
        parent: i,
        filter: n,
        variables: a(n.variables),
        activities: o(n.activityIds, r),
        start: s(n.start)
      }
    }]), l.observe(["filterData"], function (e) {
      t.filterData = c = e
    }), t.operators = r.operators, t.filterChanged = i(function () {
      if (!t.filterForm.$invalid) {
        var n = c.variables, i = c.activities, r = c.parent, a = c.businessKey, o = c.start, s = [], u = [], p = [], d = {};
        a && (d.businessKey = a.value), e.forEach(n, function (e) {
          e.value && s.push(e.value)
        }), s.length && (d.variables = s), e.forEach(o, function (e) {
          e.value && ("after" === e.type ? p.push({
            type: "after",
            value: e.value
          }) : "before" === e.type && p.push({type: "before", value: e.value}))
        }), d.start = p, r && (d.parentProcessDefinitionId = r.id), e.forEach(i, function (e) {
          u.push(e.id)
        }), u.length && (d.activityIds = u), c.filter = d, l.set("filter", d)
      }
    }, 2e3), t.toggleVariableFilterHelp = function () {
      t.showVariableFilterHelp = !t.showVariableFilterHelp
    }, t.addVariableFilter = function () {
      c.variables.push({})
    }, t.addBusinessKeyFilter = function () {
      c.businessKey = {}
    }, t.addStartDateFilter = function () {
      var e = u(Date.now(), p), n = c.start = c.start || [];
      if (n && !n.length)n.push({type: "after", value: e}); else {
        if (1 !== n.length)return;
        var i = "after" === n[0].type ? "before" : "after";
        n.push({type: i, value: e})
      }
      t.filterChanged()
    }, t.removeBusinessKeyFilter = function () {
      c.businessKey = null, t.filterChanged()
    }, t.removeParentFilter = function () {
      c.parent = null, t.filterChanged()
    }, t.removeVariableFilter = function (e) {
      var n = c.variables, i = n.indexOf(e);
      -1 !== i && n.splice(i, 1), t.filterChanged()
    }, t.removeActivityFilter = function (e) {
      var n = c.activities, i = n.indexOf(e);
      -1 !== i && n.splice(i, 1), t.filterChanged()
    }, t.removeStartDateFilter = function (e) {
      var n = c.start, i = n.indexOf(e);
      -1 !== i && n.splice(i, 1), t.filterChanged()
    }, t.dateFilterTypeChanged = function (e, n) {
      e && n && (e.$modelValue === n.$modelValue ? (e.$setValidity("dateTypeEqual", !1), n.$setValidity("dateTypeEqual", !1)) : (e.$setValidity("dateTypeEqual", !0), n.$setValidity("dateTypeEqual", !0))), t.filterChanged()
    }
  }], c = ["$routeProvider", function (e) {
    e.when("/process-definition/:id", {redirectTo: t.redirectToRuntime}).when("/process-definition/:id/runtime", {
      template: r,
      controller: o,
      authentication: "required",
      resolve: {
        processDefinition: ["ResourceResolver", "ProcessDefinitionResource", function (e, t) {
          return e.getByRouteParam("id", {
            name: "process definition", resolve: function (e) {
              return t.get({id: e})
            }
          })
        }]
      },
      reloadOnSearch: !1
    })
  }], l = ["ViewsProvider", function (e) {
    e.registerDefaultView("cockpit.processDefinition.view", {
      id: "runtime",
      priority: 20,
      label: "Runtime",
      keepSearchParams: ["parentProcessDefinitionId", "businessKey", "variables", "startedAfter", "startedBefore"]
    })
  }];
  return a.controller("ProcessDefinitionFilterController", s).config(c).config(l), a
}),define("text!pages/process-instance.html", [], function () {
  return '<!-- # CE - camunda-cockpit-ui/client/scripts/pages/process-instance.html -->\n<div class="ctn-fixed-view">\n  <div class="ctn-header">\n    <h1>\n      <span class="process-name-prefix">\n        <span>Process</span>\n        <span>instance</span>\n      </span>\n\n      {{ processDefinition.name || processDefinition.key }}\n\n      <span title="Process instance id, as it appears in the database">\n        &lt;{{ processInstance.id }}&gt;\n      </span>\n\n      <span ng-show="processInstance.businessKey.length > 0"\n            title="Business key of the process instance">\n        &lt;{{ processInstance.businessKey}}&gt;\n      </span>\n\n      <span class="badge badge-warning badge-suspended"\n            ng-show="processInstance.suspended"\n            tooltip="Currently suspended"\n            tooltip-placement="top">\n        <span class="glyphicon glyphicon-pause white"></span>\n      </span>\n    </h1>\n\n    <div class="view-pills"\n         id="cockpit.processInstance.view"></div>\n  </div>\n\n  <div class="ctn-content-container"\n       ctn-collapsable-parent="sidebar">\n\n    <!-- toolbar -->\n    <div class="ctn-toolbar">\n\n      <!-- Toolbar actions are provided by plugins -->\n      <span ng-repeat="tabProvider in processInstanceActions">\n        <view provider="tabProvider"\n              vars="processInstanceVars" />\n      </span>\n\n    </div>\n\n    <!-- sidebar -->\n    <div class="ctn-column ctn-sidebar ctn-scroll"\n         ctn-collapsable="left">\n\n      <div class="filters"\n           ng-controller="ProcessInstanceFilterController">\n        <h5>\n          Filter\n\n          <button class="btn btn-sm btn-link btn-control btn-control-link"\n                  tooltip="The activity instance tree with all currently selected activity instances. You may change the selection via (CTRL +) click.">\n            <span class="glyphicon glyphicon-question-sign"></span>\n          </button>\n        </h5>\n\n        <div cam-quick-filter\n             name-filter\n             holder-selector=".instance-tree"\n             label-selector=".tree-node-label"\n             item-selector=".tree-node-group">\n        </div>\n\n        <div class="filter">\n          <button class="btn btn-link btn-xs btn-control"\n                  ng-show="filterData.activityInstanceCount"\n                  ng-click="clearSelection()">\n            <span class="glyphicon glyphicon-remove"></span>\n          </button>\n\n          <ng-pluralize count="filterData.activityInstanceCount"\n                        when="{ \'null\' : \'Nothing\',\n                                \'0\': \'Nothing\',\n                                \'one\': \'1 activity instance\',\n                                \'other\': \'{{ filterData.activityInstanceCount }} activity instances\'}">\n          </ng-pluralize>\n\n          selected\n        </div>\n\n\n        <div class="filter instance-tree">\n          <div activity-instance-tree="activityInstanceTree"\n               selection="filter"\n               on-element-click="handleActivityInstanceSelection(id, activityId, $event)"\n               order-children-by="orderChildrenBy()">\n          </div>\n        </div>\n      </div>\n\n      <a class="hide-collapsable pull-right"></a>\n    </div>\n\n    <div class="ctn-column ctn-content"\n         ctn-collapsable-parent="tabs">\n\n      <!-- content top pane -->\n      <div class="ctn-row ctn-content-top">\n        <div process-diagram="processDiagram"\n             on-element-click="handleBpmnElementSelection(id, $event)"\n             selection="filter"\n             process-data="processData"\n             page-data="pageData"\n             provider-component="cockpit.processInstance.diagram.overlay"></div>\n      </div>\n\n      <!-- content bottom pane -->\n      <div class="ctn-row ctn-content-bottom ctn-tabbed"\n           ctn-collapsable="bottom">\n        <div ng-show="processInstanceTabs.length">\n          <ul class="nav nav-tabs">\n            <li ng-class="{ active: selectedTab == tabProvider }"\n                ng-repeat="tabProvider in processInstanceTabs">\n              <a href\n                 ng-click="selectTab(tabProvider)">{{ tabProvider.label }}</a>\n            </li>\n          </ul>\n\n          <div class="ctn-tabbed-content ctn-scroll">\n            <view provider="selectedTab"\n                  vars="processInstanceVars" />\n          </div>\n        </div>\n      </div>\n\n      <a class="show-collapsable"></a>\n    </div>\n  </div>\n\n</div><!-- end .ctn-fixed-view -->\n<!-- / CE - camunda-cockpit-ui/client/scripts/pages/process-instance.html -->\n'
}),define("pages/processInstance", ["require", "angular", "cockpit/util/routeUtil", "camunda-commons-ui", "angular-data-depend", "text!./process-instance.html"], function (e, t, n, i, r, a) {
  "use strict";
  var o = t.module("cam.cockpit.pages.processInstance", [i.name, r.name]), s = ["$scope", "$filter", "$rootScope", "search", "ProcessDefinitionResource", "ProcessInstanceResource", "IncidentResource", "Views", "Data", "Transform", "processInstance", "dataDepend", "page", "breadcrumbTrails", function (e, n, i, r, a, o, s, c, l, u, p, d, f, h) {
    function m() {
      function t(e) {
        return e ? e.split(/,/) : []
      }

      var n = r(), i = t(n.activityInstanceIds), a = t(n.activityIds);
      return e.filter = w = {activityIds: a, activityInstanceIds: i, page: parseInt(n.page, 10) || void 0}, w
    }

    function g(t) {
      function n(e) {
        return e && e.length
      }

      var i = t.activityIds, a = t.activityInstanceIds;
      r.updateSilently({
        activityIds: n(i) ? i.join(",") : null,
        activityInstanceIds: n(a) ? a.join(",") : null
      }), e.filter = w = t
    }

    function v(n, i, r) {
      var a, o, s = n.activityIds || [], c = n.activityInstanceIds || [], l = parseInt(n.page, 10) || null, u = n.scrollToBpmnElement, p = n !== w;
      if (t.forEach(c, function (e) {
          var t = i[e] || {}, n = t.activityId || t.targetActivityId, r = s.indexOf(n);
          -1 === r && (s.push(n), a = !0)
        }), t.forEach(s, function (e) {
          var t = r[e], n = !1, i = [];
          if (t) {
            for (var o, s = 0; o = t[s]; s++) {
              var l = c.indexOf(o.id);
              if (-1 !== l) {
                n = !0;
                break
              }
              i.push(o.id)
            }
            n || (c = c.concat(i), a = !0)
          }
        }), s.length > 0) {
        var d = s[s.length - 1];
        d !== u && (u = d, a = !0)
      }
      o = {
        activityIds: s,
        activityInstanceIds: c,
        scrollToBpmnElement: u,
        page: l
      }, a = !t.equals(o, n), a && (e.filter = w = o, x.set("filter", w)), p && g(w)
    }

    function y(e, t) {
      o.query({subProcessInstance: e.id}).$promise.then(function (e) {
        var n = e[0];
        t(null, n)
      })
    }

    function b(e) {
      var t = r().detailsTab;
      if (e && e.length) {
        if (t) {
          var n = c.getProvider({component: "cockpit.processInstance.runtime.tab", id: t});
          if (n && -1 != e.indexOf(n))return n
        }
        return e[0]
      }
    }

    e.processInstance = p;
    var w, x = e.processData = d.create(e), E = e.pageData = d.create(e);
    e.$on("$routeChanged", function () {
      x.set("filter", m())
    }), x.provide("processInstance", p), x.provide("filter", m()), x.provide("processDefinition", ["processInstance", function (e) {
      return a.get({id: e.definitionId}).$promise
    }]), x.provide("bpmn20Xml", ["processDefinition", function (e) {
      return a.getBpmn20Xml({id: e.id}).$promise
    }]), x.provide("parsedBpmn20", ["bpmn20Xml", function (e) {
      return u.transformBpmn20Xml(e.bpmn20Xml)
    }]), x.provide("bpmnElements", ["parsedBpmn20", function (e) {
      return e.bpmnElements
    }]), x.provide("bpmnDefinition", ["parsedBpmn20", function (e) {
      return e.definitions
    }]), x.provide("activityInstances", ["processInstance", function (e) {
      return o.activityInstances({id: e.id}).$promise
    }]), x.provide(["activityInstanceTree", "activityIdToInstancesMap", "instanceIdToInstanceMap"], ["activityInstances", "processDefinition", "bpmnElements", function (e, t, i) {
      function r(e) {
        var t = e.name;
        if (!t) {
          var i = n("shorten");
          t = e.$type.substr(5) + " (" + i(e.id, 8) + ")"
        }
        return t
      }

      function a(e) {
        var t = e.childActivityInstances;
        if (t && t.length > 0)for (var n, c = 0; n = t[c]; c++) {
          var l = n.activityId, u = i[l], p = o[l] || [];
          n.name = u ? r(u) : l, n.isTransitionInstance = !1, o[l] = p, s[n.id] || (s[n.id] = n), p.push(n), a(n)
        }
        var d = e.childTransitionInstances;
        if (d && d.length > 0)for (var f, h = 0; f = d[h]; h++) {
          var m = f.targetActivityId, g = i[m], v = o[m] || [];
          f.name = g ? r(g) : m, f.isTransitionInstance = !0, o[m] = v, s[f.id] || (s[f.id] = f), v.push(f)
        }
      }

      var o = {}, s = {}, c = i[t.key];
      return e.name = r(c), s[e.id] = e, a(e), [e, o, s]
    }]), x.provide("executionIdToInstanceMap", ["instanceIdToInstanceMap", function (e) {
      var t = {};
      for (var n in e) {
        var i = e[n], r = i.executionIds, a = i.executionId;
        if (r)for (var o, s = 0; o = r[s]; s++)t[o] = i;
        a && (t[a] = i)
      }
      return t
    }]), x.provide("incidents", ["processInstance", function (e) {
      return s.query({processInstanceId: e.id}).$promise
    }]), x.provide("activityIdToIncidentsMap", ["incidents", function (e) {
      for (var t, n = {}, i = 0; t = e[i]; i++) {
        var r = n[t.activityId];
        r || (r = [], n[t.activityId] = r), r.push(t)
      }
      return n
    }]), x.provide("processDiagram", ["bpmnDefinition", "bpmnElements", function (e, t) {
      var n = {};
      return n.bpmnDefinition = e, n.bpmnElements = t, n
    }]), x.observe(["filter", "instanceIdToInstanceMap", "activityIdToInstancesMap"], v), e.processDefinition = x.observe("processDefinition", function (t) {
      e.processDefinition = t
    }), x.provide("superProcessInstanceCount", ["processInstance", function (e) {
      return o.count({subProcessInstance: e.id}).$promise
    }]), i.showBreadcrumbs = !0, x.observe(["processDefinition", "processInstance", "superProcessInstanceCount"], function (t, n, i) {
      var r = [];
      i.count && r.push(function (e) {
        h(n, y, [], e, "runtime")
      }), r.push({
        label: t.name || (t.key || t.id).slice(0, 8) + "…",
        href: "#/process-definition/" + t.id + "/runtime"
      }), r.push({
        divider: ":",
        label: n.name || (n.key || n.id).slice(0, 8) + "…",
        href: "#/process-instance/" + n.id + "/runtime"
      }), f.breadcrumbsClear().breadcrumbsAdd(r), f.titleSet(["camunda Cockpit", e.processDefinition.name || e.processDefinition.id, "Instance View"].join(" | "))
    }), e.activityInstanceTree = x.observe("activityInstanceTree", function (t) {
      e.activityInstanceTree = t
    }), e.processDiagram = x.observe("processDiagram", function (t) {
      e.processDiagram = t
    }), x.observe(["instanceIdToInstanceMap", "activityIdToInstancesMap"], function (t, n) {
      e.instanceIdToInstanceMap = t, e.activityIdToInstancesMap = n
    }), e.handleBpmnElementSelection = function (n, i) {
      if (!n)return void x.set("filter", {});
      var r, a = i.ctrlKey, o = t.copy(w.activityIds) || [], s = t.copy(w.activityInstanceIds) || [], c = o.indexOf(n), l = e.activityIdToInstancesMap[n];
      a ? a && (-1 === c ? (o.push(n), t.forEach(l, function (e) {
        s.push(e.id)
      })) : -1 !== c && (o.splice(c, 1), t.forEach(l, function (e) {
        var t = e.id, n = s.indexOf(t);
        -1 !== n && s.splice(n, 1)
      }))) : (o = [n], s = [], t.forEach(l, function (e) {
        s.push(e.id)
      })), r = {activityIds: o, activityInstanceIds: s}, x.set("filter", r)
    }, e.handleActivityInstanceSelection = function (n, i, r) {
      if (!n)return void x.set("filter", {});
      var a, o = r.ctrlKey, s = t.copy(w.activityIds) || [], c = t.copy(w.activityInstanceIds) || [], l = c.indexOf(n), u = e.activityIdToInstancesMap[i];
      if (o) {
        if (o)if (-1 === l) {
          c.push(n);
          var p = s.indexOf(i);
          -1 === p && s.push(i)
        } else {
          c.splice(l, 1);
          var d = !1;
          if (u)for (var f, h = 0; f = u[h]; h++) {
            var m = f.id, g = c.indexOf(m);
            -1 !== g && (d = !0)
          }
          if (!d) {
            var v = s.indexOf(i);
            s.splice(v, 1)
          }
        }
      } else s = [i], c = [n];
      a = {activityIds: s, activityInstanceIds: c, scrollToBpmnElement: i}, x.set("filter", a)
    }, e.orderChildrenBy = function () {
      return function (e) {
        var t = e.id, n = t.indexOf(":");
        return -1 !== n ? t.substr(n + 1, t.length) : t
      }
    }, e.$on("$routeChangeStart", function () {
      f.breadcrumbsClear()
    }), e.processInstanceVars = {read: ["processInstance", "processData", "filter", "pageData"]};
    var _ = c.getProviders({component: "cockpit.processInstance.runtime.tab"});
    e.processInstanceActions = c.getProviders({component: "cockpit.processInstance.runtime.action"}), l.instantiateProviders("cockpit.processInstance.data", {
      $scope: e,
      processData: x
    });
    for (var T = c.getProviders({component: "cockpit.processInstance.runtime.tab"}).concat(c.getProviders({component: "cockpit.processInstance.runtime.action"})).concat(c.getProviders({component: "cockpit.processInstance.view"})).concat(c.getProviders({component: "cockpit.processInstance.diagram.overlay"})), S = {
      processInstance: p,
      processData: x,
      filter: w,
      pageData: E
    }, A = 0; A < T.length; A++)"function" == typeof T[A].initialize && T[A].initialize(S);
    E.provide("tabs", _), E.provide("activeTab", b(_)), E.observe(["tabs"], function (t) {
      e.processInstanceTabs = t, E.set("activeTab", b(t))
    }), E.observe("activeTab", function (t) {
      e.selectedTab = t, r.updateSilently({detailsTab: t && t.id || null})
    }), e.selectTab = function (e) {
      E.set("activeTab", e)
    }
  }];
  o.controller("ProcessInstanceFilterController", ["$scope", function (e) {
    var t, n = e.processData.newChild(e);
    n.provide("filterData", ["filter", function (e) {
      if (t && t.filter == e)return t;
      var n = e.activityIds || [], i = e.activityInstanceIds || [];
      return {filter: e, activityCount: n.length || 0, activityInstanceCount: i.length || 0}
    }]), n.observe(["filterData"], function (n) {
      e.filterData = t = n
    }), e.clearSelection = function () {
      t = {activityCount: 0, activityInstanceCount: 0, filter: {}}, n.set("filter", t.filter)
    }
  }]);
  var c = ["$routeProvider", function (e) {
    e.when("/process-instance/:id", {redirectTo: n.redirectToRuntime}), e.when("/process-instance/:id/runtime", {
      template: a,
      controller: s,
      authentication: "required",
      resolve: {
        processInstance: ["ResourceResolver", "ProcessInstanceResource", function (e, t) {
          return e.getByRouteParam("id", {
            name: "process instance", resolve: function (e) {
              return t.get({id: e})
            }
          })
        }]
      },
      reloadOnSearch: !1
    })
  }], l = ["ViewsProvider", function (e) {
    e.registerDefaultView("cockpit.processInstance.view", {id: "runtime", priority: 20, label: "Runtime"})
  }];
  return o.config(c).config(l), o
}),define("pages/main", ["angular", "./dashboard", "./processDefinition", "./processInstance"], function (e, t, n, i) {
  "use strict";
  var r = e.module("cam.cockpit.pages", [n.name, i.name]);
  return r.config(t), r
}),define("pages", ["pages/main"], function (e) {
  return e
}),define("resources/processDefinitionResource", [], function () {
  "use strict";
  var e = ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/process-definition/:id/:action"), {id: "@id"}, {
      queryStatistics: {
        method: "GET",
        isArray: !0,
        params: {id: "statistics"}
      },
      queryActivityStatistics: {method: "GET", isArray: !0, params: {action: "statistics"}},
      getBpmn20Xml: {method: "GET", params: {action: "xml"}, cache: !0}
    })
  }];
  return e
}),define("resources/incidentResource", [], function () {
  "use strict";
  var e = ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/incident/:action"), {}, {
      count: {
        method: "GET",
        isArray: !1,
        params: {count: "count"}
      }
    })
  }];
  return e
}),define("resources/processInstanceResource", [], function () {
  "use strict";
  return ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/process-instance/:id/:action"), {id: "@id"}, {
      query: {
        method: "POST",
        isArray: !0
      },
      count: {method: "POST", isArray: !1, params: {id: "count"}},
      activityInstances: {method: "GET", isArray: !1, params: {action: "activity-instances"}}
    })
  }]
}),define("resources/localExecutionVariableResource", [], function () {
  "use strict";
  var e = ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/execution/:executionId/localVariables/:localVariableName"), {}, {updateVariables: {method: "POST"}})
  }];
  return e
}),define("resources/jobResource", [], function () {
  "use strict";
  var e = ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/job/:id/:action"), {id: "@id"}, {
      query: {method: "POST", isArray: !0},
      count: {method: "POST", isArray: !1, params: {id: "count"}},
      setRetries: {method: "PUT", params: {action: "retries"}}
    })
  }];
  return e
}),define("resources/taskResource", [], function () {
  "use strict";
  var e = ["$resource", "Uri", function (e, t) {
    var n = t.appUri("engine://engine/:engine/task/:id/:action/:subAction"), i = {id: "@id"};
    return e(n, i, {
      query: {method: "POST", isArray: !0},
      count: {method: "POST", isArray: !1, params: {id: "count"}},
      getIdentityLinks: {method: "GET", isArray: !0, params: {action: "identity-links"}},
      addIdentityLink: {method: "POST", params: {action: "identity-links"}},
      deleteIdentityLink: {method: "POST", params: {action: "identity-links", subAction: "delete"}},
      setAssignee: {method: "POST", params: {action: "assignee"}}
    })
  }];
  return e
}),define("resources/jobDefinitionResource", [], function () {
  "use strict";
  var e = ["$resource", "Uri", function (e, t) {
    return e(t.appUri("engine://engine/:engine/job-definition/:id/:action"), {id: "@id"}, {
      query: {
        method: "POST",
        isArray: !0
      },
      count: {method: "POST", isArray: !1, params: {id: "count"}},
      setRetries: {method: "PUT", params: {action: "retries"}}
    })
  }];
  return e
}),define("resources/main", ["angular", "camunda-commons-ui/util/index", "./processDefinitionResource", "./incidentResource", "./processInstanceResource", "./localExecutionVariableResource", "./jobResource", "./taskResource", "./jobDefinitionResource"], function (e, t, n, i, r, a, o, s, c) {
  "use strict";
  var l = e.module("cam.cockpit.resources", []);
  return l.factory("ProcessDefinitionResource", n), l.factory("IncidentResource", i), l.factory("ProcessInstanceResource", r), l.factory("LocalExecutionVariableResource", a), l.factory("JobResource", o), l.factory("TaskResource", s), l.factory("JobDefinitionResource", c), l
}),define("resources", ["resources/main"], function (e) {
  return e
}),define("services/transform", ["bpmn-io"], function (e) {
  "use strict";
  var t = ["$q", function (t) {
    return {
      transformBpmn20Xml: function (n) {
        var i = t.defer();
        e.prototype.options = {};
        var r = e.prototype.createModdle();
        return r.fromXML(n, "bpmn:Definitions", function (e, t, n) {
          i.resolve({definitions: t, bpmnElements: n.elementsById})
        }), i.promise
      }
    }
  }];
  return t
}),define("services/variables", [], function () {
  "use strict";
  var e = [function () {
    function e(e) {
      var t = {};
      for (var n in e)t[e[n]] = n;
      return t
    }

    function t(e) {
      var t = [];
      for (var n in e)t.push(n);
      return t
    }

    function n(e) {
      return a[e]
    }

    function i(e) {
      if (/^".*"\s*$/.test(e))return e.substring(1, e.length - 1);
      if (parseFloat(e) + "" === e)return parseFloat(e);
      if ("true" === e || "false" === e)return "true" === e;
      throw new Error("Cannot infer type of value " + e)
    }

    function r(e) {
      if (!e)return e;
      if ("string" == typeof e)return '"' + e + '"';
      if ("boolean" == typeof e)return e ? "true" : "false";
      if ("number" == typeof e)return e;
      throw new Error("Cannot infer type of value " + e)
    }

    var a = {
      eq: "=",
      neq: "!=",
      gt: ">",
      gteq: ">=",
      lt: "<",
      lteq: "<=",
      like: " like "
    }, o = e(a), s = new RegExp("^(\\w+)\\s*(" + t(o).join("|") + ")\\s*([^!=<>]+)$");
    return {
      parse: function (e) {
        var t, n = s.exec(e);
        if (!n)throw new Error("Invalid variable syntax: " + e);
        return t = i(n[3]), {name: n[1], operator: o[n[2]], value: t}
      }, toString: function (e) {
        return e ? e.name + n(e.operator) + r(e.value) : ""
      }, operators: t(o)
    }
  }];
  return e
}),define("services/page", ["angular"], function (e) {
  "use strict";
  return ["$rootScope", function (t) {
    var n = {title: "camunda", breadcrumbs: []}, i = e.element("head title");
    return t.$on("page.title.changed", function () {
      i.text(n.title)
    }), {
      titleSet: function (e) {
        return n.title = e, t.$broadcast("page.title.changed", n.title), this
      }, titleGet: function () {
        return n.title
      }, breadcrumbsAdd: function (i) {
        if (e.isArray(i))return e.forEach(i, this.breadcrumbsAdd);
        if (e.isFunction(i)) {
          var r = i;
          i = {callback: r}
        }
        return i.label = i.label || "…", n.breadcrumbs.push(i), t.$broadcast("page.breadcrumbs.changed", n.breadcrumbs), this
      }, breadcrumbsInsertAt: function (i, r) {
        return n.breadcrumbs = n.breadcrumbs.slice(0, i).concat(e.isArray(r) ? r : [r]).concat(n.breadcrumbs.slice(i + 1)), t.$broadcast("page.breadcrumbs.changed", n.breadcrumbs), this
      }, breadcrumbsGet: function (e) {
        return e ? ("last" === e && (e = n.length - 1), n.breadcrumbs[e]) : n.breadcrumbs
      }, breadcrumbsClear: function () {
        return n.breadcrumbs = [], t.$broadcast("page.breadcrumbs.changed", n.breadcrumbs), this
      }
    }
  }]
}),define("services/breadcrumbTrails", [], function () {
  "use strict";
  return ["ProcessDefinitionResource", "page", function (e, t) {
    function n(i, r, a, o, s) {
      function c(i, c) {
        return c ? void e.get({id: c.processDefinitionId || c.definitionId}).$promise.then(function (e) {
          var t = e;
          a = [{href: "#/process-definition/" + t.id + (s ? "/" + s : ""), label: t.name || t.key}, {
            divider: ":",
            href: "#/process-instance/" + c.id + (s ? "/" + s : ""),
            label: c.id.slice(0, 8) + "…"
          }].concat(a), n(c, r, a, o, s)
        }) : void t.breadcrumbsInsertAt(o, a)
      }

      a = a || [], r(i, c)
    }

    return n
  }]
}),define("services/main", ["angular", "./transform", "./variables", "./page", "./breadcrumbTrails"], function (e, t, n, i, r) {
  "use strict";
  var a = e.module("cam.cockpit.services", []);
  return a.factory("Transform", t), a.factory("Variables", n), a.service("page", i), a.factory("breadcrumbTrails", r), a
}),define("services", ["services/main"], function (e) {
  return e
}),!function (e) {
  if ("object" == typeof exports && "undefined" != typeof module)module.exports = e(); else if ("function" == typeof define && define.amd)define("camunda-bpm-sdk-js", [], e); else {
    var t;
    "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.CamSDK = e()
  }
}(function () {
  var define, module, exports;
  return function e(t, n, i) {
    function r(o, s) {
      if (!n[o]) {
        if (!t[o]) {
          var c = "function" == typeof require && require;
          if (!s && c)return c(o, !0);
          if (a)return a(o, !0);
          throw new Error("Cannot find module '" + o + "'")
        }
        var l = n[o] = {exports: {}};
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return r(n ? n : e)
        }, l, l.exports, e, t, n, i)
      }
      return n[o].exports
    }

    for (var a = "function" == typeof require && require, o = 0; o < i.length; o++)r(i[o]);
    return r
  }({
    1: [function (_dereq_, module, exports) {
      "use strict";
      var CamundaForm = _dereq_("./../../forms/camunda-form"), angular = window.angular, $ = CamundaForm.$, constants = _dereq_("./../../forms/constants"), CamundaFormAngular = CamundaForm.extend({
        renderForm: function () {
          function e(e, t) {
            var n = $(t);
            if (!n.attr("ng-model")) {
              var i = n.attr(constants.DIRECTIVE_CAM_VARIABLE_NAME);
              i && n.attr("ng-model", i)
            }
          }

          var t = this;
          CamundaForm.prototype.renderForm.apply(this, arguments);
          for (var n = 0; n < this.formFieldHandlers.length; n++) {
            var i = this.formFieldHandlers[n], r = i.selector;
            $(r, t.formElement).each(e)
          }
          var a = t.formElement.injector();
          if (a) {
            var o = t.formElement.scope();
            a.invoke(["$compile", function (e) {
              e(t.formElement)(o)
            }])
          }
        }, executeFormScript: function (script) {
          var injector = this.formElement.injector(), scope = this.formElement.scope();
          !function (camForm, $scope) {
            var inject = function (e) {
              if (!angular.isFunction(e) && !angular.isArray(e))throw new Error("Must call inject(array|fn)");
              injector.instantiate(e, {$scope: scope})
            };
            eval(script)
          }(this, scope)
        }, fireEvent: function () {
          var e = this, t = arguments, n = this.formElement.scope(), i = function () {
            CamundaForm.prototype.fireEvent.apply(e, t)
          }, r = e.formElement.injector();
          r && r.invoke(["$rootScope", function (e) {
            var t = e.$$phase;
            "$apply" !== t && "$digest" !== t ? n.$apply(function () {
              i()
            }) : i()
          }])
        }
      });
      module.exports = CamundaFormAngular
    }, {"./../../forms/camunda-form": 25, "./../../forms/constants": 26}], 2: [function (e, t) {
      "use strict";
      var n = window.angular, i = e("./camunda-form-angular"), r = e("./../../forms/type-util").isType, a = n.module("cam.embedded.forms", []);
      a.directive("camVariableName", ["$rootScope", function (e) {
        return {
          require: "ngModel", link: function (t, n, i, r) {
            n.on("camFormVariableApplied", function (n, i) {
              var a = e.$$phase;
              "$apply" !== a && "$digest" !== a ? t.$apply(function () {
                r.$setViewValue(i)
              }) : r.$setViewValue(i)
            })
          }
        }
      }]), a.directive("camVariableType", [function () {
        return {
          require: "ngModel", link: function (e, t, n, i) {
            var a = function (e) {
              var a = n.camVariableType;
              return i.$setValidity("camVariableType", !0), (e || e === !1 || "Bytes" === a) && (i.$pristine && (i.$pristine = !1, i.$dirty = !0, t.addClass("ng-dirty"), t.removeClass("ng-pristine")), -1 !== ["Boolean", "String", "Bytes"].indexOf(a) || r(e, a) || i.$setValidity("camVariableType", !1), "file" === n.type && "Bytes" === a && t[0].files && t[0].files[0] && t[0].files[0].size > (n.camMaxFilesize || 5e6) && i.$setValidity("camVariableType", !1)), e
            };
            i.$parsers.unshift(a), i.$formatters.push(a), n.$observe("camVariableType", function () {
              return a(i.$viewValue)
            }), t.bind("change", function () {
              a(i.$viewValue), e.$apply()
            })
          }
        }
      }]), t.exports = i
    }, {"./../../forms/type-util": 31, "./camunda-form-angular": 1}], 3: [function (e, t) {
      t.exports = {Client: e("./../api-client"), Form: e("./forms"), utils: e("./../utils")}
    }, {"./../api-client": 6, "./../utils": 33, "./forms": 2}], 4: [function (e, t) {
      "use strict";
      function n() {
      }

      var i = e("./../events"), r = e("./../base-class"), a = r.extend({
        initialize: function () {
          this.http = this.constructor.http
        }
      }, {
        path: "", http: {}, create: function () {
        }, list: function (e, t) {
          "function" == typeof e && (t = e, e = {}), e = e || {}, t = t || n;
          var i = this, r = {count: 0, items: []};
          return this.http.get(this.path + "/count", {
            data: e, done: function (n, a) {
              return n ? (i.trigger("error", n), t(n)) : (r.count = a.count, void i.http.get(i.path, {
                data: e,
                done: function (n, a) {
                  return n ? (i.trigger("error", n), t(n)) : (r.items = a, r.firstResult = parseInt(e.firstResult || 0, 10), r.maxResults = r.firstResult + parseInt(e.maxResults || 10, 10), i.trigger("loaded", r), void t(n, r))
                }
              }))
            }
          })
        }, update: function () {
        }, "delete": function () {
        }
      });
      i.attach(a), t.exports = a
    }, {"./../base-class": 23, "./../events": 24}], 5: [function (e, t) {
      (function (n) {
        "use strict";
        function i(e, t) {
          return function (n, i) {
            return n || !i.ok && !i.noContent ? (n = n || i.error || new Error("The " + i.req.method + " request on " + i.req.url + " failed"), i.body && i.body.message && (n.message = i.body.message), e.trigger("error", n), t(n)) : ("application/hal+json" === i.type && (i.body && 0 !== Object.keys(i.body).length || (i.body = JSON.parse(i.text)), i.body = o.solveHALEmbedded(i.body)), void t(null, i.body ? i.body : i.text ? i.text : ""))
          }
        }

        var r = e("superagent"), a = e("./../events"), o = e("./../utils"), s = function () {
        }, c = function (e) {
          if (e = e || {}, !e.baseUrl)throw new Error("HttpClient needs a `baseUrl` configuration property.");
          a.attach(this), this.config = e
        };
        c.prototype.post = function (e, t) {
          t = t || {};
          var a = t.done || s, o = this, c = this.config.baseUrl + (e ? "/" + e : ""), l = r.post(c);
          if ("undefined" != typeof n)Object.keys(t.fields || {}).forEach(function (e) {
            l.field(e, t.fields[e])
          }), (t.attachments || []).forEach(function (e) {
            l.attach("data", new n(e.content), {filename: e.name})
          }); else if (t.fields || t.attachments)return a(new Error("Multipart request is only supported in node.js environement."));
          l.set("Accept", "application/hal+json, application/json; q=0.5").send(t.data || {}).query(t.query || {}), l.end(i(o, a))
        }, c.prototype.get = function (e, t) {
          var n = this.config.baseUrl + (e ? "/" + e : "");
          return this.load(n, t)
        }, c.prototype.load = function (e, t) {
          t = t || {};
          var n = t.done || s, a = this, o = t.accept || "application/hal+json, application/json; q=0.5", c = r.get(e).set("Accept", o).query(t.data || {});
          c.end(i(a, n))
        }, c.prototype.put = function (e, t) {
          t = t || {};
          var n = t.done || s, a = this, o = this.config.baseUrl + (e ? "/" + e : ""), c = r.put(o).set("Accept", "application/hal+json, application/json; q=0.5").send(t.data || {});
          c.end(i(a, n))
        }, c.prototype.del = function (e, t) {
          t = t || {};
          var n = t.done || s, a = this, o = this.config.baseUrl + (e ? "/" + e : ""), c = r.del(o).set("Accept", "application/hal+json, application/json; q=0.5").send(t.data || {});
          c.end(i(a, n))
        }, c.prototype.options = function (e, t) {
          t = t || {};
          var n = t.done || s, a = this, o = this.config.baseUrl + (e ? "/" + e : ""), c = r("OPTIONS", o).set("Accept", "application/hal+json, application/json; q=0.5");
          c.end(i(a, n))
        }, t.exports = c
      }).call(this, e("buffer").Buffer)
    }, {"./../events": 24, "./../utils": 33, buffer: 34, superagent: 38}], 6: [function (e, t) {
      "use strict";
      function n(e) {
        if (!e)throw new Error("Needs configuration");
        if (!e.apiUri)throw new Error("An apiUri is required");
        i.attach(this), e.engine = e.engine || "default", e.mock = "undefined" != typeof e.mock ? e.mock : !0, e.resources = e.resources || {}, this.HttpClient = e.HttpClient || n.HttpClient, this.baseUrl = e.apiUri, "/" !== this.baseUrl.slice(-1) && (this.baseUrl += "/"), this.baseUrl += "engine/" + e.engine, this.config = e, this.initialize()
      }

      var i = e("./../events");
      n.HttpClient = e("./http-client"), function (t) {
        t.config = {};
        var n = {};
        t.initialize = function () {
          function t(e) {
            i.trigger("error", e)
          }

          n.authorization = e("./resources/authorization"), n.deployment = e("./resources/deployment"), n.filter = e("./resources/filter"), n.history = e("./resources/history"), n["process-definition"] = e("./resources/process-definition"), n["process-instance"] = e("./resources/process-instance"), n.task = e("./resources/task"), n.variable = e("./resources/variable"), n["case-execution"] = e("./resources/case-execution"), n["case-instance"] = e("./resources/case-instance"), n["case-definition"] = e("./resources/case-definition"), n.user = e("./resources/user"), n.group = e("./resources/group"), n.incident = e("./resources/incident"), n.job = e("./resources/job"), n.metrics = e("./resources/metrics");
          var i = this;
          this.http = new this.HttpClient({baseUrl: this.baseUrl});
          var r, a, o, s;
          for (r in n) {
            a = {
              name: r,
              mock: this.config.mock,
              baseUrl: this.baseUrl,
              headers: {}
            }, o = this.config.resources[r] || {};
            for (s in o)a[s] = o[s];
            n[r].http = new this.HttpClient(a), n[r].http.on("error", t)
          }
        }, t.resource = function (e) {
          return n[e]
        }
      }(n.prototype), t.exports = n
    }, {
      "./../events": 24,
      "./http-client": 5,
      "./resources/authorization": 7,
      "./resources/case-definition": 8,
      "./resources/case-execution": 9,
      "./resources/case-instance": 10,
      "./resources/deployment": 11,
      "./resources/filter": 12,
      "./resources/group": 13,
      "./resources/history": 14,
      "./resources/incident": 15,
      "./resources/job": 16,
      "./resources/metrics": 17,
      "./resources/process-definition": 18,
      "./resources/process-instance": 19,
      "./resources/task": 20,
      "./resources/user": 21,
      "./resources/variable": 22
    }], 7: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "authorization", i.list = function (e, t) {
        return this.http.get(this.path, {data: e, done: t})
      }, i.get = function (e, t) {
        return this.http.get(this.path + "/" + e, {done: t})
      }, i.create = function (e, t) {
        return this.http.post(this.path + "/create", {data: e, done: t})
      }, i.update = function (e, t) {
        return this.http.put(this.path + "/" + e.id, {data: e, done: t})
      }, i.save = function (e, t) {
        return i[e.id ? "update" : "create"](e, t)
      }, i["delete"] = function (e, t) {
        return this.http.del(this.path + "/" + e, {done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 8: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "case-definition", i.list = function (e, t) {
        return this.http.get(this.path, {data: e, done: t})
      }, i.create = function (e, t, n) {
        this.http.post(this.path + "/" + e + "/create", {data: t, done: n})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 9: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "case-execution", i.list = function (e, t) {
        return this.http.get(this.path, {
          data: e, done: function (e, n) {
            return e ? t(e) : void t(null, n)
          }
        })
      }, i.disable = function (e, t, n) {
        this.http.post(this.path + "/" + e + "/disable", {data: t, done: n})
      }, i.reenable = function (e, t, n) {
        this.http.post(this.path + "/" + e + "/reenable", {data: t, done: n})
      }, i.manualStart = function (e, t, n) {
        this.http.post(this.path + "/" + e + "/manual-start", {data: t, done: n})
      }, i.complete = function (e, t, n) {
        this.http.post(this.path + "/" + e + "/complete", {data: t, done: n})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 10: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "case-instance", i.list = function (e, t) {
        return this.http.get(this.path, {data: e, done: t})
      }, i.close = function (e, t, n) {
        this.http.post(this.path + "/" + e + "/close", {data: t, done: n})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 11: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "deployment", i.create = function (e, t) {
        var n = {"deployment-name": e.deploymentName}, i = Array.isArray(e.files) ? e.files : [e.files];
        return e.enableDuplicateFiltering && (n["enable-duplicate-filtering"] = "true"), e.deployChangedOnly && (n["deploy-changed-only"] = "true"), this.http.post(this.path + "/create", {
          data: {},
          fields: n,
          attachments: i,
          done: t
        })
      }, i.list = function () {
        n.list.apply(this, arguments)
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 12: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "filter", i.get = function (e, t) {
        return this.http.get(this.path + "/" + e, {done: t})
      }, i.list = function (e, t) {
        return this.http.get(this.path, {data: e, done: t})
      }, i.getTasks = function (e, t) {
        var n = this.path + "/";
        return "string" == typeof e ? (n = n + e + "/list", e = {}) : (n = n + e.id + "/list", delete e.id), n += "?firstResult=" + (e.firstResult || 0), n += "&maxResults=" + (e.maxResults || 15), this.http.post(n, {
          data: e,
          done: t
        })
      }, i.create = function (e, t) {
        return this.http.post(this.path + "/create", {data: e, done: t})
      }, i.update = function (e, t) {
        return this.http.put(this.path + "/" + e.id, {data: e, done: t})
      }, i.save = function (e, t) {
        return i[e.id ? "update" : "create"](e, t)
      }, i["delete"] = function (e, t) {
        return this.http.del(this.path + "/" + e, {done: t})
      }, i.authorizations = function (e, t) {
        return 1 === arguments.length ? this.http.options(this.path, {done: e}) : this.http.options(this.path + "/" + e, {done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 13: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "group", i.create = function (e, t) {
        return this.http.post(this.path + "/create", {
          data: e, done: t || function () {
          }
        })
      }, i.count = function (e, t) {
        1 === arguments.length ? (t = e, e = {}) : e = e || {}, this.http.get(this.path + "/count", {
          data: e,
          done: t || function () {
          }
        })
      }, i.get = function (e, t) {
        var n = "string" == typeof e ? e : e.id;
        this.http.get(this.path + "/" + n, {
          data: e, done: t || function () {
          }
        })
      }, i.list = function (e, t) {
        this.http.get(this.path, {
          data: e, done: t || function () {
          }
        })
      }, i.createMember = function (e, t) {
        return this.http.put(this.path + "/" + e.id + "/members/" + e.userId, {
          data: e, done: t || function () {
          }
        })
      }, i.deleteMember = function (e, t) {
        return this.http.del(this.path + "/" + e.id + "/members/" + e.userId, {
          data: e, done: t || function () {
          }
        })
      }, i.update = function (e, t) {
        return this.http.put(this.path + "/" + e.id, {
          data: e, done: t || function () {
          }
        })
      }, i["delete"] = function (e, t) {
        return this.http.del(this.path + "/" + e.id, {
          data: e, done: t || function () {
          }
        })
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 14: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "history", i.userOperation = function (e, t) {
        return arguments.length < 2 && (t = arguments[0], e = {}), this.http.get(this.path + "/user-operation", {
          data: e,
          done: t
        })
      }, i.processInstance = function (e, t) {
        arguments.length < 2 && (t = arguments[0], e = {});
        var n = {}, i = {}, r = ["firstResult", "maxResults"];
        for (var a in e)r.indexOf(a) > -1 ? i[a] = e[a] : n[a] = e[a];
        return this.http.post(this.path + "/process-instance", {data: n, query: i, done: t})
      }, i.processInstanceCount = function (e, t) {
        return arguments.length < 2 && (t = arguments[0], e = {}), this.http.post(this.path + "/process-instance/count", {
          data: e,
          done: t
        })
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 15: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "incident", i.get = function (e, t) {
        this.http.get(this.path, {data: e, done: t})
      }, i.count = function (e, t) {
        this.http.get(this.path + "/count", {data: e, done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 16: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "job", i.list = function (e, t) {
        var n = this.path;
        return n += "?firstResult=" + (e.firstResult || 0), e.maxResults && (n += "&maxResults=" + e.maxResults), this.http.post(n, {
          data: e,
          done: t
        })
      }, i.setRetries = function (e, t) {
        return this.http.put(this.path + "/" + e.id + "/retries", {data: e, done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 17: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "metrics", i.sum = function (e, t) {
        var n = this.path + "/" + e.name + "/sum";
        return delete e.name, this.http.get(n, {data: e, done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 18: [function (e, t) {
      "use strict";
      function n() {
      }

      var i = e("./../abstract-client-resource"), r = i.extend({
        suspend: function (e, t) {
          return "function" == typeof e && (t = e, e = {}), e = e || {}, t = t || n, this.http.post(this.path, {done: t})
        }, stats: function (e) {
          return this.http.post(this.path, {done: e || n})
        }, start: function (e) {
          return this.http.post(this.path, {data: {}, done: e})
        }
      }, {
        path: "process-definition", get: function (e, t) {
          return this.http.get(this.path + "/" + e, {done: t})
        }, getByKey: function (e, t) {
          return this.http.get(this.path + "/key/" + e, {done: t})
        }, list: function () {
          i.list.apply(this, arguments)
        }, formVariables: function (e, t) {
          var n = "";
          if (e.key)n = "key/" + e.key; else {
            if (!e.id)return t(new Error("Process definition task variables needs either a key or an id."));
            n = e.id
          }
          var i = {deserializeValues: e.deserializeValues};
          return e.names && (i.variableNames = (e.names || []).join(",")), this.http.get(this.path + "/" + n + "/form-variables", {
            data: i,
            done: t || function () {
            }
          })
        }, submitForm: function (e, t) {
          var n = "";
          if (e.key)n = "key/" + e.key; else {
            if (!e.id)return t(new Error("Process definition task variables needs either a key or an id."));
            n = e.id
          }
          return this.http.post(this.path + "/" + n + "/submit-form", {
            data: {
              businessKey: e.businessKey,
              variables: e.variables
            }, done: t || function () {
            }
          })
        }, startForm: function (e, t) {
          var i = this.path + "/" + (e.key ? "key/" + e.key : e.id) + "/startForm";
          return this.http.get(i, {done: t || n})
        }, xml: function (e, t) {
          var i = this.path + "/" + (e.id ? e.id : "key/" + e.key) + "/xml";
          return this.http.get(i, {done: t || n})
        }, submit: function (e, t) {
          var n = this.path;
          return n += e.key ? "/key/" + e.key : "/" + e.id, n += "/submit-form", this.http.post(n, {data: e, done: t})
        }, suspend: function (e, t, i) {
          return "function" == typeof t && (i = t, t = {}), t = t || {}, i = i || n, e = Array.isArray(e) ? e : [e], this.http.post(this.path, {done: i})
        }, start: function (e, t) {
          return this.http.post(this.path + "/" + (e.id ? e.id : "key/" + e.key) + "/start", {data: e, done: t})
        }
      });
      t.exports = r
    }, {"./../abstract-client-resource": 4}], 19: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend({}, {
        path: "process-instance", create: function (e, t) {
          return this.http.post(e, t)
        }, list: function () {
          n.list.apply(this, arguments)
        }, modify: function (e, t) {
          this.http.post(this.path + "/" + e.id + "/modification", {
            data: {
              instructions: e.instructions,
              skipCustomListeners: e.skipCustomListeners,
              skipIoMappings: e.skipIoMappings
            }, done: t
          })
        }
      });
      t.exports = i
    }, {"./../abstract-client-resource": 4}], 20: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "task", i.list = function (e, t) {
        return this.http.get(this.path, {
          data: e, done: function (e, n) {
            if (e)return t(e);
            var i = n._embedded.task || n._embedded.tasks, r = n._embedded.processDefinition;
            for (var a in i) {
              var o = i[a];
              o._embedded = o._embedded || {};
              for (var s in r)if (r[s].id === o.processDefinitionId) {
                o._embedded.processDefinition = [r[s]];
                break
              }
            }
            t(null, n)
          }
        })
      }, i.get = function (e, t) {
        return this.http.get(this.path + "/" + e, {done: t})
      }, i.comments = function (e, t) {
        return this.http.get(this.path + "/" + e + "/comment", {done: t})
      }, i.identityLinks = function (e, t) {
        return this.http.get(this.path + "/" + e + "/identity-links", {done: t})
      }, i.identityLinksAdd = function (e, t, n) {
        return this.http.post(this.path + "/" + e + "/identity-links", {data: t, done: n})
      }, i.identityLinksDelete = function (e, t, n) {
        return this.http.post(this.path + "/" + e + "/identity-links/delete", {data: t, done: n})
      }, i.createComment = function (e, t, n) {
        return this.http.post(this.path + "/" + e + "/comment/create", {data: {message: t}, done: n})
      }, i.create = function (e, t) {
        return this.http.post(this.path + "/create", {data: e, done: t})
      }, i.update = function (e, t) {
        return this.http.put(this.path + "/" + e.id, {data: e, done: t})
      }, i.assignee = function (e, t, n) {
        var i = {userId: t};
        return 2 === arguments.length && (e = arguments[0].taskId, i.userId = arguments[0].userId, n = arguments[1]), this.http.post(this.path + "/" + e + "/assignee", {
          data: i,
          done: n
        })
      }, i.delegate = function (e, t, n) {
        var i = {userId: t};
        return 2 === arguments.length && (e = arguments[0].taskId, i.userId = arguments[0].userId, n = arguments[1]), this.http.post(this.path + "/" + e + "/delegate", {
          data: i,
          done: n
        })
      }, i.claim = function (e, t, n) {
        var i = {userId: t};
        return 2 === arguments.length && (e = arguments[0].taskId, i.userId = arguments[0].userId, n = arguments[1]), this.http.post(this.path + "/" + e + "/claim", {
          data: i,
          done: n
        })
      }, i.unclaim = function (e, t) {
        return "string" != typeof e && (e = e.taskId), this.http.post(this.path + "/" + e + "/unclaim", {done: t})
      }, i.submitForm = function (e, t) {
        return e.id ? this.http.post(this.path + "/" + e.id + "/submit-form", {
          data: {variables: e.variables},
          done: t || function () {
          }
        }) : t(new Error("Task submitForm needs a task id."))
      }, i.formVariables = function (e, t) {
        var n = "";
        if (e.key)n = "key/" + e.key; else {
          if (!e.id)return t(new Error("Task variables needs either a key or an id."));
          n = e.id
        }
        var i = {deserializeValues: e.deserializeValues};
        return e.names && (i.variableNames = e.names.join(",")), this.http.get(this.path + "/" + n + "/form-variables", {
          data: i,
          done: t || function () {
          }
        })
      }, i.form = function (e, t) {
        return this.http.get(this.path + "/" + e + "/form", {done: t})
      }, i.localVariable = function (e, t) {
        return this.http.put(this.path + "/" + e.id + "/localVariables/" + e.varId, {data: e, done: t})
      }, i.localVariables = function (e, t) {
        return this.http.get(this.path + "/" + e + "/localVariables", {done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 21: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "user", i.create = function (e, t) {
        e = e || {};
        var n = ["id", "firstName", "lastName", "password"];
        for (var i in n) {
          var r = n[i];
          if (!e[r])return t(new Error("Missing " + r + " option to create user"))
        }
        var a = {
          profile: {id: e.id, firstName: e.firstName, lastName: e.lastName},
          credentials: {password: e.password}
        };
        return e.email && (a.profile.email = e.email), this.http.post(this.path + "/create", {
          data: a,
          done: t || function () {
          }
        })
      }, i.list = function (e, t) {
        1 === arguments.length ? (t = e, e = {}) : e = e || {}, this.http.get(this.path, {
          data: e,
          done: t || function () {
          }
        })
      }, i.count = function (e, t) {
        1 === arguments.length ? (t = e, e = {}) : e = e || {}, this.http.get(this.path + "/count", {
          data: e,
          done: t || function () {
          }
        })
      }, i.profile = function (e, t) {
        var n = "string" == typeof e ? e : e.id;
        this.http.del(this.path + "/" + n + "/profile", {
          done: t || function () {
          }
        })
      }, i.updateProfile = function (e, t) {
        return e = e || {}, e.id ? void this.http.put(this.path + "/" + e.id + "/profile", {
          data: e,
          done: t || function () {
          }
        }) : t(new Error("Missing id option to update user profile"))
      }, i.updateCredentials = function (e, t) {
        if (e = e || {}, !e.id)return t(new Error("Missing id option to update user credentials"));
        if (!e.password)return t(new Error("Missing password option to update user credentials"));
        var n = {password: e.password};
        e.authenticatedUserPassword && (n.authenticatedUserPassword = e.authenticatedUserPassword), this.http.put(this.path + "/" + e.id + "/credentials", {
          data: n,
          done: t || function () {
          }
        })
      }, i["delete"] = function (e, t) {
        var n = "string" == typeof e ? e : e.id;
        this.http.del(this.path + "/" + n, {
          done: t || function () {
          }
        })
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 22: [function (e, t) {
      "use strict";
      var n = e("./../abstract-client-resource"), i = n.extend();
      i.path = "variable-instance", i.instances = function (e, t) {
        this.http.post(this.path, {data: e, done: t})
      }, t.exports = i
    }, {"./../abstract-client-resource": 4}], 23: [function (e, t) {
      "use strict";
      function n() {
      }

      function i() {
        this.initialize()
      }

      var r = e("./events");
      i.extend = function (e, t) {
        e = e || {}, t = t || {};
        var n, i, r, a, o = this;
        n = e && Object.hasOwnProperty.call(o, "constructor") ? e.constructor : function () {
          return o.apply(this, arguments)
        };
        for (r in o)n[r] = o[r];
        for (r in t)n[r] = t[r];
        i = function () {
          this.constructor = n
        }, i.prototype = o.prototype, n.prototype = new i;
        for (a in e)n.prototype[a] = e[a];
        return n
      }, i.prototype.initialize = n, r.attach(i), t.exports = i
    }, {"./events": 24}], 24: [function (e, t) {
      "use strict";
      function n(e) {
        var t, n = [];
        for (t in e)n.push(e[t]);
        return n
      }

      function i(e) {
        var t, n = !1;
        return function () {
          return n ? t : (n = !0, t = e.apply(this, arguments), e = null, t)
        }
      }

      function r(e, t) {
        e._events = e._events || {}, e._events[t] = e._events[t] || []
      }

      var a = {};
      a.attach = function (e) {
        e.on = this.on, e.once = this.once, e.off = this.off, e.trigger = this.trigger, e._events = {}
      }, a.on = function (e, t) {
        return r(this, e), this._events[e].push(t), this
      }, a.once = function (e, t) {
        var n = this, r = i(function () {
          n.off(e, i), t.apply(this, arguments)
        });
        return r._callback = t, this.on(e, r)
      }, a.off = function (e, t) {
        if (r(this, e), !t)return delete this._events[e], this;
        var n, i = [];
        for (n in this._events[e])this._events[e][n] !== t && i.push(this._events[e][n]);
        return this._events[e] = i, this
      }, a.trigger = function () {
        var e = n(arguments), t = e.shift();
        r(this, t);
        var i;
        for (i in this._events[t])this._events[t][i](this, e);
        return this
      }, t.exports = a
    }, {}], 25: [function (_dereq_, module, exports) {
      "use strict";
      function CamundaForm(e) {
        if (!e)throw new Error("CamundaForm need to be initialized with options.");
        var t = e.done = e.done || function (e) {
            if (e)throw e
          };
        return this.client = e.client ? e.client : new CamSDK.Client(e.clientConfig || {}), e.taskId || e.processDefinitionId || e.processDefinitionKey ? (this.taskId = e.taskId, this.processDefinitionId = e.processDefinitionId, this.processDefinitionKey = e.processDefinitionKey, this.formElement = e.formElement, this.containerElement = e.containerElement, this.formUrl = e.formUrl, this.formElement || this.containerElement ? this.formElement || this.formUrl ? (this.variableManager = new VariableManager({client: this.client}), this.formFieldHandlers = e.formFieldHandlers || [InputFieldHandler, ChoicesFieldHandler], this.businessKey = null, this.fields = [], this.scripts = [], this.options = e, Events.attach(this), void this.initialize(t)) : t(new Error("Camunda form needs to be intialized with either 'formElement' or 'formUrl'")) : t(new Error("CamundaForm needs to be initilized with either 'formElement' or 'containerElement'"))) : t(new Error("Cannot initialize Taskform: either 'taskId' or 'processDefinitionId' or 'processDefinitionKey' must be provided"))
      }

      var $ = _dereq_("./dom-lib"), VariableManager = _dereq_("./variable-manager"), InputFieldHandler = _dereq_("./controls/input-field-handler"), ChoicesFieldHandler = _dereq_("./controls/choices-field-handler"), BaseClass = _dereq_("./../base-class"), constants = _dereq_("./constants"), Events = _dereq_("./../events");
      CamundaForm.prototype.initializeHandler = function (e) {
        var t = this, n = e.selector;
        $(n, t.formElement).each(function () {
          t.fields.push(new e(this, t.variableManager))
        })
      }, CamundaForm.prototype.initialize = function (e) {
        e = e || function (e) {
            if (e)throw e
          };
        var t = this;
        if (this.formUrl)this.client.http.load(this.formUrl, {
          accept: "*/*", done: function (n, i) {
            if (n)return e(n);
            try {
              t.renderForm(i), t.initializeForm(e)
            } catch (r) {
              e(r)
            }
          }, data: {noCache: Date.now()}
        }); else try {
          this.initializeForm(e)
        } catch (n) {
          e(n)
        }
      }, CamundaForm.prototype.renderForm = function (e) {
        $(this.containerElement).html("").append('<div class="injected-form-wrapper">' + e + "</div>");
        var t = this.formElement = $("form", this.containerElement);
        if (1 !== t.length)throw new Error("Form must provide exaclty one element <form ..>");
        t.attr("name") || t.attr("name", "$$camForm")
      }, CamundaForm.prototype.initializeForm = function (e) {
        var t = this;
        this.initializeFormScripts(), this.initializeFieldHandlers(), this.executeFormScripts(), this.fireEvent("form-loaded"), this.fetchVariables(function (n, i) {
          if (n)throw n;
          t.mergeVariables(i), t.storeOriginalValues(i), t.fireEvent("variables-fetched"), t.restore(), t.fireEvent("variables-restored"), t.applyVariables(), t.fireEvent("variables-applied"), e(null, t)
        })
      }, CamundaForm.prototype.initializeFieldHandlers = function () {
        for (var e in this.formFieldHandlers)this.initializeHandler(this.formFieldHandlers[e])
      }, CamundaForm.prototype.initializeFormScripts = function () {
        for (var e = $("script[" + constants.DIRECTIVE_CAM_SCRIPT + "]", this.formElement), t = 0; t < e.length; t++)this.scripts.push(e[t].text)
      }, CamundaForm.prototype.executeFormScripts = function () {
        for (var e = 0; e < this.scripts.length; e++)this.executeFormScript(this.scripts[e])
      }, CamundaForm.prototype.executeFormScript = function (script) {
        !function (camForm) {
          eval(script)
        }(this)
      }, CamundaForm.prototype.store = function (e) {
        var t = this.taskId || this.processDefinitionId || this.caseInstanceId;
        if (!t) {
          if ("function" == typeof e)return e(new Error("Cannot determine the storage ID"));
          throw new Error("Cannot determine the storage ID")
        }
        if (this.storePrevented = !1, this.fireEvent("store"), !this.storePrevented) {
          try {
            this.retrieveVariables();
            var n = {date: Date.now(), vars: {}};
            for (var i in this.variableManager.variables)"Bytes" !== this.variableManager.variables[i].type && (n.vars[i] = this.variableManager.variables[i].value);
            localStorage.setItem("camForm:" + t, JSON.stringify(n))
          } catch (r) {
            if ("function" == typeof e)return e(r);
            throw r
          }
          this.fireEvent("variables-stored"), "function" == typeof e && e()
        }
      }, CamundaForm.prototype.isRestorable = function () {
        var e = this.taskId || this.processDefinitionId || this.caseInstanceId;
        if (!e)throw new Error("Cannot determine the storage ID");
        if (!localStorage.getItem("camForm:" + e))return !1;
        var t = localStorage.getItem("camForm:" + e);
        try {
          t = JSON.parse(t)
        } catch (n) {
          return !1
        }
        return t && Object.keys(t).length ? !0 : !1
      }, CamundaForm.prototype.restore = function (e) {
        var t, n = this.variableManager.variables, i = this.taskId || this.processDefinitionId || this.caseDefinitionId;
        if (!i) {
          if ("function" == typeof e)return e(new Error("Cannot determine the storage ID"));
          throw new Error("Cannot determine the storage ID")
        }
        if (this.isRestorable()) {
          try {
            t = localStorage.getItem("camForm:" + i), t = JSON.parse(t).vars
          } catch (r) {
            if ("function" == typeof e)return e(r);
            throw r
          }
          for (var a in t)n[a] ? n[a].value = t[a] : n[a] = {name: a, value: t[a]};
          "function" == typeof e && e()
        } else if ("function" == typeof e)return e()
      }, CamundaForm.prototype.submit = function (e) {
        var t = this.taskId || this.processDefinitionId;
        if (this.submitPrevented = !1, this.fireEvent("submit"), !this.submitPrevented) {
          try {
            this.retrieveVariables()
          } catch (n) {
            return e(n)
          }
          var i = this;
          this.transformFiles(function () {
            localStorage.removeItem("camForm:" + t), i.submitVariables(function (t, n) {
              return t ? (i.fireEvent("submit-failed", t), e(t)) : (i.fireEvent("submit-success"), void e(null, n))
            })
          })
        }
      }, CamundaForm.prototype.transformFiles = function (e) {
        var t = this, n = 1, i = function () {
          0 === --n && e()
        }, r = function (e) {
          if (0 === e)return "0 Byte";
          var t = 1e3, n = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], i = Math.floor(Math.log(e) / Math.log(t));
          return (e / Math.pow(t, i)).toPrecision(3) + " " + n[i]
        };
        for (var a in this.fields) {
          var o = this.fields[a].element[0];
          if ("file" === o.getAttribute("type"))if ("function" == typeof FileReader && o.files.length > 0) {
            if (o.files[0].size > (parseInt(o.getAttribute("cam-max-filesize"), 10) || 5e6))throw new Error("Maximum file size of " + r(parseInt(o.getAttribute("cam-max-filesize"), 10) || 5e6) + " exceeded.");
            var s = new FileReader;
            s.onloadend = function (e) {
              return function (n) {
                for (var r = "", a = new Uint8Array(n.target.result), o = a.byteLength, s = 0; o > s; s++)r += String.fromCharCode(a[s]);
                t.variableManager.variables[t.fields[e].variableName].value = btoa(r), i()
              }
            }(a), s.readAsArrayBuffer(o.files[0]), n++
          } else t.variableManager.variables[t.fields[a].variableName].value = null
        }
        i()
      }, CamundaForm.prototype.fetchVariables = function (e) {
        e = e || function () {
          };
        var t = this.variableManager.variableNames();
        if (t.length) {
          var n = {names: t, deserializeValues: !1};
          this.taskId ? (n.id = this.taskId, this.client.resource("task").formVariables(n, e)) : (n.id = this.processDefinitionId, n.key = this.processDefinitionKey, this.client.resource("process-definition").formVariables(n, e))
        } else e()
      }, CamundaForm.prototype.submitVariables = function (e) {
        e = e || function () {
          };
        var t = this.variableManager, n = t.variables, i = {};
        for (var r in n)if (t.isDirty(r)) {
          var a = n[r].value;
          t.isJsonVariable(r) && (a = JSON.stringify(a)), i[r] = {value: a, type: n[r].type, valueInfo: n[r].valueInfo}
        }
        var o = {variables: i};
        if (this.taskId)o.id = this.taskId, this.client.resource("task").submitForm(o, e); else {
          var s = this.businessKey || this.formElement.find('input[type="text"][cam-business-key]').val();
          s && (o.businessKey = s), o.id = this.processDefinitionId, o.key = this.processDefinitionKey, this.client.resource("process-definition").submitForm(o, e)
        }
      }, CamundaForm.prototype.storeOriginalValues = function (e) {
        for (var t in e)this.variableManager.setOriginalValue(t, e[t].value)
      }, CamundaForm.prototype.mergeVariables = function (e) {
        var t = this.variableManager.variables;
        for (var n in e) {
          if (t[n])for (var i in e[n])t[n][i] = t[n][i] || e[n][i]; else t[n] = e[n];
          this.variableManager.isJsonVariable(n) && (t[n].value = JSON.parse(e[n].value)), this.variableManager.isVariablesFetched = !0
        }
      }, CamundaForm.prototype.applyVariables = function () {
        for (var e in this.fields)this.fields[e].applyValue()
      }, CamundaForm.prototype.retrieveVariables = function () {
        for (var e in this.fields)this.fields[e].getValue()
      }, CamundaForm.prototype.fireEvent = function (e, t) {
        this.trigger(e, t)
      }, CamundaForm.$ = $, CamundaForm.VariableManager = VariableManager, CamundaForm.fields = {}, CamundaForm.fields.InputFieldHandler = InputFieldHandler, CamundaForm.fields.ChoicesFieldHandler = ChoicesFieldHandler, CamundaForm.cleanLocalStorage = function (e) {
        for (var t = 0; t < localStorage.length; t++) {
          var n = localStorage.key(t);
          if (0 === n.indexOf("camForm:")) {
            var i = JSON.parse(localStorage.getItem(n));
            i.date < e && (localStorage.removeItem(n), t--)
          }
        }
      }, CamundaForm.extend = BaseClass.extend, module.exports = CamundaForm
    }, {
      "./../base-class": 23,
      "./../events": 24,
      "./constants": 26,
      "./controls/choices-field-handler": 28,
      "./controls/input-field-handler": 29,
      "./dom-lib": 30,
      "./variable-manager": 32
    }], 26: [function (e, t) {
      "use strict";
      t.exports = {
        DIRECTIVE_CAM_FORM: "cam-form",
        DIRECTIVE_CAM_VARIABLE_NAME: "cam-variable-name",
        DIRECTIVE_CAM_VARIABLE_TYPE: "cam-variable-type",
        DIRECTIVE_CAM_CHOICES: "cam-choices",
        DIRECTIVE_CAM_SCRIPT: "cam-script"
      }
    }, {}], 27: [function (e, t) {
      "use strict";
      function n() {
      }

      function i(e, t) {
        this.element = a(e), this.variableManager = t, this.variableName = null, this.initialize()
      }

      var r = e("../../base-class"), a = e("./../dom-lib");
      i.selector = null, i.extend = r.extend, i.prototype.initialize = n, i.prototype.applyValue = n, i.prototype.getValue = n, t.exports = i
    }, {"../../base-class": 23, "./../dom-lib": 30}], 28: [function (e, t) {
      "use strict";
      var n = e("./../constants"), i = e("./abstract-form-field"), r = e("./../dom-lib"), a = i.extend({
        initialize: function () {
          var e = this.variableName = this.element.attr(n.DIRECTIVE_CAM_VARIABLE_NAME), t = this.variableType = this.element.attr(n.DIRECTIVE_CAM_VARIABLE_TYPE), i = this.choicesVariableName = this.element.attr(n.DIRECTIVE_CAM_CHOICES);
          this.variableManager.createVariable({
            name: e,
            type: t,
            value: this.element.val() || null
          }), i && this.variableManager.fetchVariable(i), this.originalValue = this.element.val() || null, this.previousValue = this.originalValue, this.variableName = e
        }, applyValue: function () {
          var e = this.element[0].selectedIndex;
          if (this.choicesVariableName) {
            var t = this.variableManager.variableValue(this.choicesVariableName);
            if (t)if (t instanceof Array)for (var n = 0; n < t.length; n++) {
              var i = t[n];
              this.element.find('option[text="' + i + '"]').length || this.element.append(r("<option>", {
                value: i,
                text: i
              }))
            } else for (var a in t)this.element.find('option[value="' + a + '"]').length || this.element.append(r("<option>", {
              value: a,
              text: t[a]
            }))
          }
          this.element[0].selectedIndex = e, this.previousValue = this.element.val() || "";
          var o = this.variableManager.variableValue(this.variableName);
          return o !== this.previousValue && (this.element.val(o), this.element.trigger("camFormVariableApplied", o)), this
        }, getValue: function () {
          var e, t = this.element.prop("multiple");
          return t ? (e = [], this.element.find("option:selected").each(function () {
            e.push(r(this).val())
          })) : e = this.element.find("option:selected").attr("value"), this.variableManager.variableValue(this.variableName, e), e
        }
      }, {selector: "select[" + n.DIRECTIVE_CAM_VARIABLE_NAME + "]"});
      t.exports = a
    }, {"./../constants": 26, "./../dom-lib": 30, "./abstract-form-field": 27}], 29: [function (e, t) {
      "use strict";
      var n = e("./../constants"), i = e("./abstract-form-field"), r = (e("./../dom-lib"), function (e) {
        return "checkbox" === e.attr("type") && "Boolean" === e.attr(n.DIRECTIVE_CAM_VARIABLE_TYPE)
      }), a = i.extend({
        initialize: function () {
          var e = this.element.attr(n.DIRECTIVE_CAM_VARIABLE_NAME), t = this.element.attr(n.DIRECTIVE_CAM_VARIABLE_TYPE);
          this.variableManager.createVariable({
            name: e,
            type: t
          }), this.originalValue = this.element.val(), this.previousValue = this.originalValue, this.variableName = e, this.getValue()
        }, applyValue: function () {
          this.previousValue = this.getValueFromHtmlControl() || "";
          var e = this.variableManager.variableValue(this.variableName);
          return e !== this.previousValue && (this.applyValueToHtmlControl(e), this.element.trigger("camFormVariableApplied", e)), this
        }, getValue: function () {
          var e = this.getValueFromHtmlControl();
          return this.variableManager.variableValue(this.variableName, e), e
        }, getValueFromHtmlControl: function () {
          return r(this.element) ? this.element.prop("checked") : this.element.val()
        }, applyValueToHtmlControl: function (e) {
          r(this.element) ? this.element.prop("checked", e) : "file" !== this.element[0].type && this.element.val(e)
        }
      }, {selector: "input[" + n.DIRECTIVE_CAM_VARIABLE_NAME + "],textarea[" + n.DIRECTIVE_CAM_VARIABLE_NAME + "]"});
      t.exports = a
    }, {"./../constants": 26, "./../dom-lib": 30, "./abstract-form-field": 27}], 30: [function (e, t) {
      (function (e) {
        "use strict";
        !function (t) {
          t("undefined" != typeof window ? window : e)
        }(function (e) {
          e = e || {}, t.exports = e.jQuery || (e.angular ? e.angular.element : !1) || e.Zepto
        })
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}], 31: [function (e, t) {
      "use strict";
      var n = /^-?[\d]+$/, i = /^(0|(-?(((0|[1-9]\d*)\.\d+)|([1-9]\d*))))([eE][-+]?[0-9]+)?$/, r = /^(true|false)$/, a = /^(\d{2}|\d{4})(?:\-)([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)([0-2]{1}\d{1}|[3]{1}[0-1]{1})T(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1}):([0-5]{1}\d{1}):([0-5]{1}\d{1})?$/, o = function (e, t) {
        switch (t) {
          case"Integer":
          case"Long":
          case"Short":
            return n.test(e);
          case"Float":
          case"Double":
            return i.test(e);
          case"Boolean":
            return r.test(e);
          case"Date":
            return a.test(e)
        }
      }, s = function (e, t) {
        if ("string" == typeof e && (e = e.trim()), "String" === t || "Bytes" === t)return e;
        if (!o(e, t))throw new Error("Value '" + e + "' is not of type " + t);
        switch (t) {
          case"Integer":
          case"Long":
          case"Short":
            return parseInt(e, 10);
          case"Float":
          case"Double":
            return parseFloat(e);
          case"Boolean":
            return "true" === e;
          case"Date":
            return e
        }
      };
      t.exports = {convertToType: s, isType: o}
    }, {}], 32: [function (e, t) {
      "use strict";
      function n() {
        this.variables = {}, this.isVariablesFetched = !1
      }

      var i = e("./type-util").convertToType;
      n.prototype.fetchVariable = function (e) {
        if (this.isVariablesFetched)throw new Error("Illegal State: cannot call fetchVariable(), variables already fetched.");
        this.createVariable({name: e})
      }, n.prototype.createVariable = function (e) {
        if (this.variables[e.name])throw new Error("Cannot add variable with name " + e.name + ": already exists.");
        this.variables[e.name] = e
      }, n.prototype.destroyVariable = function (e) {
        if (!this.variables[e])throw new Error("Cannot remove variable with name " + e + ": variable does not exist.");
        delete this.variables[e]
      }, n.prototype.setOriginalValue = function (e, t) {
        if (!this.variables[e])throw new Error("Cannot set original value of variable with name " + e + ": variable does not exist.");
        this.variables[e].originalValue = t
      }, n.prototype.variable = function (e) {
        return this.variables[e]
      }, n.prototype.variableValue = function (e, t) {
        var n = this.variable(e);
        return "undefined" == typeof t || null === t ? t = null : "" === t && "String" !== n.type ? t = null : "string" == typeof t && "String" !== n.type && (t = i(t, n.type)), 2 === arguments.length && (n.value = t), n.value
      }, n.prototype.isDirty = function (e) {
        var t = this.variable(e);
        return this.isJsonVariable(e) ? t.originalValue !== JSON.stringify(t.value) : t.originalValue !== t.value || "Object" === t.type
      }, n.prototype.isJsonVariable = function (e) {
        var t = this.variable(e), n = t.type, i = ["Object", "json", "Json"], r = i.indexOf(n);
        return 0 === r ? -1 !== t.valueInfo.serializationDataFormat.indexOf("application/json") : -1 !== r
      }, n.prototype.variableNames = function () {
        return Object.keys(this.variables)
      }, t.exports = n
    }, {"./type-util": 31}], 33: [function (e, t) {
      "use strict";
      function n(e, t, n) {
        if (n = n || function () {
            }, !e.length)return n();
        var i = 0, r = function () {
          t(e[i], function (t) {
            t ? (n(t), n = function () {
            }) : (i += 1, i >= e.length ? n() : r())
          })
        };
        r()
      }

      var i = t.exports = {typeUtils: e("./forms/type-util")};
      i.solveHALEmbedded = function (e) {
        function t(t) {
          if ("Id" !== t.slice(-2))return !1;
          var n = t.slice(0, -2), i = e._embedded;
          return !(!i[n] || !i[n].length)
        }

        function n(e) {
          var n = Object.keys(e);
          for (var i in n)"_" !== n[i][0] && t(n[i]) || n.splice(i, 1);
          return n
        }

        var i = Object.keys(e._embedded || {});
        for (var r in i) {
          var a = i[r];
          for (var o in e._embedded[a]) {
            e._embedded[a][o]._embedded = e._embedded[a][o]._embedded || {};
            var s = n(e._embedded[a][o]);
            for (var c in s) {
              var l = s[c];
              if (e._embedded[a][o][l]) {
                var u = e._embedded[l.slice(0, -2)];
                for (var p in u)u[p].id === e._embedded[a][o][l] && (e._embedded[a][o]._embedded[l.slice(0, -2)] = [u[p]])
              }
            }
          }
        }
        return e
      }, i.series = function (e, t) {
        t = t || function () {
          };
        var i = {};
        n(Object.keys(e), function (t, n) {
          e[t](function (e) {
            var r = Array.prototype.slice.call(arguments, 1);
            r.length <= 1 && (r = r[0]), i[t] = r, n(e)
          })
        }, function (e) {
          t(e, i)
        })
      }
    }, {"./forms/type-util": 31}], 34: [function (e, t, n) {
      function i(e, t, n) {
        if (!(this instanceof i))return new i(e, t, n);
        var r, a = typeof e;
        if ("number" === a)r = e > 0 ? e >>> 0 : 0; else if ("string" === a)"base64" === t && (e = _(e)), r = i.byteLength(e, t); else {
          if ("object" !== a || null === e)throw new TypeError("must start with number, buffer, array or string");
          "Buffer" === e.type && O(e.data) && (e = e.data), r = +e.length > 0 ? Math.floor(+e.length) : 0
        }
        if (this.length > $)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + $.toString(16) + " bytes");
        var o;
        i.TYPED_ARRAY_SUPPORT ? o = i._augment(new Uint8Array(r)) : (o = this, o.length = r, o._isBuffer = !0);
        var s;
        if (i.TYPED_ARRAY_SUPPORT && "number" == typeof e.byteLength)o._set(e); else if (S(e))if (i.isBuffer(e))for (s = 0; r > s; s++)o[s] = e.readUInt8(s); else for (s = 0; r > s; s++)o[s] = (e[s] % 256 + 256) % 256; else if ("string" === a)o.write(e, 0, t); else if ("number" === a && !i.TYPED_ARRAY_SUPPORT && !n)for (s = 0; r > s; s++)o[s] = 0;
        return o
      }

      function r(e, t, n, i) {
        n = Number(n) || 0;
        var r = e.length - n;
        i ? (i = Number(i), i > r && (i = r)) : i = r;
        var a = t.length;
        if (a % 2 !== 0)throw new Error("Invalid hex string");
        i > a / 2 && (i = a / 2);
        for (var o = 0; i > o; o++) {
          var s = parseInt(t.substr(2 * o, 2), 16);
          if (isNaN(s))throw new Error("Invalid hex string");
          e[n + o] = s
        }
        return o
      }

      function a(e, t, n, i) {
        var r = P(C(t), e, n, i);
        return r
      }

      function o(e, t, n, i) {
        var r = P(D(t), e, n, i);
        return r
      }

      function s(e, t, n, i) {
        return o(e, t, n, i)
      }

      function c(e, t, n, i) {
        var r = P(I(t), e, n, i);
        return r
      }

      function l(e, t, n, i) {
        var r = P(k(t), e, n, i, 2);
        return r
      }

      function u(e, t, n) {
        return R.fromByteArray(0 === t && n === e.length ? e : e.slice(t, n))
      }

      function p(e, t, n) {
        var i = "", r = "";
        n = Math.min(e.length, n);
        for (var a = t; n > a; a++)e[a] <= 127 ? (i += M(r) + String.fromCharCode(e[a]), r = "") : r += "%" + e[a].toString(16);
        return i + M(r)
      }

      function d(e, t, n) {
        var i = "";
        n = Math.min(e.length, n);
        for (var r = t; n > r; r++)i += String.fromCharCode(e[r]);
        return i
      }

      function f(e, t, n) {
        return d(e, t, n)
      }

      function h(e, t, n) {
        var i = e.length;
        (!t || 0 > t) && (t = 0), (!n || 0 > n || n > i) && (n = i);
        for (var r = "", a = t; n > a; a++)r += A(e[a]);
        return r
      }

      function m(e, t, n) {
        for (var i = e.slice(t, n), r = "", a = 0; a < i.length; a += 2)r += String.fromCharCode(i[a] + 256 * i[a + 1]);
        return r
      }

      function g(e, t, n) {
        if (e % 1 !== 0 || 0 > e)throw new RangeError("offset is not uint");
        if (e + t > n)throw new RangeError("Trying to access beyond buffer length")
      }

      function v(e, t, n, r, a, o) {
        if (!i.isBuffer(e))throw new TypeError("buffer must be a Buffer instance");
        if (t > a || o > t)throw new TypeError("value is out of bounds");
        if (n + r > e.length)throw new TypeError("index out of range")
      }

      function y(e, t, n, i) {
        0 > t && (t = 65535 + t + 1);
        for (var r = 0, a = Math.min(e.length - n, 2); a > r; r++)e[n + r] = (t & 255 << 8 * (i ? r : 1 - r)) >>> 8 * (i ? r : 1 - r)
      }

      function b(e, t, n, i) {
        0 > t && (t = 4294967295 + t + 1);
        for (var r = 0, a = Math.min(e.length - n, 4); a > r; r++)e[n + r] = t >>> 8 * (i ? r : 3 - r) & 255
      }

      function w(e, t, n, i, r, a) {
        if (t > r || a > t)throw new TypeError("value is out of bounds");
        if (n + i > e.length)throw new TypeError("index out of range")
      }

      function x(e, t, n, i, r) {
        return r || w(e, t, n, 4, 3.4028234663852886e38, -3.4028234663852886e38), N.write(e, t, n, i, 23, 4), n + 4
      }

      function E(e, t, n, i, r) {
        return r || w(e, t, n, 8, 1.7976931348623157e308, -1.7976931348623157e308), N.write(e, t, n, i, 52, 8), n + 8
      }

      function _(e) {
        for (e = T(e).replace(L, ""); e.length % 4 !== 0;)e += "=";
        return e
      }

      function T(e) {
        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
      }

      function S(e) {
        return O(e) || i.isBuffer(e) || e && "object" == typeof e && "number" == typeof e.length
      }

      function A(e) {
        return 16 > e ? "0" + e.toString(16) : e.toString(16)
      }

      function C(e) {
        for (var t = [], n = 0; n < e.length; n++) {
          var i = e.charCodeAt(n);
          if (127 >= i)t.push(i); else {
            var r = n;
            i >= 55296 && 57343 >= i && n++;
            for (var a = encodeURIComponent(e.slice(r, n + 1)).substr(1).split("%"), o = 0; o < a.length; o++)t.push(parseInt(a[o], 16))
          }
        }
        return t
      }

      function D(e) {
        for (var t = [], n = 0; n < e.length; n++)t.push(255 & e.charCodeAt(n));
        return t
      }

      function k(e) {
        for (var t, n, i, r = [], a = 0; a < e.length; a++)t = e.charCodeAt(a), n = t >> 8, i = t % 256, r.push(i), r.push(n);
        return r
      }

      function I(e) {
        return R.toByteArray(e)
      }

      function P(e, t, n, i, r) {
        r && (i -= i % r);
        for (var a = 0; i > a && !(a + n >= t.length || a >= e.length); a++)t[a + n] = e[a];
        return a
      }

      function M(e) {
        try {
          return decodeURIComponent(e)
        } catch (t) {
          return String.fromCharCode(65533)
        }
      }

      var R = e("base64-js"), N = e("ieee754"), O = e("is-array");
      n.Buffer = i, n.SlowBuffer = i, n.INSPECT_MAX_BYTES = 50, i.poolSize = 8192;
      var $ = 1073741823;
      i.TYPED_ARRAY_SUPPORT = function () {
        try {
          var e = new ArrayBuffer(0), t = new Uint8Array(e);
          return t.foo = function () {
            return 42
          }, 42 === t.foo() && "function" == typeof t.subarray && 0 === new Uint8Array(1).subarray(1, 1).byteLength
        } catch (n) {
          return !1
        }
      }(), i.isBuffer = function (e) {
        return !(null == e || !e._isBuffer)
      }, i.compare = function (e, t) {
        if (!i.isBuffer(e) || !i.isBuffer(t))throw new TypeError("Arguments must be Buffers");
        for (var n = e.length, r = t.length, a = 0, o = Math.min(n, r); o > a && e[a] === t[a]; a++);
        return a !== o && (n = e[a], r = t[a]), r > n ? -1 : n > r ? 1 : 0
      }, i.isEncoding = function (e) {
        switch (String(e).toLowerCase()) {
          case"hex":
          case"utf8":
          case"utf-8":
          case"ascii":
          case"binary":
          case"base64":
          case"raw":
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            return !0;
          default:
            return !1
        }
      }, i.concat = function (e, t) {
        if (!O(e))throw new TypeError("Usage: Buffer.concat(list[, length])");
        if (0 === e.length)return new i(0);
        if (1 === e.length)return e[0];
        var n;
        if (void 0 === t)for (t = 0, n = 0; n < e.length; n++)t += e[n].length;
        var r = new i(t), a = 0;
        for (n = 0; n < e.length; n++) {
          var o = e[n];
          o.copy(r, a), a += o.length
        }
        return r
      }, i.byteLength = function (e, t) {
        var n;
        switch (e += "", t || "utf8") {
          case"ascii":
          case"binary":
          case"raw":
            n = e.length;
            break;
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            n = 2 * e.length;
            break;
          case"hex":
            n = e.length >>> 1;
            break;
          case"utf8":
          case"utf-8":
            n = C(e).length;
            break;
          case"base64":
            n = I(e).length;
            break;
          default:
            n = e.length
        }
        return n
      }, i.prototype.length = void 0, i.prototype.parent = void 0, i.prototype.toString = function (e, t, n) {
        var i = !1;
        if (t >>>= 0, n = void 0 === n || 1 / 0 === n ? this.length : n >>> 0, e || (e = "utf8"), 0 > t && (t = 0), n > this.length && (n = this.length), t >= n)return "";
        for (; ;)switch (e) {
          case"hex":
            return h(this, t, n);
          case"utf8":
          case"utf-8":
            return p(this, t, n);
          case"ascii":
            return d(this, t, n);
          case"binary":
            return f(this, t, n);
          case"base64":
            return u(this, t, n);
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            return m(this, t, n);
          default:
            if (i)throw new TypeError("Unknown encoding: " + e);
            e = (e + "").toLowerCase(), i = !0
        }
      }, i.prototype.equals = function (e) {
        if (!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");
        return 0 === i.compare(this, e)
      }, i.prototype.inspect = function () {
        var e = "", t = n.INSPECT_MAX_BYTES;
        return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
      }, i.prototype.compare = function (e) {
        if (!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");
        return i.compare(this, e)
      }, i.prototype.get = function (e) {
        return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e)
      }, i.prototype.set = function (e, t) {
        return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t)
      }, i.prototype.write = function (e, t, n, i) {
        if (isFinite(t))isFinite(n) || (i = n, n = void 0); else {
          var u = i;
          i = t, t = n, n = u
        }
        t = Number(t) || 0;
        var p = this.length - t;
        n ? (n = Number(n), n > p && (n = p)) : n = p, i = String(i || "utf8").toLowerCase();
        var d;
        switch (i) {
          case"hex":
            d = r(this, e, t, n);
            break;
          case"utf8":
          case"utf-8":
            d = a(this, e, t, n);
            break;
          case"ascii":
            d = o(this, e, t, n);
            break;
          case"binary":
            d = s(this, e, t, n);
            break;
          case"base64":
            d = c(this, e, t, n);
            break;
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            d = l(this, e, t, n);
            break;
          default:
            throw new TypeError("Unknown encoding: " + i)
        }
        return d
      }, i.prototype.toJSON = function () {
        return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
      }, i.prototype.slice = function (e, t) {
        var n = this.length;
        if (e = ~~e, t = void 0 === t ? n : ~~t, 0 > e ? (e += n, 0 > e && (e = 0)) : e > n && (e = n), 0 > t ? (t += n, 0 > t && (t = 0)) : t > n && (t = n), e > t && (t = e), i.TYPED_ARRAY_SUPPORT)return i._augment(this.subarray(e, t));
        for (var r = t - e, a = new i(r, void 0, !0), o = 0; r > o; o++)a[o] = this[o + e];
        return a
      }, i.prototype.readUInt8 = function (e, t) {
        return t || g(e, 1, this.length), this[e]
      }, i.prototype.readUInt16LE = function (e, t) {
        return t || g(e, 2, this.length), this[e] | this[e + 1] << 8
      }, i.prototype.readUInt16BE = function (e, t) {
        return t || g(e, 2, this.length), this[e] << 8 | this[e + 1]
      }, i.prototype.readUInt32LE = function (e, t) {
        return t || g(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
      }, i.prototype.readUInt32BE = function (e, t) {
        return t || g(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
      }, i.prototype.readInt8 = function (e, t) {
        return t || g(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
      }, i.prototype.readInt16LE = function (e, t) {
        t || g(e, 2, this.length);
        var n = this[e] | this[e + 1] << 8;
        return 32768 & n ? 4294901760 | n : n
      }, i.prototype.readInt16BE = function (e, t) {
        t || g(e, 2, this.length);
        var n = this[e + 1] | this[e] << 8;
        return 32768 & n ? 4294901760 | n : n
      }, i.prototype.readInt32LE = function (e, t) {
        return t || g(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
      }, i.prototype.readInt32BE = function (e, t) {
        return t || g(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
      }, i.prototype.readFloatLE = function (e, t) {
        return t || g(e, 4, this.length), N.read(this, e, !0, 23, 4)
      }, i.prototype.readFloatBE = function (e, t) {
        return t || g(e, 4, this.length), N.read(this, e, !1, 23, 4)
      }, i.prototype.readDoubleLE = function (e, t) {
        return t || g(e, 8, this.length), N.read(this, e, !0, 52, 8)
      }, i.prototype.readDoubleBE = function (e, t) {
        return t || g(e, 8, this.length), N.read(this, e, !1, 52, 8)
      }, i.prototype.writeUInt8 = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 1, 255, 0), i.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = e, t + 1
      }, i.prototype.writeUInt16LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 2, 65535, 0), i.TYPED_ARRAY_SUPPORT ? (this[t] = e, this[t + 1] = e >>> 8) : y(this, e, t, !0), t + 2
      }, i.prototype.writeUInt16BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 2, 65535, 0), i.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = e) : y(this, e, t, !1), t + 2
      }, i.prototype.writeUInt32LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 4, 4294967295, 0), i.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e) : b(this, e, t, !0), t + 4
      }, i.prototype.writeUInt32BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 4, 4294967295, 0), i.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e) : b(this, e, t, !1), t + 4
      }, i.prototype.writeInt8 = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 1, 127, -128), i.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 0 > e && (e = 255 + e + 1), this[t] = e, t + 1
      }, i.prototype.writeInt16LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 2, 32767, -32768), i.TYPED_ARRAY_SUPPORT ? (this[t] = e, this[t + 1] = e >>> 8) : y(this, e, t, !0), t + 2
      }, i.prototype.writeInt16BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 2, 32767, -32768), i.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = e) : y(this, e, t, !1), t + 2
      }, i.prototype.writeInt32LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 4, 2147483647, -2147483648), i.TYPED_ARRAY_SUPPORT ? (this[t] = e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : b(this, e, t, !0), t + 4
      }, i.prototype.writeInt32BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || v(this, e, t, 4, 2147483647, -2147483648), 0 > e && (e = 4294967295 + e + 1), i.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e) : b(this, e, t, !1), t + 4
      }, i.prototype.writeFloatLE = function (e, t, n) {
        return x(this, e, t, !0, n)
      }, i.prototype.writeFloatBE = function (e, t, n) {
        return x(this, e, t, !1, n)
      }, i.prototype.writeDoubleLE = function (e, t, n) {
        return E(this, e, t, !0, n)
      }, i.prototype.writeDoubleBE = function (e, t, n) {
        return E(this, e, t, !1, n)
      }, i.prototype.copy = function (e, t, n, r) {
        var a = this;
        if (n || (n = 0), r || 0 === r || (r = this.length), t || (t = 0), r !== n && 0 !== e.length && 0 !== a.length) {
          if (n > r)throw new TypeError("sourceEnd < sourceStart");
          if (0 > t || t >= e.length)throw new TypeError("targetStart out of bounds");
          if (0 > n || n >= a.length)throw new TypeError("sourceStart out of bounds");
          if (0 > r || r > a.length)throw new TypeError("sourceEnd out of bounds");
          r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
          var o = r - n;
          if (1e3 > o || !i.TYPED_ARRAY_SUPPORT)for (var s = 0; o > s; s++)e[s + t] = this[s + n]; else e._set(this.subarray(n, n + o), t)
        }
      }, i.prototype.fill = function (e, t, n) {
        if (e || (e = 0), t || (t = 0), n || (n = this.length), t > n)throw new TypeError("end < start");
        if (n !== t && 0 !== this.length) {
          if (0 > t || t >= this.length)throw new TypeError("start out of bounds");
          if (0 > n || n > this.length)throw new TypeError("end out of bounds");
          var i;
          if ("number" == typeof e)for (i = t; n > i; i++)this[i] = e; else {
            var r = C(e.toString()), a = r.length;
            for (i = t; n > i; i++)this[i] = r[i % a]
          }
          return this
        }
      }, i.prototype.toArrayBuffer = function () {
        if ("undefined" != typeof Uint8Array) {
          if (i.TYPED_ARRAY_SUPPORT)return new i(this).buffer;
          for (var e = new Uint8Array(this.length), t = 0, n = e.length; n > t; t += 1)e[t] = this[t];
          return e.buffer
        }
        throw new TypeError("Buffer.toArrayBuffer not supported in this browser")
      };
      var F = i.prototype;
      i._augment = function (e) {
        return e.constructor = i, e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = F.get, e.set = F.set, e.write = F.write, e.toString = F.toString, e.toLocaleString = F.toString, e.toJSON = F.toJSON, e.equals = F.equals, e.compare = F.compare, e.copy = F.copy, e.slice = F.slice, e.readUInt8 = F.readUInt8, e.readUInt16LE = F.readUInt16LE, e.readUInt16BE = F.readUInt16BE, e.readUInt32LE = F.readUInt32LE, e.readUInt32BE = F.readUInt32BE, e.readInt8 = F.readInt8, e.readInt16LE = F.readInt16LE, e.readInt16BE = F.readInt16BE, e.readInt32LE = F.readInt32LE, e.readInt32BE = F.readInt32BE, e.readFloatLE = F.readFloatLE, e.readFloatBE = F.readFloatBE, e.readDoubleLE = F.readDoubleLE, e.readDoubleBE = F.readDoubleBE, e.writeUInt8 = F.writeUInt8, e.writeUInt16LE = F.writeUInt16LE, e.writeUInt16BE = F.writeUInt16BE, e.writeUInt32LE = F.writeUInt32LE, e.writeUInt32BE = F.writeUInt32BE, e.writeInt8 = F.writeInt8, e.writeInt16LE = F.writeInt16LE, e.writeInt16BE = F.writeInt16BE, e.writeInt32LE = F.writeInt32LE, e.writeInt32BE = F.writeInt32BE, e.writeFloatLE = F.writeFloatLE, e.writeFloatBE = F.writeFloatBE, e.writeDoubleLE = F.writeDoubleLE, e.writeDoubleBE = F.writeDoubleBE, e.fill = F.fill, e.inspect = F.inspect, e.toArrayBuffer = F.toArrayBuffer, e
      };
      var L = /[^+\/0-9A-z]/g
    }, {"base64-js": 35, ieee754: 36, "is-array": 37}], 35: [function (e, t, n) {
      var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      !function (e) {
        "use strict";
        function t(e) {
          var t = e.charCodeAt(0);
          return t === o ? 62 : t === s ? 63 : c > t ? -1 : c + 10 > t ? t - c + 26 + 26 : u + 26 > t ? t - u : l + 26 > t ? t - l + 26 : void 0
        }

        function n(e) {
          function n(e) {
            l[p++] = e
          }

          var i, r, o, s, c, l;
          if (e.length % 4 > 0)throw new Error("Invalid string. Length must be a multiple of 4");
          var u = e.length;
          c = "=" === e.charAt(u - 2) ? 2 : "=" === e.charAt(u - 1) ? 1 : 0, l = new a(3 * e.length / 4 - c), o = c > 0 ? e.length - 4 : e.length;
          var p = 0;
          for (i = 0, r = 0; o > i; i += 4, r += 3)s = t(e.charAt(i)) << 18 | t(e.charAt(i + 1)) << 12 | t(e.charAt(i + 2)) << 6 | t(e.charAt(i + 3)), n((16711680 & s) >> 16), n((65280 & s) >> 8), n(255 & s);
          return 2 === c ? (s = t(e.charAt(i)) << 2 | t(e.charAt(i + 1)) >> 4, n(255 & s)) : 1 === c && (s = t(e.charAt(i)) << 10 | t(e.charAt(i + 1)) << 4 | t(e.charAt(i + 2)) >> 2, n(s >> 8 & 255), n(255 & s)), l
        }

        function r(e) {
          function t(e) {
            return i.charAt(e)
          }

          function n(e) {
            return t(e >> 18 & 63) + t(e >> 12 & 63) + t(e >> 6 & 63) + t(63 & e)
          }

          var r, a, o, s = e.length % 3, c = "";
          for (r = 0, o = e.length - s; o > r; r += 3)a = (e[r] << 16) + (e[r + 1] << 8) + e[r + 2], c += n(a);
          switch (s) {
            case 1:
              a = e[e.length - 1], c += t(a >> 2), c += t(a << 4 & 63), c += "==";
              break;
            case 2:
              a = (e[e.length - 2] << 8) + e[e.length - 1], c += t(a >> 10), c += t(a >> 4 & 63), c += t(a << 2 & 63), c += "="
          }
          return c
        }

        var a = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "+".charCodeAt(0), s = "/".charCodeAt(0), c = "0".charCodeAt(0), l = "a".charCodeAt(0), u = "A".charCodeAt(0);
        e.toByteArray = n, e.fromByteArray = r
      }("undefined" == typeof n ? this.base64js = {} : n)
    }, {}], 36: [function (e, t, n) {
      n.read = function (e, t, n, i, r) {
        var a, o, s = 8 * r - i - 1, c = (1 << s) - 1, l = c >> 1, u = -7, p = n ? r - 1 : 0, d = n ? -1 : 1, f = e[t + p];
        for (p += d, a = f & (1 << -u) - 1, f >>= -u, u += s; u > 0; a = 256 * a + e[t + p], p += d, u -= 8);
        for (o = a & (1 << -u) - 1, a >>= -u, u += i; u > 0; o = 256 * o + e[t + p], p += d, u -= 8);
        if (0 === a)a = 1 - l; else {
          if (a === c)return o ? 0 / 0 : 1 / 0 * (f ? -1 : 1);
          o += Math.pow(2, i), a -= l
        }
        return (f ? -1 : 1) * o * Math.pow(2, a - i)
      }, n.write = function (e, t, n, i, r, a) {
        var o, s, c, l = 8 * a - r - 1, u = (1 << l) - 1, p = u >> 1, d = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f = i ? 0 : a - 1, h = i ? 1 : -1, m = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
        for (t = Math.abs(t), isNaN(t) || 1 / 0 === t ? (s = isNaN(t) ? 1 : 0, o = u) : (o = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), t += o + p >= 1 ? d / c : d * Math.pow(2, 1 - p), t * c >= 2 && (o++, c /= 2), o + p >= u ? (s = 0, o = u) : o + p >= 1 ? (s = (t * c - 1) * Math.pow(2, r), o += p) : (s = t * Math.pow(2, p - 1) * Math.pow(2, r), o = 0)); r >= 8; e[n + f] = 255 & s, f += h, s /= 256, r -= 8);
        for (o = o << r | s, l += r; l > 0; e[n + f] = 255 & o, f += h, o /= 256, l -= 8);
        e[n + f - h] |= 128 * m
      }
    }, {}], 37: [function (e, t) {
      var n = Array.isArray, i = Object.prototype.toString;
      t.exports = n || function (e) {
          return !!e && "[object Array]" == i.call(e)
        }
    }, {}], 38: [function (e, t) {
      function n() {
      }

      function i(e) {
        var t = {}.toString.call(e);
        switch (t) {
          case"[object File]":
          case"[object Blob]":
          case"[object FormData]":
            return !0;
          default:
            return !1
        }
      }

      function r() {
        if (g.XMLHttpRequest && ("file:" != g.location.protocol || !g.ActiveXObject))return new XMLHttpRequest;
        try {
          return new ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {
        }
        try {
          return new ActiveXObject("Msxml2.XMLHTTP.6.0")
        } catch (e) {
        }
        try {
          return new ActiveXObject("Msxml2.XMLHTTP.3.0")
        } catch (e) {
        }
        try {
          return new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {
        }
        return !1
      }

      function a(e) {
        return e === Object(e)
      }

      function o(e) {
        if (!a(e))return e;
        var t = [];
        for (var n in e)null != e[n] && t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
        return t.join("&")
      }

      function s(e) {
        for (var t, n, i = {}, r = e.split("&"), a = 0, o = r.length; o > a; ++a)n = r[a], t = n.split("="), i[decodeURIComponent(t[0])] = decodeURIComponent(t[1]);
        return i
      }

      function c(e) {
        var t, n, i, r, a = e.split(/\r?\n/), o = {};
        a.pop();
        for (var s = 0, c = a.length; c > s; ++s)n = a[s], t = n.indexOf(":"), i = n.slice(0, t).toLowerCase(), r = v(n.slice(t + 1)), o[i] = r;
        return o
      }

      function l(e) {
        return e.split(/ *; */).shift()
      }

      function u(e) {
        return m(e.split(/ *; */), function (e, t) {
          var n = t.split(/ *= */), i = n.shift(), r = n.shift();
          return i && r && (e[i] = r), e
        }, {})
      }

      function p(e, t) {
        t = t || {}, this.req = e, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method ? this.xhr.responseText : null, this.setStatusProperties(this.xhr.status), this.header = this.headers = c(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this.setHeaderProperties(this.header), this.body = "HEAD" != this.req.method ? this.parseBody(this.text) : null
      }

      function d(e, t) {
        var n = this;
        h.call(this), this._query = this._query || [], this.method = e, this.url = t, this.header = {}, this._header = {}, this.on("end", function () {
          var e = null, t = null;
          try {
            t = new p(n)
          } catch (i) {
            e = new Error("Parser is unable to parse the response"), e.parse = !0, e.original = i
          }
          n.callback(e, t)
        })
      }

      function f(e, t) {
        return "function" == typeof t ? new d("GET", e).end(t) : 1 == arguments.length ? new d("GET", e) : new d(e, t)
      }

      var h = e("emitter"), m = e("reduce"), g = "undefined" == typeof window ? this : window, v = "".trim ? function (e) {
        return e.trim()
      } : function (e) {
        return e.replace(/(^\s*|\s*$)/g, "")
      };
      f.serializeObject = o, f.parseString = s, f.types = {
        html: "text/html",
        json: "application/json",
        xml: "application/xml",
        urlencoded: "application/x-www-form-urlencoded",
        form: "application/x-www-form-urlencoded",
        "form-data": "application/x-www-form-urlencoded"
      }, f.serialize = {
        "application/x-www-form-urlencoded": o,
        "application/json": JSON.stringify
      }, f.parse = {
        "application/x-www-form-urlencoded": s,
        "application/json": JSON.parse
      }, p.prototype.get = function (e) {
        return this.header[e.toLowerCase()]
      }, p.prototype.setHeaderProperties = function () {
        var e = this.header["content-type"] || "";
        this.type = l(e);
        var t = u(e);
        for (var n in t)this[n] = t[n]
      }, p.prototype.parseBody = function (e) {
        var t = f.parse[this.type];
        return t && e && e.length ? t(e) : null
      }, p.prototype.setStatusProperties = function (e) {
        var t = e / 100 | 0;
        this.status = e, this.statusType = t, this.info = 1 == t, this.ok = 2 == t, this.clientError = 4 == t, this.serverError = 5 == t, this.error = 4 == t || 5 == t ? this.toError() : !1, this.accepted = 202 == e, this.noContent = 204 == e || 1223 == e, this.badRequest = 400 == e, this.unauthorized = 401 == e, this.notAcceptable = 406 == e, this.notFound = 404 == e, this.forbidden = 403 == e
      }, p.prototype.toError = function () {
        var e = this.req, t = e.method, n = e.url, i = "cannot " + t + " " + n + " (" + this.status + ")", r = new Error(i);
        return r.status = this.status, r.method = t, r.url = n, r
      }, f.Response = p, h(d.prototype), d.prototype.use = function (e) {
        return e(this), this
      }, d.prototype.timeout = function (e) {
        return this._timeout = e, this
      }, d.prototype.clearTimeout = function () {
        return this._timeout = 0, clearTimeout(this._timer), this
      }, d.prototype.abort = function () {
        return this.aborted ? void 0 : (this.aborted = !0, this.xhr.abort(), this.clearTimeout(), this.emit("abort"), this)
      }, d.prototype.set = function (e, t) {
        if (a(e)) {
          for (var n in e)this.set(n, e[n]);
          return this
        }
        return this._header[e.toLowerCase()] = t, this.header[e] = t, this
      }, d.prototype.unset = function (e) {
        return delete this._header[e.toLowerCase()], delete this.header[e], this
      }, d.prototype.getHeader = function (e) {
        return this._header[e.toLowerCase()]
      }, d.prototype.type = function (e) {
        return this.set("Content-Type", f.types[e] || e), this
      }, d.prototype.accept = function (e) {
        return this.set("Accept", f.types[e] || e), this
      }, d.prototype.auth = function (e, t) {
        var n = btoa(e + ":" + t);
        return this.set("Authorization", "Basic " + n), this
      }, d.prototype.query = function (e) {
        return "string" != typeof e && (e = o(e)), e && this._query.push(e), this
      }, d.prototype.field = function (e, t) {
        return this._formData || (this._formData = new FormData), this._formData.append(e, t), this
      }, d.prototype.attach = function (e, t, n) {
        return this._formData || (this._formData = new FormData), this._formData.append(e, t, n), this
      }, d.prototype.send = function (e) {
        var t = a(e), n = this.getHeader("Content-Type");
        if (t && a(this._data))for (var i in e)this._data[i] = e[i]; else"string" == typeof e ? (n || this.type("form"), n = this.getHeader("Content-Type"), this._data = "application/x-www-form-urlencoded" == n ? this._data ? this._data + "&" + e : e : (this._data || "") + e) : this._data = e;
        return t ? (n || this.type("json"), this) : this
      }, d.prototype.callback = function (e, t) {
        var n = this._callback;
        return this.clearTimeout(), 2 == n.length ? n(e, t) : e ? this.emit("error", e) : void n(t)
      }, d.prototype.crossDomainError = function () {
        var e = new Error("Origin is not allowed by Access-Control-Allow-Origin");
        e.crossDomain = !0, this.callback(e)
      }, d.prototype.timeoutError = function () {
        var e = this._timeout, t = new Error("timeout of " + e + "ms exceeded");
        t.timeout = e, this.callback(t)
      }, d.prototype.withCredentials = function () {
        return this._withCredentials = !0, this
      }, d.prototype.end = function (e) {
        var t = this, a = this.xhr = r(), o = this._query.join("&"), s = this._timeout, c = this._formData || this._data;
        if (this._callback = e || n, a.onreadystatechange = function () {
            return 4 == a.readyState ? 0 == a.status ? t.aborted ? t.timeoutError() : t.crossDomainError() : void t.emit("end") : void 0
          }, a.upload && (a.upload.onprogress = function (e) {
            e.percent = e.loaded / e.total * 100, t.emit("progress", e)
          }), s && !this._timer && (this._timer = setTimeout(function () {
            t.abort()
          }, s)), o && (o = f.serializeObject(o), this.url += ~this.url.indexOf("?") ? "&" + o : "?" + o), a.open(this.method, this.url, !0), this._withCredentials && (a.withCredentials = !0), "GET" != this.method && "HEAD" != this.method && "string" != typeof c && !i(c)) {
          var l = f.serialize[this.getHeader("Content-Type")];
          l && (c = l(c))
        }
        for (var u in this.header)null != this.header[u] && a.setRequestHeader(u, this.header[u]);
        return this.emit("request", this), a.send(c), this
      }, f.Request = d, f.get = function (e, t, n) {
        var i = f("GET", e);
        return "function" == typeof t && (n = t, t = null), t && i.query(t), n && i.end(n), i
      }, f.head = function (e, t, n) {
        var i = f("HEAD", e);
        return "function" == typeof t && (n = t, t = null), t && i.send(t), n && i.end(n), i
      }, f.del = function (e, t) {
        var n = f("DELETE", e);
        return t && n.end(t), n
      }, f.patch = function (e, t, n) {
        var i = f("PATCH", e);
        return "function" == typeof t && (n = t, t = null), t && i.send(t), n && i.end(n), i
      }, f.post = function (e, t, n) {
        var i = f("POST", e);
        return "function" == typeof t && (n = t, t = null), t && i.send(t), n && i.end(n), i
      }, f.put = function (e, t, n) {
        var i = f("PUT", e);
        return "function" == typeof t && (n = t, t = null), t && i.send(t), n && i.end(n), i
      }, t.exports = f
    }, {emitter: 39, reduce: 40}], 39: [function (e, t) {
      function n(e) {
        return e ? i(e) : void 0
      }

      function i(e) {
        for (var t in n.prototype)e[t] = n.prototype[t];
        return e
      }

      t.exports = n, n.prototype.on = n.prototype.addEventListener = function (e, t) {
        return this._callbacks = this._callbacks || {}, (this._callbacks[e] = this._callbacks[e] || []).push(t), this
      }, n.prototype.once = function (e, t) {
        function n() {
          i.off(e, n), t.apply(this, arguments)
        }

        var i = this;
        return this._callbacks = this._callbacks || {}, n.fn = t, this.on(e, n), this
      }, n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function (e, t) {
        if (this._callbacks = this._callbacks || {}, 0 == arguments.length)return this._callbacks = {}, this;
        var n = this._callbacks[e];
        if (!n)return this;
        if (1 == arguments.length)return delete this._callbacks[e], this;
        for (var i, r = 0; r < n.length; r++)if (i = n[r], i === t || i.fn === t) {
          n.splice(r, 1);
          break
        }
        return this
      }, n.prototype.emit = function (e) {
        this._callbacks = this._callbacks || {};
        var t = [].slice.call(arguments, 1), n = this._callbacks[e];
        if (n) {
          n = n.slice(0);
          for (var i = 0, r = n.length; r > i; ++i)n[i].apply(this, t)
        }
        return this
      }, n.prototype.listeners = function (e) {
        return this._callbacks = this._callbacks || {}, this._callbacks[e] || []
      }, n.prototype.hasListeners = function (e) {
        return !!this.listeners(e).length
      }
    }, {}], 40: [function (e, t) {
      t.exports = function (e, t, n) {
        for (var i = 0, r = e.length, a = 3 == arguments.length ? n : e[i++]; r > i;)a = t.call(null, a, e[i], ++i, e);
        return a
      }
    }, {}]
  }, {}, [3])(3)
}),define("camunda-cockpit-ui", ["./directives/main", "./filters/main", "./pages/main", "./resources/main", "./services/main", "camunda-commons-ui", "camunda-bpm-sdk-js", "ngDefine"], function () {
  "use strict";
  var e = "cam.cockpit", t = window.PLUGIN_PACKAGES || [], n = window.PLUGIN_DEPENDENCIES || [];
  require.config({packages: t});
  var i = [].concat(n.map(function (e) {
    return e.requirePackageName
  }));
  require(i, function () {
    var t = ["ng", "ngResource", require("camunda-commons-ui").name, require("./directives/main").name, require("./filters/main").name, require("./pages/main").name, require("./resources/main").name, require("./services/main").name].concat(n.map(function (e) {
      return e.ngModuleName
    })), i = require("angular"), r = require("jquery"), a = i.module(e, t), o = ["$routeProvider", "UriProvider", function (e, t) {
      function n(e) {
        var t = r("base").attr(e);
        if (!e)throw new Error("Uri base for " + e + " could not be resolved");
        return t
      }

      e.otherwise({redirectTo: "/dashboard"}), t.replace(":appName", "cockpit"), t.replace("app://", n("href")), t.replace("adminbase://", n("app-root") + "/app/admin/"), t.replace("cockpit://", n("cockpit-api")), t.replace("admin://", n("cockpit-api") + "../admin/"), t.replace("plugin://", n("cockpit-api") + "plugin/"), t.replace("engine://", n("engine-api")), t.replace(":engine", ["$window", function (e) {
        var t = e.location.href, n = t.match(/\/app\/cockpit\/(\w+)(|\/)/);
        if (n)return n[1];
        throw new Error("no process engine selected")
      }])
    }];
    a.config(o), a.config(["camDateFormatProvider", function (e) {
      var t = {
        monthName: "MMMM",
        day: "DD",
        abbr: "lll",
        normal: "YYYY-MM-DD[T]HH:mm:SS",
        "long": "LLLL",
        "short": "LL"
      };
      for (var n in t)e.setDateFormat(t[n], n)
    }]), require(["domReady!"], function () {
      i.bootstrap(document, [a.name]);
      var e = document.getElementsByTagName("html")[0];
      e.setAttribute("ng-app", a.name), e.dataset && (e.dataset.ngApp = a.name), top !== window && window.parent.postMessage({type: "loadamd"}, "*")
    })
  })
});
//# sourceMappingURL=camunda-cockpit-ui.js
//# sourceMappingURL=camunda-cockpit-ui.js.map
