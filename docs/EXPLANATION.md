## Explicação do Projeto

Projeto desenvolvido com Nest.js(11) e MongoDB para gerenciar a documentação de colaboradores, incluindo funcionalidades de autenticação, criação de funcionários, associação de documentos e verificação de status de documentação.

### Sobre MYSQL config no arquivo .env

Eu inicialmente iria fazer a parte de login separada com MYSQL e deixar o mongo apenas para o gerenciamento de docs e funcionarios, porem por questoes de recurso para deploy, resolvi usar apenas o MongoDB para tudo, e deixei o MYSQL como alternativa caso queira usar.
O MYSQL não é utilizado no projeto, mas o arquivo .env ainda contém as variáveis de configuração para o caso de querer implementar essa funcionalidade no futuro.

A rota /api/v1 é a base para todas as operações da API. A seguir, estão as principais rotas e suas funcionalidades:

/ - Rota apenas para verificar se a API está funcionando corretamente. Retorna uma mensagem de sucesso. "Hello World!".

Para criar um "employee", você precisa criar uma conta com "role" de "admin".

As senhas são criptografadas usando bcrypt, e o token JWT é gerado para autenticação.

A rota de criação de conta admin está publica por processo de demostracao e facilidade, mas em uma aplicacao real, essa rota não deve estar acessível publicamente.

As rotas fechadas precisam de autenticação para serem acessadas. Você deve passar o token JWT no header Authorization como Bearer Token. (Se estiver usando Swagger UI ele mostra as rotas protegidas com um cadeado no canto direito, e você pode clicar nele para inserir o token JWT).

## Rotas publicas

### GET /api/v1
- Verifica se a API está funcionando corretamente.

### POST /api/v1/auth/sign-in
- Realiza o login de um usuário e retorna um token JWT.

### POST /api/v1/admin-employees
- Cria um novo funcionário (employee) "admin" na aplicação.

O restante das rotas são protegidas e requerem autenticação.
Apenas usuários com o papel de "admin" podem executar acoes nas rotas não publicas. Com exceção da rota de envio de documentos.

## Rota livre para usuarios "common"

Explicação da rota de envio de documentos:

Eu imaginei que seria interessante permitir que usuários comuns (common) pudessem enviar documentos, mas não criar ou editar funcionários. Por isso, a rota de envio de documentos está aberta para usuários comuns.

### POST /api/v1/document-files/:documentId/send
- Envia um arquivo de documento para o servidor. Requer autenticação.
 - Essa rota é usada para enviar arquivos de documentos que serão associados a um funcionário específico. Os usuarios "common" podem enviar documentos, mas não podem criar ou editar funcionários.

## Fluxo de aplicação (EXEMPLO)

Voce precisa criar um usuário "admin" e depois fazer login com esse usuário para obter um token JWT.

Apos obter o token JWT, voce pode criar colaboradores (employees) e associar documentos a esses colaboradores.
CPF e USERNAME devem ser únicos, ou seja, não é possível criar dois colaboradores com o mesmo CPF ou USERNAME.

Para fazer as associações com os documentos, antes precisa criá-los.

Primeiro crie os documentos que a aplicação ira gerenciar, essa rota DocumentType esta usando forte cache, então os documentos ficaram praticamente como estaticos.
Verifique o schema de DocumentType para saber quais documentos sao permitidos de criar. (Isso é um controle para evitar que sejam criados documentos inválidos).
Adicione ou altere os documentos que são realmente necessários para a aplicação.

A rota pra criar tipos de documento é a seguinte:
### POST /api/v1/document-types
- Cria um novo tipo de documento. Requer autenticação.

Apos ter "Tipos de documentos" criados e "Colaboradores" criados, voce pode associar documentos aos colaboradores.

A rota de associacao e desassociacao de documentos é a seguinte:
### POST /api/v1/document-type-linkers/:employeeId/link
- Associa um ou varios tipos de documentos a um funcionário específico. Requer autenticação.
### POST /api/v1/document-type-linkers/:employeeId/unlink
- Desassocia um ou varios tipos de documentos de um funcionário específico. Requer autenticação.

Apos isso, voce pode buscar os colaboradores e seus documentos associados.

Agora o colaborador pode enviar o documento que esta "missing" (faltando) para o servidor.

isso pode ser feito com a seguinte rota:
### POST /api/v1/document-files/:documentId/send
- Envia um arquivo de documento para o servidor. Requer autenticação.

### DELETE /api/v1/document-files/:documentId/delete
- Deleta um arquivo de documento do servidor. Requer autenticação.

### OBS: Não confundir a rota /documents com a rota /document-types

Rotas /document-types são para gerenciar os tipos de documentos que a aplicação irá gerenciar.
Rotas /documents são para gerenciar os documentos que estão associados aos colaboradores.

## Buscar dados

Seram feitos atravez de todas as rotas GET

Ex: obter status da documentacao de um colaborador especifico:
### GET /api/v1/documents/employee/:employeeId/statuses
- Obtém o status de documentação de um funcionário específico. Requer autenticação.
 - Voce precisa passar o ID do funcionário no parâmetro employeeId.
 - Tambem tem a opçao da query (status) para filtrar os status de documentos que voce deseja obter. (missing, available, deleted, etc).

Rota para buscar todos os documentos (missing) de todos os colaboradores:
### GET /api/v1/documents/missing/all
- Obtém todos os documentos (missing) de todos os colaboradores. Requer autenticação.
 - Essa rota tem a opção de filtrar por multiplos query params, como por exemplo: page(number), limit(number), employeeId(ObjectId), documentTypeId(ObjectId).

## Funcionalidades adicionais

Alem da funcionalidade de login que criei, a aplicação possui as seguintes funcionalidades adicionais:

ContractEvents, voce pode verificar os eventos de contrato de todos os colaboradores.
Ex: Colaboradores que foram contratados, demitidos, etc.

Demitir e recontratar colaboradores. (OBS: quando voce cria um colaborador, é considerado como contratado e um ContractEvent é criado automaticamente).
Se voce demitir ou recontratar um colaborador, um novo ContractEvent será criado automaticamente.

A rota GET employees tem varios query params para filtrar os colaboradores, como por exemplo: byFirstName(string), byLastName(string), byCpf(string), byContractStatus(string), byDocumentTypeId(ObjectId).

## Sugestao

Para um melhor entendimento do projeto, recomendo que voce teste as rotas da API usando o Insomnia pelo arquivo indicado no README.md.

E tambem suba a aplicação localmente para ter acesso ao Swagger UI, que é uma documentação interativa da API.

O swagger UI mostrara todos os Schemas pedidos nas requests e os Schemas de resposta esperados.

Qualquer duvida, sinta-se a vontade para entrar em contato comigo.

Qualquer modificação que fosse necessaria eu poderia refazer para melhorar a explicação do projeto.

Voce podera ver todas as rotas, parâmetros, exemplos de requisições e respostas, o que facilitará muito o entendimento do fluxo da aplicação.
