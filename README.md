# narrative-jupyterlab
Research and prototyping KBase extensions in Jupyterlab

First, install anaconda/miniconda, make an environment, and install jupyterlab

```
conda create -n jlab-ext
conda activate jlab-ext
conda install -c conda-forge jupyterlab cookiecutter
```

## Notes
From [Jupyterlab readthedocs](https://jupyterlab.readthedocs.io/en/stable/developer/extension_dev.html)
### Extensions
Types:
* Application plugin (adds to command palette, modifies browser environment, etc.)
* Mime renderer extension (renders mime data and/or files of a given type -- maybe useful for data objects?)
* Theme extension - customize look and feel
* Document widget extensions (lower level) - extend functionality of document widgets added to the app -- covered [here](https://jupyterlab.readthedocs.io/en/stable/developer/documents.html#documents)

Tutorial (for front end...) [XKCD extension](https://jupyterlab.readthedocs.io/en/stable/developer/xkcd_extension_tutorial.html) (**following notes mostly have to do with that tutorial**)

Easy start - use `cookiecutter` to init an extension directory:
```
cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts
```

This sets up the directory and initializes package.json with relevant info.

Go into new directory and:
```
jlpm install  # (comes bundled with jupyterlab)
jupyter labextension install . --no-build
jupyter lab --watch
```

The last line sets up a directory watch and recompiles and installs and keeps your changes up to date.

Using `jlpm` for developing:  
`jlpm` is really just a Jupyter-installed `yarn` version.
Use them synonymously, if you have `yarn` installed globally.

Next, go through the tutorial further, throw in some code.

To rebuild:
```
jlpm run build
```
having `jupyter lab --watch` in another terminal will keep it updated with extension changes.
You can have changes auto build with
```
jlpm run watch
```

So now, there's two dedicated sessions - one to keep building the extension, and one to keep building jupyterlab.


## On server-side extensions
The current Narrative sets its extensions by config.  
specifically (in `jupyter_notebook_config.py`):
```
c = get_config()
c.NotebookApp.ip = 'localhost'
c.NotebookApp.port = 8888
c.NotebookApp.server_extensions = ['biokbase.narrative.handlers.narrativehandler']
c.NotebookApp.contents_manager_class = 'biokbase.narrative.contents.kbasewsmanager.KBaseWSManager'
c.NotebookApp.login_handler_class = 'biokbase.narrative.handlers.authhandlers.KBaseLoginHandler'
c.NotebookApp.logout_handler_class = 'biokbase.narrative.handlers.authhandlers.KBaseLogoutHandler'
c.NotebookApp.tornado_settings = { 'compress_response': True }
c.NotebookApp.cookie_secret_file = '/tmp/notebook_cookie'
myfile = os.path.dirname(__file__) # more or less
c.NotebookApp.extra_static_paths = [os.path.join(myfile, 'static')]
```

Really, this sets the login/logout tornado handlers, and the contents manager. Everything else is managed by importing parts of the biokbase package.

Jupyterlab is really the "lab" extension on the jupyter backbone. It includes some server-side stuff, but it's mainly the front end rewrite. So jupyterlab extensions modify the frontend almost exclusively. Jupyter serverextensions are still a separate beast, and we could possibly port our things over to that. But at first glance, just tinkering with config files seems to be enough to get things started.

### Auth
We use our own authentication stuff. So we don't need the Jupyter auth as described here:
https://jupyter-notebook.readthedocs.io/en/stable/security.html

They use:
* token based auth in the `_xsrf` cookie on every request from the browser to the server. Fails if not present. This gets generated on startup and logged to the terminal (and embedded in the browser if you start the application with a new browser window being opened)
    * Use the /?token=blahblahblah url parameter to make this happen
* optional password based auth - the `jupyter notebook password` command will prompt for a pw and store the hashed version in `jupyter_notebook_config.json`
    * Now you need the password on startup, compares against the hash, and gates things that way.

We use:
* token based auth in the `kbase_session` cookie. Otherwise, it's the same.
* Call the `/login` input on startup/page reload - this creates the server-side KBase session environment object.
    * and (headslap) is probably why fails were happening when bringing the kernel back up.
* There seems to be some funkiness with that particular token and how it interacts with our code stack.

Can disable the built-in Jupyter auth with a `jupyter_notebook_config.py` change: 
```
c.NotebookApp.token = ''
c.NotebookApp.password = ''
```
Otherwise most authenticated api calls fail.

Options
1. Add a hook that calls /login on page load, again, this time as part of an extension
    + Similar behavior to before, can likely use similar code.
    - Same problems as before.
    - Probably a race condition.
    - Before, we were mixing up concerns - the session environment was just dumping the token to an env var anyway.
2. Add a server extension that inits the session on server start, where the token is either an env var, or a parameter.
    + Avoids race condition, explicitly starts up with server before user sees anything.
    + The main point of maintaining the session was to keep the token locked in an env var. This does so explicitly.
    - Might be a security issue? Need to be careful with logs.
