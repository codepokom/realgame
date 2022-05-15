const canvas = document.querySelector("#canvas");
const home = document.querySelector("#home");
const btn_again = document.querySelector(".again")
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight - 100 ;
canvas.width = window.innerWidth - 100;

const CAN_WID = canvas.width;
const CAN_HEI = canvas.height;
const GROUND = 0.7*CAN_HEI+75;

const class_HIDDEN = 'hidden';

ctx.fillStyle = "Brown";
ctx.fillRect(0, 0.70*CAN_HEI+75, CAN_WID, 0.3*CAN_HEI-75);

let P_Left = false;
let P_Right = false;
let P_Up = false;
let falling = false;
let P_Space = false;
let 공격중 = false;
let stack = 0;

//주인공 설정 
const actor = {
  x : 0.50*CAN_WID,
  y : 0.70*CAN_HEI,
  width : 30,
  height : 75,
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  } 
}

//빌런 설정
const villain_R = {
  x : 0.95*CAN_WID,
  y : 0.7*CAN_HEI+10,
  width : 40,
  height : 65,
  draw() {
    ctx.fillStyle = "red"
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  kill() {
    ctx.clearRect(this.x, this.y, this.width, this.height)
  },
}
//주인공 공격 히트는 frame 안에다 ..


let timer = 0;
//조작키
function framework1() {
  requestAnimationFrame(framework1);
  // 프레임마다 밑배경 이하를 지우고 그리고 반복 값은 저장됨으로 변경도 저장된 채로 그림이 그려진다.
  ctx.clearRect(0, 0, CAN_WID, 0.7*CAN_HEI+75);
  actor.draw();
  villain_R.draw();
  const ACTOR_XR = actor.x +30;
  const ACTOR_YR = actor.y;
  
  //좌우 이동
  if (P_Left) {
    actor.x -= 2.5;
  } else if (P_Right) {
    actor.x += 2.5;
  }
  //jump!!
  if (P_Up && actor.y >= GROUND-215) {
    actor.y -=5.5;
    //console.log(actor.y)
    //console.log(GROUND-205)
  } else if (P_Up && actor.y < GROUND-215) {
    P_Up = false;
    falling = true;
  } else if (falling) {
    actor.y +=5.5;
    if(actor.y > GROUND-80) {
      actor.y = GROUND-75;
      falling = false;
    }
  }
  //공격 변수여서 여기다가..
  if (P_Space) {
    
    const attack_A = {
      x : actor.x +30,
      y : actor.y + stack,
      width : actor.width,
      height : actor.height / 3,
      draw() {
        ctx.fillStyle = "gray"
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    timer ++;
    공격중 = true;
    attack_A.draw();
    if (timer % 24 === 0 && timer !== 72) {
      stack += 25;
      /* console.log("48%=0")
      console.log(attack_A.y, stack); */
    
    } else if (timer % 72 === 0) {
      P_Space = false;
      공격중 = false;
      timer = 0;
      stack = 0;
      //console.log(villain_R.x - (attack_A.x+attack_A.width), "wow")
    }
    console.log(timer)
    //피격 공격안에 있어야하나 dd
    if ((villain_R.x - attack_A.width <= attack_A.x && attack_A.x <= villain_R.x + attack_A.width) && (villain_R.y - attack_A.height <= attack_A.y && attack_A.y <= villain_R.y + villain_R.height)) {
      villain_R.kill();
      //console.log("kill him")
    }
  }
  //엑터 사망판정
  if ((villain_R.x - actor.width <= actor.x && actor.x <= villain_R.x + actor.width) && (villain_R.y - actor.height <= actor.y && actor.y <= villain_R.y + actor.height)) {
    console.log("game over");
    home.classList.remove(class_HIDDEN)
    canvas.classList.add(class_HIDDEN);
  }
  //빌런이동
  villain_R.x -= 1.5; 



}

function playAgain(e) {
  e.preventDefault();
  
}



framework1();


document.addEventListener("keydown", function(e){
  if (e.code === "Space" && 공격중 ===false) {
    P_Space = true;
    //console.log("space worked")
  }
})

document.addEventListener("keydown", function(e){
  if (e.code === "ArrowRight") {
    //console.log("오른쪽 나가아자")
    P_Right = true;
  }
}); document.addEventListener("keyup", function(e) {
      if (e.code === "ArrowRight") {
        P_Right = false;
      }
    })

document.addEventListener("keydown", function(e){
  if (e.code === "ArrowLeft") {
    P_Left = true;
  }
}); document.addEventListener("keyup", function(e) {
      if (e.code === "ArrowLeft") {
        P_Left = false;
      }
    })

document.addEventListener("keydown", function(e) {
  if (e.code === "ArrowUp" && actor.y === GROUND-75) {
    P_Up = true;
  }
})

btn_again.addEventListener("submit", playAgain)





