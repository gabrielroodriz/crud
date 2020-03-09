# Crud 

## Utilizar aplicação
Para testar a aplicação é simples:

1. Realizar o clone do projeto. 
2. Entrar dentro diretório da pasta backend e realizar em seu terminal o comando:
~~~shell
yarn 
~~~
3. Entrar dentro do diretório da pasta frontend e realizar em seu terminal o comando:
~~~shell
yarn 
~~~
4. Iniciar os servidores front e back end, dentro dos diretórios de front e back end, realizar o comando em seu terminal:
~~~shell
npm start
~~~
A aplicação front end vai iniciar em localhost:3000 e o backend em localhost:3001
<hr>

# Crud 

Crud é uma aplicação real de cadastro em formulário, um projeto Web separado por `front` e `back` end. Com o intuído de treinar conceitos em React como:

* Componentes Isolados
* Estilização de componentes
* Componentes de classe e componentes de Função
* Manipulação de estado da aplicação 
* Ciclo de vida de componentes
* Metodos HTTP 
* Passagem de Parametros para componetes
* Paginação entre compoentes (Rotas)
* Comunicação com API externa (Backend)
* Responsividade

![crude](https://i.imgur.com/mK8BcOj.jpg)


# Explicando a arquitetura do código

## Primeiros passos na aplicação

### Construção backend

Para explicar basecamente como foi aplicada cada um dos conhecimentos listados acima, iniciamos o projeto com a contrução do backend com a seguinte dependência e configuração no package.json:

~~~json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "json-server --watch db.json --port 3001"
  },
  "license": "MIT",
  "dependencies": {
    "json-server": "0.13.0"
  }
}

~~~

Colando essa estrutura no package.json a dependencia `json-server` será instalada, ela simula um servidor a partir de um arquivo .json referenciado no diretório, essa configuração fazemos nesse trecho:

~~~json
  "scripts": {
    "start": "json-server --watch db.json --port 3001"
  },
~~~

Que basicamente faz com o que o `json-server` fique observando o arquivo db.json na *porta 3001*

A estrutura monstada para o arquivo db.json é simples, seguindo de apenas três campos, o **id**, **nome** e **email**:
~~~json
  {
  "users": [
    {
      "name": "Robert Bart",
      "email": "rbart@rocour.com",
      "id": 1
    },
    {
      "name": "Eduardo Delfino",
      "email": "du.delfino@rocour.com",
      "id": 2
    }
  ]
}
~~~

Com essas configurações o backend já esta pronto e preparado para se comunicar com o front e também salvar todas as modificações dentro do arquivo `db.json`.

### Construção frontend

Em uma pasta diferente no mesmo diretório que o back, inicio minha aplicação `frontend` com o código:

~~~shell
create-react-app frontend
~~~

E instalando as seguinte dependências: 
~~~json
    "axios": "^0.19.2",
    "bootstrap": "^4.4.1",
    "font-awesome": "^4.7.0",
    "react": "^16.13.0",
    "react-dom": "^16.13.0",
    "react-router": "^5.1.2",
    "react-router-dom": "^5.1.2",
    "react-scripts": "3.4.0"
~~~

#### Componentes Isolados
Entendendo que componentes são como "Atores" em nossa aplicação, realizar a separação de cada um deles, com suas regras de funcionamento e até estilização, mantemos o código mais indepentende para futuras manutenções e escalabilidade. 

Neste projeto os  componentes foram alocados dentro da pasta templetes contendo cada um seu arquivo .jsx e .css (Este projeto não contém a utilização de style components)

```
components
|   home
|       |
|       home.jsx
|    templates
|        |
|        Footer.jsx
|        Footer.css
|      ...
```

#### Estiliza;ção de Componentes
Como cada componente tem responsabilidade unica, é possivel estilizar cada um de forma isolada, o que como vimos se *componentes isolados* ajuda além de manter o código organizado, a realizar manutenções com maior facilidade. Neste projeto também utilizamos as váriaveis em CSS, podemos chamar a mesma variavel e varios momentos no código, onde caso seja necessário modifica-la, essa mudança ocorre somente na declaração da variavel, afetando em todas as suas chamadas. 

~~~css
App.css

:root {
    --bg-dark: #1A2F3A;

    --logo-height: 100px;
    --header-height: 100px;
    --menu-top-height: 70px;
    --aside-width: 225px;
    --footer-height: 40px;

    --shadow:
        0 2px 23px 0 rgba(0, 0, 0, 0.1),
        0 2px 49px 0 rgba(0, 0, 0, 0.06);
}

* {
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
    margin: 0px;
    padding: 0px;
}

/*Layout and Grid*/
.app {
    margin: 0px;
    display: grid;
    grid-template-columns: var(--aside-width) 1fr;
    grid-template-rows: var(--header-height) 1fr var(--footer-height);
    grid-template-areas: "logo header""menu content""menu footer";
    height: 100vh;
    background-color: #f5f5f5;
}
~~~

### Componentes de classe e componentes de Função

Utilizamos componentes de função e também componentes de classe nessa aplicação. Extraindo o melhor que cada uma pode nos oferecer, como por exemplo o component `Nav` que está em `nav.jsx`:

~~~js
import "./Nav.css";
import React from "react";
import { Link } from "react-router-dom";

