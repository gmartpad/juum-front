import { FormControl, FormGroup, FormHelperText, MenuItem, Select, SxProps, Theme, SelectChangeEvent, FormLabel } from '@mui/material'
import { FC, ReactNode } from 'react'

// @ts-ignore @typescript-eslint/no-explicit-any
type HandleChangeType = (event: SelectChangeEvent<any>, child: ReactNode) => void;

interface CustomSelectInputProps {
    error?: string
    formLabelId?: string
    formLabelSX?: SxProps<Theme>
    formLabelText?: string
    selectSX?: SxProps<Theme>
    selectId?: string
    selectName?: string
    displayEmpty?: boolean
    value: any
    handleChange: HandleChangeType
    EmptyOptionElement: FC
    options?: readonly string[]
    formHelperTextSX?: SxProps<Theme>
}

const CustomSelectInput = ({
    error,
    formLabelId = '',
    formLabelSX = { mt: 1 },
    formLabelText = '',
    selectSX,
    selectId,
    selectName,
    displayEmpty = true,
    value,
    handleChange,
    EmptyOptionElement = () => <em>Value</em>,
    options,
    formHelperTextSX
}: CustomSelectInputProps) => {

    const finalSelectSX = selectSX ? selectSX : { mt: 1, mb: error ? 0 : 1 }
    const finalFormHelperTextSX = formHelperTextSX ? formHelperTextSX : { mb: error ? 1 : 0 }

    return (
        <FormControl error={!!error}>
            <FormGroup>
                {(formLabelId && formLabelText) && (
                    <FormLabel id={formLabelId} sx={formLabelSX}>{formLabelText}</FormLabel>
                )}
                <Select
                    sx={finalSelectSX}
                    id={selectId}
                    name={selectName}
                    displayEmpty={displayEmpty}
                    value={value}
                    onChange={handleChange}
                    renderValue={(selected) => {
                        if(!selected) {
                            return <EmptyOptionElement/>
                        }

                        return selected
                    }}
                >
                    <MenuItem disabled value="">
                        <EmptyOptionElement/>
                    </MenuItem>
                    {options?.filter((option) => option).map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText sx={finalFormHelperTextSX}>{error}</FormHelperText>
            </FormGroup>
        </FormControl>
    )
}

export default CustomSelectInput