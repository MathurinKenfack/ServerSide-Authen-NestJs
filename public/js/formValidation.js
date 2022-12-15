const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*\d).{4,}$/;

function validateEmail(input) {
	let matched = emailRegex.test(input);
	let errorSpan = document.getElementsByClassName('error-email')[0];
	let inputEmail = document.getElementsByName('email')[0];
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

function validateEmailPasswordReset(input) {
	let matched = emailRegex.test(input);
	let errorSpan = document.getElementsByClassName('error-email')[0];
	let inputEmail = document.getElementsByName('email')[0];
	let submit = document.getElementsByName('submit')[0];
	if (!matched) {
		errorSpan.classList.add('active');
		inputEmail.classList.add('error');
		submit.setAttribute('disabled', true);
		errorSpan.innerHTML = 'Invalid Email address.';
	} else {
		errorSpan.classList.remove('active');
		submit.removeAttribute('disabled');
		errorSpan.innerHTML = '';
		inputEmail.classList.remove('error');
	}
}

function validatePassword(input) {
	let matched2 = passwordRegex.test(input);
	let errorSpan2 = document.getElementsByClassName('error-password')[0];
	let inputPassword = document.getElementsByName('password')[0];
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

function validatePasswordReset(input) {
	let matched2 = passwordRegex.test(input);
	let errorSpan2 = document.getElementsByClassName('error-password')[0];
	let inputPassword = document.getElementsByName('password')[0];
	let submit = document.getElementsByName('submit')[0];
	if (!matched2) {
		errorSpan2.classList.add('active');
		inputPassword.classList.add('error');
		submit.setAttribute('disabled', true);
		errorSpan2.innerHTML =
			'Password must be at least 4 character long. It must contains a number.';
	} else {
		errorSpan2.classList.remove('active');
		errorSpan2.innerHTML = '';
		submit.removeAttribute('disabled');
		inputPassword.classList.remove('error');
	}
}

function validateConfirmPassword(input) {
	let matched2 = passwordRegex.test(input);
	let errorSpan2 = document.getElementsByClassName('error-password')[1];
	let inputPassword = document.getElementsByName('confirmPassword')[0];
	let submit = document.getElementsByName('submit')[0];
	let samePassword =
		input === document.getElementsByName('password')[0].value;
	if (!matched2 || !samePassword) {
		let msg = '';
		if (!matched2) {
			msg =
				msg +
				'Confirm password must be at least 4 character long. It must contains a number.';
		}

		if (!samePassword) {
			msg = msg + 'Confirm password and password are not the same.';
		}
		errorSpan2.classList.add('active');
		inputPassword.classList.add('error');
		submit.setAttribute('disabled', true);
		errorSpan2.innerHTML = msg;
	} else {
		errorSpan2.classList.remove('active');
		errorSpan2.innerHTML = '';
		submit.removeAttribute('disabled');
		inputPassword.classList.remove('error');
	}
}

function validateSubmit() {
	let inputPassword = document.getElementsByName('password')[0];
	let inputEmail = document.getElementsByName('email')[0];
	let submit = document.getElementsByName('submit')[0];
	let recaptcha = grecaptcha.getResponse();
	let match =
		inputPassword.classList.contains('error') ||
		inputEmail.classList.contains('error') ||
		recaptcha === '';

	if (match) {
		submit.setAttribute('disabled', true);
	} else {
		submit.removeAttribute('disabled');
	}
}

function resetRecaptcha() {
	grecaptcha.reset();
	return true;
}
