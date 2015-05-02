
var Localization = (function() {

  // Here we will store all the Translation objects for quick access.
  var _cache = {};

  // Default language. Override via setLanguage whenever needed.
  var _language = 'ENG';

  /**
   * @param {String} [method]
   * @constructor
   */
  function InvalidTranslationTypeError(method) {
    this.message = '[' + method + '] Specified object not an instance of Translation.';
  }

  InvalidTranslationTypeError.prototype = Error.prototype;

  // Public interface.
  return {
    InvalidTranslationTypeError: InvalidTranslationTypeError,

    /**
     * @param {String} language
     */
    setLanguage: function(language) {
      _language = language;

      // Let all localized content know that the language has been changed.
      $('[data-label]').trigger(Translation.UPDATE_EVENT);
    },


    /**
     * @return {String}
     */
    getLanguage: function() {
      return _language;
    },


    /**
     * @param {Translation} translation
     */
    storeTranslation: function(translation) {

      if ( !(translation instanceof Translation) ) {
        throw new InvalidTranslationTypeError('Localization.storeTranslation');
      }

      _cache[translation.id] = translation;
    },


    /**
     * @param {String} translationId
     * @return {Translation|undefined}
     */
    getTranslation: function(translationId) {
      return _cache[translationId];
    }
  }
})();


/**
 * @param {String} id
 * @param {Object} languages
 * @constructor
 */
function Translation(id, languages) {

  if ( !Localization.getTranslation(id) ) {
    this.id = id;
    this.$element = $('[data-label="' + id + '"]');
    this.$element.on(Translation.UPDATE_EVENT, this.updateElement.bind(this));

    Localization.storeTranslation(this);
  }

  Localization.getTranslation(id).updateLanguages(languages);
}

Translation.UPDATE_EVENT = 'translationupdate.localization';


/**
 * @param {Object} languages
 */
Translation.prototype.updateLanguages = function(languages) {

  if ( !this.languages ) {
    this.languages = {};
  }

  $.each(languages, function(language, text) {
    this.languages[language] = text;
  }.bind(this));

  this.$element.trigger(Translation.UPDATE_EVENT);
};


/**
 * Updates element's contents according to the selected language.
 */
Translation.prototype.updateElement = function() {
  this.$element.html(this.getText());
};


/**
 * @param {String} language
 * @return {String}
 */
Translation.prototype.getText = function(language) {
  return this.languages[language || Localization.getLanguage()];
};
