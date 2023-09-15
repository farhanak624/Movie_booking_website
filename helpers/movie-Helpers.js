var db=require('../config/connection')

const collections = require('../config/collections')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
const { resolve } = require('path')


module.exports={
    addMovie:(movie,callback)=>{
        db.get().collection(collections.MOVIE_COLLECTION).insertOne(movie).then((data)=>{
            console.log(data.insertedId.toString())
            callback(data.insertedId.toString());
        })
    },
    viewMovie:()=>{
        return new Promise (async(resolve,reject)=>{
            let movies=await db.get().collection(collections.MOVIE_COLLECTION).find().toArray()
            // console.log(movies)
            resolve(movies)
        })
    },
    deleteMovie:(prodId)=>{
        return new Promise((resolve,reject)=>{
            console.log("object id is ",prodId);
            db.get().collection(collections.MOVIE_COLLECTION).deleteOne({_id:new ObjectId(prodId)}).then((data)=>{
                console.log(data);
            })
            resolve()
        })
    },
    editMovie:(prodId)=>{
        return new Promise(async(resolve,reject)=>{
        console.log(prodId);
        let editmovie=await db.get().collection(collections.MOVIE_COLLECTION).findOne({_id:new ObjectId(prodId)})
        console.log("selected movie : " ,editmovie);
        resolve(editmovie)
        })
    },
    updateMovie:(prodId,movieDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.MOVIE_COLLECTION).updateOne({_id:new ObjectId(prodId)},{
                $set:{
                    movie:movieDetails.movie,
                    category:movieDetails.category,
                    genre:movieDetails.genre,
                    duration:movieDetails.duration,
                    about:movieDetails.about
                }
            }).then((response)=>{
                resolve()
            }) 
    
        })
    },
    addToWishlist:(movieId,userId)=>{
        return new Promise(async(resolve,reject)=>{
        
        let getWishlistmovie=await db.get().collection(collections.WISHLIST_COLLECTION).findOne({user:new ObjectId(userId)})
        
        console.log("exist",getWishlistmovie);
        if(getWishlistmovie){
            db.get().collection(collections.WISHLIST_COLLECTION)
            .updateOne(
                {
                    user: new ObjectId(userId),
                    movies:{
                        $ne:new ObjectId(movieId)
                    }
                },
                {
                    $addToSet:{movie:new ObjectId(movieId)}
            })
            resolve({status:true})
        }else{
            let movieObj={
                user:new ObjectId(userId),
                movie:[new ObjectId(movieId)]
            }
            db.get().collection(collections.WISHLIST_COLLECTION).insertOne(movieObj).then((response)=>{
                console.log("response in else : ",response);
                resolve(response)
            })

        }
    
        })
    },
    getWishlist:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let getMovie= await db.get().collection(collections.WISHLIST_COLLECTION).aggregate([
                {
                    $match:{
                        user: new ObjectId(userId)
                    },
                },
                {
                    $lookup:{
                        from:collections.MOVIE_COLLECTION,
                        let:{movieList:'$movie'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$movieList"]
                                    }
                                }
                            }
                        ],
                        as:'movieWishList'
                    }
                }
            ]).toArray()
            resolve(getMovie[0].movieWishList)
            console.log('aggregate : ',getMovie[0].movieWishList)
        
        })
    },
    getWishlistCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let wishCount=0
            let wishlistcount= await db.get().collection(collections.WISHLIST_COLLECTION).findOne({user: new ObjectId(userId)})
            if (wishlistcount){
                wishCount=wishlistcount.movie.length
                console.log("count is",wishCount)
            }
            resolve(wishCount)
        })
    },
    removeWishList:(userId,movieId)=>{
        return new Promise (async(resolve,reject)=>{
            console.log("going to db");
           await db.get().collection(collections.WISHLIST_COLLECTION)
            .updateOne(
                {user: new ObjectId(userId)},
                {$pull:{movie:new ObjectId(movieId)}})

        }).then((response)=>{
            resolve({removeWishList:true})

        })
        
    }  
}  