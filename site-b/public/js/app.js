function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function main () {

  let countCol = {x: 10,y: 10};
  let arrayCells = [];  //table
  let directionSnake = 'right';
  let mainPlan = document.querySelector('.plan');
  let fin = false;  // show finish
  let score = 0;  // show the score
  let type = 1;  // show the type of the game (with borders or not)
  let body;
  const EVENTS = new Map([
    [37, 'left'],
    [38, 'top'],
    [39, 'right'],
    [40, 'bottom']
    ]);
  const TABLE_SIZES = [324, 540, 648]; 
  let interval = 500;  
  let paused = false;
  
  // adding our clear table
  const add_table = () => {
    for(let i = 0; i < countCol.x; i++){    
      arrayCells[i] = [];
      for(let j = 0; j < countCol.y; j++){
        arrayCells[i].push(0);
      }
    }
  }
	
  // cleaning table without food
  const paint = () => {
    for(let i = 0; i < countCol.x; i++){
      for(let j = 0; j < countCol.y; j++){
        if (arrayCells[i][j] != 2) {
          arrayCells[i][j] = 0;
        }
      }
    }
  }

  //rendering table
  let render = arrayCells => {
    mainPlan.textContent = '';
    let newCell;
    for(let i = 0; i < countCol.x; i++){
      for(let j = 0; j < countCol.y; j++){
        
        newCell = document.createElement('div')
        newCell.setAttribute('data-x',i);
        newCell.setAttribute('data-y',j);
        let sell = arrayCells[i][j];
        if (sell == 1) { // snake
          newCell.className += 'snake';
        } else if (sell == 2) {  // food 
          newCell.className += 'food'; 
        }
        mainPlan.appendChild(newCell);
       
      }
    }
  }

    
  
      
  add_table();
  render(arrayCells); // rendering

  // redrawing snake
  const renderSnake = (plan, bod) => {
    if (fin != true) {
      for(let ind = 0; ind < bod.length; ind++) { 
        plan[bod[ind].x][bod[ind].y] = 1; 
      }
    }
  }

  // for random
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // if end of game 
  const finish = () => {
    let message = document.createElement('div');
    message.className += 'finish';
    let  result = document.createElement('div');
    result.textContent = 'YOUR SCORE : ' + score;
 
    if (score <= 5) {
      message.textContent = 'Try again... ';
    } else if (score <= 10) {
      message.textContent = 'Not bad!';
    } else if (score <= 20) {
      message.textContent = 'Your result is impressive!';
    } else {
      message.textContent = 'YOU ARE THE BEST!';
    }
    message.innerHTML += result.outerHTML; 
    document.querySelector('.result').appendChild(message);
  }  	
  // start move
  const game = () => {
    snake.move(directionSnake);
  }
  
  //adding the food
  function Food() {
    // initialisation the element
    this.init = function() {
      do {
        this.x = getRandomInt(0, countCol.x);
        this.y = getRandomInt(0, countCol.y);
      }
      while (arrayCells[this.x][this.y] == 1);
      arrayCells[this.x][this.y] = 2;
    };
  }
      

  // creating snake
  function Snake() {
              
    // initialisation 
    this.initBody = function(){
      let leng = 1;
      body = [];
      for (let i = leng - 1; i>=0; i--) {
          body.push({x:getRandomInt(0, countCol.x)+i,
              y: getRandomInt(0, countCol.y)});
      }
    }

    // base function where changening direction and coordinates 
    this.move = function(direction) {
      if (!fin) {
        this.x = body[0].x;
        this.y = body[0].y; 
        paint();
                    
        //  choose the direction
        switch(direction){  
          case 'top':
              this.x -= 1;
          break;
          case 'right':
              this.y += 1;
          break;
          case 'bottom':
              this.x += 1;
          break;
          case 'left':
              this.y -= 1;
          break;
        }

        //  version 1 - with border
        const with_border = () => {		
          // checking coordinates if out of table
          if((this.x >= countCol.x) || (this.x < 0) || (this.y >= countCol.y) || (this.y < 0)) {
            fin =  true;
            finish(); 
          }// quit 
        }


        // version 2 - no border
        const no_border = () => {
          if(this.x >= countCol.x) {
            this.x = 0;
          } else if(this.x < 0) {
            this.x = countCol.x - 1;
          }

          if(this.y >= countCol.y) {
            this.y = 0;
          } else if(this.y < 0) {
            this.y = countCol.y - 1;
          }
        }

        if (type == 1) with_border();
        if (type == 2) no_border();
            
        //if food
        if ( fin != true && arrayCells[this.x][this.y] == 2 ) {
          let tail = {x: this.x, y: this.y};
          score++;
        
          //-----------------------
          body.unshift(tail);
          renderSnake(arrayCells, body);
          food.init();
        } else {
          let tail = body.pop(); //pops out the last cell
          tail.x = this.x; 
          tail.y = this.y;
          //------------------------
          body.unshift(tail);
          renderSnake(arrayCells, body);
        }
        render(arrayCells);
        if (score >= 50 ) { 
            fin = true; 
            let win_time = new Date();
            milisec = win_time.getTime() - game_time;
            console.log('milisec',milisec);
            finish(); 
            
        }
      }	
    }
  }	



  
  let snake = new Snake();  //create snake
  let food = new Food();	//create food
  snake.initBody();  // initialisate snake 
  food.init();   // initialisate food for the first time
  
  // events
  document.addEventListener('keydown', event => {
    directionSnake = EVENTS.get(event.which);
  });

  setInterval( function() {
    if (!paused) {
      snake.move(directionSnake);
    } else {
      console.log('pause');
    }
  }, interval);

  document.querySelector('.pause').addEventListener('click', event => {
    paused = true;
  });

  document.querySelector('.play').addEventListener('click', event => {
    paused = false;
  });

  let new_game = () => {
    if (document.querySelector('.finish')) {
      document.querySelector('.finish').remove();
    }
    add_table();
    render(arrayCells); 
    let snake = new Snake();  
    let food = new Food();	
    snake.initBody();  
    food.init();  
    paused = false;
    fin = false;
  }
  document.querySelector('.reset').addEventListener('click', event => {
    new_game();
  });

  
  document.querySelector('.with_borders').addEventListener('click', event => {
    type = 1;
    new_game();
  });	

  document.querySelector('.no_borders').addEventListener('click', event => {
    type = 2;
    new_game();
  });
  
  document.querySelector('.size1').addEventListener('click', event => {
    document.querySelector('.plan').style.width = TABLE_SIZES[0] + 'px';
    document.querySelector('.plan').style.height = TABLE_SIZES[0]+ 'px';
    document.querySelector('.wrapper').style.width = TABLE_SIZES[0]+ 'px';
    document.querySelector('.wrapper').style.height = TABLE_SIZES[0]+ 'px';
    countCol = {
      x: 6,
      y: 6
    };
    new_game();
  });	
  
  document.querySelector('.size2').addEventListener('click', event => {
    document.querySelector('.plan').style.width = TABLE_SIZES[1]+ 'px';
    document.querySelector('.plan').style.height = TABLE_SIZES[1]+ 'px';
    document.querySelector('.wrapper').style.width = TABLE_SIZES[1]+ 'px';
    document.querySelector('.wrapper').style.height = TABLE_SIZES[1]+ 'px';
    countCol = {
      x: 10,
      y: 10
    };
    new_game();
  });	
  
  document.querySelector('.size3').addEventListener('click', event => {
    document.querySelector('.plan').style.width = TABLE_SIZES[2]+ 'px';
    document.querySelector('.plan').style.height = TABLE_SIZES[2]+ 'px';
    document.querySelector('.wrapper').style.width = TABLE_SIZES[2]+ 'px';
    document.querySelector('.wrapper').style.height = TABLE_SIZES[2]+ 'px';
    countCol = {
      x: 12,
      y: 12
    };
    new_game();
  });
}

ready(main);
