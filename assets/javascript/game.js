/* Star Wars RPG 1.0 
 *  - Steve Graboski 
 */

// GLOBAL VARIABLES / OBJECTS
// ===============================

	// empty array for our characters
	var characters = [];

	// set up flags
	var wins = 0;

	// Character class
	function Character(name, dataName, pic, hp, ap, cap, arr) {
		this.name = name;
		this.dataName = dataName;
		this.pic = pic;
		this.hp = hp;
		this.ap = ap;
		this.cap = cap;
		// place character obj in characters arr when obj gets created
		characters.push(this);
	}

	// create our characters
	han = new Character ('Han Solo', 'han', 'http://placehold.it/125x125', 
		170, 25, 50, characters);

	greedo = new Character ('Greedo', 'greedo', 'http://placehold.it/125x125', 
		110, 30, 40, characters);

	boba = new Character ('Boba Fett', 'boba', 'http://placehold.it/125x125', 
		130, 35, 70, characters);

	lando = new Character ('Lando Calrissian', 'lando', 'http://placehold.it/125x125', 
		60, 45, 80, characters);




// FUNCTIONS / INTERFACE
// ===================================

	/* player needs to be able to hook a character, 
	 * use that character's points as his, and attack */
	var player = {
		hook : function(obj) {
			this.name = obj.name;
			this.pic = obj.pic;
			this.hp = obj.hp;
			this.ap = obj.ap;
			this.base_ap = obj.ap;
		},

		attack : function(obj) {
			obj.hp -= this.ap;
			this.ap += this.base_ap;
		},

		// update attack display after attack
		update : function() {
			var boostedAttack = $("<p id='player-ap'>Attack: " + this.ap + "</p>");
			var hp = $("<p id='player-hp'>HP: " + this.hp + "</p>")
			$('#player-ap').html(boostedAttack);
			$('#player-hp').html(hp);
		}
	}

	/* computer needs to be able to hook a character, 
	 * use that character's points as his, and counter-attack */
	var computer = {
		hook : function(obj) {
			this.name = obj.name;
			this.pic = obj.pic;
			this.hp = obj.hp;
			this.cap = obj.cap;
			this.base_ap = obj.ap;
		},

		attack : function(obj) {
			obj.hp -= this.cap;
		},

		update : function() {
			var boostedCounter = $("<p id='computer-cap'>Counter: " + this.cap + "</p>");
			var hp = $("<p id='computer-hp'>HP: " + this.hp + "</p>")
			$('#computer-ap').html(boostedCounter);
			$('#computer-hp').html(hp);
		}
	}

	/* game needs to handle fight, win conditions, 
	 * lose conditions, and round win collection */
	var game = {

		// game flags
		playerChosen : false,
		computerChosen : false,

		// onload
		load : function(){
			this.playerChosen = false;
			this.computerChosen = false;
			wins = 0;
			// load each of characters (arr) into box
			for (var i = 0; i < characters.length; i++) {

				// prepare elements
				var charDiv = $("<div class='col-sm-3'>");
				var charImg = $("<img alt='" + characters[i].name + 
					"' class='fighter' data-name='" + characters[i].dataName +
					"'>").attr("src", characters[i].pic);
				var charHP = $("<p>HP: " + characters[i].hp + "</p>");
				var charAP = $("<p>Attack: " + characters[i].ap + "</p>");
				var charCAP = $("<p>Counter: " + characters[i].cap + "</p>");

				// father the div with it's child elements
				charDiv.append(charImg, charHP, charAP, charCAP);

				//display elements
				$('#char-slots').append(charDiv);
			}
		},

		select : function(sel) {
			if (!game.playerChosen) {
				// catch character, put img in battlezone
				var charName = sel.attr("data-name");
				var choice = eval(charName);
				var choiceDiv = $("<div id='player'>");
				var choiceImg = $("<img alt='" + choice.name + 
						"' id='player'>").attr("src", choice.pic);
				var choiceHP = $("<p id='player-hp'>HP: " + choice.hp + "</p>");
				var choiceAP = $("<p id='player-ap'>Attack: " + choice.ap + "</p>");

				// father the div
				choiceDiv.append(choiceImg, choiceHP, choiceAP);

				// display attacker, remove from charslot
				$("#attacker-area").append(choiceDiv);
				sel.parent().remove();

				// set player as choice
				player.hook(choice);
				var playerChoice = true;
			}

		// click fighter pictures
		

			// 2: choose an enemy
			if (game.playerChosen && !game.computerChosen) {

				// catch character, put info in elements
				var charName = sel.attr("data-name");
				var choice = eval(charName);
				var choiceDiv = $("<div id='computer'>");
				var choiceImg = $("<img alt='" + choice.name + 
						"' id='computer'>").attr("src", choice.pic);
				var choiceHP = $("<p id='computer-hp'>HP: " + choice.hp + "</p>");
				var choiceCAP = $("<p id='computer-cap'>Counter: " + choice.cap + "</p>");
				
				// father the div
				choiceDiv.append(choiceImg, choiceHP, choiceCAP);
				$("#defender-area").append(choiceDiv);

				// Remove the spot from the char slot
				sel.parent().remove();

				// set computer as choice
				computer.hook(choice);
				var computerChoice = true;
			}

			// check if player or comp was chosen
			if (playerChoice) {
				game.playerChosen = true;
			}

			if (computerChoice) {
				game.computerChosen = true;
				var attackButton = $("<input type='button' value='attack'>");
				$("#attack-button").append(attackButton);
			}
		},

		clash : function() {
			// player attacks
			player.attack(computer);
			// win condition
			if (computer.hp <= 0) {
				computer.hp = 0;
				computer.update();
				alert("you win");
				wins++;
				this.computerChosen = false;
				// empty/remove divs
				$('#computer').remove();
				$('#attack-button').empty();
			}
			else {
				// computer attacks if no win occurrs
				computer.update();
				computer.attack(player);
			}
			player.update();

			// lose condition
			if (player.hp <= 0) {
				alert("you lose");
				game.playerChosen = false;
				this.computerChosen = false;
				// empty/remove divs
				$('#attack-button').empty();
				$('#char-slots').empty();
				$('#player').remove();
				$('#computer').remove();

				// start the game over
				this.load();
			}

			// 3 rounds won, start over
			if (wins === 3) {
				alert("You beat the game! Play again!");

				// reset game counters
				game.playerChosen = false;
				game.computerChosen = false;

				// empty/remove divs
				$('#attack-button').empty();
				$('#char-slots').empty();
				$('#player').remove();

				// start the game over
				this.load();
			}
		}
	}

// MAIN PROCESS (call functions, register inputs)
// ===============================

	// load game
	$(document).load(game.load());

	// prepare clicks;
	$(document).ready(function() {

		// click player / enemy select
		$('body').on("click", ".fighter", function() {
			game.select($(this));
		});

		// click attack
		$('body').on('click', '#attack-button', function() {
			game.clash()
		});
	
	});


