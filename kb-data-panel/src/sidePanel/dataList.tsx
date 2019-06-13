import {
    Widget
} from '@phosphor/widgets';
import {
    Auth, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';
import { WorkspaceObjectInfo } from '../workspaceHelper';
import { DataCard } from '../dataCard';
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

    async refresh() {
        let data = null;
        if (this.curWsId) {
            let auth = new Auth();
            let narrService = new KBaseDynamicServiceClient({
                module: 'NarrativeService',
                authToken: auth.token
            });
            try {
                data = await narrService.call('list_objects_with_sets', [{ ws_id: this.curWsId, includeMetadata: 1 }]);
                data = data.data;
            }
            catch (error) {
                this.handleRefreshError(error);
            }
        }
        this.renderData(data);
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
        const { context, content } = this.nbTracker.currentWidget;

        NotebookActions.insertBelow(content);
        const curCell = this.nbTracker.activeCell as CodeCell;
        curCell.model.value.text = wsId + '/' + objId;
        curCell.model.metadata.set('kbase', {'foo': 'bar'});
        curCell.initializeState();
        CodeCell.execute(curCell, context.session);
    }

    handleRefreshError(err: any) {
        console.error(err);
    }
}
