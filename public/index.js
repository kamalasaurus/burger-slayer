(function() {

  const video = document.createElement('video');
    video.setAttribute('src', './result.mp4');
    video.setAttribute('loop', true);

  const v1 = document.createElement('video');
    v1.setAttribute('src', '/data_dst.mp4');
    v1.setAttribute('loop', true);
    v1.setAttribute('width', '1px');
    v1.setAttribute('style', 'display: inline-block; transform: rotate(90deg);');
  const v2 = document.createElement('video');
    v2.setAttribute('src', '/data_src.mp4');
    v2.setAttribute('loop', true);
    v2.setAttribute('width', '1px');
    v2.setAttribute('style', 'display: inline-block; transform: rotate(90deg);');

  const canvas = document.createElement('canvas');
    canvas.setAttribute('style', `
      position: relative;
      width: 100%;
      height: 100%;
    `);

  const img = document.createElement('img');
    img.setAttribute('src', './transburger.png');

  document.body.appendChild(canvas);
  document.body.appendChild(v1);
  document.body.appendChild(v2);

  const help = document.createElement('div');
    help.innerHTML = "help!  Chris and Vivian were fused together in a horrible ITP deepfake lab accident!  Feed them burgers to set them freee";
    help.setAttribute('style', 'font-family: monospace; background-color: gray; color: white; position: absolute; top: 20px; left: 10px; width: 400px;');

  document.body.appendChild(help);

  const qr = document.createElement('img');
    qr.setAttribute('src', './frame.png');
    qr.setAttribute('style', 'position: absolute; right: 100px; top: 200px;');

  document.body.appendChild(qr);

  const ctx = canvas.getContext('2d');
  let width = document.body.offsetWidth;
  let height = document.body.offsetHeight;
  let vidW = (height / video.videoHeight) * video.videoWidth;
  let vidH = height;
  let vidX = (width - vidW) / 2;

  canvas.addEventListener('click', () => {
    video.play();
    v1.play();
    v2.play();
  });

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

  let HP = 10000;

  const healthbar = document.createElement('div');
    healthbar.setAttribute('style', `position: absolute; background-color: green; height: 20px; width: ${vidW * HP / 10000}; left: ${vidX}; top: 0; z-index: 100;`)

  document.body.appendChild(healthbar);

  const burger = function() {
    return {
      width: 383,
      height: 334,
      x: (width - 383) / 2,
      y: (height - 334) / 2,
      z: 1,
      timeStart: 0,
      time: 0
    };
  };

  let burgers = [];

  const throwBurger = () => burgers.push(new burger());

  const keyPress = (e) => {
    e.preventDefault();
    if (e.key === ' ') throwBurger();
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
  window.addEventListener('resize', resize);

  const frame = (timestep) => {
    ctx.clearRect(0, 0, width, height);
    background();
    ctx.drawImage(video, vidX, 0, vidW, height);
    burgers.forEach((burger) => {
      if (burger.timeStart === 0) burger.timeStart = timestep;
      burger.time = timestep;
      burger.y = burger.y + 55 * Math.pow(((burger.time - burger.timeStart) / 100), 2);
      burger.z += 20;
      burger.width = burger.width * Math.atan(burger.width / burger.z) / (Math.PI/2);
      burger.height = burger.height * Math.atan(burger.height / burger.z) / (Math.PI/2);
      burger.x = (width - burger.width) / 2;
      if (burger.z < 1000)
        ctx.drawImage(img, burger.x, burger.y, burger.width, burger.height);
    });
    burgers = burgers.filter((burger) => {
      if (burger.z >= 1000) HP = HP - 100;
      return burger.z < 1000;
    });
    healthbar.setAttribute('style', `position: absolute; background-color: green; height: 20px; width: ${vidW * HP / 10000}px; left: ${vidX}px; top: 0; z-index: 100;`)
    if (HP < 0) {
      v1.setAttribute('width', '400px');
      v2.setAttribute('width', '400px');
      const victory = document.createElement('div');
        victory.setAttribute('style', 'font-family: monospace; position: absolute; text-align: center; top: 200px; background-color: steelblue; margin: 0 auto; padding: 100px;')
      victory.appendChild(v1);
      victory.appendChild(v2);
      const txt = document.createElement('span');
        txt.innerHTML = 'They\'re free!  Yayy'
      victory.appendChild(txt);
      document.body.appendChild(victory);
    } else {
      window.requestAnimationFrame(frame);
    }
  };

  video.addEventListener('play', () => {
    resize();
    frame();
  });

  const peer = new Peer('burger-beast', {
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs'
  });

  peer.on('connection', function(conn) {
    conn.on('data', function(data) {
      throwBurger();
    });
  });

})();
