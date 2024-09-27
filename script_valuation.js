// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register the Data Labels plugin with Chart.js
    Chart.register(ChartDataLabels);

    var chart;

    function displaySampleChart() {
        var sampleLabels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        var sampleData = [250000, 275000, 302500, 332750, 366025]; // Sample data
        document.getElementById('valuation-amount').innerText = '£' + parseFloat(sampleData[0]).toLocaleString();
        drawChart(sampleLabels, sampleData);
    }

    function drawChart(labels, data) {
        var ctx = document.getElementById('valuation-chart').getContext('2d');
        if (chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Estimated Business Value (£)',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        formatter: function(value, context) {
                            return '£' + parseFloat(value).toLocaleString();
                        },
                        color: '#000',
                        font: {
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '£' + context.parsed.y.toLocaleString();
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return '£' + value.toLocaleString();
                            }
                        },
                        beginAtZero: true
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // Display sample chart on page load
    displaySampleChart();

    document.getElementById('calculate-button').addEventListener('click', function() {
        // Get input values
        var operatingProfit = parseFloat(document.getElementById('operating-profit').value);
        var growthRate = parseFloat(document.getElementById('growth-rate').value) / 100;
        var growthYears = parseInt(document.getElementById('growth-years').value);
        if (isNaN(operatingProfit) || isNaN(growthRate) || isNaN(growthYears)) {
            alert("Please enter valid numbers in all fields.");
            return;
        }
        // Set valuation multiple (assumed at 5)
        var valuationMultiple = 5;
        var valuations = [];
        var labels = [];
        for (var t = 1; t <= growthYears; t++) {
            var futureProfit = operatingProfit * Math.pow(1 + growthRate, t - 1); // Start from Year 0
            var estimatedBusinessValue = futureProfit * valuationMultiple;
            valuations.push(estimatedBusinessValue.toFixed(2));
            labels.push('Year ' + t);
        }
        // Current valuation is the estimated business value in Year 1
        var currentBusinessValue = valuations[0];
        document.getElementById('valuation-amount').innerText = '£' + parseFloat(currentBusinessValue).toLocaleString();
        // Draw chart with actual data
        drawChart(labels, valuations);
    });

    document.getElementById('download-button').addEventListener('click', function() {
        if (!chart) {
            alert('Please calculate the valuation first.');
            return;
        }
        // Combine the chart and current valuation into one canvas
        var canvas = document.createElement('canvas');
        canvas.width = chart.width;
        canvas.height = chart.height + 50; // Extra space for the text
        var ctx = canvas.getContext('2d');
        // Draw the chart onto the new canvas
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(chart.canvas, 0, 50);
        // Add the current valuation text at the top
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        var valuationText = 'Current Value of Your Business: ' + document.getElementById('valuation-amount').innerText;
        ctx.fillText(valuationText, canvas.width / 2, 30);
        // Trigger download
        var link = document.createElement('a');
        link.download = 'business_valuation.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
