// revenue chart

// Initialize chart variable
let myChart;

// Function to display the sample graph on page load
function displaySampleGraph() {
    const sampleLabels = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'];
    const sampleData = [50000, 52500, 55125, 57881.25, 60775.31, 63814.07];

    drawChart(sampleLabels, sampleData);
}

// Call the function to display the sample graph on page load
window.onload = function() {
    displaySampleGraph();

    // Pre-fill sample data in the input fields
    document.getElementById('currentRevenue').value = 50000;
    document.getElementById('revenuePeriod').value = 'monthly';
    document.getElementById('predictionPeriod').value = 5;
    document.getElementById('growthType').value = 'static';
    document.getElementById('growthRate').value = '5';
};

function calculateGrowth() {
    // Retrieve input values
    const currentRevenue = parseFloat(document.getElementById('currentRevenue').value);
    const revenuePeriod = document.getElementById('revenuePeriod').value;
    const predictionPeriod = parseInt(document.getElementById('predictionPeriod').value);
    const growthType = document.getElementById('growthType').value;
    const growthRatesInput = document.getElementById('growthRate').value;

    // Validate inputs
    if (isNaN(currentRevenue) || isNaN(predictionPeriod) || !growthRatesInput) {
        alert('Please fill in all required fields with valid data.');
        return;
    }

    // Parse growth rates
    let growthRates = growthRatesInput.split(',').map(rate => parseFloat(rate.trim()) / 100);
    if (growthType === 'static' && growthRates.length > 1) {
        alert('For static growth, please enter only one growth rate.');
        return;
    }
    if (growthType === 'dynamic' && growthRates.length !== predictionPeriod) {
        alert('For dynamic growth, please enter growth rates equal to the estimation length.');
        return;
    }

    // Initialize revenue array
    let revenues = [currentRevenue];

    // Calculate projected revenues
    for (let i = 1; i <= predictionPeriod; i++) {
        let lastRevenue = revenues[revenues.length - 1];
        let growthRate = growthType === 'static' ? growthRates[0] : growthRates[i - 1];
        let newRevenue = lastRevenue + (lastRevenue * growthRate);
        revenues.push(newRevenue);
    }

    // Prepare labels for the chart
    let labels = [];
    for (let i = 0; i <= predictionPeriod; i++) {
        labels.push(`£{revenuePeriod.charAt(0).toUpperCase()}£{revenuePeriod.slice(1)} £{i}`);
    }

    // Draw the chart
    drawChart(labels, revenues);
}

function drawChart(labels, data) {
    // Destroy existing chart if exists
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('growthChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Projected Revenue',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'rgba(41, 128, 185, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Revenue Growth Projection'
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: function(value, context) {
                        return '£' + value.toFixed(2);
                    },
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return '£' + value;
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function downloadChart() {
    if (!myChart) {
        alert('Please generate a chart before downloading.');
        return;
    }

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = myChart.toBase64Image();
    link.download = 'revenue_growth_chart.png';

    // Append the link, trigger click, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
