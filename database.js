import sql from 'mssql';

export default class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }

  async connect() {
    try {
      console.log(`Database connecting...${this.connected}`);
      if (this.connected === false) {
        this.poolconnection = await sql.connect(this.config);
        this.connected = true;
        console.log('Database connection successful');
      } else {
        console.log('Database already connected');
      }
    } catch (error) {
      console.error(`Error connecting to database: ${JSON.stringify(error)}`);
    }
  }

  async disconnect() {
    try {
      this.poolconnection.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  async executeQuery(query) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(query);

    return result.rowsAffected[0];
  }

  async createUser(data) {
    await this.connect();
    const request = this.poolconnection.request();
  
    request.input('email', sql.NVarChar(255), data.email);
    request.input('password', sql.NVarChar(255), data.password);
    request.input('name', sql.NVarChar(255), data.name);
    request.input('company', sql.NVarChar(255), data.company);
  
    // Insert user into the database
    await request.query(
      `INSERT INTO Users (email, password, name, company) VALUES (@email, @password, @name, @company)`
    );
  
    // Retrieve the user ID of the newly created user
    const result = await request.query(
      `SELECT id, email, name, company FROM Users WHERE email = @email`
    );
  
    // Return the user details
    return result.recordset[0];
  }
  

  async readAllUsers() {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM Users`);

    return result.recordsets[0];
  }

  async readUserById(userId) {
    try {
      console.log(userId)
      await this.connect();

      const request = this.poolconnection.request();
      const result =await request.input('id', sql.Int, userId)
        .query('SELECT * FROM Users WHERE id = @id');
        console.log(result)
      return result.recordset[0]; // Return the user object
    } catch (err) {
      console.error('Database query error:', err.message);
      throw err;
    }
  }

  async readUserByEmail(email) {
    await this.connect();

    const request = this.poolconnection.request();
    const result = await request
      .input('email', sql.NVarChar(255), email)
      .query(`SELECT * FROM Users WHERE email = @email`);
    console.log(result)

    return result.recordset[0];
  }

  async updateUser(id, data) {
    await this.connect();

    const request = this.poolconnection.request();

    request.input('id', sql.Int, +id);
    request.input('email', sql.NVarChar(255), data.email);
    request.input('password', sql.NVarChar(255), data.password);
    request.input('name', sql.NVarChar(255), data.name);
    request.input('company', sql.NVarChar(255), data.company);

    const result = await request.query(
      `UPDATE Users SET email=@email, password=@password, name=@name, company=@company WHERE id = @id`
    );

    return result.rowsAffected[0];
  }

  async deleteUser(id) {
    await this.connect();

    const idAsNumber = Number(id);

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`DELETE FROM Users WHERE id = @id`);

    return result.rowsAffected[0];
  }
}
