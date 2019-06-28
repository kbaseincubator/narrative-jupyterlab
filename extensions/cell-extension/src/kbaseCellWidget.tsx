import { ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';
import { JSONValue } from '@phosphor/coreutils';
import { ISignal } from '@phosphor/signaling';
import { IObservableMap } from '@jupyterlab/observables';

const KB_WIDGET_CLASS = 'kb-cell-widget';

export interface IKBaseCellWidgetProps {
    updateSignal: ISignal<any, boolean>,
    kbaseMetadata: IObservableMap<JSONValue>
}


/**
 * Abstract class for the various KBase cell widgets.
 * They all need to respond to updates on the model, and they all need to know how to
 * render themselves.
 */
export abstract class KBaseCellWidget extends ReactWidget {
    constructor(protected props: IKBaseCellWidgetProps) {
        super();
        this.addClass(KB_WIDGET_CLASS);
    }

    abstract updateModel(): void;
    abstract render(): React.ReactElement<any>;
}

