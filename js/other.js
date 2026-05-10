// Other Algorithms Page JavaScript

// ─── State ────────────────────────────────────────────────────────────────────
let currentAlgorithm = '';
let visualizerObj;

window.OtherAnim = {
    isAnimating: false,
    isPaused: false,
    animationSpeed: 5
};

window.stepCount = 0;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
let modal, modalTitle;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function getDelay() { return (11 - window.OtherAnim.animationSpeed) * 150; }

function log(msg, type = 'info') {
    const panel = document.getElementById('liveExplanation');
    if (!panel) return;

    // Color class mapping for other algorithms
    const colorMap = {
        'active':    'expl-other-active',
        'success':   'expl-other-success',
        'fail':      'expl-other-fail',
        'update':    'expl-other-update',
        'discovery': 'expl-other-discovery',
        'info':      'expl-other-info'
    };

    const p = document.createElement('p');
    p.textContent = msg;
    p.className = 'explanation-item ' + (colorMap[type] || 'expl-other-info');
    
    panel.appendChild(p);
    panel.scrollTop = panel.scrollHeight;
    
    const items = panel.querySelectorAll('.explanation-item');
    if (items.length > 50) items[0].remove();
}

function clearLog() {
    const panel = document.getElementById('liveExplanation');
    if (panel) panel.innerHTML = '';
}

function updateCounters(val = null) {
    const sc = document.getElementById('stepCounter');
    if (sc) sc.textContent = window.stepCount;
    
    if (val !== null) {
        document.getElementById('extraCounterItem').style.display = '';
        document.getElementById('extraCounterValue').textContent = val;
    }
}

function hideExtraCounter() {
    document.getElementById('extraCounterItem').style.display = 'none';
}

function setVariablesDisplay(title, content) {
    const vd = document.getElementById('variablesDisplay');
    const vt = document.getElementById('variablesTitle');
    const vc = document.getElementById('variablesContent');
    if (vd) vd.style.display = content !== null ? '' : 'none';
    if (vt) vt.textContent = title;
    if (vc) vc.innerHTML = content || '—';
}

function showDistanceTable(show, title='Matrix') {
    const dt = document.getElementById('distanceTable');
    const tt = document.getElementById('tableTitle');
    if (dt) dt.style.display = show ? '' : 'none';
    if (tt) tt.textContent = title;
}

// ─── Modal open / theory ──────────────────────────────────────────────────────
function openAlgorithmModal(algorithm) {
    currentAlgorithm = algorithm;
    modal = document.getElementById('algorithmModal');
    modal.style.display = 'block';
    
    loadTheory(algorithm);
    setupControls(algorithm);
    resetVis();
}
window.openAlgorithmModal = openAlgorithmModal;

function showAlgorithmTheory(algorithm) {
    openAlgorithmModal(algorithm);
}
window.showAlgorithmTheory = showAlgorithmTheory;

// ─── Control Setup ─────────────────────────────────────────────────────────
function setupControls(algo) {
    const ctrl = document.getElementById('otherControls');
    let html = `
        <div class="control-group">
            <label for="speed">Animation Speed:</label>
            <input type="range" id="speed" min="1" max="10" value="5">
            <span id="speedValue">5</span>
        </div>`;
        
    if (algo === 'kadane') {
        html += `
            <div class="control-group">
                <label for="arraySize">Array Size:</label>
                <input type="range" id="arraySize" min="5" max="20" value="10">
                <span id="arraySizeValue">10</span>
            </div>`;
    } else if (algo === 'floyd-warshall' || algo === 'warshall') {
        html += `
            <div class="control-group">
                <label for="nodeCount">Nodes:</label>
                <input type="range" id="nodeCount" min="3" max="6" value="4">
                <span id="nodeCountValue">4</span>
            </div>`;
    } else if (algo === 'kmp' || algo === 'rabin-karp') {
        html += `
            <div class="control-group">
                <label for="textInput">Text:</label>
                <input type="text" id="textInput" value="ABABDABABC" maxlength="15" style="width:100px;">
            </div>
            <div class="control-group">
                <label for="patternInput">Pattern:</label>
                <input type="text" id="patternInput" value="ABABC" maxlength="8" style="width:70px;">
            </div>`;
    }
    
    html += `
        <div class="control-buttons">
            <button id="generateBtn" class="btn btn-secondary">New Data</button>
            <button id="startBtn" class="btn btn-primary">Start</button>
            <button id="pauseBtn" class="btn btn-warning">Pause</button>
            <button id="resetBtn" class="btn btn-danger">Reset</button>
        </div>
    `;
    ctrl.innerHTML = html;
    
    // Bind listeners
    document.getElementById('speed').addEventListener('input', e => {
        document.getElementById('speedValue').textContent = e.target.value;
        window.OtherAnim.animationSpeed = parseInt(e.target.value);
    });
    
    if (document.getElementById('arraySize')) {
        document.getElementById('arraySize').addEventListener('input', e => {
            document.getElementById('arraySizeValue').textContent = e.target.value;
            if(!window.OtherAnim.isAnimating) resetVis();
        });
    }
    if (document.getElementById('nodeCount')) {
        document.getElementById('nodeCount').addEventListener('input', e => {
            document.getElementById('nodeCountValue').textContent = e.target.value;
            if(!window.OtherAnim.isAnimating) resetVis();
        });
    }
    
    document.getElementById('generateBtn').onclick = resetVis;
    document.getElementById('startBtn').onclick = startVisualization;
    document.getElementById('pauseBtn').onclick = () => {
        if (!window.OtherAnim.isAnimating) return;
        window.OtherAnim.isPaused = !window.OtherAnim.isPaused;
        document.getElementById('pauseBtn').textContent = window.OtherAnim.isPaused ? 'Resume' : 'Pause';
    };
    document.getElementById('resetBtn').onclick = () => {
        window.OtherAnim.isAnimating = false;
        window.OtherAnim.isPaused = false;
        resetVis();
    };
    
    updateLegend(algo);
}

function updateLegend(algo) {
    const leg = document.getElementById('otherLegend');
    if (algo === 'kadane') {
        leg.innerHTML = `
            <div class="legend-item"><div class="legend-color" style="background:#ff9800;"></div><span>Current</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#4CAF50;"></div><span>Max Subarray so far</span></div>`;
    } else if (algo === 'floyd-warshall' || algo === 'warshall') {
        leg.innerHTML = `
            <div class="legend-item"><div class="legend-color" style="background:#ff9800;"></div><span>Intermediate (k)</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#2196f3;"></div><span>Checking (i, j)</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#4CAF50;"></div><span>Path Updated</span></div>`;
    } else {
        leg.innerHTML = `
            <div class="legend-item"><div class="legend-color" style="background:#ff9800;"></div><span>Comparing</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#4CAF50;"></div><span>Match Found</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#f44336;"></div><span>Mismatch</span></div>`;
    }
}

