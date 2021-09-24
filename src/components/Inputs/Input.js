import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

import { useFormikContext } from "formik";

const MyInput = ({ name, label, ...rest }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const value = values[name];
  const error = touched[name] && errors[name];
  let classes = " form-control form-control-alternative text-black";
  if (error) {
    classes = classes + " border border-danger";
  }
  return (
    <FormGroup>
      {label && <Label className="form-control-label">{label}</Label>}
      <Input
        {...rest}
        className={classes}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
        }}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

export default MyInput;
