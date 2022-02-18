import React, { useState, useEffect } from "react";
import styled from "styled-components";

import makeData from "./makeData";
import EditableCellTable from "../EditableCellTable";
import api from "../api2";
import { userColumn } from "./columns";
import Swal from "sweetalert2";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

function DynamicTableTestModule() {
  const [loading, setLoading] = useState(false);
  const [Userdata, setUserData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [refId, setrefId] = useState(0);
  const [mode, setmode] = useState(1);

  useEffect(() => {
    retrieveData(0);
  }, []);

  const retrieveData = async () => {
    setLoading(true);
    let q = "Template/GetTemplateById?templateId=ECS Test 03032021";
    const response = await api.get(q).catch((err) => {
      setLoading(false);

      if (err.response) {
        console.error("error fetching template", err.response);
      }
    });
    //console.log("response", response);
    if (response) {
      console.debug(response.data);
      setLoading(false);
      if (response.data) {
        setUserData(response.data[0].items || []);
      }
    }
  };

  const columns = React.useMemo(() => [...userColumn], []);

  const [data, setData] = React.useState(() => makeData(20));
  const [originalData] = React.useState(Userdata);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value, e) => {
    // We also turn on the flag to not reset the page
    //e.preventDefault();
    console.debug(rowIndex, columnId, value);

    var reg = /^[0-9]+$/;
    if (columnId === "quantity" || columnId === "unitPrice") {
      if (!value.match(reg)) {
        alert("please input positive numbers only!");
        value = "";
        e.target.value = "";
      }

      setSkipPageReset(true);
    }

    setSkipPageReset(true);
    setUserData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );

    setUserData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            amount: (
              Number(old[rowIndex].quantity) * Number(old[rowIndex].unitPrice)
            ).toString(),
          };
        }
        return row;
      })
    );
  };

  const AddNewRow = () => {
    const a = {
      lineNumber: Userdata.length
        ? (Number(Userdata[Userdata.length - 1].lineNumber) + 1).toString()
        : "1",
      description: "",
      quantity: "",
      unitPrice: "",
      currency: "PhP",
      amount: "",
      templateId: "",
      quantity_Numeric: 0,
      unitPrice_Numeric: 0,
      amount_Numeric: 0,
    };
    setUserData([...Userdata, a]);
  };

  const MasterSave = async () => {
    console.debug(Userdata);
    const a = {
      id: "1",
      templateId: "ECS Test 03032021",
      templateName: "ECS Test 03032021",
      clientId: "BHSI004",
      clientName: "Burlingame Health Services Inc., (Myhealth)",
      contactID: "135",
      contactPerson: "Dr. Frederick Tan",
      department: "Software Development Services",
      detailsXml: null,
      items: [...Userdata],
    };

    const response = await api.post("Template/SaveTemplate", a).catch((err) => {
      setLoading(false);
      console.error("error Insert User", err.response);
      if (err.response) {
        if (err.response.status === 400) {
          Swal.fire({
            icon: "danger",
            text: err.response,
          });
        }
      }
    }); //response insert

    if (response) {
      if (response.status === 200) {
        console.debug("res", response);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Record Updated!.",
        });
      }
    }
  };

  const handleDelete = (i) => {
    var array = [...Userdata]; // make a separate copy of the array
    if (i !== -1) {
      array.splice(i, 1);
      const updatedData = array.map((v, ind) => {
        return { ...v, lineNumber: (ind + 1).toString() }; 
      });
      setUserData([...updatedData]);
    }
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData);

  return (
    <Styles>
      {/* <button onClick={resetData}>Reset Data</button> */}
      <EditableCellTable
        columns={[
          ...columns,
          {
            Header: () => (
              <div
                style={{
                  width: 150,
                }}
              ></div>
            ),
            id: "action",
            accessor: (str) => "action",
            Cell: ({ row }) => (
              <div>
                <button
                  className="mr-2 btn-transition btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(row.index)}
                >
                  X
                </button>
              </div>
            ),
          },
        ]}
        data={Userdata}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
      <button onClick={AddNewRow}>Add New Row</button>
      <button onClick={MasterSave}>Save Editing</button>
    </Styles>
  );
}

export default DynamicTableTestModule;
