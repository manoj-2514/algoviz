// Searching Visualizer Main Controller - Updated Version 2.0

let currentArray = [];
let currentAlgorithm = "";
let visualizer;

// Animation state
window.SearchAnim = {
    isAnimating: false,
    isPaused: false,
    animationSpeed: 5
};

window.stepCount = 0;
window.comparisonCount = 0;

console.log("Searching Visualizer v2.0 - Loaded with complete code implementations");

let modal;
let searchValueInput;
let startBtn;
let generateBtn;
let arraySizeSlider;
let speedSlider;
let pauseBtn;
let resetBtn;

document.addEventListener("DOMContentLoaded", () => {

    modal = document.getElementById("algorithmModal");
    searchValueInput = document.getElementById("searchValue");
    startBtn = document.getElementById("startBtn");
    generateBtn = document.getElementById("generateBtn");
    arraySizeSlider = document.getElementById("arraySize");
    speedSlider = document.getElementById("speed");
    pauseBtn = document.getElementById("pauseBtn");
    resetBtn = document.getElementById("resetBtn");

    visualizer = new Visualizer("visualizer");

    generateArray();

    // Algorithm buttons
    document.querySelectorAll(".visualize-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            currentAlgorithm = btn.dataset.algorithm;

            modal.style.display = "block";

            // Load theory + AI explanation
            loadTheory(currentAlgorithm);

            // Show / Hide Binary Search counters
            const low = document.getElementById("leftIndex").parentElement;
            const mid = document.getElementById("midIndex").parentElement;
            const high = document.getElementById("rightIndex").parentElement;

            if (currentAlgorithm === "binary-search") {
                low.style.display = "flex";
                mid.style.display = "flex";
                high.style.display = "flex";
            } else {
                low.style.display = "none";
                mid.style.display = "none";
                high.style.display = "none";
            }

            generateArray();
        });
    });

    generateBtn.onclick = generateArray;
    startBtn.onclick = startSearch;
    pauseBtn.onclick = togglePause;
    resetBtn.onclick = resetSearch;

    arraySizeSlider.oninput = () => {

        document.getElementById("arraySizeValue").textContent = arraySizeSlider.value;

        if (!window.SearchAnim.isAnimating) {
            generateArray();
        }
    };

    speedSlider.oninput = () => {

        document.getElementById("speedValue").textContent = speedSlider.value;

        window.SearchAnim.animationSpeed = parseInt(speedSlider.value);
    };

    // Tab switching
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Language tab switching
    document.querySelectorAll(".lang-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            switchLanguage(lang);
        });
    });

    // Close modal
    document.querySelector(".close").onclick = () => {
        modal.style.display = "none";
        resetSearch();
    };

    setupTabs();
    
    // Custom Array Input
    const useCustomBtn = document.getElementById('useCustomBtn');
    if (useCustomBtn) {
        useCustomBtn.addEventListener('click', handleCustomArrayInput);
    }
});

function handleCustomArrayInput() {
    const input = document.getElementById('customArrayInput');
    if (!input || !input.value.trim()) {
        if (typeof showToast === 'function') showToast('Please enter some numbers.', 'warning');
        return;
    }
    
    // Parse comma or space separated numbers
    let values = input.value.split(/[, ]+/).map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (values.length < 2) {
        if (typeof showToast === 'function') showToast('Please enter at least 2 numbers.', 'warning');
        return;
    }
    
    if (values.length > 50) {
        if (typeof showToast === 'function') showToast('Maximum 50 numbers allowed.', 'warning');
        return;
    }
    
    // Binary Search requires sorted array
    if (currentAlgorithm === "binary-search") {
        values.sort((a,b) => a - b);
    }
    
    // Limit max value for visual scaling
    const maxVal = Math.max(...values);
    let scale = 1;
    if (maxVal > 200) scale = 100 / maxVal;
    
    currentArray = values.map(v => Math.max(1, Math.round(v * scale)));
    
    // Update slider to match
    if (arraySizeSlider) {
        arraySizeSlider.value = currentArray.length;
        document.getElementById("arraySizeValue").textContent = currentArray.length;
    }
    
    if (visualizer instanceof Visualizer) {
        visualizer.initializeArray(currentArray);
        
        if (visualizer.bars && visualizer.bars.length > 0) {
            visualizer.bars.forEach((bar, index) => {
                bar.classList.remove('comparing', 'found', 'not-found', 'searching-range', 'target-highlight');
                // Show real value instead of scaled if we scaled it
                if (scale !== 1) {
                    bar.dataset.realValue = values[index];
                    const label = bar.querySelector('.bar-label');
                    if (label) label.textContent = values[index];
                }
            });
        }
    }
    
    resetStats();
    if (typeof showToast === 'function') showToast('Custom array loaded!', 'success');
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
    
    // Update tab content
    document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
    });
    document.getElementById(tabName).classList.add("active");
    
    // Update content based on algorithm
    if (currentAlgorithm) {
        updateTabContent(tabName);
    }
}

