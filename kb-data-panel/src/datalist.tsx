import {
    Widget
} from '@phosphor/widgets';

import {
    Auth, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';
import { WorkspaceObjectInfo } from './workspaceHelper';
// import { DataCard } from './dataCard';

export class DataList extends Widget {
    constructor() {
        super();
        this.addClass('kb-dataPanel-list');
        this.refresh();
    }

    refresh() {
        let auth = new Auth();
        let narrService = new KBaseDynamicServiceClient({
            module: 'NarrativeService',
            authToken: auth.token
        });
        narrService
            .call('list_objects_with_sets', [{
                'ws_id': 10292,
                'includeMetadata': 1
            }])
            .then((data) => {
                this.renderData(data.data);
            })
            .catch(this.handleRefreshError);
    }

    renderData(data: Array<{object_info: WorkspaceObjectInfo}>) {
        console.log(data);
        data.forEach(obj => {
            let elem = document.createElement('div');
            elem.innerText = obj.object_info[1];
            this.node.appendChild(elem);
            // ReactDOM.render(
            //     <DataCard objInfo={obj.object_info} />, this.node
            // );
            // this.node.appendChild(DataCard(obj.object_info));
        });
    }

    handleRefreshError(err: any) {
        console.error(err);
    }
}
