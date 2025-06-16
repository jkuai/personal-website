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
}