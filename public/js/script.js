

var hours_worked_inputs = document.querySelectorAll(".hours-worked-input");
var hourly_rate_inputs = document.querySelectorAll(".hourly-rate-input");
var basic_salary_inputs = document.querySelectorAll(".basic-salary-input");

function updateBasicSalary() {
  for (var i = 0; i < hours_worked_inputs.length; i++) {
    var hours_worked = parseFloat(hours_worked_inputs[i].value);
    var hourly_rate = parseFloat(hourly_rate_inputs[i].textContent);
    var basic_salary = hours_worked * hourly_rate;
    basic_salary_inputs[i].value = basic_salary.toFixed(2);
  }
}

for (var i = 0; i < hours_worked_inputs.length; i++) {
  hours_worked_inputs[i].addEventListener("input", updateBasicSalary);
}

updateBasicSalary();


const passwordInput = document.querySelector('#password');
const password2Input = document.querySelector('#password2');

function validatePassword() {
  if (passwordInput.value !== password2Input.value) {
    password2Input.setCustomValidity("Passwords don't match");
  } else {
    password2Input.setCustomValidity("");
  }
}

passwordInput.addEventListener('input', validatePassword);
password2Input.addEventListener('input', validatePassword);
          
          const passwordToggle = document.querySelector('#password-toggle');
        
          passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            passwordToggle.querySelector('i').classList.toggle('fa-eye');
            passwordToggle.querySelector('i').classList.toggle('fa-eye-slash');
          });
        
          function validatePassword() {
            if (passwordInput.value !== password2Input.value) {
              password2Input.setCustomValidity("Passwords don't match");
            } else {
              password2Input.setCustomValidity("");
            }
          }










// call updateEmployeeTax initially to set the value






