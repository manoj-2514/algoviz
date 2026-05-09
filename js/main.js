// Main JavaScript file for AlgoViz

// Global Variables
let isAnimating = false;
let isPaused = false;
let animationSpeed = 5;
let arraySize = 20;
let currentArray = [];
let currentAlgorithm = '';
let animationController = null;

// NOTE: window.AlgoViz is now defined in js/utils.js (loaded before this file).
// Sync local vars back to the singleton so existing code still works:
function syncAlgoVizLocals() {
    if (window.AlgoViz) {
        window.AlgoViz.isAnimating  = isAnimating;
        window.AlgoViz.isPaused     = isPaused;
        window.AlgoViz.animationSpeed = animationSpeed;
    }
}

// DOM Elements - will be initialized after DOM loads
let modal, modalTitle, algorithmSelect, arraySizeSlider, arraySizeValue;
let speedSlider, speedValue, generateBtn, startBtn, pauseBtn, resetBtn;
let visualizer, closeBtn;

// Algorithm Categories
const algorithms = {
    sorting: [
        { name: 'Bubble Sort', value: 'bubble-sort' },
        { name: 'Selection Sort', value: 'selection-sort' },
        { name: 'Insertion Sort', value: 'insertion-sort' },
        { name: 'Merge Sort', value: 'merge-sort' },
        { name: 'Quick Sort', value: 'quick-sort' },
        { name: 'Heap Sort', value: 'heap-sort' }
    ],
    searching: [
        { name: 'Linear Search', value: 'linear-search' },
        { name: 'Binary Search', value: 'binary-search' }
    ],
    graph: [
        { name: 'Breadth First Search (BFS)', value: 'bfs' },
        { name: 'Depth First Search (DFS)', value: 'dfs' },
        { name: 'Dijkstra\'s Algorithm', value: 'dijkstra' },
        { name: 'Prim\'s Algorithm', value: 'prim' },
        { name: 'Kruskal\'s Algorithm', value: 'kruskal' }
    ],
    other: [
        { name: 'Kadane\'s Algorithm', value: 'kadane' },
        { name: 'Floyd Warshall Algorithm', value: 'floyd-warshall' },
        { name: 'KMP String Matching', value: 'kmp' },
        { name: 'Rabin Karp Algorithm', value: 'rabin-karp' }
    ]
};

// Initialize DOM elements
function initializeDOMElements() {
    modal = document.getElementById('algorithmModal');
    modalTitle = document.getElementById('modalTitle');
    algorithmSelect = document.getElementById('algorithmSelect');
    arraySizeSlider = document.getElementById('arraySize');
    arraySizeValue = document.getElementById('arraySizeValue');
    speedSlider = document.getElementById('speed');
    speedValue = document.getElementById('speedValue');
    generateBtn = document.getElementById('generateBtn');
    startBtn = document.getElementById('startBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    visualizer = document.getElementById('visualizer');
    closeBtn = document.querySelector('.close');
    
    // Debug log removed from production
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    initializeEventListeners();
    generateNewArray();
    setupScrollAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // Navigation toggle (may not exist on all pages)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modal controls
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    // Note: outside-click close is handled by the module-level window listener below

    // Algorithm controls
    arraySizeSlider.addEventListener('input', updateArraySize);
    speedSlider.addEventListener('input', updateSpeed);
    generateBtn.addEventListener('click', generateNewArray);
    startBtn.addEventListener('click', startVisualization);
    pauseBtn.addEventListener('click', pauseVisualization);
    resetBtn.addEventListener('click', resetVisualization);

    // Algorithm selection
    algorithmSelect.addEventListener('change', onAlgorithmChange);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Language tabs
    document.querySelectorAll('.lang-tab').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });

    // Explain with Example button
    const explainBtn = document.getElementById('explainBtn');
    if (explainBtn) {
        explainBtn.addEventListener('click', showAIExplanation);
    }

    // Contact form
    document.querySelector('.contact-form').addEventListener('submit', handleContactForm);
}

