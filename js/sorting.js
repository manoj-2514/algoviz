// Sorting Algorithms Page JavaScript

// Global Variables
let isAnimating = false;
let isPaused = false;
let animationSpeed = 5;
let arraySize = 20;
let currentArray = [];
let currentAlgorithm = '';
let animationController = null;

// DOM Elements
let modal, modalTitle, arraySizeSlider, arraySizeValue;
let speedSlider, speedValue, generateBtn, startBtn, pauseBtn, resetBtn;
let visualizer, visualizerContainer, closeBtn;
let stepCounter, comparisons, swaps;

// Step counter state
let stepCount = 0;
let comparisonCount = 0;
let swapCount = 0;

// Algorithm Categories
const algorithms = {
    sorting: [
        { name: 'Bubble Sort', value: 'bubble-sort' },
        { name: 'Selection Sort', value: 'selection-sort' },
        { name: 'Insertion Sort', value: 'insertion-sort' },
        { name: 'Merge Sort', value: 'merge-sort' },
        { name: 'Quick Sort', value: 'quick-sort' },
        { name: 'Heap Sort', value: 'heap-sort' }
    ]
};

// Algorithm theory data
const algorithmTheory = {
    'bubble-sort': {
        title: 'Bubble Sort',
        definition: 'Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
        working: 'The algorithm works by repeatedly comparing adjacent elements and swapping them if they are in the wrong order. Each pass through the list places the next largest element at its correct position at the end of the list.',
        complexity: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        useCases: 'Educational purposes, small datasets, nearly sorted data'
    },
    'selection-sort': {
        title: 'Selection Sort',
        definition: 'Selection Sort is an in-place comparison algorithm that divides the input list into two parts: sorted and unsorted. It repeatedly selects the smallest element from the unsorted part and moves it to the sorted part.',
        working: 'The algorithm finds the minimum element in the unsorted portion and swaps it with the first unsorted element. This process is repeated for the remaining unsorted elements.',
        complexity: {
            best: 'O(n²)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        useCases: 'Small datasets, memory-constrained environments'
    },
    'insertion-sort': {
        title: 'Insertion Sort',
        definition: 'Insertion Sort builds the final sorted array one item at a time. It iterates through the input elements and inserts each element into its correct position in the sorted portion of the array.',
        working: 'The algorithm maintains a sorted subarray and inserts each new element into its correct position by shifting larger elements to the right.',
        complexity: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)'
        },
        space: 'O(1)',
        useCases: 'Small datasets, nearly sorted data, online sorting'
    },
    'merge-sort': {
        title: 'Merge Sort',
        definition: 'Merge Sort is a divide and conquer algorithm that divides the array into two halves, recursively sorts them, and then merges the sorted halves.',
        working: 'The algorithm recursively divides the array until single elements remain, then merges them back together in sorted order.',
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)'
        },
        space: 'O(n)',
        useCases: 'Large datasets, external sorting, stable sorting requirements'
    },
    'quick-sort': {
        title: 'Quick Sort',
        definition: 'Quick Sort is a divide and conquer algorithm that picks an element as pivot and partitions the given array around the picked pivot.',
        working: 'The algorithm selects a pivot element and partitions the array such that elements smaller than pivot come before it, while elements greater come after. It then recursively sorts the subarrays.',
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)'
        },
        space: 'O(log n)',
        useCases: 'Large datasets, average-case performance, in-place sorting'
    },
    'heap-sort': {
        title: 'Heap Sort',
        definition: 'Heap Sort is a comparison-based sorting algorithm based on binary heap data structure. It builds a max heap from the array and repeatedly extracts the maximum element.',
        working: 'The algorithm first builds a max heap from the unsorted array, then repeatedly extracts the maximum element and places it at the end of the array.',
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)'
        },
        space: 'O(1)',
        useCases: 'Large datasets, memory-constrained environments, guaranteed performance'
    }
};

// Initialize DOM elements
function initializeDOMElements() {
    modal = document.getElementById('algorithmModal');
    modalTitle = document.getElementById('modalTitle');
    arraySizeSlider = document.getElementById('arraySize');
    arraySizeValue = document.getElementById('arraySizeValue');
    speedSlider = document.getElementById('speed');
    speedValue = document.getElementById('speedValue');
    generateBtn = document.getElementById('generateBtn');
    startBtn = document.getElementById('startBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    visualizerContainer = document.getElementById('visualizer');
    stepCounter = document.getElementById('stepCounter');
    comparisons = document.getElementById('comparisons');
    swaps = document.getElementById('swaps');
    liveExplanation = document.getElementById('liveExplanation');
    closeBtn = document.querySelector('.close');
    
    console.log('DOM Elements initialized:', {
        modal: !!modal,
        modalTitle: !!modalTitle,
        visualizer: !!visualizerContainer,
        closeBtn: !!closeBtn,
        arraySizeSlider: !!arraySizeSlider,
        speedSlider: !!speedSlider,
        generateBtn: !!generateBtn,
        startBtn: !!startBtn,
        pauseBtn: !!pauseBtn,
        resetBtn: !!resetBtn
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    initializeEventListeners();
    generateNewArray();
});

// Event Listeners
function initializeEventListeners() {
    // Modal close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Algorithm controls
    if (arraySizeSlider) arraySizeSlider.addEventListener('input', updateArraySize);
    if (speedSlider) speedSlider.addEventListener('input', updateSpeed);
    if (generateBtn) generateBtn.addEventListener('click', generateNewArray);
    if (startBtn) startBtn.addEventListener('click', startVisualization);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePauseVisualization);
    if (resetBtn) resetBtn.addEventListener('click', resetVisualization);
    
    // Custom Array Input
    const useCustomBtn = document.getElementById('useCustomBtn');
    if (useCustomBtn) {
        useCustomBtn.addEventListener('click', handleCustomArrayInput);
    }

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

    // Visualize buttons
    document.querySelectorAll('.visualize-btn').forEach(button => {
        button.addEventListener('click', function () {
            const algorithm = this.getAttribute("data-algorithm");
            
            if (!algorithm) {
                console.error("Algorithm not defined on button");
                return;
            }
            
            openVisualizer(algorithm);
        });
    });
}

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
    // Update global animation speed
    window.AlgoViz.animationSpeed = animationSpeed;
}

// Generate new random array
function generateNewArray() {
    currentArray = [];
    for (let i = 0; i < arraySize; i++) {
        currentArray.push(Math.floor(Math.random() * 100) + 1);
    }
    
    // Use visualizer to render the array
    if (visualizer instanceof Visualizer) {
        visualizer.initializeArray(currentArray);
        
        // Reset all bar colors to default (unsorted)
        if (visualizer.bars && visualizer.bars.length > 0) {
            visualizer.bars.forEach(bar => {
                bar.classList.remove('comparing', 'swapping', 'pivot', 'sorted', 'searching');
                bar.className = 'visualizer-bar';
            });
        }
        
        // Reset step counters and clear explanation
        resetStepCounters();
        clearExplanation();
    } else {
        // Fallback to simple rendering if visualizer not available
        renderArray();
    }
}

// Handle Custom Array Input
function handleCustomArrayInput() {
    const input = document.getElementById('customArrayInput');
    if (!input || !input.value.trim()) {
        if (typeof showToast === 'function') showToast('Please enter some numbers.', 'warning');
        return;
    }
    
    // Parse comma or space separated numbers
    const values = input.value.split(/[, ]+/).map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (values.length < 2) {
        if (typeof showToast === 'function') showToast('Please enter at least 2 numbers.', 'warning');
        return;
    }
    
    if (values.length > 50) {
        if (typeof showToast === 'function') showToast('Maximum 50 numbers allowed.', 'warning');
        return;
    }
    
    // Limit max value for visual scaling
    const maxVal = Math.max(...values);
    let scale = 1;
    if (maxVal > 200) scale = 100 / maxVal;
    
    currentArray = values.map(v => Math.max(1, Math.round(v * scale)));
    
    // Update slider to match
    if (arraySizeSlider) {
        arraySizeSlider.value = currentArray.length;
        arraySizeValue.textContent = currentArray.length;
        arraySize = currentArray.length;
    }
    
    // Use visualizer to render the array
    if (visualizer instanceof Visualizer) {
        visualizer.initializeArray(currentArray);
        
        if (visualizer.bars && visualizer.bars.length > 0) {
            visualizer.bars.forEach((bar, index) => {
                bar.classList.remove('comparing', 'swapping', 'pivot', 'sorted', 'searching');
                bar.className = 'visualizer-bar';
                // Show real value instead of scaled if we scaled it
                if (scale !== 1) {
                    bar.dataset.realValue = values[index];
                    const label = bar.querySelector('.bar-label');
                    if (label) label.textContent = values[index];
                }
            });
        }
        
        resetStepCounters();
        clearExplanation();
    } else {
        renderArray();
    }
    
    if (typeof showToast === 'function') showToast('Custom array loaded!', 'success');
}

// Render array in visualizer
function renderArray() {
    if (!visualizerContainer) return;
    
    visualizerContainer.innerHTML = '';
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
        
        visualizerContainer.appendChild(bar);
    });
}

