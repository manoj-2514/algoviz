// Visualizer class for AlgoViz

class Visualizer {

    constructor(containerId){

        this.container = document.getElementById(containerId);

        if(!this.container){
            console.error("Visualizer container not found:",containerId);
            return;
        }

        this.bars=[];
        this.array=[];
        this._maxValue = 0; // cached for O(1) updateBar

        this.isGraph=false;

        this.nodes=new Map();
        this.edges=new Map();
    }


    // INITIALIZE ARRAY
    initializeArray(arr){

        this.array=[...arr];
        this.isGraph=false;

        this.renderArray();

    }


    // INITIALIZE GRAPH
    initializeGraph(nodes, edges) {
        console.log("initializeGraph called with:", nodes, edges);
        this.nodes = nodes;
        this.edges = edges;
        this.isGraph = true;
        console.log("Calling renderGraph...");
        this.renderGraph();
    }


    // RENDER ARRAY
    renderArray(){

        if(!this.container) return;

        this.container.innerHTML="";
        this.bars=[];

        if(this.array.length===0) return;

        this._maxValue = Math.max(...this.array); // cache
        const maxValue = this._maxValue;

        this.array.forEach((value,index)=>{

            const barContainer=document.createElement("div");

            barContainer.className="bar-container";

            barContainer.style.display="flex";
            barContainer.style.flexDirection="column";
            barContainer.style.alignItems="center";
            barContainer.style.justifyContent="flex-end";
            barContainer.style.height="100%";
            barContainer.style.flex="1";
            barContainer.style.maxWidth=this.array.length<=20?"60px":"40px";
            barContainer.style.position="relative";


            // LABEL
            const label=document.createElement("div");

            label.className="bar-label";
            label.textContent=value;

            label.style.position="absolute";
            label.style.top="-25px";
            label.style.left="50%";
            label.style.transform="translateX(-50%)";
            label.style.fontSize=this.array.length<=20?"14px":"12px";
            label.style.fontWeight="bold";
            label.style.background="rgba(255,255,255,0.9)";
            label.style.padding="2px 6px";
            label.style.borderRadius="4px";
            label.style.zIndex="10";


            // BAR
            const bar=document.createElement("div");

            bar.className="visualizer-bar";

            bar.style.width="100%";
            bar.style.height=((value/maxValue)*100)+"%";
            bar.style.borderRadius="4px 4px 0 0";
            bar.style.transition="all 0.35s ease";
            bar.style.position="relative";

            bar.setAttribute("data-value",value);
            bar.setAttribute("data-index",index);


            const pointer=document.createElement("div");
            pointer.className="pointer";
            pointer.id="pointer-"+index;

           barContainer.appendChild(pointer);
           barContainer.appendChild(label);
           barContainer.appendChild(bar);

            this.container.appendChild(barContainer);

            this.bars.push(bar);

        });

    }


    // REMOVE ALL COLORS
    clearHighlights(){

        this.bars.forEach(bar=>{

            bar.classList.remove(
                "comparing",
                "swapping",
                "pivot",
                "sorted",
                "searching",
                "searching-range",
                "found",
                "not-found"
            );

        });

    }


    // HIGHLIGHT BARS
    highlightBars(indices,color="comparing"){

        indices.forEach(index=>{

            if(!this.bars[index]) return;

            this.bars[index].classList.remove(
                "comparing",
                "swapping",
                "pivot",
                "sorted",
                "searching",
                "searching-range",
                "found",
                "not-found"
            );

            this.bars[index].classList.add(color);

        });

    }


    // REMOVE HIGHLIGHT
    unhighlightBars(indices){

        indices.forEach(index=>{

            if(!this.bars[index]) return;

            this.bars[index].classList.remove(
                "comparing",
                "swapping",
                "pivot",
                "sorted",
                "searching",
                "searching-range",
                "found",
                "not-found"
            );

        });

    }


