import { Typography, FormLabel, Box, Button } from '@mui/material'
import { useFormik } from 'formik'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import NumberInput from '@components/NumberInput'
import RadioGroupInput from '@components/RadioGroupInput'
import CustomSelectInput from '@components/CustomSelectInput'
import { useRecoilState } from 'recoil'
import { REEFormValuesAtom } from '@store/atoms'
import { Container } from './styled'

// 

const unitTypes = ['imperial', 'metric'] as const;

const sexTypes = ['', 'Female', 'Male'] as const;

const PASTypes = [
    '', 
    'Sedentary',
    'Light Activity',
    'Moderate Activity',
    'Very Active',
    'Exceedingly Active'
] as const;

// 

export type UnitType = typeof unitTypes[number]

export type SexType = typeof sexTypes[number]

export type PASType = typeof PASTypes[number]

// 

export type REEFormType = {
    unitType: UnitType
    sex: SexType
    age: string
    heightFeet: string
    heightInches: string
    heightCentimeters: string
    weightPounds: string
    weightKilograms: string
    PAS: PASType
}

const HomePage = () => {
    const [reeFormValue, setREEFormValue] = useRecoilState(REEFormValuesAtom)

    const REEValidationSchema = Yup.object({
        unitType: Yup.mixed<UnitType>().oneOf([...unitTypes]).required('Required'),
        sex: Yup.mixed<SexType>().oneOf([...sexTypes]).required('Required'),
        age: Yup.string().test({
            name: 'is-above-18',
            test(value, ctx) {
                if(Number(value) > 0 && Number(value) < 18) {
                    return ctx.createError({ message: 'Not recommended for those under 18' })
                } else if (value === '0' || !value) {
                    return ctx.createError({ message: 'Age must be a positive number' })
                }
                return true
            }
        }),
        heightFeet: Yup.string()
            .when('unitType', ([unitType], schema) => {
                if(unitType === 'imperial') {
                    return schema
                        .required('Height in feet is required')
                        .test({
                            name: 'height-in-feet-above-0',
                            test(value, ctx) {
                                if(value === '0' || !value) {
                                    return ctx.createError({ message: 'Height in feet must be a positive number' })
                                }
                                return true
                            }
                        })
                }
                
                return schema
            }),
        heightInches: Yup.string()
            .when('unitType', ([unitType], schema) => {
                if(unitType === 'imperial') {
                    return schema
                        .required('Height in inches is required')
                        .test({
                            name: 'height-in-inches-above-0',
                            test(value, ctx) {
                                if(value === '0' || !value) {
                                    return ctx.createError({ message: 'Height in inches must be a positive number' })
                                }
                                return true
                            }
                        })
                }
                
                return schema
            }),
        heightCentimeters: Yup.string()
            .when('unitType', ([unitType], schema) => {
                if(unitType === 'metric') {
                    return schema
                        .required('Height in centimeters is required')
                        .test({
                            name: 'height-in-centimeters-above-0',
                            test(value, ctx) {
                                if(value === '0' || !value) {
                                    return ctx.createError({ message: 'Height in centimeters must be a positive number' })
                                }
                                return true
                            }
                        })
                }

                return schema
            }),
        weightPounds: Yup.string()
            .when('unitType', ([unitType], schema) => {
                if(unitType === 'imperial') {
                    return schema
                        .required('Weight in pounds is required')
                        .test({
                            name: 'weight-in-pounds-above-0',
                            test(value, ctx) {
                                if(value === '0' || !value) {
                                    return ctx.createError({ message: 'Weight in pounds must be a positive number' })
                                }

                                return true
                            }
                        })
                }

                return schema
            }),
        weightKilograms: Yup.string()
            .when('unitType', ([unitType], schema) => {
                if(unitType === 'metric') {
                    return schema
                        .required('Weight in kilograms is required')
                        .test({
                            name: 'weight-in-kilograms-above-0',
                            test(value, ctx) {
                                if(value === '0' || !value) {
                                    return ctx.createError({ message: 'Weight in kilograms must be a positive number' })
                                }

                                return true
                            }
                        })
                }

                return schema
            }),
        PAS: Yup.mixed<PASType>().oneOf([...PASTypes]).required('Required')
    })

    const physicalActivityStatusFactor = useCallback((PAS: string) => {

        let newValue: number = 1

        switch(PAS) {
            case 'Sedentary':
                newValue = 1.2
                break;
            case 'Light Activity':
                newValue = 1.375
                break;
            case 'Moderate Activity':
                newValue = 1.55
                break;
            case 'Very Active':
                newValue = 1.725
                break;
            case 'Exceedingly Active':
                newValue = 1.9
                break;
            default: 
                newValue = 1.2
                break;
        }

        return newValue

    }, [])

    const handleREEFormikSubmit = useCallback((values: REEFormType) => {
        let usableHeight = 0 // centimeters
        let usableWeight = 0 // kilograms

        let REEBeforeFactor = 0 // kcal
        let finalREE = 0 // kcal

        const { 
            unitType, 
            heightFeet, 
            heightInches, 
            weightPounds, 
            heightCentimeters, 
            weightKilograms,
            sex, 
            PAS, 
            age
        } = values

        const PASFactor = physicalActivityStatusFactor(PAS)

        if(unitType === 'imperial') {
            // Height
            const feetToCM = 30.48
            const inchToCM = 2.54

            const heightFeetToCM = Number(heightFeet ?? 0) * feetToCM
            const heightInchesToCM = Number(heightInches ?? 0) * inchToCM

            usableHeight = heightFeetToCM + heightInchesToCM

            // Weight
            const poundsToKG = 0.453592

            const weightPoundsToKG = Number(weightPounds ?? 0) * poundsToKG

            usableWeight = weightPoundsToKG

        } else if(unitType === 'metric') {
            usableHeight = Number(heightCentimeters ?? 0)
            usableWeight = Number(weightKilograms ?? 0)
        }

        if(sex === 'Male') {
            // 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) + 5
            REEBeforeFactor = (10 * usableWeight) + (6.25 * usableHeight) - (5 * Number(age ?? 0)) + 5

            finalREE = REEBeforeFactor * PASFactor
        } else if(sex === 'Female') {
            // 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) - 161
            REEBeforeFactor = (10 * usableWeight) + (6.25 * usableHeight) - (5 * Number(age)) - 161

            finalREE = REEBeforeFactor * PASFactor
        }

        const maintenanceCalorieEnergyExpenditure = finalREE
        const weightLossCalorieEnergyExpenditure = finalREE * 0.8
        const rapidWeightLossCalorieEnergyExpenditure = finalREE * 0.6

        setREEFormValue({
            ...values,
            REEBeforeFactor,
            PASFactor,
            maintenanceCalorieEnergyExpenditure,
            weightLossCalorieEnergyExpenditure,
            rapidWeightLossCalorieEnergyExpenditure
        })
    }, [physicalActivityStatusFactor, setREEFormValue])

    const REEFormik = useFormik({
        initialValues: reeFormValue as REEFormType,
        validationSchema: REEValidationSchema,
        onSubmit: handleREEFormikSubmit
    })

    const { values, errors, handleSubmit, handleChange } = REEFormik

    return (
        <section>
            <Link to="about">About Us</Link>
            <Typography variant='h2'> 
                Resting Energy Expenditure
            </Typography>
            <form onSubmit={handleSubmit}>
                <Container>
                    <RadioGroupInput
                        error={errors?.unitType}
                        formLabelId='unit-label'
                        formLabelText='Select your Unit Type:'
                        radioGroupId='unitType'
                        radioGroupName='unitType'
                        radioGroupAriaLabelledBy='unit-label'
                        value={values.unitType}
                        handleChange={handleChange}
                        radioOptions={[
                            { value: 'imperial', label: 'U.S. (Imperial)'},
                            { value: 'metric', label: 'Metric' }
                        ]}
                    />
                    <CustomSelectInput
                        error={errors?.sex}
                        selectId='sex'
                        selectName='sex'
                        value={values.sex}
                        handleChange={handleChange}
                        EmptyOptionElement={() => <em>Sex</em>}
                        options={sexTypes}
                    />
                    <NumberInput
                        label="Age"
                        id="age"
                        name="age"
                        value={values.age}
                        handleChange={handleChange}
                        error={errors?.age}
                    />
                    <FormLabel id="height-inputs" sx={{ mt: 1 }}>Height:</FormLabel>
                    {values.unitType === 'imperial' ? (
                        <Box display="flex" gap={2}>
                            <NumberInput
                                formControlStyle={{ flex: 1 }}
                                label="Feet"
                                id="heightFeet"
                                name="heightFeet"
                                value={values.heightFeet}
                                handleChange={handleChange}
                                error={errors?.heightFeet}
                            />
                            <NumberInput
                                formControlStyle={{ flex: 1 }}
                                label="Inches"
                                id="heightInches"
                                name="heightInches"
                                value={values.heightInches}
                                handleChange={handleChange}
                                error={errors?.heightInches}
                            />
                        </Box>
                    ) : (
                        <Box display="flex">
                            <NumberInput
                                formControlStyle={{ flex: 1 }}
                                label="Centimeters"
                                id="heightCentimeters"
                                name="heightCentimeters"
                                value={values.heightCentimeters}
                                handleChange={handleChange}
                                error={errors?.heightCentimeters}
                            />
                        </Box>
                    )}
                    <FormLabel id="weight-input" sx={{ mt: 1 }}>Weight:</FormLabel>
                    {values.unitType === 'imperial' ? (
                        <NumberInput
                            ariaLabelledby='weight-input'
                            label="Pounds"
                            id="weightPounds"
                            name="weightPounds"
                            value={values.weightPounds}
                            handleChange={handleChange}
                            error={errors?.weightPounds}
                        />
                    ) : (
                        <NumberInput
                            ariaLabelledby='weight-input'
                            label="Kilograms"
                            id="weightKilograms"
                            name="weightKilograms"
                            value={values.weightKilograms}
                            handleChange={handleChange}
                            error={errors?.weightKilograms}
                        />
                    )}

                    <CustomSelectInput
                        error={errors?.PAS}
                        formLabelId='select-physical-activity-status'
                        formLabelText='Physical Activity Status:'
                        selectId='PAS'
                        selectName='PAS'
                        value={values.PAS}
                        handleChange={handleChange}
                        EmptyOptionElement={() => <em>Physical Activity</em>}
                        options={PASTypes}
                    />
                    <Button variant='contained' color='success' type='submit'>
                        Calculate REE
                    </Button>
                </Container>
            </form>
        </section>
    )
}

export default HomePage