# Algorithm Visualizer - C++ Implementations

This directory contains C++ implementations of various algorithms used in the AlgoViz platform.

## Available Algorithms

### Sorting Algorithms
- **bubble_sort.cpp** - Bubble Sort implementation with visualization
- **selection_sort.cpp** - Selection Sort implementation
- **insertion_sort.cpp** - Insertion Sort implementation
- **merge_sort.cpp** - Merge Sort implementation
- **quick_sort.cpp** - Quick Sort implementation
- **heap_sort.cpp** - Heap Sort implementation

### Searching Algorithms
- **linear_search.cpp** - Linear Search implementation
- **binary_search.cpp** - Binary Search implementation

### Graph Algorithms
- **bfs.cpp** - Breadth First Search implementation
- **dfs.cpp** - Depth First Search implementation
- **dijkstra.cpp** - Dijkstra's Algorithm implementation
- **prim.cpp** - Prim's Algorithm implementation
- **kruskal.cpp** - Kruskal's Algorithm implementation

### Other Algorithms
- **kadane.cpp** - Kadane's Algorithm implementation
- **floyd_warshall.cpp** - Floyd Warshall Algorithm implementation
- **kmp.cpp** - KMP String Matching implementation
- **rabin_karp.cpp** - Rabin Karp Algorithm implementation

## Compilation Instructions

Each algorithm can be compiled individually using g++:

```bash
g++ -o bubble_sort bubble_sort.cpp -std=c++11
./bubble_sort
```

For all algorithms:

```bash
g++ -o algorithms *.cpp -std=c++11
```

## Features

- **Step-by-step visualization** with console output
- **Timing information** for performance analysis
- **Detailed comments** explaining each step
- **Complexity analysis** in the code comments
- **Example usage** in main functions

## Algorithm Categories

### 1. Sorting Algorithms
Sorting algorithms arrange elements in a specific order (ascending or descending).

**Characteristics:**
- Time complexity analysis
- Space complexity analysis
- Stability analysis
- Best/worst case scenarios

### 2. Searching Algorithms
Searching algorithms find specific elements within data structures.

**Characteristics:**
- Linear vs. Binary search
- Sorted vs. Unsorted data requirements
- Time complexity comparisons
- Space efficiency

### 3. Graph Algorithms
Graph algorithms work with nodes and edges to solve connectivity and path problems.

**Characteristics:**
- Traversal algorithms (BFS, DFS)
- Shortest path algorithms (Dijkstra)
- Minimum spanning tree (Prim, Kruskal)
- Graph representation methods

### 4. Other Important Algorithms
Specialized algorithms for specific problem domains.

**Characteristics:**
- Dynamic programming (Kadane, Floyd Warshall)
- String matching (KMP, Rabin Karp)
- Pattern recognition
- Optimization problems

## Performance Analysis

Each implementation includes:
- **Time Complexity**: Big O notation for best, average, and worst cases
- **Space Complexity**: Memory usage analysis
- **Advantages**: When to use this algorithm
- **Disadvantages**: Limitations and drawbacks
- **Use Cases**: Real-world applications

## Visualization Features

The C++ implementations include:
- **Console-based visualization** showing each step
- **Timing delays** to observe the algorithm process
- **State printing** after each operation
- **Progress indicators** for multi-pass algorithms

## Integration with Web Platform

These C++ implementations serve as:
1. **Reference implementations** for the JavaScript visualizer
2. **Educational resources** for students learning C++
3. **Performance benchmarks** for comparison
4. **Algorithm correctness verification**

## Educational Value

- **Step-by-step explanations** in comments
- **Real-world examples** and use cases
- **Comparative analysis** with other algorithms
- **Best practices** for implementation

## Future Enhancements

- Add more algorithm variants
- Implement parallel versions
- Add benchmarking tools
- Create interactive console applications
- Add unit tests for verification

## Contributing

When adding new algorithms:
1. Follow the existing code style
2. Include comprehensive comments
3. Add complexity analysis
4. Provide example usage
5. Include visualization steps
6. Update this README

## Resources

- [Geeksfor Geeks](https://www.geeksforgeeks.org/) - Algorithm tutorials
- [MIT OpenCourseWare](https://ocw.mit.edu/) - Computer science courses
- [Algorithm Design Manual](https://www.algorist.com/) - Comprehensive algorithm guide
