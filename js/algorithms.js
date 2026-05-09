// Algorithm implementations for AlgoViz

// Sorting Algorithms
class SortingAlgorithms {
    // Bubble Sort (with early-exit optimisation)
    static async bubbleSort(arr, visualizer) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (window.AlgoViz && window.AlgoViz.isPaused) {
                    await this.waitForResume();
                }
                
                // Highlight comparing elements
                visualizer.highlightBars([j, j + 1], 'comparing');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    visualizer.swapBars(j, j + 1);
                    swapped = true;
                    await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                }
                
                visualizer.unhighlightBars([j, j + 1]);
            }
            // Mark the last unsorted element as now sorted
            visualizer.highlightBars([n - i - 1], 'sorted');
            // Early exit: if no swaps this pass the array is sorted
            if (!swapped) break;
        }
        // Mark any remaining unsorted elements as sorted
        for (let i = 0; i < arr.length; i++) {
            visualizer.highlightBars([i], 'sorted');
        }
    }

    // Selection Sort
    static async selectionSort(arr, visualizer) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            visualizer.highlightBars([i], 'pivot');
            
            for (let j = i + 1; j < n; j++) {
                if (window.AlgoViz && window.AlgoViz.isPaused) {
                    await this.waitForResume();
                }
                
                visualizer.highlightBars([j], 'comparing');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                
                if (arr[j] < arr[minIdx]) {
                    if (minIdx !== i) {
                        visualizer.unhighlightBars([minIdx]);
                    }
                    minIdx = j;
                    visualizer.highlightBars([minIdx], 'pivot');
                } else {
                    visualizer.unhighlightBars([j]);
                }
            }
            
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                visualizer.swapBars(i, minIdx);
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            }
            
            visualizer.unhighlightBars([i, minIdx]);
            visualizer.highlightBars([i], 'sorted');
        }
        visualizer.highlightBars([n - 1], 'sorted');
    }

    // Insertion Sort
    static async insertionSort(arr, visualizer) {
        const n = arr.length;
        // Mark first element as already sorted
        visualizer.highlightBars([0], 'sorted');
        
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            
            visualizer.highlightBars([i], 'pivot');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            while (j >= 0 && arr[j] > key) {
                if (window.AlgoViz && window.AlgoViz.isPaused) {
                    await this.waitForResume();
                }
                
                visualizer.highlightBars([j], 'comparing');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                
                arr[j + 1] = arr[j];
                visualizer.updateBar(j + 1, arr[j + 1]);
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                
                visualizer.unhighlightBars([j]);
                j--;
            }
            
            arr[j + 1] = key;
            visualizer.updateBar(j + 1, key);
            // Only mark the newly-placed element sorted (no O(n) loop)
            visualizer.unhighlightBars([i]);
            visualizer.highlightBars([j + 1], 'sorted');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        }
    }

    // Merge Sort
    static async mergeSort(arr, visualizer, left = 0, right = arr.length - 1) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            await this.mergeSort(arr, visualizer, left, mid);
            await this.mergeSort(arr, visualizer, mid + 1, right);
            await this.merge(arr, visualizer, left, mid, right);
        }
    }

    static async merge(arr, visualizer, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightBars([k], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            
            visualizer.updateBar(k, arr[k]);
            visualizer.unhighlightBars([k]);
            k++;
        }
        
        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            visualizer.updateBar(k, arr[k]);
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            visualizer.updateBar(k, arr[k]);
            j++;
            k++;
        }
        
        // Mark merged portion as sorted
        for (let idx = left; idx <= right; idx++) {
            visualizer.highlightBars([idx], 'sorted');
        }
    }

    // Quick Sort
    static async quickSort(arr, visualizer, low = 0, high = arr.length - 1) {
        if (low < high) {
            const pi = await this.partition(arr, visualizer, low, high);
            await this.quickSort(arr, visualizer, low, pi - 1);
            await this.quickSort(arr, visualizer, pi + 1, high);
        }
    }

    static async partition(arr, visualizer, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        visualizer.highlightBars([high], 'pivot');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        for (let j = low; j < high; j++) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightBars([j], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                visualizer.swapBars(i, j);
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            }
            
            visualizer.unhighlightBars([j]);
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        visualizer.swapBars(i + 1, high);
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        visualizer.unhighlightBars([high]);
        visualizer.highlightBars([i + 1], 'sorted');
        
        return i + 1;
    }

    // Heap Sort
    static async heapSort(arr, visualizer) {
        const n = arr.length;
        
        // Build heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(arr, visualizer, n, i);
        }
        
        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            [arr[0], arr[i]] = [arr[i], arr[0]];
            visualizer.swapBars(0, i);
            visualizer.highlightBars([i], 'sorted');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            await this.heapify(arr, visualizer, i, 0);
        }
        
        visualizer.highlightBars([0], 'sorted');
    }

    static async heapify(arr, visualizer, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n) {
            visualizer.highlightBars([left, largest], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (arr[left] > arr[largest]) {
                largest = left;
            }
            visualizer.unhighlightBars([left, largest]);
        }
        
        if (right < n) {
            visualizer.highlightBars([right, largest], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (arr[right] > arr[largest]) {
                largest = right;
            }
            visualizer.unhighlightBars([right, largest]);
        }
        
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            visualizer.swapBars(i, largest);
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            await this.heapify(arr, visualizer, n, largest);
        }
    }

    static async waitForResume() {
        while (window.AlgoViz && window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
    }
}

