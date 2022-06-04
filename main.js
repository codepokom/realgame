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
const NORMAL = "normal"
const CHARGE = "charge"
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
//
const img_ice = new Image();
img_ice.src = 'src/what.png'

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
ctx.fillStyle = "Skyblue";
//아래배경도 인터벌로 넣음.
//ctx.drawImage(img_ice, 0, 0.70*CAN_HEI+75, CAN_WID, 0.3*CAN_HEI-75)

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
let killNum = 0;
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
    if (HEADING_POINT === right && MOVING === false) {
      ctx.drawImage(img_actorRight, this.x, this.y);
    } else if (HEADING_POINT === left && MOVING === false) {
      ctx.drawImage(img_actorLeft, this.x, this.y);
    }
  } 
}

//빌런 설정
class Villain {
  constructor(type, x, y, MOVINGPOINT) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 65;
    this.MOVINGPOINT = MOVINGPOINT;
    this.dead = false;
  }
  draw(img) {
    ctx.drawImage(img, this.x, this.y-1);
  }
  kill() {
    this.dead = true;
    if (ultimatePoint <= 100) {
      ultimatePoint += 8;
    } else if (ultimatePoint > 100) {
      ultimatePoint = 100;
    }
    killNum = parseInt(killNum) + 1;
  }
}
const villain_R = new Villain(NORMAL, 0.95*CAN_WID, 0.7*CAN_HEI+10, left);
villainOnScreen.push(villain_R);

const villain2 = new Villain(NORMAL, 0.05*CAN_WID, 0.7*CAN_HEI+10, right);

class ChargingVillain {
  constructor(x, y, MOVINGPOINT) {
    this.type = "charge"
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.dead = false;
    this.MOVINGPOINT = MOVINGPOINT;
    this.turn = false;
    this.stun = false;
  }
  draw(img) {
    ctx.fillStyle = "red"
    ctx.fillRect(this.x, this.y, 70, 70);
  }
  kill() {
    this.dead = true;
    killNum = parseInt(killNum) + 1;
    if (ultimatePoint < 100) {
      ultimatePoint += 20;
    } else if (ultimatePoint >= 100) {
      ultimatePoint = 100;
    }
  }
}

const c_villain1 = new ChargingVillain(0.85*CAN_WID, 0.7*CAN_HEI+5, left);
//주인공 공격 히트는 frame 안에다 ..

