// Vanilla JavaScript used.
// No frameworks or libraries.

"use strict";


// *** TESTING VARIABLES START HERE ***
const NUMBER_OF_CREATURES = 100;

// Force 'special powers' for testing: 
const FORCE_DICE_MODE_FOR_TESTING = false;
const FORCED_DICE_TO_DOUBLE = 1;	// 1 to 6

// *** TESTING VARIABLES END HERE ***


const SHOW_GAME_MATCH_UPS_MODE = true;
const PREVIEW_SPECIAL_POWER_RESULTS = true;
const MAGINIFIED_INC_DEC_ON = true;

class Creature {
	constructor() {
	this.creatureValid = true;
	this.creatureSpecies = '';
	this.name = '';
	this.indexNum = 0;

	this.modStrengthPlus = 0;
	this.modStrengthMinus = 0;
	this.modHealthPlus = 0;
	this.skipAGo = false;
	this.steal50PercentStrength = false;
	this.decreaseOppHealthOf100 = false;
	this.strengthStolen = 0;
	
	this.image = 'images/error.png';
	this.strength = 0;
	this.health = 0;
	this.specialPower = '';
	this.opponent = '';
	this.opponentIndexNum = null;
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
		this.specialPower = '';
		this.strength = 0;
		this.health = 0;
		this.modStrengthPlus = 0;
		this.modStrengthMinus = 0;
		this.modHealthPlus = 0;
		this.skipAGo = false;
		this.steal50PercentStrength = false;
		this.decreaseOppHealthOf100 = false;
	}

	isCreatureDeleted(){
		return this.deleted;
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

	getStrengthValue(){
		return this.strength;
	}

	increaseStrength(value){
		this.strength = this.strength + value;
	}

	canStealStrength(){
		return this.steal50PercentStrength;
	}

	canDecreaseHealth(){
		return this.decreaseOppHealthOf100;
	}

	canSkipAGo(){
		return this.skipAGo;
	}

	steal50PercentOfCreatureStrength(){
		let stolenStrength = Math.floor((this.strength / 2));
		this.strength = this.strength - stolenStrength;
		return stolenStrength;
	}


	removeHealthValue(healthValue){
		if(this.health > 0) this.health = this.health - healthValue;
		if(this.health < 0) this.health = 0;
	}

	hasCreatureJustDied() {
		if(this.health <= 0 && this.deleted === false){
			this.deleted = true;
		}
		return this.deleted;
	}

	setIndexNumber(value){
		this.indexNum = value;
	}

	getIndexNumber(){
		return this.indexNum;
	}

	getName(){
		return this.name;
	}

	getSpecies(){
		return this.creatureSpecies;
	}

	setOpponent(opponentIndexNum, creatureName){
		this.opponentIndexNum = opponentIndexNum;
		this.opponent = creatureName;
	}

	setSpecialPower(power) {
		this.specialPower = power;
	}

	getSpecialPower() {
		return this.specialPower;
	}

	getOpponent(){
		return this.opponent;
	}

	getModificationData() {
		let message = '';
		if(this.modStrengthPlus !== 0) message = `Strength + ${this.modStrengthPlus}`;
		if(this.modStrengthMinus !== 0) message = `Strength - ${this.modStrengthMinus}`;
		if(this.modHealthPlus !== 0) message = `Health + ${this.modHealthPlus}`;
		if(this.skipAGo === true) message = `The fight will not take place`;
		if(this.decreaseOppHealthOf100 === true) message = 'Opponent Health - 100';
		if(this.steal50PercentStrength === true) message = `Strength Stolen = ${this.strengthStolen}`;
		return message;
	}

	resetFightingData(){
		this.opponent = '';
		this.opponentIndexNum = null;
		this.specialPower = '';
		this.modStrengthPlus = 0;
		this.modStrengthMinus = 0;
		this.modHealthPlus = 0;
		this.skipAGo = false;
		this.steal50PercentStrength = false;
		this.decreaseOppHealthOf100 = false;
		this.strengthStolen = 0;
	}

	setStrengthStolenValue(value){
		this.strengthStolen = value;
	}

	setSpecialPowerVariables() {
		if(this.specialPower !=='') {

			switch(this.specialPower){
				case 'Decreases opponents health by 100':
					this.decreaseOppHealthOf100 = true;
				break;
				case 'Increases health by 100':
					this.modHealthPlus = 100;
				break;
				case 'Increases strength between 1 - 100': 
					this.modStrengthPlus = this.getRandomInt(1, 100);
				break;
				case 'Decreases strength between 1 - 100':
					this.modStrengthMinus = this.getRandomInt(1, 100);
				break;
				case 'Hides (Skips a go)':
					this.skipAGo = true;
				break;
				case 'Steals 50% of the strength from the opponent':
					this.steal50PercentStrength = true;
				break;
			}
		}

	}

	processPowers(){
		// Only one of the powers can be processed due to game logic
		// Don't allow strength to hold a minus figure, zero is lowest
		if(this.strength > 0) {
			if(this.modStrengthMinus > 0) this.strength = this.strength - this.modStrengthMinus;
		}		
		if(this.modStrengthPlus > 0) this.strength += this.modStrengthPlus;
		if(this.strength < 0) this.strength = 0;

		// Note: A creature cannot reduce its own health as a special power
		if(this.modHealthPlus > 0) this.health += this.modHealthPlus;
		if(this.health < 0) this.health = 0;
		
	}

	getDetailsAsArray() {
		this.tablerowdata['creatureSpecies'] = this.creatureSpecies;
		this.tablerowdata['name'] = this.name;
		this.tablerowdata['image'] = this.image; 
		this.tablerowdata['strength'] = this.strength;
		this.tablerowdata['health'] = this.health;
		this.tablerowdata['specialPower'] = this.specialPower;
		this.tablerowdata['opponent'] = this.opponent;
		return this.tablerowdata;
	}
}


// Creature child classes contain attributes specific to
// that particular creature type.

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



// This class stores the special powers generated by double dice rolls. 

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