// ─── Data Generation & Render ───────────────────────────────────────────────
let currentArray = [];
let textString = "";
let patternString = "";
let fwMatrix = [];

function resetVis() {
    window.OtherAnim.isAnimating = false;
    window.OtherAnim.isPaused = false;
    window.stepCount = 0;
    
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('startBtn').disabled = false;
    const pb = document.getElementById('pauseBtn');
    if(pb) pb.textContent = 'Pause';
    
    let slider = document.getElementById('arraySize');
    if(slider) slider.disabled = false;
    let nodeSlider = document.getElementById('nodeCount');
    if(nodeSlider) nodeSlider.disabled = false;
    
    clearLog();
    updateCounters();
    hideExtraCounter();
    setVariablesDisplay('', null);
    showDistanceTable(false);
    
    const vis = document.getElementById('visualizer');
    vis.innerHTML = '';
    
    if (currentAlgorithm === 'kadane') {
        const size = document.getElementById('arraySize') ? parseInt(document.getElementById('arraySize').value) : 10;
        currentArray = Array.from({length: size}, () => Math.floor(Math.random() * 20) - 10);
        renderArrayBlocks(currentArray);
        log("Array generated. Click Start to run Kadane's Algorithm.");
    } else if (currentAlgorithm === 'floyd-warshall') {
        const n = document.getElementById('nodeCount') ? parseInt(document.getElementById('nodeCount').value) : 4;
        fwMatrix = Array.from({length: n}, () => Array(n).fill(Infinity));
        for(let i=0; i<n; i++) {
            fwMatrix[i][i] = 0;
            for(let j=i+1; j<n; j++) {
                if (Math.random() > 0.3) {
                    let w = Math.floor(Math.random() * 10) + 1;
                    fwMatrix[i][j] = w;
                }
            }
        }
        renderFWMatrix(fwMatrix, n);
        log("Graph generated. Click Start to run Floyd-Warshall.");
    } else if (currentAlgorithm === 'warshall') {
        const n = document.getElementById('nodeCount') ? parseInt(document.getElementById('nodeCount').value) : 4;
        fwMatrix = Array.from({length: n}, () => Array(n).fill(0));
        for(let i=0; i<n; i++) {
            fwMatrix[i][i] = 1;
            for(let j=0; j<n; j++) {
                if(i !== j && Math.random()>0.5) fwMatrix[i][j] = 1;
            }
        }
        renderWarshallMatrix(fwMatrix, n);
        log("Boolean graph adjacency generated. Click Start to run Warshall's Algorithm.");
    } else if (currentAlgorithm === 'kmp' || currentAlgorithm === 'rabin-karp') {
        textString = document.getElementById('textInput').value.toUpperCase();
        patternString = document.getElementById('patternInput').value.toUpperCase();
        renderStrings(textString, patternString);
        log(`Strings ready. Click Start to run ${currentAlgorithm === 'kmp' ? 'KMP' : 'Rabin-Karp'}.`);
    }
}

function renderArrayBlocks(arr, highlights = {}, maxRange = null) {
    const vis = document.getElementById('visualizer');
    let html = '<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">';
    for(let i=0; i<arr.length; i++) {
        let bg = '#eee';
        let color = '#333';
        if (highlights[i]) {
            bg = highlights[i];
            color = 'white';
        } else if (maxRange && i >= maxRange[0] && i <= maxRange[1]) {
            bg = '#4CAF50';
            color = 'white';
        }
        html += `<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${bg};color:${color};font-weight:bold;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1); transition:all 0.3s;">${arr[i]}</div>`;
    }
    html += '</div>';
    vis.innerHTML = html;
}

function renderStrings(text, pattern, tHi = -1, pHi = -1, matchObj = null) {
    const vis = document.getElementById('visualizer');
    let html = '<div style="display:flex; flex-direction:column; gap:20px; font-family:monospace; font-size: 1.2rem;">';
    
    // Text row
    let tRow = '<div style="display:flex; gap:4px; align-items:center;">';
    tRow += '<span style="width:80px; font-weight:bold; color:#666;">Text:</span>';
    for(let i=0; i<text.length; i++) {
        let bg = '#eee'; let co = '#333';
        if (i === tHi) { bg = '#ff9800'; co = 'white'; }
        if (matchObj && matchObj.success && i >= matchObj.start && i <= matchObj.end) {
            bg = '#4CAF50'; co = 'white';
        }
        if (matchObj && matchObj.fail && i === tHi) {
            bg = '#f44336'; co = 'white';
        }
        tRow += `<div style="width:30px;height:35px;display:flex;align-items:center;justify-content:center;background:${bg};color:${co};border-radius:3px; transition:all 0.2s;">${text[i]}</div>`;
    }
    tRow += '</div>';
    
    // Pattern row
    let pRow = '<div style="display:flex; gap:4px; align-items:center;">';
    pRow += '<span style="width:80px; font-weight:bold; color:#666;">Pattern:</span>';
    // Offset pattern
    let offset = matchObj ? matchObj.start : (tHi >= 0 && pHi >= 0 ? tHi - pHi : 0);
    for(let i=0; i<offset; i++) {
        pRow += `<div style="width:30px;height:35px;"></div>`;
    }
    for(let i=0; i<pattern.length; i++) {
        let bg = '#eee'; let co = '#333';
        if (i === pHi) { bg = '#ff9800'; co = 'white'; }
        if (matchObj && matchObj.success) {
            bg = '#4CAF50'; co = 'white';
        }
        if (matchObj && matchObj.fail && i === pHi) {
            bg = '#f44336'; co = 'white';
        }
        pRow += `<div style="width:30px;height:35px;display:flex;align-items:center;justify-content:center;background:${bg};color:${co};border-radius:3px; transition:all 0.2s;">${pattern[i]}</div>`;
    }
    pRow += '</div></div>';
    vis.innerHTML = html + tRow + pRow;
}

