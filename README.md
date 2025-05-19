# Fritalyzer
## A pre-analysis program good for all of your reverse enginering needs
[Test video/how to use](https://youtu.be/0i1vwXDEZ-E)

This is a program to start a reverse engineering project, dumping modules and their exports, symbols, threads, and memory ranges.

## Usage:
```python fridalyzer.py pid -d (optional for full dump of memory)```

## What it does:
This dumps to a folder named by the program name and process id, which then dumps a Modules.txt containing the modules and exports, Threads.txt containing the thread data, Symbols.txt containing the symbol data, and MemoryRegions.txt containing memory region data. There will also be a folder called Dumps if you use the -d option with individual files named by the memory region address, which will have hexadecimal data dumps of those memory regions.

## Happy hacking!