	getNumberOfPowersAssigned(){
		return this.powers.length;
	}
};



// This class is for generating creature names that are linked to the
// creature type.
// This tracks which creature names have already been issued to avoid 
// the name being issued again. Also randomises name order for each 
// creature type on refresh.

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
		// names in array, reset the counter back to 0 for re-issuing names.

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



let creatureNameFactory = (function (creatureType = "") {

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


let mode = "Roll the Dice";
let currentDiceRollTotal = 0;

let allDragonNames = [];
let allWitchNames = [];
let allTrollNames = [];
let allSnakeNames = [];
let eliminated = [];

let creaturesGoFirst = [];
let creaturesGoSecond = [];
let sittingOut = false;
let remainCreatures = 0;
let creatures;
let actionButtonRemoved = false;



let importDataAndRun = (callback) => {
	// Pull creature name data from JSON file

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhttp.responseText);
		
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
let fightersInGame = [];

// If number of creature types are added to, add the creature type to the
// following array - also add the type to the creatureNameFactory and main
// creature type creation classes.
let availableCreatures = ['Witch','Dragon','Snake','Troll'];

let maxNumberOfCreaturesAvailable = availableCreatures.length;
let randomCreatureType;
let randomCreatureNumber;
let creatureNameFound = '';
let powers;
let gameOver = false;
let waitForGameReset = false;

let tableHeadings = Array("Name","Type","Strength","Health", "Special Power", "Opponent", "Action");
const ERR_IMG = 'images/error.png';

let resetButton = document.getElementById('btn-reset').addEventListener('click', resetPage);
let actionButton = document.getElementById('btn-action').addEventListener('click', rollDiceOrFight);



importDataAndRun(mainEntryPoint);



// Functions beyond this point.

function mainEntryPoint() {

	// This is the callback once data is fetched. We need to ensure the
	// name data has been read in before we can manipulate it.

	let errorFound = false;

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
				creatureData.push(new Witch(creatureNameFound));
			break;
			case("Dragon"):
				creatureData.push(new Dragon(creatureNameFound));
			break;
			case("Snake"):
				creatureData.push(new Snake(creatureNameFound));
			break;
			case("Troll"):
				creatureData.push(new Troll(creatureNameFound));
			break;
			default:
				errorFound = true;
		}

		if(errorFound === false) {
			creatureData[count].setIndexNumber(count);
		}
	}
	if(!errorFound)	createDynamicTable('#table-box', tableHeadings, creatureData);
}


