import { useHistory } from 'react-router-dom';
import '../styles/auth.scss';

import {Button} from '../components/Button';
import {FormEvent, useState} from'react';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

export function Home(){
    
    const history = useHistory();
    /**
     * armazenando o usuário e a funcao de cadastrar caso o usuário não esteja logado
     */
    const {user, signInWithGoogle } = useAuth();
    /**
     * armazenando sala
     */
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        /**
         * redirecionando o usuário para está rota
         */
        history.push('/rooms/new');
    }
    /**
     * funcao para entrar em uma sala aleatória
     * @param event evento de form
     * @returns 
     */
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if(roomCode.trim()===''){
            return;
        }
        /**
         * verifica se no database tem alguma ocorrencia.
         */
        const roomRef = database.ref(`/rooms/${roomCode}`).get();
        
        if(!(await roomRef).exists()){
            alert('Sala não existe.');
            return;
        }

        if((await roomRef).val().closedAt){
            alert('Esta sala já foi encerrada.');
            return;
        }

        /**
         * redireciona o usuário para a sala e passa o id da sala como parametro
         */
        history.push(`/rooms/${roomCode}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e repostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="letmeask"/>
                    <button onClick={handleCreateRoom} className="create-room"> <img src={googleIconImg} alt="Logo google" /> Crie sua sala com o google</button>
                    <div className="separator"> ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text"
                            onChange={event => setRoomCode(event.target.value)} 
                            value = {roomCode}
                            placeholder="Digite o código da sala"
                        />
                        <Button> Entrar na sala </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}