import axios from "axios";

// Priving Table Logic
document.getElementById("pricingTable1Btn").addEventListener("click", changePricingTable);
document.getElementById("pricingTable2Btn").addEventListener("click", changePricingTable);
function changePricingTable() {
    let pricingTable1 = document.getElementById("pricingTable1");
    let pricingTable2 = document.getElementById("pricingTable2");
    pricingTable1.classList.toggle("mobileActive");
    pricingTable2.classList.toggle("mobileActive");
}

// Set footer year
let currentYear = new Date().getFullYear();
document.getElementById("footerYearP").innerText = currentYear;

// Window on scroll logic
window.addEventListener("scroll", function() {
    animateHeader();
}, false);

function animateHeader() {
    var scrollPos = window.scrollY;
    let headerElement = document.getElementById("headerCon");
    let logoEl = document.getElementById("headerDarkSiteLogo");
    let pictureLogoEl = document.getElementById("headerLightSiteLogo");

    if(scrollPos > 30) {
        headerElement.classList.add("scrolled");
        pictureLogoEl.classList.add("siteLogoDontShow");
        logoEl.classList.remove("siteLogoDontShow");
    } else {
        headerElement.classList.remove("scrolled");
        pictureLogoEl.classList.remove("siteLogoDontShow");
        logoEl.classList.add("siteLogoDontShow");
    }
}

// Contact Form
document.getElementById("submitContactBtn").addEventListener("click", sendContactForm);
let verifyInput = {
    methods: {
        email: {
            regex: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            min: 0,
            max: 100
        },
        name: {
            regex: /^[a-z A-Z]+(?:-[a-z A-Z]+)*$/,
            min: 0,
            max: 15
        },
        message: {
            regex: /^[a-z A-Z!?.,]+(?:-[a-z A-Z!?.,]+)*$/,
            min: 0,
            max: 200
        }
    },
    verify: function(input) {
        let config = this.methods[input.type];
        let value = input.value;
        if(value.length > config.min && value.length < config.max) {
            if(config.regex.test(value)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

function sendContactForm() {
    // Values
    let nameInput = {
        value: document.getElementById("contactName").value,
        type: "name"
    };
    let emailInput = {
        value: document.getElementById("contactEmail").value,
        type: "email"
    };
    let messageInput = {
        value: document.getElementById("contactMessage").value,
        type: "message"
    };
    // Reset
    document.getElementById("contactName").classList.remove("inputError");
    document.getElementById("contactEmail").classList.remove("inputError");
    document.getElementById("contactMessage").classList.remove("inputError");
    document.getElementById("contactResMsgP").classList.add("showMsg");
    document.getElementById("contactResMsgP").innerText = "Sending";
    // Results array
    let results = [
        verifyInput.verify(nameInput),
        verifyInput.verify(emailInput),
        verifyInput.verify(messageInput)
    ];
    // Verify Inputs
    let checker = arr => arr.every(Boolean);
    if(checker(results)) {
        console.log({
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        });
        // Post to backend
        axios.post("https://api.exodiafitness.com/v1/email/contact-form", {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        })
        .then((response) => {
            if(response.data.message === "success") {
                document.getElementById("contactName").classList.remove("inputError");
                document.getElementById("contactEmail").classList.remove("inputError");
                document.getElementById("contactMessage").classList.remove("inputError");
                document.getElementById("contactResMsgP").classList.add("showMsg");
                document.getElementById("contactResMsgP").innerText = "Your message was sent successfully!";
                setTimeout(() => {
                    document.getElementById("contactResMsgP").classList.remove("showMsg");
                    document.getElementById("contactResMsgP").innerText = "";
                }, 2000);
            }
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("contactResMsgP").innerText = "There was an unknown error!";
        });
    } else {
        document.getElementById("contactResMsgP").classList.add("showMsg");
        document.getElementById("contactResMsgP").innerText = "Please check the field with the red outline!";
        if(!results[0]) {
            document.getElementById("contactName").classList.add("inputError");
        }
        if(!results[1]) {
            document.getElementById("contactEmail").classList.add("inputError");
        }
        if(!results[2]) {
            document.getElementById("contactMessage").classList.add("inputError");
        }
    }  
}