    // SWAP BARS (used by sorting)
    swapBars(index1,index2){

        if(!this.bars[index1] || !this.bars[index2]) return;

        const temp=this.array[index1];

        this.array[index1]=this.array[index2];
        this.array[index2]=temp;


        const bar1=this.bars[index1];
        const bar2=this.bars[index2];

        const container1=bar1.parentElement;
        const container2=bar2.parentElement;

        const label1=container1.querySelector(".bar-label");
        const label2=container2.querySelector(".bar-label");


        const tempHeight=bar1.style.height;
        bar1.style.height=bar2.style.height;
        bar2.style.height=tempHeight;


        if(label1 && label2){

            const tempText=label1.textContent;

            label1.textContent=label2.textContent;
            label2.textContent=tempText;

        }


        const tempValue=bar1.getAttribute("data-value");

        bar1.setAttribute("data-value",bar2.getAttribute("data-value"));
        bar2.setAttribute("data-value",tempValue);

    }


    // GET BAR ELEMENTS
    getBars(){
        return this.bars;
    }


    // UPDATE SINGLE BAR
    updateBar(index,value){

        if(!this.bars[index]) return;

        this.array[index]=value;

        // Update cached maxValue only if necessary (avoids O(n) per call)
        if(value > this._maxValue) this._maxValue = value;
        const maxValue = this._maxValue;

        const bar=this.bars[index];

        bar.style.height=((value/maxValue)*100)+"%";
        bar.setAttribute("data-value",value);


        const label=bar.parentElement.querySelector(".bar-label");

        if(label){
            label.textContent=value;
        }

    }


