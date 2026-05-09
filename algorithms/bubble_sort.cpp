#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>
#include <thread>

using namespace std;

// Bubble Sort Implementation
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if they are in wrong order
                swap(arr[j], arr[j + 1]);
                swapped = true;
                
                // Print current state for visualization
                cout << "Swapped " << arr[j + 1] << " and " << arr[j] << ": ";
                for (int k = 0; k < n; k++) {
                    cout << arr[k] << " ";
                }
                cout << endl;
                
                // Add delay for visualization (in milliseconds)
                this_thread::sleep_for(chrono::milliseconds(500));
            }
        }
        
        // If no swapping occurred, array is sorted
        if (!swapped) {
            break;
        }
        
        // Mark the last element of this pass as sorted
        cout << "Element " << arr[n - i - 1] << " is now in correct position." << endl;
    }
}

// Utility function to print array
void printArray(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

// Utility function to generate random array
vector<int> generateRandomArray(int size, int minVal = 1, int maxVal = 100) {
    vector<int> arr(size);
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> dis(minVal, maxVal);
    
    for (int i = 0; i < size; i++) {
        arr[i] = dis(gen);
    }
    return arr;
}

// Main function to demonstrate Bubble Sort
int main() {
    cout << "=== Bubble Sort Algorithm Visualization ===" << endl;
    cout << endl;
    
    // Generate a random array
    int size = 10;
    vector<int> arr = generateRandomArray(size);
    
    cout << "Original array: ";
    printArray(arr);
    cout << endl;
    
    cout << "Starting Bubble Sort..." << endl;
    cout << "----------------------------------------" << endl;
    
    // Perform bubble sort with visualization
    bubbleSort(arr);
    
    cout << "----------------------------------------" << endl;
    cout << "Sorted array: ";
    printArray(arr);
    cout << endl;
    
    cout << "Algorithm completed successfully!" << endl;
    
    return 0;
}

/*
Bubble Sort Algorithm Analysis:

Time Complexity:
- Best Case: O(n) - When the array is already sorted
- Average Case: O(n²) - When elements are in random order
- Worst Case: O(n²) - When the array is sorted in reverse order

Space Complexity: O(1) - In-place sorting algorithm

Algorithm Steps:
1. Start from the first element of the array
2. Compare the current element with the next element
3. If current element is greater than next, swap them
4. Move to the next pair and repeat until end of array
5. After each complete pass, the largest element "bubbles up" to its correct position
6. Repeat the process for the remaining unsorted portion
7. Continue until no swaps are needed in a complete pass

Advantages:
- Simple to understand and implement
- Works well for small datasets
- Adaptive algorithm (detects sorted arrays)
- Space efficient (in-place sorting)
- Stable sort (maintains relative order of equal elements)

Disadvantages:
- Inefficient for large datasets
- Time complexity is O(n²) in most cases
- Not suitable for complex data structures
- Performance degrades significantly with larger arrays

Real-world Applications:
- Educational purposes (teaching sorting concepts)
- Small datasets where simplicity is preferred over efficiency
- Nearly sorted arrays (takes advantage of adaptive nature)
- Situations where memory is limited (in-place sorting)

Example:
Array: [5, 1, 4, 2, 8]

Pass 1:
[1, 5, 4, 2, 8] (swap 5 and 1)
[1, 4, 5, 2, 8] (swap 5 and 4)
[1, 4, 2, 5, 8] (swap 5 and 2)
[1, 4, 2, 5, 8] (no swap needed)
Result: 8 is in correct position

Pass 2:
[1, 4, 2, 5, 8] (no swap needed)
[1, 2, 4, 5, 8] (swap 4 and 2)
[1, 2, 4, 5, 8] (no swap needed)
Result: 5 is in correct position

Pass 3:
[1, 2, 4, 5, 8] (no swaps needed)
Array is sorted!
*/
