import Creature from './Creature.js';
import Powers from './Powers.js';
import CreatureNames from './CreatureNames.js';
import Table from './Table.js';
import Dice from './Dice.js';

// Vanilla JavaScript used. No frameworks or libraries.

"use strict";

// *** TESTING VARIABLES START HERE ***
const NUMBER_OF_CREATURES = 100;
const FORCE_DICE_MODE_FOR_TESTING = false;
const FORCED_DICE_TO_DOUBLE = 4;	// 1 to 6
// *** TESTING VARIABLES END HERE ***

const SHOW_GAME_MATCH_UPS_MODE = true;
const PREVIEW_SPECIAL_POWER_RESULTS = true;


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


let mode = "Roll the Dice";
let allDragonNames = [];
let allWitchNames = [];
let allTrollNames = [];
let allSnakeNames = [];
let victoryMessages = [];
let eliminated = [];

let creaturesGoFirst = [];
let creaturesGoSecond = [];
let sittingOut = false;
let remainCreatures = 0;
let actionButtonRemoved = false;


let importDataAndRun = (callback) => {
	// Pull creature name and winning message data from JSON file

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhttp.responseText);
		
			allWitchNames = response.Witch;
			allDragonNames = response.Dragon;
			allSnakeNames = response.Snake;
			allTrollNames = response.Troll;
			victoryMessages = response.VictoryMessages;
			callback();
		}	
	};

	xhttp.open("GET", "data/gamedata.json", true);
	xhttp.send();
}


let getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let winningMessage = (allWinningMessages=[]) => {
	let randomInt = getRandomInt(0,(allWinningMessages.length-1));
	if(allWinningMessages.length === 0) return "Error: No winning message found";
	return allWinningMessages[randomInt];
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
let dice;
let gameOver = false;
let waitForGameReset = false;
let creatureTable = '';
const ERR_IMG = 'images/error.png';

let resetButton = document.getElementById('btn-reset').addEventListener('click', resetPage);
let actionButton = document.getElementById('btn-action').addEventListener('click', rollDiceProcessPowerOrFight);
let modal = document.getElementById("modal-box");
let span = document.getElementsByClassName("close")[0];



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

	// Loop for creation of creatures and creature names.

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

	let creatureStats = [];
	let indivRowData  = '';

	creatureData.forEach(function(item) {
		indivRowData = item.getTableDetailsAsArray();
		creatureStats.push(indivRowData);
	});

	creatureTable = new Table(creatureData, creatureStats);
	dice = new Dice(FORCE_DICE_MODE_FOR_TESTING, FORCED_DICE_TO_DOUBLE);

	assignActionToTableInputElements();
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

// The reset button
function resetPage(e){
	location.reload();
}

// Modal functions
span.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target === modal) {
		modal.style.display = "none";
	}
}

function assignActionToTableInputElements(){
	let allButtonsInTable = document.getElementsByClassName('btn'); 
	
	for(let count = 0; count<allButtonsInTable.length; count++){
		allButtonsInTable[count].addEventListener('click',processActionButtonClick);
	}
}



// Main game logic and loop once creature table has been pushed to
// screen for the first time.
// These are the three main game modes (three functions listed
// directly beneath).
// Please remember that the game could also be ended by the use of the delete 
// character action button on the second last remaining creature in the table.
function rollDiceProcessPowerOrFight(){
	
	if(mode === 'Roll the Dice'){ 
		rollTheDice();
		
	} else if(mode === 'Process Power') {
		processPowersAction();
		
	} else  {
		fightAction();
	}

	flipActionMode();
}

// First of three game modes triggered by rollDiceProcessPowerOrFight()
function rollTheDice(){
	let casulaties = document.getElementById('casualties');
	eliminated = [];
	casulaties.innerHTML = '';
	casulaties.style.display = 'none';
	powers.clearPowers();

	let diceData = dice.getDiceData();
	if(diceData['doubleDice'] === true) powers.setPowers(diceData['dice1']);

	dice.changeDiceImages();
	checkForPowersAndUpdatePowersOnPage();
	resetFightingDataAndFindFighters();
	assignPowers();
	removeExtraCreatureIffOddNumber();
	calculateOpponents();
	if(SHOW_GAME_MATCH_UPS_MODE === true) displayFightOrder(creaturesGoFirst, creaturesGoSecond);
}

