import'../styles/question.scss';
import {ReactNode} from 'react';
type QuestionProps ={
    content: string;
    author:{
        name:string;
        foto: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighLighted?:boolean;
}

export function Question (props: QuestionProps){

    return(
        <div className={`question ${props.isAnswered ? 'answered' : ''} ${props.isHighLighted  &&! props.isAnswered? 'highLighted' : ''}`}>
            <p>{props.content}</p>
            <footer>
                <div className="user-info">
                    <img src={props.author.foto} alt={props.author.name} />
                    <span>{props.author.name}</span>
                </div>
                <div>
                    {props.children}
                </div>
            </footer>
        </div>
    );
}