// Stock Market Tracer - Main JavaScript

// Mock Data for Stocks
const mockStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 1.24, changePercent: 0.70, volume: "45.2M", marketCap: "2.8T", sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 330.15, change: -2.35, changePercent: -0.71, volume: "28.7M", marketCap: "2.5T", sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.65, change: 0.85, changePercent: 0.60, volume: "32.1M", marketCap: "1.8T", sector: "Technology" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 154.50, change: 1.20, changePercent: 0.78, volume: "38.5M", marketCap: "1.6T", sector: "Consumer Cyclical" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 245.18, change: -5.42, changePercent: -2.16, volume: "102.3M", marketCap: "780B", sector: "Automotive" },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 481.40, change: 12.75, changePercent: 2.72, volume: "58.9M", marketCap: "1.2T", sector: "Technology" },
    { symbol: "META", name: "Meta Platforms Inc.", price: 310.85, change: 4.25, changePercent: 1.39, volume: "21.3M", marketCap: "795B", sector: "Technology" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 155.60, change: 0.45, changePercent: 0.29, volume: "15.8M", marketCap: "450B", sector: "Financial Services" },
    { symbol: "V", name: "Visa Inc.", price: 240.30, change: -1.20, changePercent: -0.50, volume: "12.4M", marketCap: "485B", sector: "Financial Services" },
    { symbol: "JNJ", name: "Johnson & Johnson", price: 162.75, change: 0.80, changePercent: 0.49, volume: "8.9M", marketCap: "430B", sector: "Healthcare" },
    { symbol: "WMT", name: "Walmart Inc.", price: 165.40, change: 0.60, changePercent: 0.36, volume: "10.2M", marketCap: "445B", sector: "Consumer Defensive" },
    { symbol: "PG", name: "Procter & Gamble Co.", price: 152.25, change: -0.35, changePercent: -0.23, volume: "7.8M", marketCap: "360B", sector: "Consumer Defensive" },
    { symbol: "NFLX", name: "Netflix Inc.", price: 485.25, change: 8.50, changePercent: 1.78, volume: "15.6M", marketCap: "210B", sector: "Communication Services" },
    { symbol: "DIS", name: "Walt Disney Co.", price: 89.75, change: -1.25, changePercent: -1.37, volume: "22.4M", marketCap: "165B", sector: "Communication Services" },
    { symbol: "AMD", name: "Advanced Micro Devices", price: 122.84, change: 3.15, changePercent: 2.63, volume: "45.8M", marketCap: "195B", sector: "Technology" },
    { symbol: "INTC", name: "Intel Corp.", price: 30.45, change: -0.85, changePercent: -2.72, volume: "68.9M", marketCap: "125B", sector: "Technology" },
    { symbol: "BA", name: "Boeing Co.", price: 215.60, change: 4.20, changePercent: 1.99, volume: "12.7M", marketCap: "135B", sector: "Industrials" },
    { symbol: "KO", name: "Coca-Cola Co.", price: 58.90, change: 0.35, changePercent: 0.60, volume: "18.5M", marketCap: "250B", sector: "Consumer Defensive" },
    { symbol: "PEP", name: "PepsiCo Inc.", price: 168.75, change: 1.85, changePercent: 1.11, volume: "9.2M", marketCap: "230B", sector: "Consumer Defensive" },
    { symbol: "MCD", name: "McDonald's Corp.", price: 265.40, change: -2.10, changePercent: -0.78, volume: "6.8M", marketCap: "190B", sector: "Consumer Cyclical" },
    { symbol: "NKE", name: "Nike Inc.", price: 95.20, change: 1.75, changePercent: 1.87, volume: "14.3M", marketCap: "155B", sector: "Consumer Cyclical" }
];

