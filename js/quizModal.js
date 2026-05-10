window.QuizModal = (function() {
    let currentAlgoId = null;
    let questions = [];
    let currentQuestionIndex = 0;
    let currentScore = 0;
    let modalElement = null;

    function getScore(algoId) {
        try {
            const data = localStorage.getItem('av_quiz_scores');
            if (!data) return null;
            const scores = JSON.parse(data);
            return scores[algoId] || null;
        } catch (e) {
            console.error('Error reading quiz scores', e);
            return null;
        }
    }

    function saveScore(algoId, score) {
        try {
            let scores = {};
            const data = localStorage.getItem('av_quiz_scores');
            if (data) {
                scores = JSON.parse(data);
            }
            
            const existing = scores[algoId];
            if (!existing || score > existing.best) {
                scores[algoId] = { best: score, ts: Date.now() };
                localStorage.setItem('av_quiz_scores', JSON.stringify(scores));
                return true; // is new best
            }
            return false;
        } catch (e) {
            console.error('Error saving quiz score', e);
            return false;
        }
    }

    function createModalDOM() {
        if (modalElement) {
            document.body.removeChild(modalElement);
        }

        const overlay = document.createElement('div');
        overlay.className = 'av-quiz-overlay';
        
        // Prevent clicking outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                // Do nothing, force user to use close button
            }
        });

        const modal = document.createElement('div');
        modal.className = 'av-quiz-modal';
        
        modal.innerHTML = `
            <div class="av-quiz-header">
                <h2 id="av-quiz-title">Quiz</h2>
                <button class="av-quiz-close" aria-label="Close" title="Close">&times;</button>
            </div>
            <div class="av-quiz-body" id="av-quiz-body">
                <!-- Content injected here -->
            </div>
            <div class="av-quiz-footer" id="av-quiz-footer">
                <!-- Action buttons injected here -->
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        overlay.querySelector('.av-quiz-close').addEventListener('click', close);
        
        modalElement = overlay;
    }

    function open(algoId) {
        if (!window.QuizData || !window.QuizData[algoId]) {
            alert('Quiz data not found for ' + algoId);
            return;
        }
        
        currentAlgoId = algoId;
        questions = window.QuizData[algoId];
        currentQuestionIndex = 0;
        currentScore = 0;

        createModalDOM();
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        const titleMap = {
            'bubble-sort': 'Bubble Sort', 'selection-sort': 'Selection Sort', 'insertion-sort': 'Insertion Sort',
            'merge-sort': 'Merge Sort', 'quick-sort': 'Quick Sort', 'heap-sort': 'Heap Sort',
            'linear-search': 'Linear Search', 'binary-search': 'Binary Search',
            'bfs': 'Breadth-First Search', 'dfs': 'Depth-First Search', 'dijkstra': "Dijkstra's Algorithm",
            'prim': "Prim's Algorithm", 'kruskal': "Kruskal's Algorithm",
            'kadane': "Kadane's Algorithm", 'floyd-warshall': 'Floyd Warshall', 'warshall': "Warshall's Algorithm", 'kmp': 'KMP Algorithm', 'rabin-karp': 'Rabin Karp'
        };

        document.getElementById('av-quiz-title').textContent = (titleMap[algoId] || algoId) + ' Quiz';
        
        renderQuestion(currentQuestionIndex);
    }

    function renderQuestion(index) {
        const q = questions[index];
        const body = document.getElementById('av-quiz-body');
        const footer = document.getElementById('av-quiz-footer');
        
        footer.innerHTML = '';
        
        const labels = ['A', 'B', 'C', 'D'];
        
        let html = `
            <div class="av-quiz-progress">Question ${index + 1} of ${questions.length}</div>
            <h3 class="av-quiz-qtext">${q.q}</h3>
            <div class="av-quiz-options">
        `;
        
        q.options.forEach((opt, i) => {
            html += `<button class="av-quiz-option" data-index="${i}">
                <span class="av-quiz-opt-label">${labels[i]}</span> ${opt}
            </button>`;
        });
        
        html += `</div>
            <div id="av-quiz-feedback" style="display:none; margin-top: 20px;">
                <div class="av-explanation-panel">
                    <h4>💡 Explanation</h4>
                    <p>${q.explanation}</p>
                </div>
                <div class="av-context-panel" style="margin-top: 15px;">
                    <h4>📘 Algorithm Context</h4>
                    <p>${q.algoContext}</p>
                </div>
            </div>
        `;
        
        body.innerHTML = html;
        
        const optionBtns = body.querySelectorAll('.av-quiz-option');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedIndex = parseInt(this.getAttribute('data-index'));
                handleAnswer(selectedIndex, q.correct, q, optionBtns);
            });
        });
    }

    function handleAnswer(selectedIndex, correctIndex, questionObj, optionBtns) {
        // Lock buttons
        optionBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
        
        const isCorrect = selectedIndex === correctIndex;
        if (isCorrect) {
            currentScore++;
            optionBtns[selectedIndex].classList.add('correct');
            optionBtns[selectedIndex].innerHTML += ' <span class="av-quiz-mark">✓</span>';
        } else {
            optionBtns[selectedIndex].classList.add('wrong');
            optionBtns[selectedIndex].innerHTML += ' <span class="av-quiz-mark">✗</span>';
            optionBtns[correctIndex].classList.add('correct');
            optionBtns[correctIndex].innerHTML += ' <span class="av-quiz-mark">✓</span>';
        }
        
        document.getElementById('av-quiz-feedback').style.display = 'block';
        
        const footer = document.getElementById('av-quiz-footer');
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary';
        
        if (currentQuestionIndex < questions.length - 1) {
            nextBtn.textContent = 'Next Question →';
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++;
                renderQuestion(currentQuestionIndex);
            });
        } else {
            nextBtn.textContent = 'See Results';
            nextBtn.addEventListener('click', () => {
                showResults(currentScore, questions.length, currentAlgoId);
            });
        }
        
        footer.appendChild(nextBtn);
    }

    function showResults(score, total, algoId) {
        const isNewBest = saveScore(algoId, score);
        
        const body = document.getElementById('av-quiz-body');
        const footer = document.getElementById('av-quiz-footer');
        
        let stars = '';
        const starCount = score; 
        for(let i=0; i<4; i++) {
            stars += i < starCount ? '⭐' : '☆';
        }
        
        let msg = score === total ? 'Perfect!' : (score >= total/2 ? 'Good job!' : 'Keep practicing!');
        
        body.innerHTML = `
            <div class="av-quiz-results">
                <h2>Quiz Complete</h2>
                <div class="av-quiz-score-display">${score} / ${total}</div>
                <div class="av-quiz-stars-large">${stars}</div>
                <p>${msg}</p>
                ${isNewBest ? '<div class="av-quiz-new-best">🏆 New Best Score!</div>' : ''}
            </div>
        `;
        
        footer.innerHTML = `
            <button class="btn btn-secondary" id="av-btn-retake">Retake Quiz</button>
            <button class="btn btn-primary" id="av-btn-close">Close</button>
        `;
        
        document.getElementById('av-btn-retake').addEventListener('click', () => open(algoId));
        document.getElementById('av-btn-close').addEventListener('click', close);
        
        updateCardBadge(algoId, score);
    }

    function close() {
        if (modalElement && modalElement.parentNode) {
            modalElement.parentNode.removeChild(modalElement);
        }
        modalElement = null;
        document.body.style.overflow = '';
    }

    function updateCardBadge(algoId, score) {
        const btn = document.querySelector(`button[data-quiz="${algoId}"]`);
        if (!btn) return;
        
        const card = btn.closest('.algorithm-card');
        if (!card) return;
        
        const header = card.querySelector('.algorithm-header');
        if (!header) return;
        
        let badge = header.querySelector('.av-quiz-stars');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'av-quiz-stars';
            header.appendChild(badge);
        }
        
        let stars = '';
        for(let i=0; i<4; i++) {
            stars += i < score ? '⭐' : '☆';
        }
        badge.innerHTML = stars;
    }
    
    function restoreBadges() {
        try {
            const data = localStorage.getItem('av_quiz_scores');
            if (!data) return;
            const scores = JSON.parse(data);
            for (const algoId in scores) {
                updateCardBadge(algoId, scores[algoId].best);
            }
        } catch(e) {
            console.error('Error restoring badges', e);
        }
    }
    
    document.addEventListener('DOMContentLoaded', restoreBadges);

    return {
        open,
        renderQuestion,
        handleAnswer,
        showResults,
        close,
        updateCardBadge,
        restoreBadges
    };
})();
