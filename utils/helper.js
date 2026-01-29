// utils/helper.js
const { randomUUID } = require('crypto');

class Helper {
  static generateRandomUser(idLength = 8) {
    const id = randomUUID().replace(/-/g, '').slice(0, idLength); 
    return {
      firstName: 'Test',
      lastName: `User${id}`,
      address: '123 Test St',
      city: 'Pune',
      state: 'MH',
      zipCode: '411001',
      phoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
      ssn: `SSN-${id}`,
      username: `user_${id}`,         // short username
      email: `test+${id}@example.com`,
      password: 'password123',
    };
  }
}

module.exports = Helper;