// Open algorithms modal
function openAlgorithms(category) {
    currentAlgorithm = '';
    modalTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Algorithms`;
    
    // Clear and populate algorithm select
    algorithmSelect.innerHTML = '<option value="">Choose an algorithm...</option>';
    
    if (algorithms[category]) {
        algorithms[category].forEach(algo => {
            const option = document.createElement('option');
            option.value = algo.value;
            option.textContent = algo.name;
            algorithmSelect.appendChild(option);
        });
    }

    // Show modal
    modal.style.display = 'block';
    generateNewArray();
    
    // Add animation to modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('active');
    stopAnimation();
    currentAlgorithm = '';
}

// Close modal when clicking outside — single listener at module level
window.addEventListener('click', function(event) {
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Update array size
function updateArraySize() {
    arraySize = parseInt(arraySizeSlider.value);
    arraySizeValue.textContent = arraySize;
    if (!isAnimating) {
        generateNewArray();
    }
}

// Update animation speed
function updateSpeed() {
    animationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = animationSpeed;
}

// Generate new random array
function generateNewArray() {
    currentArray = [];
    for (let i = 0; i < arraySize; i++) {
        currentArray.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
}

// Render array in visualizer
function renderArray() {
    visualizer.innerHTML = '';
    const maxValue = Math.max(...currentArray);
    
    currentArray.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = `${(value / maxValue) * 100}%`;
        bar.setAttribute('data-value', value);
        bar.setAttribute('data-index', index);
        
        // Add value label for small arrays
        if (arraySize <= 20) {
            const label = document.createElement('div');
            label.textContent = value;
            label.style.cssText = `
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                font-weight: bold;
                color: #333;
            `;
            bar.appendChild(label);
        }
        
        visualizer.appendChild(bar);
    });
}

// Algorithm change handler
function onAlgorithmChange() {
    currentAlgorithm = algorithmSelect.value;
    if (currentAlgorithm) {
        loadAlgorithmInfo(currentAlgorithm);
        generateNewArray();
    }
}

// Load algorithm information
function loadAlgorithmInfo(algorithm) {
    const algorithmData = getAlgorithmData(algorithm);
    if (algorithmData) {
        displayTheory(algorithmData);
        displayCode(algorithmData);
        
        // Show the Explain with Example button
        const explainBtn = document.getElementById('explainBtn');
        if (explainBtn) {
            explainBtn.style.display = 'block';
        }
    }
}

// Get algorithm data
function getAlgorithmData(algorithm) {
    const algorithmDatabase = {
        'bubble-sort': {
            name: 'Bubble Sort',
            theory: {
                definition: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                explanation: 'The algorithm gets its name because smaller elements "bubble" to the top of the list while larger elements "sink" to the bottom.',
                example: 'Consider the array [5, 1, 4, 2, 8]. After the first pass, the largest element (8) will be at the end. After each subsequent pass, the next largest element will be placed in its correct position.',
                timeComplexity: {
                    best: 'O(n)',
                    average: 'O(n²)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Simple to implement', 'Space efficient', 'Adaptive algorithm', 'Stable sort'],
                disadvantages: ['Inefficient for large datasets', 'Not suitable for complex data structures'],
                useCases: ['Educational purposes', 'Small datasets', 'Nearly sorted arrays']
            },
            code: {
                cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`,
                python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`,
                java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
                javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
                c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`
            }
        },
        'selection-sort': {
            name: 'Selection Sort',
            theory: {
                definition: 'Selection Sort is an in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.',
                explanation: 'The algorithm repeatedly selects the smallest element from the unsorted sublist and moves it to the beginning of the unsorted sublist.',
                example: 'For array [64, 25, 12, 22, 11], first find the minimum (11) and swap with first element, resulting in [11, 25, 12, 22, 64].',
                timeComplexity: {
                    best: 'O(n²)',
                    average: 'O(n²)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Simple implementation', 'In-place sorting', 'No additional memory required', 'Performs well on small lists'],
                disadvantages: ['Poor performance on large lists', 'Not stable by default', 'Always O(n²) regardless of input'],
                useCases: ['Small datasets', 'Memory-constrained environments', 'Educational purposes']
            },
            code: {
                cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        swap(arr[min_idx], arr[i]);
    }
}`,
                python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
                java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
                javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
                c: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`
            }
        },
        'insertion-sort': {
            name: 'Insertion Sort',
            theory: {
                definition: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time.',
                explanation: 'The algorithm works by taking one element from the input data and inserting it into the correct position in the already sorted part of the array.',
                example: 'For array [12, 11, 13, 5, 6], start with [12], insert 11 to get [11, 12], then insert 13 to get [11, 12, 13], and so on.',
                timeComplexity: {
                    best: 'O(n)',
                    average: 'O(n²)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Simple implementation', 'Efficient for small datasets', 'Adaptive algorithm', 'Stable sort', 'Online algorithm'],
                disadvantages: ['Inefficient for large datasets', 'More comparisons than selection sort'],
                useCases: ['Small arrays', 'Nearly sorted arrays', 'Real-time systems', 'Educational purposes']
            },
            code: {
                cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
                python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
                java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
                javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
                c: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
            }
        },
        'merge-sort': {
            name: 'Merge Sort',
            theory: {
                definition: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
                explanation: 'The algorithm follows the divide, conquer, and combine strategy. It divides the problem into subproblems, solves them recursively, and combines the solutions.',
                example: 'Array [38, 27, 43, 3, 9, 82, 10] is divided into [38, 27, 43, 3] and [9, 82, 10], which are further divided until single elements, then merged back in sorted order.',
                timeComplexity: {
                    best: 'O(n log n)',
                    average: 'O(n log n)',
                    worst: 'O(n log n)'
                },
                spaceComplexity: 'O(n)',
                advantages: ['Consistent O(n log n) performance', 'Stable sort', 'Parallelizable', 'Suitable for external sorting'],
                disadvantages: ['Requires additional memory', 'Not in-place', 'More complex than simple sorts'],
                useCases: ['Large datasets', 'External sorting', 'Parallel processing', 'Stable sorting requirements']
            },
            code: {
                cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`,
                python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(left)
        merge_sort(right)
        i = j = k = 0
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1`,
                java: `void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; ++i)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j)
        R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
}`,
                javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}
function merge(left, right) {
    let result = [];
    let leftIndex = 0, rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex++]);
        } else {
            result.push(right[rightIndex++]);
        }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`,
                c: `void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
}`
            }
        },
        'quick-sort': {
            name: 'Quick Sort',
            theory: {
                definition: 'Quick Sort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot.',
                explanation: 'The algorithm selects a pivot element and partitions the array such that elements smaller than pivot come before it, and elements greater come after it.',
                example: 'For array [10, 7, 8, 9, 1, 5], choosing 5 as pivot, partition into [1, 5, 10, 7, 8, 9], then recursively sort subarrays.',
                timeComplexity: {
                    best: 'O(n log n)',
                    average: 'O(n log n)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(log n)',
                advantages: ['Fast average case performance', 'In-place sorting', 'Cache friendly', 'Can be parallelized'],
                disadvantages: ['Worst case O(n²)', 'Not stable', 'Pivot selection affects performance'],
                useCases: ['Large datasets', 'In-place sorting requirements', 'Cache-efficient sorting', 'General-purpose sorting']
            },
            code: {
                cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}`,
                python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
                java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
                javascript: `function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
                c: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}`
            }
        },
        'heap-sort': {
            name: 'Heap Sort',
            theory: {
                definition: 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure.',
                explanation: 'The algorithm first builds a max heap from the input data, then repeatedly extracts the maximum element and places it at the end of the array.',
                example: 'For array [4, 10, 3, 5, 1], first build max heap [10, 5, 3, 4, 1], then extract 10 and heapify remaining elements.',
                timeComplexity: {
                    best: 'O(n log n)',
                    average: 'O(n log n)',
                    worst: 'O(n log n)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Consistent performance', 'In-place sorting', 'No additional memory required', 'Not affected by input distribution'],
                disadvantages: ['Not stable', 'Poor cache performance', 'Slower than quicksort in practice'],
                useCases: ['Memory-constrained environments', 'Real-time systems', 'Embedded systems', 'Consistent performance requirements']
            },
            code: {
                cpp: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}`,
                python: `def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
                java: `void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}`,
                javascript: `function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}`,
                c: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}`
            }
        },
        'linear-search': {
            name: 'Linear Search',
            theory: {
                definition: 'Linear Search is a simple search algorithm that sequentially checks each element in a list until a match is found.',
                explanation: 'The algorithm starts at the beginning of the list and checks each element one by one until the target value is found or the end of the list is reached.',
                example: 'Searching for 7 in [3, 5, 2, 7, 1] involves checking 3, then 5, then 2, then finding 7 at index 3.',
                timeComplexity: {
                    best: 'O(1)',
                    average: 'O(n)',
                    worst: 'O(n)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Simple implementation', 'Works on unsorted data', 'No preprocessing required', 'Can search for multiple criteria'],
                disadvantages: ['Inefficient for large datasets', 'Linear time complexity', 'Not suitable for frequent searches'],
                useCases: ['Small datasets', 'Unsorted data', 'One-time searches', 'Educational purposes']
            },
            code: {
                cpp: `int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}`,
                python: `def linear_search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1`,
                java: `int linearSearch(int[] arr, int x) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == x) {
            return i;
        }
    }
    return -1;
}`,
                javascript: `function linearSearch(arr, x) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === x) {
            return i;
        }
    }
    return -1;
}`,
                c: `int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}`
            }
        },
        'binary-search': {
            name: 'Binary Search',
            theory: {
                definition: 'Binary Search is an efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
                explanation: 'The algorithm compares the target value to the middle element of the array and eliminates half of the remaining elements in each iteration.',
                example: 'Searching for 23 in [2, 5, 8, 12, 16, 23, 38, 56] involves checking 16, then the right half, checking 38, then the left half, finding 23.',
                timeComplexity: {
                    best: 'O(1)',
                    average: 'O(log n)',
                    worst: 'O(log n)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Very efficient', 'Logarithmic time complexity', 'Predictable performance', 'Suitable for large datasets'],
                disadvantages: ['Requires sorted data', 'Not suitable for unsorted data', 'Preprocessing overhead'],
                useCases: ['Large sorted datasets', 'Database indexing', 'Dictionary lookups', 'Performance-critical applications']
            },
            code: {
                cpp: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x)
            return m;
        if (arr[m] < x)
            l = m + 1;
        else
            r = m - 1;
    }
    return -1;
}`,
                python: `def binary_search(arr, x):
    l, r = 0, len(arr) - 1
    while l <= r:
        mid = (l + r) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] < x:
            l = mid + 1
        else:
            r = mid - 1
    return -1`,
                java: `int binarySearch(int[] arr, int x) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) {
            return m;
        }
        if (arr[m] < x) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return -1;
}`,
                javascript: `function binarySearch(arr, x) {
    let l = 0, r = arr.length - 1;
    while (l <= r) {
        const m = Math.floor(l + (r - l) / 2);
        if (arr[m] === x) {
            return m;
        }
        if (arr[m] < x) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return -1;
}`,
                c: `int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x)
            return m;
        if (arr[m] < x)
            l = m + 1;
        else
            r = m - 1;
    }
    return -1;
}`
            }
        },
        'kadane': {
            name: 'Kadane\'s Algorithm',
            theory: {
                definition: 'Kadane\'s Algorithm is a dynamic programming algorithm used to find the maximum subarray sum in a one-dimensional array.',
                explanation: 'The algorithm maintains the maximum sum of a subarray ending at the current position and updates the global maximum when a larger sum is found.',
                example: 'For array [-2, 1, -3, 4, -1, 2, 1, -5, 4], the maximum subarray is [4, -1, 2, 1] with sum 6.',
                timeComplexity: {
                    best: 'O(n)',
                    average: 'O(n)',
                    worst: 'O(n)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Linear time complexity', 'Constant space complexity', 'Simple implementation', 'Optimal solution'],
                disadvantages: ['Only works for maximum sum', 'Requires at least one positive number for meaningful results'],
                useCases: ['Stock market analysis', 'Signal processing', 'Game development', 'Financial analysis']
            },
            code: {
                cpp: `int maxSubArraySum(int a[], int size) {
    int max_so_far = a[0];
    int max_ending_here = a[0];
    for (int i = 1; i < size; i++) {
        max_ending_here = max(a[i], max_ending_here + a[i]);
        max_so_far = max(max_so_far, max_ending_here);
    }
    return max_so_far;
}`,
                python: `def max_subarray_sum(arr):
    max_so_far = arr[0]
    max_ending_here = arr[0]
    for i in range(1, len(arr)):
        max_ending_here = max(arr[i], max_ending_here + arr[i])
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far`,
                java: `int maxSubArraySum(int[] arr) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    for (int i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
                javascript: `function maxSubArraySum(arr) {
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    for (let i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
                c: `int maxSubArraySum(int a[], int size) {
    int max_so_far = a[0];
    int max_ending_here = a[0];
    for (int i = 1; i < size; i++) {
        max_ending_here = (a[i] > max_ending_here + a[i]) ? a[i] : max_ending_here + a[i];
        max_so_far = (max_so_far > max_ending_here) ? max_so_far : max_ending_here;
    }
    return max_so_far;
}`
            }
        },
        'floyd-warshall': {
            name: 'Floyd Warshall Algorithm',
            theory: {
                definition: 'Floyd Warshall Algorithm is an all-pairs shortest path algorithm that finds the shortest paths between all pairs of vertices in a weighted graph.',
                explanation: 'The algorithm uses dynamic programming to gradually improve the estimate of shortest paths between all pairs of vertices.',
                example: 'For a graph with 4 vertices, the algorithm finds shortest paths between all 6 possible vertex pairs.',
                timeComplexity: {
                    best: 'O(n³)',
                    average: 'O(n³)',
                    worst: 'O(n³)'
                },
                spaceComplexity: 'O(n²)',
                advantages: ['Finds all pairs shortest paths', 'Works with negative edge weights', 'Simple implementation', 'Dynamic programming approach'],
                disadvantages: ['High time complexity', 'Not suitable for large graphs', 'Requires adjacency matrix'],
                useCases: ['Network routing', 'Transportation networks', 'Game development pathfinding', 'Social network analysis']
            },
            code: {
                cpp: `void floydWarshall(int graph[][V]) {
    int dist[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            dist[i][j] = graph[i][j];
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`,
                python: `def floyd_warshall(graph):
    V = len(graph)
    dist = [row[:] for row in graph]
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
                java: `void floydWarshall(int[][] graph) {
    int V = graph.length;
    int[][] dist = new int[V][V];
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            dist[i][j] = graph[i][j];
        }
    }
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`,
                javascript: `function floydWarshall(graph) {
    const V = graph.length;
    const dist = graph.map(row => [...row]);
    for (let k = 0; k < V; k++) {
        for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}`,
                c: `void floydWarshall(int graph[][V]) {
    int dist[V][V];
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            dist[i][j] = graph[i][j];
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`
            }
        },
        'kmp': {
            name: 'KMP String Matching',
            theory: {
                definition: 'Knuth-Morris-Pratt (KMP) algorithm is a string matching algorithm that searches for occurrences of a pattern within a text.',
                explanation: 'KMP uses a preprocessing step to create a partial match table (LPS array) that allows the algorithm to skip unnecessary comparisons.',
                example: 'Searching for pattern "ABABC" in text "ABABDABABDABABC" finds a match at index 10.',
                timeComplexity: {
                    best: 'O(n + m)',
                    average: 'O(n + m)',
                    worst: 'O(n + m)'
                },
                spaceComplexity: 'O(m)',
                advantages: ['Linear time complexity', 'No re-examination of characters', 'Efficient for repeated patterns', 'Preprocessing optimization'],
                disadvantages: ['Complex preprocessing', 'More memory than naive approach', 'Implementation complexity'],
                useCases: ['Text search', 'Pattern matching', 'DNA sequence analysis', 'Plagiarism detection']
            },
            code: {
                cpp: `void computeLPSArray(char* pat, int M, int* lps) {
    int len = 0;
    lps[0] = 0;
    int i = 1;
    while (i < M) {
        if (pat[i] == pat[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}`,
                python: `def compute_lps_array(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps`,
                java: `void computeLPSArray(String pat, int M, int[] lps) {
    int len = 0;
    lps[0] = 0;
    int i = 1;
    while (i < M) {
        if (pat.charAt(i) == pat.charAt(len)) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}`,
                javascript: `function computeLPSArray(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;
    while (i < pattern.length) {
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
    return lps;
}`,
                c: `void computeLPSArray(char* pat, int M, int* lps) {
    int len = 0;
    lps[0] = 0;
    int i = 1;
    while (i < M) {
        if (pat[i] == pat[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}`
            }
        },
        'rabin-karp': {
            name: 'Rabin Karp Algorithm',
            theory: {
                definition: 'Rabin Karp algorithm is a string matching algorithm that uses hashing to find occurrences of a pattern in a text.',
                explanation: 'The algorithm computes hash values of the pattern and text substrings, then compares hash values to find potential matches.',
                example: 'Searching for pattern "test" in text using rolling hash technique to efficiently slide the window.',
                timeComplexity: {
                    best: 'O(n + m)',
                    average: 'O(n + m)',
                    worst: 'O(nm)'
                },
                spaceComplexity: 'O(1)',
                advantages: ['Average case linear time', 'Rolling hash efficiency', 'Multiple pattern search', 'Pattern matching'],
                disadvantages: ['Worst case O(nm)', 'Hash collisions possible', 'Modular arithmetic complexity'],
                useCases: ['Plagiarism detection', 'DNA sequence matching', 'Text search engines', 'Pattern recognition']
            },
            code: {
                cpp: `void rabinKarpSearch(char pat[], char txt[], int q) {
    int M = strlen(pat);
    int N = strlen(txt);
    int i, j;
    int p = 0;
    int t = 0;
    int h = 1;
    for (i = 0; i < M - 1; i++)
        h = (h * d) % q;
    for (i = 0; i < M; i++) {
        p = (d * p + pat[i]) % q;
        t = (d * t + txt[i]) % q;
    }
}`,
                python: `def rabin_karp_search(pattern, text, q):
    m = len(pattern)
    n = len(text)
    p = 0
    t = 0
    h = 1
    for i in range(m - 1):
        h = (h * d) % q
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q`,
                java: `void rabinKarpSearch(String pat, String txt, int q) {
    int M = pat.length();
    int N = txt.length();
    int i, j;
    int p = 0;
    int t = 0;
    int h = 1;
    for (i = 0; i < M - 1; i++)
        h = (h * d) % q;
    for (i = 0; i < M; i++) {
        p = (d * p + pat.charAt(i)) % q;
        t = (d * t + txt.charAt(i)) % q;
    }
}`,
                javascript: `function rabinKarpSearch(pattern, text, q) {
    const m = pattern.length;
    const n = text.length;
    let p = 0;
    let t = 0;
    let h = 1;
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    for (let i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }
}`,
                c: `void rabinKarpSearch(char pat[], char txt[], int q) {
    int M = strlen(pat);
    int N = strlen(txt);
    int i, j;
    int p = 0;
    int t = 0;
    int h = 1;
    for (i = 0; i < M - 1; i++)
        h = (h * d) % q;
    for (i = 0; i < M; i++) {
        p = (d * p + pat[i]) % q;
        t = (d * t + txt[i]) % q;
    }
}`
            }
        }
    };
    
    return algorithmDatabase[algorithm];
}

// Display theory
function displayTheory(data) {
    const theoryContent = document.getElementById('theoryContent');
    theoryContent.innerHTML = `
        <h3>${data.name}</h3>
        <div class="theory-section">
            <h4>Definition</h4>
            <p>${data.theory.definition}</p>
        </div>
        <div class="theory-section">
            <h4>Explanation</h4>
            <p>${data.theory.explanation}</p>
        </div>
        <div class="theory-section">
            <h4>Example</h4>
            <p>${data.theory.example}</p>
        </div>
        <div class="theory-section">
            <h4>Time Complexity</h4>
            <ul>
                <li><strong>Best Case:</strong> ${data.theory.timeComplexity.best}</li>
                <li><strong>Average Case:</strong> ${data.theory.timeComplexity.average}</li>
                <li><strong>Worst Case:</strong> ${data.theory.timeComplexity.worst}</li>
            </ul>
        </div>
        <div class="theory-section">
            <h4>Space Complexity</h4>
            <p>${data.theory.spaceComplexity}</p>
        </div>
        <div class="theory-section">
            <h4>Advantages</h4>
            <ul>
                ${data.theory.advantages.map(adv => `<li>${adv}</li>`).join('')}
            </ul>
        </div>
        <div class="theory-section">
            <h4>Disadvantages</h4>
            <ul>
                ${data.theory.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
            </ul>
        </div>
        <div class="theory-section">
            <h4>Use Cases</h4>
            <ul>
                ${data.theory.useCases.map(use => `<li>${use}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Display code
function displayCode(data) {
    const codeContent = document.getElementById('codeContent');
    const activeLang = document.querySelector('.lang-tab.active').dataset.lang;
    const prismLang = { cpp: 'cpp', python: 'python', java: 'java', javascript: 'javascript', c: 'c' };
    const cls = prismLang[activeLang] || 'cpp';
    
    let rawCode = data.code[activeLang] || '// Code not available';
    let cleanCode = rawCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    codeContent.innerHTML = `<pre><code class="language-${cls}">${cleanCode}</code></pre>`;
    if (typeof Prism !== 'undefined') Prism.highlightAll();
}

// Switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Switch language
function switchLanguage(lang) {
    document.querySelectorAll('.lang-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    if (currentAlgorithm) {
        const algorithmData = getAlgorithmData(currentAlgorithm);
        if (algorithmData) {
            displayCode(algorithmData);
        }
    }
}

// Start visualization
async function startVisualization() {
    if (!currentAlgorithm) {
        alert('Please select an algorithm first!');
        return;
    }
    
    if (isAnimating && !isPaused) {
        return;
    }
    
    if (isPaused) {
        isPaused = false;
        return;
    }
    
    isAnimating = true;
    isPaused = false;
    disableControls(true);
    
    try {
        await runAlgorithm(currentAlgorithm);
    } catch (error) {
        console.error('Animation error:', error);
    } finally {
        isAnimating = false;
        isPaused = false;
        disableControls(false);
    }
}

// Pause visualization
function pauseVisualization() {
    if (isAnimating && !isPaused) {
        isPaused = true;
    }
}

// Reset visualization
function resetVisualization() {
    stopAnimation();
    generateNewArray();
}

// Stop animation
function stopAnimation() {
    isAnimating = false;
    isPaused = false;
    if (animationController) {
        clearTimeout(animationController);
    }
    disableControls(false);
}

// Disable/enable controls
function disableControls(disable) {
    algorithmSelect.disabled = disable;
    arraySizeSlider.disabled = disable;
    generateBtn.disabled = disable;
    startBtn.disabled = disable;
    pauseBtn.disabled = !disable;
}

// Run algorithm
async function runAlgorithm(algorithm) {
    if (!visualizer) {
        visualizer = new Visualizer('visualizer');
    }
    
    visualizer.initializeArray(currentArray);
    
    switch (algorithm) {
        case 'bubble-sort':
            await window.Algorithms.Sorting.bubbleSort(currentArray, visualizer);
            break;
        case 'selection-sort':
            await window.Algorithms.Sorting.selectionSort(currentArray, visualizer);
            break;
        case 'insertion-sort':
            await window.Algorithms.Sorting.insertionSort(currentArray, visualizer);
            break;
        case 'merge-sort':
            await window.Algorithms.Sorting.mergeSort(currentArray, visualizer);
            break;
        case 'quick-sort':
            await window.Algorithms.Sorting.quickSort(currentArray, visualizer);
            break;
        case 'heap-sort':
            await window.Algorithms.Sorting.heapSort(currentArray, visualizer);
            break;
        case 'linear-search':
            const target = Math.floor(Math.random() * 100) + 1;
            const linearResult = await window.Algorithms.Searching.linearSearch(currentArray, visualizer, target);
            console.log(`Linear search for ${target}: Found at index ${linearResult}`);
            break;
        case 'binary-search':
            const binaryTarget = Math.floor(Math.random() * 100) + 1;
            const binaryResult = await window.Algorithms.Searching.binarySearch(currentArray, visualizer, binaryTarget);
            console.log(`Binary search for ${binaryTarget}: Found at index ${binaryResult}`);
            break;
        case 'kadane':
            const kadaneResult = await window.Algorithms.Other.kadane(currentArray, visualizer);
            console.log('Kadane result:', kadaneResult);
            break;
        case 'floyd-warshall':
            // Create a sample graph for Floyd Warshall
            const sampleGraph = {
                '0': {'0': 0, '1': 5, '2': Infinity, '3': 10},
                '1': {'0': Infinity, '1': 0, '2': 3, '3': Infinity},
                '2': {'0': Infinity, '1': Infinity, '2': 0, '3': 1},
                '3': {'0': Infinity, '1': Infinity, '2': Infinity, '3': 0}
            };
            visualizer.initializeGraph(Object.keys(sampleGraph), sampleGraph);
            const floydResult = await window.Algorithms.Graph.floydWarshall(sampleGraph, visualizer);
            console.log('Floyd Warshall result:', floydResult);
            break;
        case 'kmp':
            const kmpText = "ABABDABABDABABC";
            const kmpPattern = "ABABC";
            const kmpResult = await window.Algorithms.Other.kmp(kmpText, visualizer, kmpPattern);
            console.log('KMP result:', kmpResult);
            break;
        case 'rabin-karp':
            const rkText = "ABABDABABDABABC";
            const rkPattern = "ABABC";
            const rkResult = await window.Algorithms.Other.rabinKarp(rkText, visualizer, rkPattern);
            console.log('Rabin Karp result:', rkResult);
            break;
        case 'bfs':
            const bfsGraph = {
                '0': ['1', '2'],
                '1': ['0', '3', '4'],
                '2': ['0', '5', '6'],
                '3': ['1', '7'],
                '4': ['1'],
                '5': ['2'],
                '6': ['2'],
                '7': ['3']
            };
            visualizer.initializeGraph(Object.keys(bfsGraph), bfsGraph);
            await window.Algorithms.Graph.bfs(bfsGraph, visualizer, '0');
            break;
        case 'dfs':
            const dfsGraph = {
                '0': ['1', '2'],
                '1': ['0', '3', '4'],
                '2': ['0', '5', '6'],
                '3': ['1', '7'],
                '4': ['1'],
                '5': ['2'],
                '6': ['2'],
                '7': ['3']
            };
            visualizer.initializeGraph(Object.keys(dfsGraph), dfsGraph);
            await window.Algorithms.Graph.dfs(dfsGraph, visualizer, '0');
            break;
        case 'dijkstra':
            const dijkstraGraph = {
                '0': {'1': 4, '2': 1},
                '1': {'0': 4, '2': 2, '3': 5},
                '2': {'0': 1, '1': 2, '3': 8},
                '3': {'1': 5, '2': 8}
            };
            visualizer.initializeGraph(Object.keys(dijkstraGraph), dijkstraGraph);
            const dijkstraResult = await window.Algorithms.Graph.dijkstra(dijkstraGraph, visualizer, '0');
            console.log('Dijkstra result:', dijkstraResult);
            break;
        case 'prim':
            const primGraph = {
                '0': {'1': 4, '2': 1},
                '1': {'0': 4, '2': 2, '3': 5},
                '2': {'0': 1, '1': 2, '3': 8},
                '3': {'1': 5, '2': 8}
            };
            visualizer.initializeGraph(Object.keys(primGraph), primGraph);
            const primResult = await window.Algorithms.Graph.prim(primGraph, visualizer, '0');
            console.log('Prim result:', primResult);
            break;
        case 'kruskal':
            const kruskalGraph = {
                '0': {'1': 4, '2': 1},
                '1': {'0': 4, '2': 2, '3': 5},
                '2': {'0': 1, '1': 2, '3': 8},
                '3': {'1': 5, '2': 8}
            };
            visualizer.initializeGraph(Object.keys(kruskalGraph), kruskalGraph);
            const kruskalResult = await window.Algorithms.Graph.kruskal(kruskalGraph, visualizer);
            console.log('Kruskal result:', kruskalResult);
            break;
        default:
            console.log('Algorithm not implemented yet:', algorithm);
    }
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show success message (in a real app, this would send to a server)
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// AI Explanation Feature
function generateAIExplanation(algorithm, array) {
    const explanations = {
        'bubble-sort': {
            steps: [
                `Starting with array: [${array.join(', ')}]`,
                'Step 1: Compare first two elements and swap if needed',
                'Step 2: Move to next pair and compare',
                'Step 3: Continue until end of array',
                'Step 4: Largest element is now at the end',
                'Step 5: Repeat for remaining unsorted portion',
                `Final sorted array: [${array.sort((a,b) => a-b).join(', ')}]`
            ],
            example: `Example with [5, 1, 4, 2, 8]:
Pass 1: [1, 5, 4, 2, 8] → [1, 4, 5, 2, 8] → [1, 4, 2, 5, 8] → [1, 4, 2, 5, 8]
Pass 2: [1, 4, 2, 5, 8] → [1, 4, 2, 5, 8] → [1, 2, 4, 5, 8] → [1, 2, 4, 5, 8]
Result: [1, 2, 4, 5, 8]`
        },
        'selection-sort': {
            steps: [
                `Starting with array: [${array.join(', ')}]`,
                'Step 1: Find minimum element in entire array',
                'Step 2: Swap it with first element',
                'Step 3: Find minimum in remaining unsorted portion',
                'Step 4: Swap it with second element',
                'Step 5: Continue until array is sorted',
                `Final sorted array: [${array.sort((a,b) => a-b).join(', ')}]`
            ],
            example: `Example with [64, 25, 12, 22, 11]:
Pass 1: Find minimum (11), swap with first → [11, 25, 12, 22, 64]
Pass 2: Find minimum in [25, 12, 22, 64] (12), swap with second → [11, 12, 25, 22, 64]
Pass 3: Find minimum in [25, 22, 64] (22), swap with third → [11, 12, 22, 25, 64]
Result: [11, 12, 22, 25, 64]`
        },
        'binary-search': {
            steps: [
                `Starting with sorted array: [${array.sort((a,b) => a-b).join(', ')}]`,
                'Step 1: Find middle element',
                'Step 2: Compare with target value',
                'Step 3: If target is smaller, search left half',
                'Step 4: If target is larger, search right half',
                'Step 5: Repeat until found or search space is empty'
            ],
            example: `Example searching for 23 in [2, 5, 8, 12, 16, 23, 38, 56]:
Step 1: Middle is 16 (index 3), 23 > 16 → search right half [23, 38, 56]
Step 2: Middle is 38 (index 6), 23 < 38 → search left half [23]
Step 3: Found 23 at index 5
Result: Element found at index 5`
        },
        'floyd-warshall': {
            steps: [
                `Starting with graph adjacency matrix`,
                'Step 1: Initialize distance matrix with direct edge weights',
                'Step 2: For each intermediate vertex k, update all pairs (i,j)',
                'Step 3: Check if path through k is shorter than current path i to j',
                'Step 4: Update distance if shorter path found',
                'Step 5: Repeat for all intermediate vertices',
                `Result: Shortest paths between all vertex pairs`
            ],
            example: `Example with 4 vertices:
Initial distances:
0-1=4, 0-2=1, 0-3=Infinity
1-0=Infinity, 1-2=3, 1-3=Infinity
2-0=Infinity, 2-1=Infinity, 2-3=1
3-0=Infinity, 3-1=Infinity, 3-2=Infinity

After processing vertex 0:
0-1=4, 0-2=1, 0-3=Infinity
1-0=4, 1-2=3, 1-3=Infinity
2-0=Infinity, 2-1=Infinity, 2-3=1
3-0=Infinity, 3-1=Infinity, 3-2=Infinity

Result: All pairs shortest paths computed`
        },
        'kmp': {
            steps: [
                `Starting with pattern "${kmpPattern}" and text`,
                'Step 1: Compute LPS (Longest Prefix Suffix) array for pattern',
                'Step 2: Initialize pointers for text (i) and pattern (j)',
                'Step 3: Compare characters and move pointers based on matches',
                'Step 4: Use LPS array to skip unnecessary comparisons',
                'Step 5: Continue until end of text or pattern found',
                `Result: Pattern occurrences found at specific positions`
            ],
            example: `Example searching for "ABABC" in "ABABDABABDABABC":
Pattern: ABABC
LPS Array: [0, 0, 1, 2, 0]

Text: ABABDABABDABABC
        ABABDABABDABABC
        i=0,j=0: A=A (match) → i=1,j=1
        i=1,j=1: B=B (match) → i=2,j=2
        i=2,j=2: A=D (mismatch) → j=1 (using LPS)
        i=2,j=1: B=D (mismatch) → j=0 (using LPS)
        i=2,j=0: A=D (mismatch) → i=3,j=0
        i=3,j=0: D=A (mismatch) → i=4,j=0
        i=4,j=0: A=A (match) → i=5,j=1
        i=5,j=1: B=B (match) → i=6,j=2
        i=6,j=2: A=A (match) → i=7,j=3
        i=7,j=3: B=B (match) → i=8,j=4
        i=8,j=4: C=C (match) → PATTERN FOUND at index 8
Result: Pattern found at index 8`
        },
        'rabin-karp': {
            steps: [
                `Starting with pattern "${rkPattern}" and text`,
                'Step 1: Compute hash of pattern',
                'Step 2: Compute hash of first window of text',
                'Step 3: Compare pattern and window hashes',
                'Step 4: If hashes match, verify characters',
                'Step 5: Slide window using rolling hash technique',
                'Step 6: Continue until end of text',
                `Result: Pattern occurrences found using efficient hashing`
            ],
            example: `Example searching for "ABABC" in text using Rabin-Karp:
Pattern: ABABC, Hash: computed using base 256, prime 101
Window size: 5

Text: ABABDABABDABABC
Hash1("ABABA") != Hash("ABABC") - no match
Hash2("BABDA") != Hash("ABABC") - no match  
Hash3("ABDAB") != Hash("ABABC") - no match
Hash4("BDABA") != Hash("ABABC") - no match
Hash5("DABAB") != Hash("ABABC") - no match
Hash6("ABABD") != Hash("ABABC") - no match
Hash7("BABDA") != Hash("ABABC") - no match
Hash8("ABABD") != Hash("ABABC") - no match
Hash9("ABABC") = Hash("ABABC") - verify characters - MATCH FOUND at index 8
Result: Pattern found at index 8`
        },
        'bfs': {
            steps: [
                `Starting BFS from node 0`,
                'Step 1: Add start node to queue and mark visited',
                'Step 2: While queue is not empty',
                'Step 3: Dequeue current node and explore neighbors',
                'Step 4: Add unvisited neighbors to queue',
                'Step 5: Mark all visited nodes',
                `Result: All reachable nodes explored level by level`
            ],
            example: `Example BFS starting from node 0:
Queue: [0], Visited: {0}

Level 0:
Dequeue 0, explore neighbors [1,2]
Queue: [1,2], Visited: {0,1,2}

Level 1:
Dequeue 1, explore neighbors [0,3,4]
Queue: [2,3,4], Visited: {0,1,2,3,4}
Dequeue 2, explore neighbors [0,5,6]
Queue: [3,4,5,6], Visited: {0,1,2,3,4,5,6}

Level 2:
Continue exploring all reachable nodes
Result: BFS order: 0,1,2,3,4,5,6,7`
        },
        'dfs': {
            steps: [
                `Starting DFS from node 0`,
                'Step 1: Mark start node as visited',
                'Step 2: Explore first unvisited neighbor recursively',
                'Step 3: Backtrack when no more unvisited neighbors',
                'Step 4: Continue with next unvisited neighbor',
                'Step 5: Visit all reachable nodes',
                `Result: All reachable nodes explored using backtracking`
            ],
            example: `Example DFS starting from node 0:
Path: 0

Explore neighbor 1:
Path: 0-1
Explore neighbor 0 (already visited)
Explore neighbor 3:
Path: 0-1-3
Explore neighbor 7:
Path: 0-1-3-7
No more neighbors, backtrack to 3
Backtrack to 1, explore neighbor 4:
Path: 0-1-4
No more neighbors, backtrack to 1
Backtrack to 0, explore neighbor 2:
Path: 0-2
Explore neighbor 5:
Path: 0-2-5
No more neighbors, backtrack to 2
Explore neighbor 6:
Path: 0-2-6
No more neighbors, backtrack
Result: DFS order: 0,1,3,7,4,2,5,6`
        },
        'dijkstra': {
            steps: [
                `Starting Dijkstra from node 0`,
                'Step 1: Initialize distances: source=0, others=Infinity',
                'Step 2: Mark all nodes as unvisited',
                'Step 3: Select unvisited node with minimum distance',
                'Step 4: Update distances to its neighbors',
                'Step 5: Mark current node as visited',
                'Step 6: Repeat until all nodes visited',
                `Result: Shortest distances from source to all nodes`
            ],
            example: `Example Dijkstra from node 0:
Initial distances: {0:0, 1:Infinity, 2:Infinity, 3:Infinity}

Iteration 1:
Select node 0 (distance 0)
Update neighbors:
- Node 1: min(Infinity, 0+4) = 4
- Node 2: min(Infinity, 0+1) = 1
Distances: {0:0, 1:4, 2:1, 3:Infinity}

Iteration 2:
Select node 2 (distance 1)
Update neighbors:
- Node 1: min(4, 1+2) = 4 (no change)
- Node 3: min(Infinity, 1+8) = 9
Distances: {0:0, 1:4, 2:1, 3:9}

Iteration 3:
Select node 1 (distance 4)
Update neighbor 3: min(9, 4+5) = 9 (no change)

Result: Shortest paths from 0:
0-0: 0, 0-1: 4, 0-2: 1, 0-3: 9`
        },
        'prim': {
            steps: [
                `Starting Prim's algorithm from node 0`,
                'Step 1: Initialize visited set with start node',
                'Step 2: Add all edges from start node to priority queue',
                'Step 3: While not all nodes visited',
                'Step 4: Extract minimum edge from queue',
                'Step 5: Add edge to MST if it connects new node',
                'Step 6: Add new edges from newly visited node',
                `Result: Minimum Spanning Tree with minimum total weight`
            ],
            example: `Example Prim's algorithm from node 0:
Visited: {0}, Edges: [(0,1,4), (0,2,1)]

Extract minimum: (0,2,1)
Add to MST, Visited: {0,2}
Add edges from 2: [(2,1,2), (2,3,8)]
Queue: [(0,1,4), (2,1,2), (2,3,8)]

Extract minimum: (2,1,2)
Add to MST, Visited: {0,2,1}
Add edges from 1: [(1,3,5)]
Queue: [(0,1,4), (1,3,5), (2,3,8)]

Extract minimum: (0,1,4)
Add to MST, Visited: {0,2,1}
Add edges from 1: [(1,3,5)]
Queue: [(1,3,5), (2,3,8)]

Extract minimum: (1,3,5)
Add to MST, Visited: {0,2,1,3}
All nodes visited!

Result: MST edges: (0,2,1), (2,1,2), (0,1,4), (1,3,5)
Total weight: 1+2+4+5 = 12`
        },
        'kruskal': {
            steps: [
                `Starting Kruskal\'s algorithm`,
                'Step 1: Collect all edges from graph',
                'Step 2: Sort edges by weight in ascending order',
                'Step 3: Initialize each node as its own component',
                'Step 4: Process edges in order of increasing weight',
                'Step 5: Add edge if it connects different components',
                'Step 6: Merge components when edge added',
                'Step 7: Continue until we have n-1 edges',
                `Result: Minimum Spanning Tree with minimum total weight`
            ],
            example: `Example Kruskal\'s algorithm:
All edges: [(0,1,4), (0,2,1), (1,2,2), (1,3,5), (2,3,8)]
Sorted by weight: [(0,2,1), (1,2,2), (0,1,4), (1,3,5), (2,3,8)]

Components: {0}, {1}, {2}, {3}

Edge (0,2,1): Connects {0} and {2} - ADD
Components: {0,2}, {1}, {3}, MST: [(0,2,1)]

Edge (1,2,2): Connects {1} and {0,2} - ADD
Components: {0,1,2}, {3}, MST: [(0,2,1), (1,2,2)]

Edge (0,1,4): Connects {0,1,2} and {0,1,2} - SKIP (same component)

Edge (1,3,5): Connects {0,1,2} and {3} - ADD
Components: {0,1,2,3}, MST: [(0,2,1), (1,2,2), (1,3,5)]

Done! (3 edges for 4 vertices)
Result: MST edges: (0,2,1), (1,2,2), (1,3,5)
Total weight: 1+2+5 = 8`
        }
    };
    
    return explanations[algorithm] || {
        steps: [`Step-by-step explanation for ${algorithm} will be displayed here.`],
        example: 'Example will be generated based on the current array.'
    };
}

// Show AI Explanation
function showAIExplanation() {
    if (!currentAlgorithm) {
        alert('Please select an algorithm first!');
        return;
    }
    
    const explanationData = generateAIExplanation(currentAlgorithm, currentArray);
    const explanationContent = document.getElementById('explanationContent');
    
    explanationContent.innerHTML = `
        <div class="ai-explanation">
            <h4>Step-by-Step Explanation</h4>
            <div class="steps-container">
                ${explanationData.steps.map((step, index) => `
                    <div class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-text">${step}</div>
                    </div>
                `).join('')}
            </div>
            
            <h4>Real Example</h4>
            <div class="example-container">
                <pre class="example-code">${explanationData.example}</pre>
            </div>
            
            <h4>Key Insights</h4>
            <div class="insights-container">
                <div class="insight-item">
                    <i class="fas fa-lightbulb"></i>
                    <span>This algorithm works by ${getAlgorithmInsight(currentAlgorithm)}</span>
                </div>
                <div class="insight-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Time complexity: ${getAlgorithmComplexity(currentAlgorithm)}</span>
                </div>
                <div class="insight-item">
                    <i class="fas fa-memory"></i>
                    <span>Space complexity: ${getAlgorithmSpaceComplexity(currentAlgorithm)}</span>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for explanation
    if (!document.getElementById('ai-explanation-styles')) {
        const style = document.createElement('style');
        style.id = 'ai-explanation-styles';
        style.textContent = `
            .ai-explanation h4 {
                color: #667eea;
                margin-bottom: 1rem;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 0.5rem;
            }
            .steps-container {
                margin-bottom: 2rem;
            }
            .step-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 1rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .step-number {
                background: #667eea;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 1rem;
                flex-shrink: 0;
            }
            .step-text {
                flex: 1;
                line-height: 1.6;
            }
            .example-container {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 2rem;
            }
            .example-code {
                background: #2d3748;
                color: #e2e8f0;
                padding: 1rem;
                border-radius: 4px;
                overflow-x: auto;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            .insights-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .insight-item {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .insight-item i {
                color: #667eea;
                margin-right: 0.75rem;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// Get algorithm insight
function getAlgorithmInsight(algorithm) {
    const insights = {
        'bubble-sort': 'repeatedly swapping adjacent elements if they are in wrong order',
        'selection-sort': 'finding the minimum element and placing it at the beginning',
        'insertion-sort': 'building the sorted array one element at a time',
        'merge-sort': 'dividing the array and merging sorted halves',
        'quick-sort': 'partitioning the array around a pivot element',
        'heap-sort': 'building a max heap and repeatedly extracting the maximum',
        'linear-search': 'checking each element one by one',
        'binary-search': 'dividing the search space in half each time',
        'kadane': 'keeping track of the maximum subarray ending at each position'
    };
    return insights[algorithm] || 'using a systematic approach';
}

// Get algorithm complexity
function getAlgorithmComplexity(algorithm) {
    const complexities = {
        'bubble-sort': 'O(n²) average case',
        'selection-sort': 'O(n²) always',
        'insertion-sort': 'O(n²) average, O(n) best',
        'merge-sort': 'O(n log n) always',
        'quick-sort': 'O(n log n) average, O(n²) worst',
        'heap-sort': 'O(n log n) always',
        'linear-search': 'O(n)',
        'binary-search': 'O(log n)',
        'kadane': 'O(n)'
    };
    return complexities[algorithm] || 'Varies';
}

// Get algorithm space complexity
function getAlgorithmSpaceComplexity(algorithm) {
    const complexities = {
        'bubble-sort': 'O(1)',
        'selection-sort': 'O(1)',
        'insertion-sort': 'O(1)',
        'merge-sort': 'O(n)',
        'quick-sort': 'O(log n)',
        'heap-sort': 'O(1)',
        'linear-search': 'O(1)',
        'binary-search': 'O(1)',
        'kadane': 'O(1)'
    };
    return complexities[algorithm] || 'Varies';
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getAnimationDelay() {
    return 1000 / animationSpeed;
}

// Export functions for use in other files
window.AlgoViz = {
    openAlgorithms,
    closeModal,
    generateNewArray,
    startVisualization,
    pauseVisualization,
    resetVisualization,
    delay,
    getAnimationDelay
};

// ─── DSA Learn Modal Logic ───────────────────────────────────────────────────

const dsaData = {
    'arrays': {
        title: 'Arrays',
        content: `
            <p><strong>Definition:</strong> An array is a collection of items stored at contiguous memory locations.</p>
            <p><strong>Key Characteristics:</strong></p>
            <ul>
                <li>Stored in contiguous memory, allowing fast O(1) random access by index.</li>
                <li>Fixed size in most traditional languages (e.g., C/C++), though dynamic arrays (like ArrayList or Python lists) resize dynamically.</li>
                <li>Insertion and deletion can be slow O(n) because other elements must be shifted.</li>
            </ul>
            <p><strong>Common Uses:</strong> Lookups, matrix math, implementing other data structures like stacks or heaps.</p>
            <div style="background:#f4f6f8; padding:10px; border-radius:5px; margin-top:10px;">
                <strong>Complexity:</strong><br>
                Access: O(1) <br> Search: O(n) <br> Insertion/Deletion: O(n)
            </div>
        `
    },
    'linked-lists': {
        title: 'Linked Lists',
        content: `
            <p><strong>Definition:</strong> A linked list is a linear data structure whose elements are not stored at contiguous memory locations. Instead, elements (nodes) point to the next node.</p>
            <p><strong>Key Characteristics:</strong></p>
            <ul>
                <li>Dynamic size: We can add or remove elements without reallocating or shifting elements.</li>
                <li>No random access: To find the 5th element, you must traverse from the head node, making access O(n).</li>
                <li>Requires extra memory to store pointers.</li>
            </ul>
            <p><strong>Common Uses:</strong> Implementing stacks/queues, handling collisions in Hash Tables, adjacency lists for Graphs.</p>
            <div style="background:#f4f6f8; padding:10px; border-radius:5px; margin-top:10px;">
                <strong>Complexity:</strong><br>
                Access: O(n) <br> Search: O(n) <br> Insertion/Deletion (at known node): O(1)
            </div>
        `
    },
    'stacks-queues': {
        title: 'Stacks & Queues',
        content: `
            <p><strong>Stacks (LIFO):</strong></p>
            <ul>
                <li><em>Last In, First Out</em>. Imagine a stack of plates; you can only take or add off the top.</li>
                <li><strong>Uses:</strong> Function call tracking (Call Stack), undo mechanisms, bracket matching.</li>
            </ul>
            <hr>
            <p><strong>Queues (FIFO):</strong></p>
            <ul>
                <li><em>First In, First Out</em>. Like waiting in line at a movie theater.</li>
                <li><strong>Uses:</strong> CPU scheduling, breadth-first search (BFS), handling asynchronous requests.</li>
            </ul>
            <div style="background:#f4f6f8; padding:10px; border-radius:5px; margin-top:10px;">
                <strong>Complexity:</strong><br>
                Push/Enqueue: O(1) <br> Pop/Dequeue: O(1) <br> Search: O(n)
            </div>
        `
    },
    'trees': {
        title: 'Trees',
        content: `
            <p><strong>Definition:</strong> A widely used hierarchical data structure consisting of nodes connected by edges, starting from a single <em>root</em> node.</p>
            <p><strong>Key Characteristics:</strong></p>
            <ul>
                <li><strong>Binary Search Trees (BST):</strong> Left child is smaller, right child is larger. Allows for O(log n) search.</li>
                <li><strong>Heaps:</strong> Used for priority queues (e.g. Min-Heap or Max-Heap).</li>
                <li><strong>Balanced Trees (AVL, Red-Black):</strong> Automatically rebalance to guarantee O(log n) operations.</li>
            </ul>
            <p><strong>Common Uses:</strong> Database indexing, file systems, auto-completion features (Tries).</p>
            <div style="background:#f4f6f8; padding:10px; border-radius:5px; margin-top:10px;">
                <strong>Complexity (Balanced BST):</strong><br>
                Search: O(log n) <br> Insertion/Deletion: O(log n)
            </div>
        `
    },
    'graphs': {
        title: 'Graphs',
        content: `
            <p><strong>Definition:</strong> A non-linear data structure consisting of vertices (nodes) and edges (connections). They can be directed/undirected, weighted/unweighted.</p>
            <p><strong>Key Characteristics:</strong></p>
            <ul>
                <li>Represented using an Adjacency Matrix or Adjacency List.</li>
                <li>Traversed using Breadth-First Search (BFS) or Depth-First Search (DFS).</li>
            </ul>
            <p><strong>Common Uses:</strong> Social networks, mapping/GPS systems (shortest path), network routing.</p>
            <div style="background:#f4f6f8; padding:10px; border-radius:5px; margin-top:10px;">
                <strong>Traversal Complexity:</strong><br>
                Time: O(V + E) <br> Space: O(V)
            </div>
        `
    },
    'hash-tables': {
        title: 'Hash Tables',
        content: `
            <p><strong>Definition:</strong> A data structure used to implement an associative array, a structure that can map keys to values. A hash table uses a hash function to compute an index into an array of buckets/slots.</p>
            <p><strong>Key Characteristics:</strong></p>
            <ul>
                <li>Extremely fast data retrieval if the hash function is good and spreads items evenly.</li>
                <li>Collisions (two keys hashing to the same bucket) are handled using Chaining (linked lists) or Open Addressing (probing).</li>
            </ul>
            <p><strong>Common Uses:</strong> Caching, database indexing, unique data representation.</p>
            <div style="background:#f4f6f8; padding:10px; border-radius:5px; margin-top:10px;">
                <strong>Complexity (Average):</strong><br>
                Search: O(1) <br> Insertion/Deletion: O(1) <br> <em>Worst Case: O(n) on heavy collisions</em>
            </div>
        `
    }
};

window.openDSAModal = function(id) {
    const dsaModal = document.getElementById('dsaModal');
    const titleEl = document.getElementById('dsaModalTitle');
    const bodyEl = document.getElementById('dsaModalBody');
    
    if (dsaData[id] && dsaModal) {
        titleEl.textContent = dsaData[id].title;
        bodyEl.innerHTML = dsaData[id].content;
        dsaModal.style.display = 'block';
        setTimeout(() => dsaModal.classList.add('active'), 10);
    }
};

// Ensure the new modal can be closed
document.addEventListener('DOMContentLoaded', () => {
    const dsaClose = document.querySelector('.dsa-close');
    const dsaModal = document.getElementById('dsaModal');
    
    if (dsaClose && dsaModal) {
        dsaClose.onclick = () => {
            dsaModal.classList.remove('active');
            setTimeout(() => dsaModal.style.display = 'none', 300);
        };
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === dsaModal) {
            dsaModal.classList.remove('active');
            setTimeout(() => dsaModal.style.display = 'none', 300);
        }
    });
});

// --- VIDEO MODAL LOGIC ---

const videoData = {
    'arrays': {
        concept: 'QJNwK2uJyGs',
        implementations: {
            java: 'QJNwK2uJyGs',
            cpp: 'QJNwK2uJyGs',
            c: 'K1iu1kXkVoA',
            python: 'pkYVOmU3MgA',
            javascript: 'oigfaZ5ApsM'
        }
    },
    'linked-lists': {
        concept: 'oAja8-Ulz6o',
        implementations: {
            java: 'oAja8-Ulz6o',
            cpp: 'oAja8-Ulz6o',
            c: 'njTh_OwMljA',
            python: 'pkYVOmU3MgA',
            javascript: 't2CEgPsws3U'
        }
    },
    'stacks-queues': {
        concept: 'GYptUgnIM_I',
        implementations: {
            java: 'GYptUgnIM_I',
            cpp: 'GYptUgnIM_I',
            c: 'wjI1WNcIntg',
            python: 'pkYVOmU3MgA',
            javascript: 't2CEgPsws3U'
        }
    },
    'trees': {
        concept: 'H5JubkIy_p8',
        implementations: {
            java: 'H5JubkIy_p8',
            cpp: 'H5JubkIy_p8',
            c: '7m1DMYAbdiY',
            python: 'pkYVOmU3MgA',
            javascript: 't2CEgPsws3U'
        }
    },
    'graphs': {
        concept: '59fUtYYz7ZU',
        implementations: {
            java: '59fUtYYz7ZU',
            cpp: '59fUtYYz7ZU',
            c: 'gXgEDyodOJU',
            python: 'pkYVOmU3MgA',
            javascript: 't2CEgPsws3U'
        }
    },
    'hash-tables': {
        concept: 'shs0KM3wKv8',
        implementations: {
            java: 'shs0KM3wKv8',
            cpp: 'shs0KM3wKv8',
            c: 'KyUTuwz_b7Q',
            python: 'pkYVOmU3MgA',
            javascript: 't2CEgPsws3U'
        }
    }
};

const langLabels = {
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    python: 'Python',
    javascript: 'JavaScript'
};

let currentVideoDsaId = null;

window.openVideoModal = function(dsaId) {
    currentVideoDsaId = dsaId;
    const videoModal = document.getElementById('videoModal');
    if (!videoModal) return;
    
    // Populate Implementation Buttons dynamically
    const container = document.getElementById('implementationButtonsContainer');
    container.innerHTML = ''; // clear previous
    
    const impls = videoData[dsaId].implementations || {};
    const langs = Object.keys(impls);
    
    if (langs.length > 0) {
        langs.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'lang-tab';
            btn.dataset.vidType = lang;
            btn.textContent = langLabels[lang] || lang;
            btn.onclick = () => changeVideoLang(lang);
            container.appendChild(btn);
        });
    } else {
        container.innerHTML = '<span style="color:#777; font-size:0.9rem;">No specific implementation videos available.</span>';
    }
    
    // Set active button to concept by default
    changeVideoLang('concept');
    
    videoModal.style.display = 'block';
    setTimeout(() => videoModal.classList.add('active'), 10);
};

window.closeVideoModal = function() {
    const videoModal = document.getElementById('videoModal');
    if (!videoModal) return;
    
    videoModal.classList.remove('active');
    setTimeout(() => {
        videoModal.style.display = 'none';
        // Stop video playback by clearing src
        document.getElementById('youtubePlayer').src = '';
    }, 300);
};

window.changeVideoLang = function(selection) {
    const player = document.getElementById('youtubePlayer');
    if (!player || !currentVideoDsaId) return;
    
    // Update src
    let vidId = null;
    if (selection === 'concept') {
        vidId = videoData[currentVideoDsaId].concept;
    } else {
        vidId = videoData[currentVideoDsaId].implementations[selection];
    }
    
    if (vidId) {
        player.src = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
    }
    
    // Update active button state globally within modal
    document.querySelectorAll('.video-language-selector .lang-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.vidType === selection) {
            btn.classList.add('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const videoModal = document.getElementById('videoModal');
    
    window.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            window.closeVideoModal();
        }
    });
});
