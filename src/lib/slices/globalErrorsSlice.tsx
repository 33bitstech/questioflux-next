import {createSlice} from '@reduxjs/toolkit'

const initialState={
    ErrorsG: null
}
export const globalErrorsSlice = createSlice({
    name:'globalErrors',
    initialState,
    reducers: {
        reset:(state)=>{
            state.ErrorsG = null
        },
        setErrorGlobal:(state, actions)=>{
            state.ErrorsG = actions.payload
        }
    }
})

export const {reset, setErrorGlobal} = globalErrorsSlice.actions
export default globalErrorsSlice.reducer