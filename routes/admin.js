var express = require('express');
var router = express.Router();
const adminControl=require('../Controllers/adminControllers')

// Admin router 

router.get('/admin',adminControl.adminHomePage);

router.post('/admin-add-movie',adminControl.adminaddMovie);

router.get('/admin/view-movies',adminControl.viewMovie);

router.get('/admin/added-movies',adminControl.getAddedProducts)

router.get('/adminEditMovie/:id',adminControl.editMovie) 
 
router.post('/adminEditMovie/:id',adminControl.updateMovieDetail) 

router.get('/admin-delete-movie/:id',adminControl.movieDelete)

    

module.exports = router;