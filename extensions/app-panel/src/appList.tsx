import {
    Widget
} from '@phosphor/widgets';

import {
    Auth,
    KBaseDynamicServiceClient,
    IAppCellMetadata
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
import { JSONObject } from '@phosphor/coreutils';

import { v4 as uuidv4 } from 'uuid';

export class AppList extends Widget {

    private nbTracker: INotebookTracker;
    private currentTag: string;

    constructor(tracker: INotebookTracker, currentTag: string) {
        super();
        this.nbTracker = tracker;
        this.addClass('kb-appPanel-list');
        this.refresh(currentTag);
    }

    refresh(currentTag: string) {

        let auth = new Auth();

        auth.getTokenInfo(auth.token)
            .then(result => {
                this.getAppInfo(result.user, currentTag, auth.token);
            })
            .catch(this.handleRefreshError);
    }

    getAppInfo(userId: string, currentTag: string, token: string) {
        console.log('tag and user:');
        console.log(currentTag);
        console.log(userId);

        let narrService = new KBaseDynamicServiceClient({
            module: 'NarrativeService',
            authToken: token
        });

        narrService
            .call('get_all_app_info', [{
                'tag': currentTag,
                'user': userId
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
        curCell.model.metadata.set('kbase', this.newAppCellMetadata(appInfo) as unknown as JSONObject);
    }

    // TODO: make a type for app cell metadata
    newAppCellMetadata(appInfo: AppObjectInfo): IAppCellMetadata {
        const curDate: Date = new Date();
        const nowMs: number = curDate.getTime();
        let metadata = {
            appCell: {
                app: {
                    gitCommitHash: appInfo.git_commit_hash,
                    id: appInfo.id,
                    tag: this.currentTag,
                    version: appInfo.ver
                },
                fsm: {
                    currentState: {
                    }
                },
                outdated: false
            },
            attributes: {
                created: nowMs,
                id: uuidv4(),
                info: {
                    label: 'more...',
                    url: '/#appcatalog/app/' + appInfo.id + '/' + this.currentTag,
                    lastLoaded: nowMs,
                    status: 'new',
                    subtitle: appInfo.subtitle,
                    title: appInfo.name
                }
            },
            cellState: {
                minimized: true
            },
            userSettings: {
                showCodeInputArea: false
            },
            type: 'app'
        };
        return metadata;
    }
}
