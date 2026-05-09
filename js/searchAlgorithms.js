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

    window.updateLiveExplanation("🔍 Linear Search started. Checking elements sequentially.");

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
            `Step ${window.stepCount}: Compare index ${i} → value ${array[i]} with target ${target}`
        );

        bars[i].classList.add("comparing");

        await delay(getDelay());

        if (array[i] === target) {

            bars[i].classList.remove("comparing");
            bars[i].classList.add("found");

            window.updateLiveExplanation(
                `✅ Target ${target} found at index ${i}`
            );

            await delay(800);

            window.enableControls();
            return;
        }

        bars[i].classList.remove("comparing");
        bars[i].classList.add("not-found");

        window.updateLiveExplanation(
            `❌ ${array[i]} ≠ ${target} → continue searching`
        );

        await delay(getDelay() / 2);

        bars[i].classList.remove("not-found");
    }

    window.updateLiveExplanation(
        `❌ Target ${target} not found after scanning all elements`
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
        "🔍 Binary Search started. Array must be sorted."
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

        window.updateLiveExplanation(`Comparing ${sorted[mid]} with ${target}`,"compare");

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

            window.updateLiveExplanation(`Element ${target} found!`,"success");

            await delay(800);

            bars.forEach(bar=>{
                bar.classList.remove("searching-range");
            });

            window.enableControls();
            return;
        }

        if (sorted[mid] < target) {

            window.updateLiveExplanation(`Step ${window.stepCount}: Searching range [${left}-${right}]`);

            left = mid + 1;

        } else {

            window.updateLiveExplanation(`Step ${window.stepCount}: Searching range [${left}-${right}]`,"range");

            right = mid - 1;
        }

        bars.forEach(bar=>{
            bar.classList.remove("comparing","searching-range");
        });

        await delay(getDelay()/2);
    }

    window.updateBinaryIndices("-", "-", "-");

    window.updateLiveExplanation(`Element not found`,"fail");

    bars.forEach(bar=>{
        bar.classList.remove("comparing","found","not-found","searching-range");
    });

    window.enableControls();
}

window.runLinearSearch = runLinearSearch;
window.runBinarySearch = runBinarySearch;