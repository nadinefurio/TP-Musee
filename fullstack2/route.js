const { Router } = require("express") 
const { Oeuvre } = require("./model");
const { idValid , isValidOeuvre , autorisation , isAdmin } = require("./middleware")

const route = Router();

route.get("/" , function(request , reponse){
    reponse.json({msg : "methode"})
})

// Ajouter une oeuvre => POST => fecth("http://localhost:4003" = envoyer du serveur)
route.post("/" ,  async function (request, reponse){
  try  {const { body } = request;
    const userId = request.user._id;

    const newOeuvre = new Oeuvre({...body , artiste : userId })
    await newOeuvre.save()
    const now = new Date()
    reponse.json({ "msg" : now , "nouvelle oeuvre cree" : newOeuvre });
    } catch(ex) {
        return reponse.status(400).json({msg : "sorti du POST" , error: ex})
    }
})

/**
 {
  _id : 
  "nom" : "string",
  "description" : "string",
  "image" : "url",
  "auteur" : "string",
  "dt_creation" : "date"
 }
 */

 // Récupérer toutes les oeuvres 
 // GET http://localhost:4003/all
 route.get("/all", async (request, reponse) => {
    //const id = request.params.id
    const toutesLesOeuvres = await Oeuvre.find().populate('auteur' , "email - _id role")
    return reponse.json(toutesLesOeuvres);
 })

 route.get("/oeuvre-of-user/:id", async (request , reponse) => {
    const id = request.params.id
    console.log(id);
    const toutesLesOeuvres = await Oeuvre.find({auteur : id}).populate('auteur' , "email - _id role")
    return reponse.json(toutesLesOeuvres);
 })

 //DELETE
// Ajouter des middleware pour DELETE
 route.delete("/:id" , [ autorisation, isAdmin , idValid] , async (request , reponse) => {
    const id = request.params.id ;
    const reponseMongo = await Oeuvre.findByIdAndRemove(id) 

    if(!reponseMongo) return reponse.status(404).json({ msg : `l'oeuvre ${id} n'existe pas`})
    return reponse.json({ msg : `l'oeuvre ${id} est bien supprimée`});
})

// GET http://localhost:4003/id
route.get("/:id" , idValid , async (request , reponse) => {
    const id = request.params.id ;
    const rechercheOeuvre = await Oeuvre.findById(id)

    if(!rechercheOeuvre) return reponse.status(404).json({ msg : `l'oeuvre ${id} n'existe pas` })
    return reponse.json(rechercheOeuvre);
})

// PUT => update sur tous les champs d'une oeuvre (auteur, nom, ...)
route.put("/:id" , [idValid , isValidOeuvre ] , async (request , reponse) => {
    const id = request.params.id ;
    const { body } = request ;

    const oeuvreUpdated = await Oeuvre.findByAndUpdate(id , { $set : body } , { new : true})
    if(!oeuvreUpdated) return reponse.status(404).json({ msg : `l'oeuvre ${id} n'existe pas`});
    return reponse.json(oeuvreUpdated)
})    
    
module.exports = route ;
