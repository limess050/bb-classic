/*jslint nomen: true, white: true*/
/*global document*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbviews module.
        root.define('bbviews', [
            'underscore',
            'backbone',
            'bbtemplates',
            'bootstrap',
            'jquerydeserialize',
            'backbonecache'
        ], factory);
    } else {
        // Browser globals
        root.bbviews = factory(
            root._,
            root.Backbone,
            root.bbtemplates
        );
    }
}(this, function(_, Backbone, bbtemplates) {
    'use strict';
    var bbviews = {},
//         uniq_hash = bbviews.uniq_hash = [],
//         add_hash = function () {
//             if(window.BB && window.BB.workspace){
//                 var h,
//                     rs = /^[#\/]|\s+$/g,
//                     rr = _.map(_.filter(_.keys(window.BB.workspace.routes),function(i){
//                         return i.indexOf("*")===-1;
//                     }),function(i){
//                         return window.BB.workspace._routeToRegExp(i);
//                     }),
//                     cur_hashs = _.uniq(_.map(Backbone.$("a"), function (i) {
//                         return i.hash.replace(rs,'');
//                     })),
//                     inroutes = function(routes, hash) {
//                         return _.every(routes,function(i){
//                             return !i.test(hash);
//                         });
//                     };
//                 while ((h = cur_hashs.pop())) {
//                     if (inroutes(rr,h)) {
//                         if (uniq_hash.indexOf(h) === -1) {
//                             uniq_hash.push(h);
//                         }
//                     }
//                 }
//             }
//         },
        cc = 'Companies',
        hashcc = '#' + cc.toLowerCase(),
        cpath = [
            hashcc,
            cc
        ],
        pp = 'Projects',
        hashpp = '#' + pp.toLowerCase(),
        ppath = [
            hashpp,
            pp
        ],
        edititem = function(e) {
            e.preventDefault();
            this.currentTarget(e).edit = true;
            this.render();
        },
        resetitem = function(e) {
            e.preventDefault();
            this.currentTarget(e).edit = false;
            this.render();
        },
        removeitem = function(e) {
            e.preventDefault();
            this.currentTarget(e).destroy();
            this.render();
        },
        saveitem = function(e) {
            e.preventDefault();
            var model = this.currentTarget(e);
            model.edit = false;
            model.save(this.parseData(e.currentTarget));
            this.render();
        },
        crudactions = {
            edititem: edititem,
            removeitem: removeitem,
            resetitem: resetitem
        },
        timeevents = {
            'click .edit': 'edititem',
            'click .next': 'next',
            'click .previous': 'previous',
            'click .remove': 'removeitem',
            'click .reset': 'resetitem',
            'click .save': 'saveitem',
            'click thead>tr>th': 'sortitems'
        },
        todoevents = {
            'click .reset': 'resetitem',
            'click .save': 'saveitem',
            'click .todo.uncompleteitem': 'uncomplete',
            'click .todo.edititem': 'edititem',
            'click .todo.completeitem': 'complete'
        },
        _result = _.result,
        $ = Backbone.$,
        render = function(template, data, settings) {
            return _.template(bbtemplates[template], data, settings);
        },
        BBView = Backbone.View.extend({
            deps: function() {
                return this.collection ? [this.collection] : [];
            },
            fetch: function() {
                var i, deps = this.deps();
                for (i in deps) {
                    if (deps.hasOwnProperty(i) && !deps[i].fetchonce()) {break;}
                }
            },
            title: function() {
                return this.model.name();
            },
            name: function() {
                var p = this.Path();
                return p ? _.pluck(p, 1).reverse().join(' - ') : _result(this, 'title');
            },
            Path: function() {
                var p = _result(this, 'path');
                if (p) {p.push(['', _result(this, 'title')]);}
                return p;
            },
            PageTitle: function() {
                return _result(this, 'name') + ' - BB';
            },
            PageHeader: function() {
                return _result(this, 'title') || _result(this, 'name');
            },
            render: function() {
                this.$el.html(render(this.template, {'view': this}));
                this.delegateEvents();
                if (this.PageTitle) {document.title = this.PageTitle();}
                $(_.filter($('ul.projectnav li').removeClass('active'), function(i) {
                    return $(i).find('a:visible')[0] && document.location.hash.indexOf($(i).find('a:visible')[0].hash) !== -1;
                })).filter(':last').addClass('active');
                this.fetch();
//                 add_hash();
                return this;
            },
            itemblock: function(item, template) {
                return render(item.edit ? template + 'edit' : template, {'item': item, 'view': this});
            },
            block: function(template) {
                return render(template, {'view': this});
            }
        }),
        ProjectBBView = BBView.extend({
            deps: function() {
                return [this.collection, this.options.collections.projects];
            },
            path: function() {
                return [
                    cpath,
                    [
                        hashcc + '/' + (this.model.get('company') && this.model.get('company').id),
                        this.model.get('company') && this.model.get('company').name
                    ],
                    ppath,
                    [
                        hashpp + '/' + this.model.id,
                        this.model.name()
                    ]
                ];
            }
        }),
        PagesBBView = ProjectBBView.extend({
            events: {
                'click .next': 'next',
                'click .previous': 'previous'
            },
            previous: function(e) {
                e.preventDefault();
                return this.collection.hasPrevious() && this.collection.getPreviousPage();
            },
            next: function(e) {
                e.preventDefault();
                return this.collection.hasNext() && this.collection.getNextPage();
            }
        }),
        TitleBBView = ProjectBBView.extend({
            cur_item: null,
            title: function() {
                return _result(this, 'itemtitle');
            },
            itemtitle: function() {
                var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item;
                return item && item.name();
            },
            nameParent: '',
            basepath: function() {
                var bpath = ProjectBBView.prototype.path.apply(this);
                bpath.push([
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()),
                    this.nameParent
                ]);
                return bpath;
            },
            extrapath: [],
            path: function() {
                var bpath = _result(this, 'basepath');
                _.each(_result(this, 'extrapath'), function(i) {bpath.push(i);});
                return bpath;
            }
        });
    // All People View - people
    bbviews.AllPeopleView = BBView.extend({
        deps: function() {
            return [this.collection, this.options.collections.companies];
        },
        template: '#people',
        title: 'People'
    });
    // Projects View - projects
    bbviews.ProjectsView = BBView.extend({
        template: hashpp,
        title: pp
    });
    // Project View - projects/:id
    bbviews.ProjectView = BBView.extend({
        deps: function() {
            return [this.options.collections.projects];
        },
        path: function() {
            return ProjectBBView.prototype.path.apply(this).slice(0, -1);
        },
        template: '#project'
    });
    // Companies View - companies
    bbviews.CompaniesView = BBView.extend({
        template: hashcc,
        title: cc
    });
    // Company View - companies/:id
    bbviews.CompanyView = BBView.extend({
        deps: function() {
            return [this.options.collections.companies, this.options.collections.projects, this.options.collections.people];
        },
        path: function() {
            return [cpath];
        },
        template: '#company'
    });
    // People View - projects/:id/people
    bbviews.PeopleView = ProjectBBView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.options.collections.companies];
        },
        template: '#project-people',
        title: 'People'
    });
    // Person View - projects/:id/people/:pid
    bbviews.PersonView = TitleBBView.extend({
        template: '#project-person',
        nameParent: 'People'
    });
    // Time Entries View - projects/:id/time_entries
    bbviews.TimeEntriesView = PagesBBView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.options.collections.people];
        },
        pagerid: 'project-time',
        events: _.extend(timeevents, {
            'click .add': 'additem'
        }),
        parseData: function(selector) {
            var form = this.$(selector).parents('.form');
            return {
                'date': form.find('[name=date]').val(),
                'description': form.find('[name=description]').val(),
                'hours': parseFloat(form.find('[name=hours]').val(), 10),
                'person-id': parseInt(form.find('[name=person-id]').val(), 10)
            };
        },
        finishItem: function(item) {
            item.set({
                'person-name': this.options.collections.people.get(item.get('person-id')).name(),
                'project-id': this.model.id
            }, {silent: true});
            if (!this.collection.fullCollection.comparator) {this.collection.setSorting('id', 1);}
            this.collection.fullCollection.sort();
            this.render();
            return true;
        },
        sortitems: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('sort') || $(e.currentTarget).text();
            this.collection.setSorting(id, -this.collection.state.order);
            this.collection.fullCollection.sort();
        },
        additem: function(e) {
            e.preventDefault();
            var view = this,
                success = function(model) {return view.finishItem(model);};
            this.collection.create(this.parseData(e.currentTarget), {wait: true, success: success});
        },
        currentTarget: function(e) {
            return this.collection.get($(e.currentTarget).parents('tr').data('id'));
        },
        saveitem: saveitem,
        template: '#project-time',
        title: 'Time'
    }).extend(crudactions);
    // Todo Time Entries View - projects/:id/time_entries/todo_items/:tiid
    bbviews.TodoTimeEntriesView = bbviews.TimeEntriesView.extend({
        pagerid: 'todo-time',
        finishItem: function(item) {
            return item.set({
                'person-name': this.options.collections.people.get(item.get('person-id')).name(),
                'project-id': this.model.id,
                'todo-item-id': this.cur_item
            }, {silent: true});
        },
        template: '#todo-time'
    });
    // Time Report View - time_report
    bbviews.TimeReportView = bbviews.TimeEntriesView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.options.collections.people, this.options.collections.companies];
        },
        pagerid: 'time-report',
        events: _.extend(timeevents, {
            'click #getreport': 'getreport'
        }),
        getreport_filter: function() {
            return _.object(_.pluck(this.collection.filter_report, 'name'), _.pluck(this.collection.filter_report, 'value'));
        },
        getreport: function(e) {
            e.preventDefault();
            this.collection.filter_report = _.filter(this.$('form#makereport').serializeArray(), function(i) {return i.value; });
            this.collection.fetch({cache: true, reset: true});
        },
        template: '#time-report',
        path: false,
        title: 'Time report'
    });
    // Post Comments View - projects/:id/posts/:pid/comments
    bbviews.PostCommentsView = TitleBBView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.options.collections.project_posts.get_or_create(this.model.id)];
        },
        template: '#project-post-comments',
        extrapath: function() {
            return [
                [
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()) + '/' + this.cur_item,
                    _result(this, 'itemname')
                ]
            ];
        },
        nameParent: 'Posts',
        itemname: function() {
            var item = _.isFinite(this.cur_item) && this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return title;
        },
        title: 'Comments'
    });
    // Calendar Entry Comments View - projects/:id/calendar/:cid/comments
    bbviews.CalendarEntryCommentsView = bbviews.PostCommentsView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.options.collections.project_calendar.get_or_create(this.model.id)];
        },
        template: '#project-calendar-entry-comments',
        nameParent: 'Calendar',
        itemname: function() {
            var item = _.isFinite(this.cur_item) && this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return title;
        }
    });
    // Posts View - projects/:id/posts
    bbviews.PostsView = ProjectBBView.extend({
        template: '#project-posts',
        title: 'Posts'
    });
    // Post View - projects/:id/posts/:pid
    bbviews.PostView = TitleBBView.extend({
        template: '#project-post',
        nameParent: 'Posts'
    });
    // Files View - projects/:id/files
    bbviews.FilesView = PagesBBView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.options.collections.people, this.options.collections.project_categories.get_or_create(this.model.id)];
        },
        pagerid: 'project-files',
        template: '#project-files',
        title: 'Files'
    });
    // File View - projects/:id/files/:fid
    bbviews.FileView = TitleBBView.extend({
        deps: bbviews.FilesView.prototype.deps,
        template: '#project-file',
        nameParent: 'Files'
    });
    // Calendar View - projects/:id/calendar
    bbviews.CalendarView = ProjectBBView.extend({
        events: {
            'click .uncompleteitem': 'uncomplete',
            'click .edititem': 'edititem',
            'click .removeitem': 'removeitem',
            'click .completeitem': 'complete',
            'click .reset': 'resetitem',
            'click .save': 'saveitem'
        },
        parseData: function(selector) {
            var form = this.$(selector).parents('.form');
            return {
                'deadline': form.find('[name=deadline]').val(),
                'start-at': form.find('[name=start-at]').val(),
                'title': form.find('[name=title]').val(),
                'type': form.find('[name=type]').val()
            };
        },
        finishItem: function(item) {
            return item.set({
                'project-id': this.model.id
            }, {silent: true});
        },
        complete: function(e) {
            e.preventDefault();
            this.currentTarget(e).complete();
            this.render();
        },
        uncomplete: function(e) {
            e.preventDefault();
            this.currentTarget(e).uncomplete();
            this.render();
        },
        currentTarget: function(e) {
            return this.collection.get($(e.currentTarget).data('id'));
        },
        saveitem: saveitem,
        template: '#project-calendar',
        title: 'Calendar'
    }).extend(crudactions);
    // Calendar Entry View - projects/:id/calendar/:cid
    bbviews.CalendarEntryView = TitleBBView.extend({
        template: '#project-calendar-entry',
        nameParent: 'Calendar'
    });
    // Categories View - projects/:id/categories
    bbviews.CategoriesView = PagesBBView.extend({
        pagerid: 'project-categories',
        template: '#project-categories',
        title: 'Categories'
    });
    // Category View - projects/:id/categories/:cid
    bbviews.CategoryView = TitleBBView.extend({
        template: '#project-category',
        nameParent: 'Categories'
    });
    // All Person View - people/:id
    bbviews.AllPersonView = BBView.extend({
        deps: function() {
            return [this.options.collections.people, this.options.collections.companies];
        },
        template: '#person',
        path: function() {
            return [
                [
                    '#people',
                    'People'
                ]
            ];
        }
    });
    // Todos View - todos
    bbviews.TodosView = BBView.extend({
        cur_item: 1,
        deps: bbviews.TimeEntriesView.prototype.deps,
        events: {
            'click .todo-lists.completeitem': 'complete',
            'change select[name=target]': 'selectTarget'
        },
        complete: function(e) {
            e.preventDefault();
            var target = $(e.currentTarget),
                id = target.data('id'),
                item = new this.options.collections.todo_items.model({id: id}),
                tid = target.data('todolistId'),
                titem = this.collection.get(tid),
                items = _.where(titem.get('todo-items'), {id: id});
            item.complete();
            _.each(items, function(i) {i.completed = true;});
            this.render();
        },
        selectTarget: function(e) {
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch({cache: true, reset: true});
        },
        template: '#todo-lists',
        title: function() {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s to-dos" : this.collection.responsible_party + "'s to-dos";
            }
            if (this.collection.responsible_party === null) {
                return 'My to-dos';
            }
            if (this.collection.responsible_party === '') {
                return 'Unassigned to-dos';
            }
            return 'To-dos';
        },
        description: function() {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s" : this.collection.responsible_party + "'s";
            }
            if (this.collection.responsible_party === null) {
                return 'My';
            }
            if (this.collection.responsible_party === '') {
                return 'Unassigned';
            }
            return 'All';
        }
    });
    // Todo Lists View - projects/:id/todo_lists
    bbviews.TodoListsView = ProjectBBView.extend({
        template: '#project-todo-lists',
        events: {
            'click .add_todolist .add': 'additem',
            'click .reset': 'resetitem',
            'click .save': 'saveitem',
            'click .todolist.edititem': 'edititem',
            'click .todolist.removeitem': 'removeitem'
        },
        finishItem: function(item) {
            item.set({
                'project-id': this.model.id
            }, {silent: true});
            this.render();
            return true;
        },
        currentTarget: bbviews.CalendarView.prototype.currentTarget,
        saveitem: saveitem,
        parseData: function(selector) {
            var form = this.$(selector).parents('.form');
            return {
                'description': form.find('[name=description]').val(),
                'name': form.find('[name=name]').val(),
                'private': form.find('[name=private]').is(':checked'),
                'tracked': form.find('[name=tracked]').is(':checked')
            };
        },
        additem: bbviews.TimeEntriesView.prototype.additem,
        title: 'To-dos'
    }).extend(crudactions);
    // Todo List View - projects/:id/todo_lists/:tlid
    bbviews.TodoListView = TitleBBView.extend({
        deps: function() {
            return [this.collection, this.options.collections.projects, this.todos(), this.options.collections.project_people.get_or_create(this.model.id)];
        },
        events: _.extend(todoevents, {
            'click .add_todo .add': 'additem',
            'click .todo.removeitem': 'removeitem'
        }),
        todos: function() {
            return this.options.collections.todo_items.get_or_create(this.cur_item);
        },
        parseData: function(selector) {
            var form = this.$(selector).parents('.form');
            return {
                'content': form.find('[name=content]').val(),
                'due-at': form.find('[name=due-at]').val(),
                'notify': form.find('[name=notify]').is(':checked'),
                'responsible-party': form.find('[name=responsible-party]').val()
            };
        },
        currentTarget: function(e) {
            return this.todos().get($(e.currentTarget).data('id'));
        },
        saveitem: saveitem,
        complete: bbviews.CalendarView.prototype.complete,
        uncomplete: bbviews.CalendarView.prototype.uncomplete,
        finishItem: function(item) {
            var data = {
                'comments-count': 0,
                'completed': false,
                'project-id': this.model.id,
                'todo-list-id': this.cur_item
            };
            if (_.isFinite(item.get('responsible-party'))) {
                data = _.extend(data, {
                    'responsible-party-id': parseInt(item.get('responsible-party'), 10),
                    'responsible-party-name': this.options.collections.project_people.get_or_create(this.model.id).get(item.get('responsible-party')).name(),
                    'responsible-party-type': 'Person'
                });
            } else {
                data = _.extend(data, {
                    'responsible-party-id': undefined,
                    'responsible-party-name': undefined,
                    'responsible-party-type': undefined
                });
            }
            item.set(data, {silent: true});
            this.render();
            return true;
        },
        additem: function(e) {
            e.preventDefault();
            var view = this,
                success = function(model) {return view.finishItem(model);};
            this.todos().create(this.parseData(e.currentTarget), {wait: true, success: success});
        },
        template: '#project-todo-list',
        idParent: 'todo_lists',
        nameParent: 'To-dos'
    }).extend(crudactions);
    // Todo Item View - projects/:id/todo_lists/:tlid/:tiid
    bbviews.TodoItemView = bbviews.TodoListView.extend({
        todo_item: null,
        deps: function() {
            return [this.collection, this.options.collections.projects, this.todo_lists, this.todos()];
        },
        events: todoevents,
        currentTarget: function() {
            return this.todos().get(this.todo_item);
        },
        template: '#project-todo-item',
        extrapath: bbviews.PostCommentsView.prototype.extrapath,
        itemname: function() {
            var list = this.cur_item && this.todo_lists.get(this.cur_item),
                title = list && list.name();
            return title;
        },
        itemtitle: function() {
            var item = _.isFinite(this.todo_item) ? this.todos().get(this.todo_item) : this.todo_item,
                itemtitle = item && item.name();
            return itemtitle;
        }
    });
    // Todo Item Comments View - projects/:id/todo_lists/:tlid/:tiid/comments
    bbviews.TodoItemCommentsView = bbviews.TodoItemView.extend({
        template: '#project-todo-item-comments',
        extrapath: function() {
            var bpath = bbviews.TodoItemView.prototype.extrapath.apply(this);
            return [
                bpath.shift(),
                [
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()) + '/' + this.cur_item + '/' + this.todo_item,
                    _result(this, 'itemtitle')
                ]
            ];
        },
        title: 'Comments'
    });
    // Nav View - no url
    bbviews.NavView = BBView.extend({
        navitems: {
            projects: 'Projects',
            companies: 'Companies',
            todos: 'To-Dos',
            time_report: 'Time',
            people: 'People'
        },
        dropdownitems: {
            me: {icon: 'user', title: 'My profile'},
            todos: {icon: 'tasks', title: 'My todos'},
            time_report: {icon: 'time', title: 'My time'}
        },
        template: '#nav',
        initialize: function() {
            this.model.bind('change', this.render, this);
            Backbone.history.on('route', function() {
                $(_.filter($('.navbar ul.nav li').removeClass('active'), function(i) {
                    return $(i).find('a:visible')[0] && document.location.hash.indexOf($(i).find('a:visible')[0].hash) !== -1;
                })).addClass('active');
            }, this);
        }
    });
    return bbviews;
}));
