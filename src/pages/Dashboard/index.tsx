import React,{useState, useEffect, ChangeEvent, FormEvent, useRef} from 'react';
import {Link} from 'react-router-dom';
import { api } from '../../services/api';
import { FiChevronRight } from 'react-icons/fi'
import { Title, Form, Repos, Error } from './styles';
import  logo  from '../../assets/logo.svg'


interface GithubRepositorio{
    full_name: string,
    description: string,
    owner: {
        login: string,
        avatar_url: string;
    };
}

 const Dashboard: React.FC = () => {
    
    const [repositorios, setRepositorios] = useState<GithubRepositorio[]>(() => {  //passando a tipagem p/state = []
        const storage = localStorage.getItem('@githubcollection:repos');
        if(storage){
           return JSON.parse(storage);
        }
        return [];
    }); 
    const [newRepositorio, setNewRepositorio] = useState(''); //state p/ manipular input e pesquisar axios/apigithub 
    const [inputError, setInputError] = useState('');//state p/ manipular erros
    const formEl = useRef<HTMLFormElement | null>(null);


    useEffect(() => {
        localStorage.setItem('@githubcollection:repos', JSON.stringify(repositorios))

    }, [repositorios]);


    function handleInputChange(event: ChangeEvent<HTMLInputElement>) :void { // event: ChangeEvent importacao do react
        setNewRepositorio(event.target.value);
    }


    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {  //
        event.preventDefault();
        
        if(!newRepositorio){
            setInputError('Informe o username/repositorio');
            return;
        }
        try{
            const response = await api.get<GithubRepositorio>(`repos/${newRepositorio}`)
            const repos = response.data;
            setRepositorios([...repositorios, repos]);
            formEl.current?.reset();
            setNewRepositorio('');
            setInputError('');
        } catch {
            setInputError('Repositorio não existe.');
        }  
    }


    return( 
    <>
    <img src={logo} alt="logo github" />
    <Title>Catalogo de Repositorios do Github</Title>
    
    <Form 
    ref={formEl}
    hasError={Boolean(inputError)} 
    onSubmit={handleSubmit}>
        
        <input 
        placeholder="username/repositorio"
        onChange={handleInputChange}
        onFocus={() => setInputError('')}
         />
        <button type="submit">Buscar</button>

    </Form>
        
        {inputError && <Error>{inputError}</Error>}
   
   
    <Repos>
        {repositorios.map((repositorio, index) => (
            <Link to={`/repositorio/${repositorio.full_name}`} key={index}>
            <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
            <div>
                <strong>{repositorio.full_name}</strong>
                <p>{repositorio.description}</p>
            </div>
            <FiChevronRight size={20} />
        </Link>
        ))}

    </Repos>
    </>
    )
}

export default Dashboard;
