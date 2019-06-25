(function() {

  const video = document.createElement('video');
    video.setAttribute('src', './result.mp4');
    video.setAttribute('loop', true);

  const canvas = document.createElement('canvas');
    canvas.setAttribute('style', `
      position: relative;
      width: 100%;
      height: 100%;
    `);

  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = document.body.offsetWidth;
  let height = document.body.offsetHeight;
  let vidW = (height / video.videoHeight) * video.videoWidth;
  let vidH = height;
  let vidX = (width - vidW) / 2;

  canvas.addEventListener('click', () => video.play());

  const rotate = ({m, a}, angle) => {
    const a2 = a + angle;
    return {
      x2: m * Math.cos(a2),
      y2: m * Math.sin(a2)
    };
  };

  const mod = (dim, d) => (d >= 0) ? d % dim : dim + d;
  const modx = (d) => mod(width, d);
  const mody = (d) => mod(height, d);

  const background = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
  };

  const drawShip = ({x, y, angle, fill, points}) => {
    let rotated = points.map((ma) => rotate(ma, angle))
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x, y);
    rotated.forEach(({x2, y2}) => ctx.lineTo(x + x2, y + y2));
    ctx.closePath();
    ctx.fill();
  };

  const ship = {
    x: width/2,
    y: height/2,
    angle: -Math.PI/2,
    fill: 'yellow',
    points: [
      {m: Math.sqrt(2) * 5, a: -(3/4) * Math.PI},
      {m: 8, a: 0},
      {m: Math.sqrt(2) * 5, a: (3/4) * Math.PI}
    ]
  };


  const keysPressed = {};

  const keyPress = (e) => {
    e.preventDefault();
    const keyMap = {
      'a': 'turnLeft',
      'ArrowLeft': 'turnLeft',
      'd': 'turnRight',
      'ArrowRight': 'turnRight',
      'w': 'moveUp',
      'ArrowUp': 'moveUp',
      ' ': 'shoot'
    };

    if (keyMap[e.key]) keysPressed[keyMap[e.key]] = (e.type === 'keydown');
  };

  const moveShip = function(ship) {
    const actions = {
      turnLeft: () => { ship.angle -= 0.15; },
      turnRight: () => { ship.angle += 0.15; },
      moveUp: () => {
        ship.x = modx(ship.x + 5 * Math.cos(ship.angle));
        ship.y = mody(ship.y + 5 * Math.sin(ship.angle));
      },
      shoot: () => { shots.push(shot); }
    };

    Object
      .keys(keysPressed)
      .forEach(action => {
        if (keysPressed[action] && actions[action])
          actions[action]()
      });
  };

  const resize = (e) => {
    canvas.setAttribute('width', document.body.offsetWidth);
    canvas.setAttribute('height', document.body.offsetHeight);
    width = document.body.offsetWidth;
    height = document.body.offsetHeight;
    vidW = (height / video.videoHeight) * video.videoWidth;
    vidH = height;
    vidX = (width - vidW) / 2;
  };

  document.body.addEventListener('keydown', keyPress);
  document.body.addEventListener('keyup', keyPress);
  window.addEventListener('resize', resize);

  const frame = (timestep) => {
    ctx.clearRect(0, 0, width, height);
    background();
    ctx.drawImage(video, vidX, 0, vidW, height);
    moveShip(ship)
    drawShip(ship);
    window.requestAnimationFrame(frame);
  }

  resize()
  frame()

  //const peer = new Peer('burger-beast');

})();
