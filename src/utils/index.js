exports.isEmpty = (item) => {
    if (item === "" || item === null || item === "null" || item === undefined || item === "undefined" || this.isSpace(item)) {
        return (true)
    } else {
        return (false)
    }
}

exports.isSpace = (item) => {
    var test = '';
    for (let i = 1; i <= item.length; i++) {
        test += ' '
    }
    if (item === test) {
        return (true)
    } else {
        return (false)
    }
}

exports.isZeroOrLess = (item) => {
    if (item === 0 || item === "0" || item < 0 || item < "0" || this.isSpace(item)) {
        return (true)
    } else {
        return (false)
    }
}

