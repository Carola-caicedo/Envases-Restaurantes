const jwt = require('jsonwebtoken');

try {
  const secret = 'secret';
  const token = jwt.sign({ test: 1 }, secret, { expiresIn: '24h' });
  console.log('Token:', token);
} catch (e) {
  console.error('JWT Error:', e);
}
