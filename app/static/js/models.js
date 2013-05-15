/*jslint nomen: true*/
/*global window, _, Backbone*/
(function () {
    "use strict";
    var urlError = function () {
            throw new Error('A "url" property or function must be specified');
        },
        BBModel = Backbone.Model.extend({
            url: function () {
                return this.getUrl();
            },
            getUrl: function () {
                var base;
                if (!this.isNew()) {
                    base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
                    base = base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id) + '.xml';
                } else {
                    base = _.result(this.collection, 'url') || urlError();
                }
                return base;
            },
            sync: function() {
                switch (arguments[0]) {
                    case "read":    arguments[2].url = _.result(arguments[1], 'url'); break;
                    case "create":  arguments[2].url = _.result(arguments[1], 'url'); break;
                    case "update":  arguments[2].url = _.result(arguments[1], 'getUrl'); break;
                    case "delete":  arguments[2].url = _.result(arguments[1], 'getUrl'); break;
                    default: break;
                }
                return Backbone.sync.apply(this, arguments);
            }
        });
    window.Project = BBModel.extend({
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
    window.Company = BBModel.extend({
        urlRoot: "/api/companies/"
    });
    window.Person = BBModel.extend({
        urlRoot: "/api/people/",
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    window.Post = BBModel.extend({
        urlRoot: "/api/posts/"
    });
    window.Attachment = BBModel.extend();
    window.CalendarEntry = BBModel.extend({
        urlRoot: "/api/projects/#{project_id}/calendar_entries/"
    });
    window.Category = BBModel.extend({
        urlRoot: "/api/categories/"
    });
    window.TimeEntry = BBModel.extend({
        urlRoot: "/api/time_entries/"
    });
    window.TodoItem = BBModel.extend({
        urlRoot: "/api/todo_items/",
        complete: function () {
            this.save('completed', true, {url: _.result(this, 'url').replace('.xml', '/complete.xml')});
        },
        uncomplete: function () {
            this.save('completed', false, {url: _.result(this, 'url').replace('.xml', '/uncomplete.xml')});
        }
    });
    window.TodoList = BBModel.extend({
        urlRoot: "/api/todo_lists/"
    });
    window.Comment = BBModel.extend({
        urlRoot: "/api/comments/"
    });
    window.MyModel = window.Person.extend({
        defaults: {
            id: null
        },
        url: "/api/me.xml"
    });
}());
