window.ShareURLGraph = {

    encode(algo, nodes, speed, startNode) {
        const params = new URLSearchParams();
        params.set('algo', algo);
        params.set('nodes', nodes);
        params.set('speed', speed);
        if (startNode) {
            params.set('start', startNode.toUpperCase());
        }
        return params.toString();
    },

    decode() {
        const params = new URLSearchParams(window.location.search);
        
        let algo = params.get('algo');
        const validAlgos = ['bfs', 'dfs', 'dijkstra', 'prim', 'kruskal'];
        if (!validAlgos.includes(algo)) {
            algo = 'bfs';
        }
        
        let nodes = parseInt(params.get('nodes'));
        if (isNaN(nodes) || nodes < 3 || nodes > 10) {
            nodes = 7;
        }

        let speed = parseInt(params.get('speed'));
        if (isNaN(speed) || speed < 1 || speed > 10) {
            speed = 5;
        }

        let startNode = params.get('start') || 'A';
        startNode = startNode.toUpperCase();

        return { algo, nodes, speed, startNode };
    },

    copyLink() {
        if (!currentAlgorithm) {
            this.showToast('Please select an algorithm first!', 'error');
            return;
        }
        
        let nodes = document.getElementById('nodeCount') ? document.getElementById('nodeCount').value : 7;
        let speed = window.GraphAnim ? window.GraphAnim.animationSpeed : 5;
        let startNode = document.getElementById('startNode') ? document.getElementById('startNode').value : 'A';
        
        const queryString = this.encode(currentAlgorithm, nodes, speed, startNode);
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
        
        window.history.replaceState({ path: newUrl }, '', newUrl);

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(newUrl).then(() => {
                this.showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Failed to copy link. Link is in your URL bar!', 'error');
            });
        } else {
            this.showToast('Clipboard API unavailable. Link is updated in your URL bar!', 'error');
        }
    },

    showToast(message, type) {
        let toast = document.querySelector('.av-share-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'av-share-toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.className = 'av-share-toast show ' + type;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.search) return;
    
    const state = window.ShareURLGraph.decode();
    
    // EXISTING FUNC FLAG: openAlgorithmModal (handles modal opening and algorithm setup in graph.js)
    if (typeof openAlgorithmModal === 'function' && state.algo) {
        openAlgorithmModal(state.algo);
        
        setTimeout(() => {
            if (state.nodes) {
                const nodesSlider = document.getElementById('nodeCount');
                if (nodesSlider) {
                    nodesSlider.value = state.nodes;
                    nodesSlider.dispatchEvent(new Event('input'));
                }
            }
            
            if (state.speed) {
                const speedSlider = document.getElementById('speed');
                if (speedSlider) {
                    speedSlider.value = state.speed;
                    speedSlider.dispatchEvent(new Event('input'));
                }
            }
            
            if (state.startNode) {
                const startInput = document.getElementById('startNode');
                if (startInput) {
                    startInput.value = state.startNode;
                }
            }
        }, 150);
    }
});
