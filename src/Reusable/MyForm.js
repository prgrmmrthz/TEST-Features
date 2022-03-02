import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Reusable Form Component
function MyForm(props) {
  let { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(props.schema),
    defaultValues: props.defaultValues,
  });
  let { fields } = props.template;

  const renderFields = (fields) => {
    return fields.map((field) => {
      let { title, type, name, validationProps, dynamic, Coptions, dataList } =
        field;

      switch (type) {
        case "text":
          return (
            <div className="position-relative form-group" key={name}>
              <label>{title}</label>
              <input
                placeholder={title}
                type="text"
                className="form-control form-control-sm"
                {...register(name)}
              />
              <p className="text-danger">{formState.errors[name]?.message}</p>
            </div>
          );
        case "number-with-decimal":
          return (
            <div className="position-relative form-group" key={name}>
              <label>{title}</label>
              <input
                placeholder={title}
                type="number"
                className="form-control form-control-sm"
                step=".01"
                {...register(name)}
              />
              <p className="text-danger">{formState.errors[name]?.message}</p>
            </div>
          );
        case "file":
          return (
            <div className="position-relative form-group" key={name}>
              <label>{title}</label>
              <input type="file" accept=".pdf" className="form-control form-control-sm" onChange={props.onUploadFile} />
            </div>
          );
        case "text-with-data":
          return (
            <div className="position-relative form-group" key={name}>
              <label className="">{title}</label>
              <input
                name="OR"
                placeholder={title}
                type="text"
                list={dataList.name}
                autoComplete="off"
                {...register(name)}
                className="form-control form-control"
              />
              <p className="text-danger">{formState.errors[name]?.message}</p>
              <datalist id={dataList.name}>
                {dataList.items.map((item) => (
                  <option key={item.k} value={item.v} />
                ))}
              </datalist>
            </div>
          );
        case "date":
          return (
            <div key={name}>
              <label htmlFor={name}>{title}</label> &nbsp;
              <input
                type="date"
                name={name}
                id={name}
                className="form-control form-control"
                pattern="\d{4}-\d{2}-\d{2}"
                {...register(name, { valueAsDate: true })}
              />
              {formState.errors[name] && (
                <p className="text-danger">{formState.errors[name]?.message}</p>
              )}
            </div>
          );
        case "email":
          return (
            <div key={name}>
              <label htmlFor={name}>{title}</label>
              <input type="email" name={name} id={name} {...register(name)} />
            </div>
          );
        case "checkbox":
          return (
            <div key={name}>
              <label>
                <input
                  type="checkbox"
                  name={name}
                  id={name}
                  value={true}
                  {...register(name)}
                />
                <span>{title}</span>
                {formState.errors[name] && (
                  <p className="text-danger">
                    {formState.errors[name]?.message}
                  </p>
                )}
              </label>
            </div>
          );
        case "url":
          return (
            <div key={name}>
              <label htmlFor={name}>{title}</label>
              <input type="url" name={name} id={name} {...register(name)} />
            </div>
          );
        case "select":
          return (
            <div className="position-relative form-group mr-2" key={name}>
              {title}: &nbsp;
              <select
                className="mb-2 mr-2 dropdown-toggle btn btn-outline-focus"
                {...register(name)}
              >
                {Coptions.map((c) => (
                  <option className="show" value={c.k} key={c.k}>
                    {c.v}
                  </option>
                ))}
              </select>
              <p className="text-danger">{formState.errors[name]?.message}</p>
            </div>
          );
        case "text-read":
          return (
            <div className="position-relative form-group" key={name}>
              <label>{title}</label>
              <input
                placeholder={title}
                type="text"
                className="form-control form-control-sm"
                {...register(name)}
                readOnly
              />
            </div>
          );
        default:
          return (
            <div key={name}>
              <span className="red-text">Invalid Field</span>
            </div>
          );
      } //switch
    }); //fields.map
  }; //render fields

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderFields(fields)}
        <br />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}

function onSubmit(values) {
  console.log(values);
}

export default MyForm;
