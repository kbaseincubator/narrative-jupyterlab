import { KBaseCellWidget, IKBaseCellWidgetProps } from './kbaseCellWidget';
import React = require('react');

export class KBaseCodeCellWidget extends KBaseCellWidget {
    constructor(protected props: IKBaseCellWidgetProps) {
        super(props);
    }

    updateModel(): void {
        // no op
    };
    render(): React.ReactElement<any> {
        return (<div></div>);
    }
}

