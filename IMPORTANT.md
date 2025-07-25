# 🧾 Projeto com Transações MongoDB (Replica Set) – Instruções de Setup

Este projeto utiliza **transações do MongoDB**, que **exigem que o banco esteja rodando como um _replica set_** (mesmo em ambiente local).

> ⚠️ **Se você rodar o MongoDB no modo padrão (standalone), transações vão falhar com o erro:**  
> `MongoServerError: Transaction numbers are only allowed on a replica set member or mongos`

SE O MONGO NÃO ESTIVER RODANDO COMO REPLICA SET, AS TRANSAÇÕES NÃO FUNCIONARÃO!

ESSAS CONFIGURAÇÕES SÃO NECESSÁRIAS ABAIXO SÃO PARA AMBIENTE LOCAL.

---

## ⚙️ Pré-requisitos

- Node.js `18+`
- MongoDB instalado (`mongod`)
- Mongosh (para interagir com o MongoDB)

---

## 🚀 Como iniciar o MongoDB com Replica Set (modo local)

### 1. Crie um diretório para persistência

```bash
mkdir -p ~/mongo-data
```

### 2. Inicie o MongoDB com replica set

#### Pare o serviço MongoDB se estiver rodando:

```bash
sudo systemctl stop mongod
```

#### Inicie o MongoDB manualmente com replica set:

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

## 💡 Alternativa: Rodar MongoDB como serviço com Replica Set (sem deixar terminal aberto)

Você pode configurar o MongoDB como **serviço permanente com replica set**, evitando deixar o terminal aberto toda vez:

### 1. Edite o arquivo de configuração do MongoDB:

```bash
sudo nano /etc/mongod.conf
```

### 2. Adicione (ou descomente) as linhas:

```yaml
replication:
  replSetName: rs0
```

### 3. Reinicie o serviço:

```bash
sudo systemctl restart mongod
```

### 4. Inicialize o replica set uma única vez:

```bash
mongosh
rs.initiate()
```

> A partir daí, o Mongo já estará sempre pronto para transações sem necessidade de comandos manuais.

---

## 🧪 Testando

Você pode rodar o projeto normalmente:

```bash
yarn dev
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

Configure o ambiente corretamente para evitar falhas nas transações.
