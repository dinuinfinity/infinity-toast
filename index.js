// Toast notification system
export class InfinityToast {
    static containers = {};

    constructor(options = {}) {
        this.options = {
            position: options.position || 'top-right',
            duration: options.duration || 3000,
            containerClass: options.containerClass || 'infinity-toast-container',
            toastClass: options.toastClass || 'infinity-toast',
            showIcon: options.showIcon !== false, // Enable icons by default
            showCloseButton: options.showCloseButton !== false, // Enable close button by default
            ...options
        };
        this.icons = {
            success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>`,
            warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L22 20H2L12 2z"/>
                <path d="M12 8v7"/>
                <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
            </svg>`,
            info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 7v2"/>
                <path d="M12 11v7"/>
            </svg>`,
            close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>`
        };
        this.init();
    }

    getAnimationDirection() {
        // Determine animation direction based on position
        const position = this.options.position;
        return position.includes('left') ? 'left' : 'right';
    }

    init() {
        // Create stylesheet if it doesn't exist
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .infinity-toast-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 380px;
                    position: fixed;
                    z-index: 9999;
                }
                @keyframes toast-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes toast-in-left {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes toast-out-right {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                @keyframes toast-out-left {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                }
                .infinity-toast {
                    padding: 16px 20px;
                    border-radius: 8px;
                    color: #fff;
                    font-size: 14px;
                    opacity: 0;
                    cursor: default;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    line-height: 1.4;
                    position: relative;
                    overflow: hidden;
                    animation-fill-mode: forwards;
                    animation-duration: 0.3s;
                    animation-timing-function: ease-in-out;
                }
                .infinity-toast.show {
                    opacity: 1;
                }
                .infinity-toast.show.from-right {
                    animation-name: toast-in-right;
                }
                .infinity-toast.show.from-left {
                    animation-name: toast-in-left;
                }
                .infinity-toast.hide.to-right {
                    animation-name: toast-out-right;
                }
                .infinity-toast.hide.to-left {
                    animation-name: toast-out-left;
                }
                .toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.3);
                }
                .toast-progress-bar {
                    height: 100%;
                    background: rgba(255, 255, 255, 0.7);
                    transition: width linear;
                }
                .infinity-toast:hover .toast-progress-bar {
                    animation-play-state: paused;
                }
                .infinity-toast svg {
                    width: 20px;
                    height: 20px;
                }
                .toast-close-button {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: currentColor;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    margin: 0;
                    margin-left: 4px;
                }
                .toast-close-button:hover {
                    opacity: 1;
                }
                .toast-close-button svg {
                    width: 16px;
                    height: 16px;
                }
                .infinity-toast.success { 
                    background-color: #4caf50;
                }
                .infinity-toast.error { 
                    background-color: #f44336;
                }
                .infinity-toast.warning { 
                    background-color: #ff9800;
                }
                .infinity-toast.info { 
                    background-color: #2196f3;
                }
            `;
            document.head.appendChild(style);
        }

        // Use a shared container for each position
        const position = this.options.position;
        if (!InfinityToast.containers[position]) {
            const container = document.createElement('div');
            container.id = `infinity-toast-container-${position}`;
            container.className = `infinity-toast-container`;
            document.body.appendChild(container);
            InfinityToast.containers[position] = container;
        }
        this.container = InfinityToast.containers[position];
        this.setPosition();
    }

    setPosition() {
        switch (this.options.position) {
            case 'top-right':
                Object.assign(this.container.style, {
                    top: '20px',
                    right: '20px'
                });
                break;
            case 'top-left':
                Object.assign(this.container.style, {
                    top: '20px',
                    left: '20px'
                });
                break;
            case 'bottom-right':
                Object.assign(this.container.style, {
                    bottom: '20px',
                    right: '20px'
                });
                break;
            case 'bottom-left':
                Object.assign(this.container.style, {
                    bottom: '20px',
                    left: '20px'
                });
                break;
            default:
                Object.assign(this.container.style, {
                    top: '20px',
                    right: '20px'
                });
        }
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        const direction = this.getAnimationDirection();
        toast.className = `${this.options.toastClass} ${type} show from-${direction}`;

        // Create toast outer wrapper for layout
        const outerWrapper = document.createElement('div');
        outerWrapper.style.display = 'flex';
        outerWrapper.style.gap = '12px';
        outerWrapper.style.alignItems = 'flex-start';

        // Create toast content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.gap = '12px';
        contentWrapper.style.flex = '1';
        contentWrapper.style.minWidth = '0';

        // Add icon if enabled
        if (this.options.showIcon && this.icons[type]) {
            const iconWrapper = document.createElement('div');
            iconWrapper.style.flexShrink = '0';
            iconWrapper.style.lineHeight = '0';
            iconWrapper.innerHTML = this.icons[type];
            contentWrapper.appendChild(iconWrapper);
        }

        // Add message
        const messageElement = document.createElement('div');
        messageElement.style.flex = '1';
        messageElement.style.minWidth = '0';
        messageElement.textContent = message;
        contentWrapper.appendChild(messageElement);

        outerWrapper.appendChild(contentWrapper);

        // Add close button if enabled
        if (this.options.showCloseButton) {
            const closeButton = document.createElement('span');
            closeButton.className = 'toast-close-button';
            closeButton.innerHTML = this.icons.close;
            closeButton.onclick = (e) => {
                e.stopPropagation(); // Prevent toast click event
                this.dismiss(toast);
            };
            outerWrapper.appendChild(closeButton);
        }

        toast.appendChild(outerWrapper);

        // Add progress bar
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'toast-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress-bar';
        progressWrapper.appendChild(progressBar);
        toast.appendChild(progressWrapper);

        // Initialize timer and progress bar
        let startTime = null;
        let timeoutId = null;
        let animationFrameId = null;
        let isPaused = false;
        let remainingTime = this.options.duration;

        const updateProgressBar = (timestamp) => {
            if (!startTime) startTime = timestamp;
            if (!isPaused) {
                const progress = timestamp - startTime;
                const percentage = 100 - (progress / this.options.duration * 100);
                progressBar.style.width = `${percentage}%`;
                remainingTime = this.options.duration - progress;

                if (progress < this.options.duration) {
                    animationFrameId = requestAnimationFrame(updateProgressBar);
                }
            }
        };

        // Start progress bar animation
        animationFrameId = requestAnimationFrame(updateProgressBar);

        // Handle hover pause/resume
        toast.addEventListener('mouseenter', () => {
            isPaused = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            }
        });

        toast.addEventListener('mouseleave', () => {
            isPaused = false;
            startTime = performance.now() - (this.options.duration - remainingTime);
            timeoutId = setTimeout(() => this.dismiss(toast), remainingTime);
            animationFrameId = requestAnimationFrame(updateProgressBar);
        });

        // Add toast to container
        this.container.appendChild(toast);

        // Add animation class
        setTimeout(() => toast.classList.add('show'), 10);

        // Start auto-dismiss timer
        timeoutId = setTimeout(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            this.dismiss(toast);
        }, this.options.duration);

        // Remove click to dismiss as we only want close button to work
        toast.style.cursor = 'default'; // Remove pointer cursor since it's not clickable

        return toast;
    }

    dismiss(toast) {
        const direction = this.getAnimationDirection();
        toast.classList.remove('show', `from-${direction}`);
        toast.classList.add('hide', `to-${direction}`);
        
        // Remove the toast after animation
        setTimeout(() => {
            if (toast.parentNode === this.container) {
                this.container.removeChild(toast);
            }
        }, 300);
    }

    success(message) {
        return this.show(message, 'success');
    }

    error(message) {
        return this.show(message, 'error');
    }

    warning(message) {
        return this.show(message, 'warning');
    }

    info(message) {
        return this.show(message, 'info');
    }
}

// Create a default instance
export default new InfinityToast();