// Searching Algorithms
class SearchingAlgorithms {
    // Linear Search
    static async linearSearch(arr, visualizer, target) {
        const n = arr.length;
        
        for (let i = 0; i < n; i++) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightBars([i], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (arr[i] === target) {
                visualizer.highlightBars([i], 'sorted');
                return i;
            }
            
            visualizer.unhighlightBars([i]);
        }
        
        return -1;
    }

    // Binary Search
    // The array is sorted visually first so the mid-index highlight matches
    // the actual sorted element being compared.
    static async binarySearch(arr, visualizer, target) {
        // Sort the bars in the visualizer to match the search order
        const sortedArr = [...arr].sort((a, b) => a - b);
        visualizer.initializeArray(sortedArr); // re-render bars sorted
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay() * 2);
        
        let left = 0;
        let right = sortedArr.length - 1;
        
        while (left <= right) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            const mid = Math.floor((left + right) / 2);
            
            // Highlight active search range
            for (let i = left; i <= right; i++) {
                visualizer.highlightBars([i], 'searching');
            }
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            // Highlight mid element distinctly
            visualizer.highlightBars([mid], 'pivot');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (sortedArr[mid] === target) {
                // Clear range, mark found
                for (let i = left; i <= right; i++) visualizer.unhighlightBars([i]);
                visualizer.highlightBars([mid], 'sorted');
                return mid;
            } else if (sortedArr[mid] < target) {
                // Dim eliminated left half
                for (let i = left; i <= mid; i++) visualizer.unhighlightBars([i]);
                left = mid + 1;
            } else {
                // Dim eliminated right half
                for (let i = mid; i <= right; i++) visualizer.unhighlightBars([i]);
                right = mid - 1;
            }
        }
        
        // Not found — flash all bars red briefly
        for (let i = 0; i < sortedArr.length; i++) {
            visualizer.highlightBars([i], 'not-found');
        }
        return -1;
    }

    static async waitForResume() {
        while (window.AlgoViz && window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
    }
}

