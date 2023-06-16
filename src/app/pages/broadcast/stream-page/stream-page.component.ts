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
    //Get latest stream.
  }

  CheckParams(){
    this.router.paramMap.subscribe((v)=>{
      const Id: string = v.get("id")!;

      if(Id) {
        this.HostId = parseInt(Id);
      } else {
        console.log("Geen params");
      } 
    })
  }
  
}
