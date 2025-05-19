try {
    var ranges = Process.enumerateRanges('--r--')
    send(ranges.length + " readable ranges found!\n\n")
    ranges.forEach(function(range) {
        send("Protection: " + range.protection.replace(new RegExp("-", "g"), "") + ", Base: " + range.base + ", Size: " + range.size + '\n')
    })
} catch (error) { console.log("Error enumerating memory ranges: " + error)}

console.log("Enumeration of memory ranges completed!")