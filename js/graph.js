// Graph Algorithms Page JavaScript
// Mirrors the structure of sorting.js and searching.js

// ─── State ────────────────────────────────────────────────────────────────────
let currentAlgorithm = '';
let visualizer;
let graphNodes = new Map();   // id → label
let graphEdges = new Map();   // id → [{node, weight}]
let nodePositions = new Map();// id → {x,y}  (SVG coords)

window.GraphAnim = {
    isAnimating: false,
    isPaused: false,
    animationSpeed: 5
};

window.stepCount   = 0;
window.visitCount  = 0;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
let modal, startBtn, pauseBtn, resetBtn, generateBtn;
let nodeCountSlider, speedSlider, startNodeInput, endNodeInput;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function getDelay() { return (11 - window.GraphAnim.animationSpeed) * 120; }

function log(msg, type = 'info') {
    const panel = document.getElementById('liveExplanation');
    if (!panel) return;

    // Color class mapping for graph actions
    const colorMap = {
        'visiting':  'expl-visiting',
        'complete':  'expl-complete',
        'backtrack': 'expl-backtrack',
        'discovery': 'expl-discovery',
        'mst':       'expl-mst',
        'info':      'expl-info'
    };

    const p = document.createElement('p');
    p.textContent = msg;
    p.className = 'explanation-item ' + (colorMap[type] || 'expl-info');
    
    panel.appendChild(p);
    panel.scrollTop = panel.scrollHeight;
    
    const items = panel.querySelectorAll('.explanation-item');
    if (items.length > 50) items[0].remove();
}

function clearLog() {
    const panel = document.getElementById('liveExplanation');
    if (panel) panel.innerHTML = '';
}

function updateCounters() {
    const sc = document.getElementById('stepCounter');
    const nv = document.getElementById('nodesVisited');
    if (sc) sc.textContent = window.stepCount;
    if (nv) nv.textContent = window.visitCount;
}

function setQueueDisplay(title, content) {
    const qd = document.getElementById('queueDisplay');
    const qt = document.getElementById('queueTitle');
    const qc = document.getElementById('queueContent');
    if (qd) qd.style.display = content !== null ? '' : 'none';
    if (qt) qt.textContent = title;
    if (qc) qc.textContent = content || '—';
}

// ─── Graph Generation ─────────────────────────────────────────────────────────
const NODE_LABELS = ['A','B','C','D','E','F','G','H','I','J'];

function generateGraph() {
    const count = parseInt(nodeCountSlider.value);
    graphNodes = new Map();
    graphEdges = new Map();
    nodePositions = new Map();

    // Positions arranged in a circle on 800×400 SVG
    const cx = 400, cy = 200, r = 155;
    for (let i = 0; i < count; i++) {
        const label = NODE_LABELS[i];
        const angle = (2 * Math.PI * i / count) - Math.PI / 2;
        const x = Math.round(cx + r * Math.cos(angle));
        const y = Math.round(cy + r * Math.sin(angle));
        graphNodes.set(label, label);
        nodePositions.set(label, {x, y});
        graphEdges.set(label, []);
    }

    // Generate random connected edges with weights
    const labels = [...graphNodes.keys()];
    // Ensure connectivity via a spanning path
    for (let i = 0; i < labels.length - 1; i++) {
        const w = Math.floor(Math.random() * 14) + 1;
        addEdge(labels[i], labels[i + 1], w);
    }
    // Add a few extra random edges
    const extra = Math.min(count - 1, 4);
    let attempts = 0;
    let added = 0;
    while (added < extra && attempts < 50) {
        attempts++;
        const a = labels[Math.floor(Math.random() * labels.length)];
        const b = labels[Math.floor(Math.random() * labels.length)];
        if (a !== b && !graphEdges.get(a).some(e => e.node === b)) {
            const w = Math.floor(Math.random() * 14) + 1;
            addEdge(a, b, w);
            added++;
        }
    }

    renderGraphSVG();
    resetStats();
}

function addEdge(a, b, w) {
    graphEdges.get(a).push({node: b, weight: w});
    graphEdges.get(b).push({node: a, weight: w});
}

// ─── SVG Rendering ────────────────────────────────────────────────────────────
function renderGraphSVG(highlightNodes = {}, highlightEdges = {}) {
    const container = document.getElementById('visualizer');
    if (!container) return;
    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.style.display = 'block';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    const nodeColorMap = {
        unvisited: '#6c757d', current: '#f44336',
        visited: '#2196f3', queued: '#9c27b0',
        stack: '#ff9800', complete: '#4caf50',
        path: '#e91e63', mst: '#e91e63', start: '#ff5722'
    };
    const edgeColorMap = {
        default: '#aaa', visited: '#2196f3',
        path: '#e91e63', mst: '#e91e63', current: '#ff9800'
    };

    // Draw edges first
    for (const [from, neighbors] of graphEdges) {
        const fp = nodePositions.get(from);
        for (const {node: to, weight} of neighbors) {
            // Avoid duplicate edges (draw A→B only when from < to lexicographically)
            if (from >= to) continue;
            const tp = nodePositions.get(to);
            const edgeKey = `${from}-${to}`;
            const eColor = edgeColorMap[highlightEdges[edgeKey]] || edgeColorMap.default;
            const eWidth = highlightEdges[edgeKey] && highlightEdges[edgeKey] !== 'default' ? 4 : 2;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fp.x); line.setAttribute('y1', fp.y);
            line.setAttribute('x2', tp.x); line.setAttribute('y2', tp.y);
            line.setAttribute('stroke', eColor);
            line.setAttribute('stroke-width', eWidth);
            line.setAttribute('stroke-linecap', 'round');
            line.style.transition = 'all 0.4s ease';
            svg.appendChild(line);

            // Weight label
            const mx = (fp.x + tp.x) / 2, my = (fp.y + tp.y) / 2;
            const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bg.setAttribute('x', mx - 10); bg.setAttribute('y', my - 9);
            bg.setAttribute('width', 20); bg.setAttribute('height', 16);
            bg.setAttribute('fill', 'white'); bg.setAttribute('rx', 3);
            bg.setAttribute('stroke', '#ddd'); bg.setAttribute('stroke-width', 1);
            svg.appendChild(bg);

            const wt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            wt.setAttribute('x', mx); wt.setAttribute('y', my + 4);
            wt.setAttribute('text-anchor', 'middle');
            wt.setAttribute('font-size', '11');
            wt.setAttribute('font-weight', '600');
            wt.setAttribute('fill', '#333');
            wt.textContent = weight;
            svg.appendChild(wt);
        }
    }

    // Draw nodes
    for (const [id] of graphNodes) {
        const pos = nodePositions.get(id);
        const state = highlightNodes[id] || 'unvisited';
        const fill = nodeColorMap[state] || nodeColorMap.unvisited;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', 24);
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', 2.5);
        circle.style.transition = 'fill 0.4s ease';
        svg.appendChild(circle);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', pos.x); label.setAttribute('y', pos.y + 5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', 'white');
        label.setAttribute('font-size', '15');
        label.setAttribute('font-weight', '700');
        label.setAttribute('pointer-events', 'none');
        label.textContent = id;
        svg.appendChild(label);

        // Click to set start/end node
        circle.style.cursor = 'pointer';
        circle.addEventListener('click', () => onNodeClick(id));
    }

    container.appendChild(svg);
}

