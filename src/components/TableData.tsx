import Table, { TableProps } from "@/components/Table";

type TableDataProps = {
    title: string,
    index: number,
    activeIndex: number,
    columns: TableProps<{}>['columns'],
    updateData: Function,
    activeTableData: any[]
}

/* tab panel (content) */
function TabPanel({ value, index, children }: any) {
    return (<div hidden={value !== index}> {children} </div>)
}

export default function TableData({ title, index, columns, updateData, activeIndex, activeTableData }: TableDataProps) {
    return (
        <TabPanel value={activeIndex} index={index}>
            <Table
                title={title}
                onRowDelete={updateData('delete')}
                onRowAdd={updateData('add')}
                onRowUpdate={updateData('update')}
                columns={columns}
                data={activeTableData}
            />
        </TabPanel>)
}