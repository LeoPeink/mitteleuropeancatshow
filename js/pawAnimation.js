/**
 * Magical Paw Animation - Inspired by the Marauder's Map
 * Creates two paw prints that teleport closer to cursor every second
 * with fade in/out effects until they get close
 */

class MagicalPaws {
    constructor() {
        console.log('MagicalPaws constructor called');
        this.paws = [];
        this.mouseX = (window.innerWidth / 2) + window.scrollX;
        this.mouseY = (window.innerHeight / 2) + window.scrollY;
        this.teleportInterval = null;
        this.animationId = null;
        
        console.log('Initial mouse position:', this.mouseX, this.mouseY);
        
        // Configuration
        this.config = {
            pawImage: 'img/paw/PAW.png',
            pawSize: 30,
            followDistance: 80, // Distance at which paws stop teleporting
            teleportInterval: 1000, // Teleport every 1000ms (1 second)
            fadeInDuration: 100, // Time to fade in (300ms)
            fadeOutDuration: 100, // Time to fade out (300ms)
            maxOpacity: 0.8,
            minOpacity: 0,
            pawCount: 2,
            stepSize: 50, // Fixed step size in pixels for natural walking
            spacing: 60 // Distance between the two paws (closer together for single cat)
        };
        
        this.init();
        console.log('MagicalPaws initialization complete');
    }
    
    init() {
        this.createPaws();
        this.bindEvents();
        this.startTeleportCycle();
        this.startAnimation();
    }
    
    createPaws() {
        // Calculate a single starting position for both paws to be close together
        const docWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
        const docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        const startX = Math.random() * (docWidth - 100) + 50; // Leave some margin
        const startY = Math.random() * (docHeight - 100) + 50;
        
        for (let i = 0; i < this.config.pawCount; i++) {
            const paw = {
                element: this.createPawElement(),
                // Position paws close together initially
                x: startX + (i * this.config.spacing) - (this.config.spacing / 2),
                y: startY + (Math.random() - 0.5) * 10, // Small random Y offset
                opacity: 0,
                fadePhase: 'hidden', // 'hidden', 'fadeIn', 'visible', 'fadeOut'
                fadeStartTime: 0,
                isNearCursor: false,
                index: i,
                rotation: 0, // Rotation angle toward cursor
                // Offset the timing for out-of-phase behavior
                phaseOffset: i * (this.config.teleportInterval / this.config.pawCount)
            };
            
            this.paws.push(paw);
            // Insert at the beginning of body to ensure paws are behind other content
            document.body.insertBefore(paw.element, document.body.firstChild);
            
            // Start each paw with different phase - first paw starts immediately, second starts after half interval
            if (i === 0) {
                paw.fadePhase = 'fadeIn';
                paw.fadeStartTime = Date.now();
                // Calculate initial rotation toward cursor
                const deltaX = this.mouseX - paw.x;
                const deltaY = this.mouseY - paw.y;
                paw.rotation = Math.atan2(deltaY, deltaX) + Math.PI / 2; // Add 90 degrees clockwise
            } else {
                // Second paw starts in opposite phase
                setTimeout(() => {
                    paw.fadePhase = 'fadeIn';
                    paw.fadeStartTime = Date.now();
                    // Calculate initial rotation toward cursor
                    const deltaX = this.mouseX - paw.x;
                    const deltaY = this.mouseY - paw.y;
                    paw.rotation = Math.atan2(deltaY, deltaX) + Math.PI / 2; // Add 90 degrees clockwise
                }, this.config.teleportInterval / 2);
            }
            
            this.updatePawVisuals(paw);
        }
    }
    
    createPawElement() {
        const pawElement = document.createElement('div');
        pawElement.className = 'magical-paw';
        pawElement.style.cssText = `
            position: absolute;
            width: ${this.config.pawSize}px;
            height: ${this.config.pawSize}px;
            background-image: url('${this.config.pawImage}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            pointer-events: none;
            opacity: 1;
            transition: none;
            will-change: transform, opacity;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        `;
        
        return pawElement;
    }
    
