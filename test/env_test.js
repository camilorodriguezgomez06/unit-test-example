const assert = require('node:assert');
const {test, describe, it} = require("node:test")

const { 
    tiMonth, 
    fuelEnergySelector, 
    fuelConsumption, 
    combustionConsumption, 
    electricalConsumption,
    costElectricalKM,
    fuelEfficiency,
    fuelCostKm,
    energyKm,
    emisionKm,
    savedEnergy,
    avoidedEmissions,
    monthlySavings,
    annualSavings,
    youngTree,
    oldTree,
    energyH2Cylinders,
    energyH2LowPresure,
    energyConsumed,
    hydrogenMass,
    litersRequired
} = require("../calculators/environment")

describe("Environment Calculations", () => {

    // PRUEBAS: tiMonth
    describe("tiMonth - Tasa de interés mensual", () => {
        
        it("debe calcular correctamente la tasa mensual para un IPC de 12%", () => {
            const result = tiMonth(12)
            assert.strictEqual(typeof result, 'number')
            assert.ok(result > 0)
            assert.ok(result < 0.02) // Aproximadamente 0.0095
        })

        it("debe calcular correctamente la tasa mensual para un IPC de 6%", () => {
            const result = tiMonth(6)
            assert.strictEqual(typeof result, 'number')
            const expected = (Math.pow(1 + (6/100), 1/12) - 1)
            assert.strictEqual(result, expected)
        })
    })

    // PRUEBAS: fuelEnergySelector
    describe("fuelEnergySelector - Selector de combustible", () => {
        
        it("debe retornar información correcta para diesel", () => {
            const result = fuelEnergySelector('diesel')
            assert.strictEqual(result.fuel_price, 11795)
            assert.strictEqual(result.fuel_energy, 40.7)
            assert.strictEqual(result.emision_factor, 74.01)
        })

        it("debe retornar información correcta para Diesel (mayúscula)", () => {
            const result = fuelEnergySelector('Diesel')
            assert.strictEqual(result.fuel_price, 11795)
            assert.strictEqual(result.fuel_energy, 40.7)
        })

        it("debe retornar información correcta para gasoline", () => {
            const result = fuelEnergySelector('gasoline')
            assert.strictEqual(result.fuel_price, 16700)
            assert.strictEqual(result.fuel_energy, 35.58)
            assert.strictEqual(result.emision_factor, 69.25)
        })

        it("debe retornar información correcta para Gasoline (mayúscula)", () => {
            const result = fuelEnergySelector('Gasoline')
            assert.strictEqual(result.fuel_price, 16700)
        })

        it("debe retornar información correcta para ambos tipos", () => {
            const diesel = fuelEnergySelector('diesel')
            const gasoline = fuelEnergySelector('gasoline')
            assert.ok(diesel.fuel_energy > 0)
            assert.ok(gasoline.fuel_energy > 0)
        })
    })

    // PRUEBAS: electricalConsumption
    describe("electricalConsumption - Consumo eléctrico", () => {
        
        it("debe calcular correctamente el consumo eléctrico", () => {
            const result = electricalConsumption(100, 500)
            assert.strictEqual(typeof result, 'number')
            assert.ok(result > 0)
            const expected = 100 / (500 * 0.9)
            assert.strictEqual(result, expected)
        })

        it("debe calcular correctamente con valores reales", () => {
            const result = electricalConsumption(350, 400)
            const expected = 350 / (400 * 0.9)
            assert.strictEqual(result, expected)
        })
    })

    // PRUEBAS: costElectricalKM
    describe("costElectricalKM - Costo eléctrico por km", () => {
        
        it("debe calcular el costo por km correctamente", () => {
            const consumption = 0.5
            const price = 200
            const result = costElectricalKM(consumption, price)
            assert.strictEqual(result, 100)
        })

        it("debe retornar un número", () => {
            const result = costElectricalKM(0.3, 150)
            assert.strictEqual(typeof result, 'number')
            assert.strictEqual(result, 45)
        })

        it("debe calcular con diferentes valores", () => {
            const result = costElectricalKM(1, 100)
            assert.strictEqual(result, 100)
        })
    })

    // PRUEBAS: combustionConsumption
    describe("combustionConsumption - Consumo de combustión", () => {
        
        it("debe calcular el consumo de combustión correctamente", () => {
            const result = combustionConsumption(0.27)
            assert.strictEqual(result, 1)
        })

        it("debe dividir por 0.27", () => {
            const result = combustionConsumption(0.54)
            assert.strictEqual(result, 2)
        })

        it("debe manejar valores decimales", () => {
            const result = combustionConsumption(1.35)
            assert.strictEqual(result, 5)
        })
    })

    // PRUEBAS: fuelConsumption
    describe("fuelConsumption - Consumo de combustible", () => {
        
        it("debe calcular el consumo de combustible", () => {
            const result = fuelConsumption(40.7, 40.7)
            assert.strictEqual(result, 1)
        })

        it("debe dividir correctamente", () => {
            const result = fuelConsumption(81.4, 40.7)
            assert.strictEqual(result, 2)
        })

        // TODO prueba
        test("debe ser mayor que cero", () => {
            const result = fuelConsumption(100, 50)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS: fuelEfficiency
    describe("fuelEfficiency - Eficiencia de combustible", () => {
        
        it("debe calcular la eficiencia como inverso del consumo", () => {
            const result = fuelEfficiency(2)
            assert.strictEqual(result, 0.5)
        })

        it("debe calcular correctamente con valor 4", () => {
            const result = fuelEfficiency(4)
            assert.strictEqual(result, 0.25)
        })

        // SKIP - Esta es la única prueba omitida intencionalmente
        it.skip("prueba omitida de eficiencia", () => {
            const result = fuelEfficiency(1)
            assert.strictEqual(result, 1)
        })
    })

    // PRUEBAS: fuelCostKm
    describe("fuelCostKm - Costo de combustible por km", () => {
        
        it("debe calcular el costo por km", () => {
            const result = fuelCostKm(10000, 0.5)
            assert.strictEqual(result, 5000)
        })

        it("debe multiplicar precio por consumo", () => {
            const result = fuelCostKm(11795, 0.1)
            assert.strictEqual(result, 1179.5)
        })

        // FAIL - Esta es la única prueba que falla intencionalmente
        it("debe fallar esta prueba intencionalmente", () => {
            const result = fuelCostKm(100, 2)
            assert.strictEqual(result, 1000) // Valor incorrecto a propósito para demostrar un test fallido
        })
    })

    // PRUEBAS: energyKm
    describe("energyKm - Energía por km", () => {
        
        it("debe calcular la energía por km", () => {
            const result = energyKm(1)
            assert.strictEqual(result, 3.6 * Math.pow(10, 6))
        })

        it("debe multiplicar por el factor correcto", () => {
            const result = energyKm(2)
            assert.strictEqual(result, 7.2 * Math.pow(10, 6))
        })

        test("debe retornar un número positivo", () => {
            const result = energyKm(0.5)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS: emisionKm
    describe("emisionKm - Emisiones por km", () => {
        
        it("debe calcular las emisiones correctamente", () => {
            const result = emisionKm(74.01, 1000000)
            assert.strictEqual(typeof result, 'number')
            assert.strictEqual(result, 74.01)
        })

        it("debe calcular con factor de emisión de gasolina", () => {
            const result = emisionKm(69.25, 2000000)
            assert.strictEqual(result, 138.5)
        })

        it("debe calcular con diferentes factores", () => {
            const result1 = emisionKm(74.01, 1000000)
            const result2 = emisionKm(69.25, 1000000)
            assert.ok(result1 > result2)
        })
    })

    // PRUEBAS: savedEnergy
    describe("savedEnergy - Energía ahorrada", () => {
        
        it("debe calcular la energía ahorrada", () => {
            const result = savedEnergy(2, 1, 10000)
            assert.strictEqual(result, 10000)
        })

        it("debe calcular correctamente la diferencia", () => {
            const result = savedEnergy(5, 2, 5000)
            assert.strictEqual(result, 15000)
        })

        test("debe retornar un número", () => {
            const result = savedEnergy(3, 1, 1000)
            assert.strictEqual(typeof result, 'number')
        })
    })

    // PRUEBAS: avoidedEmissions
    describe("avoidedEmissions - Emisiones evitadas", () => {
        
        it("debe calcular las emisiones evitadas", () => {
            const result = avoidedEmissions(100, 10000)
            assert.strictEqual(result, 1)
        })

        it("debe calcular correctamente con valores grandes", () => {
            const result = avoidedEmissions(50, 20000)
            assert.strictEqual(result, 1)
        })

        it("debe retornar valores positivos", () => {
            const result = avoidedEmissions(200, 10000)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS: monthlySavings
    describe("monthlySavings - Ahorros mensuales", () => {
        
        it("debe calcular los ahorros mensuales", () => {
            const result = monthlySavings(1000, 500, 12000)
            assert.strictEqual(result, 500000)
        })

        it("debe calcular la diferencia mensual", () => {
            const result = monthlySavings(2000, 1000, 24000)
            assert.strictEqual(result, 2000000)
        })

        it("debe retornar valores correctos", () => {
            const result = monthlySavings(100, 50, 1200)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS: annualSavings
    describe("annualSavings - Ahorros anuales", () => {
        
        it("debe calcular los ahorros anuales", () => {
            const result = annualSavings(10000, 0.01)
            assert.strictEqual(typeof result, 'number')
            assert.ok(result > 0)
        })

        it("debe aplicar la fórmula correctamente", () => {
            const monthlyS = 5000
            const ipc = 0.005
            const expected = monthlyS * ((Math.pow(1 + ipc, 12) - 1) / ipc)
            const result = annualSavings(monthlyS, ipc)
            assert.strictEqual(result, expected)
        })

        it("debe manejar diferentes tasas de IPC", () => {
            const result1 = annualSavings(10000, 0.01)
            const result2 = annualSavings(10000, 0.02)
            assert.ok(result2 > result1)
        })
    })

    // PRUEBAS ASÍNCRONAS: youngTree
    describe("youngTree - Árboles jóvenes equivalentes", () => {
        
        it("debe calcular árboles jóvenes equivalentes", async () => {
            const result = await youngTree(1)
            assert.strictEqual(typeof result, 'number')
            assert.strictEqual(result, 100)
        })

        it("debe retornar un entero", async () => {
            const result = await youngTree(0.5)
            assert.strictEqual(result, 50)
        })

        it("debe calcular con diferentes valores", async () => {
            const result = await youngTree(2)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS ASÍNCRONAS: oldTree
    describe("oldTree - Árboles antiguos equivalentes", () => {
        
        it("debe calcular árboles antiguos equivalentes", async () => {
            const result = await oldTree(1)
            assert.strictEqual(typeof result, 'number')
            assert.ok(result >= 0)
        })

        it("debe dividir por el factor correcto", async () => {
            const result = await oldTree(1.5)
            assert.strictEqual(result, 50)
        })

        it("debe calcular árboles con diferentes emisiones", async () => {
            const result = await oldTree(3)
            assert.ok(result >= 0)
        })
    })

    // PRUEBAS ASÍNCRONAS: energyH2Cylinders
    describe("energyH2Cylinders - Energía en cilindros de H2", () => {
        
        it("debe calcular la energía en cilindros", async () => {
            const result = await energyH2Cylinders(54)
            assert.strictEqual(typeof result, 'number')
            assert.strictEqual(result, 100)
        })

        it("debe dividir por el factor de eficiencia", async () => {
            const result = await energyH2Cylinders(108)
            assert.strictEqual(result, 200)
        })

        test("debe retornar un número positivo", async () => {
            const result = await energyH2Cylinders(27)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS ASÍNCRONAS: energyH2LowPresure
    describe("energyH2LowPresure - Energía H2 baja presión", () => {
        
        it("debe calcular la energía a baja presión", async () => {
            const result = await energyH2LowPresure(95)
            assert.strictEqual(typeof result, 'number')
            assert.strictEqual(result, 100)
        })

        it("debe dividir por el factor de compresor", async () => {
            const result = await energyH2LowPresure(190)
            assert.strictEqual(result, 200)
        })

        it("debe calcular con valores decimales", async () => {
            const result = await energyH2LowPresure(47.5)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS ASÍNCRONAS: energyConsumed
    describe("energyConsumed - Energía consumida", () => {
        
        it("debe calcular la energía consumida", async () => {
            const result = await energyConsumed(76)
            assert.strictEqual(typeof result, 'number')
            assert.strictEqual(result, 100)
        })

        it("debe dividir por el factor de electrólisis", async () => {
            const result = await energyConsumed(152)
            assert.strictEqual(result, 200)
        })

        it("debe calcular energía consumida correctamente", async () => {
            const result = await energyConsumed(38)
            assert.strictEqual(result, 50)
        })
    })

    // PRUEBAS ASÍNCRONAS: hydrogenMass
    describe("hydrogenMass - Masa de hidrógeno", () => {
        
        it("debe calcular la masa de hidrógeno", async () => {
            const result = await hydrogenMass(100)
            assert.strictEqual(typeof result, 'number')
            const expected = 100 / 33.33
            assert.strictEqual(result, expected)
        })

        it("debe dividir por la densidad energética", async () => {
            const result = await hydrogenMass(66.66)
            assert.strictEqual(typeof result, 'number')
            assert.ok(result > 0)
        })

        it("debe calcular masa con diferentes energías", async () => {
            const result = await hydrogenMass(200)
            assert.ok(result > 0)
        })
    })

    // PRUEBAS ASÍNCRONAS: litersRequired
    describe("litersRequired - Litros requeridos", () => {
        
        it("debe calcular los litros requeridos", async () => {
            const result = await litersRequired(10)
            assert.strictEqual(result, 90)
        })

        it("debe multiplicar por el factor de peso", async () => {
            const result = await litersRequired(5)
            assert.strictEqual(result, 45)
        })

        test("debe retornar un número positivo", async () => {
            const result = await litersRequired(1)
            assert.strictEqual(typeof result, 'number')
            assert.ok(result > 0)
        })

        it("debe calcular litros con diferentes masas", async () => {
            const result = await litersRequired(20)
            assert.strictEqual(result, 180)
        })
    })

    // PRUEBA CANCELADA (CANCELLED)
    describe("Prueba cancelada por timeout", () => {
        
        // CANCELLED - Esta es la única prueba que se cancela por timeout
        it("prueba que se cancelará por timeout", { timeout: 1 }, async () => {
            // Simular operación lenta que excederá el timeout
            await new Promise(resolve => setTimeout(resolve, 100))
            const result = tiMonth(5)
            assert.ok(result > 0)
        })
    })

})