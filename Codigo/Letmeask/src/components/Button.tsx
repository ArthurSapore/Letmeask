import {ButtonHTMLAttributes} from 'react';
import'../styles/button.scss'

/**
 * props: ButtonProps, pegando todas as propriedades de botão e passando para o botao html
 * Importante pos o typescript necessita saber quais propriedades são.
 * & adicionando atributos além do HTML elements
 * ?: significa que é opcional
*/
    
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {isOutlined?:boolean};
/**
 * ...props, é o restOperations, ou seja, tudo que não for isOutlined, vai ser props
 * @param isOutlined = false, caso não seja passado nenhum valor para ele
 * className, caso isOutlined exista, ele irá criar um className a mais, caso não exista, não cria nada
 */
export function Button({isOutlined=false, ...props}: ButtonProps){
    return(
        <button className={`button ${isOutlined? 'outlined': ''}` }{...props}/>
    );
}