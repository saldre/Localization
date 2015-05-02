
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
    }
  }
})();


/**
 * @param {String} id
 * @param {Object} languages
 * @constructor
 */
function Translation(id, languages) {
  this.id = id;
  this.languages = languages;
  this.$element = $('[data-label="' + id + '"]');

  Localization.storeTranslation(this);
  this.updateElement();
}


/**
 * Updates element's contents according to the selected language.
 */
Translation.prototype.updateElement = function() {
  this.$element.html(this.getText());
};


/**
 * @return {String}
 */
Translation.prototype.getText = function() {
  return this.languages[Localization.getLanguage()];
};