function renderFWMatrix(dist, n, k=-1, i=-1, j=-1, highlightIJ=false, updated=false) {
    const rc = document.getElementById('visualizer');
    let html = '<table style="border-collapse:collapse; margin:0 auto; font-family:monospace; font-size:1.1rem; text-align:center;">';
    
    // Header
    html += '<tr><th style="padding:10px;border-bottom:2px solid #ccc;border-right:2px solid #ccc;"></th>';
    for(let c=0; c<n; c++) html += `<th style="padding:10px;border-bottom:2px solid #ccc;">V${c}</th>`;
    html += '</tr>';
    
    for(let r=0; r<n; r++) {
        html += `<tr><th style="padding:10px;border-right:2px solid #ccc;">V${r}</th>`;
        for(let c=0; c<n; c++) {
            let val = (dist[r][c] === null || dist[r][c] === Infinity) ? '∞' : dist[r][c];
            let bg = 'white', color = '#333';
            
            if (r === k || c === k) { bg = '#fff3e0'; } // Intermediate k
            
            if (r === i && c === j) {
                if (updated) { bg = '#4CAF50'; color = 'white'; }
                else if (highlightIJ) { bg = '#2196f3'; color = 'white'; }
            }
            // highlight the components
            if (highlightIJ && r===i && c===k) { bg = '#ff9800'; color='white'; }
            if (highlightIJ && r===k && c===j) { bg = '#ff9800'; color='white'; }

            html += `<td style="padding:15px;border:1px solid #eee;background:${bg};color:${color};font-weight:bold;transition:all 0.3s;">${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    rc.innerHTML = html;
}

function renderWarshallMatrix(reach, n, k=-1, i=-1, j=-1, highlightIJ=false, updated=false) {
    const rc = document.getElementById('visualizer');
    let html = '<table style="border-collapse:collapse; margin:0 auto; font-family:monospace; font-size:1.2rem; text-align:center;">';
    
    // Header
    html += '<tr><th style="padding:10px;border-bottom:2px solid #ccc;border-right:2px solid #ccc;"></th>';
    for(let c=0; c<n; c++) html += `<th style="padding:10px;border-bottom:2px solid #ccc;">V${c}</th>`;
    html += '</tr>';
    
    for(let r=0; r<n; r++) {
        html += `<tr><th style="padding:10px;border-right:2px solid #ccc;">V${r}</th>`;
        for(let c=0; c<n; c++) {
            let val = reach[r][c] === 1 ? 'T' : 'F';
            let bg = 'white', color = reach[r][c] === 1 ? '#4CAF50' : '#f44336';
            
            if (r === k || c === k) { bg = '#fff3e0'; } // Intermediate k
            
            if (r === i && c === j) {
                if (updated) { bg = '#4CAF50'; color = 'white'; }
                else if (highlightIJ) { bg = '#2196f3'; color = 'white'; }
            }
            // highlight the components
            if (highlightIJ && r===i && c===k) { bg = '#ff9800'; color='white'; }
            if (highlightIJ && r===k && c===j) { bg = '#ff9800'; color='white'; }

            html += `<td style="padding:15px;border:1px solid #eee;background:${bg};color:${color};font-weight:bold;transition:all 0.3s;">${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    rc.innerHTML = html;
}

function renderWarshallMatrix(reach, n, k=-1, i=-1, j=-1, highlightIJ=false, updated=false) {
    const rc = document.getElementById('visualizer');
    let html = '<table style="border-collapse:collapse; margin:0 auto; font-family:monospace; font-size:1.2rem; text-align:center;">';
    
    // Header
    html += '<tr><th style="padding:10px;border-bottom:2px solid #ccc;border-right:2px solid #ccc;"></th>';
    for(let c=0; c<n; c++) html += `<th style="padding:10px;border-bottom:2px solid #ccc;">V${c}</th>`;
    html += '</tr>';
    
    for(let r=0; r<n; r++) {
        html += `<tr><th style="padding:10px;border-right:2px solid #ccc;">V${r}</th>`;
        for(let c=0; c<n; c++) {
            let val = reach[r][c] === 1 ? 'T' : 'F';
            let bg = 'white', color = reach[r][c] === 1 ? '#4CAF50' : '#f44336';
            
            if (r === k || c === k) { bg = '#fff3e0'; } // Intermediate k
            
            if (r === i && c === j) {
                if (updated) { bg = '#4CAF50'; color = 'white'; }
                else if (highlightIJ) { bg = '#2196f3'; color = 'white'; }
            }
            // highlight the components
            if (highlightIJ && r===i && c===k) { bg = '#ff9800'; color='white'; }
            if (highlightIJ && r===k && c===j) { bg = '#ff9800'; color='white'; }

            html += `<td style="padding:15px;border:1px solid #eee;background:${bg};color:${color};font-weight:bold;transition:all 0.3s;">${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    rc.innerHTML = html;
}

// ─── Play logic ───────────────────────────────────────────────────────────────
async function waitStep() {
    while (window.OtherAnim.isPaused) await delay(100);
    if (!window.OtherAnim.isAnimating) throw new Error('reset');
    await delay(getDelay());
}

async function startVisualization() {
    if (window.OtherAnim.isAnimating) return;
    window.OtherAnim.isAnimating = true;
    window.OtherAnim.isPaused = false;
    window.stepCount = 0;
    
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('startBtn').disabled = true;
    if(document.getElementById('arraySize')) document.getElementById('arraySize').disabled = true;
    if(document.getElementById('nodeCount')) document.getElementById('nodeCount').disabled = true;
    
    clearLog();
    
    try {
        if (currentAlgorithm === 'kadane') await runKadane();
        else if (currentAlgorithm === 'floyd-warshall') await runFloydWarshall();
        else if (currentAlgorithm === 'warshall') await runWarshall();
        else if (currentAlgorithm === 'kmp') await runKMP();
        else if (currentAlgorithm === 'rabin-karp') await runRabinKarp();
    } catch(e) { }
    
    window.OtherAnim.isAnimating = false;
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('startBtn').disabled = false;
    let pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) pauseBtn.textContent = 'Pause';
    if(document.getElementById('arraySize')) document.getElementById('arraySize').disabled = false;
    if(document.getElementById('nodeCount')) document.getElementById('nodeCount').disabled = false;
}

// ─── Algorithms ───────────────────────────────────────────────────────────────
async function runKadane() {
    log(`Starting Kadane's Algorithm. Like keeping track of your best winning streak in a game — reset when you go negative, keep going when positive. We'll find the contiguous subarray with the largest sum. Next, we examine each element.`, 'info');
    let maxSoFar = -Infinity;
    let maxEndingHere = 0;
    let start = 0, tempStart = 0, end = 0;
    
    document.getElementById('extraCounterLabel').textContent = 'Global Max:';
    updateCounters(maxSoFar === -Infinity ? '-∞' : maxSoFar);
    
    for (let i = 0; i < currentArray.length; i++) {
        await waitStep();
        window.stepCount++;
        
        let hi = {}; hi[i] = '#ff9800';
        renderArrayBlocks(currentArray, hi, maxSoFar > -Infinity ? [start, end] : null);
        
        maxEndingHere += currentArray[i];
        
        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
            log(`New global maximum found! Ending at index ${i}, sum reached ${maxSoFar}. Like beating your all-time high score — we update our record to the new best result. Next, we continue checking if future elements can beat this.`, 'success');
        } else {
            log(`Examining element ${currentArray[i]} at index ${i}. Current running total is ${maxEndingHere}. Like adding a result to your current streak — if the total stays positive, the streak is worth keeping. Next, we see if it improved our overall record.`, 'active');
        }
        
        if (maxEndingHere < 0) {
            maxEndingHere = 0;
            tempStart = i + 1;
            log(`Running total went negative (${maxEndingHere}) — resetting subarray at index ${i}. Like ending a losing streak and starting fresh — a negative total only drags down future results. Next, we start a new subarray from the next element.`, 'fail');
        }
        
        updateCounters(maxSoFar);
        setVariablesDisplay('Variables', `maxEndingHere = ${maxEndingHere}<br>maxSoFar = ${maxSoFar}`);
        renderArrayBlocks(currentArray, hi, [start, end]);
    }
    
    log(`✅ Kadane's complete! Best streak found: ${maxSoFar}. Like reviewing your gaming history — this is the mathematically proven highest score possible from any continuous section. Final range highlighted.`, 'success');
    renderArrayBlocks(currentArray, {}, [start, end]);
}

async function runFloydWarshall() {
    log(`Starting Floyd-Warshall Algorithm. Like a travel agent checking if flying via a hub city (k) gives a cheaper route than flying direct between cities (i and j). We'll find all-pairs shortest paths. Next, we iterate through intermediate nodes.`, 'info');
    const n = fwMatrix.length;
    let dist = JSON.parse(JSON.stringify(fwMatrix));
    
    showDistanceTable(true, 'Distance Matrix');
    
    for (let k = 0; k < n; k++) {
        log(`Considering node V${k} as an intermediate hub. Like checking all possible flights that connect through this specific airport. Next, we update all pairs (i, j) that could benefit from this hub.`, 'info');
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i===j) continue;
                await waitStep();
                window.stepCount++;
                updateCounters();
                
                renderFWMatrix(dist, n, k, i, j, true, false);
                const dIK = (dist[i][k] === null || dist[i][k] === Infinity) ? '∞' : dist[i][k];
                const dKJ = (dist[k][j] === null || dist[k][j] === Infinity) ? '∞' : dist[k][j];
                const current = (dist[i][j] === null || dist[i][j] === Infinity) ? '∞' : dist[i][j];
                
                log(`Checking route V${i}→V${j} via hub V${k}. Current direct cost: ${current}, Cost via hub: ${dIK} + ${dKJ}. Like comparing a direct flight with a layover — we look for the cheaper option. Next, we decide if we should update.`, 'active');
                
                if (dist[i][k] !== null && dist[i][k] !== Infinity && dist[k][j] !== null && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    log(`Update found! The path via V${k} is shorter (${dist[i][j]}). Like the travel agent finding a cheaper layover — we update our records with the better route. Next, we continue checking other pairs.`, 'update');
                    renderFWMatrix(dist, n, k, i, j, true, true);
                    await waitStep();
                }
            }
        }
    }
    
    renderFWMatrix(dist, n);
    log(`✅ Floyd-Warshall complete! All shortest paths found. Like a perfectly optimized global flight map — every city-to-city route is now as cheap as possible. Final matrix displayed.`, 'success');
}

async function runWarshall() {
    log(`Starting Warshall's Algorithm. Like checking if you can reach any city from any other city using any combination of connecting flights. We'll compute the Transitive Closure. Next, we iterate through intermediate nodes.`, 'info');
    const n = fwMatrix.length;
    let reach = JSON.parse(JSON.stringify(fwMatrix));
    
    showDistanceTable(true, 'Reachability Matrix');
    
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i===j) continue;
                await waitStep();
                window.stepCount++;
                updateCounters();
                
                renderWarshallMatrix(reach, n, k, i, j, true, false);
                const canReachIK = reach[i][k] === 1 ? 'T' : 'F';
                const canReachKJ = reach[k][j] === 1 ? 'T' : 'F';
                const current = reach[i][j] === 1 ? 'T' : 'F';
                
                log(`Checking if V${i} can reach V${j} via V${k}. Direct: ${current}, Via k: ${canReachIK} AND ${canReachKJ}. Like seeing if a layover at V${k} connects two cities that weren't connected before. Next, we update reachability if a path exists.`, 'active');
                
                if (reach[i][j] === 0 && reach[i][k] === 1 && reach[k][j] === 1) {
                    reach[i][j] = 1;
                    log(`Connection confirmed! V${i} can now reach V${j} through V${k}. Like opening a new travel route between previously disconnected cities — our network becomes more reachable. Next, we check the next pair.`, 'success');
                    renderWarshallMatrix(reach, n, k, i, j, true, true);
                    await waitStep();
                }
            }
        }
    }
    
    renderWarshallMatrix(reach, n);
    log(`✅ Warshall's complete! Transitive Closure built. Like a fully connected map showing every possible destination reachable from each starting point. Final reachability matrix displayed.`, 'success');
}

