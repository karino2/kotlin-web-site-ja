webpackJsonp([8],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var VideoGallery = __webpack_require__(40);
	var $ = __webpack_require__(2);
	
	$(document).ready(function () {
	  $.getJSON("/data/videos.json", function (videos) {
	    new VideoGallery(document.getElementById('video-gallery'), {
	      playerElem: document.getElementById('video-player'),
	      descriptionElem: document.getElementById('video-description'),
	      data: videos
	    });
	  });
	});

/***/ },

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(2);
	
	/**
	 * @param {HTMLElement|string} elem HTML node or node ID
	 * @param {object} config
	 * @returns {Player}
	 * @constructor
	 */
	function Player(elem, config) {
	  var that = this,
	    playerElem;
	
	  playerElem = document.createElement('div');
	  elem = (typeof elem === 'string') ? document.getElementById(elem) : elem;
	  elem.appendChild(playerElem);
	
	  that._elem = playerElem;
	
	  that._config = Player.getConfig(config);
	
	  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
	    $.getScript('https://www.youtube.com/iframe_api', function () {
	      if ('onYouTubeIframeAPIReady' in window) {
	        var prev = window.onYouTubeIframeAPIReady;
	        window.onYouTubeIframeAPIReady = function () {
	          prev();
	          that._createPlayer();
	        }
	      }
	      else {
	        window.onYouTubeIframeAPIReady = function () {
	          that._createPlayer();
	        };
	      }
	    });
	  } else {
	    that._createPlayer();
	  }
	
	  return that;
	}
	
	Player.EVENT = {
	  READY: 'ready',
	  PLAYING: 'play',
	  ENDED: 'end',
	  PAUSED: 'pause',
	  BUFFERING: 'buffering',
	  CUED: 'cued'
	};
	
	Player.THEME = {
	  DARK: 'dark',
	  LIGHT: 'light'
	};
	
	Player.QUALITY = {
	  DEFAULT: 'default',
	  SMALL: 'small',      // max 640х360
	  MEDIUM: 'medium',    // min 640x360
	  LARGE: 'large',      // min 854x80
	  HD720: 'hd720'       // min 1280x720
	};
	
	Player.VIDEO_ID_REGEXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	
	Player.VIDEO_EMBED_URL = '//www.youtube.com/embed/{video_id}';
	
	Player._defaults = {
	  width: 450,
	  height: 390,
	  videoId: null,
	  autoPlay: false,
	  autoHide: false,
	  showControls: true,
	  showInfo: true,
	  showRelativeVideos: false,
	  quality: Player.QUALITY.DEFAULT,
	  startTime: 0,
	  disableBranding: true,
	  inlinePlayback: false,
	  theme: Player.THEME.DARK
	};
	
	/**
	 * @static
	 * @param videoUrl
	 * @returns {string}
	 */
	Player.getVideoIdFromUrl = function (videoUrl) {
	  var videoId = null;
	  var match = videoUrl.match(Player.VIDEO_ID_REGEXP);
	
	  if (match !== null && typeof match[7] !== 'undefined') {
	    videoId = match[7];
	  }
	
	  return videoId;
	};
	
	/**
	 *  Creates Player config using defaults and merges them with another config (if specified).
	 *
	 * @param {object} config [optional]
	 * @returns {object}
	 */
	Player.getConfig = function (config) {
	  var config = config || {};
	  return $.extend({}, Player._defaults, config);
	};
	
	/**
	 * Create YouTube player config using Player config format.
	 *
	 * @param config
	 * @returns {object} Config object for native YouTube player
	 */
	Player.createConfigForYTPlayer = function (config) {
	  var config = config || Player.getConfig(config),
	    ytPlayerConfig;
	
	  ytPlayerConfig = {
	    width: config.width,
	    height: config.height,
	    videoId: config.videoId,
	    playerVars: {
	      vq: config.quality,
	      rel: config.showRelativeVideos ? 1 : 0,
	      autoplay: config.autoPlay ? 1 : 0,
	      controls: config.showControls ? 1 : 0,
	      showinfo: config.showInfo ? 1 : 0,
	      autohide: config.autoHide ? 1 : 0,
	      start: config.startTime,
	      modestbranding: config.disableBranding ? 1 : 0,
	      playsinline: config.inlinePlayback ? 1 : 0,
	      theme: config.theme
	    }
	  };
	
	  return ytPlayerConfig;
	};
	
	Player.prototype._elem = null;
	
	Player.prototype._config = null;
	
	Player.prototype._player = null;
	
	Player.prototype._events = {};
	
	Player.prototype.isReady = false;
	
	Player.prototype._createPlayer = function () {
	  var that = this,
	    elem = that._elem,
	    player;
	
	  player = new YT.Player(elem, Player.createConfigForYTPlayer(that._config));
	
	  player.addEventListener('onReady', function () {
	    that.isReady = true;
	    that.fireEvent(Player.EVENT.READY);
	  });
	
	  player.addEventListener('onStateChange', function (currentState) {
	    var events = that._events,
	      eventName = Player.EVENT;
	
	    switch (currentState.data) {
	      case YT.PlayerState.ENDED:
	        that.fireEvent(eventName.ENDED);
	        break;
	
	      case YT.PlayerState.PLAYING:
	        that.fireEvent(eventName.PLAYING);
	        break;
	
	      case YT.PlayerState.PAUSED:
	        that.fireEvent(eventName.PAUSED);
	        break;
	
	      case YT.PlayerState.BUFFERING:
	        that.fireEvent(eventName.BUFFERING);
	        break;
	
	      case YT.PlayerState.CUED:
	        that.fireEvent(eventName.CUED);
	        break;
	    }
	  });
	
	  that._player = player;
	};
	
	Player.prototype.fireEvent = function (eventName) {
	  if (eventName in this._events) {
	    return this._events[eventName].call(this);
	  }
	};
	
	Player.prototype.on = function (eventName, callback) {
	  this._events[eventName] = callback;
	};
	
	Player.prototype.play = function () {
	  this._player.playVideo();
	};
	
	Player.prototype.pause = function () {
	  this._player.pauseVideo();
	};
	
	Player.prototype.stop = function () {
	  this._player.stopVideo();
	};
	
	/**
	 * @param {string} quality Video quality
	 * @see Player.QUALITY
	 */
	Player.prototype.setQuality = function (quality) {
	  this._player.setPlaybackQuality(quality);
	};
	
	/**
	 * Loads video and starts playback.
	 *
	 * @param {string} videoId
	 */
	Player.prototype.loadVideo = function (videoId) {
	  this._player.cueVideoById(videoId);
	};
	
	/**
	 * Loads video thumbnail and prepare player for playback.
	 *
	 * @param {string} videoId
	 */
	Player.prototype.playVideo = function (videoId) {
	  var isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
	
	  if (isIOS) {
	    this.loadVideo(videoId);
	  } else {
	    this._player.loadVideoById(videoId);
	  }
	
	};
	
	module.exports = Player;