// Open algorithm modal
function openAlgorithmModal(algorithm) {
    console.log('Opening algorithm modal for:', algorithm);
    
    currentAlgorithm = algorithm;
    const theoryData = algorithmTheory[algorithm];
    modalTitle.textContent = theoryData ? theoryData.title : 'Algorithm';
    
    // Load algorithm information
    loadAlgorithmInfo(algorithm);
    
    // Show modal
    modal.style.display = 'block';
    generateNewArray();
    
    // Add animation to modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Open visualizer (for Visualize buttons)
function openVisualizer(algorithm) {
    console.log('Opening visualizer for:', algorithm);
    
    currentAlgorithm = algorithm;
    const theoryData = algorithmTheory[algorithm];
    modalTitle.textContent = theoryData ? theoryData.title : 'Algorithm';
    
    // Load algorithm information
    loadAlgorithmInfo(algorithm);
    
    // Show modal
    modal.style.display = 'block';
    generateNewArray();
    
    // Add animation to modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Step counter functions
function resetStepCounters() {
    stepCount = 0;
    comparisonCount = 0;
    swapCount = 0;
    updateStepDisplay();
}

function incrementStep() {
    stepCount++;
    updateStepDisplay();
}

function incrementComparisons() {
    comparisonCount++;
    updateStepDisplay();
}

function incrementSwaps() {
    swapCount++;
    updateStepDisplay();
}

function updateStepDisplay() {
    if (stepCounter) stepCounter.textContent = stepCount;
    if (comparisons) comparisons.textContent = comparisonCount;
    if (swaps) swaps.textContent = swapCount;
}

// Live explanation functions
function addExplanation(message, type = 'info') {
    if (!liveExplanation) return;
    
    const stepText = stepCount > 0 ? `Step ${stepCount}: ` : '';
    const explanationElement = document.createElement('p');
    explanationElement.className = type;
    explanationElement.textContent = stepText + message;
    
    liveExplanation.appendChild(explanationElement);
    
    // Auto-scroll to bottom
    liveExplanation.scrollTop = liveExplanation.scrollHeight;
    
    // Limit explanation history
    const explanations = liveExplanation.querySelectorAll('p');
    if (explanations.length > 50) {
        explanations[0].remove();
    }
}

function clearExplanation() {
    if (liveExplanation) {
        liveExplanation.innerHTML = '<p>Starting algorithm...</p>';
    }
}

// Specific explanation functions
function explainComparison(value1, value2) {
    let what = `Comparing ${value1} and ${value2} (highlighted in orange). `;
    let why = `We need to check their relative order to decide if a swap is required. `;
    let analogy = "";
    let next = "Next, the algorithm will either perform a swap (highlighted in blue) or move to the next pair.";

    switch(currentAlgorithm) {
        case 'bubble-sort':
            analogy = "Like checking if two books are in the right order on a shelf — we need to see which value belongs further right. ";
            next = `Since we're in Bubble Sort, if ${value1} > ${value2}, they will bubble rightward next.`;
            break;
        case 'selection-sort':
            analogy = "Like scanning your hand to find a card smaller than the current minimum. ";
            next = `If ${value1} is the new minimum, we'll track it for a future swap.`;
            break;
        case 'insertion-sort':
            analogy = "Like comparing a new card to the cards already sorted in your hand. ";
            next = "We'll keep shifting larger elements right until we find the insertion spot.";
            break;
        case 'merge-sort':
            analogy = "Like comparing the top documents of two sorted piles. ";
            next = "The smaller document will be placed into the combined sorted pile.";
            break;
        case 'quick-sort':
            analogy = "Like comparing an item's price to our 'benchmark' pivot price. ";
            next = "Items cheaper than the pivot will move to the left side.";
            break;
        case 'heap-sort':
            analogy = "Like comparing two competitors in a tournament bracket to see who is stronger. ";
            next = "The larger value will be promoted toward the root of the heap.";
            break;
    }
    addExplanation(what + why + analogy + next, 'comparison');
}

function explainSwap(value1, value2, reason = '') {
    let what = `Swapping ${value1} and ${value2} (highlighted in blue)${reason ? ' because ' + reason : ''}. `;
    let why = "Elements must be moved to their relative sorted positions. ";
    let analogy = "";
    let next = "Next, the algorithm will continue processing the remaining unsorted elements.";

    switch(currentAlgorithm) {
        case 'bubble-sort':
            analogy = "Think of a heavier bubble rising through water — larger values bubble rightward with each pass. ";
            next = `Next, ${value1} will be compared with the element to its right.`;
            break;
        case 'selection-sort':
            analogy = "Like picking the smallest card you found and moving it to its correct spot at the front. ";
            break;
        case 'insertion-sort':
            analogy = "Like sliding cards over to make a gap for a new card in your hand. ";
            break;
        case 'merge-sort':
            analogy = "Like moving a document from a sub-pile into the final sorted stack. ";
            break;
        case 'quick-sort':
            analogy = "Like placing all cheaper items in the left-hand bin of our partition. ";
            break;
        case 'heap-sort':
            analogy = "Like swapping a champion out of the bracket once they've won their spot. ";
            break;
    }
    addExplanation(what + why + analogy + next, 'swap');
}

function explainPivot(value) {
    let what = `Selecting pivot: ${value} (highlighted in red). `;
    let why = "This value acts as the benchmark for partitioning the array into smaller and larger sections. ";
    let analogy = "Like picking a 'benchmark price' at an auction — everything cheaper goes left, everything pricier goes right. ";
    let next = "Next, every other element will be compared against this pivot.";
    addExplanation(what + why + analogy + next, 'pivot');
}

function explainSorted(value, position) {
    let what = `Element ${value} has reached its final sorted position at index ${position} (bar turns green). `;
    let why = "We have mathematically proven that no other unsorted element belongs here. ";
    let analogy = "";
    let next = "Next, the algorithm will ignore this element and focus on the remaining unsorted parts.";

    switch(currentAlgorithm) {
        case 'bubble-sort':
            analogy = "Just like a bubble finally reaching the surface — it will never move again. ";
            break;
        case 'selection-sort':
            analogy = "Just like placing the absolute smallest book at the start of the shelf. ";
            break;
        case 'insertion-sort':
            analogy = "Just like finally sliding a card into its perfect, permanent spot in your hand. ";
            break;
        case 'merge-sort':
            analogy = "Like finishing one segment of a perfectly ordered archive. ";
            break;
        case 'quick-sort':
            analogy = "Like finally locking the benchmark item in its correct place among its peers. ";
            break;
        case 'heap-sort':
            analogy = "Like a tournament winner taking their permanent place on the podium. ";
            break;
    }
    addExplanation(what + why + analogy + next, 'sorted');
}

function explainNoSwap() {
    addExplanation("No swap needed. The elements are already in the correct relative order, so we simply move on. Next, the algorithm will check the next set of elements.", 'info');
}

function explainAlgorithmStart(algorithmName) {
    addExplanation(`Starting ${algorithmName}...`, 'algorithm');
}

function explainPassStart(passNumber) {
    let what = `Beginning pass ${passNumber} of the algorithm. `;
    let why = "Each pass brings us closer to a fully sorted state by moving at least one element to its destination. ";
    let analogy = "";
    let next = "This pass will now begin scanning the relevant unsorted section of the array.";

    switch(currentAlgorithm) {
        case 'bubble-sort':
            analogy = "Like solving one row of a puzzle before moving to the next. ";
            break;
        case 'selection-sort':
            analogy = "Like starting a fresh search for the smallest card in your remaining hand. ";
            break;
        case 'insertion-sort':
            analogy = "Like picking up the next unsorted card to find its place in the sorted section. ";
            break;
    }
    addExplanation(what + why + analogy + next, 'algorithm');
}

function explainEarlyTermination() {
    addExplanation(`No swaps detected. The array is already sorted.`, 'algorithm');
}

function explainAlgorithmComplete() {
    const n = currentArray.length;
    let what = `Sorting complete! The array is now fully ordered. `;
    let why = `We finished with ${comparisonCount} comparisons and ${swapCount} swaps. `;
    let analogy = "Like a library where every book is finally in its perfect, searchable home. ";
    let complexity = "";
    
    switch(currentAlgorithm) {
        case 'bubble-sort': complexity = `For this size (${n}), Bubble Sort performed at O(n²) time complexity as expected.`; break;
        case 'selection-sort': complexity = `Selection Sort guaranteed O(n²) performance by scanning for every minimum.`; break;
        case 'insertion-sort': complexity = `Insertion Sort was efficient, with O(n²) worst-case but faster performance on nearly sorted data.`; break;
        case 'merge-sort': complexity = `Merge Sort achieved O(n log n) efficiency by dividing the work symmetrically.`; break;
        case 'quick-sort': complexity = `Quick Sort finished with O(n log n) average efficiency thanks to effective partitioning.`; break;
        case 'heap-sort': complexity = `Heap Sort maintained O(n log n) performance by using the power of a binary heap.`; break;
    }
    
    addExplanation(what + why + analogy + complexity, 'algorithm');
}

// Scroll to visualization and highlight
function scrollToVisualization() {
    if (visualizerContainer) {
        visualizerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            visualizerContainer.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
            setTimeout(() => {
                visualizerContainer.style.boxShadow = '';
            }, 1000);
        }, 500);
    }
}

// Switch tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Load content based on tab
    if (tabName === 'code') {
        displayCode(currentAlgorithm);
    } else if (tabName === 'explanation') {
        showExplanationContent();
    }
}

