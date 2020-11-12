
//looks up a specific user in the users object based on their email
function getUserByEmail(email, database) {

  for (let userIdKey in database) {
    if (database[userIdKey].email === email) {
      return userIdKey;
    }
  };
};

module.exports = {
  getUserByEmail
};