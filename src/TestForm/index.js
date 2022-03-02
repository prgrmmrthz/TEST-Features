import React from "react";
import MyForm from "../Reusable/MyForm";
import * as yup from "yup";

export default function TestForm() {
  let template = {
    title: "Job Application Form",
    fields: [
      {
        title: "Due Date",
        type: "date",
        name: "due_date",
      },
      {
        title: "Department",
        type: "select",
        name: "department",
        Coptions: [
          { k: 1, v: "ALL" },
          { k: 2, v: "Admin" },
          { k: 3, v: "Marketing" },
        ],
      },
      {
        title: "From",
        type: "text",
        name: "from",
      },
      {
        title: "Date",
        type: "text-read",
        name: "date",
      },
      {
        title: "Vendor",
        type: "text-with-data",
        name: "vendor",
        dataList: {
          name: "vendorList",
          items: [
            { k: 1, v: "Prime Earth" },
            { k: 2, v: "Tet 2" },
            { k: 3, v: "Test 3" },
          ],
        },
      },
      {
        title: "Amount",
        type: "number-with-decimal",
        name: "amount",
      },
      {
        title: "Uploaded Files",
        type: "file",
        name: "uploaded-files",
      },
    ],
  };

  let defaultValues = {
    date: new Date().toLocaleDateString(),
  };

  const schema = yup.object().shape({
    due_date: yup.date().required(),
    from: yup.string().required().min(3).max(60),
    vendor: yup.string().required(),
    from: yup.number().required(),
  });

  return (
    <div>
      <MyForm
        template={template}
        schema={schema}
        defaultValues={defaultValues}
        onUploadFile={onUploadFile}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function onSubmit(values) {
  console.log(values.uploaded_files);
}

const onUploadFile = (e) => {
  const files = e.target.files;

  console.log("files[0]", files[0]);
  if (files[0]) {
    //Upload(fileName, files[0]);
  }
};
