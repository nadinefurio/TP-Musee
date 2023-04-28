const { isValidObjectId } = require("mongoose")
const { schemaOeuvreJoiUser } = require("./verif")
const JWT = require("jsonwebtoken")


function idValid (request , reponse , next){
    const id = request.params.id ;
    if(!isValidObjectId(id)) return reponse.status(400).json({msg : `l'id ${id} n'est pas valide pour MongoDB`})
    return next();
}

function isValidOeuvre (request , reponse , next) {
    const { body } = request ;
    const { error } = schemaOeuvreJoi.validate(body , { abortEarly : false})
    if(error) return reponse.status(400).json(error.details)
    return next();
}

// Récupérer l'info envoyée dans le header de la requete http
function autorisation (request , reponse , next) {
    const token = request.header("x-token")
    
    if(!token) return reponse.status(401).json({msg : "vous devez avoir un JWT pour effectuer cette action"})
    try{
        const payload = JWT.verify(token , process.env.JWT_CLE_PRIVE)
        request.user = payload
        console.log("autorisation réussie !")
        return next();
    }
    catch(ex){
        return reponse.status(400).json({msg : "JWT invalid" , payload : payload })
    }
}

// erreur 401 = Unauthorized
// erreur 400 = Bad request

function isAdmin(request , reponse , next){
    if(request.user.role !== "admin") return reponse.status(403).json({msg : "vous n'avez pas les droits admin"})
    return next();
}

module.exports.idValid = idValid
module.exports.isValidOeuvre = isValidOeuvre
module.exports.autorisation = autorisation
module.exports.isAdmin = isAdmin

