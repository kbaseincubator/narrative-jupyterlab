import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';
import { Widget } from '@phosphor/widgets';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IAppPanel, AppPanelModel, AppPanel } from './appPanel';

import '../style/index.css';

class AppPanelWidget extends Widget {

  constructor(options: Widget.IOptions) {
    super(options);

    this.id = 'kb-data-panel';
    this.title.label = 'Data';
    this.title.closable = false;
    this.addClass('kb-dataPanel');

    let appPanel = new AppPanel({

    });
  }
}

function activate(
  app: JupyterLab,
  palette: ICommandPalette
): IAppPanel {
  const model = new AppPanelModel();

  return model;
}

// : (app: JupyterLab) => {
//   console.log('JupyterLab extension kb-app-panel is activated!');
// }
/**
 * Initialization data for the kb-app-panel extension.
 */
const extension: JupyterLabPlugin<IAppPanel> = {
  activate,
  id: 'kb-app-panel',
  autoStart: true,
};

export default extension;