function createDynamicTable(cssIdName='#table-box', tableHeadings=[], tableData=[]){

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

function createCreatureTableDataRow(indivRowData = null, index = null){
	
	if(indivRowData != null && index != null) {
		let row = document.createElement('tr');
		row.id = "row" + index;

		row.appendChild(createTDElementText(indivRowData['name'])); 
		row.appendChild(createTDElementImage(indivRowData['image'], indivRowData['creatureSpecies']));
		row.appendChild(createTDElementText(indivRowData['strength']));
		row.appendChild(createTDElementText(indivRowData['health']));
		row.appendChild(createTDElementText(indivRowData['specialPower']));
		row.appendChild(createTDElementText(indivRowData['opponent']));
		row.appendChild(createTDWithInputButtons(index));

		return row;
	}

	// If no data is found, return an empty table row
	let row = document.createElement('tr');
	for(let count=0;count<6; count++){
		row.appendChild(createTDElementText('')); 
	}
	return row;
}

function createTDElementText(textValue=''){
	let cell = document.createElement('td');
	cell.appendChild(document.createTextNode(textValue));
	return cell;
}

function createTDElementImage(imgPath=ERR_IMG, title=''){
	let cell = document.createElement('td');
	let img = document.createElement('img');
	img.src = imgPath;
	img.title = title;
	cell.appendChild(img);
	return cell;
}

function createTDWithInputButtons(objcount) {
	let tdCell = document.createElement('td');

	// Buttons in last table column for creature actions
	tdCell.appendChild(createTDElementInputButtons('images/delete.png', 'btn', 'del', objcount));
	tdCell.appendChild(createTDElementInputButtons('images/heart_inc.png', 'btn', 'inc', objcount));
	tdCell.appendChild(createTDElementInputButtons('images/heart_dec.png', 'btn', 'dec', objcount));

	return tdCell;
}

function createTDElementInputButtons(imgPath=ERR_IMG, inputClass, inputName, idNumber){
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
	// If only one creature remains, we don't want to give the user the
	// option to delete the creature, as it will make a nonsense of
	// the winning text, images and last creature eliminated message shown
	// on the page. Therefore we must ensure that 'gameOver' is not true 
	// before allowing the action buttons to process input. 

	if(gameOver === false) {
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
	// Deleting the second last creature can end the game, so we need to
	// check if the end of the game occurs here.
	displayCreatureCountEndIfWinner();
}

function resetPage(e){
	location.reload();
}



function rollDiceOrFight(e){
	// Main game logic and loop once creature table has been pushed to
	// screen for the first time.
	let casulaties = document.getElementById('casualties');
	
	if(mode === 'Roll the Dice'){ 

		eliminated = [];
		casulaties.innerHTML = '';
		casulaties.style.display = 'none';

		powers.clearPowers();
		currentDiceRollTotal = 0;

		let doubleDice = false;
		let dice1 = getRandomInt(1,6);
		let dice2 = getRandomInt(1,6);

		if(FORCE_DICE_MODE_FOR_TESTING){
			if(FORCED_DICE_TO_DOUBLE >= 1 && FORCED_DICE_TO_DOUBLE <= 6){
				dice1 = FORCED_DICE_TO_DOUBLE;
				dice2 = FORCED_DICE_TO_DOUBLE;
			}
		}

		if(dice1 === dice2) {
			doubleDice = true;
			powers.setPowers(dice1);
		} 

		currentDiceRollTotal = dice1 + dice2;

		changeDiceImages(dice1, dice2, doubleDice);
		resetFightingDataAndFindFighters();
		assignPowers();
		removeExtraCreatureIffOddNumber();
		calculateOpponents();
		if(SHOW_GAME_MATCH_UPS_MODE === true) {
			displayFightOrder(creaturesGoFirst, creaturesGoSecond);
		} 

	} else if(mode === 'Process Power') {
		processCreaturePowers(creaturesGoFirst, creaturesGoSecond, sittingOut);
		updateStrengthHealthAndPowersOnTable(creaturesGoFirst);
		removeTheDead();

		processCreaturePowers(creaturesGoSecond, creaturesGoFirst, sittingOut);
		updateStrengthHealthAndPowersOnTable(creaturesGoFirst);
		updateStrengthHealthAndPowersOnTable(creaturesGoSecond);
		removeTheDead();

		if(SHOW_GAME_MATCH_UPS_MODE === true && totalOfCreaturesAlive() >1) {
			outputGameData(creaturesGoFirst, creaturesGoSecond, PREVIEW_SPECIAL_POWER_RESULTS);
		} 
		
	} else  {
		performFightActions();
		casulaties.style.display = 'block';
		casulaties.appendChild(getBeatenCreaturesLastRound());

		if(gameOver === false)clearOutputGameData();
	}

	flipActionMode();
}

function blankDiceBox(){
	let blankImgPath = `images/blank.png`;
	
	let diceBox = document.getElementById("dice-box");
	diceBox.getElementsByTagName("img")[0].src = blankImgPath;
	diceBox.getElementsByTagName("img")[1].src = blankImgPath;
	
	let powerBox = document.getElementById("powers-box");
	powerBox.innerHTML = '';
	
	let special = document.getElementById("special");
	special.getElementsByTagName("img")[0].src = blankImgPath;
}

function resetFightingDataAndFindFighters(){
	remainCreatures = 0;

	creatureData.forEach(function(item, index) {
		creatureData[index].resetFightingData();
	});

	fightersInGame = creatureData.filter((creature) => {
		return creature.isCreatureDeleted() === false}); 

	fightersInGame = fightersInGame.map((creature) => creature.getIndexNumber());
	remainCreatures = fightersInGame.length;
	fightersInGame = shuffleArray(fightersInGame);
}


function calculateOpponents(){
	creaturesGoFirst = fightersInGame.slice(0,remainCreatures / 2);
	creaturesGoSecond = fightersInGame.slice((remainCreatures / 2), remainCreatures);

	for(let count=0;count<creaturesGoFirst.length;count++){
		writeCreaturesOpponent(creaturesGoFirst[count], creaturesGoSecond[count]);
		writeCreaturesOpponent(creaturesGoSecond[count], creaturesGoFirst[count]);
	}
	displayPowersAndOpponentsOnTable(creaturesGoFirst, creaturesGoSecond, sittingOut);
}


function writeCreaturesOpponent(creatureID, opponentID){
	let opponentName = creatureData[opponentID].getName();
	creatureData[creatureID].setOpponent(opponentID, opponentName);
}


function assignPowers(){
	let specialPowersPriorityList = shuffleArray(fightersInGame);
	let powersToFetch = powers.getNumberOfPowersAssigned();
	let rowSelected = null;
	let power = "";

	if(powersToFetch > 0){
		let powersIssued = powers.getPowers();

		// Rarer powers are chosen by default if there are more powers than players.
		// The only downside of this is where a game won't end in test mode
		// if constant double sixes are thrown as 'Hide' option will 
		// perpetually occur for last two creatures.
		if(powersToFetch > fightersInGame.length) powersToFetch = fightersInGame.length;

		for(let count = 0; count<powersToFetch;count++) {
			creatureData[specialPowersPriorityList[count]].setSpecialPower(powersIssued[count]);
			rowSelected = document.getElementById("row" + specialPowersPriorityList[count]);
			power = powersIssued[count];
			rowSelected.getElementsByTagName("td")[4].innerHTML = power;
		}
	}

	fightersInGame = shuffleArray(fightersInGame);
}

function removeExtraCreatureIffOddNumber(){
	// Removes extra creature from current battle list. This could include a 
	// creature assigned a special power.
	sittingOut = false;
	if(remainCreatures % 2 !== 0) sittingOut = fightersInGame.pop();
}


function processEndOfGoDamage(creaturesTurn = [], opposition = []){
	// Applies the strength + dice roll penalty paid at end of battle, unless
	// creature applies 'Hide' or creature has already died (can happen
	// when special powers are processed before battle).
	let subValue;

	for(let count = 0; count<creaturesTurn.length; count++) {
		if(creatureData[creaturesTurn[count]].canSkipAGo() === false && creatureData[opposition[count]].canSkipAGo() === false) {

			// Check that opponent is not dead and is not at zero 
			// health before removing points for health 
			if(creatureData[opposition[count]].getHealthValue() > 0  && creatureData[creaturesTurn[count]].getHealthValue() > 0) {
				subValue = creatureData[creaturesTurn[count]].getStrengthValue() + currentDiceRollTotal;
				creatureData[opposition[count]].removeHealthValue(subValue);
			}
		}
	}
}

function performFightActions(){

	processEndOfGoDamage(creaturesGoFirst, creaturesGoSecond);
	updateStrengthHealthAndPowersOnTable(creaturesGoSecond);
	updateStrengthHealthAndPowersOnTable(creaturesGoFirst);
	removeTheDead();
	
	processEndOfGoDamage(creaturesGoSecond, creaturesGoFirst);
	updateStrengthHealthAndPowersOnTable(creaturesGoFirst);
	updateStrengthHealthAndPowersOnTable(creaturesGoSecond);
	removeTheDead();
}

function processCreaturePowers(creaturesToProcess, opponents, sittingOut = false){

	for(let count=0;count<creaturesToProcess.length;count++){
		
		creatureData[creaturesToProcess[count]].setSpecialPowerVariables();
		creatureData[creaturesToProcess[count]].processPowers();

		// both steal strength and can decrease health need to be performed
		// outside of processPowers() as they may not affect the creature whose
		// object we are working with.
		stealStrengthIfApplicable(creaturesToProcess[count], opponents[count]);
		
		if(creatureData[opponents[count]].getHealthValue() !== 0 && creatureData[creaturesToProcess[count]].canDecreaseHealth() === true){
			creatureData[opponents[count]].removeHealthValue(100);
		}
		// Hide/skip a go called is only relevant in actual battle. The flag for
		// the feature is set in setSpecialPowerVariables().
	}

	if(sittingOut !== false){
		if(creatureData[sittingOut].getSpecialPower() !== ''){
			creatureData[sittingOut].setSpecialPowerVariables();
			// It is part of the brief that creature's powers are not
			// processed if they are sitting out, so next line is disabled
			//creatureData[sittingOut].processPowers();
		}
	}
}

function stealStrengthIfApplicable(goFirst, goSecond){
	let stolenStrength = 0;

	if(creatureData[goSecond].getStrengthValue() !== 0 && creatureData[goFirst].canStealStrength() === true){
		stolenStrength = creatureData[goSecond].steal50PercentOfCreatureStrength();
		creatureData[goFirst].increaseStrength(stolenStrength);
		creatureData[goFirst].setStrengthStolenValue(stolenStrength);
	}
}

function updateStrengthHealthAndPowersOnTable(creatureArray){
	
	let rowSelected;
	let healthValue = 0;
	let strengthValue = 0;
	let opponent = '';
	
	for(let count=0;count<creatureArray.length;count++){
		if(creatureData[creatureArray[count]].isCreatureDeleted() !== true){

			healthValue = creatureData[creatureArray[count]].getHealthValue();
			strengthValue = creatureData[creatureArray[count]].getStrengthValue();
			opponent = creatureData[creatureArray[count]].getOpponent();
			rowSelected = document.getElementById("row" + creatureArray[count]);
			rowSelected.getElementsByTagName("td")[2].innerHTML = strengthValue;
			rowSelected.getElementsByTagName("td")[3].innerHTML = healthValue;
			rowSelected.getElementsByTagName("td")[4].innerHTML = "";
			rowSelected.getElementsByTagName("td")[5].innerHTML = opponent;
		}
	}

	if(sittingOut !== false){
		rowSelected = document.getElementById("row" + sittingOut);
		rowSelected.getElementsByTagName("td")[4].innerHTML = "";
		rowSelected.getElementsByTagName("td")[5].innerHTML = "";
	}
}


function displayPowersAndOpponentsOnTable(goFirst = [], goSecond = [], sittingOut = false){

	for(let count=0;count<goFirst.length;count++){
		pushPowerAndOppToTableRow(goFirst[count], false);
		pushPowerAndOppToTableRow(goSecond[count], false);
	}

	if(sittingOut !== false){
		pushPowerAndOppToTableRow(sittingOut, true);
	}
}


function pushPowerAndOppToTableRow(rowID, sitOut=false){
	
	let power = creatureData[rowID].getSpecialPower();
	let	opponentName = creatureData[rowID].getOpponent();
	let	rowSelected = document.getElementById("row" + rowID);
	rowSelected.getElementsByTagName("td")[4].innerHTML = power;

	if(sitOut === true) opponentName = "Not in this round";
	rowSelected.getElementsByTagName("td")[5].innerHTML = opponentName;
}


function clearOutputGameData(){
	if(SHOW_GAME_MATCH_UPS_MODE === true) {
		let gameWorkings = document.getElementById("output");
		gameWorkings.innerHTML = '';
	}
}


function displayCreatureCountEndIfWinner(){
	let message = '';
	let aliveCreaturesCount = totalOfCreaturesAlive();

	if(aliveCreaturesCount > 1) message = "<h3>"+ aliveCreaturesCount + " worthy adversaries remain in battle</h3>";
	if(aliveCreaturesCount === 1) {
		message = "<h3>Only the true victor remains</h3>";
		removeActionButton();
	}

	let countBox = document.getElementById('count');
	countBox.innerHTML = message;

	if(aliveCreaturesCount === 1){ 
		clearOutputGameData();
		let gameWorkings = document.getElementById("win");
		
		if(waitForGameReset===false){
			gameWorkings.innerHTML = '';
			gameWorkings.style.display ='block';

			// Game won output
			message = 'W I N N E R !';
			gameWorkings.appendChild(wrapInPTags(message, 'head'));
			let creatureIndex = getWinner();
			let winMessage = winningMessage();
			message = `${creatureData[creatureIndex].getName()} the ${creatureData[creatureIndex].getSpecies()} ${winMessage}.`;
			gameWorkings.appendChild(wrapInPTags(message));
			displayTrophy();
			waitForGameReset = true;
		}
	}
}

function removeActionButton(){
	if(actionButtonRemoved  === false){
		actionButtonRemoved  = true;

		// Removes the action button so only 'reset' is selectable. 
		let buttonElement = document.getElementById("btn-action");
		buttonElement.remove();

		gameOver = true;	// prevents delete creature, health+ and 
		// health- buttons from working when only the winner remains

		alert("There is a winner!");
		let powerBox = document.getElementById("powers-box");
		powerBox.style.display ='none';
		displayTrophy();
	}
}

function displayTrophy(){
	let diceBox = document.getElementById("dice-box");
	diceBox.getElementsByTagName("img")[0].src = 'images/trophy.png';
	diceBox.getElementsByTagName("img")[1].src = 'images/blank.png';
	diceBox.style.display ='block';
	let powerBox = document.getElementById("powers-box");
	powerBox.style.display ='none';
	let special = document.getElementById("special");
	special.getElementsByTagName("img")[0].src = 'images/firstplace.png';
}

function totalOfCreaturesAlive(){
	let aliveCreaturesCount = 0;

	creatureData.forEach(function(item, index) {
		if(creatureData[index].isCreatureDeleted() === false) aliveCreaturesCount++; 
	});

	return aliveCreaturesCount;
}


function removeTheDead(){
	let fightersInGame = creatureData.filter((creature) => {
		return creature.isCreatureDeleted() === false});
	
	fightersInGame = fightersInGame.map((creature) => creature.getIndexNumber());

	for(let count=0;count<fightersInGame.length; count++){
		if(creatureData[fightersInGame[count]].hasCreatureJustDied() === true){
			deleteRow(fightersInGame[count]);
			eliminated.push(creatureData[fightersInGame[count]].getName());
		}
	}

	displayCreatureCountEndIfWinner();
}

// Called from rollDiceOrFight() - Draws dice and displays 'Special Power(s)'
// image if required. Uses two 'Special Powers' image versions, singular 
// and plural.

function changeDiceImages(dice1=1, dice2=2, doubleDice=false){
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

		powers.setPowers(dice1); // Pass one value as it's a double value
		
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
// the three action buttons are clicked.

function increaseHealth(rowIDNumber){
	creatureData[rowIDNumber].incrementHealth(rowIDNumber);
	let newHealth = creatureData[rowIDNumber].getHealthValue();
	changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, 90, 3);
}

function decreaseHealth(rowIDNumber){
	creatureData[rowIDNumber].decrementHealth(rowIDNumber);
	let newHealth = creatureData[rowIDNumber].getHealthValue();
	changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, 90, 3);
}

function changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, ms, colNum){
	const delayTime = 60;
	const origFontSize = '0.938em';
	const largeFontSize = '2em';

	let rowSelected = document.getElementById("row" + rowIDNumber);
	rowSelected.getElementsByTagName("td")[3].innerHTML = newHealth;
	
	if(MAGINIFIED_INC_DEC_ON){
		rowSelected.getElementsByTagName("td")[3].style.fontSize = largeFontSize;
		setTimeout(() => {
			rowSelected.getElementsByTagName("td")[colNum].style.fontSize = origFontSize;
		}, ms);
		setTimeout(() => {}, delayTime);
	}
}

