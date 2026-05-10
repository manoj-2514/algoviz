window.SearchAnim = {
    isAnimating: false,
    isPaused: false,
    animationSpeed: 5
};

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function getDelay() {
    return (11 - window.SearchAnim.animationSpeed) * 100;
}

/* ==============================
        LINEAR SEARCH
============================== */

async function runLinearSearch(array, target, visualizer) {

    const bars = visualizer.getBars();

    window.updateLiveExplanation("🔍 Linear Search started. Like checking names on an attendance list one by one from the top — no skipping allowed. We'll check every element in order (highlighted in orange).", "info");

    for (let i = 0; i < array.length; i++) {

        if (!window.SearchAnim.isAnimating) {
            window.enableControls();
            return;
        }

        while (window.SearchAnim.isPaused) {
            await delay(100);
        }

        window.stepCount++;
        window.comparisonCount++;
        window.updateStatistics();

        window.updateLiveExplanation(
            `Checking index ${i} (value ${array[i]}) against target ${target} (highlighted in orange). Like scanning an attendance list line by line — we must check every name until we find the right one. ${array[i]} ${array[i] === target ? "matches" : "does not match"} ${target}, so we ${array[i] === target ? "found it!" : "move to the next element (marked red).."}`, "compare"
        );

        bars[i].classList.add("comparing");

        await delay(getDelay());

        if (array[i] === target) {

            bars[i].classList.remove("comparing");
            bars[i].classList.add("found");

            window.updateLiveExplanation(
                `Target ${target} found at index ${i} (bar turns green) after ${window.comparisonCount} comparisons! Just like spotting the name you were looking for on the attendance list — the search stops immediately. Linear Search found the value in O(n) time — in the worst case it checks every single element.`, "found"
            );

            await delay(800);

            window.enableControls();
            return;
        }

        bars[i].classList.remove("comparing");
        bars[i].classList.add("not-found");

        window.updateLiveExplanation(
            `${array[i]} is not equal to ${target} (bar turns red). Just like seeing a name on the list that isn't the one you're looking for — we must keep moving down the page to find the match.`, "not-found"
        );

        await delay(getDelay() / 2);

        bars[i].classList.remove("not-found");
    }

    window.updateLiveExplanation(
        `Target ${target} was not found after checking all ${array.length} elements (unsuccessful checks turned red). Like reaching the end of the attendance list without finding the name — we checked everywhere. Linear Search confirmed absence in O(n) time — every element was checked exactly once.`, "not-found"
    );

    window.enableControls();
}


/* ==============================
        BINARY SEARCH
============================== */

async function runBinarySearch(array, target, visualizer) {

    const sorted = [...array].sort((a, b) => a - b);

    visualizer.initializeArray(sorted);

    const bars = visualizer.getBars();

    window.updateLiveExplanation(
        "🔍 Binary Search started. Like finding a word in a dictionary — we'll open to the middle, decide which half to search, and discard the other. Note: The array must be sorted (blue highlights show the active range).", "info"
    );

    await delay(getDelay());

    let left = 0;
    let right = sorted.length - 1;

    while (left <= right) {

        if (!window.SearchAnim.isAnimating) {
            window.enableControls();
            return;
        }

        while (window.SearchAnim.isPaused) {
            await delay(100);
        }

        const mid = Math.floor((left + right) / 2);

        window.stepCount++;
        window.comparisonCount++;
        window.updateStatistics();

        window.updateBinaryIndices(left, mid, right);

        window.updateLiveExplanation(`Checking middle element at index ${mid} (value ${sorted[mid]}) highlighted in orange. The current search range is highlighted in blue. Like opening a dictionary to the middle page — we check if this is our word or which half to search next. Target ${target} is ${target < sorted[mid] ? "less than" : (target > sorted[mid] ? "greater than" : "equal to")} ${sorted[mid]}, so we ${target < sorted[mid] ? "eliminate the right half" : (target > sorted[mid] ? "eliminate the left half" : "found it!")}.`,"compare");

        bars.forEach(bar => {
            bar.classList.remove("comparing","found","not-found","searching-range");
        });

        for (let i = left; i <= right; i++) {
            bars[i].classList.add("searching-range");
        }

        bars[mid].classList.add("comparing");

        await delay(getDelay());

        if (sorted[mid] === target) {

            bars[mid].classList.remove("comparing","searching-range");
            bars[mid].classList.add("found");

            window.updateLiveExplanation(`Target ${target} found at index ${mid} (bar turns green) in just ${window.comparisonCount} comparisons! Like finding your word on the exact dictionary page you opened to — Binary Search zeroed in precisely. Binary Search found this in O(log n) time — with ${sorted.length} elements, it needed at most ${Math.ceil(Math.log2(sorted.length))} comparisons.`,"found");

            await delay(800);

            bars.forEach(bar=>{
                bar.classList.remove("searching-range");
            });

            window.enableControls();
            return;
        }

        if (sorted[mid] < target) {
            window.updateLiveExplanation(`Eliminating indices ${left} to ${mid} — target ${target} is greater than ${sorted[mid]} at index ${mid}. Like tearing out the first half of the dictionary — everything before this page is too small to contain our word. New search range: index ${mid + 1} to ${right}. Next, we check the middle of this smaller range.`, "eliminate");
            left = mid + 1;
        } else {
            window.updateLiveExplanation(`Eliminating indices ${mid} to ${right} — target ${target} is less than ${sorted[mid]} at index ${mid}. Like ignoring the second half of the dictionary — everything after this page is too large. New search range: index ${left} to ${mid - 1}. Next, we check the middle of this smaller range.`,"eliminate");
            right = mid - 1;
        }

        bars.forEach(bar=>{
            bar.classList.remove("comparing","searching-range");
        });

        await delay(getDelay()/2);
    }

    window.updateBinaryIndices("-", "-", "-");

    window.updateLiveExplanation(`Target ${target} not found — search range collapsed to empty after ${window.comparisonCount} comparisons. Like narrowing down dictionary pages until there are none left — the word simply doesn't exist in this book. Binary Search confirmed absence in O(log n) time — far more efficient than checking every element.`,"not-found");

    bars.forEach(bar=>{
        bar.classList.remove("comparing","found","not-found","searching-range");
    });

    window.enableControls();
}

window.runLinearSearch = runLinearSearch;
window.runBinarySearch = runBinarySearch;