// Graph Algorithms
class GraphAlgorithms {
    // Breadth First Search
    static async bfs(graph, visualizer, startNode) {
        const visited = new Set();
        const queue = [startNode];
        visited.add(startNode);
        
        while (queue.length > 0) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            const current = queue.shift();
            visualizer.highlightNode(current, 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            for (const neighbor of graph[current]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    visualizer.highlightEdge(current, neighbor, 'comparing');
                    await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                }
            }
            
            visualizer.highlightNode(current, 'sorted');
        }
    }

    // Depth First Search
    static async dfs(graph, visualizer, startNode, visited = new Set()) {
        if (visited.has(startNode)) return;
        
        visited.add(startNode);
        visualizer.highlightNode(startNode, 'comparing');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        for (const neighbor of graph[startNode]) {
            if (!visited.has(neighbor)) {
                visualizer.highlightEdge(startNode, neighbor, 'comparing');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                await this.dfs(graph, visualizer, neighbor, visited);
            }
        }
        
        visualizer.highlightNode(startNode, 'sorted');
    }

    // Dijkstra's Algorithm
    static async dijkstra(graph, visualizer, startNode) {
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        // Initialize
        for (const node in graph) {
            distances[node] = Infinity;
            previous[node] = null;
            unvisited.add(node);
        }
        distances[startNode] = 0;
        
        while (unvisited.size > 0) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            // Find unvisited node with minimum distance
            let current = null;
            let minDistance = Infinity;
            for (const node of unvisited) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    current = node;
                }
            }
            
            if (current === null) break;
            
            unvisited.delete(current);
            visualizer.highlightNode(current, 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            for (const neighbor in graph[current]) {
                if (unvisited.has(neighbor)) {
                    const alt = distances[current] + graph[current][neighbor];
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = current;
                        visualizer.highlightEdge(current, neighbor, 'comparing');
                        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                    }
                }
            }
            
            visualizer.highlightNode(current, 'sorted');
        }
        
        return { distances, previous };
    }

    // Prim's Algorithm
    static async prim(graph, visualizer, startNode) {
        const visited = new Set([startNode]);
        const edges = [];
        const mst = [];
        
        // Add all edges from start node
        for (const neighbor in graph[startNode]) {
            edges.push({ from: startNode, to: neighbor, weight: graph[startNode][neighbor] });
        }
        
        while (visited.size < Object.keys(graph).length) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            // Find minimum edge connecting visited to unvisited
            edges.sort((a, b) => a.weight - b.weight);
            let minEdge = null;
            for (const edge of edges) {
                if (visited.has(edge.from) && !visited.has(edge.to)) {
                    minEdge = edge;
                    break;
                }
            }
            
            if (!minEdge) break;
            
            // Add edge to MST
            mst.push(minEdge);
            visited.add(minEdge.to);
            visualizer.highlightEdge(minEdge.from, minEdge.to, 'sorted');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            // Add new edges from the newly visited node
            for (const neighbor in graph[minEdge.to]) {
                if (!visited.has(neighbor)) {
                    edges.push({ from: minEdge.to, to: neighbor, weight: graph[minEdge.to][neighbor] });
                }
            }
        }
        
        return mst;
    }

    // Kruskal's Algorithm
    static async kruskal(graph, visualizer) {
        const edges = [];
        const parent = {};
        const rank = {};
        
        // Initialize parent and rank
        for (const node in graph) {
            parent[node] = node;
            rank[node] = 0;
        }
        
        // Collect all edges
        for (const from in graph) {
            for (const to in graph[from]) {
                edges.push({ from, to, weight: graph[from][to] });
            }
        }
        
        // Sort edges by weight
        edges.sort((a, b) => a.weight - b.weight);
        
        const mst = [];
        
        for (const edge of edges) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            const rootFrom = this.findParent(parent, edge.from);
            const rootTo = this.findParent(parent, edge.to);
            
            if (rootFrom !== rootTo) {
                mst.push(edge);
                this.union(parent, rank, rootFrom, rootTo);
                visualizer.highlightEdge(edge.from, edge.to, 'sorted');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            }
        }
        
        return mst;
    }
    
    // Find parent for union-find
    static findParent(parent, node) {
        if (parent[node] !== node) {
            parent[node] = this.findParent(parent, parent[node]);
        }
        return parent[node];
    }
    
    // Union for union-find
    static union(parent, rank, root1, root2) {
        if (rank[root1] < rank[root2]) {
            parent[root1] = root2;
        } else if (rank[root1] > rank[root2]) {
            parent[root2] = root1;
        } else {
            parent[root2] = root1;
            rank[root1]++;
        }
    }

    static async waitForResume() {
        while (window.AlgoViz && window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
    }
}

