window.QuizData = {
  // ==========================================
  // SORTING
  // ==========================================
  "bubble-sort": [
    {
      q: "What is the worst-case time complexity of Bubble Sort, and when does it occur?",
      options: ["O(n) when array is reverse sorted", "O(n^2) when array is reverse sorted", "O(n log n) when array is random", "O(n^2) when array is already sorted"],
      correct: 1,
      explanation: "The worst-case scenario occurs when the array is in reverse order. Bubble sort must make n passes, and each pass requires n-1 comparisons and swaps, leading to O(n^2) time complexity.",
      algoContext: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The worst case requires the maximum number of swaps, which happens when the smallest elements are at the end."
    },
    {
      q: "After the first full pass of Bubble Sort on [5,3,8,1,9], what is the array state?",
      options: ["[3,5,1,8,9]", "[1,3,5,8,9]", "[3,5,8,1,9]", "[5,3,1,8,9]"],
      correct: 0,
      explanation: "In the first pass: 5>3 (swap to 3,5,8,1,9). 5<8 (no swap). 8>1 (swap to 3,5,1,8,9). 8<9 (no swap). Result: [3,5,1,8,9].",
      algoContext: "During a pass, Bubble Sort continuously swaps adjacent elements that are out of order. At the end of each pass, the largest unsorted element 'bubbles up' to its correct position at the end of the array."
    },
    {
      q: "When is Bubble Sort a preferred choice over Quick Sort?",
      options: ["When dealing with large datasets", "When memory space is unlimited", "When the array is almost sorted and an optimized version is used", "When stable sorting is not required"],
      correct: 2,
      explanation: "An optimized Bubble Sort stops if no swaps occur in a pass. Thus, for an almost sorted array, it can finish in O(n) time, whereas standard Quick Sort might take longer depending on pivot choices.",
      algoContext: "While highly inefficient for large, random datasets, Bubble Sort's simplicity allows for an easy optimization: keeping a boolean flag to track if any swaps occurred. This makes it adaptive to nearly sorted data."
    },
    {
      q: "How does Bubble Sort behave on an empty array or an array with a single element?",
      options: ["It throws an index out of bounds error", "It performs exactly one swap", "It enters an infinite loop", "It immediately completes without any swaps"],
      correct: 3,
      explanation: "Since there are no adjacent pairs to compare (length < 2), the loop condition for passes is never met, and the array is returned as-is instantly.",
      algoContext: "Algorithm implementations must handle edge cases like empty or single-element inputs gracefully. Bubble Sort's outer loop depends on array length, so for lengths 0 or 1, the iteration never executes."
    }
  ],
  "selection-sort": [
    {
      q: "What is the primary factor that makes Selection Sort inefficient for large lists?",
      options: ["It requires O(n) auxiliary space", "It performs O(n^2) comparisons regardless of the initial order", "It performs O(n^2) swaps", "It is unstable by nature"],
      correct: 1,
      explanation: "Selection Sort always scans the remaining unsorted portion to find the minimum element. Even if the array is perfectly sorted, it will still perform O(n^2) comparisons.",
      algoContext: "Selection Sort divides the array into a sorted and unsorted region. It blindly searches the entire unsorted region for the minimum element in every step, making it completely non-adaptive to existing order."
    },
    {
      q: "After 2 passes of Selection Sort on [29, 10, 14, 37, 13], what is the array state?",
      options: ["[10, 13, 14, 37, 29]", "[10, 14, 29, 37, 13]", "[10, 13, 14, 29, 37]", "[10, 29, 14, 37, 13]"],
      correct: 0,
      explanation: "Pass 1: Min is 10. Swap 29 and 10 -> [10, 29, 14, 37, 13]. Pass 2: Min in [29,14,37,13] is 13. Swap 29 and 13 -> [10, 13, 14, 37, 29].",
      algoContext: "Each pass of Selection Sort finds the absolute minimum in the unsorted portion and swaps it into the next available position in the sorted portion. After k passes, the first k elements are in their final sorted positions."
    },
    {
      q: "In what specific scenario does Selection Sort outperform Bubble Sort?",
      options: ["When the array is already sorted", "When writing to memory is significantly more expensive than reading", "When the array size is larger than 10,000", "When a stable sort is strictly required"],
      correct: 1,
      explanation: "Selection Sort makes at most O(n) swaps, whereas Bubble Sort can make O(n^2) swaps. If writing to memory is costly (e.g., flash memory), Selection Sort is preferable.",
      algoContext: "While both are O(n^2) algorithms, Selection Sort minimizes memory write operations. It only swaps once per pass, making it useful in systems where write endurance or speed is a bottleneck."
    },
    {
      q: "If Selection Sort is run on a reverse-sorted array [5, 4, 3, 2, 1], how many swaps are performed?",
      options: ["0 swaps", "2 swaps", "5 swaps", "10 swaps"],
      correct: 1,
      explanation: "Pass 1: min 1, swap 5 & 1 -> [1,4,3,2,5]. Pass 2: min 2, swap 4 & 2 -> [1,2,3,4,5]. Pass 3: min 3, swap 3 & 3 (0 actual swaps). Pass 4: min 4, swap 4 & 4 (0 swaps). Total 2 swaps.",
      algoContext: "Selection Sort only performs one swap per iteration. For an array of size N, it will perform at most N-1 swaps, which is drastically fewer than other quadratic sorts like Bubble or Insertion sort in worst-case scenarios."
    }
  ],
  "insertion-sort": [
    {
      q: "What is the space complexity of Insertion Sort?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
      correct: 2,
      explanation: "Insertion Sort sorts the array in-place, shifting elements rather than creating new data structures. It requires only O(1) constant extra space for the key variable.",
      algoContext: "In-place algorithms modify the original input array without needing proportional extra memory. Insertion Sort simply maintains a pointer to the current element and shifts sorted elements to make room."
    },
    {
      q: "Given array [4, 3, 2, 10, 12, 1, 5, 6], after the 3rd element (2) is processed, what is the array state?",
      options: ["[2, 3, 4, 10, 12, 1, 5, 6]", "[3, 4, 2, 10, 12, 1, 5, 6]", "[2, 4, 3, 10, 12, 1, 5, 6]", "[2, 3, 10, 4, 12, 1, 5, 6]"],
      correct: 0,
      explanation: "Initial: [4]. Insert 3: [3,4]. Insert 2: [2,3,4]. The rest of the array [10, 12, 1, 5, 6] remains untouched.",
      algoContext: "Insertion Sort builds the final sorted array one item at a time. It takes the next element from the unsorted portion and inserts it into its correct relative position within the already sorted portion."
    },
    {
      q: "Why is Insertion Sort often used as a base case in hybrid sorting algorithms like Timsort?",
      options: ["Because it has O(n log n) complexity", "Because it is highly efficient for very small or nearly sorted arrays", "Because it uses a divide-and-conquer approach", "Because it is completely unstable"],
      correct: 1,
      explanation: "For small arrays (typically < 10-20 elements), the low overhead of Insertion Sort makes it faster than complex algorithms like Quick Sort or Merge Sort. It also handles nearly sorted data in O(n) time.",
      algoContext: "Hybrid algorithms combine the strengths of multiple approaches. While O(n^2) on paper, Insertion Sort's inner loop is very tight and cache-friendly, making it the perfect finishing step for small partitions."
    },
    {
      q: "What happens when Insertion Sort processes an element that is already greater than all elements in the sorted portion?",
      options: ["It shifts all sorted elements to the left", "It swaps the element with the first element", "It breaks the algorithm", "It performs exactly zero shifts for that element"],
      correct: 3,
      explanation: "When the key element is greater than the largest sorted element, the inner loop condition immediately fails. No shifting occurs, and the algorithm simply moves to the next element.",
      algoContext: "This behavior is what makes Insertion Sort adaptive. If the array is fully sorted, the inner loop never executes a shift, resulting in an optimal O(n) time complexity for the entire algorithm."
    }
  ],
  "merge-sort": [
    {
      q: "What is the time complexity of the merge step in Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      correct: 2,
      explanation: "Merging two sorted subarrays of total size n takes O(n) time because it requires a single pass over both subarrays, comparing and copying elements to an auxiliary array.",
      algoContext: "Merge Sort achieves its overall O(n log n) complexity because the tree of recursive calls is log(n) deep, and at each level, a total of O(n) work is done to merge the split arrays back together."
    },
    {
      q: "During Merge Sort on [38, 27, 43, 3], what are the sub-arrays right before the final merge?",
      options: ["[38, 27] and [43, 3]", "[27, 38] and [3, 43]", "[27, 38, 43] and [3]", "[3, 27] and [38, 43]"],
      correct: 1,
      explanation: "The array splits into [38, 27] and [43, 3]. These split into individual elements. 38 and 27 merge to [27, 38]. 43 and 3 merge to [3, 43]. These are the two halves before the final merge.",
      algoContext: "Merge Sort uses a Divide and Conquer strategy. It recursively divides the array down to single-element subarrays (which are inherently sorted), then pairwise merges them back up into larger sorted subarrays."
    },
    {
      q: "Why is Merge Sort preferred for sorting linked lists?",
      options: ["It is an in-place sort", "It doesn't require random access to elements", "It has O(n) space complexity for arrays", "It is not recursive"],
      correct: 1,
      explanation: "Unlike Quick Sort or Heap Sort, Merge Sort accesses elements sequentially. You can easily split a linked list and merge it without needing O(1) random access by index.",
      algoContext: "Linked lists lack random access, making pointer manipulation difficult for array-optimized algorithms. Merge Sort simply traverses nodes, and its merge step only requires changing 'next' pointers without auxiliary space."
    },
    {
      q: "How does Merge Sort handle an array of size 1?",
      options: ["It divides it into size 0.5", "It returns immediately as it is already sorted", "It pads it with a dummy variable", "It throws an error"],
      correct: 1,
      explanation: "An array of size 1 (or 0) is the base case of the Merge Sort recursion. It is conceptually sorted, so the algorithm just returns the array without further division or merging.",
      algoContext: "Recursive algorithms must have a base case to terminate. In divide and conquer sorting, a single element represents the smallest possible indivisible problem that is trivially solved."
    }
  ],
  "quick-sort": [
    {
      q: "What causes the worst-case O(n^2) time complexity in Quick Sort?",
      options: ["Picking the median element as pivot", "Always picking the smallest or largest element as the pivot", "Sorting an array with random elements", "Having too many unique elements"],
      correct: 1,
      explanation: "If the pivot is always the extreme value, the partition splits the array into sizes 0 and n-1. This results in an unbalanced recursion tree of depth n, leading to O(n^2) time.",
      algoContext: "Quick Sort's efficiency depends heavily on the pivot dividing the array into two roughly equal halves. Poor pivot selection on already sorted or reverse-sorted data destroys the divide-and-conquer advantage."
    },
    {
      q: "Given array [7, 2, 1, 6, 8, 5, 3, 4] using Lomuto partition with the last element (4) as pivot. What is the array after the first partition?",
      options: ["[2, 1, 3, 4, 8, 5, 7, 6]", "[2, 1, 3, 4, 7, 6, 8, 5]", "[1, 2, 3, 4, 5, 6, 7, 8]", "[4, 2, 1, 3, 8, 5, 7, 6]"],
      correct: 0,
      explanation: "Comparing with pivot 4: 7>4, 2<4(swap 7,2)->[2,7,1..]. 1<4(swap 7,1)->[2,1,7..]. 6>4, 8>4, 5>4. 3<4(swap 7,3)->[2,1,3,6,8,5,7,4]. Swap pivot 4 with 6. Result: [2, 1, 3, 4, 8, 5, 7, 6].",
      algoContext: "Lomuto partition maintains an index of smaller elements. It iterates through the array, swapping elements smaller than the pivot to the front. Finally, the pivot is swapped into its correct sorted position."
    },
    {
      q: "When memory space is severely constrained, why might Quick Sort be chosen over Merge Sort?",
      options: ["Quick Sort has O(1) space complexity", "Merge Sort requires O(n) auxiliary space for arrays", "Quick Sort requires no recursion stack", "Merge Sort cannot handle large data types"],
      correct: 1,
      explanation: "Merge Sort on arrays requires an auxiliary array of size O(n) to perform the merge step. Quick Sort is an in-place sort, needing only O(log n) space for the recursion stack.",
      algoContext: "In-place sorting is crucial for embedded systems or massive datasets. Quick Sort rearranges elements within the original array by swapping, avoiding the memory overhead of copying subarrays."
    },
    {
      q: "If Quick Sort partitions an array such that all elements are equal to the pivot, what happens in a naive implementation?",
      options: ["It finishes in O(n) time", "It degrades to O(n^2) time", "It enters an infinite loop", "It skips the partition step completely"],
      correct: 1,
      explanation: "A naive partition scheme might put all equal elements on one side of the pivot, leading to unbalanced partitions of size n-1 and 0, thus causing O(n^2) behavior.",
      algoContext: "Handling duplicates is a known edge case for Quick Sort. Advanced techniques like 3-way partitioning (Dutch National Flag) are used to group all elements equal to the pivot together, bypassing them in recursion."
    }
  ],
  "heap-sort": [
    {
      q: "What is the time complexity of building the initial max-heap in Heap Sort?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(n^2)"],
      correct: 0,
      explanation: "Building the heap from an unsorted array takes O(n) time. Although 'heapify' takes O(log n) time, the number of nodes at higher levels is small, resulting in a convergent series summing to O(n).",
      algoContext: "Heap Sort works in two phases: building the max-heap and extracting the maximum. The linear time build-heap phase is an optimized bottom-up approach, ensuring the overall algorithm remains strictly O(n log n)."
    },
    {
      q: "After building a Max-Heap from [4, 10, 3, 5, 1], what element is at the root (index 0)?",
      options: ["10", "4", "5", "1"],
      correct: 0,
      explanation: "In a Max-Heap, the maximum element must be at the root. The largest element in the array is 10, so it will bubble up to index 0.",
      algoContext: "A Max-Heap is a complete binary tree where every parent node is greater than or equal to its children. The largest element universally resides at the root, enabling Heap Sort to easily extract it."
    },
    {
      q: "Why is Heap Sort typically slower than Quick Sort in practice despite having a better worst-case time complexity?",
      options: ["It requires more memory", "It has poor cache locality", "It performs more comparisons overall", "It is a recursive algorithm"],
      correct: 1,
      explanation: "Heap Sort jumps around the array accessing elements at indices i, 2i+1, and 2i+2. This non-sequential access pattern causes frequent cache misses, making it slower than Quick Sort's sequential partitioning.",
      algoContext: "Modern CPU architecture relies heavily on caching. Algorithms that access memory sequentially (like Quick Sort) benefit from cache lines, while tree-based index jumps (like Heap Sort) invalidate cache, slowing down execution."
    },
    {
      q: "How does Heap Sort handle the extraction phase?",
      options: ["It removes the root and shifts all elements left", "It swaps the root with the last element, reduces heap size, and heapifies the root", "It creates a new array and copies the root", "It sorts the leaves directly"],
      correct: 1,
      explanation: "It swaps the max element (root) with the last element of the heap. The last element is now considered 'sorted' and removed from the heap bounds. The new root is then sifted down to restore the heap property.",
      algoContext: "The extraction phase cleverly sorts the array in-place. By placing the largest elements at the end of the array one by one, a Max-Heap naturally produces an array sorted in ascending order."
    }
  ],

  // ==========================================
  // SEARCHING
  // ==========================================
  "linear-search": [
    {
      q: "What is the worst-case time complexity of Linear Search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      correct: 2,
      explanation: "The worst-case scenario occurs when the target element is at the very end of the array, or not in the array at all, requiring the algorithm to check every single element.",
      algoContext: "Linear Search is the simplest search strategy. It sequentially checks each element of the list until a match is found or the whole list has been searched, resulting in a linear relationship between input size and time."
    },
    {
      q: "If searching for 7 in [2, 9, 4, 7, 1, 7], what index does Linear Search return?",
      options: ["3", "5", "Both 3 and 5", "None"],
      correct: 0,
      explanation: "Linear Search starts from the beginning (index 0) and returns the index of the FIRST match it encounters, which is index 3 in this case.",
      algoContext: "Unless specifically modified to find all occurrences, a standard linear search terminates immediately upon finding the first match to save processing time."
    },
    {
      q: "When is Linear Search preferred over Binary Search?",
      options: ["When the array is massive", "When the array is unsorted", "When looking for multiple elements", "When memory is limited"],
      correct: 1,
      explanation: "Binary Search strictly requires a sorted array. If the array is unsorted and you only need to search once, sorting it takes O(n log n), making a simple O(n) Linear Search much faster.",
      algoContext: "While slow for large datasets, Linear Search has zero prerequisites. It works on unsorted arrays, linked lists, and streams where random access or prior sorting is impossible."
    },
    {
      q: "How does Linear Search behave when searching an empty array?",
      options: ["Throws an error", "Returns -1 or null instantly", "Enters an infinite loop", "Returns index 0"],
      correct: 1,
      explanation: "The loop condition (i < array.length) fails immediately since length is 0. The function skips the loop and returns a 'not found' indicator like -1.",
      algoContext: "Boundary conditions are critical in search algorithms. Linear Search safely handles empty collections because its iteration is strictly bound by the collection's size."
    }
  ],
  "binary-search": [
    {
      q: "What is the time complexity of Binary Search?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
      correct: 2,
      explanation: "Binary Search halves the search space in each step. Mathematically, dividing n by 2 repeatedly until 1 takes log_2(n) steps.",
      algoContext: "Binary Search is a highly efficient divide-and-conquer algorithm. By comparing the target value to the middle element, it eliminates half of the remaining search space with every comparison."
    },
    {
      q: "Searching for 15 in sorted array [2, 5, 8, 12, 16, 23, 38]. What are the mid values checked?",
      options: ["12, 23, 16", "12, 16", "8, 16", "12, 8"],
      correct: 1,
      explanation: "Initial: [2, 5, 8, 12, 16, 23, 38]. Mid is 12. 15 > 12. Next space: [16, 23, 38]. Mid is 23. 15 < 23. Next space: [16]. Mid is 16. 15 != 16. Target not found.",
      algoContext: "The algorithm calculates mid = low + (high - low) / 2. Depending on the comparison, it adjusts either the 'low' pointer to mid+1 or the 'high' pointer to mid-1, progressively shrinking the window."
    },
    {
      q: "What is a strict prerequisite for Binary Search?",
      options: ["The array must have no duplicates", "The array must contain only integers", "The array must be sorted", "The array must be of even length"],
      correct: 2,
      explanation: "Binary Search relies on the order of elements to logically eliminate half the search space. If the array is unsorted, the assumption that elements to the left are smaller is invalid.",
      algoContext: "The logic of moving the left or right pointers assumes monotonicity. A sorted collection is the fundamental invariant that makes O(log n) searching possible."
    },
    {
      q: "In computing `mid = (low + high) / 2`, why is `mid = low + (high - low) / 2` often preferred?",
      options: ["It executes faster on modern CPUs", "It prevents integer overflow when low and high are very large", "It handles floating point numbers better", "It automatically rounds down correctly"],
      correct: 1,
      explanation: "If low and high are very large integers near the maximum integer limit, `low + high` can exceed the memory limits and overflow to a negative number, causing an index error.",
      algoContext: "Integer overflow is a notorious bug in binary search implementations. Re-writing the formula prevents the addition from exceeding the maximum integer boundary while yielding the exact same mathematical result."
    }
  ],

  // ==========================================
  // GRAPH
  // ==========================================
  "bfs": [
    {
      q: "What data structure is used to implement Breadth-First Search?",
      options: ["Stack", "Priority Queue", "Queue", "Linked List"],
      correct: 2,
      explanation: "BFS uses a First-In-First-Out (FIFO) Queue to keep track of the nodes to visit next. This ensures nodes are explored level by level.",
      algoContext: "Breadth-First Search expands uniformly outwards from the source. By pushing newly discovered neighbors to the back of a Queue, the algorithm guarantees that all nodes at depth D are processed before any at depth D+1."
    },
    {
      q: "Given a tree with root A, children B and C. B has child D. C has child E. What is a valid BFS traversal order?",
      options: ["A, B, D, C, E", "A, B, C, D, E", "D, B, E, C, A", "A, D, E, B, C"],
      correct: 1,
      explanation: "BFS explores level by level. Level 0: A. Level 1: B, C. Level 2: D, E. Thus, A, B, C, D, E is the correct breadth-first order.",
      algoContext: "Because BFS uses a queue, it visits every node at a given depth before proceeding deeper. This makes it naturally output elements in order of their distance from the starting node."
    },
    {
      q: "For what specific path-finding problem is BFS optimal?",
      options: ["Finding the longest path in a graph", "Finding the shortest path in a weighted graph", "Finding the shortest path in an unweighted graph", "Finding paths with negative edge weights"],
      correct: 2,
      explanation: "In an unweighted graph, all edges have equal cost (1). Since BFS explores level by level, the first time it reaches a target node, it is guaranteed to have found the shortest path.",
      algoContext: "Without weights, 'shortest path' simply means 'fewest edges'. The strict level-by-level traversal of BFS acts like an expanding ripple, touching the nearest nodes first."
    },
    {
      q: "If a graph has multiple disconnected components, how does a standard BFS behave starting from a single node?",
      options: ["It will eventually visit all nodes in the graph", "It will crash with a null pointer", "It will only visit nodes in the starting component", "It will jump to the next component randomly"],
      correct: 2,
      explanation: "A single BFS traversal can only follow existing edges. It will thoroughly explore the connected component of the start node but will terminate without ever reaching disconnected subgraphs.",
      algoContext: "To visit the entire graph, an outer loop must iterate over all vertices, triggering a new BFS for any unvisited vertex, thus mapping out all separate components."
    }
  ],
  "dfs": [
    {
      q: "What data structure inherently powers Depth-First Search?",
      options: ["Queue", "Hash Table", "Stack", "Binary Tree"],
      correct: 2,
      explanation: "DFS uses a Last-In-First-Out (LIFO) Stack. This is often implemented implicitly via the call stack in recursion, or explicitly with a Stack object in an iterative approach.",
      algoContext: "Depth-First Search dives as deep as possible down one path before retreating. The LIFO nature of a stack perfecty mirrors this 'backtracking' behavior when a dead end is reached."
    },
    {
      q: "In a maze-solving scenario, how does DFS differ visually from BFS?",
      options: ["DFS expands uniformly in a circle", "DFS probes a single path until hitting a wall, then backtracks", "DFS searches the perimeter first", "DFS takes the shortest path immediately"],
      correct: 1,
      explanation: "Visually, DFS looks like a single explorer blindly running down a corridor until they hit a dead end, then walking back to the last intersection to try another path.",
      algoContext: "This aggressive plunging behavior makes DFS memory efficient (it only remembers the current path) but it does not guarantee finding the shortest path to the exit."
    },
    {
      q: "Which algorithm relies heavily on DFS as a core subroutine?",
      options: ["Dijkstra's Shortest Path", "Topological Sort", "Kruskal's MST", "Binary Search"],
      correct: 1,
      explanation: "Topological Sort of a Directed Acyclic Graph (DAG) is essentially a modified DFS. By pushing nodes to a stack only after all their children are visited, a valid linear ordering is formed.",
      algoContext: "DFS is excellent for exploring dependencies and detecting cycles. As it finishes exploring a branch, it naturally orders nodes such that dependencies are resolved before the dependent nodes."
    },
    {
      q: "What happens if DFS is run on a graph containing a cycle without a 'visited' set?",
      options: ["It returns the cycle immediately", "It enters an infinite loop", "It ignores the cycle", "It converts the graph into a tree"],
      correct: 1,
      explanation: "Without marking nodes as 'visited', DFS will traverse the cycle repeatedly (e.g., A -> B -> C -> A -> B...) resulting in a Stack Overflow error.",
      algoContext: "Graphs, unlike trees, can have cycles. Maintaining a boolean array or Set of visited nodes is universally mandatory for graph traversal to prevent infinite recursion."
    }
  ],
  "dijkstra": [
    {
      q: "What is the primary limitation of Dijkstra's Algorithm?",
      options: ["It only works on trees", "It cannot handle graphs with negative edge weights", "It is O(n^3) time complexity", "It requires a complete graph"],
      correct: 1,
      explanation: "Dijkstra assumes that once a node's shortest path is finalized, it can never be found cheaper. Negative edges violate this greedy assumption, leading to incorrect paths.",
      algoContext: "Dijkstra uses a greedy approach, locking in the shortest distance to a node. If a negative weight edge exists, it could theoretically provide a cheaper path to a 'locked' node later on, breaking the algorithm's correctness."
    },
    {
      q: "What data structure is essential for an optimized implementation of Dijkstra's algorithm?",
      options: ["Priority Queue (Min-Heap)", "LIFO Stack", "Hash Map", "Doubly Linked List"],
      correct: 0,
      explanation: "A Priority Queue is used to efficiently fetch the unvisited node with the currently known minimum distance, reducing the extraction time to O(log V).",
      algoContext: "The algorithm repeatedly asks: 'Which unvisited node is closest?'. A Min-Heap provides the minimum element instantly, making the overall algorithm O((V + E) log V) instead of O(V^2)."
    },
    {
      q: "Given A-B (weight 2), A-C (weight 5), B-C (weight 1). What is the shortest path from A to C?",
      options: ["Path A-C (dist 5)", "Path A-B-C (dist 3)", "Path A-C-B (dist 7)", "Path B-A-C (dist 7)"],
      correct: 1,
      explanation: "Dijkstra initially sees A-C as 5. However, exploring A-B costs 2, and from B, B-C costs 1. Total distance A-B-C is 3, which is less than 5. The path is updated.",
      algoContext: "This process is called 'Edge Relaxation'. The algorithm checks if passing through an intermediate node offers a shorter path than the currently known path, updating the distance table accordingly."
    },
    {
      q: "How does Dijkstra behave if the target node is unreachable from the start node?",
      options: ["It enters an infinite loop", "It throws an exception", "The distance remains Infinity", "It assigns a distance of -1"],
      correct: 2,
      explanation: "All node distances are initialized to Infinity. If there is no path, the algorithm will exhaust the reachable connected component, leaving the unreachable node's distance as Infinity.",
      algoContext: "Initialization to Infinity represents that the path cost is currently unknown. If it remains Infinity after full traversal, it mathematically signifies that no valid sequence of edges exists."
    }
  ],
  "prim": [
    {
      q: "What is the goal of Prim's Algorithm?",
      options: ["Find the shortest path between two nodes", "Find the Minimum Spanning Tree (MST) of a graph", "Detect cycles in a directed graph", "Find the maximum flow in a network"],
      correct: 1,
      explanation: "Prim's Algorithm finds the Minimum Spanning Tree (MST), which connects all vertices in an undirected, weighted graph with the minimum total edge weight and no cycles.",
      algoContext: "An MST is useful in network design (e.g., laying cables or roads) where you must connect all points using the absolute minimum amount of material."
    },
    {
      q: "How does Prim's algorithm grow the MST?",
      options: ["By adding the globally smallest edge anywhere in the graph", "By starting from a vertex and greedily adding the cheapest edge connected to the growing tree", "By removing the heaviest edges until a tree remains", "By performing DFS and keeping tree edges"],
      correct: 1,
      explanation: "Prim's grows a single contiguous tree. It looks at all edges crossing from the current tree to unvisited nodes and picks the minimum weight edge.",
      algoContext: "This is a Vertex-centric greedy approach. The 'frontier' of the tree expands outward, continuously absorbing the closest non-tree vertex into the tree."
    },
    {
      q: "Why does Prim's algorithm use a Priority Queue?",
      options: ["To sort the vertices alphabetically", "To keep track of the shortest path from the source", "To efficiently find the minimum weight edge connecting the tree to a new vertex", "To prevent negative cycles"],
      correct: 2,
      explanation: "The Priority Queue stores edges (or vertices with edge weights) extending from the tree. It allows the algorithm to fetch the cheapest connecting edge in O(log V) time.",
      algoContext: "Without a Priority Queue, finding the minimum crossing edge requires scanning all edges connected to the tree, which degrades performance significantly on dense graphs."
    },
    {
      q: "Does the starting vertex choice affect the final MST weight in Prim's algorithm?",
      options: ["Yes, different starts yield different total weights", "No, the total weight of the MST is always the same", "Only if the graph has negative weights", "Only on directed graphs"],
      correct: 1,
      explanation: "An MST is a global property of the graph. While there may be multiple valid MSTs with the same weight (if edges have equal weights), the minimum total weight will always be identical regardless of the starting node.",
      algoContext: "Because the algorithm connects all nodes, every node must eventually enter the tree. Starting anywhere simply changes the order of edge selection, not the optimal final mathematical cost."
    }
  ],
  "kruskal": [
    {
      q: "What is the primary sorting step in Kruskal's Algorithm?",
      options: ["Sorting the vertices by degree", "Sorting the edges by weight in ascending order", "Sorting the edges by weight in descending order", "Sorting the adjacency matrix"],
      correct: 1,
      explanation: "Kruskal's algorithm begins by sorting all the edges in the graph from lowest weight to highest weight.",
      algoContext: "Kruskal's is an Edge-centric algorithm. By considering edges in purely ascending order, it greedily ensures that the lightest possible edges are utilized to connect the graph components."
    },
    {
      q: "What specific data structure is vital for Kruskal's Algorithm to detect cycles?",
      options: ["Binary Search Tree", "Disjoint Set (Union-Find)", "Min-Heap", "Adjacency List"],
      correct: 1,
      explanation: "The Disjoint Set (Union-Find) data structure tracks which vertices belong to which connected components. If an edge connects two vertices in the same set, it would form a cycle and is rejected.",
      algoContext: "Union-Find operations (Find and Union) are extremely fast (nearly O(1) with path compression). This allows Kruskal's to instantly verify if adding an edge will break the acyclic tree property."
    },
    {
      q: "How does Kruskal's algorithm differ from Prim's visually during execution?",
      options: ["Kruskal's grows a single tree from a root, while Prim's connects random edges", "Kruskal's builds a forest of multiple disconnected trees that eventually merge", "Kruskal's only works on directed graphs", "They look visually identical"],
      correct: 1,
      explanation: "Because Kruskal's processes edges globally by weight, it might pick edges in completely different parts of the graph, forming a 'forest' of sub-trees that eventually bridge together into one MST.",
      algoContext: "While Prim's expands like a single growing mold, Kruskal's behaves like puddles forming across the graph, which slowly merge together into a single interconnected body."
    },
    {
      q: "When might Kruskal's algorithm be preferred over Prim's algorithm?",
      options: ["On highly dense graphs with many edges", "On sparse graphs with fewer edges", "When finding shortest paths", "When negative cycles are present"],
      correct: 1,
      explanation: "Kruskal's time complexity is dominated by sorting the edges O(E log E). If the graph is sparse (few edges), sorting is fast. For very dense graphs (E ≈ V^2), Prim's can be more efficient.",
      algoContext: "The choice between MST algorithms often depends on graph density. Kruskal's Edge-centric approach thrives when there are few edges to sort and process."
    }
  ],

  // ==========================================
  // OTHER
  // ==========================================
  "kadane": [
    {
      q: "What specific problem does Kadane's Algorithm solve?",
      options: ["Finding the longest increasing subsequence", "Finding the maximum sum contiguous subarray", "Sorting an array in linear time", "Finding a path through a matrix"],
      correct: 1,
      explanation: "Kadane's algorithm finds the contiguous subarray (containing at least one number) which has the largest sum in an array of numbers.",
      algoContext: "It is a classic Dynamic Programming problem. It asks whether adding the current element to the ongoing sum is better than starting a completely new sum from the current element."
    },
    {
      q: "Given array [-2, 1, -3, 4, -1, 2, 1, -5, 4], what is the maximum subarray sum?",
      options: ["4", "5", "6", "7"],
      correct: 2,
      explanation: "The contiguous subarray [4, -1, 2, 1] has the largest sum = 6. Kadane's algorithm discovers this by maintaining a running maximum.",
      algoContext: "The algorithm calculates max_ending_here = max(current_element, max_ending_here + current_element). Whenever this value exceeds the global maximum, the global maximum is updated."
    },
    {
      q: "What is the time and space complexity of Kadane's Algorithm?",
      options: ["O(n) time, O(n) space", "O(n^2) time, O(1) space", "O(n) time, O(1) space", "O(n log n) time, O(1) space"],
      correct: 2,
      explanation: "It iterates through the array exactly once (O(n) time) and only requires a few variables to keep track of the current sum and maximum sum (O(1) space).",
      algoContext: "It optimizes the naive O(n^2) or O(n^3) brute-force approach down to an elegant linear scan, perfectly demonstrating the power of recognizing overlapping subproblems."
    },
    {
      q: "How must Kadane's algorithm be modified if the array contains only negative numbers?",
      options: ["It will automatically return 0", "It must be initialized with negative infinity instead of 0", "It cannot process negative numbers", "It multiplies everything by -1"],
      correct: 1,
      explanation: "If initialized with max_sum = 0, an all-negative array will incorrectly return 0. Initializing max_sum to the first element (or -Infinity) ensures the least negative number is returned.",
      algoContext: "Standard implementations reset the running sum to 0 if it drops below zero. For all-negative arrays, the algorithm must track the maximum single negative element as the 'best' possible subarray."
    }
  ],
  "floyd-warshall": [
    {
      q: "What is the output of the Floyd-Warshall Algorithm?",
      options: ["A single shortest path from source to destination", "The shortest paths from a single source to all nodes", "The shortest paths between all pairs of vertices", "The Minimum Spanning Tree"],
      correct: 2,
      explanation: "Floyd-Warshall is an All-Pairs Shortest Path (APSP) algorithm. It calculates the minimum distance between every single pair of nodes in the graph.",
      algoContext: "Unlike Dijkstra's (Single-Source), Floyd-Warshall builds a 2D matrix where matrix[i][j] contains the shortest distance from node i to node j, making it ideal for dense route planning."
    },
    {
      q: "What algorithm paradigm does Floyd-Warshall use?",
      options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"],
      correct: 2,
      explanation: "It uses Dynamic Programming. It iteratively improves the shortest path estimates between pairs by considering each node in the graph as a possible intermediate step.",
      algoContext: "The core DP equation is: distance[i][j] = min(distance[i][j], distance[i][k] + distance[k][j]). It checks if routing through intermediate node 'k' is shorter than the direct path."
    },
    {
      q: "What is the time complexity of the Floyd-Warshall algorithm?",
      options: ["O(V^2)", "O(E log V)", "O(V^3)", "O(V^4)"],
      correct: 2,
      explanation: "The algorithm consists of three nested loops, each iterating over the V vertices of the graph, resulting in exactly V * V * V operations.",
      algoContext: "Because of the rigid O(V^3) time complexity, this algorithm is only suitable for relatively small graphs (e.g., V < 500). For massive graphs, running Dijkstra V times is often faster."
    },
    {
      q: "How does Floyd-Warshall detect a negative weight cycle?",
      options: ["By checking if any diagonal element distance[i][i] becomes negative", "By throwing an overflow exception", "It cannot detect negative cycles", "By using a Union-Find data structure"],
      correct: 0,
      explanation: "The distance from a node to itself is initialized to 0. If a negative cycle exists, the algorithm will eventually find a path from node i back to node i with a cost less than 0.",
      algoContext: "While it can handle graphs with negative edge weights (unlike Dijkstra), a negative cycle means you can loop infinitely for infinite negative cost. Checking the main diagonal of the matrix instantly flags this impossibility."
    }
  ],
  "kmp": [
    {
      q: "What problem does the KMP (Knuth-Morris-Pratt) algorithm solve?",
      options: ["Sorting an array of strings", "Finding a substring within a larger text", "Compressing a text file", "Reversing a string"],
      correct: 1,
      explanation: "KMP is a string-matching algorithm used to find occurrences of a 'pattern' string within a 'text' string efficiently.",
      algoContext: "Traditional substring search backtracks the text pointer upon a mismatch. KMP intelligently analyzes the pattern to avoid re-evaluating characters in the text that have already matched."
    },
    {
      q: "What is the purpose of the LPS (Longest Prefix Suffix) array in KMP?",
      options: ["To sort the pattern alphabetically", "To determine how many characters to skip when a mismatch occurs", "To hash the string for faster comparison", "To count the number of vowels in the text"],
      correct: 1,
      explanation: "The LPS array tells the algorithm the length of the longest proper prefix that is also a suffix. Upon mismatch, KMP uses this to shift the pattern without moving the text pointer backwards.",
      algoContext: "By pre-computing the LPS array, the algorithm 'remembers' the structure of the pattern. If a mismatch happens at index j, it knows exactly which prefix can be reused, avoiding redundant comparisons."
    },
    {
      q: "Given the pattern 'ABABC', what is its LPS array?",
      options: ["[0,0,1,2,0]", "[0,1,2,3,4]", "[0,0,0,0,0]", "[1,2,3,4,5]"],
      correct: 0,
      explanation: "A:0. AB:0. ABA:1 (prefix 'A' matches suffix 'A'). ABAB:2 (prefix 'AB' matches suffix 'AB'). ABABC:0 (no matching prefix/suffix).",
      algoContext: "The LPS array maps each position to a fallback index. Calculating this takes O(m) time and dictates the highly optimized shifting logic during the actual search phase."
    },
    {
      q: "What is the time complexity of the KMP algorithm (where N is text length and M is pattern length)?",
      options: ["O(N * M)", "O(N log M)", "O(N + M)", "O(N^2)"],
      correct: 2,
      explanation: "Building the LPS array takes O(M) time, and scanning the text takes O(N) time. The pointers never move backwards, guaranteeing a linear total time of O(N + M).",
      algoContext: "This is a massive improvement over the naive O(N * M) approach, especially useful when searching for complex, highly repetitive patterns in large bodies of text, like DNA sequencing."
    }
  ],
  "rabin-karp": [
    {
      q: "What core mechanism does the Rabin-Karp algorithm use for string matching?",
      options: ["A Longest Prefix Suffix array", "Dynamic Programming tables", "Rolling Hashing", "Suffix Trees"],
      correct: 2,
      explanation: "Rabin-Karp computes a hash value for the pattern and for each substring of the text. If the hashes match, it verifies the strings character by character.",
      algoContext: "Instead of comparing strings character-by-character continuously, it translates strings into numbers (hashes). Comparing integers is vastly faster than comparing sequences of characters."
    },
    {
      q: "What makes the hashing function in Rabin-Karp a 'Rolling Hash'?",
      options: ["It rolls back to the beginning on mismatch", "It recalculates the hash from scratch in a loop", "It computes the next hash by dropping the first character's value and adding the new character's value", "It uses prime numbers that 'roll' over limits"],
      correct: 2,
      explanation: "A rolling hash allows calculating the hash of the next window in O(1) time by mathematically removing the outgoing character's weight and adding the incoming character.",
      algoContext: "This O(1) sliding window update is the secret to the algorithm's speed. Recalculating the hash from scratch every shift would degenerate the algorithm back to O(N * M) time."
    },
    {
      q: "Why does Rabin-Karp still perform character-by-character comparison when hashes match?",
      options: ["Because hashes are only approximations", "Because of hash collisions (different strings having the same hash)", "To calculate the next hash value", "It doesn't; matching hashes guarantee a string match"],
      correct: 1,
      explanation: "Due to the modulo arithmetic used to keep hashes within integer limits, two different strings can produce the exact same hash (a collision). A manual string check confirms a true match.",
      algoContext: "A good hash function minimizes collisions, but they are statistically inevitable. The hash acts as a highly efficient filter, drastically reducing the number of expensive manual comparisons needed."
    },
    {
      q: "In what specific scenario does Rabin-Karp excel compared to KMP?",
      options: ["Searching for a single short pattern", "Searching for multiple patterns simultaneously", "When the text contains no matching characters", "When memory space is severely restricted"],
      correct: 1,
      explanation: "Rabin-Karp is highly effective for multiple pattern search (like plagiarism detection). You can compute the hashes of multiple patterns and check the rolling text hash against a Set of pattern hashes.",
      algoContext: "While KMP is strictly for single-pattern search, checking a rolling hash against a Bloom filter or Hash Set of multiple patterns makes Rabin-Karp extremely powerful for multi-string matching."
    }
  ],
  warshall: [
    {
      q: "What is the primary goal of Warshall's Algorithm?",
      options: ["To find the shortest path between all pairs of nodes", "To find the transitive closure of a directed graph", "To find the minimum spanning tree of a graph", "To detect cycles in a graph"],
      correct: 1,
      explanation: "Warshall's algorithm is specifically designed to compute the transitive closure, which tells us if there is a path (of any length) between every pair of vertices (i, j).",
      algoContext: "Transitive closure is essential in applications like reachability analysis in networks or resolving dependencies in software build systems."
    },
    {
      q: "What is the time complexity of Warshall's Algorithm for a graph with V vertices?",
      options: ["O(V)", "O(V log V)", "O(V^2)", "O(V^3)"],
      correct: 3,
      explanation: "The algorithm uses three nested loops, each running V times, resulting in a cubic time complexity.",
      algoContext: "While O(V^3) is computationally expensive, it is a standard approach for dense graphs where reachability needs to be pre-computed for all pairs."
    },
    {
      q: "In Warshall's Algorithm, what does the matrix entry T[i][j] represent?",
      options: ["The distance between vertex i and j", "The weight of the edge between i and j", "Whether a path exists from vertex i to vertex j", "The capacity of the link from i to j"],
      correct: 2,
      explanation: "The algorithm operates on a boolean (or 0/1) matrix where 1 indicates a path exists and 0 indicates it doesn't.",
      algoContext: "This 'all-pairs reachability' matrix is the output of the algorithm, effectively flattening the graph's connections into a direct lookup table."
    },
    {
      q: "How does Warshall's algorithm determine if there is a path from i to j during the k-th iteration?",
      options: ["By checking if edge (i, j) exists", "By checking if there is a path from i to j through vertex k", "By calculating the sum of edge weights", "By performing a DFS from vertex i"],
      correct: 1,
      explanation: "At each step k, the algorithm updates T[i][j] to be true if it was already true, or if there's a path from i to k AND a path from k to j.",
      algoContext: "The beauty of the algorithm is how it builds complex reachability by considering each vertex as a potential 'bridge' one by one."
    }
  ]
};
