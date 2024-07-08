const conversionAmount = document.getElementById('conversionAmount');
const from = document.getElementById('from');
const to = document.getElementById('to');
const convert = document.getElementById("convert");
const conversionDetailText = document.getElementById("conversionDetailText");
const conversionDetailLoader = document.getElementById("conversionDetailLoader");
const error_conversionAmount = document.getElementById("error_conversionAmount");

let currencyMasterData;

window.addEventListener("load", async () => {
    currencyMasterData = await getMasterData();
    createFromDropdown(currencyMasterData);
    createToDropdown(currencyMasterData);
    convertCurrency();
});

convert.addEventListener("click", () => {
    convertCurrency();
});

const getMasterData = async () => {
    const masterDataJson = await fetch("country-flags-currency-code.json");
    const masterData = await masterDataJson.json();
    return masterData;
};

const createFromDropdown = (currencydata) => {
    for (let country of currencydata) {
        let newOption = document.createElement('option');
        newOption.value = country.code;
        newOption.textContent = `${country.name} ( ${country.country})`;
        if (country.code === "USD") {
            newOption.selected = "selected";
        }
        from.append(newOption);
    }
}

const createToDropdown = (currencydata) => {
    for (let country of currencydata) {
        let newOption = document.createElement('option');
        newOption.value = country.code;
        newOption.textContent = `${country.name} ( ${country.country})`;
        if (country.code === "INR") {
            newOption.selected = "selected";
        }
        to.append(newOption);
    }
}

const convertCurrency = async () => {
    let message = '';
    try {
        if (validateInput()) {
            resetConversionDetails();
            const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${from.value}&to=${to.value}&amount=${conversionAmount.value}`;
            const header = {
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-key": "08d8edc6a4mshcc89477777cbd1fp1125f6jsn4533d19c1ba0",
                }
            };
            const response = await fetch(url, header);
            const conversionData = await response.json();
            if (conversionData.success) {
                message = `${conversionAmount.value} ${from.value} = ${Math.round(conversionData.result)} ${to.value}`;
            } else {
                message = `The selected currency conversion doesn't support.`;
                setConversionDetails(false);
            }
            setConversionDetails(message);
        }
    } catch (error) {
        console.log(error);
        message = `Conversion service is not working right now. Please try after some time.`;
        setConversionDetails(message);
    }

}

const resetConversionDetails = () => {
    conversionDetailText.innerText = ``;
    conversionDetailText.classList.add("hide");
    conversionDetailLoader.classList.remove("hide");
    error_conversionAmount.innerText = "";
    error_conversionAmount.classList.add("hide");
}

const setConversionDetails = (message) => {
    conversionDetailText.innerText = message;
    conversionDetailText.classList.remove("hide");
    conversionDetailLoader.classList.add("hide");
    error_conversionAmount.innerText = "";
    error_conversionAmount.classList.add("hide");
}

const validateInput = () => {
    console.log(conversionAmount.value);
    if (isNaN(conversionAmount.value)) {
        error_conversionAmount.classList.remove("hide");
        error_conversionAmount.innerText = "Please enter correct number.";
        return false;
    }
    return true;
}