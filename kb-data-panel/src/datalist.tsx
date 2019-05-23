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
import { INotebookTracker, NotebookActions, /*Notebook*/ } from '@jupyterlab/notebook';
import { CodeCell, /*CodeCellModel*/ } from '@jupyterlab/cells';


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
        const { context, content, /*contentFactory*/ } = current;

        NotebookActions.insertBelow(content);
        const curCell = this.nbTracker.activeCell as CodeCell;
        curCell.model.value.text = wsId + '/' + objId;
        curCell.model.metadata.set('kbase', {'foo': 'bar'});
        CodeCell.execute(curCell, context.session);

        /* Order of ops
         * 1. Set up metadata.
         * 2. Create cell with metadata (content factory will make a "viewer" cell)
         *   a. Auto-create code
         *   b. Other metadata as necessary
         * 3. Execute it
         *
         */
        // const cellModel = new CodeCellModel({});
        // cellModel.metadata.set('kbase', {'foo': 'bar'});
        // const cellOptions = { cellModel, contentFactory };

        // const model = context.model;
        // const cell = model.contentFactory.createCodeCell(cellOptions);

        // const curCell = this.nbTracker.activeCell;
        // model.cells.insert(0, cell);
        // cell.value.text = wsId + '/' + objId;
        // const curCell = this.nbTracker.activeCell as CodeCell;
        // CodeCell.execute(curCell, context.session);

        console.log('cell inserted?');
    }

    handleRefreshError(err: any) {
        console.error(err);
    }
}
