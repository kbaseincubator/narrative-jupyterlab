import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
  ILabShell
} from '@jupyterlab/application';

import {
  DataPanel
} from './sidePanel/dataPanel';

import {
  DataSlideout
} from './browser/dataSlideout';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { JSONExt } from '@phosphor/coreutils';


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
    let tracker = new WidgetTracker<Widget>({ namespace: 'kbase' });

    let dataSlideout: DataSlideout = new DataSlideout(nbTracker);
    const command: string = 'kbase:data-open';
    app.commands.addCommand(command, {
      label: 'Open Data Slideout',
      execute: () => {
        if (!dataSlideout) {
          dataSlideout = new DataSlideout(nbTracker);
        }
        if (!tracker.has(dataSlideout)) {
          tracker.add(dataSlideout);
        }
        if (!dataSlideout.isAttached) {
          app.shell.add(dataSlideout, 'main');
        }
        dataSlideout.update();
        app.shell.activateById(dataSlideout.id);
      }
    });
    palette.addItem({ command, category: 'KBase Commands' });

    restorer.restore(tracker, {
      command,
      args: () => JSONExt.emptyObject,
      name: () => 'kbase'
    });

    let dataPanel: DataPanel = new DataPanel(app.commands, nbTracker);
    app.shell.add(dataPanel, 'left');
    tracker.add(dataPanel);

    console.log('JupyterLab extension kb-data-panel is activated!');
  }
};

export default extension;
