const { Router } = require("express")
const {schemaLogin } = require("./verif")
const { User } = require("./model")
const { compare } = require("bcryptjs")
const JWT = require("jsonwebtoken")

const route = Router();

route.post("/login" , async (request , reponse  ) => {
    const { body } = request ;
    const { error } = schemaLogin.validate(body , { abortEarly : false })
    if(error) return reponse.status(400).json(error.details) ;

    const utilisateurRecherche = await User.findOne({email : body.email})

    if(!utilisateurRecherche) return reponse.status(404).json({msg : "aucun profil trouvé à cet id"});
    const verif = await compare(body.password , utilisateurRecherche.password)

    if(!verif) return reponse.status(404).json({msg : "aucun profil trouvé avec cet id"});

    const profilSansMotPass = {
        _id : utilisateurRecherche._id ,
        email : utilisateurRecherche.email ,
        role : utilisateurRecherche.role ? utilisateurRecherche.role : "redacteur"
    }

    const token = JWT.sign(profilSansMotPass , process.env.JWT_CLE_PRIVE);
    
    return reponse.json( {msg : "bienvenue" , token : token })
})

module.exports = route
