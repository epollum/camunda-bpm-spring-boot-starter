define("text!standaloneTask/app/navbar/action/cam-tasklist-navbar-action-create-task-plugin.html", [], function () {
  return '<a href\n   ng-click="open()">\n  <span class="glyphicon glyphicon-plus-sign"></span>\n  {{ \'CREATE_TASK\' | translate }}\n</a>\n'
}), define("text!standaloneTask/app/navbar/action/modals/cam-tasklist-create-task-modal.html", [], function () {
  return '<!-- # CE - camunda-bpm-webapp/webapp/src/main/resources-plugin/standaloneTask/app/navbar/action/modals/cam-tasklist-create-task-modal.html -->\n<div class="modal-header">\n  <h3 class="cam-tasklist-create-task modal-title">{{ \'CREATE_TASK\' | translate }}</h3>\n</div>\n\n<div class="modal-body">\n\n  <div notifications-panel></div>\n\n  <form class="form-horizontal"\n        name="newTaskForm"\n        role="form">\n    <div ng-init="setNewTaskForm(this.newTaskForm)"></div>\n\n    <div class="form-group">\n      <label for="filter-form-color"\n             class="col-xs-2 control-label">{{ \'NEW_TASK_NAME\' | translate }}</label>\n      <div class="col-xs-10">\n        <input class="form-control"\n               name="taskName"\n               ng-model="task.name"\n               required\n               type="text" />\n        <span ng-if="this.newTaskForm.taskName.$invalid && this.newTaskForm.taskName.$dirty"\n              class="has-error">\n          <span ng-show="this.newTaskForm.taskName.$error.required"\n                class="help-block">\n            {{ \'REQUIRED_FIELD\' | translate }}\n          </span>\n        </span>\n      </div>\n    </div>\n\n    <div class="form-group">\n      <label for="filter-form-color"\n             class="col-xs-2 control-label">{{ \'NEW_TASK_ASSIGNEE\' | translate }}</label>\n      <div class="col-xs-10">\n        <input class="form-control"\n               name="taskAssignee"\n               ng-model="task.assignee"\n               type="text" />\n      </div>\n    </div>\n\n    <div class="form-group">\n      <label for="filter-form-color"\n             class="col-xs-2 control-label">{{ \'NEW_TASK_DESCRIPTION\' | translate }}</label>\n      <div class="col-xs-10">\n        <textarea class="form-control"\n                  name="taskDescription"\n                  ng-model="task.description"\n                  rows="4">\n        </textarea>\n      </div>\n    </div>\n\n  </form>\n\n</div>\n\n<div class="modal-footer">\n  <div class="row row-action">\n\n    <div class="col-xs-12">\n      <button class="btn btn-xs btn-link"\n              type="button"\n              ng-click="$dismiss()">\n        {{ \'CLOSE\' | translate }}\n      </button>\n\n      <button class="btn btn-primary"\n              type="submit"\n              ng-click="save()"\n              ng-disabled="!isValid()">\n        {{ \'SAVE\' | translate }}\n      </button>\n    </div>\n\n  </div>\n</div>\n<!-- / CE - camunda-bpm-webapp/webapp/src/main/resources-plugin/standaloneTask/app/navbar/action/modals/cam-tasklist-create-task-modal.html -->\n'
}), define("standaloneTask/app/navbar/action/cam-tasklist-navbar-action-create-task-plugin", ["text!./cam-tasklist-navbar-action-create-task-plugin.html", "text!./modals/cam-tasklist-create-task-modal.html"], function (a, n) {
  "use strict";
  var t = ["$scope", "$modal", function (a, t) {
    a.open = function () {
      t.open({size: "lg", controller: "camCreateTaskModalCtrl", template: n}).result.then(function () {
        a.tasklistApp && a.tasklistApp.refreshProvider && a.tasklistApp.refreshProvider.refreshTaskList()
      })
    }
  }], s = function (n) {
    n.registerDefaultView("tasklist.navbar.action", {
      id: "create-task-action",
      template: a,
      controller: t,
      priority: 200
    })
  };
  return s.$inject = ["ViewsProvider"], s
}), define("standaloneTask/app/navbar/action/modals/cam-tasklist-create-task-modal", ["angular"], function (a) {
  "use strict";
  return ["$scope", "$translate", "Notifications", "camAPI", function (n, t, s, e) {
    var l = {
      name: null,
      assignee: null,
      description: null,
      priority: 50
    }, o = e.resource("task"), i = n.task = a.copy(l), r = null;
    n.setNewTaskForm = function (a) {
      r = a
    }, n.$on("$locationChangeSuccess", function () {
      n.$dismiss()
    });
    var c = n.isValid = function () {
      return r && r.$valid
    };
    n.save = function () {
      c() && o.create(i, function (a) {
        a ? t("TASK_SAVE_ERROR").then(function (t) {
          s.addError({status: t, message: a ? a.message : "", exclusive: !0, scope: n})
        }) : n.$close()
      })
    }
  }]
}), define("standaloneTask/app/navbar/main", ["angular", "./action/cam-tasklist-navbar-action-create-task-plugin", "./action/modals/cam-tasklist-create-task-modal"], function (a, n, t) {
  var s = a.module("tasklist.plugin.standaloneTask.navbar.action", []);
  return s.config(n), s.controller("camCreateTaskModalCtrl", t), s
}), define("standaloneTask/app/plugin", ["angular", "./navbar/main"], function (a, n) {
  return a.module("tasklist.plugin.standaloneTask", [n.name])
}), require(["standaloneTask/app/plugin"]);
//# sourceMappingURL=plugin.js
//# sourceMappingURL=plugin.js.map
