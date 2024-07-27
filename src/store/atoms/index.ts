import { atom } from 'recoil'
import localStorageEffect from '@store/effects/localStorageEffect' 
import { REEFormType } from '@pages/Home'

type REEFormValuesAtomType = REEFormType

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
        PAS: ''
    },
    effects: [localStorageEffect<REEFormValuesAtomType>('REEFormValues')]
})