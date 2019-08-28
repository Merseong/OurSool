function uiController() {
    this.init();
    this.initEvent();
}

uiController.prototype.init = function() {
    this.boxKrTitle = document.getElementById("btnSave");
    this.inputKrTitle = document.getElementById("btnSave");
    this.boxEnTitle = document.getElementById("btnSave");
    this.inputEnTitle = document.getElementById("btnSave");
    this.selectClassify = document.getElementById("selectClassify");
    this.inputDegree = document.getElementById("btnSave");
    this.inputBrewery = document.getElementById("btnSave");
};

uiController.prototype.initEvent = function() {
    document.onkeydown = function(e) {
        if (e.keyCode === 27 && confirm("LogOut?")) {
            fbMain.auth.signOut();
        }
    };
    this.refreshClassifyOption();
    document
        .getElementById("btnSave")
        .addEventListener("click", this.onSaveBtnClicked.bind(this));
};

uiController.prototype.refreshClassifyOption = function() {
    var inner = "<option selected>선택하세요...</option>";
    for (let i = 1; i < AlcoholCodes.classifyCodes.length; i++) {
        inner +=
            '<optgroup label="' + AlcoholCodes.classifyCodes[i].large + '">';
        for (
            let j = 1;
            j < AlcoholCodes.classifyCodes[i].smallList.length;
            j++
        ) {
            inner +=
                "<option>" +
                AlcoholCodes.classifyCodes[i].smallList[j].name +
                " " +
                AlcoholCodes.classifyCodes[i].large +
                "</option>";
        }
        inner += "</optgroup>";
    }
    this.selectClassify.innerHTML = inner;
};

uiController.prototype.onSaveBtnClicked = function() {};

document.addEventListener("DOMContentLoaded", function() {
    window.fbMain = new FirebaseMain();

    window.UICont = new uiController();

    console.log("done load");
});
