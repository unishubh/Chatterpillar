const conn = require('../mySqlConfig');
const { User } = require('../../services/user');

module.exports.getUser = async (fbID) => new Promise((resolve, reject) => {
  conn.query('SELECT * FROM Users WHERE fbid = ?', fbID, (err, data) => {
    if (err) {
      console.log('Could not fetch user ', user_id, 'because', err);
      reject(false);
    } else if (data.length === 0) {
      console.log('No user found for fbID ', fbID);
      resolve(0);
    } else {
      const [d] = data;
      console.log('Unique user found for ', fbID);
      const user = new User(fbID);
      user.firstName = d.name.substring(0, d.name.indexOf(' '));
      user.lastName = d.name.substring(d.name.indexOf(' '));
      user.email = d.email;
      user.phone = d.phone;
      user.gender = d.gender;
      user.email = d.email;
      resolve(user);
    }
  });
});
