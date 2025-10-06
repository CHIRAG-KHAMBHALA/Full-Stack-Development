document.addEventListener('DOMContentLoaded', function () {
    const exercisesContainer = document.getElementById('exercisesContainer');
    const exerciseInput = document.getElementById('exerciseInput');
    const addExerciseButton = document.getElementById('addExercise');
    const resetAllButton = document.getElementById('resetAll');
    const saveSessionButton = document.getElementById('saveSession');
    
    // Local storage key
    const STORAGE_KEY = 'gymRepCounterData';
    
    // Load data from localStorage
    function loadLocalData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    }
    
    // Save data to localStorage
    function saveLocalData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    // Create exercise card with enhanced animations and functionality
    function createExerciseCard(exerciseName, initialCount = 0) {
        // Check if exercise already exists
        const existingCard = Array.from(exercisesContainer.children)
            .find(c => c.querySelector('.exercise-name').textContent === exerciseName);
        if (existingCard) {
            showNotification('Exercise already exists!', 'warning');
            return;
        }
        
        const template = document.getElementById('exerciseCardTemplate');
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.exercise-card');
        const name = card.querySelector('.exercise-name');
        const repCount = card.querySelector('.rep-count');
        const incrementButton = card.querySelector('.btn-increment');
        const decrementButton = card.querySelector('.btn-decrement');
        const resetButton = card.querySelector('.btn-reset');
        const removeButton = card.querySelector('.remove-exercise');
        const setCountInput = card.querySelector('.set-count-input');
        const setCountButton = card.querySelector('.btn-set');

        name.textContent = exerciseName;
        repCount.textContent = initialCount;
        
        // Set unique data attribute for easy identification
        card.setAttribute('data-exercise', exerciseName);

        // Event listeners with enhanced functionality
        incrementButton.addEventListener('click', () => {
            updateReps(exerciseName, 'increment');
            addPulseAnimation(repCount);
        });
        
        decrementButton.addEventListener('click', () => {
            updateReps(exerciseName, 'decrement');
            addPulseAnimation(repCount);
        });
        
        resetButton.addEventListener('click', () => {
            if (confirm(`Reset ${exerciseName} counter to 0?`)) {
                updateReps(exerciseName, 'reset');
                addPulseAnimation(repCount);
            }
        });
        
        setCountButton.addEventListener('click', () => {
            const count = parseInt(setCountInput.value, 10);
            if (!isNaN(count) && count >= 0) {
                updateReps(exerciseName, 'set', count);
                setCountInput.value = '';
                addPulseAnimation(repCount);
            } else {
                showNotification('Please enter a valid number!', 'error');
            }
        });
        
        // Enter key support for set count input
        setCountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                setCountButton.click();
            }
        });
        
        removeButton.addEventListener('click', () => {
            if (confirm(`Remove ${exerciseName} from your workout?`)) {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                    // Remove from server and local storage
                    removeExercise(exerciseName);
                }, 300);
            }
        });

        exercisesContainer.appendChild(clone);
        
        // Add entrance animation
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, 100);
        
        showNotification(`${exerciseName} added to your workout!`, 'success');
    }
    
    // Enhanced update reps function with local storage sync
    function updateReps(exerciseName, action, count = 0) {
        // Update server
        fetch(`/api/reps/${exerciseName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, count })
        })
        .then(response => response.json())
        .then(data => {
            const card = exercisesContainer.querySelector(`[data-exercise="${exerciseName}"]`);
            if (card) {
                card.querySelector('.rep-count').textContent = data.count;
            }
            
            // Update local storage
            const localData = loadLocalData();
            localData[exerciseName] = data.count;
            saveLocalData(localData);
        })
        .catch(error => {
            console.error('Error updating reps:', error);
            showNotification('Error updating reps. Changes saved locally.', 'error');
            
            // Fallback to local storage only
            const localData = loadLocalData();
            if (action === 'increment') {
                localData[exerciseName] = (localData[exerciseName] || 0) + 1;
            } else if (action === 'decrement') {
                localData[exerciseName] = Math.max(0, (localData[exerciseName] || 0) - 1);
            } else if (action === 'reset') {
                localData[exerciseName] = 0;
            } else if (action === 'set') {
                localData[exerciseName] = Math.max(0, count);
            }
            saveLocalData(localData);
            
            const card = exercisesContainer.querySelector(`[data-exercise="${exerciseName}"]`);
            if (card) {
                card.querySelector('.rep-count').textContent = localData[exerciseName];
            }
        });
    }
    
    // Remove exercise from server and local storage
    function removeExercise(exerciseName) {
        // Remove from local storage
        const localData = loadLocalData();
        delete localData[exerciseName];
        saveLocalData(localData);
        
        // Note: In a real app, you might want to add a DELETE endpoint for individual exercises
    }
    
    // Add pulse animation to element
    function addPulseAnimation(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 300);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Enhanced add exercise functionality
    addExerciseButton.addEventListener('click', () => {
        const exerciseName = exerciseInput.value.trim();
        if (exerciseName) {
            if (exerciseName.length > 30) {
                showNotification('Exercise name too long (maximum 30 characters)', 'warning');
                return;
            }
            createExerciseCard(exerciseName);
            exerciseInput.value = '';
        } else {
            showNotification('Please enter an exercise name', 'warning');
        }
    });
    
    // Enter key support for exercise input
    exerciseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addExerciseButton.click();
        }
    });

    // Enhanced reset all functionality
    resetAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all exercises? This cannot be undone.')) {
            fetch('/api/reps', {
                method: 'DELETE'
            })
            .then(() => {
                // Clear local storage
                localStorage.removeItem(STORAGE_KEY);
                
                // Remove all cards with animation
                Array.from(exercisesContainer.children).forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'scale(0.8)';
                        card.style.opacity = '0';
                        setTimeout(() => card.remove(), 300);
                    }, index * 100);
                });
                
                showNotification('All exercises reset!', 'success');
            })
            .catch(error => {
                console.error('Error resetting:', error);
                showNotification('Error resetting exercises', 'error');
            });
        }
    });
    
    // Save session to local storage
    saveSessionButton.addEventListener('click', () => {
        const currentData = {};
        Array.from(exercisesContainer.children).forEach(card => {
            const exerciseName = card.querySelector('.exercise-name').textContent;
            const repCount = parseInt(card.querySelector('.rep-count').textContent);
            currentData[exerciseName] = repCount;
        });
        
        saveLocalData(currentData);
        showNotification('Session saved successfully!', 'success');
    });

    // Load exercises on page load (from server with fallback to local storage)
    function loadExercises() {
        fetch('/api/reps')
            .then(response => response.json())
            .then(serverData => {
                // Load from server first
                for (const exerciseName in serverData) {
                    createExerciseCard(exerciseName, serverData[exerciseName]);
                }
                
                // If no server data, try local storage
                if (Object.keys(serverData).length === 0) {
                    const localData = loadLocalData();
                    for (const exerciseName in localData) {
                        createExerciseCard(exerciseName, localData[exerciseName]);
                    }
                    if (Object.keys(localData).length > 0) {
                        showNotification('Loaded from local storage', 'info');
                    }
                }
            })
            .catch(error => {
                console.error('Error loading from server:', error);
                // Fallback to local storage
                const localData = loadLocalData();
                for (const exerciseName in localData) {
                    createExerciseCard(exerciseName, localData[exerciseName]);
                }
                if (Object.keys(localData).length > 0) {
                    showNotification('Loaded from local storage (offline mode)', 'warning');
                } else {
                    showNotification('Welcome! Add your first exercise to get started.', 'info');
                }
            });
    }
    
    // Load exercises on page load
    loadExercises();
    
    // Add some default exercises if none exist
    setTimeout(() => {
        if (exercisesContainer.children.length === 0) {
            const defaultExercises = ['Push-ups', 'Squats', 'Planks'];
            showNotification('Added some sample exercises to get you started!', 'info');
            defaultExercises.forEach((exercise, index) => {
                setTimeout(() => {
                    createExerciseCard(exercise, 0);
                }, index * 500);
            });
        }
    }, 1000);
});