function onNodeClick(id) {
    if (window.GraphAnim.isAnimating) return;
    if (currentAlgorithm === 'dijkstra') {
        endNodeInput.value = id;
    } else {
        startNodeInput.value = id;
    }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function resetStats() {
    window.stepCount = 0;
    window.visitCount = 0;
    updateCounters();
    clearLog();
    log('Graph ready. Click Start to run the algorithm.');
    setQueueDisplay('Queue', null);
    showDistanceTable(false);
    document.getElementById('distanceInfo').style.display = 'none';
    document.getElementById('edgesInfo').style.display = 'none';
    document.getElementById('totalDistance').textContent = '0';
    document.getElementById('mstEdges').textContent = '0';
    if (window.TraversalPath) window.TraversalPath.clear();
}

function showDistanceTable(show, title='Distance Table') {
    const dt = document.getElementById('distanceTable');
    const tt = document.getElementById('tableTitle');
    if (dt) dt.style.display = show ? '' : 'none';
    if (tt) tt.textContent = title;
}

function renderDistanceTable(dist, prev, nodes) {
    const dtc = document.getElementById('distanceTableContent');
    if (!dtc) return;
    let html = '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;">';
    html += '<tr><th style="padding:4px 6px;background:#667eea;color:white;border-radius:4px 0 0 0;">Node</th><th style="padding:4px 6px;background:#667eea;color:white;">Dist</th><th style="padding:4px 6px;background:#667eea;color:white;border-radius:0 4px 0 0;">Prev</th></tr>';
    for (const n of nodes) {
        const d = dist[n] === Infinity ? '∞' : dist[n];
        const p = prev[n] || '—';
        html += `<tr><td style="padding:3px 6px;border-bottom:1px solid #eee;font-weight:600;">${n}</td><td style="padding:3px 6px;border-bottom:1px solid #eee;">${d}</td><td style="padding:3px 6px;border-bottom:1px solid #eee;">${p}</td></tr>`;
    }
    html += '</table>';
    dtc.innerHTML = html;
}

function renderEdgeTable(edges, title) {
    const dtc = document.getElementById('distanceTableContent');
    if (!dtc) return;
    let html = '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;">';
    html += `<tr><th style="padding:4px 6px;background:#667eea;color:white;">Edge</th><th style="padding:4px 6px;background:#667eea;color:white;">Weight</th></tr>`;
    for (const {from, to, weight, inMST} of edges) {
        const bg = inMST ? '#e8f5e9' : 'white';
        html += `<tr style="background:${bg}"><td style="padding:3px 6px;border-bottom:1px solid #eee;">${from}–${to}</td><td style="padding:3px 6px;border-bottom:1px solid #eee;">${weight}</td></tr>`;
    }
    html += '</table>';
    dtc.innerHTML = html;
}

// ─── Modal open / theory ──────────────────────────────────────────────────────
function openAlgorithmModal(algorithm) {
    currentAlgorithm = algorithm;
    modal.style.display = 'block';
    loadTheory(algorithm);
    updateLegendAndControls(algorithm);
    generateGraph();
}

function showAlgorithmTheory(algorithm) {
    openAlgorithmModal(algorithm);
}

function updateLegendAndControls(algorithm) {
    const pathItem = document.getElementById('pathLegendItem');
    const mstItem  = document.getElementById('mstLegendItem');
    const endGroup = document.getElementById('endNodeGroup');
    const distInfo = document.getElementById('distanceInfo');
    const edgeInfo = document.getElementById('edgesInfo');

    pathItem.style.display = 'none';
    mstItem.style.display  = 'none';
    endGroup.style.display = 'none';
    distInfo.style.display = 'none';
    edgeInfo.style.display = 'none';

    if (algorithm === 'dijkstra') {
        pathItem.style.display = '';
        endGroup.style.display = '';
        distInfo.style.display = '';
    }
    if (algorithm === 'prim' || algorithm === 'kruskal') {
        mstItem.style.display = '';
        edgeInfo.style.display = '';
    }
}

// ─── Algorithm starters ───────────────────────────────────────────────────────
function startVisualization() {
    if (window.GraphAnim.isAnimating) return;
    const start = (startNodeInput.value || 'A').toUpperCase().trim();
    if (!graphNodes.has(start)) {
        log(`⚠️ Node "${start}" not found. Using first node.`);
        startNodeInput.value = [...graphNodes.keys()][0];
    }

    window.GraphAnim.isAnimating = true;
    window.GraphAnim.isPaused = false;
    window.stepCount = 0;
    window.visitCount = 0;
    if (window.TraversalPath) window.TraversalPath.init(currentAlgorithm);
    clearLog();
    generateBtn.disabled = true;
    startBtn.disabled = true;
    nodeCountSlider.disabled = true;

    const startNode = (startNodeInput.value || 'A').toUpperCase().trim();

    if (currentAlgorithm === 'bfs')       runBFS(startNode);
    else if (currentAlgorithm === 'dfs')  runDFS(startNode);
    else if (currentAlgorithm === 'dijkstra') {
        const end = (endNodeInput.value || [...graphNodes.keys()].pop()).toUpperCase().trim();
        runDijkstra(startNode, end);
    }
    else if (currentAlgorithm === 'prim')    runPrim(startNode);
    else if (currentAlgorithm === 'kruskal') runKruskal();
}

function togglePause() {
    if (!window.GraphAnim.isAnimating) return;
    window.GraphAnim.isPaused = !window.GraphAnim.isPaused;
    pauseBtn.textContent = window.GraphAnim.isPaused ? 'Resume' : 'Pause';
}

function resetVisualization() {
    window.GraphAnim.isAnimating = false;
    window.GraphAnim.isPaused = false;
    pauseBtn.textContent = 'Pause';
    generateBtn.disabled = false;
    startBtn.disabled = false;
    nodeCountSlider.disabled = false;
    generateGraph();
}

function enableControls() {
    window.GraphAnim.isAnimating = false;
    window.GraphAnim.isPaused = false;
    generateBtn.disabled = false;
    startBtn.disabled = false;
    nodeCountSlider.disabled = false;
    pauseBtn.textContent = 'Pause';
}

// ─── Wait helper (pause-aware) ────────────────────────────────────────────────
async function waitStep() {
    while (window.GraphAnim.isPaused) await delay(100);
    if (!window.GraphAnim.isAnimating) throw new Error('reset');
    await delay(getDelay());
}

// ─── BFS ──────────────────────────────────────────────────────────────────────
async function runBFS(start) {
    log(`🔍 BFS starting from node ${start}. Like ripples spreading outward from a stone dropped in water — exploring all nearby nodes before going further. This ensures we find the shortest path in unweighted graphs. Next, we check the first node in the queue.`, 'info');
    setQueueDisplay('Queue', `[${start}]`);

    const visited = new Set();
    const queue = [start];
    visited.add(start);
    const nodeStates = {};
    const edgeStates = {};

    nodeStates[start] = 'current';
    renderGraphSVG(nodeStates, edgeStates);

    try {
        while (queue.length > 0) {
            await waitStep();

            const node = queue.shift();
            window.stepCount++;
            window.visitCount++;
            updateCounters();

            nodeStates[node] = 'visited';
            if (window.TraversalPath) window.TraversalPath.addNode(node);
            log(`Now visiting node ${node} (dequeued from front). Like the ripple fully arriving at this point — we explore all of ${node}'s unvisited neighbors now. Node ${node} is marked visited. Next, we scan for its neighbors.`, 'visiting');
            renderGraphSVG(nodeStates, edgeStates);

            setQueueDisplay('Queue', queue.length ? `[${queue.join(', ')}]` : '(empty)');

            for (const {node: neighbor} of graphEdges.get(node)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    nodeStates[neighbor] = 'queued';
                    const ek = [node, neighbor].sort().join('-');
                    edgeStates[ek] = 'visited';
                    log(`Adding neighbor ${neighbor} to the queue. Like a ripple reaching a new point on the water surface — this node is now known but not yet fully explored. Next, we continue processing the queue before visiting ${neighbor}.`, 'discovery');
                }
            }

            renderGraphSVG(nodeStates, edgeStates);
            setQueueDisplay('Queue', queue.length ? `[${queue.join(', ')}]` : '(empty)');
            await waitStep();
        }

        // Mark all visited nodes as complete (green)
        for (const node of visited) {
            nodeStates[node] = 'complete';
        }
        renderGraphSVG(nodeStates, edgeStates);
        log(`✅ BFS complete! All reachable nodes visited. Like the ripple reaching every reachable point in the pond — BFS guarantees the shortest path here. Traversal finished in ${window.stepCount} steps.`, 'complete');
    } catch(e) {
        if (e && e.message !== 'reset') console.error('[BFS Error]', e);
    }
    enableControls();
}