async function runKMP() {
    log(`Starting KMP String Matching. Like a smart text search that remembers partial matches — never wastes a comparison it already made. We'll search for the pattern in the text. Next, we build the LPS (Failure) table.`, 'info');
    const t = textString;
    const p = patternString;
    const m = p.length;
    const n = t.length;
    
    // Compute LPS
    log(`First, compute LPS (Longest Proper Prefix which is also Suffix) array for Pattern`, 'info');
    let lps = Array(m).fill(0);
    let len = 0;
    let i = 1;
    
    setVariablesDisplay('LPS Array', `[${lps.join(', ')}]`);
    await waitStep();
    
    while (i < m) {
        await waitStep();
        if (p[i] === p[len]) {
            len++; lps[i] = len; i++;
            setVariablesDisplay('LPS Array', `[${lps.join(', ')}]`);
        } else {
            if (len !== 0) len = lps[len - 1];
            else { lps[i] = 0; i++; setVariablesDisplay('LPS Array', `[${lps.join(', ')}]`); }
        }
    }
    
    // Search
    log(`LPS array built! Now searching in Text...`, 'algorithm');
    i = 0;
    let j = 0;
    
    while (i < n) {
        await waitStep();
        window.stepCount++;
        updateCounters();
        
        renderStrings(t, p, i, j, {start: i-j, end: -1, success: false, fail: false});
        
        if (p[j] === t[i]) {
            log(`Character match! pattern[${j}] == text[${i}] ('${t[i]}'). Like finding the next correct letter in a password — we're one step closer to a full match. Next, we check the next character in the pattern.`, 'success');
            i++; j++;
            if (j === m) {
                log(`✅ Pattern found! Complete match at index ${i - j}. Like finding a specific quote in a massive book — we used the precomputed table to avoid redundant work. Next, we continue searching for more occurrences.`, 'success');
                renderStrings(t, p, -1, -1, {start: i-j, end: i-1, success: true, fail: false});
                await waitStep();
                j = lps[j - 1];
            }
        } else {
            log(`Mismatch at pattern[${j}] and text[${i}]. Like hitting a wrong note in a song — we need to adjust our position. Next, we use the LPS table to skip unnecessary comparisons.`, 'fail');
            renderStrings(t, p, i, j, {start: i-j, end: -1, success: false, fail: true});
            await waitStep();
            
            if (j !== 0) {
                j = lps[j - 1];
                log(`KMP Smart Skip: shifting pattern using LPS table to index ${j}. Like realizing you don't have to restart the song from the beginning because the last few notes still fit somewhere else. Next, we resume comparison.`, 'update');
            } else {
                i++;
            }
        }
    }
    log(`Search complete.`, 'algorithm');
    setVariablesDisplay('Variables', null);
}

