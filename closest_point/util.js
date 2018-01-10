// From https://bl.ocks.org/mbostock/8027637
function get_closest_point(path_node, point) {
    function distance2(p) {
        var dx = p.x - point[0],
            dy = p.y - point[1];
        return dx * dx + dy * dy;
    }

    var pathLength = path_node.length(),
        precision = 8,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        if ((scanDistance = distance2(scan = path_node.pointAt(scanLength))) < bestDistance) {
            best = scan, bestLength = scanLength, bestDistance = scanDistance;
        }
    }

    // binary search for precise estimate
    precision /= 2;
    while (precision > 0.5) {
        var before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = path_node.pointAt(beforeLength))) < bestDistance) {
            best = before, bestLength = beforeLength, bestDistance = beforeDistance;
        } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = path_node.pointAt(afterLength))) < bestDistance) {
            best = after, bestLength = afterLength, bestDistance = afterDistance;
        } else {
            precision /= 2;
        }
    }

    best = [best.x, best.y];
    best.distance = Math.sqrt(bestDistance);
    best.length = bestLength;
    return best;
}

// Fills a segment of a path
function update_path_segment_attributes(path, total, begin, end) {
    path.attr('stroke-dasharray', total + ', ' + begin + ', ' + (end - begin));
    path.attr('stroke-dashoffset', total);
}