// Switch language
function switchLanguage(lang) {
    // Update language buttons
    document.querySelectorAll('.lang-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Update code content
    displayCode(currentAlgorithm);
}

// Display code
function displayCode(algorithm) {
    const codeContent = document.getElementById('codeContent');
    const activeLang = document.querySelector('.lang-tab.active').dataset.lang;
    
    const prismLang = { cpp: 'cpp', python: 'python', java: 'java', javascript: 'javascript', c: 'c' };
    const lang = prismLang[activeLang] || 'cpp';
    
    const algorithmData = getAlgorithmData(algorithm);
    if (algorithmData && algorithmData.code[activeLang]) {
        let cleanCode = algorithmData.code[activeLang].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        codeContent.innerHTML = `<pre><code class="language-${lang}">${cleanCode}</code></pre>`;
    } else {
        codeContent.innerHTML = `<pre><code class="language-${lang}">// Code for ${algorithm} in ${activeLang} will be displayed here.</code></pre>`;
    }
    if (typeof Prism !== 'undefined') Prism.highlightAll();
    
    // Manually attach copy button since observer is removed
    if (typeof window.attachCopyBtn === 'function') {
        window.attachCopyBtn();
    }
}

// Get algorithm data
function getAlgorithmData(algorithm) {
    const algorithmDatabase = {
        'bubble-sort': {
            name: 'Bubble Sort',
            code: {
                cpp: `void bubbleSort(int arr[], int n) {
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
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
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
            code: {
                cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
                python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
                java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
                javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) {
        let minIdx = i;
        for (let j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
}`,
                c: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`
            }
        },
        'insertion-sort': {
            name: 'Insertion Sort',
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
        while j >= 0 and arr[j] > key:
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
            code: {
                cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
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
            if left[i] <= right[j]:
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
    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
                javascript: `function merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = new Array(n1);
    const R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
function mergeSort(arr, l, r) {
    if (l < r) {
        const m = Math.floor((l + r) / 2);
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
                c: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
            }
        },
        'quick-sort': {
            name: 'Quick Sort',
            code: {
                cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
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
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
                python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
                java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
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
}
void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
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
}
function quickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
                c: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
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
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
            }
        },
        'heap-sort': {
            name: 'Heap Sort',
            code: {
                cpp: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
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
        heapify(arr, n, largest)
def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)`,
                java: `void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}
void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
                javascript: `function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}
function heapSort(arr) {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
}`,
                c: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`
            }
        }
    };
    
    return algorithmDatabase[algorithm];
}

// Show explanation content
function showExplanationContent() {
    const explanationContent = document.getElementById('explanationContent');
    const explainBtn = document.getElementById('explainBtn');
    
    if (currentAlgorithm && explanationContent) {
        const algorithmName = algorithms.sorting.find(algo => algo.value === currentAlgorithm).name;
        explanationContent.innerHTML = `
            <h3>Step-by-Step Explanation</h3>
            <p>Click "Explain with Example" to see a detailed step-by-step walkthrough of ${algorithmName}.</p>
            <button id="explainBtn" class="btn btn-primary">Explain with Example</button>
        `;
        
        // Re-attach event listener to the new button
        const newExplainBtn = document.getElementById('explainBtn');
        if (newExplainBtn) {
            newExplainBtn.addEventListener('click', showAIExplanation);
        }
    }
}

// Show AI explanation
function showAIExplanation() {
    if (!currentAlgorithm) {
        console.error('No algorithm selected');
        return;
    }
    
    const explanationContent = document.getElementById('explanationContent');
    if (!explanationContent) {
        console.error("Explanation container not found");
        return;
    }

    const algorithmName = algorithms.sorting.find(algo => algo.value === currentAlgorithm);
    if (!algorithmName) {
        console.error('Algorithm not found:', currentAlgorithm);
        return;
    }
    
    // Generate explanation based on selected algorithm
    const explanation = generateAlgorithmExplanation(currentAlgorithm, algorithmName.name);
    
    explanationContent.innerHTML = explanation;
}

// Generate algorithm explanation
function generateAlgorithmExplanation(algorithm, algorithmName) {
    switch (algorithm) {
        case 'bubble-sort':
            return generateBubbleSortExplanation(algorithmName);
        case 'selection-sort':
            return generateSelectionSortExplanation(algorithmName);
        case 'insertion-sort':
            return generateInsertionSortExplanation(algorithmName);
        case 'merge-sort':
            return generateMergeSortExplanation(algorithmName);
        case 'quick-sort':
            return generateQuickSortExplanation(algorithmName);
        case 'heap-sort':
            return generateHeapSortExplanation(algorithmName);
        default:
            return `<h3>Example: ${algorithmName}</h3>
                    <p>Step-by-step explanation for ${algorithmName} will be implemented soon.</p>`;
    }
}

// Generate Bubble Sort explanation
function generateBubbleSortExplanation(algorithmName) {
    return `
        <h3>Example: ${algorithmName}</h3>
        <div class="algorithm-overview">
            <h4>How ${algorithmName} Works:</h4>
            <p>Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order. The largest elements "bubble" to the end of the array through multiple passes.</p>
        </div>
        
        <div class="example-array">
            <h4>Input Array:</h4>
            <div class="array-display">[12, 11, 13, 5, 6]</div>
        </div>
        
        <div class="step-by-step">
            <h4>Step-by-Step Process:</h4>
            <div class="step">
                <h5>Step 1: Compare adjacent elements</h5>
                <p>Compare 12 and 11. Since 12 > 11, swap them.</p>
                <div class="array-display">[11, 12, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 2: Continue comparing</h5>
                <p>Compare 12 and 13. Since 12 < 13, no swap needed.</p>
                <div class="array-display">[11, 12, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 3: Compare and swap</h5>
                <p>Compare 13 and 5. Since 13 > 5, swap them.</p>
                <div class="array-display">[11, 12, 5, 13, 6]</div>
            </div>
            <div class="step">
                <h5>Step 4: Continue process</h5>
                <p>Compare 13 and 6. Since 13 > 6, swap them.</p>
                <div class="array-display">[11, 12, 5, 6, 13]</div>
            </div>
            <div class="step">
                <h5>Step 5: First pass complete</h5>
                <p>Continue with next pass. Compare 12 and 11, then 11 and 5.</p>
                <div class="array-display">[11, 5, 12, 6, 13]</div>
            </div>
            <div class="step">
                <h5>Step 6: Continue until sorted</h5>
                <p>Keep comparing and swapping until no more swaps are needed.</p>
                <div class="array-display">[5, 6, 11, 12, 13]</div>
            </div>
        </div>
        
        <div class="final-result">
            <h4>Final Result:</h4>
            <div class="array-display">[5, 6, 11, 12, 13]</div>
            <p>✅ Array is now fully sorted!</p>
        </div>
        
        <div class="complexity-info">
            <h4>Time Complexity:</h4>
            <div class="complexity-grid">
                <div class="complexity-item">
                    <strong>Best Case:</strong> O(n)
                </div>
                <div class="complexity-item">
                    <strong>Average Case:</strong> O(n²)
                </div>
                <div class="complexity-item">
                    <strong>Worst Case:</strong> O(n²)
                </div>
            </div>
        </div>
        
        <div class="complexity-info">
            <h4>Space Complexity:</h4>
            <div class="complexity-item">O(1)</div>
        </div>
        
        <div class="key-idea">
            <h4>Key Idea:</h4>
            <p>Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.</p>
        </div>
        
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>
    `;
}

// Simulate Bubble Sort for explanation
function simulateBubbleSort(arr) {
    const steps = [];
    const n = arr.length;
    let stepNumber = 1;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        steps.push({
            action: `Pass ${i + 1} - Starting pass through array`,
            array: `[${arr.join(', ')}]`,
            comparison: `Will compare pairs from index 0 to ${n - i - 2}`
        });
        
        for (let j = 0; j < n - i - 1; j++) {
            const comparison = `Compare ${arr[j]} and ${arr[j + 1]}`;
            
            if (arr[j] > arr[j + 1]) {
                steps.push({
                    action: `Swap needed: ${arr[j]} > ${arr[j + 1]}`,
                    array: `[${arr.join(', ')}]`,
                    comparison: `${comparison} → swap because ${arr[j]} > ${arr[j + 1]}`
                });
                
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                
                steps.push({
                    action: `After swap`,
                    array: `[${arr.join(', ')}]`,
                    comparison: `Swapped positions ${j} and ${j + 1}`
                });
            } else {
                steps.push({
                    action: `No swap needed`,
                    array: `[${arr.join(', ')}]`,
                    comparison: `${comparison} → no swap because ${arr[j]} ≤ ${arr[j + 1]}`
                });
            }
        }
        
        // Mark last element as sorted
        if (i < n - 1) {
            steps.push({
                action: `Pass ${i + 1} complete - element ${arr[n - i - 1]} is now in correct position`,
                array: `[${arr.join(', ')}]`,
                comparison: `Largest element has "bubbled" to the end`
            });
        }
        
        if (!swapped) {
            steps.push({
                action: `Early termination - no swaps in pass ${i + 1}`,
                array: `[${arr.join(', ')}]`,
                comparison: `Array is already sorted!`
            });
            break;
        }
    }
    
    return steps;
}

// Generate Selection Sort explanation
function generateSelectionSortExplanation(algorithmName) {
    return `
        <h3>Example: ${algorithmName}</h3>
        <div class="algorithm-overview">
            <h4>How ${algorithmName} Works:</h4>
            <p>Selection Sort divides the array into sorted and unsorted parts. It repeatedly finds the minimum element from the unsorted part and moves it to the sorted part.</p>
        </div>
        
        <div class="example-array">
            <h4>Input Array:</h4>
            <div class="array-display">[12, 11, 13, 5, 6]</div>
        </div>
        
        <div class="step-by-step">
            <h4>Step-by-Step Process:</h4>
            <div class="step">
                <h5>Step 1: Find minimum in unsorted part</h5>
                <p>Find the minimum element in the entire array [12, 11, 13, 5, 6]. Minimum is 5.</p>
                <div class="array-display">[12, 11, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 2: Swap minimum with first element</h5>
                <p>Swap minimum 5 with the first element 12.</p>
                <div class="array-display">[5, 11, 13, 12, 6]</div>
            </div>
            <div class="step">
                <h5>Step 3: Find minimum in remaining unsorted part</h5>
                <p>Find minimum in [11, 13, 12, 6]. Minimum is 6.</p>
                <div class="array-display">[5, 11, 13, 12, 6]</div>
            </div>
            <div class="step">
                <h5>Step 4: Swap minimum with second element</h5>
                <p>Swap minimum 6 with the second element 11.</p>
                <div class="array-display">[5, 6, 13, 12, 11]</div>
            </div>
            <div class="step">
                <h5>Step 5: Continue finding minima</h5>
                <p>Find minimum in [13, 12, 11]. Minimum is 11. Swap with third element.</p>
                <div class="array-display">[5, 6, 11, 12, 13]</div>
            </div>
            <div class="step">
                <h5>Step 6: Final minimum</h5>
                <p>Find minimum in [12, 13]. Minimum is 12. Swap with fourth element.</p>
                <div class="array-display">[5, 6, 11, 12, 13]</div>
            </div>
        </div>
        
        <div class="final-result">
            <h4>Final Result:</h4>
            <div class="array-display">[5, 6, 11, 12, 13]</div>
            <p>✅ Array is now fully sorted!</p>
        </div>
        
        <div class="complexity-info">
            <h4>Time Complexity:</h4>
            <div class="complexity-grid">
                <div class="complexity-item">
                    <strong>Best Case:</strong> O(n²)
                </div>
                <div class="complexity-item">
                    <strong>Average Case:</strong> O(n²)
                </div>
                <div class="complexity-item">
                    <strong>Worst Case:</strong> O(n²)
                </div>
            </div>
        </div>
        
        <div class="complexity-info">
            <h4>Space Complexity:</h4>
            <div class="complexity-item">O(1)</div>
        </div>
        
        <div class="key-idea">
            <h4>Key Idea:</h4>
            <p>Selection Sort repeatedly finds the minimum element from the unsorted part and moves it to the sorted part.</p>
        </div>
        
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>
    `;
}

// Simulate Selection Sort for explanation
function simulateSelectionSort(arr) {
    const steps = [];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        steps.push({
            action: `Finding minimum from index ${i} to ${n - 1}`,
            array: `[${arr.join(', ')}]`,
            comparison: `Current minimum: ${arr[minIdx]} at index ${minIdx}`
        });
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                steps.push({
                    action: `New minimum found`,
                    array: `[${arr.join(', ')}]`,
                    comparison: `${arr[j]} < ${arr[minIdx]} → new minimum at index ${j}`
                });
            }
        }
        
        if (minIdx !== i) {
            steps.push({
                action: `Swap minimum element to position ${i}`,
                array: `[${arr.join(', ')}]`,
                comparison: `Swap ${arr[i]} (index ${i}) with ${arr[minIdx]} (index ${minIdx})`
            });
            
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            
            steps.push({
                action: `After swap`,
                array: `[${arr.join(', ')}]`,
                comparison: `Minimum element now at correct position ${i}`
            });
        } else {
            steps.push({
                action: `Element already in correct position`,
                array: `[${arr.join(', ')}]`,
                comparison: `${arr[i]} is already the minimum`
            });
        }
    }
    
    return steps;
}

// Generate Insertion Sort explanation
function generateInsertionSortExplanation(algorithmName) {
    return `
        <h3>Example: ${algorithmName}</h3>
        <div class="algorithm-overview">
            <h4>How ${algorithmName} Works:</h4>
            <p>Insertion Sort builds the final sorted array one item at a time. It takes each element and inserts it into its correct position in the already sorted part.</p>
        </div>
        
        <div class="example-array">
            <h4>Input Array:</h4>
            <div class="array-display">[12, 11, 13, 5, 6]</div>
        </div>
        
        <div class="step-by-step">
            <h4>Step-by-Step Process:</h4>
            <div class="step">
                <h5>Step 1: Start with second element</h5>
                <p>Take the second element 11. Compare with first element 12.</p>
                <div class="array-display">[11, 12, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 2: Insert in correct position</h5>
                <p>Since 11 < 12, insert 11 before 12.</p>
                <div class="array-display">[11, 12, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 3: Process third element</h5>
                <p>Take third element 13. Compare with sorted part [11, 12]. Find correct position.</p>
                <div class="array-display">[11, 12, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 4: Insert third element</h5>
                <p>Insert 13 after 12. Shift 12 to make space.</p>
                <div class="array-display">[11, 12, 13, 5, 6]</div>
            </div>
            <div class="step">
                <h5>Step 5: Process fourth element</h5>
                <p>Take fourth element 5. Insert into correct position in [11, 12, 13].</p>
                <div class="array-display">[5, 11, 12, 13, 6]</div>
            </div>
            <div class="step">
                <h5>Step 6: Insert fourth element</h5>
                <p>Insert 5 at the beginning. Shift other elements right.</p>
                <div class="array-display">[5, 11, 12, 13, 6]</div>
            </div>
            <div class="step">
                <h5>Step 7: Process fifth element</h5>
                <p>Take fifth element 6. Insert into correct position in [5, 11, 12, 13].</p>
                <div class="array-display">[5, 6, 11, 12, 13]</div>
            </div>
        </div>
        
        <div class="final-result">
            <h4>Final Result:</h4>
            <div class="array-display">[5, 6, 11, 12, 13]</div>
            <p>✅ Array is now fully sorted!</p>
        </div>
        
        <div class="complexity-info">
            <h4>Time Complexity:</h4>
            <div class="complexity-grid">
                <div class="complexity-item">
                    <strong>Best Case:</strong> O(n)
                </div>
                <div class="complexity-item">
                    <strong>Average Case:</strong> O(n²)
                </div>
                <div class="complexity-item">
                    <strong>Worst Case:</strong> O(n²)
                </div>
            </div>
        </div>
        
        <div class="complexity-info">
            <h4>Space Complexity:</h4>
            <div class="complexity-item">O(1)</div>
        </div>
        
        <div class="key-idea">
            <h4>Key Idea:</h4>
            <p>Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position.</p>
        </div>
        
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>
    `;
}

// Simulate Insertion Sort for explanation
function simulateInsertionSort(arr) {
    const steps = [];
    const n = arr.length;
    
    steps.push({
        action: `Start with first element as sorted subarray`,
        array: `[${arr.join(', ')}]`,
        comparison: `[${arr[0]}] is considered sorted`
    });
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        steps.push({
            action: `Insert element ${key} into sorted subarray`,
            array: `[${arr.join(', ')}]`,
            comparison: `Sorted part: [${arr.slice(0, i).join(', ')}], Current element: ${key}`
        });
        
        while (j >= 0 && arr[j] > key) {
            steps.push({
                action: `Shift element ${arr[j]} to the right`,
                array: `[${arr.join(', ')}]`,
                comparison: `${arr[j]} > ${key}, move ${arr[j]} to position ${j + 1}`
            });
            
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
        
        steps.push({
            action: `Place ${key} at correct position`,
            array: `[${arr.join(', ')}]`,
            comparison: `${key} inserted at position ${j + 1}`
        });
    }
    
    return steps;
}

// Placeholder functions for other algorithms
function generateMergeSortExplanation(algorithmName) {
    return `
        <h3>Example: ${algorithmName}</h3>
        <div class="algorithm-overview">
            <h4>How ${algorithmName} Works:</h4>
            <p>Merge Sort divides the array into two halves, recursively sorts each half, and then merges the sorted halves back together.</p>
        </div>
        
        <div class="example-array">
            <h4>Input Array:</h4>
            <div class="array-display">[38, 27, 43, 3, 9, 82, 10]</div>
        </div>
        
        <div class="step-by-step">
            <h4>Step-by-Step Process:</h4>
            <div class="step">
                <h5>Step 1: Divide array into halves</h5>
                <p>Split [38, 27, 43, 3, 9, 82, 10] into two halves.</p>
                <div class="sub-step">
                    <p>Left half: [38, 27, 43]</p>
                    <p>Right half: [3, 9, 82, 10]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 2: Recursively sort left half</h5>
                <p>Sort [38, 27, 43] by dividing and merging.</p>
                <div class="sub-step">
                    <p>Split [38, 27, 43] into [38] and [27, 43]</p>
                    <p>Sort [27, 43] into [27, 43]</p>
                    <p>Merge [38] and [27, 43] into [27, 38, 43]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 3: Recursively sort right half</h5>
                <p>Sort [3, 9, 82, 10] by dividing and merging.</p>
                <div class="sub-step">
                    <p>Split [3, 9, 82, 10] into [3, 9] and [82, 10]</p>
                    <p>Sort [3, 9] into [3, 9]</p>
                    <p>Sort [82, 10] into [10, 82]</p>
                    <p>Merge [3, 9] and [10, 82] into [3, 9, 10, 82]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 4: Merge sorted halves</h5>
                <p>Merge [27, 38, 43] and [3, 9, 10, 82] into final sorted array.</p>
                <div class="sub-step">
                    <p>Compare 27 and 3 → Place 3 (smaller) into merged array</p>
                    <p>Compare 27 and 9 → Place 9 (smaller) into merged array</p>
                    <p>Compare 27 and 10 → Place 10 (smaller) into merged array</p>
                    <p>Compare 27 and 82 → Place 27 (smaller) into merged array</p>
                    <p>Compare 38 and 82 → Place 38 (smaller) into merged array</p>
                    <p>Compare 43 and 82 → Place 43 (smaller) into merged array</p>
                    <p>Compare 82 and 82 → Place 82 (equal) into merged array</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 4: Continue merging larger sorted subarrays</h5>
                <p>Merge the remaining sorted subarrays:</p>
                <div class="sub-step">
                    <p>Merge [10, 27, 38] with [9, 82] → [9, 10, 27, 38, 82]</p>
                    <p>Merge [9, 10, 27, 38, 82] with [43] → [9, 10, 27, 38, 43, 82]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 5: Final merge to produce fully sorted array</h5>
                <p>Complete the final merge:</p>
                <div class="sub-step">
                    <p>Merge [9, 10, 27, 38, 43, 82] with [3] → [3, 9, 10, 27, 38, 43, 82]</p>
                </div>
            </div>
        </div>
        
        <div class="final-result">
            <h4>Final Result:</h4>
            <div class="array-display">[3, 9, 10, 27, 38, 43, 82]</div>
            <p>✅ Array is now fully sorted!</p>
        </div>
        
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>
    `;
}

function generateQuickSortExplanation(algorithmName) {
    return `
        <h3>Example: ${algorithmName}</h3>
        <div class="algorithm-overview">
            <h4>How ${algorithmName} Works:</h4>
            <p>Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the subarrays.</p>
        </div>
        
        <div class="example-array">
            <h4>Input Array:</h4>
            <div class="array-display">[10, 7, 8, 9, 1, 5]</div>
        </div>
        
        <div class="step-by-step">
            <h4>Step-by-Step Process:</h4>
            <div class="step">
                <h5>Step 1: Choose Pivot</h5>
                <p>Select pivot element (last element: 5).</p>
                <div class="sub-step">
                    <p>Array: [10, 7, 8, 9, 1, <strong>5</strong>]</p>
                    <p>Pivot = 5</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 2: Partition around pivot</h5>
                <p>Compare each element with pivot and rearrange.</p>
                <div class="sub-step">
                    <p>Compare 10 with 5 → 10 > 5, move to right</p>
                    <p>Compare 7 with 5 → 7 > 5, move to right</p>
                    <p>Compare 8 with 5 → 8 > 5, move to right</p>
                    <p>Compare 9 with 5 → 9 > 5, move to right</p>
                    <p>Compare 1 with 5 → 1 < 5, move to left</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 3: Place pivot in correct position</h5>
                <p>Move pivot to its final position.</p>
                <div class="sub-step">
                    <p>After partition: [1, 5, 10, 7, 8, 9]</p>
                    <p>Pivot 5 is now at correct position</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 4: Recursively sort left subarray</h5>
                <p>Sort [1] using Quick Sort.</p>
                <div class="sub-step">
                    <p>Left subarray [1] is already sorted</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 5: Recursively sort right subarray</h5>
                <p>Sort [10, 7, 8, 9] using Quick Sort.</p>
                <div class="sub-step">
                    <p>Choose pivot 9, partition: [7, 8, 9, 10]</p>
                    <p>Pivot 9 moves to position: [7, 8, 9, 10]</p>
                    <p>Sort left [7, 8] and right [10]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 6: Continue recursive sorting</h5>
                <p>Continue sorting until all subarrays are sorted.</p>
                <div class="sub-step">
                    <p>Sort [7, 8] → pivot 8 → [7, 8]</p>
                    <p>Sort [10] → already sorted</p>
                    <p>Final merge: [7, 8, 9, 10]</p>
                </div>
            </div>
        </div>
        
        <div class="final-result">
            <h4>Final Result:</h4>
            <div class="array-display">[1, 5, 7, 8, 9, 10]</div>
            <p>✅ Array is now fully sorted!</p>
        </div>
        
        <div class="complexity-info">
            <h4>Time Complexity:</h4>
            <div class="complexity-grid">
                <div class="complexity-item">
                    <strong>Best Case:</strong> O(n log n)
                </div>
                <div class="complexity-item">
                    <strong>Average Case:</strong> O(n log n)
                </div>
                <div class="complexity-item">
                    <strong>Worst Case:</strong> O(n²)
                </div>
            </div>
        </div>
        
        <div class="complexity-info">
            <h4>Space Complexity:</h4>
            <div class="complexity-item">O(log n)</div>
        </div>
        
        <div class="key-idea">
            <h4>Key Idea:</h4>
            <p>Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the subarrays.</p>
        </div>
        
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>
    `;
}

function generateHeapSortExplanation(algorithmName) {
    return `
        <h3>Example: ${algorithmName}</h3>
        <div class="algorithm-overview">
            <h4>How ${algorithmName} Works:</h4>
            <p>Heap Sort builds a max heap from the array, then repeatedly extracts the maximum element and rebuilds the heap.</p>
        </div>
        
        <div class="example-array">
            <h4>Input Array:</h4>
            <div class="array-display">[12, 11, 13, 5, 6, 7]</div>
        </div>
        
        <div class="step-by-step">
            <h4>Step-by-Step Process:</h4>
            <div class="step">
                <h5>Step 1: Build Max Heap</h5>
                <p>Convert [12, 11, 13, 5, 6, 7] into max heap structure.</p>
                <div class="sub-step">
                    <p>Start from last non-leaf node and heapify upwards.</p>
                    <p>Compare 13 with children 5, 6 → 13 is largest, no swap</p>
                    <p>Compare 11 with children 5, 6 → 11 is largest, no swap</p>
                    <p>Compare 12 with children 11, 13 → 13 is larger, swap 12 and 13</p>
                    <p>After heapify: [13, 11, 12, 5, 6, 7]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 2: Extract Maximum Element</h5>
                <p>Swap root (maximum) with last element and reduce heap size.</p>
                <div class="sub-step">
                    <p>Swap 13 and 7 → [7, 11, 12, 5, 6, 13]</p>
                    <p>Maximum 13 is now at sorted position</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 3: Rebuild Heap</h5>
                <p>Restore heap property with remaining elements.</p>
                <div class="sub-step">
                    <p>Heapify [7, 11, 12, 5, 6] with new root 12</p>
                    <p>Compare 12 with children 5, 6 → 12 is largest, no swap</p>
                    <p>Compare 11 with children 5, 6 → 11 is largest, no swap</p>
                    <p>Heap rebuilt: [12, 11, 6, 5, 7]</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 4: Extract Next Maximum</h5>
                <p>Swap root (maximum) with last unsorted element.</p>
                <div class="sub-step">
                    <p>Swap 12 and 6 → [6, 11, 5, 7, 12]</p>
                    <p>Maximum 12 is now at sorted position</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 5: Continue Extracting Maximum</h5>
                <p>Repeat process until heap is empty.</p>
                <div class="sub-step">
                    <p>Heapify [6, 11, 5, 7] with new root 11</p>
                    <p>Swap 11 and 7 → [7, 6, 5, 11]</p>
                    <p>Maximum 11 is now at sorted position</p>
                </div>
            </div>
            <div class="step">
                <h5>Step 6: Final Extraction</h5>
                <p>Extract remaining elements in order.</p>
                <div class="sub-step">
                    <p>Swap 7 and 6 → [6, 5, 7, 11]</p>
                    <p>Swap 7 and 5 → [5, 6, 7, 11]</p>
                    <p>Maximum 7 is now at sorted position</p>
                </div>
            </div>
        </div>
        
        <div class="final-result">
            <h4>Final Result:</h4>
            <div class="array-display">[5, 6, 7, 11, 12, 13]</div>
            <p>✅ Array is now fully sorted!</p>
        </div>
        
        <div class="complexity-info">
            <h4>Time Complexity:</h4>
            <div class="complexity-grid">
                <div class="complexity-item">
                    <strong>Best Case:</strong> O(n log n)
                </div>
                <div class="complexity-item">
                    <strong>Average Case:</strong> O(n log n)
                </div>
                <div class="complexity-item">
                    <strong>Worst Case:</strong> O(n log n)
                </div>
            </div>
        </div>
        
        <div class="complexity-info">
            <h4>Space Complexity:</h4>
            <div class="complexity-item">O(1)</div>
        </div>
        
        <div class="key-idea">
            <h4>Key Idea:</h4>
            <p>Heap Sort builds a max heap from the array, then repeatedly extracts the maximum element and rebuilds the heap.</p>
        </div>
        
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>
    `;
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('active');
    stopAnimation();
    currentAlgorithm = '';
}

// Start visualization
function startVisualization() {
    console.log('Start visualization clicked');
    console.log('Current algorithm:', currentAlgorithm);
    
    if (!currentAlgorithm) {
        alert('Please select an algorithm first!');
        return;
    }
    
    console.log('Starting visualization for:', currentAlgorithm);
    
    // Reset counters and clear explanation before starting
    stepCount = 0;
    comparisonCount = 0;
    swapCount = 0;
    updateStepDisplay();
    clearExplanation();
    
    // Set animation state
    window.AlgoViz.isAnimating = true;
    window.AlgoViz.isPaused = false;
    console.log('Animation state set:', window.AlgoViz.isAnimating);
    
    disableControls(true);
    
    // Scroll to visualization and highlight
    scrollToVisualization();
    
    // Create visualizer instance
    if (!(visualizer instanceof Visualizer)) {
        console.log('Creating new visualizer instance');
        visualizer = new Visualizer('visualizer');
    }
    
    // Reset all bar colors to default (unsorted)
    if (visualizer.bars && visualizer.bars.length > 0) {
        visualizer.bars.forEach(bar => {
            bar.classList.remove('comparing', 'swapping', 'pivot', 'sorted', 'searching');
            bar.className = 'visualizer-bar';
        });
    }
    
    console.log('Initializing array:', currentArray);
    visualizer.initializeArray(currentArray);
    
    // Run selected algorithm
    console.log('Running algorithm...');
    runAlgorithm(currentAlgorithm);
}

// Run algorithm
async function runAlgorithm(algorithm) {
    console.log('Running algorithm:', algorithm);
    
    try {
        switch (algorithm) {
            case 'bubble-sort':
                await bubbleSort(currentArray, visualizer);
                break;
            case 'selection-sort':
                await selectionSort(currentArray, visualizer);
                break;
            case 'insertion-sort':
                await insertionSort(currentArray, visualizer);
                break;
            case 'merge-sort':
                await mergeSort(currentArray, visualizer, 0, currentArray.length - 1);
                break;
            case 'quick-sort':
                await quickSort(currentArray, visualizer, 0, currentArray.length - 1);
                break;
            case 'heap-sort':
                await heapSort(currentArray, visualizer);
                break;
            default:
                console.log('Algorithm not implemented yet:', algorithm);
        }
    } catch (error) {
        console.error('Error running algorithm:', error);
    } finally {
        stopAnimation();
    }
}

// Bubble Sort implementation
async function bubbleSort(arr, visualizer) {
    console.log('Bubble sort started with array:', arr);
    const n = arr.length;
    
    explainAlgorithmStart('Bubble Sort');
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        console.log(`Pass ${i + 1}`);
        
        explainPassStart(i + 1);
        
        for (let j = 0; j < n - i - 1; j++) {
            // Check if animation is paused
            while (window.AlgoViz.isPaused) {
                await window.AlgoViz.delay(100);
            }
            
            // Check if animation is stopped
            if (!window.AlgoViz.isAnimating) {
                console.log('Animation stopped');
                return;
            }
            
            console.log(`Comparing elements at positions ${j} and ${j + 1}: ${arr[j]} and ${arr[j + 1]}`);
            
            // Highlight comparing bars
            visualizer.highlightBars([j, j + 1], 'comparing');
            incrementStep();
            incrementComparisons();
            explainComparison(arr[j], arr[j + 1]);
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            // Check if animation is paused after delay
            while (window.AlgoViz.isPaused) {
                await window.AlgoViz.delay(100);
            }
            
            // Check if animation is stopped
            if (!window.AlgoViz.isAnimating) {
                console.log('Animation stopped');
                return;
            }
            
            if (arr[j] > arr[j + 1]) {
                console.log(`Swapping ${arr[j]} and ${arr[j + 1]}`);
                // Show swapping color
                visualizer.highlightBars([j, j + 1], 'swapping');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                
                // Check if animation is paused after swap delay
                while (window.AlgoViz.isPaused) {
                    await window.AlgoViz.delay(100);
                }
                
                // Check if animation is stopped
                if (!window.AlgoViz.isAnimating) {
                    console.log('Animation stopped');
                    return;
                }
                
                // Swap bars - visualizer will handle the array update
                visualizer.swapBars(j, j + 1);
                // Update local array to match visualizer
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                incrementSwaps();
                incrementStep();
                explainSwap(arr[j + 1], arr[j], `${arr[j + 1]} > ${arr[j]}`);
                
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                
                // Check if animation is paused after final delay
                while (window.AlgoViz.isPaused) {
                    await window.AlgoViz.delay(100);
                }
                
                // Check if animation is stopped
                if (!window.AlgoViz.isAnimating) {
                    console.log('Animation stopped');
                    return;
                }
            }
            
            // Unhighlight bars
            visualizer.unhighlightBars([j, j + 1]);
        }
        
        // Mark last element of this pass as sorted
        visualizer.highlightBars([n - i - 1], 'sorted');
        incrementStep();
        explainSorted(arr[n - i - 1], n - i - 1);
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Check if animation is paused after pass completion
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        // If no swaps occurred, array is already sorted
        if (!swapped) {
            console.log('No swaps occurred, array is sorted');
            explainEarlyTermination();
            break;
        }
    }
    
    explainAlgorithmComplete();
    console.log('Bubble sort completed');
    for (let i = 0; i < n; i++) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        visualizer.highlightBars([i], 'sorted');
        await window.AlgoViz.delay(50); // Small delay for visual effect
    }
    
    console.log('Bubble sort completed');
}

// Selection Sort implementation
async function selectionSort(arr, visualizer) {
    const n = arr.length;
    
    explainAlgorithmStart('Selection Sort');
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        // Start finding minimum from index i
        incrementStep();
        addExplanation(`Starting search for the minimum value from index ${i}. We need to find the smallest element in the unsorted section to move it to the front. Like scanning a hand of cards to find the absolute lowest one. Next, we will compare the current minimum with every other element in this range.`, 'info');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Highlight current minimum position
        visualizer.highlightBars([minIdx], 'comparing');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        for (let j = i + 1; j < n; j++) {
            // Check if animation is paused
            while (window.AlgoViz.isPaused) {
                await window.AlgoViz.delay(100);
            }
            
            // Check if animation is stopped
            if (!window.AlgoViz.isAnimating) {
                console.log('Animation stopped');
                return;
            }
            
            // Compare arr[j] with current minimum
            visualizer.highlightBars([j], 'comparing');
            incrementComparisons();
            incrementStep();
            addExplanation(`Comparing ${arr[j]} with current minimum ${arr[minIdx]}. We are checking if this element is even smaller than what we've found so far. Like finding a smaller card in your hand as you scan. Next, if ${arr[j]} < ${arr[minIdx]}, we'll update our target.`, 'comparison');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (arr[j] < arr[minIdx]) {
                // New minimum found
                if (minIdx !== i) visualizer.unhighlightBars([minIdx]);
                minIdx = j;
                incrementStep();
                addExplanation(`New minimum found: ${arr[j]} at index ${j}. We have updated our target for the final swap of this pass. Like keeping your finger on the lowest card you've seen so far. Next, we'll continue scanning the rest of the array.`, 'info');
                visualizer.highlightBars([minIdx], 'comparing');
            } else {
                visualizer.unhighlightBars([j]);
            }
        }
        
        // Swap if minimum is not at position i
        if (minIdx !== i) {
            visualizer.unhighlightBars([minIdx]);
            visualizer.swapBars(i, minIdx);
            // Update the array to match the visualization
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            incrementSwaps();
            incrementStep();
            addExplanation(`Swapping element at index ${i} with the minimum element found (${arr[minIdx]}). We are placing the smallest value at the very start of the unsorted section. Like picking the lowest card and moving it to the front. Next, index ${i} will be locked as sorted.`, 'swap');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        } else {
            incrementStep();
            addExplanation(`Element ${arr[i]} is already at the correct position. No swap was needed because it was already the minimum. Like finding that the first card in your hand was already the lowest. Next, we'll lock this position and move to the next.`, 'info');
        }
        
        // Mark position i as sorted
        visualizer.highlightBars([i], 'sorted');
        incrementStep();
        addExplanation(`Element ${arr[i]} has reached its final sorted position at index ${i}. Just like placing the smallest book at the start of the shelf — it will never be moved again. Next, we search for the next smallest value.`, 'sorted');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Check if animation is paused after each iteration
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
    }
    
    // Mark last element as sorted
    visualizer.highlightBars([n - 1], 'sorted');
    incrementStep();
    addExplanation(`Element ${arr[n - 1]} has reached its final sorted position at index ${n - 1}. Every element has now been correctly placed. Like finally finishing your ordered hand of cards. Next, the algorithm will complete.`, 'sorted');
    
    explainAlgorithmComplete();
    console.log('Selection sort completed');
}

// Insertion Sort implementation
async function insertionSort(arr, visualizer) {
    const n = arr.length;
    
    explainAlgorithmStart('Insertion Sort');
    
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        // Start inserting element at index i
        incrementStep();
        addExplanation(`Inserting element ${key} at position ${i}. We need to find where this value belongs in the sorted section on the left. Like sorting playing cards in your hand one by one. Next, we will compare it with elements to its left.`, 'info');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Highlight the key element
        visualizer.highlightBars([i], 'comparing');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Move elements greater than key to one position ahead
        while (j >= 0) {
            // Check if animation is paused
            while (window.AlgoViz.isPaused) {
                await window.AlgoViz.delay(100);
            }
            
            // Check if animation is stopped
            if (!window.AlgoViz.isAnimating) {
                console.log('Animation stopped');
                return;
            }
            
            // Compare arr[j] with key
            visualizer.highlightBars([j], 'comparing');
            incrementComparisons();
            incrementStep();
            addExplanation(`Comparing ${arr[j]} with key ${key}. We're checking if we need to shift this element right to make space for the key. Like checking if a card in your hand belongs to the right of your new card. Next, if ${arr[j]} > ${key}, we'll shift it over.`, 'comparison');
            await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            
            if (arr[j] > key) {
                // Move element to the right
                arr[j + 1] = arr[j];
                visualizer.updateBar(j + 1, arr[j]);
                incrementSwaps();
                incrementStep();
                addExplanation(`Moving ${arr[j]} to position ${j + 1}. We are shifting elements right to create a gap for the key. Like sliding cards over to make room for a new one. Next, we'll check the next element to the left.`, 'swap');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
                visualizer.unhighlightBars([j]);
                j--;
            } else {
                visualizer.unhighlightBars([j]);
                break;
            }
        }
        
        // Place key at its correct position
        arr[j + 1] = key;
        visualizer.updateBar(j + 1, key);
        incrementStep();
        addExplanation(`Placing key ${key} at position ${j + 1}. The element has found its correct relative home in the sorted section. Like finally sliding a card into its perfect spot in your hand. Next, we'll pick the next unsorted element from the right.`, 'sorted');
        visualizer.unhighlightBars([i]);
        
        // Mark sorted portion
        for (let k = 0; k <= i; k++) {
            visualizer.highlightBars([k], 'sorted');
        }
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Check if animation is paused after each iteration
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
    }
    
    explainAlgorithmComplete();
    console.log('Insertion sort completed');
}

// Merge Sort implementation
async function mergeSort(arr, visualizer, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Explain division step
        incrementStep();
        addExplanation(`Dividing array from index ${left} to ${right}. We are breaking the problem into smaller, manageable sub-problems. Like splitting a giant stack of documents into smaller piles. Next, we will recursively sort each half.`, 'info');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Highlight the division point
        for (let i = left; i <= right; i++) {
            visualizer.highlightBars([i], 'comparing');
        }
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        visualizer.unhighlightBars(Array.from({length: right - left + 1}, (_, i) => left + i));
        
        await mergeSort(arr, visualizer, left, mid);
        await mergeSort(arr, visualizer, mid + 1, right);
        await merge(arr, visualizer, left, mid, right);
    }
}

async function merge(arr, visualizer, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    // Explain merge step
    incrementStep();
    addExplanation(`Merging left subarray and right subarray. We are combining two sorted portions into a single ordered list. Like merging two sorted piles of documents into one perfectly ordered pile. Next, we will compare the top elements of each pile.`, 'info');
    await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
    
    let i = 0, j = 0, k = left;
    
    // Check if animation is paused
    while (window.AlgoViz.isPaused) {
        await window.AlgoViz.delay(100);
    }
    
    // Check if animation is stopped
    if (!window.AlgoViz.isAnimating) {
        console.log('Animation stopped');
        return;
    }
    
    while (i < leftArr.length && j < rightArr.length) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        // Compare elements from left and right subarrays
        visualizer.highlightBars([k], 'comparing');
        incrementComparisons();
        incrementStep();
        addExplanation(`Comparing ${leftArr[i]} (left) and ${rightArr[j]} (right). We need to see which value is smaller to place it next. Like checking the top documents of two sorted stacks. Next, the smaller value will be added to our combined pile.`, 'comparison');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            incrementSwaps();
            incrementStep();
            addExplanation(`Placing smaller element ${leftArr[i]} from the left pile at position ${k}. This value belongs before any remaining elements in the right pile. Like picking the next document for our stack. Next, we'll compare the next pair.`, 'sorted');
            i++;
        } else {
            arr[k] = rightArr[j];
            incrementSwaps();
            incrementStep();
            addExplanation(`Placing smaller element ${rightArr[j]} from the right pile at position ${k}. This value belongs before any remaining elements in the left pile. Like picking the next document for our stack. Next, we'll compare the next pair.`, 'sorted');
            j++;
        }
        
        visualizer.updateBar(k, arr[k]);
        visualizer.highlightBars([k], 'sorted');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        visualizer.unhighlightBars([k]);
        k++;
    }
    
    // Copy remaining elements from left subarray
    while (i < leftArr.length) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        incrementSwaps();
        incrementStep();
        addExplanation(`Placing remaining element ${leftArr[i]} from the left subarray. Since the right pile is empty, all remaining left elements are already sorted. Like adding the rest of a stack once the other pile is finished. Next, we'll complete this merge segment.`, 'sorted');
        arr[k] = leftArr[i];
        visualizer.updateBar(k, arr[k]);
        visualizer.highlightBars([k], 'sorted');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        visualizer.unhighlightBars([k]);
        i++;
        k++;
    }
    
    // Copy remaining elements from right subarray
    while (j < rightArr.length) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        incrementSwaps();
        incrementStep();
        addExplanation(`Placing remaining element ${rightArr[j]} from the right subarray. Since the left pile is empty, all remaining right elements are already sorted. Like adding the rest of a stack once the other pile is finished. Next, we'll complete this merge segment.`, 'sorted');
        arr[k] = rightArr[j];
        visualizer.updateBar(k, arr[k]);
        visualizer.highlightBars([k], 'sorted');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        visualizer.unhighlightBars([k]);
        j++;
        k++;
    }
    
    // Mark merged segment as sorted
    incrementStep();
    addExplanation(`Merging completed for segment from index ${left} to ${right}. This section of the array is now perfectly ordered. Like finishing one segment of a giant archive. Next, we'll merge this with another sorted section.`, 'info');
    for (let i = left; i <= right; i++) {
        visualizer.highlightBars([i], 'sorted');
    }
    await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
}

