

const container=document.querySelector('.container');
const nameSong= document.querySelector('header h2')
const cdthumb= document.querySelector('.cd-thumb')
const btnPlay=document.querySelector('.btn-toggle-play');
const audioPlay= document.querySelector('#audio');
const progress=document.querySelector('.progress')
const btnNext= document.querySelector('.btn-next');
const btnPrev= document.querySelector('.btn-prev');
const btnRandom= document.querySelector('.btn-random');
const btnRepeat= document.querySelector('.btn-repeat');
const playlist= document.querySelector('.playlist');
const PLAYER__STORAGE_KEY='music_player';


const app = {
    currentIndex :0,
    isplay: false,
    israndom: false,
    config: JSON.parse(localStorage.getItem(PLAYER__STORAGE_KEY))|| {} ,
    isrepeat: false,
    setConfig: function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER__STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'FlyAway',
            singer: 'TheFatRat',
            path: './assets/audio/FlyAway.mp3',
            image: './assets/img/thefatrat.jpg'
        },
        {
            name: 'Lemon tree',
            singer: 'Fools Garden',
            path: './assets/audio/Lemon.mp3',
            image: './assets/img/Fools-Garden.jpg'
        },
        {
            name: 'Monody',
            singer: 'TheFatRat',
            path: './assets/audio/Monody.mp3',
            image: './assets/img/thefatrat.jpg'
        },
        {
            name: 'Monster',
            singer: 'Katie Sky',
            path: './assets/audio/Monster.mp3',
            image: './assets/img/thefatrat.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/audio/Nevada.mp3',
            image: './assets/img/vicetone.jpg'
        },
        {
            name: 'Never Be Alone',
            singer: 'TheFatRat',
            path: './assets/audio/NeverBeAlone.mp3',
            image: './assets/img/thefatrat.jpg'
        },
        {
            name: 'Rise Up',
            singer: 'TheFatRat',
            path: './assets/audio/RiseUp.mp3',
            image: './assets/img/thefatrat.jpg'
        },
        {
            name: 'Stay',
            singer: 'TheKidLaRoi',
            path: './assets/audio/Stay.mp3',
            image: './assets/img/thekidlaroi.jfif'
        }
        
    ],
    loadConfig: function(){
        this.israndom=this.config.israndom;
        this.isrepeat=this.config.isrepeat;
    },
    loadCurrentSong: function(){
        nameSong.innerText=this.songs[this.currentIndex].name;
        cdthumb.style.backgroundImage = `url('${this.songs[this.currentIndex].image}')`;
        audioPlay.src= this.songs[this.currentIndex].path;
        
    },
    
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handelEvents: function(){
        const _this=this;
        const cd=document.querySelector('.cd');
        const cdWidth=cd.offsetWidth;
        const cdthumbAnimate =cdthumb.animate([
            { transform:' rotate(360deg)'}
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdthumbAnimate.pause();
        document.onscroll= function(){
            const scrollTop=window.scrollY|| document.documentElement.scrollTop;
            const NewCdWidth=cdWidth-scrollTop;
            
            cd.style.width=NewCdWidth<0?0:cdWidth-scrollTop+'px';
            cd.style.opacity=NewCdWidth/cdWidth ;
        }
         // click btn play
        btnPlay.onclick= function(){
            if(_this.isplay){
                
                audioPlay.pause();
                cdthumbAnimate.pause();
            }
            else{
                cdthumbAnimate.play();
                audioPlay.play();
            }
        }
        // khi play song
        audioPlay.onplay= function(){
            _this.isplay=true;
            container.classList.add('playing')
           
        }
        // khi pause song
        audioPlay.onpause= function(){
            _this.isplay=false;
            container.classList.remove('playing')
        }
        // xu ly progress value khi thoi gian bai hat chay
        audioPlay.ontimeupdate= function(){
            if(audioPlay.duration){
                progress.value=audioPlay.currentTime*100/audioPlay.duration;
            }
        }
        
        // khi thay ddoi gia tri progress
        progress.onchange =function(e){

            const progressPercent = progress.value;
            audioPlay.currentTime=e.target.value/100 * audioPlay.duration;
        }

        ;
        btnNext.onclick = function(){
            
            if(_this.israndom){
                _this.randomSong();
                audioPlay.play();
            }
            else{
                _this.nextSong();
                audioPlay.play();
            }
            _this.render();
            _this.scrrollToActiveSong();
        }
        btnPrev.onclick = function(){
            if(_this.israndom){
                _this.randomSong();
                audioPlay.play();
            }
            else{
                _this.prevSong();
                audioPlay.play();
            }
            _this.render();
            _this.scrrollToActiveSong();

        }
       
        btnRandom.onclick=function(){
            _this.israndom =!_this.israndom;
            _this.setConfig('israndom',_this.israndom)
            btnRandom.classList.toggle('active',_this.israndom) 
             
        }
        btnRepeat.onclick=function(){
            _this.isrepeat =!_this.isrepeat;
            _this.setConfig('isrepeat',_this.isrepeat)
            
            btnRepeat.classList.toggle('active',_this.isrepeat)   
        }
        // khi het bai hat
        audioPlay.onended=function(){
            if(_this.isrepeat){
                audioPlay.play();
            }
            else{
                btnNext.click();
            }
        }
        playlist.onclick=function(e){
            const songNode=e.target.closest('.song:not(.active)');
            if(songNode|| e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex=Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audioPlay.play();
                    _this.render();
                }
            }
        }
    },
    scrrollToActiveSong: function(){
        setTimeout(()=>{
            document.querySelector('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: (this.currentIndex<3?'center':'nearest')
            })
        },300)
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length)
        {
            this.currentIndex=0;
            
        }
        this.loadCurrentSong();
        
    },
    
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex <0 )
        {
            this.currentIndex=this.songs.length-1;
            
        }
        this.loadCurrentSong();
        
    },
    randomSong: function(){
        let newIndex;
        do{
            newIndex=Math.floor(Math.random() * Number(this.songs.length) )
        }while(newIndex===this.currentIndex);
        this.currentIndex=newIndex;
        this.loadCurrentSong();
    },
    repeatSong: function(){
        if(this.isrepeat){
            this.isrepeat=false;
            btnRepeat.classList.remove('active');
        }
        else{
            this.isrepeat=true;
            btnRepeat.classList.add('active');
        }
    },
    render: function(){
        _this=this;
        var html=app.songs.map(function(song, index){
            return`
            <div class="song ${index===_this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        document.querySelector('.playlist').innerHTML=html.join('');

    },
    start: function(){
        this.loadConfig();
        this.defineProperties();

        // cac hang dong su kien
        this.handelEvents();
        
        // tai bai hat hien tai len view
        this.loadCurrentSong();
        // render song ra html
        this.render();
        btnRandom.classList.toggle('active',_this.israndom) 

        btnRepeat.classList.toggle('active',_this.isrepeat)  
    },
}

app.start();