// Chart Data for Different Timeframes
const chartData = {
    "AAPL": {
        "1D": Array.from({length: 24}, (_, i) => ({ x: i, y: 175 + Math.random() * 8, volume: 1000000 + Math.random() * 5000000 })),
        "1W": Array.from({length: 7}, (_, i) => ({ x: i, y: 170 + Math.random() * 12, volume: 5000000 + Math.random() * 10000000 })),
        "1M": Array.from({length: 30}, (_, i) => ({ x: i, y: 165 + Math.random() * 20, volume: 10000000 + Math.random() * 20000000 })),
        "1Y": Array.from({length: 12}, (_, i) => ({ x: i, y: 140 + Math.random() * 40, volume: 20000000 + Math.random() * 30000000 }))
    },
    "MSFT": {
        "1D": Array.from({length: 24}, (_, i) => ({ x: i, y: 325 + Math.random() * 10, volume: 1500000 + Math.random() * 6000000 })),
        "1W": Array.from({length: 7}, (_, i) => ({ x: i, y: 320 + Math.random() * 15, volume: 6000000 + Math.random() * 12000000 })),
        "1M": Array.from({length: 30}, (_, i) => ({ x: i, y: 310 + Math.random() * 25, volume: 12000000 + Math.random() * 25000000 })),
        "1Y": Array.from({length: 12}, (_, i) => ({ x: i, y: 280 + Math.random() * 50, volume: 25000000 + Math.random() * 40000000 }))
    },
    // Add more stocks as needed
};

// Application State
const state = {
    stocks: [...mockStocks],
    watchlist: JSON.parse(localStorage.getItem('stockWatchlist')) || [],
    selectedStock: 'AAPL',
    selectedTimeframe: '1D',
    theme: localStorage.getItem('stockTheme') || 'light',
    lastUpdate: new Date(),
    updateInterval: null
};

// DOM Elements
const elements = {
    stocksContainer: document.getElementById('stocks-container'),
    watchlistContainer: document.getElementById('watchlist-container'),
    watchlistCount: document.getElementById('watchlist-count'),
    stockSearch: document.getElementById('stock-search'),
    autocompleteResults: document.getElementById('autocomplete-results'),
    themeToggle: document.getElementById('theme-toggle'),
    refreshButton: document.getElementById('refresh-data'),
    selectedStockName: document.getElementById('selected-stock-name'),
    selectedStockPrice: document.getElementById('selected-stock-price'),
    selectedStockChange: document.getElementById('selected-stock-change'),
    chartCanvas: document.getElementById('stock-chart'),
    chartTooltip: document.getElementById('chart-tooltip'),
    topGainers: document.getElementById('top-gainers'),
    topLosers: document.getElementById('top-losers'),
    volumeLeaders: document.getElementById('volume-leaders'),
    marketStatus: document.getElementById('market-status'),
    lastUpdated: document.getElementById('last-updated'),
    apiStatusText: document.getElementById('api-status-text'),
    networkCanvas: document.getElementById('network-canvas'),
    rippleContainer: document.getElementById('ripple-container'),
    notificationContainer: document.getElementById('notification-container')
};

// Initialize Application
function init() {
    // Set initial theme
    setTheme(state.theme);
    
    // Render initial data
    renderStocks();
    renderWatchlist();
    renderMarketOverview();
    initChart();
    initBlockchainNetwork();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start data updates
    startDataUpdates();
    
    // Update timestamp
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
}

// Set theme (light/dark)
function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('stockTheme', theme);
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Toggle theme
function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Create ripple effect
    createRippleEffect(elements.themeToggle, 20);
}

// Render stock cards
function renderStocks() {
    elements.stocksContainer.innerHTML = '';
    
    state.stocks.forEach(stock => {
        const isInWatchlist = state.watchlist.some(item => item.symbol === stock.symbol);
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        const stockCard = document.createElement('div');
        stockCard.className = 'stock-card fade-in';
        stockCard.dataset.symbol = stock.symbol;
        stockCard.innerHTML = `
            <button class="add-watchlist ${isInWatchlist ? 'in-watchlist' : ''}" data-symbol="${stock.symbol}">
                <i class="fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}"></i>
            </button>
            <div class="stock-card-header">
                <div>
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-change ${changeClass}">
                    <i class="fas ${changeIcon}"></i>
                    ${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
                </div>
            </div>
            <div class="stock-price">$${stock.price.toFixed(2)}</div>
            <div class="stock-meta">
                <span>Vol: ${stock.volume}</span>
                <span>${stock.sector}</span>
            </div>
        `;
        
        // Add click event to select stock
        stockCard.addEventListener('click', (e) => {
            if (!e.target.closest('.add-watchlist')) {
                selectStock(stock.symbol);
                createRippleEffect(e.target, 50);

                // Scroll to top of page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        elements.stocksContainer.appendChild(stockCard);
    });
    
    // Add event listeners to watchlist buttons
    document.querySelectorAll('.add-watchlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const symbol = button.dataset.symbol;
            toggleWatchlist(symbol);
            createRippleEffect(button, 20);
        });
    });
}

