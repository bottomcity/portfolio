export const validEmails = [
  'firstname.lastname@example.com',
  'email@email.com', // default email from SiG for qa env
  'email@subdomain.example.com',
  'firstname+lastname@example.com',
  'email@123.123.123.123',
  '1234567890@example.com',
  'email@example-one.com',
  '_______@example.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com'
  //'much."more unusual"@example.com',
  //'very.unusual."@".unusual.com@example.com',
  //'very."(),:;<>[]".VERY."very@\\\\\\ "very".unusual@strange.example.com'
  //'email@[123.123.123.123]',
  //'"email"@example.com',
];

export const invalidEmails = [
  'email@example@example.com',
  'email@example.com (Joe Smith)',
  //'あいうえお@example.com',
  'email.example.com',
  'email@example',
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com'
];

export const invalidPhones = ['9131234', '00784303521'];

export const validPhones = [
  '091712345',
  '9272096566',
  '09171234',
  '9272096555',
  '9171112233',
  '9012345676',
  '9012345671',
  '9087654320'
];

export const invalidPIN = [
  //here stored PINs based on boundary values and equal classes techniques
  '123',
  '12',
  '1'
];

export const notSecurePIN = [
  //here stored PINs based security reqs
  '1234',
  '1111',
  '0987'
];

export const validPIN = [
  //here stored PINs, ZIPs & OTP
  '824682', // bypass OTP
  '2024',
  '135555',
  '1456',
  '0987',
  '1111',
  '6734' // default PIN from SiG for qa env
];

export const invalidZIP = [
  //here stored ZIPs based on boundary values and equal classes techniques
  '1',
  '123',
  '1234567',
  '12456789012334'
];

export const validNames = [
  //here stored data for first and last manes based on boundary values and equal classes techniques
  '보라', //korean
  '李', //chinese
  'Nicholas', //classic
  'SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongna', // valid for First & last names
  'Manila', // used for profile inputs
  'Ph', // used for country and nationality dropdowns
  'Some street', // used for profile inputs
  'St Andreas', // used for profile inputs
  'Boracay', // used for profile inputs
  'SuperlongplaceofbirthSuperlongplaceofbirthSuperlongplaceofbirthS', // valid for placeOfBirth & nationality
  'ALEXANDER',
  'YUDIN',
  'Alb'
];

export const invalidNames = [
  //here stored data for first and last manes based on boundary values and equal classes techniques
  '보라', //korean
  '李', //chinese
  'Andrew', //classic
  'SuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnameSuprelongnam', // invalid for First & last names
  'SuperlongplaceofbirthSuperlongplaceofbirthSuperlongplaceofbirthSu', // invalid for placeOfBirth & nationality
  'Some street',
  'Nebraska'
];

export const validPatronNumbers = ['300936717', '300000000'];
