function passRegisterParameters(email, password, confirmationPassword) {
  let valid = 1;
  let errorMsg = "";
  console.log(password);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/g;

  if (password !== confirmationPassword) {
    valid = 0;
    errorMsg = "Password's do not match!";
  } else if (!passwordRegex.test(password)) {
    valid = 0;
    errorMsg = "Password's needs 1 uppercase, 1 lowercase, 1 number!";
  }
  return { valid, errorMsg };
}

module.exports = {
  passRegisterParameters,
};
