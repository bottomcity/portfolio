export enum commonMessages {
  requiredField = 'This field is required',
  notValidPhoneNumber = 'Phone number is not valid'
}

export enum emailPhoneEmailValidationMessages {
  invalidPhone = 'Please enter valid phone number',
  invalidEmail = 'Please enter valid email',
  emptyPhoneInput = 'Phone cannot be empty',
  invalidPatronNumber = 'Patron number must be 9 digits length',
  onlyNumbers = 'Only numbers allowed'
}

export enum otpValidationMessages {
  emptyInput = 'OTP number cannot be empty',
  moreThan5Attempts = '',
  invalidOTP = 'OTP number must be a number',
  incorrectOTP = ''
}

export enum passwordValidationMessages {
  emptyInput = 'Password cannot be empty',
  min8symbols = 'Minimum password length 8',
  max32symbols = 'Maximum password length 32',
  mustBeMore8symbols = 'Password must be at least 8 characters',
  mustBeLess32symbols = 'Password must be at most 32 characters',
  mustBeDifferent = 'New password must be different from current password',
  mustMatch = 'Passwords must match'
}

export enum pinValidationMessages {
  emptyInput = 'PIN cannot be empty',
  mustBe4digits = 'PIN must be 4 digits',
  mustBeDifferent = 'New PIN must be different from current PIN',
  mustMatch = 'PINs must match'
}

export enum namesValidationMessages {
  mustBeMax128characters = 'must be shorter than 128 characters',
  mustBeMax64characters = 'must be shorter than 64 characters',
  ZIP = 'Please enter a valid ZIP code',
  invalidDate = 'Invalid date',
  mustBe21yearsOld = 'You must be at least 21 years old'
}

export enum depositWithdrawValidationMessages {
  minAmount = 'Minimum amount is Php 1000',
  maxAmount = 'Maximum amount is Php 5000000',
  incorrectAmount = 'Incorrect amount'
}
