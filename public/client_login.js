function onSignIn(googleUser) {
    
    var profile = googleUser.getBasicProfile();
    
    // Useful data for your client-side scripts:
    //console.log('Full Name: ' + profile.getName());
    //console.log('Given Name: ' + profile.getGivenName());
    //console.log('Family Name: ' + profile.getFamilyName());
    //console.log("Image URL: " + profile.getImageUrl());
    //console.log("Email: " + profile.getEmail());
    
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    
    $.post(window.location.protocol + "//" + window.location.host + '/login', {
        profile_id: profile.getId()
    }, (response) => {
        sessionStorage.setItem("user_id", response.user_id);
        //if(response.status === "returning")
            window.location.href = "game.html";
        //else if (response.status === "new")
            //window.location.href = "guess.html";
    });
    
};