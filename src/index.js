exports.json_parse = function() {
	var at, // 当前索引
		ch,	// 当前字符
		text, //整个文本
		error = function(m) {		// 出错
			throw {
				name: 'Syntax error',
				message: m,
				at: at,
				text: text
			};
		},
		next = function (c) {		//读入下一个字符
			if (c && c != ch) {
				error("Excepted '" + c + "' instead of '" + ch + "'");
			}
			ch = text.charAt(at);
			at += 1;
			return ch;
		},
		number = function () {		//读入一个数字
			var number, string = '';
			if (ch === '-') {
				string = '-';
				next('-');
			}
			while (ch >= '0' && ch <= '9') {
				string += ch;
				next();
			}
			if (ch === '.') {
				string += '.';
				while (next() && ch >= '0' && ch <= '9') {
					string += ch;
				}
			}
			number = +string;
			if (isNaN(number)) {
				error("Bad number");
			} else {
				return number;
			}
		},
		string = function() {
			var string = '';
			if (ch === '"') {
				while (next()) {
					if (ch === '"'){
						next();
						return string;
					} else {
						string += ch;
					}
				}
			} 
			error("Bad string");
		},
		white = function() {
			while (ch && ch <= ' ') {
				next();
			}
		},
		word = function() {
			switch(ch) {
				case 't':
					next('t');
					next('r');
					next('u');
					next('e');
					return true;
					break;
				case 'f':
					next('f');
					next('a');
					next('l');
					next('s');
					next('e');
					return false;
					break;
				case 'n':
					next('n');
					next('u');
					next('l');
					next('l');
					return null;
			}
			error("unexpected '" + ch + "'");
		}, 
		value,
		array = function() {		
			var array = [];
			if (ch === '[') {
				next('[');
				white();
				if (ch === ']') {
					next(']');
					return array;
				}
				while (ch) {
					array.push(value());
					white();
					if (ch === ']') {
						next(']');
						return array;
					}
					next(',');
					white();
				}
			}
			error("Bad array");
		},
		object = function() {
			var key, object = {};

			if (ch === '{') {
				next('{');
				white();
				if (ch === '}') {
					next('}');
					return object;
				}
				while (ch) {
					key = string();
					white();
					next(':');
					object[key] = value();
					white();
					if (ch === '}') {
						next('}');
						return object;
					}
					next(',');
					white();
				}
			}
			error("Bad object");
		}, 
		value = function() {
			white();
			switch(ch) {
				case '{':
					return object();
					break;
				case '[':
					return array();
					break;
				case '"':
					return string();
				case '-':
					return number();
				default:
				return ch >= '0' && ch <= '9' ? number() : word;
			}
		};
		return function (source) {
			var result;

			text = source;
			at = 0;
			ch = ' ';
			result = value();
			white();
			if (ch) {
				error("Syntax error");
			}
			return result;
		}
}();
