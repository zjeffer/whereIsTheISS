let emailInput, submitButton, errorLabel;

// helper function
function isValidEmailAddress(emailAddress) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

function isEmpty(fieldValue) {
	return !fieldValue || !fieldValue.length;
};

function addErrorLabel(field, label, message) {
	field.classList.add("has-error");
	label.innerHTML = message;
}

function removeErrorLabel(field, label) {
    field.classList.remove("has-error");
    label.innerHTML = "";
}

function validateEmail(input){
    if (isEmpty(input.value)){
        addErrorLabel(input, errorLabel, "Please enter an email address");
    } else if (!isValidEmailAddress(input.value)) {
        addErrorLabel(input, errorLabel, "Please enter a valid email address")
	} else {
		removeErrorLabel(input, errorLabel);
    }    
}

function init(){
    emailInput = document.querySelector(".js-email-input");
    submitButton = document.querySelector(".js-submit-button");
    errorLabel = document.querySelector(".js-error-label");

    emailInput.addEventListener("input", () => {
        removeErrorLabel(emailInput, errorLabel);
    });

    submitButton.addEventListener("click", function (e) {
        console.log("submit");
        validateEmail(emailInput);
		e.preventDefault();
	});
}


document.addEventListener("DOMContentLoaded", () => {
    console.info("Made by Tuur Vanhoutte for Interaction Design project");
    init();
})