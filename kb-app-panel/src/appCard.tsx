

import * as React from 'react';
import { AppObjectInfo } from './appObjectInfoHelper';
import { AppSubArea } from './appSubArea';
import { AppIcon } from './appIcon';

export interface IAppCardProps extends React.Props<AppCard> {
    info: AppObjectInfo,
    favorite: number,
    cb: Function
}

interface IAppCardState {
    isExpanded: boolean
};

export class AppCard extends React.Component<IAppCardProps, {}> {

    state: IAppCardState;

    constructor(props: IAppCardProps) {
        super(props);
        this.state = { isExpanded: false };
    }

    toggleSubArea = () => {
        this.setState((prevState: IAppCardState) => ({ isExpanded: !prevState.isExpanded }));
    }

    insertAppCell = () => {
        this.props.cb(this.props.info);
    }

    render() {

        let info = this.props.info;
        // let favorite = this.props.favorite;
        console.log(info);

        let icon_url = null;
        if ( info.hasOwnProperty('icon') ) {
            icon_url = info.icon.url
        }
        let iconProps = {
            icon_url: icon_url
        }

        let subarea = null;
        if (this.state.isExpanded) {
            let subProps = {
                subtitle: info.subtitle,
                id: info.id
            };
            subarea = <AppSubArea {...subProps}/>;
        }
        let module_link = "/#appcatalog/module/" + info.module_name;
        return (
            <div className="kb-app-card">
                <div className="kb-app-card-main">
                    <AppIcon {...iconProps} />
                    <div className="kb-app-card-info">
                        <div className="kb-app-card-name" onClick={this.insertAppCell}>{info.name}</div>
                        <div className="narrative-data-list-subcontent">
                            <span><i className="fa fa-star kbcb-star-default kbcb-star-favorite" data-original-title="" title="">&nbsp;</i></span>
                            <span className="kb-app-card-module-link"><a href={module_link} target="_blank">{info.module_name}</a>
                                <span className="kb-app-card-version">v{info.ver}</span>
                            </span>
                        </div>
                    </div>
                    <div className="kb-card-ellipsis">
                        <button onClick={this.toggleSubArea}>
                            <span className="fa fa-ellipsis-h" color="#888"></span>
                        </button>
                    </div>
                </div>
                {subarea}
            </div>
        );
    }
}
