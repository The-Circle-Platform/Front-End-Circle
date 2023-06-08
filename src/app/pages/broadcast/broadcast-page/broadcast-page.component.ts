import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-broadcast-page",
  templateUrl: "./broadcast-page.component.html",
  styleUrls: ["./broadcast-page.component.css"],
})
export class BroadcastPageComponent implements OnInit {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videoref: any;
  ngOnInit(): void {
    this.videoref = document.getElementById("webcam");
    console.log(this.videoref);
    this.setupCamera();
  }

  setupCamera() {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 800, height: 550 },
        audio: true,
      })
      .then((stram) => {
        console.log(stram);
        this.videoref.srcObject = stram;
      });
  }

  cameraOn() {
    this.ngOnInit();
  }

  cameraOff() {
    this.videoref.srcObject = null;
  }

  startStream() {
    console.log(this.videoref.srcObject);
  }

  endStream() {
    console.log("Stream ended");
  }
}
