# e-l-creator NPM Package for Node.js

## Encoding/Decoding language creator and user

Here's step by step on how to install and use my encoding language creator.

1. [In the console run `npm i e-l-creator`](https://www.npmjs.com/package/e-l-creator)
2. Open the project and in the file require the app: `const App = require('e-l-creator);`, keep in mind you can call the App something else.
3. Then you can start using my app:
   * First start with this line code: `const theNewApp = new App('Path to a json file');`, don't forget to create or use already existing json file(It's no matter what it is/will be called, if the file already exists, please make a backup, becuse there is a possibility of loss of data), and alter the Path in the code.
   *  After you initialize the App, you can start creating the encoding language: `console.log(theNewApp.encode(what_to_encode, level));`, never forget to change the parameters of the function that you call(Replace what_to_encode with the text that you want to encode and replace level with how high you want your level of "security" be(Level has to be a number)).
   *  Then you can call the decode function: `console.log(theNewApp.decode(what_to_decode));`
   *  And the last function that you can call is: `theNewApp.initiate_web(port);`, it will open a site that will be public on your wifi and your computer(Dont forget to set the port).


Function list:

| Function         | Parameters                | Returns        | Description                                  |
| :--------------- | :------------------------ | :------------- | :------------------------------------------- |
| `new App()`      | `configFilePath*` | `App Instance` | Creates a new App object using the config. |
| `encode()`       | `dataToEncode*`, `encodingLevel*` | `Encoded Data` | Encodes the provided data.                  |
| `decode()`       | `encodedData*` | `Decoded Data` | Decodes the provided data.                  |
| `initiate_web()` | `port*` | `None`         | Starts a web server on the given port.       |

\* Required parameter
