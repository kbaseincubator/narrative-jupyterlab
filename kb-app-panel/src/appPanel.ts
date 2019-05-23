
import {
    INotebookTracker
} from '@jupyterlab/notebook';

import {
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

export class AppPanel extends Widget {
    // private _tracker: INotebookTracker;

    constructor(nbTracker: INotebookTracker) {
        super();

        this.id = 'kb-app-panel';
        this.title.label = 'Apps';
        this.title.closable = false;
        this.addClass('kb-appPanel');

        this.toolbar = new Toolbar<Widget>();
        let refreshBtn = new ToolbarButton({
            iconClassName: 'fa fa-refresh',
            iconLabel: 'r',
            tooltip: 'Refresh app/method listings',
            onClick: () => {
                this.refreshApp();
            }
        });

        let versionBtn = new ToolbarButton({
            // iconClassName: 'btn btn-xs btn-default',
            // iconLabel: 'r',
            label: 'R',
            tooltip: 'Toggle between Release/Beta/Dev versions',
            onClick: () => {
            // versionBtn.lable = 'B';
                this.refreshApp();
            }
        });

        this.toolbar.addItem('refresh', refreshBtn);
        this.toolbar.addItem('version', versionBtn);
        this.applist = new AppList(nbTracker);

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
