// Mock database implementation
// In production, replace with actual database (MongoDB, PostgreSQL, etc.)

class Database {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  // Find user by email
  findUserByEmail(email) {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Find user by ID
  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  // Create new user
  createUser(userData) {
    const user = {
      id: this.nextId.toString(),
      ...userData,
      createdAt: new Date(),
      lastLogin: new Date(),
      isEmailVerified: false,
      authProvider: 'email'
    };
    
    this.users.push(user);
    this.nextId++;
    
    return user;
  }

  // Update user
  updateUser(id, updates) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return this.users[userIndex];
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Delete user
  deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    
    this.users.splice(userIndex, 1);
    return true;
  }
}

// Create singleton instance
const db = new Database();

module.exports = db;