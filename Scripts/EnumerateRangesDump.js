function DumpToHexStr(dump) {
    const bytearray = new Uint8Array(dump)
    return Array.prototype.map.call(bytearray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2)
    }).join(" ")
}


try {
    var ranges = Process.enumerateRanges("--r--")
    send(ranges.length + " readable ranges found!\n\n")
    ranges.forEach(function(range) {
        var dump = range.base.readByteArray(range.size)
        var hexstr = DumpToHexStr(dump)
        const datastr = "Protection: " + range.protection.replace(new RegExp("-", "g"), "") + ", Base: " + range.base + ", Size: " + range.size + "\n"
        send({
            data: datastr,
            address: range.base,
            dump: hexstr
        })
    })
} catch (error) { console.log("Error enumerating and dumping memory ranges: " + error)}

console.log("Enumeration and dump of ranges complete!")