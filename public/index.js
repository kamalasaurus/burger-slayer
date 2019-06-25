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

  const img = document.createElement('img');
    img.setAttribute('src', './transburger.png');

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
      burger.y = burger.y + 0.5 * Math.pow(((burger.time - burger.timeStart) / 1000), 2);
      burger.z += 20;
      burger.width = burger.width * Math.atan(burger.width / burger.z) / (Math.PI/2);
      burger.height = burger.height * Math.atan(burger.height / burger.z) / (Math.PI/2);
      burger.x = (width - burger.width) / 2;
      if (burger.z < 1000)
        ctx.drawImage(img, burger.x, burger.y, burger.width, burger.height);
    });
    burgers = burgers.filter((burger) => burger.z < 1000);
    window.requestAnimationFrame(frame);
  };

  video.addEventListener('play', () => {
    resize()
    frame()
  });

  window.throwBurger = throwBurger;

  const peer = new Peer('burger-beast');

})();
