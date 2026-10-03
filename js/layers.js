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
    exponent() {
        let exp = new Decimal(0.5)
        let div = new Decimal(5)
        if(hasUpgrade("b", 32)) div = div.sub(1)
        if(getBuyableAmount("b", 11).gte(1)) exp = exp.add(getBuyableAmount("b", 11).add(1).log(5).root(2).divideBy(div))
        return exp
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        let ten = new Decimal(10)
        if(hasMilestone("p", 1)) mult = mult.times(player.points.add(1).pow(0.15))
        mult = mult.times(ten.pow(getBuyableAmount("e", 21)))
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
        },
        2: {
            requirementDescription: "3 true Prestige Points",
            effectDescription: "5x point gain.",
            done() { return hasUpgrade("p", 14)}
        },
        3: {
            requirementDescription: "1e300,000 Points",
            effectDescription: "Welcome to the Slowdown...",
            done() { return player.points.gte("e300000") }
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
            cost: new Decimal(10)
        },
        14: {
            title: "True Prestige Point 3",
            description: "Your third True Prestige Point! Unlocks Generators!",
            cost: new Decimal(100)
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
        },
        22: {
            title: "True Prestige Point 6",
            description: "Generate 100% of Prestige point gain every second.",
            cost: new Decimal("5e16")
        },
        23: {
            title: "True Prestige Point 7",
            description: "Row 3 Nodes reset nothing.",
            cost: new Decimal("1e100")
        },
        24: {
            title: "True Prestige point 8",
            description: "Super-Booster's and Super-Generator's point effect is 2x stronger.",
            cost() {return new Decimal("e300")}
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
    passiveGeneration() {
        if(hasUpgrade("p", 22)) return 1
        return 0
    }
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
    exponent() {
        let exp = new Decimal(0.5)
        if(hasUpgrade("mp", 34)) exp = exp.sub(0.1)
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasUpgrade("mp", 13)) mult = mult.times(upgradeEffect("mp", 13))
        if(hasUpgrade("t", 42)) mult = mult.times(upgradeEffect("t", 42))
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
                let exp = new Decimal(0.5)
                let enh_multi = new Decimal(1)
                enh_multi = enh_multi.add(getBuyableAmount("e", 22).divideBy(10))
                if(hasMilestone("te", 1)) exp = exp.add(0.3)
                let base_effect = player[this.layer].points.add(1).pow(exp).times(enh_multi)
                let softcapStart = new Decimal("e1e5")
                if(base_effect.gte(softcapStart)) {
                    base_effect = softcapStart.mul(base_effect.div(softcapStart).pow(0.5).log(2))
                }
                return base_effect
            },
            effectDisplay() {
                let exp = new Decimal(0.5)
                let enh_multi = new Decimal(1)
                enh_multi = enh_multi.add(getBuyableAmount("e", 22).divideBy(10))
                if(hasMilestone("te", 1)) exp = exp.add(0.3)
                let base_effect = player[this.layer].points.add(1).pow(exp).times(enh_multi)
                let softcapStart = new Decimal("e1e5")
                if(base_effect.gte(softcapStart)) {
                    base_effect = softcapStart.mul(base_effect.div(softcapStart).pow(0.5))
                }
                let eff = tmp[this.layer].upgrades[this.id].effect
                let softcapText = eff.gte("1e1e5") ? "(softcapped)" : ""
                return format(eff) + "x" + softcapText
            },
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
        },
        31: {
            title: "Too slow for my ADHD",
            description: "5x Points.",
            cost() {return new Decimal("1.5e7")},
            unlocked() {return hasMilestone("g", 2)}
        },
        32: {
            title: "To the moon!",
            description: "50x GP. Huge.",
            cost() {return new Decimal("5e7")},
            unlocked() {return hasMilestone("g", 2)}
        },
        33: {
            title: "Small dip in revenue",
            description: "Oh no, the stock market! Anyway, Boosters are slightly cheaper.",
            cost() {return new Decimal("2e8")},
            unlocked() {return hasMilestone("b", 1)}
        },
        34: {
            title: "More Mega",
            description: "Mega Points are slightly easier to get",
            cost() {return new Decimal("1e9")},
            unlocked() {return hasMilestone("b", 1)}
        }
    },
    passiveGeneration() {
        if(hasUpgrade("p", 15)) return 0.01
        return 0
    },
    resetsNothing() {
        if(hasUpgrade("e", 24)) return true
        return false
    }
})

