class User {
  constructor(psid) {
    this.psid = psid;
    this.firstName = '';
    this.lastName = '';
    this.locale = '';
    this.timezone = '';
    this.gender = 'neutral';
    this.email = '';
    this.isMember = false;
    this.risk = '';
    this.roi = 0;
    this.secondLastCommand = '';
    this.lastCommand = '';
    this.presentCommand = '';
  }

  setProfile(profile) {
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.locale = profile.locale;
    this.timezone = profile.timezone;
    this.presentCommand = 'NUX';
    if (profile.gender) {
      this.gender = profile.gender;
    }
    if (profile.email) {
      this.email = profile.email;
    }
  }

  setRoi(roi) {
    this.roi = roi;
  }

  setLastCommand(command) {
    this.lastCommand = command;
  }

  setPresentCommand(command) {
    this.presentCommand = command;
  }
}
const users = {};
const getUser = (psid) => users[psid];
module.exports = {
  User,
  getUser,
  users,
};
