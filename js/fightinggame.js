
// Converted from PHP to JavaScript.
// Improved page design over first challenge.
// Better colour scheme with flatter buttons.
// New dice images created with additional logo's
// indicating when special powers are generated.
// Vanilla JavaScript used.
// No frameworks or libraries.

"use strict";


// *** TESTING VARIABLES START HERE ***

const NUMBER_OF_CREATURES = 100;

// You probably won't want to rely on chance to generate all
// the different dice doubles to test the text for 
// 'special powers' generated. Therefore, here's a way to 
// override the values for testing: 

const FORCE_DICE_MODE_FOR_TESTING = false;
const FORCED_DICE_ONE = 3;
const FORCED_DICE_TWO = 3;

// *** TESTING VARIABLES END HERE ***



// *** UI Option ***
const MAGINIFIED_INC_DEC_ON = true;
// Isn't as easy to notice that an entry is being changed
// without this option. Although could be annoying if 
// stepping through a lot of values. Therefore option
// is given for disabling it.



function Creature(creatureSpecies, creatureName) {

	this.creatureValid = false;
	this.passedInSpecies = creatureSpecies;
	this.name = creatureName;
	
	this.creatureType ='';
	this.image = '';
	this.strength = 0;
	this.health = 0;
	this.specialPower = '';
	this.tablerowdata = [];
	this.deleted = false;
}

