// Toast notification system
class InfinityToast {
    constructor(options = {}) {
        this.options = {
            position: options.position || 'top-right',
            duration: options.duration || 3000,
            containerClass: options.containerClass || 'infinity-toast-container',
            toastClass: options.toastClass || 'infinity-toast',
            ...options
        };
        this.init();
    }

    init() {
        this.container = document.getElementById(this.options.containerClass);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.options.containerClass;
            this.container.className = this.options.containerClass;
            document.body.appendChild(this.container);
        }
        this.setPosition();
    }

    setPosition() {
        this.container.style.position = 'fixed';
        this.container.style.zIndex = '9999';
        switch (this.options.position) {
            case 'top-right':
                this.container.style.top = '20px';
                this.container.style.right = '20px';
                break;
            case 'top-left':
                this.container.style.top = '20px';
                this.container.style.left = '20px';
                break;
            case 'bottom-right':
                this.container.style.bottom = '20px';
                this.container.style.right = '20px';
                break;
            case 'bottom-left':
                this.container.style.bottom = '20px';
                this.container.style.left = '20px';
                break;
            default:
                this.container.style.top = '20px';
                this.container.style.right = '20px';
        }
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `${this.options.toastClass} ${type}`;
        toast.textContent = message;

        // Add toast to container
        this.container.appendChild(toast);

        // Add animation class
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto-dismiss
        const timeoutId = setTimeout(() => {
            this.dismiss(toast);
        }, this.options.duration);

        // Add click to dismiss
        toast.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.dismiss(toast);
        });

        return toast;
    }

    dismiss(toast) {
        toast.classList.remove('show');
        toast.classList.add('hide');
        
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