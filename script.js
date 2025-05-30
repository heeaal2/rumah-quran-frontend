import config from './config.js';

// Set minimum date to today when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('attendance_date');
    dateInput.min = new Date().toISOString().split('T')[0];

    // Attach the submit event handler here
    document.getElementById('registrationForm').addEventListener('submit', validateForm);
});

async function validateForm(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('full_name').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const attendanceDate = document.getElementById('attendance_date').value;
    const submitButton = document.querySelector('#registrationForm button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Validate date is not in the past
    const selectedDate = new Date(attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('Please select a future date');
        return false;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Loading...';

    try {
        console.log('Submitting registration:', { full_name: fullName, phone_number: phoneNumber, attendance_date: attendanceDate });

        const response = await fetch(`${config.apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: fullName,
                phone_number: phoneNumber,
                attendance_date: attendanceDate
            })
        });

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            alert('Registration failed: Invalid server response.');
            return false;
        }
        console.log('Server response:', result); // Debug log
        
        if (response.ok && result.success) {
            alert('Registration successful!');
            document.getElementById('registrationForm').reset();
            // Reset min date to today
            const dateInput = document.getElementById('attendance_date');
            dateInput.min = new Date().toISOString().split('T')[0];
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error submitting registration:', error);
        alert('Registration failed. Please try again.');
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
    
    return false;
}