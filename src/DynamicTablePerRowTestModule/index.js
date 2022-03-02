import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Joi from "joi";

import makeData from "./makeData";
import EditableCellTablePerRow from "../EditableCellTablePerRow";
import api from "../api2";
import { userColumn } from "./columns";
import Swal from "sweetalert2";

const Styles = styled.div`
  /* padding: 1rem;

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
  } */
`;

function DynamicTablePerRowTestModule() {
  const [loading, setLoading] = useState(false);
  const [Userdata, setUserData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [toSaveFields, setToSaveFields] = useState({});
  const [refId, setrefId] = useState(0);
  const [mode, setmode] = useState(1);

  useEffect(() => {
    retrieveData(0);
  }, []);

  const retrieveData = async () => {
    setLoading(true);
    let q = "User";
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
        setUserData(response.data || []);
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
    // console.debug(rowIndex, columnId, value);

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
  };

  const AddNewRow = () => {
    const a = {
      id: 0,
      emp_id: "",
      name: "",
      user_name: "",
      email: "",
      user_type: 2,
    };
    setUserData([...Userdata, { ...a }]);
  };

  const MasterSave = async () => {
    console.debug(Userdata);
    const a = {
      id: "1",
      templateId: "9F Training Room 123",
      templateName: "9F Training Room 123",
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
      setUserData([...array]);
    }
  };

  const onSavePerRow = async (data) => {
    //console.debug(data);
    const schema = Joi.object({
      emp_id: Joi.string().min(5).max(30).required(),
      pword: Joi.string().min(5).max(50).required(),
      name: Joi.string().min(5).max(40).required(),
      user_name: Joi.string().min(3).max(30).required(),
      id: Joi.number().min(0).required(),
      user_type: Joi.number().min(1).max(2),
      email: Joi.string().email({ minDomainSegments: 2, tlds: false }),
    });
    try {
      const value = await schema.validateAsync(data);
      console.debug(value);
      let response;
      if (value) {
        if (value.id === 0) {
          response = await api.post("User", value).catch((err) => {
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
        } else if (value.id > 0) {
          response = await api.put("User", value).catch((err) => {
            setLoading(false);
            console.error("error Update User", err.response);
            if (err.response) {
              if (err.response.status === 400) {
                Swal.fire({
                  icon: "danger",
                  text: err.response,
                });
              }
            }
          });
        } //if else mode insert or update

        if (response) {
          //console.debug(response);
          setLoading(false);
          if (response) {
            if (response.status === 200 && response.data > 0) {
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Record Updated!.",
              }).then(() => {
                retrieveData();
              });
  
            } else if (response.status === 200 && response.data === -1) {
              Swal.fire({
                icon: "warning",
                title: "Duplicated!",
                text: `Employee ID: ${value.emp_id} already exist.`,
              });
            } else if (response.status === 200 && response.data === -2) {
              Swal.fire({
                icon: "warning",
                title: "Duplicated!",
                text: `Username: ${value.user_name} already exist.`,
              });
            }
          }
        }//if else response
      }
    } catch (err) {
      Swal.fire(JSON.stringify(err.details[0].message));
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
      <EditableCellTablePerRow
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
                  className="mr-2 btn-transition btn btn-sm btn-outline-success"
                  onClick={() => onSavePerRow(row.original)}
                >
                  Save
                </button>
                &nbsp;
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
        data={[...Userdata]}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        addNewRow={AddNewRow}
        masterSave={MasterSave}
      />
      {/* <button onClick={AddNewRow}>Add New Row</button> */}
      {/* <button onClick={MasterSave}>Save Editing</button> */}
    </Styles>
  );
}

export default DynamicTablePerRowTestModule;
