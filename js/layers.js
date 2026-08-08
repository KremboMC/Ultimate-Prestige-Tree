addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ["mp", "b", "g"],
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
    color: "#7a37b9",
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
        },
        21: {
            title: "Cheaper Boosters",
            description: "Boosters are slightly cheaper.",
            cost: new Decimal(50),
            unlocked() {return hasMilestone("b", 0)}
        },
        22: {
            title: "Another Free Booster?",
            description: "Doubles point gain again.",
            cost: new Decimal(250),
            unlocked() {return hasMilestone("b", 0)}
        },
        23: {
            title: "Cheaper Generators",
            description: "Generators are slightly cheaper.",
            cost: new Decimal(125),
            unlocked() {return hasMilestone("g", 0)}
        },
        24: {
            title: "GP Skyrocketing",
            description: "GP gain multiplied by 3.",
            cost: new Decimal(300),
            unlocked() {return hasMilestone("g", 0)}
        }
    }
})

addLayer("b", {
    name: "Boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["e"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
    }},
    color: "#2a35d3",
    requires: new Decimal(20), // Can be a function that takes requirement increases into account
    resource: "Boosters", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        if(hasUpgrade("mp", 21)) return 1.9
        return 2
    }, // Prestige currency exponent
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
    effect() {
        let eff_boosters = new Decimal(1)
        eff_boosters = eff_boosters.times(2**player.b.points)
        return eff_boosters
    },
    effectDescription() { return "which are multiplying point gain by "+format(tmp[this.layer].effect)+"x" },
    upgrades: {
        11: {
            title : "Free Booster?",
            description: "Doubles point gain",
            cost: new Decimal(4)
        },
        12: {
            title: "Second half of Enhancements",
            description: "Unlocking Enhancements...",
            cost: new Decimal(5)
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 Boosters",
            effectDescription: "Unlocks new Mega Point upgrades.",
            done() { return player.b.points.gte(2) }
        }
    }
})

addLayer("g", {
    name: "Generators", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["e"],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        gp: new Decimal(0),
    }},
    color: "#3ee03e",
    requires: new Decimal(20),
    resource: "Generators", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points},
    type: "static",
    exponent() {
        if(hasUpgrade("mp", 23)) return 2.8
        return 3
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "g", description: "G: Reset for generators", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("p", 14)) return true
        return false
    },
    effect() {
        let eff_generators = new Decimal(1)
        eff_generators = eff_generators.times(2**player.g.points)
        return eff_generators
    },
    effectDescription() { return "which are multiplying GP gain by "+format(tmp[this.layer].effect)+"x" },
    gpPointMultiplier() {
        return player.g.gp.root(2).add(1).log(2).divideBy(5).add(1)
    },
    buyables: {
        11: {
            title: "Generator 1",
            cost(x) {
                return new Decimal(10)
            },
            display() {
                return "Generates 10 GP per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[11]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"
            },
            canAfford() {
                let reachedMax = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[11] = player.g.buyables[11].add(1)
            },
            unlocked() {return player.g.unlocked},
            purchaseLimit() {return new Decimal(1)}
        },
        12: {
            title: "Generator 2",
            cost(x) {
                let amount = getBuyableAmount(this.layer, this.id)
                return new Decimal(100).pow(amount).mul(100)
            },
            display() {
                return "Generates 1 Generator 1 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[12]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"
            },
            canAfford() {
                let reachedMax2 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax2
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[12] = player.g.buyables[12].add(1)
            },
            unlocked() {return getBuyableAmount(this.layer, 11).gt(0)},
            purchaseLimit() {return new Decimal(1)}
        }
    },
    upgrades: {
        11: {
            title: "First Half of Enhancements",
            description: "Unlocking Enhancements...",
            cost: new Decimal(3)
        }
    },
    update(diff) {
        if(getBuyableAmount(this.layer, 12).gt(0)) {
            let g1Produced = getBuyableAmount(this.layer, 12).times(1).times(diff)
            let currentG1 = getBuyableAmount(this.layer, 11)
            setBuyableAmount(this.layer, 11, currentG1.add(g1Produced))
        }
        if(getBuyableAmount(this.layer, 11).gt(0)) {
            let gpProduced = new Decimal(10).times(getBuyableAmount(this.layer, 11)).times(diff)
            if(hasUpgrade("mp", 24)) gpProduced = gpProduced.times(3)
            player.g.gp = player.g.gp.add(gpProduced)
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 Generators",
            effectDescription: "Unlocks new Mega Point upgrades.",
            done() { return player.g.points.gte(2) }
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
        ["display-text", function() {
            return "You have <h2 style= 'color: #3ee03e'>" + format(player.g.gp) + "</h2> GP, Which is multiplying point gain by <h2 style = 'color: #ffffff'>" + format(tmp.g.gpPointMultiplier) + "</h2>x    "
        }],
        "blank",
        "buyables",
    ]
})

addLayer("e", {
    name: "Enhancers",
    symbol: "E",
    position: "1",
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#af59c9",
    requires: new Decimal(1000000),
    resource: "Enhancement Points",
    baseResource: "Points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.7,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "e", description: "E: Reset for Enhancers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {
        if((hasUpgrade("g", 11) && hasUpgrade("b", 12)) || player.e.unlocked) return true
        return false
    }
})