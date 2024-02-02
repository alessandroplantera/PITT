//Animation
let pittSleep;
let timeString = "";
let dateString = "";

let ho;
let mi;
let mo;
let da;
let ampm;
let monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let exercises = ["jumping_jacks", "squats", "stretching"];
let sleepingAni;

let isSoundPlaying = false;

//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia
let alarmHo = 3;
let alarmMi = 0;
//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia//orario sveglia
//orario sveglia
//orario sveglia

let stateText = "";
let cerchi = [];
let indiceCerchio = 0;
let frameCountdown = 0;

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/BXPqMjvvA/";

// Video
let video;
let flippedVideo;

// To store the classification
let label = "";
let label_score;

//Timer
let changeStateTime = null;
let startTimeNopeople = null;

let font;
const song_alarm = new Audio("assets/song/alarm_song.mp3");
let wakeUpAni;
let jumpingJacksAni;
let squatsAni;
let unlockAni;
let stretchingAni;
let unlockBg;
let introAni;

let startButton = document.getElementById("startButton");
startButton.onclick = function () {
  song_alarm.play();
  song_alarm.pause();
  startButton.remove();
};

function preload() {
  // Load the model
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
  font = loadFont("font/HelveticaNeue-Bold-02.ttf");
  bg = loadImage("assets/bg/background.png");
  sleepingAni = loadImage("assets/sleep/sleep.gif");
  wakeUpAni = loadImage("assets/wake_up/wake_up.gif");
  jumpingJacksAni = loadImage("assets/jumping_jacks/jumping_jacks.gif");
  squatsAni = loadImage("assets/squats/squats.gif");
  unlockAni = loadImage("assets/unlock/unlock.gif");
  stretchingAni = loadImage("assets/stretch/stretch.gif");
  unlockBg = loadImage("assets/unlock/unlock_background.png");
  introAni = loadImage("assets/intro/intro.gif");
}

function setup() {
  createCanvas(390, 844);

  cerchi.push({
    x: 50,
    y: 360,
    raggio: 15,
    colore: color(0, 0, 0, 0),
    on: false,
  });
  cerchi.push({
    x: 90,
    y: 360,
    raggio: 15,
    colore: color(0, 0, 0, 0),
    on: false,
  });
  cerchi.push({
    x: 130,
    y: 360,
    raggio: 15,
    colore: color(0, 0, 0, 0),
    on: false,
  });

  // Disegna ogni cerchio
  // cerchi[0].colore = color('rgba(100, 255, 0, 1)'); // Rosso trasparente
  // cerchi[1].colore = color('rgba(100, 255, 0, 1)'); // Rosso trasparente
  // cerchi[2].colore = color('rgba(100, 255, 0, 1)'); // Rosso trasparente
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "user",
      },
    },
    //video: {
    //facingMode: "user"
    //}
  };
  // Create the video
  video = createCapture(constraints);
  video.size(320, 240);
  // video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
}

//Hidle states
let sleeping_state = 0;
let ringing_state = 1;
let idle_state = 2;

//Exercises states
let stretching_state = 3;
let jumping_jacks_state = 4;
let squats_state = 5;

// let stretching_state_done = false;
// let jumping_jacks_state_done = false;
// let squats_state_done = false

//User states
let user_absent_state = 6;
let user_present_state = 7;

let unlock_state = 8;
let intro_state = 9;

//Tracking states
let current_state = sleeping_state;
let exercises_state = user_absent_state;

//Time states
// let startTime = null;

//Teachable flags
// Assuming the label's confidence score is available and exercises array is defined
let completed_exercise_counter = 0;
let previous_exercise = "";
let flag = false;