Creature.prototype = {
	constructor: Creature,
	
	setupCreature: function() {

		this.creatureValid = true;

		// These are the unique settings for each creature type. 
		// Random generation of creature type is purposely decoupled 
		// from the Creature class.

		switch(this.passedInSpecies){
			case('Witch'):
				this.creatureType = this.passedInSpecies;
				this.image = 'images/witch.png';
				this.strength = this.getRandomInt({'min': 60, 'max': 80});
				this.health = this.getRandomInt({'min': 50, 'max': 60})
			break;
			case('Dragon'):
				this.creatureType = this.passedInSpecies;
				this.image = 'images/dragon.png';
				this.strength = this.getRandomInt({'min': 80, 'max': 90});
				this.health = this.getRandomInt({'min': 80, 'max': 90})
			break;
			case('Snake'):
				this.creatureType = this.passedInSpecies;
				this.image = 'images/snake.png';
				this.strength = this.getRandomInt({'min': 30, 'max': 60});
				this.health = this.getRandomInt({'min': 30, 'max': 90})
			break;
			case('Troll'):
				this.creatureType = this.passedInSpecies;
				this.image = 'images/troll.png';
				this.strength = this.getRandomInt({'min': 22, 'max': 65});
				this.health = this.getRandomInt({'min': 60, 'max': 92})
			break;
			default:
				this.creatureValid = false;
				// This detects if an invalid creature type is supplied.
				// Main creature creation loop checks this value and will
				// only output the data to the game table if this 
				// value is true
		}

		if(this.name === '') this.creatureValid = false;

	},


	getRandomInt: function(MinAndMaxValues) {
		let min = Math.ceil(MinAndMaxValues.min);
		let max = Math.floor(MinAndMaxValues.max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	deleteCreatureFromGame: function() {
		this.deleted = true;
	},

	incrementHealth: function() {
		this.health++;
	},

	decrementHealth: function() {
		if(this.health !== 0) this.health--;
	},

	getHealthValue: function() {
		return this.health;
	},


	getDetailsAsArray: function() {
		this.tablerowdata['creatureType'] = this.creatureType;
		this.tablerowdata['name'] = this.name;
		this.tablerowdata['image'] = this.image; 
		this.tablerowdata['strength'] = this.strength;
		this.tablerowdata['health'] = this.health;
		this.tablerowdata['specialPower'] = this.specialPower;
		return this.tablerowdata;
	}
};



// This class demonstrates level 4 - Storing the powers 
// Note that the web page removes the output of the power
// types from the screen when dice is re-rolled, but the
// data is still retained.
function Powers() {

	this.powers = [];
	this.availablePowers = ['Increases health by 100',
		'Decreases opponents health by 100',
		'Increases strength between 1 - 100',
		'Decreases strength between 1 - 100',
		'Hides (Skips a go)',
		'Steals 50% of the strength from the opponent'];
}

Powers.prototype = {
	constructor: Powers,

	setPowers: function(numberThrown) {
		this.powers = [];

		for(let count=0; count<= numberThrown-1; count++){
			this.powers.unshift(this.availablePowers[count]);
		}
	},

	clearPowers: function() {
		this.powers = [];
	},

	getPowers: function(){
		return this.powers;
	}
};



// This class is for generating creature names that are linked to the
// creature type.
// After consideration, I was of the opinion that names should be
// suited to creature types (i.e. Trolls with names indicating
// little intelligence, witches with female names etc).
// 
// This tracks which creature names have 
// already been issued to avoid the name being issued again.
// Should an extreme number of creatures be generated that exceeds
// the number of names available, the names will wrap around and start
// again. Also randomises name order for each creature type.
// 
// The name issuing functionality has been decoupled from the creature
// creation class on purpose, although creature type name must be valid. 

function CreatureNames(availableNames) {

	this.availableNames = availableNames;
	this.creatureCountMax = availableNames.length;
	this.creatureTypeArrIndex = 0;
	this.issuedName = '';
	this.shuffleNames(this.availableNames);
}

CreatureNames.prototype = {
	constructor: CreatureNames,

	getName: function() {

		if(this.creatureTypeArrIndex === this.creatureCountMax) this.creatureTypeArrIndex = 0;
		this.issuedName = this.availableNames[this.creatureTypeArrIndex];
		this.creatureTypeArrIndex++;
		
		return this.issuedName;
	},

	shuffleNames: function (array) {

		// Durstenfeld shuffle - courtesy of Stackoverflow
		for(let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
};



let creatureNameFactory = (function (creatureType) {

	let issuedName = '';

	return function (creatureType) {

		switch(creatureType){
			case('Witch'): 
				issuedName = witchNames.getName();
			break;
			case('Dragon'):
				issuedName = dragonNames.getName();
			break;
			case('Snake'): 
				issuedName = snakeNames.getName();
			break;
			case('Troll'):
				issuedName = trollNames.getName();
			break;
			default:
				issuedName = 'Creature type not recognised';
		}
		return issuedName;
	}
})();


let getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Note: Arrow functions have not been used in functions that access
// the global scope. Seems to be a convention after research.


// Main code entry point


const allWitchNames = ['Nelly', 'Esmerelda', 'Germintrude', 'Agnetha', 'Britney', 
	'Ignelda', 'Grimleah', 'Wickanda', 'Stinkina', 'Gertie', 'Gertana',
	'Grimmadella', 'Scumolina', 'Maggie', 'Runette', 'Doomella',
	'Estrella', 'Ophelia', 'Grimette', 'Thornella', 'Prunella', 
	'Hagardina', 'Cruella', 'Putrella', 'Grotta', 'Grottee', 
	'Hagardola', 'Slimella', 'Agnetella', 'Gertrude', 'Ugg',
	'Gruffella', 'Greasola', 'Sweatina', 'Esmerelda', 'Mungola', 
	'Martha', 'Mersha', 'Putrina', 'Punga', 'Dungella', 
	'Cruddenia', 'Cruddella', 'Nell', 'Krona', 
	'Munter', 'Mutrid', 'Mavis', 'Croak', 'Belchette' ];

const allDragonNames = ['Morgon', 'Kalgon', 'Albert', 'Malvor', 'Pednor', 
	'Jecoda', 'Magdor', 'Mengon', 'Hartador', 'Movor', 'Crandon', 'Torfon', 
	'Weslon', 'Mogorian', 'Nortova', 'Naramus', 'Regona', 'Ragar', 
	'Bernie', 'Raynor', 'Cedradon', 'Fargon', 'Merrador', 'Toogon', 'Fogor',
	'Uvavus', 'Camador', 'Aberlith', 'Lassandor', 'Byzan', 'Makadon', 
	'Jirrador', 'Jovor', 'Medor', 'Landoran', 'Bogon', 'Harkor', 'Magaron', 
	'Pendogor', 'Fandorn', 'Mobor', 'Merravon', 'Fentonor', 'Jaravon', 
	'Roborn', 'Jankor', 'Albador', 'Jarramon', 'Crendor', 'Melathan', 
	'Harmadorn', 'Carvor', 'Bannador', 'Markovan', 'Harfon']; 

const allSnakeNames = ['Sidney','Fang','Sircon','Snide','Gripper',
	'Fengtor', 'Slither', 'Vic', 'Jaws', 'Ernie', 'Choker', 'Benkor', 
	'Squeeza', 'Simak', 'Hisston', 'Fangor', 'Venoma', 'Mengor', 
	'Slim', 'Rakmor', 'Samson', 'Sodus', 'Segnor', 'Jake', 
	'Venomode', 'Sandie', 'Seether', 'Finchy', 'Gove', 'Striker', 
	'Pouncer', 'Snart', 'Boa', 'Vipette', 'Scalar', 'Adderon', 
	'Wringer', 'Sandar', 'Anna', 'Vipor', 'Asper', 'Riddick', 
	'Cascar', 'Kobey', 'Casparian', 'Goldar', 'Harley', 'Mottle', 
	'Gopha', 'Keel', 'Lance', 'Mocca', 'Patch', 'Py', 'Sawyer',
	'Pangon', 'Simson', 'King', 'Uri', 'Timba'];

const allTrollNames = ['Mungo', 'Snort', 'Bruiser', 'Wedgie Giver', 
	'Guff', 'Burp', 'Noggin Thumper', 'Knocker', 'Arnie', 'Herbert', 
	'Doofus', 'Simpleton', 'Mugga', 'Oafen', 'McKnuckles', 'Schmuckwit', 
	'Melvin', 'Gregan', 'Norbert', 'Crudbucket', 'Sloppa', 'Jedwick', 'Chugnut', 
	'Noggin Squeezer', 'Burton', 'Crusher', 'Ignoramus', 'Jed', 'Hobon', 
	'Bunce', 'Mung', 'Munge', 'Stench', 'Mudge', 'Lurch', 'Cruncher', 
	'Jenks', 'Dumbwad', 'Biffa', 'Boffa', 'Gruff', 'Lurk', 'Pug', 'Six Fingers', 
	'Chomper', 'Big Belly', 'Barney Four Chins', 'Wart', 'Hogar', 'Smasher', 
	'Dumble', 'Nostril', 'Nugget'];


let witchNames = new CreatureNames(allWitchNames);
let dragonNames = new CreatureNames(allDragonNames);
let snakeNames = new CreatureNames(allSnakeNames);
let trollNames = new CreatureNames(allTrollNames);



let resetButton = document.getElementById('btn-reset').addEventListener('click', resetPage);
let rollButton = document.getElementById('btn-roll').addEventListener('click', rollDice);


// If number of creature types are added to, add the creature type to the
// following array - also add the type to the creatureNameFactory and main
// creature creation object.
let availableCreatures = ['Witch','Dragon','Snake','Troll'];

let maxNumberOfCreaturesAvailable = availableCreatures.length;
let randomCreatureType;
let creatureData = [];
let randomCreatureNumber;
let creatureNameFound = '';



// Main loop for creation of creatures and creature names.

for(let count=0; count<NUMBER_OF_CREATURES; count++){

	randomCreatureNumber = getRandomInt(0, maxNumberOfCreaturesAvailable - 1);
	randomCreatureType = availableCreatures[randomCreatureNumber];

	creatureNameFound = creatureNameFactory(randomCreatureType);

	creatureData[count] = new Creature(randomCreatureType, creatureNameFound );
	creatureData[count].setupCreature();
}


let powers = new Powers();

let tableHeadings = Array("Name","Type","Strength","Health", "Special Power", "Action");
createDynamicTable('#table-box', tableHeadings, creatureData);





// Only functions beyond this point.

function createDynamicTable(cssIdName, tableHeadings, tableData){

	let tablediv = document.querySelector(cssIdName);
	document.querySelector(cssIdName).innerHTML = "";
	
	let table = document.createElement('table');

	// Table headings
	let head = document.createElement('thead');
	let cell;

	tableHeadings.forEach(function(item, index) {
		cell = document.createElement('th');
		cell.appendChild(document.createTextNode(item));
		head.appendChild(cell);
	});

	table.appendChild(head);


	// Table data	
	let indivRowData = [];
	let body = document.createElement('tbody');

	tableData.forEach(function(item, index) {
		if(item != null){
			let row = document.createElement('tr');
			row.id = "row" + index;
			indivRowData = item.getDetailsAsArray();

			cell = createTDElementText(indivRowData['name']);
			row.appendChild(cell);  // name column (text)
			cell = createTDElementImage(indivRowData['image'], indivRowData['creatureType']);
			row.appendChild(cell);	// type column (image)
			cell = createTDElementText(indivRowData['strength']);
			row.appendChild(cell);	// strength column (text)
			cell = createTDElementText(indivRowData['health']);
			row.appendChild(cell);	// health column (text)
			cell = createTDElementText(indivRowData['specialPower']);
			row.appendChild(cell);	// special power column (text)
			cell = createTDWithInputButtons(indivRowData, index);
			row.appendChild(cell);	// action column (3 buttons)
			body.appendChild(row);

		}
	});

	table.appendChild(body);
	tablediv.appendChild(table);	
}

function createTDElementText(textValue){
	let cell = document.createElement('td');
	cell.appendChild(document.createTextNode(textValue));
	return cell;
}

function createTDElementImage(imgPath, title){
	let cell = document.createElement('td');
	let img = document.createElement('img');
	img.src = imgPath;
	img.title = title;
	cell.appendChild(img);
	return cell;
}

function createTDWithInputButtons(indivRowData, objcount) {
	let tdCell = document.createElement('td');

	let delButton = createTDElementInputButtons('images/delete.png', 'btn', 'del', objcount);
	let incButton = createTDElementInputButtons('images/heart_inc.png', 'btn', 'inc', objcount);
	let decButton = createTDElementInputButtons('images/heart_dec.png', 'btn', 'dec', objcount);

	tdCell.appendChild(delButton);
	tdCell.appendChild(incButton);
	tdCell.appendChild(decButton);

	return tdCell;
}

function createTDElementInputButtons(imgPath, inputClass, inputName, idNumber){
	let inputType = document.createElement('input');
	inputType.className = inputClass;
	inputType.name = inputName + "" + idNumber;
	inputType.id = inputName + "" + idNumber;
	inputType.type = "image";
	inputType.value = "";
	inputType.src = imgPath;

	inputType.addEventListener('click',processActionButtonClick);
	
	return inputType;
}



// Listener events set up in this section

function processActionButtonClick(e){

	let idstr = e.currentTarget.id; // choose the parent id
	let actionType = idstr.slice(0,3);
	let rowNumVal = parseInt(idstr.replace(actionType,""));

	switch(actionType) {
		case('del'):
			deleteRow(rowNumVal);
		break;
		case('inc'):
			increaseHealth(rowNumVal);
		break;
		case('dec'):
			decreaseHealth(rowNumVal);
		break;
		default:
			alert('Command not recognised');
	}
}

function resetPage(e){
	location.reload();
}

function rollDice(e){
	
	let doubleDice = false;
	let dice1 = getRandomInt(1,6);
	let dice2 = getRandomInt(1,6);

	if(FORCE_DICE_MODE_FOR_TESTING === true){
		dice1 = FORCED_DICE_ONE;
		dice2 = FORCED_DICE_TWO;
	}

	let message = "";
	if(dice1 === dice2) {
		message = " - Special Powers Activated";
		doubleDice = true;
		powers.setPowers(dice1);
	}

	// Alert box or modal for dice throw results seemed clunky
	// so was disabled.

	//alert('Thrown ' + dice1 + " " + dice2 + message);

	changeDice(dice1, dice2, doubleDice);
}



// Called from rollDice() - Draws dice and displays 'Special Power(s)'
// image if required. Uses two 'Special Powers' versions, singular 
// and plural.

function changeDice(dice1, dice2, doubleDice){
	let diceBox = document.getElementById("dice-box");
	diceBox.getElementsByTagName("img")[0].src = "images/dice" + dice1 + ".png";
	diceBox.getElementsByTagName("img")[1].src = "images/dice" + dice2 + ".png";
	
	let powersBox = document.getElementById("powers-box");
	powersBox.innerHTML = '';
	let specialBox = document.getElementById("special");

	if(doubleDice === true) {

		let powerImageName;
		(dice1 === 1)? powerImageName = "spower.png" : powerImageName = "spowers.png";
		specialBox.getElementsByTagName("img")[0].src = "images/" + powerImageName;

		powers.setPowers(dice1); // Only need to pass one value as it's a double value
		OutputPowers();

	} else {
		specialBox.getElementsByTagName("img")[0].src = "images/blank.png";
	}
}


function OutputPowers(){
	let powersBox = document.getElementById("powers-box");
	let ulElem = document.createElement("ul");

	let powerList = powers.getPowers();
	let pListLength = powerList.length;

	powerList.forEach(function(item, index, array){
		let para = document.createElement("li");
		para.innerHTML = item;
		ulElem.appendChild(para);
	});

	powersBox.appendChild(ulElem);
}


// This section is for performing the actions when any of
// the three action buttons are clicked. Functionality will be 
// increased at some point in future, as there will need to
// be interactions with the creature objects to assign powers. 

function increaseHealth(rowIDNumber){
	creatureData[rowIDNumber].incrementHealth(rowIDNumber);
	let newHealth = creatureData[rowIDNumber].getHealthValue();
	changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, 90, 3);
}

function decreaseHealth(rowIDNumber){
	creatureData[rowIDNumber].decrementHealth(rowIDNumber);
	let newHealth = creatureData[rowIDNumber].getHealthValue();
	changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, 90, 3);
	// Check if zero, if so, fire off alert and run deleteRow
}

function changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, ms, colNum){
	let rowSelected = document.getElementById("row" + rowIDNumber);
	rowSelected.getElementsByTagName("td")[3].innerHTML = newHealth;
	if(MAGINIFIED_INC_DEC_ON){
		rowSelected.getElementsByTagName("td")[3].style.fontSize = '2em';
		setTimeout(function(){ rowSelected.getElementsByTagName("td")[colNum].style.fontSize = '0.938em';}, ms);
		setTimeout(function(){ }, 60);
	}
}

// A UI issue was identified where it could be tricky to see what was
// being deleted, so I added a slight pause to the deletion process
// and pre-highlighted the row in red before removal. Should just
// be long enough to read the creature name.

function deleteRow(rowIDNumber){
	let rowToDelete = document.getElementById("row" + rowIDNumber);
	rowToDelete.style.backgroundColor="#8b1321";
	setTimeout(function(){ rowToDelete.parentNode.removeChild(rowToDelete)}, 230);
	creatureData[rowIDNumber].deleteCreatureFromGame();
}