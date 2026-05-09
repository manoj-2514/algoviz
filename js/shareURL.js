// Share functionality for sorting.html
function encodeState(algo, array, speed) {
    const params = new URLSearchParams();
    params.set('algo', algo);
    params.set('array', array.join(','));
    params.set('speed', speed);
    return params.toString();
}

function decodeState() {
    const params = new URLSearchParams(window.location.search);
    let algo = params.get('algo') || 'bubble-sort';
    let speed = params.get('speed') || '5';
    let arrayParam = params.get('array');
    let array = [];

    if (arrayParam) {
        array = arrayParam.split(',').map(Number).filter(n => !isNaN(n));
    }

    if (array.length === 0) {
        for (let i = 0; i < 20; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }
    }

    return { algo, array, speed };
}

function copyShareLink() {
    // sorting.js variables (using them directly, as let variables are not added to window)
    if (!currentAlgorithm) {
        showShareToast('Please select an algorithm first!', 'warning');
        return;
    }

    const queryString = encodeState(currentAlgorithm, currentArray, animationSpeed);
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
    
    window.history.replaceState({ path: newUrl }, '', newUrl);

    navigator.clipboard.writeText(newUrl).then(() => {
        showShareToast('Link copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        showShareToast('Failed to copy link', 'error');
    });
}

function showShareToast(message, type) {
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

window.addEventListener('load', function() {
    if (!window.location.search) return;

    const state = decodeState();
    
    if (typeof openAlgorithmModal === 'function' && state.algo) {
        openAlgorithmModal(state.algo);
        
        setTimeout(() => {
            const speedSlider = document.getElementById('speed');
            if (speedSlider) {
                speedSlider.value = state.speed;
                speedSlider.dispatchEvent(new Event('input'));
            }
            
            const customInput = document.getElementById('customArrayInput');
            const customBtn = document.getElementById('useCustomBtn');
            if (customInput && customBtn && state.array.length > 0) {
                customInput.value = state.array.join(',');
                customBtn.click();
            }
        }, 100);
    }
});
