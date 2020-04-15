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



class Creature {
	constructor() {
	this.creatureValid = false;
	this.creatureSpecies = '';
	this.name = '';
	
	this.creatureType ='';
	this.image = '';
	this.strength = 0;
	this.health = 0;
	this.specialPower = '';
	this.tablerowdata = [];
	this.deleted = false;
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	deleteCreatureFromGame() {
		this.deleted = true;
	}

	incrementHealth() {
		this.health++;
	}

	decrementHealth() {
		if(this.health !== 0) this.health--;
	}

	getHealthValue() {
		return this.health;
	}

	getDetailsAsArray() {
		this.tablerowdata['creatureType'] = this.creatureSpecies;
		this.tablerowdata['name'] = this.name;
		this.tablerowdata['image'] = this.image; 
		this.tablerowdata['strength'] = this.strength;
		this.tablerowdata['health'] = this.health;
		this.tablerowdata['specialPower'] = this.specialPower;
		return this.tablerowdata;
	}
}


class Witch extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Witch";
		this.image = 'images/witch.png';
		this.strength = this.getRandomInt(60, 80);
		this.health = this.getRandomInt(50,60);
	}
}

class Dragon extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Dragon";
		this.image = 'images/dragon.png';
		this.strength = this.getRandomInt(80, 90);
		this.health = this.getRandomInt(80, 90);
	}
}

class Snake extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Snake";
		this.image = 'images/snake.png';
		this.strength = this.getRandomInt(30, 60);
		this.health = this.getRandomInt( 30, 90);
	}
}

class Troll extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Troll";
		this.image = 'images/troll.png';
		this.strength = this.getRandomInt(22, 65);
		this.health = this.getRandomInt(60, 92);
	}
}


// This class demonstrates level 4 - Storing the powers 
// Note that the web page removes the output of the power
// types from the screen when dice is re-rolled, but the
// data is still retained.
class Powers {

	constructor() {
	this.powers = [];
	this.availablePowers = ['Increases health by 100',
		'Decreases opponents health by 100',
		'Increases strength between 1 - 100',
		'Decreases strength between 1 - 100',
		'Hides (Skips a go)',
		'Steals 50% of the strength from the opponent'];
	}

	setPowers(numberThrown) {
		this.powers = [];

		for(let count=0; count<= numberThrown-1; count++){
			this.powers.unshift(this.availablePowers[count]);
		}
	}

	clearPowers() {
		this.powers = [];
	}

	getPowers(){
		return this.powers;
	}
};



// This class is for generating creature names that are linked to the
// creature type.
// After consideration, I was of the opinion that names should be
// suited to creature types (i.e. Trolls with names indicating
// little intelligence, witches with female sounding names etc).
// 
// This tracks which creature names have already been issued to avoid 
// the name being issued again.
// Should an extreme number of creatures be generated that exceeds
// the number of names available, the names will wrap around and start
// again. Also randomises name order for each creature type on refresh.
// 
// The name issuing functionality has been decoupled from the creature
// creation classes on purpose, to allow for import of name data 
// from a JSON file and allow the flexibility to use just one master
// list of names for all of the creature types, if this is what the 
// next stages of the challenge requires.

class CreatureNames {
	// One single instance per creature type.

	constructor(availableNames){

	this.availableNames = availableNames;
	this.creatureCountMax = availableNames.length;
	this.creatureTypeArrIndex = 0; // tracks index num of name issued.
	this.issuedName = '';
	this.shuffleNames(this.availableNames);
	}


	getName() {

		if(this.creatureTypeArrIndex === this.creatureCountMax) this.creatureTypeArrIndex = 0;
		// if the current index number exceeds the number of creature 
		// names in array, then reset the counter back to 0 for re-issuing
		// names.

		this.issuedName = this.availableNames[this.creatureTypeArrIndex];
		this.creatureTypeArrIndex++;
		
		return this.issuedName;
	}

	shuffleNames(array) {

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




let allDragonNames = [];
let allWitchNames = [];
let allTrollNames = [];
let allSnakeNames = [];

let creatures;

let importDataAndRun = function(callback) {

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhttp.responseText);
			//var creatures = response.creatures;
		
			allWitchNames = response.Witch;
			allDragonNames = response.Dragon;
			allSnakeNames = response.Snake;
			allTrollNames = response.Troll;
			callback();
		}	
	};

	xhttp.open("GET", "data/creatures.json", true);
	xhttp.send();
}


let witchNames;
let dragonNames;
let snakeNames;
let trollNames;
let creatureData = [];

