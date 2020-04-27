/* eslint-disable linebreak-style */
require('dotenv').config();
const app = require('./app');
const db = require('./helpers/mongoose');
const PORT = process.env.PORT || 3000;
const figlet = require('figlet');

db.connect().then(() => {
  console.log('\x1b[1;30;42m Connected to DB \x1b[0m');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  figlet.text('TEAMIE',
      function(err, data) {
        if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
        }
        console.log(data);
      });
}).catch((err) => {
  console.error(`\x1b[1;37;41m DB Error: ${err.message} \x1b[0m`);
});

