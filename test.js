
let num = 0;

function test() {
if (num === 0) {
  num ++
  console.log("1")
  if (num === 1) {
    num ++
    console.log(num)
    num = 10;
  }
}
}

console.log(num)

test()

console.log(num)