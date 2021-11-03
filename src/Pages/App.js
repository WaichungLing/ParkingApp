// import './App.css';
import {Button} from "@mui/material";
import PlainText from "./PlainText";

function App() {
  
  /*
  * 1. Create a new .js file in src, you can create multiple .js files as components and import them in a final file
  * 2. To test how it looks like on web, simply replace the <App /> in index.js with the .js file you want to use
  * 3. How to import other components? As simple as the <PlainText /> in this example.
  * 4. For styling, you can include a css file like ./App.cs, or use sx prop provided by Material UI,
  *    see https://mui.com/system/basics/#demo
  * 5. When push the code, try to use .gitignore to ignore node_modules directory, because there are too many files.
  */
  
  return (
    <div className="App">
      {/*Test MaterialUI*/}
      <Button variant="outlined">Hi</Button>
      <PlainText/>
    </div>
  );
}

export default App;