// ─── DFS (Iterative — stack-based, avoids recursion limit) ──────────────────
async function runDFS(start) {
    log(`🔍 DFS starting from node ${start}. Like navigating a maze by always going as deep as possible before backtracking to try another path. This helps in exploring entire branches fully. Next, we visit the top of the stack.`, 'info');

    const visited  = new Set();
    const nodeStates = {};
    const edgeStates = {};
    // Explicit stack holds { node, parent } pairs
    const stack = [{ node: start, parent: null }];

    try {
        while (stack.length > 0) {
            if (!window.GraphAnim.isAnimating) throw new Error('reset');
            while (window.GraphAnim.isPaused) await delay(100);

            const { node, parent } = stack.pop();

            if (visited.has(node)) continue;
            visited.add(node);
            if (window.TraversalPath) window.TraversalPath.addNode(node);

            window.stepCount++;
            window.visitCount++;
            updateCounters();

            nodeStates[node] = 'current';
            if (parent !== null) {
                const ek = [parent, node].sort().join('-');
                edgeStates[ek] = 'visited';
            }
            log(`Now visiting node ${node}. Like walking into a new passage in a maze — we go as deep as we can from here. Node ${node} is marked visited. Next, we look for its unvisited neighbors to push them onto the stack.`, 'visiting');
            renderGraphSVG(nodeStates, edgeStates);
            setQueueDisplay('Stack', stack.length
                ? `[${stack.map(s => s.node).reverse().join(', ')}]`
                : '(empty)');
            await delay(getDelay());

            nodeStates[node] = 'visited';
            renderGraphSVG(nodeStates, edgeStates);

            // Push unvisited neighbours onto stack (reverse order for left-to-right traversal)
            const neighbours = [...graphEdges.get(node)].reverse();
            for (const { node: neighbour } of neighbours) {
                if (!visited.has(neighbour)) {
                    stack.push({ node: neighbour, parent: node });
                    // Mark node as "in stack" so it shows orange
                    if (!nodeStates[neighbour] || nodeStates[neighbour] === 'unvisited') {
                        nodeStates[neighbour] = 'stack';
                    }
                    log(`Pushing neighbor ${neighbour} onto the stack. Like marking a junction in the maze to return to later — we'll come back if our current path hits a dead end. Next, we'll keep going deeper if possible.`, 'discovery');
                }
            }
            renderGraphSVG(nodeStates, edgeStates);
            setQueueDisplay('Stack', stack.length
                ? `[${stack.map(s => s.node).reverse().join(', ')}]`
                : '(empty)');
        }
        // Mark all visited nodes as complete (green)
        for (const node of visited) {
            nodeStates[node] = 'complete';
        }
        renderGraphSVG(nodeStates, edgeStates);
        log(`✅ DFS complete! All branches explored. Like having mapped every possible passage in the maze — we've visited all reachable nodes. Traversal finished in ${window.stepCount} steps.`, 'complete');
    } catch(e) {
        if (e && e.message !== 'reset') console.error('[DFS Error]', e);
    }
    enableControls();
}


