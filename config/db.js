const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    // user: 'usr_srch',
    // password: 'b*|ZtsAO.l,IV-Os',
    database: 'activity_tracker'
  },
  listPerPage: 50,
};
module.exports = config;