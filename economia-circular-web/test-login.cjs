const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'admin@circular.com',
      password: '123456'
    });
    console.log(res.data);
  } catch (err) {
    console.error('Error status:', err.response ? err.response.status : err.message);
    console.error('Error data:', err.response ? err.response.data : '');
  }
}

test();