// Render watchlist
function renderWatchlist() {
    elements.watchlistContainer.innerHTML = '';

    if (state.watchlist.length === 0) {
        elements.watchlistContainer.innerHTML = `
            <div class="empty-watchlist" id="empty-watchlist-btn">
                <p>Add stocks to your watchlist</p>
                <button class="plus-button">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;

        // Add event listener to the newly created element
        const emptyWatchlistBtn = document.getElementById('empty-watchlist-btn');
        if (emptyWatchlistBtn) {
            emptyWatchlistBtn.addEventListener('click', () => {
                const liveMarketSection = document.getElementById('live-market');
                if (liveMarketSection) {
                    liveMarketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    createRippleEffect(emptyWatchlistBtn, 50);
                }
            });
        }
    } else {
        state.watchlist.forEach((item, index) => {
            const stock = state.stocks.find(s => s.symbol === item.symbol) || item;
            const changeClass = stock.change >= 0 ? 'positive' : 'negative';
            const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';

            const watchlistItem = document.createElement('div');
            watchlistItem.className = 'watchlist-item';
            watchlistItem.draggable = true;
            watchlistItem.dataset.index = index;
            watchlistItem.dataset.symbol = stock.symbol;
            watchlistItem.innerHTML = `
                <button class="remove-watchlist" data-symbol="${stock.symbol}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="watchlist-item-header">
                    <div class="watchlist-symbol">${stock.symbol}</div>
                    <div class="watchlist-price">$${stock.price.toFixed(2)}</div>
                </div>
                <div class="watchlist-name">${stock.name}</div>
                <div class="watchlist-change ${changeClass}">
                    <i class="fas ${changeIcon}"></i>
                    ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
                </div>
            `;

            // Add drag and drop events
            watchlistItem.addEventListener('dragstart', handleDragStart);
            watchlistItem.addEventListener('dragover', handleDragOver);
            watchlistItem.addEventListener('drop', handleDrop);
            watchlistItem.addEventListener('dragend', handleDragEnd);

            // Add click event to select stock
            watchlistItem.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-watchlist')) {
                    selectStock(stock.symbol);
                    createRippleEffect(e.target, 30);
                }
            });

            // Add remove event
            watchlistItem.querySelector('.remove-watchlist').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromWatchlist(stock.symbol);
                createRippleEffect(e.target, 15);
            });

            elements.watchlistContainer.appendChild(watchlistItem);
        });

        // Enable drag and drop for the container
        elements.watchlistContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        elements.watchlistContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = state.watchlist.length; // Append to end

            if (!isNaN(fromIndex)) {
                moveWatchlistItem(fromIndex, toIndex);
            }
        });
    }

    // Update watchlist count
    elements.watchlistCount.textContent = `${state.watchlist.length} ${state.watchlist.length === 1 ? 'stock' : 'stocks'}`;
}

// Drag and Drop Functions
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.index);
    setTimeout(() => {
        this.classList.add('dragging');
    }, 0);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(elements.watchlistContainer, e.clientY);
    const draggable = document.querySelector('.dragging');
    
    if (afterElement == null) {
        elements.watchlistContainer.appendChild(draggable);
    } else {
        elements.watchlistContainer.insertBefore(draggable, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const afterElement = getDragAfterElement(elements.watchlistContainer, e.clientY);
    
    let toIndex;
    if (afterElement == null) {
        toIndex = state.watchlist.length;
    } else {
        toIndex = parseInt(afterElement.dataset.index);
    }
    
    if (!isNaN(fromIndex) && !isNaN(toIndex) && fromIndex !== toIndex) {
        moveWatchlistItem(fromIndex, toIndex);
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    
    // Update all item indices
    document.querySelectorAll('.watchlist-item').forEach((item, index) => {
        item.dataset.index = index;
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.watchlist-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function moveWatchlistItem(fromIndex, toIndex) {
    const item = state.watchlist[fromIndex];
    state.watchlist.splice(fromIndex, 1);
    state.watchlist.splice(toIndex, 0, item);
    saveWatchlist();
    renderWatchlist();
}

// Toggle stock in watchlist
function toggleWatchlist(symbol) {
    const index = state.watchlist.findIndex(item => item.symbol === symbol);

    if (index === -1) {
        // Add to watchlist
        const stock = state.stocks.find(s => s.symbol === symbol);
        if (stock) {
            state.watchlist.push({ symbol: stock.symbol, name: stock.name });
            saveWatchlist();
            renderWatchlist();

            // Show notification
            showNotification(`${stock.name} is added`);

            // Update the watchlist button
            const button = document.querySelector(`.add-watchlist[data-symbol="${symbol}"]`);
            if (button) {
                button.classList.add('in-watchlist');
                button.innerHTML = '<i class="fas fa-check"></i>';
            }
        }
    } else {
        // Remove from watchlist
        removeFromWatchlist(symbol);
    }
}

// Remove stock from watchlist
function removeFromWatchlist(symbol) {
    state.watchlist = state.watchlist.filter(item => item.symbol !== symbol);
    saveWatchlist();
    renderWatchlist();
    
    // Update the watchlist button
    const button = document.querySelector(`.add-watchlist[data-symbol="${symbol}"]`);
    if (button) {
        button.classList.remove('in-watchlist');
        button.innerHTML = '<i class="fas fa-plus"></i>';
    }
}

// Save watchlist to localStorage
function saveWatchlist() {
    localStorage.setItem('stockWatchlist', JSON.stringify(state.watchlist));
}

// Select a stock to display in chart
function selectStock(symbol) {
    state.selectedStock = symbol;
    const stock = state.stocks.find(s => s.symbol === symbol);
    
    if (stock) {
        elements.selectedStockName.textContent = `${stock.name} (${stock.symbol})`;
        elements.selectedStockPrice.textContent = `$${stock.price.toFixed(2)}`;
        
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        elements.selectedStockChange.textContent = `${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
        elements.selectedStockChange.className = `change ${changeClass}`;
        elements.selectedStockChange.innerHTML = `<i class="fas ${changeIcon}"></i> ${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
        
        updateChart();
    }
}

// Initialize chart
function initChart() {
    const ctx = elements.chartCanvas.getContext('2d');
    
    // Set chart dimensions
    elements.chartCanvas.width = elements.chartCanvas.offsetWidth;
    elements.chartCanvas.height = elements.chartCanvas.offsetHeight;
    
    // Initial chart render
    updateChart();
    
    // Add mouse move event for tooltip
    elements.chartCanvas.addEventListener('mousemove', handleChartHover);
    elements.chartCanvas.addEventListener('mouseleave', () => {
        elements.chartTooltip.style.opacity = '0';
    });
}

// Update chart with selected stock and timeframe
function updateChart() {
    const ctx = elements.chartCanvas.getContext('2d');
    const width = elements.chartCanvas.width;
    const height = elements.chartCanvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get chart data
    const data = getChartData(state.selectedStock, state.selectedTimeframe);
    if (!data || data.length === 0) return;
    
    // Calculate chart dimensions
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Find min and max values
    const values = data.map(d => d.y);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    
    // Draw grid
    ctx.strokeStyle = state.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const horizontalLines = 5;
    for (let i = 0; i <= horizontalLines; i++) {
        const y = padding + (chartHeight / horizontalLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Draw value labels
        const value = maxValue - (valueRange / horizontalLines) * i;
        ctx.fillStyle = state.theme === 'dark' ? '#CCCCCC' : '#666666';
        ctx.font = '10px Roboto Mono';
        ctx.textAlign = 'right';
        ctx.fillText(`$${value.toFixed(2)}`, padding - 5, y + 3);
    }
    
    // Vertical grid lines
    const dataPoints = data.length;
    const verticalSpacing = chartWidth / (dataPoints - 1);
    
    for (let i = 0; i < dataPoints; i++) {
        const x = padding + i * verticalSpacing;
        
        // Draw vertical line for significant points
        if (i % Math.ceil(dataPoints / 5) === 0) {
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
            
            // Draw time labels
            ctx.fillStyle = state.theme === 'dark' ? '#CCCCCC' : '#666666';
            ctx.font = '10px Roboto Mono';
            ctx.textAlign = 'center';
            
            let label = '';
            if (state.selectedTimeframe === '1D') {
                label = `${i}:00`;
            } else if (state.selectedTimeframe === '1W') {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                label = days[i % 7];
            } else if (state.selectedTimeframe === '1M') {
                label = `Day ${i + 1}`;
            } else if (state.selectedTimeframe === '1Y') {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                label = months[i % 12];
            }
            
            ctx.fillText(label, x, height - padding + 15);
        }
    }
    
    // Draw chart line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = state.stocks.find(s => s.symbol === state.selectedStock)?.change >= 0 ? '#10B981' : '#EF4444';
    
    data.forEach((point, i) => {
        const x = padding + i * verticalSpacing;
        const y = padding + chartHeight - ((point.y - minValue) / valueRange) * chartHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    data.forEach((point, i) => {
        const x = padding + i * verticalSpacing;
        const y = padding + chartHeight - ((point.y - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = state.theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = state.stocks.find(s => s.symbol === state.selectedStock)?.change >= 0 ? '#10B981' : '#EF4444';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw chart border
    ctx.strokeStyle = state.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, chartWidth, chartHeight);
}

// Get chart data for stock and timeframe
function getChartData(symbol, timeframe) {
    if (chartData[symbol] && chartData[symbol][timeframe]) {
        return chartData[symbol][timeframe];
    }
    
    // Fallback: generate random data
    const pointCount = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 12;
    const basePrice = state.stocks.find(s => s.symbol === symbol)?.price || 100;
    
    return Array.from({length: pointCount}, (_, i) => ({
        x: i,
        y: basePrice - 10 + Math.random() * 20,
        volume: 1000000 + Math.random() * 5000000
    }));
}

// Handle chart hover for tooltip
function handleChartHover(e) {
    const rect = elements.chartCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const data = getChartData(state.selectedStock, state.selectedTimeframe);
    if (!data || data.length === 0) return;
    
    const padding = 40;
    const chartWidth = elements.chartCanvas.width - 2 * padding;
    const verticalSpacing = chartWidth / (data.length - 1);
    
    const dataIndex = Math.min(Math.max(Math.round((x - padding) / verticalSpacing), 0), data.length - 1);
    const point = data[dataIndex];
    
    // Calculate position for tooltip
    const values = data.map(d => d.y);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    const chartHeight = elements.chartCanvas.height - 2 * padding;
    
    const pointY = padding + chartHeight - ((point.y - minValue) / valueRange) * chartHeight;
    const pointX = padding + dataIndex * verticalSpacing;
    
    // Update tooltip content and position
    let dateText = '';
    if (state.selectedTimeframe === '1D') {
        dateText = `${dataIndex}:00`;
    } else if (state.selectedTimeframe === '1W') {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        dateText = days[dataIndex % 7];
    } else if (state.selectedTimeframe === '1M') {
        dateText = `Day ${dataIndex + 1}`;
    } else if (state.selectedTimeframe === '1Y') {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        dateText = months[dataIndex % 12];
    }
    
    elements.chartTooltip.innerHTML = `
        <div><strong>${dateText}</strong></div>
        <div>Price: <strong>$${point.y.toFixed(2)}</strong></div>
        <div>Volume: <strong>${formatVolume(point.volume)}</strong></div>
    `;
    
    // Position tooltip
    const tooltipWidth = elements.chartTooltip.offsetWidth;
    const tooltipHeight = elements.chartTooltip.offsetHeight;
    
    let tooltipX = pointX - tooltipWidth / 2;
    let tooltipY = pointY - tooltipHeight - 10;
    
    // Adjust if tooltip goes off screen
    if (tooltipX < 10) tooltipX = 10;
    if (tooltipX + tooltipWidth > rect.width - 10) tooltipX = rect.width - tooltipWidth - 10;
    if (tooltipY < 10) tooltipY = pointY + 20;
    
    elements.chartTooltip.style.left = `${tooltipX}px`;
    elements.chartTooltip.style.top = `${tooltipY}px`;
    elements.chartTooltip.style.opacity = '1';
}

// Render market overview
function renderMarketOverview() {
    // Top Gainers
    const gainers = [...state.stocks]
        .filter(s => s.change >= 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 5);
    
    elements.topGainers.innerHTML = '';
    gainers.forEach(stock => {
        const item = document.createElement('div');
        item.className = 'overview-item';
        item.innerHTML = `
            <span class="overview-symbol">${stock.symbol}</span>
            <span class="overview-price">$${stock.price.toFixed(2)}</span>
            <span class="overview-change positive">+${stock.changePercent.toFixed(2)}%</span>
        `;
        elements.topGainers.appendChild(item);
    });
    
    // Top Losers
    const losers = [...state.stocks]
        .filter(s => s.change < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 5);
    
    elements.topLosers.innerHTML = '';
    losers.forEach(stock => {
        const item = document.createElement('div');
        item.className = 'overview-item';
        item.innerHTML = `
            <span class="overview-symbol">${stock.symbol}</span>
            <span class="overview-price">$${stock.price.toFixed(2)}</span>
            <span class="overview-change negative">${stock.changePercent.toFixed(2)}%</span>
        `;
        elements.topLosers.appendChild(item);
    });
    
    // Volume Leaders
    const volumeLeaders = [...state.stocks]
        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
        .slice(0, 5);
    
    elements.volumeLeaders.innerHTML = '';
    volumeLeaders.forEach(stock => {
        const item = document.createElement('div');
        item.className = 'overview-item';
        item.innerHTML = `
            <span class="overview-symbol">${stock.symbol}</span>
            <span class="overview-price">$${stock.price.toFixed(2)}</span>
            <span>${stock.volume}</span>
        `;
        elements.volumeLeaders.appendChild(item);
    });
}

// Update stock prices (mock simulation)
function updateStockPrices() {
    state.stocks.forEach(stock => {
        // Simulate price changes
        const change = (Math.random() - 0.5) * 4;
        const newPrice = stock.price + change;
        const newChange = stock.change + (Math.random() - 0.5) * 0.5;
        const newChangePercent = (newChange / stock.price) * 100;
        
        // Update stock with animation
        const oldPrice = stock.price;
        stock.price = parseFloat(newPrice.toFixed(2));
        stock.change = parseFloat(newChange.toFixed(2));
        stock.changePercent = parseFloat(newChangePercent.toFixed(2));
        
        // Animate price update on card
        const card = document.querySelector(`.stock-card[data-symbol="${stock.symbol}"]`);
        if (card) {
            const priceElement = card.querySelector('.stock-price');
            const changeElement = card.querySelector('.stock-change');
            
            if (priceElement) {
                // Add animation class
                if (stock.price > oldPrice) {
                    card.classList.add('price-update');
                    setTimeout(() => card.classList.remove('price-update'), 800);
                } else if (stock.price < oldPrice) {
                    card.classList.add('price-downdate');
                    setTimeout(() => card.classList.remove('price-downdate'), 800);
                }
                
                // Update price with counting animation
                animateValue(priceElement, oldPrice, stock.price, 500, '$');
                
                // Update change
                const changeClass = stock.change >= 0 ? 'positive' : 'negative';
                const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                changeElement.className = `stock-change ${changeClass}`;
                changeElement.innerHTML = `<i class="fas ${changeIcon}"></i> ${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
            }
        }
        
        // Update watchlist if stock is in watchlist
        const watchlistItem = document.querySelector(`.watchlist-item[data-symbol="${stock.symbol}"]`);
        if (watchlistItem) {
            const priceElement = watchlistItem.querySelector('.watchlist-price');
            const changeElement = watchlistItem.querySelector('.watchlist-change');
            
            if (priceElement) {
                animateValue(priceElement, oldPrice, stock.price, 500, '$');
                
                const changeClass = stock.change >= 0 ? 'positive' : 'negative';
                const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                changeElement.className = `watchlist-change ${changeClass}`;
                changeElement.innerHTML = `<i class="fas ${changeIcon}"></i> ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
            }
        }
        
        // Update selected stock if it's this stock
        if (state.selectedStock === stock.symbol) {
            elements.selectedStockPrice.textContent = `$${stock.price.toFixed(2)}`;
            
            const changeClass = stock.change >= 0 ? 'positive' : 'negative';
            const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            elements.selectedStockChange.textContent = `${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
            elements.selectedStockChange.className = `change ${changeClass}`;
            elements.selectedStockChange.innerHTML = `<i class="fas ${changeIcon}"></i> ${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
            
            updateChart();
        }
    });
    
    // Update market overview
    renderMarketOverview();
    
    // Update last update time
    state.lastUpdate = new Date();
    updateTimestamp();
}

// Animate value change
function animateValue(element, start, end, duration, prefix = '') {
    const startTime = performance.now();
    const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * progress;
        element.textContent = `${prefix}${currentValue.toFixed(2)}`;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    
    requestAnimationFrame(step);
}

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    elements.lastUpdated.innerHTML = `Last updated: <span>${dateString} ${timeString}</span>`;
}

// Start data updates
function startDataUpdates() {
    // Initial update
    updateStockPrices();
    
    // Set interval for updates
    state.updateInterval = setInterval(updateStockPrices, 10000); // Update every 10 seconds
    
    // Simulate API connection status
    setTimeout(() => {
        elements.apiStatusText.textContent = "Live Data Streaming";
        elements.marketStatus.classList.add('active');
    }, 1000);
}

// Refresh data manually
function refreshData() {
    // Add rotation animation to refresh button
    elements.refreshButton.classList.add('rotating');
    
    // Simulate API call delay
    setTimeout(() => {
        updateStockPrices();
        elements.refreshButton.classList.remove('rotating');
        
        // Create ripple effect
        createRippleEffect(elements.refreshButton, 30);
    }, 800);
}

// Search functionality with autocomplete
function setupSearch() {
    elements.stockSearch.addEventListener('input', function() {
        const query = this.value.trim().toUpperCase();
        
        if (query.length < 1) {
            elements.autocompleteResults.style.display = 'none';
            return;
        }
        
        // Filter stocks
        const results = state.stocks.filter(stock => 
            stock.symbol.includes(query) || stock.name.toUpperCase().includes(query)
        ).slice(0, 8);
        
        // Display results
        if (results.length > 0) {
            elements.autocompleteResults.innerHTML = results.map(stock => `
                <div class="autocomplete-item" data-symbol="${stock.symbol}">
                    <strong>${stock.symbol}</strong> - ${stock.name}
                    <div class="autocomplete-price">$${stock.price.toFixed(2)}</div>
                </div>
            `).join('');
            
            elements.autocompleteResults.style.display = 'block';
            
            // Add click events to autocomplete items
            elements.autocompleteResults.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    const symbol = item.dataset.symbol;
                    elements.stockSearch.value = '';
                    elements.autocompleteResults.style.display = 'none';
                    selectStock(symbol);
                    
                    // Scroll to the stock card
                    const card = document.querySelector(`.stock-card[data-symbol="${symbol}"]`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Highlight the card
                        card.style.boxShadow = '0 0 0 3px rgba(182, 176, 159, 0.5)';
                        setTimeout(() => card.style.boxShadow = '', 2000);
                    }
                });
            });
        } else {
            elements.autocompleteResults.style.display = 'none';
        }
    });
    
    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            elements.autocompleteResults.style.display = 'none';
        }
    });
    
    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
            e.preventDefault();
            elements.stockSearch.focus();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyD') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Setup timeframe selector
function setupTimeframeSelector() {
    document.querySelectorAll('.timeframe-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.timeframe-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected timeframe
            state.selectedTimeframe = this.dataset.timeframe;
            
            // Update chart
            updateChart();
            
            // Create ripple effect
            createRippleEffect(this, 20);
        });
    });
}

// Setup filters
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filter
            const filter = this.dataset.filter;
            applyStockFilter(filter);
            
            // Create ripple effect
            createRippleEffect(this, 20);
        });
    });
}

// Apply stock filter
function applyStockFilter(filter) {
    let filteredStocks = [...mockStocks];
    
    switch(filter) {
        case 'gainers':
            filteredStocks = filteredStocks.filter(s => s.change >= 0);
            break;
        case 'losers':
            filteredStocks = filteredStocks.filter(s => s.change < 0);
            break;
        case 'tech':
            filteredStocks = filteredStocks.filter(s => s.sector === 'Technology');
            break;
        default:
            // 'all' - show all stocks
            break;
    }
    
    state.stocks = filteredStocks;
    renderStocks();
}

// Initialize blockchain network visualization
function initBlockchainNetwork() {
    const canvas = elements.networkCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Network nodes
    const nodes = [];
    const connections = [];
    const nodeCount = 30;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 3,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.02
        });
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                connections.push({ node1: i, node2: j, distance: distance });
            }
        }
    }
    
    // Animation function
    function animateNetwork() {
        // Clear canvas with slight fade effect
        ctx.fillStyle = state.theme === 'dark' ? 'rgba(18, 18, 18, 0.05)' : 'rgba(242, 242, 242, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update nodes
        nodes.forEach(node => {
            // Move node
            node.x += node.speedX;
            node.y += node.speedY;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
            if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
            
            // Update pulse
            node.pulse += node.pulseSpeed;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = state.theme === 'dark' ? 'rgba(182, 176, 159, 0.8)' : 'rgba(182, 176, 159, 0.6)';
            ctx.fill();
            
            // Draw node glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 1.5 + 3, 0, Math.PI * 2);
            ctx.fillStyle = state.theme === 'dark' ? 'rgba(182, 176, 159, 0.2)' : 'rgba(182, 176, 159, 0.1)';
            ctx.fill();
        });
        
        // Draw connections
        connections.forEach(conn => {
            const node1 = nodes[conn.node1];
            const node2 = nodes[conn.node2];
            
            // Calculate current distance
            const dx = node1.x - node2.x;
            const dy = node1.y - node2.y;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Only draw if nodes are still close
            if (currentDistance < 200) {
                // Calculate opacity based on distance
                const opacity = 1 - (currentDistance / 200);
                
                // Draw connection line
                ctx.beginPath();
                ctx.moveTo(node1.x, node1.y);
                ctx.lineTo(node2.x, node2.y);
                ctx.strokeStyle = state.theme === 'dark' ? `rgba(182, 176, 159, ${opacity * 0.3})` : `rgba(182, 176, 159, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5 + Math.sin((node1.pulse + node2.pulse) / 2) * 0.3;
                ctx.stroke();
                
                // Draw data flow along connection
                const flowPos = (Date.now() / 1000) % 1;
                const flowX = node1.x + (node2.x - node1.x) * flowPos;
                const flowY = node1.y + (node2.y - node1.y) * flowPos;
                
                ctx.beginPath();
                ctx.arc(flowX, flowY, 1, 0, Math.PI * 2);
                ctx.fillStyle = state.theme === 'dark' ? 'rgba(182, 176, 159, 0.8)' : 'rgba(182, 176, 159, 0.6)';
                ctx.fill();
            }
        });
        
        requestAnimationFrame(animateNetwork);
    }
    
    // Start animation
    animateNetwork();
}

// Create ripple effect
function createRippleEffect(element, size) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
    ripple.classList.add('ripple');

    elements.rippleContainer.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    elements.notificationContainer.appendChild(notification);

    // Auto-remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3500); // 3.5 seconds total (3s animation + 0.5s buffer)
}

// Format volume for display
function formatVolume(volumeStr) {
    const volume = parseFloat(volumeStr);
    if (volume >= 1000000000) {
        return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
        return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
        return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
}

// Setup all event listeners
function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Search functionality
    setupSearch();

    // Timeframe selector
    setupTimeframeSelector();

    // Filters
    setupFilters();

    // Refresh button
    elements.refreshButton.addEventListener('click', refreshData);



    // Add ripple effect to clickable elements
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' ||
            e.target.classList.contains('stock-card') ||
            e.target.classList.contains('watchlist-item') ||
            e.target.classList.contains('overview-card')) {

            // Don't create ripple for very small elements
            const rect = e.target.getBoundingClientRect();
            if (rect.width > 10 && rect.height > 10) {
                createRippleEffect(e.target, Math.min(rect.width, rect.height) / 2);
            }
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);