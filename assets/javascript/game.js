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
	han = new Character ('Han Solo', 'han', 'assets/images/han.jpg', 
		170, 25, 50, characters);

	greedo = new Character ('Greedo', 'greedo', 'assets/images/greedo.jpg', 
		110, 30, 40, characters);

	boba = new Character ('Boba Fett', 'boba', 'assets/images/boba.jpg', 
		130, 35, 70, characters);

	lando = new Character ('Lando Calrissian', 'lando', 'assets/images/lando.jpg', 
		60, 45, 80, characters);




// FUNCTIONS / INTERFACE
// ===================================

	/* player can hook a character, 
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

	/* computer can hook a character, 
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

	/* Game Function: Main Interface for other objects */
	var game = {

		// game flags
		playerChosen : false,
		computerChosen : false,

		// boot up game
		load : function(){
			this.playerChosen = false;
			this.computerChosen = false;
			wins = 0;

			// display start message in fight-info div
			$('#fight-info').append("<p>Choose your Character and your Opponents below!</p>");
			// load each of characters (arr) into box
			for (var i = 0; i < characters.length; i++) {

				// prepare elements
				var charDiv = $("<div class='col-xs-3'>");
				var charImg = $("<img alt='" + characters[i].name + 
					"' class='fighter img-responsive' data-name='" + characters[i].dataName +
					"'>").attr("src", characters[i].pic);
				var charHP = $("<p class='hp'>HP: " + characters[i].hp + "</p>");
				var charAP = $("<p class='ap'>Attack: " + characters[i].ap + "</p>");
				var charCAP = $("<p class='cap'>Counter: " + characters[i].cap + "</p>");

				// father the div with it's child elements
				charDiv.append(charImg, charHP, charAP, charCAP);

				// display elements
				$('#char-slots').append(charDiv);

				// make header reference player selection
				$("#char-header").text("Choose Your Character");
			}
		},

		select : function(sel) {
			// 1: player chooses a character
			if (!game.playerChosen) {
				// catch character, put info in battlezone
				var charName = sel.attr("data-name");
				var choice = eval(charName);
				var choiceDiv = $("<div id='player'>");
				var choiceImg = $("<img alt='" + choice.name + 
						"' class='img-responsive' id='player-img'>").attr("src", choice.pic);
				var choiceHP = $("<p id='player-hp'>HP: " + choice.hp + "</p>");
				var choiceAP = $("<p id='player-ap'>Attack: " + choice.ap + "</p>");

				// father the div
				choiceDiv.append(choiceImg, choiceHP, choiceAP);

				// display attacker, remove from charslot
				$("#attacker-area").append(choiceDiv);
				sel.parent().remove();

				// change size of remaining characters
				$(".fighter").parent().toggleClass("col-xs-3");
				$(".fighter").parent().addClass("col-xs-4");

				// change name of charslot header
				$("#char-header").text("Select Your Opponent");

				// remove attack stats from charslot
				$(".ap").remove();


				// set player as choice
				player.hook(choice);
				var playerChoice = true;
			}		

			// 2: player chooses an enemy
			if (game.playerChosen && !game.computerChosen) {

				// catch character, put info in elements
				var charName = sel.attr("data-name");
				var choice = eval(charName);
				var choiceDiv = $("<div id='computer'>");
				var choiceImg = $("<img alt='" + choice.name + 
						"' class='img-responsive' id='computer-img'>").attr("src", choice.pic);
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

			/* 3: check if player and comp was chosen,
			 *   and if so, append the attack button  */
			if (playerChoice) {
				game.playerChosen = true;
			}

			if (computerChoice) {
				game.computerChosen = true;
				var fightMes = "<p id='fight-message'>Fight</p>";
				var attackButton = $("<input class='btn btn-danger' type='button' value='attack'>");
				
				// Clear out fight-info div, then fill it in with the attack button
				$("#fight-info").empty();
				$("#fight-info").append(fightMes, attackButton);
			}
		},

		clash : function() {
			// 1: Player attack portion
			// ========================

			// remove any existing attack messages, then display new player attack message
			$('.attack-mes').remove();
			var p_damageMessage = $("<p class='attack-mes'>You attack " + computer.name + 
															" for " + player.ap + " damage.</p>")
			$("#fight-info").append(p_damageMessage);
			// player attacks
			player.attack(computer);

			// win condition
			if (computer.hp <= 0) {
				computer.hp = 0;
				computer.update();
				wins++;
				this.computerChosen = false;
				// empty/remove divs
				$('#computer').remove();
				$('#fight-info').empty();

				// if player wins 3 rounds, start the game over
				if (wins === 3) {
					alert("You beat the game! Play again!");

					// reset game counters
					game.playerChosen = false;
					game.computerChosen = false;

					// empty/remove apropos divs
					$('#fight-info').empty();
					$('#char-slots').empty();
					$('#player').remove();

					// reload the game, stop the function
					this.load();
					return;
				}

				// if player didn't reach 3 wins, show a victory message
				$('#fight-info').append("<p>You beat " + computer.name + 
																"! Choose your next opponent!</p>")

			}
			// 2. Computer Attack Portion
			// ===========================

			// if win condition isn't met, computer attacks
			else {
				// display computer's attack message
				var c_damageMessage = $("<p class='attack-mes'>" + computer.name + 
																" attacks you for " + computer.cap + " damage.</p>");
				$("#fight-info").append(c_damageMessage);

				// attack
				computer.attack(player);
			}

			// lose condition
			if (player.hp <= 0) {
				player.hp = 0;
				player.update();
				alert("You lose...play again!");
				game.playerChosen = false;
				this.computerChosen = false;

				// empty/remove apropos divs
				$('#fight-info').empty();
				$('#char-slots').empty();
				$('#player').remove();
				$('#computer').remove();

				// reload the game, stop the function
				this.load();
				return;
			}

			/* if no win or lose conditions are met
			 * update the player and computer stats in the html */
			player.update();
			computer.update();
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
		$('body').on('click', '#fight-info', function() {
			game.clash()
		});
	
	});


