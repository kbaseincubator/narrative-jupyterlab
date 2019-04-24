import * as React from 'react';

export interface IDataIconProps extends React.Props<DataIcon> {
    shape: string,
    icon: string,
    color: string
}

export class DataIcon extends React.Component<IDataIconProps, {}> {
    render() {
        let iconClass = 'fa fa-stack-1x fa-inverse ' + this.props.icon;
        let shapeClass = 'fa ' + this.props.shape + ' fa-stack-2x';
        return (
            <div className="kb-card-icon fa-stack fa-2x" style={ {cursor: "pointer"} }>
                <i className={shapeClass} style={{color:this.props.color}}></i>
                <i className={iconClass}></i>
            </div>
        );
    }
}
