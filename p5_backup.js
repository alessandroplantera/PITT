//Animation
let sleepAni;
let pittSleep;
let timeString = '';
let dateString = '';

let ho
let mi
let mo
let da
let ampm
let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let exercises = ['Jumping Jacks', 'Squats', 'Stretching']
let vel = 1

let sleeping_state = 0
let ringing_state = 1
let walking_state = 2

let stretching_state = 3
let jumping_jacks_state = 4
let squats_state = 5

let user_absent_state = 6
let user_present_state = 7

let current_state = ringing_state
let exercises_state = user_absent_state

function preload() {
  sleepAni = loadAnimation('assets/sleep/sleep_1.png', 'assets/sleep/sleep_2.png', 'assets/sleep/sleep_3.png', 'assets/sleep/sleep_4.png', 'assets/sleep/sleep_5.png');
  wakeUp = loadAnimation('assets/wake_up/wu_1.png', 'assets/wake_up/wu_2.png');
  weatherImg = loadImage('assets/weather/cloud.png');
  sleepAni.frameDelay = 20;
  wakeUp.frameDelay = 20;
  font = loadFont('font/HelveticaNeue-Bold-02.ttf')
  song_alarm = loadSound('assets/song/alarm_song.mp3')

  //Walking animation
  walkAniL = loadAnimation('assets/walk_l/wl_0.png', 'assets/walk_l/wl_1.png', 'assets/walk_l/wl_2.png', 'assets/walk_l/wl_3.png', 'assets/walk_l/wl_4.png', 'assets/walk_l/wl_5.png', 'assets/walk_l/wl_6.png', 'assets/walk_l/wl_7.png', 'assets/walk_l/wl_8.png');
  walkAniR = loadAnimation('assets/walk_r/wr_0.png', 'assets/walk_r/wr_1.png', 'assets/walk_r/wr_2.png', 'assets/walk_r/wr_3.png', 'assets/walk_r/wr_4.png', 'assets/walk_r/wr_5.png', 'assets/walk_r/wr_6.png', 'assets/walk_r/wr_7.png', 'assets/walk_r/wr_8.png');
  //Exercises animation
  stretching
}

function setup() {
  createCanvas(390, 844);
  pittSleep = new Sprite(220, 660, 'd');
  pittSleep.addAnimation('sleepAni', sleepAni);
  pittSleep.addAnimation('wakeUp', wakeUp);
  pittSleep.addAnimation('walkAniL', walkAniL);
  pittSleep.addAnimation('walkAniR', walkAniR);
  weather = new Sprite(width / 2, 41);
  weather.img = weatherImg;

}


function draw() {
  ho = hour()
  mi = minute()
  mo = month()
  da = day()
  ampm = (ho > 12) ? 'pm' : 'am';
  ho = ho % 12;
  ho = ho ? ho : 12; // L'ora '0' dovrebbe essere '12'
  // Formatta ora e minuti per avere sempre due cifre
  let formattedHo = nf(ho, 2); // Aggiunge uno zero iniziale se necessario
  let formattedMi = nf(mi, 2); // Aggiunge uno zero iniziale se necessario
  let monthName = monthNames[mo - 1]; // Usa mo per ottenere il nome del mese dall'array

  background(220);

  strokeWeight(5)
  line(20, height / 3, width - 20, height / 3);
  strokeWeight(0)

  weather.scale = 0.3
  weather.draw();
  textFont(font)
  textSize(20)
  text('cloudy', 230, 69)


  textFont(font);
  textSize(100);
  fill(0);
  text(`${formattedHo}:${formattedMi}`, 36, 250); // Visualizza orario in formato HH:MM AM/PM
  text(da, 36, 150); // Visualizza giorno
  textSize(50);
  text(ampm, 300, 250); // Posizione di AM/PM accanto all'orario
  text(monthName, 148, 150); // Posizione del mese accanto al giorno

  textFont(font);
  textSize(30);
  text();


  pittSleep.scale = 0.3;

  //Stati


  if (current_state == sleeping_state) {
    if (ho == 3 && mi == 30) {
      pittSleep.changeAnimation('wakeUp');
      pittSleep.draw();
      current_state = ringing_state
    }
  }

  if (current_state == ringing_state && exercises_state == user_absent_state) {
    if (!song_alarm.isPlaying()) {
      song_alarm.play();
    }
    pittSleep.x += vel; // muovi verso destra
    if (pittSleep.x > width - 50) {
      pittSleep.changeAnimation('walkAniL');
      vel = -vel; // Inverti la direzione
    }
    if (pittSleep.x < 0+50) {
      pittSleep.changeAnimation('walkAniR');
      vel = -vel;
    }

    // Cambia l'animazione a 'wakeUp' al centro del canvas
    if (pittSleep.x == width / 2) {
      pittSleep.changeAnimation('wakeUp');
      // Utilizza setTimeout per cambiare lo stato dopo 3 secondi
      setTimeout(function () {
        current_state = walking_state; // Cambia lo stato
        // Qui puoi anche riprendere il movimento se necessario
      }, 3000);
    }

      
 

    pittSleep.draw();
    if (ho == 3 && mi == 31) {
      song_alarm.stop()
      // current_state = walking_state
    }
  }

  if (current_state == ringing_state && exercises_state == user_present_state) {
    let randomIndex = Math.floor(Math.random() * exercises.length);
    text(exercises[randomIndex], 36, 350);
    pittSleep.changeAnimation('walkAniL');
  }

}
