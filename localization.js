
var Localization = (function() {

  // Here we will store all the Translation objects for quick access.
  var _cache = {};

  // Default language. Override via setLanguage whenever needed.
  var _language = 'ENG';

  // Public interface.
  return {


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
        throw new TypeError('Specified object not the right kind.');
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

