class Utils
{
  static getParameterByName (nameURL)
  {
    let name = nameURL.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  static createLogMessage (message, style)
  {
    console.log(message, style);
  }

  static checkIfStringHasNumbers (text)
  {
    let regexNum = /\d/g;// Global check for numbers
    let hasNumbers = regexNum.test(text);
    return hasNumbers;
  }
}
