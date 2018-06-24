class Utils
{
    constructor()
    {
        //console.log('Utils constructor');
    }

    static getParameterByName(nameURL)
    {
        let name = nameURL.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    static createLogMessage(message, style)
    {
        console.log(message, style);
    }

    static checkIfStringHasNumbers(text)
    {
        let regexNum = /\d/g;// Global check for numbers
        let hasNumbers = regexNum.test(text);
        return hasNumbers;
    }
}