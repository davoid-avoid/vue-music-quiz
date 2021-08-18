window.onload = function () {

	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	}

	var position = 0;

	shuffleArray(songList);
	getSong();

	function updateSong(){
		currentSample = new Howl({
		  src: [songUrl],
		  onend: function() {
		    app.musicToPlay = true;
		  }
		});
	}

	function getSong(){
		currentSong = songList[position];
		shuffleArray(currentSong.options);
		songUrl = 'goodstuff/' + currentSong.songFile + '.mp3';
	}

	function nextSong(){
		currentSample.stop();
		position++;
		getSong();
		app.song = currentSong;
		app.musicToPlay = false;
		app.lyricshint = false;
		app.fiftyhint = false;
		app.showingmessage = false;
		setTimeout(function(){
			updateSong();
			currentSample.play();
		}, 400);
	}

	Vue.component('decor', {
	  template: '<div id="decor-backing" class="backing-up"><div class="decor-soundhole"></div><div id="decor-stringholder"><div class="decor-string" style="top: 0%; position: absolute"></div><div class="decor-string" style="top: 20%; position: absolute"></div><div class="decor-string" style="top: 40%; position: absolute"></div><div class="decor-string" style="top: 60%; position: absolute"></div><div class="decor-string" style="top: 80%; position: absolute"></div><div class="decor-string" style="top: 100%; position: absolute"></div></div></div>'
	})

	Vue.component('start-menu', {
		template: '<div id="main-menu"><div id="game-menu-back2"></div><div id="game-menu-back1"></div><div id="game-menu"><div id="unrotater"><p class="game-title">♫ ♪<br><br>music quiz</p><p class="game-subtitle">I am learning vue!</p><br><br><div id="game-start" v-on:click="start">PLAY</div></div></div></div>'
	})

	Vue.component('start-notes', {
		template: '<div id="music-notes-start"><span class="note1 noteStart">♫</span><span class="note2 noteStart">♪</span><span class="note3 noteStart">♫</span><span class="note4 noteStart">♪</span></div>'
	})

	Vue.component('lives', {
		template: '<div id="lives" class="hide"><span class="lives-title">chances</span><br><span v-for="life in lives"> ♪ </span></div>',
	})

	var app = new Vue({
		el: "#game-area",
		methods: {
			start: function (event){
				document.getElementById("decor-backing").classList.remove('backing-up');
				document.getElementById("main-menu").classList.add('menu-down');
				document.getElementById("music-notes-start").classList.add('hide');
				document.getElementById("ingame-left-holder").classList.remove('left-push');
				setTimeout(function(){
					document.getElementById("lives").classList.remove('hide');
					document.getElementById("score").classList.remove('hide');
					document.getElementById("play-sample").classList.remove('hide')
				}, 600);
				this.musicToPlay = false;
				setTimeout(function(){
					updateSong();
					currentSample.play();
				}, 1000);
;
			},
			play: function (){
				currentSample.play();
				this.musicToPlay = false;
			},
			submit: function (selection){
				currentSample.stop();
				if (selection === this.song.answer){
					this.score++;
					this.notifymessage = "Correct!";
					this.showingmessage = true;
					if (this.score >= 2){
						this.canskip = true;
					}
				} else {
					this.lives--;
					if (this.lives == 0){
						this.gameover = true;
					}
					this.notifymessage = "Incorrect";
					this.showingmessage = true;
				}
			},
			nextStep: function(){
				if (position != songList.length - 1){
					showingmessage = false;
					nextSong();
				} else {
					this.allsongs = true;
				}
			},
			showlyrics: function(){
				this.lyricsavailable = false;
				this.lyricshint = true;
				if (this.fiftyavailable ==  false){
					this.anyhint = false;
				}
			},
			fiftyclue: function(){
				shuffleArray(currentSong.half)
				this.fiftyavailable = false;
				this.fiftyhint = true;
				if (this.lyricsavailable == false){
					this.anyhint = false;
				}
			},
			skipsong: function(){
				currentSample.stop();
				this.score -= 2;
				this.notifymessage = "Skipping (-2 points)";
				this.showingmessage = true;
				if (this.score >= 2){
					this.canskip = true;
				} else {
					this.canskip = false;
				}
			},
			startOver: function(){
				position = 0;
				this.lives = 3;
				this.score = 0;
				this.gameover = false;
				this.allsongs = false;
				this.lyricsavailable = true;
				this.fiftyavailable = true;
				this.anyhint = true;
				this.canskip = false;
				shuffleArray(songList);
				getSong();
				showingmessage = false;
				nextSong();
			}
		},
		data: {
			song: currentSong,
			lives: 3,
			score: 0,
			notifymessage: "Correct!",
			showingmessage: false, 
			musicToPlay: true,
			lyricshint: false,
			lyricsavailable: true,
			fiftyhint: false,
			fiftyavailable: true,
			gameover: false,
			allsongs: false,
			anyhint: true,
			canskip: false
		}
	})

}