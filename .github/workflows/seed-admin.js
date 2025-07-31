const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

(async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME;

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const employees = db.collection('employees');

    const username = process.env.TEST_ADMIN_USERNAME;
    const password = process.env.TEST_ADMIN_PASSWORD;
    const cpf = process.env.TEST_ADMIN_CPF;

    const existingAdmin = await employees.findOne({ username });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 8);

      const admin = {
        firstName: username,
        lastName: username,
        username,
        password: hashedPassword,
        role: 'admin',
        cpf,
        contractStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await employees.insertOne(admin);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists, skipping seed.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
    console.log('MongoDB disconnected');
  }
})();
