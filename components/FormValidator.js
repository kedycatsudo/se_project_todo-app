class FormValidator {
  constructor(settings, formEl) {
    this._settings = settings;
    this._formSelector = settings.formSelector;
    this._inputSelector = settings.inputSelector;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._errorClass = settings.errorClass;
    this._inputErrorClass = settings.InputErrorClass;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._formEl = formEl;
    this._submitButton = this._formEl.querySelector(this._submitButtonSelector);
    this._inactiveButton = this._formEl.querySelector(
      this._inactiveButtonClass
    );
    this._inputElement = this._formEl.querySelector(this._inputSelector);
  }
  resetValidation() {
    this._formEl.reset();
    this._submitButton.disabled = true;
  }

  _showInputError(_inputElement, errorMessage) {
    this._errorElementId = `#${this._inputElement.id}-error`;
    this._errorElement = this._formEl.querySelector(this._errorElementId);
    console.log(this._errorElement);
    this._inputElement.classList.add(this._inputErrorClass);
    this._errorElement.textContent = errorMessage;
    this._errorElement.classList.add(this._errorClass);
  }

  _hideInputError(inputElement) {
    const errorElementId = `#${inputElement.id}-error`;
    const errorElement = this._formEl.querySelector(errorElementId);
    inputElement.classList.remove(this._settings.inputErrorClass);
    errorElement.classList.remove(this._settings.errorClass);
    errorElement.textContent = "";
  }

  _checkInputValidity(_formEl, _inputElement, _settings) {
    if (!this._inputElement.validity.valid) {
      this._showInputError(
        this._formEl,
        this._inputElement,
        this._inputElement.validationMessage,
        this._settings
      );
    } else {
      this._hideInputError(this._inputElement);
    }
  }

  _hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  _toggleButtonState() {
    if (this._hasInvalidInput(this._inputSelectorArray)) {
      this._submitButton.classList.add(this._inactiveButtonClass);
      this._submitButton.disabled = true;
    } else {
      this._submitButton.classList.remove(this._inactiveButtonClass);
      this._submitButton.disabled = false;
    }
  }

  _setEventListeners() {
    this._inputList = Array.from(
      this._formEl.querySelectorAll(this._inputSelector)
    );

    this._toggleButtonState();

    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(this._formEl, inputElement, this._settings);
        this._toggleButtonState();
      });
    });
  }

  enableValidation() {
    this._formEl.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    this._setEventListeners(this._formEl, this._settings);
  }
}
export default FormValidator;
