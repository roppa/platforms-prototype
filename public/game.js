var SPEED = 100;
var GRAVITY = 900;
var LOAD_PLAYER_BOL = false;
var DEAD_PLAYER_X = 1;
var POS_X = 0;
var POS_Y = 0;
var BUTTON_A = false;
var RESET = false;
var RESETGAMEOVER = false;
var GAMECONTEXT;
var PLAYERS_ARRAY = [];


var players;

var water;
var waterInterval;
var waterTimeout;

var platforms;
var platformInterval;
var platformFallingInterval;
var platformNegativeInterval;
var platformFloatingInterval;

var groundTimeout;

var flyTimeout;

var orangeDinos;
var orangeDinoInterval;

var purpleDinos;
var purpleDinoInterval;


var fishes;
var fishInterval;


var music;
var musicArray = ['fox', 'gorillaz', 'lucky'];
var randomSong = Math.floor(Math.random()*3);
var musicReset = false;
var musicLoop = true;
var jumpEffect;
var deadEffect;

var updatePosition = function(positionArray) {

  for(var i=0; i<positionArray.length; i++) {
    if(positionArray && positionArray[i]) {
      POS_X = positionArray[i].data.velocity.x;
      POS_Y = positionArray[i].data.velocity.y;
      BUTTON_A = positionArray[i].data.a;
      if(RESET && BUTTON_A) {
        GAMECONTEXT.move();
      }
      if(RESETGAMEOVER && BUTTON_A) {
        GAMECONTEXT.reset();
      }
    }
  }
};

var display = new Display();
display.connect();
display.setInformationHandler(updatePosition);

