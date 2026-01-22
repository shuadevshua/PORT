// Voice control functionality
const voiceBtn = document.getElementById('voiceBtn');
let isListening = false;

voiceBtn.addEventListener('click', function() {
    isListening = !isListening;
    
    if (isListening) {
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        showVoiceNotification("Listening... Say a command like 'show heart rate' or 'navigate to alerts'");
        
        // Simulate voice command processing
        setTimeout(() => {
            processVoiceCommand("show heart rate");
        }, 2000);
    } else {
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        showVoiceNotification("Voice control deactivated");
    }
});

function showVoiceNotification(message) {
    // Remove existing notification
    const existingNotification = document.getElementById('voiceNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.id = 'voiceNotification';
    notification.className = 'voice-notification';
    notification.innerHTML = `<p><i class="fas fa-robot"></i> ${message}</p>`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function processVoiceCommand(command) {
    const cmd = command.toLowerCase();
    let response = "Command executed: ";

    if (cmd.includes('connect')) {
        response += "Opening smartwatch connection";
        showConnectionModal();
    } else if (cmd.includes('heart rate') || cmd.includes('heart')) {
        response += "Displaying heart rate details";
        navigateToSection('dashboard');
        highlightCard('.vitals-card');
    } else if (cmd.includes('alert') || cmd.includes('notification')) {
        response += "Navigating to alerts";
        navigateToSection('alerts');
    } else if (cmd.includes('sleep')) {
        response += "Showing sleep analysis";
        navigateToSection('dashboard');
        highlightCard('.sleep-card');
    } else if (cmd.includes('dashboard') || cmd.includes('home')) {
        response += "Navigating to dashboard";
        navigateToSection('dashboard');
    } else if (cmd.includes('vitals') || cmd.includes('vital signs')) {
        response += "Showing vital signs";
        navigateToSection('vitals');
    } else {
        response = "Command not recognized. Try: 'connect', 'show heart rate', 'navigate to alerts', or 'show sleep data'";
    }

    showVoiceNotification(response);

    // Turn off listening after command
    setTimeout(() => {
        isListening = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }, 1500);
}

function highlightCard(selector) {
    const card = document.querySelector(selector);
    if (card) {
        const originalBoxShadow = card.style.boxShadow;
        card.style.boxShadow = '0 0 25px var(--teal)';
        
        setTimeout(() => {
            card.style.boxShadow = originalBoxShadow;
        }, 2000);
    }
}

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        navigateToSection(section);
    });
});

function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);

    // Update active navigation item
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('active');

    // Hide all content sections
    document.querySelectorAll('.content-section, .dashboard').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    if (sectionId === 'dashboard') {
        document.getElementById('dashboard-content').style.display = 'grid';
    } else {
        const sectionElement = document.getElementById(`${sectionId}-content`);
        if (sectionElement) {
            sectionElement.style.display = 'block';
            console.log('Showing section:', sectionId);
        } else {
            console.log('Section element not found:', `${sectionId}-content`);
        }
    }
}

// Simulate real-time data updates
function updateVitals() {
    // Randomly update heart rate between 65-85
    const heartRate = Math.floor(Math.random() * 20) + 65;
    const heartRateElement = document.querySelector('.vitals-card .card-value');
    if (heartRateElement) {
        heartRateElement.innerHTML = `${heartRate} <span class="unit">bpm</span>`;
    }
    
    // Randomly change status occasionally
    if (Math.random() > 0.7) {
        const status = document.querySelector('.vitals-card .card-status');
        if (status) {
            if (status.classList.contains('normal')) {
                status.classList.remove('normal');
                status.classList.add('warning');
                status.textContent = 'Elevated';
                
                // Add an alert for elevated heart rate
                addNewAlert('Heart Rate Alert', 'Heart rate elevated above normal range. Consider resting for 10 minutes.', 'warning');
            } else {
                status.classList.remove('warning');
                status.classList.add('normal');
                status.textContent = 'Normal';
            }
        }
    }
    
    // Update steps count
    const steps = document.querySelector('.activity-card .card-value');
    if (steps) {
        const currentSteps = parseInt(steps.textContent.replace(',', ''));
        const newSteps = currentSteps + Math.floor(Math.random() * 50);
        steps.textContent = newSteps.toLocaleString() + ' steps';
        
        // Update the unit span
        const unitSpan = steps.querySelector('.unit');
        if (!unitSpan) {
            steps.innerHTML = `${newSteps.toLocaleString()} <span class="unit">steps</span>`;
        }
    }
    
    // Update chart bars
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
        const newHeight = Math.floor(Math.random() * 30) + 20;
        bar.style.height = `${newHeight}%`;
        bar.setAttribute('data-value', `${Math.floor(newHeight * 50)}`);
    });
    
    // Occasionally update blood pressure
    if (Math.random() > 0.8) {
        const bpElement = document.querySelectorAll('.vitals-card .card-value')[1];
        if (bpElement) {
            const systolic = Math.floor(Math.random() * 20) + 120;
            const diastolic = Math.floor(Math.random() * 10) + 75;
            bpElement.textContent = `${systolic}/${diastolic}`;
        }
    }
}

