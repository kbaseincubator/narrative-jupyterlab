import {
    Widget
} from '@phosphor/widgets';

import {
    Auth, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';

import {
    INotebookTracker,
    NotebookActions
} from '@jupyterlab/notebook';

import { CodeCell } from '@jupyterlab/cells';

import { AppCard } from './appCard';

import { AppObjectInfo } from './appObjectInfoHelper';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class AppList extends Widget {
    private currentTag: string;
    private userId: string;
    private nbTracker: INotebookTracker;

    constructor(tracker: INotebookTracker) {
        super();
        this.nbTracker = tracker;
        this.addClass('kb-appPanel-list');
        this.refresh();
    }

    refresh() {
        //TODO: change tag from upper class
        this.currentTag = 'release';
        //TODO: get userID from narrative-utils.Auth()
        this.userId = 'tgu2';

        let auth = new Auth();
        let narrService = new KBaseDynamicServiceClient({
            module: 'NarrativeService',
            authToken: auth.token
        });

        narrService
            .call('get_all_app_info', [{
                'tag': this.currentTag,
                'user': this.userId
            }])
            .then((appInfo: any) => {
                this.renderData(appInfo.app_infos, appInfo.module_versions);
            })
            .catch(this.handleRefreshError);
    }

    handleRefreshError(err: any) {
        console.error(err);
    }

    renderData(appInfos: {[app_id: string]: {info: AppObjectInfo, favorite: number}},
               moduleVersions: {[module_name: string]: string}) {
        if (!appInfos) {
            //TODO: needs better error handling, maybe retry calling get_all_app_info?
            ReactDOM.render(
                <div>No apps available</div>,
                this.node
            );
            return;
        }

        const appCards = Object.keys(appInfos).map(key => {

            let app_info = appInfos[key];
            let info = app_info.info;
            let app_id = info.id;
            let favorite = app_info.favorite;

            return <AppCard info={info} favorite={favorite} key={app_id} cb={this.insertAppCell.bind(this)}/>;
        });

        ReactDOM.render(
            appCards,
            this.node
        );
    }

    build_cell_text(app_id: string) {
        let cell_text: string = "TEST APP\n";
        cell_text += "from biokbase.narrative.jobs.appmanager import AppManager\n";
        cell_text += `AppManager().run_app(\n"${app_id}"\n)\n`;

        return cell_text;
    }

    insertAppCell(app_id: string) {
        // const context = this.nbTracker.currentWidget.context;
        const current = this.nbTracker.currentWidget;
        const { context, content, /*contentFactory*/ } = current;

        NotebookActions.insertBelow(content);
        const curCell = this.nbTracker.activeCell as CodeCell;
        curCell.model.value.text = this.build_cell_text(app_id);
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

         console.log('app cell inserted?');
    }
}
