const helpers = {};

helpers.randomNumber = () => {
    let possible = 'qwertyuiopasdfghjklmnbvcxz1234567890';
    let random = 0;

    for(var i=0; i<6; i++){
        random += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return random; 
}

module.exports = helpers;
