import * as React from 'react';
import { WorkspaceObjectInfo } from './workspaceHelper';

export interface IDataCardProps extends React.Props<DataCard> {
    objInfo: WorkspaceObjectInfo
}

export class DataCard extends React.Component<IDataCardProps, {}> {
    render() {
        return (
            <div>{this.props.objInfo[0]} - {this.props.objInfo[1]}</div>
        );
    }
}
