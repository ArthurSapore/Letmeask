import  '../styles/room.scss';
import deleteImg from'../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg'
import { useHistory, useParams} from'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import {Question} from'../components/Question';
import { useRoom} from'../hooks/useRoom';
import { database } from '../services/firebase';

/**
 * Tipando os parametos que irá pegar da url
 * id, pois no app.tsx recebemos path="/rooms/:id" .
 */
type RoomParams ={
    id: string;
}

export function AdminRoom(){

    /**
     *  Usado para obter o id (id da sala )que esta na url
     *  Como a rota está recebendo :/id, quando chamamos .id, ele pegará saberá o valor que deverá pegar
     */
    const params = useParams<RoomParams>();
    const {questions, title} = useRoom(params);
    const history = useHistory();
    async function handleEndRoom() {
        /**
         * window.confirm gera uma janela modal e retorna true ou false;
         */
        if(window.confirm('Tem certeza que você deseja encerrar esta sala?')){
            await database.ref(`rooms/${params.id}`).update({
                closedAt: new Date(),
            });
            history.push('/');
        }
    }
    
    async function handleCheckQuestionAnswered(questionId:string) {

        await database.ref(`rooms/${params.id}/questions/${questionId}`).update({
            isAnswered: true,
        });

    }

    async function handleHighLightQuestion(questionId:string) {


        await database.ref(`rooms/${params.id}/questions/${questionId}`).update({
            isHighLighted: true,
        });
        
    }
    
    async function handleDeleteQuestion(questionId:string) {
        /**
         * window.confirm gera uma janela modal e retorna true ou false;
         */
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            await database.ref(`rooms/${params.id}/questions/${questionId}`).remove();
        }
    }

    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id}/>
                        <Button isOutlined onClick={()=>handleEndRoom()}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>{title} Q&amp;A</h1>
                    {questions.length>0 && <span>{questions.length} perguntas</span>}
                </div>
                <div className="question-list">
                    {questions.map(
                        question => {
                            return(
                                <Question key={question.id} content={question.content} author = {question.author} isAnswered={question.isAnswered} isHighLighted={question.isHighLighted}>
                                    {!question.isAnswered &&(
                                        <>
                                            <button type='button' onClick={()=>handleCheckQuestionAnswered(question.id)}>
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>
                                            <button type='button' onClick={()=>handleHighLightQuestion(question.id)}>
                                                <img src={answerImg} alt="Dar destaque à pergunta" />
                                            </button>
                                        </>

                                    )}
                                    <button type='button' onClick={()=>handleDeleteQuestion(question.id)}>
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>

                                </Question>
                            );
                        }
                    )}
                </div>

            </main>
        </div>
        /**
         * .map() é única forma dentro de react de retornar um componente para cada elemento dentro do array
         *  Temos que passar key como parametro para o react saber a informaçao que diferencia um conteudo de outro,
         *  Caso não passe a key, se alguém apagar algum item, o react recriaria toda a lista
         *  ao invés de só excluir o item removido
         */

        /**
         * Fragment <>, sempre que for retornar dos elementos juntos o react obriga a ter um conteiner por volta deles
         * uma div no caso, porém a div pode gerar problemas na esitilização.
         * Logo, usamos o fragment <> </> pois ele não é 'visível' dentro de um código html
         */

    );
    
}