async function runRabinKarp() {
    log(`Starting Rabin-Karp String Matching. Like using a fingerprint to quickly screen suspects before doing a full identity check. We'll use a rolling hash to skip clear mismatches. Next, we compute initial hashes.`, 'info');
    const t = textString;
    const p = patternString;
    const m = p.length;
    const n = t.length;
    
    const d = 256;
    const q = 101; 
    
    let h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * d) % q;
    
    let pHash = 0;
    let tHash = 0;
    
    for (let i = 0; i < m; i++) {
        pHash = (d * pHash + p.charCodeAt(i)) % q;
        tHash = (d * tHash + t.charCodeAt(i)) % q;
    }
    
    setVariablesDisplay('Hashes', `Pattern Hash = ${pHash}<br>Current Text Hash = ${tHash}`);
    log(`Initial Pattern Hash = ${pHash}`, 'info');
    
    for (let i = 0; i <= n - m; i++) {
        await waitStep();
        window.stepCount++;
        updateCounters();
        
        renderStrings(t, p, -1, -1, {start: i, end: -1});
        setVariablesDisplay('Hashes', `Pattern Hash = ${pHash}<br>Current Text Hash (${t.substring(i, i+m)}) = ${tHash}`);
        
        if (pHash === tHash) {
            log(`Hash match! Potential pattern found at index ${i}. Like finding a fingerprint match — it's highly likely this is our pattern, but we must verify the characters. Next, we perform a character-by-character check.`, 'active');
            let match = true;
            for (let j = 0; j < m; j++) {
                if (t[i + j] !== p[j]) {
                    match = false; break;
                }
            }
            if (match) {
                log(`✅ Verified! Characters match at index ${i}. Like confirming the suspect's identity after a fingerprint hit — we have a definitive pattern match. Next, we slide the window to continue.`, 'success');
                renderStrings(t, p, -1, -1, {start: i, end: i+m-1, success: true});
                await waitStep();
            } else {
                log(`Spurious hit! Hashes matched but characters differ. Like two people having similar fingerprints — the hash filter wasn't perfect, so we discard this window. Next, we slide to the next position.`, 'fail');
            }
        } else {
            log(`Hashes don't match (Text: ${tHash}, Pattern: ${pHash}). Like two completely different fingerprints — we can safely skip comparing these characters. Next, we slide the window using the rolling hash.`, 'discovery');
        }
        
        if (i < n - m) {
            log(`Rolling hash update: Sliding from index ${i} to ${i+1}. Like updating a running checksum — we only adjust for the entering and exiting characters, keeping it O(1). Next, we check the new hash.`, 'update');
            tHash = (d * (tHash - t.charCodeAt(i) * h) + t.charCodeAt(i + m)) % q;
            if (tHash < 0) tHash = (tHash + q);
        }
    }
    log(`Search complete.`, 'algorithm');
    setVariablesDisplay('', null);
}

// ─── Theory & Code Data ───────────────────────────────────────────────────────
const theoryData = {
    kadane: {
        title: "Kadane's Algorithm",
        definition: "Kadane's finds the maximum contiguous subarray sum in a 1D array.",
        working: "Iterate through the array, accumulating the sum. If the sum becomes negative, reset it to zero. Keep track of the maximum sum seen so far.",
        complexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
        space: "O(1)",
        useCases: "Financial analysis, computer vision, any max-sum continuous queries."
    },
    'floyd-warshall': {
        title: "Floyd Warshall Algorithm",
        definition: "Finds shortest paths between all pairs of vertices in a weighted graph.",
        working: "Uses Dynamic Programming. Considers each vertex as an intermediate point and updates the shortest path distance if a path via the intermediate vertex is strictly shorter.",
        complexity: { best: "O(V³)", average: "O(V³)", worst: "O(V³)" },
        space: "O(V²)",
        useCases: "Network routing, transitive closure, similarity metrics."
    },
    warshall: {
        title: "Warshall's Algorithm",
        definition: "Computes the transitive closure of a Boolean graph matrix.",
        working: "Checks if there is a path between node i and node j using an intermediate node k. If there's a path i->k and k->j, then i->j gets set to True.",
        complexity: { best: "O(n³)", average: "O(n³)", worst: "O(n³)" },
        space: "O(n²)",
        useCases: "Reachability analysis, evaluating dependencies, abstract relations."
    },
    kmp: {
        title: "KMP String Matching",
        definition: "Knuth-Morris-Pratt searches for occurrences of a 'word' W within a main 'text W' using an LPS array.",
        working: "Precomputes an LPS (Longest Proper Prefix which is also Suffix) array. Uses this array during search to skip characters that we know will match, avoiding backtracking in the text string.",
        complexity: { best: "O(n + m)", average: "O(n + m)", worst: "O(n + m)" },
        space: "O(m)",
        useCases: "Text editors, DNA sequence matching, data mining."
    },
    'rabin-karp': {
        title: "Rabin Karp Algorithm",
        definition: "Rabin-Karp is a string-searching algorithm that uses hashing to find any one of a set of pattern strings in a text.",
        working: "Computes a hash value for the pattern and for each M-character window of the text. If the hash values match, it verifies the characters explicitly. Slides the window using a rolling hash calculation in O(1).",
        complexity: { best: "O(n + m)", average: "O(n + m)", worst: "O(n*m) [with many hash collisions]" },
        space: "O(1)",
        useCases: "Plagiarism detection, multiple pattern search."
    }
};