// A slight pause is added to the deletion process to improve the UI.
// Pre-coloured the row before removal. 

function deleteRow(rowIDNumber){

	const deleteRowTime = 230;
	const colourOfDeletingRow = "#8b1321";

	let rowToDelete = document.getElementById("row" + rowIDNumber);
	rowToDelete.style.backgroundColor=colourOfDeletingRow;

	setTimeout(function(){ 
		rowToDelete.parentNode.removeChild(rowToDelete)
	}, deleteRowTime);

	creatureData[rowIDNumber].deleteCreatureFromGame();
}

function shuffleArray(array) {

	// Durstenfeld shuffle - courtesy of Stackoverflow
	for(let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function flipActionMode(){

	let powersToFetch = powers.getNumberOfPowersAssigned();

	if(mode==="Roll the Dice"){
		
		if(powersToFetch === 0) {
			mode = 'Fight';
		} else 	{
			mode = 'Process Power';
		}
	} else if(mode === "Process Power"){
		mode = 'Fight';
	} else {
		mode = "Roll the Dice";
	}
	if(gameOver === false) actionButton = document.getElementById('btn-action').value = mode;
}

function outputGameData(goFirst, goSecond, showPowers = false){
	let gameWorkings = document.getElementById("output");
	gameWorkings.innerHTML = '';

	let summary = '';
	let effects = '';
	let fightLoss = '';
	let fightContainer = '';

	for(let count = 0; count<goFirst.length; count++) {

		fightContainer = document.createElement('div');
		fightContainer.className='fight';

		// First fighter
		summary = creatureSummaryAsText(goFirst[count]);
		fightContainer.appendChild(wrapInPTags(summary, 'head'));
		gameWorkings.appendChild(fightContainer);

		if(showPowers === true) {
			effects	= previewPowerEffects(goFirst[count]);
			fightContainer.appendChild(wrapInPTags(effects));
			gameWorkings.appendChild(fightContainer);
		}
		
		fightLoss = predictPointsLossFromBattle(goFirst[count], goSecond[count]);
		fightContainer.appendChild(wrapInPTags(fightLoss));
		gameWorkings.appendChild(fightContainer);
		fightContainer.appendChild(wrapInPTags('vs', 'head'));
		gameWorkings.appendChild(fightContainer);

		effects='';

		// Second Fighter
		summary = creatureSummaryAsText(goSecond[count]);
		fightContainer.appendChild(wrapInPTags(summary, 'head'));
		gameWorkings.appendChild(fightContainer);

		if(showPowers === true){
			effects	= previewPowerEffects(goSecond[count]);
			fightContainer.appendChild(wrapInPTags(effects));
			gameWorkings.appendChild(fightContainer);
		}

		fightLoss = predictPointsLossFromBattle(goSecond[count], goFirst[count]);
		fightContainer.appendChild(wrapInPTags(fightLoss));
		gameWorkings.appendChild(fightContainer);

	}
}

function displayFightOrder(goFirst, goSecond){
	let gameWorkings = document.getElementById("output");
	gameWorkings.innerHTML = '';

	let summary = '';
	let powers = '';
	let fightContainer = '';

	for(let count = 0; count<goFirst.length; count++) {

		fightContainer = document.createElement('div');
		fightContainer.className='fight';

		summary = creatureSummaryAsText(goFirst[count]);
		fightContainer.appendChild(wrapInPTags(summary, 'head'));
		gameWorkings.appendChild(fightContainer);

		powers = creatureData[goFirst[count]].getSpecialPower();
		if(powers !== '') {
			powers = `Special Power: ${powers}`;
			fightContainer.appendChild(wrapInPTags(powers));
		}

		fightContainer.appendChild(wrapInPTags('vs', 'head'));
		gameWorkings.appendChild(fightContainer);

		summary = creatureSummaryAsText(goSecond[count]);
		fightContainer.appendChild(wrapInPTags(summary, 'head'));
		gameWorkings.appendChild(fightContainer);

		powers = creatureData[goSecond[count]].getSpecialPower();
		if(powers !== '') {
			powers = `Special Power: ${powers}`;
			fightContainer.appendChild(wrapInPTags(powers));
		}
	}	
}

function creatureSummaryAsText(creature) {
	let creatureName = creatureData[creature].getName();
	let species = creatureData[creature].getSpecies();
	let strength = creatureData[creature].getStrengthValue();
	let health = creatureData[creature].getHealthValue();

	return `${creatureName} the ${species} - Strength: ${strength} Health: ${health}`;
}

function winningMessage(){
	let winningArray = ["has shown them who's boss", "gave out a thrashing", "has showed them the error of their ways",
	"has put on a masterful performance", "dished out an epic pummelling", "proved all doubters wrong",
	"took it to the next level", "gave out a pasting", "showed them how it should be done",
	"taught them all a lesson", "took no prisoners", "silenced the critics", "wasn't messing around",
	"laid it all on the line in this epic battle","beat them all like a naughty schoolchild",
	"put on a good show","beat them all by fair means and foul", "dealt with allcomers",
	"had no time for amateurs","showed them that form is temporary but class is permanent",
	"was not impressed with the skill level of the opposition","gave them all a masterclass in fighting",
	"dedicated the win to Auntie Norah", "showed no mercy", "showed true courage",
	"put the victory down to superior footwork and experience","vowed to return next year to defend the title",
	"publically thanked the sponsors", "gave a victory dance", "entertained the crowd and put on a good show",
	"was happy with the win but critical of the performance"];

	let randomInt = getRandomInt(0,(winningArray.length-1));

	return winningArray[randomInt];
}

function getBeatenCreaturesLastRound(){
	let message = '';
	let arrAsString='';
	let count = eliminated.length;
	let eliminatedSrt = eliminated.sort();
	if(count > 0) {		
		if(count === 1){
			message = wrapInPTags(`${count} creature was eliminated through battle in the last round: <br/><br/>${eliminatedSrt.toString()}`);
		} else {
			arrAsString = eliminatedSrt.join(', ');
			message = wrapInPTags(`${count} creatures were eliminated through battle in the last round: <br/><br/>${arrAsString}`);
		}
	} else {
		message = wrapInPTags('No creatures were eliminated through battle in the last round');
	}
	return message;
}

function previewPowerEffects(creature){
	let powers = '';
	let modData = '';
	let message = '';
	powers = creatureData[creature].getSpecialPower();
	if(powers !== '') {
		modData = creatureData[creature].getModificationData();
		message = `Special Power: ${powers}<br/>Special Power Applied: ${modData}`;
	}

	return message;
}

function predictPointsLossFromBattle(creature, opponent) {
	let message = 'If not already beaten, a normal fight will result in a loss of ';
	message += creatureData[creature].getStrengthValue() + currentDiceRollTotal;
	message += " from the opponents health.";

	if(creatureData[creature].canSkipAGo() || creatureData[opponent].canSkipAGo()){
		message += "<br/>However, the fight will be skipped and no further health points will be lost.";
	}

	return message;
}

function getWinner(){
	let fightersInGame = creatureData.filter((creature) => {
		return creature.isCreatureDeleted() === false});
	
	fightersInGame = fightersInGame.map((creature) => creature.getIndexNumber());
	return fightersInGame[0];
}

function wrapInPTags(text = '', pClass = null){
	let pTagString = document.createElement('p');
	if(pClass !== null) pTagString.className += pClass;
	pTagString.innerHTML = text;

	return pTagString;
}