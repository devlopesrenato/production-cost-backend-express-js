function compareCost(a, b) {
    if (a.cost > b.cost)
        return -1;
    if (a.cost < b.cost)
        return 1;
    return 0;
}

exports.compareCost = compareCost;