const movieHelpers=require('../helpers/movie-Helpers')
var objectId=require('mongodb').ObjectID


module.exports={
    adminHomePage: function(req, res) {
      res.render('admin/add-movie',{admin:true});
    },
    adminaddMovie:(req,res)=>{
      console.log(req.body);
      console.log(req)
      movieHelpers.addMovie(req.body,(Id)=>{
      let image=req.files.image
        console.log(Id);
        image.mv('./public/images/posters/'+Id+'.jpg',(err)=>{
          if(!err){
            res.render('admin/add-movie',{admin:true})
          }else{
            console.log(err)
          }
        })
      })
      res.redirect('/admin'); 
    },
    viewMovie:(req,res)=>{
      movieHelpers.viewMovie().then((allMovies)=>{
        res.render('admin/view-movies',{admin:true,allMovies})
      })
    },
    getAddedProducts:async(req,res)=>{
      let addedMovies=await movieHelpers.viewMovie()
      // console.log(addedMovies);
      res.render('admin/view-added-movies',{admin:true,addedMovies});
    },
    movieDelete:(req,res)=>{
      console.log("hello")
      let prodId=req.params.id
      movieHelpers.deleteMovie(prodId)
      res.redirect('/admin');
    },
    editMovie:async(req,res)=>{
      let prodId=req.params.id
      let getMovie=await movieHelpers.editMovie(prodId)
      // console.log("to edit :",getMovie)
      res.render('admin/edit-movie',{getMovie});
    },
    updateMovieDetail:(req,res)=>{
      let id=req.params.id
      console.log("id is: ", id)
      movieHelpers.updateMovie(req.params.id,req.body).then(()=>{
        res.redirect('/admin/added-movies'); 
        if (req.files.Image){
          let image=req.files.Image
          image.mv('./public/images/posters/'+id+'.jpg')
        }
      })
    }
}