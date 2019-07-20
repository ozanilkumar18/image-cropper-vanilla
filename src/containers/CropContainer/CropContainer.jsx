import React, { Component } from "react";
import "./CropContainer.css";
import { ImageSelector } from "../../components/ImageSelector";
import html2canvas from "html2canvas";

class CropContainer extends Component {
  state = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    hidden: true,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    image: []
  };

  reCalc = () => {
    const { x1, x2, y1, y2 } = this.state;

    var x3 = Math.min(x1, x2);
    var x4 = Math.max(x1, x2);
    var y3 = Math.min(y1, y2);
    var y4 = Math.max(y1, y2);
    this.setState({ left: x3 });
    this.setState({ top: y3 });
    this.setState({ width: x4 - x3 });
    this.setState({ height: y4 - y3 });
  };
  onmousedown = e => {
    this.setState({ hidden: false });
    this.setState({ x1: e.clientX });
    this.setState({ y1: e.clientY });
    console.log("onmousedown");
    this.reCalc();
  };

  onmousemove = e => {
    this.setState({ x2: e.clientX });
    this.setState({ y2: e.clientY });
    console.log("onmousemove");
    this.reCalc();
  };

  onmouseup = e => {
    const { left, top, width, height } = this.state;
    console.log("onmouseup");
    this.setState({ hidden: true });
    this.getSnapshot(document.getElementById("imageBlock"), {
      x: left,
      y: top,
      width: width,
      height: height,
      useCORS: true
    }).then(c => {
      if (c) {
        this.refs.canvas1 = c.canvas;
      }
    });
  };

  fileOnChange = e => {
    console.log("file" + JSON.stringify(e.target.files));
    if (e.target.files && e.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  getSnapshot = (element, options = {}) => {
    // our cropping context
    let cropper = document.createElement("canvas").getContext("2d");
    // save the passed width and height
    let finalWidth = options.width || window.innerWidth;
    let finalHeight = options.height || window.innerHeight;
    // update the options value so we can pass it to h2c
    if (options.x) {
      options.width = finalWidth + options.x;
    }
    if (options.y) {
      options.height = finalHeight + options.y;
    }
    // chain h2c Promise
    return html2canvas(element, options).then(c => {
      // do our cropping
      cropper.canvas.width = finalWidth;
      cropper.canvas.height = finalHeight;
      cropper.drawImage(c, -(+options.x || 0), -(+options.y || 0));
      // return our canvas
      window.open(
        cropper && cropper.canvas && cropper.canvas.toDataURL("image/png"),
        "_blank"
      );
    });
  };

  render() {
    const { hidden, left, top, width, height, image } = this.state;
    return (
      <div>
        <ImageSelector onChange={this.fileOnChange} />
        <div
          id="imageBlock"
          style={{
            minWidth: "80vh",
            minHeight: "80vh",
            backgroundImage: image && `url(${image})`,
            backgroundRepeat: "no-repeat"
          }}
          onMouseDown={e => this.onmousedown(e)}
          onMouseMove={this.onmousemove}
          onMouseUp={this.onmouseup}
        >
          <div
            className="crop"
            hidden={hidden}
            style={{
              left: left,
              top: top,
              width: width,
              height: height
            }}
          />
        </div>
        <h2>Image Snapshot</h2>
        <canvas ref="canvas1" width={300} height={300} />
      </div>
    );
  }
}

export default CropContainer;
