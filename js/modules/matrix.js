export class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.fontSize = 20;
        this.letterSpacing = 3.5; // Increased horizontal spacing
        this.verticalSpacing = 1.5; // Added vertical spacing multiplier
        this.effectiveColumnWidth = this.fontSize * this.letterSpacing;
        this.effectiveRowHeight = this.fontSize * this.verticalSpacing; // Calculate effective height including spacing
        this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.drops = [];
        this.lastFrame = 0;
        this.frameInterval = 100;
        this.isEnabled = true; // Add enabled state
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.columns = Math.floor(this.width / this.effectiveColumnWidth); // Use effectiveColumnWidth for spacing
        this.resetDrops();
    }

    resetDrops() {
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = Math.random() * -100;
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.columns = Math.floor(this.width / this.effectiveColumnWidth); // Use effectiveColumnWidth here too
            this.resetDrops();
        });

        // Add matrix toggle handler
        const toggle = document.getElementById('matrix-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => {
                this.isEnabled = toggle.checked;
                if (!this.isEnabled) {
                    // Clear the canvas when disabled
                    this.ctx.clearRect(0, 0, this.width, this.height);
                }
            });
        }
    }

    draw() {
        if (!this.isEnabled) return; // Skip drawing if disabled

        // Semi-transparent black background for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.columns; i++) {
            const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            // Use effectiveColumnWidth for horizontal spacing and effectiveRowHeight for vertical positioning
            this.ctx.fillText(char, 
                i * this.effectiveColumnWidth, 
                this.drops[i] * this.effectiveRowHeight
            );

            if (this.drops[i] * this.effectiveRowHeight > this.height && Math.random() > 0.99) {
                this.drops[i] = 0;
            }
            this.drops[i] += 0.5;
        }
    }

    animate(timestamp) {
        // Only draw a new frame if enough time has passed
        if (!this.lastFrame || timestamp - this.lastFrame >= this.frameInterval) {
            this.draw();
            this.lastFrame = timestamp;
        }
        requestAnimationFrame((ts) => this.animate(ts));
    }
}