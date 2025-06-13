import {createSlice} from '@reduxjs/toolkit'

const initialState={
    filters: null
}
export const filterSlice = createSlice({
    name:'filters',
    initialState,
    reducers: {
        reset:(state)=>{
            state.filters = null
        },
        setFilters:(state, actions)=>{
            if (actions.payload.length == 0) state.filters = null
            if (actions.payload) state.filters = actions.payload
        }
    }
})

export const {reset, setFilters} = filterSlice.actions
export default filterSlice.reducer