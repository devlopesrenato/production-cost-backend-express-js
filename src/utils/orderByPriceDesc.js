function comparePrice(a, b) {
    if (a.price > b.price)
        return -1;
    if (a.price < b.price)
        return 1;
    return 0;
}

exports.comparePrice = comparePrice;