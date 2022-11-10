import { useState, createContext, useEffect, ReactNode} from "react";
import { auth, firebase } from "../services/firebase";

//tipando os dados que o User irá receber
type User ={
    nome: string;
    id: string;
    foto: string;
  }
  
//tipando os dados da autenticacao
type authContextType = {
user: User | undefined;
signInWithGoogle: () => Promise<void>;
}

export const authContext = createContext({}as authContextType);

type authContextProviderProps = {
    children: ReactNode;
}

export function AuthContextProvider (props :authContextProviderProps){

    const[user, setUser] =useState<User>()
 
    async function signInWithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        
        if(result.user){
          const{displayName, photoURL, uid} = result.user;
    
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.');
          }
          setUser({
            nome : displayName, 
            foto: photoURL, 
            id :uid
          });
        }
        
    }
    
    /*
        UseEffect, usado sempre quando precisamos monitorar alguma funcionalidade, 
        neste caso, quando reiniciar a página.
        Se não usasse esse hook, ao iniciar a página o usuário seria perdido   
    */
    /**/

    /*
        No [] devemos colocar quando queremos que essa funcao dispare
        caso colocasse 'user', toda vez que a variável user mudar iria disparar a funcao.
        se não colocar nada só irá disparar uma única vez.
    */
     
    useEffect(()=>{
        /* 
            onAuthStateChanged é um eventListener, se ele identificar que um usuário já havia logando recentemente
            ele irá recuperar este usuário
        */
        const unsubscribe = auth.onAuthStateChanged(user =>{
        if(user){
            const{displayName, photoURL, uid} = user;
    
            if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.');
            }
            setUser({
            nome : displayName, 
            foto: photoURL, 
            id :uid
            });
        }

        //utilizado para desligar o eventListener, pois quando muda de página ele continua rodando
        return()=>{
            unsubscribe();
        }

        })
    }, []);

    return(
        <authContext.Provider value={{user,signInWithGoogle}}>
            {props.children}
        </authContext.Provider>

    );
}