/***/ },

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(2);
	var NavTree = __webpack_require__(25);
	var Player = __webpack_require__(20);
	
	NavTree.prototype.templates.leafItem = function (item) {
	  var hasUrl = 'url' in item,
	    hasDuration = 'duration' in item,
	    hasDescription = 'description' in item,
	    isExternal = hasUrl && Player.getVideoIdFromUrl(item.url) === null,
	    itemClassNames,
	    itemLinkClassNames,
	    attrs = {};
	
	  itemClassNames = ['tree-item', 'tree-leaf', 'js-item', 'js-leaf', 'video-item'];
	  itemLinkClassNames = ['tree-item-title', 'tree-leaf-title', 'js-item-title', 'js-leaf-title', 'video-item-title'];
	
	  if (isExternal)
	    itemLinkClassNames.push('is_external');
	
	  if (hasUrl) {
	    attrs['href'] = item.url;
	  }
	
	  if (hasDescription) {
	    attrs['data-description'] = item.description;
	  }
	
	  var t =
	    ['.' + itemClassNames.join('.'),
	      [
	        (hasUrl ? 'a.' : 'div.') + itemLinkClassNames.join('.'), attrs,
	        ['span.marker'],
	        ['span.text', item.title],
	        hasDuration
	          ? ['span.duration', item.duration]
	          : null
	      ]
	    ];
	
	  return t;
	};
	
	function VideoGallery(elem, config) {
	
	  var tree = new NavTree(elem, {data: config.data});
	
	  var player = new Player(config.playerElem, {
	    width: '100%',
	    height: 480,
	    videoId: 'viiDaLpPfN4'
	  });
	
	  tree.on('selectLeaf', function (e, branch, elem) {
	    var videoUrl = elem.href,
	      videoId,
	      description = elem.getAttribute('data-description') || '',
	      $elem = $(elem);
	
	    videoId = Player.getVideoIdFromUrl(videoUrl);
	
	    if (videoId) {
	      player.playVideo(videoId);
	
	      config.descriptionElem.innerHTML = description;
	    }
	  });
	
	  $(elem).find('a').on('click', function (e) {
	    var $el = $(this);
	    var isExternal = $el.hasClass('is_external');
	
	    if (isExternal)
	      $el.attr('target', '_blank');
	    else
	      e.preventDefault();
	
	  });
	}
	
	module.exports = VideoGallery;

/***/ }

});
//# sourceMappingURL=videos.js.map