// Add new alert to the alerts card
function addNewAlert(title, message, type = 'normal') {
    const alertsCard = document.querySelector('.alerts-card');
    if (!alertsCard) return;
    
    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${type}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    alertItem.innerHTML = `
        <p><strong>${title}</strong></p>
        <p>${message}</p>
        <div class="alert-time">Just now, ${timeString}</div>
    `;
    
    // Insert at the top of alerts
    const firstAlert = alertsCard.querySelector('.alert-item');
    if (firstAlert) {
        alertsCard.insertBefore(alertItem, firstAlert);
    } else {
        const cardHeader = alertsCard.querySelector('.card-header');
        if (cardHeader) {
            alertsCard.insertBefore(alertItem, cardHeader.nextSibling);
        }
    }
    
    // Limit to 5 alerts and remove the oldest if needed
    const allAlerts = alertsCard.querySelectorAll('.alert-item');
    if (allAlerts.length > 5) {
        allAlerts[allAlerts.length - 1].remove();
    }
}

// Update data every 5 seconds
setInterval(updateVitals, 5000);

// Update detailed vitals in the vitals section
function updateDetailedVitals() {
    // Update live heart rate
    const liveHR = document.getElementById('live-heart-rate');
    if (liveHR) {
        const hr = Math.floor(Math.random() * 10) + 68;
        liveHR.innerHTML = `${hr} <span class="unit">bpm</span>`;

        // Update heart zone
        const zone = document.getElementById('heart-zone');
        if (zone) {
            if (hr < 60) zone.textContent = 'Rest';
            else if (hr < 70) zone.textContent = 'Fat Burn';
            else if (hr < 80) zone.textContent = 'Cardio';
            else zone.textContent = 'Peak';
        }

        // Update HRV
        const hrv = document.getElementById('hrv');
        if (hrv) {
            hrv.textContent = `${Math.floor(Math.random() * 20) + 35} ms`;
        }
    }

    // Update live blood pressure
    const liveBP = document.getElementById('live-bp');
    if (liveBP) {
        const systolic = Math.floor(Math.random() * 15) + 120;
        const diastolic = Math.floor(Math.random() * 10) + 75;
        liveBP.innerHTML = `${systolic}/${diastolic} <span class="unit">mmHg</span>`;

        // Update pulse pressure
        const pulsePressure = document.getElementById('pulse-pressure');
        if (pulsePressure) {
            pulsePressure.textContent = `${systolic - diastolic} mmHg`;
        }

        // Update MAP
        const map = document.getElementById('map');
        if (map) {
            const mapValue = Math.round((systolic + 2 * diastolic) / 3);
            map.textContent = `${mapValue} mmHg`;
        }
    }

    // Update respiratory rate
    const respRate = document.getElementById('live-resp-rate');
    if (respRate) {
        const rate = Math.floor(Math.random() * 4) + 14;
        respRate.innerHTML = `${rate} <span class="unit">breaths/min</span>`;
    }

    // Update SpO2
    const spo2 = document.getElementById('spo2');
    if (spo2) {
        const oxygen = Math.floor(Math.random() * 3) + 95;
        spo2.textContent = `${oxygen}%`;
    }

    // Update respiratory volume
    const respVol = document.getElementById('resp-volume');
    if (respVol) {
        const volume = Math.floor(Math.random() * 100) + 400;
        respVol.textContent = `${volume} ml`;
    }

    // Update temperature
    const temp = document.getElementById('live-temp');
    if (temp) {
        const temperature = (Math.random() * 1.5 + 36.5).toFixed(1);
        temp.innerHTML = `${temperature} <span class="unit">°C</span>`;
    }

    // Update BMR
    const bmr = document.getElementById('bmr');
    if (bmr) {
        const bmrValue = Math.floor(Math.random() * 100) + 1600;
        bmr.textContent = `${bmrValue.toLocaleString()} kcal`;
    }

    // Update core temperature
    const coreTemp = document.getElementById('core-temp');
    if (coreTemp) {
        const core = (Math.random() * 0.5 + 37.0).toFixed(1);
        coreTemp.textContent = `${core}°C`;
    }

    // Update history stats
    const peakHR = document.getElementById('peak-hr');
    if (peakHR) {
        const peak = Math.floor(Math.random() * 20) + 130;
        peakHR.textContent = `${peak} bpm (Exercise)`;
    }

    const lowestBP = document.getElementById('lowest-bp');
    if (lowestBP) {
        const sys = Math.floor(Math.random() * 10) + 110;
        const dia = Math.floor(Math.random() * 5) + 70;
        lowestBP.textContent = `${sys}/${dia} mmHg`;
    }

    const avgTemp = document.getElementById('avg-temp');
    if (avgTemp) {
        const avg = (Math.random() * 0.5 + 36.6).toFixed(1);
        avgTemp.textContent = `${avg}°C`;
    }

    const sleepHRDrop = document.getElementById('sleep-hr-drop');
    if (sleepHRDrop) {
        const drop = Math.floor(Math.random() * 10) + 25;
        sleepHRDrop.textContent = `-${drop} bpm`;
    }
}

