import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Header, RepoInfo, Issues } from './styles';
import logo from '../../assets/logo.svg'

interface RepoParams{
    repositorio: string;
}

interface GithubRepositorio{
    full_name: string,
    description: string,
    forks_count: number;
    open_issues_count: number;
    stargazers_count: number;
    owner: {
        login: string,
        avatar_url: string;
    };
}

interface githubIssues{
    id: number;
    title: string;
    html_url: string;
    user:{
        login: string;
    }
}


const Repo: React.FC = () => {
    
    const { params } = useRouteMatch<RepoParams>();
    const [repositorio, setRepositorio] = useState<GithubRepositorio | null>(null);
    const [issues, setIssues] = useState<githubIssues[]>([]);

    useEffect(() => {
        api.get<GithubRepositorio>(`/repos/${params.repositorio}`).then(response => {
            setRepositorio(response.data);
        });

        api.get<githubIssues[]>(`/repos/${params.repositorio}/issues`).then(response => {
            setIssues(response.data);
        });

    }, [params.repositorio])

    return(
        <>
            <Header> 
                <img src={logo} alt="logo github" />
                <Link to="/">
                    <FiChevronLeft />
                    Voltar
                </Link>
            </Header>

            {repositorio && (
                <RepoInfo>
                <header>
                    <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
                    <div>
                        <strong>{repositorio.full_name}</strong>
                        <p>{repositorio.description}</p>
                    </div>
                </header>

                <ul>
                    <li>
                        <strong>{repositorio.stargazers_count}</strong>
                        <span>Stars</span>
                    </li>
                    <li>
                        <strong>{repositorio.forks_count}</strong>
                        <span>Forks</span>
                    </li>
                    <li>
                        <strong>{repositorio.open_issues_count}</strong>
                        <span>Issues Abertas</span>
                    </li>
                </ul>
            </RepoInfo>
            )}
            
            <Issues>
               {issues && issues.map(issue => (
                    <a href={issue.html_url} key={issue.id} target="_blank" rel="noreferrer">
                    <div>
                        <strong>{issue.title}</strong>
                        <span>{issue.user.login}</span>
                    </div>
                    <FiChevronRight size={20} />
                    </a>
               ))}
            </Issues>
    
        </>
    )   
}

export default Repo;
