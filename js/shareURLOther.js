window.ShareURLOther = {

    encode() {
        const params = new URLSearchParams();
        if (!currentAlgorithm) return params.toString();
        
        params.set('algo', currentAlgorithm);
        
        let speed = window.OtherAnim ? window.OtherAnim.animationSpeed : 3;
        params.set('speed', speed);
        
        if (currentAlgorithm === 'floyd-warshall' || currentAlgorithm === 'warshall') {
            let nodes = document.getElementById('nodeCount') ? document.getElementById('nodeCount').value : 4;
            params.set('nodes', nodes);
        }
        else if (currentAlgorithm === 'kmp' || currentAlgorithm === 'rabin-karp') {
            let t = document.getElementById('textInput') ? document.getElementById('textInput').value : '';
            let p = document.getElementById('patternInput') ? document.getElementById('patternInput').value : '';
            if (t) params.set('text', t);
            if (p) params.set('pattern', p);
        }
        
        return params.toString();
    },

    decode() {
        const params = new URLSearchParams(window.location.search);
        
        let algo = params.get('algo');
        const validAlgos = ['kadane', 'floyd-warshall', 'warshall', 'kmp', 'rabin-karp'];
        if (!validAlgos.includes(algo)) {
            algo = 'kadane';
        }
        
        let speed = parseInt(params.get('speed'));
        if (isNaN(speed) || speed < 1 || speed > 10) {
            speed = 3;
        }

        let arr = null;
        
        let nodes = null;
        if (algo === 'floyd-warshall' || algo === 'warshall') {
            let n = parseInt(params.get('nodes'));
            if (!isNaN(n) && n >= 3 && n <= 6) {
                nodes = n;
            } else {
                nodes = 4;
            }
        }
        
        let text = null;
        let pattern = null;
        if (algo === 'kmp' || algo === 'rabin-karp') {
            let tParam = params.get('text');
            if (tParam) {
                text = tParam.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50).toUpperCase();
            }
            let pParam = params.get('pattern');
            if (pParam) {
                pattern = pParam.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50).toUpperCase();
            }
        }

        return { algo, speed, arr, nodes, text, pattern };
    },

    copyLink() {
        if (!currentAlgorithm) {
            this.showToast('Please select an algorithm first!', 'error');
            return;
        }
        
        const queryString = this.encode();
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

const observer = new MutationObserver(() => {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn && !document.getElementById('share-btn-other')) {
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn-other';
        shareBtn.className = 'btn';
        shareBtn.innerHTML = '🔗 Share';
        shareBtn.onclick = () => window.ShareURLOther.copyLink();
        
        resetBtn.parentNode.insertBefore(shareBtn, resetBtn.nextSibling);
        observer.disconnect(); 
    }
});

window.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
    
    if (!window.location.search) return;
    
    const state = window.ShareURLOther.decode();
    
    // EXISTING FUNC FLAG: openAlgorithmModal (handles modal setup and resetVis())
    if (typeof openAlgorithmModal === 'function' && state.algo) {
        openAlgorithmModal(state.algo);
        
        setTimeout(() => {
            if (state.speed) {
                const speedSlider = document.getElementById('speed');
                if (speedSlider) {
                    speedSlider.value = state.speed;
                    speedSlider.dispatchEvent(new Event('input'));
                }
            }
            
            if ((state.algo === 'floyd-warshall' || state.algo === 'warshall') && state.nodes) {
                const nodeSlider = document.getElementById('nodeCount');
                if (nodeSlider) {
                    nodeSlider.value = state.nodes;
                    nodeSlider.dispatchEvent(new Event('input'));
                }
            }
            else if ((state.algo === 'kmp' || state.algo === 'rabin-karp') && (state.text || state.pattern)) {
                const textInput = document.getElementById('textInput');
                const patternInput = document.getElementById('patternInput');
                
                if (textInput && state.text) {
                    textInput.value = state.text;
                }
                if (patternInput && state.pattern) {
                    patternInput.value = state.pattern;
                }
                
                // Trigger an update to visually render the strings without clicking new data
                if (typeof renderStrings === 'function') {
                    renderStrings(state.text, state.pattern);
                }
            }
        }, 150);
    }
});