// Update detailed vitals every 3 seconds
setInterval(updateDetailedVitals, 3000);

// Initialize analytics data
function initializeAnalytics() {
    // This would normally load real data, but for demo we'll simulate
    console.log('Analytics initialized');
}

// Call initialization
initializeAnalytics();

// Hospital Sync Functions
function syncHospital(hospitalId) {
    const progressDiv = document.getElementById('syncProgress');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('syncStatusText');

    progressDiv.style.display = 'block';
    progressFill.style.width = '0%';
    statusText.textContent = 'Preparing data transfer...';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressFill.style.width = progress + '%';

        if (progress < 30) {
            statusText.textContent = 'Preparing data transfer...';
        } else if (progress < 60) {
            statusText.textContent = 'Encrypting medical records...';
        } else if (progress < 90) {
            statusText.textContent = 'Transferring data securely...';
        } else {
            statusText.textContent = 'Verifying data integrity...';
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                statusText.textContent = 'Synchronization completed successfully!';
                progressFill.style.background = 'linear-gradient(to right, var(--teal), var(--light-coral))';

                // Update last sync time
                const lastSyncElement = document.getElementById(`${hospitalId}-last-sync`);
                if (lastSyncElement) {
                    lastSyncElement.textContent = 'Just now';
                }

                // Hide progress after 3 seconds
                setTimeout(() => {
                    progressDiv.style.display = 'none';
                    progressFill.style.width = '0%';
                    progressFill.style.background = 'linear-gradient(to right, var(--teal), var(--light-coral))';
                }, 3000);
            }, 500);
        }
    }, 200);
}

function viewHospitalRecords(hospitalId) {
    showVoiceNotification(`Opening medical records for ${hospitalId.replace('-', ' ')}`);
    // In a real app, this would navigate to a records view
}

function disconnectHospital(hospitalId) {
    if (confirm(`Are you sure you want to disconnect from ${hospitalId.replace('-', ' ')}?`)) {
        showVoiceNotification(`Disconnected from ${hospitalId.replace('-', ' ')}`);
        // In a real app, this would update the hospital status
    }
}

function connectNewHospital() {
    showVoiceNotification('Opening hospital search and connection interface');
    // In a real app, this would open a modal or navigate to a search page
}

// Medical Records Access Functions
function accessRecords(recordType) {
    const recordNames = {
        'vitals': 'Vital Signs History',
        'medications': 'Medications & Prescriptions',
        'lab-results': 'Lab Results & Tests',
        'appointments': 'Appointments & Visits'
    };

    showVoiceNotification(`Accessing ${recordNames[recordType] || recordType}`);
    // In a real app, this would open the specific records view
}

