
module.exports.day = getday;
module.exports.noon = getnoon;

let today = new Date();

function getday(){

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    
    let day = today.toLocaleDateString("en-US", options);

    return day;
}

function getnoon(){

    let hour = today.getHours();
    let noon = "Morning";
    
    if(hour >= 5 && hour <= 12)  noon = "Morning";
    else if(hour >= 13 && hour <= 17)  noon = "Afternoon";
    else if(hour >= 18 && hour <= 19)  noon = "Evening";
    else noon = "Night";

    return noon;
}
