
//looks up a specific user in the users object based on their email
function getUserByEmail(email, database) {

  for (let userIdKey in database) {
    if (database[userIdKey].email === email) {
      console.log("IN FUNCTION, return = ", database[userIdKey])
      return database[userIdKey];
    }
  };
};

module.exports = {
  getUserByEmail
};