// Appointment Functions
function scheduleAppointment() {
    showVoiceNotification('Opening appointment scheduling interface');
    // In a real app, this would open a scheduling modal
}

function rescheduleAppointment(appointmentId) {
    showVoiceNotification(`Opening reschedule options for ${appointmentId.replace('-', ' ')}`);
    // In a real app, this would open a reschedule modal
}

function cancelAppointment(appointmentId) {
    if (confirm(`Are you sure you want to cancel the ${appointmentId.replace('-', ' ')} appointment?`)) {
        showVoiceNotification(`Cancelled ${appointmentId.replace('-', ' ')} appointment`);
        // In a real app, this would update the appointment status
    }
}

// Update sync statistics periodically
function updateSyncStats() {
    const dataTransferred = document.getElementById('total-data-transferred');
    const successRate = document.getElementById('sync-success-rate');

    if (dataTransferred) {
        const currentGB = parseFloat(dataTransferred.textContent);
        const newGB = currentGB + (Math.random() * 0.1);
        dataTransferred.textContent = newGB.toFixed(1) + ' GB';
    }

    if (successRate) {
        const currentRate = parseFloat(successRate.textContent);
        const newRate = Math.max(99.5, currentRate + (Math.random() * 0.1 - 0.05));
        successRate.textContent = newRate.toFixed(1) + '%';
    }
}

// Update sync stats every 30 seconds
setInterval(updateSyncStats, 30000);

