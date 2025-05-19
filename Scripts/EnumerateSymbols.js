try {
    var modules = Process.enumerateModules()
    var symbols = modules[0].enumerateSymbols()
    send("Symbols for " + modules[0].name + ": \n\n");
    symbols.forEach(function(symbol) {
        send("Symbol: " + symbol.name + ", Type: " + symbol.type + ", isGlobal: " + symbol.isGlobal + ", Size: " + symbol.size + ", Address: " + symbol.address + "\n")
    })
} catch (error) { console.log("Error with enumeration of symbols: " + error)}

console.log("Enumeration of symbols complete!")