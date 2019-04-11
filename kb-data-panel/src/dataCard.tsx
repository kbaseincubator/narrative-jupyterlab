import * as React from 'react';
import { WorkspaceObjectInfo } from './workspaceHelper';
import { DataIcon } from './dataIcon';

export interface IDataCardProps extends React.Props<DataCard> {
    objInfo: WorkspaceObjectInfo
}

export class DataCard extends React.Component<IDataCardProps, {}> {
    render() {
        // return (
        //     <div>{this.props.objInfo[0]} - {this.props.objInfo[1]}</div>
        // );
        let objInfo = this.props.objInfo;
        return (
            <div className="kb-data-card">
                <div className="kb-data-card-main">
                    <DataIcon objType={objInfo[2]} />
                    <div className="kb-data-card-info">
                        <div className="kb-data-card-name">
                            {objInfo[1]}
                            <span className="kb-data-card-version">v{objInfo[4]}</span>
                        </div>
                        <div className="kb-data-card-type">{objInfo[2]}</div>
                        <div className="kb-data-card-narrative"></div>
                        <div className="kb-data-card-date">Dec 10, 2018</div>
                        <div className="kb-data-card-edit-by"> </div>
                    </div>
                    <div className="kb-card-ellipsis">
                        <button className="btn btn-xs btn-default pull-right">
                            <span className="fa fa-ellipsis-h" color="#888"></span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
