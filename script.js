document.addEventListener("DOMContentLoaded", () => {
    const attendeesInput = document.getElementById("attendees");
    const kidsInput = document.getElementById("kids");
    const amountDisplay = document.getElementById("amount");
    const submitButton = document.getElementById("submitButton");
    const copyButtons = document.querySelectorAll("[id^='copyButton']");

    const attendeePrice = 500;
    const kidPrice = 100;

    // Calculate the total amount based on attendees and kids
    const calculateAmount = () => {
        const attendees = parseInt(attendeesInput.value) || 0;
        const kids = parseInt(kidsInput.value) || 0;

        const totalAmount = attendees * attendeePrice + kids * kidPrice;
        amountDisplay.textContent = `Total Amount: ₹${totalAmount.toFixed(2)}`;
    };

    // Attach calculateAmount function to input fields
    attendeesInput.addEventListener("input", calculateAmount);
    kidsInput.addEventListener("input", calculateAmount);

    // Handle form submission
    const registrationForm = document.getElementById("registrationForm");
    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const attendees = attendeesInput.value;
        const kids = kidsInput.value;
        const eventDate = document.querySelector('input[name="event_date"]:checked')?.value;

        if (!name || !phone || (!attendees && !kids) || !eventDate) {
            alert("Please fill in all required fields, including selecting an event date.");
            return;
        }

        // Prevent multiple clicks
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const currentDate = new Date();
        const utcOffsetInMilliseconds = currentDate.getTimezoneOffset() * 60000;
        const istOffsetInMilliseconds = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(currentDate.getTime() + utcOffsetInMilliseconds + istOffsetInMilliseconds);

        const timestamp = istDate.toISOString();
        const submission_date = istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

        const formData = {
            name: name,
            phone: phone,
            attendees: attendees,
            kids: kids,
            event_date: eventDate,
            timestamp: timestamp,
            submission_date: submission_date
        };

        fetch("https://sheetdb.io/api/v1/pvkyu6w24w7be", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: formData })
        })
        .then(response => response.json())
        .then(data => {
            alert(`Thank you for registering, ${name}!\nYour data has been successfully submitted.`);
            window.location.href = "thankyou.html";
        })
        .catch(error => {
            console.error("Error submitting data to SheetDB: ", error);
            alert("An error occurred while submitting your data. Please try again.");
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
        });
    });

    // Handle UPI copy functionality
    copyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const upiNumberElement = button.previousElementSibling.querySelector("span");
            const upiNumber = upiNumberElement.textContent;

            navigator.clipboard.writeText(upiNumber).then(() => {
                button.textContent = "Copied"; // Change button text
                setTimeout(() => {
                    button.textContent = "Copy UPI"; // Revert after 3 seconds
                }, 3000);
            }).catch(err => {
                console.error("Failed to copy UPI Number: ", err);
            });
        });
    });
});
