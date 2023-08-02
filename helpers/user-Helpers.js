var db=require('../config/connection')
const bcrypt=require('bcrypt')
const collections=require('../config/collections')

module.exports={
    userSignIn:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            userDetails.password=await bcrypt.hash(userDetails.password,10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userDetails)
            console.log(userDetails);
        })
    },
    userLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userData)
            let loginStatus=false
            let response={}
            let user= await db.get().collection(collections.USER_COLLECTION).findOne({emailAddress:userData.email})
            if (user){
                console.log(user)
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('success',status);
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("Invalid")
                resolve({status:false})


            }
                
        })
    }
}