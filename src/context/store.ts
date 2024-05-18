import { configureStore } from '@reduxjs/toolkit';
import userData from './UserDataSlice/userDataSlice';
export const store = configureStore(
    {
        reducer:{
            getUserData : userData
        }
    }
)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
