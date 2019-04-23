import * as React from 'react';
import { WorkspaceObjectInfo } from './workspaceHelper';
import { DataIcon } from './dataIcon';
import { TimeFormat } from '@kbase/narrative-utils';

export interface IDataCardProps extends React.Props<DataCard> {
    objInfo: WorkspaceObjectInfo
}

export class DataCard extends React.Component<IDataCardProps, {}> {
    render() {
        let objInfo = this.props.objInfo;
        let objType = objInfo[2].split('-')[0].split('.')[1];
        return (
            <div className="kb-data-card">
                <div className="kb-data-card-main">
                    <DataIcon objType={objInfo[2]} />
                    <div className="kb-data-card-info">
                        <div className="kb-data-card-name">
                            {objInfo[1]}
                            <span className="kb-data-card-version">v{objInfo[4]}</span>
                        </div>
                        <div className="kb-data-card-type">{objType}</div>
                        <div className="kb-data-card-narrative"></div>
                        <div className="kb-data-card-date">{TimeFormat.getTimeStampStr(objInfo[3], false)}</div>
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
