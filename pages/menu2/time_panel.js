class TimerPanel {
    constructor({props = props, x = x, y = y}) {
        this.startTime = 0;
        this.posX = x;
        this.posY = y;
        this.elapsedTime = 0;
        this.isPlaying = props.isPlaying;
    }

    display(props){
        this.isPlaying = props.isPlaying;

        // Jika timer sedang berjalan, hitung waktu yang berlalu
        if (this.isPlaying) {
            this.elapsedTime = millis() - this.startTime;
        }

         // Hitung jam, menit, detik, dan milidetik
         let hours = Math.floor(this.elapsedTime / (1000 * 60 * 60));
         let minutes = Math.floor((this.elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((this.elapsedTime % (1000 * 60)) / 1000);
         let milliseconds = this.elapsedTime % 1000;
 
         // Format menjadi dua digit jika dibawah 10
         hours = nf(hours, 2);
         minutes = nf(minutes, 2);
         seconds = nf(seconds, 2);
         milliseconds = nf(milliseconds, 3, 0).replace(".", "");
 
         fill(0);
         textSize(20);
         text(`Waktu: ${hours}:${minutes}:${seconds}:${milliseconds}`, this.posX, this.posY);
         textSize(12);
    }

    start() {
        if (!this.isPlaying) {
          this.startTime = millis() - this.elapsedTime; // Mulai dari waktu yang tersimpan
        }
      }
    
    pause() {
        if (this.isPlaying) {
            this.elapsedTime = millis() - this.startTime; // Simpan waktu yang berlalu
        }                   
    }

    reset() {
        this.startTime = 0; // Atur ulang waktu mulai ke 0
        this.elapsedTime = 0; // Atur ulang waktu yang berlalu ke 0
    }
}