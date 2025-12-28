const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      const MONGODB_URI = process.env.MONGODB_URI;
      
      await mongoose.connect(MONGODB_URI, {
        autoIndex: process.env.NODE_ENV === 'development', 
        autoCreate: true, 
      });
      
      console.log(`📊 MongoDB connected to: ${mongoose.connection.name}`);
      
      this._setupEventListeners();
      
    } catch (err) {
      console.error('❌ Database connection error:', err.message);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Attempting to start local MongoDB...');
        this._attemptLocalStart();
      } else {
        throw err;
      }
    }
  }

  _setupEventListeners() {
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  }

  _attemptLocalStart() {
    // You could add logic to start MongoDB locally if not running
    console.log('💡 Please ensure MongoDB is running:');
    console.log('   For Windows: Run "mongod" in Command Prompt as Administrator');
    console.log('   Or start MongoDB service: "net start MongoDB"');
    console.log('   For Linux/Mac: "sudo service mongod start" or "brew services start mongodb-community"');
    
    // Retry connection after 10 seconds
    setTimeout(() => {
      console.log('🔄 Retrying connection...');
      this._connect();
    }, 10000);
  }

  async disconnect() {
    await mongoose.connection.close();
    console.log('📤 MongoDB disconnected');
  }

  async dropDatabase() {
    if (process.env.NODE_ENV === 'development') {
      await mongoose.connection.db.dropDatabase();
      console.log('🗑️  Database dropped');
    }
  }

  getConnection() {
    return mongoose.connection;
  }

  getMongoose() {
    return mongoose;
  }
}

module.exports = new Database();