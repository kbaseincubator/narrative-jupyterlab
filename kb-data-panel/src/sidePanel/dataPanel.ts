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
    DataList
} from './dataList';

import {
    CommandRegistry
} from '@phosphor/commands';

export class DataPanel extends Widget {
    readonly _tracker: INotebookTracker;
    readonly commands: CommandRegistry;

    constructor(commands: CommandRegistry, nbTracker: INotebookTracker) {
        super();

        this.id = 'kb-data-panel';
        this.title.label = 'Data';
        this.title.closable = false;
        this.addClass('kb-dataPanel');

        this.commands = commands;

        this.toolbar = new Toolbar<Widget>();
        this._initToolbar();
        this.datalist = new DataList(null, nbTracker);

        let layout = new PanelLayout();
        layout.addWidget(this.toolbar);
        layout.addWidget(this.datalist);

        this.layout = layout;
        this._tracker = nbTracker;
        this._tracker.currentChanged.connect(
            this._onActiveNotebookPanelChanged,
            this
        );
        this._onActiveNotebookPanelChanged();
    }

    _initToolbar() : void {
        const refreshBtn = new ToolbarButton({
            iconClassName: 'fa fa-refresh',
            iconLabel: 'r',
            tooltip: 'Refresh',
            onClick: () => {
                this.refreshData();
            }
        });

        const addDataBtn = new ToolbarButton({
            iconClassName: 'fa fa-plus',
            iconLabel: 'a',
            tooltip: 'Add Data',
            onClick: () => {
                this.commands.execute('kbase:data-open');
            }
        });

        this.toolbar.addItem('refresh', refreshBtn);
        this.toolbar.addItem('addData', addDataBtn);
    }

    _onActiveNotebookPanelChanged() : void {
        let newWsId = null;
        if (this._tracker.currentWidget != null) {
            let path = this._tracker.currentWidget.context.path;
            let pathParts = path.split('.');
            newWsId = Number(pathParts[1]); // better formatting later.
        }
        this.datalist.changeWorkspace(newWsId);
    }

    refreshData() : void {
        this.datalist.refresh();
    }

    /**
     * The toolbar used by the data panel.
     */
    readonly toolbar: Toolbar<Widget>;

    readonly datalist: DataList;
}
