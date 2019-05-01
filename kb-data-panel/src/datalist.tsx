import {
    Widget
} from '@phosphor/widgets';
import {
    Auth, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';
import { WorkspaceObjectInfo } from './workspaceHelper';
import { DataCard } from './dataCard';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { CodeCell } from '@jupyterlab/cells';


export class DataList extends Widget {
    private curWsId: number;
    private nbTracker: INotebookTracker;

    constructor(wsId: number, tracker: INotebookTracker) {
        super();
        this.curWsId = wsId;
        this.nbTracker = tracker;
        this.addClass('kb-dataPanel-list');
        this.refresh();
    }

    refresh() {
        if (this.curWsId) {
            let auth = new Auth();
            let narrService = new KBaseDynamicServiceClient({
                module: 'NarrativeService',
                authToken: auth.token
            });
            narrService
                .call('list_objects_with_sets', [{
                    'ws_id': this.curWsId,
                    'includeMetadata': 1
                }])
                .then((data: any) => {
                    this.renderData(data.data);
                })
                .catch(this.handleRefreshError);
        }
        else {
            this.renderData(null);
        }
    }

    changeWorkspace(wsId: number): void {
        this.curWsId = wsId;
        this.refresh();
    }

    renderData(data: Array<{object_info: WorkspaceObjectInfo}>) {
        if (!data) {
            ReactDOM.render(
                <div>No data available or no Narrative selected</div>,
                this.node
            );
            return;
        }
        const dataCards = data.map(obj => {
            let info = obj.object_info;
            let upa = info[6] + '/' + info[0] + '/' + info[4];
            return <DataCard objInfo={info} key={upa} cb={this.insertDataCell.bind(this)}/>;
        });
        ReactDOM.render(
            dataCards,
            this.node
        );
    }

    insertDataCell(wsId: number, objId: number) {
        console.log(wsId + '/' + objId);
        // const context = this.nbTracker.currentWidget.context;
        const current = this.nbTracker.currentWidget;
        // current.
        const { context, content } = current;

        NotebookActions.insertBelow(content);
        const curCell = this.nbTracker.activeCell as CodeCell;
        curCell.model.value.text = wsId + '/' + objId;
        CodeCell.execute(curCell, context.session);
        // const model = context.model;
        // const cell = model.contentFactory.createCodeCell({});
        // cell.value.text = wsId + '/' + objId;

        // model.cells.insert(0, cell);
        // cell.
        // const curCell = this.nbTracker.activeCell as CodeCell;
        // CodeCell.execute(curCell, context.session);

        console.log('cell inserted?');
    }

    handleRefreshError(err: any) {
        console.error(err);
    }
}
