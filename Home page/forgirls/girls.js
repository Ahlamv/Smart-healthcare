document.getElementById('periodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (document.getElementById('reminderToggle').checked) {
        // Calculate next period date (28 days cycle)
        const nextPeriod = new Date(startDate);
        nextPeriod.setDate(nextPeriod.getDate() + 28);
        
        // Set reminder
        alert(`Your next period is expected around ${nextPeriod.toLocaleDateString()}`);
    }
});
