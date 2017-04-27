const { describe, it, after, beforeEach, afterEach, expect, knex } = require('../../test-helper');
const faker = require('faker');

const server = require('../../../server');
const User = require('../../../lib/domain/models/data/user');

describe('Acceptance | Controller | users-controller', function () {

  let options;
  let attributes;

  beforeEach(function () {
    attributes = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'A124B2C3#!',
      cgu: 'true'
    };

    options = {
      method: 'POST',
      url: '/api/accounts',
      payload: {
        data: {
          type: 'user',
          attributes,
          relationships: {}
        }
      }
    };
  });

  after(function (done) {
    server.stop(done);
  });

  it('should return 201 HTTP status code', function () {
    return server.injectThen(options).then(response => {
      expect(response.statusCode).to.equal(201);
    });
  });

  it('should return 400 HTTP status code when no payload', function () {
    // Given
    options.payload = {};

    // When
    return server.injectThen(options).then(response => {
      expect(response.statusCode).to.equal(400);
    });
  });

  it('should return 400 HTTP status code when email already exists', function () {
    // Given
    const firstRegistration = server.injectThen(options);

    // When
    const secondRegistration = firstRegistration
      .then(_ => {
        return server.injectThen(options)
      });

    // Then
    return secondRegistration.then((response) => {
      expect(response.statusCode).to.equal(400);
    });
  });


  it('should save the user in the database', function () {
    return server.injectThen(options)
      .then(response => {
        return new User({ email: attributes.email }).fetch()
      })
      .then((user) => {
        expect(attributes.firstName).to.equal(user.get('firstName'));
        expect(attributes.lastName).to.equal(user.get('lastName'));
      });
  });

  it('should crypt user password', function () {
    // Given
    options.payload.data.attributes.password = 'my-123-password';

    return server.injectThen(options)
      .then(() => {
        return new User({ email: attributes.email }).fetch()
      })
      .then((user) => {
        expect(user.get('password')).not.to.equal('my-123-password');
      });
  });

  describe('should return 400 HTTP status code', () => {
    it('when the email is not valid', function () {
      // Given
      options.payload.data.attributes.email = "invalid.email@";

      // When
      let promise = server.injectThen(options);

      // Then
      return promise.then(response => {
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});