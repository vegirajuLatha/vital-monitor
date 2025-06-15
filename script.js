document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlideIndex = 0;

    function showSlide(index) {
        if (index >= 0 && index < slides.length) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            currentSlideIndex = index;
        }
    }

    function showMainPage() {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
        document.getElementById('headerTitle').textContent = 'Vital Monitor';
        document.getElementById('homeLink').style.display = 'none';
        document.getElementById('backLink').style.display = 'block';
        showSlide(0); 
    }

    function goBack() {
        document.getElementById('homePage').style.display = 'block';
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('headerTitle').textContent = 'Vital Monitor';
        document.getElementById('homeLink').style.display = 'block';
        document.getElementById('backLink').style.display = 'none';
    }

    function validateSlide1() {
        const age = document.getElementById('ageInput').value;
        const gender = document.getElementById('genderInput').value;

        document.getElementById('ageError').style.display = 'none';
        document.getElementById('genderError').style.display = 'none';

        if (age && gender) {
            showSlide(1);
        } else {
            if (!age) document.getElementById('ageError').style.display = 'block';
            if (!gender) document.getElementById('genderError').style.display = 'block';
        }
    }

    function validateSlide2() {
        const heartRate = document.getElementById('heartRateInput').value;
        const bloodPressure = document.getElementById('bloodPressureInput').value;

        document.getElementById('heartRateError').style.display = 'none';
        document.getElementById('bloodPressureError').style.display = 'none';

        if (heartRate && /^(\d{2,3})\/(\d{2,3})$/.test(bloodPressure)) {
            showSlide(2);
        } else {
            if (!heartRate) document.getElementById('heartRateError').style.display = 'block';
            if (!/^(\d{2,3})\/(\d{2,3})$/.test(bloodPressure)) document.getElementById('bloodPressureError').style.display = 'block';
        }
    }

    function validateSlide3() {
        const temperature = document.getElementById('temperatureInput').value;
        const temperatureUnit = document.getElementById('temperatureUnit').value;

        document.getElementById('temperatureError').style.display = 'none';

        if (temperature && temperatureUnit) {
            showSlide(3);
        } else {
            if (!temperature || !temperatureUnit) document.getElementById('temperatureError').style.display = 'block';
        }
    }

    function checkHealth() {
        const heartRate = parseFloat(document.getElementById('heartRateInput').value);
        const bloodPressure = document.getElementById('bloodPressureInput').value;
        const temperature = parseFloat(document.getElementById('temperatureInput').value);
        const tempUnit = document.getElementById('temperatureUnit').value;
        const age = parseInt(document.getElementById('ageInput').value);

        let alertMessage = "";
        let recommendedTests = [];

        const heartRateNormalRange = [60, 100];
        const bloodPressureNormalRange = { 
            '18-39': { systolic: [119, 119], diastolic: [70, 70] },
            '40-59': { systolic: [124, 124], diastolic: [77, 77] },
            '60+': { systolic: [133, 133], diastolic: [69, 69] }
        };
        const tempRange = tempUnit === "Celsius" ? [35, 37] : [96, 99];

        let bloodPressureNormal;
        if (age < 40) {
            bloodPressureNormal = bloodPressureNormalRange['18-39'];
        } else if (age < 60) {
            bloodPressureNormal = bloodPressureNormalRange['40-59'];
        } else {
            bloodPressureNormal = bloodPressureNormalRange['60+'];
        }

        if (heartRate < heartRateNormalRange[0] || heartRate > heartRateNormalRange[1]) {
            alertMessage += "Heart Rate is abnormal. ";
            recommendedTests.push(
                "Electrocardiogram (ECG): To check for heart rhythm issues.",
                "Holter Monitor: To track heart activity over time."
            );
        }

        const [systolic, diastolic] = bloodPressure.split('/').map(Number);
        if (isNaN(systolic) || isNaN(diastolic)) {
            alertMessage += "Blood Pressure input is invalid. ";
        } else if (systolic > bloodPressureNormal.systolic[0] || diastolic > bloodPressureNormal.diastolic[0]) {
            alertMessage += "Blood Pressure is high. ";
            recommendedTests.push(
                "Ambulatory Blood Pressure Monitoring (ABPM): For 24-hour blood pressure tracking.",
                "Electrocardiogram (ECG): To check for heart issues."
            );
        } else if (systolic < bloodPressureNormal.systolic[0] || diastolic < bloodPressureNormal.diastolic[0]) {
            alertMessage += "Blood Pressure is low. ";
            recommendedTests.push(
                "Blood Tests: To identify possible causes.",
                "Tilt Table Test: To diagnose fainting and dizziness issues."
            );
        }

        if (temperature < tempRange[0] || temperature > tempRange[1]) {
            if (temperature > tempRange[1]) {
                alertMessage += "Body Temperature is high. ";
                recommendedTests.push(
                    "Blood Tests: To check for infections or inflammation.",
                    "Chest X-ray: To examine potential lung issues."
                );
            } else {
                alertMessage += "Body Temperature is low. ";
                recommendedTests.push(
                    "Blood Tests: To check for underlying health issues.",
                    "Electrolyte Tests: To evaluate electrolyte imbalance."
                );
            }
        }

        document.getElementById('heartRateDisplay').textContent = `Heart Rate: ${heartRate} bpm`;
        document.getElementById('bloodPressureDisplay').textContent = `Blood Pressure: ${bloodPressure}`;
        document.getElementById('temperatureDisplay').textContent = `Temperature: ${temperature} ${tempUnit}`;

        const alertElement = document.getElementById('alertMessage');
        const testsList = document.getElementById('testsList');

        if (alertMessage) {
            alertElement.textContent = alertMessage;
            alertElement.className = 'alert-message';
        } else {
            alertElement.textContent = "All metrics are normal!";
            alertElement.className = 'good-health-message'; 
        }

        testsList.innerHTML = '';
        recommendedTests.forEach(test => {
            const li = document.createElement('li');
            li.textContent = test;
            testsList.appendChild(li);
        });

        document.querySelector('.tests').style.display = recommendedTests.length > 0 ? 'block' : 'none';

        showSlide(4);
    }

    function prevSlide(index) {
        showSlide(index);
    }

    window.showMainPage = showMainPage;
    window.goBack = goBack;
    window.validateSlide1 = validateSlide1;
    window.validateSlide2 = validateSlide2;
    window.validateSlide3 = validateSlide3;
    window.checkHealth = checkHealth;
    window.prevSlide = prevSlide;
});
