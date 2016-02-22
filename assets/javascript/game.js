/* Star Wars RPG 1.0 
 *  - Steve Graboski 
 */

// GLOBAL VARIABLES / OBJECTS
// ===============================

	// empty array for our characters
	var characters = [];

	// set up flags
	var wins = 0
	var playerChosen = false;
	var computerChosen = true;

	// Character class
	function Character(name, pic, hp, ap, cap, arr) {
		this.name = name;
		this.pic = pic;
		this.hp = hp;
		this.ap = ap;
		this.cap = cap;
		// place character obj in characters arr when obj gets created
		characters.push(this);
	}

	// create our characters
	han = new Character ('Han Solo', 'http://placehold.it/125x125', 
		150, 6, 10, characters);

	greedo = new Character ('Greedo', 'http://placehold.it/125x125', 
		100, 10, 8, characters);

	boba = new Character ('Boba Fett', 'http://placehold.it/125x125', 
		150, 20, 15, characters);

	lando = new Character ('Lando Calrissian', 'http://placehold.it/125x125', 
		125, 10, 12, characters);

	console.log(characters)



// FUNCTIONS / INTERFACE
// ===================================

	/* player needs to be able to hook a character, 
	 * use that character's points as his, and attack */
	var player = {
		this.hook = function(obj) {
			this.name = obj.name;
			this.pic = obj.pic;
			this.hp = obj.hp;
			this.ap = obj.ap;
			this.base_ap = obj.ap;
		}

		this.attack = function(obj)
			obj.hp -= this.ap;
			this.ap += this.base;
	}

	/* computer needs to be able to hook a character, 
	 * use that character's points as his, and counter-attack */
	var comp = {
		this.hook = function(obj) {
			comp.name = obj.name;
			comp.pic = obj.pic;
			comp.hp = obj.hp;
			comp.cap = obj.cap;
			comp.base_ap = obj.ap;
		}

		this.attack = function(obj)
			obj.hp -= comp.cap;
	}

	/* game needs to handle fight, win conditions, 
	 * lose conditions, and round win collection */
	var game ={
		game.load = function(){
			wins = 0;
			// TODO: load characters into box
		}

		game.preparePlayer = function() {
			// TODO: Set up the player
		}

		game.prepareComputer = function() {
			// TODO: Set up the Comp
		}

		game.startBattle = function() {
			// TODO: Start Battle
		}

		game.clash = function() {
			player.attack();
			comp.attack();
			if (player.hp <= 0) {
				alert("you lose");
			}
			if (computer.hp <= 0) {
				alert("you win");
				wins++;
			}
		}
	}





// start game


// MAIN PROCESS (call functions, register inputs)
// ===============================

	// load game

	// click a fighter

	// click an enemy

	// click attack


