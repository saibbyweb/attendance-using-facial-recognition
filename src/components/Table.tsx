import MaterialTable from "material-table";

type TableProps<T> = {
  data: Array<T>;
  columns: {
    title: string;
    field: string;
    render?: (rowData: T) => JSX.Element;
  }[];
  onRowAdd?: (newData: T) => void;
  onRowDelete?: (data: T) => void;
  onRowUpdate?: (data: T) => void;
};

export function Table<T extends { id: string }>({
  data,
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
    <MaterialTable
      data={data}
      columns={columns}
      editable={{
        onRowAdd: onRowAdd ? internalRowAdd : undefined,
        onRowDelete: onRowDelete ? internalRowDelete : undefined,
        onRowUpdate: onRowUpdate ? internalRowUpdate : undefined
      }}
      options={{
        paging: false
      }}
    />
  );
  
}
