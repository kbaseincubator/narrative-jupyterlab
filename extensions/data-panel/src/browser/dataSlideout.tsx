import {
    Widget
} from '@phosphor/widgets';

import {
    INotebookTracker
} from '@jupyterlab/notebook';

import {
    Message
} from '@phosphor/messaging';

import {
    Auth //, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';


export class DataSlideout extends Widget {
    private _tracker : INotebookTracker;
    private curWsId : Number;
    readonly testDiv: HTMLDivElement;

    constructor(nbTracker: INotebookTracker) {
        super();
        this.id = 'kbase-dataSlideout';
        this.title.label = 'KBase Data Browser';
        this.title.closable = true;

        let div = document.createElement('div');
        div.innerText = 'Data stuff goes here.';
        this.node.appendChild(div);

        this.testDiv = document.createElement('div');
        this.node.appendChild(this.testDiv);

        this._tracker = nbTracker;
        this._tracker.currentChanged.connect(
            this._onActiveNotebookPanelChanged,
            this
        );
        this._onActiveNotebookPanelChanged();
    }

    _onActiveNotebookPanelChanged() : void {
        if (this._tracker.currentWidget != null) {
            let path = this._tracker.currentWidget.context.path;
            let pathParts = path.split('.');
            this.curWsId = Number(pathParts[1]); // better formatting later.
            this.update();
        }
    }

    onUpdateRequest(msg: Message): void {
        this.testDiv.innerText = String(this.curWsId);

        let auth = new Auth();
        auth.getTokenInfo(auth.token)
            .then(info => {
                console.log(info);
            });

    }
}
