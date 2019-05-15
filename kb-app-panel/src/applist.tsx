import {
    Widget
} from '@phosphor/widgets';

import {
    Auth, KBaseDynamicServiceClient
} from '@kbase/narrative-utils';


export class AppList extends Widget {
    private currentTag: string;
    private userId: string;

    constructor() {
        super();
        this.addClass('kb-appPanel-list');
        this.refresh();
    }

    refresh() {
        this.currentTag = 'release';
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
                console.log(appInfo.app_infos);
                console.log(appInfo.module_versions);
            })
            .catch(this.handleRefreshError);
    }

    handleRefreshError(err: any) {
        console.error(err);
    }
}
