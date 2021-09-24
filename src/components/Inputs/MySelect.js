import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import { useFormikContext } from "formik";

const MySelect = ({
  name,
  label,
  className,
  options = [],
  placeholder,
  ...rest
}) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const value = values[name];
  const error = touched[name] && errors[name];
  let classes = className + " form-control form-control-alternative text-black";
  if (error) {
    classes = classes + " border border-danger";
  }

  if (placeholder) {
    options = [{ label: placeholder || "", value: "" }, ...options];
  }
  return (
    <FormGroup>
      {label && <Label className="form-control-label">{label}</Label>}
      <Input
        {...rest}
        type="select"
        className={classes}
        style={{ color: "black" }}
        value={value}
        onChange={(e) => {
          console.log(e.target.value);
          setFieldValue(name, e.target.value);
        }}
      >
        {options.map((option, k) => (
          <option key={k} value={option.value}>
            {option.label}
          </option>
        ))}
      </Input>
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

{
  /* <Input type="select" name="select" id="exampleSelect">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Input> */
}

export default MySelect;
