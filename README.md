# Teste-INMETA-Back-End-Pleno

## Description

API de Gerenciamento de documentação de colaboradores

## ⚙️ Pré-requisitos

- Node.js `18+`

## Project setup LOCALHOST

```bash
git clone https://github.com/gabriel-logan/Teste-INMETA-Back-End-Pleno
```

## Acesse o diretório do projeto

```bash
cd Teste-INMETA-Back-End-Pleno
```

## Instale as dependências

```bash
yarn install
```

## Crie um arquivo .env

```bash
cp .env-example .env
```

## Certifique-se de que o MongoDB esteja rodando

IMPORTANTE: Se estiver usando o MONGODB Localmente, LEIA O [IMPORTANT.md](docs/IMPORTANT.md) para configurar o MongoDB com Replica Set.
Isso é necessário para o funcionamento correto das transações. Usando o MongoDB Atlas, não é necessário fazer essa configuração.

## Inicie o servidor (DEV mode)

```bash
yarn dev
```

## Acesse a documentação da API

### Swagger UI
Acesse a documentação da API em: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)
### Insomnia
Importe o arquivo `Insomnia.json` para o Insomnia para testar as rotas da API.

## Testar (PROD mode)

```bash
yarn build && yarn start
```

## Unit Tests

```bash
yarn test
```

### Coverage Report

```bash
yarn test:cov
```

## E2E Tests

```bash
yarn test:e2e
```

## Explicação do projeto e rotas

Acesse o arquivo [`docs/EXPLANATION.md`](docs/EXPLANATION.md) para uma explicação detalhada do projeto e suas rotas.

## Finalização

Se você chegou até aqui, parabéns! Você configurou com sucesso o projeto e está pronto para contribuir ou testar a API.

# Versão de Produção

A versão de produção do projeto está hospedada no Vercel. Você pode acessá-la através do seguinte link:
[https://inmeta-gl.vercel.app](https://inmeta-gl.vercel.app)

INFO: O swagger não está disponível na versão de produção.

## Creditos
- [Gabriel Logan](https://github.com/gabriel-logan)