// ─── Dijkstra ─────────────────────────────────────────────────────────────────
async function runDijkstra(start, end) {
    log(`🗺️ Dijkstra's Shortest Path from ${start} to ${end}. Like a GPS finding the shortest route — always taking the cheapest road available next. We prioritize nodes with the smallest current distance. Next, we pick the best node to explore.`, 'info');
    const nodes = [...graphNodes.keys()];
    const dist  = {};
    const prev  = {};
    const unvisited = new Set(nodes);

    nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
    dist[start] = 0;

    showDistanceTable(true, 'Distance Table');
    renderDistanceTable(dist, prev, nodes);
    document.getElementById('distanceInfo').style.display = '';

    const nodeStates = {};
    const edgeStates = {};
    nodeStates[start] = 'start';

    try {
        while (unvisited.size > 0) {
            // Pick min dist unvisited
            let u = null;
            for (const n of unvisited) {
                if (u === null || dist[n] < dist[u]) u = n;
            }
            if (dist[u] === Infinity) break;

            nodeStates[u] = 'current';
            log(`Processing node ${u} (current distance = ${dist[u]}). Like deciding which intersection to turn at based on the shortest estimated time — u is our best option right now. Next, we check if we can improve paths to its neighbors.`, 'visiting');
            renderGraphSVG(nodeStates, edgeStates);
            renderDistanceTable(dist, prev, nodes);
            setQueueDisplay('Unvisited', `[${[...unvisited].join(', ')}]`);
            await waitStep();

            unvisited.delete(u);
            nodeStates[u] = 'visited';
            window.visitCount++;
            updateCounters();

            if (u === end) {
                // Trace path
                let cur = end;
                while (cur) {
                    nodeStates[cur] = 'path';
                    if (prev[cur]) {
                        const ek = [cur, prev[cur]].sort().join('-');
                        edgeStates[ek] = 'path';
                    }
                    cur = prev[cur];
                }
                document.getElementById('totalDistance').textContent = dist[end];
                renderGraphSVG(nodeStates, edgeStates);
                if (window.TraversalPath) window.TraversalPath.setShortestPaths(dist, start);
                log(`✅ Destination reached! Shortest path to ${end} is ${dist[end]}. Like the GPS announcing 'You have arrived' — we found the mathematically proven best route. Final path highlighted in green.`, 'complete');
                break;
            }

            for (const {node: v, weight} of graphEdges.get(u)) {
                if (!unvisited.has(v)) continue;
                const alt = dist[u] + weight;
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                    const ek = [u, v].sort().join('-');
                    edgeStates[ek] = 'visited';
                    log(`Relaxing edge ${u}→${v}: found a shorter path to ${v} (new distance ${alt}). Like the GPS recalculating a faster route after finding a shortcut — we update our records. Next, we continue looking for even better paths.`, 'mst');
                }
            }
            renderDistanceTable(dist, prev, nodes);
        }
        if (window.TraversalPath) window.TraversalPath.setShortestPaths(dist, start);
        log('✅ Dijkstra complete!', 'algorithm');
    } catch(e) {
        if (e && e.message !== 'reset') console.error('[Dijkstra Error]', e);
    }
    enableControls();
}

// ─── Prim's ───────────────────────────────────────────────────────────────────
async function runPrim(start) {
    log(`🌲 Prim's MST starting from node ${start}. Like building a network of roads connecting all cities using the shortest possible total road length. We grow the MST one node at a time. Next, we pick the cheapest edge connected to our tree.`, 'info');
    const nodes = [...graphNodes.keys()];
    const inMST = new Set([start]);
    const nodeStates={}, edgeStates={};
    nodeStates[start] = 'visited';

    showDistanceTable(true, 'MST Edges');
    document.getElementById('edgesInfo').style.display = '';
    const mstEdgeList = [];

    try {
        while (inMST.size < nodes.length) {
            await waitStep();

            // Find min weight edge crossing the cut
            let minEdge = null;
            for (const u of inMST) {
                for (const {node: v, weight} of graphEdges.get(u)) {
                    if (!inMST.has(v)) {
                        if (!minEdge || weight < minEdge.weight) {
                            minEdge = {from: u, to: v, weight};
                        }
                    }
                }
            }
            if (!minEdge) break;

            inMST.add(minEdge.to);
            if (window.TraversalPath) window.TraversalPath.addEdge(minEdge.from, minEdge.to, minEdge.weight);
            nodeStates[minEdge.to] = 'visited';
            const ek = [minEdge.from, minEdge.to].sort().join('-');
            edgeStates[ek] = 'mst';
            mstEdgeList.push({...minEdge, inMST: true});
            window.stepCount++;
            window.visitCount++;
            updateCounters();
            document.getElementById('mstEdges').textContent = mstEdgeList.length;

            log(`Adding edge ${minEdge.from}–${minEdge.to} (weight ${minEdge.weight}) to MST. Like laying the cheapest possible cable to connect node ${minEdge.to} to our existing network — efficiency is key. Next, we update our candidate edges for the expanded tree.`, 'mst');
            renderGraphSVG(nodeStates, edgeStates);
            renderEdgeTable(mstEdgeList, 'MST Edges');
        }
        log(`✅ Prim's MST complete! All cities connected with minimum total road length. Like a fully optimized infrastructure project — we used exactly V-1 edges. Total MST weight calculated.`, 'complete');
    } catch(e) {
        if (e && e.message !== 'reset') console.error('[Prim Error]', e);
    }
    enableControls();
}

// ─── Kruskal's ────────────────────────────────────────────────────────────────
function makeUF(nodes) {
    const parent = {}, rank = {};
    nodes.forEach(n => { parent[n] = n; rank[n] = 0; });
    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    function union(a, b) {
        const ra = find(a), rb = find(b);
        if (ra === rb) return false;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
        return true;
    }
    return {find, union};
}

async function runKruskal() {
    log(`🌲 Kruskal's MST: Sorting all edges by weight. Like connecting islands with bridges — we always build the shortest available bridge that doesn't create a loop. We'll check edges from cheapest to most expensive.`, 'info');
    const nodes = [...graphNodes.keys()];
    const allEdges = [];
    for (const [from, neighbors] of graphEdges) {
        for (const {node: to, weight} of neighbors) {
            if (from < to) allEdges.push({from, to, weight, inMST: false});
        }
    }
    allEdges.sort((a, b) => a.weight - b.weight);

    showDistanceTable(true, 'All Edges (sorted)');
    document.getElementById('edgesInfo').style.display = '';
    renderEdgeTable(allEdges, 'All Edges');

    const uf = makeUF(nodes);
    const nodeStates = {}, edgeStates = {};
    let mstCount = 0;

    try {
        for (const edge of allEdges) {
            await waitStep();

            if (uf.union(edge.from, edge.to)) {
                edge.inMST = true;
                if (window.TraversalPath) window.TraversalPath.addEdge(edge.from, edge.to, edge.weight);
                mstCount++;
                window.stepCount++;
                window.visitCount++;
                updateCounters();
                document.getElementById('mstEdges').textContent = mstCount;

                const ek = [edge.from, edge.to].sort().join('-');
                edgeStates[ek] = 'mst';
                nodeStates[edge.from] = 'visited';
                nodeStates[edge.to]   = 'visited';

                log(`Adding edge ${edge.from}–${edge.to} (weight ${edge.weight}) to MST. Like building a bridge between two islands that were previously separated — we connect two different components. Next, we check the next cheapest edge.`, 'mst');
                renderGraphSVG(nodeStates, edgeStates);
                renderEdgeTable(allEdges, 'All Edges');

                if (mstCount === nodes.length - 1) break;
            } else {
                log(`Skipping edge ${edge.from}–${edge.to}: would form a cycle. Like a bridge connecting two points already on the same island — it's redundant and doesn't help connect new areas. Next, we skip to the next candidate.`, 'backtrack');
            }
        }
        log(`✅ Kruskal's MST complete! All islands connected without any redundant loops. Like a perfectly linked archipelago — minimum cost achieved. Final MST highlighted.`, 'complete');
    } catch(e) {
        if (e && e.message !== 'reset') console.error('[Kruskal Error]', e);
    }
    enableControls();
}

