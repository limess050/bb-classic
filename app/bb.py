""" Main BB classic app module
"""
import webapp2
import os
import json
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch
from google.appengine.ext import db
from xml.dom import minidom
import datetime
import base64
from urlparse import urlunparse
from urllib import urlencode

import crypto

_ = lambda x: os.path.join(os.path.dirname(__file__), 'templates', x)

DOMAIN = 'basecamphq.com'

MEDATA = {
    "avatar-url": "/static/img/avatar.gif",
    "company-id": 0,
    "created-at": "2000-00-00T00:00:00Z",
    "deleted": False,
    "email-address": "name@domain.com",
    "first-name": "First",
    "id": 0,
    "im-handle": "example",
    "im-service": "Skype",
    "last-name": "Last",
    "phone-number-fax": "+000 (00) 000-0002",
    "phone-number-home": "+000 (00) 000-0001",
    "phone-number-mobile": "+000 (00) 000-0000",
    "phone-number-office": "+000 (00) 000-0003",
    "phone-number-office-ext": "",
    "time-zone-name": "Europe/Kiev",
    "title": "Title",
    "updated-at": "2000-01-01T00:00:00Z",
    "user-name": "test",
}

COLLECTION = [{
    "address-one": "Address one of #%s" % i,
    "address-two": "Address two of #%s" % i,
    "announcement": "announcement of #%s" % i,
    "attachments": [{
        "author-name": "Author name #%s" % x,
        "byte-size": 100 * x,
        "download-url": "url%s" % x,
        "name": "Name #%s" % x,
        "person-id": x % 5,
    } for x in range(i % 5)],
    "attachments-count": i % 5,
    "author-id": i % 5,
    "author-name": "Author name #%s" % i,
    "avatar-url": "/static/img/avatar.gif",
    "body": "Body of #%s" % i,
    "byte-size": 100 * i,
    "category-id": i % 5,
    "city": "City #%s" % i,
    "commented-at": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "comments-count": i,
    "company": {
            "id": i % 5,
            "name": "Company name #%s" % (i % 5)
    },
    "company-id": i % 5,
    "completed": [True, False][i % 2],
    "completed-at": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "completed-count": i % 5,
    "completer-id": i % 5,
    "completer-name": "Completer name #%s" % i,
    "content": "Todo content #%s" % i,
    "country": "Country #%s" % i,
    "created-at": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "created-on": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "creator-id": i % 5,
    "creator-name": "Creator name #%s" % i,
    "date": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "deadline": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "description": "description of #%s" % i,
    "display-body": "Display body of #%s" % i,
    "download-url": "url%s" % i,
    "due-at": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "elements-count": i,
    "email-address": "name@domain.com",
    "first-name": "First#%s" % i,
    "hours": i % 5 * 0.5 + 0.1,
    "id": i,
    "im-handle": "example#%s" % i,
    "im-service": "Skype",
    "last-name": "Last",
    "locale": ["en", "ru", "ua"][i % 3],
    "name": "Name of #%s" % i,
    "person-id": i % 5,
    "person-name": "Pesson #%s" % i,
    "phone-number-fax": "Fax of #%s" % i,
    "phone-number-home": "Home phone of #%s" % i,
    "phone-number-mobile": "Mobile phone of #%s" % i,
    "phone-number-office": "Office phone of #%s" % i,
    "posted-on": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "private": [True, False][i % 2],
    "project-id": i % 5,
    "responsible-party-id": i % 5,
    "responsible-party-name": "Responsible party name #%s" % i,
    "responsible-party-type": ['Company', 'Person'][i % 2],
    "start-at": "%d-%.2d-%.2d" % (i % 12 + 2001, i % 12 + 1, i % 30 + 1),
    "state": "State phone of #%s" % i,
    "status": ["active", "on_hold", "archived"][i % 3],
    "time-zone-id": "EET",
    "time-zone-name": "Europe/Kiev",
    "title": "Title #%s" % i,
    "todo-item-id": i % 5,
    "todo-items": [{
        "id": x,
        "content": "Todo content #%s" % x,
    } for x in range(i % 5)],
    "todo-list-id": i % 5,
    "tracked": [True, False][i % 2],
    "type": "Type of #%s" % i,
    "uncompleted-count": 5 - i % 5,
    "use-textile": [True, False][i % 2],
    "user-name": "test",
    "web-address": "http://example%s.com" % i,
    "zip": "%5.5d" % i,
} for i in range(30)]


