from tornado.escape import url_escape
from notebook.base.handlers import IPythonHandler
from traitlets.config import Application
from notebook.auth.login import LoginHandler
from notebook.auth.logout import LogoutHandler
from biokbase.narrative.common.kblogging import (
    get_logger, log_event
)
from biokbase.narrative.common.util import kbase_env
import tornado.log
import os
import urllib.parse
import logging
from biokbase.auth import (
    get_user_info,
    init_session_env,
    set_environ_token,
    new_session
)

"""
KBase handlers for authentication in the Jupyter notebook.
"""
__author__ = 'Bill Riehl <wjriehl@lbl.gov>'

# Set logging up globally.
g_log = get_logger("biokbase.narrative")

app_log = tornado.log.app_log  # alias
if Application.initialized:
    app_log = Application.instance().log

if os.environ.get('KBASE_DEBUG', False):
    app_log.setLevel(logging.DEBUG)

auth_cookie_name = "kbase_session"


class KBaseLoginHandler(LoginHandler):
    """KBase-specific login handler.
    This should get the cookie and put it where it belongs.

    A (not-so-distant) future version will return a session token.
    """

    def get(self):
        """
        Initializes the KBase session from the cookie passed into it.
        """

        # cookie_regex = re.compile('([^ =|]+)=([^\|]*)')
        client_ip = self.request.remote_ip
        http_headers = self.request.headers
        ua = http_headers.get('User-Agent', 'unknown')
        # save client ip in environ for later logging
        kbase_env.client_ip = client_ip

        auth_cookie = self.cookies.get(auth_cookie_name, None)
        if auth_cookie:
            token = urllib.parse.unquote(auth_cookie.value)
            auth_info = dict()
            try:
                auth_info = get_user_info(token)
            except Exception as e:
                app_log.error("Unable to get user information from authentication token!")
                raise

            init_session_env(auth_info, client_ip)
            self.current_user = kbase_env.user
            log_event(g_log, 'session_start', {'user': kbase_env.user, 'user_agent': ua})

        app_log.info("KBaseLoginHandler.get(): user={}".format(kbase_env.user))

        if self.current_user:
            self.redirect(self.get_argument('next', default=self.base_url))
        else:
            self.write('This is a test?')

    def post(self):
        pass

    @classmethod
    def get_user(cls, handler):
        user_id = kbase_env.user

        if user_id == '':
            user_id = 'anonymous'
        if user_id is None:
            handler.clear_login_cookie()
            if not handler.login_available:
                user_id = 'anonymous'
        return user_id

    @classmethod
    def password_from_settings(cls, settings):
        return ''

    @classmethod
    def login_available(cls, settings):
        """Whether this LoginHandler is needed - and therefore whether the login page should be displayed."""
        return True


class KBaseLogoutHandler(LogoutHandler):
    def get(self):
        client_ip = self.request.remote_ip
        http_headers = self.request.headers
        user = kbase_env.user
        ua = http_headers.get('User-Agent', 'unknown')

        kbase_env.auth_token = 'none'
        kbase_env.narrative = 'none'
        kbase_env.session = 'none'
        kbase_env.user = 'anonymous'
        kbase_env.workspace = 'none'

        set_environ_token(None)

        app_log.info('Successfully logged out')
        log_event(g_log, 'session_close', {'user': user, 'user_agent': ua})

        self.write(self.render_template('logout.html', message={'info': 'Successfully logged out'}))


def load_jupyter_server_extension(nb_server_app):
    app_log.info('Loaded server extension')
    if 'KB_AUTH_TOKEN' in os.environ:
        app_log.info("Found KBase auth token, initializing environment.")
        new_session(os.environ['KB_AUTH_TOKEN'])
        app_log.info("Session initialized for user {}".format(kbase_env.user))
    else:
        app_log.info("KBase auth not found, starting anonymous session.")
