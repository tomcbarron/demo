console.log('This would be the main JS file.');


$(function () {
   
   var $pixelGrid = $('#pixel-grid');

   var pixelGrid = {

        canvas: null,
      c2d: null,
      canvasW: 800,
      canvasH: 400,
      bgColor: 'black',
      pixelColor: '#0D6EAF',
      numPixelsX: 32,
      numPixelsY: 16,
      pixelSize: 4,
      pixelSpacing: 8,
      pixelDeathFade: 100,
      pixelBornFade: 50,
      pixelMaxLife: 50,
      pixelMinLife: 25,
      pixelMaxOffLife: 50,
      pixelMinOffLife: 25,
      pixels: [],
      
      init: function() {
         var canvas = document.createElement('canvas');
         canvas.width = this.canvasW;
         canvas.height = this.canvasH;
         $pixelGrid.append(canvas);
         this.canvas = canvas;
         this.c2d = canvas.getContext('2d');
         
         this.initPixels();
         this.renderLoop();
         
         $pixelGrid.addClass('appear');
      },
      
      initPixels: function () {
         
         for(var y = 0; y < this.numPixelsY; y++) {
            for(var x = 0; x < this.numPixelsX; x++) {
                    var pixel = this.randomizePixelAttrs(x, y);
               this.pixels.push(pixel);
            }
         }
      },
      
      randomizePixelAttrs: function (x, y) {

         var alpha = this.randomAlpha(),
             self  = this;
         
         var lit = true;
         if(alpha === 0.1) { lit = false; }

         return {
            xPos: x * this.pixelSize + (x * this.pixelSpacing),
            yPos: y * this.pixelSize + (y * this.pixelSpacing),
            alpha: 0,
            maxAlpha: alpha,
            life: Math.floor(Math.random()*self.pixelMaxLife-self.pixelMinLife+1)+self.pixelMinLife,
            offLife: Math.floor(Math.random()*self.pixelMaxOffLife-self.pixelMinOffLife+1)+self.pixelMinOffLife,
            isLit: lit,
            dying: false,
            deathFade: this.pixelDeathFade,
            bornFade: this.pixelBornFade,
            randomizeSelf: function () {
               
               var alpha = self.randomAlpha();
               
               var lit = true;
                 if(alpha === 0.1) { lit = false; }
               
               this.alpha = 0;
               this.maxAlpha = alpha;
               this.life = Math.floor(Math.random()*self.pixelMaxLife-self.pixelMinLife+1)+self.pixelMinLife;
               this.offLife = Math.floor(Math.random()*self.pixelMaxOffLife-self.pixelMinOffLife+1)+self.pixelMinOffLife;
                this.isLit = lit;
               this.dying = false;
               this.deathFade = self.pixelDeathFade;
               this.bornFade = self.pixelBornFade;
            }
         };
      },
      
      randomAlpha: function () {
         
            var randStartAlpha = Math.floor(Math.random()*101);

         // Fully lit (1)
         if(randStartAlpha > 90) {
            return 1;
         }
         // Halt lit (0.5)
         else if(randStartAlpha > 80) {
            return 0.5;
         }
         else {
            return 0.1;
         }
      },

      renderLoop: function () {
         
         this.clearCanvas();
         this.renderPixels();

         window.requestAnimationFrame(function () { this.renderLoop(); }.bind(this));
      },
      
      renderPixels: function () {
         for(var i = 0; i < this.pixels.length; i++) {
            this.drawPixel(this.pixels[i]);
         }
      },
      
      drawPixel: function (pixel) {
         if(pixel.alpha < 0.1) { pixel.alpha = 0.1; }
         else if(pixel.alpha > pixel.maxAlpha) { pixel.alpha = pixel.maxAlpha; }
         
         this.c2d.fillStyle = 'rgba(0, 255, 0, ' + pixel.alpha + ')';
         this.c2d.fillRect(pixel.xPos, pixel.yPos, this.pixelSize, this.pixelSize);

         if(pixel.isLit) {

            if(pixel.bornFade <= 0) {

               // Update pixel attributes
               if(pixel.life <= 0) {
                  pixel.dying = true;

                  if(pixel.deathFade <= 0) {
                     pixel.randomizeSelf();
                  }
                  else {
                     var divisor = 1;
                     if(pixel.maxAlpha === 0.5 && pixel.alpha > 0.5) {
                        divisor = 2;
                     }
                     pixel.alpha = (pixel.deathFade / this.pixelDeathFade) / divisor;
                     pixel.deathFade--;
                  }
               }
               else {
                pixel.life--;
               }
            }
            else {
               pixel.alpha = pixel.maxAlpha - pixel.bornFade / this.pixelBornFade;
               pixel.bornFade--;
            }
         }
         else {
            if(pixel.offLife <= 0) { pixel.isLit = true; }
            pixel.offLife--;
         }
      },
      
      clearCanvas: function () {
         this.c2d.fillStyle = this.bgColor;
         this.c2d.fillRect(0, 0, this.canvasW, this.canvasH);
      }
   };
   
   // Init pixel grid animation
   pixelGrid.init();
   
});