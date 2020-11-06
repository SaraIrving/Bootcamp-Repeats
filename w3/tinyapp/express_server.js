const express = require('express');
const app = express();
const PORT = 8080; //default port
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true})); //The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body. 

app.set("view engine", "ejs") //set ejs as the view engine 

//sample of what data will look like
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const templateVars = {urls:  urlDatabase};
  res.render("urls_index", templateVars);
});

//display the form to create a new shortened url
//needs to be above urls/:shortURL in code so it takes precedence and the 'new' is not mistaken for a short url!
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  // Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
  //test in browser and with curl command: curl -i http://localhost:8080/urls/b2xVn2
  const short = req.params.shortURL;
  const long = urlDatabase[short];
  const templateVars = {shortURL: short, longURL: long};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log('req.body =', req.body);
  //update urlDatabase with data submitted in the post request
  const short = generateRandomString();
  const long = req.body.longURL;
  urlDatabase[short] = long;
  console.log('updated database = ', urlDatabase)
  res.redirect(`/urls/${short}`);
});



// access via curl request in command line with: curl -i http://localhost:8080/hello

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

