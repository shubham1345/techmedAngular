import { Component, HostListener, OnInit } from '@angular/core';
declare var $:any
@Component({
  selector: 'app-screen-saver',
  templateUrl: './screen-saver.component.html',
  styleUrls: ['./screen-saver.component.css']
})
export class ScreenSaverComponent implements OnInit {
imageArray:any=[
  '../../assets/screensaver/screensaver.png',
  '../../assets/screensaver/screensaver1.png',
  '../../assets/screensaver/screensaver2.png',
  '../../assets/screensaver/screensaver3.png',
  '../../assets/screensaver/screensaver4.png',
  '../../assets/screensaver/screensaver5.png',
  '../../assets/screensaver/screensaver6.png',
  '../../assets/screensaver/screensaver7.png',
  '../../assets/screensaver/screensaver8.png',
  
]

  // @HostListener('window:resize')
  // getWindowHeight() {
  //   return window.innerHeight;
  // }
  img=this.imageArray[0]
index=0
timer:any
  constructor() {


  }
  ngOnDestroy(): void {
  clearInterval(this.timer)
  }

  ngOnInit(): void {
   
    this.timer=setInterval(()=>{
      this.index++
      console.log(this.imageArray[this.index]);
      
      this.img=this.imageArray[this.index]
      if(this.index==7)
      {
        this.index=0
      }
    },5000)
  }

}

