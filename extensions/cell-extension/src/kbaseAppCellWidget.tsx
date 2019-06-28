import { KBaseCellWidget, IKBaseCellWidgetProps } from './kbaseCellWidget';
import React = require('react');
import { UseSignal } from '@jupyterlab/apputils';
import { IAppCellMetadata } from '@kbase/narrative-utils';

export interface IKBaseAppCellProps extends IKBaseCellWidgetProps {

}

/**
 * The App Cell widget. Probably the most complex cell widget.
 */
export class KBaseAppCellWidget extends KBaseCellWidget {
    constructor(protected props: IKBaseAppCellProps) {
        super(props);
    }

    render(): React.ReactElement<any> {
        return (
            <UseSignal
             signal={this.props.updateSignal}
             shouldUpdate={(sender, arg) => arg}
            >
                {() => <KBaseAppCellComponent {...this.props.kbaseMetadata.get('kbase') as unknown as IAppCellMetadata} />}
            </UseSignal>
        );
    }

    updateModel(): void {
        this.render();      // probably do something smarter, eventually
    }
}

export namespace AppCellComponent {
    export interface IProps extends IAppCellMetadata {}

    export interface IHeaderProps {
        title: string;
        subtitle: string;
        icon: string;
    }
}

function KBaseAppCellComponent(props: AppCellComponent.IProps) {
    const headerProps = {
        title: props.attributes.info.title,
        subtitle: props.attributes.info.subtitle,
        icon: props.appCell.app.iconUrl
    };
    return (
        <AppCellHeader {...headerProps} />
    );
}

function AppCellHeader(props: AppCellComponent.IHeaderProps) {
    return (
        <div className="kb-app-header-container">
            <div className="kb-app-header-title">
                <AppIcon {...{iconUrl: props.icon}}></AppIcon>
                <div className="kb-app-header-title-text">
                    <div className="title">{props.title}</div>
                    <div className="subtitle">{props.subtitle}</div>
                </div>
            </div>
        </div>
    )
}

function AppIcon(props: { iconUrl: string }) {
    if (props.iconUrl === null){
        const shapeClass = 'fa fa-square fa-stack-2x method-icon';
        const iconClass = 'fa fa-stack-1x fa-inverse fa-cube';
        const color = 'rgb(103, 58, 183)';
        return(
            <div className="kb-app-header-icon">
                <div className="fa-stack fa-2x" style={{cursor: "pointer"}}>
                    <i className={shapeClass} style={{color: color}}></i>
                    <i className={iconClass}></i>
                </div>
            </div>
        );
    }

    //TODO: fetch nms_link via NarrativeSerivce dynamically
    const nmsUrl = 'https://ci.kbase.us/services/narrative_method_store/'
    const appIconUrl = nmsUrl + props.iconUrl;
    return (
        <div className="kb-app-header-icon">
            <img src={appIconUrl} style={{maxWidth: '50px', maxHeight: '50px'}} />
        </div>
    );
}
