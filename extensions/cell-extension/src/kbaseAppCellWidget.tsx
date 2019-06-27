import { KBaseCellWidget, IKBaseCellWidgetProps } from './kbaseCellWidget';
import React = require('react');
import { UseSignal } from '@jupyterlab/apputils';

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
                {() => <KBaseAppCellComponent {...this.props.kbaseMetadata.get('kbase')} />}
            </UseSignal>
        );
    }

    updateModel(): void {
        this.render();
    }
}

export namespace AppCellComponent {
    export interface IProps {
    }
}

function KBaseAppCellComponent(props: AppCellComponent.IProps) {
    return (<div>{JSON.stringify(props)}</div>)
}
