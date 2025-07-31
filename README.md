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
> Certifique-se de que existe um `employee` cadastrado no banco de dados com:

* **username:** `admin`
* **password:** `123456`

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
Acesse através do link:

[https://inmeta-gl.vercel.app](https://inmeta-gl.vercel.app/api/v1)

> **INFO:** O Swagger não está disponível na versão de produção.

---

## 👤 Créditos

* [Gabriel Logan](https://github.com/gabriel-logan)

As libs cpf_and_cnpj-generator e multiform-validator foram criadas por mim e estão disponíveis no meu perfil do GitHub.
