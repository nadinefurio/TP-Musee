const express = require("express");
const route = require("./route");
const routeUser = require("./route-users")
const routeConnexion = require("./route-connexion")
const { connect } = require("mongoose");
require("dotenv").config(); 


const URI = process.env.NODE_ENV === "production" ? process.env.BDD_PROD : process.env.BDD_DEV

connect(URI)
//connect(URI , { useNewUrlParser : true})
    .then(() => console.log("connexion à MongoDB réussie"))
    .catch((ex) => console.log(ex))


const PORT = 4003 ;

const app = express()

app.use(express.json()) ;

//app.use(toutesLesOeuvres);
//app.use(rechercheOeuvre) ;
app.use("/" , routeConnexion) ;
app.use("/" , route);
app.use("/user" , routeUser);



app.listen(PORT , () => console.log(`express start sur port ${PORT}`));