function switchLanguage(lang) {
    // Update language buttons
    document.querySelectorAll(".lang-tab").forEach(btn => {
        btn.classList.remove("active");
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add("active");
    
    // Update code content
    if (currentAlgorithm) {
        updateCodeContent(lang);
    }
}

function updateTabContent(tabName) {
    switch(tabName) {
        case "theory":
            loadTheory(currentAlgorithm);
            break;
        case "code":
            updateCodeContent(document.querySelector(".lang-tab.active").dataset.lang);
            break;
        case "explanation":
            showExplanationContent();
            break;
    }
}

function showExplanationContent() {
    const explanationContent = document.getElementById('explanationContent');
    const explainBtn = document.getElementById('explainBtn');
    
    if (currentAlgorithm && explanationContent) {
        const algorithmName = currentAlgorithm === "linear-search" ? "Linear Search" : "Binary Search";
        explanationContent.innerHTML = `
            <h3>Step-by-Step Explanation</h3>
            <p>Click "Explain with Example" to see a detailed step-by-step walkthrough of ${algorithmName}.</p>
            <button id="explainBtn" class="btn btn-primary">Explain with Example</button>
        `;
        
        // Add event listener to the new button
        document.getElementById('explainBtn').addEventListener('click', explainWithExample);
    }
}

function explainWithExample() {
    const explanationContent = document.getElementById('explanationContent');
    if (!explanationContent) {
        console.error("Explanation container not found");
        return;
    }
    
    if (!currentAlgorithm) {
        explanationContent.innerHTML = '<p>Please select an algorithm first.</p>';
        return;
    }
    
    const algorithmName = currentAlgorithm === "linear-search" ? "Linear Search" : "Binary Search";
    
    // Generate explanation based on selected algorithm
    const explanation = generateAlgorithmExplanation(currentAlgorithm, algorithmName);
    
    explanationContent.innerHTML = explanation;
}

function generateAlgorithmExplanation(algorithm, algorithmName) {
    if (algorithm === "linear-search") {
        return `
            <h3>Linear Search - Step by Step</h3>
            <div class="algorithm-overview">
                <h4>How Linear Search Works:</h4>
                <p>Linear Search sequentially checks each element in the array until the target value is found or the end of the array is reached.</p>
            </div>
            
            <div class="example-array">
                <h4>Example: Searching for 22 in [64, 34, 25, 12, 22, 11, 90]</h4>
                <div class="array-display">[64, 34, 25, 12, 22, 11, 90]</div>
            </div>
            
            <div class="step-by-step">
                <h4>Step-by-Step Process:</h4>
                <div class="step">
                    <h5>Step 1: Check index 0</h5>
                    <p>Compare 64 with target 22. 64 ≠ 22, continue.</p>
                    <div class="array-display">[<span class="comparing">64</span>, 34, 25, 12, 22, 11, 90]</div>
                </div>
                <div class="step">
                    <h5>Step 2: Check index 1</h5>
                    <p>Compare 34 with target 22. 34 ≠ 22, continue.</p>
                    <div class="array-display">[64, <span class="comparing">34</span>, 25, 12, 22, 11, 90]</div>
                </div>
                <div class="step">
                    <h5>Step 3: Check index 2</h5>
                    <p>Compare 25 with target 22. 25 ≠ 22, continue.</p>
                    <div class="array-display">[64, 34, <span class="comparing">25</span>, 12, 22, 11, 90]</div>
                </div>
                <div class="step">
                    <h5>Step 4: Check index 3</h5>
                    <p>Compare 12 with target 22. 12 ≠ 22, continue.</p>
                    <div class="array-display">[64, 34, 25, <span class="comparing">12</span>, 22, 11, 90]</div>
                </div>
                <div class="step">
                    <h5>Step 5: Check index 4</h5>
                    <p>Compare 22 with target 22. 22 = 22, element found!</p>
                    <div class="array-display">[64, 34, 25, 12, <span class="found">22</span>, 11, 90]</div>
                </div>
                <div class="result">
                    <h5>✅ Result: Element found at index 4</h5>
                    <p>Total comparisons: 5</p>
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="startSearchVisualization()">Try It Yourself</button>
        `;
    } else if (algorithm === "binary-search") {
        return `
            <h3>Binary Search - Step by Step</h3>
            <div class="algorithm-overview">
                <h4>How Binary Search Works:</h4>
                <p>Binary Search works on sorted arrays by repeatedly dividing the search interval in half and comparing the middle element with the target.</p>
            </div>
            
            <div class="example-array">
                <h4>Example: Searching for 22 in [11, 12, 22, 25, 34, 64, 90] (Sorted)</h4>
                <div class="array-display">[11, 12, 22, 25, 34, 64, 90]</div>
            </div>
            
            <div class="step-by-step">
                <h4>Step-by-Step Process:</h4>
                <div class="step">
                    <h5>Step 1: Initial boundaries</h5>
                    <p>low = 0, high = 6. Calculate mid = (0 + 6) / 2 = 3</p>
                    <div class="array-display">[11, 12, 22, <span class="comparing">25</span>, 34, 64, 90]</div>
                    <p>Compare 25 with target 22. 25 > 22, search left half.</p>
                </div>
                <div class="step">
                    <h5>Step 2: Search left half</h5>
                    <p>low = 0, high = 2. Calculate mid = (0 + 2) / 2 = 1</p>
                    <div class="array-display">[11, <span class="comparing">12</span>, 22, 25, 34, 64, 90]</div>
                    <p>Compare 12 with target 22. 12 < 22, search right half.</p>
                </div>
                <div class="step">
                    <h5>Step 3: Search right half</h5>
                    <p>low = 2, high = 2. Calculate mid = (2 + 2) / 2 = 2</p>
                    <div class="array-display">[11, 12, <span class="comparing">22</span>, 25, 34, 64, 90]</div>
                    <p>Compare 22 with target 22. 22 = 22, element found!</p>
                </div>
                <div class="result">
                    <h5>✅ Result: Element found at index 2</h5>
                    <p>Total comparisons: 3</p>
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="startSearchVisualization()">Try It Yourself</button>
        `;
    }
    
    return `<p>Explanation not available for ${algorithmName}.</p>`;
}

// Start search visualization when "Try It Yourself" is clicked
function startSearchVisualization() {
    // Set a default search value for demonstration
    searchValueInput.value = "22";
    
    // Scroll to the search input area
    const controlsSection = document.querySelector('.algorithm-controls');
    if (controlsSection) {
        controlsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Highlight the search input briefly
    searchValueInput.style.backgroundColor = '#e3f2fd';
    searchValueInput.style.border = '2px solid #2196f3';
    
    // Remove highlight after 2 seconds
    setTimeout(() => {
        searchValueInput.style.backgroundColor = '';
        searchValueInput.style.border = '';
    }, 2000);
    
    // Reset and start the search
    resetSearch();
    startSearch();
}

// Show algorithm theory when "Learn More" is clicked
function showAlgorithmTheory(algorithm) {
    currentAlgorithm = algorithm;
    modal.style.display = "block";
    loadTheory(currentAlgorithm);
    
    // Show/Hide binary search counters
    const low = document.getElementById("leftIndex").parentElement;
    const mid = document.getElementById("midIndex").parentElement;
    const high = document.getElementById("rightIndex").parentElement;

    if (currentAlgorithm === "binary-search") {
        low.style.display = "flex";
        mid.style.display = "flex";
        high.style.display = "flex";
    } else {
        low.style.display = "none";
        mid.style.display = "none";
        high.style.display = "none";
    }

    generateArray();
}

// Expose functions globally for inline HTML onclick handlers
window.openAlgorithmModal = openAlgorithmModal;
window.showAlgorithmTheory = showAlgorithmTheory;


function generateArray() {

    const size = parseInt(arraySizeSlider.value);

    currentArray = [];

    for (let i = 0; i < size; i++) {
        currentArray.push(Math.floor(Math.random() * 100) + 1);
    }
    
    // Binary Sort needs sorted
    if (currentAlgorithm === "binary-search") {
        currentArray.sort((a,b) => a - b);
    }

    visualizer.initializeArray(currentArray);

    resetStats();
}

function resetStats() {

    window.stepCount = 0;
    window.comparisonCount = 0;

    const stepCounterOpt = document.getElementById("stepCounter");
    if (stepCounterOpt) stepCounterOpt.textContent = "0";
    
    const compsOpt = document.getElementById("comparisons");
    if (compsOpt) compsOpt.textContent = "0";

    const li = document.getElementById("leftIndex");
    if (li) li.textContent = "-";
    const mi = document.getElementById("midIndex");
    if (mi) mi.textContent = "-";
    const ri = document.getElementById("rightIndex");
    if (ri) ri.textContent = "-";

    const exp = document.getElementById("liveExplanation");
    if (exp) {
        exp.innerHTML = `
            <div class="explanation-step">
            Array generated. Enter a value to search and click Start.
            </div>
        `;
    }
}

function startSearch() {

    const target = parseInt(searchValueInput.value);

    // Validate BEFORE any DOM work
    if (isNaN(target)) {
        if (typeof showToast === 'function') {
            showToast('Please enter a number to search for.', 'warning');
        } else {
            alert("Enter a value to search");
        }
        return;
    }

    if (window.SearchAnim.isAnimating) return;

    window.stepCount = 0;
    window.comparisonCount = 0;
    window.updateStatistics();

    window.SearchAnim.isAnimating = true;
    window.SearchAnim.isPaused = false;

    document.getElementById("liveExplanation").innerHTML = "";

    generateBtn.disabled = true;
    startBtn.disabled = true;
    arraySizeSlider.disabled = true;

    // Clear ALL highlights first...
    document.querySelectorAll(".visualizer-bar").forEach(bar => {
        bar.classList.remove(
            "comparing",
            "found",
            "not-found",
            "searching-range",
            "target-highlight"
        );
    });

    // ...then mark target bar(s) so they stay visible during animation
    document.querySelectorAll(".visualizer-bar").forEach(bar => {
        if (parseInt(bar.dataset.value) === target) {
            bar.classList.add("target-highlight");
        }
    });

    if (currentAlgorithm === "linear-search") {
        runLinearSearch(currentArray, target, visualizer);
    } else if (currentAlgorithm === "binary-search") {
        runBinarySearch(currentArray, target, visualizer);
    }
}

function togglePause() {

    if (!window.SearchAnim.isAnimating) return;

    window.SearchAnim.isPaused = !window.SearchAnim.isPaused;

    pauseBtn.textContent = window.SearchAnim.isPaused
        ? "Resume"
        : "Pause";
}

function resetSearch() {

    window.SearchAnim.isAnimating = false;
    window.SearchAnim.isPaused = false;

    searchValueInput.value = "";

    generateArray();

    generateBtn.disabled = false;
    startBtn.disabled = false;
    arraySizeSlider.disabled = false;

    pauseBtn.textContent = "Pause";
}

// Update counters
window.updateStatistics = function () {

    document.getElementById("stepCounter").textContent = window.stepCount;
    document.getElementById("comparisons").textContent = window.comparisonCount;
};

// Live explanation
window.updateLiveExplanation = function(text, actionType = "info") {
    const panel = document.getElementById("liveExplanation");
    if (!panel) return;

    // Color class mapping for searching
    const colorMap = {
        'compare':      'explanation-comparing',
        'found':        'explanation-found', 
        'not-found':    'explanation-notfound',
        'eliminate':    'explanation-eliminate',
        'info':         'explanation-info',
        'range':        'explanation-info'
    };

    const item = document.createElement("p");
    item.className = 'explanation-item ' + (colorMap[actionType] || 'explanation-info');
    item.textContent = text;

    panel.appendChild(item);
    panel.scrollTop = panel.scrollHeight;

    const steps = panel.querySelectorAll(".explanation-item");
    if (steps.length > 25) {
        steps[0].remove();
    }
};

// Binary indices
window.updateBinaryIndices=function(l,m,r){

    const leftEl = document.getElementById("leftIndex");
    if (leftEl) leftEl.textContent = l ?? "-";
    
    const midEl = document.getElementById("midIndex");
    if (midEl) midEl.textContent = m ?? "-";
    
    const rightEl = document.getElementById("rightIndex");
    if (rightEl) rightEl.textContent = r ?? "-";

document.querySelectorAll(".pointer").forEach(p=>p.textContent="");

if(l!==undefined){
    const p=document.getElementById("pointer-"+l);
    if(p){ p.textContent="Low"; p.className="pointer low"; }
}

if(m!==undefined){
    const p=document.getElementById("pointer-"+m);
    if(p){ p.textContent="Mid"; p.className="pointer mid"; }
}

if(r!==undefined){
    const p=document.getElementById("pointer-"+r);
    if(p){ p.textContent="High"; p.className="pointer high"; }
}

};

window.enableControls = function () {

    generateBtn.disabled = false;
    startBtn.disabled = false;
    arraySizeSlider.disabled = false;

    pauseBtn.textContent = "Pause";
};

// Tabs
function setupTabs() {

    const tabs = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {

        tab.onclick = () => {

            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");

            document
                .getElementById(tab.dataset.tab)
                .classList.add("active");
        };
    });

    const langTabs = document.querySelectorAll(".lang-tab");

    langTabs.forEach(tab => {

        tab.onclick = () => {

            langTabs.forEach(t => t.classList.remove("active"));

            tab.classList.add("active");

            updateCodeContent(tab.dataset.lang);
        };
    });
}

// CODE TAB (5 LANGUAGES)
function updateCodeContent(language) {

const codeContent=document.getElementById("codeContent");

const codeExamples={
    
cpp: currentAlgorithm === "linear-search" ? 
`// Linear Search in C++
#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;  // Element found at index i
        }
    }
    return -1;  // Element not found
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 22;
    
    int result = linearSearch(arr, n, target);
    
    if (result != -1) {
        cout << "Element found at index " << result << endl;
    } else {
        cout << "Element not found" << endl;
    }
    
    return 0;
}` :
`// Binary Search in C++
#include <iostream>
#include <algorithm>
using namespace std;

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) {
            return mid;  // Element found at index mid
        }
        
        if (arr[mid] < target) {
            low = mid + 1;  // Search in right half
        } else {
            high = mid - 1;  // Search in left half
        }
    }
    
    return -1;  // Element not found
}

int main() {
    int arr[] = {11, 12, 22, 25, 34, 64, 90};  // Must be sorted
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 22;
    
    int result = binarySearch(arr, n, target);
    
    if (result != -1) {
        cout << "Element found at index " << result << endl;
    } else {
        cout << "Element not found" << endl;
    }
    
    return 0;
}`,

java: currentAlgorithm === "linear-search" ? 
`// Linear Search in Java
public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;  // Element found at index i
            }
        }
        return -1;  // Element not found
    }
    
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        int target = 22;
        
        int result = linearSearch(arr, target);
        
        if (result != -1) {
            System.out.println("Element found at index " + result);
        } else {
            System.out.println("Element not found");
        }
    }
}` :
`// Binary Search in Java
public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            if (arr[mid] == target) {
                return mid;  // Element found at index mid
            }
            
            if (arr[mid] < target) {
                low = mid + 1;  // Search in right half
            } else {
                high = mid - 1;  // Search in left half
            }
        }
        
        return -1;  // Element not found
    }
    
    public static void main(String[] args) {
        int[] arr = {11, 12, 22, 25, 34, 64, 90};  // Must be sorted
        int target = 22;
        
        int result = binarySearch(arr, target);
        
        if (result != -1) {
            System.out.println("Element found at index " + result);
        } else {
            System.out.println("Element not found");
        }
    }
}`,

python: currentAlgorithm === "linear-search" ? 
`# Linear Search in Python
def linear_search(arr, target):
    """
    Perform linear search on the array
    Returns index of target if found, -1 otherwise
    """
    for i, element in enumerate(arr):
        if element == target:
            return i  # Element found at index i
    return -1  # Element not found

# Usage
arr = [64, 34, 25, 12, 22, 11, 90]
target = 22

result = linear_search(arr, target)

if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")` :
`# Binary Search in Python
def binary_search(arr, target):
    """
    Perform binary search on the sorted array
    Returns index of target if found, -1 otherwise
    """
    low, high = 0, len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if arr[mid] == target:
            return mid  # Element found at index mid
        
        if arr[mid] < target:
            low = mid + 1  # Search in right half
        else:
            high = mid - 1  # Search in left half
    
    return -1  # Element not found

# Usage
arr = [11, 12, 22, 25, 34, 64, 90]  # Must be sorted
target = 22

result = binary_search(arr, target)

if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`,

javascript: currentAlgorithm === "linear-search" ? 
`// Linear Search in JavaScript
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;  // Element found at index i
        }
    }
    return -1;  // Element not found
}

// Usage
const arr = [64, 34, 25, 12, 22, 11, 90];
const target = 22;

const result = linearSearch(arr, target);

if (result !== -1) {
    console.log(\`Element found at index \${result}\`);
} else {
    console.log("Element not found");
}` :
`// Binary Search in JavaScript
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        
        if (arr[mid] === target) {
            return mid;  // Element found at index mid
        }
        
        if (arr[mid] < target) {
            low = mid + 1;  // Search in right half
        } else {
            high = mid - 1;  // Search in left half
        }
    }
    
    return -1;  // Element not found
}

// Usage
const arr = [11, 12, 22, 25, 34, 64, 90];  // Must be sorted
const target = 22;

const result = binarySearch(arr, target);

if (result !== -1) {
    console.log(\`Element found at index \${result}\`);
} else {
    console.log("Element not found");
}`,

c: currentAlgorithm === "linear-search" ? 
`// Linear Search in C
#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;  // Element found at index i
        }
    }
    return -1;  // Element not found
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 22;
    
    int result = linearSearch(arr, n, target);
    
    if (result != -1) {
        printf("Element found at index %d\\n", result);
    } else {
        printf("Element not found\\n");
    }
    
    return 0;
}` :
`// Binary Search in C
#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) {
            return mid;  // Element found at index mid
        }
        
        if (arr[mid] < target) {
            low = mid + 1;  // Search in right half
        } else {
            high = mid - 1;  // Search in left half
        }
    }
    
    return -1;  // Element not found
}

int main() {
    int arr[] = {11, 12, 22, 25, 34, 64, 90};  // Must be sorted
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 22;
    
    int result = binarySearch(arr, n, target);
    
    if (result != -1) {
        printf("Element found at index %d\\n", result);
    } else {
        printf("Element not found\\n");
    }
    
    return 0;
}`
};

    const prismLang = { cpp: 'cpp', python: 'python', java: 'java', javascript: 'javascript', c: 'c' };
    const cls = prismLang[language] || 'cpp';
    
    let rawCode = codeExamples[language] || codeExamples.cpp || '// Code not available';
    let cleanCode = rawCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    codeContent.innerHTML = `<pre><code class="language-${cls}">${cleanCode}</code></pre>`;
    if (typeof Prism !== 'undefined') Prism.highlightAll();
}

// THEORY + AI
function loadTheory(algorithm){

const theory=document.getElementById("theoryContent");

if(algorithm==="linear-search"){

theory.innerHTML=`
<h3>Linear Search</h3>
<div class="algorithm-definition">
<h4>Definition</h4>
<p>Linear Search is a simple searching algorithm that sequentially checks each element in the list until a match is found or the whole list has been searched.</p>
</div>

<div class="how-it-works">
<h4>How It Works</h4>
<ol>
<li>Start from the first element of the array</li>
<li>Compare each element with the target value</li>
<li>If match is found, return the index</li>
<li>If no match found after checking all elements, return -1</li>
</ol>
</div>

<div class="complexity-analysis">
<h4>Time Complexity</h4>
<ul>
<li><strong>Best Case:</strong> O(1) - Element found at first position</li>
<li><strong>Average Case:</strong> O(n) - Element found in middle</li>
<li><strong>Worst Case:</strong> O(n) - Element not found or at last position</li>
</ul>

<h4>Space Complexity</h4>
<p>O(1) - No additional space required</p>
</div>

<div class="use-cases">
<h4>When to Use Linear Search</h4>
<ul>
<li>Small datasets where simplicity is preferred</li>
<li>Unsorted or unstructured data</li>
<li>When only one search operation is needed</li>
<li>When memory usage must be minimal</li>
</ul>
</div>

<div class="pros-cons">
<h4>Advantages & Disadvantages</h4>
<div class="pros">
<strong>Advantages:</strong>
<ul>
<li>Simple to implement and understand</li>
<li>Works on unsorted data</li>
<li>No additional memory required</li>
</ul>
</div>
<div class="cons">
<strong>Disadvantages:</strong>
<ul>
<li>Inefficient for large datasets</li>
<li>Performance degrades linearly with data size</li>
</ul>
</div>
</div>

<div class="comparison">
<h4>Linear Search vs Binary Search</h4>
<table style="width: 100%; border-collapse: collapse;">
<tr style="border-bottom: 1px solid #ddd;">
<th style="padding: 8px; text-align: left;">Aspect</th>
<th style="padding: 8px; text-align: left;">Linear Search</th>
<th style="padding: 8px; text-align: left;">Binary Search</th>
</tr>
<tr style="border-bottom: 1px solid #ddd;">
<td style="padding: 8px;">Time Complexity</td>
<td style="padding: 8px;">O(n)</td>
<td style="padding: 8px;">O(log n)</td>
</tr>
<tr style="border-bottom: 1px solid #ddd;">
<td style="padding: 8px;">Data Requirement</td>
<td style="padding: 8px;">Unsorted</td>
<td style="padding: 8px;">Sorted</td>
</tr>
<tr style="border-bottom: 1px solid #ddd;">
<td style="padding: 8px;">Best For</td>
<td style="padding: 8px;">Small datasets</td>
<td style="padding: 8px;">Large datasets</td>
</tr>
<tr>
<td style="padding: 8px;">Implementation</td>
<td style="padding: 8px;">Simple</td>
<td style="padding: 8px;">Complex</td>
</tr>
</table>
</div>
`;
}

if(algorithm==="binary-search"){

theory.innerHTML=`
<h3>Binary Search</h3>
<div class="algorithm-definition">
<h4>Definition</h4>
<p>Binary Search is an efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half.</p>
</div>

<div class="how-it-works">
<h4>How It Works</h4>
<ol>
<li>Ensure the array is sorted</li>
<li>Set low = 0 and high = n-1</li>
<li>While low ≤ high:</li>
<li style="margin-left: 20px;">Calculate mid = (low + high) / 2</li>
<li style="margin-left: 20px;">If array[mid] == target, return mid</li>
<li style="margin-left: 20px;">If array[mid] < target, set low = mid + 1</li>
<li style="margin-left: 20px;">Else set high = mid - 1</li>
<li>If loop ends, return -1 (not found)</li>
</ol>
</div>

<div class="complexity-analysis">
<h4>Time Complexity</h4>
<ul>
<li><strong>Best Case:</strong> O(1) - Element found at middle position</li>
<li><strong>Average Case:</strong> O(log n) - Element found after some divisions</li>
<li><strong>Worst Case:</strong> O(log n) - Element not found or at extremes</li>
</ul>

<h4>Space Complexity</h4>
<p>O(1) - No additional space required (iterative implementation)</p>
</div>

<div class="use-cases">
<h4>When to Use Binary Search</h4>
<ul>
<li>Large sorted datasets</li>
<li>Multiple search operations on the same dataset</li>
<li>When performance is critical</li>
<li>When data can be sorted once and searched many times</li>
</ul>
</div>

<div class="pros-cons">
<h4>Advantages & Disadvantages</h4>
<div class="pros">
<strong>Advantages:</strong>
<ul>
<li>Very fast for large datasets</li>
<li>Guaranteed logarithmic time complexity</li>
<li>Efficient memory usage</li>
</ul>
</div>
<div class="cons">
<strong>Disadvantages:</strong>
<ul>
<li>Requires sorted data</li>
<li>More complex to implement</li>
<li>Not suitable for frequently changing data</li>
</ul>
</div>
</div>

<div class="comparison">
<h4>Linear Search vs Binary Search</h4>
<table style="width: 100%; border-collapse: collapse;">
<tr style="border-bottom: 1px solid #ddd;">
<th style="padding: 8px; text-align: left;">Aspect</th>
<th style="padding: 8px; text-align: left;">Linear Search</th>
<th style="padding: 8px; text-align: left;">Binary Search</th>
</tr>
<tr style="border-bottom: 1px solid #ddd;">
<td style="padding: 8px;">Time Complexity</td>
<td style="padding: 8px;">O(n)</td>
<td style="padding: 8px;">O(log n)</td>
</tr>
<tr style="border-bottom: 1px solid #ddd;">
<td style="padding: 8px;">Data Requirement</td>
<td style="padding: 8px;">Unsorted</td>
<td style="padding: 8px;">Sorted</td>
</tr>
<tr style="border-bottom: 1px solid #ddd;">
<td style="padding: 8px;">Best For</td>
<td style="padding: 8px;">Small datasets</td>
<td style="padding: 8px;">Large datasets</td>
</tr>
<tr>
<td style="padding: 8px;">Implementation</td>
<td style="padding: 8px;">Simple</td>
<td style="padding: 8px;">Complex</td>
</tr>
</table>
</div>
`;
}
}
function openAlgorithmModal(algorithm){

    currentAlgorithm = algorithm;

    modal.style.display = "block";

    loadTheory(currentAlgorithm);

    // Show/Hide binary search counters safely
    const leftEl = document.getElementById("leftIndex");
    const midEl = document.getElementById("midIndex");
    const rightEl = document.getElementById("rightIndex");

    const low = leftEl ? leftEl.parentElement : null;
    const mid = midEl ? midEl.parentElement : null;
    const high = rightEl ? rightEl.parentElement : null;

    if (currentAlgorithm === "binary-search") {
        if (low) low.style.display = "flex";
        if (mid) mid.style.display = "flex";
        if (high) high.style.display = "flex";
    } else {
        if (low) low.style.display = "none";
        if (mid) mid.style.display = "none";
        if (high) high.style.display = "none";
    }

    generateArray();
}