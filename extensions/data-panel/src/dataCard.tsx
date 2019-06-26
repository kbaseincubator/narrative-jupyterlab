import * as React from 'react';
import { WorkspaceObjectInfo } from './workspaceHelper';
import { DataIcon } from './dataIcon';
import { TimeFormat } from '@kbase/narrative-utils';
import { Icon } from '@kbase/narrative-utils';
import { DataSubArea } from './dataSubArea';

export interface IDataCardProps extends React.Props<DataCard> {
    objInfo: WorkspaceObjectInfo,
    cb: Function
}

interface IDataCardState {
    isExpanded: boolean
};

export class DataCard extends React.Component<IDataCardProps, {}> {
    state: IDataCardState;

    constructor(props: IDataCardProps) {
        super(props);
        this.state = { isExpanded: false };
    }

    toggleSubArea = () => {
        this.setState((prevState: IDataCardState) => ({ isExpanded: !prevState.isExpanded }));
    }

    insertDataCell = () => {
        this.props.cb(this.props.objInfo[6], this.props.objInfo[0]);
    }

    render() {
        let objInfo = this.props.objInfo;
        let objType = objInfo[2].split('-')[0].split('.')[1];
        let iconInfo = Icon.getIconInfo(objType);
        let iconProps = {
            shape: 'fa-circle',
            icon: iconInfo.className,
            color: iconInfo.color
        }
        console.log('rendering');
        let subarea = null;
        if (this.state.isExpanded) {
            let subProps = {
                dataType: objInfo[2],
                upa: objInfo[6] + '/' + objInfo[0] + '/' + objInfo[4],
                metadata: objInfo[10]
            };
            subarea = <DataSubArea {...subProps}/>;
        }

        return (
            <div className="kb-data-card">
                <div className="kb-data-card-main">
                    <DataIcon {...iconProps} />
                    <div className="kb-data-card-info">
                        <div className="kb-data-card-name" onClick={this.insertDataCell}>
                            {objInfo[1]}
                            <span className="kb-data-card-version">v{objInfo[4]}</span>
                        </div>
                        <div className="kb-data-card-type">{objType}</div>
                        <div className="kb-data-card-narrative"></div>
                        <div className="kb-data-card-date">{TimeFormat.getTimeStampStr(objInfo[3], false)}
                            <span className="kb-data-card-edit-by"> by {objInfo[5]}</span>
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
