const { response } = require("../../app")

function addToWishlist(movieId){
    $.ajax({
        url:'/add-to-wishlist/'+movieId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#wish-count').html()
                count=parseInt(count)+1
                $("#wish-count").html(count)
            }

        }
    })
}
function removeWishedMovie(movieId){
    $.ajax({
        url:'/remove-from-wishlist/'+movieId,
        method:'get',
        success:(response)=>{
            if(response.removeFromWishlist)
            alert('removed');
            location.reload()
        }  
    })
}
