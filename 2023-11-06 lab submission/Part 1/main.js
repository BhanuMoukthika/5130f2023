function validateEmailFormat(givenEmail) {
    const patternForEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patternForEmail.test(givenEmail);
}

// Scenarios for testing email pattern
["example@example.com", "test@test.co", "invalid-email.com", "user@@domain.com"].forEach(testEmail => {
    if (validateEmailFormat(testEmail)) {
        console.log(`Email ${testEmail} is valid.`);
    } else {
        console.log(`Email ${testEmail} is invalid.`);
    }
});

function validateContactNumber(providedPhoneNumber) {
    const patternForPhoneNumber = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return patternForPhoneNumber.test(providedPhoneNumber);
}

// Scenarios for testing phone number pattern
["1234876590", "0678954321", "123-124-0897", "(978) 456-8569"].forEach(testPhone => {
    if (validateContactNumber(testPhone)) {
        console.log(`Phone number ${testPhone} is valid.`);
    } else {
        console.log(`Phone number ${testPhone} is invalid.`);
    }
});

function validateWebDomain(givenDomain) {
    const patternForDomain = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,63}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
    return patternForDomain.test(givenDomain);
}

// Scenarios for testing domain pattern
["gmail.com", "sub.gmail.co", "gmail", "gmail..com"].forEach(testDomain => {
    if (validateWebDomain(testDomain)) {
        console.log(`Web domain ${testDomain} is valid.`);
    } else {
        console.log(`Web domain ${testDomain} is invalid.`);
    }
});
