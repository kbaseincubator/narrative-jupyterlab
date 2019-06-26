import * as React from 'react';

export interface IAppIconProps extends React.Props<AppIcon> {
    icon_url: string
}

export class AppIcon extends React.Component<IAppIconProps, {}> {

    render() {
        if (this.props.icon_url == null){
            let shapeClass = 'fa fa-square fa-stack-2x method-icon';
            let iconClass = 'fa fa-stack-1x fa-inverse fa-cube';
            let color = 'rgb(103, 58, 183)';
            return(
                <div className="kb-app-card-icon">
                    <div className="fa-stack fa-2x" style={{cursor: "pointer"}}>
                        <i className={shapeClass} style={{color: color}}></i>
                        <i className={iconClass}></i>
                    </div>
                </div>
            );
        }

        //TODO: fetch nms_link via NarrativeSerivce dynamically
        let nms_link = "https://ci.kbase.us/services/narrative_method_store/"
        let fetch_icon_url = nms_link + this.props.icon_url;
        return (
            <div className="kb-app-card-icon"><img src={fetch_icon_url} style={{cursor: "pointer", maxWidth: "50px", maxHeight: "50px"}}></img>
            </div>
        );
    }
}
