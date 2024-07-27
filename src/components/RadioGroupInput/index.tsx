import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, SxProps, Theme } from '@mui/material'
import React from 'react'

// @ts-ignore @typescript-eslint/no-explicit-any
type HandleChangeType = (event: React.ChangeEvent<any>) => void;

type RadioOptionType = { value: string, label: string }

interface RadioGroupInputProps {
    error?: string
    formLabelId?: string
    formLabelSX?: SxProps<Theme>
    formLabelText?: string
    radioGroupSX?: SxProps<Theme>
    row?: boolean
    radioGroupId?: string
    radioGroupName?: string
    radioGroupAriaLabelledBy?: string
    value: any
    handleChange: HandleChangeType
    radioOptions?: RadioOptionType[]
}

const RadioGroupInput = ({
    error,
    formLabelId,
    formLabelSX = { mt: 1 },
    formLabelText = 'Select your value',
    radioGroupSX = { mt: 1, mb: 1 },
    row = true,
    radioGroupId,
    radioGroupName,
    radioGroupAriaLabelledBy,
    value,
    handleChange,
    radioOptions
}: RadioGroupInputProps) => {
  return (
    <FormControl error={!!error}>
        <FormLabel id={formLabelId} sx={formLabelSX}>
            {formLabelText}
        </FormLabel>
        <RadioGroup
            sx={radioGroupSX}
            row={row}
            id={radioGroupId}
            name={radioGroupName}
            aria-labelledby={radioGroupAriaLabelledBy}
            value={value}
            onChange={handleChange}
        >
            {radioOptions?.map((option, k) => (
                <FormControlLabel key={k} value={option?.value} control={<Radio/>} label={option?.label} />
            ))}
        </RadioGroup>
        <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}

export default RadioGroupInput