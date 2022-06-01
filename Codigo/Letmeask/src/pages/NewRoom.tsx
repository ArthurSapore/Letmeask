
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';
import {Button} from '../components/Button';
import {Link, useHistory} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, FormEvent } from 'react';
import { database} from '../services/firebase';
export function NewRoom(){

    const history = useHistory();
    const {user} = useAuth();
    /**
     * Estado
     */
    const[newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        if(newRoom.trim() ===''){
            return;
        }
        /**
         * Reference, para ter uma referencia de dados dentro do banco de dados, uma secao
         */
        const roomRef = database.ref('rooms');
        /**
         * Metodo push está armazenando uma nova sala para o firebase, 
         */
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            userID :user?.id,
        })
        /**
         * Redireciona o usuário para a sala e passa o id da sala como parametro
         */
        history.push(`/rooms/${firebaseRoom.key}`);
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala" 
                            onChange={event => setNewRoom(event.target.value)}
                            /**
                             * Toda vez que o usuário digitar algo no input eu insiro este valor newRoom
                             */
                            value = {newRoom}
                        />
                        <Button> Criar sala </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to ="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}