// Build connection data to take advantage of the different users we created.

module.exports = {
  restReader: {
    host: 'localhost',
    port: 6000,
    user: 'my-reader-user',
    password: 'training'
  },
  restWriter: {
    host: 'localhost',
    port: 6000,
    user: 'my-writer-user',
    password: 'training'
  },
  restAdmin: {
    host: 'localhost',
    port: 6000,
    user: 'my-admin-user',
    password: 'training'
  }
};