NODE_ONE = lambda x: x.nodeType == 1


class GetSubjectException(Exception):
    """ Exception on get subject_id
    """


def absolute_url(subdomain, relative_url='', params='', query='', fragment=''):
    """ absolute url for request
    """
    if type(query) == dict:
        query = urlencode(query)
    return urlunparse(('https', '%s.%s' % (subdomain, DOMAIN),
                      relative_url, params, query, fragment))


def get_headers(username, password):
    """ Prepare request headers
    """
    headers = {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
    }
    creds = username + u':' + password
    creds = "Basic " + base64.encodestring(creds.encode('utf-8')).strip()
    headers["Authorization"] = creds
    return headers


def get_subject_id(username, password, subdomain):
    """ Get 'subject_id' for report query - it is id of logged in user.
    """
    headers = get_headers(username, password)
    result = urlfetch.fetch(url=absolute_url(
        subdomain, '/me.xml'), method=urlfetch.GET, headers=headers)
    if result.status_code == 200:
        dom = minidom.parseString(result.content)
        return str(dom.getElementsByTagName('id')[0].firstChild.nodeValue)
    else:
        raise GetSubjectException('Can\'t get subject_id')


class CacheInfo(db.Model):
    """ Model for the cached response.
    """
    url = db.StringProperty('Fetch URL', required=True)
    status_code = db.IntegerProperty(
        'Response status', required=True, indexed=False)
    headers = db.ListProperty(db.Blob, 'Response headers', indexed=False)
    content = db.BlobProperty('Response content')
    date = db.DateTimeProperty('Date when response was added to the cache',
                               auto_now=True)


class BaseRequestHandler(webapp2.RequestHandler):
    """ Base Request Handler
    """
    username = None
    password = None
    sub_id = None
    subdomain = None

    def dev(self):
        """ Check develompent environment
        """
        req_dev = self.request.get('dev', False)
        soft_dev = os.environ['SERVER_SOFTWARE'].startswith('Development')
        return req_dev or soft_dev

    def auth_check(self):
        """ Check session
        """
        is_sessioned = False
        if 'ssid' in self.request.cookies:
            data = crypto.decode_data(self.request.cookies['ssid'])
            if data:
                is_sessioned = True
                self.username, self.password, self.sub_id, \
                    self.subdomain = data
        return is_sessioned


class MainPage(BaseRequestHandler):
    """ Main Page Handler
    """
    def get(self):
        """ GET request
        """
        if self.auth_check():
            self.response.out.write(template.render(
                _('index.html'),
                {'dev': self.dev()}))
        else:
            return self.redirect('/login')


class LoginPage(BaseRequestHandler):
    """ Login Page Handler
    """
    def get(self):
        """ GET request
        """
        self.response.out.write(template.render(
            _('login.html'),
            {'dev': self.dev()}))

    def post(self):
        """ POST request
        """
        login = self.request.get('username')
        pwd = self.request.get('password')
        subdomain = self.request.get('subdomain')

        # test login
        if subdomain == 'test' and login == 'test' and pwd == 'test':
            subject_id = 'test'
            data = [login, pwd, subject_id, subdomain]
            expires = (datetime.datetime.now() + datetime.timedelta(weeks=4))\
                .strftime('%a, %d-%b-%Y %H:%M:%S UTC')
            ssid_cookie = 'ssid=%s; expires=%s' % \
                (crypto.encode_data(tuple(data)), expires)
            self.response.headers.add_header('Set-Cookie', str(ssid_cookie))
            return

        # check whether all needed data is given
        if not (subdomain and login and pwd):
            self.error(401)
            return

        # make a request to the Basecamp API
        try:
            subject_id = get_subject_id(login, pwd, subdomain)
        except GetSubjectException:
            self.error(401)
            return

        # save login information in a cookie
        data = [login, pwd, subject_id, subdomain]
        expires = (datetime.datetime.now() + datetime.timedelta(weeks=4))\
            .strftime('%a, %d-%b-%Y %H:%M:%S UTC')
        ssid_cookie = 'ssid=%s; expires=%s' % \
            (crypto.encode_data(tuple(data)), expires)
        self.response.headers.add_header('Set-Cookie', str(ssid_cookie))


