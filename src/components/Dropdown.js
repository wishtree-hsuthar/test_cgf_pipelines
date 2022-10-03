import React, { useState } from "react";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { useController } from "react-hook-form";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

function Dropdown({
  control,
  name,
  myOnChange,
  myHelper,
  placeholder,
  rules,
  options,
  isDisabled,
}) {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: "",
  });
  const ITEM_HEIGHT = 42;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 5.5,
      },
    },
  };
  // const [showPlaceholder, setShowPlaceholder] = useState(true);
  // console.log("options", options);
  return (
    <FormControl className="select-reusable" disabled={isDisabled}>
      <div className={`select-field ${error && "select-field-error"}`}>
        <Select
          IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props}/>}
          MenuProps={MenuProps}
          displayEmpty
          value={value}
          placeholder={placeholder}
          onChange={myOnChange ? myOnChange : onChange} // send value to hook form
          // onFocus={(e) => setShowPlaceholder(false)}
          inputRef={ref}
          fullWidth={true}
        >
          <MenuItem
            selected
            value=""
            // sx={{
            //   display: !showPlaceholder && "none",
            // }}
          >
            {placeholder}
          </MenuItem>
          {options && options?.map((option) => (
            <MenuItem
              key={option.hasOwnProperty("_id") ? option?._id : option}
              value={option.hasOwnProperty("_id") ? option?._id : option}
            >
              {option.hasOwnProperty("_id") ? option?.name : option}
            </MenuItem>
          ))}
        </Select>
      </div>
      <FormHelperText>
        {/* {console.log("error: ", error)} */}
        {error
          ? myHelper
            ? myHelper[name]
              ? myHelper[name][error.type]
                ? myHelper[name][error.type]
                : "Invalid Input"
              : "Invalid Input"
            : "Invalid Input"
          : " "}
      </FormHelperText>
    </FormControl>
    // <TextField
    //   className={`input-field ${error && 'input-error'}`}
    //   placeholder={placeholder}
    //   onChange={onChange} // send value to hook form
    //   onBlur={onBlur} // notify when input is touched/blur
    //   value={value} // input value
    //   name={name} // send down the input name
    //   inputRef={ref} // send input ref, so we can focus on input when error appear
    //   helperText={
    //     error ? myHelper[name][error.type] : " "
    //   }
    //   variant="outlined"
    // />
  );
}

export default Dropdown;