async function quickSort(arr, visualizer, low, high) {
    if (low < high) {
        const pi = await partition(arr, visualizer, low, high);
        await quickSort(arr, visualizer, low, pi - 1);
        await quickSort(arr, visualizer, pi + 1, high);
    }

    // After the top-level call completes, mark ALL bars as sorted
    if (low === 0 && high === arr.length - 1) {
        for (let i = 0; i < arr.length; i++) {
            visualizer.highlightBars([i], 'sorted');
        }
        explainAlgorithmComplete();
        console.log('Quick sort completed');
    }
}

async function partition(arr, visualizer, low, high) {
    const pivot = arr[high];
    visualizer.highlightBars([high], 'pivot');
    explainPivot(pivot);
    incrementStep();
    await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        visualizer.highlightBars([j], 'comparing');
        incrementComparisons();
        incrementStep();
        addExplanation(`Comparing ${arr[j]} with pivot ${pivot}. We are deciding if this item belongs on the 'cheaper' (left) or 'pricier' (right) side of the pivot. Like sorting items around a benchmark price. Next, if it's smaller, we'll move it to the left.`, 'comparison');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        if (arr[j] < pivot) {
            i++;
            if (i !== j) {
                visualizer.swapBars(i, j);
                // Update the array to match the visualization
                [arr[i], arr[j]] = [arr[j], arr[i]];
                incrementSwaps();
                incrementStep();
                addExplanation(`Swapping ${arr[j]} and ${arr[i]} because ${arr[j]} < pivot. We are moving this smaller element to the partition on the left. Like placing all cheaper items in the left-hand bin. Next, we'll continue scanning.`, 'swap');
                await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
            }
        }
        
        visualizer.unhighlightBars([j]);
    }
    
    // Place pivot in correct position
    if (i + 1 !== high) {
        visualizer.swapBars(i + 1, high);
        // Update the array to match the visualization
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        incrementSwaps();
        incrementStep();
        addExplanation(`Placing pivot ${pivot} at its final position (${i + 1}). We have successfully partitioned the array around this value. Like finally placing the benchmark item in its correct middle spot. Next, the pivot is locked.`, 'sorted');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
    }
    
    visualizer.unhighlightBars([high]);
    visualizer.highlightBars([i + 1], 'sorted');
    incrementStep();
    addExplanation(`Pivot ${pivot} has reached its correct sorted position. All elements to its left are smaller, and all to its right are larger. Like finally locking a benchmark in place. Next, we'll sort the remaining sub-sections.`, 'sorted');
    return i + 1;
}

