/*jslint white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbtemplates module.
        root.define('bbtemplates', [], factory);
    } else {
        // Browser globals
        root.bbtemplates = factory();
    }
}(this, function() {
'use strict';
var templates = {};
templates['#time'] = '<tr data-id="<%- item.id %>">' +
'    <td><%- item.get("date") %></td>' +
'    <td <% if(item.get("hours")>2){ %>class="warning"<% } %>><%- item.get("hours") %></td>' +
'    <td><a title="<%- item.get("person-name") %>" href="#people/<%- item.get("person-id") %>"><i class="glyphicon glyphicon-user"></i><%- item.get("person-name") %></a></td>' +
'    <td><nobr>' +
'        <% if (item.get("todo-item-id")) { %>' +
'            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="glyphicon glyphicon-file"></i></a>' +
'        <% } else { %>' +
'            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="glyphicon glyphicon-folder-close"></i></a>' +
'        <% } %>' +
'        <%- item.get("description") %>' +
'    </nobr></td>' +
'    <td><nobr>' +
'        <button class="edit" title="Edit"><i class="edititem glyphicon glyphicon-edit"></i></button>' +
'        <button class="remove" title="Remove"><i class="removeitem glyphicon glyphicon-trash"></i></button>' +
'    </nobr></td>' +
'</tr>';
templates['#timeedit'] = '<tr class="edittime form" role="form" data-id="<%- item.id %>">' +
'    <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="form-control input-small" name="date" placeholder="YYYY-MM-DD" value="<%- item.get("date") %>"></td>' +
'    <td><input type="text" class="form-control input-small" name="hours" placeholder="hours" value="<%- item.get("hours") %>"></td>' +
'    <td>' +
'        <select name="person-id" class="form-control">' +
'            <% view.options.collections.people.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==item.get("person-id")) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </td>' +
'    <td>' +
'        <input type="text" class="form-control input-small" name="description" value="<%- item.get("description") %>">' +
'    </td>' +
'    <td><nobr>' +
'        <button class="save" title="Save"><i class="glyphicon glyphicon-ok"></i></button>' +
'        <button class="reset" title="Cancel"><i class="glyphicon glyphicon-off"></i></button>' +
'    </nobr></td>' +
'</tr>';
templates['#pager'] = '<% if(view.collection.hasPrevious() || view.collection.hasNext()){ %>' +
'<ul class="pager">' +
'    <li class="<%- view.pagerid %> previous<% if(!view.collection.hasPrevious()){ %> disabled<% } %>">' +
'        <a href="#">&larr; Previous Page</a>' +
'    </li>' +
'    <li class="<%- view.pagerid %> next<% if(!view.collection.hasNext()){ %> disabled<% } %>">' +
'        <a href="#">Next Page &rarr;</a>' +
'    </li>' +
'</ul>' +
'<% } %>';
templates['#header'] = '<div class="page-header">' +
'    <h1><%- view.PageHeader() %></h1>' +
'</div>' +
'<% var path = view.Path();' +
'if (path) { %>' +
'<ul class="breadcrumb">' +
'<% _.each(path, function(i) { %>' +
'    <li<% var url = i[0], title = i[1]; if (url) { %>>' +
'    <a href="<%- url %>"><%- title %></a>' +
'    <% } else { %> class="active">' +
'    <%- title %>' +
'    <% } %></li>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-nav'] = '<ul class="nav nav-tabs projectnav">' +
'    <li><a title="<%- view.model.name() %> project overview" href="#projects/<%- view.model.id %>">Overview</a></li>' +
'    <li><a title="<%- view.model.name() %> project messages" href="#projects/<%- view.model.id %>/posts">Messages</a></li>' +
'    <li><a title="<%- view.model.name() %> project todos" href="#projects/<%- view.model.id %>/todo_lists">To-Dos</a></li>' +
'    <li><a title="<%- view.model.name() %> project calendar" href="#projects/<%- view.model.id %>/calendar">Calendar</a></li>' +
'    <li><a title="<%- view.model.name() %> project time" href="#projects/<%- view.model.id %>/time_entries">Time</a></li>' +
'    <li><a title="<%- view.model.name() %> project files" href="#projects/<%- view.model.id %>/files">Files</a></li>' +
'    <li class="pull-right"><a title="<%- view.model.name() %> project people" href="#projects/<%- view.model.id %>/people">People</a></li>' +
'    <li class="pull-right"><a title="<%- view.model.name() %> project categories" href="#projects/<%- view.model.id %>/categories">Categories</a></li>' +
'</ul>';
templates['#attachment'] = '<li>' +
'    <a href="<%- item["download-url"] %>"><%- item.name %></a>' +
'    <small>' +
'        <%- item["byte-size"] %>B' +
'        <a href="#people/<%- item["person-id"] %>"><i class="glyphicon glyphicon-user"></i><%- item["author-name"] %></a>' +
'    </small>' +
'</li>';
templates['#attachments'] = '<% var attachments=item.get("attachments"); if (attachments && attachments.length) { %>' +
'    <ul>' +
'        <% _.each((attachments),function (a) { %>' +
'<%= view.itemblock(a, "#attachment") %>' +
'        <% }) %>' +
'    </ul>' +
'<% } %>';
templates['#comment'] = '<li class="list-group-item">' +
'    <small>' +
'        <a href="#people/<%- item.get("author-id") %>"><i class="glyphicon glyphicon-user"></i><%- item.get("author-name") %></a>' +
'        <abbr title="<%- item.get("created-at") %>"><%- moment(item.get("created-at")).format("LLL") %></abbr>' +
'    </small>' +
'    <p><%= item.get("body") %></p>' +
'<%= view.itemblock(item, "#attachments") %>' +
'</li>';
templates['#comments'] = '<% if (view.collection.isEmpty()) { %>' +
'<div class="alert alert-info">No comments...</div>' +
'<% } else { %>' +
'<ul class="list-group">' +
'    <% view.collection.each(function (item) { %>' +
'        <%= view.itemblock(item, "#comment") %>' +
'    <% }) %>' +
'</ul>' +
'<% } %>';
templates['#time-thead'] = '<thead>' +
'    <tr>' +
'        <th>date</th><th>hours</th><th data-sort="person-id">person</th><th>description</th><th data-sort="id">&nbsp;</th>' +
'    </tr>' +
'</thead>';
templates['#time-report'] = '<%= view.block("#header") %>' +
'<div id="time_report" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="makereportlabel" aria-hidden="true">' +
'<div class="modal-dialog">' +
'<div class="modal-content">' +
'<div class="modal-header">' +
'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
'<h3 id="makereportlabel">Make report</h3>' +
'</div>' +
'<form role="form" id="makereport">' +
'<% var refilter=view.getreport_filter() %>' +
'    <div class="modal-body">' +
'    <div class="input-group">' +
'        <span class="input-group-addon">From</span>' +
'        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="form-control" name="from" placeholder="YYYYMMDD" value="<%= refilter.from || "" %>">' +
'    </div>' +
'    <br />' +
'    <div class="input-group">' +
'        <span class="input-group-addon">To</span>' +
'        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="form-control" name="to" placeholder="YYYYMMDD" value="<%= refilter.to || "" %>">' +
'    </div>' +
'    <br />' +
'    <div class="input-group">' +
'        <span class="input-group-addon">For</span>' +
'        <select name="subject_id" class="form-control">' +
'            <option value="" <% if (_.isUndefined(refilter.subject_id)) { %>selected="selected"<% } %>>All</option>' +
'            <% view.options.collections.people.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==refilter.subject_id) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <br />' +
'    <div class="input-group">' +
'        <span class="input-group-addon">Project</span>' +
'        <select name="filter_project_id" class="form-control">' +
'            <option value="" <% if (_.isUndefined(refilter.filter_project_id)) { %>selected="selected"<% } %>>All</option>' +
'            <% view.options.collections.projects.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==refilter.filter_project_id) { %>selected="selected"<% } %>><%- i.get("name") %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <br />' +
'    <div class="input-group">' +
'        <span class="input-group-addon">Company</span>' +
'        <select name="filter_company_id" class="form-control">' +
'            <option value="" <% if (_.isUndefined(refilter.filter_company_id)) { %>selected="selected"<% } %>>All</option>' +
'            <% view.options.collections.companies.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==refilter.filter_company_id) { %>selected="selected"<% } %>><%- i.get("name") %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    </div>' +
'    <div class="modal-footer">' +
'        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
'        <button id="getreport" type="submit" data-dismiss="modal" class="btn btn-primary">Report</button>' +
'    </div>' +
'</form>' +
'</div>' +
'</div>' +
'</div>' +
'<a href="#time_report" role="button" class="btn btn-primary" data-toggle="modal">Report</a>' +
'<% var tt=view.collection;' +
'if (tt.isEmpty()) { %>' +
'<div class="alert alert-info">No time entries...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<div class="table-responsive">' +
'<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">' +
'    <%= view.block("#time-thead") %>' +
'    <tbody>' +
'        <% var prs=view.options.collections.projects;' +
'        _.each(_.uniq(tt.pluck("project-id")), function (prid) { %>' +
'        <tr class="info">' +
'            <td>' +
'                <a href="#projects/<%- prid %>/time_entries"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a>' +
'            </td>' +
'            <td>' +
'                <%- _.reduce(_.map(tt.where({"project-id":prid}),function(i){return i.get("hours");}),function(memo, num) { return memo + num; }, 0) %>' +
'            </td>' +
'            <td colspan="3">&nbsp;</td>' +
'        </tr>' +
'        <% _.each(tt.where({"project-id":prid}), function (item) { %>' +
'            <%= view.itemblock(item, "#time") %>' +
'        <% }) %>' +
'        <% }) %>' +
'    </tbody>' +
'</table>' +
'</div>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#projects'] = '<%= view.block("#header") %>' +
'<% var pp=view.collection; if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No projects...</div>' +
'<% } else { %>' +
'<div class="tabbable">' +
'<ul class="nav nav-tabs projectsnav">' +
'<% var fprst=_.first(pp.pluck("status"));' +
'   _.each(_.uniq(pp.pluck("status")), function (status) { %>' +
'    <li class="prstatus pull-right <%- fprst==status?"active":"" %>">' +
'        <a href="#projects_<%- status %>" data-toggle="tab"><%- status %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content">' +
'<% _.each(pp.groupBy(function(i){ return i.get("status")}), function (plist, status) { %>' +
'    <div class="tab-pane fade<% if (fprst==status) { %> in active<% } %>" id="projects_<%- status %>">' +
'        <div class="tabbable row">' +
'        <ul class="nav nav-pills nav-stacked col-lg-3 col-lg-push-9 col-md-4 col-md-push-8 col-sm-5 col-sm-push-7">' +
'        <% var fprcoid=_.first(plist).get("company").id;' +
'        _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>' +
'            <li<% if (fprcoid==coid) { %> class="active"<% } %>>' +
'                <a href="#projects_<%- status %>_<%- coid %>" data-toggle="tab"><%- _.first(list).get("company").name %></a>' +
'            </li>' +
'        <% }) %>' +
'        </ul>' +
'        <div class="tab-content col-lg-9 col-lg-pull-3 col-md-8 col-md-pull-4 col-sm-7 col-sm-pull-5">' +
'        <% _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>' +
'            <div class="tab-pane fade<% if (fprcoid==coid) { %> in active<% } %>" id="projects_<%- status %>_<%- coid %>">' +
'                <ul class="list-unstyled">' +
'                <% _.each(list, function (item) { %>' +
'                    <li>' +
'                        <h3><a href="#projects/<%- item.id %>"><%- item.get("name") %></a></h3>' +
'                    </li>' +
'                <% }) %>' +
'                </ul>' +
'            </div>' +
'        <% }) %>' +
'        </div>' +
'        </div>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#project'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% if (view.model.get("announcement")) { %><p><%= view.model.get("announcement") %></p><% } %>';
templates['#companies'] = '<%= view.block("#header") %>' +
'<% cc=view.collection; if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No companies...</div>' +
'<% } else { %>' +
'<div>' +
'<% cc.each(function (item) { %>' +
'    <div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a href="#companies/<%- item.id %>"><%- item.get("name") %></a></h3></div>' +
'    <div class="panel-body row">' +
'        <div class="col-lg-4 col-sm-4 col-md-4">' +
'            <% if (item.get("web-address")) { %><a href="<%- item.get("web-address") %>"><b><%- item.get("web-address") %></b></a><br /><% } %>' +
'            <% if (item.get("time-zone-id")) { %>Time zone: <%- item.get("time-zone-id") %><br /><% } %>' +
'            <% if (item.get("locale")) { %>Locale: <%- item.get("locale") %><% } %>' +
'        </div>' +
'        <div class="col-lg-4 col-sm-4 col-md-4 col-xs-6">' +
'            <% if (item.get("country")) { %><%- item.get("country") %><br /><% } %>' +
'            <% if (item.get("city")) { %><%- item.get("city") %> <%- item.get("zip") %><br /><% } %>' +
'            <% if (item.get("address-one")) { %><%- item.get("address-one") %><br /><% } %>' +
'            <% if (item.get("address-two")) { %><%- item.get("address-two") %><% } %>' +
'        </div>' +
'        <div class="col-lg-4 col-sm-4 col-md-4 col-xs-6">' +
'            <% if (item.get("state")) { %>State: <%- item.get("state") %><br /><% } %>' +
'            <% if (item.get("phone-number-office")) { %>Office: <%- item.get("phone-number-office") %><br /><% } %>' +
'            <% if (item.get("phone-number-fax")) { %>Fax: <%- item.get("phone-number-fax") %><% } %>' +
'        </div>' +
'    </div></div>' +
'<% }) %>' +
'</div>' +
'<% } %>';
templates['#company'] = '<%= view.block("#header") %>' +
'<div class="row">' +
'    <div class="col-lg-4 col-sm-4 col-md-4">' +
'        <h2>Projects</h2>' +
'        <% var cid = view.model.id; var pp=view.options.collections.projects; if (pp.isEmpty()) { %>' +
'        <div class="alert alert-info">No projects...</div>' +
'        <% } else { %>' +
'        <ul class="list-unstyled">' +
'        <% _.each(pp.filter(function(i){return i.get("company").id==cid}), function (item) { %>' +
'            <li><i class="glyphicon glyphicon-project-<%- item.get("status") %>"></i>&nbsp;<a href="#projects/<%- item.id %>"><%- item.get("name") %></a></li>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'    <div class="col-lg-4 col-sm-4 col-md-4 col-xs-6">' +
'        <h2>People</h2>' +
'        <% var pp=view.options.collections.people; if (pp.isEmpty()) { %>' +
'        <div class="alert alert-info">No people...</div>' +
'        <% } else { %>' +
'        <ul class="list-unstyled">' +
'        <% _.each(pp.filter(function(i){return i.get("company-id")==cid}), function (item) { %>' +
'            <li><a href="#people/<%- item.id %>"><i class="glyphicon glyphicon-user"></i><%- item.name() %></a></li>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'    <div class="col-lg-4 col-sm-4 col-md-4 col-xs-6">' +
'        <h2>Contact</h2>' +
'        <% if (view.model.get("web-address")) { %>' +
'        <a href="<%- view.model.get("web-address") %>"><b><%- view.model.get("web-address") %></b></a><br />' +
'        <% } %>' +
'        <% if (view.model.get("time-zone-id")) { %>Time zone: <%- view.model.get("time-zone-id") %><br /><% } %>' +
'        <% if (view.model.get("locale")) { %>Locale: <%- view.model.get("locale") %><br /><% } %>' +
'        <% if (view.model.get("country")) { %><%- view.model.get("country") %><br /><% } %>' +
'        <% if (view.model.get("city")) { %><%- view.model.get("city") %> <%- view.model.get("zip") %><br /><% } %>' +
'        <% if (view.model.get("address-one")) { %><%- view.model.get("address-one") %><br /><% } %>' +
'        <% if (view.model.get("address-two")) { %><%- view.model.get("address-two") %><br /><% } %>' +
'        <% if (view.model.get("state")) { %>State: <%- view.model.get("state") %><br /><% } %>' +
'        <% if (view.model.get("phone-number-office")) { %>Office: <%- view.model.get("phone-number-office") %><br /><% } %>' +
'        <% if (view.model.get("phone-number-fax")) { %>Fax: <%- view.model.get("phone-number-fax") %><% } %>' +
'    </div>' +
'</div>';
templates['#person'] = '<%= view.block("#header") %>' +
'<img class="pull-right img-polaroid" width="55" height="55"' +
'     src="<%- view.model.get("avatar-url") %>"' +
'     alt="<%- view.model.name() %>">' +
'<a href="mailto:<%- view.model.get("email-address") %>"><b><%- view.model.get("email-address") %></b></a><br />' +
'<% if (view.model.get("im-service")&&view.model.get("im-handle")) { %>' +
'    <%- view.model.get("im-service") %>: <% if (view.model.get("im-service")=="Skype") { %>' +
'        <a href="skype:<%- view.model.get("im-handle") %>?call" title="Skype call to <%- view.model.name() %>"><%- view.model.get("im-handle") %></a>' +
'    <% } else { %>' +
'        <%- view.model.get("im-handle") %>' +
'    <% } %>' +
'    <br />' +
'<% } %>' +
'<% if (view.model.get("phone-number-office")) { %>Office: <%- view.model.get("phone-number-office") %><br /><% } %>' +
'<% if (view.model.get("phone-number-mobile")) { %>Mobile: <%- view.model.get("phone-number-mobile") %><br /><% } %>' +
'<% if (view.model.get("phone-number-home")) { %>Home: <%- view.model.get("phone-number-home") %><br /><% } %>' +
'<% if (view.model.get("phone-number-fax")) { %>Fax: <%- view.model.get("phone-number-fax") %><br /><% } %>' +
'<% if (view.model.get("time-zone-name")) { %>Time zone: <%- view.model.get("time-zone-name") %><% } %>';
templates['#personitem'] = '<% var in_project=item.collection.url().indexOf("projects")!==-1 %>' +
'<li class="media well well-sm">' +
'    <a class="pull-right" href="#<%- in_project ? "projects/" + item.get("project-id") + "/" : "" %>people/<%- item.id %>" title="<%- item.name() %>"><img class="media-object img-polaroid" src="<%- item.get("avatar-url") %>" alt="<%- item.name() %>"></a>' +
'    <div class="media-body">' +
'        <h4 class="media-heading">' +
'            <a href="#<%- in_project ? "projects/" + item.get("project-id") + "/" : "" %>people/<%- item.id %>" title="<%- item.name() %>"><%- item.name() %></a>' +
'            <% if (item.get("title")) { %>' +
'            <small><%- item.get("title") %></small>' +
'            <% } %>' +
'        </h4>' +
'        <a href="mailto:<%- item.get("email-address") %>"><b><%- item.get("email-address") %></b></a><br />' +
'        <% if (item.get("im-service")&&item.get("im-handle")) { %>' +
'            <%- item.get("im-service") %>: <% if (item.get("im-service")=="Skype") { %>' +
'                <a href="skype:<%- item.get("im-handle") %>?call" title="Skype call to <%- item.name() %>"><%- item.get("im-handle") %></a>' +
'            <% } else { %>' +
'                <%- item.get("im-handle") %>' +
'            <% } %>' +
'            <br />' +
'        <% } %>' +
'        <% if (item.get("phone-number-office")) { %>Office: <%- item.get("phone-number-office") %><br /><% } %>' +
'        <% if (item.get("phone-number-mobile")) { %>Mobile: <%- item.get("phone-number-mobile") %><br /><% } %>' +
'        <% if (item.get("phone-number-home")) { %>Home: <%- item.get("phone-number-home") %><br /><% } %>' +
'        <% if (item.get("phone-number-fax")) { %>Fax: <%- item.get("phone-number-fax") %><br /><% } %>' +
'        <% if (item.get("time-zone-name")) { %>Time zone: <%- item.get("time-zone-name") %><% } %>' +
'    </div>' +
'</li>';
templates['#people'] = '<%= view.block("#header") %>' +
'<% var pp=view.collection; var cc=view.options.collections.companies;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No people...</div>' +
'<% } else {' +
'if (cc.isEmpty()) { %>' +
'<ul class="media-list">' +
'<% pp.each(function (item) { %>' +
'    <%= view.itemblock(item, "#personitem") %>' +
'<% }) %>' +
'</ul>' +
'<% } else { %>' +
'<div class="tabbable tabs-left row">' +
'<ul class="nav nav-pills nav-stacked col-lg-3 col-md-4 col-sm-5 col-xs-6">' +
'<% var fcoid=_.first(pp.pluck("company-id"));' +
'   cc.each(function (item) { %>' +
'    <li<% if (fcoid==item.id) { %> class="active"<% } %>><a href="#people_c<%- item.id %>" data-toggle="tab"><%- item.name() %></a></li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content col-lg-9 col-md-8 col-sm-7 col-xs-6">' +
'<% cc.each(function (cc) { %>' +
'    <div class="tab-pane fade<% if (fcoid==cc.id) { %> in active<% } %>" id="people_c<%- cc.id %>">' +
'        <% var cp=pp.where({"company-id":cc.id}); if (_.isEmpty(cp)) { %>' +
'        <div class="alert alert-info">No people in company...</div>' +
'        <% } else { %>' +
'        <ul class="media-list">' +
'        <% _.each(cp, function (item) { %>' +
'            <%= view.itemblock(item, "#personitem") %>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% }} %>';
templates['#project-people'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var cc=view.options.collections.companies;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No people...</div>' +
'<% } else {' +
'if (cc.isEmpty()) { %>' +
'<ul class="media-list">' +
'<% pp.each(function (item) { %>' +
'    <%= view.itemblock(item, "#personitem") %>' +
'<% }) %>' +
'</ul>' +
'<% } else { %>' +
'<div class="tabbable tabs-left row">' +
'<ul class="nav nav-pills nav-stacked col-lg-3 col-md-4 col-sm-5 col-xs-6">' +
'<% var pc=_.uniq(pp.pluck("company-id")); var fcoid=_.first(pc);' +
'_.each(pc, function (id) { %>' +
'    <li<% if (fcoid==id) { %> class="active"<% } %>><a href="#people_c<%- id %>" data-toggle="tab"><%- cc.get(id)?cc.get(id).name():id %></a></li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content col-lg-9 col-md-8 col-sm-7 col-xs-6">' +
'<% _.each(pc, function (id) { %>' +
'    <div class="tab-pane fade<% if (fcoid==id) { %> in active<% } %>" id="people_c<%- id %>">' +
'        <ul class="media-list">' +
'        <% _.each(pp.where({"company-id":id}), function (item) { %>' +
'            <%= view.itemblock(item, "#personitem") %>' +
'        <% }) %>' +
'        </ul>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% }} %>';
templates['#project-person'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var item=pp.get(view.cur_item);' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No people...</div>' +
'<% } else { %>' +
'<ul class="media-list">' +
'    <%= view.itemblock(item, "#personitem") %>' +
'</ul>' +
'<% } %>';
templates['#timeadd'] = '<% var pp=view.options.collections.people; var mid=view.options.mydata?view.options.mydata.id:0; %>' +
'<tr class="addtime form" role="form">' +
'    <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="form-control input-small" name="date" placeholder="YYYY-MM-DD" value="<%- moment().format("YYYY-MM-DD") %>"></td>' +
'    <td><input type="text" class="form-control input-small" name="hours" placeholder="hours" value="0"></td>' +
'    <td class="col-xs-2 col-sm-2 col-md-2 col-lg-2">' +
'        <select class="form-control" name="person-id">' +
'            <% pp.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </td>' +
'    <td class="col-xs-6 col-sm-6 col-md-6 col-lg-6">' +
'        <input type="text" class="form-control input-small" name="description">' +
'    </td>' +
'    <td>' +
'        <button class="add" title="Add"><i class="glyphicon glyphicon-plus"></i></button>' +
'    </td>' +
'</tr>';
templates['#project-time'] = templates['#todo-time'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% if (view.collection.isEmpty()) { %>' +
'<div class="alert alert-info">No time entries...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<div class="table-responsive">' +
'<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">' +
'    <%= view.block("#time-thead") %>' +
'    <tbody>' +
'        <%= view.block("#timeadd") %>' +
'        <% view.collection.each(function (item) { %>' +
'            <%= view.itemblock(item, "#time") %>' +
'        <% }) %>' +
'    </tbody>' +
'</table>' +
'</div>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#post'] = '<li class="panel panel-default">' +
'    <div class="panel-heading"><h3 class="panel-title">' +
'        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>"><%- item.get("title") %></a>' +
'        <% if (item.get("private")) { %><small class="glyphicon glyphicon-lock"></small><% } %>' +
'        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><i class="itemcomments glyphicon glyphicon-comment"></i><%- item.get("comments-count") %></a>' +
'    </h3></div>' +
'    <div class="panel-body"><small>' +
'        by' +
'        <a href="#people/<%- item.get("author-id") %>"><i class="glyphicon glyphicon-user"></i><%- item.get("author-name") %></a>' +
'        <% if (item.get("category-id")) { %>' +
'        in' +
'        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.get("category-id") %>"><%- item.get("category-name") %></a>' +
'        <% } %>' +
'        on: <abbr title="<%- item.get("posted-on") %>"><%- moment(item.get("posted-on")).format("LLL") %></abbr>' +
'    </small>' +
'    <p><%= item.get("display-body") %></p>' +
'    <%= view.itemblock(item, "#attachments") %>' +
'    </div>' +
'</li>';
templates['#project-posts'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var prid=view.model.id;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No posts...</div>' +
'<% } else { %>' +
'<ul class="list-unstyled">' +
'<% pp.each(function (item) { %>' +
'    <%= view.itemblock(item, "#post") %>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-post'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var prid=view.model.id; var item=pp.get(view.cur_item);' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">No posts...</div>' +
'<% } else { %>' +
'<ul class="list-unstyled">' +
'    <%= view.itemblock(item, "#post") %>' +
'</ul>' +
'<% } %>';
templates['#project-post-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var item=view.options.collections.project_posts.get_or_create(view.model.id).get(view.cur_item);' +
'if (item) { %>' +
'<ul class="list-unstyled">' +
'    <%= view.itemblock(item, "#post") %>' +
'</ul>' +
'<%= view.block("#comments") %>' +
'<% } %>';
templates['#file'] = '<% var prid=view.model.id; var pp=view.options.collections.people;' +
'var cc=view.options.collections.project_categories.get_or_create(prid); %>' +
'<li class="media well well-sm">' +
'    <h3>' +
'        <a href="#projects/<%- prid %>/files/<%- item.id %>"><%- item.get("name") %><% if (item.get("private")) { %><i class="glyphicon glyphicon-lock"></i><% } %></a>' +
'    </h3>' +
'    <small>' +
'        by' +
'        <a href="#people/<%- item.get("person-id") %>"><i class="glyphicon glyphicon-user"></i><%- pp.get(item.get("person-id"))?pp.get(item.get("person-id")).name():item.get("person-id") %></a>' +
'        <% if (_.isFinite(item.get("category-id"))) { %>' +
'        in' +
'        <a href="#projects/<%- prid %>/categories/<%- item.get("category-id") %>"><%- cc.get(item.get("category-id"))?cc.get(item.get("category-id")).get("name"):item.get("category-id") %></a>' +
'        <% } %>' +
'        on' +
'        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>,' +
'        <%- item.get("byte-size") %>B<br />' +
'        <% if (_.isFinite(item.get("owner-id"))) { %>' +
'        for <%- item.get("owner-type") %> #<%- item.get("owner-id") %><br />' +
'        <% } %>' +
'        version #<%- item.get("version") %>' +
'        <% if (item.get("current")) { %>' +
'        - <a href="#projects/<%- prid %>/files/<%- item.get("collection") %>">parent version</a>' +
'        <% } else { var current=view.collection.where({"current":true,"collection":item.id}); %>' +
'        - <a href="#projects/<%- prid %>/files/<%- current && current[0] && current[0].id %>">current version</a>' +
'        <% } %>' +
'    </small>' +
'    <br/>' +
'    <a class="btn btn-success" href="<%- item.get("download-url") %>">Download</a>' +
'</li>';
templates['#project-files'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var ff=view.collection;' +
'if (ff.isEmpty()) { %>' +
'<div class="alert alert-info">No files...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<ul class="media-list">' +
'<% ff.each(function (item) { %>' +
'    <%= view.itemblock(item, "#file") %>' +
'<% }) %>' +
'</ul>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#project-file'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var ff=view.collection; var item=ff.get(view.cur_item);' +
'if (ff.isEmpty()) { %>' +
'<div class="alert alert-info">No files...</div>' +
'<% } else { %>' +
'<ul class="media-list">' +
'    <%= view.itemblock(item, "#file") %>' +
'</ul>' +
'<% } %>';
templates['#calendar'] = '<li class="panel panel-default">' +
'    <div class="panel-heading"><h3 class="panel-title">' +
'        <a <% if (item.get("type")=="Milestone" && item.get("completed")) { %>class="muted" <% } %>href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>"><%- item.get("title") %></a>' +
'        <i class="badge badge-inverse"><i class="calendar glyphicon-white glyphicon glyphicon-<%- item.get("completed")?"":"un" %>completed" data-id="<%- item.id %>"></i></i>' +
'        <a href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><i class="itemcomments glyphicon glyphicon-comment glyphicon-white"></i><%- item.get("comments-count") %></a>' +
'        <i class="edititem glyphicon glyphicon-pencil" data-id="<%- item.id %>"></i>' +
'        <% if (!_.isFinite(view.cur_item)) { %><i class="removeitem glyphicon glyphicon-trash" data-id="<%- item.id %>"></i><% } %>' +
'    </h3></div>' +
'    <div class="panel-body"><small>' +
'        <% if (item.get("type")=="Milestone" && item.get("responsible-party-id")) { %>' +
'        <a href="#<%- item.get("responsible-party-type")=="Company"?"companies":"people" %>/<%- item.get("responsible-party-id") %>"><% if (item.get("responsible-party-type")=="Person") { %><i class="glyphicon glyphicon-user"></i><% } %><%- item.get("responsible-party-name") %></a><br />' +
'        <% } %>' +
'        Type: <%- item.get("type") %><br />' +
'        <% if (item.get("start-at")) { %>' +
'        Start at <abbr title="<%- item.get("start-at") %>"><%- moment(item.get("start-at")).format("LL") %></abbr><br />' +
'        <% } %>' +
'        <% if (item.get("type")=="CalendarEvent" && item.get("due-at")) { %>' +
'        Due at <abbr title="<%- item.get("due-at") %>"><%- moment(item.get("due-at")).format("LLL") %></abbr><br />' +
'        <% } %>' +
'        <% if (item.get("type")=="Milestone" && item.get("deadline")) { %>' +
'        Deadline at <abbr title="<%- item.get("deadline") %>"><%- moment(item.get("deadline")).format("LL") %></abbr><br />' +
'        <% } %>' +
'        Created by' +
'        <a href="#people/<%- item.get("creator-id") %>"><i class="glyphicon glyphicon-user"></i><%- item.get("creator-name") %></a>' +
'        on' +
'        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>' +
'        <% if (item.get("type")=="Milestone" && item.get("completed")) { %>' +
'        <br />' +
'        Completed by' +
'        <a href="#people/<%- item.get("completer-id") %>"><i class="glyphicon glyphicon-user"></i><%- item.get("completer-name") %></a>' +
'        at' +
'        <abbr title="<%- item.get("completed-at") %>"><%- moment(item.get("completed-at")).format("LLL") %></abbr>' +
'        <% } %>' +
'    </small></div>' +
'</li>';
templates['#calendaredit'] = '<li class="panel panel-default editcalendar form form-inline" role="form" data-id="<%- item.id %>">' +
'<div class="form-group">' +
'<label class="sr-only" for="title<%- item.id %>">Title</label>' +
'<input type="text" name="title" class="form-control" id="title<%- item.id %>" placeholder="title" value="<%- item.get("title") %>">' +
'</div>' +
'<div class="form-group">' +
'<label class="sr-only" for="type<%- item.id %>">Event type</label>' +
'<select class="form-control" id="type<%- item.id %>" name="type">' +
'<option value="Milestone" <% if (item.get("type")=="Milestone") { %>selected="selected"<% } %>>Milestone</option>' +
'<option value="CalendarEvent" <% if (item.get("type")=="CalendarEvent") { %>selected="selected"<% } %>>CalendarEvent</option>' +
'</select>' +
'</div>' +
'<div class="form-group">' +
'<label class="sr-only" for="start<%- item.id %>">Start at</label>' +
'<input class="form-control" id="start<%- item.id %>" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="start-at" placeholder="YYYY-MM-DD" value="<%- item.get("start-at") %>">' +
'</div>' +
'<div class="form-group">' +
'<label class="sr-only" for="end<%- item.id %>">Deadline</label>' +
'<input class="form-control" id="end<%- item.id %>" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="deadline" placeholder="YYYY-MM-DD" value="<%- item.get("deadline") %>">' +
'</div>' +
'<button data-id="<%- item.id %>" class="save btn btn-default" title="Save"><i class="glyphicon glyphicon-ok"></i></button>' +
'<button data-id="<%- item.id %>" class="reset btn btn-default" title="Cancel"><i class="glyphicon glyphicon-off"></i></button>' +
'</li>';
templates['#project-calendar'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id;' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No events...</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<ul class="list-unstyled">' +
'<% cc.each(function (item) { %>' +
'    <%= view.itemblock(item, "#calendar") %>' +
'<% }) %>' +
'</ul>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#project-calendar-entry'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No events...</div>' +
'<% } else { %>' +
'<ul class="list-unstyled">' +
'    <%= view.itemblock(item, "#calendar") %>' +
'</ul>' +
'<% } %>';
templates['#project-calendar-entry-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var item=view.options.collections.project_calendar.get_or_create(view.model.id).get(view.cur_item);' +
'if (item) { %>' +
'<ul class="list-unstyled">' +
'    <%= view.itemblock(item, "#calendar") %>' +
'</ul>' +
'<%= view.block("#comments") %>' +
'<% } %>';
templates['#category'] = '<dt>' +
'    <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.id %>"><%- item.get("name") %></a>' +
'</dt>' +
'<dd>' +
'    <ul class="list-inline">' +
'         <li>Type: <%- item.get("type") %></li>' +
'         <li>Elements: <%- item.get("elements-count") %></li>' +
'    </ul>' +
'</dd>';
templates['#project-categories'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id;' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No categories...</div>' +
'<% } else { %>' +
'<dl class="dl-horizontal">' +
'<% cc.each(function (item) { %>' +
'    <%= view.itemblock(item, "#category") %>' +
'<% }) %>' +
'</dl>' +
'<% } %>';
templates['#project-category'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">No categories...</div>' +
'<% } else { %>' +
'<dl>' +
'    <%= view.itemblock(item, "#category") %>' +
'</dl>' +
'<% } %>';
templates['#todolist'] = '<div class="panel-heading">' +
'    <a <% if (item.get("completed")) { %>class="muted"<% } %>' +
'       href="#projects/<%- item.get("project-id") %>/todo_lists/<%- item.id %>"><%- item.get("name") %></a>' +
'    <% if (item.get("private")) { %><i class="glyphicon glyphicon-lock"></i><% } %>' +
'    <% if (false && item.get("tracked")) { %><i class="glyphicon glyphicon-time"></i><% } %>' +
'    <% if (!_.isFinite(view.cur_item)) { %>' +
'    <i class="todolist edititem glyphicon glyphicon-pencil" data-id="<%- item.id %>"></i>' +
'    <i class="todolist removeitem glyphicon glyphicon-trash" data-id="<%- item.id %>"></i>' +
'    <% } %>' +
'    <small><%= item.get("description") %></small>' +
'</div>';
templates['#todolistedit'] = '<div class="panel-heading"><form role="form" class="edit_todolist form-horizontal form">' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoName<%- item.id %>">Name</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input type="text" id="todoName<%- item.id %>" name="name" value="<%- item.get("name") %>" required>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoDescription<%- item.id %>">Description</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<textarea id="todoDescription<%- item.id %>" name="description"><%= item.get("description") %></textarea>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="private<%- item.id %>">Private list</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="private<%- item.id %>" type="checkbox" name="private" <% if (item.get("private")) { %>checked="checked"<% } %> value="true">' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="tracked<%- item.id %>">Time tracked</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="tracked<%- item.id %>" type="checkbox" name="tracked" <% if (item.get("tracked")) { %>checked="checked"<% } %> value="true">' +
'</div></div>' +
'<div class="form-group">' +
'<div class="col-lg-offset-4 col-lg-8 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-8">' +
'<button data-id="<%- item.id %>" class="btn btn-default save" title="Save"><i class="glyphicon glyphicon-ok"></i></button>' +
'<button data-id="<%- item.id %>" class="btn btn-default reset" title="Cancel"><i class="glyphicon glyphicon-off"></i></button>' +
'</div></div>' +
'</form></div>';
templates['#todolistadd'] = '<div class="panel-heading">' +
'<button type="button" class="btn" data-toggle="collapse" data-target=".add_todolist_wrapper">Add an item</button>' +
'</div>' +
'<div class="panel-body add_todolist_wrapper collapse"><form role="form" class="add_todolist form-horizontal form">' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoName">Name</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input type="text" id="todoName" name="name" value="" required>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoDescription">Description</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<textarea id="todoDescription" name="description"></textarea>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="private">Private list</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="private" type="checkbox" name="private" value="true">' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="tracked">Time tracked</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="tracked" type="checkbox" name="tracked" value="true">' +
'</div></div>' +
'<div class="form-group">' +
'<div class="col-lg-offset-4 col-lg-8 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-8">' +
'<button class="btn btn-default add" title="Add"><i class="glyphicon glyphicon-plus"></i></button>' +
'</div></div>' +
'</form></div>';
templates['#todo-lists'] = '<%= view.block("#header") %>' +
'<% var td=view.collection;' +
'var pp=view.options.collections.people;' +
'var prs=view.options.collections.projects;' +
'var party=view.collection.responsible_party;' +
'var mid=party==null?view.options.mydata.id:view.collection.responsible_party; %>' +
'<div class="clearfix">' +
'    <div class="pull-right"><label for="target" class="form-label">Show items assigned to:</label>' +
'        <select class="form-control" id="target" name="target">' +
'            <option value="" <% if (party=="") { %>selected="selected"<% } %>>Nobody</option>' +
'            <% pp.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <h3><%- view.description() %> to-do items across all projects</h3>' +
'</div>' +
'<% if (td.isEmpty()) { %>' +
'<div class="alert alert-info">No todo lists...</div>' +
'<% } else { %>' +
'<dl class="dl-horizontal">' +
'<% _.each(td.groupBy("project-id"), function (todos, prid) {' +
'var items=_.filter(todos, function(i){return _.where(i.get("todo-items"),{"completed":false}).length});' +
'if (items.length) { %>' +
'    <dt><h3><a href="#projects/<%- prid %>/todo_lists"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a></h3></dt>' +
'    <% _.each(items, function (list) { %>' +
'    <dd class="panel panel-default"><%= view.itemblock(list, "#todolist") %>' +
'    <ul class="list-group">' +
'        <% _.each(_.where(list.get("todo-items"),{"completed":false}), function (item) { %>' +
'        <li class="list-group-item">' +
'            <i class="todo-lists <%- item.completed?"un":"" %>completeitem glyphicon glyphicon-<%- item.completed?"":"un" %>completed" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>" data-id="<%- item.id %>"></i>' +
'            <% if (list.get("tracked")) { %>' +
'            <a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="glyphicon glyphicon-time"></i></a>' +
'            <% } %>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>"><%= item.content %></a>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>/comments" title="<%- item["comments-count"] %> comments" class="badge badge-inverse"><i class="itemcomments glyphicon glyphicon-comment glyphicon-white"></i><%- item["comments-count"] %></a>' +
'        </li>' +
'        <% }) %>' +
'    </ul></dd>' +
'    <% }) %>' +
'<% }}) %>' +
'</dl>' +
'<% } %>';
templates['#project-todo-lists'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;' +
'if (td.isEmpty()) { %>' +
'<div class="alert alert-info">No todo lists...</div>' +
'<% } else { %>' +
'<div class="tabbable row">' +
'<ul class="nav nav-pills nav-stacked col-lg-3 col-lg-push-9 col-md-4 col-md-push-8 col-sm-5 col-sm-push-7">' +
'<% var ftdst=_.first(td.pluck("completed"));' +
'   _.each(_.uniq(td.pluck("completed")), function (status) { %>' +
'    <li<% if (ftdst==status) { %> class="active"<% } %>>' +
'        <a href="#todolists_<%- status %>" data-toggle="tab"><% if (status==true) { %>Finished<% } else { %>Pending<% } %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content col-lg-9 col-lg-pull-3 col-md-8 col-md-pull-4 col-sm-7 col-sm-pull-5">' +
'    <% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>' +
'    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">' +
'        <ul class="list-unstyled">' +
'            <% _.each(tlgroup, function (list) { %>' +
'            <li class="panel panel-default">' +
'            <%= view.itemblock(list, "#todolist") %>' +
'            <div class="panel-body">' +
'                <ul class="list-inline">' +
'                    <li>Completed: <%- list.get("completed-count") %></li>' +
'                    <li>Uncompleted: <%- list.get("uncompleted-count") %></li>' +
'                </ul>' +
'            </div>' +
'            </li>' +
'            <% }) %>' +
'            <li class="panel panel-default">' +
'            <%= view.block("#todolistadd") %>' +
'            </li>' +
'        </ul>' +
'    </div>' +
'    <% }) %>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#todo'] = '<% var prid=view.model.id; var tdlid=item.get("todo-list-id");' +
'var list=view.options.collections.project_todo_lists.get_or_create(prid).get(tdlid); %>' +
'<i class="todo <%- item.get("completed")?"un":"" %>completeitem glyphicon glyphicon-<%- item.get("completed")?"":"un" %>completed" data-id="<%- item.id %>" data-todolist-id="<%- item.get("todo-list-id") %>" data-todoitem-id="<%- item.id %>"></i>' +
'<% if (list&&list.get("tracked")) { %>' +
'<a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="glyphicon glyphicon-time"></i></a>' +
'<% } %>&nbsp;' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>"><%= item.get("content") %></a>' +
'<% if (_.isFinite(item.get("responsible-party-id"))) { %><i class="glyphicon glyphicon-user"></i><% } %>' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><i class="itemcomments glyphicon glyphicon-comment glyphicon-white"></i><%- item.get("comments-count") %></a>' +
'<i class="todo edititem glyphicon glyphicon-pencil" data-id="<%- item.id %>"></i>' +
'<% if (!_.isFinite(view.todo_item)) { %><i class="todo removeitem glyphicon glyphicon-trash" data-id="<%- item.id %>"></i><% } %>';
templates['#todoedit'] = '<% var pp=view.options.collections.project_people.get_or_create(view.model.id); %>' +
'<div class="edit_todo_wrapper"><form role="form" class="edit_todo form-horizontal form">' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoContent<%- item.id %>">Todo content</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<textarea id="todoContent<%- item.id %>" name="content" required><%= item.get("content") %></textarea>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoDueAt<%- item.id %>">Due date</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="todoDueAt<%- item.id %>" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="due-at" placeholder="YYYY-MM-DD" value="<%= item.get("due-at") %>">' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="responsiblePerson<%- item.id %>">Responsible person</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<select  id="responsiblePerson<%- item.id %>" name="responsible-party">' +
'<option value="">Nobody</option>' +
'<% pp.each(function (i) { %><option value="<%- i.id %>" <% if (i.id==item.get("responsible-party-id")) { %>selected="selected"<% } %>><%- i.name() %></option><% }) %>' +
'</select>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="notify<%- item.id %>">Notify responsible person</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="notify<%- item.id %>" type="checkbox" name="notify" value="true">' +
'</div></div>' +
'<div class="form-group">' +
'<div class="col-lg-offset-4 col-lg-8 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-8">' +
'<button data-id="<%- item.id %>" class="btn btn-default save" title="Save"><i class="glyphicon glyphicon-ok"></i></button>' +
'<button data-id="<%- item.id %>" class="btn btn-default reset" title="Cancel"><i class="glyphicon glyphicon-off"></i></button>' +
'</div></div>' +
'</form></div>';
templates['#todoadd'] = '<% var pp=view.options.collections.project_people.get_or_create(view.model.id); %>' +
'<div class="panel-footer"><button type="button" class="btn" data-toggle="collapse" data-target=".add_todo_wrapper">Add an item</button>' +
'<div class="add_todo_wrapper collapse"><form role="form" class="add_todo form-horizontal form">' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoContent">Todo content</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<textarea id="todoContent" name="content" required></textarea>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="todoDueAt">Due date</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="todoDueAt" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="due-at" placeholder="YYYY-MM-DD" value="">' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="responsiblePerson">Responsible person</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<select  id="responsiblePerson" name="responsible-party">' +
'<option value="">Nobody</option>' +
'<% pp.each(function (i) { %><option value="<%- i.id %>"><%- i.name() %></option><% }) %>' +
'</select>' +
'</div></div>' +
'<div class="form-group">' +
'<label class="control-label col-lg-4 col-md-4 col-sm-4 col-xs-4" for="notify">Notify responsible person</label>' +
'<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
'<input id="notify" type="checkbox" name="notify" value="true">' +
'</div></div>' +
'<div class="form-group">' +
'<div class="col-lg-offset-4 col-lg-8 col-md-offset-4 col-md-8 col-sm-offset-4 col-sm-8">' +
'<button class="btn btn-default add" title="Add"><i class="glyphicon glyphicon-plus"></i></button>' +
'</div></div>' +
'</form></div></div>';
templates['#project-todo-list'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;' +
'var ci=view.cur_item; var list=td.get(ci); var ftdst=list&&list.get("completed");' +
'if (td.isEmpty()) { %>' +
'<div class="alert alert-info">No todo lists...</div>' +
'<% } else { %>' +
'<div class="row">' +
'<ul class="list-unstyled todoitemsholder project-todo-list col-lg-9 col-md-8 col-sm-7">' +
'    <li class="panel panel-default">' +
'    <%= view.itemblock(list, "#todolist") %>' +
'    <ul class="list-group">' +
'<% view.options.collections.todo_items.get_or_create(ci).each(function (item) { %>' +
'    <li class="list-group-item">' +
'<%= view.itemblock(item, "#todo") %>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<%= view.block("#todoadd") %>' +
'    </li>' +
'</ul>' +
'<div class="tabbable col-lg-3 col-md-4 col-sm-5">' +
'<ul class="nav nav-tabs nav-justified">' +
'<% _.each(_.uniq(td.pluck("completed")), function (status) { %>' +
'    <li<% if (ftdst==status) { %> class="active"<% } %>>' +
'        <a href="#todolists_<%- status %>" data-toggle="tab"><% if (status==true) { %>Finished<% } else { %>Pending<% } %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content">' +
'<% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>' +
'    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">' +
'    <ul class="nav nav-pills nav-stacked">' +
'        <% _.each(tlgroup, function (l) { %>' +
'        <li<% if (ci==l.id) { %> class="active"<% } %>>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- l.id %>"><%- l.get("name") %><% if (l.get("private")) { %><i class="glyphicon glyphicon-lock"></i><% } %></a>' +
'        </li>' +
'        <% }) %>' +
'    </ul>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#project-todo-item'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items;' +
'var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;' +
'var items=todo_items.get_or_create(list_id); var list=td.get(list_id);' +
'var item=items.get(item_id);' +
'if (td.isEmpty()||items.isEmpty()) { %>' +
'<div class="alert alert-info">No todo items...</div>' +
'<% } else { %>' +
'<div class="panel panel-default todoitemsholder project-todo-item">' +
'    <%= view.itemblock(list, "#todolist") %>' +
'    <ul class="list-group">' +
'    <li class="list-group-item">' +
'    <%= view.itemblock(item, "#todo") %>' +
'    </li>' +
'    </ul>' +
'</div>' +
'<% } %>';
templates['#project-todo-item-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.todo_lists; var todo_items=view.options.collections.todo_items;' +
'var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;' +
'var items=todo_items.get_or_create(list_id);' +
'var item=items.get(item_id);' +
'var ccc=view.collection;' +
'if (td.isEmpty()||items.isEmpty()) { %>' +
'<div class="alert alert-info">No todo items...</div>' +
'<% } else { %>' +
'<ul class="list-group todoitemsholder project-todo-item-comments">' +
'    <li class="list-group-item">' +
'<%= view.itemblock(item, "#todo") %>' +
'    </li>' +
'</ul>' +
'<%= view.block("#comments") %>' +
'<% } %>';
templates['#nav'] = '<div class="container">' +
'<div class="navbar-header">' +
'<button data-target=".navbar-responsive-collapse" data-toggle="collapse" class="navbar-toggle" type="button">' +
'    <span class="icon-bar"></span>' +
'    <span class="icon-bar"></span>' +
'    <span class="icon-bar"></span>' +
'</button>' +
'<a class="navbar-brand" href="#">BB</a>' +
'</div>' +
'<div class="collapse navbar-collapse navbar-responsive-collapse">' +
'<ul class="nav navbar-nav">' +
'<% _.each(view.navitems, function (title, link) { %>' +
'    <li><a href="#<%- link %>"><%- title %></a></li>' +
'<% }) %>' +
'</ul>' +
'<ul class="nav navbar-nav navbar-right">' +
'    <li>' +
'        <a href="#me" title="<%- view.model.get("user-name") %>" class="dropdown-toggle" data-toggle="dropdown"><%- view.model.name() %> <span class="caret"></span></a>' +
'        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">' +
'            <% _.each(view.dropdownitems, function (data, link) { %>' +
'            <li role="presentation"><a role="menuitem" href="#<%- link %>"><i class="glyphicon glyphicon-<%- data.icon %>"></i> <%- data.title %></a></li>' +
'            <% }) %>' +
'            <li role="presentation" class="divider"></li>' +
'            <li role="presentation"><a role="menuitem" href="/logout"><i class="glyphicon glyphicon-log-out"></i> Logout</a></li>' +
'        </ul>' +
'    </li>' +
'</ul>' +
'</div>' +
'</div>';
return templates;
}));
