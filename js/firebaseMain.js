function FirebaseMain() {
    this.init();
    this.initEvent();
}

FirebaseMain.prototype.init = function() {
    this.auth = firebase.auth();
    this.googleBtn = document.getElementById("googleBtn");
};

FirebaseMain.prototype.initEvent = function() {
    this.auth.onAuthStateChanged(this.onAuthChange.bind(this));

    this.googleBtn.addEventListener("click", this.onGoogleBtnClick.bind(this));
};

FirebaseMain.prototype.onAuthChange = function(user) {
    if (user) {
        console.log("Login");
        this.setLogin();
    } else {
        console.log("LogOut");
        this.setLogOut();
    }
};

FirebaseMain.prototype.setLogin = function() {
    this.db = firebase.firestore();

    $("#modalLogin").modal("hide");
    document.getElementById("dvLoginSelect").style.display = "none";
    document.getElementById("dvAlcAdder").style.display = "block";

    this.getBrewery();
};

FirebaseMain.prototype.setLogOut = function() {
    document.getElementById("dvLoginSelect").style.display = "block";
    document.getElementById("dvAlcAdder").style.display = "none";
};

FirebaseMain.prototype.onGoogleBtnClick = function() {
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    this.auth
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(
            function() {
                this.auth
                    .signInWithPopup(googleProvider)
                    .then(function(result) {
                        console.log("google", result);
                    })
                    .catch(function(error) {
                        console.error("error", error);
                    });
            }.bind(this)
        )
        .catch(function(error) {
            console.error("인증 상태 설정 중 에러 발생", error);
        });
};

FirebaseMain.prototype.getBrewery = function() {
    var dbData = [{ idx: 0, name: "NO DATA" }];
    this.db
        .collection("brewery")
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                dbData.push(doc.data());
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    AlcoholCodes.breweryCodes = dbData;
};

FirebaseMain.prototype.addBrewery = function(_brewery) {
    this.db
        .collection("brewery")
        .add(_brewery)
        .catch(function(error) {
            console.log("Error adding documents: ", error);
        });

    this.getBrewery();
};

FirebaseMain.prototype.getAlcohols = function() {};

FirebaseMain.prototype.addAlcohols = function(alc) {};
