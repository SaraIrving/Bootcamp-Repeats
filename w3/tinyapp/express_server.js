const express = require('express');
const app = express();
const PORT = 8080; //default port
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(cookieParser()); //A package called cookie-parser serves as Express middleware that facilitates working with cookies. cookie-parser helps us read the values from the cookie. Only using signed cookies!

app.use(bodyParser.urlencoded({extended: true})); //The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body. 

app.set("view engine", "ejs") //set ejs as the view engine 

//sample of what data will look like
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const templateVars = {urls:  urlDatabase, username: req.cookies.username};
  res.render("urls_index", templateVars);
});

//display the form to create a new shortened url
//needs to be above urls/:shortURL in code so it takes precedence and the 'new' is not mistaken for a short url!
app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies.username}
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
  //test in browser and with curl command: curl -i http://localhost:8080/urls/b2xVn2
  const short = req.params.shortURL;
  const long = urlDatabase[short];
  const templateVars = {shortURL: short, longURL: long, username: req.cookies.username};
  res.render("urls_show", templateVars);
});

// route to redirect requests made using the shortURL to take the user to the longURL page on the web 
app.get("/u/:shortURL", (req, res) => {
  //shortURL is found in req.params.shortURL!
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  res.redirect(longURL);
});

//route to display the register view
app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies.username}

  //render the register view
  res.render("register", templateVars);
});

app.post("/register", (req, res) =>  {
  const email = req.body.email;
  const password = req.body.password;
  const userId = generateRandomString();

  //create a new user object within the users object
  users[userId] = {id: userId,
                    email: email,
                    password: password
                  };
  
  //set a new cookie containing the users newly generated ID
  res.cookie("user_id", userId);

  //test users object is being correctly updated
  console.log("users object in REGISTER = ", users)

  //redirect user to urls view
  res.redirect("/urls");
});

//route to EDIT the longURL
app.post("/urls/:id", (req, res) => {
  const short = req.params.id;
  const long = req.body.longURL; // info from inputs in forms are passed along in the request body!!
  urlDatabase[short] = long;

  res.redirect("/urls")
});

// removes URL resource from the My URLS page when delete button is clicked, then redirects to the urls_index view
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortToDelete = req.params.shortURL; 
  delete urlDatabase[shortToDelete];

  res.redirect("/urls");
  //test with: curl -X POST "http://localhost:8080/urls/9sm5xK/delete" or visiting pages and clicking delete in the browser!
});


app.post("/urls", (req, res) => {
  //update urlDatabase with data submitted in the post request
  //longURL is found in req.body
  const short = generateRandomString();
  const long = req.body.longURL;
  urlDatabase[short] = long;
  
  //redirect the user to show the new shortURL that was just generated for them
  res.redirect(`/urls/${short}`);
});


//handles POST request from the login button in the nav bar
app.post("/login", (req, res) => {
  // info from input elements is passed in the request body, key = name attribute of the input element 
  const cookieValue = req.body.username;

  //set cookie with name: username and value: whatever what inputted by the user 
  res.cookie("username", cookieValue);

  //test cookie has been set with: curl -X POST -i localhost:8080/login -d "username=vanillaice"
  //will see set cookie response header 

  //redirect user to urls view
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  // clear the cookie named username
  res.clearCookie("username");

  // redirect user to the urls view 
  res.redirect("/urls");

  // test logout with: curl -X POST -i localhost:8080/logout

});




// access via curl request in command line with: curl -i http://localhost:8080/hello

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

