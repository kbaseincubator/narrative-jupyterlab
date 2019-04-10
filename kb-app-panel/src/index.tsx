import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';
import { Widget } from '@phosphor/widgets';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IAppPanel, AppPanelModel } from './appPanel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../style/index.css';

class AppPanelWidget extends Widget {

  constructor(options: Widget.IOptions) {
    super(options);

    this.id = 'kb-app-panel';
    this.title.label = 'Apps';
    this.title.closable = false;
    this.addClass('kb-appPanel');
    console.log("trying to render app panel");

    ReactDOM.render(<div>wat</div>, this.node);
    console.log("done?");
  }
}

function activate(
  app: JupyterLab,
  palette: ICommandPalette
): IAppPanel {
  const model = new AppPanelModel();
  let appPanel = new AppPanelWidget({});
  app.shell.addToLeftArea(appPanel);
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
