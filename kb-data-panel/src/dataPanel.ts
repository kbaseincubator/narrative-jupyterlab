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

export class DataPanel extends Widget {
    private _tracker: INotebookTracker;

    constructor(nbTracker: INotebookTracker) {
        super();

        this.id = 'kb-data-panel';
        this.title.label = 'Data';
        this.title.closable = false;
        this.addClass('kb-dataPanel');

        this.toolbar = new Toolbar<Widget>();
        const refreshBtn = new ToolbarButton({
            iconClassName: 'fa fa-refresh',
            iconLabel: 'r',
            tooltip: 'refresh',
            onClick: () => {
                this.refreshData();
            }
        });

        this.toolbar.addItem('refresh', refreshBtn);
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
