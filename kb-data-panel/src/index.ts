import {
  JupyterLab,
  JupyterLabPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import {
  Toolbar,
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  Widget, PanelLayout
} from '@phosphor/widgets';

import {
  DataList
} from './datalist';

import '../style/index.css';
import { ICommandPalette } from '@jupyterlab/apputils';

class DataPanel extends Widget {
  constructor() {
    super();

    this.id = 'kb-data-panel';
    this.title.label = 'Data';
    this.title.closable = false;
    this.addClass('kb-dataPanel');

    this.toolbar = new Toolbar<Widget>();
    let refreshBtn = new ToolbarButton({
      iconClassName: 'fa fa-refresh',
      iconLabel: 'r',
      tooltip: 'refresh',
      onClick: () => {
        this.refreshData();
      }
    });

    this.toolbar.addItem('refresh', refreshBtn);

    this.datalist = new DataList();

    let layout = new PanelLayout();
    layout.addWidget(this.toolbar);
    layout.addWidget(this.datalist);

    this.layout = layout;

  }

  refreshData() {
    this.datalist.refresh();
  }

  /**
   * The toolbar used by the data panel.
   */
  readonly toolbar: Toolbar<Widget>;

  readonly datalist: DataList;
}

/**
 * Initialization data for the kb-data-panel extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'kb-data-panel',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: (app: JupyterLab,
             palette: ICommandPalette,
             restorer: ILayoutRestorer) => {

    let dataPanel: DataPanel = new DataPanel();
    app.shell.addToLeftArea(dataPanel);

    console.log('JupyterLab extension kb-data-panel is activated!');
  }
};

export default extension;
