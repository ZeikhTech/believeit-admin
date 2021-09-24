import React from "react";
import { FormGroup, Label } from "reactstrap";

import { useFormikContext } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const editorConfiguration = {
  mediaEmbed: {
    previewsInData: true,
  },
};

const RichEditor = ({ label, name, className = "", ...rest }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const value = values[name];
  const error = touched[name] && errors[name];

  let classes = className + "";
  if (error) {
    classes = classes + " border border-danger";
  }
  return (
    <FormGroup>
      {label && <Label className="form-control-label">{label}</Label>}
      <div className={classes}>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          activeClass="border border-primary"
          data={value}
          {...rest}
          onChange={(event, editor) => {
            setFieldValue(name, editor.getData());
          }}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

export default RichEditor;
