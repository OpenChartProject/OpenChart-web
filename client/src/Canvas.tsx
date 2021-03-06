import { h, Component, createRef } from "preact";


export class Canvas extends Component {
    ref = createRef();

    componentDidMount() {
        const canvas = this.ref.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    onClick(e: MouseEvent) {
        const canvas = e.target as HTMLCanvasElement;
        const x = e.x - canvas.offsetLeft;
        const y = e.y - canvas.offsetTop;

        console.log(x, y);
    }

    render() {
        return (
            <canvas ref={this.ref} onClick={this.onClick}></canvas>
        );
    }
}
