import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream-page',
  templateUrl: './stream-page.component.html',
  styleUrls: ['./stream-page.component.css']
})
export class StreamPageComponent implements OnInit {
  NewStream: any;
  HostId: number;
  
  constructor(private router: ActivatedRoute){
    this.HostId = 0;
  }
  ngOnInit(): void {
    this.CheckParams();
    //Use router to get url parameters in order to get transparent user Id
    //Get latest stream.
  }

  CheckParams(){
    this.router.paramMap.subscribe((v)=>{
      const Id: string = v.get("id")!;

      if(Id) {
        this.HostId = parseInt(Id);
        this.GetLatestStream(this.HostId);
      } else {
        console.log("Geen params");
      } 
    })
  }

  GetLatestStream(HostId: number){
    console.log("Get latest stream");

    //Perform latest https request to server

    //If it succeeds, connect to the livestream endpoints and receive videostream.
  }
  
}
