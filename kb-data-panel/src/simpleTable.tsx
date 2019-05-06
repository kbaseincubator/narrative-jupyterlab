import * as React from 'react';

export interface ISimpleTableProps {
    rows: string[][]
}

export class SimpleTable extends React.Component<ISimpleTableProps, {}> {
    render() {
        let rowElems = this.props.rows.map(row =>
            <tr><th>{row[0]}</th><td>{row[1]}</td></tr>
        );
        return (
            <table className='kb-simple-table'>{rowElems}</table>
        );
    }
}
