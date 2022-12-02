const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*\d).{4,}$/;
function validateEmail(input) {
  var matched = emailRegex.test(input);
  var errorSpan = document.getElementsByClassName('error-email')[0];
  var inputEmail = document.getElementsByName('email')[0];
  if (!matched) {
    errorSpan.classList.add('active');
    inputEmail.classList.add('error');
    errorSpan.innerHTML = 'Invalid Email address.';
  } else {
    errorSpan.classList.remove('active');
    errorSpan.innerHTML = '';
    inputEmail.classList.remove('error');
  }

  validateSubmit();
}

function validatePassword(input) {
  var matched2 = passwordRegex.test(input);
  var errorSpan2 = document.getElementsByClassName('error-password')[0];
  var inputPassword = document.getElementsByName('password')[0];
  if (!matched2) {
    errorSpan2.classList.add('active');
    inputPassword.classList.add('error');
    errorSpan2.innerHTML =
      'Password must be at least 4 character long. It must contains a number.';
  } else {
    errorSpan2.classList.remove('active');
    errorSpan2.innerHTML = '';
    inputPassword.classList.remove('error');
  }

  validateSubmit();
}

function validateSubmit() {
  var inputPassword = document.getElementsByName('password')[0];
  var inputEmail = document.getElementsByName('email')[0];
  var submit = document.getElementsByName('submit')[0];

  var match =
    inputPassword.classList.contains('error') ||
    inputEmail.classList.contains('error');

  if (match) {
    submit.setAttribute('disabled', true);
  } else {
    submit.removeAttribute('disabled');
  }
}
