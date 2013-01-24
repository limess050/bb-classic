$(function(){var e=function(){Backbone.history.loadUrl()};Backbone.Collection.prototype.fetchonce=function(){var e=this.fetched;if(!e){this.fetch();this.fetched=true}return e};Backbone.View.prototype.render=function(){this.$el.html(this.template());return this};uniq_hash=[];var t=function(){var e=_.uniq(_.map($("a"),function(e){return e.hash}));e.map(function(e){if(uniq_hash.indexOf(e)==-1){uniq_hash.push(e)}})};var n=Backbone.Model.extend({icon:function(){switch(this.get("status")){case"active":return"icon-play";case"archived":return"icon-stop";case"on_hold":return"icon-pause"}}});var r=Backbone.Collection.extend({url:"/api/projects.xml",model:n});var s=Backbone.Model.extend();var o=Backbone.Collection.extend({url:"/api/companies.xml",model:s});var u=Backbone.Model.extend({name:function(){return this.get("first-name")+" "+this.get("last-name")}});var a=Backbone.Collection.extend({parent_id:null,url:function(){if(this.parent_id)return"/api/projects/"+this.parent_id+"/people.xml";return"/api/people.xml"},model:u});var f=Backbone.Model.extend();var l=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/posts.xml"},model:f});var c=Backbone.Model.extend();var h=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/attachments.xml"},model:c});var p=Backbone.Model.extend();var d=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/calendar_entries.xml"},model:p});var v=Backbone.Model.extend();var m=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/categories.xml"},model:v});var g=Backbone.Model.extend();var y=Backbone.Collection.extend({parent_id:null,parent:null,filter_report:null,url:function(){if(this.parent_id&&this.parent=="todo")return"/api/todo_items/"+this.parent_id+"/time_entries.xml";if(this.parent_id)return"/api/projects/"+this.parent_id+"/time_entries.xml";if(this.filter_report)return"/api/time_entries/report.xml?"+this.filter_report;return"/api/time_entries/report.xml"},model:g});var b=Backbone.Model.extend();var w=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/todo_lists/"+this.parent_id+"/todo_items.xml"},model:b});var E=Backbone.Model.extend();var S=Backbone.Collection.extend({responsible_party:null,parent_id:null,filter_status:null,url:function(){if(this.parent_id&&this.filter_status)return"/api/projects/"+this.parent_id+"/todo_lists.xml?filter="+this.filter_status;if(this.parent_id)return"/api/projects/"+this.parent_id+"/todo_lists.xml";if(this.responsible_party==null)return"/api/todo_lists.xml";if(this.responsible_party=="")return"/api/todo_lists.xml?responsible_party=";return"/api/todo_lists.xml?responsible_party="+this.responsible_party},model:E});var x=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},events:{"click #getreport":"getreport"},getreport:function(e){e.preventDefault();this.collection.filter_report=this.$("form#makereport").serialize();this.collection.fetch()},template:_.template($("#time-report-template").html()),name:function(){return"Time report"},render:function(){this.$el.html(this.template());if(this.collection.filter_report){this.$el.find("form#makereport").deserialize(this.collection.filter_report)}return this}});var T=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#people-template").html()),name:function(){return"People"}});var N=Backbone.View.extend({deps:function(){this.collection.fetchonce()},template:_.template($("#projects-template").html()),name:function(){return"Projects"}});var C=Backbone.View.extend({deps:function(){this.options.collections.projects.fetchonce()},template:_.template($("#project-template").html()),name:function(){return this.model.get("name")}});var k=Backbone.View.extend({deps:function(){this.collection.fetchonce()},template:_.template($("#companies-template").html()),name:function(){return"Companies"}});var L=Backbone.View.extend({deps:function(){this.options.collections.companies.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},template:_.template($("#company-template").html()),name:function(){return this.model.get("name")}});var A=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#project-people-template").html()),name:function(){return this.model.get("name")+" > People"}});var O=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-time-template").html()),name:function(){return this.model.get("name")+" > Time"}});var M=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-posts-template").html()),name:function(){return this.model.get("name")+" > Posts"}});var D=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-files-template").html()),name:function(){return this.model.get("name")+" > Files"}});var P=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-calendar-template").html()),name:function(){return this.model.get("name")+" > Calendar"}});var H=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-categories-template").html()),name:function(){return this.model.get("name")+" > Categories"}});var B=Backbone.View.extend({deps:function(){this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#person-template").html()),name:function(){return this.model.name()}});var j=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},events:{"change select[name='target']":"selectTarget"},selectTarget:function(e){this.collection.responsible_party=$(e.target).val();this.collection.fetch()},template:_.template($("#todo-lists-template").html()),name:function(){if(this.collection.responsible_party){var e=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return e?e.name()+"'s to-dos":this.collection.responsible_party+"'s to-dos"}if(this.collection.responsible_party==null)return"My to-dos";if(this.collection.responsible_party=="")return"Unassigned to-dos";return"To-dos"},description:function(){if(this.collection.responsible_party){var e=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return e&&e.name()+"'s"||this.collection.responsible_party+"'s"}if(this.collection.responsible_party==null)return"My";if(this.collection.responsible_party=="")return"Unassigned";return"All"}});var F=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.sub()},template:_.template($("#project-todo-lists-template").html()),sub:function(){var e=this.options.collections.todo_items;var t=_.map(this.collection.pluck("id"),function(t){return e.get_or_create(t)});var n=_.first(t.filter(function(e){return!e.fetched}));if(n){n.fetched=true;n.fetch()}},name:function(){if(this.collection.parent_id){return this.model.get("name")+" > To-dos"}return"To-dos"}});var I=Backbone.Model.extend({defaults:{id:null},name:function(){return this.get("first-name")+" "+this.get("last-name")},url:"/api/me.xml"});var q=Backbone.View.extend({template:_.template($("#nav-template").html()),initialize:function(){this.model.bind("change",this.render,this)}});models={};collections={};var R={el:".content",collections:collections};models.mydata=new I;models.project=new n;models.company=new s;models.person=new u;collections.projects=new r;collections.companies=new o;collections.people=new a;collections.todos=new S;collections.times=new y;views={};views.current=null;views.projects=new N(_.extend({collection:collections.projects},R));views.companies=new k(_.extend({collection:collections.companies},R));views.people=new T(_.extend({collection:collections.people},R));views.times=new x(_.extend({collection:collections.times},R));views.todos=new j(_.extend({collection:collections.todos,mydata:models.mydata},R));for(i in collections){collections[i].on("reset",e)}Object.prototype.get_or_create=function(t){if(!this[t]&&this[0]){this[t]=this[0].clone();this[t].parent_id=t;this[t].on("reset",e)}return this[t]};collections.project_people={0:new a};collections.project_categories={0:new m};collections.project_posts={0:new l};collections.project_files={0:new h};collections.project_todo_lists={0:new S};collections.project_calendar={0:new d};collections.project_time_entries={0:new y};collections.todo_items={0:new w};views.company_view=new L(_.extend({model:models.company},R));views.person_view=new B(_.extend({model:models.person},R));var U=_.extend({model:models.project},R);views.project_view=new C(U);views.project_people=new A(U);views.project_categories=new H(U);views.project_posts=new M(U);views.project_todo_lists=new F(U);views.project_calendar=new P(U);views.project_files=new D(U);views.project_time_entries=new O(U);collections.projects.on("reset",function(){this.each(function(e){collections.project_people.get_or_create(e.id);collections.project_categories.get_or_create(e.id);collections.project_posts.get_or_create(e.id);collections.project_todo_lists.get_or_create(e.id);collections.project_calendar.get_or_create(e.id);collections.project_categories.get_or_create(e.id);collections.project_files.get_or_create(e.id);collections.project_time_entries.get_or_create(e.id)})});var z=Backbone.Router.extend({routes:{projects:"projects","projects/:id":"project","projects/:id/todo_lists":"project_todo_lists","projects/:id/time_entries":"project_time_entries","projects/:id/people":"project_people","projects/:id/posts":"project_posts","projects/:id/files":"project_files","projects/:id/milestones":"project_calendar","projects/:id/categories":"project_categories",companies:"companies","companies/:id":"company",people:"people","people/:id":"person",me:"me",todo_lists:"todo_lists","time_entries/report":"timereport","*actions":"defaultRoute"}});workspace=new z;workspace.on("all",function(e){views.current&&$("title").html(views.current.name()+" - BB");t();e!=="route"&&views.current&&views.current.deps&&views.current.deps();$(_.filter($(".navbar ul.nav li").removeClass("active"),function(e){return $(e).find("a:visible")[0]&&document.location.hash.indexOf($(e).find("a:visible")[0].hash)!==-1})).addClass("active")}).on("route:projects",function(){views.current=views.projects.render()}).on("route:project",function(e){if(collections.projects.get(e)){views.project_view.model=collections.projects.get(e)}else{views.project_view.model.id=e}views.current=views.project_view.render()}).on("route:companies",function(){views.current=views.companies.render()}).on("route:company",function(e){if(collections.companies.get(e)){views.company_view.model=collections.companies.get(e)}else{views.company_view.model.id=e}views.current=views.company_view.render()}).on("route:people",function(){views.current=views.people.render()}).on("route:person",function(e){if(collections.people.get(e)){views.person_view.model=collections.people.get(e)}else{views.person_view.model.id=e}views.current=views.person_view.render()}).on("route:me",function(){views.person_view.model=models.mydata;views.current=views.person_view.render()}).on("route:timereport",function(){views.current=views.times.render()}).on("route:todo_lists",function(){views.current=views.todos.render()}).on("route:project_people",function(e){if(collections.projects.get(e)){views.project_people.model=collections.projects.get(e)}else{views.project_people.model.id=e}views.project_people.collection=collections.project_people.get_or_create(e);views.current=views.project_people.render()}).on("route:project_categories",function(e){if(collections.projects.get(e)){views.project_categories.model=collections.projects.get(e)}else{views.project_categories.model.id=e}views.project_categories.collection=collections.project_categories.get_or_create(e);views.current=views.project_categories.render()}).on("route:project_time_entries",function(e){if(collections.projects.get(e)){views.project_time_entries.model=collections.projects.get(e)}else{views.project_time_entries.model.id=e}views.project_time_entries.collection=collections.project_time_entries.get_or_create(e);views.current=views.project_time_entries.render()}).on("route:project_posts",function(e){if(collections.projects.get(e)){views.project_posts.model=collections.projects.get(e)}else{views.project_posts.model.id=e}views.project_posts.collection=collections.project_posts.get_or_create(e);views.current=views.project_posts.render()}).on("route:project_files",function(e){if(collections.projects.get(e)){views.project_files.model=collections.projects.get(e)}else{views.project_files.model.id=e}views.project_files.collection=collections.project_files.get_or_create(e);views.current=views.project_files.render()}).on("route:project_calendar",function(e){if(collections.projects.get(e)){views.project_calendar.model=collections.projects.get(e)}else{views.project_calendar.model.id=e}views.project_calendar.collection=collections.project_calendar.get_or_create(e);views.current=views.project_calendar.render()}).on("route:project_todo_lists",function(e){if(collections.projects.get(e)){views.project_todo_lists.model=collections.projects.get(e)}else{views.project_todo_lists.model.id=e}views.project_todo_lists.collection=collections.project_todo_lists.get_or_create(e);views.current=views.project_todo_lists.render()}).on("route:defaultRoute",function(e){this.navigate("projects",{trigger:true})});views.navbar=(new q({model:models.mydata,el:".navbar"})).render();models.mydata.fetch();models.mydata.once("sync",function(){Backbone.history.start()})})