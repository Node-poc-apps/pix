import { describe, it } from 'mocha';
import sinon from 'sinon';
import { setupTest } from 'ember-mocha';

describe('Unit | Component | password-reset-form', function() {

  setupTest('component:password-reset-form', {});

  let component;

  beforeEach(function() {
    component = this.subject();
  });

  describe('#sendToRoutePasswordResetDemand', function() {

    it('should send action to route password-reset', function() {
      // given
      const onSubmitActionSpy = sinon.spy();
      component.set('onSubmit', onSubmitActionSpy);
      const submittedEmail = 'dumb@people.com';
      component.set('email', submittedEmail);

      // when
      component.send('sendToRoutePasswordResetDemand');

      // then
      sinon.assert.called(onSubmitActionSpy);
      sinon.assert.calledWith(onSubmitActionSpy, submittedEmail);
    });
  });

});