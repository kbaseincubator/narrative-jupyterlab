import { UseSignal, ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';
import { JSONValue } from '@phosphor/coreutils';
import { ISignal } from '@phosphor/signaling';
import { IObservableMap } from '@jupyterlab/observables';

const KB_WIDGET_CLASS = 'kb-cell-widget';

interface IKBaseCellWidgetProps {
    updateSignal: ISignal<any, boolean>,
    kbaseMetadata: IObservableMap<JSONValue>
}

export interface IKBaseAppCellProps extends IKBaseCellWidgetProps {

}

abstract class KBaseCellWidget extends ReactWidget {
    constructor(protected props: IKBaseCellWidgetProps) {
        super();
        this.addClass(KB_WIDGET_CLASS);
    }

    abstract updateModel(): void;
    abstract render(): React.ReactElement<any>;
}

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
