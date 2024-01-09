exports.isTourObj = function(obj){
    if(
        typeof obj === "object"
        && "location" in obj
        && "startDate" in obj
        && "endDate" in obj
        && "price" in obj
    ){
        return true
    }
    return false
}