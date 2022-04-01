# transaction_settlement

Resumo da aplicação:

Aplicação separada em três componentes:
- Uma API chamada "seller_information", cujo objetivo é obter informações através de requisições e gravar dados dos sellers em um banco de dados MongoDB;
- Um microserviço chamado "tax_calculation" que se comunica com uma instância do RabbitMQ para o processamento dos impostos referentes às transações processadas. Recebe o ID do seller, a quantia, calcula o imposto em cima desse valor e retorna em outra fila, de modo que o fluxo da liquidação possa prosseguir.
- E por fim, o "settlement", que utiliza os dados processados pelos dois ultimos para liquidar as transações dos sellers.

Instalação de dependências e inicialização do app:
O app foi desenvolvido em Node.js para rodar em contêineres docker utilizando o Docker-Compose (Podman-Compose). O arquivo docker-compose.yaml contém as configurações necessárias para a inicialização dos contêineres do MongoDB e RabbitMQ, bastando apenas digitar no WSL "docker-compose up" e aguardar a instalação. Importante lembrar que tanto o WSL quanto as outras dependencias devem estar instaladas na máquina.
- Instalar o NVM, NPM e Node.js, informações no site oficial ou https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows;
- Podman, site oficial: https://podman.io/getting-started/installation;
- Alias Docker para Podman:
- - docker ps -a
- - podman ps -a
- - nano ~/.bash_aliases
- - alias docker=podman
- - source ~/.bash_aliases
- - docker ps -a;
- Podman Compose: https://github.com/containers/podman-compose ;
- Postman para teste dos endpoints das API's (ou qualquer outro que tenha a mesma finalidade).

Para recuperar as bibliotecas utilizadas, basta acessar o terminal e digitar npm install (ou apenas npm i) para o download automático. As dependências do projeto estão salvas no arquivo package.json, de modo que o próprio NPM consegue fazer o download de maneira automática.
Estando tudo atualizado e os contêineres inicializados, basta digitar ts-node server.js em cada um dos três projetos (seller_information, settlement e tax_calculation) para inicializar os servidores. Por estar em typescript, talvez seja necessário fazer a instalação manual das bibliotecas typescript e ts-node.
O app conta com um swagger em seller_information, bastando acessar http://localhost:3000/api-docs. O servidor roda na porta 3000.

Overview: 
- A API seller_information conta com os seguintes endpoints:
- - GET /v1/sellers/:id           busca o seller por id;
- - POST /v1/sellers/             grava um seller no banco de dados passando a estrutura via req.body;
- - GET /v1/sellers/              busca sellers de acordo com a query passada via URL;
- - PATCH /v1/sellers/:id         atualiza as informações de um seller;
- - POST /v1/sellers/dummy-data   popula o banco com massa de dados.

- tax_calculation roda na porta 3001, a string de conexão é amqp://localhost:5672/#/.

- settlement roda na porta 3002 e possui muitos endpoints... A terminar.
