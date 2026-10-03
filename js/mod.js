let modInfo = {
	name: "Ultimate Prestige Tree",
	author: "Krembo",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.3",
	name: "Preperations...",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2</h3><br>
	- Added Enhancements Node <br>
	- Added Time Node<br><br>
	<h3>v0.2.1</h3><br>
	-added Factory node<br><br>
	<h3>v0.2.2</h3><br>
	-added Technological advancements node<br>
	-bug fixes and balancing<br>
	-booster liquid<br><br>
	<h3>v0.2.3</h3><br>
	-Added missing upgrades from Te milestone 1<br>
	-Booster Liquid now has 3 plants and 3 upgrades<br>
	-Added a new F milestone<br>
	-Generator 7<br>
	-Bug fixes and balancing<br><br>
	<h3>v0.3</h3><br>
	-Added Time Travel Node<br>
	-Added Gears Node<br>
	-added Workers Node<br>
	-added super-boosters and super-generators<br>
	-added many new upgrades and milestones<br>
	-tons of bug fixes and balancing<br>
	-new endgame goal<br>
	-The slowdown Era has begun...<br>
	`

let winText = `You beat the game! Not much to it right now... But there will be more!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	///ADDITION
	//prestige
	if(hasUpgrade("p", 11)) gain = gain.add(1)

	///MULTIPLICATION
	//prestige
	if(hasMilestone("p", 0)) gain = gain.times(2)
	if(hasMilestone("p", 2)) gain = gain.times(5)
	
	//mega-points
	if(hasUpgrade("mp", 11)) gain = gain.times(2)
	if(hasUpgrade("mp", 12)) gain = gain.times(upgradeEffect("mp", 12))
	if(hasUpgrade("mp", 14)) gain = gain.times(2)
	if(hasUpgrade("mp", 22)) gain = gain.times(2)
	if(hasUpgrade("mp", 31)) gain = gain.times(5)

	//boosters
	if(hasUpgrade("b", 11)) gain = gain.times(2)
	if(hasUpgrade("b", 12)) gain = gain.times(1.5)
	if(hasUpgrade("b", 13)) gain = gain.times(2)
	if(hasUpgrade("b", 31)) gain = gain.times(upgradeEffect("b", 31))
	gain = gain.times(tmp.b.effect)

	//generators
	if(hasUpgrade("g", 11)) gain = gain.times(1.5)
	if(hasUpgrade("g", 13)) gain = gain.times(2)
	if(player.g.unlocked) {gain = gain.times(tmp.g.gpPointMultiplier)}
	
	//enhancements
	if(hasMilestone("e", 1)) gain = gain.times(2)
	if(hasMilestone("e", 4)) gain = gain.times(5)
	if(hasUpgrade("e", 12)) gain = gain.times(upgradeEffect("e", 12))
	if(hasUpgrade("e", 14)) gain = gain.times(2)
	if(getBuyableAmount("e", 11).gte(0)) {gain = gain.times(tmp.e.enhancersToPoint)}

	//time
	if(hasUpgrade("t", 12)) gain = gain.times(upgradeEffect("t", 12))
	if(hasUpgrade("t", 31)) gain = gain.times(1.1)
	if(hasUpgrade("t", 32)) gain = gain.times(1.3)
	if(hasUpgrade("t", 33)) gain = gain.times(1.5)
	if(hasUpgrade("t", 23)) gain = gain.times(3)
	if(hasMilestone("t", 0)) gain = gain.times(3)
	if(hasUpgrade("t", 13)) gain = gain.times(2)
	if(hasUpgrade("t", 53)) gain = gain.times(upgradeEffect("t", 53))
	if(hasUpgrade("t", 41)) gain = gain.times(upgradeEffect("t", 41))
	if(hasMilestone("t", 5)) gain = gain.times(10)
	if(hasUpgrade("t", 43)) gain = gain.times(1000)

	//factory-energy

	//technological-advancements
	if(hasMilestone("te", 0)) gain = gain.times(2)

	//time-travel
	if(getBuyableAmount("tt", 12).gte(1)) gain = gain.times(player.tt.points.root(10).pow(0.3).log(2).add(5))

	//gears
	if(hasUpgrade("ge", 14)) gain = gain.times(upgradeEffect("ge", 14))
	if(hasUpgrade("ge", 15)) gain = gain.times(upgradeEffect("ge", 15))

	//workers
	gain = gain.times(new Decimal(10).pow(getBuyableAmount("w", 11)))

	///POWERS
	//enhancers
	gain = gain.pow(getBuyableAmount("e", 12).divideBy(100).add(1))
	gain = gain.pow(getBuyableAmount("e", 23).divideBy(50).add(1))
	//time
	if(hasUpgrade("t", 62)) gain = gain.pow(1.1)

	//super-boosters
	gain = gain.pow(tmp.sb.pointEff)

	//super-generators
	gain = gain.pow(tmp.sg.pointEff)

	//time-travel
	gain = gain.pow(getBuyableAmount("tt", 31).divideBy(100).add(1))

	///RETURN
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	`Reach 1e550,000 Points to win!`
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e550000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}