    // RENDER GRAPH
    renderGraph(){

        console.log("renderGraph() called");
        console.log("nodes:", this.nodes);
        console.log("edges:", this.edges);
        console.log("container:", this.container);

        if(!this.container) {
            console.error("No container found!");
            return;
        }

        // Fix: Ensure graph data exists before rendering
        if (!this.nodes || !this.edges) {
            console.error("Graph data missing");
            return;
        }

        // Check container dimensions
        console.log("Container dimensions:", this.container.offsetWidth, "x", this.container.offsetHeight);
        console.log("Container display:", window.getComputedStyle(this.container).display);

        // Fix: Check if container has valid size before rendering
        if (this.container.offsetWidth === 0) {
        // Fix: Container not ready — retry with backoff, max 10 attempts
        this._renderRetries = (this._renderRetries || 0) + 1;
        if (this._renderRetries <= 10) {
            setTimeout(() => this.renderGraph(), this._renderRetries * 100);
        } else {
            console.warn('Visualizer: container never became visible after 10 retries.');
        }
        return;
        }

        // Reset retry counter on successful render
        this._renderRetries = 0;

        // Clear container
        this.container.innerHTML = '';
        
        // Create SVG with proper attributes
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 800 400");
        svg.style.display = "block";
        svg.style.background = "white";
        svg.style.border = "2px solid #e0e0e0";
        svg.style.borderRadius = "8px";
        
        // Calculate node positions in a circle
        const nodeArray = Array.from(this.nodes.keys());
        const nodeCount = nodeArray.length;
        const centerX = 400;
        const centerY = 200;
        const radius = 150;
        const positions = new Map();
        
        console.log("Node count:", nodeCount);
        
        // Calculate positions for nodes in a circle
        for (let i = 0; i < nodeCount; i++) {
            const angle = (2 * Math.PI * i) / nodeCount;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            positions.set(nodeArray[i], { x, y });
        }
        
        // Draw edges first (so they appear behind nodes)
        for (const [fromNode, toNodes] of this.edges) {
            const fromPos = positions.get(fromNode);
            if (!fromPos) continue;
            
            for (const toNode of toNodes) {
                const targetNode = typeof toNode === "object" ? toNode.node : toNode;
                const toPos = positions.get(targetNode);
                if (!toPos) continue;
                
                // Draw edge line with enhanced styling
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", fromPos.x);
                line.setAttribute("y1", fromPos.y);
                line.setAttribute("x2", toPos.x);
                line.setAttribute("y2", toPos.y);
                line.setAttribute("stroke", "#666");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("class", "graph-edge legend-unvisited");
                line.setAttribute("data-from", fromNode);
                line.setAttribute("data-to", toNode.node);
                line.setAttribute("stroke-linecap", "round");
                line.style.opacity = "0.6";
                svg.appendChild(line);
                
                // Draw weight label on edge with enhanced styling
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;
                
                // Create background for weight label
                const weightBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                weightBg.setAttribute("x", midX - 10);
                weightBg.setAttribute("y", midY - 8);
                weightBg.setAttribute("width", "20");
                weightBg.setAttribute("height", "16");
                weightBg.setAttribute("fill", "rgba(255, 255, 255, 0.9)");
                weightBg.setAttribute("stroke", "#ddd");
                weightBg.setAttribute("stroke-width", "1");
                weightBg.setAttribute("rx", "3");
                weightBg.setAttribute("ry", "3");
                weightBg.style.pointerEvents = "none";
                svg.appendChild(weightBg);
                
                const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                weightText.setAttribute("x", midX);
                weightText.setAttribute("y", midY + 4);
                weightText.setAttribute("text-anchor", "middle");
                weightText.setAttribute("dominant-baseline", "middle");
                weightText.setAttribute("fill", "#333");
                weightText.setAttribute("font-size", "11");
                weightText.setAttribute("font-weight", "500");
                weightText.setAttribute("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
                weightText.style.pointerEvents = "none";
                weightText.style.userSelect = "none";
                weightText.textContent = toNode.weight;
                svg.appendChild(weightText);
            }
        }
        
        // Draw nodes
        for (const [nodeId, position] of positions) {
            // Draw node circle with enhanced visuals
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", position.x);
            circle.setAttribute("cy", position.y);
            circle.setAttribute("r", "25");
            circle.setAttribute("fill", "#4CAF50"); // Green for unvisited
            circle.setAttribute("stroke", "#388E3C"); // Darker green stroke
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("class", "graph-node legend-unvisited");
            circle.setAttribute("data-node", nodeId);
            circle.style.cursor = "pointer";
            
            // Add subtle gradient definition for depth
            const gradientId = `nodeGradient-${nodeId}`;
            const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
            gradient.setAttribute("id", gradientId);
            gradient.setAttribute("cx", "40%");
            gradient.setAttribute("cy", "40%");
            
            const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop1.setAttribute("offset", "0%");
            stop1.setAttribute("stop-color", "#66BB6A");
            stop1.setAttribute("stop-opacity", "1");
            
            const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop2.setAttribute("offset", "100%");
            stop2.setAttribute("stop-color", "#4CAF50");
            stop2.setAttribute("stop-opacity", "1");
            
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            
            // Add gradient to SVG defs
            let defs = svg.querySelector("defs");
            if (!defs) {
                defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                svg.insertBefore(defs, svg.firstChild);
            }
            defs.appendChild(gradient);
            
            // Apply gradient to node
            circle.setAttribute("fill", `url(#${gradientId})`);
            
            svg.appendChild(circle);
            
            // Add click event listener for node selection
            circle.addEventListener('click', () => {
                this.selectNode(nodeId);
            });
            
            // Add hover effects
            circle.addEventListener('mouseenter', () => {
                circle.style.transform = 'scale(1.1)';
                circle.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))';
            });
            
            circle.addEventListener('mouseleave', () => {
                circle.style.transform = 'scale(1)';
                circle.style.filter = '';
            });
            
            // Draw node label with enhanced styling
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", position.x);
            text.setAttribute("y", position.y + 5);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-weight", "600");
            text.setAttribute("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
            text.setAttribute("pointer-events", "none");
            text.setAttribute("user-select", "none");
            text.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.5)";
            text.textContent = nodeId;
            svg.appendChild(text);
        }
        
