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
const right = "right";
const left = "left";


////////////이미지 불러오기

const img_villain = new Image();
img_villain.src = 'src/villain1.png'
//
const img_actorRight = new Image();
img_actorRight.src = 'src/actorRight.png'

const img_actorRightMove1 = new Image();
img_actorRightMove1.src = 'src/actorRightMove1.png'

const img_actorRightMove2 = new Image();
img_actorRightMove2.src = 'src/actorRightMove2.png'
//
const img_actorLeft = new Image();
img_actorLeft.src = 'src/actorLeft.png'

const img_actorLeftMove1 = new Image();
img_actorLeftMove1.src = 'src/actorLeftMove1.png'

const img_actorLeftMove2 = new Image();
img_actorLeftMove2.src = 'src/actorLeftMove2.png'
//
const img_actorAttack1 = new Image();
img_actorAttack1.src = 'src/actorAttack1.png'
const img_actorAttack2 = new Image();
img_actorAttack2.src = 'src/actorAttack2.png'
const img_actorAttack3 = new Image();
img_actorAttack3.src = 'src/actorAttack3.png'
//
const img_actorAttack_L1 = new Image();
img_actorAttack_L1.src = 'src/actorAttack_L1.png'
const img_actorAttack_L2 = new Image();
img_actorAttack_L2.src = 'src/actorAttack_L2.png'
const img_actorAttack_L3 = new Image();
img_actorAttack_L3.src = 'src/actorAttack_L3.png'

function actorAttack() {
  if(timer < 18) {
    return img_actorAttack1;
  } else if (timer >=18 && timer <36) {
    return img_actorAttack2;
  } else if (timer >=36 && timer <=54) {
    return img_actorAttack3;
  }
}
function actorAttack_L() {
  if(timer < 18) {
    return img_actorAttack_L1;
  } else if (timer >= 18 && timer < 36) {
    return img_actorAttack_L2;
  } else if (timer >= 36 && timer <= 54) {
    return img_actorAttack_L3;
  }
}
/////////////////////////////////////////////////////////////////
ctx.fillStyle = "Brown";
ctx.fillRect(0, 0.70*CAN_HEI+75, CAN_WID, 0.3*CAN_HEI-75);

let P_Left = false;
let P_Right = false;
let P_Up = false;
let falling = false;
let P_Space = false;
let 공격중 = false;
let timer = 0;
let stack = 0;
let ultimatePoint = 0;
let imgFrameR = 0;
let imgFrameL = 0;

let MOVING = false;

let HEADING_POINT = right;

const villainOnScreen = [];


//주인공 설정 
const actor = {
  x : 0.50*CAN_WID,
  y : 0.70*CAN_HEI,
  width : 40,
  height : 75,
  draw() {
    ctx.fillStyle = "black";
    if (HEADING_POINT === right && MOVING === false) {
      ctx.drawImage(img_actorRight, this.x, this.y);
    } else if (HEADING_POINT === left && MOVING === false) {
      ctx.drawImage(img_actorLeft, this.x, this.y);
    }
  } 
}

//빌런 설정
class Villain {
  constructor(name, x, y, width, height, dead) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dead = false;
  }
  draw(img) {
    ctx.drawImage(img, this.x, this.y-1);
  }
  kill() {
    ctx.clearRect(this.x, this.y, this.width, this.height)
    this.dead = true;
    if (ultimatePoint <= 100) {
      ultimatePoint += 8;
    } else if (ultimatePoint > 100) {
      ultimatePoint = 100;
    }
  }
}
const villain_R = new Villain("villain_R", 0.95*CAN_WID, 0.7*CAN_HEI+10, 40, 65);
villainOnScreen.push(villain_R);

class ChargingVillain {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.dead = false;
  }
}

//주인공 공격 히트는 frame 안에다 ..