// ─── Theory & Code Data ───────────────────────────────────────────────────────
const theoryData = {
    bfs: {
        title: 'Breadth-First Search (BFS)',
        definition: 'BFS explores all vertices at the present depth level before moving on to the vertices at the next depth level. It uses a Queue (FIFO) to track the next vertex to visit.',
        working: 'Start at a source node, mark it visited and enqueue it. While the queue is not empty: dequeue a node, process it, and enqueue all unvisited neighbors.',
        complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        space: 'O(V)',
        useCases: 'Shortest path in unweighted graphs, level-order traversal, network broadcasting, social network distance'
    },
    dfs: {
        title: 'Depth-First Search (DFS)',
        definition: 'DFS explores as far as possible along each branch before backtracking. It uses a Stack (LIFO) or recursion.',
        working: 'Start at source, mark visited. Recursively visit each unvisited neighbor, backtracking when no unvisited neighbors remain.',
        complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        space: 'O(V)',
        useCases: 'Cycle detection, topological sorting, maze solving, strongly connected components'
    },
    dijkstra: {
        title: "Dijkstra's Shortest Path",
        definition: "Dijkstra finds the shortest path from a source node to all other nodes in a weighted graph with non-negative weights.",
        working: 'Initialize all distances to ∞ except source (0). Greedily pick the unvisited node with minimum distance, relax its neighbors, repeat.',
        complexity: { best: 'O(V²)', average: 'O((V+E) log V) with priority queue', worst: 'O(V²)' },
        space: 'O(V)',
        useCases: 'GPS navigation, network routing (OSPF), shortest path in maps'
    },
    prim: {
        title: "Prim's MST Algorithm",
        definition: "Prim's builds a Minimum Spanning Tree by greedily adding the minimum-weight edge that connects a visited node to an unvisited node.",
        working: 'Start from any node. Repeatedly add the cheapest edge that crosses the cut (inMST vs not-inMST) until all nodes are included.',
        complexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(V²)' },
        space: 'O(V)',
        useCases: 'Network design, cable laying, clustering algorithms'
    },
    kruskal: {
        title: "Kruskal's MST Algorithm",
        definition: "Kruskal's builds an MST by sorting all edges by weight and adding them one by one, skipping edges that would form a cycle.",
        working: 'Sort all edges. For each edge in order, add it to the MST if it does not form a cycle (checked via Union-Find).',
        complexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' },
        space: 'O(V)',
        useCases: 'Minimum cost network spanning, image segmentation'
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
}

// ─── Code Snippets ────────────────────────────────────────────────────────────
const codeSnippets = {
    bfs: {
        cpp: `#include <iostream>
#include <queue>
#include <vector>
using namespace std;
void bfs(vector<vector<int>>& adj, int start, int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << " ";
        for (int v : adj[u])
            if (!visited[v]) { visited[v]=true; q.push(v); }
    }
}`,
        python: `from collections import deque
def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        print(node, end=' ')
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
        java: `import java.util.*;
void bfs(Map<Integer,List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    visited.add(start); queue.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        System.out.print(node + " ");
        for (int neighbor : graph.get(node))
            if (!visited.contains(neighbor)) {
                visited.add(neighbor); queue.add(neighbor);
            }
    }
}`,
        javascript: `function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length > 0) {
        const node = queue.shift();
        console.log(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`,
        c: `void bfs(int adj[][10], int V, int start) {
    int visited[10]={0}, queue[10], front=0, rear=0;
    visited[start]=1; queue[rear++]=start;
    while(front<rear){
        int u=queue[front++];
        printf("%d ", u);
        for(int v=0;v<V;v++)
            if(adj[u][v] && !visited[v]){visited[v]=1;queue[rear++]=v;}
    }
}`
    },
    dfs: {
        cpp: `void dfs(vector<vector<int>>& adj, int u, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";
    for (int v : adj[u])
        if (!visited[v]) dfs(adj, v, visited);
}`,
        python: `def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    print(node, end=' ')
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`,
        java: `void dfs(Map<Integer,List<Integer>> graph, int node, Set<Integer> visited) {
    visited.add(node);
    System.out.print(node + " ");
    for (int neighbor : graph.get(node))
        if (!visited.contains(neighbor)) dfs(graph, neighbor, visited);
}`,
        javascript: `function dfs(graph, node, visited = new Set()) {
    visited.add(node);
    console.log(node);
    for (const neighbor of graph[node])
        if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
}`,
        c: `void dfs(int adj[][10], int V, int u, int visited[]) {
    visited[u]=1; printf("%d ", u);
    for(int v=0;v<V;v++)
        if(adj[u][v] && !visited[v]) dfs(adj,V,v,visited);
}`
    },
    dijkstra: {
        cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> dijkstra(vector<pair<int,int>> adj[], int V, int src) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    vector<int> dist(V, INT_MAX);
    dist[src]=0; pq.push({0, src});
    while(!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        for(auto [v, w] : adj[u])
            if(dist[u]+w < dist[v]) { dist[v]=dist[u]+w; pq.push({dist[v],v}); }
    }
    return dist;
}`,
        python: `import heapq
def dijkstra(graph, src):
    dist = {n: float('inf') for n in graph}
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u]+w < dist[v]:
                dist[v] = dist[u]+w
                heapq.heappush(heap, (dist[v], v))
    return dist`,
        java: `import java.util.*;
public class Dijkstra {
    static int[] dijkstra(List<int[]>[] graph, int V, int src) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<int[]> pq =
            new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, src});
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];
            if (d > dist[u]) continue;
            for (int[] edge : graph[u]) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}`,
        javascript: `function dijkstra(graph, src) {
    const dist = {};
    for (const n in graph) dist[n] = Infinity;
    dist[src] = 0;
    const unvisited = new Set(Object.keys(graph));
    while (unvisited.size > 0) {
        const u = [...unvisited].reduce((a,b) => dist[a]<dist[b]?a:b);
        unvisited.delete(u);
        for (const [v, w] of graph[u])
            if (dist[u]+w < dist[v]) dist[v] = dist[u]+w;
    }
    return dist;
}`,
        c: `#include <stdio.h>
#include <limits.h>
#define V 5
int minDist(int dist[], int visited[]) {
    int min = INT_MAX, idx = -1;
    for (int v = 0; v < V; v++)
        if (!visited[v] && dist[v] < min) { min = dist[v]; idx = v; }
    return idx;
}
void dijkstra(int graph[V][V], int src) {
    int dist[V], visited[V];
    for (int i = 0; i < V; i++) { dist[i] = INT_MAX; visited[i] = 0; }
    dist[src] = 0;
    for (int c = 0; c < V - 1; c++) {
        int u = minDist(dist, visited);
        visited[u] = 1;
        for (int v = 0; v < V; v++)
            if (!visited[v] && graph[u][v] &&
                dist[u] != INT_MAX &&
                dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`
    },
    prim: {
        cpp: `int primMST(vector<pair<int,int>> adj[], int V) {
    priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;
    vector<bool> inMST(V,false);
    pq.push({0,0}); int total=0;
    while(!pq.empty()){
        auto[w,u]=pq.top(); pq.pop();
        if(inMST[u]) continue;
        inMST[u]=true; total+=w;
        for(auto[v,wt]:adj[u]) if(!inMST[v]) pq.push({wt,v});
    }
    return total;
}`,
        python: `import heapq
def prim(graph, start):
    visited, mst_cost, heap = set(), 0, [(0, start, start)]
    while heap:
        w, u, prev = heapq.heappop(heap)
        if u in visited: continue
        visited.add(u); mst_cost += w
        for v, wt in graph[u]:
            if v not in visited: heapq.heappush(heap, (wt, v, u))
    return mst_cost`,
        java: `import java.util.*;
public class Prim {
    static int primMST(int[][] graph, int V) {
        boolean[] inMST = new boolean[V];
        int[] key = new int[V];
        Arrays.fill(key, Integer.MAX_VALUE);
        key[0] = 0;
        PriorityQueue<int[]> pq =
            new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, 0});
        int totalCost = 0;
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[1];
            if (inMST[u]) continue;
            inMST[u] = true;
            totalCost += curr[0];
            for (int v = 0; v < V; v++)
                if (!inMST[v] && graph[u][v] != 0 && graph[u][v] < key[v]) {
                    key[v] = graph[u][v];
                    pq.offer(new int[]{key[v], v});
                }
        }
        return totalCost;
    }
}`,
        javascript: `function prim(graph, start) {
    const inMST = new Set([start]);
    let cost = 0;
    while (inMST.size < Object.keys(graph).length) {
        let minEdge = null;
        for (const u of inMST)
            for (const [v, w] of graph[u])
                if (!inMST.has(v) && (!minEdge || w < minEdge.w))
                    minEdge = {u, v, w};
        if (!minEdge) break;
        inMST.add(minEdge.v); cost += minEdge.w;
    }
    return cost;
}`,
        c: `#include <stdio.h>
#include <limits.h>
#define V 5
void primMST(int graph[V][V]) {
    int parent[V], key[V], inMST[V];
    for (int i = 0; i < V; i++) {
        key[i] = INT_MAX; inMST[i] = 0;
    }
    key[0] = 0; parent[0] = -1;
    for (int count = 0; count < V - 1; count++) {
        int u = -1, minKey = INT_MAX;
        for (int v = 0; v < V; v++)
            if (!inMST[v] && key[v] < minKey) {
                minKey = key[v]; u = v;
            }
        inMST[u] = 1;
        for (int v = 0; v < V; v++)
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                parent[v] = u; key[v] = graph[u][v];
            }
    }
}`
    },
    kruskal: {
        cpp: `struct Edge { int u,v,w; };
int find(int p[], int x){ return p[x]==x?x:p[x]=find(p,p[x]); }
bool unite(int p[], int r[], int a, int b){
    int ra=find(p,a),rb=find(p,b);
    if(ra==rb) return false;
    if(r[ra]<r[rb]) swap(ra,rb);
    p[rb]=ra; if(r[ra]==r[rb]) r[ra]++;
    return true;
}
int kruskal(vector<Edge>& edges, int V){
    sort(edges.begin(),edges.end(),[](Edge& a,Edge& b){return a.w<b.w;});
    int p[V],r[V],total=0;
    for(int i=0;i<V;i++){p[i]=i;r[i]=0;}
    for(auto& e:edges) if(unite(p,r,e.u,e.v)) total+=e.w;
    return total;
}`,
        python: `def kruskal(edges, n):
    edges.sort(key=lambda e: e[2])
    parent = list(range(n))
    def find(x):
        while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]
        return x
    total = 0
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru != rv: parent[ru]=rv; total+=w
    return total`,
        java: `import java.util.*;
public class Kruskal {
    static int[] parent, rank;
    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    static boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t=ra; ra=rb; rb=t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
    // edges[i] = {u, v, weight}
    static int kruskal(int[][] edges, int V) {
        Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));
        parent = new int[V]; rank = new int[V];
        for (int i = 0; i < V; i++) parent[i] = i;
        int total = 0, count = 0;
        for (int[] e : edges) {
            if (union(e[0], e[1])) {
                total += e[2];
                if (++count == V - 1) break;
            }
        }
        return total;
    }
}`,
        javascript: `function kruskal(edges, nodes) {
    edges.sort((a, b) => a.w - b.w);
    const parent = {};
    nodes.forEach(n => parent[n] = n);
    function find(x) { return parent[x]===x?x:parent[x]=find(parent[x]); }
    let cost = 0;
    for (const {u, v, w} of edges) {
        const ru=find(u), rv=find(v);
        if (ru !== rv) { parent[ru]=rv; cost+=w; }
    }
    return cost;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { int u, v, w; } Edge;
int parent[100], rnk[100];
int find(int x) {
    return parent[x]==x ? x : (parent[x]=find(parent[x]));
}
int unite(int a, int b) {
    int ra=find(a), rb=find(b);
    if(ra==rb) return 0;
    if(rnk[ra]<rnk[rb]) { int t=ra; ra=rb; rb=t; }
    parent[rb]=ra;
    if(rnk[ra]==rnk[rb]) rnk[ra]++;
    return 1;
}
int cmp(const void* a, const void* b) {
    return ((Edge*)a)->w - ((Edge*)b)->w;
}
int kruskal(Edge edges[], int E, int V) {
    for(int i=0;i<V;i++){parent[i]=i; rnk[i]=0;}
    qsort(edges, E, sizeof(Edge), cmp);
    int total=0, count=0;
    for(int i=0;i<E;i++)
        if(unite(edges[i].u, edges[i].v)) {
            total+=edges[i].w;
            if(++count==V-1) break;
        }
    return total;
}`
    }
};

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

// ─── Tab Management ───────────────────────────────────────────────────────────
function switchTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-tab="${name}"]`).classList.add('active');
    document.getElementById(name).classList.add('active');
    if (name === 'code') updateCodeContent(document.querySelector('.lang-tab.active').dataset.lang);
    if (name === 'explanation') showAIExplanation();
}

function showAIExplanation() {
    const el = document.getElementById('explanationContent');
    if (!el || !currentAlgorithm) return;
    el.innerHTML = generateGraphExplanation(currentAlgorithm);
}

function generateGraphExplanation(algorithm) {
    const examples = {
        bfs: `
        <h3>BFS – Breadth-First Search: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Graph:</h4>
            <p>Nodes: A B C D E &nbsp;|&nbsp; Edges: A–B, A–C, B–D, B–E, C–D</p>
            <div class="array-display" style="background:#f0f4ff;padding:10px;border-radius:6px;font-family:monospace;">
                A ──── B ──── D<br>│&nbsp;&nbsp;&nbsp;&nbsp; │<br>C ──── E
            </div>
        </div>
        <div class="step-by-step">
            <h4>Starting from node A:</h4>
            <div class="step">
                <h5>Step 1: Enqueue A</h5>
                <p>Mark A visited. Queue: <strong>[A]</strong></p>
                <div class="array-display">Visited: [<span class="found">A</span>]</div>
            </div>
            <div class="step">
                <h5>Step 2: Dequeue A → enqueue B, C</h5>
                <p>Process A's neighbours. Queue: <strong>[B, C]</strong></p>
                <div class="array-display">Visited: [A, <span class="comparing">B</span>, <span class="comparing">C</span>]</div>
            </div>
            <div class="step">
                <h5>Step 3: Dequeue B → enqueue D, E</h5>
                <p>B's unvisited neighbours: D, E. Queue: <strong>[C, D, E]</strong></p>
                <div class="array-display">Visited: [A, B, C, <span class="comparing">D</span>, <span class="comparing">E</span>]</div>
            </div>
            <div class="step">
                <h5>Step 4: Dequeue C → D already queued, skip</h5>
                <p>Queue: <strong>[D, E]</strong></p>
            </div>
            <div class="step">
                <h5>Steps 5–6: Dequeue D, then E</h5>
                <p>No new neighbours. Queue becomes empty — done!</p>
            </div>
            <div class="result">
                <h5>✅ BFS Order: A → B → C → D → E</h5>
                <p>Guarantees shortest path in unweighted graphs. Total nodes: 5.</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        dfs: `
        <h3>DFS – Depth-First Search: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Graph:</h4>
            <p>Nodes: A B C D E &nbsp;|&nbsp; Edges: A–B, A–C, B–D, B–E</p>
            <div class="array-display" style="background:#f0f4ff;padding:10px;border-radius:6px;font-family:monospace;">
                A ──── B ──── D<br>│&nbsp;&nbsp;&nbsp;&nbsp; └──── E<br>└──── C
            </div>
        </div>
        <div class="step-by-step">
            <h4>Starting from A (goes deep before backtracking):</h4>
            <div class="step">
                <h5>Step 1: Visit A</h5>
                <p>Mark A visited. Call stack: <strong>[A]</strong></p>
                <div class="array-display">Visited: [<span class="found">A</span>]</div>
            </div>
            <div class="step">
                <h5>Step 2: Recurse into B (first neighbour of A)</h5>
                <p>Call stack: <strong>[A → B]</strong></p>
                <div class="array-display">Visited: [A, <span class="comparing">B</span>]</div>
            </div>
            <div class="step">
                <h5>Step 3: Recurse into D (first neighbour of B)</h5>
                <p>Call stack: <strong>[A → B → D]</strong></p>
                <div class="array-display">Visited: [A, B, <span class="comparing">D</span>]</div>
            </div>
            <div class="step">
                <h5>Step 4: D has no unvisited neighbours → backtrack to B → visit E</h5>
                <p>Call stack: <strong>[A → B → E]</strong></p>
                <div class="array-display">Visited: [A, B, D, <span class="comparing">E</span>]</div>
            </div>
            <div class="step">
                <h5>Step 5: Backtrack all the way to A → visit C</h5>
                <p>Call stack: <strong>[A → C]</strong></p>
                <div class="array-display">Visited: [A, B, D, E, <span class="comparing">C</span>]</div>
            </div>
            <div class="result">
                <h5>✅ DFS Order: A → B → D → E → C</h5>
                <p>Goes as deep as possible first. Used for cycle detection &amp; topological sort.</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        dijkstra: `
        <h3>Dijkstra's Shortest Path: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Weighted Graph:</h4>
            <p>Source: <strong>A</strong> | Target: <strong>D</strong></p>
            <p>Edges: A–B(4), A–C(2), C–B(1), B–D(5), C–D(8)</p>
            <div class="array-display" style="background:#f0f4ff;padding:10px;border-radius:6px;font-family:monospace;">
                A –4– B –5– D<br>└–2– C –1– ↑<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└–8–────┘
            </div>
        </div>
        <div class="step-by-step">
            <h4>Initial distances: dist[A]=0, dist[B]=∞, dist[C]=∞, dist[D]=∞</h4>
            <div class="step">
                <h5>Step 1: Process A (dist=0, minimum unvisited)</h5>
                <p>Relax B: min(∞, 0+4) = <strong>4</strong> ✓ &nbsp;|&nbsp; Relax C: min(∞, 0+2) = <strong>2</strong> ✓</p>
                <div class="array-display">dist: A=0 &nbsp; <span class="comparing">B=4</span> &nbsp; <span class="comparing">C=2</span> &nbsp; D=∞</div>
            </div>
            <div class="step">
                <h5>Step 2: Process C (dist=2, now minimum unvisited)</h5>
                <p>Relax B: min(4, 2+1) = <strong>3</strong> ✓ (improved!) &nbsp;|&nbsp; Relax D: min(∞, 2+8) = <strong>10</strong></p>
                <div class="array-display">dist: A=0 &nbsp; <span class="comparing">B=3</span> &nbsp; C=2 &nbsp; <span class="comparing">D=10</span></div>
            </div>
            <div class="step">
                <h5>Step 3: Process B (dist=3)</h5>
                <p>Relax D: min(10, 3+5) = <strong>8</strong> ✓ (improved!)</p>
                <div class="array-display">dist: A=0 &nbsp; B=3 &nbsp; C=2 &nbsp; <span class="comparing">D=8</span></div>
            </div>
            <div class="step">
                <h5>Step 4: Process D (dist=8) — destination reached!</h5>
            </div>
            <div class="result">
                <h5>✅ Shortest path A → D = 8 &nbsp;via A → C → B → D</h5>
                <p>Direct A→B→D would cost 9. Dijkstra found the better path through C!</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        prim: `
        <h3>Prim's MST Algorithm: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Weighted Graph:</h4>
            <p>Edges: A–B(4), A–C(2), C–B(1), B–D(5), C–D(8)</p>
            <p>Goal: Connect all nodes with minimum total edge weight.</p>
        </div>
        <div class="step-by-step">
            <h4>Start: MST = {A}, find cheapest edge crossing the cut each time</h4>
            <div class="step">
                <h5>Step 1: From {A}, candidates = A–B(4), A–C(2)</h5>
                <p>Minimum = <strong>A–C (weight 2)</strong> → Add C to MST.</p>
                <div class="array-display">MST: {<span class="found">A, C</span>} &nbsp;| Cost so far: <strong>2</strong></div>
            </div>
            <div class="step">
                <h5>Step 2: From {A,C}, candidates = A–B(4), C–B(1), C–D(8)</h5>
                <p>Minimum = <strong>C–B (weight 1)</strong> → Add B to MST.</p>
                <div class="array-display">MST: {<span class="found">A, C, B</span>} &nbsp;| Cost so far: <strong>3</strong></div>
            </div>
            <div class="step">
                <h5>Step 3: From {A,C,B}, candidates = B–D(5), C–D(8)</h5>
                <p>Minimum = <strong>B–D (weight 5)</strong> → Add D to MST.</p>
                <div class="array-display">MST: {<span class="found">A, C, B, D</span>} &nbsp;| Final cost: <strong>8</strong></div>
            </div>
            <div class="result">
                <h5>✅ MST Edges: A–C(2), C–B(1), B–D(5) &nbsp;| Total: 8</h5>
                <p>All 4 nodes connected with minimum weight. V–1 = 3 edges used.</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`,

        kruskal: `
        <h3>Kruskal's MST Algorithm: Step by Step</h3>
        <div class="algorithm-overview">
            <h4>Example Weighted Graph:</h4>
            <p>Edges: A–B(4), A–C(2), C–B(1), B–D(5), C–D(8)</p>
            <p>Strategy: Sort edges by weight, add if no cycle forms (Union-Find).</p>
        </div>
        <div class="step-by-step">
            <h4>Step 1: Sort all edges by weight:</h4>
            <div class="array-display" style="font-family:monospace;background:#f0f4ff;padding:8px;border-radius:6px;">
                C–B(1) &nbsp; A–C(2) &nbsp; A–B(4) &nbsp; B–D(5) &nbsp; C–D(8)
            </div>
            <div class="step">
                <h5>Step 2: Pick C–B (weight 1)</h5>
                <p>C and B are in different components → <strong>Add it!</strong></p>
                <p>Components: {A} &nbsp; {C, B} &nbsp; {D} &nbsp;| Cost: <strong>1</strong></p>
                <div class="array-display">MST: [<span class="found">C–B(1)</span>]</div>
            </div>
            <div class="step">
                <h5>Step 3: Pick A–C (weight 2)</h5>
                <p>A and C are in different components → <strong>Add it!</strong></p>
                <p>Components: {A, C, B} &nbsp; {D} &nbsp;| Cost: <strong>3</strong></p>
                <div class="array-display">MST: [C–B(1), <span class="found">A–C(2)</span>]</div>
            </div>
            <div class="step">
                <h5>Step 4: Pick A–B (weight 4)</h5>
                <p>A and B are already in the SAME component → <strong>Skip! (would create cycle)</strong></p>
                <div class="array-display">MST: [C–B(1), A–C(2), <span style="color:#e74c3c;">A–B(4) ✗</span>]</div>
            </div>
            <div class="step">
                <h5>Step 5: Pick B–D (weight 5)</h5>
                <p>B and D are in different components → <strong>Add it!</strong></p>
                <p>Components: {A, C, B, D} — all connected! | Cost: <strong>8</strong></p>
                <div class="array-display">MST: [C–B(1), A–C(2), <span class="found">B–D(5)</span>]</div>
            </div>
            <div class="result">
                <h5>✅ MST Total = 1 + 2 + 5 = 8 &nbsp;| V–1 = 3 edges, 4 nodes spanned</h5>
                <p>C–D(8) was never needed. Kruskal always processes cheapest edges first.</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="startVisualization()">Try It Yourself</button>`
    };
    return examples[algorithm] || `<p>Explanation not available for ${algorithm}.</p>`;
}

