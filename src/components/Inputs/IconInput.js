import React from "react";
import {
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { useFormikContext } from "formik";

const IconInput = ({ name, icon, ...rest }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const error = touched[name] && errors[name];
  const value = values[name];
  return (
    <FormGroup>
      <InputGroup
        className={
          error
            ? "input-group-alternative border border-danger"
            : "input-group-alternative"
        }
      >
        <InputGroupAddon addonType="prepend">
          <InputGroupText className={error ? "text-danger" : ""}>
            <i className={icon} />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          {...rest}
          value={value}
          onChange={(e) => {
            setFieldValue(name, e.target.value);
          }}
        />
      </InputGroup>
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

export default IconInput;
