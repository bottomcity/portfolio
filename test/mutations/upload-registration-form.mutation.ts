export const uploadRegistrationFormMutation = `
mutation ($somefile: Upload!) {
  uploadRegistrationForm(file: $somefile) {
    status
    code
    message
  }
}
`;

export const uploadRegistrationFormMutationFinalFixture = {
  status: true,
  code: '201',
  message: 'Image uploaded successfully',
};