addLayer("b", {
    name: "Boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["e", "t", "sb"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        bl: new Decimal(0)
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
        if(hasUpgrade("e", 21)) exp = exp.sub(0.4)
        if(hasUpgrade("mp", 33)) exp = exp.sub(0.1)
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
        let base_mult = new Decimal(2)
        base_mult = base_mult.add(tmp.sb.effect)
        eff_boosters = eff_boosters.times(base_mult.pow(player.b.points))
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
            title: "Not water.",
            description: "Unlocks Booster Liquid.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("p", 21)}
        },
        31: {
            title: "Liquid Investments",
            description: "Booster Liquid boosts point gain.",
            cost: new Decimal(1000),
            currencyDisplayName: "ml of Booster Liquid",
            currencyInternalName: "bl",
            currencyLayer: "b",
            effect() {
                let exp = new Decimal(0.5)
                let mult = new Decimal(1)
                return player.b.bl.times(10).root(2).log(1.055).pow(exp).times(mult)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        32: {
            title: "Better Plant of Prestige",
            description: "Plant of Prestige is stronger.",
            cost: new Decimal(3200),
            currencyDisplayName: "ml of Booster Liquid",
            currencyInternalName: "bl",
            currencyLayer: "b"
        },
        33: {
            title: "Better Plant of Power",
            description: "Plant of Power is stronger.",
            cost: new Decimal(10000),
            currencyDisplayName: "ml of Booster Liquid",
            currencyInternalName: "bl",
            currencyLayer: "b"
        },
        41: {
            title: "Booster Liquid Boosted",
            description: "Doubles Booster liquid gain.",
            cost: new Decimal(60),
            unlocked() {return hasMilestone("te", 0)}
        },
        42: {
            title: "SUPER LIQUID",
            description: "Booster Liquid gain is multiplied by half of your Boosters.",
            cost: new Decimal(75),
            unlocked() {return hasMilestone("te", 0)}
        },
        43: {
            title: "Plant of Fre(E)",
            description: "Unlocks the 3rd plant.",
            cost: new Decimal(82),
            unlocked() {return hasMilestone("te", 0)}
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 Boosters",
            effectDescription: "Unlocks new Mega Point upgrades.",
            done() { return player.b.points.gte(2) }
        },
        1: {
            requirementDescription: "9 Boosters",
            effectDescription: "Unlocks another 2 Mega Point Upgrades.",
            done() {return player.b.points.gte(9)}
        }
    },
    buyables: {
        11: {
            title: "Plant of Prestige",
            cost(x) {
                let base = new Decimal(3)
                return base.pow(getBuyableAmount("b", 11).add(1)).pow(3)
            },
            display() {
                let div = new Decimal(5)
                if(hasUpgrade("b", 32)) div = div.sub(1)
                return "Reduces Prestige Point exponent by " + format(getBuyableAmount("b", 11).add(1).log(5).root(2).divideBy(div)) + ".\nCost: " + format(this.cost()) + " ml of Booster Liquid"
            },
            canAfford() {
                return player.b.bl.gte(this.cost())
            },
            buy() {
                player.b.bl = player.b.bl.sub(this.cost())
                player.b.buyables[11] = player.b.buyables[11].add(1)
            },
            unlocked() {return hasUpgrade("b", 23)},
        },
        12: {
            title: "Plant of Power",
            cost(x) {
                let base = new Decimal(5)
                return base.pow(getBuyableAmount("b", 12).add(1)).pow(3.2)
            },
            display() {
                let div = new Decimal(5)
                if(hasUpgrade("b", 33)) div = div.sub(2)
                return "Multiplies GP gain by " + format(getBuyableAmount("b", 12).add(1).divideBy(div).add(1)) + "x\nCost: " + format(this.cost()) + " ml of Booster Liquid"
            },
            canAfford() {
                return player.b.bl.gte(this.cost())
            },
            buy() {
                player.b.bl = player.b.bl.sub(this.cost())
                player.b.buyables[12] = player.b.buyables[12].add(1)
            },
            unlocked() {return hasUpgrade("b", 23)},
        },
        21: {
            title: "Plant of fre(E)",
            cost(x) {
                let base = new Decimal(15)
                return base.pow(getBuyableAmount("b", 21).add(1)).pow(1.3)
            },
            display() {
                return "Gives " + format(getBuyableAmount("b", 21).times(2)) + " Free Enhancements.\nCost: " + format(this.cost()) + " ml of Booster Liquid"
            },
            canAfford() {
                return player.b.bl.gte(this.cost())
            },
            buy() {
                player.b.bl = player.b.bl.sub(this.cost())
                player.b.buyables[21] = player.b.buyables[21].add(1)
            },
            unlocked() {return hasUpgrade("b", 43)},
        }
    },
    canBuyMax() {
        if(hasMilestone("t", 1)) return true
        return false
    },
    resetsNothing() {
        if(hasMilestone("t", 3)) return true
        return false
    },
    autoPrestige() {
        return player.b.auto && hasMilestone("t", 4)
    },
    tabFormat: {
        "Boosters": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",
                "blank",
                ["upgrades", [1,2,4]],
            ]
        },
        "Booster Liquid": {
            content: [
                ["display-text", function(){
                    let blgain = new Decimal(player.b.points)
                    if(hasUpgrade("b", 41)) blgain = blgain.times(2)
                    if(player.sb.unlocked) blgain = blgain.times(tmp.sb.blEffect)
                    if(hasUpgrade("b", 42)) blgain = blgain.times(player.b.points.add(1).divideBy(2).sub(0.5).ceil())
                    blgain = blgain.times(new Decimal(2).pow(getBuyableAmount("w", 12)))
                    return "You have <h2 style = 'color: #2a35d3'>" + format(player.b.points) + "</h2> Boosters, which are generating <h2 style = 'color: #2a35d3'>" + format(blgain) + "</h2> ml of Booster Liquid per second." 
                }],
                "blank",
                ["display-text", function(){
                    return "You have <h2 style = 'color: #2a35d3'>" + formatWhole(player.b.bl) + "</h2> ml of Booster Liquid."
                }],
                "blank",
                ["upgrades", [3]],
                "blank",
                "buyables"
            ],
            unlocked() {return hasUpgrade("b", 23)}
        }
    },
    update(diff) {
        let blgain = new Decimal(0)
        if(hasUpgrade("b", 23)) blgain = player.b.points.times(1).times(diff)
        if(hasUpgrade("b", 41)) blgain = blgain.times(2)
        if(hasUpgrade("b", 42)) blgain = blgain.times(player.b.points.add(1).divideBy(2).sub(0.5).ceil())
        if(player.sb.unlocked) blgain = blgain.times(tmp.sb.blEffect)
        blgain = blgain.times(new Decimal(2).pow(getBuyableAmount("w", 12)))
        player.b.bl = player.b.bl.add(blgain)
    }
    
})

