import {
    Widget
} from '@phosphor/widgets';

import {
    GenericClient
} from './genericClient';

export class DataList extends Widget {
    constructor() {
        super();
        this.addClass('kb-dataPanel-list');
    }

    refresh() {
        let ws = new GenericClient({
            url: 'https://ci.kbase.us/services/ws',
            module: 'Workspace',
            token: 'foo'
        });
        alert(ws);
    }
}
