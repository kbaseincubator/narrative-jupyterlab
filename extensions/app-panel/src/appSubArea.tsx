import * as React from 'react';

export interface IAppSubAreaProps {
    subtitle: string,
    id: string,
}

export class AppSubArea extends React.Component<IAppSubAreaProps, {}> {
    render() {
        let app_link = "/#appcatalog/app/" + this.props.id + "/release";
        return (
            <div>
                <div className="kb-app-sub-area">
                    <div>{this.props.subtitle}</div>
                    <div><a target="_blank" href={app_link}>more...</a></div>
                </div>
            </div>
        );
    }
}
