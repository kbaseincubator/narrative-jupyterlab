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
