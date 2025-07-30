# 📘 Explicação do Projeto

Projeto desenvolvido com **Nest.js (11)** e **MongoDB** para gerenciar a documentação de colaboradores, incluindo funcionalidades de autenticação, criação de funcionários, associação de documentos e verificação de status de documentação.

---

## ⚠️ Sobre MySQL no arquivo `.env`

Inicialmente, a ideia era separar a parte de login utilizando MySQL e deixar o MongoDB apenas para o gerenciamento de documentos e funcionários.
Porém, por questões de recurso para deploy, foi decidido utilizar apenas o **MongoDB para tudo**.

> O MySQL **não é utilizado no projeto**, mas o arquivo `.env` ainda contém as variáveis de configuração para o caso de desejar implementar essa funcionalidade futuramente.

---

## 🌐 Base da API

A base de todas as operações da API é:
`/api/v1`

---

## 🔓 Rotas Públicas

### GET `/api/v1`

* Verifica se a API está funcionando corretamente.
  Retorna uma mensagem de sucesso: `"Hello World!"`

### POST `/api/v1/auth/sign-in`

* Realiza o login de um usuário e retorna um token JWT.

### POST `/api/v1/admin-employees`

* Cria um novo funcionário ("employee") com **role** de **admin**.

> A rota de criação de conta admin está **pública** por motivos de demonstração e facilidade.
> **Em uma aplicação real, essa rota não deve estar acessível publicamente.**

---

## 🔐 Autenticação

As rotas protegidas exigem autenticação via token JWT.
Você deve enviar o token no header `Authorization` como **Bearer Token**.

> No Swagger UI, as rotas protegidas aparecem com um cadeado. Clique no cadeado para inserir o token.

---

## 👤 Rota livre para usuários "common"

### POST `/api/v1/document-files/:documentId/send`

* Usuários **common** podem enviar documentos, mas **não** podem criar ou editar funcionários.
* Essa rota permite o envio de um arquivo que será associado a um funcionário específico.

---

## 🔁 Fluxo de Aplicação (EXEMPLO)

1. **Criar um usuário admin**
2. **Fazer login** para obter o token JWT
3. **Criar colaboradores (employees)**

   * CPF e USERNAME devem ser **únicos**
4. **Criar os tipos de documentos** que a aplicação irá gerenciar

> A rota `document-types` usa **forte cache**(LOCAL), então os documentos ficam praticamente estáticos.
> Consulte o schema de `DocumentType` para ver quais tipos são válidos.

### POST `/api/v1/document-types`

* Cria um novo tipo de documento.

5. **Associar documentos a colaboradores**

### POST `/api/v1/document-type-linkers/:employeeId/link`

* Associa um ou mais tipos de documentos a um funcionário.

### POST `/api/v1/document-type-linkers/:employeeId/unlink`

* Desassocia um ou mais tipos de documentos de um funcionário.

6. **Visualização de documentos "missing"**

### GET `/api/v1/documents/missing/all`

* Obtém todos os documentos que estão com status "missing".
- Suporta filtros via query params: `page`, `limit`, `employeeId`, `documentTypeId`.

7. **Envio de documentos pelo colaborador**

### POST `/api/v1/document-files/:documentId/send`

* Envia um documento.

### DELETE `/api/v1/document-files/:documentId/delete`

* Deleta um documento.

---

### ❗ Atenção

**Não confundir** as rotas:

* `/document-types`: gerenciamento dos **tipos de documentos**
* `/documents`: gerenciamento dos **documentos associados aos colaboradores**

---

## 🔍 Buscar Dados

As buscas são feitas via rotas `GET`.

### GET `/api/v1/documents/employee/:employeeId/statuses`

* Obtém o **status da documentação** de um funcionário.

  * É necessário passar o `employeeId` como parâmetro.
  * Também há a opção de usar a query `status` (missing, available, deleted etc.)

### GET `/api/v1/documents/missing/all`

* Obtém todos os documentos **missing** de todos os colaboradores.

  * Suporta filtros via query params: `page`, `limit`, `employeeId`, `documentTypeId`.

---

## ➕ Funcionalidades Adicionais

### 📄 ContractEvents

* Acompanhe eventos de contrato dos colaboradores (ex: contratado, demitido etc.)

> Quando um colaborador é criado, um **ContractEvent** de contratação é registrado automaticamente.
> Ao demitir ou recontratar, novos eventos são gerados.

### 🔍 Filtros para busca de colaboradores

A rota `GET /employees` permite filtros como:

* `byFirstName`
* `byLastName`
* `byCpf`
* `byContractStatus`
* `byDocumentTypeId`

---

## 💡 Sugestão

Para entender melhor o projeto:

1. **Teste as rotas** no Insomnia com o arquivo indicado no `README.md`
2. **Suba a aplicação localmente** para ter acesso ao **Swagger UI**

> O Swagger UI mostra todos os schemas esperados nas requisições e respostas.
> Isso facilita a compreensão do fluxo e dos dados envolvidos.
> IMPORTANTE: O Swagger não está disponível no ambiente de produção, apenas localmente.
> IMPORTANTE: A aplicação só funciona com o banco de dados MongoDB, então é necessário ter o MongoDB rodando localmente ou em um servidor.

---

## ❓ Dúvidas

Sinta-se à vontade para entrar em contato.

Caso precise modificar algo, estou aberto a sugestões e posso refatorar para melhorar a explicação do projeto.

---

## 👀 Observação Final

Você poderá visualizar todas as rotas, parâmetros, exemplos de requisições e respostas diretamente no Swagger.
Isso facilita bastante o entendimento do fluxo completo da aplicação.
