const text = "JESLYN KUAI";
const speed = 100;
let i = 0;
const target = document.getElementById("typing");

function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = typeWriter;

class WindowManager {
    constructor() {
        this.windows = []; // empty array called windows to store all window instances
        this.highestZIndex = 1000; // determines which element appears on top of others, increment to show current active window on top
        this.activeWindow = null; // sets current window to null = no window is active initally
        this.dragData = null; // placeholder for storing data related to dragging
        this.resizeData = null; // placeholder for storing data related to resizing

        this.init(); // sets up event listeners/intial window configurations
    }

    init() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bing(this));
    }

    createWindow(title, content, x = 150, y = 100, width = 400, height = 300) {
        // create window id for later use
        const windowId = 'window-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        const windowElement = document.createElement('div');
        windowElement.className = 'mac-window';
        windowElement.id = windowId;
        windowElement.style.left = x + 'px';
        windowElement.style.top = y + 'px';
        windowElement.style.width = width + 'px';
        windowElement.style.height = height + 'px';
        windowElement.style.zIndex = ++this.highestZIndex; // placing window on top of others

        // html code for window
        windowElement.innerHTML = `
            <div class="mac-window-header">
                <div class="mac-window-controls">
                    <div class="mac-window-control mac-window-close" data-action="close"></div>
                    <div class="mac-window-control mac-window-minimize" data-action="minimize"></div>
                    <div class="mac-window-control mac-window-maximize" data-action="maximize"></div>
                </div>
                <div class="mac-window-title">${title}</div>
            </div>
            <div class="mac-window-content">${content}</div>
            <div class="mac-window-resize-handle"></div>
        `;

        // adding window to document
        document.body.appendChild(windowElement);

        // to easily access properties
        const windowObj = {
            id: windowId,
            element: windowElement,
            title: title,
            isMinimized: false,
            originalDimensions: {width, height, x, y}
        };

        this.windows.push(windowObj);
        this.bringToFront(windowObj);

        return windowObj;
    }

    handleMouseDown(e) {
        // is a window being clicked?
        const window = e.target.closest('.mac-window');
        if (!window) return;

        // if so bring that window to the front
        const windowObj = this.windows.find(w => w.id === window.id);
        if (windowObj) {
            this.bringToFront(windowObj);
        }

        // handling control buttons on top of window
        if (e.target.classList.contains('mac-window-control')) {
            e.preventDefault();
            const action = e.target.dataset.action;
            this.handleControlAction(action, windowObj);
            return;
        }

        // handling resize
        if (e.target.classList.contains('mac-window-resize-handle')) {
            e.preventDefault();
            this.startResize(e, windowObj);
            return;
        }

        // handling drag
        if (e.target.closest('.mac-window-header')) {
            e.preventDefault();
            this.startDrag(e, windowObj);
            return;
        }
    }

    // when the mouse is moving on click
    handleMouseMove(e) {
        if (this.dragData) {
            this.updateDrag(e);
        } else if (this.resizeData) {
            this.updateResize(e);
        }
    }

    // reseting possible actions when mouse is released
    handleMouseUp(e) {
        this.dragData = null;
        this.resizeData = null;
    }

    // starting drag action
    startDrag(e, windowObj) {
        // getting current position and size of window
        const rect = windowObj.element.getBoundingClientRect();
        this.dragData = {
            window: windowObj,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };
    }

    // updating drag action when mouse is held
    updateDrag(e) {
        if (!this.dragData) return;

        const newX = e.clientX - this.dragData.offsetX;
        const newY = e.clientY - this.dragData.offsetY;

        // Keep window within view
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 40;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        this.dragData.window.element.style.left = constrainedX + 'px';
        this.dragData.window.element.style.top = constrainedY + 'px';
    }

    // starting resize action
    startResize(e, windowObj) {
        const rect = windowObj.element.getBoundingClientRect();
        this.resizeData = {
            window: windowObj,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: rect.width,
            startHeight: rect.height
        };
    }

    // updating resize data when mouse is dragged
    updateResize(e) {
        if (!this.resizeData) return;

        const deltaX = e.clientX - this.resizeData.startX;
        const deltaY = e.clientY - this.resizeData.startY;

        const newWidth = Math.max(300, this.resizeData.startWidth + deltaX);
        const newHeigth = Math.max(200, this.resizeData.startHeight + deltaY);

        // keep window in view
        const rect = this.resizeData.window.element.getBoundingClientRect();
        const maxWidth = window.innerWidth - rect.left;
        const maxHeight = window.innerHeight - rect.top;

        const constrainedWidth = Math.min(newWidth, maxWidth);
        const constrainedHeight = Math.min(newHeigth, maxHeight);

        this.resizeData.window.element.style.width = constrainedWidth + 'px';
        this.resizeData.window.element.style.height = constrainedHeight + 'px';
    }
}