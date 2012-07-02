window.addEvent('domready', function(){
							
	var obj = new Swiff('lecteurAudio.swf', {
		id: 'lecteurAudio',
		width: 1,
		height: 1,
		params : {
			wMode : 'transparent'
		},
		container: $('swiffContainer'),
		callBacks: {
			load : console.log('Flash chargé !')
		}
	});
	
	new FitImage('img/background.jpg');
	
	// FONCTIONS
	//Affichage du titre de la piste
	var getTitre = function(){
		titre = songs[compteur];
		titreSansCar = titre.split('_'); // Supprimer les _
		titreAvecEsp = titreSansCar.join(' '); // Ajout des espaces a la place des _
		$$('#titre span.chanson').set('text', titreAvecEsp);
	}
	var setTitre = function(titre){
		titreSansCar = titre.split('_'); // Supprimer les _
		titreAvecEsp = titreSansCar.join(' '); // Ajout des espaces a la place des _
		$$('#titre span.chanson').set('text', titreAvecEsp);
	}
	//Affichage du background
	var changeBG = function(){
		
		
		var urlImgThumb = 'http://antoinelorcy.com/flash-ext/pochettes/'+titre+'_thumb.jpg';
		
		
		$$('#global #pochette img').setProperty('src',urlImgThumb); 
		
		$$('#global').addEvent('mouseover', function (){
			$(this).fade(1);
		});
		$$('#global').addEvent('mouseout', function (){
			$(this).fade(0.6);
		}); 
		
	}
	var changeBG2 = function(song){
		
		
		var urlImgThumb = 'http://antoinelorcy.com/flash-ext/pochettes/'+song+'_thumb.jpg';
		
		
		$$('#global #pochette img').setProperty('src',urlImgThumb); 
		
		$$('#global').addEvent('mouseover', function (){
			$(this).fade(1);
		});
		$$('#global').addEvent('mouseout', function (){
			$(this).fade(0.6);
		});
		
	}
	var changeBackground = function(playlist){
		var urlImg = 'http://antoinelorcy.com/flash-ext/pochettes/'+playlist+'.jpg';
		new FitImage(urlImg);
	}
	// fonction pour afficher le chrono, qui se rÃ©pÃ¨te chaque seconde
	var printTime = function() {
		var time = getTimeJS();
		var total = getTotalJS();
		if(time >= total) {
			var formatted = formatTime(total);
			$$('a.pause').set('class','lire');
			stopJS();
		}
		else var formatted = formatTime(time);
		$('timer').set('text', formatted);
	};	
	
	// fonction pour affiche le total de la chanson, qui se rÃ©pÃ¨te chaque seconde
	var printTotal = function() {
		var total = formatTime(getTotalJS());
		$('total').set('text', total);
	};
	
	// petite fonction pour formater l'affichage du temps
	var formatTime = function(old) {
		var minutes = Math.floor(old/60);
		var secondes = old - (minutes*60);
		if(secondes < 10) secondes = '0'+secondes;
		if(minutes < 10) minutes = '0'+minutes;
		return minutes + ' : ' + secondes;
	}
	
	// fonction qui change le volume en Flash
	// elle lui envoie en paramètre la position verticale du curseur, en %
	var setVolume = function() {
		var posX = $('volumeHandler').getPosition($('volume')).x;
		$('volume-remplissage').setStyle('width', $('volumeHandler').getPosition($('volume')).x+'px');
		posX += 0;
		// la position Y va de 0 à 162 px, donc on fait un petit produit en croix pour
		// avoir un pourcentage, et on fait (100 - ce produit) pour l'avoir à l'endroit
		posX = (100*posX/140);
		changeVolumeJS(posX);
	};
	
	var volumeHandler = new Drag($('volumeHandler'), {
		limit : {
		x : [0, 140],
		y : [0, 0]
		},
		onDrag : setVolume
	});
	
	// fonction appelÃ©e Ã  chaque seconde pendant la lecture pour faire avancer le curseur
	var move = function() {
		var i = 275 / getTotalJS();
		var left = $('handler').getStyle('left').toFloat();
		
		if(left < 275){
			$('handler').setStyle('left', left+i+'px');
			$('remplissage-gauche').setStyle('opacity', '1');
			$('remplissage').setStyle('width', left+'px');
		} 
		else {
			$('handler').setStyle('left', '0');
			$('remplissage-gauche').setStyle('opacity', '0');
			$('remplissage').setStyle('width', '0px');
			stopJS();
			clearInterval(timerMove);
			enLecture = false;
			$$('a.lire').set('class','lire');
		}
	};
	// fonctions pour rendre les curseurs dÃ©plaÃ§ables Ã  la souris
	var handler = new Drag.Move($('handler'), {
		container : $('bar'),
		droppables : $('bar'),
		onDrop : function(element, droppable, event) {
			posX = element.getPosition($('bar')).x;
			goToJS(posX);
			//var time = goToJS(posX);
			//$('timer').set('text', formatTime(time));
		}
	});
				
	
	// VARIABLES GLOBALES
	enLecture = false;
	songs = new Array('Video_Games', 'Born_to_Die', 'Blue_Jeans', 'Seventeen_Years', 'Loud_Pipes', 'Wildcat');
	compteur = 0;
	printTotal.periodical(500);
	timer = printTime.periodical(1000);
	timerMove = move.periodical(1000);
	clearInterval(timerMove);
	getTitre();
	handler.detach(); //Bloque le Drag par defaut
	// Valeurs par défaut des playlists
	$$('#global #about .playlist-ratatat').setStyle('display','none');
	$$('#global #about .playlist-lana_del_rey').setStyle('display','none');
	// Valeurs par défaut du player
	$$('#content-player').setStyle('display', 'none');
	
	//PLAYLISTS
	$$('#choix-playlist a').addEvent('click', function(ev) {
		ev.stop(); 
		
		choixPlaylist = $(this).get('id'); 
		
		console.log(choixPlaylist);
		choixPlaylistName = choixPlaylist.split('-'); //Pour séparer l'id et récupérer seulement le nom de l'artiste
		console.log(choixPlaylistName[1]);
		$$('#choix-playlist').setStyle('display', 'none');
		
		playlist = choixPlaylistName[1];
		$$('#global #about .playlist-'+playlist+'').setStyle('display', 'block'); // Pour afficher la playlist
		changeBackground(playlist); // Pour changer l'image de fond
		
		playlistSansCar = playlist.split('_'); // Supprimer les _
		playlistAvecEsp = playlistSansCar.join(' '); // Ajout des espaces a la place des _
		$$('#informations h1').set('text', playlistAvecEsp); // Pour changer le titre en haut de page	
		$$('#infos-piste #titre span.artiste').set('text', playlistAvecEsp); //Pour changer le nom d'artiste sur le player
		
		$$('#content-player').setStyle('display', 'block'); //Affichage du player
		
		
		console.log($$('#global .playlist-'+playlist+' li a').get('id'));
		
	});
	
	//VIDAGE DES ELEMENTS SI JS ACTIVE
	$$('a.lire').set('text', ' ');
	$$('a.stop').set('text', ' ');
	$$('a.prev').set('text', ' ');
	$$('a.next').set('text', ' ');
	
	
	// EVENEMENTS
	$$('#player').addEvent('mouseover', function (){
		$(this).fade(1);
	});
	$$('#player').addEvent('mouseout', function (){
		$(this).fade(0.9);
	});
	
	
	// --Evement Lecture
	$$('a.lire').addEvent('click', function(ev) {
		ev.stop(); 
		lireJS();
		getTitre();
		changeBG();
		if(!enLecture){
			handler.attach(); //Active le Drag
			$$('a.lire').set('class','pause');
			timer = printTime.periodical(1000);
			timerMove = move.periodical(1000);
		}else{
			handler.detach(); //Bloque le Drag
			$$('a.pause').set('class','lire');
			clearInterval(timer);
			clearInterval(timerMove);
		}
		enLecture = !enLecture;		
	});
	// --Evement Stop
	$$('a.stop').addEvent('click', function(ev) {
		ev.stop();
		$$('a.pause').set('class','lire');
		$('handler').setStyle('left', '0');
		$('remplissage-gauche').setStyle('opacity', '0');
		$('remplissage').setStyle('width', '0px');
		handler.detach(); //Bloque le Drag
		stopJS();
		timer = printTime.periodical(1000);
		clearInterval(timer);
		clearInterval(timerMove);
		enLecture = false;		
	});
	// --Evement Suivant
	$$('a.next').addEvent('click', function(ev) {
		ev.stop();
		
						
		$('handler').setStyle('left', '0');
		$('remplissage-gauche').setStyle('opacity', '0');
		$('remplissage').setStyle('width', '0px');
		timer = printTime.periodical(1000);
		clearInterval(timer);
		clearInterval(timerMove);
		timer = printTime.periodical(1000);
		timerMove = move.periodical(1000);
		handler.attach(); //Active le Drag
		$$('a.lire').set('class','pause');
		
		if(compteur>4){
			compteur = 0;
		}else{
			compteur = compteur + 1;
		}
		getTitre();
		changeBG();	
		nextJS();	
	});
	// --Evement Précédent
	$$('a.prev').addEvent('click', function(ev) {
		ev.stop();
		
		if(compteur<1){
			compteur = 0;
		}else{
			compteur = compteur - 1;
			prevJS();
		}
		getTitre();	
		changeBG();	
	});
	
	// --Evement Changement Piste 1
	$$('a.change').addEvent('click', function(ev) {
		ev.stop();
		
		var song = $(this).get('id');
		$$('a.change').set('class', 'change');
		$(this).addClass('active');
		console.log(song);
		
		clearInterval(timer);
		clearInterval(timerMove);
		lireJS();
		
		$('handler').setStyle('left', '0');
		$('remplissage-gauche').setStyle('opacity', '0');
		$('remplissage').setStyle('width', '0px');
		
		
		timer = printTime.periodical(1000);
		timerMove = move.periodical(1000);
		handler.attach(); //Active le Drag
		$$('a.lire').set('class','pause');
		
		
		
		
		
		
		changeSong(song);
		
		setTitre(song);
		changeBG2(song);
		
	
		
		
			
	});
		
	
});	


// --Fonction Lecture
var lireJS = function(){
	Swiff.remote($('lecteurAudio'), 'lectureJS');
}
// --Fonction Stop
var stopJS = function(){
	Swiff.remote($('lecteurAudio'), 'stopJS');
}
// --Fonction Suivant
var nextJS = function(){
	Swiff.remote($('lecteurAudio'), 'nextSongJS');
}
// --Fonction Suivant
var prevJS = function(){
	Swiff.remote($('lecteurAudio'), 'prevSongJS');
}
// --Fonction Change Piste
var changeSong = function(songname){
	Swiff.remote($('lecteurAudio'), 'changeSongJS', songname);
}
var changeVolumeJS = function (posX) {
	Swiff.remote($('lecteurAudio'), 'changeVolumeJS', posX);
};
var getTimeJS = function () {
	return Swiff.remote($('lecteurAudio'), 'getTimeJS');		
};		
var getTotalJS = function() {
	return Swiff.remote($('lecteurAudio'), 'getTotalJS');
};
var goToJS = function(posX) {
	Swiff.remote($('lecteurAudio'), 'goToJS', posX);
};