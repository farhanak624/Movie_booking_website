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
    getHome:async(req,res)=>{
        
        let movieWishListcount =null
        if(user=req.session.user){
        movieWishListcount = await movieHelpers.getWishlistCount(req.session.user._id)
        } 
        // console.log("count home", movieWishListcount)
        // console.log("user is: ",user)
        movieHelpers.viewMovie().then((allMovies)=>{
        res.render('user/Home',{admin:false,allMovies,user,movieWishListcount})
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
    addToWishlist:async(req,res)=>{
        console.log("api call");
        movieId=req.params.id
        userId=req.session.user._id
        await movieHelpers.addToWishlist(movieId,userId).then(()=>{
        res.json({status:true})
        // res.send(req.flash('Added wishlist'));

        })
    },
    getwishlist:async(req,res)=>{
        userId = req.session.user._id
        user=req.session.user
        let wishlistedMovies=await  movieHelpers.getWishlist(userId)
        console.log("wishlisted movies:", wishlistedMovies)
        res.render('user/wishlist',{admin:false, wishlistedMovies,user})
    },
    getUserDetails:(req,res)=>{
        userId = req.session.user._id
        userDetails=req.session.user
        res.render('user/user-profile',{admin:false,userDetails})
    },
    removeFromWishlist:(req,res)=>{
        userId = req.session.user._id
        movieId=req.params.id
        movieHelpers.removeWishList(userId,movieId).then((response)=>{
        console.log("success",response);
        alert('deleted')
        res.json(response)
        })
    }
}