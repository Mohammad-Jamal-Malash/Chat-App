import {createSlice} from '@reduxjs/toolkit';


type UserData = {
    user:any;
}

const initialState:UserData = {
    user:null
}

const userDataSlice = createSlice({
    name:"userData",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setUserNull:(state)=>{
            state.user = null;
        }
    }
})


export default userDataSlice.reducer;


export const {setUser, setUserNull} = userDataSlice.actions;