// Heap Sort implementation
async function heapSort(arr, visualizer) {
    const n = arr.length;
    
    explainAlgorithmStart('Heap Sort');
    
    // Step 1: Build a Max Heap from the array
    incrementStep();
    addExplanation('Building a max heap from the array. We are organizing elements into a tree where every parent is larger than its children. Like organizing a tournament bracket to find the strongest competitor. Next, the largest value will move to the root.', 'info');
    await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        incrementStep();
        addExplanation(`Heapifying subtree rooted at index ${i}. We are ensuring this section follows the 'max heap' rule where parents are larger than children. Like re-evaluating a branch of a tournament. Next, we'll swap if a child is larger than the parent.`, 'info');
        await heapify(arr, visualizer, n, i);
    }
    
    // Step 2-5: Extract elements from heap and sort
    for (let i = n - 1; i > 0; i--) {
        // Check if animation is paused
        while (window.AlgoViz.isPaused) {
            await window.AlgoViz.delay(100);
        }
        
        // Check if animation is stopped
        if (!window.AlgoViz.isAnimating) {
            console.log('Animation stopped');
            return;
        }
        
        // Step 2: Swap root (largest) with last element
        incrementStep();
        addExplanation(`Moving the current champion (maximum) ${arr[0]} to the sorted end at index ${i}. We extract the largest value to its final home. Like awarding the trophy and removing the winner from the tournament. Next, we will rebuild the heap.`, 'swap');
        visualizer.swapBars(0, i);
        // Update the array to match the visualization
        [arr[0], arr[i]] = [arr[i], arr[0]];
        incrementSwaps();
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Mark the moved element as sorted
        visualizer.highlightBars([i], 'sorted');
        incrementStep();
        addExplanation(`Element ${arr[i]} has reached its final sorted position at index ${i}. This 'champion' has reached its destination. Like a winner taking their place on the podium. Next, we heapify the remaining elements.`, 'sorted');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        // Step 4: Heapify the root again
        incrementStep();
        addExplanation(`Heapifying the root to maintain the max heap property. We need to find the new champion among the remaining elements. Like holding the next round of a tournament. Next, the largest value will rise to the root.`, 'info');
        await heapify(arr, visualizer, i, 0);
    }
    
    // Mark the last element as sorted
    visualizer.highlightBars([0], 'sorted');
    incrementStep();
    addExplanation(`Element ${arr[0]} has reached its final sorted position at the front. The entire array is now sorted. Like every winner taking their spot on the podium. Next, the algorithm will complete.`, 'sorted');
    
    explainAlgorithmComplete();
    console.log('Heap sort completed');
}

