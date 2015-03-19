$(function(){
	"use strict";

	function calculate()
	{
		function isContainsLowerCaseLetters(value) {
			return (/[a-z]/).test(value);
		}

		function isContainsUpperCaseLettes(value) {
			return (/[A-Z]/).test(value);
		}

		function isContainsSpaces (value) {
			return (/ /).test(value);
		}

		function isContainsNumbers (value) {
			return (/[0-9]/).test(value);
		}

		function isContainsSpecialSymbols (value) {
			var contains = false,
			symbols = "-!§$%&/()=?.:,~;'#+-/*\\|{}[]_<>\"".split("");

			$.each(symbols, function(index, symbol){
				if (value.indexOf(symbol)) {
					contains = true;

					// We found a character. Return false is needed for exit from loop
					return false;
				};
			})

			return contains;
		}

		function countOfSpaces (value) {
			return value.split(/ +/).length - 1;
		}

		return {
			estimate: function(value, points){
				var score = value.length * points.forEachCharacter;

				if (isContainsSpaces(value)) { score += countOfSpaces(value) * points.forEachSpace; }
				if (isContainsLowerCaseLetters(value)) { score += points.containsLowerCaseLetter;  }
				if (isContainsUpperCaseLettes(value)) { score += points.containsUpperCaseLetter; }
				if (isContainsNumbers(value)) {score += points.containsNumber; }
				if (isContainsSpecialSymbols(value)) { score += points.containsSpecialSymbols};

				return score;
			}
		};
	}

	function Indicate (indicator, settings) {
		var $indicator = $(indicator).hide();

		function getSecurityClass (score) {
			var index = parseInt(Math.round(score * (settings.secureClassNames.length - 1) * 100 / settings.secureStrenght) / 100, 10);

			if (index >= settings.secureClassNames.length) {
				index = settings.secureClassNames.length -1;
			}

			return settings.secureClassNames[index];
		}

		return {
			refresh: function(score){
				if (score > 0) {
					$indicator.css("display", settings.indicatorDisplayType);
				} else {
					$indicator.hide();
				}

				var secureClass = getSecurityClass(score);
				$.each(settings.secureClassNames, function (index, value){
					$indicator.removeClass(value.name);
				});

				$indicator.addClass(secureClass.name);

				if (settings.text) {
					$indicator.text(secureClass.text);
				}
			}
		};
	}

	var calculator,
	defaults = {
		secureStrenght : 25,

		$indicator: undefined,
		indicatorClassName: "password-secure-indicator",
		indicatorDisplayType: "inline-block",

		text: true,
		points: {
			forEachCharacter: 1,
			forEachSpace: 1,
			containsLowerCaseLetter: 2,
			containsUpperCaseLetter:2,
			containsNumber: 4,
			containsSpecialSymbols :5
		},

		secureClassNames :[{
				name: "very-weak",
                text: "very weak"
            }, {
                name: "weak",
                text: "weak"
            }, {
                name: "mediocre",
                text: "mediocre"
            }, {
                name: "strong",
                text: "strong"
            }, {
                name: "very-strong",
                text: "very strong"
        }]
	},

	methods = {
		init: function (options){
			var settings = $.extend({}, defaults, options),
			$input = $(this),
			$indicator = getIndicatorElement($input, settings),
			indicator = new Indicate($indicator, settings);

			setupAutomaticIndicatorRefresh(indicator, $input, settings);

			return $input;
		},

		calculate: function(value, options){
			var settings = $.extend(defaults, options);

			if (!calculator) {
				calculator = new calculate();
			}

			return calculator.estimate(value, settings.points);
		},

		defaults: function(){
			return defaults;
		}
	};

	function getIndicatorElement ($input, settings) {
		var $indicator = settings.$indicator || $("<span> </span>").insertAfter($input);

		return $indicator.attr("class", settings.indicatorClassName);
	}

	function setupAutomaticIndicatorRefresh (indicator, $input, settings) {
		var refresh = function(){
			var password = $input.val(),
				score = methods.calculate(password, settings);

			indicator.refresh(score);
		};

		$input.on("keyup", refresh);
	}

	$.fn.passwordComplexity = $.fn.passwordComplexity = function(method){
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}

		if (typeof method == "object" || !method) {
			return methods.init.apply(this, arguments);
		}

		$.error("Method "+ method + "does not exist on JQuery.passwordComplexity");
	};
});