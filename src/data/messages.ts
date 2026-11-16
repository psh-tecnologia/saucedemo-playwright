/** Mensagens exibidas pelo sistema, exatamente como aparecem na tela. */
export const MESSAGES = {
    login: {
        usernameRequired: 'Epic sadface: Username is required',
        passwordRequired: 'Epic sadface: Password is required',
        invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
        lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
        notLoggedIn: (path: string) => `Epic sadface: You can only access '${path}' when you are logged in.`,
    },
    checkout: {
        firstNameRequired: 'Error: First Name is required',
        lastNameRequired: 'Error: Last Name is required',
        postalCodeRequired: 'Error: Postal Code is required',
        completeHeader: 'Thank you for your order!',
        completeText: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    },
}
