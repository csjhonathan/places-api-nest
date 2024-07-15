## Como baixar o projeto

## Clone o repositório para a sua máquina:
```bash
git clone git@github.com:csjhonathan/sgbr-nest.git
```
ou
```bash
git clone https://github.com/csjhonathan/sgbr-nest.git
```

### Execute o seguinte comando:
```bash
npm install
```

### Faça as configurações de ambiente

Seguindo a estrutura do arquivo ```.env.example``` crie o arquivo ```.env``` e ```.env.test```. Este é um passo importante para subir o servidor e rodar os testes corretamente, lembre-se de nomear os bancos do ```.env``` e do ```.env.test``` com nomes diferentes para garantir que os testes não interfiram no ambiente de dev, e vice-versa.

Você pode usar qualquer string para sua chave jwt, mas caso não queira pensar muito recomendo [clicar aqui](https://www.uuidgenerator.net/) e copiar um uuid para ser sua chave.

## Rodando o projeto

Agora que as configurações estão feitas, você pode rodar o projeto.

### Manualmente

1. Para gerar as migrations do seu banco, execute o comando:
```bash
npm run dev:migrate:generate
```

2. Para executar as migrations, execute:
```bash
npm run dev:migrate:run
```

3. Gere o PrismaClient com o comando:
```bash
npx prisma generate
```

4. Execute o seed com o comando:
```bash
npm run seed
```
5. Suba o servidor local com o comando:
```bash
npm run start:dev
```

Feito o passo 5 (e todos os anteriores), o servidor estará disponível em [http://localhost:3000](http://localhost:3000)

### Docker Compose

1. Tenha certeza de ter o Docker e o Docker Compose instalado na sua máquina, este é um passo importante para rodar o projeto com Docker.

2. Rode o seguinte comando para subir o projeto com Docker:
```bash
npm run compose:build
```
caso voce não tenha buildado anteriormente.
Ou execute:
```bash
npm run compose:up
```
caso voce tenha buildado anteriormente.

Feito isso, o servidor estará disponível em [http://localhost:3000](http://localhost:3000). Para testar se a API realmente subiu, voce pode enviar uma requisição para [http://localhost:3000/health_check](http://localhost:3000/health_check)

## Testes

Para executar os testes, basta ter certeza que todas as configurações foram feitas corretamente, e executar o comando:

```bash
npm run test:e2e
```

Você poderá acompanhar os resultados dos testes no seu terminal.

## Documentação e API

Neste projeto estão disponíveis duas formas de documentação:

1. [Postman](https://www.postman.com/) (recomendado):\
  Caso possua o Postman instalado na sua máquina, ou o acesso web, estou disponibilizando o arquivo que está na raíz do projeto chamado ```Places API.postman_collection.json```.
  - Abra o Postman, e crie um ```workspace``` (caso não possua).
  - No seu ```workspace``` clique no botão com a label ```import```
  - Tanto na Web quanto no Desktop será mostrado um ```drag and drop```, você deve arrastar o arquivo ```Places API.postman_collection.json``` que está na raíz do projeto para lá
  - Caso o ```drag and drop``` não funcione, basta clicar em ```files``` no modal aberto, e escolher o arquivo
  - Feito isso, e com o seu servidor de pé, voce poderá fazer suas requisições normalmente.

  P: Por que recomendo o Postman?\
  R: Nele eu configurei um ambiente onde voce poderá testar com maior integridade os endpoints, e ja configurei scripts que irão configurar os headers das requisições automaticamente, bastando apenas fazer uma unica vez a requisição de ```sign_in```, caso queira testar autenticado
  
2. [Swagger](https://swagger.io/):\
  Caso não deseje baixar o postman, e queira testar da sua propria maneira, tudo bem. Este projeto conta com uma documentação bem descrita dos endpoints.

  - Tenha certeza de ter conseguido rodar o projeto, inclusive o comando ```npm run start:dev```
  - Uma vez que o [servidor esteja de pé](http://localhost:3000/health_check), basta acessar o endpoint ``http://localhost:3000/docs`` ou [clicar aqui](http://localhost:3000/docs) para ter acesso a documentação completa da api, com exemplo de respostas, bodies e etc.

## Tecnologias

- TypeScript
- NestJs
- Prisma ORM
- Jest