// Add holographic effect to all cards on hover
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (this.querySelector('.holographic-effect')) return;
        
        const effect = document.createElement('div');
        effect.className = 'holographic-effect';
        effect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(transparent, rgba(186, 223, 219, 0.1), transparent);
            pointer-events: none;
            z-index: 1;
            animation: hologramMove 1s linear;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('hologramKeyframes')) {
            const style = document.createElement('style');
            style.id = 'hologramKeyframes';
            style.textContent = `
                @keyframes hologramMove {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode === this) {
                this.removeChild(effect);
            }
        }, 1000);
    });
});

// AI Assistant Enhanced Features - Smart, Creative, and Assistive

// Proactive Health Alerts System
let activeAlerts = [];
let alertEscalationLevel = 0;







// Health Resources Functions
function openResource(resourceType) {
    const resources = {
        'heart-health': {
            title: 'Heart Health Guide',
            content: 'Comprehensive cardiovascular health information including diet, exercise, and monitoring tips.'
        },
        'mental-health': {
            title: 'Mental Wellness Resources',
            content: 'Information about maintaining mental health, stress management, and mindfulness practices.'
        },
        'nutrition': {
            title: 'Nutrition Guide',
            content: 'Evidence-based nutrition information, meal planning tips, and dietary recommendations.'
        },
        'fitness': {
            title: 'Fitness & Exercise Guide',
            content: 'Personalized exercise recommendations, workout plans, and active lifestyle tips.'
        }
    };

    const resource = resources[resourceType];
    if (resource) {
        showVoiceNotification(`Opening ${resource.title}`);
        // In a real app, this would open a detailed resource page
    }
}

function initializeAIAssistant() {
    console.log('Initializing enhanced AI Assistant...');
    setupProactiveAlerts();
    initializeDailyGoals();
    setupAIHealthCoach();
    initializeEmergencyHub();
    setupWellnessChallenges();
    initializeSmartInsights();
    startProactiveMonitoring();
}

function setupProactiveAlerts() {
    // Monitor health metrics and trigger smart alerts
    setInterval(() => {
        checkHealthAnomalies();
        escalateAlertsIfNeeded();
    }, 30000); // Check every 30 seconds
}

function checkHealthAnomalies() {
    const heartRate = parseInt(document.querySelector('.vitals-card .card-value')?.textContent || '72');
    const bpElement = document.querySelectorAll('.vitals-card .card-value')[1];
    const bp = bpElement ? bpElement.textContent.split('/') : ['128', '82'];

    // Smart anomaly detection
    if (heartRate > 100) {
        triggerSmartAlert('Elevated Heart Rate', `Heart rate at ${heartRate} bpm - consider resting`, 'warning', 2);
    }

    if (parseInt(bp[0]) > 140 || parseInt(bp[1]) > 90) {
        triggerSmartAlert('High Blood Pressure', `BP reading: ${bp[0]}/${bp[1]} - monitor closely`, 'critical', 3);
    }

    // Predictive alerts based on trends
    if (Math.random() > 0.95) { // Simulate predictive detection
        triggerSmartAlert('Preventive Alert', 'Based on your patterns, consider a wellness check tomorrow', 'info', 1);
    }
}

function triggerSmartAlert(title, message, severity, priority) {
    const alertId = Date.now();
    const alert = {
        id: alertId,
        title,
        message,
        severity,
        priority,
        timestamp: new Date(),
        escalated: false
    };

    activeAlerts.push(alert);
    displayProactiveAlert(alert);
    showVoiceNotification(`Alert: ${title} - ${message}`);

    // Auto-escalate critical alerts
    if (severity === 'critical') {
        setTimeout(() => escalateAlert(alertId), 300000); // 5 minutes
    }
}

function displayProactiveAlert(alert) {
    const alertsContainer = document.getElementById('proactive-alerts-container');
    if (!alertsContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `proactive-alert ${alert.severity}`;
    alertDiv.id = `alert-${alert.id}`;

    alertDiv.innerHTML = `
        <div class="alert-header">
            <i class="fas fa-exclamation-${alert.severity === 'critical' ? 'triangle' : 'circle'}"></i>
            <h4>${alert.title}</h4>
            <span class="alert-time">${alert.timestamp.toLocaleTimeString()}</span>
        </div>
        <p>${alert.message}</p>
        <div class="alert-actions">
            <button onclick="dismissAlert(${alert.id})" class="alert-btn dismiss">Dismiss</button>
            <button onclick="takeAction(${alert.id})" class="alert-btn action">Take Action</button>
        </div>
    `;

    alertsContainer.insertBefore(alertDiv, alertsContainer.firstChild);

    // Auto-remove after 10 minutes if not critical
    if (alert.severity !== 'critical') {
        setTimeout(() => {
            if (document.getElementById(`alert-${alert.id}`)) {
                dismissAlert(alert.id);
            }
        }, 600000);
    }
}

function dismissAlert(alertId) {
    const alertDiv = document.getElementById(`alert-${alert.id}`);
    if (alertDiv) {
        alertDiv.remove();
    }
    activeAlerts = activeAlerts.filter(alert => alert.id !== alertId);
}

function takeAction(alertId) {
    const alert = activeAlerts.find(a => a.id === alertId);
    if (alert) {
        showVoiceNotification(`Taking action for: ${alert.title}`);
        // Implement specific actions based on alert type
        dismissAlert(alertId);
    }
}

function escalateAlertsIfNeeded() {
    const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical' && !alert.escalated);
    if (criticalAlerts.length > 0) {
        alertEscalationLevel++;
        if (alertEscalationLevel >= 3) {
            triggerEmergencyProtocol();
        }
    }
}

function escalateAlert(alertId) {
    const alert = activeAlerts.find(a => a.id === alertId);
    if (alert && !alert.escalated) {
        alert.escalated = true;
        alert.severity = 'critical';
        showVoiceNotification('CRITICAL ALERT ESCALATED - Emergency contacts notified');
        updateAlertDisplay(alert);
    }
}

function updateAlertDisplay(alert) {
    const alertDiv = document.getElementById(`alert-${alert.id}`);
    if (alertDiv) {
        alertDiv.className = `proactive-alert ${alert.severity}`;
        const icon = alertDiv.querySelector('i');
        if (icon) {
            icon.className = `fas fa-exclamation-${alert.severity === 'critical' ? 'triangle' : 'circle'}`;
        }
    }
}

// Daily Health Goals System
let dailyGoals = {
    steps: { target: 10000, current: 8542, unit: 'steps' },
    water: { target: 8, current: 5, unit: 'glasses' },
    exercise: { target: 30, current: 15, unit: 'minutes' },
    sleep: { target: 8, current: 7.2, unit: 'hours' }
};

function initializeDailyGoals() {
    updateGoalsDisplay();
    setInterval(() => {
        updateGoalProgress();
        checkGoalAchievements();
    }, 60000); // Update every minute
}

function updateGoalsDisplay() {
    const goalsContainer = document.getElementById('daily-goals-container');
    if (!goalsContainer) return;

    goalsContainer.innerHTML = Object.entries(dailyGoals).map(([key, goal]) => `
        <div class="goal-item" id="goal-${key}">
            <div class="goal-header">
                <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                <span class="goal-progress">${goal.current}/${goal.target} ${goal.unit}</span>
            </div>
            <div class="goal-bar">
                <div class="goal-fill" style="width: ${(goal.current / goal.target * 100).toFixed(1)}%"></div>
            </div>
            <div class="goal-actions">
                <button onclick="adjustGoal('${key}', -1)" class="goal-btn">-</button>
                <button onclick="logProgress('${key}')" class="goal-btn log">Log</button>
                <button onclick="adjustGoal('${key}', 1)" class="goal-btn">+</button>
            </div>
        </div>
    `).join('');
}

function updateGoalProgress() {
    // Simulate progress updates
    if (Math.random() > 0.7) {
        dailyGoals.steps.current += Math.floor(Math.random() * 100);
        if (dailyGoals.steps.current > dailyGoals.steps.target) {
            dailyGoals.steps.current = dailyGoals.steps.target;
        }
    }

    if (Math.random() > 0.8) {
        dailyGoals.exercise.current += Math.floor(Math.random() * 5);
        if (dailyGoals.exercise.current > dailyGoals.exercise.target) {
            dailyGoals.exercise.current = dailyGoals.exercise.target;
        }
    }

    updateGoalsDisplay();
}

function checkGoalAchievements() {
    Object.entries(dailyGoals).forEach(([key, goal]) => {
        if (goal.current >= goal.target && !goal.achieved) {
            goal.achieved = true;
            celebrateAchievement(key);
        }
    });
}

function celebrateAchievement(goalType) {
    showVoiceNotification(`Congratulations! You've achieved your ${goalType} goal today! 🎉`);
    triggerHolographicCelebration();
}

