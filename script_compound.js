document.getElementById('calculateButton').addEventListener('click', calculate);
document.getElementById('downloadButton').addEventListener('click', downloadChart);
let chart;
// Sample data for initial graph
window.onload = function() {
    renderChart([1000, 1500, 2000, 2500, 3000], true);
};
function calculate() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const contributionAmount = parseFloat(document.getElementById('contributionAmount').value) || 0;
    const contributionFrequency = parseFloat(document.getElementById('contributionFrequency').value);
    const yearsOfGrowth = parseInt(document.getElementById('yearsOfGrowth').value) || 0;
    const rateOfReturn = parseFloat(document.getElementById('rateOfReturn').value) / 100;
    const compoundFrequency = parseFloat(document.getElementById('compoundFrequency').value);
    const totalPeriods = yearsOfGrowth * compoundFrequency;
    const periodicRate = rateOfReturn / compoundFrequency;
    let balances = [];
    let totalInvestment = initialDeposit;
    let balance = initialDeposit;
    for (let year = 1; year <= yearsOfGrowth; year++) {
        for (let period = 0; period < compoundFrequency; period++) {
            // Add contributions at the specified frequency
            if ((period % (compoundFrequency / contributionFrequency)) === 0) {
                balance += contributionAmount;
                totalInvestment += contributionAmount;
            }
            // Apply interest
            balance += balance * periodicRate;
        }
        balances.push(balance.toFixed(2));
    }
    const totalInterest = balance - totalInvestment;
    document.getElementById('totalBalance').innerText = balance.toFixed(2);
    document.getElementById('totalInvestment').innerText = totalInvestment.toFixed(2);
    document.getElementById('totalInterest').innerText = totalInterest.toFixed(2);
    renderChart(balances, false);
}
function renderChart(balances, isSample) {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    const labels = balances.map((_, i) => `Year ${i + 1}`);
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance',
                data: balances,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to resize
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `£${context.parsed.y}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    formatter: function(value) {
                        return `£${value}`;
                    },
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    // If it's a sample, hide the output values
    if (isSample) {
        document.getElementById('totalBalance').innerText = '0.00';
        document.getElementById('totalInvestment').innerText = '0.00';
        document.getElementById('totalInterest').innerText = '0.00';
    }
}
function downloadChart() {
    html2canvas(document.querySelector('.output-section')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'compound_interest_chart.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}