// Other Algorithms
class OtherAlgorithms {
    // Kadane's Algorithm
    static async kadane(arr, visualizer) {
        let maxSoFar = arr[0];
        let maxEndingHere = arr[0];
        let start = 0;
        let end = 0;
        let tempStart = 0;
        
        for (let i = 1; i < arr.length; i++) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightBars([i], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (maxEndingHere + arr[i] < arr[i]) {
                maxEndingHere = arr[i];
                tempStart = i;
            } else {
                maxEndingHere += arr[i];
            }
            
            if (maxEndingHere > maxSoFar) {
                maxSoFar = maxEndingHere;
                start = tempStart;
                end = i;
            }
            
            visualizer.unhighlightBars([i]);
        }
        
        // Highlight the maximum subarray
        for (let i = start; i <= end; i++) {
            visualizer.highlightBars([i], 'sorted');
        }
        
        return { maxSoFar, start, end };
    }

    // Floyd Warshall Algorithm
    static async floydWarshall(graph, visualizer) {
        const dist = {};
        const nodes = Object.keys(graph);
        
        // Initialize distance matrix
        for (const i of nodes) {
            dist[i] = {};
            for (const j of nodes) {
                dist[i][j] = i === j ? 0 : (graph[i][j] || Infinity);
            }
        }
        
        for (const k of nodes) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightNode(k, 'pivot');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            for (const i of nodes) {
                for (const j of nodes) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        visualizer.highlightEdge(i, j, 'comparing');
                        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                    }
                }
            }
            
            visualizer.unhighlightNode(k);
        }
        
        return dist;
    }

    // KMP String Matching
    static async kmp(text, pattern, visualizer) {
        const n = text.length;
        const m = pattern.length;
        
        // Compute lps array
        const lps = [0];
        let len = 0;
        let i = 1;
        
        while (i < m) {
            if (pattern[i] === pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        
        // Search for pattern
        i = 0;
        let j = 0;
        const matches = [];
        
        while (i < n) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightBars([i], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (pattern[j] === text[i]) {
                i++;
                j++;
            }
            
            if (j === m) {
                matches.push(i - j);
                visualizer.highlightBars([i - j], 'sorted');
                j = lps[j - 1];
            } else if (i < n && pattern[j] !== text[i]) {
                if (j !== 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
            
            visualizer.unhighlightBars([i - 1]);
        }
        
        return matches;
    }

    // Rabin Karp Algorithm
    static async rabinKarp(text, pattern, visualizer) {
        const n = text.length;
        const m = pattern.length;
        const d = 256; // Number of characters in the alphabet
        const q = 101; // A prime number
        
        let h = 1;
        for (let i = 0; i < m - 1; i++) {
            h = (h * d) % q;
        }
        
        let p = 0; // Hash for pattern
        let t = 0; // Hash for text
        
        // Calculate initial hash values
        for (let i = 0; i < m; i++) {
            p = (d * p + pattern.charCodeAt(i)) % q;
            t = (d * t + text.charCodeAt(i)) % q;
        }
        
        const matches = [];
        
        for (let i = 0; i <= n - m; i++) {
            if (window.AlgoViz && window.AlgoViz.isPaused) {
                await this.waitForResume();
            }
            
            visualizer.highlightBars([i], 'comparing');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (p === t) {
                // Check if characters actually match
                let match = true;
                for (let j = 0; j < m; j++) {
                    if (text[i + j] !== pattern[j]) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    matches.push(i);
                    visualizer.highlightBars([i], 'sorted');
                }
            }
            
            // Calculate hash for next window
            if (i < n - m) {
                t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
                if (t < 0) {
                    t = (t + q);
                }
            }
            
            visualizer.unhighlightBars([i]);
        }
        
        return matches;
    }

    static async waitForResume() {
        while (window.AlgoViz && window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
    }
}

// Export algorithm classes
window.Algorithms = {
    Sorting: SortingAlgorithms,
    Searching: SearchingAlgorithms,
    Graph: GraphAlgorithms,
    Other: OtherAlgorithms
};
