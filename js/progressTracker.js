const ProgressTracker = {
    STORAGE_KEY: 'av_progress',

    mark(algoId) {
        try {
            const data = this.getAll();
            data[algoId] = { done: true, ts: Date.now() };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Progress Tracker: Could not save progress', e);
        }
    },

    isDone(algoId) {
        const data = this.getAll();
        return !!(data[algoId] && data[algoId].done);
    },

    getAll() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.warn('Progress Tracker: Could not read progress', e);
            return {};
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Read localStorage
    const progress = ProgressTracker.getAll();

    // 2. For each algoId that isDone, restore the badge on page reload
    for (const algoId in progress) {
        if (progress[algoId].done) {

            // FIX: find the button with data-algo, then go up to its card
            // (cards do NOT have data-algorithm — buttons have data-algo)
            const btn = document.querySelector(`button[data-algo="${algoId}"]`);
            const card = btn ? btn.closest('.algorithm-card') : null;

            if (card) {
                card.classList.add('av-completed');
            }
        }
    }

    // 3. Event delegation on document for Visualize button clicks
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-algo]');
        if (btn) {
            const algoId = btn.getAttribute('data-algo');
            ProgressTracker.mark(algoId);

            const card = btn.closest('.algorithm-card');
            if (card) {
                card.classList.add('av-completed');
            }
        }
    });
});