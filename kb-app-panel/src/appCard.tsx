

import * as React from 'react';
import { AppObjectInfo } from './appObjectInfoHelper';

export interface IAppCardProps extends React.Props<AppCard> {
    info: AppObjectInfo,
    favorite: number
}

interface IDataCardState {
    isExpanded: boolean
};

export class AppCard extends React.Component<IAppCardProps, {}> {

    state: IDataCardState;

    constructor(props: IAppCardProps) {
        super(props);
        this.state = { isExpanded: false };
    }

    render() {

        let info = this.props.info;
        // let favorite = this.props.favorite;

        return (
            <div>{info.id}</div>
        );
    }
}