const codeSnippets = {
    kadane: {
        cpp: `int maxSubArray(vector<int>& nums) {\n    int sum = 0, maxi = INT_MIN;\n    for(auto it : nums) {\n        sum += it;\n        maxi = max(sum, maxi);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`,
        python: `def maxSubArray(nums):\n    cur_sum = 0\n    max_sum = float('-inf')\n    for num in nums:\n        cur_sum += num\n        max_sum = max(max_sum, cur_sum)\n        if cur_sum < 0:\n            cur_sum = 0\n    return max_sum`,
        java: `public int maxSubArray(int[] nums) {\n    int sum = 0, maxi = Integer.MIN_VALUE;\n    for(int num : nums) {\n        sum += num;\n        maxi = Math.max(sum, maxi);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`,
        javascript: `function maxSubArray(nums) {\n    let sum = 0, maxi = -Infinity;\n    for(let num of nums) {\n        sum += num;\n        maxi = Math.max(sum, maxi);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`,
        c: `int maxSubArray(int* nums, int numsSize) {\n    int sum = 0, maxi = INT_MIN;\n    for(int i=0; i<numsSize; i++) {\n        sum += nums[i];\n        if(sum > maxi) maxi = sum;\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`
    },
    'floyd-warshall': {
        cpp: `void floydWarshall(vector<vector<int>>& dist, int V) {\n    for(int k=0; k<V; k++) {\n        for(int i=0; i<V; i++) {\n            for(int j=0; j<V; j++) {\n                if(dist[i][k] != INT_MAX && dist[k][j] != INT_MAX && \n                   dist[i][k] + dist[k][j] < dist[i][j])\n                    dist[i][j] = dist[i][k] + dist[k][j];\n            }\n        }\n    }\n}`,
        python: `def floydWarshall(graph, V):\n    dist = list(map(lambda i: list(map(lambda j: j, i)), graph))\n    for k in range(V):\n        for i in range(V):\n            for j in range(V):\n                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\n    return dist`,
        java: `void floydWarshall(int dist[][], int V) {\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                if (dist[i][k] + dist[k][j] < dist[i][j])\n                    dist[i][j] = dist[i][k] + dist[k][j];\n            }\n        }\n    }\n}`,
        javascript: `function floydWarshall(dist, V) {\n    for(let k=0; k<V; k++) {\n        for(let i=0; i<V; i++) {\n            for(let j=0; j<V; j++) {\n                if(dist[i][k] + dist[k][j] < dist[i][j])\n                    dist[i][j] = dist[i][k] + dist[k][j];\n            }\n        }\n    }\n    return dist;\n}`,
        c: `void floydWarshall(int dist[][V], int V) {\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                if (dist[i][k] + dist[k][j] < dist[i][j])\n                    dist[i][j] = dist[i][k] + dist[k][j];\n            }\n        }\n    }\n}`
    },
    warshall: {
        cpp: `void warshall(vector<vector<int>>& reach, int V) {\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);\n            }\n        }\n    }\n}`,
        python: `def warshall(graph, V):\n    reach = [row[:] for row in graph]\n    for k in range(V):\n        for i in range(V):\n            for j in range(V):\n                reach[i][j] = reach[i][j] or (reach[i][k] and reach[k][j])\n    return reach`,
        java: `void warshall(int reach[][], int V) {\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                reach[i][j] = (reach[i][j] != 0 || (reach[i][k] != 0 && reach[k][j] != 0)) ? 1 : 0;\n            }\n        }\n    }\n}`,
        javascript: `function warshall(reach, V) {\n    for(let k=0; k<V; k++) {\n        for(let i=0; i<V; i++) {\n            for(let j=0; j<V; j++) {\n                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);\n            }\n        }\n    }\n    return reach;\n}`,
        c: `void warshall(int reach[][V], int V) {\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);\n            }\n        }\n    }\n}`
    },
    kmp: {
        cpp: `void computeLPSArray(string pat, int M, int lps[]) {\n    int len = 0; lps[0] = 0; int i = 1;\n    while (i < M) {\n        if (pat[i] == pat[len]) {\n            len++; lps[i] = len; i++;\n        } else {\n            if (len != 0) len = lps[len - 1];\n            else { lps[i] = 0; i++; }\n        }\n    }\n}\nvoid KMPSearch(string pat, string txt) {\n    int M = pat.length(), N = txt.length();\n    int lps[M];\n    computeLPSArray(pat, M, lps);\n    int i = 0, j = 0;\n    while (i < N) {\n        if (pat[j] == txt[i]) { j++; i++; }\n        if (j == M) {\n            cout << "Found pattern at index " << i - j;\n            j = lps[j - 1];\n        } else if (i < N && pat[j] != txt[i]) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n}`,
        python: `def computeLPS(pat, M, lps):\n    len = 0; lps[0] = 0; i = 1\n    while i < M:\n        if pat[i] == pat[len]:\n            len += 1; lps[i] = len; i += 1\n        else:\n            if len != 0: len = lps[len-1]\n            else: lps[i] = 0; i += 1\n\ndef KMP(pat, txt):\n    M, N = len(pat), len(txt)\n    lps = [0]*M; j = 0; computeLPS(pat, M, lps)\n    i = 0\n    while i < N:\n        if pat[j] == txt[i]:\n            i += 1; j += 1\n        if j == M:\n            print("Found at " + str(i-j))\n            j = lps[j-1]\n        elif i < N and pat[j] != txt[i]:\n            if j != 0: j = lps[j-1]\n            else: i += 1`,
        java: `void computeLPSArray(String pat, int M, int lps[]) {\n    int len = 0; int i = 1; lps[0] = 0;\n    while (i < M) {\n        if (pat.charAt(i) == pat.charAt(len)) {\n            len++; lps[i] = len; i++;\n        } else {\n            if (len != 0) len = lps[len - 1];\n            else { lps[i] = len; i++; }\n        }\n    }\n}\nvoid KMPSearch(String pat, String txt) {\n    int M = pat.length(), N = txt.length();\n    int lps[] = new int[M];\n    computeLPSArray(pat, M, lps);\n    int i = 0, j = 0;\n    while (i < N) {\n        if (pat.charAt(j) == txt.charAt(i)) { j++; i++; }\n        if (j == M) {\n            System.out.println("Found pattern at index " + (i - j));\n            j = lps[j - 1];\n        } else if (i < N && pat.charAt(j) != txt.charAt(i)) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n}`,
        javascript: `function computeLPS(pat) {\n    let M = pat.length, lps = new Array(M).fill(0);\n    let len = 0, i = 1;\n    while (i < M) {\n        if (pat[i] === pat[len]) { len++; lps[i] = len; i++; }\n        else {\n            if (len !== 0) len = lps[len - 1];\n            else { lps[i] = 0; i++; }\n        }\n    }\n    return lps;\n}\nfunction KMPSearch(pat, txt) {\n    let M = pat.length, N = txt.length;\n    let lps = computeLPS(pat), i = 0, j = 0;\n    while (i < N) {\n        if (pat[j] === txt[i]) { i++; j++; }\n        if (j === M) {\n            console.log("Found at: " + (i - j));\n            j = lps[j - 1];\n        } else if (i < N && pat[j] !== txt[i]) {\n            if (j !== 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n}`,
        c: `void computeLPSArray(char* pat, int M, int* lps) {\n    int len = 0; lps[0] = 0; int i = 1;\n    while (i < M) {\n        if (pat[i] == pat[len]) {\n            len++; lps[i] = len; i++;\n        } else {\n            if (len != 0) len = lps[len - 1];\n            else { lps[i] = 0; i++; }\n        }\n    }\n}\nvoid KMPSearch(char* pat, char* txt) {\n    int M = strlen(pat), N = strlen(txt);\n    int lps[M];\n    computeLPSArray(pat, M, lps);\n    int i = 0, j = 0;\n    while (i < N) {\n        if (pat[j] == txt[i]) { j++; i++; }\n        if (j == M) {\n            printf("Found pattern at index %d", i - j);\n            j = lps[j - 1];\n        } else if (i < N && pat[j] != txt[i]) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n}`
    },
    'rabin-karp': {
        cpp: `void search(char pat[], char txt[], int q) {\n    int M = strlen(pat), N = strlen(txt);\n    int i, j, p = 0, t = 0, h = 1, d = 256;\n    for (i = 0; i < M - 1; i++) h = (h * d) % q;\n    for (i = 0; i < M; i++) {\n        p = (d * p + pat[i]) % q;\n        t = (d * t + txt[i]) % q;\n    }\n    for (i = 0; i <= N - M; i++) {\n        if (p == t) {\n            for (j = 0; j < M; j++) if (txt[i+j] != pat[j]) break;\n            if (j == M) cout<<"Pattern found at "<<i<<endl;\n        }\n        if (i < N - M) {\n            t = (d * (t - txt[i] * h) + txt[i + M]) % q;\n            if (t < 0) t = (t + q);\n        }\n    }\n}`,
        python: `def search(pat, txt, q):\n    M, N = len(pat), len(txt)\n    i, j, p, t, h = 0, 0, 0, 0, 1\n    d = 256\n    for i in range(M-1): h = (h*d)%q\n    for i in range(M):\n        p = (d*p + ord(pat[i]))%q\n        t = (d*t + ord(txt[i]))%q\n    for i in range(N-M+1):\n        if p == t:\n            for j in range(M):\n                if txt[i+j] != pat[j]: break\n            j+=1\n            if j == M: print("Found at " + str(i))\n        if i < N-M:\n            t = (d*(t-ord(txt[i])*h) + ord(txt[i+M]))%q\n            if t < 0: t = t+q`,
        java: `void search(String pat, String txt, int q) {\n    int M = pat.length(), N = txt.length(), i, j;\n    int p = 0, t = 0, h = 1, d = 256;\n    for (i = 0; i < M - 1; i++) h = (h * d) % q;\n    for (i = 0; i < M; i++) {\n        p = (d * p + pat.charAt(i)) % q;\n        t = (d * t + txt.charAt(i)) % q;\n    }\n    for (i = 0; i <= N - M; i++) {\n        if (p == t) {\n            for (j = 0; j < M; j++) {\n                if (txt.charAt(i + j) != pat.charAt(j)) break;\n            }\n            if (j == M) System.out.println("Pattern found at index " + i);\n        }\n        if (i < N - M) {\n            t = (d * (t - txt.charAt(i) * h) + txt.charAt(i + M)) % q;\n            if (t < 0) t = (t + q);\n        }\n    }\n}`,
        javascript: `function search(pat, txt, q) {\n    let M = pat.length, N = txt.length;\n    let i, j, p = 0, t = 0, h = 1, d = 256;\n    for (i = 0; i < M - 1; i++) h = (h * d) % q;\n    for (i = 0; i < M; i++) {\n        p = (d * p + pat.charCodeAt(i)) % q;\n        t = (d * t + txt.charCodeAt(i)) % q;\n    }\n    for (i = 0; i <= N - M; i++) {\n        if (p === t) {\n            for (j = 0; j < M; j++) if (txt[i+j] !== pat[j]) break;\n            if (j === M) console.log("Pattern found at index " + i);\n        }\n        if (i < N - M) {\n            t = (d * (t - txt.charCodeAt(i) * h) + txt.charCodeAt(i + M)) % q;\n            if (t < 0) t = (t + q);\n        }\n    }\n}`,
        c: `void search(char pat[], char txt[], int q) {\n    int M = strlen(pat), N = strlen(txt);\n    int i, j, p = 0, t = 0, h = 1, d = 256;\n    for (i = 0; i < M - 1; i++) h = (h * d) % q;\n    for (i = 0; i < M; i++) {\n        p = (d * p + pat[i]) % q;\n        t = (d * t + txt[i]) % q;\n    }\n    for (i = 0; i <= N - M; i++) {\n        if (p == t) {\n            for (j = 0; j < M; j++) if (txt[i+j] != pat[j]) break;\n            if (j == M) printf("Pattern found at index %d", i);\n        }\n        if (i < N - M) {\n            t = (d * (t - txt[i] * h) + txt[i + M]) % q;\n            if (t < 0) t = (t + q);\n        }\n    }\n}`
    }
};

