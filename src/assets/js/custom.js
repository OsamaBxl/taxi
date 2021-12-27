function deleteZeroFromPhone(code, number) {
  const phoneNumber = code + number;
  let zeroPosition = charAt(3);
  if (phoneNumber.zeroPosition == "0") {
    phoneNumber.replace(zeroPosition, "");
  }
}
