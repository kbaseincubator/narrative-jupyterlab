# narrative-jupyterlab
Research and prototyping KBase extensions in Jupyterlab

## Developer installation and running

### 0. Prerequisites
Install these:
* [Anaconda or Miniconda](https://www.anaconda.com) for the environment manager.
* [NodeJS](https://nodejs.org) for running builds, installs, etc.

### 1. Installation
You're best off building a conda environment and installing into it. There's a KBase-ish installer script, so run that, too.
```Python
# make a narrative/jupyterlab conda environment
> conda create -n narrative-jlab-env  
# activate it
> source activate narrative-jlab-env
# run the installer
> ./scripts/install_narrative.sh
```

### 2. Run The Jupyterlab Narrative
```Python
# With your conda environment active...
> kbase-narrative-lab

# That will run unauthenticated. To add authentication:
> export KB_AUTH_TOKEN=<REDACTED>
> kbase-narrative-lab

# We're putting tokens straight into the environment, or so's the plan when running on the server.
```

This also accepts any other flags to pass to the jupyter lab environment. I.e. `kbase-narrative-lab --watch` will run in "watch" mode, which is occasionally helpful for developing.

The rest of this document assumes that your environment is active and happy and you can run Narrative-jupyterlab. If it's not, then good luck!

### 3. Building a shiny new extension
1. Install the cookiecutter program. It's neat and builds a tiny local environment for your extension.
```
> conda install -c conda-forge cookiecutter
```

2. Run cookiecutter to build a directory. This is for an Application Extension (not a MIME renderer or theme extension. See [Jupyterlab readthedocs](https://jupyterlab.readthedocs.io/en/stable/developer/extension_dev.html) for more detail). I think most of what we'll be making will be Application extensions.  
```
> cookiecutter https://github.com/jupyterlab/extension-cookiecutter-ts
```  
This will walk you through a number of prompts that'll result in a new extension. They look like this:  
```
author_name []:
extension_name [myextension]:
project_short_description [A JupyterLab extension.]:
repository [https://github.com/my_name/myextension]:
```  
Mostly, they're used to set up metadata in `package.json`. But be sure to give a useful extension name. I've been namespacing them under `kb-` (e.g. `kb-data-panel`) in case there's conflict issues.

3. Edit `index.ts`  
This is your extension entrypoint. It lives in `<extension name>/src/index.ts`, and looks like this:

```Typescript
import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the myextension extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'myextension',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension myextension is activated!');
  }
};

export default extension;
```

Each extension needs default export from that module. To be a JupyterLabPlugin, it needs the following:
* `id` - some unique name for the extension (hence the KBase namespacing)
* `autoStart` - boolean, if true, then the `activate` function gets run right away
* `activate` - a function that starts up the extension. You can add other required variables there, too.
* `requires` - (optional, not shown by default) - a list of interfaces that the extension requires. The `XKCD comic` example creates a new Command, and uses the Layout Restorer, so it requires both of these. These also get passed along to the `activate` function, like so:

```Typescript
const extension: JupyterLabPlugin<void> = {
    id: 'myextension',
    autoStart: true,
    requires: [ICommandPalette, ILayoutRestorer],
    activate: (app: JupyterLab, command: ICommandPalette, layoutRestorer: ILayoutRestorer) {
        ...etc.
    }
}
```

### 4. Installing and building your extension.

There's two steps to extension building. Installation into the Jupyterlab environment, and building with an npm script.

Jupyterlab is packaged with a wrapper around `yarn` called `jlpm` (yeah, I know. you can also just run `npm` or `yarn` directly, but I think this does a few extra environmental things easier).

**Add packages**:
```
> jlpm add <some NPM module>
```
pretty much like `yarn add XYZ`. You'll use this for the various Jupyterlab components, and React and ReactDOM (see below).

**Installation**:  
From inside your extension directory
```
> jupyter labextension install . --no-build
```
This links things together and tells Jupyterlab that you have a new extension

**Building/rebuilding**:  
Also inside your extension directory
```
> jlpm run build
```

**Restart Jupyterlab to see extension changes**  
Or start it with `kbase-narrative-lab --watch` and it should automatically rebuild around any changes to extensions. Sometimes it throws a 404 on reload, though, and the only way I've found to fix that is to stop and restart the server.

You can also use
```
> jlpm run watch
```
in your extension directory to have it auto-rebuild on each change to your extension. That's also very spotty for me, and isn't shy about throwing errors, which propagate up to the app, especially if that's in watch mode.


### 5. Building an extension with ReactJS
This is tricky and requires a little modification to the `package.json` file in your extension.

First, install React and ReactDOM.
```
> jlpm add react react-dom 
> jlpm add -D @types/react @types/react-dom
```

Next, there needs to be a "resolutions" block in `package.json` to tell the compiler to use a specific set of TypeScript types to resolve any conflicts. Your `package.json` should look something like this:

```json
{
    ... stuff above ...
    "dependencies": {
        "@jupyterlab/application": "some_version",
        "@jupyterlab/apputils": "some_version",
        "react": "some_version",
        "react-dom": "some_version"
    },
    "devDependencies": {
        "@types/react": "some_version",
        "@types/react-dom": "some_version",
        "rimraf": "some_version",
        "typescript": "some_version"
    },
    "resolutions": {
        "@types/react": "some_version"
    }
    ... stuff below ...
}
```

Now, update your `tsconfig.json` to have `"jsx": "react"` under its `compilerOptions` block:

```json
{
  "compilerOptions": {
    ... stuff there by default ...
    "jsx": "react"
  },
  "include": ["src/*"]
}
```
And that's it for compiling. For actually writing code, you're on your own. But see `kb-data-panel` to get started, maybe?

**NOTE:** this is all up in the air and volatile. There's an issue from January [#5875](https://github.com/jupyterlab/jupyterlab/issues/5875) that talks about React best practices in Jupyterlab. It doesn't seem resolved, and it references [#5792](https://github.com/jupyterlab/jupyterlab/issues/5792), which discusses some refactoring to better support React.

There *is* a ReactComponent Widget extension that should play nice with the rest of Jupyterlab, but it seems in progress, and it's not published on the conda-forge installation of Jupyterlab. I think it's only available when building from source on the master branch of their repo.

But once the above steps are taken, you can use `ReactDOM.render` directly, and it seems ok. There's examples of other extensions out in the world that do that already, like the [Plotly chart editor](https://github.com/plotly/jupyterlab-chart-editor/blob/master/src/index.tsx).
