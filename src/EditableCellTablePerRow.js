import React from "react";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import { useTable, usePagination } from "react-table";
import styled from "styled-components";

const Styles = styled.div`
  .right {
    text-align: right;
  }
`;

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id, Ctype, Csize, Coptions },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = (e) => {
    updateMyData(index, id, value, e);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  switch (Ctype) {
    case "number":
      return (
        <input
          type="number"
          value={value}
          onChange={onChange}
          onKeyDown={onBlur}
          min={1}
          size={Csize || 30}
          style={{
            textAlign: "left",
          }}
        />
      );
      break;
    case "pass":
      return (
        <input
          type="password"
          value={value}
          onChange={onChange}
          onKeyDown={onBlur}
          size={Csize || 30}
          style={{
            textAlign: "left",
          }}
        />
      );
      break;
    case "span":
      return <span>{value}</span>;
      break;
    case "ddl":
      return (
        <select
          className="mb-2 mr-2 dropdown-toggle btn btn-outline-focus"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          {Coptions.map((c) => (
            <option className="show" value={c.k} key={c.k}>
              {c.v}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onBlur}
          size={Csize}
        />
      );
      break;
  }
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
function EditableCellTablePerRow({
  columns,
  data,
  updateMyData,
  skipPageReset,
  addNewRow,
  masterSave,
}) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      addNewRow,
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[3, 5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        &nbsp;
        <button onClick={() => addNewRow()}>{"+ Add Row"}</button> &nbsp;
        {/*  <button onClick={() => masterSave()}>{"Save Changes"}</button>{" "} */}
      </div>
    </>
  );
}

export default EditableCellTablePerRow;
