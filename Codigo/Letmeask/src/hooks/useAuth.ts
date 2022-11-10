import {useContext} from 'react';
import { authContext} from '../contexts/authContext';

export function useAuth(){
    const value = useContext(authContext);
    return value;
}