const { describe, it, expect } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/airtable/challenge-serializer');

describe('Unit | Serializer | challenge-serializer', function() {

  describe('#deserialize', function() {

    it('should convert record "id" into "id" property', function() {
      // given
      const airtableRecord = { id: 'rec123', fields: {} };

      // when
      const challenge = serializer.deserialize(airtableRecord);

      // then
      expect(challenge.id).to.equal(airtableRecord.id);
    });

    [
      { airtableField: 'Consigne', modelProperty: 'instruction' },
      { airtableField: 'Propositions', modelProperty: 'proposals' },
      { airtableField: 'Type d\'épreuve', modelProperty: 'type' }

    ].forEach(({ airtableField, modelProperty }) => {

      it(`should convert record '${airtableField}' field into '${modelProperty}' property`, function() {
        // given
        const fields = [];
        fields[airtableField] = `${modelProperty}_value`;
        const airtableRecord = { fields };

        // when
        const challenge = serializer.deserialize(airtableRecord);

        // then
        expect(challenge[modelProperty]).to.equal(airtableRecord.fields[airtableField]);
      });

    });

    it('should convert record "Illustration de la consigne" into "illustrationUrl"" property', function() {
      // given
      const airtableRecord = {
        fields: {
          'Illustration de la consigne': [{
            'url': 'https://dl.airtable.com/ZJgAgXfaQ7KgM7atPPI1_Symboles%20CC.png',
          }]
        }
      };

      // when
      const challenge = serializer.deserialize(airtableRecord);

      // then
      expect(challenge.illustrationUrl).to.equal(airtableRecord.fields['Illustration de la consigne'][0].url);
    });

    it('should not return "attachments" property when challenge has no attachment', function() {
      // given
      const airtableRecord = { fields: {} };

      // when
      const challenge = serializer.deserialize(airtableRecord);

      // then
      expect(challenge.attachments).to.not.exist;
    });

    it('should convert record "Pièce jointe" into an array of 1 element when challenge has one attachment', function() {
      // given
      const attachment = {
        url: 'https://dl.airtable.com/MurPbtCWS9cjyjGmYAMw_PIX_couleur_remplissage.pptx'
      };
      const airtableRecord = { fields: { 'Pièce jointe': [attachment] } };

      // when
      const challenge = serializer.deserialize(airtableRecord);

      // then
      expect(challenge.attachments).to.have.lengthOf(1);
      expect(challenge.attachments[0]).to.equal(attachment.url);
    });

    it('should convert record "Pièce jointe" into an array of 2 elements when challenge has multiple attachments', function() {
      // given
      const attachmentDocx = {
        url: 'https://dl.airtable.com/MurPbtCWS9cjyjGmYAMw_PIX_couleur_remplissage.docx'
      };
      const attachmentOdt = {
        url: 'https://dl.airtable.com/MurPbtCWS9cjyjGmYAMw_PIX_couleur_remplissage.odt'
      };

      const airtableRecord = { fields: { 'Pièce jointe': [attachmentOdt, attachmentDocx] } };

      // when
      const challenge = serializer.deserialize(airtableRecord);

      // then
      expect(challenge.attachments).to.have.lengthOf(2);
      expect(challenge.attachments[0]).to.equal(attachmentDocx.url);
      expect(challenge.attachments[1]).to.equal(attachmentOdt.url);
    });

    it('should revert attachments order because Airtable return data in wrong order', function() {
      // given
      const attachment_1 = {
        url: 'https://dl.airtable.com/MurPbtCWS9cjyjGmYAMw_PIX_couleur_remplissage.docx'
      };
      const attachment_2 = {
        url: 'https://dl.airtable.com/MurPbtCWS9cjyjGmYAMw_PIX_couleur_remplissage.odt'
      };

      const airtableRecord = { fields: { 'Pièce jointe': [attachment_2, attachment_1] } };

      // when
      const challenge = serializer.deserialize(airtableRecord);

      // then
      expect(challenge.attachments).to.have.lengthOf(2);
      expect(challenge.attachments[0]).to.equal(attachment_1.url);
      expect(challenge.attachments[1]).to.equal(attachment_2.url);
    });

    // XXX : Pay attention to boolean negation : hasntInternetAllowed, instead of hasInternetAllowed,
    // it is because the nominal case is : user is allowed to use internet.
    // we need a boolean to detect the corner case where internet is NOT allowed. Currently Internet and tools are allowed
    describe('should convert field "Internet et outils" into \'hasntInternetAllowed\' boolean property', function() {

      it('should return true if  field "Internet et outils" equal to "Non"', function() {
        // given
        const airtableRecord = {
          fields: {
            'Internet et outils': 'Non'
          }
        };

        // when
        const challenge = serializer.deserialize(airtableRecord);

        // then
        expect(challenge.hasntInternetAllowed).to.equal(true);
      });

      it('should return false if  field "Internet et outils" equal to "Oui"', function() {
        // given
        const airtableRecord = {
          fields: {
            'Internet et outils': 'Oui'
          }
        };

        // when
        const challenge = serializer.deserialize(airtableRecord);

        // then
        expect(challenge.hasntInternetAllowed).to.equal(false);
      });

      it('should not be defined if field "Internet et outils" is not defined', function() {
        // given
        const airtableRecord = {
          fields: {}
        };

        // when
        const challenge = serializer.deserialize(airtableRecord);

        // then
        expect(challenge.hasntInternetAllowed).to.equal(undefined);
      });

    });
  });
});
