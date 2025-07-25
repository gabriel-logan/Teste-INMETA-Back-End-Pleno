# 🧾 Projeto com Transações MongoDB (Replica Set) – Instruções de Setup

Este projeto utiliza **transações do MongoDB**, que **exigem que o banco esteja rodando como um _replica set_** (mesmo em ambiente local).

> ⚠️ **Se você rodar o MongoDB no modo padrão (standalone), transações vão falhar com o erro:**  
> `MongoServerError: Transaction numbers are only allowed on a replica set member or mongos`

---

## ⚙️ Pré-requisitos

- Node.js `18+`
- MongoDB instalado (`mongod`)
- **Recomendado:** `mongosh` instalado (`npm i -g mongosh`)

---

## 🚀 Como iniciar o MongoDB com Replica Set (modo local)

### 1. Crie um diretório para persistência

```bash
mkdir -p ~/mongo-data
```

### 2. Inicie o MongoDB com replica set

```bash
mongod --dbpath ~/mongo-data --replSet rs0
```

> Mantenha esse terminal aberto rodando.

### 3. Em outro terminal, inicialize o replica set

```bash
mongosh
```

No shell que abrir, execute:

```js
rs.initiate()
```

> Isso só precisa ser feito uma vez, enquanto o diretório `~/mongo-data` não for apagado.

---

## 🧪 Testando

Você pode rodar o projeto normalmente:

```bash
npm run start:dev
```

Se o Mongo estiver corretamente rodando como replica set, as transações funcionarão normalmente.

---

## 🛠️ Dica: Script para facilitar o desenvolvimento

Adicione ao seu `package.json`:

```json
"scripts": {
  "mongo": "mongod --dbpath ./mongo-data --replSet rs0",
  "start:dev": "npm run mongo & nest start --watch"
}
```

---

## 🧼 Resetando o banco

Se por algum motivo você apagar o diretório `mongo-data`, será necessário rodar `rs.initiate()` novamente após iniciar o Mongo.

---

## 🐳 Alternativa com Docker (Opcional)

Você pode usar o Mongo com replica set já configurado com o Docker:

```yaml
# docker-compose.yml
version: "3.8"
services:
  mongo:
    image: mongo:6
    ports:
      - 27017:27017
    command: ["--replSet", "rs0"]
    volumes:
      - ./mongo-data:/data/db
```

Depois de subir:

```bash
docker-compose up -d
docker exec -it <container_name> mongosh
rs.initiate()
```

---

## 📌 Conclusão

Este projeto **exige o MongoDB rodando como Replica Set para funcionar corretamente**.

Configure o ambiente corretamente para evitar falhas nas transações, e sinta-se à vontade para adaptar o setup com Docker, scripts ou ferramentas de sua preferência.