async function heapify(arr, visualizer, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Check if animation is paused
    while (window.AlgoViz.isPaused) {
        await window.AlgoViz.delay(100);
    }
    
    // Check if animation is stopped
    if (!window.AlgoViz.isAnimating) {
        console.log('Animation stopped');
        return;
    }
    
    // Compare with left child
    if (left < n) {
        visualizer.highlightBars([left, largest], 'comparing');
        incrementComparisons();
        incrementStep();
        addExplanation(`Comparing parent ${arr[largest]} with left child ${arr[left]}. We must ensure the parent is the strongest member of this group. Like a qualifying match in a tournament. Next, the larger of the two will move up.`, 'comparison');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        if (arr[left] > arr[largest]) {
            largest = left;
        }
        visualizer.unhighlightBars([left]);
    }
    
    // Compare with right child
    if (right < n) {
        visualizer.highlightBars([right, largest], 'comparing');
        incrementComparisons();
        incrementStep();
        addExplanation(`Comparing current largest (${arr[largest]}) with right child ${arr[right]}. We are finding the ultimate winner of this three-way match. Like the final round of a qualifying bracket. Next, the largest will become the new parent.`, 'comparison');
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        if (arr[right] > arr[largest]) {
            largest = right;
        }
        visualizer.unhighlightBars([right]);
    }
    
    // If largest is not the parent, swap and continue heapifying
    if (largest !== i) {
        incrementStep();
        addExplanation(`Swapping parent ${arr[i]} with largest child ${arr[largest]} to maintain the heap property. The stronger competitor must rise to the parent position. Like promoting a winner to the next round. Next, we heapify the affected subtree.`, 'swap');
        visualizer.swapBars(i, largest);
        // Update the array to match the visualization
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        incrementSwaps();
        await window.AlgoViz.delay(window.AlgoViz.getAnimationDelay());
        
        await heapify(arr, visualizer, n, largest);
    }
}

