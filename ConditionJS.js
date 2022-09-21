// xxx is xxx and (xxx is xxx or xxx in (xxx, xxx) or xxx is not xxx ) and xxx in ( xxx, xxx)
// '("xxx" is "xxx" and ("xxx" is "xxx" or "xxx" in ("xxx", "xxx") or "xxx" is not "xxx" ) and "xxx" in ( "xxx", "xxx"))'
// '["xxx" is "xxx", and, ("xxx" is "xxx" or "xxx" in ("xxx", "xxx") or "xxx" is not "xxx" ), and, "xxx" in ( "xxx", "xxx")]'

var tql = '"xxx" is "xxx" and "xxx" is "xxx" and "xxx" is "xxx" and '
    + '("xxx" is "xxx" or "xxx" in ("xxx", "xxx") or ("xxx" is not "xxx" and "xxx" is not "xxx")) and "xxx" in ( "xxx", "xxx")'
var keywords = [' and ', ' or ',]
var conditionKeys = [' is ', ' is not ', ' in ', ' not in ', ' contains ', ' not contains ']
var patterns = keywords.map(kmpPattern)
var keyPatterns = conditionKeys.map(kmpPattern)
var srcText = tql;


var statusIdxs = Array.from({ length: keywords.length }, () => 0);

var divides = tqlWhereSplit(srcText, keywords)
var Condition = parseTqlWhereArray(divides)

console.log(Condition)





// Function Definition-----------------------------------------------
function parseTqlWhereArray(tqlArray) {
    var conditionKeys = [' is ', ' is not ', ' in ', ' not in ', ' contains ', ' not contains ']
    var andUp = true;
    var orUp = false;
    var list = []
    for (let index = 0; index < tqlArray.length; index++) {
        const element = tqlArray[index];
        if ('and' == element) {
            andUp = true;
            orUp = false;
            continue;
        } else if ('or' == element) {
            orUp = true;
            andUp = false;
            continue;
        }
        if (element instanceof Array) {
            list.push(parseTqlWhereArray(element))
        } else {
            for (let j = 0; j < conditionKeys.length; j++) {
                const key = conditionKeys[j];
                if (element.indexOf(key) == -1) {
                    continue;
                }
                list.push({
                    field: element.substring(0, element.indexOf(key) + 1),
                    key: key.trim(),
                    value: element.substring(element.indexOf(key) + key.length),
                })
                break;
            }
        }
    }
    if (list.length == 1) {
        return list[0];
    } else {
        var result = {};
        if (orUp) {
            result.orConditions = list;
        } else {
            result.andConditions = list;
        }
        return result;
    }
}


function tqlWhereSplit(srcText, patTexts) {

    var nexts = patTexts.map(patText => Array.from({ length: patText.length }, () => 0))
    var statusIndexs = Array.from({ length: patTexts.length }, () => 0);
    nexts.forEach((next, i) => {
        var statusIndex = statusIndexs[i];
        for (var i = 1; i < next.length; i++) {
            while (statusIndex > 0 && next[statusIndex] != next[i]) {
                statusIndex = next[statusIndex - 1];
            }
            if (next[statusIndex] == next[i]) {
                statusIndex++;
            }
            next[i] = statusIndex;
        }
    })

    var divides = []
    var slicerIdx = 0
    var bracketStartIdx = -1;
    var bracketLevel = 0;
    for (var i = 0; i < srcText.length; i++) {
        var srcChar = srcText[i]
        if (srcChar == '(') {
            if (bracketStartIdx == -1) {
                bracketStartIdx = i;
            }
            bracketLevel++;
            continue;
        }
        if (bracketStartIdx != -1) {
            if (srcChar == ')') {
                bracketLevel--;
            }
            if (bracketLevel == 0) {
                var bracketSentence = srcText.substring(bracketStartIdx + 1, i);
                bracketStartIdx = -1;// 重置括号idx

                // 括号内存在 and or 分隔符，则是可用于向下解析的
                if (patTexts.filter((pat) => kmpSearch(bracketSentence, pat) != -1).length > 0) {
                    divides.push(tqlWhereSplit(bracketSentence, patTexts))
                    slicerIdx = i + 1;
                } else {
                    // 是否需要倒回去执行一次 and or 判断
                }
            }
            continue;
        }

        nexts.forEach((next, j) => {
            var patText = patTexts[j];
            while (statusIdxs[j] > 0 && srcChar != patText[statusIdxs[j]]) {
                statusIdxs[j] = next[statusIdxs[j] - 1];
            }
            if (srcChar == patText[statusIdxs[j]]) {
                statusIdxs[j]++;
            }

            if (statusIdxs[j] == next.length) {
                // 命中 patterns[stIdx]
                var pre = srcText.substring(slicerIdx, i - (next.length - 1))
                var thePat = srcText.substring(i - (next.length - 1), i + 1)

                slicerIdx = i + 1;
                if (pre.trim()) {
                    divides.push(pre.trim()) // 有值才存储
                }
                divides.push(thePat.trim()) // 存储条件语句
                return i - (statusIdxs[j] - 1);
            }
        })
    }
    if (slicerIdx < srcText.length - 1) {
        divides.push(srcText.substring(slicerIdx).trim())
    }
    return divides
}

function kmpSearch(srcText, patText) {
    var next = Array.from({ length: patText.length }, () => 0);

    var statusIndex = 0;

    for (var i = 1; i < next.length; i++) {
        while (statusIndex > 0 && next[statusIndex] != next[i]) {
            statusIndex = next[statusIndex - 1];
        }
        if (next[statusIndex] == next[i]) {
            statusIndex++;
        }
        next[i] = statusIndex;
    }

    var statusIdx = 0;
    for (var i = 0; i < srcText.length; i++) {
        while (statusIdx > 0 && srcText[i] != patText[statusIdx]) {
            statusIdx = next[statusIdx - 1];
        }

        if (srcText[i] == patText[statusIdx]) {
            statusIdx++;
        }

        if (statusIdx == next.length) {
            return i - (statusIdx - 1);
        }
    }
    return -1;
}

function kmpPattern(patternStr) {
    var next = Array.from({ length: patternStr.length }, () => 0);

    var statusIndex = 0;

    for (var i = 1; i < next.length; i++) {
        while (statusIndex > 0 && next[statusIndex] != next[i]) {
            statusIndex = next[statusIndex - 1];
        }
        if (next[statusIndex] == next[i]) {
            statusIndex++;
        }
        next[i] = statusIndex;
    }

    return next;
}