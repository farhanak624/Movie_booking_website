var express = require('express');
var router = express.Router();
var userControl=require('../Controllers/userControllers');
const movieHelpers = require('../helpers/movie-Helpers');


/* GET users listing. */
router.get('/',userControl.verifyLogin,userControl.getHome);

router.get('/signin',userControl.getUserSignin)

router.post('/signup',userControl.userSignIn)

router.get('/login',userControl.getuserLogin)

router.post('/login',userControl.doLogin)

router.get('/logout',userControl.userLogout)

router.get('/add-to-wishlist/:id',userControl.addToWishlist)

router.get('/get-wishlist',userControl.verifyLogin,userControl.getwishlist)

router.get('/get-profile',userControl.verifyLogin,userControl.getUserDetails)

router.get('/remove-from-wishlist/:id',userControl.verifyLogin,userControl.removeFromWishlist)

module.exports = router;