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

    insertAppCell(appInfo: AppObjectInfo) {
        // const context = this.nbTracker.currentWidget.context;
        const current = this.nbTracker.currentWidget;

        NotebookActions.insertBelow(current.content);
        const curCell = this.nbTracker.activeCell as CodeCell;
        curCell.model.metadata.set('kbase', this.newAppCellMetadata(appInfo));
    }

    // TODO: make a type for app cell metadata
    newAppCellMetadata(appInfo: AppObjectInfo): any {
        const now: string = new Date().toDateString();
        let metadata = {
            appCell: {
                app: {
                    gitCommitHash: appInfo.git_commit_hash,
                    id: appInfo.id,
                    tag: this.currentTag,
                    version: appInfo.ver
                },
            },
            attributes: {
                created: now,
                id: '12345', // TODO: gen UUID4
                info: {
                    label: 'more...',
                    url: '/#appcatalog/app/' + appInfo.id + '/' + this.currentTag,
                    lastLoaded: now,
                    status: 'new',
                    subtitle: appInfo.subtitle,
                    title: appInfo.name
                }
            },
            cellState: {
                minimized: true,
                showCodeInputArea: false
            },
            type: 'app'
        };
        return metadata;
    }
}