    bindEvents() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            // Add scroll offset to mouse position since paws use absolute positioning
            this.mouseX = e.clientX + window.scrollX;
            this.mouseY = e.clientY + window.scrollY;
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const docWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
            const docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            
            this.paws.forEach(paw => {
                if (paw.x > docWidth) paw.x = docWidth - 50;
                if (paw.y > docHeight) paw.y = docHeight - 50;
                this.updatePawVisuals(paw);
            });
        });
        
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopTeleportCycle();
                this.stopAnimation();
            } else {
                this.startTeleportCycle();
                this.startAnimation();
            }
        });
    }
    
    startTeleportCycle() {
        if (this.teleportInterval) {
            clearInterval(this.teleportInterval);
        }
        
        // Create separate intervals for each paw to maintain out-of-phase behavior
        this.paws.forEach((paw, index) => {
            const delay = index * (this.config.teleportInterval / 2); // Half interval offset for 2 paws
            
            setTimeout(() => {
                // Create individual interval for this paw
                paw.teleportTimer = setInterval(() => {
                    this.teleportSinglePaw(paw);
                }, this.config.teleportInterval);
            }, delay);
        });
    }
    
    stopTeleportCycle() {
        this.paws.forEach(paw => {
            if (paw.teleportTimer) {
                clearInterval(paw.teleportTimer);
                paw.teleportTimer = null;
            }
        });
        
        if (this.teleportInterval) {
            clearInterval(this.teleportInterval);
            this.teleportInterval = null;
        }
    }
    
    teleportSinglePaw(paw) {
        // Check if paw is already close to cursor
        const currentDistance = Math.sqrt(
            Math.pow(this.mouseX - paw.x, 2) + Math.pow(this.mouseY - paw.y, 2)
        );
        
        paw.isNearCursor = currentDistance < this.config.followDistance;
        
        if (!paw.isNearCursor) {
            // Start fade out
            paw.fadePhase = 'fadeOut';
            paw.fadeStartTime = Date.now();
            
            // After fade out, teleport and fade in
            setTimeout(() => {
                this.repositionPaw(paw);
                paw.fadePhase = 'fadeIn';
                paw.fadeStartTime = Date.now();
            }, this.config.fadeOutDuration);
        }
    }

    // Keep the old method for compatibility, but now it calls the single paw version
    teleportPaws() {
        this.paws.forEach(paw => {
            this.teleportSinglePaw(paw);
        });
    }
    
    repositionPaw(paw) {
        // Calculate new position closer to cursor
        const currentDistance = Math.sqrt(
            Math.pow(this.mouseX - paw.x, 2) + Math.pow(this.mouseY - paw.y, 2)
        );
        
        if (currentDistance > this.config.followDistance) {
            // Calculate direction toward the cursor
            const deltaX = this.mouseX - paw.x;
            const deltaY = this.mouseY - paw.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Calculate the angle toward the cursor for rotation
            const angleTowardsCursor = Math.atan2(deltaY, deltaX);
            paw.rotation = angleTowardsCursor + Math.PI / 2; // Add 90 degrees clockwise
            
            // Calculate midpoint between the two paws to maintain constant spacing
            const otherPaw = this.paws.find(p => p.index !== paw.index);
            const midX = (paw.x + otherPaw.x) / 2;
            const midY = (paw.y + otherPaw.y) / 2;
            
            // Move the midpoint toward the cursor
            const midDeltaX = this.mouseX - midX;
            const midDeltaY = this.mouseY - midY;
            const midDistance = Math.sqrt(midDeltaX * midDeltaX + midDeltaY * midDeltaY);
            
            if (midDistance > 0) {
                // Calculate step for midpoint
                const stepX = (midDeltaX / midDistance) * this.config.stepSize;
                const stepY = (midDeltaY / midDistance) * this.config.stepSize;
                
                // Calculate perpendicular offset to maintain spacing
                const perpAngle = Math.atan2(midDeltaY, midDeltaX) + Math.PI / 2;
                const offsetDistance = this.config.spacing / 2;
                const offsetX = Math.cos(perpAngle) * offsetDistance * (paw.index === 0 ? -1 : 1);
                const offsetY = Math.sin(perpAngle) * offsetDistance * (paw.index === 0 ? -1 : 1);
                
                // Set new position maintaining constant spacing
                const newMidX = midX + stepX;
                const newMidY = midY + stepY;
                
                paw.x = newMidX + offsetX;
                paw.y = newMidY + offsetY;
            }
            
            // Keep within screen bounds
            const docWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
            const docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            paw.x = Math.max(this.config.pawSize, Math.min(docWidth - this.config.pawSize, paw.x));
            paw.y = Math.max(this.config.pawSize, Math.min(docHeight - this.config.pawSize, paw.y));
        }
    }
    
    updatePawVisuals(paw) {
        // Update position
        paw.element.style.left = paw.x - (this.config.pawSize / 2) + 'px';
        paw.element.style.top = paw.y - (this.config.pawSize / 2) + 'px';
        
        // Update rotation to point toward cursor
        if (paw.rotation !== undefined) {
            // Convert radians to degrees and apply rotation
            const rotationDegrees = (paw.rotation * 180) / Math.PI;
            paw.element.style.transform = `rotate(${rotationDegrees}deg)`;
        }
        
        // Handle fade animations
        const currentTime = Date.now();
        const timeSinceFadeStart = currentTime - paw.fadeStartTime;
        
        switch (paw.fadePhase) {
            case 'fadeIn':
                if (timeSinceFadeStart < this.config.fadeInDuration) {
                    const progress = timeSinceFadeStart / this.config.fadeInDuration;
                    // Ease-in-out curve for smoother animation
                    const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
                    paw.opacity = this.config.maxOpacity * easedProgress;
                } else {
                    paw.opacity = this.config.maxOpacity;
                    paw.fadePhase = 'visible';
                }
                break;
                
            case 'fadeOut':
                if (timeSinceFadeStart < this.config.fadeOutDuration) {
                    const progress = timeSinceFadeStart / this.config.fadeOutDuration;
                    // Ease-in-out curve for smoother animation
                    const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
                    paw.opacity = this.config.maxOpacity * (1 - easedProgress);
                } else {
                    paw.opacity = 0;
                    paw.fadePhase = 'hidden';
                }
                break;
                
            case 'visible':
                paw.opacity = this.config.maxOpacity;
                break;
                
            case 'hidden':
                paw.opacity = 0;
                break;
        }
        
        // Apply the opacity
        paw.element.style.opacity = Math.max(0, Math.min(1, paw.opacity));
    }
    
    animate() {
        this.paws.forEach(paw => {
            this.updatePawVisuals(paw);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
        this.stopTeleportCycle();
        this.paws.forEach(paw => {
            if (paw.teleportTimer) {
                clearInterval(paw.teleportTimer);
            }
            if (paw.element.parentNode) {
                paw.element.parentNode.removeChild(paw.element);
            }
        });
        this.paws = [];
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on pages that should have the paw animation
    // You can customize this condition based on which pages you want the animation
    const shouldInitialize = !document.body.classList.contains('no-paw-animation');
    
    if (shouldInitialize) {
        // Initialize immediately when DOM is ready
        window.magicalPaws = new MagicalPaws();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (window.magicalPaws) {
        window.magicalPaws.destroy();
    }
});

// Export for manual control if needed
window.MagicalPaws = MagicalPaws;
