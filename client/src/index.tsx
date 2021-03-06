import { h, render } from "preact";

const App = () => {
    return <p>Hello, world!</p>
}

render(<App />, document.getElementById("app") as HTMLElement);
