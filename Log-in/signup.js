document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("createAccount");
    const usernameInput = document.getElementById("signupUsername");
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1];
    const linkLogin = document.getElementById("linkLogin");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting

        if (!validateEmail(emailInput.value)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(passwordInput.value)) {
            alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Passwords do not match.");
            return;
        }

        // If all validations pass, submit the form
        form.submit();
    });


    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
 
        return regex.test(password);
    }
});
