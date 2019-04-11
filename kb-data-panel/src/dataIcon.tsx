import * as React from 'react';

export interface IDataIconProps extends React.Props<DataIcon> {
    objType: string
}

export class DataIcon extends React.Component<IDataIconProps, {}> {
    render() {
        let objIcon = this.findIcon(this.props.objType);
        let iconClass = 'fa fa-stack-1x fa-inverse ' + objIcon;
        return (
            <div className="kb-card-icon fa-stack fa-2x" style={ {cursor: "pointer"} }>
                <i className="fa fa-circle fa-stack-2x" style={{color:"tomato"}}></i>
                <i className={iconClass}></i>
            </div>
        );
    }

    findIcon(objType: string): string {
        if (objType === 'Some_type') {
            return 'foo';
        }
        return 'fa-flag';
    }
}
