import {
    Widget
} from '@phosphor/widgets';

import {
    Auth, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';

import { AppCard } from './appCard';

import { AppObjectInfo } from './appObjectInfoHelper';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class AppList extends Widget {
    private currentTag: string;
    private userId: string;

    constructor() {
        super();
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

            return <AppCard info={info} favorite={favorite} key={app_id}/>;
        });

        ReactDOM.render(
            appCards,
            this.node
        );
    }
}