function draw() {
  // Time
  ho = hour();
  mi = minute();
  mo = month();
  da = day();
  ampm = ho > 12 ? "pm" : "am";
  ho = ho % 12;
  ho = ho ? ho : 12; // L'ora '0' dovrebbe essere '12'

  // Formatta ora e minuti per avere sempre due cifre
  let formattedHo = nf(ho, 2); // Aggiunge uno zero iniziale se necessario
  let formattedMi = nf(mi, 2); // Aggiunge uno zero iniziale se necessario
  let monthName = monthNames[mo - 1]; // Usa mo per ottenere il nome del mese dall'array

  background(bg);
  strokeWeight(5);
  line(20, height / 3, width - 20, height / 3);
  strokeWeight(0);
  textFont(font);

  textSize(100);
  fill(0);
  text(`${formattedHo}:${formattedMi}`, 155, 250); // Visualizza orario in formato HH:MM AM/PM
  text(da < 10 ? "0" + da : da, 85, 150); // Visualizza giorno
  textSize(50);
  text(ampm, 320, 250); // Posizione di AM/PM accanto all'orario
  text(monthName, 190, 150); // Posizione del mese accanto al giorno

  textFont(font);
  textSize(30);
  noFill();

  if (current_state == sleeping_state) {
    // Calcola la posizione per centrare l'animazione
    image(sleepingAni, 0, 0, sleepingAni.width, sleepingAni.height);
    //imposta la sveglia
    if (ho == alarmHo && mi == alarmMi) {
      current_state = ringing_state;
    }
  }

  if (current_state == ringing_state && exercises_state == user_absent_state) {
    stateText = "Wake up!";
    if (isSoundPlaying == false) {
      song_alarm.play();
      isSoundPlaying = true;
      console.log("music in play");
    }

    text(stateText, 95, 320);
    image(wakeUpAni, 0, 0, sleepingAni.width, sleepingAni.height);
    // console.log('dentro')
    // console.log('ho:', ho, 'mi:', mi, 'alarmHo:', alarmHo, 'alarmMi:', alarmMi);

    //Teachable Machine
    if (label == "Idle") {
      current_state = idle_state;
      exercises_state = user_present_state;
    }
  }

  if (current_state == idle_state && exercises_state == user_present_state) {
    stateText = "Good Morning!";
    fill(0);
    text(stateText, 140, 320);
    if (indiceCerchio < cerchi.length) {
      if (frameCountdown == 0) {
        indiceCerchio++;
        frameCountdown = 12; // Imposta il conto alla rovescia per i frame (0.2 secondi a 60 FPS)
      } else {
        frameCountdown--;
      }
    }
    for (let i = 0; i < indiceCerchio; i++) {
      let cerchio = cerchi[i];
      // if (cerchio.on) {
      fill(cerchio.colore);
      // }
      stroke(2);
      strokeWeight(2);
      ellipse(cerchio.x, cerchio.y, cerchio.raggio * 2);
    }
    stroke(0);
    strokeWeight(0);
    fill(0);
    // let randomIndex = Math.floor(Math.random() * exercises.length);
    // text(exercises[randomIndex], 36, 350);
    image(unlockAni, 0, 0, sleepingAni.width, sleepingAni.height);

    if (changeStateTime === null) {
      changeStateTime = millis();
    } else if (millis() - changeStateTime >= 3000) {
      current_state = jumping_jacks_state;
      console.log(millis());
      changeStateTime = null;
    }
  }

  //untill here it works
  //fixed the issue with the state change

  if (current_state == jumping_jacks_state) {
    if (indiceCerchio < cerchi.length) {
      if (frameCountdown == 0) {
        indiceCerchio++;
        frameCountdown = 12; // Imposta il conto alla rovescia per i frame (0.2 secondi a 60 FPS)
      } else {
        frameCountdown--;
      }
    }
    for (let i = 0; i < indiceCerchio; i++) {
      let cerchio = cerchi[i];
      noFill();
      if (cerchio.on) {
        fill(cerchio.colore);
      }
      stroke(2);
      strokeWeight(2);
      ellipse(cerchio.x, cerchio.y, cerchio.raggio * 2);
    }

    stroke(0);
    strokeWeight(0);
    fill(0);

    console.log("jumping_jacks_state");
    image(jumpingJacksAni, 0, 0, sleepingAni.width, sleepingAni.height);
    stateText = "Jumping Jacks";
    text(stateText, 130, 320);
    noFill();

    // Check if the label confidence score is greater than 90%
    if (label_score > 0.8) {
      if (label === "JumpinJacks") {
        if (previous_exercise !== "JumpinJacks") {
          completed_exercise_counter++;
          previous_exercise = "JumpinJacks";
          cerchi[-1 + completed_exercise_counter].colore = color(
            "rgba(100, 255, 0, 1)"
          ); // Verde
          cerchi[-1 + completed_exercise_counter].on = true;
          flag = true;
          console.log(completed_exercise_counter);
        }
      } else {
        flag = false;
        if (previous_exercise === "JumpinJacks") {
          previous_exercise = label;
        }
      }
    }

    // Reset the counter and change state if conditions are met
    if (completed_exercise_counter >= 3) {
      current_state = squats_state; // change to the next state
      completed_exercise_counter = 0; // Reset the counter
      cerchi.forEach((cerchio) => {
        cerchio.on = false;
      });
    }
  }

  if (current_state == squats_state) {
    if (indiceCerchio < cerchi.length) {
      if (frameCountdown == 0) {
        indiceCerchio++;
        frameCountdown = 12; // Imposta il conto alla rovescia per i frame (0.2 secondi a 60 FPS)
      } else {
        frameCountdown--;
      }
    }
    for (let i = 0; i < indiceCerchio; i++) {
      let cerchio = cerchi[i];
      noFill();
      if (cerchio.on) {
        fill(cerchio.colore);
      }
      stroke(2);
      strokeWeight(2);
      ellipse(cerchio.x, cerchio.y, cerchio.raggio * 2);
    }
    stroke(0);
    strokeWeight(0);
    fill(0);
    console.log("squats_state");
    stateText = "Squats";
    text(stateText, 80, 320);
    image(squatsAni, 0, 0, sleepingAni.width, sleepingAni.height);
    // Check if the label confidence score is greater than 90%

    if (label_score > 0.8) {
      if (label === "Squats") {
        if (previous_exercise !== "Squats") {
          completed_exercise_counter++;
          cerchi[-1 + completed_exercise_counter].colore = color(
            "rgba(100, 255, 0, 1)"
          ); // Verde
          cerchi[-1 + completed_exercise_counter].on = true;
          previous_exercise = "Squats";
          flag = true;
        }
      } else {
        flag = false;
        if (previous_exercise === "Squats") {
          previous_exercise = label;
        }
      }
    }
    if (completed_exercise_counter >= 3) {
      current_state = stretching_state; // change to the next state
      completed_exercise_counter = 0; // Reset the counter
      cerchi.forEach((cerchio) => {
        cerchio.on = false;
      });
    }
  }
  if (current_state == stretching_state) {
    if (indiceCerchio < cerchi.length) {
      if (frameCountdown == 0) {
        indiceCerchio++;
        frameCountdown = 12; // Imposta il conto alla rovescia per i frame (0.2 secondi a 60 FPS)
      } else {
        frameCountdown--;
      }
    }
    for (let i = 0; i < indiceCerchio; i++) {
      let cerchio = cerchi[i];
      noFill();
      if (cerchio.on) {
        fill(cerchio.colore);
      }
      stroke(2);
      strokeWeight(2);
      ellipse(cerchio.x, cerchio.y, cerchio.raggio * 2);
    }
    stroke(0);
    strokeWeight(0);
    fill(0);
    console.log("stretching_state");
    stateText = "Stretching";
    text(stateText, 90, 320);
    image(stretchingAni, 0, 0, sleepingAni.width, sleepingAni.height);
    // Check if the label confidence score is greater than 90%

    if (label_score > 0.85) {
      if (label === "Stretch") {
        if (previous_exercise !== "Stretch") {
          completed_exercise_counter++;
          cerchi[-1 + completed_exercise_counter].colore = color(
            "rgba(100, 255, 0, 1)"
          ); // Verde
          cerchi[-1 + completed_exercise_counter].on = true;
          previous_exercise = "Stretch";
          flag = true;
        }
      } else {
        flag = false;
        if (previous_exercise === "Stretch") {
          previous_exercise = label;
        }
      }
    }
    if (completed_exercise_counter >= 3) {
      current_state = unlock_state; // change to the next state
      completed_exercise_counter = 0; // Reset the counter
      cerchi.forEach((cerchio) => {
        cerchio.on = false;
      });
    }
  }
  if (current_state == unlock_state) {
    console.log("unlock_state");
    stateText = "Well Done!";
    text(stateText, 95, 320);
    background(unlockBg);
    image(unlockAni, 0, 0, sleepingAni.width, sleepingAni.height);
    // Check if the label confidence score is greater than 90%
    song_alarm.pause();
    song_alarm.currentTime = 0;

    //SETTA IL TEMPO A ZERO
    if (startTimeNopeople === null) {
      startTimeNopeople = millis(); // Get the current time in milliseconds
    } else if (millis() - startTimeNopeople >= 3000) {
      current_state = intro_state;
      console.log("millis:", millis(), "startTimeNopeople:", startTimeNopeople);
      startTimeNopeople = null;
    }
  }

  if (current_state == intro_state) {
    background(255);
    background(bg);
    console.log("intro_state");
    stateText = "Welcome!";
    // text(stateText, 36, 350);
    image(introAni, 0, 0, sleepingAni.width, sleepingAni.height);
  }
  // Draw the label
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 40);
  noFill();
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  label_score = results[0].confidence;
  // console.log(results[0].confidence);
  // Classifiy again!
  classifyVideo();
}
