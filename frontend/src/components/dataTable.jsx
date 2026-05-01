

function DataTable({ columns, data, emptyMessage = 'No records found.' }) {
    if (!data || data.length === 0) {
        return <p>{emptyMessage}</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        {columns.map((column) => (
                            <td key={column.key}>
                                {column.render ? column.render(row) : row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DataTable;