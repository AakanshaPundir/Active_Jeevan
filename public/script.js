// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("bmi-btn");
  
    if (button) {
      button.addEventListener("click", calculateBMI);
    }
  });
  
  // Function to calculate BMI
  function calculateBMI() {
    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");
    const resultDiv = document.getElementById("result");
  
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value) / 100; // convert cm to meters
  
    // Validate inputs
    if (!weight || !height || weight <= 0 || height <= 0) {
      resultDiv.textContent = "❗ Please enter valid height and weight.";
      resultDiv.style.color = "red";
      return;
    }
  
    // Calculate BMI
    const bmi = weight / (height * height);
    const roundedBMI = bmi.toFixed(2);
    let category = "";
  
    // Classify BMI
    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 24.9) {
      category = "Normal weight";
    } else if (bmi < 29.9) {
      category = "Overweight";
    } else {
      category = "Obese";
    }
  
    // Display result
    resultDiv.textContent = `✅ Your BMI is ${roundedBMI} (${category})`;
    resultDiv.style.color = "green";
  }
  