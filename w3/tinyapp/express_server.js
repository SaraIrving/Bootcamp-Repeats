const express = require('express');
const app = express();
const PORT = 8080; //default port
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(cookieParser()); //A package called cookie-parser serves as Express middleware that facilitates working with cookies. cookie-parser helps us read the values from the cookie. Only using signed cookies!

app.use(bodyParser.urlencoded({extended: true})); //The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body. 

app.set("view engine", "ejs") //set ejs as the view engine 

//sample of what data will look like
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// updated data structure of the urlDatabase
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


// same data of what users will look like
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


// get 6 alphanumeric characters to form the shortURL
function generateRandomString() {
  const options = "1234567890abcdefghijklmnopqrstuvwxyz";
  let shortURL = "";
  for (let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * options.length);
    shortURL += options[index];
  }
  return shortURL;
};


//looks up a specific user in the users object based on their email
function getUserByEmail (email, database) {

  for (let userIdKey in database) {
    if (database[userIdKey].email === email) {
      return userIdKey;
    }
  };
};

// this function returns an object which contains all the urls associated with the userId provided 
function urlsForUser(id, database) {

  let usersURLS = {}

  for (shortURL in database) {
    if(database[shortURL].userID === id) {
      usersURLS[shortURL] = database[shortURL];
    };
  };
  return usersURLS;
};

// determines if the shortURL in question belongs to the currently logged in user, returns a boolean 
function doesShortUrlBelongToUser(id, short, database) {
  for (shortURL in database) {
    if (database[shortURL].userID === id) {
      return true;
    }
  };
  return false;
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

//get json format of urlDatabase data
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// send HTML in the response
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // variable sent to and EJS template must be sent inside an object!
  
  //determine the userID of the logged in user
  const userId = req.cookies.user_id;

  //get only the urls of the logged in user
  const usersURLS = urlsForUser(userId, urlDatabase);

  const templateVars = {urls:  usersURLS, user: users[userId]};
  res.render("urls_index", templateVars);
});

//display the form to create a new shortened url
//needs to be above urls/:shortURL in code so it takes precedence and the 'new' is not mistaken for a short url!
app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const templateVars = {user: users[userId]};

  // if the user is logged in and there is a cookie with their userID present, let them visit the urls_new view
  if (userId) {
    res.render("urls_new", templateVars);
  } else {
    //if they are not signed in, redirect to the login page
    res.redirect("/login");
  };
});

app.get("/urls/:shortURL", (req, res) => {
  // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
  //test in browser and with curl command: curl -i http://localhost:8080/urls/b2xVn2
  const short = req.params.shortURL;
  const long = urlDatabase[short].longURL;
  const userId = req.cookies.user_id;

  //determine if the short url belongs to the currently logged in user, pass this as a boolean to the template
  let urlBelongsToUser = doesShortUrlBelongToUser(userId, short, urlDatabase);

  const templateVars = {shortURL: short, 
    longURL: long, 
    user: users[userId],
    urlBelongsToUser: urlBelongsToUser};

  res.render("urls_show", templateVars);
});

// route to redirect requests made using the shortURL to take the user to the longURL page on the web 
app.get("/u/:shortURL", (req, res) => {
  //shortURL is found in req.params.shortURL!
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  res.redirect(longURL);
});

//route to display the register view
app.get("/register", (req, res) => {
  const templateVars = {user: users[req.cookies.user_id]}

  //render the register view
  res.render("register", templateVars);
});

//route to display the login view
app.get("/login", (req, res) => {
  const templateVars = {user: users[req.cookies.user_id]}

  //render the login view
  res.render("login", templateVars);

})

app.post("/register", (req, res) =>  {
  const email = req.body.email;
  const password = req.body.password;
  const userId = generateRandomString();

  if (email && password) {
    //check if they already exist in users
    if (getUserByEmail(email, users)) {
      res.status(400).send("The email is already in our database!")
    } else {
      // they do not already exist in users
      //create a new user object within the users object
      users[userId] = {id: userId,
        email: email,
        password: password
      };

      //set a new cookie containing the users newly generated ID
      res.cookie("user_id", userId);

      //test users object is being correctly updated
      //console.log("users object in REGISTER = ", users)

      //redirect user to urls view
      res.redirect("/urls");
    };

  } else {
    //if the email or password is blank
    res.status(400).send("Email or Password fields are blank, please complete the form!")
  };
});


//route to EDIT the longURL
app.post("/urls/:id", (req, res) => {
  const short = req.params.id;
  const long = req.body.longURL; // info from inputs in forms are passed along in the request body!!
  const userId = req.cookies.user_id;
  urlDatabase[short] = {longURL: long, userID: userId};

  res.redirect("/urls")
});

// removes URL resource from the My URLS page when delete button is clicked, then redirects to the urls_index view
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortToDelete = req.params.shortURL; 
  delete urlDatabase[shortToDelete];

  res.redirect("/urls");
  //test with: curl -X POST "http://localhost:8080/urls/9sm5xK/delete" or visiting pages and clicking delete in the browser!
});

//make a new shortURL
app.post("/urls", (req, res) => {
  //update urlDatabase with data submitted in the post request
  //longURL is found in req.body
  const short = generateRandomString();
  const long = req.body.longURL;
  const userId = req.cookies.user_id;
  urlDatabase[short] = {longURL: long, userID: userId};
  
  //redirect the user to show the new shortURL that was just generated for them
  res.redirect(`/urls/${short}`);
});


//handles POST request from the login button in the nav bar
app.post("/login", (req, res) => {
  // info from input elements is passed in the request body, key = name attribute of the input element 


  //set cookie with name: username and value: whatever what inputted by the user 
  //res.cookie("", cookieValue);

  //test cookie has been set with: curl -X POST -i localhost:8080/login -d "username=vanillaice"
  //will see set cookie response header 

  const email = req.body.email;
  const password = req.body.password;
  const userId = getUserByEmail(email, users);

  //check that there is a user with the provided email
  if (userId) {
    //check that the password matches what is stored for that user
    if (users[userId].password === password) {
      //if password matches, set a cookie with the userId
      res.cookie("user_id", userId);

      //redirect the user to urls view
      res.redirect("/urls")
    } else {
      res.status(403).send("The password does not match!")
    }
  } else {
    res.status(403).send("There is no user with that email in our database!")
  }

  //redirect user to urls view
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  // clear the cookie named user_id
  res.clearCookie("user_id");

  // redirect user to the urls view 
  res.redirect("/urls");

  // test logout with: curl -X POST -i localhost:8080/logout

});




// access via curl request in command line with: curl -i http://localhost:8080/hello

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

