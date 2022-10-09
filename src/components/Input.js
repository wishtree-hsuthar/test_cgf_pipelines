import React from "react";
import { TextField } from "@mui/material";
import { useController, useForm } from "react-hook-form";
const Input = ({
    control,
    name,
    myHelper,
    placeholder,
    myOnChange,
    rules,
    onBlur,
    multiline,
    isDisabled,
}) => {
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: rules,
        defaultValue: "",
    });
    // console.log("error on text inputs: ",myHelper)
    return (
        <TextField
            disabled={isDisabled}
            className={`input-field ${error && "input-error"}`}
            placeholder={placeholder}
            onChange={myOnChange ? myOnChange : onChange} // send value to hook form
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            inputRef={ref} // send input ref, so we can focus on input when error appear
            inputProps={{
                maxLength: rules?.maxLength && rules.maxLength,
            }}
            helperText={
                error
                    ? myHelper
                        ? myHelper[name]
                            ? myHelper[name][error.type]
                                ? myHelper[name][error.type]
                                : "Invalid Input"
                            : "Invalid Input"
                        : "Invalid Input"
                    : " "
            }
            variant="outlined"
        />
    );
};

export default Input;
