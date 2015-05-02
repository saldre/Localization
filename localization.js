
var Localization = (function() {

  // Here we will store all the Translation objects for quick access.
  var _cache = {};

  // Default language. Override via setLanguage whenever needed.
  var _language = 'ENG';

  // Attribute holding the Translation object's ID.
  var _dataAttribute = 'data-translate';

  /**
   * @param {String} [method]
   * @constructor
   */
  function InvalidTranslationTypeError(method) {
    this.message = '[' + method + '] Specified object not an instance of Translation.';
  }

  InvalidTranslationTypeError.prototype = Error.prototype;


  /**
   * @param {String} id
   * @param {Object} languages
   * @constructor
   */
  window.Translation = function(id, languages) {

    if ( !Localization.getTranslation(id) ) {
      this.id = id;
      this.setElement($('[' + _dataAttribute + '="' + id + '"]'));

      Localization.storeTranslation(this);
    }

    Localization.getTranslation(id).updateLanguages(languages);
  };

  Translation.UPDATE_EVENT = 'translationupdate.localization';


  /**
   * Alias for Localization.getTranslation().
   * 
   * @param {String} id
   * @returns {Translation|undefined}
   */
  Translation.get = function(id) {
    return Localization.getTranslation(id);
  };


  /**
   * @param {jQuery} $element
   */
  Translation.prototype.setElement = function($element) {
    this.$element = this.$element
      ? this.$element.add($element)  // Keep the previous elements using the same Translation.
      : $element;

    // Automatically update the content if the translation changes.
    this.$element.on(Translation.UPDATE_EVENT, this.updateElement.bind(this));
  };


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
   * @param {String} [language]
   * @return {String}
   */
  Translation.prototype.getText = function(language) {
    return this.languages[language || Localization.getLanguage()];
  };


  /**
   * @param {String} [translationId]
   * @param {Object} [languages]
   * @return {jQuery}
   */
  jQuery.fn.translate = function(translationId, languages) {
    var $element = this;
    var translation;

    if ( translationId ) {
      translation = new Translation(translationId, languages);
      $element.attr(_dataAttribute, translationId);
    }

    if ( $element.attr(_dataAttribute) ) {
      translationId = $element.attr(_dataAttribute);
      translation = Localization.getTranslation(translationId);
    }
    else {
      throw new Error('Element missing translation data.');
    }

    translation.setElement($element);
    $element.trigger(Translation.UPDATE_EVENT);

    return $element;
  };

  // Public interface.
  return {
    InvalidTranslationTypeError: InvalidTranslationTypeError,

    /**
     * @param {String} language
     */
    setLanguage: function(language) {
      _language = language;

      // Let all localized content know that the language has been changed.
      $('[' + _dataAttribute + ']').trigger(Translation.UPDATE_EVENT);
    },


    /**
     * @return {String}
     */
    getLanguage: function() {
      return _language;
    },


    /**
     * @param {String} dataAttribute
     */
    setDataAttribute: function(dataAttribute) {
      _dataAttribute = dataAttribute;
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
  };
})();
