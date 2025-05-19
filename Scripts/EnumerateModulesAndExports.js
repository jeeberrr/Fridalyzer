//common apis so that we dont have to look at a lot of bullshit system exports i just wanna see the juicy shit
const CommonWindowsAPIs = [
    "ntdll.dll",
    "kernel32.dll",
    "user32.dll",
    "gdi32.dll",
    "advapi32.dll",
    "shell32.dll",
    "ws2_32.dll",
    "ole32.dll",
    "comdlg32.dll",
    "rpcrt4.dll",
    "secur32.dll",
    "sspicli.dll",
    "dbghelp.dll",
    "shlwapi.dll",
    "msvcrt.dll",
    "ucrtbase.dll",
    "gdi32full.dll",
    "win32u.dll",
    "msvcp_win.dll",
    "kernelbase.dll",
    "sechost.dll",
    "bcrypt.dll",
    "iphlpapi.dll",
    "crypt32.dll",
    "dnsapi.dll",
    "psapi.dll",
    "combase.dll",
    "winmm.dll",
    "nsi.dll",
    "imm32.dll",
    "kernel.appcore.dll"
]

const CommonLinuxAPIs = [
    "libc.so",
    "libpthread.so",
    "librt.so",
    "libm.so",
    "libdl.so",
    "libnsl.so",
    "libresolv.so",
    "libcrypt.so",
    "libutil.so"
]

const CommonMacAPIs = [
    "CoreFoundation.framework",
    "Foundation.framework",
    "AppKit.framework",
    "CoreGraphics.framework",
    "Security.framework",
    "IOKit.framework",
    "SystemConfiguration.framework",
    "CoreServices.framework",
    "QuartzCore.framework",
    "AVFoundation.framework"
]

//enumerates modules and exports with frida and sends them back to
try {
    var modules = Process.enumerateModules();
    modules.forEach(function(module) {
        send("Module: " + module.name + ", Base: " + module.base + ", Path" + module.path + ", Size: " + module.size + "\n")

        if (!CommonWindowsAPIs.includes(module.name.toLowerCase()) && !CommonLinuxAPIs.includes(module.name.toLowerCase()) && !CommonMacAPIs.includes(module.name.toLowerCase()) ) {
            var exports = module.enumerateExports();
            exports.forEach(function(exp) {
                send("\tExport: " + exp.name + "(" + exp.type + ") at " + exp.address + "\n")
            })
        }
    })
} catch (error) { console.log("\nError with enumeration of modules and exports: " + error)}

console.log("Enumeration of modules complete!")
