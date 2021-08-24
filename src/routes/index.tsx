import React, { lazy, Suspense } from 'react';
import {Switch, Route} from 'react-router-dom';
//import { Dashboard } from '../pages/Dashboard';
//import { Repo } from '../pages/Repo';

const Dashboard = lazy(() => import(        //comentario p/ identificar o chunk no relatorio/ prefetch cria cache
    /*webpackPrefetch: true */ 
    /* webpackChunkName: "dashboard" */ 
    '../pages/Dashboard')); 
const Repo = lazy(() => import(
    /*webpackPrefetch: true */
    /* webpackChunkName: "repo" */
    '../pages/Repo'));

export const Routes: React.FC = () => {
    return (
    <Suspense fallback={'Loading...'}>    
     <Switch>
         <Route exact path="/" component={Dashboard} /> {/*exact somente na rota raiz */}
         <Route exact path="/repositorio/:repositorio+" component={Repo} />  {/*parametro recebido com /. (+)declara que é somente 1 */}
     </Switch> 
    </Suspense>  
    )

    
}