var state = {
  preload: function() {
    console.log(this)
    this.load.image("platform", "assets/platform.png");
    this.load.image("falling", "assets/falling.png");
    this.load.image("negative", "assets/negative.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("background", "assets/background.jpg");
    this.load.image("floating", "assets/floating.png");
    this.load.spritesheet("player", "assets/hero.png", 33.16, 49);
    this.load.spritesheet("fish", "assets/fish.png", 30, 40);
    this.load.spritesheet("orangeDino", "assets/orange-dino.png", 34.5, 42);
    this.load.spritesheet("purpleDino", "assets/purple-dino.png", 118, 150);
    this.load.image('water', 'assets/water.png');
    this.load.audio('fox', ['assets/sounds/fox.mp3']);
    this.load.audio('gorillaz', ['assets/sounds/gorillaz.mp3']);
    this.load.audio('lucky', ['assets/sounds/lucky.mp3']);
    this.load.audio('dead', ['assets/sounds/dead.mp3']);
    this.load.audio('jump', ['assets/sounds/jump.mp3']);
  },
  create: function() {

    music = game.add.audio(musicArray[randomSong]);
    music.play();
    //   musicReset = false;

    // music.restart();
    music.onStop.add(function(){
      if(musicLoop === true) {
        music.play()
      }  
    }, this);
    // music.onStop.add(music.play);
    // music.loop = true;

    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.background = this.add.tileSprite(0,0, this.world.width, this.world.height, 'background');
    this.background.autoScroll(-SPEED,0);

    players = game.add.group();
    players.enableBody = true;

    this.player = players.create(0,0,'player');
    this.player.animations.add('left', [8,7,6,5], 10, true);
    this.player.animations.add('right', [1,2,3,4], 10, true);
    this.player.animations.add('still', [0], 10, true);
    // this.player.animations.add('standing', [0,1,2,1,0,0,0], 10, true);
    this.physics.arcade.enableBody(this.player);


    platforms = game.add.group();
    platforms.enableBody = true;   

    water = game.add.group();
    water.enableBody = true; 

    purpleDinos = game.add.group();
    orangeDinos = game.add.group();

    fishes = game.add.group();


    this.scoreText = this.add.text(
      this.world.centerX,
      this.world.height/2,
      "",
      {
          size: "32px",
          fill: "#FFF",
          align: "center"
      }
    );

    this.scoreText.anchor.setTo(0.5, 0.5);

    this.reset();
  },
  update: function() {

    this.physics.arcade.collide(players, platforms);
    this.physics.arcade.collide(players, orangeDinos, this.setGameOver, null, this);
    this.physics.arcade.collide(players, purpleDinos, this.setGameOver, null, this);
    this.physics.arcade.collide(players, fishes, this.setGameOver, null, this);


    if(this.level === 'ground') {
      orangeDinos.forEach(function(o) {
        if(o && o.body.x < -100) {
          o.kill();
        }
      });
      purpleDinos.forEach(function(p) {
        if(p && p.body.x < -150) {
          p.kill();
        }
      });
    }

    if(this.level === 'water') {
      water.forEach(function(w) {
        if(w.body.x < -350) {
          w.kill();
        }
      });
      platforms.forEach(function(p){
        if(p.body.x < -800 || p.body.y < -48 ) {
          p.kill();
        }
      });
      fishes.forEach(function(f) {
        if(f.body.x < - 100) {
          f.kill();
        }
      });
    }


    // cursors = this.input.keyboard.createCursorKeys();
    if (POS_X < -50 && this.player.body.x>1 && !this.player.dead){
      this.player.body.velocity.x = -250;
    } else if (POS_X > 50 && this.player.body.x<750 && !this.player.dead) {
      this.player.body.velocity.x = 250;
    } else if (POS_X === 0 && !this.player.body.touching.down && !this.player.dead) {
      this.player.body.velocity.x = -99;
    } else {
      this.player.body.velocity.x = 0;
    }

    if(BUTTON_A && this.player.body.touching.down && !this.player.dead) {
      this.player.body.velocity.y = -600;
      jumpEffect = game.add.audio('jump');
      jumpEffect.play();
    }
    
 


    if(this.gameStarted){
      if(this.player.body.velocity.x > 0 && this.player.body.x<770){
        this.player.animations.play('right');
      } else if(this.player.body.velocity.x < -99 && this.player.body.x>10){
        this.player.animations.play('left');
      } else if(this.player.body.x <= 10) {
        this.player.animations.play('right');
        this.player.body.velocity.x = 100;
      } else {
        this.player.animations.play('still');
      }
    }

    if(!this.gameOver){
      if(this.player.body.bottom >= this.world.bounds.bottom + 48){
        this.player.dead = true;
        this.setGameOver();
      }
      if(this.player.body.bottom <= this.world.bounds.top - 30 && this.player.body.touching.down) {
        this.player.dead = true;
        this.setGameOver();
      }
    }
  },
  reset:function() {
    BUTTON_A = false;
    GAMECONTEXT = this;

    clearInterval(waterInterval);
    clearInterval(platformInterval);
    clearInterval(platformFallingInterval);
    clearInterval(platformNegativeInterval);

    clearInterval(platformFloatingInterval);
    clearInterval(purpleDinoInterval);
    clearInterval(orangeDinoInterval);
    clearInterval(fishInterval);

    clearTimeout(waterTimeout);
    clearTimeout(groundTimeout);
    clearTimeout(flyTimeout);

    

    this.player.dead = false;
    platforms.removeAll();
    water.removeAll();
    orangeDinos.removeAll();
    purpleDinos.removeAll();
    fishes.removeAll();
    this.gameStarted = false;
    this.gameOver = false;
    if(musicReset === true) {
      musicLoop = true;
      musicReset = false;
      music.play();

      music.onStop.add(function(){
        if(musicLoop === true) {
          music.play()
        }  
      }, this);
    }


    if(musicReset === true) {
      musicLoop = true;
      musicReset = false;
      music.play();

      music.onStop.add(function(){
        if(musicLoop === true) {
          music.play()
        }  
      }, this);
    }


    // this.input.onDown.removeAll();    
    // this.input.onDown.add(this.move, this);

    this.player.reset(this.world.width / 4, 487);
    this.player.dead = true;
    this.player.animations.play('right');

    this.ground = platforms.create(0, game.world.height-64, 'ground');
    this.ground.scale.setTo(20,2);
    this.ground.body.immovable = true;

    this.background.autoScroll(-SPEED * .30 ,0);

    this.scoreText.setText("PRESS + TO ADD PLAYER\n\nPRESS JUMP TO\nSTART GAME");

    setTimeout(function() {
      RESET = true;
    }, 1000);

  },
  start: function() {  
    var context = this;

    this.player.dead = false;  
    this.player.body.gravity.y = GRAVITY;
    this.scoreText.setText("");
    this.gameStarted = true;
    this.background.autoScroll(-SPEED * .40 ,0);
    this.ground.body.velocity.x = -SPEED;

    this.levelGround();
    waterTimeout = setTimeout(function(){
      context.levelWater();
    }, 20000);

    groundTimeout = setTimeout(function(){
      context.levelGround();
    }, 38000);

    flyTimeout = setTimeout(function() {
      context.levelFly();
    }, 58000);
       
  },
  move: function(){
    if(!this.gameStarted){
      clearInterval(waterInterval);
      clearInterval(platformInterval);
      clearInterval(platformFallingInterval);
      clearInterval(platformNegativeInterval);

      clearInterval(platformFloatingInterval);
      clearInterval(purpleDinoInterval);
      clearInterval(orangeDinoInterval);

      clearTimeout(waterTimeout);
      clearTimeout(groundTimeout);
      clearTimeout(flyTimeout);

      RESET = false;
      RESETGAMEOVER = false;

      this.lastNum = 500;
      this.start();
    }

    if(this.gameOver){
      this.reset();
    }
  },
  setGameOver: function() {
    RESETGAMEOVER = true;

    this.gameOver = true;
    this.gameStarted = false;
    this.scoreText.setText("PRESS JUMP TO\nTRY AGAIN");
    this.background.autoScroll(0, 0);
    this.player.dead = true;
    this.player.body.x = (32 * DEAD_PLAYER_X);
    this.player.body.y = 0;
    this.player.body.gravity.y = 0;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.player.animations.play('still'); 

    deadEffect = game.add.audio('dead');
    deadEffect.play();

    if(randomSong === 2) {
      randomSong = 0;
    } else {
      randomSong++
    }
    musicReset = true;
    musicLoop = false;
    music.stop();
    music = game.add.audio(musicArray[randomSong]);

    // this.input.onDown.removeAll();
    // this.input.onDown.add(this.reset, this);
  },
  spawnPlatform: function() {
    this.ledge = platforms.create(800, this.generateRandomY(), 'platform');
    this.ledge.body.immovable = true;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.scale.setTo(2,1);
  },
  spawnFallingPlatform: function() {
    this.ledge = platforms.create(800, this.generateRandomY(), 'falling');
    this.ledge.body.immovable = false;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.scale.setTo(2,1);
  },
  spawnNegativePlatform: function() {
    this.ledge = platforms.create(800, 600, 'negative');
    this.ledge.body.immovable = true;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.body.velocity.y =  -(Math.random() * 200);
    this.ledge.scale.setTo(2,1);
  },
  spawnFloatingPlatform: function(y) {
    this.ledge = platforms.create(800, y || this.generateRandomGreaterY(), 'floating');
    this.ledge.body.immovable = true;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.scale.setTo(2,2);
  },
  spawnWater: function() {
    var context = this;
    waterInterval = setInterval(function(){
      context.water = water.create(800, 570, 'water');
      context.water.body.immovable = true;
      context.water.body.velocity.x = -SPEED;
    },3315);
    
  },
  generateRandomY: function() {
    this.lastNum = this.lastNum || 500;
    this.lastNum = this.lastNum +  (Math.random() * 300 - 100);
    if(this.lastNum > 550) {
      this.lastNum = 400;
    }
    if(this.lastNum < 100) {
      this.lastNum = 300;
    }
    return this.lastNum;
  },
  generateRandomGreaterY: function() {
    this.lastGreaterNum = this.lastGreaterNum || 450;
    this.lastGreaterNum = this.lastGreaterNum +  (Math.random() * 200 - 100);
    if(this.lastGreaterNum > 500) {
      this.lastGreaterNum = 300;
    }
    if(this.lastGreaterNum < 100) {
      this.lastGreaterNum = 300;
    }
    return this.lastGreaterNum;
  },
  spawnOrangeDino: function() {
    this.orangeDino = orangeDinos.create(800, 495, 'orangeDino');
    this.orangeDino.animations.add('walk', [0,1,2,3], 10, true);
    this.orangeDino.animations.play('walk');
    this.physics.arcade.enableBody(this.orangeDino);
    this.orangeDino.body.immovable = true;
    this.orangeDino.body.velocity.x = -SPEED - 50;
  },
  spawnPurpleDino: function() {
    this.purpleDino = purpleDinos.create(1000, 390, 'purpleDino');
    this.purpleDino.animations.add('walk', [0,1,2,3], 10, true);
    this.purpleDino.animations.play('walk');
    this.physics.arcade.enableBody(this.purpleDino);
    this.purpleDino.body.immovable = true;
    this.purpleDino.body.velocity.x = -SPEED - 80;
  },
  spawnFish: function() {
    this.fish = fishes.create(700, 650, 'fish');
    this.fish.animations.add('walk', [0,1], 10, true);
    this.fish.animations.play('walk');
    this.physics.arcade.enableBody(this.fish);
    this.fish.body.immovable = true;
    this.fish.body.velocity.y = -900;
    this.fish.body.velocity.x = -SPEED;
    this.fish.body.gravity.y = GRAVITY;
  },
  levelWater: function() {
    this.level = 'water';

    clearInterval(platformFloatingInterval);
    clearInterval(purpleDinoInterval);
    clearInterval(orangeDinoInterval);


    this.ground = platforms.create(0, game.world.height-64, 'ground');
    this.ground.scale.setTo(2,2);
    this.ground.body.immovable = true;
    this.ground.body.velocity.x = -SPEED;


    this.spawnPlatform();
    this.water = water.create(800, 570, 'water');
    this.water.immovable = true;
    this.water.body.velocity.x = -SPEED;
    this.spawnWater();

    var context = this;
    if(this.gameStarted) {
      platformInterval = setInterval(function(){
        context.spawnPlatform();
      }, 3000);
      platformFallingInterval = setInterval(function(){
        context.spawnFallingPlatform();
      }, (2000));
      platformNegativeInterval = setInterval(function(){
        context.spawnNegativePlatform();
      }, 8000);
      fishInterval = setInterval(function() {
        context.spawnFish();
      }, 3500);
    } 
  },
  levelGround: function() {
    this.level = 'ground';
    var context = this;

    clearInterval(platformInterval);
    clearInterval(platformFallingInterval);
    clearInterval(platformNegativeInterval);
    clearInterval(waterInterval);
    clearInterval(fishInterval);


    this.ground = platforms.create(800, game.world.height-64, 'ground');
    this.ground.scale.setTo(20,2);
    this.ground.body.immovable = true;
    this.ground.body.velocity.x = -SPEED;


    this.spawnFloatingPlatform(350);

    platformFloatingInterval = setInterval(function() {
      context.spawnFloatingPlatform();
    }, 3000);

    purpleDinoInterval = setInterval(function() {
      context.spawnPurpleDino();
    }, 6000);

    orangeDinoInterval = setInterval(function() {
      context.spawnOrangeDino();
    }, 5000);

  },
  levelFly: function() {
    var context = this;
    this.levelWater();
  }
}

var game = new Phaser.Game(
  800,
  600,
  Phaser.AUTO,
  'game',
  state
)