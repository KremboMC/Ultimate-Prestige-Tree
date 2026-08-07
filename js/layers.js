addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ["mp", "b"],
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#27C6D6",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasMilestone("p", 1)) mult = mult.times(player.points.add(1).pow(0.15))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    milestones: {
        0: {
            requirementDescription: "1 True Prestige Point",
            effectDescription: "Doubles Point Generation.",
            done() { return hasUpgrade("p", 12) }
        },
        1: {
            requirementDescription: "2 True Prestige Points",
            effectDescription: "Points Boost Prestige Point Generation.",
            done() { return hasUpgrade("p", 13) }
        }
    },
    upgrades: {
        11: {
            title: "Point Generation",
            description: "Generate 1 Point per second.",
            cost: new Decimal(1)
        },
        12: {
            title: "True Prestige Point 1",
            description: "Your first True Prestige Point! Unlocks Mega Points!",
            cost: new Decimal(2)
        },
        13: {
            title: "True Prestige Point 2",
            description: "Your second True Prestige Point! Unlocks Boosters!",
            cost: new Decimal(20)
        },
        14: {
            title: "True Prestige Point 3",
            description: "Your third True Prestige Point! Unlocks Generators!",
            cost: new Decimal(150)
        }
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row > this.row) {
            let keep = []
            if (hasUpgrade("p", 12)) keep.push("upgrades")
            keep.push("milestones")
            layerDataReset(this.layer, keep)
        }
    },
})

addLayer("mp", {
    name: "Mega Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
    }},
    color: "#2a35d3",
    requires: new Decimal(3), // Can be a function that takes requirement increases into account
    resource: "Mega Points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasUpgrade("mp", 13)) mult = mult.times(upgradeEffect("mp", 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for mega points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("p", 12)) return true
        return false
    },
    upgrades: {
        11: {
            title: "Better Point Generation",
            description: "Doubles point generation.",
            cost: new Decimal(1)
        },
        12: {
            title: "Synergism",
            description: "Increases point generation based on your Mega Points.",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Points X Mega Points",
            description: "Multiplies Mega Point generation based on your Points.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "Even Better Point Generation",
            description: "Doubles point generation again.",
            cost: new Decimal(10)
        }
    }
})

addLayer("b", {
    name: "Boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
    }},
    color: "#7a37b9",
    requires: new Decimal(20), // Can be a function that takes requirement increases into account
    resource: "Boosters", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("p", 13)) return true
        return false
    },
})