import { FormControl, SxProps, TextField, Theme } from '@mui/material'
import { ReactNode } from 'react'

// @ts-ignore @typescript-eslint/no-explicit-any
type HandleChangeType = (event: React.ChangeEvent<any>) => void;

interface NumberInputProps {
    formControlStyle?: React.CSSProperties
    textFieldSX?: SxProps<Theme>
    ariaLabelledby?: string
    label?: ReactNode
    id?: string
    name?: string
    // @ts-ignore @typescript-eslint/no-explicit-any
    value: any
    handleChange: HandleChangeType
    error?: string
}

const NumberInput = ({
    formControlStyle,
    textFieldSX = { mt: 1, mb: 1 },
    ariaLabelledby,
    label,
    id,
    name,
    value,
    handleChange,
    error
}: NumberInputProps) => {
  return (
    <FormControl style={formControlStyle}>
        <TextField
            sx={textFieldSX}
            aria-labelledby={ariaLabelledby}
            label={label}
            id={id}
            name={name}
            variant="outlined"
            type="number"
            value={value}
            onChange={handleChange}
            error={!!error}
            helperText={error as ReactNode}
        />
    </FormControl>
  )
}

export default NumberInput