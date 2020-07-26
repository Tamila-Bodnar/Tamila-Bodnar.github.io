$(document).ready(function(){
	let countCol = {x: 10,y: 10};
	let arrayCells = [];  //table
	let directionSnake = 'right';
	let mainPlan = $('.plan');
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
		mainPlan.text("");
		let html;
		for(let i = 0; i < countCol.x; i++){
			for(let j = 0; j < countCol.y; j++){
				let sell = arrayCells[i][j];
				if (sell == 0) { //clear
					html = "<div data-x = "+ i +" data-y="+ j +"></div>";
				} else if (sell == 1) { // snake
					html = "<div data-x = "+ i +" data-y="+ j +" class='snake'></div>";
				} else {  // food == 2
					html = "<div data-x = "+ i +" data-y="+ j +" class='food'></div>"; 
				}
				mainPlan.append(html);  
			}
		}
	}

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
		let html; 
		if (score <= 5) {
			html = "<div class ='finish'><div>Try again...</div><div>YOUR SCORE : "+score+" </div></div>";
		} else if (score <= 10) {
			html = "<div class ='finish'><div>Not bad!</div><div>YOUR SCORE : "+score+" </div></div>";
		} else if (score <= 20) {
			html = "<div class ='finish'><div>Your result is impressive!</div><div>YOUR SCORE : "+score+" </div></div>";
		} else {
			html = "<div class ='finish'><div>YOU ARE THE BEST!</div><div>YOUR SCORE : "+score+" </div></div>";
		}
		$('.result').append(html);
	}  	
	// start move
	const game = () => {
		snake.move(directionSnake);
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
				} 
				else {
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

	// events
	$("body").keydown( event => {
		directionSnake = EVENTS.get(event.which);
	});

	setInterval( function() {
		if (!paused) {
			snake.move(directionSnake);
		} else {
			console.log('pause');
		}
	}, interval);
		
    	
	add_table();
	render(arrayCells); // rendering
	let snake = new Snake();  //create snake
	let food = new Food();	//create food
	
	snake.initBody();  // initialisate snake 
	food.init();   // initialisate food for the first time

	$('.pause').click (function() {
		paused = true;
	});

	$('.play').click( function(){
		paused = false;
	});

	let new_game = () => {
		$('.finish').remove();
		event.preventDefault();
		add_table();
		render(arrayCells); 
		let snake = new Snake();  
		let food = new Food();	
		snake.initBody();  
		food.init();  
		paused = false;
		fin = false;
	}
	$('.reset').click(new_game);

	
	$('.with_borders').click((event) => {
		type = 1;
		// new_game();
	});	
	$('.no_borders').click((event) => {
		type = 2;
		// new_game();
	});
	
	$('.size1').click((event) => {
		$('.plan').width(324);
		$('.plan').height(324);
		$('.wrapper').width(324);
		$('.wrapper').height(324);
		countCol = {
			x: 6,
			y: 6
		};
		new_game();
	});	
	
	$('.size2').click((event) => {
		$('.plan').width(540);
		$('.plan').height(540);
		$('.wrapper').width(540);
		$('.wrapper').height(540);
		countCol = {
			x: 10,
			y: 10
		};
		new_game();
	});	
	
	$('.size3').click((event) => {
		$('.plan').width(648);
		$('.plan').height(648);
		$('.wrapper').width(648);
		$('.wrapper').height(648);
		countCol = {
			x: 12,
			y: 12
		};
		new_game();
	});	
	
		

});