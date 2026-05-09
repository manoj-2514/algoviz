window.ShareURLSearch = {

    encode(algo, array, speed, target) {
        const params = new URLSearchParams();
        params.set('algo', algo);
        params.set('arr', array.join(','));
        params.set('speed', speed);
        if (target !== null && target !== '') {
            params.set('target', target);
        }
        return params.toString();
    },

    decode() {
        const params = new URLSearchParams(window.location.search);
        
        let algo = params.get('algo');
        if (algo !== 'linear-search' && algo !== 'binary-search') {
            algo = 'linear-search';
        }
        
        let speed = parseInt(params.get('speed'));
        if (isNaN(speed) || speed < 1 || speed > 5) {
            speed = 3;
        }

        let array = null;
        let arrParam = params.get('arr');
        if (arrParam) {
            array = arrParam.split(',')
                .map(Number)
                .filter(n => !isNaN(n) && n >= 1 && n <= 999)
                .slice(0, 30);
            if (array.length === 0) array = null;
        }

        let target = null;
        let targetParam = params.get('target');
        if (targetParam !== null) {
            let t = parseInt(targetParam);
            if (!isNaN(t) && t >= 1 && t <= 999) {
                target = t;
            }
        }

        return { algo, array, speed, target };
    },

    copyLink() {
        if (!currentAlgorithm) {
            this.showToast('Please select an algorithm first!', 'error');
            return;
        }
        
        let speed = window.SearchAnim ? window.SearchAnim.animationSpeed : 5;
        let targetVal = document.getElementById('searchValue') ? document.getElementById('searchValue').value : '';
        
        const queryString = this.encode(currentAlgorithm, currentArray, speed, targetVal);
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
    
    const state = window.ShareURLSearch.decode();
    
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
            
            if (state.target !== null) {
                const searchInput = document.getElementById('searchValue');
                if (searchInput) {
                    searchInput.value = state.target;
                }
            }
            
            if (state.array) {
                const customInput = document.getElementById('customArrayInput');
                const customBtn = document.getElementById('useCustomBtn');
                if (customInput && customBtn) {
                    customInput.value = state.array.join(',');
                    customBtn.click();
                }
            }
        }, 150);
    }
});
