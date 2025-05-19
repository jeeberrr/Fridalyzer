try {
    var threads = Process.enumerateThreads();
    threads.forEach(function(thread) {
        send("Thread ID: " + thread.id + ", State: " + thread.state + ", Entrypoint: " + thread.entrypoint.routine + "\n")
    })
} catch (error) { console.log("\nError with enumeration of threads: " + error)}

console.log("Enumeration of threads complete!")