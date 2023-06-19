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
    this.NewStream = {id: 1};
  }
  ngOnInit(): void {
    console.log("Hello page algemeen")
    this.CheckParams();
    //Use router to get url parameters in order to get transparent user id
    //Get latest stream.
  }

  CheckParams(){
    this.router.paramMap.subscribe((v)=>{
      const id: string = v.get("id")!;
      console.log(`De ONE PIECE IS ID ${id}`);
      if(id) {
        this.HostId = parseInt(id);
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
