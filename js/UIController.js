function uiController() {
    this.init();
    this.initEvent();
}

uiController.prototype.init = function() {
    this.boxKrTitle = document.getElementById("boxKrTitle");
    this.inputKrTitle = document.getElementById("inputKrTitle");
    this.boxEnTitle = document.getElementById("boxEnTitle");
    this.inputEnTitle = document.getElementById("inputEnTitle");

    this.selectClassify = document.getElementById("selectClassify");
    this.btnModalClassifyAdder = document.getElementById(
        "btnModalClassifyAdder"
    );

    this.inputDegree = document.getElementById("inputDegree");
    this.inputBrewery = document.getElementById("inputBrewery");

    this.btnSave = document.getElementById("btnSave");
};

uiController.prototype.initEvent = function() {
    document.onkeydown = function(e) {
        if (e.keyCode === 27 && confirm("LogOut?")) {
            fbMain.auth.signOut();
        }
    };
    this.refreshClassifyOption();
    this.btnSave.addEventListener("click", this.onSaveBtnClicked.bind(this));
    this.btnModalClassifyAdder.addEventListener(
        "click",
        this.onModalClassifyAdderBtnClicked.bind(this)
    );
};

uiController.prototype.refreshClassifyOption = function() {
    var inner = "<option selected value=0>선택하세요...</option>";
    for (let i = 1; i < AlcoholCodes.classifyCodes.length; i++) {
        inner +=
            '<optgroup label="' + AlcoholCodes.classifyCodes[i].large + '">';
        for (
            let j = 1;
            j < AlcoholCodes.classifyCodes[i].smallList.length;
            j++
        ) {
            inner +=
                "<option value=" +
                (i * 1000 + j) +
                ">" +
                AlcoholCodes.classifyCodes[i].smallList[j].name +
                " " +
                AlcoholCodes.classifyCodes[i].large +
                "</option>";
        }
        inner += "</optgroup>";
    }
    this.selectClassify.innerHTML = inner;
};

uiController.prototype.onSaveBtnClicked = function() {
    var titles = [];
    var degree = this.inputDegree.value;
    var brewery =
        this.inputBrewery.value.length != 0
            ? this.inputBrewery.value
            : "NO DATA";
    var code = this.selectClassify.options[this.selectClassify.selectedIndex]
        .value;

    var boxTitles = document.getElementsByName("boxTitle");
    var inputTitles = document.getElementsByName("inputTitle");
    let isTitled = false;
    for (let i = 0; i < boxTitles.length; i++) {
        if (boxTitles[i].checked && inputTitles[i].value.length != 0) {
            isTitled = true;
            titles.push({
                lang: inputTitles[i].placeholder,
                title: inputTitles[i].value
            });
        }
    }

    if (degree == 0 || !isTitled || code == 0) {
        alert("모든 폼을 채워주시기 바랍니다.");
        return;
    } else {
        if (AlcoholCodes.alcoholListForTest == undefined)
            AlcoholCodes.alcoholListForTest = [];
        AlcoholCodes.alcoholListForTest.push(
            new Alcohol(titles, parseFloat(degree), brewery, parseInt(code))
        );
        console.table(
            AlcoholCodes.alcoholListForTest[
                AlcoholCodes.alcoholListForTest.length - 1
            ]
        );
    }
};

uiController.prototype.onModalClassifyAdderBtnClicked = function() {
    var largeStr = document.getElementById("inputModalLarge").value;
    var smallStr = document.getElementById("inputModalSmall").value;

    AlcoholFunction.addClassifyCode(largeStr, smallStr);
    // 여기서 서버에 업로드
    // 이후 then으로 업로드 완료시 refresh
    this.refreshClassifyOption();

    document.getElementById("inputModalLarge").value = "";
    document.getElementById("inputModalSmall").value = "";
    $("#modalClassifyAdder").modal("hide");
};

document.addEventListener("DOMContentLoaded", function() {
    window.fbMain = new FirebaseMain();

    window.UICont = new uiController();

    console.log("done load");
});
