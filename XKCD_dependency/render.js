function SVG2MatterCoords(x, y, width, height, scale, hShift, vShift) {
    let matterX = (x + width / 2) * scale + hShift;
    let matterY = (y + height / 2) * scale + vShift;
    let matterWidth = width * scale;
    let matterHeight = height * scale;
    return {
        x: matterX,
        y: matterY,
        width: matterWidth,
        height: matterHeight
    };
}

function calculateMass(width, height) {
    return width * height * 0.0003;
}

function loadRectanglesFromJSON(url, scale = 15, vShift = 0, hShift = 0) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const bodies = data.map(item => {
                const converted = SVG2MatterCoords(item.x, item.y, item.width, item.height, scale,
                    hShift, vShift);
                const weight = calculateMass(converted.width, converted.height);
                return Matter.Bodies.rectangle(converted.x, converted.y, converted.width, converted
                    .height, {
                        mass: weight,
                        render: {
                            fillStyle: '#888'
                        },
                    });
            });
            Matter.World.add(world, bodies);
        })
        .catch(error => console.error('Error loading JSON:', error));
}
const engine = Matter.Engine.create();
const world = engine.world;
const render = Matter.Render.create({
    element: document.querySelector('.container'),
    engine: engine,
    options: {
        width: 500,
        height: 500,
        wireframes: false,
        background: 'transparent',
    }
});
document.querySelector('.container').insertAdjacentHTML(
    'beforeend',
    '<p>Inspired by XKCD <a href="https://xkcd.com/2347/" target="_blank">2347</a>: Dependency.</p>'
);
const ground = Matter.Bodies.rectangle(400, 496, 900, 20, {
    isStatic: true,
    render: {
        fillStyle: '#666'
    }
});
Matter.World.add(world, ground);
const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
Matter.World.add(world, mouseConstraint);
render.mouse = mouse;
loadRectanglesFromJSON('dependency.json', 4, -110, -185);
Matter.Runner.run(engine);
Matter.Render.run(render);