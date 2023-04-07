import { Dropzone } from "dropzone";
import { fabric } from "fabric";

Dropzone.autoDiscover = false;

document.addEventListener("DOMContentLoaded", function() {

  // define the canvas
  var canvas = new fabric.Canvas('c', {
    width: 512,
    height: 512,
    preserveObjectStacking: true
  });
  window.canvas = canvas;
  // image to be added to the canvas
  var image = new fabric.Image();
  // resize the canvas once it's loaded
  resizeCanvas();

  // CfA background colors
  var cfaColors = {
    purple: '#2B1A78',
    lightPurple: '#5650BE',
    red: '#AF121D',
    yellow: '#FFB446',
    lightBlue: '#A1B4EA',
    green: '#006152',
    cream: '#F0DCD2'
  };

  // Add bgColor & logo, set to be invisible
  fabric.Image.fromURL('img/scenarios/logo.png', function(oImg) {
    oImg.scaleToWidth(512);
    oImg.visible = false;
    canvas.add(oImg);
    window.logo = oImg;
  }, {
    top: 0,
    left: 0
  });
  var bgColor = new fabric.Rect({
    left: 0,
    top: 0,
    fill: cfaColors.purple,
    width: 512,
    height: 512,
    visible: false
  });
  canvas.add(bgColor);
  window.bgColor = bgColor;

  // declare the dropzone
  var imgUpload = new Dropzone("#upload", {
    url: "UploadImages",
    autoProcessQueue: false,
    createImageThumbnails: false,
    maxFiles: 1,
    acceptedFiles: "image/*",
    addRemoveLinks: true,
    clickable: '#upload, #upload-text'
  });

  // Set canvas controls
  (function() {
    fabric.Object.prototype.transparentCorners = false;

    var angleControl = document.getElementById('angle-control');
    angleControl.oninput = function() {
      image.set('angle', parseInt(this.value, 10)).setCoords();
      canvas.requestRenderAll();
    };
    var scaleControl = document.getElementById('scale-control');
    scaleControl.oninput = function() {
      image.scale(parseFloat(this.value) / 100).setCoords();
      canvas.requestRenderAll();
    };
    var cornerControl = document.getElementById('corner-control');
    cornerControl.onchange = function(e) {
      switch (e.target.value) {
        case 'tl':
          window.logo2.set({ left: 0, top: 0 });
          break;
        case 'tr':
          window.logo2.set({ left: 312, top: 0 });
          break;
        case 'bl':
          window.logo2.set({ left: 0, top: 312 });
          break;
        case 'br':
          window.logo2.set({ left: 312, top: 312 });
          break;
      }
      canvas.requestRenderAll();
    }
    var colorControl = document.getElementById('color-control');
    var colorCustomControl = document.getElementById('custom-color-control');
    colorControl.onchange = function (e) {
      switch (e.target.value) {
        case 'purple':
          window.bgColor.set("fill", cfaColors.purple);
          break;
        case 'lightPurple':
          window.bgColor.set("fill", cfaColors.lightPurple);
          break;
        case 'red':
          window.bgColor.set("fill", cfaColors.red);
          break;
        case 'yellow':
          window.bgColor.set("fill", cfaColors.yellow);
          break;
        case 'lightBlue':
          window.bgColor.set("fill", cfaColors.lightBlue);
          break;
        case 'green':
          window.bgColor.set("fill", cfaColors.green);
          break;
        case 'cream':
          window.bgColor.set("fill", cfaColors.cream);
          break;
        case 'custom':
          window.bgColor.set("fill", colorCustomControl.value);
          break;
      }
      canvas.renderAll();
    }
    colorCustomControl.onchange = function () {
      window.bgColor.set("fill", colorCustomControl.value);
      canvas.renderAll();
    }

    canvas.on({
      'object:moving': updateControls,
      'object:scaling': updateControls,
      'object:resizing': updateControls,
      'object:rotating': updateControls,
    });

    function updateControls() {
      scaleControl.value = image.scaleX;
      angleControl.value = image.angle;
    }
  })();

  var reader = new FileReader();
  reader.onload = function(event) {

    var imgObj = new Image();
    imgObj.src = event.target.result;

    fabric.util.loadImage(imgObj.src, function() {
      image = new fabric.Image(imgObj);
      image.set({
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        selectable: true,
        centeredRotation: true,
        centeredScaling: true,
        cornerColor: "#0d2240",
        cornerSize: 30,
        lockSkewingX: true,
        lockSkewingY: true,
        originX: "center",
        originY: "center",
        hasControls: false,
      });

      window.profile = image;

      image.scaleToHeight(canvas.getHeight());
      image.scaleToWidth(canvas.getWidth());
      canvas.centerObject(image);
      canvas.add(image);
      canvas.renderAll();

      // Load another logo after the profile to be used with corner scenario
      fabric.Image.fromURL('img/scenarios/logo.png', function(oImg) {
        oImg.scaleToWidth(200);
        oImg.visible = false;
        canvas.add(oImg);
        window.logo2 = oImg;
      }, {
        top: 0,
        left: 0
      });
    });
  };

  // when the image is uploaded
  // call the reader to add it to the canvas
  // enable the download button and controls
  // remove the upload text
  imgUpload.on("addedfile", function(file) {
    if (this.files.length > 1) {
      this.removeFile(this.files[0]);
    }
    reader.readAsDataURL(file);
    document.getElementById("download").disabled = false;
    document.getElementById("angle-control").disabled = false;
    document.getElementById("scale-control").disabled = false;
    document.getElementById("upload-text").innerHTML = "";
  });

  // when the image is removed
  // Remove it from the canvas
  // disable the download button and controls
  // re-add the upload text
  imgUpload.on("removedfile", function() {
    canvas.remove(image);
    document.getElementById("download").disabled = true;
    document.getElementById("angle-control").disabled = true;
    document.getElementById("scale-control").disabled = true;
    document.getElementById("upload-text").innerHTML = "Drop files here or click to upload.";
  });

  var sideScenario = function() {
    console.log("side 🥗");
    window.logo?.set({ visible: true, top: 25, left: -41 });
    window.logo?.scaleToWidth(367);
    window.logo2?.set({ visible: false });
    window.bgColor?.set({ visible: true });
    window.profile?.set({ left: 366, top: 256 });
    canvas.overlayImage = null;
    canvas.renderAll();
    document.getElementById("corner-control").disabled = true;
    document.getElementById("color-control").disabled = false;
    document.getElementById("custom-color-control").disabled = false;
  };

  var centerScenario = function() {
    console.log("center 🧲");
    window.logo?.scaleToWidth(512);
    window.logo?.set({ visible: true, top: 0, left: 0 });
    window.logo2?.set({ visible: false });
    window.bgColor?.set({ visible: true });
    window.profile?.set({ left: 256, top: 256 });
    canvas.overlayImage = null;
    canvas.renderAll();
    document.getElementById("corner-control").disabled = true;
    document.getElementById("color-control").disabled = false;
    document.getElementById("custom-color-control").disabled = false;
  };

  var cornerScenario = function() {
    console.log("corner 🎁");
    window.logo?.set({ visible: false });
    window.logo2?.set({ visible: true });
    window.bgColor?.set({ visible: false });
    window.profile?.set({ left: 256, top: 256 });
    canvas.overlayImage = null;
    canvas.renderAll();
    document.getElementById("corner-control").disabled = false;
    document.getElementById("color-control").disabled = true;
    document.getElementById("custom-color-control").disabled = true;
  };

  var frameScenario = function() {
    console.log("frame 🖼️");
    window.logo?.set({ visible: false });
    window.logo2?.set({ visible: false });
    window.bgColor?.set({ visible: false });
    window.profile?.set({ left: 256, top: 256 });
    canvas.setOverlayImage('/img/scenarios/frame.png', function() {
      canvas.overlayImage.scaleToWidth(canvas.getWidth())
      canvas.renderAll();
    }, {
      originX: 'left',
      originY: 'top',
      crossOrigin: 'anonymous'
    });
    document.getElementById("corner-control").disabled = true;
    document.getElementById("color-control").disabled = true;
    document.getElementById("custom-color-control").true = false;
  };

  // Event listeners
  var sideBtn = document.getElementById("side");
  var centerBtn = document.getElementById("center");
  var cornerBtn = document.getElementById("corner");
  var frameBtn = document.getElementById("frame");
  ['click', 'touchstart'].forEach((e) => {
    sideBtn.addEventListener(e, sideScenario);
    centerBtn.addEventListener(e, centerScenario);
    cornerBtn.addEventListener(e, cornerScenario);
    frameBtn.addEventListener(e, frameScenario);
  });

  // handle download
  // create a link and simulate a click to download the file
  var download = document.getElementById("download");
  download.addEventListener('click', function() {
    var e = canvas.toDataURL({format: "jpeg", quality: 1, multiplier: 1});
    if (window.URL && e) {
      if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(t, "profile-pic.jpeg");
      else {
        var r = document.createElement("a");
        (r.href = e), (r.download = "profile-pic.jpeg"), document.body.appendChild(r), r.click(), document.body.removeChild(r);
      }
    }
  }, false);
});

window.addEventListener('resize', function() {
  resizeCanvas();
});

// Functions
function resizeCanvas() {
  // fabric.js wraps the canvas in a ".canvas-container" div
  // manually set the container div's height to it's width
  // this will not affect the canvas size for download

  const outerCanvasContainer = document.getElementsByClassName("canvas-container")[0];
  outerCanvasContainer.style.width = "auto";
  outerCanvasContainer.style.height = `${outerCanvasContainer.clientWidth}px`;
}
