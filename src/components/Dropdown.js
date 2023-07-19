import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    Tooltip,
} from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

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
                maxHeight: ITEM_HEIGHT * 4,
            },
        },
    };
    const width = window.innerWidth;
    const charLimit = width > 1000 ? 60 : 45;

    
    const Placeholder = ({ children }) => {
        return <div className="select-placeholder">{children}</div>;
    };

 
    return (
        <FormControl className="select-reusable" disabled={isDisabled}>
            <div className={`select-field ${error && "select-field-error"}`}>
                <Select
                    IconComponent={(props) => (
                        <KeyboardArrowDownRoundedIcon {...props} />
                    )}
                    MenuProps={MenuProps}
                    displayEmpty
                    value={value}
                    placeholder={placeholder}
                    onChange={myOnChange ? myOnChange : onChange} // send value to hook form
                    //renderValue={value !== "" ? undefined : ()  => placeholder}
                    // onFocus={(e) => setShowPlaceholder(false)}
                    inputRef={ref}
                    fullWidth={true}
                    renderValue={
                        value !== ""
                            ? undefined
                            : () => <Placeholder>{placeholder}</Placeholder>
                    }
                >
                    {/* <MenuItem
                        disabled
                        selected
                        value=""
                        // sx={{
                        //   display: !showPlaceholder && "none",
                        // }}
                    >
                        {placeholder}
                    </MenuItem> */}
                    {options &&
                        options?.map((option) => (
                            <MenuItem
                                key={
                                    option.hasOwnProperty("_id")
                                        ? option?._id
                                        : option
                                }
                                value={
                                    option.hasOwnProperty("_id")
                                        ? option?._id
                                        : option
                                }
                            >
                                {option.hasOwnProperty("_id") ? (
                                    option?.name?.length <= charLimit ? (
                                        option?.name
                                    ) : (
                                        <Tooltip title={option?.name}>
                                            <span>
                                                {" "}
                                                {option?.name?.slice(
                                                    0,
                                                    charLimit
                                                ) + "..."}
                                            </span>
                                        </Tooltip>
                                    )
                                ) : option?.length <= charLimit ? (
                                    option
                                ) : (
                                    <Tooltip title={option}>
                                        <span>
                                            {option?.slice(0, charLimit) +
                                                "..."}
                                        </span>
                                    </Tooltip>
                                )}
                            </MenuItem>
                        ))}
                </Select>
            </div>
            <FormHelperText>
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