// Pause/Resume visualization
function togglePauseVisualization() {
    if (!window.AlgoViz.isAnimating) return;
    
    if (window.AlgoViz.isPaused) {
        // Resume
        window.AlgoViz.isPaused = false;
        pauseBtn.textContent = 'Pause';
    } else {
        // Pause
        window.AlgoViz.isPaused = true;
        pauseBtn.textContent = 'Resume';
    }
}

// Reset visualization
function resetVisualization() {
    stopAnimation();
    generateNewArray();
    
    // Reset pause button
    pauseBtn.textContent = 'Pause';
    pauseBtn.onclick = togglePauseVisualization;
}

// Stop animation
function stopAnimation() {
    window.AlgoViz.isAnimating = false;
    window.AlgoViz.isPaused = false;
    
    // Reset pause button
    pauseBtn.textContent = 'Pause';
    pauseBtn.onclick = togglePauseVisualization;
    
    // Re-enable all controls
    disableControls(false);
}

// Disable/enable controls
function disableControls(disabled) {
    if (generateBtn) generateBtn.disabled = disabled;
    if (startBtn) startBtn.disabled = disabled;
    // Never disable pause button
    if (resetBtn) resetBtn.disabled = disabled;
    if (arraySizeSlider) arraySizeSlider.disabled = disabled;
    
    // Keep animation speed adjustable during animation
    if (speedSlider) speedSlider.disabled = false;
}

