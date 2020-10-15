'use strict'

const field = document.createElement('div');

document.body.append(field);

field.setAttribute('class', 'field');

for (let i = 0; i < 400; i++) {
  const box = document.createElement('div');

  box.setAttribute('class', 'box');
  field.append(box);
}

const min = 1,
      max = 20;
let x = min,
    y = max;
const boxes = document.querySelectorAll('.box');

for (const box of boxes) {
  if (x > 20) {
    x = 1;
    y--;
  }
  box.setAttribute('posX', x);
  box.setAttribute('posY', y);
  x++;
}

function generateSnake() {
  const posX = Math.round(Math.random() * (max - min) + min);
  const posY = Math.round(Math.random() * (max - min) + min);
  
  return [posX, posY];
}

let coords = generateSnake();
let snakeBody = [
  document.querySelector(`[posX = '${coords[0]}'][posY = '${coords[1]}']`)];

for (const item of snakeBody) {
  item.classList.add('snakeBody')
}

snakeBody[0].classList.add('snakeHead');

let apple;

function createApple() {
  function generateApple() {
    const posX = Math.round(Math.random() * (max - min) + min);
    const posY = Math.round(Math.random() * (max - min) + min);
    
    return [posX, posY];
  }

  let appleCoords = generateApple();
  apple = document.querySelector(`[posX = '${appleCoords[0]}'][posY = '${appleCoords[1]}']`);

  while(apple.classList.contains('snakeBody')) {
    let appleCoords = generateApple();
    apple = document.querySelector(`[posX = '${appleCoords[0]}'][posY = '${appleCoords[1]}']`);
  }

  apple.classList.add('apple');  
}

createApple();

let direction = '';
let prew;
let steps = false;
let snakeCoords;

function move() {
  snakeCoords = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];

  if (direction !== '') {
    snakeBody[0].classList.remove('snakeHead');
  snakeBody[snakeBody.length - 1].classList.remove('snakeBody');
  snakeBody.pop();

  if(direction === 'right') {
    if (snakeCoords[0] < 20) {
      snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoords[0] + 1}'][posY = '${snakeCoords[1]}']`));
    } else {
      snakeBody.unshift(document.querySelector(`[posX = '1'][posY = '${snakeCoords[1]}']`));
    }
    } else if (direction === 'left') {
      if (snakeCoords[0] > 1) {
        snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoords[0] - 1}'][posY = '${snakeCoords[1]}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX = '20'][posY = '${snakeCoords[1]}']`));
      }
    } else if (direction === 'up') {
      if (snakeCoords[1] < 20) {
        snakeBody.unshift(document.querySelector(`[posX = '${snakeCoords[0]}'][posY = '${+snakeCoords[1] + 1}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX = '${snakeCoords[0]}'][posY = '1']`));
      }
    } else if (direction === 'down') {
      if (snakeCoords[1] > 1) {
        snakeBody.unshift(document.querySelector(`[posX = '${snakeCoords[0]}'][posY = '${+snakeCoords[1] - 1}']`));
      } else {
        snakeBody.unshift(document.querySelector(`[posX = '${snakeCoords[0]}'][posY = '20']`));
      }
    }

    if (snakeBody[0].getAttribute('posX') === apple.getAttribute('posX')
      && snakeBody[0].getAttribute('posY') === apple.getAttribute('posY')) {
        apple.classList.remove('apple');

        let addX = snakeBody[snakeBody.length - 1].getAttribute('posX'),
            addY = snakeBody[snakeBody.length - 1].getAttribute('posY');

        snakeBody.push(document.querySelector(`[posX = '${addX}'][posY = '${addY}']`));
        createApple();
    }

    if (snakeBody[0].classList.contains('snakeBody')) {
      setTimeout(() => {
        alert('Game Over');
      }, 200);    
      clearInterval(interval);
    }

    snakeBody[0].classList.add('snakeHead');
    for (const item of snakeBody) {
      item.classList.add('snakeBody')
    }

    const x = document.querySelector(`[posX = '${snakeCoords[0]}'][posY = '${snakeCoords[1]}']`);

    if (prew !== direction && x.classList.contains('snakeBody')) {
      if ((prew === 'up' && direction === 'left') || (prew === 'right' && direction === 'down')){
        x.classList.add('tangle', 'tangle1');
      }
      else if ((prew === 'down' && direction === 'right') || (prew === 'left' && direction === 'up')){
        x.classList.add('tangle', 'tangle2');
      }
      else if ((prew === 'right' && direction === 'up') || (prew === 'down' && direction === 'left')){
        x.classList.add('tangle', 'tangle3');
      }
      else if ((prew === 'up' && direction === 'right') || (prew === 'left' && direction === 'down')){
        x.classList.add('tangle', 'tangle4');
      }
    }

    const y = document.querySelectorAll(`.tangle`);
    for (const item of y) {
      if (item !== null && !item.classList.contains('snakeBody')) {      
        item.classList.remove('tangle', 'tangle1', 'tangle2', 'tangle3', 'tangle4');        
      }      
    }
  }

  prew = direction;
  steps = true;
}

let interval = setInterval(move, 200);

window.addEventListener('keydown', event => {
  if (steps === true) {
    if (event.code === 'ArrowUp' && direction !== 'down') {
      direction = 'up';
      steps = false;
    }
    else if (event.code === 'ArrowDown' && direction !== 'up') {
      direction = 'down';
      steps = false;
    }  
    else if (event.code === 'ArrowLeft' && direction !== 'right') {
      direction = 'left';
      steps = false;
    }  
    else if (event.code === 'ArrowRight' && direction !== 'left') {
      direction = 'right';
      steps = false;
    }
  }  
})
