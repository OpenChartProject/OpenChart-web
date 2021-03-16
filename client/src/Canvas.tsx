import { h, Component, createRef } from "preact";
import { NoteSkin } from "./noteskin";

export interface Props {
    noteSkin?: NoteSkin;
}

export class Canvas extends Component<Props> {
    ref = createRef();

    get el() {
        return this.ref.current as HTMLCanvasElement;
    }

    componentDidMount() {
        this.requestDraw();
    }

    draw() {
        const ctx = this.el.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.el.width, this.el.height);

        if (this.props.noteSkin) {
            ctx.drawImage(this.props.noteSkin.receptor[0], 0, 0);
        }

        // TODO: Only redraw when needed
        this.requestDraw();
    }

    onClick(e: MouseEvent) {
        const canvas = e.target as HTMLCanvasElement;
        const x = e.x - canvas.offsetLeft;
        const y = e.y - canvas.offsetTop;

        console.log("click:", x, y);
    }

    requestDraw() {
        requestAnimationFrame(() => this.draw());
    }

    render() {
        return <canvas ref={this.ref} onClick={this.onClick}></canvas>;
    }
}
