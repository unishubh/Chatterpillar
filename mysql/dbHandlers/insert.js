const conn = require('../mySqlConfig');

module.exports.insertUser = (name, fbID, email, phone, gender) => {
  const data = [name, fbID, email, phone, gender];
  conn.query('INSERT INTO Users (name, fbid, email, phone, gender) VALUES (?,?,?,?,?)', data, (err, result) => {
    if (err) {
      console.log('Could not save data for user ', name, 'because', err);
    } else {
      console.log('Successfully saved user ', name);
    }
  });
};

module.exports.insertMessage = (userId, type, message) => {
  const data = [userId, type, message];
  conn.query('INSERT INTO Messages (user_id, type, message) VALUES (?,?,?)', data, (err, result) => {
    if (err) {
      console.log('Could not save message for user ', userId, 'because', err);
    } else {
      console.log('Successfully saved message for user ', userId, result);
    }
  });
};

module.exports.insertServiceRequest = async (userId, details) => new Promise((resolve, reject) => {
  const data = [userId, details];
  conn.query('INSERT INTO Service_requests (user_id, details) VALUES (?,?)', data, (err, result) => {
    if (err) {
      console.log('Could not save service request for user ', userId, 'because', err);
      reject(false);
    } else {
      console.log('Successfully saved message for user ', userId);
      resolve(true);
    }
  });
});

// eslint-disable-next-line max-len
module.exports.insertInvestmentAccountRequest = async (userId, dob, address, mobile, email, nominee, bank, pan, ifsc) => new Promise((resolve, reject) => {
  const data = [userId, dob, address, mobile, email, nominee, bank, pan, ifsc];
  conn.query('INSERT INTO Investment_account (user_id, dob, address, mobile, email, nominee, bank, pan, ifsc) VALUES (?,?,?,?,?,?,?,?,?)', data, (err, result) => {
    if (err) {
      console.log('Could not save investment account  request for user ', userId, 'because', err);
      reject(false);
    } else {
      console.log('Successfully saved investment account request for user ', userId);
      resolve(true);
    }
  });
});

// eslint-disable-next-line max-len
module.exports.insertAssistanceRequest = async (userId, email, phone, city, details) => new Promise((resolve, reject) => {
  const data = [userId, email, phone, city, details];
  conn.query('INSERT INTO Assistance_requests (user_id, email, phone, city, details) VALUES (?,?,?,?,?)', data, (err, result) => {
    if (err) {
      console.log('Could not save assistance request  request for user ', userId, 'because', err);
      reject(false);
    } else {
      console.log('Successfully saved assistance request request for user ', userId);
      resolve(true);
    }
  });
});