// Second of three game modes triggered by rollDiceProcessPowerOrFight()
function processPowersAction(){
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
}

// Third of three game modes triggered by rollDiceProcessPowerOrFight()
function fightAction(){
	let casulaties = document.getElementById('casualties');
	performFightActions();
	casulaties.style.display = 'block';
	casulaties.appendChild(getBeatenCreaturesLastRound());

	if(gameOver === false && SHOW_GAME_MATCH_UPS_MODE === true) clearExistingHTMLOfDivId('output');
}

// Only enable 'Process Power' mode if special powers have been issued
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
	
	updateStrengthHealthAndPowersOnTable([...creaturesGoFirst, ...creaturesGoSecond]);
}


function writeCreaturesOpponent(creatureID, opponentID){
	let opponentName = creatureData[opponentID].getName();
	creatureData[creatureID].setOpponent(opponentID, opponentName);
}


function assignPowers(){
	let specialPowersPriorityList = shuffleArray(fightersInGame);
	let powersToFetch = powers.getNumberOfPowersAssigned();
	let power = "";

	if(powersToFetch > 0){
		let rowSelected = null;
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
	// creature applies 'Hide' or creature has already died (can also happen
	// when special powers are processed before battle).
	let subValue;

	for(let count = 0; count<creaturesTurn.length; count++) {
		if(creatureData[creaturesTurn[count]].canSkipAGo() === false && creatureData[opposition[count]].canSkipAGo() === false) {

			// Check that opponent is not dead and is not at zero 
			// health before removing points for health 
			if(creatureData[opposition[count]].getHealthValue() > 0  && creatureData[creaturesTurn[count]].getHealthValue() > 0) {
				subValue = creatureData[creaturesTurn[count]].getStrengthValue() + dice.getCurrentDiceTotal();
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
		creatureData[creaturesToProcess[count]].pushPowersToHistory();
		creatureData[creaturesToProcess[count]].processPowers();

		// both steal strength and can decrease health need to be performed
		// outside of processPowers() as they will affect the creature outside
		// of the object we are working with.
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
	let creatureStats = [];
	let row = [];

	for(let count=0;count<creatureArray.length;count++) {
		if(creatureData[creatureArray[count]].isCreatureDeleted() !== true){
			row = { 'id': creatureData[creatureArray[count]].getIndexNumber(),
				'strength': creatureData[creatureArray[count]].getStrengthValue(),
				'health': creatureData[creatureArray[count]].getHealthValue(),
				'power': creatureData[creatureArray[count]].getSpecialPower(),
				'opponent': creatureData[creatureArray[count]].getOpponent()
			};
			creatureStats.push(row);
		}
	}

	if(sittingOut !== false) {
		row = { 'id': creatureData[sittingOut].getIndexNumber(),
			'strength': creatureData[sittingOut].getStrengthValue(),
			'health': creatureData[sittingOut].getHealthValue(),
			'power': creatureData[sittingOut].getSpecialPower(),
			'opponent': "Not in the round"
		};
		creatureStats.push(row);
	}
	creatureTable.writeStrengthHealthAndPowers(creatureStats);
}

function displayCreatureCountEndIfWinner(){
	let message = '';
	let aliveCreaturesCount = totalOfCreaturesAlive();

	if(aliveCreaturesCount > 1) message = `<h3>${aliveCreaturesCount} worthy 
	adversaries remain in battle</h3>`;

	if(aliveCreaturesCount === 1) {
		message = "<h3>Only the true victor remains</h3>";
		removeActionButtons();

		if(SHOW_GAME_MATCH_UPS_MODE === true) clearExistingHTMLOfDivId('output');		
		if(waitForGameReset===false) displayWinnerMessage();
	}

	let countBox = document.getElementById('count');
	countBox.innerHTML = message;
}

function displayWinnerMessage(){
	let gameWorkings = document.getElementById("win");
	gameWorkings.innerHTML = '';
	gameWorkings.style.display ='block';

	let message = 'W I N N E R !';
	gameWorkings.appendChild(wrapInPTags(message, 'head'));
	let creatureIndex = getWinner();
	let winMessage = winningMessage(victoryMessages);
	
	message = `<br/>${creatureData[creatureIndex].getName()} the 
	${creatureData[creatureIndex].getSpecies()} ${winMessage}.`;

	gameWorkings.appendChild(wrapInPTags(message));

	// Opponents defeated may not equate to number of fighting rounds
	// as not all rounds result in a creature being eliminated.
	gameWorkings.appendChild(wrapInPTags(`<br/>Opponents defeated: 
	${creatureData[creatureIndex].getOpponentHistoryAsString()}`));

	let powersUsed = creatureData[creatureIndex].getPowersUsed();

	if(powersUsed != false) {
		gameWorkings.appendChild(wrapInPTags(`<br/>Powers used: ${powersUsed}.`));
	} else {
		gameWorkings.appendChild(wrapInPTags(`<br/>There was no need for 
		${creatureData[creatureIndex].getName()} to resort to the use of special 
		powers to prove superiority.`));
	}

	displayTrophyAndMedal();
	waitForGameReset = true;
}

function removeActionButtons(){
	if(actionButtonRemoved  === false){
		actionButtonRemoved  = true;

		// Removes the action button so only 'reset' is selectable. 
		let buttonElement = document.getElementById("btn-action");
		buttonElement.remove();

		gameOver = true; // prevents table action buttons from working when only winner remains
		modal.style.display = "block";
		let powerBox = document.getElementById("powers-box");
		powerBox.style.display ='none';
		greyOutRemainingTableActionButtons();
		displayTrophyAndMedal();
	}
}

function greyOutRemainingTableActionButtons(){
	let idNum = getWinner();
	let element = document.getElementById('inc' + idNum).src = 'images/heart_inc_grey.png';
	element = document.getElementById('dec' + idNum).src = 'images/heart_dec_grey.png';
}

function displayTrophyAndMedal(){
	let cssDiv = document.getElementById("dice-box");
	cssDiv.getElementsByTagName("img")[0].src = 'images/trophy.png';
	cssDiv.getElementsByTagName("img")[1].src = 'images/blank.png';
	cssDiv.style.display ='block';

	cssDiv = document.getElementById("powers-box");
	cssDiv.style.display ='none';

	cssDiv = document.getElementById("special");
	cssDiv.getElementsByTagName("img")[0].src = 'images/firstplace.png';
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

function OutputArrayToDivIdAsUnorderedList(idName, arrToConvert=[]){
	let divElement = document.getElementById(idName);
	let ulElem = document.createElement("ul");

	arrToConvert.forEach(function(item){
		let para = document.createElement("li");
		para.innerHTML = item;
		ulElem.appendChild(para);
	});

	divElement.appendChild(ulElem);
}

// Updates powers and displays 'Special Power(s)' image if required. Uses two 
// 'Special Powers' image versions, singular and plural.
function checkForPowersAndUpdatePowersOnPage(){
	
	clearExistingHTMLOfDivId("powers-box");

	let specialBox = document.getElementById("special");

	if(dice.diceIsDouble() === true) {

		let powerImageName = "";
		(dice.getDiceOne() === 1)? powerImageName = "spower.png" : powerImageName = "spowers.png";
		specialBox.getElementsByTagName("img")[0].src = `images/${powerImageName}`;

		powers.setPowers(dice.getDiceOne()); // Pass one value as it's a double value
		
		OutputArrayToDivIdAsUnorderedList("powers-box", powers.getPowers());
	} else {
		specialBox.getElementsByTagName("img")[0].src = "images/blank.png";
	}
}


// This section is for performing the actions when any of
// the three table action buttons are clicked.

function increaseHealth(rowIDNumber){
	creatureData[rowIDNumber].incrementHealth(rowIDNumber);
	let newHealth = creatureData[rowIDNumber].getHealthValue();
	creatureTable.changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, 90, 3);
}

function decreaseHealth(rowIDNumber){
	creatureData[rowIDNumber].decrementHealth(rowIDNumber);
	let newHealth = creatureData[rowIDNumber].getHealthValue();
	creatureTable.changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, 90, 3);
}

function deleteRow(rowIDNumber){
	let opponent = creatureData[rowIDNumber].getOpponentIndex();
	if(opponent != undefined)creatureData[opponent].recordOpponentHistory();

	creatureTable.deleteTableRow(rowIDNumber);
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



function outputGameData(goFirst, goSecond, showPowers = false){
	let gameWorkings = document.getElementById("output");
	gameWorkings.innerHTML = '';

	let fightLoss = '';
	let fightContainer = '';

	for(let count = 0; count<goFirst.length; count++) {

		fightContainer = document.createElement('div');
		fightContainer.className='fight';

		// First fighter
		fightContainer = getFighterSummary(goFirst[count], fightContainer);
		gameWorkings.appendChild(fightContainer);

		if(showPowers === true) {
			gameWorkings.appendChild(showPredictedPowerEffects(goFirst[count], fightContainer));
		}
		
		fightLoss = predictPointsLossFromBattle(goFirst[count], goSecond[count]);
		fightContainer.appendChild(fightLoss);
		gameWorkings.appendChild(fightContainer);
		
		fightContainer.appendChild(wrapInPTags('vs', 'head'));
		gameWorkings.appendChild(fightContainer);

		// Second Fighter
		fightContainer = getFighterSummary(goSecond[count], fightContainer);
		gameWorkings.appendChild(fightContainer);

		if(showPowers === true) {
			gameWorkings.appendChild(showPredictedPowerEffects(goSecond[count], fightContainer));
		}

		fightLoss = predictPointsLossFromBattle(goSecond[count], goFirst[count]);
		fightContainer.appendChild(fightLoss);
		gameWorkings.appendChild(fightContainer);

	}
}

function displayFightOrder(goFirst, goSecond){
	let gameWorkings = document.getElementById("output");
	gameWorkings.innerHTML = '';
	let fightContainer = '';

	for(let count = 0; count<goFirst.length; count++) {

		fightContainer = document.createElement('div');
		fightContainer.className='fight';

		// First fighter
		fightContainer = getFighterSummary(goFirst[count], fightContainer);
		fightContainer = getPowerSummary(goFirst[count], fightContainer);
		gameWorkings.appendChild(fightContainer);

		fightContainer.appendChild(wrapInPTags('vs', 'head'));
		gameWorkings.appendChild(fightContainer);

		// Second fighter
		fightContainer = getFighterSummary(goSecond[count], fightContainer);
		fightContainer = getPowerSummary(goSecond[count], fightContainer);
		gameWorkings.appendChild(fightContainer);
	}	
}

function predictPointsLossFromBattle(creature, opponent) {
	let message = 'If not already beaten, a normal fight will result in a loss of ';
	message += creatureData[creature].getStrengthValue() + dice.getCurrentDiceTotal();
	message += " from the opponents health.";

	if(creatureData[creature].canSkipAGo() || creatureData[opponent].canSkipAGo()){
		message += "<br/>However, the fight will be skipped and no further health points will be lost.";
	}

	return wrapInPTags(message);
}

function getFighterSummary(creature, elementName){
	let summary = creatureData[creature].getCreatureSummaryAsText();
	elementName.appendChild(wrapInPTags(summary, 'head'));
		
	return elementName;
}

function getPowerSummary(creature, elementName){
	let powers = creatureData[creature].getSpecialPower();
	if(powers !== '') {
		powers = `Special Power: ${powers}`;
		elementName.appendChild(wrapInPTags(powers));
	}

	return elementName;
}

function showPredictedPowerEffects(creature, elementName){
	let effects	= creatureData[creature].getPowerEffectsPreview(creature);
	elementName.appendChild(wrapInPTags(effects));

	return elementName;
}

function getBeatenCreaturesLastRound(){
	let message = '';
	let count = eliminated.length;
	let eliminatedSrt = eliminated.sort();
	if(count > 0) {		
		if(count === 1){
			message = wrapInPTags(`${count} creature was eliminated through battle in the last round: <br/><br/>${eliminatedSrt.toString()}`);
		} else {
			let arrAsString = eliminatedSrt.join(', ');
			message = wrapInPTags(`${count} creatures were eliminated through battle in the last round: <br/><br/>${arrAsString}`);
		}
	} else {
		message = wrapInPTags('No creatures were eliminated through battle in the last round');
	}

	return message;
}

function getWinner(){
	let fightersInGame = creatureData.filter((creature) => {
		return creature.isCreatureDeleted() === false});
	
	fightersInGame = fightersInGame.map((creature) => creature.getIndexNumber());
	return fightersInGame[0];
}

function clearExistingHTMLOfDivId(idName){
	let cssDiv = document.getElementById(idName);
	cssDiv.innerHTML = '';
}

function wrapInPTags(text = '', pClass = null){
	let pTagString = document.createElement('p');
	if(pClass !== null) pTagString.className += pClass;
	pTagString.innerHTML = text;

	return pTagString;
}