///------------------------조작키
function framework1() {
  //requestAnimationFrame(framework1); setinterval로 대체하였다.
  // 프레임마다 밑배경 이하를 지우고 그리고 반복 값은 저장됨으로 변경도 저장된 채로 그림이 그려진다.
  ctx.clearRect(0, 0, CAN_WID, 0.7*CAN_HEI+75);
  ctx.fillStyle = "Skyblue";
  ctx.fillRect(0, 0.70*CAN_HEI+75, CAN_WID, 0.3*CAN_HEI-75);
  actor.draw();
  villainOnScreen.forEach((a, i, o)=> {
    if (a.dead === true) {
      a.x = -999;
      o.splice(i, 1);
    }
    a.draw(img_villain);
    if (a.type === NORMAL) {
      if (a.MOVINGPOINT === left) {
        a.x -= 1.5;    
      } else if (a.MOVINGPOINT === right) {
        a.x += 1.5;
      }
    } else if (a.type === CHARGE) {
      if (a.MOVINGPOINT === left) {
        a.x -= 5.3;
        console.log(a.x);
      } else if (a.MOVINGPOINT === right) {
        a.x += 5.3;
      }
    }
    
    
  })

  /////------------빌런  더  생성
  if (villain_R.dead === true && killNum === 1) {
    villainOnScreen.push(villain2);
    killNum += 0.1
  } else if (villain2.dead === true && killNum ===4) {
    villainOnScreen.push(c_villain1);
    killNum += 0.1; // 이거 안해주면 빌런 존나생기는듯?
  } else if (killNum === 2) {
    const villain_R2 = new Villain(NORMAL, 0.95*CAN_WID, 0.7*CAN_HEI+10, left);
    const villain_L2 = new Villain(NORMAL, 0.05*CAN_WID, 0.7*CAN_HEI+10, right);
    villainOnScreen.push(villain_R2, villain_L2);
    killNum += 0.1;
  }
  //////-------------------좌우 이동
  if (P_Left) {
    actor.x -= 1.5;
  } else if (P_Right) {
    actor.x += 1.5;
  }
  if (HEADING_POINT === right && MOVING === true) {
    imgFrameR ++
    //console.log(imgFrameR);
    if (imgFrameR <= 50 ) {
      ctx.drawImage(img_actorRightMove1, actor.x, actor.y);
    } else if (imgFrameR <= 100) {
      ctx.drawImage(img_actorRightMove2, actor.x, actor.y);
    } else if (imgFrameR === 101) {
      imgFrameR = 0;
      ctx.drawImage(img_actorRightMove1, actor.x, actor.y);
    }};
    if (HEADING_POINT === left && MOVING === true) {
      imgFrameL ++
      //console.log(imgFrameL);
      if (imgFrameL <= 50 ) {
        ctx.drawImage(img_actorLeftMove1, actor.x, actor.y);
      } else if (imgFrameL <= 100) {
        ctx.drawImage(img_actorLeftMove2, actor.x, actor.y);
      } else if (imgFrameL === 101) {
        imgFrameL = 0;
        ctx.drawImage(img_actorLeftMove1, actor.x, actor.y);
      }};
  ///////////------jump!!
  if (P_Up && actor.y >= GROUND-215) {
    actor.y -=3.5;
    //console.log(actor.y)
    //console.log(GROUND-205)
  } else if (P_Up && actor.y < GROUND-215) {
    P_Up = false;
    falling = true;
  } else if (falling) {
    actor.y +=3.0;
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
    if (timer % 18 === 0 && timer !== 54) {
      stack += 25;
    } else if (timer % 54 === 0) {
      P_Space = false;
      공격중 = false;
      timer = 0;
      stack = 0;
    }
    //console.log(timer)
    //피격 공격안에 있어야하나 dd
    villainOnScreen.forEach((a, i, o) => {
      if (HEADING_POINT === right) {
        if ((a.x - attack_A.width <= attack_A.x && attack_A.x <= a.x + attack_A.width) && (a.y - attack_A.height <= attack_A.y && attack_A.y <= a.y + a.height)) {
          if (a.type !== CHARGE) {
            a.kill();
          } else if (a.type === CHARGE) {
            if(a.MOVINGPOINT !== "0") {
            console.log("Blocked")
            } else if (a.MOVINGPOINT === "0") {
              a.kill();
            }
          }
        console.log("kill him")
      }} else if (HEADING_POINT === left) {
        if ((a.x <= attack_A_L.x && a.x + a.width >= attack_A_L.x) && (a.y <= attack_A_L.height + attack_A_L.y && attack_A_L.y <= a.y + a.height)) {
          if (a.type !== CHARGE) {
            a.kill();
          } else if (a.type === CHARGE) {
            if(a.MOVINGPOINT !== "0") {
              console.log("Blocked")
              } else if (a.MOVINGPOINT === "0") {
                a.kill();
              }
          }
        }
      }
    })
  
  }
    ///////공격끝
    //-차저 방향전환 및 스턴
    villainOnScreen.forEach((a, i, o) => {
      if (a.type === CHARGE && a.MOVINGPOINT === left && a.x <= 0 ) {
        if (a.turn === true) {
          a.stun = true;
          a.x = 0;
          a.MOVINGPOINT = "0";
        } else if (a.turn === false) {
          a.turn = true;
          a.MOVINGPOINT = right;
        }
      } else if (a.type === CHARGE && a.MOVINGPOINT === right && a.x >= CAN_WID-70 ) {
        if (a.turn === true) {
          a.stun = true;
          a.x = CAN_WID-70;
          a.MOVINGPOINT = "0";
        } else if (a.turn === false) {
          a.turn = true;
          a.MOVINGPOINT = left;
        }
      }
      
    })
  //////////////////엑터 사망판정
  /* if ((villain_R.x - actor.width <= actor.x && actor.x <= villain_R.x + actor.width) && (villain_R.y - actor.height <= actor.y && actor.y <= villain_R.y + actor.height)) {
    console.log("game over");
    home.classList.remove(class_HIDDEN)
    canvas.classList.add(class_HIDDEN);
  }; */
  //이거로하면 위의것을 일일ㅇ이쓰지않아도 되긴하는데 그냥 리턴하는 방법(return foreach => return a)은 없는건가>?
  villainOnScreen.forEach((a, i, o) => {
    if ((a.x - actor.width <= actor.x && actor.x <= a.x + actor.width) && (a.y - actor.height <= actor.y && actor.y <= a.y + actor.height)) {
      console.log("game over");
      home.classList.remove(class_HIDDEN)
      canvas.classList.add(class_HIDDEN);
    };
  })
  //

  
}

function playAgain(e) {
  e.preventDefault();
}

//프레임 대신 인터벌로 실행 간격을 줄이니 자연스러워보인다.
setInterval(framework1, 5)
//////////////////////////////////////리스너

document.addEventListener("keydown", function(e){
  if (e.code === "Space" && 공격중 ===false) {
    P_Space = true;
  }
})

document.addEventListener("keydown", function(e){
  if (e.code === "ArrowRight") {
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





