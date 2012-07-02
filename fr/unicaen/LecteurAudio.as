﻿/** *	Classe LecteurAudio *	Package fr.unicaen */package fr.unicaen{	import flash.display.MovieClip;	import flash.media.Sound;	import flash.media.SoundLoaderContext;	import flash.media.SoundTransform;	import flash.media.SoundChannel;	import flash.media.SoundMixer;	import flash.net.URLRequest;	import flash.net.URLLoader;	import flash.net.URLLoaderDataFormat;	import flash.events.Event;	import flash.events.ProgressEvent;	import flash.events.MouseEvent;	import flash.text.TextField;	import flash.external.*;	import flash.external.ExternalInterface;	import flash.utils.Timer;	import flash.events.TimerEvent;	import flashx.textLayout.formats.Float;	public class LecteurAudio extends MovieClip	{		/**		 * Déclaration des propriétés globales		 */		var son:Sound = new Sound;		var canal:SoundChannel;		var position:int = 0;		var enLecture:Boolean = false;		var muted:Boolean = false;		var monTimer:Timer = new Timer(1000);		var secs:int = 0;		var songs:Array = ['Video_Games', 'Born_to_Die', 'Blue_Jeans', 'Seventeen_Years', 'Loud_Pipes', 'Wildcat'];		var i:Number = 0;						// __ constructeur		public function LecteurAudio()		{																	init();		}				/**		 *	méthodes utilisées par la classe		 */		private function init():void		{						if(ExternalInterface.available)			{				ExternalInterface.addCallback("lectureJS", lecture);				ExternalInterface.addCallback("getTimeJS", getTime);				ExternalInterface.addCallback("getTotalJS", getTotal);				ExternalInterface.addCallback("stopJS", arret);				ExternalInterface.addCallback("changeSongJS", changeSong);				ExternalInterface.addCallback("goToJS", goTo);				ExternalInterface.addCallback("changeVolumeJS", changeVolume);				ExternalInterface.addCallback("muteJS", mute);				ExternalInterface.addCallback("nextSongJS", nextSong);				ExternalInterface.addCallback("prevSongJS", prevSong);				//var firstSong:String = this.loaderInfo.parameters.firstSong;				//son.load(new URLRequest("http://antoinelorcy.com/flash-ext/sons/"+ songs[i] + ".mp3"));								//son.addEventListener(ProgressEvent.PROGRESS, onChargement);				monTimer.addEventListener(TimerEvent.TIMER, onTimerEcouteur);					//ExternalInterface.addCallback("getTimeJS", getTime);															var chargeurXML = new URLLoader();				chargeurXML.load(new URLRequest('listeSons.xml'));				chargeurXML.dataFormat = URLLoaderDataFormat.TEXT;				chargeurXML.addEventListener(Event.COMPLETE, processXML);															}			trace("initialisation OK");		}				private function processXML(evt:Event):void		{			var playlistXML:XML = new XML(evt.currentTarget.data);			var songsSrc:XMLList =playlistXML..fichier;			trace(songsSrc);			son.load(new URLRequest("http://antoinelorcy.com/flash-ext/sons/"+ songsSrc[i] + ".mp3"));		} 		public function lecture():void		{			if(!enLecture)			{				monTimer.start();					canal = son.play(position);			}			else 			{								position = canal.position;				canal.stop();				monTimer.stop();			}			enLecture = !enLecture;					}		public function getTime():int		{			return secs;			//return monTimer.currentCount;		}		public function getTotal():int {			return son.length/1000;		}		public function arret():void {									canal.stop();			position = 0;			monTimer.reset();			secs = 0;			enLecture = false;					}		public function onTimerEcouteur(evt:Event):void		{			secs++;		} 		public function changeSong(song:String):void {										if(enLecture) {				arret();							}			position = 0;			monTimer.reset();			secs = 0;			son = new Sound;			son.load(new URLRequest("http://antoinelorcy.com/flash-ext/sons/"+song+".mp3"));			lecture();		}		public function goTo(posX:Number):void {			canal.stop();			var time = (son.length / 275) * posX;						canal = son.play(time);			secs = time / 1000;		}		public function changeVolume(posX:int):void {			var transform:SoundTransform = canal.soundTransform;			transform.volume = posX/100;			trace(posX);			canal.soundTransform = transform;		}		public function mute():void {			if(canal) {				var transform:SoundTransform = canal.soundTransform;				if(muted) {					transform.volume = 1;				}				else {					transform.volume = 0;				}				canal.soundTransform = transform;				muted = !muted;			}		}		public function prevSong():Number {			if(enLecture) arret();			position = 0;			monTimer.reset();			secs = 0;			son = new Sound;			i--;			if(i == -1) i = 2;			son.load(new URLRequest("http://antoinelorcy.com/flash-ext/sons/"+songs[i]+".mp3"));			lecture();			return i;		}		public function nextSong():Number {			if(enLecture) arret();			position = 0;			monTimer.reset();			secs = 0;			son = new Sound;						i++;			if(i == 3) i = 0;			son.load(new URLRequest("http://antoinelorcy.com/flash-ext/sons/"+songs[i]+".mp3"));			lecture();			return i;		}		}}