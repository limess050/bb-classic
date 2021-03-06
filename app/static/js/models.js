/*jslint nomen: true, white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbmodels module.
        root.define('bbmodels', [
            'underscore',
            'backbone'
        ], factory);
    } else {
        // Browser globals
        root.bbmodels = factory(
            root._,
            root.Backbone
        );
    }
}(this, function(_, Backbone) {
    'use strict';
    var bbmodels = {},
        urlError = function() {
            throw new Error('A "url" property or function must be specified');
        },
        BBModel = Backbone.Model.extend({
            mainattr: 'name',
            name: function() {
                return this.get(this.mainattr);
            },
            url: function() {
                return this.getUrl();
            },
            getUrl: function() {
                var base;
                if (!this.isNew()) {
                    base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
                    base = base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id) + '.xml';
                } else {
                    base = _.result(this.collection, 'url') || urlError();
                }
                return base;
            },
            sync: function(method, model, options) {
                if (!options.url) {
                    switch (method) {
                    case 'read':
                    case 'create':
                        options.url = _.result(model, 'url');
                        break;
                    case 'update':
                    case 'delete':
                        options.url = _.result(model, 'getUrl');
                        break;
                    default:
                        break;
                    }
                }
                return Backbone.sync(method, model, options);
            }
        });
    bbmodels.Project = BBModel.extend({
        urlRoot: '/api/projects/'
    });
    bbmodels.Company = BBModel.extend({
        urlRoot: '/api/companies/'
    });
    bbmodels.Person = BBModel.extend({
        urlRoot: '/api/people/',
        name: function() {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    bbmodels.Post = BBModel.extend({
        mainattr: 'title',
        urlRoot: '/api/posts/'
    });
    bbmodels.Attachment = BBModel.extend();
    bbmodels.CalendarEntry = BBModel.extend({
        mainattr: 'title',
        urlRoot: function() {
            return '/api/projects/' + this.collection.parent_id + '/calendar_entries/';
        },
        complete: function() {
            this.save('completed', true, {url: _.result(this, 'url').replace('.xml', '/complete.xml')});
        },
        uncomplete: function() {
            this.save('completed', false, {url: _.result(this, 'url').replace('.xml', '/uncomplete.xml')});
        }
    });
    bbmodels.Category = BBModel.extend({
        urlRoot: '/api/categories/'
    });
    bbmodels.TimeEntry = BBModel.extend({
        mainattr: 'description',
        urlRoot: '/api/time_entries/'
    });
    bbmodels.TodoItem = bbmodels.CalendarEntry.extend({
        mainattr: 'content',
        urlRoot: '/api/todo_items/'
    });
    bbmodels.TodoList = BBModel.extend({
        urlRoot: '/api/todo_lists/'
    });
    bbmodels.Comment = BBModel.extend({
        mainattr: 'body',
        urlRoot: '/api/comments/'
    });
    bbmodels.MyModel = bbmodels.Person.extend({
        defaults: {
            id: null
        },
        url: '/api/me.xml'
    });
    return bbmodels;
}));