function adjustGoal(goalType, adjustment) {
    const goal = dailyGoals[goalType];
    goal.target = Math.max(1, goal.target + adjustment);
    updateGoalsDisplay();
}

function logProgress(goalType) {
    const goal = dailyGoals[goalType];
    const increment = goalType === 'water' ? 1 : goalType === 'exercise' ? 5 : 100;
    goal.current = Math.min(goal.target, goal.current + increment);
    updateGoalsDisplay();
    showVoiceNotification(`Progress logged for ${goalType}`);
}

// AI Health Coach System
let coachingSession = null;
let coachingTimer = null;

function setupAIHealthCoach() {
    // Initialize coaching features
    console.log('AI Health Coach initialized');
}

function startCoachingSession(sessionType) {
    const sessions = {
        'breathing': {
            title: 'Breathing Exercise',
            duration: 5,
            steps: ['Find a comfortable position', 'Inhale deeply for 4 counts', 'Hold for 4 counts', 'Exhale for 4 counts', 'Repeat for 5 minutes']
        },
        'meditation': {
            title: 'Mindfulness Meditation',
            duration: 10,
            steps: ['Sit comfortably', 'Focus on your breath', 'Acknowledge thoughts without judgment', 'Return focus to breath', 'Continue for 10 minutes']
        },
        'stretching': {
            title: 'Quick Stretch Routine',
            duration: 7,
            steps: ['Neck rolls', 'Shoulder shrugs', 'Arm circles', 'Spinal twist', 'Leg stretches']
        }
    };

    coachingSession = sessions[sessionType];
    if (coachingSession) {
        showVoiceNotification(`Starting ${coachingSession.title} session`);
        startGuidedSession();
    }
}

function startGuidedSession() {
    let stepIndex = 0;
    const steps = coachingSession.steps;

    coachingTimer = setInterval(() => {
        if (stepIndex < steps.length) {
            showVoiceNotification(steps[stepIndex]);
            stepIndex++;
        } else {
            clearInterval(coachingTimer);
            showVoiceNotification(`Great job completing ${coachingSession.title}! How do you feel?`);
            coachingSession = null;
        }
    }, 10000); // 10 seconds per step
}

function stopCoachingSession() {
    if (coachingTimer) {
        clearInterval(coachingTimer);
        coachingTimer = null;
        showVoiceNotification('Coaching session paused');
    }
}

