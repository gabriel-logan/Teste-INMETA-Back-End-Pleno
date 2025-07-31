# 🧾 MongoDB Transactions Project (Replica Set) – Setup Instructions

This project uses **MongoDB transactions**, which **require the database to be running as a *replica set***.

> ⚠️ **If you run MongoDB in standalone mode, transactions will fail with the error:**
> `MongoServerError: Transaction numbers are only allowed on a replica set member or mongos`

IF MONGO IS NOT RUNNING AS A REPLICA SET, TRANSACTIONS WILL NOT WORK!

THE FOLLOWING SETTINGS ARE NECESSARY FOR LOCAL ENVIRONMENT ONLY.

OFFICIAL DOC: [MongoDB Transactions](https://www.mongodb.com/docs/manual/core/transactions/)

---

## ⚙️ Prerequisites

* Node.js `18+`
* MongoDB installed (`mongod`) - **Version 4 or higher** (for transaction support)
* Mongosh (MongoDB shell client)

---

## 🚀 How to Start MongoDB with Replica Set (Local Mode)

### 1. Create a directory for data persistence

```bash
mkdir -p ~/mongo-data
```

### 2. Start MongoDB with replica set enabled

#### Stop the MongoDB service if it is running:

```bash
sudo systemctl stop mongod
```

#### Start MongoDB manually with replica set:

```bash
mongod --dbpath ~/mongo-data --replSet rs0
```

> Keep this terminal open and running.

### 3. In another terminal, initialize the replica set

```bash
mongosh
```

Then in the shell:

```js
rs.initiate()
```

> This only needs to be done once as long as the `~/mongo-data` directory is not deleted.

---

## 💡 Alternative: Run MongoDB as a Service with Replica Set (No Open Terminal Needed)

You can configure MongoDB to run as a **permanent service with replica set enabled**, so you don’t have to keep a terminal open:

### 1. Edit MongoDB configuration file:

```bash
sudo nano /etc/mongod.conf
```

### 2. Add (or uncomment) the following lines:

```yaml
replication:
  replSetName: rs0
```

### 3. Restart the MongoDB service:

```bash
sudo systemctl restart mongod
```

### 4. Initialize the replica set once:

```bash
mongosh
rs.initiate()
```

> After this, MongoDB will always be ready for transactions without manual commands.

---

## 🧪 Testing

Run your project normally:

```bash
yarn dev
```

If MongoDB is running properly as a replica set, transactions will work without errors.

---

## 🛠️ Tip: Development Script

Add this to your `package.json`:

```json
"scripts": {
  "mongo": "mongod --dbpath ./mongo-data --replSet rs0",
  "start:dev": "npm run mongo & nest start --watch"
}
```

---

## 🧼 Resetting the Database

If you delete the `mongo-data` directory for any reason, you will need to run `rs.initiate()` again after restarting MongoDB.

---

## 🐳 Docker Alternative (Optional)

You can run MongoDB with replica set pre-configured using Docker:

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

After starting the container:

```bash
docker-compose up -d
docker exec -it <container_name> mongosh
rs.initiate()
```

---

## 📌 Summary

This project **requires MongoDB running as a Replica Set to function properly**.

Make sure to configure your environment correctly to avoid transaction failures.
