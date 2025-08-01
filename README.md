# Teste-INMETA-Back-End-Pleno

## 📝 Descrição

API de Gerenciamento de documentação de colaboradores.

---

## ⚙️ Pré-requisitos

* Node.js `18+`

---

## 🚀 Setup do Projeto (LOCALHOST)

### 1. Clone o repositório

```bash
git clone https://github.com/gabriel-logan/Teste-INMETA-Back-End-Pleno
```

### 2. Acesse o diretório do projeto

```bash
cd Teste-INMETA-Back-End-Pleno
```

### 3. Instale as dependências

```bash
yarn install
```

### 4. Crie um arquivo `.env`

```bash
cp .env-example .env
```

### 5. Certifique-se de que o MongoDB esteja rodando

> **IMPORTANTE:** Se estiver usando o MongoDB localmente, LEIA o arquivo [`IMPORTANT.md`](docs/IMPORTANT.md) para configurar o MongoDB com Replica Set.
> Isso é necessário para o funcionamento correto das transações.
> Usando o MongoDB Atlas, **não** é necessário fazer essa configuração.

#### MongoDB Local

```bash
sudo systemctl start mongod
```

- Verifique se o MongoDB está rodando

```bash
sudo systemctl status mongod
```

### 6. Inicie o servidor (modo DEV)

```bash
yarn dev
```

---

## 📚 Documentação da API

### Swagger UI

Acesse em: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### Insomnia / Postman

Importe o arquivo `Insomnia.json` para o Insomnia ou Postman para testar as rotas da API.

---

## 🧪 Testes

### Testar em modo produção

```bash
yarn build
```

```bash
yarn start
```

### Testes unitários

```bash
yarn test
```

#### Relatório de cobertura

```bash
yarn test:cov
```

### Testes E2E

> Certifique-se de que o MongoDB esteja rodando.
> Certifique-se de que existe um `employee` cadastrado no banco de dados com `role` `admin`:

Após isso certifique de registrar esse usuario no arquivo `.env` na variável `TEST_ADMIN_USERNAME` e `TEST_ADMIN_PASSWORD`.

Também certifique-se de que o banco de dados esteja com status `running`.

> Se não existir, o teste irá falhar na rota de login.

```bash
yarn test:e2e
```

---

## 📄 Explicação do projeto e rotas

Acesse o arquivo [`EXPLANATION.md`](docs/EXPLANATION.md) para uma explicação detalhada do projeto e suas rotas.

---

## ✅ Finalização

Se você chegou até aqui, parabéns! Você configurou com sucesso o projeto e está pronto para testar a API.

---

## 🌐 Versão de Produção

A versão de produção do projeto está hospedada na Vercel.
Você pode acessá-la pelo link abaixo:

🔗 [https://inmeta-gl.vercel.app](https://inmeta-gl.vercel.app/api/v1)

> **Atenção:** A documentação Swagger não está disponível nesta versão.

### ⚠️ Observações

Se notar lentidão na conexão, isso pode ocorrer pelo seguinte motivo:

1. Estou utilizando os planos gratuitos do MongoDB Atlas e da Vercel. Por ser servidores compartilhados. A latência pode variar dependendo do tráfego no momento.

Nos testes realizados, a latência variou entre **100ms e 400ms**.
Além disso, a API entra em modo de hibernação após um tempo sem requisições, o que pode tornar a **primeira requisição um pouco mais lenta** (cerca de **3 segundos**). Após isso, as demais devem responder rapidamente.

---

## 👤 Créditos

* [Gabriel Logan](https://github.com/gabriel-logan)

As libs cpf_and_cnpj-generator e multiform-validator foram criadas por mim e estão disponíveis no meu perfil do GitHub.
* [cpf_and_cnpj-generator](https://github.com/gabriel-logan/Gerador-CPF-e-CNPJ-valido)
* [multiform-validator](https://multiformvalidator.netlify.app)