// Emergency Response Hub
function initializeEmergencyHub() {
    // Setup emergency features
    console.log('Emergency Response Hub initialized');
}

function triggerEmergencyProtocol() {
    showVoiceNotification('EMERGENCY PROTOCOL ACTIVATED - Notifying emergency contacts');
    // In a real app, this would trigger actual emergency response
    alert('EMERGENCY ALERT: Emergency contacts have been notified. Stay calm and follow safety protocols.');
}

function accessEmergencyContacts() {
    showVoiceNotification('Accessing emergency contact information');
    // Would display emergency contact modal
}

function startEmergencyTimer() {
    let countdown = 60;
    const timer = setInterval(() => {
        showVoiceNotification(`Emergency response in ${countdown} seconds`);
        countdown--;
        if (countdown <= 0) {
            clearInterval(timer);
            triggerEmergencyProtocol();
        }
    }, 1000);
}

// Wellness Challenges System
let activeChallenges = [];
let challengePoints = 0;

function setupWellnessChallenges() {
    // Initialize challenge system
    loadDefaultChallenges();
}

function loadDefaultChallenges() {
    const challenges = [
        {
            id: 'hydration-hero',
            title: 'Hydration Hero',
            description: 'Drink 8 glasses of water daily for 7 days',
            duration: 7,
            reward: 100,
            progress: 0,
            target: 7
        },
        {
            id: 'step-master',
            title: 'Step Master',
            description: 'Walk 10,000 steps daily for 5 days',
            duration: 5,
            reward: 150,
            progress: 0,
            target: 5
        },
        {
            id: 'sleep-champion',
            title: 'Sleep Champion',
            description: 'Get 8 hours of sleep for 3 nights',
            duration: 3,
            reward: 75,
            progress: 0,
            target: 3
        }
    ];

    activeChallenges = challenges;
    updateChallengesDisplay();
}

function updateChallengesDisplay() {
    const challengesContainer = document.getElementById('challenges-container');
    if (!challengesContainer) return;

    challengesContainer.innerHTML = activeChallenges.map(challenge => `
        <div class="challenge-item" id="challenge-${challenge.id}">
            <div class="challenge-header">
                <h4>${challenge.title}</h4>
                <span class="challenge-reward">${challenge.reward} pts</span>
            </div>
            <p>${challenge.description}</p>
            <div class="challenge-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(challenge.progress / challenge.target * 100)}%"></div>
                </div>
                <span class="progress-text">${challenge.progress}/${challenge.target}</span>
            </div>
            <button onclick="joinChallenge('${challenge.id}')" class="challenge-btn">
                ${challenge.progress > 0 ? 'Continue' : 'Join Challenge'}
            </button>
        </div>
    `).join('');
}

function joinChallenge(challengeId) {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (challenge) {
        showVoiceNotification(`Joined ${challenge.title} challenge! Let's achieve your health goals together.`);
        // In a real app, this would track actual progress
    }
}

function completeChallenge(challengeId) {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (challenge && challenge.progress >= challenge.target) {
        challengePoints += challenge.reward;
        showVoiceNotification(`Challenge completed! Earned ${challenge.reward} points. Total: ${challengePoints}`);
        triggerHolographicCelebration();
        // Remove completed challenge
        activeChallenges = activeChallenges.filter(c => c.id !== challengeId);
        updateChallengesDisplay();
    }
}

// Smart Health Insights
function initializeSmartInsights() {
    // Initialize predictive analytics
    setInterval(() => {
        generateSmartInsights();
    }, 300000); // Every 5 minutes
}

