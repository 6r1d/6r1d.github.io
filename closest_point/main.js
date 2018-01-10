function get_svg_draw_center(draw) {
    let viewbox = draw.viewbox();
    let width = viewbox.width;
    let height = viewbox.height;
    return({
        x: width / 2,
        y: height / 2
    });
}

function example_1() {
    var draw = SVG('d1');
    let center = get_svg_draw_center(draw);
    let color = '#ff0066';

    // Changing line
    var line = draw
        .line(center.x, center.y, center.x, center.y)
        .stroke({ width: 1, color: color });

    // Circle in center
    var circle = draw.circle(10).fill(color);
    circle.center(center.x, center.y);

    // Update on mousemove
    draw.mousemove(function(event) {
        line.plot([
            [center.x, center.y],
            [event.offsetX, event.offsetY]
        ]);
    });
}

function example_2() {
    var draw = SVG('d2');
    let center = get_svg_draw_center(draw);
    let color = '#ff0066';

    // Changing line
    var line = draw
        .line(center.x, center.y, center.x, center.y)
        .stroke({ width: 1, color: color });

    // Circle in center
    var circle = draw.circle(10).fill(color);
    circle.center(center.x, center.y);

    var path = draw.path('M0 0 H50 A20 20 0 1 0 100 50 v25 C50 125 0 85 0 85 z');
    path
        .fill('none')
        .stroke({ width: 1, color: color })
        .center(center.x, center.y);

    // Update on mousemove
    draw.mousemove(function(event) {
        line.plot([
            [center.x, center.y],
            [event.offsetX, event.offsetY]
        ]);
    });
}

function example_3() {
    var draw = SVG('d3');
    let center = get_svg_draw_center(draw);
    let color = '#ff0066';

    // Changing line
    var line = draw
        .line(center.x, center.y, center.x, center.y)
        .stroke({ width: 1, color: color });

    // Circle in center
    var circle = draw.circle(10).fill(color);
    circle.center(center.x, center.y);

    var path = draw.path('M0 0 H50 A20 20 0 1 0 100 50 v25 C50 125 0 85 0 85 z');
    path
        .fill('none')
        .stroke({ width: 1, color: color })
        .center(center.x, center.y);

    // Update on mousemove
    draw.mousemove(function(event) {
        let cursor_point = [event.offsetX, event.offsetY];
        let closest_point = get_closest_point(path, cursor_point);
        line.plot([
            [closest_point[0], closest_point[1]],
            [cursor_point[0], cursor_point[1]],
        ]);
        circle.center(closest_point[0], closest_point[1]);
    });
}

function main_example() {
    var draw = SVG('d4');
    let center = get_svg_draw_center(draw);
    let color = '#ff0066';

    // Path
    let path_str = 'M0 0 H50 A20 20 0 1 0 100 50 v25 C50 125 0 85 0 85 z';
    var path_bg = draw.path(path_str);
    var path_anim = draw.path(path_str);
    // Circle in center
    var circle = draw.circle(10).fill(color);
    circle.center(center.x, center.y);

    path_bg
        .fill('none')
        .stroke({ width: 2, color: '#ccc' })
        .center(center.x, center.y);
    path_anim
        .fill('none')
        .stroke({ width: 3, color: color })
        .center(center.x, center.y);
    let path_length = path_anim.length();
    update_path_segment_attributes(path_anim, path_length, 0, 0);

    circle.draggable().on('dragmove', function(e) {
        // Prevent dragging
        e.preventDefault();
        // Get dragging destination
        let cursor_point = [e.detail.p.x, e.detail.p.y];
        // Calculate closest point on the path and move the target
        let closest_point = get_closest_point(path_bg, cursor_point);
        this.center(closest_point[0], closest_point[1]);
        // Update path length
        let length = closest_point.length;
        update_path_segment_attributes(path_anim, path_length, 0, length);
    });

}

example_1();
example_2();
example_3();
main_example();
