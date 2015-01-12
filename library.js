( function ( ) {
	'use strict';

	var async = module.parent.require('async'),
	nconf = module.parent.require('nconf'),
	parser, plugin = {
		init: function ( params, callback ) {
			var codes = [ ];
			
			codes.push({
				regexp: /\[За\]/gi,
				content: '<div class="bbvote-case za" align="center"><span style="font-size:12pt;">ЗА</span></div>'
			});

			codes.push({
				regexp: /\[Против\]/gi,
				content: '<div class="bbvote-case protiv" align="center">ПРОТИВ</div>'
			});

			codes.push({
				regexp: /\[Одобрено\]/gi,
				content: '<div align="center"><img class="emoji emoji-fix" src="http://n.com/plugins/nodebb-plugin-emoji/images/wink.png" border="0" alt="Кандидат одобрен"><br /></div>'
			});

			codes.push({
				regexp: /\[Одобрено:(\d+):(\d+)\]/gi,
				content: '<div align="center"><img class="emoji emoji-fix" src="http://ya.1nga.ru/int/accepted.png" border="0" alt="Кандидат одобрен"><br /><span style="color:#008800">$1 За</span> / <span style="color:#dd0000">$2 Против</span></div>'
			});

			codes.push({
				regexp: /\[Отказано\]/gi,
				content: '<div align="center"><img class="emoji emoji-fix" src="http://ya.1nga.ru/int/declined.png" border="0" alt="Кандидату отказано"><br /></div>'
			});

			codes.push({
				regexp: /\[Отказано:(\d+):(\d+)\]/gi,
				content: '<div align="center"><img class="emoji emoji-fix" src="http://ya.1nga.ru/int/declined.png" border="0" alt="Кандидату отказано"><br /><span style="color:#008800">$1 За</span> / <span style="color:#dd0000">$2 Против</span></div>'
			});

			codes.push({
				regexp: /\[Проверка\](.*)\[\/Проверка\]/gi,
				content: '<div class="bbvote-case proverka" align="center">ПРОВЕРКА<br><span class="bbvote-normalize">$1</span><br><a href="ts3server://Knights.pro" target="_blank" class="bbtslink">Knights.pro</a></div>'
			});

			codes.push({
				regexp: /\[red\](.*)\[\/red\]/gi,
				content: '<span class="mega-bbparser-colored-red">$1</span> '
			});

			codes.push({
				regexp: /-&gt;(.*)&lt;-/gi,
				content: '<p class="text-center">$1</p>'
			});	

			codes.push({
				regexp: /-&gt;(.*)-&gt;/gi,
				content: '<p class="text-right">$1</p>'
			});	

			parser = function ( data, callback ) {
				var iterator = function ( code, callback ) {
					data = data.replace( code.regexp, code.content );
					callback( null );
				};

				async.eachSeries( codes, iterator, function ( err ) {
					callback( err, data );
				});
			};

			callback( null );
		},
		parsePost: function ( data, callback ) {
			if ( data && data.postData && data.postData.content ) {
				parser( data.postData.content, function ( err, content ) {
					data.postData.content = content;
					callback( err, data );
				});
			} else {
				callback( null, data );
			}
		},
		parseSignature: function ( data, callback ) {
			if ( data && data.userData && data.userData.signature ) {
				parser( data.userData.signature, function ( err, content ) {
					data.userData.signature = content;
					callback( err, data );
				});
			} else {
				callback( null, data );
			}
		},
		parseRaw: function ( raw, callback ) {
			if ( raw ) {
				parser( raw, function ( err, raw ) {
					callback( err, raw );
				});
			} else {
				callback( null, raw );
			}
		}
	};

	module.exports = plugin;

})( );