// ─── DOM Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    modal           = document.getElementById('algorithmModal');
    startBtn        = document.getElementById('startBtn');
    pauseBtn        = document.getElementById('pauseBtn');
    resetBtn        = document.getElementById('resetBtn');
    generateBtn     = document.getElementById('generateBtn');
    nodeCountSlider = document.getElementById('nodeCount');
    speedSlider     = document.getElementById('speed');
    startNodeInput  = document.getElementById('startNode');
    endNodeInput    = document.getElementById('endNode');

    visualizer = new Visualizer('visualizer');

    // Controls
    generateBtn.onclick = generateGraph;
    startBtn.onclick    = startVisualization;
    pauseBtn.onclick    = togglePause;
    resetBtn.onclick    = resetVisualization;

    nodeCountSlider.oninput = () => {
        document.getElementById('nodeCountValue').textContent = nodeCountSlider.value;
        if (!window.GraphAnim.isAnimating) generateGraph();
    };
    speedSlider.oninput = () => {
        document.getElementById('speedValue').textContent = speedSlider.value;
        window.GraphAnim.animationSpeed = parseInt(speedSlider.value);
    };

    // Close modal — use addEventListener to avoid overwriting other handlers
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
        resetVisualization();
    });
    // Listen on the modal backdrop only (not window.onclick which overwrites handlers)
    modal.addEventListener('click', e => {
        if (e.target === modal) { modal.style.display = 'none'; resetVisualization(); }
    });

    // Tab switching
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
    document.getElementById('explainBtn')?.addEventListener('click', showAIExplanation);
});

// Expose for onclick in HTML
window.openAlgorithmModal  = openAlgorithmModal;
window.showAlgorithmTheory = showAlgorithmTheory;
window.handleNodeClickForDijkstra = nodeId => { if(endNodeInput) endNodeInput.value = nodeId; };