export default props => (
  <aside className="menu-area">
    <nav className="menu">
      {/* Refactory */}
      <Link to="/">
        <i className="fa fa-home"></i> Início
      </Link>
      <Link to="/users">
        <i className="fa fa-users"></i> Usuários
      </Link>
    </nav>
  </aside>
);
~~~
Este componente de função, retorna a construção do nosso side-menu, como não existe alteração de estado em seu objetivo como componente, o defini como um componente de função.

Por sua vez os componentes de classe, já tem em seu objetivo a alteração do estado do componente, uso essa estratégia em outra parte da aplicação.

#### Manipulação de estado da aplicação 

Em componentes de classe, podemos manipular todo o estado da aplicação, desde quando ela é montada, até quando e destruída. Nesse exemplo manipulamos o formulário mudando seu estado para limpo toda a vez que se inicia, ou toda vez após de ser salvo. 

~~~js
const initialState = {
  user: { name: "", email: "" },
  list: []
};

export default class UserCrud extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios.get(baseUrl).then(resp => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ user: initialState.user });
  }
  save() {
    const user = this.state.user;
    if (user.email === '' || user.name === '' ) return;
    const method = user.id ? "put" : "post";
    const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;
    axios[method](url, user).then(resp => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ user: initialState.user, list });
    });
  }
~~~

#### Ciclo de vida de componentes

Com o mesmo código acima, manipulamos um dos ciclos de vida do componente, o `componentWillMount` que define o que o component vai realizar, mesmo antes do HTML ser carregado na página, no exemplo acima ele faz uma requisição, pegando todos os registros do `db.json` e aloca esses valores dentro de uma váriavel chamada **list** definida em nosso estado inicial **initialState**.

#### Metodos HTTP

[Métodos HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods) são basicamente as formas de requisições que existem entre o client e o server, como por exemplo: Get, Post, Put e Delete.

Neste projeto realizamos as requisições com a ajuda do `axios`, como por exemplo no componenteWillMount no código acima, onde realizamos o `axios.get`, assim estamos enviando para o server uma requisição para que ele nos envie o dado da natureza que estou requisitando, no caso os dados de formulário. 

#### Passagem de parametros para componentes

Apesar de cada componente trabalhar de forma isolada, é possível realizar uma troca de dados entre componentes, isso por passagem de parametros, que por style guide chamamos de `props`

~~~js
Home.jsx

import React from "react";
import Main from "../templates/Main";

export default props => (
  <Main icon="home" title="Início" subtitle="Segundo Projeto Banana Fish">
    <div className="display-4">Bem Vindo!</div>
    <hr />
    <p className="mb-0">Sistema de cadastro em React</p>
  </Main>
);
~~~

~~~js
Header.jsx

import "./Header.css";
import React from "react";

export default props => (
  <header className="header d-none d-sm-flex flex-column">
    <h1 className="mt-3">
      <i className={`fa fa-${props.icon}`}></i> {props.title}
    </h1>
    <p className="lead text-muted">{props.subtitle}</p>
  </header>
);
~~~
~~~js
Main.jsx

import "./Main.css";
import React from "react";
import Header from "./Header";

export default props => (
  <React.Fragment>
    <Header {...props} />
    <main className="content container-fluid">
      <div className="p-3 mt-3">
        {props.children}
      </div>
    </main>
  </React.Fragment>
);
~~~

No trecho acima, temos o código de Home.jsx definindo parametros props como `icon`, `subtitle` e `title`, passando-os para Main.jsx que envia para seus filhos no caso Header.jsx

#### Paginação entre compoentes (Rotas)

Para existir uma páginação na aplicação, construi rotas:

~~~js
import React from "react";
import { Switch, Route, Redirect } from "react-router";

import Home from "../components/home/Home";
import UserCrud from "../components/user/UserCrud";

export default props => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/users" component={UserCrud} />
    <Redirect from="*" to="/" />
  </Switch>
);
~~~

#### Comunicação com API externa (Backend)

Tanto para receber os dados, quanto para envia-los para nosso banco de dados (db.json), é necessário haver uma conexão entre o front e back end, neste projeto como é de desenvolvimento local, a conexão foi realizada da seguiente forma:

~~~js
const baseUrl = "http://localhost:3001/users";
~~~

Dessa forma, todas as vezes que utilizo uma requisiçao HTTP, indico esta variavel `baseUrl`:

~~~js
componentWillMount() {
    axios.get(baseUrl).then(resp => {
      this.setState({ list: resp.data });
    });
  }
~~~

#### Responsividade

Por fim, para ter uma aplicação que se adapta a todos os tipos de resolução, a tornei responsiva, com o auxilio do bootstrap e também com algumas configurações com o @media:

~~~css
@media(max-width: 768px) {
    .app {
        grid-template-rows: 
            var(--header-height) 
            var(--menu-top-height)
            ifr
            var(--footer-height);
        grid-template-columns: var(--aside-width) ifr;
        grid-template-areas: 
            "logo header"
            "menu menu"
            "content content"
            "footer foorter";
    }
}

@media(max-width: 576px) {
    .app {
        grid-template-rows:
        var(--logo-height)
        var(--menu-top-height)
        1fr
        var(--footer-height);
        grid-template-columns: 1fr;
        grid-template-areas: 
            "logo"
            "menu"
            "content"
            "footer";
    }
}
~~~

<hr>
com ❤ Gabriel 