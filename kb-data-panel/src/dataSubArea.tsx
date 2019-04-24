import * as React from 'react';
import { SimpleTable } from './simpleTable';

export interface IDataSubAreaProps {
    dataType: string,
    upa: string,
    metadata: {[key: string]: string}
}

export class DataSubArea extends React.Component<IDataSubAreaProps, {}> {
    render() {
        let rows = [[
            'Permanent Id', this.props.upa
        ], [
            'Full Type', this.props.dataType
        ]];
        Object.keys(this.props.metadata).forEach(key => {
            rows.push([key, this.props.metadata[key]]);
        });

        let tableProps = {
            rows: rows
        };
        return (
            <div>
                <div>buttons</div>
                <SimpleTable {...tableProps} />
            </div>
        );
    }
}
