import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import MaterialTable from "material-table";

import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50',
        },
        secondary: {
            main: '#ff9100',
        },
    }
});



export type TableProps<T> = {
    data: Array<T>;
    columns: {
        title: string;
        field: string;
        render?: (rowData: T) => JSX.Element;
    }[];
    title?: string;
    onRowAdd?: (newData: T) => void;
    onRowDelete?: (data: T) => void;
    onRowUpdate?: (data: T) => void;
};

export default function Table<T extends { id: string }>({
    data,
    title,
    columns,
    onRowAdd,
    onRowDelete,
    onRowUpdate
}: TableProps<T>) {
    const internalRowAdd = async (newData: T) => {
        if (onRowAdd) await onRowAdd(newData);
    };
    const internalRowDelete = async (oldData: T) => {
        if (onRowDelete) await onRowDelete(oldData);
    };
    const internalRowUpdate = async (newData: T, oldData?: T) => {
        if (onRowUpdate) await onRowUpdate(newData);
    };

    return (
        <MuiThemeProvider theme={theme}>
            <MaterialTable
                style={{
                    // backgroundColor: theme.palette.primary.dark,
                    // color: 'white'
                }}

                title={title}
                data={data}
                columns={columns.map((column => ({
                    ...column,
                    // cellStyle: {
                    //     color: '#FFF'
                    //   },
                    // headerStyle: {
                    //     backgroundColor: theme.palette.secondary.contrastText,
                    // }
                })))}
                editable={{
                    onRowAdd: onRowAdd ? internalRowAdd : undefined,
                    onRowDelete: onRowDelete ? internalRowDelete : undefined,
                    onRowUpdate: onRowUpdate ? internalRowUpdate : undefined
                }}
                options={{
                    paging: false,
                    tableLayout: 'auto',
                    minBodyHeight: '70vh'
                }}
            />
        </MuiThemeProvider>
    );

}
