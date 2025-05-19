import frida
import sys
import psutil
import os

def main(pid):
    try:
        device = frida.get_local_device()
        session = device.attach(int(pid))
        process = psutil.Process(int(pid))
        print(f"Hooking to {process.name()}")
        folderstring = f"FridaDumper-{process.name()}-{pid}"
        filepath = os.path.dirname(os.path.abspath(__file__))
        folderpath = os.path.join(filepath, folderstring)
        scriptspath = os.path.join(filepath, "Scripts")
        os.makedirs(folderpath, exist_ok=True)
        if (len(sys.argv) > 1 and sys.argv[2] == "-d"):
            os.makedirs(os.path.join(folderpath, "Dumps"), exist_ok=True)

        modulesfile = open(os.path.join(folderpath, "Modules.txt"), "w")
        threadsfile = open(os.path.join(folderpath, "Threads.txt"), "w")
        symbolsfile = open(os.path.join(folderpath, "Symbols.txt"), "w")
        regionsfile = open(os.path.join(folderpath, "MemoryRegions.txt"), "w")

        def on_message_modules(message, data):
            if message["type"] == "send":
                line  = message["payload"]
                modulesfile.write(line)
            elif message["type"] == "error":
                print(f"Error: {message["stack"]}")

        def on_message_threads(message,data):
            if message["type"] == "send":
                line  = message["payload"]
                threadsfile.write(line)
            elif message["type"] == "error":
                print(f"Error: {message["stack"]}")
        
        def on_message_symbols(message, data):
            if message["type"] == "send":
                line  = message["payload"]
                symbolsfile.write(line)
            elif message["type"] == "error":
                print(f"Error: {message["stack"]}")

        def on_message_regions(message, data):
            if (len(sys.argv) > 1 and sys.argv[2] == "-d"):
                if (message["type"] == "send"):
                    payload = message["payload"]
                    if (isinstance(payload, dict) and "data" in payload and "address" in payload and "dump" in payload):
                        regionsfile.write(payload["data"])
                        with open(os.path.join(os.path.join(folderpath, "Dumps"), f"{payload["address"]}-dump.txt"), "w") as file:
                            file.write(payload["dump"])
                    else:
                        pass
                elif (message["type"] == "error"):
                    print(f"Error: {message["stack"]}")
            else:
                if message["type"] == "send":
                    line  = message["payload"]
                    regionsfile.write(line)
                elif message["type"] == "error":
                    print(f"Error: {message["stack"]}")

        def loadscript(scriptname):
            with open(os.path.join(scriptspath, scriptname), "r") as file:
                return file.read()
            
        modulescript = loadscript("EnumerateModulesAndExports.js")
        script = session.create_script(modulescript)
        script.on('message', on_message_modules)
        script.load()

        threadscript = loadscript("EnumerateThreads.js")
        script = session.create_script(threadscript)
        script.on('message', on_message_threads)
        script.load()

        symbolscript = loadscript("EnumerateSymbols.js")
        script = session.create_script(symbolscript)
        script.on('message', on_message_symbols)
        script.load()

        if (len(sys.argv) > 1 and sys.argv[2] == "-d"):
            print("-d")
            regionscript = loadscript("EnumerateRangesDump.js")
            script = session.create_script(regionscript)
            script.on('message', on_message_regions)
            script.load()
        else:
            regionscript = loadscript("EnumerateRanges.js")
            script = session.create_script(regionscript)
            script.on('message', on_message_regions)
            script.load()

        modulesfile.close()
        threadsfile.close()
        symbolsfile.close()
        regionsfile.close()

        print("Press enter to exit")
        input()

        session.detach()
    except KeyboardInterrupt:
        print("\nDetaching and exiting...")
        try:
            session.detach()
            modulesfile.close()
            threadsfile.close()
            symbolsfile.close()
            regionsfile.close()
        except:
            pass
    except Exception as e:
        print(f"Error: {e}")
        session.detach()
        modulesfile.close()
        threadsfile.close()
        symbolsfile.close()
        regionsfile.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} pid -d (optional for full memory segment dumps)")
    
    pid = sys.argv[1]
    main(pid)