function loadTheory(algorithm) {
    const data = theoryData[algorithm];
    if (!data) return;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('theoryContent').innerHTML = `
        <h3>${data.title}</h3>
        <h4>Definition</h4><p>${data.definition}</p>
        <h4>How It Works</h4><p>${data.working}</p>
        <h4>Time Complexity</h4>
        <ul>
            <li>Best: ${data.complexity.best}</li>
            <li>Average: ${data.complexity.average}</li>
            <li>Worst: ${data.complexity.worst}</li>
        </ul>
        <h4>Space Complexity</h4><p>${data.space}</p>
        <h4>Use Cases</h4><p>${data.useCases}</p>
    `;
    updateCodeContent('cpp');
}

function updateCodeContent(lang) {
    const snippets = codeSnippets[currentAlgorithm];
    const el = document.getElementById('codeContent');
    if (!el) return;
    const prismLang = { cpp: 'cpp', python: 'python', java: 'java', javascript: 'javascript', c: 'c' };
    const cls = prismLang[lang] || 'cpp';
    
    let rawCode = snippets && snippets[lang] ? snippets[lang] : '// Code not available for this combination.';
    let cleanCode = rawCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    el.innerHTML = `<pre><code class="language-${cls}">${cleanCode}</code></pre>`;
    if (typeof Prism !== 'undefined') Prism.highlightAll();
}

function switchTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-tab="${name}"]`).classList.add('active');
    document.getElementById(name).classList.add('active');
    if (name === 'code') updateCodeContent(document.querySelector('.lang-tab.active').dataset.lang);
    if (name === 'explanation') {
        const el = document.getElementById('explanationContent');
        if (el && currentAlgorithm) {
            el.innerHTML = generateOtherExplanation(currentAlgorithm);
        }
    }
}

function generateOtherExplanation(algorithm) {
    const examples = {
        kadane: `
        <h3>Kadane's Algorithm: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Array:</h4>
            <div class="array-display" style="background:#f0f4ff;padding:10px;border-radius:6px;font-family:monospace;">
                [-2, 1, -3, 4, -1, 2, 1, -5, 4]
            </div>
            <p><strong>Goal:</strong> Find the contiguous sub-array with the maximum sum.</p>
        </div>
        <div class="step-by-step">
            <h4>Process: (track maxEndingHere & maxSoFar)</h4>
            <div class="step">
                <h5>Step 1: start at [0]: -2</h5>
                <p>maxEndingHere = max(-2, -2) = <strong>-2</strong> | maxSoFar = <strong>-2</strong></p>
                <p>Wait, maxEndingHere < 0, reset it to 0.</p>
            </div>
            <div class="step">
                <h5>Step 2: [1]: 1</h5>
                <p>maxEndingHere = 0 + 1 = <strong>1</strong> | maxSoFar = max(-2, 1) = <strong>1</strong></p>
            </div>
            <div class="step">
                <h5>Step 3: [2]: -3</h5>
                <p>maxEndingHere = 1 - 3 = <strong>-2</strong> (Reset to 0) | maxSoFar = <strong>1</strong></p>
            </div>
            <div class="step">
                <h5>Steps 4-7: The sweet spot [4, -1, 2, 1]</h5>
                <p>Sum = 4 - 1 + 2 + 1 = <strong>6</strong></p>
                <p>maxSoFar updates to <strong>6</strong></p>
            </div>
            <div class="result">
                <h5>✅ Maximum Subarray Sum: 6</h5>
                <p>Subarray elements: <strong>[4, -1, 2, 1]</strong></p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        'floyd-warshall': `
        <h3>Floyd Warshall: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Graph:</h4>
            <p>Vertices: A, B, C, D</p>
            <p><strong>Goal:</strong> Find shortest path from everywhere to everywhere via intermediary <em>k</em>.</p>
        </div>
        <div class="step-by-step">
            <h4>Process Matrix via k dynamically:</h4>
            <div class="step">
                <h5>Step 1: k = A (Use A as intermediate)</h5>
                <p>Check all pairs (i, j). If going i → A → j is shorter than i → j directly, update the distance matrix.</p>
            </div>
            <div class="step">
                <h5>Step 2: k = B (Use B as intermediate)</h5>
                <p>Now paths can use A and/or B. Check if i → B → j reduces distance.</p>
                <p>Example: If A → B is 3, and B → D is 5, then A → D becomes min(Current[A→D], 3+5=8).</p>
            </div>
            <div class="step">
                <h5>Repeat for C and D</h5>
                <p>By the time k=D is processed, the matrix reflects paths using any possible combination of intermediaries.</p>
            </div>
            <div class="result">
                <h5>✅ Result</h5>
                <p>Final matrix holds absolute shortest distance for all pairs. Complexity: O(V³).</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        warshall: `
        <h3>Warshall's Algorithm: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Graph:</h4>
            <p>Vertices: A, B, C, D</p>
            <p><strong>Goal:</strong> Determine Boolean Reachability (Transitive Closure). Can we reach j from i?</p>
        </div>
        <div class="step-by-step">
            <h4>Process Boolean Paths via k dynamically:</h4>
            <div class="step">
                <h5>Step 1: k = A (Use A as intermediate)</h5>
                <p>Check all pairs (i, j). If you can go i → A (True) AND A → j (True), then set i → j to True!</p>
            </div>
            <div class="step">
                <h5>Step 2: Logical OR updates</h5>
                <p>Instead of distances and minimums, we just use logical operators.</p>
                <p><code>reach[i][j] = reach[i][j] OR (reach[i][k] AND reach[k][j])</code></p>
            </div>
            <div class="step">
                <h5>Repeat for all intermediaries</h5>
                <p>By the time all nodes are processed as intermediaries, every possible path chain has been evaluated.</p>
            </div>
            <div class="result">
                <h5>✅ Result</h5>
                <p>Final matrix shows T/F describing if ANY path exists between two nodes.</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        kmp: `
        <h3>KMP String Matching: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example:</h4>
            <p>Text: <strong>ABABDABACDABABCABAB</strong></p>
            <p>Pattern: <strong>ABABCABAB</strong></p>
        </div>
        <div class="step-by-step">
            <h4>Step 1: Compute LPS Array (Longest Proper Prefix/Suffix)</h4>
            <div class="step">
                <p>Pattern: A B A B C A B A B</p>
                <p>LPS Array: <strong>[0, 0, 1, 2, 0, 1, 2, 3, 4]</strong></p>
                <p><em>Meaning:</em> If mismatch occurs at index 4 ('C'), LPS[3] is 2, so shift pattern by 2 and continue, skipping redundant checks.</p>
            </div>
            <h4>Step 2: Compare with Text</h4>
            <div class="step">
                <h5>Match Prefix!</h5>
                <p>Compare Text and Pattern. Both start "ABAB...</p>
                <p>Mismatch happens at Text = 'D', Pattern = 'C'.</p>
            </div>
            <div class="step">
                <h5>Shift smartly!</h5>
                <p>Instead of backtracking text window to index 1, we know "AB" matched. Shift pattern using LPS value and carry on!</p>
            </div>
            <div class="result">
                <h5>✅ Result</h5>
                <p>Avoids backtracking in Text entirely. Time: O(N + M).</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        'rabin-karp': `
        <h3>Rabin Karp Check: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example:</h4>
            <p>Text: <strong>A B C D A B C E</strong></p>
            <p>Pattern: <strong>B C D</strong></p>
        </div>
        <div class="step-by-step">
            <h4>Process: (Rolling Hash approach)</h4>
            <div class="step">
                <h5>Step 1: Hash the Pattern</h5>
                <p>Hash("BCD") = <strong>430</strong> (Example numeric hash mapping)</p>
            </div>
            <div class="step">
                <h5>Step 2: Sliding Window Hash</h5>
                <p>Hash("ABC") = 120 ➔ Mismatch (120 != 430)</p>
            </div>
            <div class="step">
                <h5>Step 3: Roll the Hash!</h5>
                <p>Instead of recalculating Hash("BCD") from scratch, subtract 'A', multiply by base, add 'D'. (O(1) operation)</p>
                <p>Hash("BCD") = <strong>430</strong> ➔ Hash Match (430 == 430)!</p>
            </div>
            <div class="step">
                <h5>Step 4: Verify</h5>
                <p>Check characters strictly: B==B, C==C, D==D. Verified!</p>
            </div>
            <div class="result">
                <h5>✅ Result</h5>
                <p>Incredibly fast for searching MULTIPLE patterns simultaneously via hash tables.</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`
    };
    return examples[algorithm] || `<p>Explanation not available for ${algorithm}.</p>`;
}

// ─── DOM Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Close modal bounds
    document.querySelector('.close').onclick = () => {
        if(modal) modal.style.display = 'none';
        window.OtherAnim.isAnimating = false;
        window.OtherAnim.isPaused = false;
    };
    window.onclick = e => { if (e.target === modal) { modal.style.display='none'; window.OtherAnim.isAnimating = false; window.OtherAnim.isPaused = false;} };

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn =>
        btn.addEventListener('click', () => switchTab(btn.dataset.tab))
    );
    document.querySelectorAll('.lang-tab').forEach(btn =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCodeContent(btn.dataset.lang);
        })
    );
});