class LogoutPage(BaseRequestHandler):
    """ Logout Page Handler
    """
    def get(self):
        """ GET request
        """
        ssid = self.request.cookies.get('ssid', '')
        self.response.headers['Set-Cookie'] = str(
            'ssid=%s; expires=Fri, 31-Dec-2008 23:59:59 GMT;' % ssid)
        self.response.out.write(template.render(
            _('logout.html'),
            {'dev': self.dev()}))


def convertchilds(childs):
    """ convert childs
    """
    result = []
    for item in [y for y in childs if NODE_ONE(y)]:
        items = [y for y in item.childNodes if NODE_ONE(y)]
        result.append(dict([convert(y) for y in items]))
    return result


def convertsubnodes(childs):
    """ convert subnodes
    """
    subnodes = [y for y in childs if NODE_ONE(y)]
    if subnodes:
        value = dict([convert(y) for y in subnodes])
    else:
        value = "".join([y.nodeValue for y in childs])
    return value


def convert(node):
    """ convert xml to dict
    """
    name = node.nodeName
    if node.getAttribute("nil") == "true":
        return (name, None)
    childs = node.childNodes
    if not childs:
        return (name, "")
    type_ = node.getAttribute("type")
    if type_ == "integer":
        value = int(node.firstChild.nodeValue)
    elif type_ == "boolean":
        value = True if node.firstChild.nodeValue == "true" else False
    elif type_ == "float":
        value = float(node.firstChild.nodeValue)
    elif type_ == "array":
        value = convertchilds(childs)
    else:
        value = convertsubnodes(childs)
    return (name, value)


# def dict2xml(data):
    #""" convert dict to xml
    #"""
    # from xml.dom.minidom import Document
    # d = Document()
    # p = d.createElement("photo")
    # d.appendChild(p)
    # a = d.createAttribute("asd")
    # p.attributes.setNamedItem(a)
    # a.value = "dsa"
    # t = d.createTextNode("test")
    # p.appendChild(t)
    # d.toprettyxml()
    #'<?xml version="1.0" ?>\n<photo asd="dsa">test</photo>\n'


class CrossDomain(BaseRequestHandler):
    """ Cross Domain Handler
    """
    def put(self):
        """ PUT request
        """
        if not self.auth_check():
            return self.redirect('/login')
        # self.response.headers['Content-Type'] = 'application/json'
        # self.response.out.write(self.request.body)

    def get(self):
        """ GET request
        """
        if not self.auth_check():
            return self.redirect('/login')
        if self.subdomain == 'test' and self.username == 'test' and \
                self.password == 'test' and self.sub_id == 'test':
            self.response.headers['Content-Type'] = 'application/json'
            if self.request.path_qs == "/api/me.xml":
                self.response.out.write(json.dumps(MEDATA))
            else:
                self.response.out.write(json.dumps(COLLECTION))
            return
        dev = self.dev()
        query = None
        if dev:
            query = db.GqlQuery(
                "SELECT * FROM CacheInfo"
                " WHERE url='%s'" % self.request.path_qs)
        if dev and query and query.count():
            content = query[0].content
        else:
            headers = get_headers(self.username, self.password)
            url = absolute_url(self.subdomain, self.request.path_qs[4:])
            result = urlfetch.fetch(
                url=url, method=urlfetch.GET, headers=headers)
            if result.status_code != 200:
                self.response.set_status(result.status_code)
                self.response.out.write(result.content)
                return
            content = result.content
            if dev:
                einfo = CacheInfo(url=self.request.path_qs,
                                  status_code=result.status_code,
                                  headers=[db.Blob('%s:%s' % (k, v))
                                           for k, v in result.headers.items()],
                                  content=result.content)
                einfo.put()
            self.response.set_status(result.status_code)
            self.response.headers.update(result.headers)
        dom = minidom.parseString(content)
        if dom.childNodes:
            parent = dom.childNodes[0]
            result = convert(parent)[1]
            self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(json.dumps(result))

APPLICATION = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/login', LoginPage),
    ('/logout', LogoutPage),
    ('/api/.*', CrossDomain),
], debug=True)
