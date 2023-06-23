import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { securityService } from 'src/app/services/authServices/security';
import { VidStream } from 'src/app/services/vidStream/VidStream.service';
import {flush} from "@angular/core/testing";

@Component({
  selector: 'app-stream-page',
  templateUrl: './stream-page.component.html',
  styleUrls: ['./stream-page.component.css']
})
export class StreamPageComponent implements OnInit {
  NewStream: any | undefined;
  HostId: number;
  StreamId: number;
  HasLoaded: boolean = false;

  constructor(private router: ActivatedRoute, private VidService: VidStream, private secureService : securityService){
    this.HostId = 0;
    this.NewStream = undefined;
    this.StreamId = 0;
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
    console.log(`Host with id ${HostId}`);
    this.VidService.GetStreamOfHost(HostId).subscribe(ol =>{
      console.log(ol);
        const sign = ol.signature;

        console.log("SIGN STREAM IN VIEWERCOUNT");
        const IsValid = this.secureService.verify(ol.originalData, sign);

        if(IsValid){
          this.NewStream = ol.originalData;
          this.HasLoaded = true;
        } else{
          console.warn("No stream is running");
        }
    });
  }
  
}
