/*jslint nomen: true*/
/*global define*/
define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    "use strict";
    var bbmodels = {};
    bbmodels.Project = Backbone.Model.extend({
        urlRoot: "/api/projects/",
        icon: function () {
            switch (this.get('status')) {
            case "active":
                return "icon-play";
            case "archived":
                return "icon-stop";
            case "on_hold":
                return "icon-pause";
            }
        }
    });
    bbmodels.Company = Backbone.Model.extend({
        urlRoot: "/api/companies/"
    });
    bbmodels.Person = Backbone.Model.extend({
        urlRoot: "/api/people/",
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    bbmodels.Post = Backbone.Model.extend({
        urlRoot: "/api/posts/"
    });
    bbmodels.Attachment = Backbone.Model.extend();
    bbmodels.CalendarEntry = Backbone.Model.extend({
        urlRoot: "/api/projects/#{project_id}/calendar_entries/"
    });
    bbmodels.Category = Backbone.Model.extend({
        urlRoot: "/api/categories/"
    });
    bbmodels.TimeEntry = Backbone.Model.extend({
        urlRoot: "/api/time_entries/"
    });
    bbmodels.TodoItem = Backbone.Model.extend({
        urlRoot: "/api/todo_items/",
        complete: function () {
            this.save('completed', true, {url: _.result(this, 'url').replace('.xml', '/complete.xml')});
        },
        uncomplete: function () {
            this.save('completed', false, {url: _.result(this, 'url').replace('.xml', '/uncomplete.xml')});
        }
    });
    bbmodels.TodoList = Backbone.Model.extend({
        urlRoot: "/api/todo_lists/"
    });
    bbmodels.Comment = Backbone.Model.extend({
        urlRoot: "/api/comments/"
    });
    bbmodels.MyModel = bbmodels.Person.extend({
        defaults: {
            id: null
        },
        url: "/api/me.xml"
    });
    return bbmodels;
});
