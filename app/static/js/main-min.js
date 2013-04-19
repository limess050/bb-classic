(function(){"use strict";window.onReset=function(){Backbone.history.loadUrl()};var urlError=function(){throw new Error('A "url" property or function must be specified')};Backbone.Model.prototype.url=function(){var base=_.result(this,"urlRoot")||_.result(this.collection,"url")||urlError();if(!this.isNew()){base=base+(base.charAt(base.length-1)==="/"?"":"/")+encodeURIComponent(this.id)+".xml"}return base}})();(function(){"use strict";window.Project=Backbone.Model.extend({urlRoot:"/api/projects/",icon:function(){switch(this.get("status")){case"active":return"icon-play";case"archived":return"icon-stop";case"on_hold":return"icon-pause"}}});window.Company=Backbone.Model.extend({urlRoot:"/api/companies/"});window.Person=Backbone.Model.extend({urlRoot:"/api/people/",name:function(){return this.get("first-name")+" "+this.get("last-name")}});window.Post=Backbone.Model.extend({urlRoot:"/api/posts/"});window.Attachment=Backbone.Model.extend();window.CalendarEntry=Backbone.Model.extend({urlRoot:"/api/projects/#{project_id}/calendar_entries/"});window.Category=Backbone.Model.extend({urlRoot:"/api/categories/"});window.TimeEntry=Backbone.Model.extend({urlRoot:"/api/time_entries/"});window.TodoItem=Backbone.Model.extend({urlRoot:"/api/todo_items/",complete:function(){this.save("completed",true,{url:_.result(this,"url").replace(".xml","/complete.xml")})},uncomplete:function(){this.save("completed",false,{url:_.result(this,"url").replace(".xml","/uncomplete.xml")})}});window.TodoList=Backbone.Model.extend({urlRoot:"/api/todo_lists/"});window.Comment=Backbone.Model.extend({urlRoot:"/api/comments/"});window.MyModel=window.Person.extend({defaults:{id:null},url:"/api/me.xml"})})();(function(){"use strict";var BBCollectionExtra={fetchonce:function(){var fetched=this.fetched;if(!fetched){this.fetched=true;this.fetch({cache:true})}return fetched},get_or_create:function(id){if(!this[id]){this[id]=this.clone();this[id].parent_id=id;this[id].on("reset",window.onReset);this[id].on("sync",window.onReset)}return this[id]}},BBCollection=Backbone.Collection.extend(BBCollectionExtra),BBPCollection=Backbone.PageableCollection.extend(BBCollectionExtra);window.Projects=BBCollection.extend({url:"/api/projects.xml",model:window.Project});window.Companies=BBCollection.extend({url:"/api/companies.xml",model:window.Company});window.People=BBCollection.extend({parent_id:null,url:function(){return _.isFinite(this.parent_id)?"/api/projects/"+this.parent_id+"/people.xml":"/api/people.xml"},model:window.Person});window.Posts=BBCollection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/posts.xml"},model:window.Post});window.Attachments=BBPCollection.extend({mode:"client",parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/attachments.xml"},model:window.Attachment});window.Calendar=BBCollection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/calendar_entries.xml"},model:window.CalendarEntry});window.Categories=BBPCollection.extend({mode:"client",parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/categories.xml"},model:window.Category});window.TimeEntries=BBPCollection.extend({mode:"client",parent_id:null,parent:"projects",filter_report:null,url:function(){if(_.isFinite(this.parent_id)){return"/api/"+this.parent+"/"+this.parent_id+"/time_entries.xml"}if(this.filter_report){return"/api/time_entries/report.xml?"+this.filter_report}return"/api/time_entries/report.xml"},model:window.TimeEntry});window.TodoTimeEntries=window.TimeEntries.extend({parent:"todo_items"});window.TodoItems=BBCollection.extend({parent_id:null,url:function(){return"/api/todo_lists/"+this.parent_id+"/todo_items.xml"},model:window.TodoItem});window.TodoLists=BBCollection.extend({responsible_party:null,parent_id:null,filter_status:null,url:function(){if(_.isFinite(this.parent_id)&&this.filter_status){return"/api/projects/"+this.parent_id+"/todo_lists.xml?filter="+this.filter_status}if(_.isFinite(this.parent_id)){return"/api/projects/"+this.parent_id+"/todo_lists.xml"}if(this.responsible_party===null){return"/api/todo_lists.xml"}if(this.responsible_party===""){return"/api/todo_lists.xml?responsible_party="}return"/api/todo_lists.xml?responsible_party="+this.responsible_party},model:window.TodoList});window.PostComments=BBCollection.extend({parent_id:null,parent_type:"posts",url:function(){return"/api/"+this.parent_type+"/"+this.parent_id+"/comments.xml"},model:window.Comment});window.TodoComments=window.PostComments.extend({parent_type:"todo_items"});window.CalendarEntryComments=window.PostComments.extend({parent_type:"milestones"})})();(function(){"use strict";var BBView=Backbone.View.extend({render:function(){this.$el.html(_.template($(this.template).html(),this,{variable:"view"}));return this},renderitem:function(item){return _.template($(this.itemtemplate).html(),item,{variable:"item"})},rendercomments:function(comments){return _.template($("#comments-template").html(),comments,{variable:"comments"})},renderpager:function(){return _.template($("#pager-template").html(),this,{variable:"view"})},renderheader:function(){return _.template($("#header-template").html(),this,{variable:"view"})},renderprojectnav:function(){return _.template($("#project-nav-template").html(),this,{variable:"view"})}});window.TimeReportView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},pagerid:"time-report",events:{"click .time-report.previous":"previous","click .time-report.next":"next","click #getreport":"getreport"},previous:function(e){e.preventDefault();return this.collection.hasPrevious()&&this.collection.getPreviousPage()},next:function(e){e.preventDefault();return this.collection.hasNext()&&this.collection.getNextPage()},getreport:function(e){e.preventDefault();this.collection.filter_report=$.param(_.filter(this.$("form#makereport").serializeArray(),function(i){return i.value}));this.collection.fetch({cache:true})},template:"#time-report-template",itemtemplate:"#time-template",name:function(){return"Time report"},render:function(){this.$el.html(_.template($(this.template).html(),this,{variable:"view"}));if(this.collection.filter_report){this.$el.find("form#makereport").deserialize(this.collection.filter_report)}return this}});window.AllPeopleView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.companies.fetchonce()},template:"#people-template",itemtemplate:"#personitem-template",name:function(){return"People"}});window.ProjectsView=BBView.extend({deps:function(){return this.collection.fetchonce()},template:"#projects-template",name:function(){return"Projects"}});window.ProjectView=BBView.extend({deps:function(){return this.options.collections.projects.fetchonce()},template:"#project-template",name:function(){return this.model.get("name")}});window.CompaniesView=BBView.extend({deps:function(){return this.collection.fetchonce()},template:"#companies-template",name:function(){return"Companies"}});window.CompanyView=BBView.extend({deps:function(){return this.options.collections.companies.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},template:"#company-template",name:function(){return this.model.get("name")}});window.PeopleView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.companies.fetchonce()},template:"#project-people-template",itemtemplate:"#personitem-template",name:function(){return this.model.get("name")+" > People"}});window.TimeEntriesView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},pagerid:"project-time",events:{"click .project-time.previous":"previous","click .project-time.next":"next"},previous:function(e){e.preventDefault();return this.collection.hasPrevious()&&this.collection.getPreviousPage()},next:function(e){e.preventDefault();return this.collection.hasNext()&&this.collection.getNextPage()},itemtemplate:"#time-template",template:"#project-time-template",name:function(){return this.model.get("name")+" > Time"}});window.TodoTimeEntriesView=window.TimeEntriesView.extend({pagerid:"todo-time",events:{"click .todo-time.previous":"previous","click .todo-time.next":"next"},template:"#todo-time-template"});window.PostCommentsView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.project_posts.get_or_create(this.model.id).fetchonce()},template:"#project-post-comments-template",itemtemplate:"#post-template",name:function(){var item=this.cur_item&&this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),title=item&&item.get("title");return this.model.get("name")+" > Posts > "+title+" > Comments"}});window.CalendarEntryCommentsView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce()},template:"#project-calendar-entry-comments-template",itemtemplate:"#calendar-template",name:function(){var item=this.cur_item&&this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),title=item&&item.get("title");return this.model.get("name")+" > Calendar > "+title+" > Comments"}});window.PostsView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:"#project-posts-template",itemtemplate:"#post-template",name:function(){return this.model.get("name")+" > Posts"}});window.PostView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:"#project-post-template",itemtemplate:"#post-template",name:function(){var item=this.cur_item&&this.collection.get(this.cur_item),title=item&&item.get("title");return this.model.get("name")+" > Posts > "+title}});window.FilesView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},pagerid:"project-files",events:{"click .project-files.previous":"previous","click .project-files.next":"next"},previous:function(e){e.preventDefault();return this.collection.hasPrevious()&&this.collection.getPreviousPage()},next:function(e){e.preventDefault();return this.collection.hasNext()&&this.collection.getNextPage()},template:"#project-files-template",name:function(){return this.model.get("name")+" > Files"}});window.FileView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},template:"#project-file-template",name:function(){var item=this.cur_item&&this.collection.get(this.cur_item),title=item&&item.get("name");return this.model.get("name")+" > Files > "+title}});window.CalendarView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:"#project-calendar-template",itemtemplate:"#calendar-template",name:function(){return this.model.get("name")+" > Calendar"}});window.CalendarEntryView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:"#project-calendar-entry-template",itemtemplate:"#calendar-template",name:function(){var item=this.cur_item&&this.collection.get(this.cur_item),title=item&&item.get("title");return this.model.get("name")+" > Calendar > "+title}});window.CategoriesView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},pagerid:"project-categories",events:{"click .project-categories.previous":"previous","click .project-categories.next":"next"},previous:function(e){e.preventDefault();return this.collection.hasPrevious()&&this.collection.getPreviousPage()},next:function(e){e.preventDefault();return this.collection.hasNext()&&this.collection.getNextPage()},template:"#project-categories-template",itemtemplate:"#category-template",name:function(){return this.model.get("name")+" > Categories"}});window.CategoryView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:"#project-category-template",itemtemplate:"#category-template",name:function(){var item=this.cur_item&&this.collection.get(this.cur_item),title=item&&item.get("name");return this.model.get("name")+" > Categories > "+title}});window.PersonView=BBView.extend({deps:function(){return this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},template:"#person-template",name:function(){return this.model.name()}});window.TodosView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},events:{"change select[name='target']":"selectTarget"},selectTarget:function(e){this.collection.responsible_party=$(e.target).val();this.collection.fetch({cache:true})},template:"#todo-lists-template",itemtemplate:"#todolist-template",name:function(){if(this.collection.responsible_party){var person=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return person?person.name()+"'s to-dos":this.collection.responsible_party+"'s to-dos"}if(this.collection.responsible_party===null){return"My to-dos"}if(this.collection.responsible_party===""){return"Unassigned to-dos"}return"To-dos"},description:function(){if(this.collection.responsible_party){var person=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return person?person.name()+"'s":this.collection.responsible_party+"'s"}if(this.collection.responsible_party===null){return"My"}if(this.collection.responsible_party===""){return"Unassigned"}return"All"}});window.TodoListsView=BBView.extend({deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:"#project-todo-lists-template",itemtemplate:"#todolist-template",name:function(){if(_.isFinite(this.collection.parent_id)){return this.model.get("name")+" > To-dos"}return"To-dos"}});window.TodoListView=BBView.extend({cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:"#project-todo-list-template",itemtemplate:"#todolist-template",name:function(){var item=this.cur_item&&this.collection.get(this.cur_item),title=item&&item.get("name");return this.model.get("name")+" > To-dos > "+title},render:function(){this.$el.html(_.template($(this.template).html(),this,{variable:"view"}));if(_.isFinite(this.cur_item)){this.options.collections.todo_items.get_or_create(this.cur_item).each(function(item){this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id,item).render().el)},this)}return this}});window.TodoItemView=BBView.extend({todo_item:null,cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:"#project-todo-item-template",itemtemplate:"#todolist-template",name:function(){var list=this.cur_item&&this.collection.get(this.cur_item),title=list&&list.get("name"),item=this.todo_item&&this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item),itemtitle=item&&item.get("content");return this.model.get("name")+" > To-dos > "+title+" > "+itemtitle},render:function(){this.$el.html(_.template($(this.template).html(),this,{variable:"view"}));var item=this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);if(item){this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id,item).render().el)}return this}});window.TodoItemCommentsView=BBView.extend({todo_item:null,cur_item:null,deps:function(){return this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.todo_lists.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:"#project-todo-item-comments-template",name:function(){var list=this.cur_item&&this.todo_lists.get(this.cur_item),title=list&&list.get("name"),item=this.todo_item&&this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item),itemtitle=item&&item.get("content");return this.model.get("name")+" > To-dos > "+title+" > "+itemtitle+" > Comments"},render:function(){this.$el.html(_.template($(this.template).html(),this,{variable:"view"}));var item=this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);if(item){this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id,item).render().el)}return this}});window.TodoView=BBView.extend({events:{"click .todo.icon-completed":"uncomplete","click .todo.icon-uncompleted":"complete"},complete:function(){this.model.complete()},uncomplete:function(){this.model.uncomplete()},tagName:"dd",template:"#todo-template",render:function(){this.$el.html(_.template($(this.template).html(),this,{variable:"view"}));this.delegateEvents();return this}});window.NavView=BBView.extend({template:"#nav-template",initialize:function(){this.model.bind("change",this.render,this)}})})();$(function(){"use strict";var i,models=window.models={},collections=window.collections={},views=window.views={},viewdata={el:".content",collections:collections},oproject,otodo,Workspace=Backbone.Router.extend({routes:{projects:"projects","projects:tab":"projects","projects/:id":"project","projects/:id/todo_lists":"project_todo_lists","projects/:id/todo_lists/:tlid":"project_todo_list","projects/:id/todo_lists/:tlid/:tiid":"project_todo_item","projects/:id/todo_lists/:tlid/:tiid/comments":"project_todo_item_comments","projects/:id/time_entries/todo_items/:tiid":"todo_time_entries","projects/:id/time_entries":"project_time_entries","projects/:id/people":"project_people","projects/:id/posts":"project_posts","projects/:id/posts/:pid":"project_post","projects/:id/posts/:pid/comments":"project_post_comments","projects/:id/files":"project_files","projects/:id/files/:fid":"project_file","projects/:id/calendar":"project_calendar","projects/:id/calendar/:cid":"project_calendar_entry","projects/:id/calendar/:cid/comments":"project_calendar_entry_comments","projects/:id/categories":"project_categories","projects/:id/categories/:cid":"project_category",companies:"companies","companies/:id":"company",people:"people","people:tab":"people","people/:id":"person",me:"me",todos:"todos",time_report:"time_report","*actions":"defaultRoute"}});models.mydata=new window.MyModel;models.project=new window.Project;models.company=new window.Company;models.person=new window.Person;collections.projects=new window.Projects;collections.companies=new window.Companies;collections.people=new window.People;collections.todos=new window.TodoLists;collections.times=new window.TimeEntries;views.current=null;views.projects=new window.ProjectsView(_.extend({collection:collections.projects},viewdata));views.companies=new window.CompaniesView(_.extend({collection:collections.companies},viewdata));views.people=new window.AllPeopleView(_.extend({collection:collections.people},viewdata));views.time_report=new window.TimeReportView(_.extend({collection:collections.times},viewdata));views.todos=new window.TodosView(_.extend({collection:collections.todos,mydata:models.mydata},viewdata));for(i in collections){if(collections.hasOwnProperty(i)){collections[i].on("reset",window.onReset);collections[i].on("sync",window.onReset)}}collections.project_people=new window.People;collections.project_categories=new window.Categories;collections.project_posts=new window.Posts;collections.project_files=new window.Attachments;collections.project_todo_lists=new window.TodoLists;collections.project_calendar=new window.Calendar;collections.project_time_entries=new window.TimeEntries;collections.todo_items=new window.TodoItems;collections.todo_time_entries=new window.TodoTimeEntries;collections.project_todo_item_comments=new window.TodoComments;collections.project_post_comments=new window.PostComments;collections.project_calendar_entry_comments=new window.CalendarEntryComments;views.company_view=new window.CompanyView(_.extend({model:models.company},viewdata));views.person_view=new window.PersonView(_.extend({model:models.person},viewdata));oproject=_.extend({model:models.project},viewdata);views.project_view=new window.ProjectView(oproject);views.project_people=new window.PeopleView(oproject);views.project_categories=new window.CategoriesView(oproject);views.project_category=new window.CategoryView(oproject);views.project_posts=new window.PostsView(oproject);views.project_post=new window.PostView(oproject);views.project_calendar=new window.CalendarView(oproject);views.project_calendar_entry=new window.CalendarEntryView(oproject);views.project_files=new window.FilesView(oproject);views.project_file=new window.FileView(oproject);views.project_time_entries=new window.TimeEntriesView(oproject);views.todo_time_entries=new window.TodoTimeEntriesView(oproject);views.project_post_comments=new window.PostCommentsView(oproject);views.project_calendar_entry_comments=new window.CalendarEntryCommentsView(oproject);views.todo=function(prid,item){if(!views.todo[item.id]){views.todo[item.id]=new window.TodoView({model:item,collections:collections,project_id:prid})}return views.todo[item.id]};otodo=_.extend({todo:views.todo},oproject);views.project_todo_lists=new window.TodoListsView(otodo);views.project_todo_list=new window.TodoListView(otodo);views.project_todo_item=new window.TodoItemView(otodo);views.project_todo_item_comments=new window.TodoItemCommentsView(otodo);window.workspace=new Workspace;window.workspace.on("route",function(route,params){var id,cur_item;if(_.contains(["projects","companies","people","time_report","todos"],route)){views.current=views[route].render()}else if(_.contains(["project_people","project_categories","project_time_entries","project_posts","project_files","project_calendar","project_todo_lists"],route)){id=parseInt(params[0],10);if(collections.projects.get(id)){views[route].model=collections.projects.get(id)}else{views[route].model.id=id}views[route].collection=collections[route].get_or_create(id);views.current=views[route].render()}else if(_.contains(["project_post","project_file","project_calendar_entry","project_category","project_todo_list"],route)){id=parseInt(params[0],10);cur_item=parseInt(params[1],10);if(collections.projects.get(id)){views[route].model=collections.projects.get(id)}else{views[route].model.id=id}views[route].cur_item=cur_item;switch(route){case"project_calendar_entry":views[route].collection=collections.project_calendar.get_or_create(id);break;case"project_category":views[route].collection=collections.project_categories.get_or_create(id);break;default:views[route].collection=collections[route+"s"].get_or_create(id)}views.current=views[route].render()}else if(_.contains(["project_calendar_entry_comments","project_post_comments","todo_time_entries"],route)){id=parseInt(params[0],10);cur_item=parseInt(params[1],10);if(collections.projects.get(id)){views[route].model=collections.projects.get(id)}else{views[route].model.id=id}views[route].cur_item=cur_item;views[route].collection=collections[route].get_or_create(cur_item);views.current=views[route].render()}if(views.current){document.title=views.current.name()+" - BB"}if(views.current&&views.current.deps){views.current.deps()}$(_.filter($(".navbar ul.nav li").removeClass("active"),function(i){return $(i).find("a:visible")[0]&&document.location.hash.indexOf($(i).find("a:visible")[0].hash)!==-1})).addClass("active");$(_.filter($("div.content ul.projectnav li").removeClass("active"),function(i){return $(i).find("a:visible")[0]&&document.location.hash.indexOf($(i).find("a:visible")[0].hash)!==-1})).filter(":last").addClass("active")}).on("route:project_todo_item",function(id,tlid,tiid){if(collections.projects.get(id)){views.project_todo_item.model=collections.projects.get(id)}else{views.project_todo_item.model.id=id}views.project_todo_item.cur_item=tlid;views.project_todo_item.todo_item=tiid;views.project_todo_item.collection=collections.project_todo_lists.get_or_create(id);views.current=views.project_todo_item.render()}).on("route:project_todo_item_comments",function(id,tlid,tiid){if(collections.projects.get(id)){views.project_todo_item_comments.model=collections.projects.get(id)}else{views.project_todo_item_comments.model.id=id}views.project_todo_item_comments.cur_item=tlid;views.project_todo_item_comments.todo_item=tiid;views.project_todo_item_comments.todo_lists=collections.project_todo_lists.get_or_create(id);views.project_todo_item_comments.collection=collections.project_todo_item_comments.get_or_create(tiid);views.current=views.project_todo_item_comments.render()}).on("route:project",function(id){if(collections.projects.get(id)){views.project_view.model=collections.projects.get(id)}else{views.project_view.model.id=id}views.current=views.project_view.render()}).on("route:company",function(id){if(collections.companies.get(id)){views.company_view.model=collections.companies.get(id)}else{views.company_view.model.id=id}views.current=views.company_view.render()}).on("route:person",function(id){if(collections.people.get(id)){views.person_view.model=collections.people.get(id)}else{views.person_view.model.id=id}views.current=views.person_view.render()}).on("route:me",function(){views.person_view.model=models.mydata;views.current=views.person_view.render()}).on("route:defaultRoute",function(action){this.navigate("projects",{trigger:true})});views.navbar=new window.NavView({model:models.mydata,el:".navbar"}).render();models.mydata.once("sync",function(){Backbone.history.start()});models.mydata.fetch()});
