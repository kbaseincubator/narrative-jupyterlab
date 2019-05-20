import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
  ILabShell
} from '@jupyterlab/application';

import {
  DataPanel
} from './dataPanel';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

import '../style/index.css';
import { ICommandPalette } from '@jupyterlab/apputils';


/**
 * Initialization data for the kb-data-panel extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'kb-data-panel',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, INotebookTracker, ILabShell],
  activate: (app: JupyterFrontEnd,
             palette: ICommandPalette,
             restorer: ILayoutRestorer,
             nbTracker: INotebookTracker,
             labShell: ILabShell) => {
    let dataPanel: DataPanel = new DataPanel(nbTracker);
    // app.shell.addToLeftArea(dataPanel);
    app.shell.add(dataPanel, 'left');

    console.log('JupyterLab extension kb-data-panel is activated!');
  }
};

export default extension;