// If number of creature types are added to, add the creature type to the
// following array - also add the type to the creatureNameFactory and main
// creature type creation classes.
let availableCreatures = ['Witch','Dragon','Snake','Troll'];

let maxNumberOfCreaturesAvailable = availableCreatures.length;
let randomCreatureType;

let randomCreatureNumber;
let creatureNameFound = '';
let powers;
let tableHeadings = Array("Name","Type","Strength","Health", "Special Power", "Action");


function mainEntryPoint() {

	witchNames = new CreatureNames(allWitchNames);
	dragonNames = new CreatureNames(allDragonNames);
	snakeNames = new CreatureNames(allSnakeNames);
	trollNames = new CreatureNames(allTrollNames);

	powers = new Powers();

	// Main loop for creation of creatures and creature names.

	for(let count=0; count<NUMBER_OF_CREATURES; count++){

		randomCreatureNumber = getRandomInt(0, maxNumberOfCreaturesAvailable - 1);
		randomCreatureType = availableCreatures[randomCreatureNumber];

		creatureNameFound = creatureNameFactory(randomCreatureType);

		switch(randomCreatureType) {
			case("Witch"):
				creatureData[count]= new Witch(creatureNameFound);
			break;
			case("Dragon"):
				creatureData[count]= new Dragon(creatureNameFound);
			break;
			case("Snake"):
				creatureData[count]= new Snake(creatureNameFound);
			break;
			case("Troll"):
				creatureData[count]= new Troll(creatureNameFound);
			break;
		}
	}

	createDynamicTable('#table-box', tableHeadings, creatureData);
}

let resetButton = document.getElementById('btn-reset').addEventListener('click', resetPage);
let rollButton = document.getElementById('btn-roll').addEventListener('click', rollDice);



importDataAndRun(mainEntryPoint);



// Only functions beyond this point.

function createDynamicTable(cssIdName, tableHeadings, tableData){

	let tablediv = document.querySelector(cssIdName);
	document.querySelector(cssIdName).innerHTML = "";
	
	let table = document.createElement('table');

	// Table headings:
	let head = document.createElement('thead');
	let cell;

	tableHeadings.forEach(function(item) {
		cell = document.createElement('th');
		cell.appendChild(document.createTextNode(item));
		head.appendChild(cell);
	});

	table.appendChild(head);


	// Table data:
	let indivRowData = [];
	let body = document.createElement('tbody');
	let creatureRow ;

	tableData.forEach(function(item, index) {
		if(item != null){
			indivRowData = item.getDetailsAsArray();
			creatureRow = createCreatureTableDataRow(indivRowData, index);
			body.appendChild(creatureRow);
		}
	});

	table.appendChild(body);
	tablediv.appendChild(table);	
}

function createCreatureTableDataRow(indivRowData, index){
	
	let row = document.createElement('tr');
	row.id = "row" + index;

	row.appendChild(createTDElementText(indivRowData['name'])); 
	row.appendChild(createTDElementImage(indivRowData['image'], indivRowData['creatureType']));
	row.appendChild(createTDElementText(indivRowData['strength']));
	row.appendChild(createTDElementText(indivRowData['health']));
	row.appendChild(createTDElementText(indivRowData['specialPower']));
	row.appendChild(createTDWithInputButtons(indivRowData, index));

	return row;
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

	// Buttons for creature actions
	tdCell.appendChild(createTDElementInputButtons('images/delete.png', 'btn', 'del', objcount));
	tdCell.appendChild(createTDElementInputButtons('images/heart_inc.png', 'btn', 'inc', objcount));
	tdCell.appendChild(createTDElementInputButtons('images/heart_dec.png', 'btn', 'dec', objcount));

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
	diceBox.getElementsByTagName("img")[0].src = `images/dice${dice1}.png`;
	diceBox.getElementsByTagName("img")[1].src = `images/dice${dice2}.png`;
	
	let powersBox = document.getElementById("powers-box");
	powersBox.innerHTML = '';
	let specialBox = document.getElementById("special");

	if(doubleDice === true) {

		let powerImageName;
		(dice1 === 1)? powerImageName = "spower.png" : powerImageName = "spowers.png";
		specialBox.getElementsByTagName("img")[0].src = `images/${powerImageName}`;

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

	powerList.forEach(function(item){
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
		setTimeout(() => {rowSelected.getElementsByTagName("td")[colNum].style.fontSize = '0.938em';}, ms);
		setTimeout(() => {}, 60);
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
