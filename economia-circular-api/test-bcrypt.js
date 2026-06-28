const bcrypt = require('bcrypt');

async function test() {
  try {
    const hash = '$2b$10$lbUKnzLE88jS.8hJBWPhKePNq2..G1t6HZwo0oBYJ0.DK.y7MmxMu';
    const pass = '123456';
    const match = await bcrypt.compare(pass, hash);
    console.log('Match:', match);
  } catch (err) {
    console.error('Bcrypt Error:', err);
  }
}

test();
