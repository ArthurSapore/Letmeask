import { useState, useEffect } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

/**
 * Record é utilizado para tipar objetos, logo temos um objeto de string
 */
 type FirebaseQuestion = Record<string, {
    author:{
        name: string;
        foto: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}> 

type QuestionType = {
    id : string;
    author:{
        name: string;
        foto: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type ParamsType ={
    id: string;
}

export function useRoom (params: ParamsType){
    /**
     * Usa um array de questions
     */
    const [questions, setQuestions] = useState<QuestionType []>([]);
    const {user} = useAuth();
    const [title, setTitle] = useState('');

    useEffect(()=>{
        const roomRef = database.ref(`rooms/${params.id}`);
        /**
         * Usando uma ferramenta do js, 
         * Once quer dizer que está ouvindo um evento apenas uma vez
         * On, para ouvir o evento mais de uma vez
         * Value, trás todos os valores da database.ref() e atribiu a room
         * .val() funcão do firebase (se fosse outra outra API poderia ser outra função)
         */
            
        roomRef.on('value', room =>{
            /**
             * Variavel : tipoda variavel =  .questions dentro de room,
             * ?? Caso não haja valor, então um objeto vazio
             */
                
            const firebaseQuestions : FirebaseQuestion = room.val().questions ??{};
            /**
             * Converte o objeto em array, 
             * Define as chaves e os valores,
             * Desestrutura com .map 
            */

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) =>{
                return{
                    id: key,
                    content : value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.id)?.[0],
                }
            });
            setTitle(room.val().title);
            setQuestions(parsedQuestions);
        })
        
    /**
     * Método some(), percorre o array até que a condição parada seja true
     * Só retorna true ou false
     * Método find(), que retorna o valor quando encontrado
     */

        return ()=>{ 
            roomRef.off('value')
        }
    /** Todas vez que a rota da sala mudar, ele irá executar esta função */
    },[params.id, user?.id]);

    return{questions, title};
}