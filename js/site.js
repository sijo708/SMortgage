function getValues() {
    let loanAmount = document.getElementById('loanAmount').value;
    let term = document.getElementById('term').value;
    let interestRate = document.getElementById('interestRate').value;

    loanAmount = parseFloat(loanAmount);
    term = parseFloat(term);
    interestRate = parseFloat(interestRate);

    if (isNaN(loanAmount) || isNaN(term) || isNaN(interestRate) ||
        loanAmount <= 0 || term <= 0 || interestRate <= 0) {
        Swal.fire({
            icon: 'error',
            backdrop: false,
            title: 'Oops',
            text: 'Please enter valid values for Loan Amount, Term, and Interest Rate.'
        });

        return;
    }

    calculateMortgage(loanAmount, term, interestRate);
}

function calculateMortgage(loanAmount, term, interestRate) {// Monthly interest rate
    let monthlyRate = interestRate / 100 / 12;

    // Monthly payment
    let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

    // Calculate amortization schedule
    let balance = loanAmount;
    let amortizationSchedule = [];
    let totalInterest = 0;

    for (let month = 1; month <= term; month++) {
        let interest = balance * monthlyRate;
        let principal = monthlyPayment - interest;
        totalInterest += interest;
        balance -= principal;

        amortizationSchedule.push({
            month,
            payment: monthlyPayment,
            principal,
            interest,
            totalInterest,
            balance,
        });
    }

    displayResults(amortizationSchedule, monthlyPayment, loanAmount);

}

function displayResults(amortizationSchedule, monthlyPayment, loanAmount) {
    // Display monthly payment
    document.getElementById('monthlyPayment').innerText = '$' + monthlyPayment.toFixed(2);

    // Display total principal, interest, and cost
    let totalPrincipal = loanAmount.toFixed(2);
    let totalInterest = (monthlyPayment * amortizationSchedule.length - loanAmount).toFixed(2);
    let totalCost = (parseFloat(totalPrincipal) + parseFloat(totalInterest)).toFixed(2);

    document.getElementById('totPrincipal').innerText = '$' + totalPrincipal;
    document.getElementById('totInterest').innerText = '$' + totalInterest;
    document.getElementById('totCost').innerText = '$' + totalCost;

    // Display amortization schedule
    let tableBody = document.getElementById('amortizationSchedule');
    tableBody.innerHTML = '';

    amortizationSchedule.forEach(entry => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${entry.month}</td>
                         <td>$${entry.payment.toFixed(2)}</td>
                         <td>$${entry.principal.toFixed(2)}</td>
                         <td>$${entry.interest.toFixed(2)}</td>
                         <td>$${entry.totalInterest.toFixed(2)}</td>
                         <td>$${entry.balance.toFixed(2)}</td>`;

        tableBody.appendChild(row);
    });
}
