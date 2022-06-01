import  '../styles/room.scss';
import { useParams} from'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import {Question} from'../components/Question';
import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRoom} from'../hooks/useRoom';
import { database } from '../services/firebase';

/**
 * Tipando os parametos que irá pegar da url
 * id, pois no app.tsx recebemos path="/rooms/:id" .
 */
type RoomParams ={
    id: string;
}

export function Room(){
    /**
     *  Usado para obter o id (id da sala )que esta na url
     *  Como a rota está recebendo :/id, quando chamamos .id, ele pegará saberá o valor que deverá pegar
     */
    const params = useParams<RoomParams>();
    const {user} = useAuth();
    const {questions, title} = useRoom(params);
    const [newQuestion, setNewQuestion] = useState('');

    async function handleSendQuestion(event:FormEvent) {
        event.preventDefault();

        if(newQuestion.trim()===''){
            return;
        }
        if(!user){
            throw new Error('You must be logged in');
        }
        /** Estrutura dos dados que estará no banco de dados*/
        const question ={
            content : newQuestion,
            author:{
                name: user.nome,
                foto: user.foto,
            },
            isHighLighted: false,
            isAnswered: false
        };
        /** Está armazenando a pergunta no banco de dados.*/
        await database.ref(`rooms/${params.id}/questions`).push(question);
        setNewQuestion('');
    }

    async function handleLikeQuestion(questionId:string, likeId:string | undefined) {
        if(likeId){
            await database.ref(`rooms/${params.id}/questions/${questionId}/likes/${likeId}`).remove();
        }else{
            await database.ref(`rooms/${params.id}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            });
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id}/>
                    </div>
                    
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>{title} Q&amp;A</h1>
                    {questions.length>0 && <span>{questions.length} perguntas</span>}
                </div>
                <form onSubmit ={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value ={newQuestion}
                    />
                    <div className="form-footer">
                        {user?(
                            <div className="user-info">
                                <img src={user.foto} alt={user.nome}/>
                                <span>{user.nome}</span>
                            </div>
                        ) : (
                            <span>Para eviar uma pergunta, <button>faça seu login</button> </span>
                        )}
                        <Button type="submit" disabled={!user} > Enviar pergunta</Button>
                    </div>
                </form>
                <div className="question-list">
                    {questions.map(
                        question => {
                            return(
                                <Question  key={question.id} content={question.content} author = {question.author} isAnswered={question.isAnswered} isHighLighted={question.isHighLighted}>
                                    <button className={`like-button ${question.likeId? 'liked' : ''}`} type='button' onClick={()=>handleLikeQuestion(question.id, question.likeId)} aria-label="Marcar como gostei">
                                        {question.likeCount>0 && <span>{question.likeCount}</span>}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </Question>
                            );
                        }
                    )}
                </div>

            </main>
        </div>

        /**
         * Só conseguimos trocar a cor do svg se ele estiver dentro da tag no html
         */
        
        /**
         * unica forma dentro de react de retornar um componente para cada elemento dentro do array
         *  temos que passar key como parametro para o react saber a informaçao que diferencia um conteudo de outro,
         * caso não passe a key, se alguém apagar algum item, o react recriaria toda a lista
         * ao invés de só excluir o item removido
         */

    );
    
}