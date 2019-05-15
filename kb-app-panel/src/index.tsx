import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette,
  Toolbar,
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  Widget,
  PanelLayout
} from '@phosphor/widgets';

import {
  AppList
} from './appList';

import '../style/index.css';

class AppPanelWidget extends Widget {

  constructor(options: Widget.IOptions) {
    super(options);

    this.id = 'kb-app-panel';
    this.title.label = 'Apps';
    this.title.closable = false;
    this.addClass('kb-appPanel');
    this.toolbar = new Toolbar<Widget>();
    let refreshBtn = new ToolbarButton({
      iconClassName: 'fa fa-refresh',
      iconLabel: 'r',
      tooltip: 'refresh',
      onClick: () => {
        this.refreshApp();
      }
    });

    this.toolbar.addItem('refresh', refreshBtn);
    this.applist = new AppList();

    let layout = new PanelLayout();
    layout.addWidget(this.toolbar);
    layout.addWidget(this.applist);

    this.layout = layout;
  }

  refreshApp() : void {
    this.applist.refresh();
  }

  readonly toolbar: Toolbar<Widget>;
  readonly applist: AppList;
}

/**
 * Initialization data for the kb-app-panel extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'kb-app-panel',
  autoStart: true,
  activate: (app: JupyterFrontEnd,
             palette: ICommandPalette) => {
    let appPanel: AppPanelWidget = new AppPanelWidget({});
    app.shell.add(appPanel, 'left');

    console.log('JupyterLab extension kb-app-panel is activated!');
  }
};

export default extension;
