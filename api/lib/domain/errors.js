class NotFoundError extends Error {
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

module.exports = { NotFoundError, NotElligibleToScoringError, PasswordNotMatching };