// Load script dynamically
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
}

// Load algorithm information
function loadAlgorithmInfo(algorithm) {
    const theoryContent = document.getElementById('theoryContent');
    const theoryData = algorithmTheory[algorithm];
    
    if (theoryData) {
        theoryContent.innerHTML = `
            <h3>${theoryData.title}</h3>
            <div class="algorithm-definition">
                <h4>Definition</h4>
                <p>${theoryData.definition}</p>
            </div>
            <div class="algorithm-working">
                <h4>How it Works</h4>
                <p>${theoryData.working}</p>
            </div>
            <div class="algorithm-complexity">
                <h4>Time Complexity</h4>
                <ul>
                    <li><strong>Best:</strong> ${theoryData.complexity.best}</li>
                    <li><strong>Average:</strong> ${theoryData.complexity.average}</li>
                    <li><strong>Worst:</strong> ${theoryData.complexity.worst}</li>
                </ul>
                <h4>Space Complexity</h4>
                <ul>
                    <li>${theoryData.space}</li>
                </ul>
                <h4>Use Cases</h4>
                <p>${theoryData.useCases}</p>
            </div>
        `;
    } else {
        theoryContent.innerHTML = '<p>Theory information not available for this algorithm.</p>';
    }
}

function getAlgorithmDefinition(algorithm) {
    const definitions = {
        'bubble-sort': 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        'selection-sort': 'Selection Sort is an in-place comparison sorting algorithm that divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted.',
        'insertion-sort': 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time by inserting each element into its proper position.',
        'merge-sort': 'Merge Sort is a divide and conquer algorithm that divides the array into two halves, recursively sorts them, and then merges the sorted halves.',
        'quick-sort': 'Quick Sort is a divide and conquer algorithm that picks an element as pivot and partitions the array around the pivot.',
        'heap-sort': 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure to sort elements.'
    };
    return definitions[algorithm] || 'Algorithm definition will be displayed here.';
}

// Get algorithm working explanation
function getAlgorithmWorking(algorithm) {
    const working = {
        'bubble-sort': 'The algorithm repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until no swaps are needed.',
        'selection-sort': 'The algorithm finds the minimum element from the unsorted part and puts it at the beginning. This process is repeated for the remaining unsorted elements.',
        'insertion-sort': 'The algorithm builds the final sorted array one item at a time. It takes each element and inserts it into its proper position in the already sorted part of the array.',
        'merge-sort': 'The algorithm divides the array into two halves, recursively sorts each half, and then merges the sorted halves back together.',
        'quick-sort': 'The algorithm selects a pivot element and partitions the array around it, placing smaller elements before and larger elements after the pivot.',
        'heap-sort': 'The algorithm first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end of the array.'
    };
    return working[algorithm] || 'Working explanation will be displayed here.';
}

// Get complexity information
function getComplexity(algorithm, type) {
    const complexities = {
        'bubble-sort': { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        'selection-sort': { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
        'insertion-sort': { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        'merge-sort': { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        'quick-sort': { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
        'heap-sort': { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }
    };
    return complexities[algorithm]?.[type] || 'Complexity information';
}

// Get space complexity
function getSpaceComplexity(algorithm) {
    const spaceComplexities = {
        'bubble-sort': 'O(1)',
        'selection-sort': 'O(1)',
        'insertion-sort': 'O(1)',
        'merge-sort': 'O(n)',
        'quick-sort': 'O(log n)',
        'heap-sort': 'O(1)'
    };
    return spaceComplexities[algorithm] || 'Space complexity information';
}

// Get use cases
function getUseCases(algorithm) {
    const useCases = {
        'bubble-sort': 'Educational purposes and small datasets where simplicity is preferred over efficiency.',
        'selection-sort': 'Small datasets and situations where memory writes are expensive.',
        'insertion-sort': 'Small datasets and nearly sorted arrays. Also used as part of more complex algorithms like Timsort.',
        'merge-sort': 'Large datasets and external sorting where stable sorting is required.',
        'quick-sort': 'General purpose sorting, especially for large datasets where average case performance is important.',
        'heap-sort': 'Situations where guaranteed O(n log n) performance is required and memory usage is a concern.'
    };
    return useCases[algorithm] || 'Use cases information';
}

// Show algorithm theory
function showAlgorithmTheory(algorithm) {
    if (typeof openAlgorithmModal === 'function') {
        openAlgorithmModal(algorithm);
    }
}

// Expose functions globally for inline HTML onclick handlers
window.openAlgorithmModal = openAlgorithmModal;
window.showAlgorithmTheory = showAlgorithmTheory;
