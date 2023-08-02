const userHelper=require('../helpers/user-Helpers')
const movieHelpers=require('../helpers/movie-Helpers')
var objectId=require('mongodb').ObjectID

const { response } = require('../app')
const { log } = require('console')


module.exports={
    verifyLogin:(req,res,next)=>{
        if(req.session.user){
            next()
        }else{
            res.redirect('/login')
        }
    },
    getHome:(req,res)=>{
        console.log('hi')
        let user=req.session.user;
        // console.log("user is: ",user)
        movieHelpers.viewMovie().then((allMovies)=>{
        res.render('user/Home',{admin:false,allMovies,user})
    })
    },
    getUserSignin:(req,res)=>{
        res.render('user/signUp',{admin:false});
    },
    userSignIn:(req,res)=>{
        // console.log(req.body);
        userHelper.userSignIn(req.body);
        res.redirect('/');

    },
    getuserLogin:(req,res)=>{
        if(req.session.user){
            res.redirect('/')
        }else{
            res.render('user/login',{"loginErr":req.session.userlogginErr})
            req.session.userLoginErr=false
        }
    },
    doLogin:(req,res)=>{
        userHelper.userLogin(req.body).then((response)=>{
            if(response.status){
                req.session.user=response.user
                req.session.user.loggenIn=true
                console.log("user details:",req.session.user)
                res.redirect('/');
            }else{
                console.log('inside else')
                req.session.userlogginErr="Error invalid Credentials"
                res.redirect('/login');
            }
        })
    },
    userLogout:(req,res)=>{
        req.session.user=null;
        res.redirect('/');
    },
    addToWishlist:(req,res)=>{
        movieId=req.params.id
        userId=req.session.user._id
        movieHelpers.addToWishlist(movieId,userId)
        res.redirect('/');
    },
    getwishlist:(req,res)=>{
        userId = req.session.user._id
        console.log("movie and user Id: ",userId)
        let wishlistedMovies= movieHelpers.getWishlist(userId)
        res.render('user/wishlist',{admin:false, wishlistedMovies})
    }
}