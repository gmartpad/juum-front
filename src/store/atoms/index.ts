import { atom } from 'recoil'
import localStorageEffect from '@store/effects/localStorageEffect' 
import { REEFormType } from '@pages/Home'

type REEFormValuesAtomType = REEFormType & {
    REEBeforeFactor: number
    PASFactor: number
    maintenanceCalorieEnergyExpenditure: number
    weightLossCalorieEnergyExpenditure: number
    rapidWeightLossCalorieEnergyExpenditure: number
}

export const REEFormValuesAtom = atom<REEFormValuesAtomType>({
    key: 'REEFormValues',
    default: {
        unitType: 'imperial',
        sex: '',
        age: '',
        heightFeet: '',
        heightInches: '',
        heightCentimeters: '',
        weightPounds: '',
        weightKilograms: '',
        PAS: '',
        REEBeforeFactor: 0,
        PASFactor: 0,
        maintenanceCalorieEnergyExpenditure: 0,
        weightLossCalorieEnergyExpenditure: 0,
        rapidWeightLossCalorieEnergyExpenditure: 0
    },
    effects: [localStorageEffect<REEFormValuesAtomType>('REEFormValues')]
})