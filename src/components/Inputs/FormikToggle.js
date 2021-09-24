import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import Toggle from "./Toggle";
import { useFormikContext } from "formik";

const FormikToggle = ({ name, label, ...rest }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const value = values[name];
  const error = touched[name] && errors[name];
  let classes = " form-control form-control-alternative text-black";
  if (error) {
    classes = classes + " border border-danger";
  }
  return (
    <FormGroup>
      {label && (
        <>
          <Label className="form-control-label">{label}</Label>
          <br />
        </>
      )}
      <Toggle
        {...rest}
        className={classes}
        checked={value}
        onChange={(checked) => {
          setFieldValue(name, checked);
        }}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

export default FormikToggle;
