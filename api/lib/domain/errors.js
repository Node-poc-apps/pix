class NotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

class InvaliOrganizationIdError extends Error {
  constructor(message) {
    super(message);
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
  }
}

class NotElligibleToScoringError extends Error {
  constructor(message) {
    super(message);
  }
}

class PasswordNotMatching extends Error {
  constructor(message) {
    super(message);
  }
}

class AlreadyRegisteredEmailError extends Error {
  constructor(message) {
    super(message);
  }
}

class userNotFoundError extends Error {
  constructor() {
    super();
  }

  static getErrorMessage() {
    return {
      data: {
        email: ['Cette adresse email n’existe pas.']
      }
    };
  }
}

class internalError extends Error {
  constructor() {
    super();
  }

  static getErrorMessage() {
    return {
      data: {
        error: ['Une erreur interne est survenue.']
      }
    };
  }
}

module.exports = {
  NotFoundError,
  NotElligibleToScoringError,
  PasswordNotMatching,
  InvalidTokenError,
  AlreadyRegisteredEmailError,
  InvaliOrganizationIdError,
  userNotFoundError,
  internalError
};
