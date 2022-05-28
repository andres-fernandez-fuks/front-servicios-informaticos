import React from "react";

// styles
import useStyles from "pages/control/styles.js";
import Typography from '@mui/material/Typography';

import TextField from "@material-ui/core/TextField";
import { MenuItem } from "@material-ui/core";

export default function SelectField(props) {
  var classes = useStyles();

  return (
    <>
      <div className={props.divClassName}>
        <Typography weight="bold">
          {props.displayText}
        </Typography>
        <TextField
          id={props.id}
          disabled={props.disabled}
          select
          className={props.fieldClassName}
          label={props.label}
          name={props.name}
          value={props.value ? props.value : ""}
          onChange={props.onChange}
          helperText={props.helperText}
          variant="outlined"
          margin="dense"
        >
          {props.allValues.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </>
  );
}
