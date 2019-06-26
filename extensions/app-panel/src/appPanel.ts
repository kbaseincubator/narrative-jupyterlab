
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

    private currentTag: string;

    constructor(nbTracker: INotebookTracker) {
        super();

        this.id = 'kb-app-panel';
        this.title.label = 'Apps';
        this.title.closable = false;
        this.addClass('kb-appPanel');
        this.currentTag = 'release';

        this.toolbar = new Toolbar<Widget>();
        let refreshBtn = new ToolbarButton({
            iconClassName: 'fa fa-refresh',
            iconLabel: 'r',
            tooltip: 'Refresh app/method listings',
            onClick: () => {
                this.refreshApp(this.currentTag);
            }
        });

        let versionBtn = new ToolbarButton({
            label: 'R',
            tooltip: 'Toggle between Release/Beta/Dev versions',
            onClick: () => {
                //TODO: update button icon on click
                this.update_tag();
                this.refreshApp(this.currentTag);
            }
        });

        this.toolbar.addItem('refresh', refreshBtn);
        this.toolbar.addItem('version', versionBtn);
        this.applist = new AppList(nbTracker, this.currentTag);

        let layout = new PanelLayout();
        layout.addWidget(this.toolbar);
        layout.addWidget(this.applist);

        this.layout = layout;
    }

    update_tag() : void {
        if (this.currentTag == 'release') {
            this.currentTag = 'beta';
        } else if (this.currentTag == 'beta') {
            this.currentTag = 'dev';
        } else if (this.currentTag == 'dev') {
            this.currentTag = 'release';
        }
    }

    refreshApp(currentTag: string) : void {
        this.applist.refresh(currentTag);
    }

    readonly toolbar: Toolbar<Widget>;
    readonly applist: AppList;
}
