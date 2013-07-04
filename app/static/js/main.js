/*jslint nomen: true, white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbmain module.
        root.define('bbmain', [
            'underscore',
            'backbone',
            'bbmodels',
            'bbcollections',
            'bbviews',
            'backboneanalytics'
        ], factory);
    } else {
        // Browser globals
        root.BB = factory(
            root._,
            root.Backbone,
            root.bbmodels,
            root.bbcollections,
            root.bbviews
        );
    }
}(this, function(_, Backbone, bbmodels, bbcollections, bbviews) {
    'use strict';
    var models = {},
        collections = {},
        views = {},
        viewdata = {
            className: 'content',
            collections: collections
        },
        oproject,
        otime,
        Workspace = Backbone.Router.extend({
            routes: {
                'projects': 'projects',
                'projects:tab': 'projects',
                'projects/:id': 'project',
                'projects/:id/todo_lists': 'project_todo_lists',
                'projects/:id/todo_lists/:tlid': 'project_todo_list',
                'projects/:id/todo_lists/:tlid/:tiid': 'project_todo_item',
                'projects/:id/todo_lists/:tlid/:tiid/comments': 'project_todo_item_comments',
                'projects/:id/time_entries/todo_items/:tiid': 'todo_time_entries',
                'projects/:id/time_entries': 'project_time_entries',
                'projects/:id/people': 'project_people',
                'projects/:id/people/:pid': 'project_person',
                'projects/:id/posts': 'project_posts',
                'projects/:id/posts/:pid': 'project_post',
                'projects/:id/posts/:pid/comments': 'project_post_comments',
                'projects/:id/files': 'project_files',
                'projects/:id/files/:fid': 'project_file',
                'projects/:id/calendar': 'project_calendar',
                'projects/:id/calendar/:cid': 'project_calendar_entry',
                'projects/:id/calendar/:cid/comments': 'project_calendar_entry_comments',
                'projects/:id/categories': 'project_categories',
                'projects/:id/categories/:cid': 'project_category',
                'companies': 'companies',
                'companies/:id': 'company',
                'people': 'people',
                'people:tab': 'people',
                'people/:id': 'person',
                'me': 'me',
                'todos': 'todos',
                'time_report': 'time_report',
                '*actions': 'defaultRoute'
            }
        }),
        set_model = function(id, collection, view) {
            if (collection.get(id)) {
                view.model = collection.get(id);
            } else {
                view.model.id = id;
            }
            return view.model;
        },
        set_current = function(view) {
            Backbone.$('.container').empty().append(view.render().el);
        },
        workspace = new Workspace();
    models.mydata = new bbmodels.MyModel();
    models.project = new bbmodels.Project();
    models.company = new bbmodels.Company();
    models.person = new bbmodels.Person();
    collections.projects = new bbcollections.Projects();
    collections.companies = new bbcollections.Companies();
    collections.people = new bbcollections.People();
    collections.todos = new bbcollections.TodoLists();
    collections.times = new bbcollections.TimeEntries();
    views.projects = new bbviews.ProjectsView(_.extend({
        collection: collections.projects
    }, viewdata));
    views.companies = new bbviews.CompaniesView(_.extend({
        collection: collections.companies
    }, viewdata));
    views.people = new bbviews.AllPeopleView(_.extend({
        collection: collections.people
    }, viewdata));
    views.time_report = new bbviews.TimeReportView(_.extend({
        collection: collections.times
    }, viewdata));
    views.todos = new bbviews.TodosView(_.extend({
        collection: collections.todos,
        mydata: models.mydata
    }, viewdata));
    collections.project_people = new bbcollections.People();
    collections.project_categories = new bbcollections.Categories();
    collections.project_posts = new bbcollections.Posts();
    collections.project_files = new bbcollections.Attachments();
    collections.project_todo_lists = new bbcollections.TodoLists();
    collections.project_calendar = new bbcollections.Calendar();
    collections.project_time_entries = new bbcollections.TimeEntries();
    collections.todo_items = new bbcollections.TodoItems();
    collections.todo_time_entries = new bbcollections.TodoTimeEntries();
    collections.project_todo_item_comments = new bbcollections.TodoComments();
    collections.project_post_comments = new bbcollections.PostComments();
    collections.project_calendar_entry_comments = new bbcollections.CalendarEntryComments();
    views.company_view = new bbviews.CompanyView(_.extend({
        model: models.company
    }, viewdata));
    views.person_view = new bbviews.AllPersonView(_.extend({
        model: models.person
    }, viewdata));
    oproject = _.extend({
        model: models.project
    }, viewdata);
    views.project_view = new bbviews.ProjectView(oproject);
    views.project_people = new bbviews.PeopleView(oproject);
    views.project_person = new bbviews.PersonView(oproject);
    views.project_categories = new bbviews.CategoriesView(oproject);
    views.project_category = new bbviews.CategoryView(oproject);
    views.project_posts = new bbviews.PostsView(oproject);
    views.project_post = new bbviews.PostView(oproject);
    views.project_calendar = new bbviews.CalendarView(oproject);
    views.project_calendar_entry = new bbviews.CalendarEntryView(oproject);
    views.project_files = new bbviews.FilesView(oproject);
    views.project_file = new bbviews.FileView(oproject);
    otime = _.extend({
        mydata: models.mydata
    }, oproject);
    views.project_time_entries = new bbviews.TimeEntriesView(otime);
    views.todo_time_entries = new bbviews.TodoTimeEntriesView(otime);
    views.project_post_comments = new bbviews.PostCommentsView(oproject);
    views.project_calendar_entry_comments = new bbviews.CalendarEntryCommentsView(oproject);
    views.project_todo_lists = new bbviews.TodoListsView(oproject);
    views.project_todo_list = new bbviews.TodoListView(oproject);
    views.project_todo_item = new bbviews.TodoItemView(oproject);
    views.project_todo_item_comments = new bbviews.TodoItemCommentsView(oproject);
    workspace.on('route', function(route, params) {
        var id, cur_item;
        if (_.contains(['projects', 'companies', 'people', 'time_report', 'todos'], route)) {
            set_current(views[route]);
        } else if (_.contains(['project_people', 'project_categories', 'project_time_entries', 'project_posts', 'project_files', 'project_calendar', 'project_todo_lists'], route)) {
            id = parseInt(params[0], 10);
            set_model(id, collections.projects, views[route]);
            views[route].collection = collections[route].get_or_create(id);
            set_current(views[route]);
        } else if (_.contains(['project_person', 'project_post', 'project_file', 'project_calendar_entry', 'project_category', 'project_todo_list', 'project_calendar_entry_comments', 'project_post_comments', 'todo_time_entries'], route)) {
            id = parseInt(params[0], 10);
            cur_item = parseInt(params[1], 10);
            set_model(id, collections.projects, views[route]);
            views[route].cur_item = cur_item;
            switch (route) {
            case 'project_person':
                views[route].collection = collections.project_people.get_or_create(id);
                break;
            case 'project_calendar_entry':
                views[route].collection = collections.project_calendar.get_or_create(id);
                break;
            case 'project_category':
                views[route].collection = collections.project_categories.get_or_create(id);
                break;
            case 'project_post':
            case 'project_file':
            case 'project_todo_list':
                views[route].collection = collections[route + 's'].get_or_create(id);
                break;
            default:
                views[route].collection = collections[route].get_or_create(cur_item);
            }
            set_current(views[route]);
        }
    }).on('route:project_todo_item', function(id, tlid, tiid) {
        set_model(id, collections.projects, views.project_todo_item);
        views.project_todo_item.cur_item = tlid;
        views.project_todo_item.todo_item = tiid;
        views.project_todo_item.collection = views.project_todo_item.todo_lists = collections.project_todo_lists.get_or_create(id);
        set_current(views.project_todo_item);
    }).on('route:project_todo_item_comments', function(id, tlid, tiid) {
        set_model(id, collections.projects, views.project_todo_item_comments);
        views.project_todo_item_comments.cur_item = tlid;
        views.project_todo_item_comments.todo_item = tiid;
        views.project_todo_item_comments.todo_lists = collections.project_todo_lists.get_or_create(id);
        views.project_todo_item_comments.collection = collections.project_todo_item_comments.get_or_create(tiid);
        set_current(views.project_todo_item_comments);
    }).on('route:project', function(id) {
        set_model(id, collections.projects, views.project_view);
        set_current(views.project_view);
    }).on('route:company', function(id) {
        set_model(id, collections.companies, views.company_view);
        set_current(views.company_view);
    }).on('route:person', function(id) {
        set_model(id, collections.people, views.person_view);
        set_current(views.person_view);
    }).on('route:me', function() {
        views.person_view.model = models.mydata;
        set_current(views.person_view);
    }).on('route:defaultRoute', function() {
        this.navigate('projects', {
            trigger: true
        });
    });
    views.navbar = new bbviews.NavView({
        model: models.mydata,
        el: '.navbar'
    }).render();
    models.mydata.once('sync', function() {
        Backbone.history.start();
    });
    models.mydata.fetch();
    return {
        models: models,
        collections: collections,
        views: views,
        workspace: workspace
    };
}));
