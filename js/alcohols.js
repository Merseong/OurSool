/**
 *
 */
var AlcoholCodes = AlcoholCodes || {};

AlcoholCodes.alcoholListForTest = [];

AlcoholCodes.breweryCodes = {
    "NO DATA": 0,
    이백집: 1
};

AlcoholCodes.classifyCodes = [
    {
        large: "NO DATA",
        smallList: []
    },
    {
        large: "막걸리",
        smallList: [
            { name: "NO DATA", count: 0 },
            { name: "생", count: 0 },
            { name: "살균", count: 0 }
        ]
    }
];

/**
 *
 */
var AlcoholFunction = AlcoholFunction || {};

AlcoholFunction.getBreweryCode = function(name) {
    let output = 0;
    if (AlcoholCodes.breweryCodes.hasOwnProperty(name)) {
        output = AlcoholCodes.breweryCodes[name];
    } else {
        AlcoholCodes.breweryCodes[name] = Object.keys(
            AlcoholCodes.breweryCodes
        ).length;
        output = AlcoholCodes.breweryCodes[name];
    }
    return output;
};

AlcoholFunction.addClassifyCode = function(largeStr, smallStr) {
    const largeIdx = AlcoholCodes.classifyCodes.findIndex(function(element) {
        return element.large === largeStr;
    });
    if (largeIdx != -1) {
        const smallIdx = AlcoholCodes.classifyCodes[
            largeIdx
        ].smallList.findIndex(function(element) {
            return element.name === smallStr;
        });
        if (smallIdx != -1) {
            console.error("이미 존재하는 술 카테고리입니다.");
        } else {
            AlcoholCodes.classifyCodes[largeIdx].smallList.push({
                name: smallStr,
                count: 0
            });
        }
    } else {
        AlcoholCodes.classifyCodes.push({
            large: largeStr,
            smallList: [
                {
                    name: "NO DATA",
                    count: 0
                },
                {
                    name: smallStr,
                    count: 0
                }
            ]
        });
    }
};

AlcoholFunction.addClassifyCount = function(large, small) {
    return AlcoholCodes.classifyCodes[large].smallList[small].count++;
};

AlcoholFunction.getAlcoholCode = function(alc) {
    let output = 0;
    try {
        output += alc.classifyLarge * 10000000000;
        output += alc.classifySmall * 10000000;
        output += alc.degree * 100000;
        if (Object.values(alc.title)[0] != undefined)
            output += (Object.values(alc.title)[0].charCodeAt(0) % 100) * 1000;
        output += alc.classifyIndex;
    } catch (e) {
        console.error(e);
    }
    return output;
};

AlcoholFunction.parseAlcoholCode = function(alcCode, isLargeVal) {
    var large = Math.round(alcCode / 1000);
    var small = alcCode % 1000;

    let output = isLargeVal ? large : small;
    return output;
};

/**
 *
 */
class Alcohol {
    constructor(_titles, _degree, _brewery, _classify) {
        this.title = {};
        _titles.forEach(function(element) {
            this.addTitle(element.lang, element.title);
        }, this);
        this.degree = _degree;
        this.brewery = AlcoholFunction.getBreweryCode(_brewery);

        let _classifyL = AlcoholFunction.parseAlcoholCode(_classify, true);
        let _classifyS = AlcoholFunction.parseAlcoholCode(_classify, false);
        this.classifyLarge = _classifyL; // 00
        this.classifySmall = _classifyS; // 000
        this.classifyIndex = AlcoholFunction.addClassifyCount(
            _classifyL,
            _classifyS
        ); // 000

        this.alcoholCode = AlcoholFunction.getAlcoholCode(this);

        this.additional = {};
    }

    serialize() {
        //console.table(Object.entries(this));
        return Object.entries(this);
    }

    deserialize(obj) {
        try {
            obj.forEach(function(element) {
                this[element[0]] = element[1];
            }, this);
        } catch (e) {
            console.error(e);
        }
    }

    addTitle(lang, title) {
        let counter = 1;
        if (!this.title.hasOwnProperty(lang)) {
            Object.defineProperty(this.title, lang, { value: title });
        } else {
            while (this.title.hasOwnProperty(lang + counter)) {
                counter++;
                console.log(lang + counter);
                console.log(this.title.hasOwnProperty(lang + counter));
                if (counter > 1000) break;
            }
            Object.defineProperty(this.title, lang + counter, { value: title });
        }
    }
}
