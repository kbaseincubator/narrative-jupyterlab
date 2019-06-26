import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';


import { INotebookTracker } from '@jupyterlab/notebook';

import { ICommandPalette} from '@jupyterlab/apputils';

import { AppPanel } from './appPanel';

/**
 * Initialization data for the kb-app-panel extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'kb-app-panel',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: (app: JupyterFrontEnd,
             palette: ICommandPalette,
             nbTracker: INotebookTracker) => {
    let appPanel: AppPanel = new AppPanel(nbTracker);
    app.shell.add(appPanel, 'left');

    console.log('JupyterLab extension kb-app-panel is activated!');
  }
};

export default extension;