addLayer("g", {
    name: "Generators", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["e", "f", "sg"],
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
        let exp = new Decimal(3)
        if(hasUpgrade("mp", 23)) exp = exp.sub(0.2)
        if(hasUpgrade("g", 23) && player.g.gp.gte(10)) exp = exp.sub(upgradeEffect("g", 23))
        if(hasUpgrade("f", 22)) exp = exp.sub(0.5)
        return exp
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
        geneff = geneff.add(getBuyableAmount("e", 13))
        if(hasUpgrade("e", 22)) geneff = geneff.add(1)
        eff_generators = eff_generators.times(geneff.pow(player.g.points))
        return eff_generators
    },
    effectDescription() { return "which are multiplying GP gain by "+format(tmp[this.layer].effect)+"x" },
    gpPointMultiplier() {
        let divider = new Decimal(5)
        if(hasUpgrade("f", 12)) divider = divider.sub(2)
        if(hasUpgrade("g", 21)) divider = divider.sub(2)
        let ret_eff = new Decimal(1)
        ret_eff = ret_eff.times(player.g.gp.root(2).add(1).log(2).divideBy(divider).add(1))
        if(player.sg.unlocked) ret_eff = ret_eff.pow(tmp.sg.effect)
        return ret_eff
    },
    gpps() {
        let gpProduced = new Decimal(10).times(getBuyableAmount(this.layer, 11))
        let geneff = new Decimal(2)
        let bldiv = new Decimal(5)
        geneff = geneff.add(getBuyableAmount("e", 13))
        if(hasUpgrade("b", 33)) bldiv = bldiv.sub(2)
        if(hasUpgrade("e", 22)) geneff = geneff.add(1)
        if(player.g.points.gte(0)) gpProduced = gpProduced.times(geneff.pow(player.g.points))
        if(hasUpgrade("mp", 24)) gpProduced = gpProduced.times(3)
        if(getBuyableAmount("e", 11).gt(0)) gpProduced = gpProduced.times(tmp.e.enhancersToGP)
        if(hasUpgrade("t", 22)) gpProduced = gpProduced.times(5)
        if(hasUpgrade("b", 21)) gpProduced = gpProduced.times(2)
        if(player.f.unlocked) gpProduced = gpProduced.times(tmp.f.aptogp)
        if(hasUpgrade("f", 11)) gpProduced = gpProduced.times(20)
        if(hasUpgrade("mp", 32)) gpProduced = gpProduced.times(50)
        if(hasMilestone("te", 0)) gpProduced = gpProduced.times(2)
        if(getBuyableAmount("b", 12).gte(1)) gpProduced = gpProduced.times(getBuyableAmount("b", 12).add(1).divideBy(bldiv).add(1))
        if(hasUpgrade("f", 14)) gpProduced = gpProduced.times(10)
        if(player.sg.unlocked) gpProduced = gpProduced.times(tmp.sg.gpEff)
        if(hasUpgrade("f", 21)) gpProduced = gpProduced.pow(1.1)
        return gpProduced
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
                let amt_gen = new Decimal(1)
                if(hasUpgrade("g", 22)) amt_gen = amt_gen.add(1)
                if(getBuyableAmount("g", 12).gt(0)) {
                    return "Generates " + formatWhole(amt_gen) + " Generator 1 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[12]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates " + formatWhole(amt_gen) + " Generator 1 per second. \n" +
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
        },
        23: {
            title: "Generator 6",
            cost(x) {
                return new Decimal("5e16")
            },
            display() {
                if(getBuyableAmount("g", 23).gt(0)) {
                    return "Generates 1 Generator 5 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[23]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 5 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[23]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax6 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax6
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[23] = player.g.buyables[23].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 22).gt(0) && hasMilestone("f", 1)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        31: {
            title: "Generator 7",
            cost(x) {
                return new Decimal("1e75")
            },
            display() {
                if(getBuyableAmount("g", 31).gt(0)) {
                    return "Generates 1 Generator 6 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[31]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 6 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[31]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax7 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax7
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[31] = player.g.buyables[31].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 23).gt(0) && hasMilestone("f", 2)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        32: {
            title: "Generator 8",
            cost(x) {
                return new Decimal("1e1500")
            },
            display() {
                if(getBuyableAmount("g", 32).gt(0)) {
                    return "Generates 1 Generator 7 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[32]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 7 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[32]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax8 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax8
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[32] = player.g.buyables[32].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 31).gt(0) && hasUpgrade("f", 23)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        33: {
            title: "Generator 9",
            cost(x) {
                return new Decimal("1e5e5")
            },
            display() {
                if(getBuyableAmount("g", 33).gt(0)) {
                    return "Generates 1 Generator 8 per second. \n" +
                    "Owned:" + formatWhole(player.g.buyables[33]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Generator 8 per second. \n" +
                "Owned:" + formatWhole(player.g.buyables[33]) + "\n" +
                "Cost:" + format(this.cost()) + " Points"                
            },
            canAfford() {
                let reachedMax9 = getBuyableAmount(this.layer, this.id).gte(1)
                return player.points.gte(this.cost()) && !reachedMax9
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.g.buyables[33] = player.g.buyables[33].add(1)
            },
            unlocked() {
                return getBuyableAmount(this.layer, 32).gt(0) && hasMilestone("f", 4)
            },
            purchaseLimit() {return new Decimal(1)}
        },
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
        },
        21: {
            title: "GP is my favorite fruit",
            description: "GP boosts points slightly more.",
            cost: new Decimal(6),
            unlocked() {return hasMilestone("te", 0)}
        },
        22: {
            title: "G2 might be cooking",
            description: "Generator 2 now produces 2 Generator 1s per second!",
            cost: new Decimal(7),
            unlocked() {return hasMilestone("te", 0)},
        },
        23: {
            title: "Toxic GP",
            description: "GP makes generators cheaper.",
            cost: new Decimal(8),
            unlocked() {return hasMilestone("te", 0)},
            effect() {return player.g.gp.divideBy(player.g.gp.add(1000))}
        }
    },
    update(diff) {
        if(getBuyableAmount(this.layer, 33).gt(0)) {
            let g8Produced = getBuyableAmount(this.layer, 33).times(1).times(diff)
            let currentG8 = getBuyableAmount(this.layer, 32)
            setBuyableAmount(this.layer, 32, currentG8.add(g8Produced))
        }
        if(getBuyableAmount(this.layer, 32).gt(0)) {
            let g7Produced = getBuyableAmount(this.layer, 32).times(1).times(diff)
            let currentG7 = getBuyableAmount(this.layer, 31)
            setBuyableAmount(this.layer, 31, currentG7.add(g7Produced))
        }
        if(getBuyableAmount(this.layer, 31).gt(0)) {
            let g6Produced = getBuyableAmount(this.layer, 31).times(1).times(diff)
            let currentG6 = getBuyableAmount(this.layer, 23)
            setBuyableAmount(this.layer, 23, currentG6.add(g6Produced))
        }
        if(getBuyableAmount(this.layer, 23).gt(0)) {
            let g5Produced = getBuyableAmount(this.layer, 23).times(1).times(diff)
            let currentG5 = getBuyableAmount(this.layer, 22)
            setBuyableAmount(this.layer, 22, currentG5.add(g5Produced))
        }
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
            if(hasUpgrade("g", 22)) g1Produced = g1Produced.times(2)
            let currentG1 = getBuyableAmount(this.layer, 11)
            setBuyableAmount(this.layer, 11, currentG1.add(g1Produced))
        }
        if(getBuyableAmount(this.layer, 11).gt(0)) {
            let gpProduced = tmp.g.gpps.times(diff)
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
        },
        2: {
            requirementDescription: "5 Generators",
            effectDescription: "Unlocks another 2 Mega Point upgrades.",
            done() {return player.g.points.gte(5)}
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
            let gpps = tmp.g.gpps
            return "You're generating <h2 style = 'color: #3ee03e'>" + format(gpps) + "</h2> GP per second"
        }],
        "blank",
        "buyables",
    ],
    canBuyMax() {
        if(hasMilestone("f", 0)) return true
        return false
    },
    resetsNothing() {
        return hasMilestone("f", 3)
    },
    autoPrestige() {
        return player.g.auto && hasMilestone("f", 3)
    }
})

addLayer("e", {
    name: "Enhancers",
    symbol: "E",
    position: 2,
    branches: ["te", "ge"],
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
    exponent() {
        let exp = new Decimal(0.8)
        if(hasMilestone("t", 2)) exp = exp.sub(0.1)
        if(hasUpgrade("e", 14)) exp = exp.sub(0.1)
        return exp
    },
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade("t", 52)) mult = mult.times(upgradeEffect("t", 52))
        mult = mult.times(new Decimal(5).pow(player.tt.buyables[32]))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    enhancersToPoint() {
        let extra_en = new Decimal(0)
        if(hasUpgrade("e", 23)) extra_en = extra_en.add(1)
        if(hasUpgrade("b", 43)) extra_en = extra_en.add(getBuyableAmount("b", 21).times(2))
        return getBuyableAmount(this.layer, 11).add(extra_en).times(3).pow(1.4).ceil().add(1)
    },
    enhancersToGP() {
        let extra_en = new Decimal(0)
        if(hasUpgrade("e", 23)) extra_en = extra_en.add(1)
        if(hasUpgrade("b", 43)) extra_en = extra_en.add(getBuyableAmount("b", 21).times(2))
        return getBuyableAmount(this.layer, 11).add(extra_en).times(2).pow(1.3).ceil().add(1)
    },
    getEnhanceExp() {
        let exp = new Decimal(1)
        if(hasMilestone("e", 2)) exp = exp.sub(0.05)
        if(hasUpgrade("e", 11)) exp = exp.sub(0.05)
        if(hasUpgrade("b", 22)) exp = exp.sub(0.1)
        return exp
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
                let exp = tmp.e.getEnhanceExp
                return new Decimal(10).pow(buys.mul(exp))
            },
            display() {
                let extra_en = new Decimal(0)
                if(hasUpgrade("e", 23)) extra_en = extra_en.add(1)
                if(hasUpgrade("b", 43)) extra_en = extra_en.add(getBuyableAmount("b", 21).times(2))
                return "Owned:" + formatWhole(getBuyableAmount(this.layer, this.id)) + "+" + formatWhole(extra_en) + "\n"
                + "Cost:" + format(this.cost()) + " Points \n"
                + "Multiplying point gain by " + formatWhole(tmp.e.enhancersToPoint) + "x\n"
                + "Multiplying GP gain by " + formatWhole(tmp.e.enhancersToGP) + "x"
            },
            buy() {
                if(hasMilestone("e", 3)) this.buyMax()
                if(!hasMilestone("e", 3))
                    player.points = player.points.sub(this.cost())
                    player.e.buyables[11] = player.e.buyables[11].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buyMax() {
            if (!hasMilestone("e", 3)) return 
            if (player.points.lt(this.cost())) return 

            let exp = tmp[this.layer].getEnhanceExp
            let currentBuys = getBuyableAmount(this.layer, this.id)

            let logPoints = player.points.log10()
            let targetBuys = logPoints.div(exp).floor()
        
            if (targetBuys.gt(currentBuys)) {
                setBuyableAmount(this.layer, this.id, targetBuys)
                let totalCost = new Decimal(10).pow(targetBuys.sub(1).mul(exp))
                player.points = player.points.sub(totalCost).max(0)
            }
            while (player.points.gte(this.cost())) {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            unlocked() { return hasMilestone("e", 0)}
        },
        12: {
            title: "Point Enhancement",
            cost(x) {return x.pow(x.pow(x.divideBy(5))).add(1)
            },
            display() {return "Owned: " + formatWhole(player.e.buyables[12]) + "\nBrings point gain to the power ^" + format(player.e.buyables[12].divideBy(100).add(1)) + ".\nCost: " + format(this.cost()) + " points."
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.e.buyables[12] = player.e.buyables[12].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            unlocked() { return player.tt.buyables[11].gte(1) && hasMilestone("e", 0)}
        },
        13: {
            title: "Generator Enhancement",
            cost(x) {return (x.add(50)).pow(x.pow(x.pow(x)))
            },
            display() {return "Owned: " + formatWhole(player.e.buyables[13]) + "\nIncrease generator's GP effect by " + formatWhole(player.e.buyables[13]) + ".\nCost: " + format(this.cost()) + " points."
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.e.buyables[13] = player.e.buyables[13].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            unlocked() { return player.tt.buyables[11].gte(2) && hasMilestone("e", 0)}
        },
        21: {
            title: "Prestige Enhancement",
            cost(x) {return x.pow(x.pow(2))
            },
            display() {let ten = new Decimal(10)
                return "Owned: " + formatWhole(player.e.buyables[21]) + "\nGain " + formatWhole(ten.pow(player.e.buyables[21])) + "x More prestige points.\nCost: " + format(this.cost()) + " points."
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.e.buyables[21] = player.e.buyables[21].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            unlocked() { return player.tt.buyables[11].gte(3) && hasMilestone("e", 0)}
        },
        22: {
            title: "Synergism Enhancement",
            cost(x) {return x.pow(x.pow(3))
            },
            display() {
                return "Owned: " + formatWhole(player.e.buyables[22]) + "\n'Synergism' is " + format(player.e.buyables[22].divideBy(10).add(1)) + "x Stronger.\nCost: " + format(this.cost()) + " points."
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.e.buyables[22] = player.e.buyables[22].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            unlocked() { return player.tt.buyables[11].gte(4) && hasMilestone("e", 0)}
        },
        23: {
            title: "Better Point Enhancement",
            cost(x) {return x.pow(x.pow(x))
            },
            display() {
                return "Owned: " + formatWhole(player.e.buyables[23]) + "\n'Bring point gain to the power of ^" + format(player.e.buyables[23].divideBy(50).add(1)) + ".\nCost: " + format(this.cost()) + " points."
            },
            buy() {
                player.points = player.points.sub(this.cost())
                player.e.buyables[23] = player.e.buyables[23].add(1)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            unlocked() { return player.tt.buyables[11].gte(5) && hasMilestone("e", 0)}
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
        },
        3: {
            requirementDescription: "500 Enhancement Points",
            effectDescription: "You now buy max Enhancements.",
            done() {return player.e.points.gte(500)}
        },
        4: {
            requirementDescription: "1e10 Enhancement Points",
            effectDescription: "Unlocks Gears node and multiplies point gain by 5x.",
            done() {return player.e.points.gte("1e10")}
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
            title: "And a little extra",
            description: "Enhancement Points are slightly easier to get. Doubles point gain.",
            cost() {return new Decimal("1e6")}
        },
        21: {
            title: "Booster market crash",
            description: "Boosters are SIGNIFICANTLY cheaper.",
            cost: new Decimal("1e7")
        },
        22: {
            title: "Absurdly powerful generators",
            description: "Generators now multiply GP gain by 3x instead of 2x.",
            cost: new Decimal("5e9")
        },
        23: {
            title: "Technology Wins.",
            description: "Unlock the Technological Advancements node. Also get a free enhancement.",
            cost: new Decimal("1e10")
        },
        24: {
            title: "Mega Win for the Mega Points.",
            description: "Mega point resets no longer reset anything.",
            cost: new Decimal("1e12")
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
    ],
    resetsNothing() { return hasUpgrade("p", 23)}
})

addLayer("t" , {
    name: "Time",
    symbol: "T",
    position: 3,
    branches: ["te", "tt"],
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
        mult = mult.times(new Decimal(10).pow(getBuyableAmount("tt", 13)))
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
                let exp = new Decimal(0.05)
                if(hasMilestone("te", 2)) exp = exp.add(0.2)
                if(hasUpgrade("t", 63)) exp = exp.add(0.05)
                return player.points.add(1).root(10).pow(0.3).pow(exp).add(1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        13: {
            title: "Time Lab",
            description: "Unlock the Time Lab inside the Time node. Also 2x point gain.",
            cost: new Decimal(1000)
        },
        21: {
            title: "Shattered Crystals",
            description: "Time Crystals boost Time Shard gain.",
            cost: new Decimal(1),
            effect() {
                return player.t.tc.add(1).pow(0.15)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"},
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
        },
        41: {
            title: "Shards of infinity",
            description: "Time Shards boost point generation.",
            cost: new Decimal("1e35"),
            unlocked() {return hasMilestone("te", 0)},
            effect() {return player.t.points.add(1).times(0.01).root(5).root(4).divideBy(3).add(1)},
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        42: {
            title: "Bring me back in time",
            description: "Time Shards and Time Crystals boost MP gain.",
            cost: new Decimal("1e40"),
            unlocked() {return hasMilestone("te", 0)},
            effect() {return player.t.points.times(player.t.tc).divideBy(100).root(10).add(1)},
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        43: {
            title: "Liquified Time",
            description: "1000x Point gain. Surprisingly, this doesn't break the game.",
            cost: new Decimal("1e65"),
            unlocked() {return hasMilestone("te", 0)}
        },
        51: {
            title: "QoL for the win!",
            description: "make 100x TC per purchase. Cost scales accordingly.",
            cost: new Decimal(50),
            unlocked() {return hasMilestone("te", 0)},
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t"
        },
        52: {
            title: "Shining Bright",
            description: "Time Crystals boost Enhancement point gain.",
            cost: new Decimal(5000),
            unlocked() {return hasMilestone("te", 0)},
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t",
            effect() {return player.t.tc.times(0.01).root(2).root(2).divideBy(5).add(1)},
            effectDisplay() { return format((upgradeEffect(this.layer, this.id))) + "x"}
        },
        53: {
            title: "Fractured Crystals",
            description: "Time Crystals boost point generation again.",
            cost: new Decimal(20000),
            unlocked() {return hasMilestone("te", 0)},
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t",
            effect() {return player.t.tc.add(1).pow(0.25).divideBy(1.2)},
            effectDisplay() {return format((upgradeEffect(this.layer, this.id))) + "x"}
        },
        61: {
            title: "Efficiency V",
            description: "Generate 100x more TC per purchase. Cost scales accordingly.",
            cost() {return new Decimal(5000)},
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t",
            unlocked() {return hasMilestone("te", 2)}
        },
        62: {
            title: "Powers!",
            description: "Brings point gain to the power of ^1.1.",
            cost() {return new Decimal("5e5")},
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t",
            unlocked() {return hasMilestone("te", 2)}
        },
        63: {
            title: "Can't the future just wait?",
            description: "'Timeback synergism' is stronger.",
            cost() {return new Decimal("2e6")},
            currencyDisplayName: "Time Crystals",
            currencyInternalName: "tc",
            currencyLayer: "t",
            unlocked() {return hasMilestone("te", 2)}
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 Time Shard",
            effectDescription: "Triples point gain.",
            done() {return player.t.points.gte(1)}
        },
        1: {
            requirementDescription: "500 Time Shards",
            effectDescription: "You can buy multiple boosters at once.",
            done() {return player.t.points.gte(500)}
        },
        2: {
            requirementDescription: "5,000 Time Shards",
            effectDescription: "Enhancement Points are slightly easier to get.",
            done() {return player.t.points.gte(5000)}
        },
        3: {
            requirementDescription: "12,500 Time Shards",
            effectDescription: "Booster resets no longer reset anything.",
            done() {return player.t.points.gte(12500)}
        },
        4: {
            requirementDescription: "25,000 Time Shards",
            effectDescription: "Unlock auto-boosters",
            done() {return player.t.points.gte(25000)},
            toggles: [["b", "auto"]]
        },
        5: {
            requirementDescription: "1e30 Time Shards",
            effectDescription: "Unlock Time Travel node and multiply point gain by 10x.",
            done() {return player.t.points.gte("e30")}
        }
    },
    buyables: {
        11: {
            title: "Make a Time Crystal",
            cost(x) {
                let pur = new Decimal(1500)
                if(hasUpgrade("t", 51)) pur = pur.times(100)
                if(hasUpgrade("t", 61)) pur = pur.times(100)
                return pur
            },
            display() {
                let adder = new Decimal(1)
                if(hasUpgrade("t", 51)) adder = adder.times(100)
                if(hasUpgrade("t", 61)) adder = adder.times(100)
                return "Cost: " + formatWhole(this.cost()) + " Time Shards" + "\nProduces " +format(adder) + " Time Crystals"
            },
            buy() {
                let adder = new Decimal(1)
                if(hasUpgrade("t", 51)) adder = adder.times(100)
                if(hasUpgrade("t", 61)) adder = adder.times(100)
                player.t.points = player.t.points.sub(this.cost())
                player.t.tc = player.t.tc.add(adder)
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
                ["upgrades", [1,3,4]]
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
                ["upgrades", [2,5,6]]
            ],
            unlocked() {
                if(hasUpgrade("t", 13)) return true
                return false
            }
        }
    },
    resetsNothing() { return hasUpgrade("p", 23)}
})

addLayer("f" , {
    name: "Factories",
    symbol: "F",
    branches: ["ge", "w"],
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        ap: new Decimal(0)
    }},
    color: "#c45903",
    requires: new Decimal(100000000),
    resource: "Factory Energy",
    baseResource: "GP",
    baseAmount () { return player.g.gp},
    type: "normal",
    exponent: 0.3,
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
    },
    apps() {
        let apProduced = new Decimal(10).times(getBuyableAmount("f", 11))
        if(hasMilestone("te", 0)) apProduced = apProduced.times(2)
        if(hasUpgrade("f", 14)) apProduced = apProduced.times(10)
        if(hasMilestone("f", 2)) apProduced = apProduced.times(5)
        if(hasUpgrade("f", 24)) apProduced = apProduced.pow(2)
        return apProduced
    },
    buyables: {
        11: {
            title: "Arc Generator 1",
            cost(x) {return new Decimal(1)},
            display() {
                if(getBuyableAmount("f", 11).gt(0)) {
                    return "Generates 10 Arc Power per second. \n" +
                    "Owned:" + formatWhole(player.f.buyables[11]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 10 Arc Power per second. \n" +
                "Owned:" + formatWhole(player.f.buyables[11]) + "\n" +
                "Cost:" + format(this.cost()) + " Factory Energy"  
            },
            buy() {
                player.f.points = player.f.points.sub(this.cost())
                player.f.buyables[11] = player.f.buyables[11].add(1)
            },
            canAfford() {
                let reachedMaxF = getBuyableAmount("f", 11).gte(1)
                return player.f.points.gte(this.cost()) && !reachedMaxF
            },
            unlocked() {
                return player.f.unlocked
            },
            purchaseLimit() {return new Decimal(1)}
        },
        12: {
            title: "Arc Generator 2",
            cost(x) {return new Decimal(5)},
            display() {
                if(getBuyableAmount("f", 12).gt(0)) {
                    return "Generates 1 Arc Generator 1 per second. \n" +
                    "Owned:" + formatWhole(player.f.buyables[12]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Arc Generator 1 per second. \n" +
                "Owned:" + formatWhole(player.f.buyables[12]) + "\n" +
                "Cost:" + format(this.cost()) + " Factory Energy"       
            },
            buy() {
                player.f.points = player.f.points.sub(this.cost())
                player.f.buyables[12] = player.f.buyables[12].add(1)
            },
            canAfford() {
                let reachedMaxF2 = getBuyableAmount("f", 12).gte(1)
                return player.f.points.gte(this.cost()) && !reachedMaxF2
            },
            unlocked() {
                return getBuyableAmount("f", 11).gte(1)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        13: {
            title: "Arc Generator 3",
            cost(x) {return new Decimal(150)},
            display() {
                if(getBuyableAmount("f", 13).gt(0)) {
                    return "Generates 1 Arc Generator 2 per second. \n" +
                    "Owned:" + formatWhole(player.f.buyables[13]) + "\n" +
                    "UNLOCKED"
                }
                return "Generates 1 Arc Generator 2 per second. \n" +
                "Owned:" + formatWhole(player.f.buyables[13]) + "\n" +
                "Cost:" + format(this.cost()) + " Factory Energy"       
            },
            buy() {
                player.f.points = player.f.points.sub(this.cost())
                player.f.buyables[13] = player.f.buyables[13].add(1)
            },
            canAfford() {
                let reachedMaxF3 = getBuyableAmount("f", 13).gte(1)
                return player.f.points.gte(this.cost()) && !reachedMaxF3
            },
            unlocked() {
                return getBuyableAmount("f", 12).gte(1)
            },
            purchaseLimit() {return new Decimal(1)}
        }
    },
    aptogp() {
        let exp = new Decimal(1)
        if(hasUpgrade("f", 24)) exp = exp.add(1)
        return player.f.ap.root(2).add(1).log(2).divideBy(2).add(1).pow(exp)
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
        ["display-text", function() {
            return "You have <h2 style = 'color: #c45903'>" + formatWhole(player.f.ap) + "</h2> Arc Power, Which multiplies GP gain by <h2>" + format(tmp.f.aptogp) + "</h2>x."
        }],
        ["display-text", function() {
            let apps = new Decimal(tmp.f.apps)
            return "You are generating <h2 style = 'color: #c45903'>" + format(apps) + "</h2> Arc Power per second."
        }],
        "blank",
        "buyables",
    ],
    update(diff) {
        if(getBuyableAmount("f", 13).gte(1)) {
            let ag2Produced = new Decimal(1).times(getBuyableAmount("f", 13)).times(diff)
            player.f.buyables[12] = player.f.buyables[12].add(ag2Produced)
        }     
        if(getBuyableAmount("f", 12).gte(1)) {
            let ag1Produced = new Decimal(1).times(getBuyableAmount("f", 12)).times(diff)
            player.f.buyables[11] = player.f.buyables[11].add(ag1Produced)
        }
        if(getBuyableAmount("f", 11).gte(1)) {
            let apProduced = new Decimal(tmp.f.apps).times(diff)
            player.f.ap = player.f.ap.add(apProduced)
        }
    },
    upgrades: {
        11: {
            title: "I NEED GP",
            description: "20x GP gain. You happy now?",
            cost() {return new Decimal(50)}
        },
        12: {
            title: "I WANT BETTER GP",
            description: "GP boosts points more.",
            cost() {return new Decimal(250)}
        },
        13: {
            title: "OK I AM HAPPY NOW",
            description: "Doubles point gain. Hopefully this makes you remain happy.",
            cost() {return new Decimal(500)}
        },
        14: {
            title: "GET ME WORKFORCE",
            description: "Unlocks Workers node. Multiplies AP and GP gain by 10x!",
            cost() {return new Decimal(10000)}
        },
        21: {
            title: "GP FUELS ME",
            description: "Brings GP gain to the power of ^1.1.",
            cost() {return new Decimal(150000)}
        },
        22: {
            title: "BUY BUY BUY",
            description: "Generators are cheaper.",
            cost() {return new Decimal("1e6")}
        },
        23: {
            title: "GENERATOR 8",
            description: "unlocks generator 8.",
            cost() {return new Decimal("1e45")}
        },
        24: {
            title: "OH YEAH AP ALSO EXISTS",
            description: "Bring AP generation and effect to the power of ^2.",
            cost() {return new Decimal("1e100")}
        }
    },
    milestones: {
        0: {
            requirementDescription: "10 Factory energy",
            effectDescription: "Lets you buy multiple generators at once. QoL for the win!",
            done() {return player.f.points.gte(10)}
        },
        1: {
            requirementDescription: "400 Factory energy",
            effectDescription: "Unlocks Generator 6",
            done() {return player.f.points.gte(400)}
        },
        2: {
            requirementDescription: "1,000,000 Factory energy",
            effectDescription: "Unlocks Generator 7 and multiply AP gain by 5x.",
            done() {return player.f.points.gte(1000000)}
        },
        3: {
            requirementDescription: "10,000,000 Factory Energy",
            effectDescription: "Unlock auto-generators. Also, Generators reset nothing!",
            done() {return player.f.points.gte("1e7")},
            toggles: [["g", "auto"]]
        },
        4: {
            requirementDescription: "1e13,000 Factory Energy",
            effectDescription: "Unlocks Generator 9. The final Generator...",
            done() {return player.f.points.gte("1e13000")}
        }
    },
    resetsNothing() { return hasUpgrade("p", 23)}
}),

addLayer("te" , {
    name: "Technological Advancements",
    symbol: "Ta",
    position: 3,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#817f7d",
    requires: new Decimal(5),
    resource: "Technological Advancements",
    baseResource: "Enhancement Points",
    baseAmount () { return player.e.points},
    type: "static",
    exponent() {
        let exp = new Decimal(4)
        if(player.te.points.gte(4)) exp = exp.add(1)
        exp = exp.sub(player.tt.buyables[23].times(0.05))
        return exp
    },
    gainMult() {
        mult = new Decimal("1e10")
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    layerShown() {
        if(hasUpgrade("e", 23) || player.te.unlocked) return true
        return false
    },
    milestones: {
        0: {
            requirementDescription: "1 Technological Advancement",
            effectDescription: "Multiply GP, AP and Point gain by 2x. Also unlocks 3 new Generator, Booster, Time and Time lab upgrades.",
            done() {return player.te.points.gte(1)}
        },
        1: {
            requirementDescription: "2 Technological Advancements",
            effectDescription: "'Synergism' is stronger.",
            done() {return player.te.points.gte(2)}
        },
        2: {
            requirementDescription: "3 Technological Advancements",
            effectDescription: "'Timeback synergism' is stronger. Unlocks 3 new time lab upgrades.",
            done() {return player.te.points.gte(3)}
        },
        3: {
            requirementDescription: "4 Technological Advancements",
            effectDescription: "Unlock Super-Boosters and Super-Generators.",
            done() {return player.te.points.gte(4)}
        },
        4: {
            requirementDescription: "5 Technological Advancements",
            effectDescription: "Unlock Research and Honor.",
            done() {return player.te.points.gte(5)}
        }
    }
}),

addLayer("tt" , {
    name: "Time Travel",
    symbol: "Tt",
    position: 4,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#3cff00",
    requires: new Decimal("e30"),
    resource: "seconds of pure time",
    baseResource: "Time Shards",
    baseAmount () { return player.t.points},
    type: "normal",
    exponent: 0.4,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    layerShown() {
        if(hasMilestone("t", 5) || player.tt.unlocked) return true
        return false
    },
    buyables: {
        11: {
            title: "3 -- Enhanced time",
            cost(x) {return new Decimal(5).pow(x)},
            display() { if(getBuyableAmount("tt", 11).gte(5)) return "Unlocks 5 new Enhancement types. \nMAXED"
                return "Unlocks " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Enhancement types. \n Cost: " + format(this.cost()) + " Seconds of PT."},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[11] = player.tt.buyables[11].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(5)}
        },
        12: {
            title: "6 -- Time flow",
            cost(x) {return new Decimal(10000)},
            display() {return "PT increases point gain by " + format(player.tt.points.root(10).pow(0.3).log(2).add(5)) + "x. \nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[12] = player.tt.buyables[12].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        13: {
            title: "9 -- Traveling forwards",
            cost(x) {return new Decimal(100000).pow(x.divideBy(2))},
            display() {return "Time shard gain is multiplied by " + formatWhole(new Decimal(10).pow(player.tt.buyables[13])) + "x. \nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[13] = player.tt.buyables[13].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(25)}
        },
        21: {
            title: "24 -- Mastery",
            cost(x) {return new Decimal("e1e5")},
            display() {return "Unlocks mastery.\nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[21] = player.tt.buyables[21].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(1)}
        },
        22: {
            title: "The clock",
            cost(x) {return new Decimal(1)},
            display() {return "Unlock 8 Time clock buyables."},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[22] = player.tt.buyables[22].add(1)
            },
            canAfford() {
                return player.tt.points.gte(1)
            },
            unlocked() {
                return (player.tt.points.gte(1) || player.tt.buyables[22].gte(1))
            },
            purchaseLimit() {return new Decimal(1)},
            branches: [11, 12, 13, 21, 23, 31, 32, 33]
        },
        23: {
            title: "12 -- Modernization",
            cost(x) {return new Decimal("1e10").pow(x.add(1))},
            display() {return "Reduces Technological advancement exponent by " + format(player.tt.buyables[23].times(0.05)) + ".\nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[23] = player.tt.buyables[23].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(4)}
        },
        31: {
            title: "21 -- Point power",
            cost(x) {return new Decimal("1e10000").pow(x.add(1))},
            display() {return "Brings point gain to the power of ^" + format(player.tt.buyables[31].times(0.01).add(1)) + ".\nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[31] = player.tt.buyables[31].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(20)}
        },
        32: {
            title: "18 -- Simpler Enhancements",
            cost(x) {return new Decimal("1e5").pow(x.add(1)).pow(x)},
            display() {return "Gain " + format(new Decimal(5).pow(player.tt.buyables[32])) + "x more Enhancement points.\nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[32] = player.tt.buyables[32].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(50)}
        },
        33: {
            title: "15 -- Reduced hiring costs",
            cost(x) {return new Decimal("1e100").pow(x.add(1))},
            display() {return "Reduces worker exponent by " + format(player.tt.buyables[33].times(0.1)) + ".\nCost: " + format(this.cost())},
            buy() {
                player.tt.points = player.tt.points.sub(this.cost())
                player.tt.buyables[33] = player.tt.buyables[33].add(1)
            },
            canAfford() {
                return player.tt.points.gte(this.cost())
            },
            unlocked() {
                return player.tt.buyables[22].gte(1)
            },
            purchaseLimit() {return new Decimal(10)}
        },
    }
}),

addLayer("ge" , {
    name: "Gears",
    symbol: "Ge",
    position: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rv: new Decimal(0)
    }},
    color: "#b2bbb0",
    requires: new Decimal("e30"),
    resource: "Gears",
    baseResource: "Enhancement points",
    baseAmount () { return player.e.points},
    type: "static",
    exponent() { if(hasUpgrade("ge", 12)) return new Decimal(3.5)
    return new Decimal(4) },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    layerShown() {
        if(hasMilestone("e", 4) || player.ge.unlocked) return true
        return false
    },
    canBuyMax() {return false},
    buyables: {
        11: {
            title: "Kinetic Energy",
            cost(x) {
                return new Decimal(0.01).times(player.ge.buyables[11].times(5).add(1).pow(player.ge.buyables[11]))
            },
            display() {
                let deci = new Decimal(0.001)
                let mult = new Decimal(2)
                return "Doubles kinetic energy, which means the last gear spins twice as fast.\nCurrently: " + format(deci.times(mult.pow(player.ge.buyables[11]))) + " rotations per second.\nCost: " + format(this.cost()) + " revolutions"},
            canAfford() {
                return player.ge.rv.gte(this.cost())
            },
            buy() {
                player.ge.rv = player.ge.rv.sub(this.cost())
                player.ge.buyables[11] = player.ge.buyables[11].add(1)
            },
            unlocked() {return player.ge.unlocked}
        },
        12: {
            title: "Gear Teeth",
            cost(x) {
                return new Decimal(0.01).times(player.ge.buyables[12].times(5).add(1).pow(player.ge.buyables[12]))
            },
            display() {return "Adds an extra tooth to the gear, so you gain more revolutions.\nCurrently: " + format(player.ge.buyables[12].add(10)) + " gear teeth.\nCost: " + format(this.cost()) + " revolutions"},
            canAfford() {
                return player.ge.rv.gte(this.cost())
            },
            buy() {
                player.ge.rv = player.ge.rv.sub(this.cost())
                player.ge.buyables[12] = player.ge.buyables[12].add(1)
            },
            unlocked() {return player.ge.unlocked}
        },
    },
    update(diff){
        if(player.ge.points.gte(1)) {
            let rvps = new Decimal(1).times(diff)
            let gearteeth = getBuyableAmount("ge", 12).add(10)
            let three = new Decimal(3)
            let gears = new Decimal(player.ge.points.sub(1))
            if(hasUpgrade("ge", 11)) gearteeth = gearteeth.add(three)
            if(hasUpgrade("ge", 21)) gearteeth = gearteeth.add(3)
            if(hasUpgrade("ge", 23)) gearteeth = gearteeth.add(4)
            let kepow = new Decimal(2)
            if(hasUpgrade("ge", 22)) kepow = kepow.add(1)
            let ke = new Decimal(0.001)
            let kebought = new Decimal(player.ge.buyables[11])
            let freeke = new Decimal(0)
            if(hasUpgrade("ge", 13)) freeke = freeke.add(1)
            rvps  = rvps.times(gearteeth.pow(gears)).times(ke.times(kepow.pow(kebought.add(freeke))))
            if(player.ge.points.lt(1)) rvps = 0
            player.ge.rv = player.ge.rv.add(rvps)
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", function() {
            return "You have <h2 style = 'color: #b2bbb0'>" + format(player.ge.rv) + "</h2> Revolutions"
        }],
        "blank",
        ["display-text", function() {
            let rvps = new Decimal(1)
            let gearteeth = getBuyableAmount("ge", 12).add(10)
            let gears = new Decimal(player.ge.points.sub(1))
            if(hasUpgrade("ge", 11)) gearteeth = gearteeth.add(3)
            if(hasUpgrade("ge", 21)) gearteeth = gearteeth.add(3)
            if(hasUpgrade("ge", 23)) gearteeth = gearteeth.add(4)
            let kepow = new Decimal(2)
            if(hasUpgrade("ge", 22)) kepow = kepow.add(1)
            let ke = new Decimal(0.001)
            let kebought = new Decimal(player.ge.buyables[11])
            let freeke = new Decimal(0)
            if(hasUpgrade("ge", 13)) freeke = freeke.add(1)
            rvps  = rvps.times(gearteeth.pow(gears)).times(ke.times(kepow.pow(kebought.add(freeke))))
            if(player.ge.points.lt(1)) rvps = 0
            return "You are generating <h2 style = 'color: #b2bbb0'>" + format(rvps) + "</h2> Revolutions per second"
        }],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],
    upgrades: {
        11: {
            title: "More teeth",
            description: "Adds 3 more teeth to the gears.",
            cost: new Decimal(1),
            currencyDisplayName: "Revolution",
            currencyInternalName: "rv",
            currencyLayer: "ge"
        },
        12: {
            title: "Cheap gears",
            description: "Gears are slightly cheaper to buy.",
            cost: new Decimal(5),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge"
        },
        13: {
            title: "Green Energy",
            description: "Gain a free KE upgrade.",
            cost: new Decimal(10),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge"
        },
        14: {
            title: "That's what we are here for!",
            description: "Revolutions boost point gain.",
            cost: new Decimal(25),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge",
            effect() {
                return player.ge.rv.add(1).pow(3).log(6).add(1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        15: {
            title: "BIG BOOST",
            description: "Revolutions/second boost point gain.",
            cost: new Decimal(150),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge",
            effect() {
                let rvps = new Decimal(1)
                let gearteeth = getBuyableAmount("ge", 12).add(10)
                let three = new Decimal(3)
                let gears = new Decimal(player.ge.points.sub(1))
                if(hasUpgrade("ge", 11)) gearteeth = gearteeth.add(three)
                if(hasUpgrade("ge", 21)) gearteeth = gearteeth.add(3)
                if(hasUpgrade("ge", 23)) gearteeth = gearteeth.add(4)
                let kepow = new Decimal(2)
                if(hasUpgrade("ge", 22)) kepow = kepow.add(1)
                let ke = new Decimal(0.001)
                let kebought = new Decimal(player.ge.buyables[11])
                let freeke = new Decimal(0)
                if(hasUpgrade("ge", 13)) freeke = freeke.add(1)
                rvps  = rvps.times(gearteeth.pow(gears)).times(ke.times(kepow.pow(kebought.add(freeke))))
                return rvps.add(1).pow(0.2).root(2).add(1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        21: {
            title: "Call a dentist!",
            description: "Add another 3 teeth to the gears.",
            cost: new Decimal(1500),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge"
        },
        22: {
            title: "Energy Mastery I",
            description: "KE upgrades now triple cog speed.",
            cost: new Decimal(100000),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge"
        },
        23: {
            title: "Your heart's got TEETH",
            description: "Add 4 teeth to your gears.",
            cost: new Decimal("1e7"),
            currencyDisplayName: "Revolutions",
            currencyInternalName: "rv",
            currencyLayer: "ge"
        }
    }
}),

addLayer("w" , {
    name: "Workers",
    symbol: "W",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#ecb316",
    requires: new Decimal("e6"),
    resource: "Workers",
    baseResource: "Factory Energy",
    baseAmount () { return player.f.points},
    type: "static",
    exponent() {
        let exp = new Decimal(3)
        exp = exp.sub(player.tt.buyables[33].times(0.1))
        return exp
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    getWorkersSpent() {
        return new Decimal(getBuyableAmount("w", 11).add(getBuyableAmount("w", 12).add(getBuyableAmount("w", 13)).add(getBuyableAmount("w", 21))).add(getBuyableAmount("w", 22)).add(getBuyableAmount("w", 23)))
    },
    getWorkerAmt() {
        return new Decimal(player.w.points.sub(tmp.w.getWorkersSpent))
    },
    row: 3,
    layerShown() {
        if(hasUpgrade("f", 14) || player.w.unlocked) return true
        return false
    },
    onReset() {this.getWorkerAmt()},
    canBuyMax() {return true},
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["display-text" , function() {
            return "You have " + formatWhole(tmp.w.getWorkerAmt) + " Workers to spend."
        }],
        "milestones",
        "blank",
        "buyables"
    ],
    buyables: {
        11: {
            title: "Points Co.",
            cost(x) {return new Decimal(1)},
            display() {
                let thing = new Decimal(10)
                return "You have " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Workers here.\nThis means you gain " + formatWhole(thing.pow(getBuyableAmount(this.layer, this.id))) + "x times more points."
            },
            buy() {
                player.w.buyables[11] = player.w.buyables[11].add(1)
            },
            canAfford() {return tmp.w.getWorkerAmt.gte(1)}
        },
        12: {
            title: "Liquidized Boosters Inc.",
            cost(x) {return new Decimal(1)},
            display() {
                let two = new Decimal(2)
                return "You have " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Workers here.\nThis means you gain " + formatWhole(two.pow(getBuyableAmount(this.layer, this.id))) + "x times more Booster Liquid."
            },
            buy() {
                player.w.buyables[12] = player.w.buyables[12].add(1)
            },
            canAfford() {return tmp.w.getWorkerAmt.gte(1)}
        },
        13: {
            title: "Thing 3",
            cost(x) {return new Decimal(1)},
            display() {
                return "You have " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Workers here."
            },
            buy() {
                player.w.buyables[13] = player.w.buyables[13].add(1)
            },
            canAfford() {return tmp.w.getWorkerAmt.gte(1)}
        },
        21: {
            title: "Thing 4",
            cost(x) {return new Decimal(1)},
            display() {
                return "You have " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Workers here."
            },
            buy() {
                player.w.buyables[21] = player.w.buyables[21].add(1)
            },
            canAfford() {return tmp.w.getWorkerAmt.gte(1)}
        },
        22: {
            title: "Thing 5",
            cost(x) {return new Decimal(1)},
            display() {
                return "You have " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Workers here."
            },
            buy() {
                player.w.buyables[22] = player.w.buyables[22].add(1)
            },
            canAfford() {return tmp.w.getWorkerAmt.gte(1)}
        },
        23: {
            title: "Thing 6",
            cost(x) {return new Decimal(1)},
            display() {
                return "You have " + formatWhole(getBuyableAmount(this.layer, this.id)) + " Workers here."
            },
            buy() {
                player.w.buyables[23] = player.w.buyables[23].add(1)
            },
            canAfford() {return tmp.w.getWorkerAmt.gte(1)}
        },
        31: {
            title: "Reset all Workers.",
            cost(x) {return new Decimal(0)},
            display() {return "Gives you back all your workers.\nResets your points to 0."},
            buy() {
                player.w.buyables[11] = new Decimal(0)
                player.w.buyables[12] = new Decimal(0)
                player.w.buyables[13] = new Decimal(0)
                player.w.buyables[21] = new Decimal(0)
                player.w.buyables[22] = new Decimal(0)
                player.w.buyables[23] = new Decimal(0)
                player.points = new Decimal(0)
            },
            canAfford() {return true}
        }
    }
}),

addLayer("sb", {
    name: "Super Boosters",
    symbol: "SB",
    position: 4,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#7b83f7",
    requires: new Decimal(20),
    resource: "Super Boosters",
    baseResource: "Boosters",
    baseAmount() {return player.b.points},
    type: "static",
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    layerShown() {
        if(hasMilestone("te", 3)) return true
        return false
    },
    effect() {
        let base_eff = new Decimal(0.1)
        let ret_eff = new Decimal(0)
        ret_eff = ret_eff.add(base_eff.times(player.sb.points))
        return ret_eff
    },
    blEffect() {
        let base_eff = new Decimal(10)
        let ret_eff = new Decimal(1)
        ret_eff = ret_eff.times(base_eff.times(player.sb.points))
        if(player.sb.points.lt(1)) ret_eff = 1
        return ret_eff
    },
    pointEff() {
        let base_eff = new Decimal(0.01)
        if(hasUpgrade("p", 24)) base_eff = base_eff.times(2)
        let ret_eff = new Decimal(1)
        ret_eff = ret_eff.add(base_eff.times(player.sb.points))
        return ret_eff
    },
    effectDescription() { return "Which are:"},
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Adding +" + format(tmp.sb.effect) + " To the base effect of boosters"
        }],
        ["display-text", function() {
            return "Multiplying Booster Liquid gain by " + format(tmp.sb.blEffect) + "x"
        }],
        ["display-text", function() {
            return "And bringing point gain to the power of ^" + format(tmp.sb.pointEff) + "."
        }],
        "blank",
        "prestige-button",
        "resource-display",
        "blank",
    ],
    resetsNothing() {return hasUpgrade("p", 23)}
}),

addLayer("sg", {
    name: "Super Generators",
    symbol: "SG",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    color: "#98cf9b",
    requires: new Decimal(8),
    resource: "Super Generators",
    baseResource: "Generators",
    baseAmount() {return player.g.points},
    type: "static",
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    layerShown() {
        if(hasMilestone("te", 3)) return true
        return false
    },
    effect() {
        let base_eff = new Decimal(1)
        let ret_eff = new Decimal(1)
        ret_eff = ret_eff.add(base_eff.times(player.sg.points))
        return ret_eff
    },
    gpEff() {
        let base_eff = new Decimal(100)
        let ret_eff = new Decimal(1)
        ret_eff = ret_eff.times(base_eff.pow(player.sg.points))
        return ret_eff
    },
    pointEff() {
        let base_eff = new Decimal(0.01)
        if(hasUpgrade("p", 24)) base_eff = base_eff.times(2)
        let ret_eff = new Decimal(1)
        ret_eff = ret_eff.add(base_eff.times(player.sg.points))
        return ret_eff
    },
    effectDescription() {return "Which are:"},
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Bringing the GP point effect to the power of ^" + format(tmp.sg.effect) + ""
        }],
        ["display-text", function() {
            return "Multiplying GP gain by " + format(tmp.sg.gpEff) + "x"
        }],
        ["display-text", function() {
            return "And bringing point gain to the power of ^" + format(tmp.sg.pointEff) + "."
        }],
        "blank",
        "prestige-button",
        "resource-display",
        "blank",
    ],
    resetsNothing() {return hasUpgrade("p", 23)}
})

