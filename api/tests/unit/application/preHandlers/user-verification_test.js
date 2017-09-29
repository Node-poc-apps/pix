const { describe, it, expect, sinon, beforeEach, afterEach } = require('../../../test-helper');
const userVerification = require('../../../../lib/application/preHandlers/user-verification');
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
const { UserNotFoundError } = require('../../../../lib/domain/errors');
const User = require('../../../../lib/domain/models/data/user');
const errorSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/validation-error-serializer');

describe('Unit | Pre-handler | User Verification', () => {

  describe('#verifyById', () => {

    let sandbox;
    let reply;
    let codeStub;
    let takeOverStub;
    const request = {
      params: {
        id: 7
      }
    };

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      sandbox.stub(userRepository, 'findUserById');
      sandbox.stub(errorSerializer, 'serialize');

      takeOverStub = sandbox.stub();
      codeStub = sandbox.stub().returns({
        takeover: takeOverStub
      });
      reply = sandbox.stub().returns({
        code: codeStub
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should be a function', () => {
      // then
      expect(userVerification.verifyById).to.be.a('function');
    });

    describe('When user exist', () => {

      it('should reply with fetched user', () => {
        // given
        const fetchedUser = {};
        const userData = new User({});
        userRepository.findUserById.resolves(userData);

        // when
        const promise = userVerification.verifyById(request, reply);

        // then
        return promise.then(() => {
          sinon.assert.calledOnce(userRepository.findUserById);
          sinon.assert.calledOnce(reply);
          sinon.assert.calledWith(userRepository.findUserById, request.params.id);
          sinon.assert.calledWith(reply, fetchedUser);
        });
      });

    });

    describe('When user doesn’t exist', () => {

      it('should reply 404 status with a serialized error and takeOver the request', () => {
        // given
        const error = new UserNotFoundError();
        userRepository.findUserById.rejects(error);
        const serializedError = {};
        errorSerializer.serialize.returns(serializedError);
        // when
        const promise = userVerification.verifyById(request, reply);

        // then
        return promise.then(() => {
          sinon.assert.calledOnce(takeOverStub);
          sinon.assert.calledOnce(codeStub);
          sinon.assert.calledOnce(errorSerializer.serialize);
          sinon.assert.calledWith(codeStub, 404);
          sinon.assert.calledWith(reply, serializedError);
          sinon.assert.calledWith(errorSerializer.serialize, UserNotFoundError.getErrorMessage());
        });
      });

    });
  });
});
