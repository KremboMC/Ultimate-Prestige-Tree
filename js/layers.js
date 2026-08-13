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
        },
        15: {
            title: "True Prestige Point 4",
            description: "Your fourth  True Prestige Point! Gain 1% of Mega Point gain per second!",
            cost: new Decimal(1000000)
        },
        21: {
            title: "True Prestige Point 5",
            description: "Unlock 3 new booster Upgrades.",
            cost: new Decimal("5e10")
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
    },
    passiveGeneration() {
        if(hasUpgrade("p", 15)) return 0.01
        return 0
    }
})

addLayer("b", {
    name: "Boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["e", "t"],
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
        let exp = new Decimal(2)
        if(hasUpgrade("mp", 21)) exp = exp.sub(0.1)
        if(hasUpgrade("e", 14)) exp = exp.sub(0.4)
        return exp
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
            description: "Unlocking Enhancements... Also multiplies point gain by 1.5x!",
            cost: new Decimal(5)
        },
        13: {
            title: "Time for Time",
            description: "Unlock Time and multiply point gain by 2x.",
            cost: new Decimal(6)
        },
        21: {
            title: "Completely unrelated",
            description: "2x GP gain.",
            cost: new Decimal(12),
            unlocked() {return hasUpgrade("p", 21)}
        },
        22: {
            title: "Semi-related",
            description: "Enhancements are slightly cheaper",
            cost: new Decimal(15),
            unlocked() {return hasUpgrade("p", 21)}
        },
        23: {
            title: "Something BIG (probably)",
            description: "Unlocks Booster Liquid.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("p", 21)}
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 Boosters",
            effectDescription: "Unlocks new Mega Point upgrades.",
            done() { return player.b.points.gte(2) }
        }
    },
    canBuyMax() {
        if(hasMilestone("t", 0)) return true
        return false
    }
})