        console.log("Appending SVG to container...");
        this.container.appendChild(svg);
        console.log("renderGraph() completed");

    }

    // Select node as start node for algorithms
    selectNode(nodeId) {
        // Check if this is for Dijkstra path selection
        if (typeof currentAlgorithm !== 'undefined' && currentAlgorithm === 'dijkstra') {
            // Always allow node click for Dijkstra
            console.log("Target node selected:", nodeId);
            if (typeof handleNodeClickForDijkstra === 'function') {
                handleNodeClickForDijkstra(nodeId);
            }
            return;
        }
        
        // Remove previous selection highlight
        const allNodes = this.container.querySelectorAll('.graph-node');
        allNodes.forEach(node => {
            node.style.stroke = '#333';
            node.style.strokeWidth = '2';
            node.style.filter = '';
        });
        
        // Highlight selected node
        const selectedNode = this.container.querySelector(`[data-node="${nodeId}"]`);
        if (selectedNode) {
            selectedNode.style.stroke = '#ff5722';
            selectedNode.style.strokeWidth = '4';
            selectedNode.style.filter = 'drop-shadow(0 0 8px rgba(255, 87, 34, 0.6))';
        }
        
        // Update start node input field in graph.js
        const startNodeInput = document.getElementById('startNode');
        if (startNodeInput) {
            startNodeInput.value = nodeId;
            // Trigger change event to notify any listeners
            startNodeInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        console.log(`Node ${nodeId} selected as start node`);
    }

    highlightNode(nodeId, color="comparing"){
        const node = this.container.querySelector(`[data-node="${nodeId}"]`);
        if (node) {
            // Remove any existing color classes
            node.classList.remove('legend-unvisited', 'legend-current', 'legend-visited', 'legend-path', 'legend-exploring');
            node.classList.add(`legend-${color}`);
            
            // Set fill color directly for smooth transitions
            const colors = {
                'unvisited': '#4CAF50',
                'current': '#ff9800',
                'visited': '#2196f3',
                'path': '#4caf50',
                'exploring': '#ffeb3b'
            };
            if (colors[color]) {
                node.style.transition = 'all 0.4s ease';
                node.style.fill = colors[color];
            }
        }
    }

    highlightEdge(from, to, color="comparing"){
        // Try both directions — edges may have been drawn as A→B or B→A
        const edge = this.container.querySelector(`[data-from="${from}"][data-to="${to}"]`)
                  || this.container.querySelector(`[data-from="${to}"][data-to="${from}"]`);
        if (edge) {
            edge.classList.remove('legend-unvisited', 'legend-current', 'legend-visited', 'legend-path', 'legend-exploring');
            edge.classList.add(`legend-${color}`);
            
            // Set stroke color and width directly for smooth transitions
            const colors = {
                'unvisited': '#666',
                'current': '#ff9800',
                'visited': '#2196f3',
                'path': '#4caf50',
                'sorted': '#4caf50',
                'exploring': '#ff9800'
            };
            if (colors[color]) {
                edge.style.transition = 'all 0.4s ease';
                edge.setAttribute('stroke', colors[color]);
                edge.setAttribute('stroke-width', color === 'exploring' || color === 'path' || color === 'sorted' ? '4' : '2');
            }
        }
    }

    // UNHIGHLIGHT NODE — resets a graph node back to unvisited state
    unhighlightNode(nodeId) {
        const node = this.container.querySelector(`[data-node="${nodeId}"]`);
        if (node) {
            node.classList.remove('legend-unvisited', 'legend-current', 'legend-visited', 'legend-path', 'legend-exploring');
            node.classList.add('legend-unvisited');
            node.style.transition = 'all 0.4s ease';
            node.style.fill = '#4CAF50';
        }
    }

}

// EXPORT
window.Visualizer = Visualizer;

// NOTE: window.AlgoViz is defined in js/utils.js — do NOT redefine here.
// If utils.js is not loaded, fall back to prevent crashes:
if (typeof window.AlgoViz === 'undefined') {
    window.AlgoViz = {
        isAnimating: false,
        isPaused: false,
        animationSpeed: 5,
        delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },
        getAnimationDelay() { return (11 - this.animationSpeed) * 100; },
        setAnimating(val) { this.isAnimating = val; },
        setPaused(val) { this.isPaused = val; }
    };
}