function generateSmartInsights() {
    const insights = [
        "Based on your activity patterns, you're most productive between 9-11 AM",
        "Your sleep quality improves by 15% on days with morning exercise",
        "Hydration levels correlate with 20% better focus throughout the day",
        "Stress levels decrease by 25% after 20-minute meditation sessions"
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    displaySmartInsight(randomInsight);
}

function displaySmartInsight(insight) {
    const insightsContainer = document.getElementById('smart-insights-container');
    if (!insightsContainer) return;

    const insightDiv = document.createElement('div');
    insightDiv.className = 'smart-insight';
    insightDiv.innerHTML = `
        <i class="fas fa-lightbulb"></i>
        <p>${insight}</p>
        <span class="insight-time">Just now</span>
    `;

    insightsContainer.insertBefore(insightDiv, insightsContainer.firstChild);

    // Remove after 1 hour
    setTimeout(() => {
        if (insightDiv.parentNode) {
            insightDiv.remove();
        }
    }, 3600000);
}

// Proactive Monitoring System
function startProactiveMonitoring() {
    setInterval(() => {
        analyzeHealthPatterns();
        provideProactiveSuggestions();
    }, 600000); // Every 10 minutes
}

function analyzeHealthPatterns() {
    // Analyze trends and predict potential issues
    const patterns = {
        'sleep': Math.random() > 0.8 ? 'declining' : 'stable',
        'activity': Math.random() > 0.9 ? 'increasing' : 'stable',
        'stress': Math.random() > 0.7 ? 'elevated' : 'normal'
    };

    if (patterns.sleep === 'declining') {
        triggerSmartAlert('Sleep Pattern Alert', 'Sleep quality trending downward - consider adjusting bedtime routine', 'warning', 2);
    }

    if (patterns.stress === 'elevated') {
        provideProactiveSuggestion('stress-relief', 'Consider a 10-minute breathing exercise to reduce stress levels');
    }
}

function provideProactiveSuggestions() {
    const suggestions = [
        { type: 'hydration', message: 'Time for your next water break - stay hydrated!' },
        { type: 'movement', message: 'Stand up and stretch - it\'s been 45 minutes since your last movement' },
        { type: 'mindfulness', message: 'Take a mindful moment - focus on your breathing for 1 minute' }
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    if (Math.random() > 0.8) { // 20% chance every 10 minutes
        showVoiceNotification(randomSuggestion.message);
    }
}

function provideProactiveSuggestion(type, message) {
    showVoiceNotification(message);
    // Could also display in UI
}

// Holographic Celebrations
function triggerHolographicCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'holographic-celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <i class="fas fa-trophy"></i>
            <h3>Achievement Unlocked!</h3>
            <div class="celebration-particles"></div>
        </div>
    `;

    document.body.appendChild(celebration);

    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.remove();
        }
    }, 3000);
}

// Smartwatch Connection Modal Functions
function showConnectionModal() {
    const modal = document.getElementById('connectionModal');
    if (modal) {
        modal.style.display = 'flex';
        // Add overlay to block the website
        document.body.style.overflow = 'hidden';
        document.getElementById('container').style.opacity = '0.4';
        document.getElementById('container').style.pointerEvents = 'none';
    }
}

function hideConnectionModal() {
    const modal = document.getElementById('connectionModal');
    if (modal) {
        modal.style.display = 'none';
        // Restore website visibility
        document.body.style.overflow = 'auto';
        document.getElementById('container').style.opacity = '1';
        document.getElementById('container').style.pointerEvents = 'auto';
        // Save connection status
        localStorage.setItem('smartwatchConnected', 'true');
        showVoiceNotification('Smartwatch connected successfully! Welcome to NeoHealth.');
    }
}

function connectSmartwatch() {
    const connectBtn = document.getElementById('connectBtn');
    const progressDiv = document.getElementById('connectionProgress');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('progressText');

    connectBtn.style.display = 'none';
    progressDiv.style.display = 'block';
    progressFill.style.width = '0%';
    statusText.textContent = 'Initializing connection...';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;

        progressFill.style.width = progress + '%';

        if (progress < 25) {
            statusText.textContent = 'Searching for devices...';
        } else if (progress < 50) {
            statusText.textContent = 'Establishing Bluetooth connection...';
        } else if (progress < 75) {
            statusText.textContent = 'Syncing health data...';
        } else if (progress < 100) {
            statusText.textContent = 'Verifying connection...';
        } else {
            statusText.textContent = 'Connection successful!';
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                hideConnectionModal();
            }, 1000);
        }
    }, 300);
}

// Check if smartwatch is already connected on page load
document.addEventListener('DOMContentLoaded', function() {
    const isConnected = localStorage.getItem('smartwatchConnected');
    if (!isConnected) {
        // Show modal on first load if not connected
        setTimeout(() => {
            showConnectionModal();
        }, 1000);
    }
    initializeAIAssistant();
});