addLayer("g", {
    name: "Generators", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["e", "f"],
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
        let geneff = new Decimal(2)
        if(hasUpgrade("e", 21)) geneff = geneff.add(1)
        eff_generators = eff_generators.times(geneff**player.g.points)
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
                if(getBuyableAmount("g", 11).gt(0)) {
                    return "Generates 10 GP per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[11]) + "\n" +
                    "UNLOCKED"
                }
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
                return new Decimal(20000)
            },
            display() {
                if(getBuyableAmount("g", 12).gt(0)) {
                    return "Generates 1 Generator 1 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[12]) + "\n" +
                    "UNLOCKED"
                }
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
        },
        13: {
            title: "Generator 3",
            cost(x) {
                return new Decimal("e6")
            },
            display() {
                if(getBuyableAmount("g", 13).gt(0)) {
                    return "Generates 1 Generator 2 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[13]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 2 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[13]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax3 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax3
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[13] = player.g.buyables[13].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 12).gt(0) && hasUpgrade("g", 12)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        21: {
            title: "Generator 4",
            cost(x) {
                return new Decimal("5e8")
            },
            display() {
                if(getBuyableAmount("g", 21).gt(0)) {
                    return "Generates 1 Generator 3 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[21]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 3 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[21]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax4 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax4
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[21] = player.g.buyables[21].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 13).gt(0) && hasMilestone("g", 1)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        22: {
            title: "Generator 5",
            cost(x) {
                return new Decimal("5e12")
            },
            display() {
                if(getBuyableAmount("g", 22).gt(0)) {
                    return "Generates 1 Generator 4 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[22]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 4 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[22]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax5 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax5
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[22] = player.g.buyables[22].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 21).gt(0) && hasUpgrade("e", 13)
            },
            purchaseLimit() {return new Decimal(1)}
        }
    },
    upgrades: {
        11: {
            title: "First Half of Enhancements",
            description: "Unlocking Enhancements..." + " Also multiplies point gain by 1.5x!",
            cost: new Decimal(3)
        },
        12: {
            title: "Generator 3",
            description: "Unlock generator 3",
            cost: new Decimal(3)
        },
        13: {
            title: "Mass manufacturing",
            description: "Unlocks Factories and multiply point gain by 2x",
            cost: new Decimal(4)
        }
    },
    update(diff) {
        if(getBuyableAmount(this.layer, 22).gt(0)) {
            let g4Produced = getBuyableAmount(this.layer, 22).times(1).times(diff)
            let currentG4 = getBuyableAmount(this.layer, 21)
            setBuyableAmount(this.layer, 21, currentG4.add(g4Produced))
        }
        if(getBuyableAmount(this.layer, 21).gt(0)) {
            let g3Produced = getBuyableAmount(this.layer, 21).times(1).times(diff)
            let currentG3 = getBuyableAmount(this.layer, 13)
            setBuyableAmount(this.layer, 13, currentG3.add(g3Produced))
        }    
        if(getBuyableAmount(this.layer, 13).gt(0)) {
            let g2Produced = getBuyableAmount(this.layer, 13).times(1).times(diff)
            let currentG2 = getBuyableAmount(this.layer, 12)
            setBuyableAmount(this.layer, 12, currentG2.add(g2Produced))
        }
        if(getBuyableAmount(this.layer, 12).gt(0)) {
            let g1Produced = getBuyableAmount(this.layer, 12).times(1).times(diff)
            let currentG1 = getBuyableAmount(this.layer, 11)
            setBuyableAmount(this.layer, 11, currentG1.add(g1Produced))
        }
        if(getBuyableAmount(this.layer, 11).gt(0)) {
            //REMEMBER TO ADD TO GP PER SECOND DISPLAY ASWELL!!!!
            let gpProduced = new Decimal(10).times(getBuyableAmount(this.layer, 11)).times(diff)
            let geneff = new Decimal(2)
            if(hasUpgrade("e", 21)) geneff = geneff.add(1)
            if(player.g.points.gte(0)) gpProduced = gpProduced.times(geneff**player.g.points)
            if(hasUpgrade("mp", 24)) gpProduced = gpProduced.times(3)
            if(getBuyableAmount("e", 11).gt(0)) gpProduced = gpProduced.times(tmp.e.enhancersToGP)
            if(hasUpgrade("t", 22)) gpProduced = gpProduced.times(5)
            if(hasUpgrade("b", 21)) gpProduced = gpProduced.times(2)
            player.g.gp = player.g.gp.add(gpProduced)
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 Generators",
            effectDescription: "Unlocks new Mega Point upgrades.",
            done() { return player.g.points.gte(2) }
        },
        1: {
            requirementDescription: "10,000,000 GP",
            effectDescription: "Unlocks Generator 4",
            done() { return player.g.gp.gte(10000000)}
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {
            return "You have " + format(player.points) + " points"
        }],
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
        ["display-text", function() {
            return "You have <h2 style= 'color: #3ee03e'>" + format(player.g.gp) + "</h2> GP, Which is multiplying point gain by <h2 style = 'color: #ffffff'>" + format(tmp.g.gpPointMultiplier) + "</h2>x"
        }],
        ["display-text", function() {
            let gpps = new Decimal(0)
            let geneffdis = new Decimal(2)
            if(hasUpgrade("e", 21)) geneffdis = geneffdis.add(1)
            if(getBuyableAmount("g", 11).gt(0)) gpps = gpps.add(10)
            gpps = gpps.times(getBuyableAmount("g", 11))
            gpps = gpps.times(geneffdis**player.g.points)
            if(hasUpgrade("mp", 24)) gpps = gpps.times(3)
            if(hasUpgrade("t", 22)) gpps = gpps.times(5)
            if(getBuyableAmount("e", 11).gt(0)) gpps = gpps.times(tmp.e.enhancersToGP)
            if(hasUpgrade("b", 21)) gpps = gpps.times(2)
            return "You're generating <h2 style = 'color: #3ee03e'>" + format(gpps) + "</h2> GP per second"
        }],
        "blank",
        "buyables",
    ]
})

addLayer("e", {
    name: "Enhancers",
    symbol: "E",
    position: 1,
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
    exponent: 0.8,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    enhancersToPoint() {
        return getBuyableAmount(this.layer, 11).times(3).pow(1.3).ceil().add(1)
    },
    enhancersToGP() {
        return getBuyableAmount(this.layer, 11).times(2).pow(1.2).ceil().add(1)
    },
    row: 2,
    hotkeys: [
        {key: "e", description: "E: Reset for Enhancers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {
        if((hasUpgrade("g", 11) && hasUpgrade("b", 12)) || player.e.unlocked) return true
        return false
    },
    buyables: {
        11: {
            title: "Enhancement",
            cost(x) {
                let buys = player.e.buyables[11]
                let exp = new Decimal(0.75)
                if(hasMilestone("e", 2)) exp = exp.sub(0.05)
                if(hasUpgrade("e", 11)) exp = exp.sub(0.05)
                if(hasUpgrade("b", 22)) exp = exp.sub(0.1)
                return new Decimal(100000).pow(buys).pow(exp)
            },
            display() {
                return "Owned:" + formatWhole(getBuyableAmount(this.layer, this.id)) + "\n"
                + "Cost:" + format(this.cost()) + " Points \n"
                + "Multiplying point gain by " + formatWhole(tmp.e.enhancersToPoint) + "x\n"
                + "Multiplying GP gain by " + formatWhole(tmp.e.enhancersToGP) + "x"
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.e.buyables[11] = player.e.buyables[11].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            unlocked() { return hasMilestone("e", 0)}
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 Enhancement Point",
            effectDescription: "Unlocks Enhancers",
            done() {return player.e.points.gte(1)}
        },
        1: {
            requirementDescription: "10 Enhancement Points",
            effectDescription: "Doubles Point Gain",
            done() {return player.e.points.gte(10)}
        },
        2: {
            requirementDescription: "250 Enhancement Points",
            effectDescription: "Enhancements are slightly cheaper",
            done() {return player.e.points.gte(250)}
        }
    },
    upgrades: {
        11: {
            title: "Even Cheaper Enhancements",
            description: "Enhancements are slightly cheaper",
            cost: new Decimal(600)
        },
        12: {
            title: "Synergism part II",
            description: "Enhancement points boost point gain.",
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"},
            cost: new Decimal(1300),
            effect() {
                return player.e.points.add(1).pow(0.2)
            }
        },
        13: {
            title: "Generator 5?",
            description: "unlocks Generator 5.",
            cost: new Decimal(10000)
        },
        14: {
            title: "Booster market crash",
            description: "Boosters are SIGNIFICANTLY cheaper.",
            cost: new Decimal("5e6")
        },
        21: {
            title: "Absurdly powerful generators",
            description: "Generators now multiply GP gain by 3x instead of 2x.",
            cost: new Decimal("5e8")
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {
            return "You have " + format(player.points) + " points."
        }],
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
        "buyables"
    ]
})

addLayer("t" , {
    name: "Time",
    symbol: "T",
    position: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        tc: new Decimal(0)
    }},
    color: "#063d0f",
    requires: new Decimal(10000000),
    resource: "Time Shards",
    baseResource: "points",
    baseAmount () { return player.points},
    type: "normal",
    exponent() {
        if(hasUpgrade("t", 11)) return 0.6
        return 0.5
    },
    gainMult() {
        let mult = new Decimal(1)
        if(hasUpgrade("t", 21)) mult = mult.times(upgradeEffect("t", 21))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "t", description: "T: Reset for Time", onPress() {if(canReset(this.layer)) doReset(this.layer)}}
    ],
    layerShown() {
        if(hasUpgrade("b", 13) || player.t.unlocked) return true
        return false
    },
    upgrades: {
        11: {
            title: "Easier Time",
            description: "Gain slightly more time shards when resetting.",
            cost: new Decimal(10)
        },
        12: {
            title: "Timeback synergism",
            description: "Points boost their own gain",
            cost: new Decimal(50),
            effect() {
                return player.points.add(1).pow(0.05)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        13: {
            title: "Time Lab",
            description: "Unlock the Time Lab inside the Time node.",
            cost: new Decimal(1000)
        },
        21: {
            title: "Shattered Crystals",
            description: "Time Crystals boost Time Shard gain.",
            cost: new Decimal(1),
            effect() {
                return player.t.tc.add(1).pow(0.15)
            },
            effectDisplay() {return format((upgradeEffect(this.layer, this.id))) + "x"},
            currencyDisplayName: "Time Crystal",
            currencyInternalName: "tc",
            currencyLayer: "t"
        },
        22: {
            title: "Even More GP",
            description: "5x GP gain.",
            cost: new Decimal(5),
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t"
        },
        23: {
            title: "A dream",
            description: "Multiplies point gain by 3x",
            cost: new Decimal(50),
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t"
        },
        31: {
            title: "The small things in life",
            description: "Multiplies Point gain by 1.1x",
            cost: new Decimal(5000),
        },
        32: {
            title: "The slightly bigger things in life",
            description: "Multiplies point gain by 1.3x",
            cost: new Decimal(20000)
        },
        33: {
            title: "The adequately sized things in life",
            description: "Multiplies point gain by 1.5x",
            cost: new Decimal(65000)
        }
    },
    milestones: {
        0: {
            requirementDescription: "1000 Time Shards",
            effectDescription: "You can buy multiple boosters at once",
            done() {return player.t.points.gte(1000)}
        }
    },
    buyables: {
        11: {
            title: "Make a Time Crystal",
            cost(x) {
                let pur = new Decimal(1500)
                return pur
            },
            display() {
                return "Cost: " + formatWhole(this.cost()) + " Time Shards"
            },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                player.t.tc = player.t.tc.add(1)
            },
            canAfford() {
                return player.t.points.gte(this.cost())
            },

        }
    },
    tabFormat: {
        "Time Shards": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                ["upgrades", [1,3]]
            ]
        },
        "Time Lab": {
            content: [
                ["display-text", function() {
                    return "You have <h2 style = 'color: #063d0f'>" + formatWhole(player.t.tc) + "</h2> Time Crystals"
                }],
                "blank",
                ["buyables", [1]],
                ["display-text", function() {
                    return "You have " + formatWhole(player.t.points) + " Time Shards"
                }],
                "blank",
                ["upgrades", [2]]
            ],
            unlocked() {
                if(hasUpgrade("t", 13)) return true
                return false
            }
        }
    }
})

addLayer("f" , {
    name: "Factories",
    symbol: "F",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#c45903",
    requires: new Decimal(100000000),
    resource: "Factory Energy",
    baseResource: "GP",
    baseAmount () { return player.g.gp},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "f", description: "F: Reset for Factories", onPress() {if(canReset(this.layer)) doReset(this.layer)}}
    ],
    layerShown() {
        if(hasUpgrade("g", 13) || player.f.unlocked) return true
        return false
    }
})