//조작키
function framework1() {
  requestAnimationFrame(framework1);
  // 프레임마다 밑배경 이하를 지우고 그리고 반복 값은 저장됨으로 변경도 저장된 채로 그림이 그려진다.
  ctx.clearRect(0, 0, CAN_WID, 0.7*CAN_HEI+75);
  actor.draw();
  villainOnScreen.forEach((a, i, o)=> {
    if (a.dead === true) {
      a.x = -999;
      o.splice(i, 1);
    }
    a.draw(img_villain);
    a.x -= 1.5;
  })

  //////좌우 이동
  if (P_Left) {
    actor.x -= 2.5;
  } else if (P_Right) {
    actor.x += 2.5;
  }
  if (HEADING_POINT === right && MOVING === true) {
    imgFrameR ++
    console.log(imgFrameR);
    if (imgFrameR <= 30 ) {
      ctx.drawImage(img_actorRightMove1, actor.x, actor.y);
    } else if (imgFrameR <= 60) {
      ctx.drawImage(img_actorRightMove2, actor.x, actor.y);
    } else if (imgFrameR === 61) {
      imgFrameR = 0;
      ctx.drawImage(img_actorRightMove1, actor.x, actor.y);
    }};
    if (HEADING_POINT === left && MOVING === true) {
      imgFrameL ++
      console.log(imgFrameL);
      if (imgFrameL <= 30 ) {
        ctx.drawImage(img_actorLeftMove1, actor.x, actor.y);
      } else if (imgFrameL <= 60) {
        ctx.drawImage(img_actorLeftMove2, actor.x, actor.y);
      } else if (imgFrameL === 61) {
        imgFrameL = 0;
        ctx.drawImage(img_actorLeftMove1, actor.x, actor.y);
      }};
  ///////////jump!!
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
        x : actor.x +actor.width,
        y : actor.y + stack,
        width : actor.width,
        height : actor.height / 3,
        draw() {
          ctx.drawImage(actorAttack(), this.x, this.y);
        }
      }
    
      const attack_A_L = {
        x : actor.x - actor.width,
        y : actor.y + stack,
        width : actor.width,
        height : actor.height / 3,
        draw() {
          ctx.drawImage(actorAttack_L(), this.x, this.y);
        }
      }
    

    timer ++;
    공격중 = true;
    if (HEADING_POINT === right) {
      attack_A.draw()
    } else if (HEADING_POINT === left) {
      attack_A_L.draw()
    }
    //attack_A.draw();
    if (timer % 18 === 0 && timer !== 54) {
      stack += 25;
      /* console.log("48%=0") zzzzz 
      console.log(attack_A.y, stack); */
    
    } else if (timer % 54 === 0) {
      P_Space = false;
      공격중 = false;
      timer = 0;
      stack = 0;
      //console.log(villain_R.x - (attack_A.x+attack_A.width), "wow")
    }
    //console.log(timer)
    //피격 공격안에 있어야하나 dd
    if ((villain_R.x - attack_A.width <= attack_A.x && attack_A.x <= villain_R.x + attack_A.width) && (villain_R.y - attack_A.height <= attack_A.y && attack_A.y <= villain_R.y + villain_R.height)) {
      villain_R.kill();
      //console.log("kill him")
    }
  }
  //////////////////엑터 사망판정
  if ((villain_R.x - actor.width <= actor.x && actor.x <= villain_R.x + actor.width) && (villain_R.y - actor.height <= actor.y && actor.y <= villain_R.y + actor.height)) {
    console.log("game over");
    home.classList.remove(class_HIDDEN)
    canvas.classList.add(class_HIDDEN);
  };

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
    MOVING = true;
    HEADING_POINT = right;
  }
}); document.addEventListener("keyup", function(e) {
      if (e.code === "ArrowRight") {
        P_Right = false;
        MOVING = false;
      }
    })

document.addEventListener("keydown", function(e){
  if (e.code === "ArrowLeft") {
    P_Left = true;
    MOVING = true;
    HEADING_POINT = left;
  }
}); document.addEventListener("keyup", function(e) {
      if (e.code === "ArrowLeft") {
        P_Left = false;
        MOVING = false;
      }
    })

document.addEventListener("keydown", function(e) {
  if (e.code === "ArrowUp" && actor.y === GROUND-75) {
    P_Up = true;
  }
})

document.addEventListener("keydown", function(e) {
  if (e.code === "R") {
    ultimatePoint = 0;
    console.log(e)
  }
})

btn_again.addEventListener("submit", playAgain)





