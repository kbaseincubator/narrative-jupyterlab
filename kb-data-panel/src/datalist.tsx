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


export class DataList extends Widget {
    private curWsId: number;

    constructor(wsId: number) {
        super();
        this.curWsId = wsId;
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
            return <DataCard objInfo={info} key={upa}/>;
        });
        data.forEach(obj => {
            ReactDOM.render(
                dataCards,
                this.node
            );
        });
    }

    handleRefreshError(err: any) {
        console.error(err);
    }
}
